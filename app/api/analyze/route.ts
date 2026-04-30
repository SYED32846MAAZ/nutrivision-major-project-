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

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    const fetchOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  inline_data: {
                    mime_type: file.type,
                    data: base64,
                  },
                },
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
    };

    let response;
    let retries = 3;
    let delay = 1000;
    let errorText = "";

    while (retries > 0) {
      response = await fetch(url, fetchOptions);
      if (response.ok) break;

      errorText = await response.text();
      console.error(`Gemini API Error (${response.status}):`, errorText);

      // Retry on 503 (Service Unavailable) or 429 (Too Many Requests)
      if (response.status === 503 || response.status === 429) {
        retries--;
        if (retries > 0) {
          console.log(`Rate limit / High demand hit. Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2; // Exponential backoff
        }
      } else {
        break; // Break on other errors
      }
    }

    if (!response || !response.ok) {
      console.warn(`Gemini API Error: ${response?.status} - ${errorText}`);
      
      const isQuota = response?.status === 429 || errorText.includes("quota");
      const isExpired = errorText.includes("expired") || errorText.includes("invalid") || response?.status === 400;
      const isHighDemand = response?.status === 503 || errorText.includes("demand");
      
      if (isExpired) {
         throw new Error("Neural Core Authentication Failed: The API key is expired or invalid. Please update the credential in the system core.");
      }
      
      if (isQuota) {
         throw new Error("Neural Core Capacity Reached: Monthly quota exceeded. Please upgrade the intelligence tier or switch keys.");
      }

      if (isHighDemand) {
         throw new Error("Neural Core Congestion: The engine is experiencing high demand. Please retry the sweep in a few moments.");
      }

      // If it's a different error, we try to parse the Gemini error message
      let userFriendlyError = `Gemini API returned ${response?.status || "Unknown"}`;
      try {
        const parsed = JSON.parse(errorText);
        if (parsed.error?.message) {
            userFriendlyError = parsed.error.message;
        }
      } catch (e) {
        userFriendlyError += `: ${errorText}`;
      }
      throw new Error(userFriendlyError);
    }

    const data = await response.json();
    const parts = data?.candidates?.[0]?.content?.parts || [];

    let text = "";
    for (const part of parts) {
      if (part.text) {
        text += part.text + " ";
      }
    }

    const finalResult = text.trim() || "No response from AI";

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