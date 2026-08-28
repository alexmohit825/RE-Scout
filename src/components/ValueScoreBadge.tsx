import React from 'react';

interface ValueScoreBadgeProps {
  score: number;
}

export const ValueScoreBadge: React.FC<ValueScoreBadgeProps> = ({ score }) => {
  let bgColor = 'bg-gray-100 text-gray-700 border-gray-300';
  let label = 'Low Yield';

  if (score >= 70) {
    bgColor = 'bg-emerald-50 text-emerald-800 border-emerald-300';
    label = 'Prime Margin';
  } else if (score >= 50) {
    bgColor = 'bg-amber-50 text-amber-800 border-amber-300';
    label = 'Reasonable';
  }

  return (
    <div className={`flex flex-col items-center px-2.5 py-1 rounded-lg border ${bgColor}`}>
      <span className="text-[10px] font-semibold uppercase tracking-wider">{label}</span>
      <div className="flex items-baseline gap-0.5">
        <span className="text-lg font-bold">{score}</span>
        <span className="text-[10px] opacity-70">/100</span>
      </div>
    </div>
  );
};
