'use client';

import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  iconPosition = 'left',
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    'relative inline-flex items-center justify-center font-medium transition-all duration-150 ease-out active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 select-none cursor-pointer';

  const variants = {
    primary:
      'bg-lime-400 text-slate-950 hover:bg-lime-300 shadow-[0_0_20px_rgba(163,230,53,0.25)] hover:shadow-[0_0_25px_rgba(163,230,53,0.4)] border border-lime-300/40 rounded-xl font-semibold',
    secondary:
      'bg-slate-800/90 text-slate-100 hover:bg-slate-700/90 border border-slate-700/70 rounded-xl hover:border-slate-600',
    ghost:
      'bg-transparent text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 rounded-xl',
    outline:
      'bg-transparent text-slate-200 border border-slate-700 hover:border-slate-500 hover:bg-slate-800/40 rounded-xl',
    danger:
      'bg-red-500/15 text-red-300 border border-red-500/30 hover:bg-red-500/25 rounded-xl',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-6 py-3 gap-2.5',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
          {children}
          {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
        </>
      )}
    </button>
  );
}
