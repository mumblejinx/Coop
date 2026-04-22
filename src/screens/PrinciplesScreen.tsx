import { Section } from '../components/layout/Section';
import { Handshake, Star, Shield, Cpu, Zap, Activity, CloudDownload, Radio } from 'lucide-react';
import { cn } from '../lib/utils';

export default function PrinciplesScreen() {
  return (
    <div className="space-y-8 pb-20">
      <section className="bg-tertiary-container border-[4px] border-black p-8 shadow-[8px_8px_0_0_rgba(0,0,0,1)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 2px, transparent 0)', backgroundSize: '16px 16px' }} />
        <div className="relative z-10">
          <div className="inline-block bg-white border-[2px] border-black px-4 py-1 mb-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
            <span className="text-black font-black uppercase tracking-widest text-[10px]">Level: 01 / Basics</span>
          </div>
          <h2 className="text-white font-black text-5xl md:text-6xl uppercase mb-6 drop-shadow-[4px_4px_0_rgba(0,0,0,1)]">How to Play</h2>
          <div className="flex items-center gap-4 bg-black text-white p-6 border-[4px] border-black max-w-2xl">
            <Handshake className="w-12 h-12 text-tertiary-fixed" />
            <p className="text-3xl md:text-4xl font-black uppercase italic leading-none">Be a great team</p>
          </div>
        </div>
        <div className="absolute right-8 bottom-8 hidden lg:block">
          <div className="w-24 h-24 bg-yellow-400 border-[4px] border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] flex items-center justify-center animate-bounce">
            <Star className="w-16 h-16 text-black fill-current" />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white border-[4px] border-black p-6 shadow-[8px_8px_0_0_rgba(0,0,0,1)] flex flex-col justify-between">
          <div className="border-l-[8px] border-secondary-container pl-6">
            <h3 className="text-3xl font-black uppercase text-black mb-4">Thinking Together</h3>
            <p className="text-lg font-bold text-on-surface-variant max-w-xl">We're a team! We work together like two friends playing a favorite game, helping each other win every level.</p>
          </div>
          <div className="mt-8 flex gap-4">
            <button className="bg-primary text-white font-black uppercase px-6 py-3 border-[4px] border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-none">Join Team</button>
            <button className="bg-secondary text-white font-black uppercase px-6 py-3 border-[4px] border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-none">How to Help</button>
          </div>
        </div>

        <div className="bg-surface-container-highest border-[4px] border-black relative overflow-hidden group shadow-[8px_8px_0_0_rgba(0,0,0,1)] aspect-square md:aspect-auto">
          <img 
            className="w-full h-full object-cover grayscale contrast-125 mix-blend-multiply opacity-50 group-hover:opacity-80 transition-opacity" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDX8_gO17Z66n29Qe3myqQ5wI32cyw_1c7YDzWqCBrOiyFIV1zZUaFl5Ro5st-s8OoOr4fciNnSClNrLQWPikd2BeVMMLDImXzUwoaC_RVl6_zsbWM34b4pifqrFJLm3H_GVSpwez8a-0HE_E14MP0Q28KYMV8Msxw9ft0FdVKcZH8q-wm_KHkjrzxerkTvQvYm-WbwRJvCCNZaczdVYZEPaIUX1UiJL0XBFjhndw_hz2flHn2v_ZbUNPmxPm-zmwMKRYWIlMTKgoc" 
            alt="Hardware"
          />
          <div className="absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent">
            <p className="text-white font-black uppercase text-xl leading-tight">Reliable Gear</p>
          </div>
        </div>

        <div className="bg-white border-[4px] border-black p-6 shadow-[8px_8px_0_0_rgba(0,0,0,1)] flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-black border-[2px] border-black mb-4 flex items-center justify-center shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
            <Shield className="text-tertiary-fixed w-8 h-8" />
          </div>
          <h4 className="text-2xl font-black uppercase text-black mb-2">Safe Store</h4>
          <p className="text-xs font-black uppercase text-zinc-500 tracking-widest">Safe and Sound</p>
        </div>

        <div className="md:col-span-2 bg-secondary-container border-[4px] border-black p-6 shadow-[8px_8px_0_0_rgba(0,0,0,1)] text-white">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-1">
              <h3 className="text-3xl font-black uppercase mb-4">Grow Together</h3>
              <p className="text-lg font-bold mb-6">Every interaction makes our bond stronger. As we play more, we learn more about each other and succeed as a team!</p>
              <div className="flex flex-wrap gap-2 text-black">
                <span className="bg-white px-3 py-1 font-black text-[10px] border-[2px] border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]">SYNC</span>
                <span className="bg-white px-3 py-1 font-black text-[10px] border-[2px] border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]">BUFF</span>
                <span className="bg-white px-3 py-1 font-black text-[10px] border-[2px] border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]">BOOST</span>
              </div>
            </div>
            <div className="w-full md:w-48 h-48 bg-black border-[4px] border-black flex items-center justify-center relative shadow-[4px_4px_0_0_rgba(255,255,255,1)] shrink-0">
              <Cpu className="text-white w-20 h-20" />
              <div className="absolute -top-2 -right-2 bg-tertiary-fixed text-black font-black p-1 text-[10px] border-[2px] border-black">CPU: 99%</div>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-12">
        <h3 className="text-2xl font-black uppercase mb-6 flex items-center gap-2">
          <div className="w-4 h-4 bg-primary"></div>
          Is Team Ready?
        </h3>
        <div className="bg-surface-container border-[4px] border-black p-8 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2 font-black uppercase text-sm">
                <span>Team Sync Level</span>
                <span>8-BIT / 256</span>
              </div>
              <div className="h-10 bg-black border-[2px] border-black flex p-1 gap-1">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className={`h-full flex-1 ${i < 8 ? 'bg-tertiary-fixed' : 'bg-zinc-800'}`} />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Activity, label: 'IO PORT' },
                { icon: Zap, label: 'POWER' },
                { icon: CloudDownload, label: 'CLOUD LINK' },
                { icon: Radio, label: 'ALERTS', active: true },
              ].map((item) => (
                <div key={item.label} className={cn(
                  "bg-white border-[4px] border-black p-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none cursor-pointer",
                  item.active && "border-primary"
                )}>
                  <item.icon className={cn("w-8 h-8 mb-2", item.active && "text-primary")} />
                  <div className={cn("font-black text-[10px] uppercase", item.active && "text-primary")}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
