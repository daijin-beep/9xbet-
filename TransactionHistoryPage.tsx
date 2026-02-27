
import React, { useState, useMemo, useEffect } from 'react';
import { PageView, TransactionHistoryItem, TransactionHistoryTab } from '../types';
import { MOCK_TRANSACTION_HISTORY, TRANSACTION_HISTORY_TABS } from '../constants';
import { 
    ArrowLeftIcon,
    ArrowDownTrayIcon, 
    ArrowUpTrayIcon, 
    ShieldCheckIcon,
    ClockIcon,
    ExclamationTriangleIcon,
    ChevronRightIcon,
    ClipboardCopyIcon,
    CircleStackIcon
} from './icons/GenericIcons';

interface TransactionHistoryPageProps {
  setActivePage: (page: PageView) => void;
}

const PaymentCountdown: React.FC<{ expiry: number; onEnd: () => void }> = ({ expiry, onEnd }) => {
    const [timeLeft, setTimeLeft] = useState(expiry - Date.now());

    useEffect(() => {
        const interval = setInterval(() => {
            const nextTime = expiry - Date.now();
            if (nextTime <= 0) {
                setTimeLeft(0);
                onEnd();
                clearInterval(interval);
            } else {
                setTimeLeft(nextTime);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [expiry, onEnd]);

    const m = Math.floor(timeLeft / 1000 / 60);
    const s = Math.floor((timeLeft / 1000) % 60);

    return (
        <span className="font-mono text-yellow-400 font-black">
            {String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
        </span>
    );
};

const TransactionCard: React.FC<{ item: TransactionHistoryItem }> = ({ item }) => {
    const [isExpired, setIsExpired] = useState(item.status === 'expired' || (item.expiryTime ? Date.now() > item.expiryTime : false));
    const isDeposit = item.type === 'deposit';

    const statusConfig: { [key: string]: { text: string; Icon: React.FC<any>; color: string; bg: string } } = {
        completed: { text: '成功', Icon: ShieldCheckIcon, color: 'text-green-400', bg: 'bg-green-500/10' },
        pending: { text: '待支付', Icon: ClockIcon, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
        failed: { text: '失败', Icon: ExclamationTriangleIcon, color: 'text-red-400', bg: 'bg-red-500/10' },
        expired: { text: '已失效', Icon: ExclamationTriangleIcon, color: 'text-gray-500', bg: 'bg-gray-500/10' },
    };
    
    const currentStatus = isExpired ? statusConfig.expired : statusConfig[item.status];

    const handleCopyOrderId = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(item.orderId);
        alert('订单号已复制');
    };

    return (
        <div className={`bg-slate-800/80 rounded-2xl border border-slate-700 overflow-hidden shadow-xl transition-all ${isExpired ? 'opacity-60' : 'opacity-100 hover:border-slate-600'}`}>
            {/* Header: Status & Order ID */}
            <header className="px-4 py-3 bg-slate-900/50 flex justify-between items-center border-b border-slate-700/50">
                <div className="flex items-center space-x-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center ${currentStatus.bg} ${currentStatus.color}`}>
                        <currentStatus.Icon className="w-3 h-3 mr-1" />
                        {currentStatus.text}
                    </span>
                    <button 
                        onClick={handleCopyOrderId}
                        className="flex items-center space-x-1 px-2 py-0.5 bg-slate-800 rounded-md border border-white/5 hover:bg-slate-700 transition-colors group"
                    >
                        <span className="text-[10px] font-mono text-gray-500 group-hover:text-gray-300">ID: {item.orderId}</span>
                        <ClipboardCopyIcon className="w-3 h-3 text-gray-600 group-hover:text-gray-400" />
                    </button>
                </div>
                <span className="text-[10px] text-gray-500 font-bold font-mono">
                    {new Date(item.timestamp).toLocaleString()}
                </span>
            </header>

            {/* Body: Main Amounts */}
            <div className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <div className={`p-3 rounded-[1rem] ${isDeposit ? 'bg-blue-500/10' : 'bg-purple-500/10'}`}>
                            {isDeposit 
                                ? <ArrowDownTrayIcon className="w-6 h-6 text-blue-400" />
                                : <ArrowUpTrayIcon className="w-6 h-6 text-purple-400" />
                            }
                        </div>
                        <div>
                            <h3 className="font-black text-white text-lg italic tracking-tighter uppercase">{isDeposit ? '充值记录' : '提现申请'}</h3>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{item.method}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className={`text-2xl font-black font-mono tracking-tighter ${isDeposit ? 'text-blue-400' : 'text-white'}`}>
                           {isDeposit ? '+' : '-'}{item.amount.toLocaleString()} <span className="text-[10px] text-gray-500 ml-0.5 font-bold">{item.currency}</span>
                        </p>
                    </div>
                </div>

                {/* Context Block: Fees & Arrival Details */}
                {(item.cryptoAmount || item.exchangeRate) && (
                    <div className="bg-slate-900/50 rounded-xl p-3 border border-white/5 space-y-3">
                        {/* Summary Line */}
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500">
                             <span>{isDeposit ? '支付及到账明细' : '费用及提现明细'}</span>
                             <span>汇率 1:{item.exchangeRate}</span>
                        </div>

                        {/* Fee Detail (For Withdrawal Only) */}
                        {!isDeposit && (item.platformFee !== undefined || item.networkFee !== undefined) && (
                            <div className="grid grid-cols-2 gap-2 pb-2 border-b border-white/5">
                                {item.platformFee !== undefined && (
                                    <div className="flex flex-col">
                                        <span className="text-[9px] text-gray-500 uppercase font-bold">平台手续费</span>
                                        <span className="text-xs text-red-500/80 font-black italic">-{item.platformFee} RUB</span>
                                    </div>
                                )}
                                {item.networkFee !== undefined && (
                                    <div className="flex flex-col items-end">
                                        <span className="text-[9px] text-gray-500 uppercase font-bold">网络处理费</span>
                                        <span className="text-xs text-red-500/80 font-black italic">-{item.networkFee} {item.cryptoCurrency}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Final Result Detail */}
                        <div className="flex justify-between items-baseline pt-1">
                            <div className="flex flex-col">
                                <span className="text-[9px] text-gray-500 uppercase font-bold mb-0.5">
                                    {isDeposit ? '用户实际支付' : '最终预计到账 (NET)'}
                                </span>
                                <div className="flex items-center">
                                    <span className="text-xl font-black text-yellow-500 font-mono italic">{item.cryptoAmount}</span>
                                    <span className="text-[10px] font-bold text-gray-500 ml-1.5">{item.cryptoCurrency} ({item.network})</span>
                                </div>
                            </div>
                            <div className="text-right flex flex-col items-end">
                                <span className="text-[9px] text-gray-500 uppercase font-bold mb-0.5">
                                    {isDeposit ? '基础到账 RUB' : '业务基准 RUB'}
                                </span>
                                <span className="text-xs font-mono font-bold text-gray-400">
                                    {isDeposit ? `≈ ${item.amount.toLocaleString()}` : `${item.amount.toLocaleString()}`} RUB
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer Actions / Countdown (For Deposit) */}
                {!isExpired && item.status === 'pending' && isDeposit && (
                    <div className="flex items-center space-x-3 pt-2">
                        <div className="flex-1 bg-slate-900/80 rounded-xl px-4 py-3 border border-yellow-500/20 flex items-center justify-between">
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">支付有效倒计时</span>
                            {item.expiryTime && (
                                <PaymentCountdown expiry={item.expiryTime} onEnd={() => setIsExpired(true)} />
                            )}
                        </div>
                        <button className="bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black px-6 py-3 rounded-xl shadow-lg shadow-yellow-900/20 transition-all active:scale-95 text-xs uppercase tracking-widest flex items-center group">
                            <span>继续支付</span>
                            <ChevronRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const TransactionHistoryPage: React.FC<TransactionHistoryPageProps> = ({ setActivePage }) => {
    const [activeTab, setActiveTab] = useState<TransactionHistoryTab['id']>('all');

    const filteredTxs = useMemo(() => {
        if (activeTab === 'all') {
            return MOCK_TRANSACTION_HISTORY;
        }
        return MOCK_TRANSACTION_HISTORY.filter(tx => tx.type === activeTab);
    }, [activeTab]);

    return (
        <div className="flex flex-col h-full bg-slate-950 text-white">
            <header className="sticky top-0 bg-slate-900 shadow-md z-20 p-3 flex items-center border-b border-slate-800">
                <button 
                    onClick={() => setActivePage('profile')}
                    className="p-2 mr-2 text-gray-300 hover:text-blue-400 rounded-full hover:bg-slate-800 transition-colors"
                    aria-label="Go back to profile"
                >
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <div>
                    <h1 className="text-xl font-black italic tracking-tighter uppercase">交易存根</h1>
                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Transaction Archives</p>
                </div>
            </header>

            <nav className="sticky top-[68px] bg-slate-900/80 backdrop-blur-md z-10 p-2 border-b border-slate-800 flex justify-around">
                {TRANSACTION_HISTORY_TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 py-3 text-[11px] font-black uppercase tracking-[0.15em] rounded-xl transition-all
                            ${activeTab === tab.id 
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                                : 'text-gray-500 hover:text-gray-300'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>

            <main className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
                {filteredTxs.length > 0 ? (
                    filteredTxs.map(tx => <TransactionCard key={tx.id} item={tx} />)
                ) : (
                    <div className="flex flex-col items-center justify-center pt-24 space-y-4 opacity-30">
                        <CircleStackIcon className="w-16 h-16 text-slate-700" />
                        <div className="text-center">
                            <p className="text-lg font-black uppercase italic tracking-tighter">无交易存根</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest">Your archives are empty</p>
                        </div>
                    </div>
                )}
                <div className="h-24"></div>
            </main>
        </div>
    );
};

export default TransactionHistoryPage;
