
import React from 'react';
import { Bonus } from '../types';
import { CloseIcon, ExclamationTriangleIcon } from './icons/GenericIcons';

interface ForfeitConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  bonus: Bonus;
}

const ForfeitConfirmationModal: React.FC<ForfeitConfirmationModalProps> = ({ isOpen, onClose, onConfirm, bonus }) => {
  if (!isOpen) return null;

  const isVoucher = bonus.category === 'voucher';
  const progressPercent = Math.min((bonus.wageringRequirement.current / bonus.wageringRequirement.target) * 100, 100);
  const gap = Math.max(0, bonus.wageringRequirement.target - bonus.wageringRequirement.current);
  const daysLeft = Math.ceil((bonus.expiresAt - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div 
        className="bg-[#4a4a4a] w-full max-w-sm rounded-xl shadow-2xl overflow-hidden flex flex-col p-6 space-y-6 animate-slide-up" 
        onClick={e => e.stopPropagation()}
      >
        {/* Warning Icon & Title */}
        <div className="flex flex-col items-center text-center space-y-2 pt-2">
            <div className="text-red-500">
                <ExclamationTriangleIcon className="w-14 h-14" />
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">是否确认放弃</h3>
            <p className="text-sm text-gray-300 font-medium">
                {isVoucher ? '现金卷' : 'Bonus'} 一旦放弃，将无法恢复
            </p>
        </div>

        {/* Inner Info Card */}
        <div className="bg-[#d1d1d1] rounded-2xl p-5 space-y-4 shadow-inner">
            <h4 className="text-center font-black text-slate-800 text-base">{bonus.title}</h4>
            
            {!isVoucher && (
                <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-700">
                    <p>当前Bonus余额: <span className="text-slate-900 font-black">{bonus.lockedWinnings.toLocaleString()}₽</span></p>
                    <p className="text-right">最高赢额: <span className="text-slate-900 font-black">{bonus.maxWinnings?.toLocaleString()}₽</span></p>
                </div>
            )}

            <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-black text-slate-800">
                    <span>已完成流水: {bonus.wageringRequirement.current.toLocaleString()}₽ / {bonus.wageringRequirement.target.toLocaleString()}₽</span>
                    <span>{Math.round(progressPercent)}%</span>
                </div>
                <div className="w-full h-3 bg-white rounded-full overflow-hidden border border-slate-300">
                    <div 
                        className="h-full bg-cyan-400 transition-all duration-700" 
                        style={{ width: `${progressPercent}%` }}
                    ></div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] font-black italic">
                <p className="text-orange-700">距离流水完成还差: {gap.toLocaleString()}₽</p>
                <p className="text-orange-700 text-right">剩余有效期: {daysLeft} days</p>
            </div>
        </div>

        {/* Consequences */}
        <div className="space-y-2 px-1">
            <p className="text-white text-sm font-bold">放弃后</p>
            <ul className="space-y-1.5 text-[11px] text-gray-300 font-medium list-none">
                {isVoucher ? (
                    <>
                        <li className="flex items-start"><span className="mr-1">1.</span> 现金卷将被销毁</li>
                        <li className="flex items-start"><span className="mr-1">2.</span> 激活新的现金卷后，流水进度将从0开始计算</li>
                    </>
                ) : (
                    <>
                        <li className="flex items-start"><span className="mr-1">1.</span> 当前Bonus余额将被清零，无法恢复</li>
                        <li className="flex items-start"><span className="mr-1">2.</span> 后续流水不再计入本次Bonus进度</li>
                        <li className="flex items-start"><span className="mr-1">3.</span> 之后开始新的Bonus，流水进度将从0开始计算</li>
                    </>
                )}
            </ul>
        </div>

        {/* Buttons */}
        <div className="flex space-x-4 pt-2">
            <button 
                onClick={onConfirm}
                className="flex-1 bg-sky-500 hover:bg-sky-400 text-white font-black py-3 rounded-lg text-sm shadow-lg transition-all active:scale-95"
            >
                {isVoucher ? '继续放弃' : '确认放弃'}
            </button>
            <button 
                onClick={onClose}
                className="flex-1 bg-sky-500 hover:bg-sky-400 text-white font-black py-3 rounded-lg text-sm shadow-lg transition-all active:scale-95"
            >
                关闭
            </button>
        </div>
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

export default ForfeitConfirmationModal;
