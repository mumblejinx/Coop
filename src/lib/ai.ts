export type Mode = 'conversation' | 'story';

interface AIResponse {
  reflection: string;
  question: string;
  theme: string;
}

// simple persistent story state (module-level)
let storyState = {
  started: false,
  location: 'unknown'
};

export async function analyzeReflection(
  input: string,
  modifiers: any,
  mode: Mode
): Promise<AIResponse> {

  const lower = input.toLowerCase();

  let reflection = '';
  let question = '';
  let theme = 'reflection';

  // =========================
  // 🧠 CONVERSATION MODE
  // =========================
  if (mode === 'conversation') {

    if (lower.includes('good') || lower.includes('nice') || lower.includes('happy')) {
      reflection = `That sounds like a genuinely good moment. There’s a bit of ease in what you’re describing.`;
      question = `What’s been contributing most to that feeling?`;
      theme = 'positivity';
    }

    else if (lower.includes('stress') || lower.includes('anxious') || lower.includes('worried')) {
      reflection = `It sounds like something is weighing on you a bit.`;
      question = `What part of it feels most difficult right now?`;
      theme = 'stress';
    }

    else if (lower.includes('bathroom')) {
      reflection = `It sounds like you're balancing something immediate with curiosity.`;
      question = `What made you stay here instead of stepping away for a moment?`;
      theme = 'conflict';
    }

    else {
      reflection = `I’m hearing something worth paying attention to in what you said.`;
      question = `What part of that stands out to you the most right now?`;
      theme = 'general';
    }
  }

  // =========================
  // 🎮 STORY MODE
  // =========================
  if (mode === 'story') {

    // First turn (initialize world)
    if (!storyState.started) {
      storyState.started = true;
      storyState.location = 'room';

      reflection = `You open your eyes and find yourself in a dimly lit room. The walls are unfamiliar. A faint humming sound vibrates through the space.`;

      question = `Do you explore the room or try to find a way out?`;
      theme = 'mystery';
    }

    else if (lower.includes('look') || lower.includes('around')) {
      reflection = `You scan the room carefully. There’s a metal door, a flickering overhead light, and strange markings scratched into one wall.`;

      question = `Do you inspect the markings or approach the door?`;
      theme = 'observation';
    }

    else if (lower.includes('door')) {
      reflection = `You move toward the door. As you get closer, the humming grows louder—like something is responding to your presence.`;

      question = `Do you open the door or step back?`;
      theme = 'tension';
    }

    else if (lower.includes('mark') || lower.includes('wall')) {
      reflection = `The markings seem deliberate. They form a pattern… not random. It almost feels like a warning.`;

      question = `Do you try to understand the pattern or ignore it?`;
      theme = 'mystery';
    }

    else {
      reflection = `Your action shifts something subtle in the environment. You get the sense that you're not alone here.`;

      question = `What do you do next?`;
      theme = 'unknown';
    }
  }

  // simulate delay
  await new Promise(res => setTimeout(res, 600));

  return { reflection, question, theme };
}