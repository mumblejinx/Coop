import { useEffect, useState } from 'react';
import { useFirebase } from '../core/FirebaseProvider';
import { useProfile } from '../hooks/useProfile';
import { useCIS } from '../state/cisStore';
import AvatarPicker from '../components/AvatarPicker';
import { Gamepad2, Settings } from 'lucide-react';

export default function DashboardScreen() {
  const { user } = useFirebase();
  const { saveProfile } = useProfile();
  const { xp, level, getThemeStats, profile } = useCIS();
  const stats = getThemeStats();

  const [open, setOpen] = useState(false);

  const defaultAvatar = 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9zQmmV7bwROQ_onv-VI6iN0jnLUosdnonW1eWD5_-bGjsIbzHWwmn3qyUqcc5nlJcx_1qDrQqzSaNVthXkLm43diIln1AyL1G5nhqKYghyXWMBEfR7_b-51TZ91QLdgT2dtLvpWgmGomW-EFLBewdNg9Hrug6wodkoJYY6WMEKefY-E0mgGBI6Lf-36GgTQv3maazorotCnGs1YaHgeBTpAxcezaHr2pAI1OV8EmtjeU1UB1UJh6qKT2hoTITHm3dyu0NyiQFNJE';

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center bg-white border-[4px] border-black p-6 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
        <div className="flex items-center gap-6">
          <div 
            onClick={() => setOpen(true)}
            className="group relative cursor-pointer"
          >
            <div className="w-24 h-24 border-[4px] border-black bg-tertiary-fixed overflow-hidden transition-transform group-hover:scale-105 active:scale-95">
              <img 
                src={profile?.avatar?.src || defaultAvatar} 
                className="w-full h-full object-cover"
                alt="Avatar" 
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-yellow-400 border-[2px] border-black p-1 shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
              <Settings className="w-4 h-4 text-black" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase italic tracking-tighter">
              {user?.isAnonymous ? 'GUEST_PLAYER' : (user?.displayName || 'PLAYER_ONE')}
            </h1>
            <p className="text-xs font-bold uppercase text-zinc-500 italic">Sync Level: {level}</p>
          </div>
        </div>
        <Gamepad2 className="w-12 h-12 text-[#FF0040] hidden sm:block" />
      </div>

      {open && (
        <AvatarPicker
          level={level}
          onClose={() => setOpen(false)}
          onSelect={(a) => {
            if (user) {
              saveProfile(user.uid, { avatar: a });
              setOpen(false);
            }
          }}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#2d5a27] border-[4px] border-black p-8 shadow-[12px_12px_0_0_rgba(0,0,0,1)] text-white flex flex-col justify-between">
           <div>
             <div className="text-xs font-black uppercase text-[#7eff51] tracking-widest mb-1">Intelligence Rank</div>
             <div className="text-6xl font-black italic uppercase">LVL {level}</div>
           </div>
           
           <div className="mt-8 space-y-4">
             <div className="text-[10px] font-black uppercase text-white/60">Core Vibe Matrix</div>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                   <div className="text-[10px] font-black uppercase flex justify-between">
                      <span>Kindness</span>
                      <span>{stats.kindness}%</span>
                   </div>
                   <div className="h-1 bg-white/20"><div className="h-full bg-[#7eff51]" style={{ width: `${stats.kindness}%` }} /></div>
                </div>
                <div className="space-y-1">
                   <div className="text-[10px] font-black uppercase flex justify-between">
                      <span>Trust</span>
                      <span>{stats.trust}%</span>
                   </div>
                   <div className="h-1 bg-white/20"><div className="h-full bg-cyan-400" style={{ width: `${stats.trust}%` }} /></div>
                </div>
                <div className="space-y-1">
                   <div className="text-[10px] font-black uppercase flex justify-between">
                      <span>Fun</span>
                      <span>{stats.fun}%</span>
                   </div>
                   <div className="h-1 bg-white/20"><div className="h-full bg-yellow-400" style={{ width: `${stats.fun}%` }} /></div>
                </div>
                <div className="space-y-1">
                   <div className="text-[10px] font-black uppercase flex justify-between">
                      <span>Teamwork</span>
                      <span>{stats.teamwork}%</span>
                   </div>
                   <div className="h-1 bg-white/20"><div className="h-full bg-orange-400" style={{ width: `${stats.teamwork}%` }} /></div>
                </div>
             </div>
           </div>

           <div className="mt-4 pt-4 border-t-[2px] border-white/20">
             <div className="text-[10px] font-black uppercase">Next Unlock at Level {level + 1}</div>
           </div>
        </div>

        <div className="bg-white border-[4px] border-black p-8 shadow-[12px_12px_0_0_rgba(0,0,0,1)] space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between font-black text-xs uppercase">
              <span>Experience Pool</span>
              <span className="text-[#FF0040]">{xp} XP</span>
            </div>
            <div className="h-8 border-[3px] border-black bg-zinc-100 p-1">
              <div 
                className="h-full bg-[#FF0040] transition-all duration-700" 
                style={{ width: `${(xp % 1000) / 10}%` }}
              />
            </div>
          </div>
          
          <div className="bg-zinc-50 p-4 border-[2px] border-black flex items-center justify-between">
            <div className="text-[10px] font-black uppercase">Current Bond Stability</div>
            <div className="text-xl font-black uppercase text-tertiary-container italic">{(xp / 100).toFixed(1)}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
