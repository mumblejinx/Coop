import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!
});

export type Mode = 'conversation' | 'story';

interface AIResponse {
  reflection: string;
  question: string;
  theme: string;
}

function isQuestion(input: string) {
  return input.includes("?") || input.toLowerCase().startsWith("do you") || input.toLowerCase().startsWith("can you");
}

export async function analyzeReflection(
  input: string,
  modifiers: any,
  mode: Mode
): Promise<AIResponse> {

  const lower = input.toLowerCase();

  let reflection = '';
  let question = '';
  let theme = 'general';

  // =========================
  // 🧠 REAL AI FOR QUESTIONS
  // =========================
  if (mode === 'conversation' && isQuestion(input)) {

    try {
      const res = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `
You are a thoughtful, calm AI partner in a cooperative intelligence system.

Respond naturally and intelligently to the user's question.
Be clear, grounded, and human.

User: ${input}
`
      });

      const text = res.text || "I'm not sure, but let's explore that together.";

      return {
        reflection: text,
        question: "What do you think about that?",
        theme: "knowledge"
      };

    } catch (e) {
      console.error("AI ERROR:", e);
    }
  }

  // =========================
  // 🧠 FALLBACK (YOUR SYSTEM)
  // =========================

  if (mode === 'conversation') {
    reflection = `You're exploring something in real time.`;
    question = "What stands out to you?";
    theme = 'reflection';
  }

  // =========================
  // 🎮 STORY MODE (we'll fix next step)
  // =========================

  if (mode === 'story') {
    reflection = `The world continues to unfold around you.`;
    question = "What do you do next?";
    theme = 'story';
  }

  return { reflection, question, theme };
}