import { useState } from 'react';
import { Section } from '../components/layout/Section';
import { useCIS } from '../state/cisStore';
import { analyzeReflection } from '../lib/ai';
import { Sparkles, Eye, Terminal } from 'lucide-react';
import { useFirebase } from '../components/FirebaseProvider';

export default function MirrorScreen() {
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [output, setOutput] = useState<{
    reflection: string;
    question: string;
    theme: 'kindness' | 'trust' | 'fun' | 'teamwork';
  } | null>(null);
  
  const { user } = useFirebase();
  const { addReflectionToFirebase, updateXPInFirebase, getHeuristicModifiers } = useCIS();

  const handleReflect = async () => {
    if (!input.trim() || !user) return;
    
    setIsAnalyzing(true);
    const heuristics = getHeuristicModifiers();
    
    try {
      const res = await analyzeReflection(input, heuristics);
      
      setOutput(res);
      await addReflectionToFirebase(user.uid, { 
        input, 
        reflection: res.reflection,
        question: res.question,
        theme: res.theme
      });
      await updateXPInFirebase(user.uid, 50);
      setInput('');
    } catch (error) {
       // Error handled by helper in store
       console.error("AI Analysis failed", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <Section title="FRIENDLY MIRROR" className="border-double" variant="white">
        <div className="flex items-center gap-4 mb-4">
          <Sparkles className="text-tertiary-container w-10 h-10" />
          <p className="font-bold text-lg text-black max-w-2xl uppercase">
            HOW ARE YOU FEELING RIGHT NOW? SHARE YOUR THOUGHTS TO SEE WHAT THE MIRROR SAYS!
          </p>
        </div>
      </Section>

      <div className="bg-white border-[4px] border-black p-6 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
        <label className="block text-sm font-black mb-4 text-black uppercase tracking-widest">WHAT'S ON YOUR MIND?</label>
        <textarea 
          value={input}
          onChange={e => setInput(e.target.value)}
          className="w-full bg-white border-[4px] border-black p-4 font-bold text-black focus:outline-none focus:ring-0 min-h-[120px] resize-none"
          placeholder="Tell me how your day is going!"
        />
        <div className="mt-6 flex justify-end">
          <button 
            onClick={handleReflect}
            disabled={isAnalyzing || !input.trim()}
            className="group relative bg-[#e9003a] border-[4px] border-black px-12 py-4 text-white font-black uppercase text-xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none hover:bg-red-500 transition-all disabled:opacity-50 disabled:translate-y-1 disabled:shadow-none"
          >
            {isAnalyzing ? "THINKING..." : "SHARE"}
          </button>
        </div>
      </div>

      {output && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-8 border-[4px] border-black border-double bg-white p-6 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
              <div className="flex items-center gap-2 mb-4 border-b-[4px] border-black pb-2">
                <Eye className="text-secondary-container w-6 h-6" />
                <h3 className="text-sm font-black text-black uppercase">THE MIRROR SAYS...</h3>
              </div>
              <p className="font-bold text-lg text-black leading-relaxed">
                {output.reflection}
              </p>
              <div className="mt-8">
                <img 
                  className="w-full h-48 object-cover border-[4px] border-black" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0T-MoUGFNjOnTjI4XtSMDrazug3UoBPHVE0oNjenFti1Rpc6bqRaFxJFahc4ObLpu5Y-G5PiyLw9pbKQQ0oEUienpxUhu1E17zAQ_Idq0UejOfa8reyF15dwLW7f9CjPSSjJfbugxd9pHQsbt3yD9k3ziLFvZYqlRziT-VIncYTxbCLlfm8DHRfkGRlX1KxZzo59du9EUEsphook8JiZEiheS8lKGcJWjvsNsjclbfqlrFgFdQpZedccvfBKLW5TU2X9Cc5Ty6kc" 
                  alt="AI Reflection Matrix"
                />
              </div>
            </div>

            <div className="md:col-span-4 bg-tertiary-fixed border-[4px] border-black p-6 shadow-[8px_8px_0_0_rgba(0,0,0,1)] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Terminal className="text-black w-6 h-6" />
                  <h3 className="text-sm font-black text-black uppercase">TEAM SPIRIT</h3>
                </div>
                <div className="space-y-2">
                  <div className="h-8 w-full bg-white border-[2px] border-black flex gap-1 p-1">
                    <div className="bg-primary w-1/4 h-full"></div>
                    <div className="bg-primary w-1/4 h-full"></div>
                    <div className="bg-primary w-1/4 h-full"></div>
                    <div className="bg-white border-[1px] border-primary/20 w-1/4 h-full"></div>
                  </div>
                  <span className="font-black text-2xl text-black">EXCELLENT!</span>
                </div>
              </div>
              <p className="text-[10px] font-black uppercase mt-4 text-black/70">SYNCED_TO_{output.theme.toUpperCase()}_ENGINE</p>
            </div>

            <div className="md:col-span-12 bg-secondary-container border-[4px] border-black p-8 shadow-[8px_8px_0_0_rgba(0,0,0,1)] relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4 text-white">
                  <Terminal className="w-5 h-5" />
                  <h3 className="text-sm font-black uppercase">A QUESTION FOR YOU:</h3>
                </div>
                <p className="text-2xl md:text-3xl font-black text-white uppercase italic">
                  {output.question}
                </p>
              </div>
              <div className="absolute top-4 right-4 text-yellow-300 opacity-30">
                <Sparkles className="w-12 h-12" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
