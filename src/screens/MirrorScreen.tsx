import { useState } from 'react';
import { Section } from '../components/layout/Section';
import { useCIS } from '../state/cisStore';
import { analyzeReflection } from '../lib/ai';
import { Sparkles } from 'lucide-react';
import { useFirebase } from '../components/FirebaseProvider';

type Mode = 'conversation' | 'story';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

export default function MirrorScreen() {
  const [mode, setMode] = useState<Mode | null>(null);
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentAI, setCurrentAI] = useState<any>(null);

  const { user } = useFirebase();
  const { addReflectionToFirebase, updateXPInFirebase, getHeuristicModifiers } = useCIS();

  const handleReflect = async () => {
    if (!input.trim() || !user || !mode) return;

    setIsAnalyzing(true);

    const userMessage = input;
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);

    try {
      const res = await analyzeReflection(userMessage, getHeuristicModifiers(), mode);

      setCurrentAI(res);

      setMessages(prev => [
        ...prev,
        { sender: 'ai', text: res.reflection },
        { sender: 'ai', text: res.question }
      ]);

      await addReflectionToFirebase(user.uid, {
        input: userMessage,
        reflection: res.reflection,
        question: res.question,
        theme: res.theme as any
      });

      await updateXPInFirebase(user.uid, 50);

      setInput('');

    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">

      {!mode && (
        <Section title="MIRROR">
          <div className="space-y-4">
            <p className="font-bold uppercase">Choose your path:</p>
            <div className="flex gap-4">
              <button onClick={() => setMode('conversation')} className="bg-blue-500 border-[4px] border-black px-6 py-3 font-black text-white">
                Conversation
              </button>
              <button onClick={() => setMode('story')} className="bg-purple-500 border-[4px] border-black px-6 py-3 font-black text-white">
                Story Game
              </button>
            </div>
          </div>
        </Section>
      )}

      {mode && (
        <>
          <Section title="MIRROR">
            <div className="flex items-center gap-4 mb-4">
              <Sparkles className="w-8 h-8" />
              <p className="font-bold uppercase">
                {currentAI
                  ? currentAI.reflection
                  : "How are you feeling right now, or what would you like to explore?"}
              </p>
            </div>

            {currentAI && (
              <p className="font-bold text-lg mt-4">
                {currentAI.question}
              </p>
            )}
          </Section>

          <div className="bg-white border-[4px] border-black p-6">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              className="w-full border-[4px] border-black p-4 font-bold min-h-[120px]"
            />
            <div className="mt-6 flex justify-end">
              <button onClick={handleReflect} className="bg-[#e9003a] border-[4px] border-black px-12 py-4 text-white font-black">
                {isAnalyzing ? "THINKING..." : "SHARE"}
              </button>
            </div>
          </div>

          {/* CONVERSATION ONLY */}
          {mode === 'conversation' && currentAI && (
            <div className="space-y-4">
              <div className="bg-yellow-400 border-[4px] border-black p-4 font-black uppercase">
                Theme Detected: {currentAI.theme}
              </div>

              <div className="bg-black border-[4px] border-black p-4 font-mono text-xs text-green-400">
                <p>&gt; Memory Stored</p>
                <p>&gt; Interaction Logged</p>
                <p>&gt; System Stable</p>
              </div>
            </div>
          )}

          {/* TRANSCRIPT (ONLY AFTER FIRST MESSAGE) */}
          {messages.length > 0 && (
            <div className="bg-white text-black border-[4px] border-black p-6 h-64 overflow-y-auto">
              <h4 className="font-black mb-4">TRANSCRIPT</h4>
              <div className="space-y-2 text-sm">
                {messages.map((m, i) => (
                  <div key={i}>
                    <span className={m.sender === 'user' ? 'text-blue-600' : 'text-red-600'}>
                      {m.sender === 'user' ? 'You' : 'Mirror'}:
                    </span>{' '}
                    {m.text}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}