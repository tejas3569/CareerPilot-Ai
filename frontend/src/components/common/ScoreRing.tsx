import React from 'react';

interface ScoreRingProps {
  score: number;
  maxScore?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  colorScheme?: 'indigo' | 'emerald' | 'amber' | 'blue';
}

export const ScoreRing: React.FC<ScoreRingProps> = ({
  score,
  maxScore = 100,
  size = 120,
  strokeWidth = 10,
  label = 'Score',
  sublabel,
  colorScheme = 'indigo',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(100, Math.max(0, (score / maxScore) * 100));
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const colorMap = {
    indigo: 'text-indigo-600 dark:text-indigo-400',
    emerald: 'text-emerald-600 dark:text-emerald-400',
    amber: 'text-amber-500 dark:text-amber-400',
    blue: 'text-blue-600 dark:text-blue-400',
  };

  const ringColor = colorMap[colorScheme];

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="text-slate-200 dark:text-slate-800"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className={`${ringColor} transition-all duration-1000 ease-out`}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            {score}
            {maxScore === 100 && <span className="text-sm font-semibold text-slate-400">%</span>}
          </span>
          {sublabel && (
            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {sublabel}
            </span>
          )}
        </div>
      </div>
      {label && (
        <span className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
          {label}
        </span>
      )}
    </div>
  );
};
