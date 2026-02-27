
import React from 'react';
import { Bonus } from '../types';
import { CloseIcon } from './icons/GenericIcons';

interface BonusRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  bonus: Bonus;
}

const BonusRulesModal: React.FC<BonusRulesModalProps> = ({ isOpen, onClose, bonus }) => {
  if (!isOpen) return null;

  const isVoucher = bonus.category === 'voucher';
  const multiplier = bonus.wageringRequirement.target / bonus.principal;
  const daysLeft = Math.ceil((bonus.expiresAt - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-white w-full max-w-sm rounded-xl shadow-2xl overflow-hidden flex flex-col text-slate-800 animate-slide-up" onClick={e => e.stopPropagation()}>
        
        {/* Header - Dark Gray */}
        <header className="bg-zinc-700 p-6 flex justify-center items-center relative">
          <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">{bonus.title}</h3>
          <button onClick={onClose} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors">
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>

        {/* Content - White with Structured List */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* 卷面金额 */}
          <section className="space-y-1">
            <div className="flex items-baseline space-x-2">
              <h4 className="text-xl font-black text-slate-800 tracking-tight">卷面金额:</h4>
              <span className="text-xl font-black text-slate-800 font-mono">{bonus.principal.toLocaleString()} ₽</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed font-bold italic">
              *可用用于下注但不能直接提现，需完成流水后由赢额转为可提现现金金额。
            </p>
          </section>

          {/* 流水类型 */}
          <section className="space-y-1">
             <div className="flex items-baseline space-x-2">
              <h4 className="text-xl font-black text-slate-800 tracking-tight">流水类型:</h4>
              <span className="text-xl font-black text-slate-800">{isVoucher ? '现金券流水' : 'Bonus场流水'}</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed font-bold italic">
              *可用用于下注但不能直接提现，需完成流水后低于最高可赢额的部分可转为可提现金额。
            </p>
          </section>

          {/* 最高赢额 */}
          {!isVoucher && bonus.maxWinnings && (
             <section className="space-y-1">
              <div className="flex items-baseline space-x-2">
                <h4 className="text-xl font-black text-slate-800 tracking-tight">最高赢额:</h4>
                <span className="text-xl font-black text-slate-800 font-mono">{bonus.maxWinnings.toLocaleString()} ₽</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed font-bold italic">
                *使用本 Bonus 产生的最高可兑换为现金的钱为 {bonus.maxWinnings} ₽，超过部分将不会计入可提现金额。
              </p>
            </section>
          )}

          {/* 流水要求 */}
          <section className="space-y-1">
            <div className="flex items-baseline space-x-2">
              <h4 className="text-xl font-black text-slate-800 tracking-tight">流水要求:</h4>
              <span className="text-xl font-black text-slate-800 font-mono">
                {bonus.wageringRequirement.target.toLocaleString()} ₽ 
                <span className="text-slate-400 text-sm ml-1 font-bold">(x{multiplier})</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed font-bold italic">
              *需要在适用游戏场次中累计下注金额，视为完成流水，完成后可提现。
            </p>
          </section>

          {/* 有效期 */}
          <section className="space-y-1">
            <div className="flex items-baseline space-x-2">
              <h4 className="text-xl font-black text-slate-800 tracking-tight">有效期:</h4>
              <span className="text-xl font-black text-slate-800 font-mono">{daysLeft > 0 ? `${daysLeft}天` : '已过期'}</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed font-bold italic">
              *需在有效期内完成流水并结算，逾期未完成的 Bonus 及其锁定赢额将自动失效。
            </p>
          </section>

          {/* 适用游戏 */}
          <section className="space-y-1">
            <div className="flex items-baseline space-x-2">
              <h4 className="text-xl font-black text-slate-800 tracking-tight">适用游戏:</h4>
              <span className="text-lg font-black text-slate-800 tracking-tighter">
                {bonus.supportedGames?.join('、') || '全部游戏'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed font-bold italic">
              适用的游戏中进行下注，流水和赢额才会计入流水。
            </p>
          </section>
        </main>

        {/* Footer - Gray with Blue Button */}
        <footer className="bg-zinc-700 p-6 flex justify-center items-center">
          <button 
            onClick={onClose}
            className="w-full max-w-[200px] bg-sky-500 hover:bg-sky-400 text-white font-black py-3 rounded-md text-xl shadow-lg transition-all active:scale-95"
          >
            确认
          </button>
        </footer>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default BonusRulesModal;
