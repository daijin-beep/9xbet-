import React from 'react';
import { ChevronRightIcon } from './icons/GenericIcons';
// FIX: Corrected import path for CrownIcon
import { CrownIcon } from './icons/QuickAccessIcons';
import { VIP_LEVELS } from '../constants';

interface VipSummaryCardProps {
  currentUserLevel: number;
  currentBet: number;
  nickname: string;
  avatarUrl: string;
}

const VipSummaryCard: React.FC<VipSummaryCardProps> = ({ currentUserLevel, currentBet, nickname, avatarUrl }) => {
  const currentLevelData = VIP_LEVELS.find(l => l.level === currentUserLevel);
  const nextLevelData = VIP_LEVELS.find(l => l.level === currentUserLevel + 1);

  if (!currentLevelData) return null; // Or show a default state

  const progress = nextLevelData ? (currentBet / nextLevelData.betRequirement) * 100 : 100;

  return (
    <section className={`relative bg-gradient-to-br ${currentLevelData.gradientFromClass} ${currentLevelData.gradientToClass} p-4 rounded-xl shadow-lg text-white overflow-hidden`}>
      <div className="flex items-center mb-4">
        <img src={avatarUrl} alt="User Avatar" className="w-14 h-14 rounded-full object-cover border-2 border-white/50 mr-3" />
        <div className="flex-1">
          <p className="font-bold text-lg">{nickname}</p>
          <div className="flex items-center text-sm font-semibold bg-black/20 px-2 py-0.5 rounded-full w-fit">
            <CrownIcon className="w-4 h-4 mr-1.5 text-yellow-300" />
            <span>{currentLevelData.name} VIP</span>
          </div>
        </div>
        <div className="text-right">
            <p className="text-xs opacity-80">VIP Member</p>
            <p className="text-xs font-semibold bg-white/20 px-2 py-0.5 rounded-full">Privileges Active</p>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center text-xs font-semibold mb-1">
          <span>{currentLevelData.name}</span>
          {nextLevelData && <span>{nextLevelData.name}</span>}
        </div>
        <div className="w-full bg-black/20 rounded-full h-2.5">
          <div
            className={`${currentLevelData.bgColorClass} h-2.5 rounded-full transition-all duration-500`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
        <div className="text-center text-xs mt-2">
            {nextLevelData ? (
                <p>
                    Bet another <span className="font-bold text-yellow-300">${(nextLevelData.betRequirement - currentBet).toLocaleString()}</span> to upgrade to {nextLevelData.name}
                </p>
            ) : (
                <p className="font-bold">You are at the highest level!</p>
            )}
        </div>
      </div>
       <ChevronRightIcon className="absolute top-1/2 right-2 -translate-y-1/2 w-8 h-8 opacity-10" />
    </section>
  );
};

export default VipSummaryCard;
