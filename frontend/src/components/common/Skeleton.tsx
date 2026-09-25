import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = 'h-4 w-full' }) => {
  return (
    <div className={`animate-shimmer bg-slate-200/80 dark:bg-slate-800/80 rounded-xl ${className}`} />
  );
};

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-card ${className}`}>
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
        <div className="space-y-1.5 flex-1">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <div className="space-y-2 pt-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </div>
    </div>
  );
};

export const SkeletonLines: React.FC<{ count?: number; className?: string }> = ({ count = 3, className = '' }) => {
  const widths = ['w-full', 'w-5/6', 'w-4/6', 'w-3/4', 'w-2/3'];
  return (
    <div className={`space-y-2.5 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className={`h-3.5 ${widths[i % widths.length]}`} />
      ))}
    </div>
  );
};
