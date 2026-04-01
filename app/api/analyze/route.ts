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
CALORIES: [number]
PROTEIN: [number]
CARBS: [number]
FATS: [number]
HEALTH_SCORE: [number between 1-10]

2. Provide a "EXECUTIVE SUMMARY" section:
- Maximum 3 short, punchy bullet points.
- No conversational filler or introductory sentences.

3. Provide a "METABOLIC IMPACT" section (Based on Biometrics if provided):
- Identify exactly 2 high-level risks or benefits.
${userContextBlock ? 
`- Use the provided Biometric Profile: Age ${userContextBlock.match(/Age: (\d+)/)?.[1]}, Weight ${userContextBlock.match(/Weight: (\d+)/)?.[1]}kg.` : ""}

Keep the entire response under 150 words. Focus on precision and data.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
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
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API Error:", errorText);
      throw new Error(`Gemini API returned ${response.status}: ${errorText}`);
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
    return NextResponse.json(
      { error: "Something went wrong with the API: " + error.message },
      { status: 500 }
    );
  }
}