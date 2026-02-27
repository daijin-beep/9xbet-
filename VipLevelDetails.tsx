import React from 'react';
import { VIP_LEVELS } from '../constants';
import { VipLevel } from '../types';

interface VipLevelDetailsProps {
  currentUserLevel: number;
}

const VipLevelCard: React.FC<{ level: VipLevel; isCurrent: boolean; isNext: boolean; isLocked: boolean; }> = ({ level, isCurrent, isNext, isLocked }) => {
    const cardBaseClass = "border-2 rounded-xl p-4 transition-all duration-300 flex flex-col h-full bg-slate-800";
    const statusClass = isCurrent ? 'border-yellow-400 shadow-lg shadow-yellow-500/20' : isNext ? 'border-blue-400 shadow-lg shadow-blue-500/20' : isLocked ? 'border-slate-700 bg-opacity-50' : 'border-slate-600';
    const textColor = isLocked ? 'text-gray-500' : 'text-gray-300';
    
    return (
        <div className={`${cardBaseClass} ${statusClass}`}>
            <div className="flex items-center justify-between mb-3">
                <h3 className={`text-xl font-bold ${isLocked ? 'text-gray-600' : level.colorClass}`}>{level.name}</h3>
                {isCurrent && <span className="text-xs font-bold bg-yellow-500 text-slate-900 px-2 py-0.5 rounded-full">CURRENT</span>}
                {isNext && <span className="text-xs font-bold bg-blue-500 text-white px-2 py-0.5 rounded-full">NEXT</span>}
            </div>
            <p className={`text-xs mb-3 ${textColor}`}>
                Required Bet: <span className={`font-semibold ${isLocked ? 'text-gray-500' : 'text-white'}`}>${level.betRequirement.toLocaleString()}</span>
            </p>
            <div className="space-y-2 flex-1">
                {level.privileges.map(privilege => (
                    <div key={privilege.id} className="flex items-start space-x-2">
                        <privilege.icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isLocked ? 'text-gray-600' : level.colorClass}`} />
                        <p className={`text-xs ${textColor}`}>{privilege.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};


const VipLevelDetails: React.FC<VipLevelDetailsProps> = ({ currentUserLevel }) => {
  return (
    <section>
      <h2 className="text-xl font-bold text-white mb-4 text-center">All VIP Levels & Privileges</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {VIP_LEVELS.map(level => (
          <VipLevelCard
            key={level.id}
            level={level}
            isCurrent={level.level === currentUserLevel}
            isNext={level.level === currentUserLevel + 1}
            isLocked={level.level > currentUserLevel + 1}
          />
        ))}
      </div>
    </section>
  );
};

export default VipLevelDetails;
