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
      model: "gemini-2.0-flash"
    });

    const prompt = `
      SYSTEM INSTRUCTION: ${systemPrompt}
      
      CHAT HISTORY:
      ${messages.slice(0, -1).map((m: any) => `${m.role === 'assistant' ? 'Assistant' : 'User'}: ${m.content}`).join('\n')}
      
      USER MESSAGE: ${lastMessage}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ content: text });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: error.message || "Neural Core Intelligence Sweep Failed." }, { status: 500 });
  }
}
