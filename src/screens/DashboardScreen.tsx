import { useState } from 'react';
import { useFirebase } from '../core/FirebaseProvider';
import { useProfile } from '../hooks/useProfile';
import { useCIS } from '../state/cisStore';
import AvatarPicker from '../components/AvatarPicker';
import { Gamepad2, Settings } from 'lucide-react';
import { getTitle } from '../game/progression';

export default function DashboardScreen() {
  const { user } = useFirebase();
  const { saveProfile } = useProfile();
  const { xp, level, getThemeStats, profile, streak } = useCIS();
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
            <div className="w-24 h-24 border-[4px] border-black bg-tertiary-fixed overflow-hidden">
              <img 
                src={profile?.avatar?.src || defaultAvatar} 
                className="w-full h-full object-cover"
                alt="Avatar" 
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-yellow-400 border-[2px] border-black p-1">
              <Settings className="w-4 h-4 text-black" />
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-black uppercase italic tracking-tighter">
              {user?.isAnonymous ? 'GUEST_PLAYER' : (user?.displayName || 'PLAYER_ONE')}
            </h1>

            <p className="text-xs font-bold uppercase text-zinc-500 italic">
              {getTitle(level)} • LVL {level}
            </p>

            <p className="text-xs font-black text-[#FF0040]">
              🔥 STREAK: {streak}
            </p>
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

        <div className="bg-[#2d5a27] border-[4px] border-black p-8 shadow-[12px_12px_0_0_rgba(0,0,0,1)] text-white">
          <div>
            <div className="text-xs font-black uppercase text-[#7eff51] mb-1">
              Intelligence Rank
            </div>
            <div className="text-6xl font-black italic uppercase">
              LVL {level}
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {Object.entries(stats).map(([key, value]) => (
              <div key={key}>
                <div className="text-xs flex justify-between">
                  <span>{key}</span>
                  <span>{value}%</span>
                </div>
                <div className="h-2 bg-white/20">
                  <div className="h-full bg-[#7eff51]" style={{ width: `${value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border-[4px] border-black p-8 shadow-[12px_12px_0_0_rgba(0,0,0,1)]">

          <div className="flex justify-between text-xs font-black uppercase mb-2">
            <span>XP</span>
            <span>{xp}</span>
          </div>

          <div className="h-8 border-[3px] border-black bg-zinc-100 p-1">
            <div 
              className="h-full bg-[#FF0040]" 
              style={{ width: `${(xp % 1000) / 10}%` }}
            />
          </div>

        </div>
      </div>
    </div>
  );
}