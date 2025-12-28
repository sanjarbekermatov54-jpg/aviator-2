
import React, { useState, useEffect } from 'react';
import { Minus, Plus, Settings2 } from 'lucide-react';
import { GameState, Bet } from '../types';

interface BetPanelProps {
  id: string;
  onPlaceBet: (amount: number, autoCashout?: number) => void;
  onCashOut: () => void;
  isBetted: boolean;
  userBet: Bet | null;
  currentMultiplier: number;
  gameState: GameState;
  balance: number;
}

const BetPanel: React.FC<BetPanelProps> = ({ 
  onPlaceBet, onCashOut, isBetted, userBet, currentMultiplier, gameState, balance 
}) => {
  const [activeTab, setActiveTab] = useState<'bet' | 'auto'>('bet');
  const [betAmount, setBetAmount] = useState(1000);
  const [autoCashoutValue, setAutoCashoutValue] = useState<number>(1.10);
  const [isAutoBet, setIsAutoBet] = useState(false);
  const [isAutoCashoutEnabled, setIsAutoCashoutEnabled] = useState(false);

  const presets = [1000, 2000, 5000, 10000];

  // Auto-cashout logic
  useEffect(() => {
    if (isBetted && !userBet?.isCashedOut && isAutoCashoutEnabled && currentMultiplier >= autoCashoutValue && gameState === GameState.PLAYING) {
      onCashOut();
    }
  }, [currentMultiplier, isBetted, userBet, isAutoCashoutEnabled, autoCashoutValue, gameState]);

  // Auto-bet logic for next round
  useEffect(() => {
    if (isAutoBet && gameState === GameState.WAITING && !isBetted && balance >= betAmount) {
      onPlaceBet(betAmount, isAutoCashoutEnabled ? autoCashoutValue : undefined);
    }
  }, [gameState, isAutoBet, isBetted]);

  return (
    <div className="flex flex-col bg-[#252528] rounded-xl p-3 shadow-2xl border border-white/5">
      {/* Tabs */}
      <div className="flex bg-[#141518] p-1 rounded-full text-[10px] font-bold uppercase text-gray-500 mb-3">
        <button 
          onClick={() => setActiveTab('bet')}
          className={`flex-1 text-center py-1.5 rounded-full transition-all ${activeTab === 'bet' ? 'bg-[#2c2d30] text-white shadow-lg' : ''}`}
        >
          Tikish
        </button>
        <button 
          onClick={() => setActiveTab('auto')}
          className={`flex-1 text-center py-1.5 rounded-full transition-all ${activeTab === 'auto' ? 'bg-[#2c2d30] text-white shadow-lg' : ''}`}
        >
          Avto
        </button>
      </div>

      <div className="flex gap-2 h-24">
        {/* Amount Control */}
        <div className="flex flex-col flex-1 gap-2">
          <div className="bg-[#141518] rounded-lg p-2 flex justify-between items-center border border-white/5">
            <button onClick={() => setBetAmount(Math.max(100, betAmount - 100))} className="text-gray-400 p-1"><Minus size={14} /></button>
            <span className="text-sm font-black text-white">{betAmount.toLocaleString()}</span>
            <button onClick={() => setBetAmount(betAmount + 100)} className="text-gray-400 p-1"><Plus size={14} /></button>
          </div>
          <div className="grid grid-cols-2 gap-1 flex-1">
            {presets.map(p => (
              <button 
                key={p} 
                onClick={() => setBetAmount(p)}
                className="bg-[#1b1d20] hover:bg-[#2c2d30] text-[9px] font-bold rounded text-gray-400 border border-white/5"
              >
                {p.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex-1">
          {isBetted ? (
            <button 
              onClick={onCashOut}
              className="w-full h-full bg-orange-500 hover:bg-orange-400 text-white rounded-xl shadow-[0_4px_0_rgb(180,90,0)] active:shadow-none active:translate-y-1 transition-all flex flex-col items-center justify-center p-1"
            >
              <span className="text-[10px] font-black uppercase opacity-80">CHIQARISH</span>
              <span className="text-sm font-black">{(userBet!.amount * currentMultiplier).toFixed(2)}</span>
              <span className="text-[9px] font-medium">x{currentMultiplier.toFixed(2)}</span>
            </button>
          ) : (
            <button 
              disabled={gameState !== GameState.WAITING || balance < betAmount}
              onClick={() => onPlaceBet(betAmount)}
              className={`w-full h-full rounded-xl flex flex-col items-center justify-center transition-all shadow-lg ${
                gameState === GameState.WAITING 
                ? 'bg-[#28a745] hover:bg-[#218838] text-white shadow-[0_4px_0_rgb(20,100,30)] active:shadow-none active:translate-y-1' 
                : 'bg-gray-700 text-gray-400 opacity-50 cursor-not-allowed'
              }`}
            >
              <span className="text-[10px] font-black uppercase">TIKISH</span>
              <span className="text-sm font-black">{betAmount.toLocaleString()}</span>
            </button>
          )}
        </div>
      </div>

      {/* Auto Settings Drawer (visible if Auto tab active) */}
      {activeTab === 'auto' && (
        <div className="mt-3 pt-3 border-t border-white/5 grid grid-cols-2 gap-3 text-[10px]">
          <div className="flex items-center justify-between gap-2">
             <span className="text-gray-400 font-bold">Avto tikish</span>
             <button 
                onClick={() => setIsAutoBet(!isAutoBet)}
                className={`w-8 h-4 rounded-full relative transition-colors ${isAutoBet ? 'bg-green-500' : 'bg-gray-600'}`}
             >
                <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${isAutoBet ? 'left-4.5' : 'left-0.5'}`} />
             </button>
          </div>
          <div className="flex items-center justify-between gap-2">
             <span className="text-gray-400 font-bold">Avto chiq.</span>
             <div className="flex items-center bg-[#141518] rounded px-1.5 py-0.5 border border-white/10">
                <input 
                   type="number" 
                   value={autoCashoutValue} 
                   onChange={(e) => setAutoCashoutValue(parseFloat(e.target.value))}
                   className="bg-transparent text-white w-10 outline-none text-center font-bold"
                   step="0.01"
                />
                <button 
                  onClick={() => setIsAutoCashoutEnabled(!isAutoCashoutEnabled)}
                  className={`ml-1 w-4 h-4 rounded border ${isAutoCashoutEnabled ? 'bg-green-500 border-green-500' : 'border-gray-500'}`}
                >
                  {isAutoCashoutEnabled && <div className="text-[8px] text-white">✓</div>}
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface BetControlsProps {
  onPlaceBet: (panelId: string, amount: number) => void;
  onCashOut: (panelId: string) => void;
  userBets: { [key: string]: Bet | null };
  currentMultiplier: number;
  gameState: GameState;
  balance: number;
}

const BetControls: React.FC<BetControlsProps> = (props) => {
  return (
    <div className="px-2 py-3 grid grid-cols-1 md:grid-cols-2 gap-3">
      <BetPanel 
        id="panel1" 
        onPlaceBet={(amt) => props.onPlaceBet('panel1', amt)}
        onCashOut={() => props.onCashOut('panel1')}
        isBetted={!!props.userBets['panel1'] && !props.userBets['panel1']?.isCashedOut}
        userBet={props.userBets['panel1']}
        currentMultiplier={props.currentMultiplier}
        gameState={props.gameState}
        balance={props.balance}
      />
      <BetPanel 
        id="panel2" 
        onPlaceBet={(amt) => props.onPlaceBet('panel2', amt)}
        onCashOut={() => props.onCashOut('panel2')}
        isBetted={!!props.userBets['panel2'] && !props.userBets['panel2']?.isCashedOut}
        userBet={props.userBets['panel2']}
        currentMultiplier={props.currentMultiplier}
        gameState={props.gameState}
        balance={props.balance}
      />
    </div>
  );
};

export default BetControls;
