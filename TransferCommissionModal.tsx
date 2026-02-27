
import React, { useState, useEffect } from 'react';
import { CloseIcon, ArrowPathIcon, BanknotesIcon, ChevronRightIcon, CheckIcon, ShieldCheckIcon, InformationCircleIcon } from './icons/GenericIcons';

interface TransferCommissionModalProps {
    isOpen: boolean;
    onClose: () => void;
    availableAmount: number;
    onSuccess: () => void;
}

const TransferCommissionModal: React.FC<TransferCommissionModalProps> = ({ isOpen, onClose, availableAmount, onSuccess }) => {
    const [amount, setAmount] = useState<string>(availableAmount.toString());
    const [isProcessing, setIsProcessing] = useState(false);
    const [step, setStep] = useState<'form' | 'success'>('form');

    useEffect(() => {
        if (isOpen) {
            setAmount(availableAmount.toString());
            setStep('form');
            setIsProcessing(false);
        }
    }, [isOpen, availableAmount]);

    const handleTransfer = () => {
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0 || numAmount > availableAmount) return;

        setIsProcessing(true);
        // 模拟 API 请求
        setTimeout(() => {
            setIsProcessing(false);
            setStep('success');
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 1500);
        }, 1200);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div className="bg-slate-900 w-full max-w-sm rounded-[2.5rem] shadow-2xl border border-slate-800 overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                    <div>
                        <h3 className="font-black text-xl text-white italic tracking-tighter uppercase">佣金划转</h3>
                        <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Commission Transfer</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-500 hover:text-white bg-slate-800 rounded-full transition-colors">
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </header>

                <main className="p-6 overflow-y-auto no-scrollbar">
                    {step === 'form' ? (
                        <div className="space-y-6">
                            {/* NEW: 顶部打码规则提醒 */}
                            <div className="bg-blue-600/10 border border-blue-500/30 rounded-2xl p-4 flex items-start space-x-3 shadow-inner">
                                <InformationCircleIcon className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                                <p className="text-[11px] font-black text-blue-200 leading-relaxed italic uppercase tracking-tighter">
                                    若划转到游戏钱包，需完成1倍打码才能提现
                                </p>
                            </div>

                            {/* Path Indicator */}
                            <div className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-white/5 shadow-inner">
                                <div className="text-center flex-1">
                                    <p className="text-[9px] text-slate-500 font-bold uppercase mb-1">从代理账户</p>
                                    <p className="text-xs font-black text-blue-400">Agent Wallet</p>
                                </div>
                                <div className="flex items-center px-4">
                                    <ChevronRightIcon className="w-5 h-5 text-slate-700" />
                                </div>
                                <div className="text-center flex-1">
                                    <p className="text-[9px] text-slate-500 font-bold uppercase mb-1">到主账户</p>
                                    <p className="text-xs font-black text-green-400">Main Wallet</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-end px-1">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">划转金额 (RUB)</label>
                                    <p className="text-[10px] font-bold text-gray-500">可用: <span className="text-white">{availableAmount.toLocaleString()}</span></p>
                                </div>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        value={amount}
                                        onChange={e => setAmount(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-5 px-6 text-3xl font-black font-mono text-white placeholder-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
                                        placeholder="0.00"
                                    />
                                    <button 
                                        onClick={() => setAmount(availableAmount.toString())}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-blue-600/10 text-blue-500 text-[10px] font-black rounded-lg border border-blue-500/20 hover:bg-blue-600/20 transition-all uppercase"
                                    >
                                        MAX
                                    </button>
                                </div>
                            </div>

                            <div className="p-4 bg-slate-950/50 border border-white/5 rounded-2xl flex items-start space-x-3">
                                <InformationCircleIcon className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                                <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                                    划转后的资金将直接计入您的主余额，可用于游戏下注或直接申请提现。划转过程不收取任何额外手续费。
                                </p>
                            </div>

                            <button 
                                onClick={handleTransfer}
                                disabled={isProcessing || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > availableAmount}
                                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-black py-4 rounded-xl shadow-xl shadow-blue-500/20 transition-all active:scale-95 text-base uppercase tracking-widest flex items-center justify-center group"
                            >
                                {isProcessing ? (
                                    <ArrowPathIcon className="w-6 h-6 animate-spin" />
                                ) : (
                                    '确认划转'
                                )}
                            </button>
                        </div>
                    ) : (
                        <div className="py-10 flex flex-col items-center justify-center space-y-6 animate-fade-in">
                            <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20 shadow-[0_0_50px_rgba(34,197,94,0.3)]">
                                <CheckIcon className="w-12 h-12 text-green-500 stroke-[3]" />
                            </div>
                            <div className="text-center space-y-2">
                                <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter">划转成功</h4>
                                <p className="text-sm text-slate-500 font-bold tracking-widest uppercase">Transfer Completed</p>
                                <p className="text-lg font-mono font-black text-green-400 mt-4">
                                    +{parseFloat(amount).toLocaleString()} RUB
                                </p>
                            </div>
                        </div>
                    )}
                </main>

                <footer className="p-4 bg-slate-950/50 border-t border-slate-800 flex items-center justify-center space-x-2">
                    <ShieldCheckIcon className="w-4 h-4 text-slate-600" />
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Secure Financial Transaction</span>
                </footer>
            </div>

            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
                .animate-fade-in { animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
            `}</style>
        </div>
    );
};

export default TransferCommissionModal;
