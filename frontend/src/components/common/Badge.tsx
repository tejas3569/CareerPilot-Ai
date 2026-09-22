import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'emerald' | 'indigo' | 'amber' | 'rose' | 'slate' | 'blue';
  size?: 'sm' | 'md';
  className?: string;
  onRemove?: () => void;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'indigo',
  size = 'md',
  className = '',
  onRemove,
}) => {
  const variantStyles = {
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200/60 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800',
    amber: 'bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800',
    rose: 'bg-rose-50 text-rose-700 border-rose-200/60 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800',
    slate: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    blue: 'bg-blue-50 text-blue-700 border-blue-200/60 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[11px] font-medium',
    md: 'px-2.5 py-1 text-xs font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      <span>{children}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 hover:opacity-75 focus:outline-none"
        >
          ×
        </button>
      )}
    </span>
  );
};
