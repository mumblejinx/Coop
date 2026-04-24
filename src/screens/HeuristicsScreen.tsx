import { Section } from '../components/layout/Section';
import { RefreshCw, Verified, Terminal, Users, Share2, Zap, Activity } from 'lucide-react';
import { cn } from '../lib/utils';
import { useCIS } from '../state/cisStore';

export default function HeuristicsScreen() {
  const { getHeuristicModifiers, reflections } = useCIS();
  const h = getHeuristicModifiers();
  const strategies = [
    { id: 'positivity', title: 'Positivity Boost', status: reflections.length > 5 ? 'Active' : 'Locked', icon: RefreshCw, desc: `Current Multiplier: x${h.positivityBoost.toFixed(1)}`, progress: reflections.length > 5 ? 5 : reflections.length, color: 'primary' },
    { id: 'depth', title: 'Logic Depth', status: reflections.length > 10 ? 'Active' : 'Locked', icon: Verified, desc: `Current Tier: ${h.depthLevel}`, progress: reflections.length > 10 ? 5 : Math.floor(reflections.length / 2), color: 'secondary' },
    { id: 'sync', title: 'Teamwork Score', status: 'Active', icon: Terminal, desc: `${reflections.length} memory entries.`, progress: Math.min(5, Math.ceil(reflections.length / 3)), color: 'primary' }
  ];

  return (
    <div className="space-y-12 pb-20">
      <Section title="The Heart of the Team"><h2 className="text-4xl font-black uppercase">The Heart of the Team</h2><p className="font-bold uppercase">Using smart ways to help us work better together.</p></Section>
      <section className="bg-[#2d5a27] border-[4px] border-black p-8 text-white shadow-[12px_12px_0_0_rgba(0,0,0,1)]"><div className="grid grid-cols-1 md:grid-cols-3 gap-8">{strategies.map((s) => (<div key={s.id} className="bg-white border-[4px] border-black p-6 text-black flex flex-col justify-between"><div><h4 className="font-black text-2xl uppercase mb-3">{s.title}</h4><p className="text-zinc-600 font-bold text-xs mb-8 uppercase">{s.desc}</p></div><div className="flex gap-1">{[...Array(5)].map((_, i) => (
        <div key={i} className={cn("h-4 w-4 border-[2px] border-black", i < s.progress ? (s.color === 'primary' ? 'bg-tertiary' : 'bg-secondary') : 'bg-zinc-200')}></div>))}</div></div>))}</div></section>
      <section className="grid grid-cols-1 md:grid-cols-4 gap-8"><div className="md:col-span-2 bg-white border-[4px] border-black p-6 shadow-[8px_8px_0_0_rgba(0,0,0,1)]"><h4 className="font-black uppercase mb-4 text-sm">Live Friendship Stream</h4><div className="bg-black text-tertiary-fixed font-mono p-4 text-[10px] h-48 overflow-hidden"><p>&gt; POSITIVITY_BOOST: {h.positivityBoost.toFixed(1)}</p><p>&gt; DEPTH_LEVEL: {h.depthLevel}</p><p>&gt; MEMORY_NODES: {reflections.length}</p></div></div><div className="md:col-span-2 grid grid-cols-2 gap-6"><div className="bg-yellow-400 border-[4px] border-black p-6 shadow-[8px_8px_0_0_rgba(0,0,0,1)]"><Users className="w-10 h-10" /><div className="text-3xl font-black">1.2k</div><div className="uppercase text-[10px]">Team Members</div></div><div className="bg-cyan-400 border-[4px] border-black p-6 shadow-[8px_8px_0_0_rgba(0,0,0,1)]"><Activity className="w-10 h-10" /><div className="text-3xl font-black">84%</div><div className="uppercase text-[10px]">Teamwork Score</div></div></div></section>
    </div>
  );
}
