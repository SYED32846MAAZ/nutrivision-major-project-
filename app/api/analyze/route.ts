import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "../../lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json({ error: "No image uploaded" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Uploaded file must be an image" }, { status: 400 });
    }

    if (file.size > 4 * 1024 * 1024) {
      return NextResponse.json({ error: "Image size must be less than 4MB" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");

    // Fetch user biometrics if authenticated
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    let userContextBlock = "";

    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (user && user.age && user.weight && user.height) {
        userContextBlock = `\n\n--- BIOMETRIC PROFILE ---\nAge: ${user.age} years\nWeight: ${user.weight} kg\nHeight: ${user.height} cm\nGender: ${user.gender || 'Not specified'}\nNote: You MUST analyze the risks specifically for a person with exactly this profile.\n-------------------------\n\n`;
      }
    }

    const prompt = `Perform a high-precision nutritional audit of this image.
STRICT INSTRUCTIONS:
1. Format your response exactly as follows (Use exact keys for parsing):
FOOD_NAME: [short name of meal]
CALORIES: [number]
PROTEIN: [number]
CARBS: [number]
FATS: [number]
HEALTH_SCORE: [number between 1-10]
MODIFIED_FORMULA: [one specific tip to make meal healthier, 10 words max]
METABOLIC_WINDOW: [best time to eat this, 5 words max]

2. Provide a "EXECUTIVE SUMMARY" section:
- Maximum 3 short, punchy bullet points.
- No conversational filler or introductory sentences.

3. Provide a "METABOLIC IMPACT" section (Based on Biometrics if provided):
- Identify exactly 2 high-level risks or benefits.
${userContextBlock ? 
`- Use the provided Biometric Profile: Age ${userContextBlock.match(/Age: (\d+)/)?.[1]}, Weight ${userContextBlock.match(/Weight: (\d+)/)?.[1]}kg.` : ""}

Keep the entire response under 150 words. Focus on precision and data.`;

    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    let resultText = "";
    let retries = 3;
    let delay = 2000;

    while (retries > 0) {
      try {
        const response = await model.generateContent([
          {
            inlineData: {
              mimeType: file.type,
              data: base64,
            },
          },
          { text: prompt },
        ]);
        resultText = response.response.text();
        break; // Success
      } catch (apiError: any) {
        const errorMsg = apiError.message || "";
        const isRetryable = errorMsg.includes("503") || errorMsg.includes("demand") || errorMsg.includes("overloaded");
        
        if (isRetryable && retries > 1) {
          retries--;
          console.log(`Neural Core busy. Retrying in ${delay}ms... (${retries} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2;
          continue;
        }

        console.error("SDK Error:", apiError);
        if (errorMsg.includes("expired") || errorMsg.includes("API_KEY_INVALID")) {
          throw new Error("Neural Core Authentication Failed: The API key is expired or invalid.");
        }
        if (errorMsg.includes("quota") || errorMsg.includes("429")) {
          throw new Error("Neural Core Capacity Reached: Monthly quota exceeded.");
        }
        throw new Error(`AI Engine Error: ${apiError.message}`);
      }
    }

    if (!resultText) {
      throw new Error("Neural Core returned an empty response. Intelligence sweep failed.");
    }

    const finalResult = resultText.trim();

    // Save strictly to DB if authenticated history
    if (userId) {
      await prisma.analysis.create({
        data: {
          userId,
          resultText: finalResult,
        },
      });
    }

    return NextResponse.json({
      result: finalResult,
    });

  } catch (error: any) {
    console.error("ERROR:", error);
    
    const isHighDemand = error.message.includes("experiencing high demand");
    
    return NextResponse.json(
      { error: isHighDemand ? error.message : "Something went wrong with the API: " + error.message },
      { status: isHighDemand ? 503 : 500 }
    );
  }
}