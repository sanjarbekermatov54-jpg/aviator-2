
import React from 'react';
import { Menu, Wallet } from 'lucide-react';

interface HeaderProps {
  balance: number;
  onOpenDeposit: () => void;
  onOpenMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ balance, onOpenDeposit, onOpenMenu }) => {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-[#1b1d20] sticky top-0 z-50 border-b border-white/5">
      <div className="flex items-center gap-2">
        <button onClick={onOpenMenu} className="text-gray-400 hover:text-white">
          <Menu size={26} />
        </button>
        <div className="flex items-center">
          <span className="text-red-600 font-black italic text-2xl tracking-tighter">Aviator</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center bg-[#141518] rounded-full px-3 py-1.5 border border-gray-700 shadow-inner">
          <span className="text-green-500 font-bold text-sm mr-1">
            {balance.toLocaleString('uz-UZ').replace(/,/g, ' ')}
          </span>
          <span className="text-gray-400 text-[10px] font-medium mr-2">UZS</span>
          <div className="w-[1px] h-4 bg-gray-700 mr-2"></div>
          <button 
            onClick={onOpenDeposit}
            className="bg-[#28a745] hover:bg-[#218838] text-white px-3 py-1 rounded text-[10px] font-black uppercase transition-all transform active:scale-95 shadow-lg shadow-green-900/20"
          >
            Pul kirgizish
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
