import { useState } from 'react';
import { useFirebase } from '../core/FirebaseProvider';
import { useCIS } from '../state/cisStore';
import { analyzeReflection } from '../lib/ai';
import { Sparkles, Eye, Terminal, ShieldAlert } from 'lucide-react';

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
      await addReflectionToFirebase(user.uid, { 
        input, 
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
    <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-white border-[4px] border-black p-6 shadow-[12px_12px_0_0_rgba(0,0,0,1)] relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-[#FF0040] p-1 border-l-[4px] border-b-[4px] border-black font-black text-[8px] text-white uppercase italic">Active_Mirror</div>
         <div className="flex items-center gap-4 mb-4">
            <Sparkles className="text-[#FF0040] w-10 h-10" />
            <div>
               <h1 className="text-4xl font-black uppercase italic tracking-tighter text-[#FF0040]">THE_MIRROR</h1>
               <p className="font-bold text-[10px] uppercase tracking-widest text-zinc-500">Cognitive Interface System</p>
            </div>
         </div>
         <p className="font-bold text-sm uppercase leading-tight max-w-sm mb-6">Input your current headspace to sync with the collective intelligence system.</p>
      </div>

      <div className="bg-white border-[4px] border-black p-6 shadow-[12px_12px_0_0_rgba(0,0,0,1)] space-y-6">
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm font-black uppercase tracking-widest">
            <Terminal className="w-4 h-4 text-[#FF0040]" />
            Entry Terminal
          </label>
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)} 
            disabled={isAnalyzing}
            className="w-full bg-zinc-50 border-[4px] border-black p-6 font-bold text-lg min-h-[200px] focus:outline-none focus:bg-white transition-all placeholder:text-zinc-300 disabled:opacity-50"
            placeholder="Tell me how your day is going..."
          />
        </div>

        <button 
          onClick={handleReflect}
          disabled={isAnalyzing || !input.trim()}
          className="w-full group relative bg-[#FF0040] text-white border-[4px] border-black py-6 font-black uppercase text-2xl shadow-[8px_8px_0_0_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none hover:bg-red-500 transition-all disabled:opacity-50"
        >
          {isAnalyzing ? "THINKING..." : "SHARE REFLECTION"}
        </button>
      </div>

      {output && (
        <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
           <div className="bg-white border-[4px] border-black p-8 shadow-[12px_12px_0_0_rgba(0,0,0,1)] space-y-6">
              <div className="flex items-center gap-2 border-b-[4px] border-black pb-2 text-[#FF0040]">
                <Eye className="w-6 h-6" />
                <h3 className="text-sm font-black uppercase tracking-widest">Mirror Feedback</h3>
              </div>
              <div className="space-y-4">
                <p className="font-bold italic text-xl leading-snug">"{output.reflection}"</p>
                <p className="bg-zinc-100 p-4 border-[2px] border-black font-black text-sm uppercase text-zinc-600">
                   {output.question}
                </p>
              </div>
              <div className="flex justify-between items-center bg-black text-white px-2 text-[8px] font-black uppercase py-1">
                 <span>Theme Detected: {output.theme}</span>
                 <span className="text-[#7eff51]">SYNC SUCCESSFUL</span>
              </div>
           </div>
        </div>
      )}

      <div className="bg-yellow-400 border-[4px] border-black p-4 flex gap-4 items-center shadow-[12px_12px_0_0_rgba(0,0,0,1)]">
         <ShieldAlert className="w-8 h-8 shrink-0" />
         <p className="text-[10px] font-black uppercase italic leading-none">Your thoughts remain private and are only used to calculate heuristic team stability coefficients.</p>
      </div>
    </div>
  );
}
