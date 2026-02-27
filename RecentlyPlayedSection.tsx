
import React from 'react';
import { Game } from '../types'; 
import { ClockIcon, ChevronLeftIcon, ChevronRightIcon, PhoneHorizontalIcon, PhoneVerticalIcon, StarIcon } from './icons/GenericIcons';

interface GameCardProps {
  game: Game;
  onGameClick: (game: Game) => void;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onGameClick, isFavorite, onToggleFavorite }) => {
  return (
    <div 
      className="flex-shrink-0 w-36 rounded-lg overflow-hidden shadow-lg bg-slate-800 relative mr-3 cursor-pointer group hover:shadow-yellow-500/30 transition-shadow"
      onClick={() => onGameClick(game)}
      role="button"
      aria-label={`Play ${game.title}`}
    >
      <button
        onClick={onToggleFavorite}
        className="absolute top-2 right-2 z-10 p-1.5 bg-black/40 rounded-full text-gray-300 hover:text-yellow-400 transition-colors"
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <StarIcon className={`w-4 h-4 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : 'fill-none'}`} />
      </button>
      <img src={game.imageSrc} alt={game.title} className="w-full h-48 object-cover" />
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0 mr-1">
            <h4 className="text-white text-xs font-bold truncate group-hover:text-yellow-400">{game.title}</h4>
            <p className="text-gray-400 text-[10px] uppercase truncate">{game.provider}</p>
          </div>
          {game.orientation === 'landscape' && (
            <PhoneHorizontalIcon className="w-5 h-5 text-gray-200 flex-shrink-0" aria-hidden="true" />
          )}
          {game.orientation === 'portrait' && (
            <PhoneVerticalIcon className="w-5 h-5 text-gray-200 flex-shrink-0" aria-hidden="true" />
          )}
        </div>
      </div>
    </div>
  );
};

interface RecentlyPlayedSectionProps {
  onGameClick: (game: Game) => void;
  games: Game[];
  favoriteGames: Set<string>;
  onToggleFavorite: (gameId: string) => void;
}

const RecentlyPlayedSection: React.FC<RecentlyPlayedSectionProps> = ({ onGameClick, games, favoriteGames, onToggleFavorite }) => {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="my-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-bold text-white flex items-center">
          <ClockIcon className="w-6 h-6 text-yellow-500 mr-2" />
          Recently Played
        </h3>
        <div className="flex space-x-2">
          <button onClick={() => scroll('left')} className="p-1.5 bg-slate-700 rounded-md text-gray-300 hover:bg-slate-600" aria-label="Scroll recently played games left">
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <button onClick={() => scroll('right')} className="p-1.5 bg-slate-700 rounded-md text-gray-300 hover:bg-slate-600" aria-label="Scroll recently played games right">
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div ref={scrollContainerRef} className="flex overflow-x-auto no-scrollbar pb-2">
        {games.map((game) => (
          <GameCard 
            key={game.id} 
            game={game} 
            onGameClick={onGameClick} 
            isFavorite={favoriteGames.has(game.id.replace('-recent', ''))}
            onToggleFavorite={(e) => {
              e.stopPropagation();
              onToggleFavorite(game.id.replace('-recent', ''));
            }}
          />
        ))}
        <div className="flex-shrink-0 w-px"></div>
      </div>
    </div>
  );
};

export default RecentlyPlayedSection;
