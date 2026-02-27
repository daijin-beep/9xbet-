import React from 'react';
import { Mission, MissionAction } from '../types';
import { ChevronRightIcon } from './icons/GenericIcons';

const MissionProgressBar: React.FC<{ current: number, target: number }> = ({ current, target }) => {
    const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0;
    return (
        <div>
            <div className="w-full bg-slate-600 rounded-full h-2 overflow-hidden">
                <div
                    className="bg-green-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <div className="text-right text-xs text-gray-400 mt-1">
                <span className="font-semibold text-white">{current.toLocaleString()}</span> / {target.toLocaleString()}
            </div>
        </div>
    );
};

interface MissionCardProps {
    mission: Mission;
    onAction: (action: MissionAction) => void;
}

const MissionCard: React.FC<MissionCardProps> = ({ mission, onAction }) => {
    const { Icon, title, description, reward, progress, action } = mission;

    return (
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-md flex items-center space-x-4">
            <div className="flex-shrink-0">
                <Icon className="w-12 h-12 text-blue-400" />
            </div>

            <div className="flex-grow min-w-0">
                <h3 className="font-bold text-white text-md truncate">{title}</h3>
                <p className="text-sm text-gray-400 truncate">{description}</p>
                {progress && (
                    <div className="mt-2">
                        <MissionProgressBar current={progress.current} target={progress.target} />
                    </div>
                )}
            </div>

            <div className="flex-shrink-0 text-center ml-4">
                <p className="text-sm font-bold text-yellow-400 mb-2">{reward}</p>
                <button
                    onClick={() => onAction(action)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md text-sm flex items-center justify-center transition-colors w-28"
                >
                    <span>{action.ctaLabel}</span>
                    <ChevronRightIcon className="w-4 h-4 ml-1" />
                </button>
            </div>
        </div>
    );
};

export default MissionCard;
