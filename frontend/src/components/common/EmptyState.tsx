import React from 'react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  actionIcon?: React.ReactNode;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  actionIcon,
  secondaryActionText,
  onSecondaryAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 ${className}`}
    >
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 shadow-subtle">
        {icon}
      </div>

      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
        {title}
      </h3>

      <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
        {description}
      </p>

      {(actionText || secondaryActionText) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {actionText && onAction && (
            <Button
              variant="primary"
              size="sm"
              onClick={onAction}
              leftIcon={actionIcon}
            >
              {actionText}
            </Button>
          )}

          {secondaryActionText && onSecondaryAction && (
            <Button
              variant="outline"
              size="sm"
              onClick={onSecondaryAction}
            >
              {secondaryActionText}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
