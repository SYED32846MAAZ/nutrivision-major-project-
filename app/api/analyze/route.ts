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

    const prompt = `Analyze this food image and return formatted markdown strictly representing:
- Food Name
- Total Calories
- Macronutrients (Protein, Carbs, Fats)${
userContextBlock ? 
`\n${userContextBlock}- Long-Term Health Risks: Based EXCLUSIVELY on the provided BIOMETRIC PROFILE above, predict specific multi-month or multi-year metabolic, cardiovascular, or physical health risks if this food becomes a regular daily staple for them.
- Preventative Path: Suggest a safe, highly-actionable preventative nutritional pattern or specific dietary adjustments to mitigate these exact risks for this specific user.` 
: 
`\n- Long-Term Health Risks: Predict general multi-month or multi-year metabolic, cardiovascular, or physical health risks if this food becomes a regular daily staple for an average person.
- Preventative Path: Suggest a safe, highly-actionable preventative nutritional pattern or specific dietary adjustments to mitigate these health risks.`
}

Make the layout beautiful with emojis and well-structured headings. Keep it highly professional.`;

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