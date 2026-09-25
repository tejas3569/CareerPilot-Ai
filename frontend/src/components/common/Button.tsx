import React, { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'soft' | 'white' | 'inverted';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const hasDisplayOverride = className.includes('hidden') || className.includes('block') || className.includes('flex');
  const baseStyles = `${hasDisplayOverride ? '' : 'inline-flex '}items-center justify-center font-medium rounded-xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer active:scale-[0.98]`;

  const sizeStyles = {
    sm: "px-3 py-1.5 min-h-[34px] text-xs font-semibold gap-1.5",
    md: "px-4 py-2 min-h-[40px] text-sm font-semibold gap-2",
    lg: "px-6 py-3 min-h-[48px] text-base font-bold gap-2.5",
  };

  const variantStyles = {
    primary: "bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white shadow-sm hover:shadow-md shadow-indigo-500/20 dark:shadow-none border border-transparent",
    secondary: "bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 border border-transparent",
    outline: "border-2 border-slate-300 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-indigo-500 dark:hover:border-indigo-400 shadow-subtle",
    soft: "bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/60",
    danger: "bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white shadow-sm hover:shadow-rose-500/20 border border-transparent",
    ghost: "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-transparent",
    white: "bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-950 font-bold shadow-md hover:shadow-lg border border-slate-200/80",
    inverted: "bg-slate-900/90 hover:bg-slate-800 active:bg-slate-950 text-white font-bold border-2 border-indigo-400/80 hover:border-indigo-300 shadow-lg",
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current shrink-0" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
