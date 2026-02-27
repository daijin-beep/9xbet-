
import React, { useState, useMemo, useEffect } from 'react';
import { Game, SVGIconProps, GameCategory, GameBrand } from '../types';
import { ALL_GAMES_FOR_LIST_PAGE, GAME_BRANDS, RECENTLY_PLAYED_GAMES, CATEGORY_FILTERS } from '../constants';
import { 
    ArrowLeftIcon, 
    SearchIcon, 
    FireIcon, 
    ClockIcon, 
    SparklesIcon, 
    PhoneHorizontalIcon, 
    PhoneVerticalIcon, 
    StarIcon,
    SquaresFourIcon
} from './icons/GenericIcons';

interface GameListPageProps {
  categoryKey: string;
  onBack: () => void;
  onGameClick: (game: Game) => void;
  onSearchClick: () => void;
  favoriteGames: Set<string>;
  onToggleFavorite: (gameId: string) => void;
}

interface GameCardProps {
  game: Game;
  onGameClick: (game: Game) => void;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onGameClick, isFavorite, onToggleFavorite }) => {
  return (
    <div 
      className="rounded-lg overflow-hidden shadow-lg bg-slate-800 relative group transition-all duration-200 hover:shadow-yellow-500/20 cursor-pointer"
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
      <img src={game.imageSrc} alt={game.title} className="w-full h-40 object-cover" />
      {game.tags?.includes('hot') && !game.tags?.includes('new') && (
        <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-sm font-bold flex items-center">
          <FireIcon className="w-3 h-3 mr-0.5" />HOT
        </div>
      )}
      {game.tags?.includes('new') && (
         <div className="absolute top-2 left-2 bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-sm font-bold">NEW</div>
      )}
      <div className="p-3">
        <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0 mr-1"> {/* Added min-w-0 and mr-1 */}
              <h4 className="text-white text-sm font-semibold truncate group-hover:text-yellow-400 transition-colors">{game.title}</h4>
              <p className="text-gray-400 text-xs uppercase truncate">{game.provider}</p>
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

const topCategoryFilters = [
    {id: 'all', label: 'All', Icon: SquaresFourIcon}, 
    ...CATEGORY_FILTERS.filter(f => ['hot', 'new', 'slot', 'live', 'fishing', 'recent', 'favorite'].includes(f.id))
];

interface ProviderFilter extends Partial<GameBrand> {
    id: string;
    name: string;
    Icon?: React.FC<SVGIconProps>;
}

const ProviderButton: React.FC<{ provider: ProviderFilter; isActive: boolean; onClick: () => void; }> = ({ provider, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex flex-col items-center justify-center p-2 rounded-lg text-center transition-colors ${isActive ? 'bg-blue-600' : 'bg-slate-700/50 hover:bg-slate-700'}`}
    >
        <div className="w-12 h-12 flex items-center justify-center mb-1">
            {provider.Icon ? (
                <provider.Icon className={`w-8 h-8 ${isActive ? 'text-white' : 'text-yellow-400'}`} />
            ) : (
                <img src={provider.logoUrl} alt={provider.name} className="w-full h-full object-contain rounded-md" />
            )}
        </div>
        <span className={`text-xs font-semibold leading-tight ${isActive ? 'text-white' : 'text-gray-300'}`}>{provider.name}</span>
    </button>
);


const GameListPage: React.FC<GameListPageProps> = ({ 
  categoryKey, 
  onBack,
  onGameClick,
  onSearchClick,
  favoriteGames,
  onToggleFavorite
}) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeProvider, setActiveProvider] = useState('all');

  useEffect(() => {
    const isProvider = GAME_BRANDS.some(b => b.providerId === categoryKey);
    const isCategory = topCategoryFilters.some(f => f.id === categoryKey);

    if (isProvider) {
      setActiveCategory('all');
      setActiveProvider(categoryKey);
    } else if (isCategory) {
      setActiveCategory(categoryKey);
      setActiveProvider('all');
    } else {
      setActiveCategory('all');
      setActiveProvider('all');
    }
  }, [categoryKey]);

  const providerFilters = useMemo((): ProviderFilter[] => {
    let relevantGames = ALL_GAMES_FOR_LIST_PAGE;
    if (activeCategory !== 'all') {
        if (activeCategory === 'hot' || activeCategory === 'new') {
            relevantGames = ALL_GAMES_FOR_LIST_PAGE.filter(g => g.tags?.includes(activeCategory));
        } else if (activeCategory === 'recent') {
            const recentGameIds = new Set(RECENTLY_PLAYED_GAMES.map(g => g.id.replace('-recent', '')));
            relevantGames = ALL_GAMES_FOR_LIST_PAGE.filter(game => recentGameIds.has(game.id));
        } else if (activeCategory === 'favorite') {
            relevantGames = ALL_GAMES_FOR_LIST_PAGE.filter(game => favoriteGames.has(game.id));
        } else {
            relevantGames = ALL_GAMES_FOR_LIST_PAGE.filter(g => g.category === activeCategory);
        }
    }
    
    const providerIds = [...new Set(relevantGames.map(g => g.providerId))];
    const providersFromGames = GAME_BRANDS.filter(b => providerIds.includes(b.providerId));
    
    return [
      { id: 'all', name: 'All', Icon: SquaresFourIcon },
      ...providersFromGames
    ];
  }, [activeCategory, favoriteGames]);
  
  const displayedGames = useMemo(() => {
    let games = ALL_GAMES_FOR_LIST_PAGE;

    // 1. Filter by top category
    if (activeCategory !== 'all') {
        if (activeCategory === 'hot' || activeCategory === 'new') {
            games = games.filter(g => g.tags?.includes(activeCategory));
        } else if (activeCategory === 'recent') {
            const recentGameIds = new Set(RECENTLY_PLAYED_GAMES.map(g => g.id.replace('-recent', '')));
            games = games.filter(game => recentGameIds.has(game.id));
        } else if (activeCategory === 'favorite') {
            games = games.filter(g => favoriteGames.has(g.id));
        } else {
            games = games.filter(g => g.category === activeCategory);
        }
    }

    // 2. Filter by sidebar provider
    if (activeProvider !== 'all') {
      games = games.filter(g => g.providerId === activeProvider);
    }

    return games;
  }, [activeCategory, activeProvider, favoriteGames]);

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white">
      {/* Header */}
      <header className="sticky top-0 bg-slate-800 shadow-md z-20 p-3 flex items-center border-b border-slate-700">
        <button 
            onClick={onBack} 
            className="p-2 mr-2 text-gray-300 hover:text-yellow-400 rounded-full hover:bg-slate-700 transition-colors"
            aria-label="Go back"
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <button
            onClick={onSearchClick}
            className="flex-grow bg-slate-700 text-left text-gray-400 border border-slate-600 rounded-lg py-2.5 px-4 flex items-center justify-between focus:outline-none focus:ring-1 focus:ring-yellow-500 ml-2"
            aria-label="Search for games"
        >
            <span>Search games...</span>
            <SearchIcon className="h-5 w-5 text-gray-400" />
        </button>
      </header>
      
      {/* Top Category Filters */}
      <div className="sticky top-[68px] bg-slate-800/80 backdrop-blur-sm z-10 border-b border-slate-700/50">
        <div className="flex space-x-2 overflow-x-auto no-scrollbar p-2">
            {topCategoryFilters.map(item => {
                const isActive = item.id === activeCategory;
                return (
                    <button 
                        key={item.id} 
                        onClick={() => {
                            setActiveCategory(item.id);
                            setActiveProvider('all'); // Reset provider filter when category changes
                        }}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${isActive ? 'bg-slate-700 text-yellow-400' : 'bg-slate-800/50 text-gray-300 hover:bg-slate-700'}`}
                    >
                        <item.Icon className={`w-4 h-4 ${isActive ? 'text-yellow-400' : 'text-gray-400'}`} />
                        <span>{item.label}</span>
                    </button>
                );
            })}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar for Brands */}
        <aside className="w-24 flex-shrink-0 bg-slate-800 overflow-y-auto no-scrollbar p-2 space-y-2">
            {providerFilters.map(provider => (
                <ProviderButton 
                    key={provider.id}
                    provider={provider}
                    isActive={activeProvider === provider.id}
                    onClick={() => setActiveProvider(provider.id)}
                />
            ))}
        </aside>
        
        {/* Main Game Grid */}
        <main className="flex-1 overflow-y-auto no-scrollbar p-3">
            {displayedGames.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {displayedGames.map(game => (
                <GameCard 
                    key={game.id} 
                    game={game} 
                    onGameClick={onGameClick}
                    isFavorite={favoriteGames.has(game.id)}
                    onToggleFavorite={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(game.id);
                    }}
                />
                ))}
            </div>
            ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 pt-10">
                <SearchIcon className="w-16 h-16 mb-4 text-slate-700" />
                <p className="text-lg font-semibold">No games found.</p>
                <p className="text-sm">Try adjusting your filters.</p>
            </div>
            )}
            <div className="h-1"></div>
        </main>
      </div>
    </div>
  );
};

export default GameListPage;
