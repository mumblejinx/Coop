export type Mode = 'conversation' | 'story';

interface AIResponse {
  reflection: string;
  question: string;
  theme: string;
}

// memory to prevent loops
let lastQuestion = "";
let lastTopic = "";

// STORY STATE (real progression)
let storyState = {
  started: false,
  step: 0,
  decoded: false,
  doorOpen: false
};

function pickNew(options: string[]) {
  const filtered = options.filter(q => q !== lastQuestion);
  const choice = filtered[Math.floor(Math.random() * filtered.length)];
  lastQuestion = choice;
  return choice;
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
  // 🧠 CONVERSATION MODE (SMARTER)
  // =========================
  if (mode === 'conversation') {

    if (lower.includes('website') || lower.includes('project')) {
      reflection = `You're thinking about whether this system will actually work and matter.`;
      question = pickNew([
        "What would success look like to you?",
        "What part of this feels uncertain?",
        "What would make this feel real instead of experimental?"
      ]);
      theme = 'purpose';
      lastTopic = 'project';
    }

    else if (lower.includes('music') || lower.includes('album') || lower.includes('girl talk')) {
      reflection = `You're shifting into something cultural and experiential — bringing music into the space.`;
      question = pickNew([
        "What do you like about that album?",
        "How does it affect your mood right now?",
        "Does it change how you're thinking?"
      ]);
      theme = 'expression';
      lastTopic = 'music';
    }

    else if (lower.includes('shower') || lower.includes('bathroom')) {
      reflection = `You're balancing physical needs with curiosity and focus.`;
      question = pickNew([
        "What made you stay instead of stepping away?",
        "Do you want to follow that instinct or override it?"
      ]);
      theme = 'awareness';
      lastTopic = 'body';
    }

    else if (lastTopic === 'project') {
      reflection = `You're still circling around the idea of whether this works.`;
      question = pickNew([
        "What part of it feels closest to working?",
        "What feels like it's missing?",
        "Where does it break down for you?"
      ]);
      theme = 'analysis';
    }

    else {
      reflection = `You're exploring what's on your mind in real time.`;
      question = pickNew([
        "What stands out most right now?",
        "What feels most real in this moment?",
        "Where is your attention going?"
      ]);
      theme = 'reflection';
    }
  }

  // =========================
  // 🎮 STORY MODE (REAL PROGRESSION)
  // =========================
  if (mode === 'story') {

    // START
    if (!storyState.started) {
      storyState.started = true;
      storyState.step = 1;

      reflection = `You wake up in a dimly lit room. A sealed metal door stands ahead. Strange markings glow faintly on the wall.`;

      question = "Do you look around, inspect the markings, or approach the door?";
      theme = 'mystery';
    }

    // LOOK AROUND
    else if (lower.includes('look')) {
      storyState.step = 2;

      reflection = `You scan the room. It's small. No windows. The markings are the only unusual feature.`;

      question = "Do you inspect the markings more closely or go to the door?";
      theme = 'observation';
    }

    // MARKINGS
    else if (lower.includes('mark')) {
      storyState.step = 3;

      reflection = `The markings form a repeating pattern. It looks like a coded message.`;

      question = "Do you try to decode it?";
      theme = 'mystery';
    }

    // DECODE SUCCESS
    else if (lower.includes('decode') && !storyState.decoded) {
      storyState.decoded = true;
      storyState.step = 4;

      reflection = `You focus. Slowly, the symbols resolve into meaning: "THE DOOR OPENS FOR THOSE WHO SEE."`;

      question = "Do you go to the door now?";
      theme = 'breakthrough';
    }

    // DOOR BEFORE DECODE
    else if (lower.includes('door') && !storyState.decoded) {
      reflection = `The door doesn't respond. Something is missing.`;

      question = "Do you examine the markings first?";
      theme = 'block';
    }

    // DOOR AFTER DECODE
    else if (lower.includes('door') && storyState.decoded && !storyState.doorOpen) {
      storyState.doorOpen = true;
      storyState.step = 5;

      reflection = `You step forward. The door reacts — unlocking with a deep metallic click. It slowly opens into darkness beyond.`;

      question = "Do you step through?";
      theme = 'progress';
    }

    // STEP THROUGH
    else if (lower.includes('step') && storyState.doorOpen) {
      storyState.step = 6;

      reflection = `You step through the doorway… and the world shifts. You're no longer in a room. You're somewhere else entirely.`;

      question = "Do you keep moving forward or look around?";
      theme = 'transition';
    }

    else {
      reflection = `You pause. The room remains quiet, waiting.`;

      question = "What do you do next?";
      theme = 'idle';
    }
  }

  await new Promise(res => setTimeout(res, 400));

  return { reflection, question, theme };
}