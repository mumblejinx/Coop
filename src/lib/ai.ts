import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
} else {
  console.warn("⚠️ No Gemini API key found.");
}

export type Mode = 'conversation' | 'story';

interface AIResponse {
  reflection: string;
  question: string;
  theme: string;
}

function isQuestion(input: string) {
  const lower = input.toLowerCase();
  return input.includes("?") || lower.startsWith("do you") || lower.startsWith("can you");
}

export async function analyzeReflection(
  input: string,
  modifiers: any,
  mode: Mode
): Promise<AIResponse> {

  // 🧠 REAL AI
  if (mode === 'conversation' && isQuestion(input) && ai) {
    try {
      const res = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `
You are a thoughtful, grounded AI partner.

Answer clearly and naturally.
Do not avoid the user's question.

User: ${input}
`
      });

      return {
        reflection: res.text || "I'm not sure, but let's explore that.",
        question: "What do you think about that?",
        theme: "knowledge"
      };

    } catch (e) {
      console.error(e);
    }
  }

  // fallback
  if (mode === 'conversation') {
    return {
      reflection: "You're exploring something in real time.",
      question: "What stands out to you?",
      theme: "reflection"
    };
  }

  if (mode === 'story') {
    return {
      reflection: "The world continues to unfold around you.",
      question: "What do you do next?",
      theme: "story"
    };
  }

  return {
    reflection: "Something unexpected happened.",
    question: "What now?",
    theme: "unknown"
  };
}