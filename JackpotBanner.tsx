import React from 'react';
import { Game } from '../types';

interface JackpotBannerProps {
  games: Game[];
  onGameClick: (game: Game) => void;
  onViewAll: () => void;
}

const JackpotGameCard: React.FC<{ game: Game; onGameClick: (game: Game) => void }> = ({ game, onGameClick }) => {
  return (
    <button
      onClick={() => onGameClick(game)}
      className="flex-shrink-0 w-28 rounded-lg overflow-hidden bg-slate-900/20 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-yellow-400"
      role="button"
      aria-label={`Play ${game.title}`}
    >
      <img src={game.imageSrc} alt={game.title} className="w-full h-28 object-cover transition-transform group-hover:scale-105" />
      <div className="p-1.5 bg-black/20 text-center">
        <p className="text-white text-[10px] font-semibold uppercase truncate">{game.provider}</p>
      </div>
    </button>
  );
};

const TriangleArrow: React.FC<{className?: string}> = ({className}) => (
    <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M1 1L7 7L1 13" stroke="white" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const JackpotBanner: React.FC<JackpotBannerProps> = ({ games, onGameClick, onViewAll }) => {
  return (
    <div className="relative rounded-xl overflow-hidden my-6 p-4 flex flex-col text-white shadow-lg w-full bg-gradient-to-br from-pink-500 to-purple-700">
      
      <TriangleArrow className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-auto transform rotate-180" />
      <TriangleArrow className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-auto" />
      
      <div className="text-center">
        <h2 className="text-lg font-semibold opacity-90">Total jackpot</h2>
        <p className="text-4xl lg:text-5xl font-bold my-1 tracking-wider drop-shadow-md">$10,000,379</p>
      </div>
      
      <div className="flex justify-center overflow-x-auto no-scrollbar pb-2 space-x-3 my-4">
        {games.slice(0, 3).map((game) => (
          <JackpotGameCard key={game.id} game={game} onGameClick={onGameClick} />
        ))}
      </div>

      <button
        onClick={onViewAll}
        className="w-full max-w-xs mx-auto bg-white text-slate-900 font-bold py-3 px-6 rounded-lg text-sm shadow-md transition-colors hover:bg-gray-200"
      >
        See all jackpots
      </button>
    </div>
  );
};

export default JackpotBanner;