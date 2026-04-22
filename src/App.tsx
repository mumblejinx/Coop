import { useState, useEffect } from 'react';
import Dashboard from './screens/DashboardScreen';
import Mirror from './screens/MirrorScreen';
import Heuristics from './screens/HeuristicsScreen';
import { useFirebase } from './core/FirebaseProvider';
import { useCIS } from './state/cisStore';
import { useProfile } from './hooks/useProfile';
import { LayoutDashboard, Sparkles, Gavel, LogOut, User as UserIcon } from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  const [view, setView] = useState('dashboard');
  const { user, loading, logOut } = useFirebase();
  const { initSync, profile } = useCIS();

  useEffect(() => {
    if (user?.uid) {
      const unsub = initSync(user.uid);
      return () => unsub();
    }
  }, [user?.uid, initSync]);

  if (loading || (!user && view !== 'dashboard')) {
    return (
      <div className="min-h-screen bg-[#2d5a27] flex items-center justify-center p-4">
        <div className="bg-white border-[4px] border-black p-10 shadow-[8px_8px_0_0_rgba(0,0,0,1)] text-center animate-pulse">
           <p className="font-black uppercase italic tracking-widest text-[#FF0040]">Establishing Connection...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'DASH', icon: LayoutDashboard },
    { id: 'mirror', label: 'MIRROR', icon: Sparkles },
    { id: 'heuristics', label: 'LOGIC', icon: Gavel },
  ];

  return (
    <div className="min-h-screen bg-[#2d5a27] text-black font-sans pb-24">
      <header className="bg-white border-b-[4px] border-black h-16 sticky top-0 z-40 px-4">
        <div className="max-w-4xl mx-auto h-full flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 border-[3px] border-black bg-zinc-100 overflow-hidden shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
              {profile?.avatar?.src ? (
                <img src={profile.avatar.src} className="w-full h-full object-cover" alt="UserAvatar" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-black">
                   <UserIcon className="text-white w-5 h-5" />
                </div>
              )}
            </div>
            <h1 className="font-black uppercase italic tracking-tighter text-xl">P1_COOP</h1>
          </div>
          <button 
            onClick={logOut}
            className="flex items-center gap-2 text-[#FF0040] font-black uppercase text-[10px] hover:bg-red-50 px-2 py-1 border-[2px] border-transparent hover:border-black transition-all"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        {view === 'dashboard' && <Dashboard />}
        {view === 'mirror' && <Mirror />}
        {view === 'heuristics' && <Heuristics />}
      </main>

      <nav className="fixed bottom-0 left-0 w-full h-20 flex justify-around items-stretch bg-white border-t-[4px] border-black z-50 shadow-[0_-4px_0_0_rgba(0,0,0,1)]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = view === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center transition-none flex-1 font-black uppercase text-[10px] tracking-tighter",
                isActive 
                  ? "bg-[#FF0040] text-white border-x-[4px] border-black translate-y-[-4px] shadow-[0_4px_0_0_rgba(0,0,0,1)]" 
                  : "text-black hover:bg-yellow-400"
              )}
            >
              <Icon className={cn("mb-1", isActive ? "w-7 h-7" : "w-6 h-6")} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
