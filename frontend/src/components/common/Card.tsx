import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hover = false, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm ${
        hover ? 'transition-all duration-200 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
