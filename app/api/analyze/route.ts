import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json({ error: "No image uploaded" }, { status: 400 });
    }

    // Convert image to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");

    // 🔥 Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
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
                  text: `Analyze this food image and return:
- Food name
- Calories
- Protein
- Carbs
- Fats`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();
   console.log("GEMINI RESPONSE:", JSON.stringify(data, null, 2));
    // ✅ SAFE parsing (FINAL FIX)
    const parts = data?.candidates?.[0]?.content?.parts || [];

    let text = "";

    for (const part of parts) {
      if (part.text) {
        text += part.text + " ";
      }
    }

    text = text.trim();

    return NextResponse.json({
      result: text || "No response from AI",
    });

  } catch (error) {
    console.error("ERROR:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}