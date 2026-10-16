import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'lime' | 'violet' | 'blue' | 'emerald' | 'amber' | 'neutral' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

export function Badge({
  children,
  variant = 'neutral',
  size = 'sm',
  className = '',
  icon,
}: BadgeProps) {
  const variantStyles = {
    lime: 'bg-lime-500/15 text-lime-400 border border-lime-500/30',
    violet: 'bg-violet-500/15 text-violet-300 border border-violet-500/30',
    blue: 'bg-sky-500/15 text-sky-300 border border-sky-500/30',
    emerald: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
    amber: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
    neutral: 'bg-slate-800/80 text-slate-300 border border-slate-700/60',
    outline: 'bg-transparent text-slate-400 border border-slate-700/80',
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-0.5 rounded-full font-medium',
    md: 'text-sm px-3 py-1 rounded-full font-medium',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 transition-colors ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
