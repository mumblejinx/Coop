import { Section } from '../components/layout/Section';
import { Cpu, Terminal, Activity, Zap } from 'lucide-react';
import { useCIS } from '../state/cisStore';

export default function SimulatorScreen() {
  const { reflections } = useCIS();
  const recentReflections = reflections.slice(-8).reverse();

  return (
    <div className="space-y-8 pb-20">
      <section className="bg-white border-[4px] border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-yellow-400"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-primary border-[2px] border-black animate-pulse"></div>
              <h2 className="text-2xl font-black text-primary uppercase tracking-tight font-['Space_Grotesk']">How it Works</h2>
            </div>
            <p className="text-4xl md:text-5xl font-black text-black uppercase leading-none">Real-Time Brain View</p>
            <div className="flex gap-2 pt-4">
              <span className="bg-secondary text-white px-4 py-1 font-bold uppercase border-[2px] border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] text-xs">Active Memories: {reflections.length}</span>
              <span className="bg-tertiary text-white px-4 py-1 font-bold uppercase border-[2px] border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] text-xs">Team Spirit: 98%</span>
            </div>
          </div>
          <div className="w-full md:w-64 shrink-0">
            <div className="border-[4px] border-black p-4 bg-surface-container-highest flex flex-col items-center justify-center aspect-square shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
              <Cpu className="w-20 h-20 text-primary mb-4" />
              <span className="font-black uppercase text-center text-[10px] tracking-widest">Memory Nodes Online</span>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-8 bg-white border-[4px] border-black p-6 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between border-b-[4px] border-black pb-4 mb-6">
            <h3 className="text-2xl font-black uppercase">Recent Intelligence Flows</h3>
            <Cpu className="w-8 h-8" />
          </div>
          
          <div className="space-y-4">
            {recentReflections.length > 0 ? recentReflections.map((r, i) => (
              <div key={i} className="bg-surface-container p-4 border-[2px] border-black border-r-[6px] border-b-[6px] flex justify-between items-center">
                <div>
                  <p className="text-xs uppercase font-black text-secondary">{r.theme} FLOW</p>
                  <p className="text-lg font-bold line-clamp-1 italic">"{r.input}"</p>
                </div>
                <div className="text-[10px] font-black uppercase bg-black text-white px-2 py-1">
                  {new Date(r.timestamp).toLocaleTimeString()}
                </div>
              </div>
            )) : (
              <div className="bg-surface-container p-8 border-[2px] border-black border-r-[6px] border-b-[6px] text-center italic font-bold">
                No intelligence flows detected yet. Share something in the Mirror!
              </div>
            )}
          </div>

          <div className="mt-8 space-y-2">
            <div className="flex justify-between items-end">
              <p className="font-black uppercase text-xs">Processing Breadth</p>
              <p className="font-black text-primary">{Math.min(100, reflections.length * 10)}%</p>
            </div>
            <div className="h-10 border-[4px] border-black bg-white p-1 flex gap-1">
              {[...Array(10)].map((_, i) => (
                <div key={i} className={`h-full flex-1 ${i < reflections.length ? 'bg-primary' : 'bg-surface-container'}`} />
              ))}
            </div>
          </div>
        </div>

        <aside className="md:col-span-4 space-y-8">
          <div className="bg-yellow-400 border-[4px] border-black p-6 shadow-[8px_8px_0_0_rgba(0,0,0,1)] relative">
            <div className="absolute -top-3 right-4 bg-black text-white px-3 py-1 font-black text-[10px] uppercase">TIP</div>
            <h3 className="text-xl font-black uppercase leading-none mb-4">Memory Expansion</h3>
            <p className="font-bold text-xs mb-6 uppercase">The more you share, the smarter the system becomes. Keep sharing to unlock deep heuristics!</p>
            <button className="w-full bg-primary text-white py-4 font-black uppercase text-lg border-[4px] border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all">
                Learn More
            </button>
          </div>

          <div className="bg-white border-[4px] border-black p-6 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-cyan-400 border-[2px] border-black flex items-center justify-center">
                <Terminal className="w-6 h-6 text-black" />
              </div>
              <h4 className="font-black uppercase text-sm">Live Kernel Stream</h4>
            </div>
            <div className="bg-black text-tertiary-fixed p-4 font-mono text-[10px] h-32 overflow-hidden leading-relaxed">
              &gt; MEMORY_NODES: {reflections.length}<br/>
              &gt; HEURISTIC_SYNC: ACTIVE<br/>
              &gt; POSITIVITY_BOOST: {reflections.length > 5 ? 'x1.2' : 'x1.0'}<br/>
              &gt; DEPTH_LEVEL: {reflections.length > 10 ? '2' : '1'}<br/>
              &gt; STATUS: STABLE<br/>
              &gt; WAITING FOR INPUT...
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
