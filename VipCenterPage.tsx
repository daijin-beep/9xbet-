
import React, { useState, useRef, useEffect } from 'react';
import { VIP_LEVELS } from '../constants';
import { PageView, VipLevel } from '../types';
// FIX: Import missing InformationCircleIcon from GenericIcons.
import { CheckIcon, GiftIcon, BanknotesIcon, LightningBoltIcon, ShieldCheckIcon, ArrowRightIcon, InformationCircleIcon } from './icons/GenericIcons';
import { CrownIcon } from './icons/QuickAccessIcons';
import PromotionsHeader from './PromotionsHeader';

interface VipCenterPageProps {
    setActivePage: (page: PageView) => void;
    isEmbedded?: boolean;
}

const MyVipStatusCard: React.FC<{ 
    currentLevel: VipLevel; 
    nextLevel: VipLevel | null;
    userProgress: { bet: number; deposit: number };
}> = ({ currentLevel, nextLevel, userProgress }) => {
    const statusItems = [
        { label: '升级礼金', value: currentLevel.levelUpBonus, suffix: ' RUB', Icon: GiftIcon },
        { label: '周常规奖金', value: currentLevel.weeklyBonus, suffix: ' RUB', Icon: GiftIcon },
        { label: '提现限额', value: currentLevel.dailyWithdrawalLimit, suffix: ' RUB', Icon: BanknotesIcon },
        { label: '极速出款', value: currentLevel.fastWithdrawal ? '已开启' : '未开启', Icon: LightningBoltIcon },
    ];

    const depPercent = nextLevel ? Math.min((userProgress.deposit / nextLevel.depositRequirement) * 100, 100) : 100;
    const betPercent = nextLevel ? Math.min((userProgress.bet / nextLevel.betRequirement) * 100, 100) : 100;

    return (
        <section className="px-4 pt-6">
            <div className={`relative overflow-hidden rounded-[2.5rem] p-6 text-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] border border-white/10 bg-gradient-to-br ${currentLevel.gradientFromClass} ${currentLevel.gradientToClass}`}>
                {/* 装饰性背景 */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-white/10 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                
                {/* 顶部：等级标题 */}
                <div className="relative z-10 flex items-start justify-between mb-8">
                    <div className="flex flex-col">
                        <h2 className="text-8xl font-black italic tracking-tighter leading-none drop-shadow-2xl opacity-90">
                            VIP <span className="text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">{currentLevel.level}</span>
                        </h2>
                        <p className="text-white/80 font-black uppercase tracking-[0.3em] text-[11px] mt-4 flex items-center">
                            <span className="w-10 h-px bg-white/40 mr-2"></span>
                            {currentLevel.name} 会员状态
                        </p>
                    </div>
                    <div className="bg-black/30 p-5 rounded-[2rem] backdrop-blur-2xl border border-white/10 shadow-inner group">
                        <CrownIcon className="w-14 h-14 text-yellow-300 drop-shadow-[0_0_20px_rgba(253,224,71,0.6)] group-hover:scale-110 transition-transform duration-500" />
                    </div>
                </div>
                
                {/* 核心权益网格 */}
                <div className="relative z-10 grid grid-cols-2 gap-3 mb-8">
                    {statusItems.map((item, idx) => (
                        <div key={idx} className="bg-black/30 backdrop-blur-md rounded-2xl p-3 border border-white/5 flex flex-col justify-between h-20">
                            <p className="text-[10px] text-white/50 font-bold uppercase tracking-tight">{item.label}</p>
                            <div className="flex items-center justify-between">
                                <p className="text-lg font-black truncate">
                                    {item.value}<span className="text-[10px] opacity-60 ml-0.5">{item.suffix}</span>
                                </p>
                                <item.Icon className="w-4 h-4 text-white/30" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* 升级进度条 - 紧凑型 */}
                {nextLevel && (
                    <div className="relative z-10 bg-black/40 backdrop-blur-xl rounded-3xl p-5 border border-white/10">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-[11px] font-black uppercase tracking-widest text-white/80">距离下一级 ({nextLevel.name})</span>
                            <span className="text-[10px] font-bold text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full">进行中</span>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-[10px] font-bold text-white/60">
                                    <span>累计充值</span>
                                    <span>{userProgress.deposit.toLocaleString()} / {nextLevel.depositRequirement.toLocaleString()}</span>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                                    <div className="bg-white h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_white]" style={{ width: `${depPercent}%` }}></div>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-[10px] font-bold text-white/60">
                                    <span>累计下注</span>
                                    <span>{userProgress.bet.toLocaleString()} / {nextLevel.betRequirement.toLocaleString()}</span>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                                    <div className="bg-blue-400 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(96,165,250,0.6)]" style={{ width: `${betPercent}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

const BenefitRow: React.FC<{ label: string; currentValue: any; nextValue: any; isCurrent: boolean }> = ({ label, currentValue, nextValue, isCurrent }) => {
    const formatValue = (value: any) => {
        if (typeof value === 'boolean') {
            return value ? <CheckIcon className="w-5 h-5 text-green-400 mx-auto" /> : <span className="text-gray-600">-</span>;
        }
        if (typeof value === 'number') {
            return value.toLocaleString();
        }
        return value;
    };

    return (
        <div className={`grid grid-cols-3 items-center py-4 text-sm border-b border-slate-800 last:border-0 ${isCurrent ? 'bg-blue-600/5 -mx-4 px-4' : ''}`}>
            <span className="text-gray-400 text-[11px] font-bold uppercase tracking-tight">{label}</span>
            <span className="text-white font-black text-center">{formatValue(currentValue)}</span>
            <span className="text-yellow-400 font-black text-center text-lg drop-shadow-[0_0_8px_rgba(250,204,21,0.3)]">{formatValue(nextValue)}</span>
        </div>
    );
};

const VipCenterPage: React.FC<VipCenterPageProps> = ({ setActivePage, isEmbedded = false }) => {
    const [currentUserLevel] = useState(3); // 模拟用户级别为 VIP 3 (Gold)
    const [userProgress] = useState({ bet: 12500, deposit: 4200 });

    const currentLevelData = VIP_LEVELS[currentUserLevel - 1];
    const nextLevelData = VIP_LEVELS[currentUserLevel] || null;
    
    // 如果没有下一级，则对比前一级
    const displayNextLevel = nextLevelData || currentLevelData;
    const displayCurrentLevel = nextLevelData ? currentLevelData : VIP_LEVELS[currentUserLevel - 2];

    const benefitsToCompare = [
        { key: 'levelUpBonus', label: '升级礼金' },
        { key: 'weeklyBonus', label: '周常规奖金' },
        { key: 'dailyWithdrawalLimit', label: '单日提现额度' },
        { key: 'dailyWithdrawalCount', label: '每日提现次数' },
        { key: 'fastWithdrawal', label: '极速出款通道' },
        { key: 'highlightIdentifier', label: 'VIP专属徽章' },
    ];

    return (
        <div className="flex flex-col h-full bg-slate-950 text-white selection:bg-yellow-400 selection:text-slate-900">
            {!isEmbedded && <PromotionsHeader activePage="vipCenter" setActivePage={setActivePage} />}
            
            <main className="flex-1 overflow-y-auto no-scrollbar pb-32">
                {/* 1. 顶部 VIP 状态卡片 */}
                <MyVipStatusCard 
                    currentLevel={currentLevelData} 
                    nextLevel={nextLevelData}
                    userProgress={userProgress}
                />

                {/* 2. 权益对比表格 */}
                <section className="px-4 mt-12">
                    <div className="bg-slate-900/50 backdrop-blur-xl rounded-[2.5rem] p-6 shadow-2xl border border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                             <CrownIcon className="w-32 h-32" />
                        </div>
                        
                        <h3 className="text-xl font-black italic mb-8 uppercase tracking-tight flex items-center relative z-10">
                            <span className="w-2.5 h-7 bg-blue-500 rounded-full mr-3 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></span>
                            晋级权益对比
                        </h3>

                        <div className="grid grid-cols-3 items-center py-4 text-[10px] font-black text-center uppercase tracking-[0.2em] border-b-2 border-slate-800 relative z-10">
                            <span className="text-gray-600 text-left">权益项</span>
                            <span className={`${displayCurrentLevel.colorClass}`}>{displayCurrentLevel.name}</span>
                            <span className={`${displayNextLevel.colorClass} flex flex-col items-center`}>
                                {displayNextLevel.name}
                                {nextLevelData && <span className="text-[8px] bg-yellow-400 text-slate-950 px-1.5 py-0.5 rounded-sm mt-1 animate-pulse">UPGRADE</span>}
                            </span>
                        </div>

                        <div className="mt-2 relative z-10">
                            {benefitsToCompare.map(b => (
                                <BenefitRow
                                    key={b.key}
                                    label={b.label}
                                    currentValue={displayCurrentLevel[b.key as keyof VipLevel]}
                                    nextValue={displayNextLevel[b.key as keyof VipLevel]}
                                    isCurrent={true}
                                />
                            ))}
                        </div>
                        
                        <div className="mt-8 p-4 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex items-start space-x-3">
                            <InformationCircleIcon className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                            <p className="text-[11px] text-gray-400 leading-relaxed">
                                晋级礼金在升级后自动发放，流水要求请参考奖金中心规则。周/月奖金需手动领取。
                            </p>
                        </div>
                    </div>
                </section>

                {/* 3. VIP 会员准则简述 */}
                <section className="px-4 mt-8 mb-6">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-900 rounded-3xl p-5 border border-white/5 space-y-2">
                             <GiftIcon className="w-8 h-8 text-purple-400" />
                             <h4 className="font-bold text-sm text-white">保级机制</h4>
                             <p className="text-[10px] text-gray-500 leading-snug">每月需完成该级别50%的流水要求即可保持等级，否则将下调一级。</p>
                        </div>
                        <div className="bg-slate-900 rounded-3xl p-5 border border-white/5 space-y-2">
                             <ShieldCheckIcon className="w-8 h-8 text-green-400" />
                             <h4 className="font-bold text-sm text-white">隐私保护</h4>
                             <p className="text-[10px] text-gray-500 leading-snug">VIP 3 及以上用户可开启完全隐私模式，隐藏在排行榜及中奖记录中的ID。</p>
                        </div>
                    </div>
                </section>
            </main>
            
            {/* 4. 底部固定的 CTA */}
            {nextLevelData && !isEmbedded && (
                <footer className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent z-40">
                    <button 
                        onClick={() => setActivePage('profile')}
                        className="w-full bg-gradient-to-r from-yellow-500 to-yellow-300 hover:from-yellow-400 hover:to-white text-slate-950 font-black text-xl py-5 rounded-[1.8rem] shadow-[0_20px_50px_rgba(250,204,21,0.3)] transition-all active:scale-95 uppercase italic tracking-tighter flex items-center justify-center group"
                    >
                        <span>立即充值 快速升级</span>
                        <ArrowRightIcon className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                </footer>
            )}
        </div>
    );
};

export default VipCenterPage;
