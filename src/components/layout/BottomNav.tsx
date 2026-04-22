import { LayoutDashboard, Sparkles, Gamepad2, ScrollText, Gavel } from 'lucide-react';
import { cn } from '../../lib/utils';

interface BottomNavProps {
  current: string;
  setView: (view: string) => void;
}

export function BottomNav({ current, setView }: BottomNavProps) {
  const tabs = [
    { id: 'dashboard', label: 'DASH', icon: LayoutDashboard },
    { id: 'mirror', label: 'MIRROR', icon: Sparkles },
    { id: 'simulator', label: 'SIM', icon: Gamepad2 },
    { id: 'principles', label: 'RULES', icon: ScrollText },
    { id: 'heuristics', label: 'LOGIC', icon: Gavel },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full h-20 flex justify-around items-stretch bg-white border-t-[4px] border-black z-50 shadow-[0_-4px_0_0_rgba(0,0,0,1)]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = current === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => setView(tab.id)}
            className={cn(
              "flex flex-col items-center justify-center px-1 transition-none flex-1 font-black uppercase text-[10px] tracking-tighter",
              isActive 
                ? "bg-primary text-white border-x-[4px] border-black translate-y-[-4px] shadow-[0_4px_0_0_rgba(0,0,0,1)]" 
                : "text-black hover:bg-cyan-400"
            )}
          >
            <Icon className={cn("mb-1", isActive ? "w-7 h-7" : "w-6 h-6")} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
