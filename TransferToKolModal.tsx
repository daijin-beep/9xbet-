
import React, { useState, useEffect, useMemo } from 'react';
import { CloseIcon, ArrowPathIcon, ChevronRightIcon, CheckIcon, ShieldCheckIcon, InformationCircleIcon, SearchIcon, UserGroupIcon } from './icons/GenericIcons';
import { MOCK_INVITED_KOLS } from '../constants';
import { InvitedKol } from '../types';

interface TransferToKolModalProps {
    isOpen: boolean;
    onClose: () => void;
    availableAmount: number;
    onSuccess: (amount: number, recipient: InvitedKol) => void;
}

const TransferToKolModal: React.FC<TransferToKolModalProps> = ({ isOpen, onClose, availableAmount, onSuccess }) => {
    const [amount, setAmount] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedKol, setSelectedKol] = useState<InvitedKol | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [step, setStep] = useState<'select' | 'form' | 'success'>('select');

    useEffect(() => {
        if (isOpen) {
            setAmount('');
            setSearchTerm('');
            setSelectedKol(null);
            setStep('select');
            setIsProcessing(false);
        }
    }, [isOpen]);

    const filteredKols = useMemo(() => {
        const term = searchTerm.toLowerCase().trim();
        if (!term) return MOCK_INVITED_KOLS;
        return MOCK_INVITED_KOLS.filter(k => 
            k.nickname.toLowerCase().includes(term) || 
            k.kolId.toLowerCase().includes(term)
        );
    }, [searchTerm]);

    const handleTransfer = () => {
        const numAmount = parseFloat(amount);
        if (!selectedKol || isNaN(numAmount) || numAmount <= 0 || numAmount > availableAmount) return;

        setIsProcessing(true);
        // 模拟 API 请求
        setTimeout(() => {
            setIsProcessing(false);
            setStep('success');
            setTimeout(() => {
                onSuccess(numAmount, selectedKol);
                onClose();
            }, 2000);
        }, 1500);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[350] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in" onClick={onClose}>
            <div className="bg-slate-900 w-full max-w-sm rounded-[2.5rem] shadow-2xl border border-slate-800 overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                    <div>
                        <h3 className="font-black text-xl text-white italic tracking-tighter uppercase">KOL 佣金转账</h3>
                        <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Distributor to KOL</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-500 hover:text-white bg-slate-800 rounded-full transition-colors">
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </header>

                <main className="p-6 overflow-y-auto no-scrollbar flex-1 min-h-[400px]">
                    {step === 'select' && (
                        <div className="space-y-4 animate-fade-in">
                            <div className="relative">
                                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input 
                                    type="text"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    placeholder="搜索受邀 KOL 昵称或 ID..."
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                            
                            <div className="space-y-2 max-h-[300px] overflow-y-auto no-scrollbar">
                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-1">受邀 KOL 列表 ({filteredKols.length})</p>
                                {filteredKols.map(kol => (
                                    <button 
                                        key={kol.id}
                                        onClick={() => { setSelectedKol(kol); setStep('form'); }}
                                        className="w-full flex items-center justify-between p-3 bg-slate-800/50 hover:bg-slate-800 rounded-2xl border border-white/5 transition-all group"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <img src={kol.avatarUrl} alt="" className="w-10 h-10 rounded-full border border-white/10" />
                                            <div className="text-left">
                                                <p className="text-sm font-bold text-white">{kol.nickname}</p>
                                                <p className="text-[10px] font-mono text-slate-500">{kol.kolId}</p>
                                            </div>
                                        </div>
                                        <ChevronRightIcon className="w-4 h-4 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                                    </button>
                                ))}
                                {filteredKols.length === 0 && (
                                    <div className="py-10 text-center opacity-30">
                                        <UserGroupIcon className="w-12 h-12 mx-auto mb-2" />
                                        <p className="text-xs">未找到匹配的 KOL</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {step === 'form' && selectedKol && (
                        <div className="space-y-6 animate-fade-in">
                            {/* Path Indicator */}
                            <div className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-white/5 shadow-inner">
                                <div className="text-center flex-1">
                                    <p className="text-[9px] text-slate-500 font-bold uppercase mb-1">我的可提现</p>
                                    <p className="text-xs font-black text-blue-400">Master Wallet</p>
                                </div>
                                <div className="flex items-center px-4">
                                    <ArrowPathIcon className="w-5 h-5 text-slate-700" />
                                </div>
                                <div className="text-center flex-1">
                                    <p className="text-[9px] text-slate-500 font-bold uppercase mb-1">转账给 {selectedKol.nickname}</p>
                                    <p className="text-xs font-black text-yellow-500">KOL Commission</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-end px-1">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">转账金额 (RUB)</label>
                                    <p className="text-[10px] font-bold text-gray-500">可用: <span className="text-white">{availableAmount.toLocaleString()} ₽</span></p>
                                </div>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        autoFocus
                                        value={amount}
                                        onChange={e => setAmount(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-5 px-6 text-3xl font-black font-mono text-white placeholder-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
                                        placeholder="0.00"
                                    />
                                    <button 
                                        onClick={() => setAmount(availableAmount.toString())}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-blue-600/10 text-blue-400 text-[10px] font-black rounded-lg border border-blue-500/20 hover:bg-blue-600/20 transition-all uppercase"
                                    >
                                        MAX
                                    </button>
                                </div>
                            </div>

                            <div className="p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl flex items-start space-x-3">
                                <InformationCircleIcon className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                                <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                                    资金将从您的分销商可提现佣金中扣除，并实时划转至目标 KOL 的账户中。转账一旦成功无法撤回。
                                </p>
                            </div>

                            <div className="flex space-x-3">
                                <button onClick={() => setStep('select')} className="px-6 bg-slate-800 text-slate-400 font-bold rounded-xl active:scale-95 transition-all text-xs uppercase tracking-widest">返回</button>
                                <button 
                                    onClick={handleTransfer}
                                    disabled={isProcessing || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > availableAmount}
                                    className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-black py-4 rounded-xl shadow-xl shadow-blue-500/20 transition-all active:scale-95 text-base uppercase tracking-widest flex items-center justify-center group"
                                >
                                    {isProcessing ? <ArrowPathIcon className="w-6 h-6 animate-spin" /> : '确认转账'}
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'success' && selectedKol && (
                        <div className="py-10 flex flex-col items-center justify-center space-y-6 animate-fade-in text-center">
                            <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20 shadow-[0_0_50px_rgba(34,197,94,0.3)]">
                                <CheckIcon className="w-12 h-12 text-green-500 stroke-[3]" />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter">转账已送达</h4>
                                <p className="text-sm text-slate-500 font-bold tracking-widest uppercase">Transaction Complete</p>
                                <div className="mt-4 p-4 bg-slate-950 rounded-2xl border border-white/5 inline-block">
                                    <p className="text-lg font-mono font-black text-green-400">
                                        -{parseFloat(amount).toLocaleString()} RUB
                                    </p>
                                    <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-tight">目标: {selectedKol.nickname}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </main>

                <footer className="p-4 bg-slate-950/50 border-t border-slate-800 flex items-center justify-center space-x-2">
                    <ShieldCheckIcon className="w-4 h-4 text-slate-600" />
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Financial Master Protocol</span>
                </footer>
            </div>

            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
                .animate-fade-in { animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
            `}</style>
        </div>
    );
};

export default TransferToKolModal;
