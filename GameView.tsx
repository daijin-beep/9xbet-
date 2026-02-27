
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Game, Bonus } from '../types';
import { 
    CloseIcon, ArrowPathIcon, ArrowLeftIcon, CogIcon, PlusIcon, 
    InformationCircleIcon, ChevronDownIcon, ClockIcon, CircleStackIcon, 
    TrophyIcon, GiftIcon, TrashIcon, ExclamationTriangleIcon, ArrowsUpDownIcon, RocketLaunchIcon,
    ChartBarIcon, GlobeAltIcon, SparklesIcon, CheckIcon
} from './icons/GenericIcons'; 

// 老虎机符号库
const SYMBOLS = ['🍒', '💎', '7️⃣', '🔔', '🎰', '🍋', '🍉', '⭐', '🍀'];

// 初始模拟红利队列 (增加多条数据以演示排队和置顶)
const INITIAL_BONUSES: Bonus[] = [
    {
        id: 'b-active-1',
        title: '55% 再存红利',
        category: 'bonus',
        status: 'active',
        expiresAt: Date.now() + 172800000,
        principal: 1000,
        lockedWinnings: 2450.50,
        rules: '仅限老虎机使用',
        wageringRequirement: { current: 12500, target: 25000 }
    },
    {
        id: 'v-queued-1',
        title: '周五回馈现金券',
        category: 'voucher',
        status: 'queued',
        expiresAt: Date.now() + 86400000 * 3,
        principal: 500,
        lockedWinnings: 500,
        rules: '1倍流水即可提现',
        wageringRequirement: { current: 0, target: 500 }
    },
    {
        id: 'b-queued-2',
        title: 'VIP 专属成长礼金',
        category: 'bonus',
        status: 'queued',
        expiresAt: Date.now() + 86400000 * 7,
        principal: 2000,
        lockedWinnings: 4000,
        rules: '全场通用',
        wageringRequirement: { current: 0, target: 8000 }
    }
];

interface GameViewProps {
  game: Game;
  onClose: () => void;
  roomType?: 'high' | 'low' | 'bonus';
}

const GameView: React.FC<GameViewProps> = ({ game, onClose, roomType }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);
  
  // 奖金队列状态
  const [bonusQueue, setBonusQueue] = useState<Bonus[]>(INITIAL_BONUSES);
  // 详情面板展开状态：'none' | 'jackpot' | 'bonus'
  const [expandedType, setExpandedType] = useState<'none' | 'jackpot' | 'bonus'>('none');
  
  // Jackpot 模拟数据
  const [jackpotData, setJackpotData] = useState({
      rank: 112,
      turnover: 8540.50,
      totalPool: 1258400.00,
      endTime: Date.now() + 3600000 * 2, // 2小时后结束
      thresholdRank: 100, // 前100名可瓜分
      estimatedShare: 0.15 // 0.15%
  });

  const [balance, setBalance] = useState(roomType === 'bonus' ? bonusQueue[0]?.lockedWinnings || 0 : 12345.67);
  const [currentBet, setCurrentBet] = useState(100);
  const [lastWin, setLastWin] = useState(0);
  const [reels, setReels] = useState<string[][]>(Array(5).fill([]).map(() => 
    Array(3).fill('').map(() => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)])
  ));
  const [showWinEffect, setShowWinEffect] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // 当前活跃红利/现金券
  const activeBonus = useMemo(() => bonusQueue.find(b => b.status === 'active' || b.status === 'locked'), [bonusQueue]);
  
  // 待激活/排队中的列表
  const queuedBonuses = useMemo(() => bonusQueue.filter(b => b.status === 'queued'), [bonusQueue]);

  // 进度计算 (Bonus)
  const activeBonusProgress = useMemo(() => {
      if (!activeBonus) return 0;
      return (activeBonus.wageringRequirement.current / activeBonus.wageringRequirement.target) * 100;
  }, [activeBonus]);

  // --- 逻辑操作函数 ---

  // 置顶操作：将队列中的某项移到活跃项之后的第一个位置
  const handlePromote = (id: string) => {
    const target = bonusQueue.find(b => b.id === id);
    if (!target) return;

    const otherItems = bonusQueue.filter(b => b.id !== id);
    // 假设第一位是活跃项，我们把 target 插在索引 1
    const newQueue = [otherItems[0], target, ...otherItems.slice(1)];
    setBonusQueue(newQueue);
  };

  // 放弃并切换下一张
  const handleForfeitAndSwitch = () => {
    if (!activeBonus) return;
    if (!window.confirm('确定放弃当前奖金并切换至下一张吗？当前已产生的赢利和打码进度将作废。')) return;

    const remaining = bonusQueue.filter(b => b.id !== activeBonus.id);
    if (remaining.length > 0) {
        // 将下一个 queued 提升为 active
        const next = { ...remaining[0], status: 'active' as const };
        setBonusQueue([next, ...remaining.slice(1)]);
        // 同步更新游戏余额（如果是红利场）
        if (roomType === 'bonus') setBalance(next.lockedWinnings);
    } else {
        setBonusQueue([]);
        if (roomType === 'bonus') setBalance(0);
    }
    alert('已成功切换至下一张奖金/现金券。');
  };

  const handleSpin = useCallback(() => {
    if (isSpinning || balance < currentBet) return;
    setIsSpinning(true);
    setShowWinEffect(false);
    setBalance(prev => prev - currentBet);
    
    // 更新 Jackpot 流水
    setJackpotData(prev => ({ ...prev, turnover: prev.turnover + currentBet }));

    // 同时更新红利打码进度
    if (activeBonus) {
        setBonusQueue(prev => prev.map(b => 
            b.id === activeBonus.id 
            ? { ...b, wageringRequirement: { ...b.wageringRequirement, current: b.wageringRequirement.current + currentBet } }
            : b
        ));
    }

    setTimeout(() => {
      const newReels = Array(5).fill([]).map(() => Array(3).fill('').map(() => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]));
      setReels(newReels);
      setIsSpinning(false);
      if (Math.random() > 0.7) {
        const winAmount = currentBet * (Math.floor(Math.random() * 5) + 2);
        setLastWin(winAmount);
        setBalance(prev => prev + winAmount);
        setShowWinEffect(true);
      }
    }, 1200);
  }, [isSpinning, balance, currentBet, activeBonus]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-slate-950 z-[150] flex flex-col items-center justify-center text-white">
        <div className="relative">
            <div className="w-24 h-24 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
            <img src={game.imageSrc} alt="" className="absolute inset-0 w-16 h-16 m-auto rounded-full object-cover animate-pulse" />
        </div>
        <h2 className="mt-8 text-2xl font-black italic tracking-tighter uppercase">{game.title}</h2>
        <p className="mt-2 text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs">Entering Arena...</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#070b14] z-[150] flex flex-col text-white overflow-hidden font-sans select-none">
      <style>{`
        @keyframes reelSpin { 0% { transform: translateY(0); } 100% { transform: translateY(-50%); } }
        .animate-spin-v { animation: reelSpin 0.15s linear infinite; }
        .game-gradient { background: radial-gradient(circle at center, #1a2236 0%, #070b14 100%); }
        .animate-fade-in { animation: fadeIn 0.2s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .jackpot-glow { box-shadow: 0 0 15px rgba(34, 211, 238, 0.3); }
        .bonus-glow { box-shadow: 0 0 15px rgba(168, 85, 247, 0.3); }
      `}</style>

      {/* 顶部导航 */}
      <header className="relative flex flex-col p-4 bg-slate-900/95 backdrop-blur-xl border-b border-white/5 z-[160]">
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <button onClick={onClose} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all border border-white/5">
                    <ArrowLeftIcon className="w-5 h-5 text-gray-400" />
                </button>
                <div className="min-w-0 hidden xs:block">
                    <h3 className="text-xs font-black italic tracking-tight uppercase leading-none truncate max-w-[80px]">{game.title}</h3>
                    <p className={`text-[8px] font-bold mt-1 uppercase ${roomType === 'bonus' ? 'text-purple-400' : roomType === 'high' ? 'text-red-400' : 'text-blue-400'}`}>
                        {roomType === 'bonus' ? 'Bonus Mode' : roomType === 'high' ? 'High Roller' : 'Casual Play'}
                    </p>
                </div>
            </div>

            <div className="flex items-center space-x-2">
                {/* 1. Jackpot 组件 */}
                {(roomType === 'low' || roomType === 'high') && (
                    <div className="relative">
                        <button 
                            onClick={() => setExpandedType(expandedType === 'jackpot' ? 'none' : 'jackpot')}
                            className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-full border transition-all jackpot-glow ${
                                expandedType === 'jackpot' ? 'bg-cyan-600 border-cyan-400' : 'bg-cyan-600/10 border-cyan-500/30'
                            }`}
                        >
                            <TrophyIcon className={`w-4 h-4 ${expandedType === 'jackpot' ? 'text-white' : 'text-cyan-400'}`} />
                            <div className="flex flex-col items-start leading-none">
                                <span className="text-[7px] font-black uppercase text-cyan-200/60">Rank</span>
                                <span className="text-[10px] font-black text-white italic">#{jackpotData.rank}</span>
                            </div>
                            <div className="w-px h-4 bg-white/10 mx-1"></div>
                            <div className="flex flex-col items-start leading-none">
                                <span className="text-[7px] font-black uppercase text-cyan-200/60">Pool</span>
                                <span className="text-[10px] font-black text-white font-mono">${(jackpotData.totalPool / 1000000).toFixed(1)}M</span>
                            </div>
                            <ChevronDownIcon className={`w-3 h-3 text-white/50 transition-transform ${expandedType === 'jackpot' ? 'rotate-180' : ''}`} />
                        </button>

                        {expandedType === 'jackpot' && (
                            <div className="absolute top-full right-0 mt-3 w-72 bg-slate-900 rounded-[2rem] border border-cyan-500/20 shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-5 space-y-5 animate-fade-in z-[170]">
                                <div className="text-center space-y-1">
                                    <p className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">Global Jackpot Pool</p>
                                    <p className="text-3xl font-black text-white font-mono tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                                        ${jackpotData.totalPool.toLocaleString()}
                                    </p>
                                </div>
                                <div className="bg-slate-950/50 rounded-2xl p-4 border border-white/5 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center text-[10px] font-black text-slate-500 uppercase">
                                            <ClockIcon className="w-3.5 h-3.5 mr-1.5 text-cyan-500" />
                                            本轮结束倒计时
                                        </div>
                                        <span className="text-xs font-mono font-bold text-white">01:42:55</span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-end">
                                            <p className="text-[10px] font-black text-slate-500 uppercase">当前排名 / 入围线</p>
                                            <p className="text-xs font-black text-white">#{jackpotData.rank} <span className="text-slate-600">/ {jackpotData.thresholdRank}</span></p>
                                        </div>
                                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <div className="bg-cyan-500 h-full shadow-[0_0_10px_rgba(34,211,238,0.5)]" style={{ width: '85%' }}></div>
                                        </div>
                                        <p className="text-[9px] font-bold text-orange-400 italic">* 还差 {jackpotData.rank - jackpotData.thresholdRank} 名即可进入瓜分区</p>
                                    </div>
                                </div>
                                <div className="bg-cyan-500/5 border border-cyan-500/10 rounded-2xl p-4 flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-cyan-500/20 rounded-xl"><SparklesIcon className="w-5 h-5 text-cyan-400" /></div>
                                        <div>
                                            <p className="text-[9px] text-slate-500 font-bold uppercase">入围后预计瓜分</p>
                                            <p className="text-sm font-black text-cyan-400 font-mono">{jackpotData.estimatedShare}% <span className="text-[9px] opacity-40">OF POOL</span></p>
                                        </div>
                                    </div>
                                    <InformationCircleIcon className="w-4 h-4 text-slate-600" />
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* 2. Bonus/Voucher 进度组件 */}
                {activeBonus && (
                    <div className="relative">
                        <button 
                            onClick={() => setExpandedType(expandedType === 'bonus' ? 'none' : 'bonus')}
                            className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-full border transition-all bonus-glow ${
                                expandedType === 'bonus' ? 'bg-purple-600 border-purple-400' : 'bg-purple-600/10 border-purple-500/30'
                            }`}
                        >
                            <GiftIcon className={`w-4 h-4 ${expandedType === 'bonus' ? 'text-white' : 'text-purple-400'}`} />
                            <div className="hidden xs:flex flex-col items-start leading-none">
                                <span className="text-[7px] font-black uppercase text-purple-200/60">{activeBonus.category === 'bonus' ? 'Bonus' : 'Voucher'} Wager</span>
                                <div className="w-12 h-1 bg-black/40 rounded-full overflow-hidden mt-0.5">
                                    <div className="bg-purple-400 h-full transition-all" style={{ width: `${activeBonusProgress}%` }}></div>
                                </div>
                            </div>
                            <div className="xs:hidden text-[10px] font-black">{Math.round(activeBonusProgress)}%</div>
                            <ChevronDownIcon className={`w-3 h-3 text-white/50 transition-transform ${expandedType === 'bonus' ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Bonus/Voucher 详情展开面板 */}
                        {expandedType === 'bonus' && (
                            <div className="absolute top-full right-0 mt-3 w-80 bg-slate-900 rounded-[2.5rem] border border-purple-500/20 shadow-[0_25px_60px_rgba(0,0,0,0.9)] p-6 space-y-6 animate-fade-in z-[170] overflow-hidden">
                                {/* 当前活跃项详情 */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="text-sm font-black text-white italic uppercase tracking-tight">{activeBonus.title}</h4>
                                            <div className="flex items-center mt-1 space-x-2">
                                                <span className="text-[9px] font-black bg-purple-600/20 text-purple-400 px-1.5 py-0.5 rounded uppercase border border-purple-500/20">Active</span>
                                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{activeBonus.category}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] text-slate-500 font-black uppercase mb-1">卷面金额</p>
                                            <p className="text-lg font-black text-white font-mono">{activeBonus.principal.toLocaleString()} <span className="text-[10px]">RUB</span></p>
                                        </div>
                                    </div>

                                    <div className="bg-slate-950/50 rounded-2xl p-4 border border-white/5 space-y-3">
                                        <div className="flex justify-between items-end">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center">
                                                <ClockIcon className="w-3.5 h-3.5 mr-1.5 text-purple-500" />
                                                有效期至: {new Date(activeBonus.expiresAt).toLocaleDateString()}
                                            </p>
                                            <p className="text-xs font-black text-purple-400">{Math.round(activeBonusProgress)}%</p>
                                        </div>
                                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                            <div className="bg-purple-500 h-full shadow-[0_0_15px_rgba(168,85,247,0.6)] transition-all duration-700" style={{ width: `${activeBonusProgress}%` }}></div>
                                        </div>
                                        <div className="flex justify-between text-[9px] font-bold">
                                            <span className="text-slate-500 italic">Progress: {activeBonus.wageringRequirement.current.toLocaleString()} RUB</span>
                                            <span className="text-white">Target: {activeBonus.wageringRequirement.target.toLocaleString()} RUB</span>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={handleForfeitAndSwitch}
                                        className="w-full py-3 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center space-x-2"
                                    >
                                        <TrashIcon className="w-3.5 h-3.5" />
                                        <span>放弃并切换下一张卷</span>
                                    </button>
                                </div>

                                {/* 排队中的列表 */}
                                {queuedBonuses.length > 0 && (
                                    <div className="pt-4 border-t border-white/5">
                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4">Queued Rewards ({queuedBonuses.length})</p>
                                        <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar">
                                            {queuedBonuses.map(item => (
                                                <div key={item.id} className="flex items-center justify-between p-3 bg-slate-950/40 rounded-2xl border border-white/5 group hover:bg-slate-950 transition-colors">
                                                    <div className="min-w-0 flex-1 mr-3">
                                                        <p className="text-[11px] font-bold text-slate-300 truncate tracking-tight">{item.title}</p>
                                                        <p className="text-[9px] text-slate-600 font-mono mt-0.5">Value: {item.principal} RUB</p>
                                                    </div>
                                                    <button 
                                                        onClick={() => handlePromote(item.id)}
                                                        className="px-3 py-1.5 bg-blue-600/10 text-blue-500 rounded-xl text-[9px] font-black uppercase tracking-tighter hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-90"
                                                    >
                                                        优先激活 (Pin)
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* 余额展示 */}
                <div className="bg-black/40 px-3 py-1.5 rounded-xl border border-white/10 flex flex-col items-end min-w-[90px]">
                    <span className="text-[7px] font-black text-slate-500 uppercase tracking-tighter">Balance</span>
                    <span className={`font-black font-mono text-xs ${roomType === 'bonus' ? 'text-purple-400' : 'text-yellow-500'}`}>
                        {balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                </div>
            </div>
        </div>
      </header>

      {/* 核心游戏区 (老虎机模拟) */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 relative game-gradient">
        <div className={`relative bg-slate-900/80 border-4 border-slate-800 rounded-[2.5rem] p-4 shadow-2xl transition-all duration-500 ${showWinEffect ? 'win-glow border-yellow-500/50 scale-[1.02]' : ''}`}>
            <div className="flex space-x-1.5">
                {reels.map((col, i) => (
                    <div key={i} className="w-12 sm:w-16 h-40 sm:h-56 bg-black/60 rounded-2xl overflow-hidden border border-white/5 relative shadow-inner">
                        <div className={`flex flex-col items-center space-y-4 py-4 transition-transform ${isSpinning ? 'animate-spin-v' : ''}`}>
                            {(isSpinning ? [...SYMBOLS, ...SYMBOLS] : col).map((symbol, j) => (
                                <div key={j} className="text-2xl sm:text-3xl h-10 sm:h-14 flex items-center justify-center drop-shadow-lg">{symbol}</div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            {showWinEffect && (
                <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none animate-bounce">
                    <div className="bg-yellow-500 text-black font-black text-xl px-8 py-3 rounded-full shadow-[0_0_50px_rgba(234,179,8,1)] italic uppercase tracking-tighter">Winner!</div>
                </div>
            )}
        </div>
        
        <div className="mt-8 flex space-x-10 opacity-50">
             <div className="text-center">
                <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Win</p>
                <p className="text-2xl font-black font-mono text-yellow-400">{lastWin > 0 ? `+${lastWin}` : '0.00'}</p>
             </div>
             <div className="text-center">
                <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Bet</p>
                <p className="text-2xl font-black font-mono text-white">{currentBet}</p>
             </div>
        </div>
      </main>

      {/* 底部控制栏 */}
      <footer className="bg-slate-900 border-t border-white/5 p-6 pb-10 flex items-center justify-between z-[160]">
        <div className="flex items-center space-x-3 bg-black/40 p-1.5 rounded-xl border border-white/5">
            <button onClick={() => setCurrentBet(Math.max(10, currentBet - 10))} className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center font-black text-lg text-gray-400">-</button>
            <div className="text-center min-w-[50px]">
                <p className="text-[8px] font-black text-slate-600 uppercase">BET</p>
                <p className="text-sm font-black font-mono text-white">{currentBet}</p>
            </div>
            <button onClick={() => setCurrentBet(currentBet + 10)} className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-white"><PlusIcon className="w-4 h-4" /></button>
        </div>
        
        <button onClick={handleSpin} disabled={isSpinning || balance < currentBet} className={`relative group active:scale-95 transition-transform ${isSpinning ? 'opacity-50' : ''}`}>
            <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center border-4 shadow-2xl transition-all ${isSpinning ? 'bg-slate-800 border-slate-700' : 'bg-blue-600 border-blue-400'}`}>
                {isSpinning ? <ArrowPathIcon className="w-10 h-10 animate-spin text-slate-500" /> : <span className="text-xl sm:text-2xl font-black italic uppercase tracking-tighter">Spin</span>}
            </div>
            {!isSpinning && <div className="absolute -inset-2 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>}
        </button>

        <div className="flex space-x-2">
             <button className="w-12 h-12 bg-slate-800 border border-white/5 rounded-xl flex items-center justify-center text-slate-500"><InformationCircleIcon className="w-6 h-6" /></button>
             <button className="w-12 h-12 bg-slate-800 border border-white/5 rounded-xl flex items-center justify-center text-slate-500 font-black text-[8px] uppercase">Auto</button>
        </div>
      </footer>
    </div>
  );
};

export default GameView;
