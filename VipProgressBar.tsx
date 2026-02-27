import React from 'react';
import { QuestionMarkCircleIcon } from './icons/GenericIcons';

interface VipProgressBarProps {
  title: string;
  currentValue: number;
  targetValue: number;
  progressBarColor: string; // e.g., 'bg-green-500'
  valueSuffix?: string; // e.g., ' PKR' or empty
  onInfoClick: () => void;
}

const VipProgressBar: React.FC<VipProgressBarProps> = ({
  title,
  currentValue,
  targetValue,
  progressBarColor,
  valueSuffix = '',
  onInfoClick,
}) => {
  const progressPercentage = targetValue > 0 ? Math.min((currentValue / targetValue) * 100, 100) : 0;

  return (
    <div className="bg-slate-700/70 p-1.5 rounded-md shadow-sm">
      <div className="flex items-center justify-between mb-0.5">
        <span className="text-xs text-gray-300 font-medium">{title}</span>
        <button 
          onClick={onInfoClick} 
          className="text-gray-400 hover:text-yellow-400 transition-colors"
          aria-label={`More information about ${title}`}
        >
          <QuestionMarkCircleIcon className="w-4 h-4" /> {/* Slightly smaller icon if needed */}
        </button>
      </div>
      <div className="w-full bg-slate-600 rounded-full h-2 mb-0.5 overflow-hidden">
        <div
          className={`${progressBarColor} h-2 rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${progressPercentage}%` }}
          role="progressbar"
          aria-valuenow={currentValue}
          aria-valuemin={0}
          aria-valuemax={targetValue}
          aria-label={title}
        ></div>
      </div>
      <div className="text-right">
        <span className="text-xs font-semibold text-yellow-400">
          {currentValue.toLocaleString()}
        </span>
        <span className="text-xs text-gray-400">
          {' / '}{targetValue.toLocaleString()}{valueSuffix}
        </span>
      </div>
    </div>
  );
};

export default VipProgressBar;