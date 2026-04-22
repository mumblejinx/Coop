import { Section } from '../components/layout/Section';
import { useCIS } from '../state/cisStore';
import { Zap, Lightbulb, Activity, Globe } from 'lucide-react';

export default function DashboardScreen() {
  const { xp, level, getThemeStats, reflections, globalStats } = useCIS();
  const stats = getThemeStats();
  
  const xpNext = level * 1000 + 4000; 
  
  // Last 4 activities
  const recentReflections = [...reflections].slice(-4).reverse();

  return (
    <div className="space-y-8 pb-10">
      {/* Community Global Header */}
      {globalStats && (
        <div className="bg-[#2d5a27] border-[4px] border-black p-4 shadow-[8px_8px_0_0_rgba(0,0,0,1)] text-white flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Globe className="text-yellow-400 animate-spin-slow" />
            <h3 className="font-black uppercase tracking-tighter text-xl italic">The_Cooperative_Matrix</h3>
          </div>
          <div className="flex gap-8">
             <div className="text-center">
                <div className="text-[10px] uppercase font-black text-yellow-400">Total_Knowledge</div>
                <div className="text-2xl font-black italic">{globalStats.totalReflections.toLocaleString()}</div>
             </div>
             <div className="text-center">
                <div className="text-[10px] uppercase font-black text-yellow-400">Global_Harmony_XP</div>
                <div className="text-2xl font-black italic">{globalStats.totalXp.toLocaleString()}</div>
             </div>
          </div>
        </div>
      )}

      {/* Hero / Header Section */}
      <div className="bg-white border-[4px] border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] p-6 flex flex-col md:flex-row items-center gap-8">
        <div className="w-32 h-32 border-[4px] border-black bg-tertiary-fixed flex items-center justify-center relative overflow-hidden shrink-0">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9zQmmV7bwROQ_onv-VI6iN0jnLUosdnonW1eWD5_-bGjsIbzHWwmn3qyUqcc5nlJcx_1qDrQqzSaNVthXkLm43diIln1AyL1G5nhqKYghyXWMBEfR7_b-51TZ91QLdgT2dtLvpWgmGomW-EFLBewdNg9Hrug6wodkoJYY6WMEKefY-E0mgGBI6Lf-36GgTQv3maazorotCnGs1YaHgeBTpAxcezaHr2pAI1OV8EmtjeU1UB1UJh6qKT2hoTITHm3dyu0NyiQFNJE" 
            alt="Hero Avatar"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 w-full bg-black text-white text-center text-[10px] font-black py-1">
            LVL {level}
          </div>
        </div>
        
        <div className="flex-1 w-full space-y-4">
          <div className="flex justify-between items-end">
            <h2 className="text-4xl md:text-5xl font-black uppercase text-black tracking-tighter">YOUR_STATS</h2>
            <span className="text-sm font-black text-tertiary">POINTS: {xp.toLocaleString()} / {xpNext.toLocaleString()}</span>
          </div>
          
          {/* Chunky Progress Bar */}
          <div className="h-10 border-[4px] border-black bg-surface-container flex p-1 gap-1">
            {[...Array(10)].map((_, i) => {
              const currentXpProgress = (xp % 1000) / 100;
              return (
                <div 
                  key={i} 
                  className={`h-full flex-1 border-r-[2px] border-black last:border-0 ${i < Math.floor(currentXpProgress) ? 'bg-tertiary-container' : 'bg-transparent'}`}
                />
              );
            })}
          </div>
          <p className="font-bold text-lg text-black uppercase">
            TEAMWORK: <span className="text-primary font-black animate-pulse">{reflections.length > 5 ? 'DOING GREAT!' : 'JUST STARTING!'}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-8 space-y-8">
          <Section title="HOW_WE ARE_DOING" className="border-double" titleClassName="text-black">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { label: 'KINDNESS', val: stats.kindness, color: 'bg-tertiary-container', textColor: 'text-tertiary' },
                { label: 'TRUST', val: stats.trust, color: 'bg-secondary-container', textColor: 'text-secondary' },
                { label: 'FUN', val: stats.fun, color: 'bg-primary-container', textColor: 'text-primary' },
                { label: 'TEAMWORK', val: stats.teamwork, color: 'bg-black', textColor: 'text-black' },
              ].map((stat) => (
                <div key={stat.label} className="border-[4px] border-black bg-white p-4 flex flex-col gap-2 hover:bg-yellow-50 transition-none cursor-default">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-black uppercase text-sm">{stat.label}</span>
                    <span className={stat.textColor + " font-black"}>{stat.val}%</span>
                  </div>
                  <div className="h-4 border-[2px] border-black bg-surface-container flex">
                    <div className={stat.color + " h-full"} style={{ width: `${stat.val}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="border-[4px] border-black bg-secondary-fixed shadow-[8px_8px_0_0_rgba(0,0,0,1)] p-6 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer">
              <Lightbulb className="text-secondary w-10 h-10 mb-4" />
              <div className="text-4xl font-black text-black">{reflections.length}</div>
              <div className="font-black text-secondary uppercase text-sm">IDEAS_FOUND</div>
            </div>
            <div className="border-[4px] border-black bg-tertiary-fixed shadow-[8px_8px_0_0_rgba(0,0,0,1)] p-6 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer">
              <Zap className="text-tertiary w-10 h-10 mb-4" />
              <div className="text-4xl font-black text-black">{xp / 10}</div>
              <div className="font-black text-tertiary uppercase text-sm">TEAMWORK_LOOPS</div>
            </div>
          </div>
        </div>

        <aside className="md:col-span-4 space-y-8">
          <div className="bg-black text-white border-[4px] border-black border-double shadow-[8px_8px_0_0_rgba(0,0,0,1)] p-6">
            <h4 className="text-2xl font-black uppercase mb-6 text-[#FF0040]">ACTION_MENU</h4>
            <div className="grid gap-4">
              <button className="w-full bg-[#FF0040] text-white border-[4px] border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] p-4 font-black uppercase active:translate-x-1 active:translate-y-1 active:shadow-none flex items-center justify-between">
                <span>SYNC_NOW</span>
                <Activity className="w-5 h-5" />
              </button>
              <button className="w-full bg-secondary-container text-white border-[4px] border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] p-4 font-black uppercase active:translate-x-1 active:translate-y-1 active:shadow-none flex items-center justify-between">
                <span>NEW_GAME</span>
                <Zap className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="bg-white border-[4px] border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] p-6">
            <h4 className="font-black uppercase mb-4 border-b-[4px] border-black pb-2 text-sm tracking-widest">ACTIVITY_LOG</h4>
            <ul className="space-y-3 text-[11px] font-bold">
              {recentReflections.length > 0 ? recentReflections.map((r, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-secondary">[{new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}]</span>
                  <span className="text-black uppercase line-clamp-1">{r.theme}_CHECK: {r.input}</span>
                </li>
              )) : (
                 <li className="text-black/50 uppercase">No recent activity</li>
              )}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
