import { useState } from 'react';
import { Section } from '../components/layout/Section';
import { useCIS } from '../state/cisStore';
import { analyzeReflection } from '../lib/ai';
import { Sparkles, Eye, Terminal } from 'lucide-react';
import { useFirebase } from '../components/FirebaseProvider';

export default function MirrorScreen() {
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [output, setOutput] = useState<{ reflection: string; question: string; theme: string; } | null>(null);
  const { user } = useFirebase();
  const { addReflectionToFirebase, updateXPInFirebase, getHeuristicModifiers } = useCIS();

  const handleReflect = async () => {
    if (!input.trim() || !user) return;
    setIsAnalyzing(true);
    try {
      const res = await analyzeReflection(input, getHeuristicModifiers());
      setOutput(res);
      await addReflectionToFirebase(user.uid, { input, reflection: res.reflection, question: res.question, theme: res.theme as any });
      await updateXPInFirebase(user.uid, 50);
      setInput('');
    } catch (e) { console.error(e); } finally { setIsAnalyzing(false); }
  };

  return (
    <div className="space-y-8 pb-20">
      <Section title="FRIENDLY MIRROR"><div className="flex items-center gap-4 mb-4"><Sparkles className="text-tertiary-container w-10 h-10" /><p className="font-bold uppercase">How are you feeling right now?</p></div></Section>
      <div className="bg-white border-[4px] border-black p-6 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
        <textarea value={input} onChange={e => setInput(e.target.value)} className="w-full border-[4px] border-black p-4 font-bold min-h-[120px]" placeholder="Tell me how your day is going!" />
        <div className="mt-6 flex justify-end"><button onClick={handleReflect} disabled={isAnalyzing || !input.trim()} className="bg-[#e9003a] border-[4px] border-black px-12 py-4 text-white font-black uppercase text-xl shadow-[4px_4px_0_0_rgba(0,0,0,1)]">{isAnalyzing ? "THINKING..." : "SHARE"}</button></div>
      </div>
      {output && (<div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-5 duration-500"><div className="md:col-span-8 border-[4px] border-black bg-white p-6 shadow-[8px_8px_0_0_rgba(0,0,0,1)]"><div className="flex items-center gap-2 mb-4 border-b-[4px] border-black pb-2"><Eye className="w-6 h-6" /><h3 className="text-sm font-black uppercase">THE MIRROR SAYS...</h3></div><p className="font-bold italic text-lg">{output.reflection}</p></div></div>)}
    </div>
  );
}
