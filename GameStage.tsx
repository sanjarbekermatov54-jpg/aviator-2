
import React, { useEffect, useState } from 'react';
import { GameState } from '../types';

interface GameStageProps {
  multiplier: number;
  gameState: GameState;
  countdown: number;
}

const GameStage: React.FC<GameStageProps> = ({ multiplier, gameState, countdown }) => {
  const [planeX, setPlaneX] = useState(0);
  const [planeY, setPlaneY] = useState(0);

  useEffect(() => {
    if (gameState === GameState.PLAYING) {
      // Simple animation simulation based on multiplier
      // Max multiplier we visualize is around 100 for path scaling
      const factor = Math.min(10, Math.log10(multiplier) + 1);
      setPlaneX(factor * 10);
      setPlaneY(factor * 8);
    } else {
      setPlaneX(0);
      setPlaneY(0);
    }
  }, [multiplier, gameState]);

  return (
    <div className="relative h-64 w-full bg-[#141518] rounded-lg overflow-hidden my-2 border border-gray-800 flex items-center justify-center">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>

      {gameState === GameState.WAITING && (
        <div className="flex flex-col items-center animate-pulse">
           <p className="text-gray-400 text-sm uppercase font-bold mb-2">Keyingi raund kutilmoqda</p>
           <div className="relative w-16 h-16 flex items-center justify-center">
             <svg className="absolute inset-0 w-full h-full transform -rotate-90">
               <circle 
                 cx="32" cy="32" r="28" 
                 stroke="currentColor" strokeWidth="4" fill="transparent"
                 className="text-gray-800"
               />
               <circle 
                 cx="32" cy="32" r="28" 
                 stroke="currentColor" strokeWidth="4" fill="transparent"
                 strokeDasharray={176}
                 strokeDashoffset={176 - (176 * countdown / 5)}
                 className="text-red-600 transition-all duration-1000 ease-linear"
               />
             </svg>
             <span className="text-2xl font-black">{countdown}</span>
           </div>
        </div>
      )}

      {gameState === GameState.PLAYING && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-6xl md:text-8xl font-black text-white z-10 drop-shadow-2xl">
            {multiplier.toFixed(2)}x
          </div>
          
          {/* Plane & Path */}
          <svg className="absolute inset-0 w-full h-full">
            <path 
              d={`M 0 256 Q ${planeX * 5} ${256 - planeY * 5}, ${planeX * 20 + 20} ${256 - planeY * 18}`} 
              fill="none" 
              stroke="#e11d48" 
              strokeWidth="4"
              strokeLinecap="round"
            />
            <g transform={`translate(${planeX * 20}, ${256 - planeY * 18 - 20})`}>
              <PlaneIcon />
            </g>
          </svg>
        </div>
      )}

      {gameState === GameState.CRASHED && (
        <div className="flex flex-col items-center justify-center z-10">
          <div className="text-red-600 text-4xl md:text-6xl font-black mb-1 drop-shadow-lg uppercase italic">
            Uchib ketdi!
          </div>
          <div className="text-white text-7xl font-black">
            {multiplier.toFixed(2)}x
          </div>
        </div>
      )}

      {/* Partners Footer */}
      <div className="absolute bottom-2 left-4 right-4 flex justify-between items-center opacity-50">
        <div className="flex items-center gap-2">
          <span className="text-[8px] font-bold text-gray-400">OFFICIAL PARTNERS</span>
          <div className="flex gap-1">
             <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center text-[8px] text-black font-bold">U</div>
             <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center text-[8px] text-black font-bold">F</div>
          </div>
        </div>
        <div className="text-[8px] font-bold text-green-500 flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
          PROBABLY FAIR
        </div>
      </div>
    </div>
  );
};

const PlaneIcon = () => (
  <svg width="60" height="40" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
    <path d="M10 30 L80 30 L90 20 L95 25 L85 35 L80 35 L10 35 Z" fill="#e11d48" />
    <path d="M40 30 L50 10 L60 30 Z" fill="#e11d48" />
    <path d="M40 35 L50 55 L60 35 Z" fill="#e11d48" />
    <circle cx="85" cy="32.5" r="3" fill="white" />
  </svg>
);

export default GameStage;
