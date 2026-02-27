import React, { useState, useEffect } from 'react';
import { ACTIVITY_CHESTS } from '../constants';
import { ActivityChest } from '../types';
import { LightningBoltIcon, ChevronRightIcon } from './icons/GenericIcons';

const TreasureChestIcon: React.FC<{ className?: string, isLocked: boolean }> = ({ className, isLocked }) => {
    const mainColor = isLocked ? '#475569' : '#94a3b8'; // slate-600 : slate-400
    const strapColor = isLocked ? '#334155' : '#64748b'; // slate-700 : slate-500
    const lockColor = isLocked ? '#1e293b' : '#475569'; // slate-800 : slate-600

    return (
        <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Lid */}
            <path d="M26 8C26 6.89543 25.1046 6 24 6H8C6.89543 6 6 6.89543 6 8V12H26V8Z" fill={mainColor} />
            {/* Body */}
            <path d="M28 12H4V25C4 25.5523 4.44772 26 5 26H27C27.5523 26 28 25.5523 28 25V12Z" fill={mainColor} />
            {/* Straps */}
            <path d="M27 12H5V26H27V12Z" fill="none" stroke={strapColor} strokeWidth="2"/>
            <path d="M25 6H7V26H25V6Z" fill="none" stroke={strapColor} strokeWidth="2"/>
            {/* Lock */}
            <path d="M14 17H18V21H14V17Z" fill={lockColor} />
            <path d="M16 16V17" stroke={lockColor} strokeWidth="2" strokeLinecap="round"/>
        </svg>
    );
};


const ActivityChestItem: React.FC<{ chest: ActivityChest; userPoints: number; claimedLevels: number[]; onClick: () => void; }> = ({ chest, userPoints, claimedLevels, onClick }) => {
    const isClaimed = claimedLevels.includes(chest.level);
    const isClaimable = !isClaimed && userPoints >= chest.points;
    const isLocked = !isClaimed && !isClaimable;
    
    let containerClasses = "bg-slate-700/50 border-slate-600 group-hover:border-slate-500";
    if (isClaimable) containerClasses = "bg-yellow-500/10 border-yellow-500 animate-pulse";
    if (isClaimed) containerClasses = "bg-slate-800 border-slate-700 opacity-60";

    return (
        <button 
            onClick={onClick}
            className="flex flex-col items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-lg"
            aria-label={`View Level ${chest.level} Chest`}
            disabled={isClaimed}
        >
            <div className={`relative w-[72px] h-[72px] rounded-full flex items-center justify-center border-2 ${containerClasses} transition-all`}>
                <TreasureChestIcon className={`w-12 h-12 transition-colors`} isLocked={isLocked}/>
                <span className={`absolute bottom-1 right-1 font-bold text-white bg-black/40 rounded-full w-5 h-5 flex items-center justify-center text-xs border border-white/20`}>
                    {chest.level}
                </span>
            </div>
            <div className={`mt-2 flex items-center text-xs px-2 py-1 rounded-full border ${isLocked ? 'border-slate-700 text-slate-500' : 'border-slate-600 text-slate-400'} ${isClaimed ? 'opacity-60' : ''}`}>
                <LightningBoltIcon className={`w-3 h-3 mr-1 ${isLocked ? 'text-slate-600' : 'text-slate-500'}`}/>
                <span>- {chest.points}</span>
            </div>
        </button>
    );
};

interface TreasureChestSectionProps {
  currentUserPoints: number;
  claimedLevels: number[];
  onChestClick: (chest: ActivityChest) => void;
}

const TreasureChestSection: React.FC<TreasureChestSectionProps> = ({ currentUserPoints, claimedLevels, onChestClick }) => {
    const [timeLeft, setTimeLeft] = useState(1 * 3600 + 25 * 60 + 41); // 01:25:41

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };
    
    return (
        <section className="bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-md">
            <div className="flex justify-between items-center mb-4 px-1">
                 <h3 className="text-white font-semibold text-md flex items-center">
                    Current Active Level
                    <LightningBoltIcon className="w-5 h-5 mx-1 text-green-400" />
                    <span className="text-green-400 font-bold text-lg">{currentUserPoints}</span>
                 </h3>
                 <p className="text-sm text-gray-400">
                    (Reset after <span className="text-red-400 font-mono">{formatTime(timeLeft)}</span>)
                 </p>
            </div>
            <div className="flex items-center justify-between">
                {ACTIVITY_CHESTS.map((chest, index) => (
                    <React.Fragment key={chest.id}>
                        <ActivityChestItem 
                            chest={chest} 
                            userPoints={currentUserPoints} 
                            claimedLevels={claimedLevels} 
                            onClick={() => onChestClick(chest)}
                        />
                        {index < ACTIVITY_CHESTS.length - 1 && (
                            <div className="flex-1 h-px bg-slate-700 relative mx-2">
                                <ChevronRightIcon className="w-4 h-4 text-slate-600 absolute right-0 top-1/2 -translate-y-1/2" />
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </section>
    );
};

export default TreasureChestSection;