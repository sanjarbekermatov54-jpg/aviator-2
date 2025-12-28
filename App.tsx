
import React, { useState, useEffect, useRef } from 'react';
import { History, Info, Settings } from 'lucide-react';
import { GameState, Bet, GameHistory } from './types';
import { GameEngine } from './GameEngine';
import Header from './components/Header';
import HistoryBar from './components/HistoryBar';
import GameStage from './components/GameStage';
import BetControls from './components/BetControls';
import BetList from './components/BetList';
import { DepositModal, MenuDrawer } from './components/Modals';

const STORAGE_KEY = 'aviator_balance_v2';
const INITIAL_BALANCE = 500000;

const App: React.FC = () => {
  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? parseInt(saved, 10) : INITIAL_BALANCE;
  });

  const [engineState, setEngineState] = useState({
    gameState: GameState.WAITING,
    multiplier: 1.0,
    nextRoundTime: 0,
    history: [] as GameHistory[],
    roundHash: ''
  });

  const [userBets, setUserBets] = useState<{ [key: string]: Bet | null }>({
    panel1: null,
    panel2: null
  });

  const [liveBets, setLiveBets] = useState<Bet[]>([]);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const engineRef = useRef<GameEngine | null>(null);

  useEffect(() => {
    if (!engineRef.current) {
      engineRef.current = new GameEngine((state) => {
        setEngineState(state);
      });
    }
    localStorage.setItem(STORAGE_KEY, balance.toString());
  }, [balance]);

  useEffect(() => {
    if (engineState.gameState === GameState.WAITING) {
      setUserBets({ panel1: null, panel2: null });
      generateLiveBets();
    }
  }, [engineState.gameState]);

  const generateLiveBets = () => {
    const names = ['Abror', 'Sardor', 'Nigora', 'Jasur', 'Doston', 'Shahlo', 'Aziz', 'Murod', 'Lola'];
    const count = 15 + Math.floor(Math.random() * 20);
    const newBets: Bet[] = Array.from({ length: count }).map((_, i) => ({
      id: Math.random().toString(36).substr(2, 9),
      user: names[Math.floor(Math.random() * names.length)] + (Math.random() > 0.4 ? '***' : ''),
      amount: Math.floor(Math.random() * 500000) + 1000,
      isCashedOut: false,
      timestamp: Date.now()
    }));
    setLiveBets(newBets);
  };

  useEffect(() => {
    if (engineState.gameState === GameState.PLAYING) {
      const interval = setInterval(() => {
        setLiveBets(prev => prev.map(bet => {
          if (!bet.isCashedOut && Math.random() < 0.04) {
            return { 
              ...bet, 
              isCashedOut: true, 
              multiplier: parseFloat(engineState.multiplier.toFixed(2)), 
              winAmount: bet.amount * engineState.multiplier 
            };
          }
          return bet;
        }));
      }, 400);
      return () => clearInterval(interval);
    }
  }, [engineState.gameState, engineState.multiplier]);

  const placeBet = (panelId: string, amount: number) => {
    if (balance < amount || engineState.gameState !== GameState.WAITING) return;
    setBalance(prev => prev - amount);
    setUserBets(prev => ({
      ...prev,
      [panelId]: {
        id: `user-${panelId}`,
        user: 'Siz',
        amount,
        isCashedOut: false,
        timestamp: Date.now()
      }
    }));
  };

  const cashOut = (panelId: string) => {
    const bet = userBets[panelId];
    if (bet && !bet.isCashedOut && engineState.gameState === GameState.PLAYING) {
      const win = bet.amount * engineState.multiplier;
      setBalance(prev => prev + win);
      setUserBets(prev => ({
        ...prev,
        [panelId]: { ...bet, isCashedOut: true, multiplier: engineState.multiplier, winAmount: win }
      }));
    }
  };

  const countdown = Math.max(0, Math.ceil((engineState.nextRoundTime - Date.now()) / 1000));

  // Flatten active user bets for the list
  const activeUserBets = Object.values(userBets).filter(b => b !== null) as Bet[];

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-[#1b1d20] select-none text-white overflow-hidden shadow-2xl relative">
      <Header 
        balance={balance} 
        onOpenDeposit={() => setIsDepositOpen(true)} 
        onOpenMenu={() => setIsMenuOpen(true)} 
      />
      
      <main className="flex-1 overflow-y-auto no-scrollbar bg-[#1b1d20]">
        <HistoryBar history={engineState.history} />
        
        <GameStage 
          multiplier={engineState.multiplier} 
          gameState={engineState.gameState} 
          countdown={countdown}
        />
        
        <BetControls 
          onPlaceBet={placeBet}
          onCashOut={cashOut}
          userBets={userBets}
          currentMultiplier={engineState.multiplier}
          gameState={engineState.gameState}
          balance={balance}
        />
        
        <BetList liveBets={liveBets} userBet={activeUserBets[0] || null} />
      </main>

      {/* Persistent Footer Nav */}
      <nav className="bg-[#141518] p-3 flex justify-around items-center border-t border-white/5 text-gray-500 text-[10px] font-bold uppercase tracking-wider z-40">
         <div className="flex flex-col items-center gap-1 text-red-500"><History size={18}/><span>O'yin</span></div>
         <div className="flex flex-col items-center gap-1 hover:text-white cursor-pointer"><Settings size={18}/><span>Sozlamalar</span></div>
         <div className="flex flex-col items-center gap-1 hover:text-white cursor-pointer"><Info size={18}/><span>Ma'lumot</span></div>
      </nav>

      {/* Modals */}
      <DepositModal isOpen={isDepositOpen} onClose={() => setIsDepositOpen(false)} />
      <MenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} userId="246570" />
    </div>
  );
};

export default App;
