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
    Use markdown for formatting. Always prioritize health and safety.`;

    const modelNames = ["gemini-1.5-flash", "gemini-2.0-flash"];
    let text = "";
    let lastError = "";

    for (const modelName of modelNames) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const prompt = `CONTEXT: ${systemPrompt}\n\nHISTORY:\n${messages.slice(0, -1).map((m: any) => `${m.role}: ${m.content}`).join('\n')}\n\nUSER: ${lastMessage}`;
        const result = await model.generateContent(prompt);
        text = result.response.text();
        if (text) break;
      } catch (err: any) {
        lastError = err.message;
        if (err.message.includes("429") || err.message.includes("quota")) continue;
        throw err;
      }
    }

    if (!text) {
      // Graceful Simulation Fallback for high demand
      text = "System under high load. Neural scan suggests: optimizing your nutrition requires consistent tracking and balanced macronutrient intake. Please try again in a few moments for full high-fidelity analysis.";
    }

    return NextResponse.json({ content: text });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: error.message || "Neural Core Intelligence Sweep Failed." }, { status: 500 });
  }
}
