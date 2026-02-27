
import React, { useState, useEffect, useMemo } from 'react';
import { Bonus, BonusStatus, RewardCategory } from '../types';
import { 
    CheckIcon, 
    ChevronRightIcon, 
    InformationCircleIcon, 
    ClockIcon, 
    ExclamationTriangleIcon,
    RocketLaunchIcon,
    PuzzlePieceIcon,
    SparklesIcon,
    BanknotesIcon
} from './icons/GenericIcons';

interface BonusCardProps {
  bonus: Bonus;
  onAction: (id: string, action: string) => void;
  isActivatedSlot?: boolean; // 是否处于顶部的激活占位区
  onShowRules: (bonus: Bonus) => void; // 新增：显示规则的回调
}

const formatTimeLeft = (milliseconds: number): string => {
  if (milliseconds <= 0) return "00:00:00";
  const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
  const hours = Math.floor((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
  
  if (days > 0) return `${days}天 ${hours}h`;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const getStatusConfig = (status: BonusStatus) => {
    switch (status) {
        case 'active': return { text: '激活中', bg: 'bg-blue-500/20 text-blue-400' };
        case 'locked': return { text: '解锁中', bg: 'bg-green-500/20 text-green-400' };
        case 'pending_claim': return { text: '待领取', bg: 'bg-yellow-500/20 text-yellow-400' };
        case 'queued': return { text: '排队中', bg: 'bg-slate-700 text-slate-400' };
        case 'completed': return { text: '已完成', bg: 'bg-green-600 text-white' };
        case 'expired': return { text: '已过期', bg: 'bg-red-900/40 text-red-400' };
        case 'void': return { text: '已放弃', bg: 'bg-gray-700 text-gray-500' };
        default: return { text: status, bg: 'bg-slate-700 text-gray-400' };
    }
};

const BonusCard: React.FC<BonusCardProps> = ({ bonus, onAction, isActivatedSlot = false, onShowRules }) => {
  const [timeLeft, setTimeLeft] = useState(bonus.expiresAt - Date.now());

  useEffect(() => {
    if (!['active', 'locked', 'pending_claim'].includes(bonus.status)) return;
    const timer = setInterval(() => {
      const remaining = bonus.expiresAt - Date.now();
      setTimeLeft(remaining > 0 ? remaining : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, [bonus.expiresAt, bonus.status]);

  const displayTime = useMemo(() => formatTimeLeft(timeLeft), [timeLeft]);
  const statusConfig = getStatusConfig(bonus.status);
  const isVoucher = bonus.category === 'voucher';
  const isDead = bonus.status === 'expired' || bonus.status === 'void';
  
  // 视觉主题色
  const themeClasses = isVoucher 
    ? "border-emerald-500/30 bg-emerald-500/5 group-hover:border-emerald-500/50" 
    : "border-purple-500/30 bg-purple-500/5 group-hover:border-purple-500/50";
  
  const accentColor = isVoucher ? "text-emerald-400" : "text-purple-400";
  const progressColor = isVoucher ? "bg-emerald-500" : "bg-purple-500";

  const progressPercent = bonus.wageringRequirement.target > 0 
    ? Math.min((bonus.wageringRequirement.current / bonus.wageringRequirement.target) * 100, 100) 
    : 0;

  const renderActionButtons = () => {
    if (isDead || bonus.status === 'completed') return null;
    
    if (bonus.status === 'queued') {
        return (
            <button 
                onClick={() => onAction(bonus.id, 'promote')}
                className="w-full flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-black py-2.5 rounded-xl text-[10px] uppercase tracking-widest transition-all active:scale-95 border border-white/5"
            >
                <RocketLaunchIcon className="w-3.5 h-3.5" />
                <span>优先排队</span>
            </button>
        );
    }

    return (
        <div className="flex space-x-2">
            <button 
                onClick={() => onAction(bonus.id, 'play')} 
                className={`flex-1 ${isVoucher ? 'bg-emerald-600' : 'bg-purple-600'} hover:opacity-90 text-white font-black py-2.5 rounded-xl text-xs uppercase tracking-widest transition-all shadow-lg`}
            >
                立即打码
            </button>
            <button 
                onClick={() => onAction(bonus.id, 'forfeit')} 
                className="px-4 py-2.5 bg-slate-800 hover:bg-red-900/20 text-slate-400 hover:text-red-400 font-bold rounded-xl text-xs transition-all border border-white/5"
            >
                放弃
            </button>
        </div>
    );
  };

  return (
    <div className={`group relative flex flex-col rounded-[2rem] border-2 p-5 space-y-4 transition-all ${themeClasses} ${isDead ? 'opacity-50 grayscale' : 'opacity-100'} ${isActivatedSlot ? 'shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]' : ''}`}>
      
      {/* 顶部：类别与状态 */}
      <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
              <div className={`p-2 rounded-xl bg-black/40 border border-white/5 ${accentColor}`}>
                  {isVoucher ? <BanknotesIcon className="w-4 h-4" /> : <SparklesIcon className="w-4 h-4" />}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${accentColor}`}>
                  {isVoucher ? '现金券 Voucher' : '奖金 Bonus'}
              </span>
          </div>
          <div className="flex items-center space-x-2">
              <button 
                onClick={() => onShowRules(bonus)}
                className="p-1.5 rounded-full bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                title="规则说明"
              >
                  <InformationCircleIcon className="w-5 h-5" />
              </button>
              <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${statusConfig.bg}`}>
                  {statusConfig.text}
              </span>
          </div>
      </div>

      {/* 金额展示区域 */}
      <div className="flex justify-between items-end">
          <div className="space-y-1">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                  {isVoucher ? '卷面金额 (Value)' : 'Bonus 余额 (Balance)'}
              </p>
              <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-black text-white font-mono tracking-tighter">
                      {bonus.lockedWinnings > 0 ? bonus.lockedWinnings.toLocaleString() : bonus.principal.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-slate-600 uppercase">RUB</span>
              </div>
          </div>
          
          {!isVoucher && bonus.maxWinnings && (
            <div className="text-right pb-1">
                 <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">最高可赢 (Max Win)</p>
                 <p className="text-sm font-black text-slate-300 font-mono italic">
                     {bonus.maxWinnings.toLocaleString()} RUB
                 </p>
            </div>
          )}
      </div>

      {/* 进度与倒计时 */}
      <div className="bg-black/30 rounded-2xl p-4 space-y-3 border border-white/5">
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
              <span className="text-slate-500">打码进度 Wager Progress</span>
              <span className="text-white">{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${progressColor} shadow-[0_0_10px_currentColor]`} 
                style={{ width: `${progressPercent}%` }}
              ></div>
          </div>
          <div className="flex justify-between items-center pt-1">
              <div className="flex items-center text-[9px] text-slate-500 font-bold uppercase">
                  <ClockIcon className="w-3.5 h-3.5 mr-1.5" />
                  {isDead ? '已结束' : `剩 ${displayTime}`}
              </div>
              <div className="text-[9px] text-slate-400 font-mono">
                  {bonus.wageringRequirement.current.toLocaleString()} / {bonus.wageringRequirement.target.toLocaleString()} RUB
              </div>
          </div>
      </div>

      {/* 底部按钮 */}
      {renderActionButtons()}
    </div>
  );
};

export default BonusCard;
