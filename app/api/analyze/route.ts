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
    let retries = 2; // Reduced from 3
    let delay = 1000; // Reduced from 2000

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
          delay *= 1.5; // Less aggressive backoff
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
    
    const isHighDemand = error.message.includes("experiencing high demand") || error.message.includes("quota") || error.message.includes("429");
    
    if (isHighDemand) {
      const fallbacks = [
        {
          name: "Gourmet Steak & Veggies",
          cal: 650, prot: 45, carb: 25, fat: 35, score: 8,
          formula: "Swap steak for grilled salmon to increase Omega-3s.",
          window: "Post-Resistance Training (1-2h)"
        },
        {
          name: "Quinoa Power Bowl",
          cal: 450, prot: 18, carb: 65, fat: 12, score: 9,
          formula: "Add hemp seeds for a complete amino acid profile.",
          window: "Pre-Endurance Session (2-3h)"
        },
        {
          name: "Avocado & Egg Toast",
          cal: 380, prot: 15, carb: 30, fat: 22, score: 7,
          formula: "Use sourdough for better probiotic absorption.",
          window: "Morning Metabolic Start"
        },
        {
          name: "Grilled Salmon Matrix",
          cal: 520, prot: 38, carb: 10, fat: 28, score: 10,
          formula: "Squeeze fresh lemon to maximize iron absorption.",
          window: "Anytime Bio-Optimization"
        }
      ];
      
      const pick = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      
      return NextResponse.json({
        result: `DEMO_MODE: TRUE
FOOD_NAME: ${pick.name}
CALORIES: ${pick.cal}
PROTEIN: ${pick.prot}
CARBS: ${pick.carb}
FATS: ${pick.fat}
HEALTH_SCORE: ${pick.score}
MODIFIED_FORMULA: ${pick.formula}
METABOLIC_WINDOW: ${pick.window}

EXECUTIVE SUMMARY:
- [DEMO MODE ACTIVE] System is currently experiencing high load.
- Analysis represents a high-fidelity synthetic baseline.
- Bio-Intelligence core is in preventative maintenance.

METABOLIC IMPACT:
- Primary nutrients mapped to generic metabolic pathways.
- Micronutrient density estimated based on plate architecture.`
      });
    }

    return NextResponse.json(
      { error: "Something went wrong with the API: " + error.message },
      { status: 500 }
    );
  }
}