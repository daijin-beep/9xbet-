import React from 'react';
import { ActivityChest } from '../types';
import { CloseIcon, LightningBoltIcon, GiftIcon } from './icons/GenericIcons';

// Re-using the icon from TreasureChestSection
const TreasureChestIcon: React.FC<{ className?: string }> = ({ className }) => {
    const mainColor = '#94a3b8'; // slate-400
    const strapColor = '#64748b'; // slate-500
    const lockColor = '#475569'; // slate-600

    return (
        <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M26 8C26 6.89543 25.1046 6 24 6H8C6.89543 6 6 6.89543 6 8V12H26V8Z" fill={mainColor} />
            <path d="M28 12H4V25C4 25.5523 4.44772 26 5 26H27C27.5523 26 28 25.5523 28 25V12Z" fill={mainColor} />
            <path d="M27 12H5V26H27V12Z" fill="none" stroke={strapColor} strokeWidth="2"/>
            <path d="M25 6H7V26H25V6Z" fill="none" stroke={strapColor} strokeWidth="2"/>
            <path d="M14 17H18V21H14V17Z" fill={lockColor} />
            <path d="M16 16V17" stroke={lockColor} strokeWidth="2" strokeLinecap="round"/>
        </svg>
    );
};

interface TreasureChestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaim: () => void;
  chest: ActivityChest | null;
  userPoints: number;
}

const TreasureChestModal: React.FC<TreasureChestModalProps> = ({ isOpen, onClose, onClaim, chest, userPoints }) => {
  if (!isOpen || !chest) return null;
  
  const isClaimable = userPoints >= chest.points;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[100] animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="chest-modal-title"
    >
      <div className="bg-slate-800 w-full max-w-sm p-6 rounded-lg shadow-xl relative text-gray-200" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white">
          <CloseIcon className="w-6 h-6" />
        </button>
        
        <div className="flex flex-col items-center">
          <TreasureChestIcon className="w-32 h-32" />
          <h2 id="chest-modal-title" className="text-2xl font-bold text-yellow-400 mt-2">Level {chest.level} Chest</h2>
          <p className="text-gray-400">Unlock a special reward!</p>

          <div className="w-full my-6 space-y-3">
            <div className="bg-slate-700/50 p-3 rounded-lg flex justify-between items-center">
              <span className="flex items-center text-sm font-medium text-gray-300">
                <GiftIcon className="w-5 h-5 mr-2 text-yellow-400" />
                Bonus Reward
              </span>
              <span className="font-bold text-white text-md">{chest.bonus}</span>
            </div>
            <div className="bg-slate-700/50 p-3 rounded-lg flex justify-between items-center">
              <span className="flex items-center text-sm font-medium text-gray-300">
                <LightningBoltIcon className="w-5 h-5 mr-2 text-blue-400" />
                Required Points
              </span>
              <span className="font-bold text-white text-md">{chest.points}</span>
            </div>
          </div>
          
          <button 
            onClick={onClaim}
            disabled={!isClaimable}
            className="w-full bg-yellow-500 text-slate-900 font-bold py-3 rounded-lg shadow-lg transition-colors hover:bg-yellow-600 disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed"
          >
            {isClaimable ? 'Claim Reward' : 'Not Enough Points'}
          </button>
        </div>
      </div>
       <style>{`.animate-fade-in { animation: fadeIn 0.3s ease-out; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
    </div>
  );
};

export default TreasureChestModal;