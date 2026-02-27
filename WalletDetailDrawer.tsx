
import React from 'react';
import { User, WalletType } from '../types';
// FIX: CrownIcon is exported from QuickAccessIcons, not GenericIcons.
import { CloseIcon, BanknotesIcon, GiftIcon, LockClosedIcon, ShieldCheckIcon, CoinIcon, ChartPieIcon, CheckIcon } from './icons/GenericIcons';
import { CrownIcon } from './icons/QuickAccessIcons';

interface WalletDetailDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    user: User;
    activeWallet: WalletType;
    onSelectWallet: (type: WalletType) => void;
}

const WalletDetailDrawer: React.FC<WalletDetailDrawerProps> = ({ isOpen, onClose, user, activeWallet, onSelectWallet }) => {
    if (!isOpen) return null;

    const AssetSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
        <div className="space-y-3">
            <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] px-1">{title}</h4>
            <div className="grid grid-cols-1 gap-3">
                {children}
            </div>
        </div>
    );

    const WalletCard: React.FC<{ 
        type?: WalletType; 
        icon: React.FC<any>; 
        label: string; 
        amount: number; 
        unit?: string;
        isSelectable?: boolean;
        subItems?: { label: string; amount: number }[];
        accentColor: string;
    }> = ({ type, icon: Icon, label, amount, unit = 'RUB', isSelectable, subItems, accentColor }) => {
        const isSelected = type === activeWallet;
        
        return (
            <button 
                onClick={() => isSelectable && type && onSelectWallet(type)}
                disabled={!isSelectable}
                className={`relative w-full text-left rounded-3xl p-5 border-2 transition-all overflow-hidden ${
                    isSelectable 
                        ? isSelected 
                            ? `bg-slate-900 border-${accentColor}-500/50 shadow-xl shadow-${accentColor}-900/20 scale-[1.02]`
                            : `bg-slate-900/50 border-white/5 hover:border-white/10 active:scale-95`
                        : `bg-slate-950 border-white/5 cursor-default opacity-80`
                }`}
            >
                {/* 背景装饰 */}
                <div className={`absolute -right-4 -top-4 p-4 opacity-5 ${isSelected ? 'opacity-10' : ''}`}>
                    <Icon className="w-20 h-20" />
                </div>

                <div className="flex items-start justify-between relative z-10">
                    <div className="flex items-center space-x-3">
                        <div className={`p-2.5 rounded-xl ${isSelected ? `bg-${accentColor}-500 text-white` : 'bg-slate-800 text-slate-500'}`}>
                            <Icon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">{label}</p>
                            <p className="text-2xl font-black font-mono text-white tracking-tight">
                                {amount.toLocaleString()} <span className="text-xs font-bold text-slate-600 ml-0.5">{unit}</span>
                            </p>
                        </div>
                    </div>
                    {isSelectable && isSelected && (
                        <div className={`bg-${accentColor}-500 p-1 rounded-full shadow-lg`}>
                            <CheckIcon className="w-4 h-4 text-white stroke-[3]" />
                        </div>
                    )}
                </div>

                {subItems && (
                    <div className="mt-4 pt-4 border-t border-white/5 flex space-x-6 relative z-10">
                        {subItems.map((sub, i) => (
                            <div key={i}>
                                <p className="text-[9px] font-bold text-slate-600 uppercase mb-0.5 flex items-center">
                                    {sub.label.includes('锁') && <LockClosedIcon className="w-2.5 h-2.5 mr-1" />}
                                    {sub.label}
                                </p>
                                <p className="text-xs font-black text-slate-300 font-mono">{sub.amount.toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                )}

                {isSelectable && !isSelected && (
                    <div className="absolute right-4 bottom-4">
                        <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-md">点击切换使用</span>
                    </div>
                )}
            </button>
        );
    };

    return (
        <div className="fixed inset-0 z-[250] flex flex-col justify-end bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div className="bg-[#0b101b] rounded-t-[3rem] p-6 shadow-[0_-20px_60px_rgba(0,0,0,0.8)] border-t border-white/5 animate-slide-up max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="w-12 h-1.5 bg-slate-800 rounded-full mx-auto mb-6 flex-shrink-0"></div>
                
                <header className="flex justify-between items-center mb-8 px-2 flex-shrink-0">
                    <div>
                        <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">资产详情</h3>
                        <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Asset & Wallet Overview</p>
                    </div>
                    <button onClick={onClose} className="p-2.5 bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </header>

                <main className="flex-1 overflow-y-auto no-scrollbar space-y-8 pb-10">
                    {/* 1. 可投注钱包 */}
                    <AssetSection title="可用于下注的钱包 (Selectable for Betting)">
                        <WalletCard 
                            type="cash"
                            icon={BanknotesIcon} 
                            label="现金主钱包" 
                            amount={user.balance} 
                            isSelectable={true}
                            accentColor="yellow"
                            subItems={[
                                { label: '可提现现金', amount: user.balance - user.lockedBalance },
                                { label: '锁定现金', amount: user.lockedBalance }
                            ]}
                        />
                        <WalletCard 
                            type="bonus"
                            icon={GiftIcon} 
                            label="Bonus 红利钱包" 
                            amount={user.bonusBalance} 
                            isSelectable={true}
                            accentColor="purple"
                        />
                    </AssetSection>

                    {/* 2. 推广与奖励资产 */}
                    <AssetSection title="收益与平台资产 (Assets & Commissions)">
                        <div className="grid grid-cols-2 gap-3">
                            <WalletCard 
                                icon={ChartPieIcon} 
                                label="代理提现佣金" 
                                amount={user.allAgentWithdrawable} 
                                accentColor="green"
                            />
                            <WalletCard 
                                icon={LockClosedIcon} 
                                label="代理锁定佣金" 
                                amount={user.allAgentLocked} 
                                accentColor="slate"
                            />
                        </div>
                        
                        {user.roles.includes('kol') && (
                            <WalletCard 
                                icon={CrownIcon} 
                                label="KOL 专属佣金" 
                                amount={user.kolCommission} 
                                accentColor="blue"
                            />
                        )}

                        <WalletCard 
                            icon={CoinIcon} 
                            label="9XCOIN" 
                            amount={user.points} 
                            unit="POINTS"
                            accentColor="orange"
                        />
                    </AssetSection>

                    <div className="p-5 bg-blue-600/10 border border-blue-500/20 rounded-3xl flex items-start space-x-3">
                        <ShieldCheckIcon className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                            <strong className="text-blue-200">资金安全保障：</strong>
                            代理佣金需划转至“可提现钱包”后方可用于投注或提现。9XCoin 可在任务中心兑换现金券。
                        </p>
                    </div>
                </main>
            </div>

            <style>{`
                @keyframes slideUp {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .animate-fade-in { animation: fadeIn 0.3s ease-out; }
                
                /* 用于 Tailwind 动态 Class 的保活 */
                .border-yellow-500\/50 { border-color: rgba(234, 179, 8, 0.5); }
                .bg-yellow-500 { background-color: rgb(234, 179, 8); }
                .shadow-yellow-900\/20 { shadow: 0 10px 15px -3px rgba(133, 77, 14, 0.2); }
                
                .border-purple-500\/50 { border-color: rgba(168, 85, 247, 0.5); }
                .bg-purple-500 { background-color: rgb(168, 85, 247); }
                .shadow-purple-900\/20 { shadow: 0 10px 15px -3px rgba(88, 28, 135, 0.2); }
            `}</style>
        </div>
    );
};

export default WalletDetailDrawer;
