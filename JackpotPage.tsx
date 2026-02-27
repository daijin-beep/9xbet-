
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { PageView, JackpotWinner, JackpotReward, JackpotLeaderboardEntry, Game } from '../types';
import { 
    GLOBAL_JACKPOT_DATA, 
    RECENT_JACKPOT_WINNERS, 
    MY_JACKPOT_REWARDS, 
    JACKPOT_LEADERBOARD_DATA,
    FEATURED_JACKPOT_DATA,
    FEATURED_JACKPOT_LEADERBOARD_DATA,
    FEATURED_JACKPOT_GAMES,
    GLOBAL_JACKPOT_PRIZES
} from '../constants';
// FIX: Added missing RocketLaunchIcon, ChevronRightIcon, and CoinIcon to the imports.
import { 
    ArrowLeftIcon,
    GiftIcon,
    GlobeAltIcon,
    TrophyIcon,
    ClockIcon,
    UserCircleIcon,
    ExclamationTriangleIcon,
    ListBulletIcon,
    QuestionMarkCircleIcon,
    ArrowPathIcon,
    CheckIcon,
    FireIcon,
    SparklesIcon,
    RocketLaunchIcon,
    ChevronRightIcon,
    CoinIcon
} from './icons/GenericIcons';
import { CrownIcon } from './icons/QuickAccessIcons';

// --- STYLES & ANIMATIONS ---
const JackpotPageStyles = () => (
    <style>{`
        .jackpot-bg {
            background-color: #020617;
            background-image: radial-gradient(circle at top left, rgba(30, 41, 59, 0.5) 0%, transparent 30%),
                              radial-gradient(circle at bottom right, rgba(79, 70, 229, 0.3) 0%, transparent 40%);
        }
        .neon-glow-cyan {
            box-shadow: 0 0 15px rgba(34, 211, 238, 0.4), inset 0 0 10px rgba(34, 211, 238, 0.1);
        }
        .text-shadow-cyan {
            text-shadow: 0 0 12px rgba(34, 211, 238, 0.8);
        }
        .winners-ticker-wrap {
            background: rgba(15, 23, 42, 0.8);
            backdrop-filter: blur(8px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        @keyframes scroll-winners {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-200%); }
        }
        .winners-feed-inner {
            display: flex;
            white-space: nowrap;
            animation: scroll-winners 40s linear infinite;
        }
        .winners-feed-inner:hover {
            animation-play-state: paused;
        }
        .rank-gradient-1 { 
            background: linear-gradient(135deg, #fcd34d 0%, #d97706 100%); 
            border: 2px solid rgba(255,255,255,0.3);
        }
        .rank-gradient-2 { 
            background: linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%);
            border: 1px solid rgba(255,255,255,0.2);
        }
        .rank-gradient-3 { 
            background: linear-gradient(135deg, #fdba74 0%, #c2410c 100%);
            border: 1px solid rgba(255,255,255,0.2);
        }
        .animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        
        .pulse-border {
            animation: pulse-border 2s infinite;
        }
        @keyframes pulse-border {
            0% { box-shadow: 0 0 0 0 rgba(34, 211, 238, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(34, 211, 238, 0); }
            100% { box-shadow: 0 0 0 0 rgba(34, 211, 238, 0); }
        }
    `}</style>
);

// --- HELPER COMPONENTS ---

const JackpotCounter: React.FC<{ prizePool: number; className?: string }> = ({ prizePool, className = "text-5xl text-shadow-cyan text-cyan-300" }) => {
    const [displayValue, setDisplayValue] = useState(prizePool);

    useEffect(() => {
        const interval = setInterval(() => {
            setDisplayValue(prev => prev + (Math.random() * 5));
        }, 800);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={`font-mono font-black tracking-tighter ${className}`}>
            ${displayValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
    );
};

const WinnersTicker: React.FC<{ winners: JackpotWinner[] }> = ({ winners }) => (
    <div className="winners-ticker-wrap h-10 overflow-hidden relative flex items-center z-30">
        <div className="absolute left-0 top-0 bottom-0 px-3 bg-red-600 text-white text-[9px] font-black uppercase flex items-center italic tracking-tighter z-10 shadow-[5px_0_15px_rgba(0,0,0,0.5)]">
            <FireIcon className="w-3.5 h-3.5 mr-1 animate-pulse" /> LIVE WINNERS
        </div>
        <div className="winners-feed-inner">
            {winners.map((winner, index) => (
                <div key={`${winner.id}-${index}`} className="flex items-center px-8 text-[11px] font-bold">
                    <span className="text-slate-500 mr-2 uppercase tracking-widest font-black italic">Just Won</span>
                    <span className="text-white mr-2">{winner.username}</span>
                    <span className="text-yellow-400 font-black font-mono mr-2">${winner.amount.toLocaleString()}</span>
                    <span className="text-slate-600 uppercase text-[9px]">in {winner.game}</span>
                </div>
            ))}
        </div>
    </div>
);

const Leaderboard: React.FC<{data: JackpotLeaderboardEntry[]}> = ({data}) => (
    <div className="space-y-3">
        <div className="grid grid-cols-12 px-5 text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">
            <div className="col-span-2">Rank</div>
            <div className="col-span-6">Identity</div>
            <div className="col-span-4 text-right">Contribution</div>
        </div>
        
        {data.map((player) => {
            const isTop3 = player.rank <= 3;
            const rankClasses = player.rank === 1 ? 'rank-gradient-1 scale-[1.03] origin-center z-10' : 
                              player.rank === 2 ? 'rank-gradient-2' : 
                              player.rank === 3 ? 'rank-gradient-3' : 'bg-slate-900/50 border-white/5';

            return (
                <div 
                    key={player.rank} 
                    className={`grid grid-cols-12 items-center px-5 py-4 rounded-[1.5rem] border transition-all ${isTop3 ? `${rankClasses} shadow-2xl` : 'bg-slate-900/50 border-white/5 hover:border-white/10'}`}
                >
                    <div className="col-span-2">
                        {isTop3 ? (
                            <div className="bg-black/20 w-9 h-9 rounded-2xl flex items-center justify-center shadow-inner">
                                <TrophyIcon className={`w-5 h-5 ${player.rank === 1 ? 'text-yellow-100' : 'text-white'}`} />
                            </div>
                        ) : (
                            <span className="text-lg font-black font-mono text-slate-600 ml-2 italic">#{player.rank}</span>
                        )}
                    </div>
                    
                    <div className="col-span-6 flex items-center space-x-3">
                        <div className="relative">
                            <img src={player.avatarUrl} alt="" className="w-11 h-11 rounded-[1rem] object-cover border-2 border-white/10 shadow-lg" />
                            {player.rank === 1 && (
                                <div className="absolute -top-2.5 -right-2.5 bg-yellow-400 p-1 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)] border-2 border-slate-900">
                                    <CrownIcon className="w-3.5 h-3.5 text-slate-900" />
                                </div>
                            )}
                        </div>
                        <div className="min-w-0">
                            <p className={`font-black text-sm truncate uppercase italic tracking-tighter ${isTop3 ? 'text-white' : 'text-slate-200'}`}>
                                {player.username}
                            </p>
                            <div className="flex items-center mt-0.5 space-x-1">
                                <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${isTop3 ? 'bg-black/20 text-white' : 'bg-slate-800 text-slate-500'}`}>
                                    VIP {Math.floor(Math.random() * 5) + 3}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-4 text-right">
                        <p className={`text-md font-black font-mono ${isTop3 ? 'text-white drop-shadow-sm' : 'text-green-400'}`}>
                            ${player.contribution.toLocaleString()}
                        </p>
                        <p className={`text-[8px] font-bold uppercase ${isTop3 ? 'text-white/40' : 'text-slate-600'}`}>Wagered</p>
                    </div>
                </div>
            );
        })}
    </div>
);

// --- TABS ---

const GlobalJackpotTab: React.FC<{ setActivePage: (page: PageView, categoryKey?: string) => void; }> = ({setActivePage}) => {
    const { myContribution, leaderboardThreshold } = GLOBAL_JACKPOT_DATA;
    const progressPercentage = Math.min((myContribution / leaderboardThreshold) * 100, 100);
    const gap = Math.max(0, leaderboardThreshold - myContribution);

    return (
        <div className="animate-fade-in">
            <WinnersTicker winners={RECENT_JACKPOT_WINNERS} />
            
            <div className="p-5 space-y-8 pb-32">
                {/* 奖池看板 */}
                <section className="relative text-center p-10 rounded-[3.5rem] bg-slate-900 border border-cyan-500/20 neon-glow-cyan overflow-hidden group">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] animate-pulse"></div>
                    
                    <div className="relative z-10 space-y-2">
                        <h3 className="text-[10px] text-cyan-400 font-black tracking-[0.5em] uppercase italic drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">Arena Grand Prize</h3>
                        <JackpotCounter prizePool={GLOBAL_JACKPOT_DATA.prizePool} />
                        
                        <div className="pt-8 flex flex-col items-center">
                            <div className="flex items-center space-x-2 text-slate-500 mb-3">
                                <ClockIcon className="w-4 h-4 text-cyan-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest italic">Settlement Countdown</span>
                            </div>
                            <div className="flex space-x-2.5">
                                {[ { v: '01', l: 'D' }, { v: '18', l: 'H' }, { v: '32', l: 'M' } ].map((t, i) => (
                                    <div key={i} className="bg-slate-950/80 px-5 py-3 rounded-2xl border border-white/5 shadow-inner">
                                        <span className="text-2xl font-black font-mono text-white leading-none">{t.v}</span>
                                        <span className="text-[9px] font-black text-slate-600 ml-1.5">{t.l}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* 参与状态与快速游戏 */}
                <section className="bg-slate-900 rounded-[3rem] border border-white/5 p-7 shadow-2xl space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12">
                        <SparklesIcon className="w-32 h-32 text-blue-400" />
                    </div>

                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <h4 className="text-xl font-black text-white italic uppercase tracking-tighter">竞技参与现状</h4>
                            <p className="text-[10px] text-slate-500 font-bold tracking-[0.2em] uppercase">Your Competition Status</p>
                        </div>
                        <div className="bg-green-500/10 px-4 py-1.5 rounded-full border border-green-500/20 flex items-center">
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse mr-2"></div>
                            <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">Real-time Synced</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 relative z-10">
                        <div className="bg-slate-950/50 rounded-3xl p-5 border border-white/5 text-center shadow-inner">
                            <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-1.5">当前累计投注</p>
                            <p className="text-3xl font-black text-white font-mono tracking-tighter">${myContribution.toLocaleString()}</p>
                        </div>
                        <div className="bg-blue-600/10 rounded-3xl p-5 border border-blue-500/20 text-center shadow-inner group">
                            <p className="text-[10px] text-blue-400/60 font-black uppercase tracking-widest mb-1.5">预计瓜分比例</p>
                            <p className="text-3xl font-black text-blue-400 font-mono tracking-tighter group-hover:scale-110 transition-transform">0.05%</p>
                        </div>
                    </div>

                    <div className="space-y-3 relative z-10">
                        <div className="flex justify-between items-end px-1">
                            <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.15em]">入榜进度 (距离第10名)</span>
                            <span className="text-sm font-black text-yellow-500 italic">{Math.round(progressPercentage)}%</span>
                        </div>
                        <div className="w-full h-4 bg-slate-950 rounded-full overflow-hidden border border-white/5 shadow-inner">
                            <div 
                                className="h-full bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-400 rounded-full transition-all duration-[1.5s] cubic-bezier(0.16, 1, 0.3, 1) shadow-[0_0_20px_rgba(34,211,238,0.5)]" 
                                style={{ width: `${progressPercentage}%` }}
                            ></div>
                        </div>
                        {gap > 0 ? (
                            <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-3.5 text-center flex flex-col items-center space-y-1">
                                <p className="text-[11px] font-black text-orange-400 italic uppercase tracking-tight">
                                    Target Alert
                                </p>
                                <p className="text-xs font-bold text-slate-200">
                                    还差 <span className="text-white font-black font-mono text-sm underline decoration-orange-500/50 underline-offset-4">${gap.toLocaleString()}</span> 有效流水即可进入瓜分区！
                                </p>
                            </div>
                        ) : (
                            <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-3 text-center">
                                <p className="text-xs font-black text-green-400 uppercase tracking-[0.2em] italic">Qualified for sharing!</p>
                            </div>
                        )}
                    </div>

                    <button 
                        onClick={() => setActivePage('gameList', 'slot')}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-[1.8rem] shadow-[0_20px_40px_rgba(37,99,235,0.4)] transition-all active:scale-95 text-lg uppercase tracking-widest flex items-center justify-center group relative overflow-hidden"
                    >
                        <span className="relative z-10">立即去刷流水</span>
                        <RocketLaunchIcon className="w-6 h-6 ml-3 group-hover:translate-y-[-4px] group-hover:translate-x-[4px] transition-transform relative z-10" />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    </button>
                </section>

                {/* 排行榜数据 */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center space-x-3">
                            <div className="w-1.5 h-7 bg-yellow-500 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
                            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">赛季英雄榜</h3>
                        </div>
                        <button className="text-[11px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors flex items-center group">
                            <span>更多详情</span>
                            <ChevronRightIcon className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                    
                    <Leaderboard data={JACKPOT_LEADERBOARD_DATA} />
                </section>
            </div>
        </div>
    );
};

const FeaturedJackpotTab: React.FC<{ setActivePage: (page: PageView, categoryKey?: string) => void; }> = ({ setActivePage }) => {
    return (
        <div className="animate-fade-in p-5 space-y-8">
            <section className="relative h-56 rounded-[3rem] bg-cover bg-center overflow-hidden flex flex-col justify-center items-center text-center group shadow-2xl border border-white/5" style={{ backgroundImage: `url(${FEATURED_JACKPOT_DATA.heroImageUrl})` }}>
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black/90 group-hover:opacity-90 transition-opacity"></div>
                <div className="relative z-10 space-y-3">
                    <span className="text-[10px] font-black bg-pink-600 text-white px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-xl shadow-pink-900/40 border border-white/20">Network Exclusive</span>
                    <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter drop-shadow-2xl">Pragmatic Drops</h2>
                    <JackpotCounter prizePool={FEATURED_JACKPOT_DATA.prizePool} className="text-4xl text-shadow-cyan text-cyan-300" />
                </div>
            </section>

            <section className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center space-x-3">
                        <div className="w-1.5 h-7 bg-pink-500 rounded-full shadow-[0_0_10px_rgba(236,72,153,0.5)]"></div>
                        <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">实时积分榜</h3>
                    </div>
                    <div className="flex items-center text-[10px] text-slate-500 font-bold bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                        <ClockIcon className="w-3.5 h-3.5 mr-2 text-pink-400" />
                        每分钟自动刷新
                    </div>
                </div>
                
                <Leaderboard data={FEATURED_JACKPOT_LEADERBOARD_DATA} />
                
                <button 
                    onClick={() => setActivePage('gameList', 'slot')}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-slate-300 font-black py-5 rounded-[1.8rem] transition-all uppercase tracking-[0.2em] text-xs border border-white/10 shadow-xl active:scale-[0.98]"
                >
                    查看参与该活动的游戏厂商
                </button>
            </section>
        </div>
    );
};

const MyRewardsTab: React.FC<{ setActivePage: (page: PageView) => void; }> = ({ setActivePage }) => {
    const [rewards, setRewards] = useState(MY_JACKPOT_REWARDS);
    const [claimingId, setClaimingId] = useState<string | null>(null);

    const handleClaim = (rewardId: string) => {
        setClaimingId(rewardId);
        setTimeout(() => {
            setRewards(prev => prev.map(r => r.id === rewardId ? {...r, status: 'claimed' as const, claimedAt: Date.now()} : r));
            setClaimingId(null);
        }, 1500);
    };

    if (rewards.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[65vh] text-center p-10 animate-fade-in">
                <div className="bg-slate-900 p-12 rounded-[3rem] mb-8 border border-white/5 shadow-2xl relative">
                    <div className="absolute -top-4 -right-4 bg-blue-600 p-3 rounded-full animate-bounce">
                        <SparklesIcon className="w-6 h-6 text-white" />
                    </div>
                    <GiftIcon className="w-24 h-24 text-slate-800" />
                </div>
                <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-4">虚位以待</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium mb-12 px-10">
                    在任一奖池竞技周期内完成排名任务，即可在此处领取您的瓜分奖励。
                </p>
                <button 
                    onClick={() => setActivePage('jackpot')}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-black py-5 px-14 rounded-[1.8rem] shadow-2xl shadow-blue-900/40 transition-all uppercase tracking-widest active:scale-95"
                >
                    立即参与竞技
                </button>
            </div>
        );
    }

    return (
        <div className="p-5 space-y-6 animate-fade-in pb-24">
            {rewards.map(reward => (
                <div key={reward.id} className="bg-slate-900 rounded-[2.5rem] border border-white/5 p-6 flex items-center justify-between group hover:border-blue-500/40 transition-all shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                         <CoinIcon className="w-24 h-24 text-yellow-500" />
                    </div>
                    
                    <div className="space-y-1.5 flex-1 mr-4 min-w-0 relative z-10">
                        <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-black text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-md uppercase tracking-widest">{reward.source}</span>
                            {reward.status === 'claimable' && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>}
                        </div>
                        <h4 className="font-black text-white text-xl truncate uppercase tracking-tight italic">{reward.title}</h4>
                        <p className={`text-3xl font-black font-mono tracking-tighter ${reward.status === 'claimable' ? 'text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.2)]' : 'text-slate-600'}`}>
                            ${reward.amount.toLocaleString()}
                        </p>
                    </div>

                    {reward.status === 'claimable' ? (
                        <button 
                            onClick={() => handleClaim(reward.id)}
                            disabled={claimingId === reward.id}
                            className="bg-green-600 hover:bg-green-500 text-white font-black py-5 px-8 rounded-3xl shadow-xl shadow-green-900/40 transition-all active:scale-90 disabled:opacity-50 flex-shrink-0"
                        >
                            {claimingId === reward.id ? <ArrowPathIcon className="w-7 h-7 animate-spin" /> : <span className="uppercase tracking-widest text-xs italic">Claim</span>}
                        </button>
                    ) : (
                        <div className="flex flex-col items-end opacity-30 flex-shrink-0">
                            <CheckIcon className="w-8 h-8 text-green-500 mb-1" />
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Received</span>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

// --- MAIN PAGE ---

const JACKPOT_TABS = [
  { id: 'global', label: '全站奖池', Icon: GlobeAltIcon },
  { id: 'featured', label: '精选活动', Icon: TrophyIcon },
  { id: 'rewards', label: '我的奖励', Icon: GiftIcon },
];

interface JackpotPageProps {
  setActivePage: (page: PageView, categoryKey?: string) => void;
}

const JackpotPage: React.FC<JackpotPageProps> = ({ setActivePage }) => {
  const [activeTab, setActiveTab] = useState<string>(JACKPOT_TABS[0].id);

  const renderContent = () => {
    switch (activeTab) {
      case 'global': return <GlobalJackpotTab setActivePage={setActivePage} />;
      case 'featured': return <FeaturedJackpotTab setActivePage={setActivePage} />;
      case 'rewards': return <MyRewardsTab setActivePage={setActivePage} />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-full jackpot-bg text-white font-sans selection:bg-cyan-500 selection:text-slate-900">
      <JackpotPageStyles />
      
      <header className="sticky top-0 bg-slate-950/80 backdrop-blur-2xl z-40 px-5 py-5 flex items-center border-b border-white/5">
        <button 
            onClick={() => setActivePage('home')}
            className="p-2.5 mr-4 text-slate-500 hover:text-cyan-400 rounded-2xl bg-white/5 hover:bg-slate-900 transition-all border border-transparent hover:border-cyan-500/20 shadow-inner group"
            aria-label="Go back"
        >
          <ArrowLeftIcon className="w-6 h-6 group-active:translate-x-[-2px] transition-transform" />
        </button>
        <div className="flex-1">
            <h1 className="text-2xl font-black italic tracking-tighter uppercase leading-none">Jackpot Arena</h1>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.25em] mt-1.5 opacity-80">Global High-Stake Events</p>
        </div>
        <div className="bg-cyan-500/10 border border-cyan-500/20 px-4 py-1.5 rounded-full flex items-center shadow-lg shadow-cyan-900/10">
            <div className="w-2 h-2 bg-cyan-400 rounded-full pulse-border mr-2.5"></div>
            <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest italic">Live Now</span>
        </div>
      </header>

      <nav className="sticky top-[78px] bg-slate-950/95 backdrop-blur-2xl z-40 flex border-b border-white/5 p-2 space-x-1.5">
        {JACKPOT_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex flex-col items-center justify-center py-3 rounded-[1.5rem] transition-all duration-500
              ${activeTab === tab.id 
                ? 'text-cyan-400 bg-white/5 shadow-inner border border-white/10' 
                : 'text-slate-500 hover:text-slate-300'
              }`}
            role="tab"
            aria-selected={activeTab === tab.id}
          >
            <tab.Icon className={`w-5 h-5 mb-1.5 transition-all ${activeTab === tab.id ? 'text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.6)] scale-110' : 'text-slate-700'}`} />
            <span className={`text-[9px] font-black uppercase tracking-[0.15em] ${activeTab === tab.id ? 'opacity-100' : 'opacity-60'}`}>{tab.label}</span>
          </button>
        ))}
      </nav>

      <main className="flex-1 overflow-y-auto no-scrollbar bg-slate-950/40">
          {renderContent()}
      </main>
    </div>
  );
};

export default JackpotPage;
