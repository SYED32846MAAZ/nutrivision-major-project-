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

    const modelNames = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-pro"];
    let text = "";
    let lastError = "";

    for (const modelName of modelNames) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(`System: ${systemPrompt}\nUser: ${lastMessage}`);
        text = result.response.text();
        if (text) break;
      } catch (err: any) {
        lastError = err.message;
        continue;
      }
    }

    if (!text) {
      // High-Fidelity Simulation Mode (Fallback when API is fully restricted)
      const simulationResponses: Record<string, string> = {
        "diet": "Based on a 2000 calorie protocol, I recommend a macro split of 40% Carbs, 30% Protein, and 30% Healthy Fats. Focus on lean proteins like poultry or legumes, complex carbs like quinoa, and micronutrient-dense vegetables.",
        "muscle": "To optimize hypertrophy, prioritize a protein intake of 1.6g to 2.2g per kg of body weight. Ensure a slight caloric surplus (~250-500 kcal) and maintain a consistent resistance training protocol.",
        "fasting": "Intermittent fasting (16:8) can optimize insulin sensitivity. However, ensure your feeding window provides adequate micronutrients to prevent metabolic stalling.",
        "default": "Protocol synchronized. To provide high-fidelity nutritional optimization, I need you to maintain consistent meal logging. For now, focus on whole foods and adequate hydration (3-4L/day)."
      };

      const key = Object.keys(simulationResponses).find(k => lastMessage.toLowerCase().includes(k)) || "default";
      text = `[NEURAL SIMULATION MODE]: ${simulationResponses[key]}`;
    }

    return NextResponse.json({ content: text });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: error.message || "Neural Core Intelligence Sweep Failed." }, { status: 500 });
  }
}
