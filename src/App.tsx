import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import DashboardScreen from './screens/DashboardScreen';
import MirrorScreen from './screens/MirrorScreen';
import SimulatorScreen from './screens/SimulatorScreen';
import PrinciplesScreen from './screens/PrinciplesScreen';
import HeuristicsScreen from './screens/HeuristicsScreen';
import { BottomNav } from './components/layout/BottomNav';
import { Gamepad2, User as UserIcon, LogIn } from 'lucide-react';
import { useFirebase } from './components/FirebaseProvider';
import { useSyncCIS } from './hooks/useSyncCIS';

export default function App() {
  const [view, setView] = useState('dashboard');
  const { user, loading, signIn, signInAsGuest, logOut } = useFirebase();
  
  // Connect store to Firestore
  useSyncCIS(user?.uid);

  const renderView = () => {
    switch (view) {
      case 'dashboard': return <DashboardScreen />;
      case 'mirror': return <MirrorScreen />;
      case 'simulator': return <SimulatorScreen />;
      case 'principles': return <PrinciplesScreen />;
      case 'heuristics': return <HeuristicsScreen />;
      default: return <DashboardScreen />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#2d5a27] flex items-center justify-center">
        <div className="bg-white border-[4px] border-black p-8 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
          <p className="font-black animate-pulse uppercase tracking-widest">Waking Up Brain...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#2d5a27] flex items-center justify-center p-4">
        <div className="bg-white border-[4px] border-black p-10 shadow-[8_8px_0_0_rgba(0,0,0,1)] max-w-sm w-full text-center space-y-6">
          <div className="flex justify-center">
            <Gamepad2 className="text-[#FF0040] w-16 h-16" />
          </div>
          <h1 className="text-3xl font-black italic uppercase">Player_One_Coop</h1>
          <p className="font-bold uppercase text-sm">Welcome back, teammate. Let's sync your intelligence stream.</p>
          <button 
            onClick={signIn}
            className="w-full bg-[#FF0040] text-white border-[4px] border-black py-4 font-black uppercase flex items-center justify-center gap-3 shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            <LogIn className="w-6 h-6" />
            Sign in with Google
          </button>
          
          <button 
            onClick={signInAsGuest}
            className="w-full bg-[#2d5a27] text-white border-[4px] border-black py-3 font-black uppercase flex items-center justify-center gap-3 shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none hover:bg-[#3d7a34]"
          >
            Continue as Guest
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2d5a27] font-sans">
      {/* Top App Bar */}
      <header className="bg-white border-b-[4px] border-black w-full sticky top-0 z-50 h-16 shadow-[0_4px_0_0_rgba(0,0,0,1)]">
        <div className="max-w-7xl mx-auto px-4 h-full flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Gamepad2 className="text-[#FF0040] w-8 h-8" />
            <h1 className="text-2xl font-black text-[#FF0040] italic tracking-widest uppercase cursor-pointer" onClick={() => setView('dashboard')}>
              PLAYER_ONE_COOP
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex gap-6 items-center">
              {[
                { label: 'DASH', view: 'dashboard' },
                { label: 'MIRROR', view: 'mirror' },
                { label: 'SIM', view: 'simulator' },
                { label: 'LOGIC', view: 'heuristics' }
              ].map((tab) => (
                <button 
                  key={tab.label}
                  onClick={() => setView(tab.view)}
                  className={`font-black uppercase text-xs px-2 py-1 transition-none ${view === tab.view ? 'bg-yellow-400 text-black' : 'text-black hover:bg-yellow-100'}`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
            <div className="flex items-center gap-2">
               <button 
                 onClick={logOut}
                 className="text-[#FF0040] font-black uppercase text-[10px] hover:underline"
               >
                 LOG_OUT
               </button>
               <button className="text-[#FF0040] hover:scale-110 transition-transform">
                 <UserIcon className="w-8 h-8" />
               </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="pt-10 pb-24 px-4 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav current={view} setView={setView} />
    </div>
  );
}
