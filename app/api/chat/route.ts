import { NextResponse } from "next/server";

export async function POST(req: Request) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: "Neural Core Authentication Missing." }, { status: 500 });
  }
  
  const { GoogleGenerativeAI } = require("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1].content;

    const systemPrompt = `You are the Balanced Bites AI Nutrition Coach. 
    Your goal is to provide professional, data-driven, and encouraging advice about food, calories, diet, and fitness.
    Keep your responses structured, concise, and futuristic in tone (Bio-Intelligence style).
    Use markdown for formatting. 
    Always prioritize health and safety.`;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: systemPrompt
    });

    const history = messages.slice(0, -1)
      .map((m: any) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }))
      // Gemini requires history to start with 'user' role
      .filter((m: any, i: number) => i > 0 || m.role === 'user');

    const chat = model.startChat({
      history: history,
    });

    const result = await chat.sendMessage(lastMessage);

    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ content: text });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: error.message || "Neural Core Intelligence Sweep Failed." }, { status: 500 });
  }
}
