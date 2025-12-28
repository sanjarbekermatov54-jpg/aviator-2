
import React, { useState, useEffect } from 'react';
import { X, CreditCard, Wallet, Smartphone, ShieldCheck, User, LogOut, MessageSquare, Bell, Copy, CheckCircle2, UploadCloud } from 'lucide-react';

export const DepositModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1); // 1: Select, 2: Payment Details
  const [amount, setAmount] = useState('145 000');
  const [timeLeft, setTimeLeft] = useState(899); // 14:59 in seconds
  const [selectedMethod, setSelectedMethod] = useState('UZCARD');

  useEffect(() => {
    if (step === 2 && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [step, timeLeft]);

  if (!isOpen) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} min : ${secs.toString().padStart(2, '0')} sec`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text.replace(/\s/g, ''));
    alert('Nusxa olindi!');
  };

  const methods = [
    { name: 'UZCARD', icon: 'U', color: 'bg-blue-600' },
    { name: 'HUMO', icon: 'H', color: 'bg-orange-500' },
    { name: 'PAYME', icon: 'P', color: 'bg-teal-500' },
    { name: 'CLICK', icon: 'C', color: 'bg-indigo-600' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#1b1d20] w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 font-bold uppercase">ID #228570</span>
            <h3 className="font-black text-lg uppercase italic tracking-tighter text-white">Deposit</h3>
          </div>
          <button onClick={() => { setStep(1); onClose(); }} className="p-1 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        <div className="overflow-y-auto no-scrollbar">
          {step === 1 ? (
            /* STEP 1: AMOUNT & METHOD SELECTION */
            <div className="p-4 flex flex-col gap-4">
              <div className="bg-[#141518] p-3 rounded-xl border border-white/5">
                <span className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Pul tushiriladigan hamyon</span>
                <div className="flex items-center justify-between">
                  <span className="text-white font-black text-xl">UZS</span>
                  <input 
                    type="text" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-transparent text-right text-xl font-black outline-none text-white w-full" 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {methods.map(m => (
                  <button 
                    key={m.name} 
                    onClick={() => setSelectedMethod(m.name)}
                    className={`flex items-center gap-3 p-3 bg-[#141518] rounded-xl border transition-all group ${selectedMethod === m.name ? 'border-green-500 ring-1 ring-green-500/20' : 'border-white/5'}`}
                  >
                    <div className={`w-8 h-8 rounded-lg ${m.color} flex items-center justify-center font-black text-white shadow-lg text-xs`}>{m.icon}</div>
                    <span className={`font-bold text-xs ${selectedMethod === m.name ? 'text-white' : 'text-gray-400'}`}>{m.name}</span>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2 mt-2">
                {['500 000', '650 000', '900 000'].map(val => (
                  <button key={val} onClick={() => setAmount(val)} className="bg-[#2c2d30] py-2 rounded text-[10px] font-bold text-gray-300 border border-white/5">
                    {val} UZS
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setStep(2)}
                className="w-full bg-green-600 hover:bg-green-500 py-4 mt-2 rounded-xl font-black uppercase text-sm shadow-lg shadow-green-900/20 transition-all transform active:scale-95"
              >
                Keyingi
              </button>
            </div>
          ) : (
            /* STEP 2: PAYMENT DETAILS (KARTA CHIQADIGAN JOY) */
            <div className="p-4 flex flex-col gap-4 animate-in slide-in-from-right duration-300">
              
              {/* Guarantee Box */}
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 flex items-start gap-3">
                <CheckCircle2 className="text-green-500 shrink-0" size={20} />
                <div className="text-[10px] leading-tight">
                  <span className="text-green-500 font-bold block">O'tkazma kafolatlangan</span>
                  <span className="text-gray-400">ushbu o'tkazma mablag'larning AviatorWinn sizning hisobingizga o'tkazilishini kafolatlaydi</span>
                </div>
              </div>

              {/* Method Display */}
              <div className="flex items-center justify-between bg-[#141518] p-3 rounded-xl border border-white/5">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Method</span>
                  <span className="text-white font-black text-sm">{selectedMethod}</span>
                </div>
                <button onClick={() => setStep(1)} className="text-[10px] text-gray-400 underline uppercase font-bold">O'zgartirish</button>
              </div>

              {/* Payment Info */}
              <div className="flex flex-col gap-3">
                {/* Amount Field */}
                <div className="bg-[#141518] p-3 rounded-xl border border-white/5 flex justify-between items-center group relative">
                  <div>
                    <span className="text-[9px] text-gray-500 uppercase font-bold block mb-1">O'tkazish summa miqdori</span>
                    <span className="text-white font-black text-base">UZS {amount},00</span>
                  </div>
                  <button onClick={() => copyToClipboard(amount)} className="p-2 bg-[#2c2d30] rounded-lg text-gray-400 hover:text-white transition-colors">
                    <Copy size={16} />
                  </button>
                </div>

                {/* Card Number Field */}
                <div className="bg-[#141518] p-3 rounded-xl border border-white/5 flex justify-between items-center">
                  <div>
                    <span className="text-[9px] text-gray-500 uppercase font-bold block mb-1">O'tkazish uchun karta raqami</span>
                    <span className="text-white font-black text-base tracking-widest">5614-6820-3180-3424</span>
                  </div>
                  <button onClick={() => copyToClipboard('5614 6822 1383 7232')} className="p-2 bg-[#2c2d30] rounded-lg text-gray-400 hover:text-white transition-colors">
                    <Copy size={16} />
                  </button>
                </div>

                {/* Receipt Upload */}
                <div className="bg-[#141518] p-4 rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/5 transition-colors">
                  <UploadCloud className="text-gray-500" size={24} />
                  <span className="text-[10px] font-bold text-gray-400 uppercase">To'lov chekini yuklang</span>
                </div>
              </div>

              {/* Timer */}
              <div className="flex flex-col items-center py-2">
                <span className="text-[9px] text-gray-500 uppercase font-bold mb-1">Sizning transferringizni kutamiz</span>
                <span className="text-white font-black text-xl tabular-nums">{formatTime(timeLeft)}</span>
              </div>

              <button 
                onClick={() => { setStep(1); onClose(); }}
                className="w-full bg-[#28a745] hover:bg-green-500 py-4 rounded-xl font-black uppercase text-sm shadow-lg transition-all transform active:scale-95"
              >
                TO'LANDI
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const MenuDrawer: React.FC<{ isOpen: boolean; onClose: () => void; userId: string }> = ({ isOpen, onClose, userId }) => {
  if (!isOpen) return null;

  const menuItems = [
    { label: 'Profil', icon: <User size={18}/> },
    { label: 'Pul kirgizish', icon: <Wallet size={18}/> },
    { label: 'Pul chiqarish', icon: <CreditCard size={18}/> },
    { label: 'Tafsilot', icon: <MessageSquare size={18}/> },
    { label: 'Bildirishnomalar', icon: <Bell size={18}/> },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-black/60 animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="bg-[#1b1d20] w-72 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300" 
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-white/5">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-[#2c2d30] p-3 rounded-2xl border border-white/10">
              <span className="text-gray-400 text-[10px] font-bold block uppercase mb-1">ID #{userId}</span>
              <span className="text-white font-black text-sm uppercase">Balans: 0.00 UZS</span>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full"><X size={20}/></button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-2">
          {menuItems.map(item => (
            <button key={item.label} className="w-full flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition-colors text-gray-400 font-bold text-sm">
              <span className="text-gray-500">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        <div className="p-6 border-t border-white/5">
           <button className="w-full flex items-center gap-4 px-2 py-2 text-red-500 font-bold text-sm hover:opacity-80 transition-opacity">
             <LogOut size={18}/>
             Chiqish
           </button>
        </div>
      </div>
    </div>
  );
};
