
import React from 'react';
import { Bet } from './types';

interface BetListProps {
  liveBets: Bet[];
  userBet: Bet | null;
}

const BetList: React.FC<BetListProps> = ({ liveBets, userBet }) => {
  const allBets = userBet ? [userBet, ...liveBets] : liveBets;
  
  // Calculate total winnings for the current simulated session
  const totalWins = liveBets.reduce((acc, bet) => acc + (bet.winAmount || 0), 0);

  return (
    <div className="mt-4 mx-2 bg-[#141518] rounded-xl overflow-hidden border border-white/5 flex flex-col shadow-inner">
      {/* Tabs */}
      <div className="flex p-1.5 bg-[#1b1d20] gap-1">
        <button className="flex-1 bg-[#2c2d30] text-white text-[9px] font-black py-2 rounded-full uppercase shadow-lg">Barcha tikishlar</button>
        <button className="flex-1 text-gray-500 text-[9px] font-bold py-2 rounded-full uppercase hover:text-gray-300">Mening tikishlarim</button>
        <button className="flex-1 text-gray-500 text-[9px] font-bold py-2 rounded-full uppercase hover:text-gray-300">Top</button>
      </div>

      <div className="px-4 py-2 bg-[#141518] border-b border-white/5 flex justify-between items-center text-[9px] font-bold text-gray-500 uppercase tracking-tight">
        <div className="flex items-center gap-1.5">
           <span className="text-white bg-[#2c2d30] px-1.5 py-0.5 rounded">{allBets.length}</span>
           <span>O'yinchilar</span>
        </div>
        <div className="flex items-center gap-1.5">
           <span>Jami yutuq:</span>
           <span className="text-green-500">{totalWins.toLocaleString('uz-UZ')} UZS</span>
        </div>
      </div>

      <div className="max-h-[300px] overflow-y-auto no-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="text-[8px] text-gray-500 uppercase sticky top-0 bg-[#141518] z-10 border-b border-white/5">
            <tr>
              <th className="px-4 py-2 font-medium">O'yinchi</th>
              <th className="px-4 py-2 font-medium">Tikish</th>
              <th className="px-4 py-2 font-medium text-center">X</th>
              <th className="px-4 py-2 font-medium text-right">Yutuq</th>
            </tr>
          </thead>
          <tbody className="text-[10px] font-medium">
            {allBets.map((bet) => (
              <tr 
                key={bet.id} 
                className={`transition-colors duration-300 ${
                  bet.user === 'Siz' ? 'bg-green-500/10' : 
                  bet.isCashedOut ? 'bg-green-500/5' : 'hover:bg-white/5'
                }`}
              >
                <td className="px-4 py-1.5 flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center overflow-hidden border border-white/10">
                    <img src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${bet.user}`} alt="" />
                  </div>
                  <span className={`${bet.user === 'Siz' ? 'text-green-400 font-bold' : 'text-gray-400'}`}>{bet.user}</span>
                </td>
                <td className="px-4 py-1.5 text-gray-200">
                  {bet.amount.toLocaleString()}
                </td>
                <td className="px-4 py-1.5 text-center">
                  {bet.isCashedOut && (
                    <span className="px-1.5 py-0.5 rounded-full bg-[#913ef820] text-[#913ef8] font-black text-[8px] border border-[#913ef830]">
                      {bet.multiplier?.toFixed(2)}x
                    </span>
                  )}
                </td>
                <td className="px-4 py-1.5 text-right font-black text-white">
                  {bet.isCashedOut ? (
                    <span className="text-green-500">+{bet.winAmount?.toLocaleString()}</span>
                  ) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BetList;
