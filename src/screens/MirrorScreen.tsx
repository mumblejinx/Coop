import { useState } from 'react';
import { Section } from '../components/layout/Section';
import { useCIS } from '../state/cisStore';
import { analyzeReflection } from '../lib/ai';
import { Sparkles, Brain } from 'lucide-react';
import { useFirebase } from '../components/FirebaseProvider';

interface Turn {
  input: string;
  reflection: string;
  question: string;
  theme: string;
}

export default function MirrorScreen() {
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentTurn, setCurrentTurn] = useState<Turn | null>(null);
  const [history, setHistory] = useState<Turn[]>([]);

  const { user } = useFirebase();
  const {
    addReflectionToFirebase,
    updateXPInFirebase,
    getHeuristicModifiers
  } = useCIS();

  const handleReflect = async () => {
    if (!input.trim() || !user) return;

    const userInput = input;
    setInput(''); // ✅ clear immediately
    setIsAnalyzing(true);

    try {
      const res = await analyzeReflection(userInput, getHeuristicModifiers());

      const turn: Turn = {
        input: userInput,
        reflection: res.reflection,
        question: res.question,
        theme: res.theme
      };

      setCurrentTurn(turn);
      setHistory(prev => [...prev, turn]);

      setIsAnalyzing(false);

      await addReflectionToFirebase(user.uid, {
        input: userInput,
        reflection: res.reflection,
        question: res.question,
        theme: res.theme as any
      });

      await updateXPInFirebase(user.uid, 50);

    } catch (e) {
      console.error(e);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">

      {/* 🔁 DYNAMIC TOP BOX */}
      <Section title="MIRROR DIALOGUE">
        {!currentTurn ? (
          <div className="flex items-center gap-4">
            <Sparkles className="w-8 h-8" />
            <p className="font-bold uppercase">
              How are you feeling right now?
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="font-bold italic text-lg">
              {currentTurn.reflection}
            </p>
            <div className="border-t-2 border-black pt-3">
              <p className="font-bold text-lg">
                {currentTurn.question}
              </p>
            </div>
          </div>
        )}
      </Section>

      {/* INPUT */}
      <div className="bg-white border-[4px] border-black p-6 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          className="w-full border-[4px] border-black p-4 font-bold min-h-[120px]"
          placeholder="Respond or continue the story..."
        />

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleReflect}
            disabled={isAnalyzing || !input.trim()}
            className="bg-[#e9003a] border-[4px] border-black px-12 py-4 text-white font-black uppercase text-xl"
          >
            {isAnalyzing ? "THINKING..." : "RESPOND"}
          </button>
        </div>
      </div>

      {/* THEME */}
      {currentTurn && (
        <div className="border-[4px] border-black bg-yellow-400 p-6 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-5 h-5" />
            <span className="font-black uppercase text-sm">
              Theme Detected
            </span>
          </div>
          <div className="text-2xl font-black uppercase">
            {currentTurn.theme}
          </div>
        </div>
      )}

      {/* SYSTEM STATUS */}
      {currentTurn && (
        <div className="border-[4px] border-black bg-black text-green-400 p-6 font-mono text-sm shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
          <p>&gt; MEMORY STORED</p>
          <p>&gt; TRUST NETWORK UPDATED</p>
          <p>&gt; PATTERN RECOGNITION ACTIVE</p>
        </div>
      )}

      {/* 📜 TRANSCRIPT */}
      {history.length > 0 && (
        <div className="border-[4px] border-black bg-white p-6 shadow-[8px_8px_0_0_rgba(0,0,0,1)] max-h-64 overflow-y-auto">
          <h3 className="font-black uppercase mb-4">
            Transcript
          </h3>

          <div className="space-y-4 text-sm">
            {history.map((turn, i) => (
              <div key={i} className="border-b pb-2">
                <p className="font-bold">You:</p>
                <p>{turn.input}</p>

                <p className="font-bold mt-2">Mirror:</p>
                <p>{turn.reflection}</p>

                <p className="italic text-xs mt-1">
                  → {turn.question}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}