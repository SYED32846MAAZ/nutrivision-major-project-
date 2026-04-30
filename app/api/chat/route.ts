import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1].content;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const systemPrompt = `You are the Balanced Bites AI Nutrition Coach. 
    Your goal is to provide professional, data-driven, and encouraging advice about food, calories, diet, and fitness.
    Keep your responses structured, concise, and futuristic in tone (Bio-Intelligence style).
    Use markdown for formatting. 
    Always prioritize health and safety.`;

    const result = await model.generateContent([
      systemPrompt,
      ...messages.map((m: any) => `${m.role}: ${m.content}`),
      `user: ${lastMessage}`
    ]);

    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ content: text });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "Failed to connect to Neural Coach." }, { status: 500 });
  }
}
