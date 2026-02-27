import React from 'react';
import { WeeklyGameBannerData, Game } from '../types';
import { LaurelBranchIcon } from './icons/LaurelBranchIcon'; 
import { ChevronRightIcon } from './icons/GenericIcons';

interface WeeklyGameBannerProps {
  data: WeeklyGameBannerData;
  onPlay: (game: Game) => void;
}

const WeeklyGameBanner: React.FC<WeeklyGameBannerProps> = ({ data, onPlay }) => {
  if (!data || !data.game) {
    return null; // Don't render if data is incomplete
  }
  
  return (
    <div className="my-6">
      <div 
        onClick={() => onPlay(data.game)}
        className="relative flex items-center justify-between p-4 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-700 h-36 cursor-pointer group shadow-lg"
        aria-label={`Play ${data.title}, ${data.game.title}`}
      >
        {/* Decorative elements */}
        <LaurelBranchIcon className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-auto opacity-70" />
        <LaurelBranchIcon className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-auto transform scale-x-[-1] opacity-70" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-black/10 rounded-l-full blur-xl"></div>
        <div className="absolute bottom-4 left-4 w-4 h-4 bg-white/50 rounded-full blur-sm animate-pulse"></div>
        <div className="absolute top-8 right-1/3 w-2 h-2 bg-white/50 rounded-full blur-sm animate-pulse delay-500"></div>

        {/* Left Content */}
        <div className="relative z-10 flex-1">
          <h3 className="text-white text-xl font-bold leading-tight max-w-[150px]">
            {data.title}
          </h3>
          <div className="flex items-center space-x-1 mt-2 text-white text-sm font-semibold">
            <span>{data.providerName}</span>
            <ChevronRightIcon className="w-4 h-4" />
            <span className="opacity-70">games</span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onPlay(data.game); }}
            className="mt-3 bg-white text-slate-800 font-bold py-2 px-6 rounded-lg text-sm shadow-md group-hover:bg-yellow-300 transition-colors"
          >
            Play
          </button>
        </div>

        {/* Right Content - Game Image */}
        <div className="relative z-10 w-28 h-28 flex-shrink-0">
          <img 
            src={data.game.imageSrc} 
            alt={data.game.title} 
            className="w-full h-full object-cover rounded-lg border-2 border-green-300/50 shadow-lg group-hover:scale-105 transition-transform"
          />
        </div>
      </div>
    </div>
  );
};

export default WeeklyGameBanner;
