
import React, { useState, useMemo, useEffect } from 'react';
import { CloseIcon, InformationCircleIcon, ChevronRightIcon, CheckIcon, UsdtIcon, LockClosedIcon, ShieldCheckIcon, CubeIcon, PlusIcon, ListBulletIcon, ArrowPathIcon, ClockIcon } from './icons/GenericIcons';
import { PageView, UserCryptoAddress } from '../types';
import { CURRENT_AGENT_DATA } from '../constants';

// 复用 USDC 图标
const UsdcIcon: React.FC<any> = (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#2775CA"/>
        <path d="M12 17.2C10.2 17.2 8.8 16.2 8.2 14.8L9.6 14.2C10 15.1 10.9 15.7 12 15.7C13.3 15.7 14.2 14.9 14.2 13.9C14.2 13 13.4 12.3 11.5 11.8C9.5 11.3 8.1 10.4 8.1 8.5C8.1 6.8 9.5 5.6 11.3 5.6V4.4H12.7V5.6C14.2 5.6 15.3 6.4 15.9 7.6L14.5 8.2C14.1 7.4 13.4 7 12.4 7C11.3 7 10.5 7.6 10.5 8.4C10.5 9.2 11.3 9.7 13.2 10.2C15.2 10.7 16.6 11.7 16.6 13.7C16.6 15.7 15.1 17.2 13.3 17.2V18.4H11.9V17.2H12Z" fill="white"/>
    </svg>
);

const CURRENCY_CONFIG = [
    { id: 'USDT', name: 'Tether', Icon: UsdtIcon, color: 'text-emerald-400', glow: 'shadow-emerald-500/20', networks: ['TRC20', 'ERC20', 'BEP20'], minWithdraw: 10 },
    { id: 'USDC', name: 'USD Coin', Icon: UsdcIcon, color: 'text-blue-400', glow: 'shadow-blue-500/20', networks: ['ERC20', 'Polygon', 'Solana'], minWithdraw: 20 },
];

const MOCK_SAVED_ADDRESSES: UserCryptoAddress[] = [
    { id: 'addr1', label: 'My Binance Wallet', currency: 'USDT', network: 'TRC20', address: 'TL789xyz666Rk9n' },
    { id: 'addr2', label: 'Trust Wallet', currency: 'USDT', network: 'BEP20', address: '0x71abc1235a8c' },
];

const EXCHANGE_RATE = 92.5;
const HANDLING_FEE_RUB = 100;
const NETWORK_FEE_USDT = 1.0;

interface WithdrawalModalProps {
    isOpen: boolean;
    onClose: () => void;
    setActivePage: (page: any) => void;
    onAddBankCard?: () => void;
    onAddCryptoAddress?: () => void;
    mode?: 'balance' | 'commission';
    onSuccessToast?: (msg: string) => void;
}

const WithdrawalModal: React.FC<WithdrawalModalProps> = ({ isOpen, onClose, setActivePage, mode = 'balance', onSuccessToast }) => {
    const isCommissionMode = mode === 'commission';
    
    const [selectedCurrencyId, setSelectedCurrencyId] = useState('USDT');
    const [selectedNetwork, setSelectedNetwork] = useState('TRC20');
    const [addressInput, setAddressInput] = useState('');
    const [withdrawAmountRUB, setWithdrawAmountRUB] = useState<string>('');
    const [showUnfrozenInfo, setShowUnfrozenInfo] = useState(false);
    const [isNetworkDrawerOpen, setIsNetworkDrawerOpen] = useState(false);
    const [isAddressPickerOpen, setIsAddressPickerOpen] = useState(false);

    // Result States
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [orderId] = useState(`WD-${Math.floor(Math.random() * 9000000) + 1000000}`);

    const activeCurrency = useMemo(() => 
        CURRENCY_CONFIG.find(c => c.id === selectedCurrencyId)!
    , [selectedCurrencyId]);

    const calculation = useMemo(() => {
        const amount = parseFloat(withdrawAmountRUB) || 0;
        const baseAfterPlatformFee = Math.max(0, amount - HANDLING_FEE_RUB);
        const finalCrypto = Math.max(0, (baseAfterPlatformFee / EXCHANGE_RATE) - NETWORK_FEE_USDT);
        return {
            amount,
            platformFee: HANDLING_FEE_RUB,
            networkFee: NETWORK_FEE_USDT,
            finalCrypto: finalCrypto.toFixed(2)
        };
    }, [withdrawAmountRUB, selectedCurrencyId]);

    const handleSelectSavedAddress = (addr: UserCryptoAddress) => {
        setAddressInput(addr.address);
        setSelectedNetwork(addr.network);
        setIsAddressPickerOpen(false);
    };

    const handleSubmitWithdrawal = () => {
        if (!addressInput.trim() || calculation.amount < activeCurrency.minWithdraw * EXCHANGE_RATE) return;
        
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            if (isCommissionMode) {
                onSuccessToast?.('已提交至分销审核，提现记录可查看进度');
                onClose();
            } else {
                setShowResult(true);
            }
        }, 1500);
    };

    useEffect(() => {
        if (!isOpen) {
            setShowResult(false);
            setIsSubmitting(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // --- 提现成功结果页面 (仅用于常规余额模式) ---
    if (showResult && !isCommissionMode) {
        return (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
                <div className="bg-slate-950 w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-800 overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                    <header className="p-6 border-b border-slate-900 flex justify-between items-center bg-slate-900/50">
                        <div>
                            <h3 className="font-black text-xl text-white italic tracking-tighter uppercase">申请提交成功</h3>
                            <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Request Submitted</p>
                        </div>
                        <button onClick={onClose} className="p-2 text-gray-600 hover:text-white bg-slate-900 rounded-full transition-colors"><CloseIcon className="w-5 h-5" /></button>
                    </header>

                    <div className="p-6 space-y-6 flex-1">
                        <div className="flex flex-col items-center justify-center space-y-4 py-4">
                            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20 shadow-[0_0_40px_rgba(34,197,94,0.2)]">
                                <CheckIcon className="w-10 h-10 text-green-500 stroke-[3]" />
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-black text-white font-mono tracking-tighter">
                                    {calculation.amount.toLocaleString()} <span className="text-sm text-slate-500 uppercase">RUB</span>
                                </p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">提现申请正在人工审核中</p>
                            </div>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-inner relative overflow-hidden">
                             {/* 饰纹 */}
                             <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                <ShieldCheckIcon className="w-24 h-24 text-white" />
                             </div>

                             <div className="space-y-3 relative z-10">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">最终预计到账</span>
                                    <span className="text-lg font-black text-yellow-500 font-mono tracking-tighter">{calculation.finalCrypto} {selectedCurrencyId}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-500 font-bold">目标钱包</span>
                                    <span className="text-slate-300 font-mono">{addressInput.substring(0, 6)}...{addressInput.slice(-6)}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-500 font-bold">支付网络</span>
                                    <span className="text-blue-400 font-black italic uppercase">{selectedNetwork}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-500 font-bold">订单编号</span>
                                    <span className="text-slate-400 font-mono">{orderId}</span>
                                </div>
                             </div>

                             <div className="pt-4 border-t border-white/5 space-y-2 relative z-10">
                                <div className="flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-tight">
                                    <ClockIcon className="w-3.5 h-3.5" />
                                    <span>预计处理时间</span>
                                </div>
                                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                                    由于安全审计要求，大额提现可能需要更长时间。通常在 <span className="text-white">15-60 分钟</span> 内处理完毕。
                                </p>
                             </div>
                        </div>
                    </div>

                    <footer className="p-6 bg-slate-900 border-t border-slate-800 space-y-3">
                        <button 
                            onClick={() => { onClose(); setActivePage('txHistory'); }}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/20 transition-all uppercase tracking-widest text-sm"
                        >
                            查看交易记录
                        </button>
                        <button onClick={onClose} className="w-full bg-transparent text-slate-500 hover:text-slate-300 font-bold py-2 text-xs uppercase tracking-widest transition-colors">
                            返回个人中心
                        </button>
                    </footer>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div className="bg-slate-950 w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-800 overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <header className="p-6 border-b border-slate-900 flex justify-between items-center bg-slate-900/50 flex-shrink-0">
                    <div>
                        <h3 className="font-black text-xl text-white italic tracking-tighter uppercase">{isCommissionMode ? '佣金提现' : '提现中心'}</h3>
                        <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">{isCommissionMode ? 'Commission Withdrawal' : 'Crypto Withdrawal Terminal'}</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-600 hover:text-white bg-slate-900 rounded-full transition-colors"><CloseIcon className="w-5 h-5" /></button>
                </header>

                <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-6">
                    {/* Guidance Alert - Hidden in Commission Mode */}
                    {!isCommissionMode && (
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex items-start space-x-3">
                            <InformationCircleIcon className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <p className="text-xs font-black text-blue-200">1倍流水要求</p>
                                <p className="text-[10px] text-slate-500 leading-relaxed font-medium">根据国际反洗钱 (AML) 规范，所有存款需完成 100% 有效投注流水方可自由提现。</p>
                            </div>
                        </div>
                    )}

                    {/* 1. Balance Status */}
                    <section className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl shadow-inner">
                            <p className="text-[10px] text-slate-500 font-black uppercase mb-1">{isCommissionMode ? '可提现佣金' : '可提现余额'}</p>
                            <p className="text-xl font-black text-white font-mono tracking-tight">
                                {isCommissionMode ? CURRENT_AGENT_DATA.availableCommission.toLocaleString() : '12,345.67'} 
                                <span className="text-[10px] text-slate-600 ml-0.5 uppercase">RUB</span>
                            </p>
                        </div>
                        
                        <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl relative group shadow-inner">
                            <div className="flex items-center justify-between mb-1">
                                <p className={`text-[10px] font-black uppercase ${isCommissionMode ? 'text-blue-400' : 'text-orange-500'}`}>
                                    {isCommissionMode ? '冻结中佣金' : '锁定金额'}
                                </p>
                                {!isCommissionMode && (
                                    <button onClick={() => setShowUnfrozenInfo(!showUnfrozenInfo)} className="text-slate-600 hover:text-white transition-colors">
                                        <InformationCircleIcon className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                            <p className="text-xl font-black text-slate-400 font-mono tracking-tight flex items-center">
                                {isCommissionMode ? '1,200.00' : '500.00'} 
                                <LockClosedIcon className="w-3 h-3 ml-1.5 opacity-40" />
                            </p>
                            {showUnfrozenInfo && !isCommissionMode && (
                                <div className="absolute top-full left-0 right-0 mt-3 bg-slate-800 border border-slate-700 p-4 rounded-2xl shadow-2xl z-50 animate-fade-in text-[11px] text-gray-300 leading-relaxed font-bold border-l-4 border-l-orange-500">
                                    锁定金额指尚未完成 <span className="text-yellow-500">1倍有效投注流水</span> 的充值资金。
                                    <div className="absolute -top-1.5 right-4 w-3 h-3 bg-slate-800 border-l border-t border-slate-700 rotate-45"></div>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* 2. Currency Selection */}
                    <section className="space-y-3">
                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">选择提现币种</label>
                        <div className="grid grid-cols-2 gap-3">
                            {CURRENCY_CONFIG.map(curr => {
                                const isActive = selectedCurrencyId === curr.id;
                                return (
                                    <button
                                        key={curr.id}
                                        onClick={() => { setSelectedCurrencyId(curr.id); setSelectedNetwork(curr.networks[0]); }}
                                        className={`p-4 rounded-2xl border-2 transition-all flex items-center space-x-3 group ${
                                            isActive 
                                            ? `bg-slate-900 border-slate-700 shadow-xl ${curr.glow}` 
                                            : 'bg-slate-900/40 border-transparent text-slate-500 grayscale opacity-60 hover:opacity-100 hover:grayscale-0'
                                        }`}
                                    >
                                        <div className={`w-10 h-10 rounded-full p-2 bg-slate-800 ${isActive ? 'ring-2 ring-white/10' : ''}`}>
                                            <curr.Icon className="w-full h-full" />
                                        </div>
                                        <div className="text-left">
                                            <p className={`font-black text-lg ${isActive ? 'text-white' : ''}`}>{curr.id}</p>
                                            <p className="text-[10px] font-bold opacity-60 uppercase">{curr.name}</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    {/* 3. Address & Network Inputs */}
                    <section className="space-y-4">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">提现网络</label>
                            <button 
                                onClick={() => setIsNetworkDrawerOpen(true)}
                                className="w-full p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between group active:scale-[0.98] transition-all shadow-inner"
                            >
                                <div className="flex items-center space-x-3">
                                    <CubeIcon className="w-5 h-5 text-blue-500" />
                                    <p className="text-white font-black italic uppercase tracking-wider">{selectedNetwork}</p>
                                </div>
                                <div className="flex items-center text-blue-500 space-x-1">
                                    <span className="text-[10px] font-black uppercase">切换</span>
                                    <ChevronRightIcon className="w-4 h-4" />
                                </div>
                            </button>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">提现地址</label>
                                <button 
                                    onClick={() => setIsAddressPickerOpen(true)}
                                    className="text-[10px] font-black text-blue-500 hover:text-blue-400 uppercase tracking-tighter flex items-center bg-blue-500/10 px-2 py-1 rounded-lg border border-blue-500/20 transition-all"
                                >
                                    <ListBulletIcon className="w-3 h-3 mr-1" />
                                    选择已绑定地址
                                </button>
                            </div>
                            <div className="relative group">
                                <textarea 
                                    rows={2}
                                    value={addressInput}
                                    onChange={e => setAddressInput(e.target.value)}
                                    placeholder="输入或粘贴钱包收币地址..."
                                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 px-4 text-sm font-mono text-white placeholder-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-inner resize-none transition-all"
                                />
                            </div>
                        </div>
                    </section>

                    {/* 4. Amount Input */}
                    <section className="space-y-3">
                        <div className="flex justify-between items-end px-1">
                            <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">提现金额 (RUB)</label>
                            <p className="text-[9px] font-bold text-slate-500 uppercase italic">最小提现: {activeCurrency.minWithdraw * EXCHANGE_RATE} RUB</p>
                        </div>
                        <div className="relative">
                            <input 
                                type="number" 
                                value={withdrawAmountRUB}
                                onChange={e => setWithdrawAmountRUB(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 rounded-[2rem] py-6 px-6 text-4xl font-black font-mono text-white placeholder-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
                                placeholder="0.00"
                            />
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center space-x-3">
                                <span className="text-sm font-black text-slate-700 italic">RUB</span>
                                <button 
                                    onClick={() => setWithdrawAmountRUB(isCommissionMode ? CURRENT_AGENT_DATA.availableCommission.toString() : '12345')}
                                    className="px-4 py-2 bg-blue-600/10 text-blue-500 text-[10px] font-black rounded-xl border border-blue-500/20 hover:bg-blue-600/20 transition-all uppercase tracking-widest"
                                >
                                    MAX
                                </button>
                            </div>
                        </div>
                    </section>
                </div>

                {/* 5. Combined Settlement Footer */}
                <div className="bg-slate-900 border-t border-slate-800 p-6 space-y-5 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] flex-shrink-0">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                             <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">最终预计到账 (NET)</span>
                                <div className="flex items-baseline">
                                    <span className={`text-3xl font-black font-mono tracking-tighter ${parseFloat(calculation.finalCrypto) > 0 ? 'text-yellow-500' : 'text-slate-800'}`}>
                                        {calculation.finalCrypto}
                                    </span>
                                    <span className="text-[10px] font-black text-slate-600 ml-1 uppercase">{selectedCurrencyId}</span>
                                </div>
                             </div>
                             <div className="text-right flex flex-col items-end">
                                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">参考汇率</span>
                                <span className="text-xs font-mono font-bold text-white bg-slate-800 px-2 py-1 rounded-md border border-white/5">1 {selectedCurrencyId} ≈ {EXCHANGE_RATE} RUB</span>
                             </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 py-3 border-y border-white/5">
                            <div className="flex flex-col">
                                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tight">平台处理费</span>
                                <span className="text-xs font-black text-red-500/80">-{calculation.platformFee} RUB</span>
                            </div>
                            <div className="flex flex-col items-end border-l border-white/5 pl-4">
                                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tight">区块链网络费</span>
                                <span className="text-xs font-black text-red-500/80">-{calculation.networkFee} {selectedCurrencyId}</span>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={handleSubmitWithdrawal}
                        disabled={isSubmitting || !addressInput.trim() || calculation.amount <= 0}
                        className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-95 text-lg uppercase tracking-widest flex items-center justify-center group relative overflow-hidden"
                    >
                        {isSubmitting ? (
                            <ArrowPathIcon className="w-6 h-6 animate-spin" />
                        ) : (
                            <>
                                <span className="relative z-10">{isCommissionMode ? '确认提现佣金' : '提交提现申请'}</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            </>
                        )}
                    </button>
                    
                    <p className="text-center text-[9px] text-slate-600 font-bold uppercase tracking-tighter opacity-60">
                        {isCommissionMode ? '佣金提现经人工审核后将发放至您的钱包地址' : '提现预计 15-60 分钟内到账，具体取决于链上确认速度'}
                    </p>
                </div>

                {/* Network Selection Drawer */}
                {isNetworkDrawerOpen && (
                    <div className="fixed inset-0 z-[210] flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setIsNetworkDrawerOpen(false)}>
                        <div className="bg-slate-900 rounded-t-[2.5rem] p-6 shadow-2xl border-t border-slate-800 animate-slide-up" onClick={e => e.stopPropagation()}>
                            <div className="w-12 h-1.5 bg-slate-800 rounded-full mx-auto mb-6"></div>
                            <header className="flex justify-between items-center mb-6 px-2">
                                <div>
                                    <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">选择提现网络</h3>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{activeCurrency.id} 协议环境</p>
                                </div>
                                <button onClick={() => setIsNetworkDrawerOpen(false)} className="p-2 text-gray-500 hover:text-white bg-slate-800 rounded-full transition-colors"><CloseIcon className="w-5 h-5" /></button>
                            </header>
                            
                            <div className="space-y-3 pb-8">
                                {activeCurrency.networks.map(net => {
                                    const isSelected = selectedNetwork === net;
                                    return (
                                        <button 
                                            key={net}
                                            onClick={() => { setSelectedNetwork(net); setIsNetworkDrawerOpen(false); }}
                                            className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${
                                                isSelected 
                                                ? 'bg-blue-600/10 border-blue-500 text-white' 
                                                : 'bg-slate-800 border-transparent text-slate-400 hover:border-slate-700'
                                            }`}
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-500 text-white' : 'bg-slate-700'}`}>
                                                    <CubeIcon className="w-4 h-4" />
                                                </div>
                                                <span className="font-black text-base uppercase italic tracking-wider">{net}</span>
                                            </div>
                                            {isSelected && <CheckIcon className="w-5 h-5 text-blue-500" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Saved Address Picker Drawer */}
                {isAddressPickerOpen && (
                    <div className="fixed inset-0 z-[220] flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setIsAddressPickerOpen(false)}>
                        <div className="bg-slate-900 rounded-t-[2.5rem] p-6 shadow-2xl border-t border-slate-800 animate-slide-up max-h-[70vh] flex flex-col" onClick={e => e.stopPropagation()}>
                            <div className="w-12 h-1.5 bg-slate-800 rounded-full mx-auto mb-6"></div>
                            <header className="flex justify-between items-center mb-6 px-2">
                                <div>
                                    <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">常用提现地址</h3>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest uppercase">Address Book</p>
                                </div>
                                <button onClick={() => setIsAddressPickerOpen(false)} className="p-2 text-gray-500 hover:text-white bg-slate-800 rounded-full"><CloseIcon className="w-5 h-5" /></button>
                            </header>
                            
                            <div className="overflow-y-auto no-scrollbar space-y-3 pb-8 flex-1">
                                {MOCK_SAVED_ADDRESSES.filter(a => a.currency === selectedCurrencyId).map(addr => (
                                    <button
                                        key={addr.id}
                                        onClick={() => handleSelectSavedAddress(addr)}
                                        className="w-full p-4 rounded-2xl bg-slate-800 border-2 border-slate-700 hover:border-blue-500 transition-all text-left group"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center space-x-2">
                                                <ShieldCheckIcon className="w-4 h-4 text-blue-500" />
                                                <span className="text-xs font-black text-white uppercase tracking-tight">{addr.label}</span>
                                            </div>
                                            <span className="text-[9px] font-black bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded-full uppercase">{addr.network}</span>
                                        </div>
                                        <p className="text-[11px] text-slate-500 font-mono break-all group-hover:text-slate-300 transition-colors">{addr.address}</p>
                                    </button>
                                ))}
                                
                                {MOCK_SAVED_ADDRESSES.filter(a => a.currency === selectedCurrencyId).length === 0 && (
                                    <div className="text-center py-10">
                                        <InformationCircleIcon className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                                        <p className="text-slate-500 text-sm font-bold">暂无已绑定的 {selectedCurrencyId} 地址</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            <style>{`
                @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
                .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .animate-fade-in { animation: fadeIn 0.3s ease-out; }
            `}</style>
        </div>
    );
};

export default WithdrawalModal;
