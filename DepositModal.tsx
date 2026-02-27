
import React, { useState, useMemo, useEffect } from 'react';
import { CloseIcon, InformationCircleIcon, ChevronRightIcon, CheckIcon, UsdtIcon, TreasureChestIcon, ClipboardCopyIcon, ClockIcon, ShieldCheckIcon, ArrowPathIcon } from './icons/GenericIcons';

// 自定义 USDC 图标
const UsdcIcon: React.FC<any> = (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#2775CA"/>
        <path d="M12 17.2C10.2 17.2 8.8 16.2 8.2 14.8L9.6 14.2C10 15.1 10.9 15.7 12 15.7C13.3 15.7 14.2 14.9 14.2 13.9C14.2 13 13.4 12.3 11.5 11.8C9.5 11.3 8.1 10.4 8.1 8.5C8.1 6.8 9.5 5.6 11.3 5.6V4.4H12.7V5.6C14.2 5.6 15.3 6.4 15.9 7.6L14.5 8.2C14.1 7.4 13.4 7 12.4 7C11.3 7 10.5 7.6 10.5 8.4C10.5 9.2 11.3 9.7 13.2 10.2C15.2 10.7 16.6 11.7 16.6 13.7C16.6 15.7 15.1 17.2 13.3 17.2V18.4H11.9V17.2H12Z" fill="white"/>
    </svg>
);

interface DepositPackage {
    id: string;
    usdtAmount: number;
    bonusAmount: number;
    voucherAmount: number;
    tag?: string;
}

const DEPOSIT_PACKAGES: DepositPackage[] = [
    { id: 'p1', usdtAmount: 10, bonusAmount: 50, voucherAmount: 0 },
    { id: 'p2', usdtAmount: 50, bonusAmount: 300, voucherAmount: 100, tag: 'HOT' },
    { id: 'p3', usdtAmount: 100, bonusAmount: 800, voucherAmount: 300, tag: 'RECOMMENDED' },
    { id: 'p4', usdtAmount: 500, bonusAmount: 5000, voucherAmount: 2000, tag: 'VIP CHOICE' },
    { id: 'p5', usdtAmount: 1000, bonusAmount: 12000, voucherAmount: 5000 },
    { id: 'p6', usdtAmount: 5000, bonusAmount: 70000, voucherAmount: 30000, tag: 'WHALE' },
];

const CURRENCY_CONFIG = [
    { id: 'USDT', name: 'Tether', Icon: UsdtIcon, color: 'text-emerald-400', glow: 'shadow-emerald-500/20', networks: ['TRC20', 'ERC20', 'Polygon', 'BEP20'] },
    { id: 'USDC', name: 'USD Coin', Icon: UsdcIcon, color: 'text-blue-400', glow: 'shadow-blue-500/20', networks: ['ERC20', 'Polygon', 'Solana'] },
];

const EXCHANGE_RATE = 92.5;

const DepositStepper: React.FC = () => {
    return (
        <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-4 mb-4">
            <div className="flex items-center justify-between relative">
                {/* Connector Line */}
                <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-800 z-0"></div>
                
                {[
                    { step: 1, label: '选币种', sub: 'USDT/USDC' },
                    { step: 2, label: '锁汇率', sub: '15min有效' },
                    { step: 3, label: '领奖金', sub: '自动派发' },
                ].map((s, i) => (
                    <div key={i} className="relative z-10 flex flex-col items-center w-1/3">
                        <div className="w-8 h-8 rounded-full bg-slate-950 border-2 border-blue-500 flex items-center justify-center text-xs font-black text-blue-400 mb-2">
                            {s.step}
                        </div>
                        <p className="text-[10px] font-black text-white uppercase tracking-tight">{s.label}</p>
                        <p className="text-[8px] text-slate-500 font-bold uppercase">{s.sub}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const DepositModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const [selectedCurrencyId, setSelectedCurrencyId] = useState('USDT');
    const [selectedNetwork, setSelectedNetwork] = useState('TRC20');
    const [isNetworkDrawerOpen, setIsNetworkDrawerOpen] = useState(false);
    const [selectedPackageId, setSelectedPackageId] = useState(DEPOSIT_PACKAGES[2].id);
    
    // Result View States
    const [isProcessing, setIsProcessing] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [orderId] = useState(`ORD-${Math.floor(Math.random() * 9000000) + 1000000}`);

    const activeCurrency = useMemo(() => 
        CURRENCY_CONFIG.find(c => c.id === selectedCurrencyId)!
    , [selectedCurrencyId]);

    const selectedPkg = useMemo(() => 
        DEPOSIT_PACKAGES.find(p => p.id === selectedPackageId) || DEPOSIT_PACKAGES[0]
    , [selectedPackageId]);

    const calculation = useMemo(() => {
        const baseRub = selectedPkg.usdtAmount * EXCHANGE_RATE;
        return {
            baseRub,
            totalBenefit: baseRub + selectedPkg.bonusAmount + selectedPkg.voucherAmount
        };
    }, [selectedPkg]);

    const handleConfirmDeposit = () => {
        setIsProcessing(true);
        // 模拟请求延迟
        setTimeout(() => {
            setIsProcessing(false);
            setShowResult(true);
        }, 1500);
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('已复制到剪贴板');
    };

    useEffect(() => {
        if (!isOpen) {
            setShowResult(false);
            setIsProcessing(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // --- 待支付结果回执页面 ---
    if (showResult) {
        return (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
                <div className="bg-slate-950 w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-800 overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                    <header className="p-6 border-b border-slate-900 flex justify-between items-center bg-slate-900/50">
                        <div>
                            <h3 className="font-black text-xl text-white italic tracking-tighter uppercase">订单详情</h3>
                            <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Payment Receipt</p>
                        </div>
                        <button onClick={onClose} className="p-2 text-gray-600 hover:text-white bg-slate-900 rounded-full transition-colors"><CloseIcon className="w-5 h-5" /></button>
                    </header>

                    <div className="p-6 space-y-6 flex-1">
                        <div className="text-center space-y-2">
                            <div className="inline-flex items-center space-x-2 text-yellow-500 bg-yellow-500/10 px-4 py-1.5 rounded-full border border-yellow-500/20">
                                <ClockIcon className="w-4 h-4 animate-pulse" />
                                <span className="text-xs font-black uppercase tracking-widest">待支付 (14:59)</span>
                            </div>
                            <h4 className="text-4xl font-black text-white font-mono tracking-tighter">
                                {selectedPkg.usdtAmount.toFixed(2)} <span className="text-xl text-slate-500 uppercase">{selectedCurrencyId}</span>
                            </h4>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">请务必支付上方精确的金额</p>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
                            <div className="space-y-2">
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest flex items-center">
                                    <InformationCircleIcon className="w-3.5 h-3.5 mr-1.5" />
                                    充值地址 ({selectedNetwork})
                                </p>
                                <div className="flex items-center bg-black/40 p-3.5 rounded-2xl border border-white/5 group">
                                    <span className="flex-1 text-xs font-mono text-slate-300 break-all leading-relaxed">
                                        TLYx89374hGf89234jkLsdf9234mNvxZp9
                                    </span>
                                    <button onClick={() => handleCopy('TLYx89374hGf89234jkLsdf9234mNvxZp9')} className="p-2 ml-2 bg-blue-600/20 text-blue-400 rounded-xl hover:bg-blue-600 transition-all hover:text-white">
                                        <ClipboardCopyIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
                                <div>
                                    <p className="text-[9px] text-slate-500 font-black uppercase">订单编号</p>
                                    <p className="text-xs font-mono font-bold text-slate-300">{orderId}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] text-slate-500 font-black uppercase">支付网络</p>
                                    <p className="text-xs font-black text-blue-400 italic uppercase">{selectedNetwork}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-4 flex items-start space-x-3">
                            <ShieldCheckIcon className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <p className="text-xs font-black text-blue-200">汇率已锁定</p>
                                <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                                    我们为您锁定汇率 1:{EXCHANGE_RATE} 持续 15 分钟。请在倒计时结束前完成支付，否则金额将根据实时汇率重新计算。
                                </p>
                            </div>
                        </div>
                    </div>

                    <footer className="p-6 bg-slate-900 border-t border-slate-800 space-y-3">
                        <button onClick={onClose} className="w-full bg-slate-800 hover:bg-slate-700 text-white font-black py-4 rounded-2xl transition-all uppercase tracking-widest text-sm">
                            我已完成支付
                        </button>
                        <p className="text-center text-[9px] text-slate-600 font-bold uppercase tracking-tight">
                            到账时间通常为 1-10 分钟，取决于区块链网络拥堵情况
                        </p>
                    </footer>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div className="bg-slate-950 w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-800 overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <header className="p-6 border-b border-slate-900 flex justify-between items-center bg-slate-900/50">
                    <div>
                        <h3 className="font-black text-xl text-white italic tracking-tighter uppercase">充值中心</h3>
                        <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Crypto Top-up Terminal</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-600 hover:text-white bg-slate-900 rounded-full transition-colors"><CloseIcon className="w-5 h-5" /></button>
                </header>

                <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-6">
                    <DepositStepper />
                    
                    {/* 1. Currency Selection */}
                    <section className="space-y-3">
                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">选择支付币种</label>
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

                    {/* 2. Network Selection */}
                    <section className="space-y-3">
                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">网络协议</label>
                        <button 
                            onClick={() => setIsNetworkDrawerOpen(true)}
                            className="w-full p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between group active:scale-[0.98] transition-all shadow-inner"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-slate-800 rounded-xl border border-white/5 text-blue-500">
                                    <ShieldCheckIcon className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">当前选择网络</p>
                                    <p className="text-white font-black italic uppercase tracking-wider">{selectedNetwork}</p>
                                </div>
                            </div>
                            <div className="flex items-center text-blue-500 space-x-1">
                                <span className="text-[10px] font-black uppercase">切换</span>
                                <ChevronRightIcon className="w-4 h-4" />
                            </div>
                        </button>
                    </section>

                    {/* 3. Package Selection */}
                    <section className="space-y-3">
                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">选择充值金额 ({selectedCurrencyId})</label>
                        <div className="grid grid-cols-3 gap-3">
                            {DEPOSIT_PACKAGES.map(pkg => (
                                <button
                                    key={pkg.id}
                                    onClick={() => setSelectedPackageId(pkg.id)}
                                    className={`relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center shadow-inner ${
                                        selectedPackageId === pkg.id 
                                        ? 'bg-blue-600/10 border-blue-500 shadow-lg' 
                                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                                    }`}
                                >
                                    {pkg.tag && (
                                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-yellow-500 text-slate-950 text-[8px] font-black px-1.5 py-0.5 rounded-full whitespace-nowrap shadow-sm z-10">
                                            {pkg.tag}
                                        </span>
                                    )}
                                    <span className={`text-xl font-black font-mono ${selectedPackageId === pkg.id ? 'text-white' : 'text-slate-400'}`}>
                                        {pkg.usdtAmount}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* 4. Activities (Display Only) */}
                    <section className="space-y-3">
                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">已激活的充值优惠</label>
                        <div className="space-y-2">
                            <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex items-center space-x-3 opacity-95 shadow-lg border-l-4 border-l-yellow-500">
                                <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <TreasureChestIcon className="w-7 h-7 text-yellow-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[11px] font-black text-white uppercase tracking-tight italic">充值特惠计划奖励</p>
                                    <p className="text-[10px] text-blue-400 font-bold mt-0.5 truncate">
                                        赠送: {selectedPkg.bonusAmount > 0 ? `${selectedPkg.bonusAmount.toLocaleString()} RUB Bonus` : ''} 
                                        {selectedPkg.bonusAmount > 0 && selectedPkg.voucherAmount > 0 ? ' + ' : ''}
                                        {selectedPkg.voucherAmount > 0 ? `${selectedPkg.voucherAmount.toLocaleString()} RUB 现金券` : ''}
                                    </p>
                                </div>
                                <CheckIcon className="w-5 h-5 text-blue-500" />
                            </div>
                        </div>
                    </section>
                </div>

                {/* Combined Calculation & Action Footer */}
                <div className="bg-slate-900 border-t border-slate-800 p-6 space-y-5 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                             <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">最终预计权益总价值 (NET)</span>
                                <div className="flex items-baseline">
                                    <span className="text-3xl font-black text-yellow-500 font-mono tracking-tighter">
                                        {calculation.totalBenefit.toLocaleString()}
                                    </span>
                                    <span className="text-[10px] font-black text-slate-600 ml-1 uppercase">RUB</span>
                                </div>
                             </div>
                             <div className="text-right flex flex-col items-end">
                                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">参考汇率</span>
                                <span className="text-xs font-mono font-bold text-white bg-slate-800 px-2 py-1 rounded-md border border-white/5">1 {selectedCurrencyId} ≈ {EXCHANGE_RATE} RUB</span>
                             </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/5">
                            <div className="flex flex-col">
                                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tight">基础 RUB</span>
                                <span className="text-xs font-black text-white">{calculation.baseRub.toLocaleString()}</span>
                            </div>
                            <div className="flex flex-col border-x border-white/5 px-2">
                                <span className="text-[8px] font-bold text-blue-400 uppercase tracking-tight">Bonus 奖励</span>
                                <span className="text-xs font-black text-blue-400">+{selectedPkg.bonusAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-tight">现金券 赠送</span>
                                <span className="text-xs font-black text-emerald-400">+{selectedPkg.voucherAmount.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={handleConfirmDeposit}
                        disabled={isProcessing}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-95 text-lg uppercase tracking-widest flex items-center justify-center group relative overflow-hidden"
                    >
                        {isProcessing ? (
                            <ArrowPathIcon className="w-6 h-6 animate-spin" />
                        ) : (
                            <>
                                <span className="relative z-10">确认充值 {selectedPkg.usdtAmount} {selectedCurrencyId}</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            </>
                        )}
                    </button>
                    
                    <p className="text-center text-[9px] text-slate-600 font-bold uppercase tracking-tighter opacity-60">
                        确认充值即代表您已阅读并同意加密货币支付协议及汇率准则
                    </p>
                </div>

                {/* Network Selection Drawer */}
                {isNetworkDrawerOpen && (
                    <div className="fixed inset-0 z-[210] flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setIsNetworkDrawerOpen(false)}>
                        <div className="bg-slate-900 rounded-t-[2.5rem] p-6 shadow-2xl border-t border-slate-800 animate-slide-up" onClick={e => e.stopPropagation()}>
                            <div className="w-12 h-1.5 bg-slate-800 rounded-full mx-auto mb-6"></div>
                            <header className="flex justify-between items-center mb-6 px-2">
                                <div>
                                    <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">选择网络协议</h3>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{activeCurrency.id} 网络环境</p>
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
                                                    <CheckIcon className="w-4 h-4" />
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
            </div>
            
            <style>{`
                @keyframes slideUp {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .animate-fade-in { animation: fadeIn 0.3s ease-out; }
            `}</style>
        </div>
    );
};

export default DepositModal;
