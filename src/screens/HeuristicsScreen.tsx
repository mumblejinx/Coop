import { Section } from '../components/layout/Section';
import { RefreshCw, Verified, Hourglass, Terminal, Users, Share2, Zap, Activity } from 'lucide-react';
import { cn } from '../lib/utils';
import { useCIS } from '../state/cisStore';

export default function HeuristicsScreen() {
  const { getHeuristicModifiers, reflections } = useCIS();
  const h = getHeuristicModifiers();

  const strategies = [
    {
      id: 'positivity',
      title: 'Positivity Boost',
      status: reflections.length > 5 ? 'Active' : 'Locked',
      icon: RefreshCw,
      desc: `Current Multiplier: x${h.positivityBoost.toFixed(1)}. Activated after 5 reflections.`,
      progress: reflections.length > 5 ? 5 : Math.min(5, reflections.length),
      color: 'primary'
    },
    {
      id: 'depth',
      title: 'Logic Depth',
      status: reflections.length > 10 ? 'Active' : 'Locked',
      icon: Verified,
      desc: `Current Tier: ${h.depthLevel}. Deepens the complexity of AI questions after 10 reflections.`,
      progress: reflections.length > 10 ? 5 : Math.floor(Math.min(10, reflections.length) / 2),
      color: 'secondary'
    },
    {
      id: 'sync',
      title: 'Teamwork Score',
      status: 'Active',
      icon: Terminal,
      desc: `Calculating synergy based on ${reflections.length} memory entries.`,
      progress: Math.min(5, Math.ceil(reflections.length / 3)),
      color: 'primary'
    }
  ];

  return (
    <div className="space-y-12 pb-20">
      <Section title="The Heart of the Team" className="relative group">
        <div className="absolute top-0 right-0 p-2 bg-yellow-400 border-b-[4px] border-l-[4px] border-black font-black text-[10px] z-10">LEVEL 04: TEAMWORK</div>
        <h2 className="text-4xl md:text-5xl font-black uppercase mb-4 tracking-tighter">The Heart of the Team</h2>
        <p className="text-lg font-bold max-w-2xl uppercase">We're using smart ways to help us work better together. Looking at how we help each other every single day!</p>
        <div className="mt-8 flex flex-wrap gap-4">
          <div className="bg-tertiary-fixed border-[4px] border-black px-4 py-2 font-black flex items-center gap-2 text-sm shadow-[4px_4px_0_0_rgba(0,0,0,1)] uppercase">
            <Zap className="w-5 h-5 fill-current" />
            SYSTEM ACTIVE
          </div>
          <div className="bg-cyan-400 border-[4px] border-black px-4 py-2 font-black flex items-center gap-2 text-sm shadow-[4px_4px_0_0_rgba(0,0,0,1)] uppercase">
            <Share2 className="w-5 h-5" />
            99.8% SYNC
          </div>
        </div>
      </Section>

      <section className="bg-[#2d5a27] border-[4px] border-black p-8 text-white relative shadow-[12px_12px_0_0_rgba(0,0,0,1)]">
        <div className="absolute inset-2 border-[2px] border-tertiary-fixed/30 pointer-events-none" />
        <div className="flex items-center gap-4 mb-10 relative z-10">
          <Activity className="text-tertiary-fixed w-10 h-10" />
          <h3 className="text-3xl md:text-4xl font-black uppercase tracking-widest text-white italic">Ways to Help</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {strategies.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.id} className="bg-white border-[4px] border-black p-6 shadow-[8px_8px_0_0_rgba(0,0,0,1)] translate-x-0 translate-y-0 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-pointer group flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className={cn(
                      "px-2 py-1 text-[10px] font-black uppercase text-white",
                      s.status === 'Active Heuristic' ? 'bg-[#FF0040]' : 'bg-black'
                    )}>{s.status}</span>
                    <Icon className="text-black group-hover:text-tertiary transition-colors w-6 h-6" />
                  </div>
                  <h4 className="text-black font-black text-2xl uppercase mb-3 tracking-tighter">{s.title}</h4>
                  <div className="h-1 w-full bg-black mb-4"></div>
                  <p className="text-zinc-600 font-bold text-xs mb-8 uppercase leading-tight">{s.desc}</p>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={cn(
                      "h-4 w-4 border-[2px] border-black",
                      i < s.progress ? (s.color === 'primary' ? 'bg-tertiary' : 'bg-secondary') : 'bg-zinc-200'
                    )}></div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>


      <section className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2 bg-white border-[4px] border-black p-6 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
          <h4 className="font-black uppercase mb-4 flex items-center gap-2 text-sm">
            <Terminal className="text-black w-5 h-5" />
            Live Friendship Stream
          </h4>
          <div className="bg-black text-tertiary-fixed font-mono p-4 text-[10px] h-48 overflow-hidden relative">
            <p className="mb-1">&gt; HEURISTIC_SYNC: ACTIVE</p>
            <p className="mb-1">&gt; POSITIVITY_BOOST: {h.positivityBoost.toFixed(1)}</p>
            <p className="mb-1 text-white">&gt; DEPTH_LEVEL: {h.depthLevel}</p>
            <p className="mb-1">&gt; MEMORY_NODES: {reflections.length}</p>
            <p className="mb-1">&gt; DATA LOOP ESTABLISHED...</p>
            <p className="mb-1">&gt; HAPPINESS LEVEL: {(reflections.length * 9.9).toFixed(1)}%</p>
            <div className="absolute bottom-4 left-4 h-4 w-2 bg-tertiary-fixed animate-pulse"></div>
          </div>
        </div>

        <div className="md:col-span-2 grid grid-cols-2 gap-6">
          <div className="bg-yellow-400 border-[4px] border-black p-6 shadow-[8px_8px_0_0_rgba(0,0,0,1)] flex flex-col justify-between active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer">
            <Users className="w-10 h-10" />
            <div>
              <div className="text-3xl font-black">1.2k</div>
              <div className="font-black uppercase text-[10px]">Team Members</div>
            </div>
          </div>
          <div className="bg-cyan-400 border-[4px] border-black p-6 shadow-[8px_8px_0_0_rgba(0,0,0,1)] flex flex-col justify-between active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer">
            <Activity className="w-10 h-10" />
            <div>
              <div className="text-3xl font-black">84%</div>
              <div className="font-black uppercase text-[10px]">Teamwork Score</div>
            </div>
          </div>
        </div>

        <div className="md:col-span-4 bg-white border-[4px] border-black p-8 shadow-[8px_8px_0_0_rgba(0,0,0,1)] flex flex-col md:flex-row items-center gap-8">
          <div className="shrink-0 w-48 h-48 border-[4px] border-black overflow-hidden bg-black">
            <img 
              className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 transition-all duration-500" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVIVe3qfdYXDApgcb8v7GTEOlRvTvFM9f0EpBJqq0HKDK3G8oPCHKqI-RHyWQ-o6q9w9Vo8RrHv1f9PKnieZvBP_0us3yLSAKRXkSg5dPsKpPF0BXTdjCXnF5mK8f-6g-Lp6DNn8QM_iPlyQGh9KlN2a5vOyMu1CNgMkTFX0834uVbaGKJTRO2y3PVUSQkzHCWoNIvBP5kJ_vJzRIHGjB6LB8w4aBsnVtW_jwdIhtvpos2P7xsRxj_QIJ6KUIAiRjVhusE1H5UkwI" 
              alt="Sync Plan"
            />
          </div>
          <div className="space-y-4">
            <h4 className="text-4xl font-black uppercase tracking-tighter leading-none">Our First Team Plan</h4>
            <p className="text-lg font-bold uppercase leading-tight">Finding new ways for us to talk and play together safely and happily.</p>
            <button className="bg-primary border-[4px] border-black px-6 py-2 text-white font-black uppercase text-sm shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none hover:bg-red-500 transition-all">
              Say Hello!
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
