
import React from 'react';
import { GameHistory } from './types';

interface HistoryBarProps {
  history: GameHistory[];
}

const HistoryBar: React.FC<HistoryBarProps> = ({ history }) => {
  const getMultiplierColor = (val: number) => {
    if (val < 2) return 'text-[#913ef8] bg-[#913ef81a]';
    if (val < 10) return 'text-[#c017b2] bg-[#c017b21a]';
    return 'text-[#4e40f0] bg-[#4e40f01a]';
  };

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-[#1b1d20] overflow-x-auto no-scrollbar whitespace-nowrap border-b border-gray-800">
      {history.map((h, i) => (
        <div 
          key={h.timestamp} 
          className={`px-2 py-0.5 rounded-full text-[11px] font-bold border border-opacity-20 ${getMultiplierColor(h.multiplier)} transition-all`}
        >
          {h.multiplier.toFixed(2)}x
        </div>
      ))}
      <div className="ml-auto text-gray-500">
        <HistoryButton />
      </div>
    </div>
  );
};

const HistoryButton = () => (
  <button className="p-1 rounded bg-[#252528] text-gray-400">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  </button>
);

export default HistoryBar;
