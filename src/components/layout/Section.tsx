import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface SectionProps {
  title: string;
  children: ReactNode;
  className?: string;
  titleClassName?: string;
  variant?: 'white' | 'green' | 'black' | 'yellow' | 'blue';
}

export function Section({ title, children, className, titleClassName, variant = 'white' }: SectionProps) {
  const variants = {
    white: "bg-white border-black",
    green: "bg-[#2d5a27] border-black text-white",
    black: "bg-black border-black text-white",
    yellow: "bg-yellow-400 border-black",
    blue: "bg-secondary-container border-black text-white"
  };

  return (
    <div className={cn("space-y-2", className)}>
      <h2 className={cn(
        "text-sm font-black uppercase tracking-widest",
        variant === 'green' || variant === 'black' || variant === 'blue' ? "text-tertiary-fixed" : "text-primary",
        titleClassName
      )}>
        {title}
      </h2>
      <div className={cn(
        "border-[4px] p-6 shadow-[8px_8px_0_0_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition-all",
        variants[variant]
      )}>
        {children}
      </div>
    </div>
  );
}
