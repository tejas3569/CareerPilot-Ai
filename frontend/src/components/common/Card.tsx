import React, { ReactNode } from 'react';

export interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'elevated' | 'glass' | 'subtle';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  onClick,
  variant = 'default',
  padding = 'md',
}) => {
  const paddingMap = {
    none: 'p-0',
    sm: 'p-4 sm:p-5',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  const variantMap = {
    default: 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-card',
    elevated: 'bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-md',
    glass: 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-card',
    subtle: 'bg-[#F5EFEB]/80 dark:bg-slate-900/40 border border-stone-200/80 dark:border-slate-800/60',
  };

  const hoverStyles = hover
    ? 'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer'
    : '';

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl ${variantMap[variant]} ${paddingMap[padding]} ${hoverStyles} ${className}`}
    >
      {children}
    </div>
  );
};
