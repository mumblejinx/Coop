export interface AIResponse {
  reflection: string;
  theme: 'kindness' | 'trust' | 'fun' | 'teamwork';
  question: string;
}

export async function analyzeReflection(input: string, context: { positivityBoost: number; depthLevel: number }): Promise<AIResponse> {
  const themes: ('kindness' | 'trust' | 'fun' | 'teamwork')[] = ['kindness', 'trust', 'fun', 'teamwork'];
  const theme = themes[Math.floor(Math.random() * themes.length)];
  
  let reflection = `I hear you: "${input}". It sounds like you're processing something meaningful.`;
  if (context.positivityBoost > 1) {
    reflection += " I'm really glad we're sharing this together!";
  }
  
  let question = 'What part of this matters most to you right now?';
  if (context.depthLevel > 1) {
    question = 'If you could see this through the eyes of a teammate, how would they help you navigate it?';
  }

  await new Promise(resolve => setTimeout(resolve, 1000));

  return { reflection, theme, question };
}
