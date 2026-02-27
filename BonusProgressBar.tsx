import React from 'react';

interface BonusProgressBarProps {
  label: string;
  current: number;
  target: number;
  colorClass: string;
}

const BonusProgressBar: React.FC<BonusProgressBarProps> = ({ label, current, target, colorClass }) => {
  const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0;

  return (
    <div>
      <div className="flex justify-between items-center text-xs mb-1">
        <span className="text-gray-300">{label}</span>
        <span className="font-semibold text-white">
          {current.toLocaleString()} / {target.toLocaleString()}
        </span>
      </div>
      <div className="w-full bg-slate-600 rounded-full h-2 overflow-hidden">
        <div
          className={`${colorClass} h-full rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default BonusProgressBar;
