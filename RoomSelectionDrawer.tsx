
import React from 'react';
// Added ChevronRightIcon and InformationCircleIcon to the imports
import { CloseIcon, FireIcon, CoinIcon, GiftIcon, ChartBarIcon, BanknotesIcon, ChevronRightIcon, InformationCircleIcon } from './icons/GenericIcons';
import { Game } from '../types';

interface RoomSelectionDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    game: Game | null;
    onSelectRoom: (roomType: 'high' | 'low' | 'bonus') => void;
}

interface RoomOption {
    type: 'high' | 'low' | 'bonus';
    title: string;
    subTitle: string;
    icon: React.FC<any>;
    gradient: string;
    rtp: string;
    minBet: string;
    tag?: string;
}

const RoomSelectionDrawer: React.FC<RoomSelectionDrawerProps> = ({ isOpen, onClose, game, onSelectRoom }) => {
    if (!isOpen || !game) return null;

    const rooms: RoomOption[] = [
        {
            type: 'high',
            title: '巅峰对决场',
            subTitle: '高倍率高回报 · 适合资深玩家',
            icon: FireIcon,
            gradient: 'from-red-600 to-orange-600',
            rtp: '98.2%',
            minBet: '500',
            tag: 'HIGH STAKES'
        },
        {
            type: 'low',
            title: '休闲娱乐场',
            subTitle: '轻松上手 · 适合新手试炼',
            icon: CoinIcon,
            gradient: 'from-blue-600 to-cyan-600',
            rtp: '96.5%',
            minBet: '10',
            tag: 'CASUAL'
        },
        {
            type: 'bonus',
            title: '专属红利场',
            subTitle: '使用红利进入 · 爆率全面加成',
            icon: GiftIcon,
            gradient: 'from-purple-600 to-pink-600',
            rtp: '99.1%',
            minBet: '100',
            tag: 'BOOSTED'
        }
    ];

    return (
        <div className="fixed inset-0 z-[200] flex flex-col justify-end bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div className="bg-slate-900 rounded-t-[3rem] p-6 pb-10 shadow-2xl border-t border-slate-800 animate-slide-up max-h-[90vh] overflow-y-auto no-scrollbar" onClick={e => e.stopPropagation()}>
                <div className="w-12 h-1.5 bg-slate-800 rounded-full mx-auto mb-6"></div>
                
                <header className="flex justify-between items-start mb-8 px-2">
                    <div>
                        <div className="flex items-center space-x-2 mb-1">
                            <span className="text-[10px] font-black bg-blue-600 text-white px-2 py-0.5 rounded uppercase tracking-widest">{game.provider}</span>
                        </div>
                        <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-tight">{game.title}</h3>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">选择您的竞技赛道 / Select Arena</p>
                    </div>
                    <button onClick={onClose} className="p-3 bg-slate-800 rounded-2xl text-gray-400 hover:text-white transition-colors border border-white/5 shadow-inner">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </header>

                <div className="space-y-4">
                    {rooms.map((room) => (
                        <button 
                            key={room.type}
                            onClick={() => onSelectRoom(room.type)} 
                            className={`w-full relative overflow-hidden bg-gradient-to-r ${room.gradient} rounded-[2rem] p-5 flex flex-col transition-all group active:scale-[0.98] shadow-xl hover:shadow-2xl`}
                        >
                            {/* Decorative background icon */}
                            <room.icon className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-500" />
                            
                            <div className="flex items-center justify-between relative z-10 mb-4">
                                <div className="flex items-center">
                                    <div className="p-3 bg-white/20 rounded-2xl mr-4 backdrop-blur-md border border-white/20 shadow-inner">
                                        <room.icon className="w-7 h-7 text-white drop-shadow-md"/>
                                    </div>
                                    <div className="text-left">
                                        <div className="flex items-center space-x-2">
                                            <p className="font-black text-white text-xl italic uppercase tracking-tight">{room.title}</p>
                                            {room.tag && <span className="text-[8px] font-black bg-black/30 text-white/90 px-1.5 py-0.5 rounded border border-white/10 uppercase">{room.tag}</span>}
                                        </div>
                                        <p className="text-white/70 text-xs font-medium mt-0.5">{room.subTitle}</p>
                                    </div>
                                </div>
                                <div className="bg-black/20 p-2 rounded-full backdrop-blur-sm border border-white/10">
                                    {/* ChevronRightIcon is now correctly imported */}
                                    <ChevronRightIcon className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>

                            {/* Data Stats Bar */}
                            <div className="grid grid-cols-2 gap-3 relative z-10">
                                <div className="bg-black/20 backdrop-blur-md rounded-2xl py-3 px-4 flex items-center justify-between border border-white/10">
                                    <div className="flex items-center space-x-2">
                                        <ChartBarIcon className="w-3.5 h-3.5 text-white/60" />
                                        <span className="text-[10px] font-black text-white/60 uppercase">RTP 爆率</span>
                                    </div>
                                    <span className="text-sm font-black font-mono text-white italic drop-shadow-sm">{room.rtp}</span>
                                </div>
                                <div className="bg-black/20 backdrop-blur-md rounded-2xl py-3 px-4 flex items-center justify-between border border-white/10">
                                    <div className="flex items-center space-x-2">
                                        <BanknotesIcon className="w-3.5 h-3.5 text-white/60" />
                                        <span className="text-[10px] font-black text-white/60 uppercase">最低投注</span>
                                    </div>
                                    <div className="flex items-baseline space-x-1">
                                        <span className="text-sm font-black font-mono text-white">{room.minBet}</span>
                                        <span className="text-[9px] font-bold text-white/60 uppercase">RUB</span>
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-start space-x-3">
                    {/* InformationCircleIcon is now correctly imported */}
                    <InformationCircleIcon className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                        提示：不同场次的爆率 (RTP) 为理论计算值，实际结果由游戏内 RNG 随机生成。大额场次在完成高额流水时将获得额外的 VIP 经验加成。
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes slideUp {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .animate-fade-in { animation: fadeIn 0.3s ease-out; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            `}</style>
        </div>
    );
};

export default RoomSelectionDrawer;
