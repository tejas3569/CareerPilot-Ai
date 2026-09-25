import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'emerald' | 'indigo' | 'amber' | 'rose' | 'slate' | 'blue' | 'purple' | 'cyan';
  size?: 'xs' | 'sm' | 'md';
  dot?: boolean;
  className?: string;
  onRemove?: () => void;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'indigo',
  size = 'md',
  dot = false,
  className = '',
  onRemove,
}) => {
  const variantStyles = {
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200/70 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800/80',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200/70 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/80',
    amber: 'bg-amber-50 text-amber-700 border-amber-200/70 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/80',
    rose: 'bg-rose-50 text-rose-700 border-rose-200/70 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/80',
    slate: 'bg-slate-100 text-slate-700 border-slate-200/80 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700/80',
    blue: 'bg-blue-50 text-blue-700 border-blue-200/70 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/80',
    purple: 'bg-purple-50 text-purple-700 border-purple-200/70 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800/80',
    cyan: 'bg-cyan-50 text-cyan-700 border-cyan-200/70 dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-800/80',
  };

  const dotColors = {
    indigo: 'bg-indigo-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    slate: 'bg-slate-400',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    cyan: 'bg-cyan-500',
  };

  const sizeStyles = {
    xs: 'px-1.5 py-0.5 text-[10px] font-semibold',
    sm: 'px-2 py-0.5 text-[11px] font-semibold',
    md: 'px-2.5 py-1 text-xs font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border font-medium select-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]} shrink-0 animate-pulse`} />
      )}
      <span>{children}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 -mr-0.5 p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors focus:outline-none"
          aria-label="Remove item"
        >
          <span className="text-xs leading-none font-bold">×</span>
        </button>
      )}
    </span>
  );
};
