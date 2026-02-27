
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Game, GameBrand } from '../types';
import { ALL_GAMES_FOR_LIST_PAGE, HOT_GAMES, GAME_BRANDS } from '../constants';
import { ArrowLeftIcon, SearchIcon, CloseIcon, FireIcon, PhoneHorizontalIcon, PhoneVerticalIcon, StarIcon, SquaresFourIcon, ChevronDownIcon, CheckIcon } from './icons/GenericIcons';

interface SearchPageProps {
  onClose: () => void;
  onGameClick: (game: Game) => void;
  favoriteGames: Set<string>;
  onToggleFavorite: (gameId: string) => void;
  initialBrandId?: string | null;
}

const GameCard: React.FC<{ game: Game; onGameClick: (game: Game) => void; isFavorite: boolean; onToggleFavorite: (e: React.MouseEvent) => void; }> = ({ game, onGameClick, isFavorite, onToggleFavorite }) => {
  return (
    <div
      className="rounded-2xl overflow-hidden shadow-lg bg-slate-800 border border-slate-700/50 relative group transition-all duration-200 hover:shadow-yellow-500/20 active:scale-95 cursor-pointer"
      onClick={() => onGameClick(game)}
      role="button"
      aria-label={`Play ${game.title}`}
    >
       <button
        onClick={onToggleFavorite}
        className="absolute top-2 right-2 z-10 p-1.5 bg-black/40 backdrop-blur-md rounded-full text-gray-300 hover:text-yellow-400 transition-colors"
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <StarIcon className={`w-4 h-4 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : 'fill-none'}`} />
      </button>
       <img src={game.imageSrc} alt={game.title} className="w-full h-32 object-cover" />
      <div className="p-2.5">
        <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0 mr-1">
              <h4 className="text-white text-[13px] font-bold truncate group-hover:text-yellow-400 transition-colors">{game.title}</h4>
              <p className="text-gray-500 text-[9px] font-bold uppercase truncate tracking-wider mt-0.5">{game.provider}</p>
            </div>
             {game.orientation === 'landscape' && (
                <PhoneHorizontalIcon className="w-3.5 h-3.5 text-gray-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
            )}
            {game.orientation === 'portrait' && (
                <PhoneVerticalIcon className="w-3.5 h-3.5 text-gray-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
            )}
        </div>
      </div>
    </div>
  );
};

const SearchPage: React.FC<SearchPageProps> = ({ onClose, onGameClick, favoriteGames, onToggleFavorite, initialBrandId }) => {
  const [query, setQuery] = useState('');
  const [activeBrandId, setActiveBrandId] = useState<string>('all');
  const [isBrandDrawerOpen, setIsBrandDrawerOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    if (initialBrandId) {
        setActiveBrandId(initialBrandId);
    }
  }, [initialBrandId]);

  const searchResults = useMemo(() => {
    const lowercasedQuery = query.toLowerCase().trim();
    let results = ALL_GAMES_FOR_LIST_PAGE;

    if (activeBrandId !== 'all') {
        results = results.filter(g => g.providerId === activeBrandId);
    }

    if (lowercasedQuery !== '') {
        results = results.filter(game =>
            game.title.toLowerCase().includes(lowercasedQuery) ||
            game.provider.toLowerCase().includes(lowercasedQuery)
        );
    }

    return results;
  }, [query, activeBrandId]);

  const activeBrandName = useMemo(() => {
    if (activeBrandId === 'all') return '全部厂商';
    return GAME_BRANDS.find(b => b.providerId === activeBrandId)?.name || '未知厂商';
  }, [activeBrandId]);

  const recommendedGames = useMemo(() => HOT_GAMES.slice(0, 6), []);
  const hasTyped = query.trim() !== '' || activeBrandId !== 'all';
  const noResults = hasTyped && searchResults.length === 0;

  const handleBrandSelect = (id: string) => {
    setActiveBrandId(id);
    setIsBrandDrawerOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-950 z-[120] flex flex-col animate-slide-in-up overflow-hidden">
      {/* Header Row: Back Button + (Search Box 2/3 + Brand Selection 1/3) */}
      <header className="sticky top-0 bg-slate-900 border-b border-slate-800 z-20 p-3 flex items-center space-x-2">
        <button
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors flex-shrink-0"
          aria-label="Close search"
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        
        <div className="flex flex-1 items-center space-x-2 min-w-0 h-10">
          {/* Search Box (占 2/3) */}
          <div className="relative flex-[2] h-full min-w-0">
            <input
              ref={inputRef}
              type="text"
              placeholder="搜索游戏或厂商..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-full bg-slate-800 text-white placeholder-gray-500 border border-slate-700 rounded-xl pl-9 pr-8 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all text-[13px]"
              aria-label="Search games"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-4 w-4 text-gray-600" />
            </div>
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-600 hover:text-white"
                aria-label="Clear search"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Brand Filter (占 1/3) */}
          <button 
              onClick={() => setIsBrandDrawerOpen(true)}
              className={`flex-[1] h-full flex items-center justify-between px-2.5 rounded-xl transition-all border min-w-0
              ${activeBrandId === 'all' 
                ? 'bg-slate-800 border-slate-700 text-gray-400' 
                : 'bg-blue-600/10 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
              }`}
          >
              <div className="flex items-center space-x-1.5 truncate">
                  {activeBrandId === 'all' ? (
                      <SquaresFourIcon className="w-3.5 h-3.5 flex-shrink-0" />
                  ) : (
                      <div className="w-3.5 h-3.5 bg-blue-500 rounded flex items-center justify-center p-0.5 flex-shrink-0">
                          <CheckIcon className="w-2.5 h-2.5 text-white" />
                      </div>
                  )}
                  <span className="text-[11px] font-black truncate">{activeBrandName}</span>
              </div>
              <ChevronDownIcon className="w-3 h-3 text-gray-500 flex-shrink-0" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar p-4 bg-[#0a0f1d]">
        {noResults && (
          <div className="animate-fade-in flex flex-col items-center justify-center py-12">
            <div className="bg-slate-800 p-8 rounded-full mb-6 text-slate-700">
                <SearchIcon className="w-12 h-12" />
            </div>
            <p className="text-lg font-black text-white">哎呀，找不到相关结果</p>
            <p className="text-gray-500 text-sm mt-2 mb-10">试试搜索其他关键词或换个厂商？</p>
            
            <div className="w-full">
              <h3 className="text-md font-black text-white flex items-center mb-5 px-1 uppercase tracking-widest italic">
                  <FireIcon className="w-5 h-5 text-orange-500 mr-2" />
                  热门推荐
              </h3>
              <div className="grid grid-cols-2 gap-3">
                  {recommendedGames.map(game => (
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
            </div>
          </div>
        )}

        {hasTyped && searchResults.length > 0 && (
          <div className="animate-fade-in">
            {/* Header for Results */}
            <div className="flex items-center space-x-2 mb-5 px-1">
                <div className="w-1 h-5 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                <h2 className="text-lg font-black text-white italic tracking-tighter uppercase">搜索结果</h2>
                <span className="text-[10px] font-black text-slate-500 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md ml-2">{searchResults.length}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {searchResults.map(game => (
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
          </div>
        )}

        {!hasTyped && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-40">
                <div className="p-6 bg-slate-900/50 rounded-full border border-slate-800">
                    <SquaresFourIcon className="w-12 h-12 text-slate-700" />
                </div>
                <div className="space-y-1">
                    <p className="text-lg font-black text-gray-500 italic uppercase">发现您的幸运之门</p>
                    <p className="text-[11px] text-gray-600 font-bold uppercase tracking-widest px-10">输入关键词开启探索之旅，数千款热门游戏等你挖掘</p>
                </div>
            </div>
        )}
        
        <div className="h-10"></div>
      </main>

      {/* Brand Selection Half-Screen Drawer (厂商筛选弹窗) */}
      {isBrandDrawerOpen && (
          <div 
            className="fixed inset-0 bg-black/80 z-[150] flex flex-col justify-end animate-fade-in"
            onClick={() => setIsBrandDrawerOpen(false)}
          >
              <div 
                className="bg-slate-900 rounded-t-[2.5rem] max-h-[65vh] flex flex-col shadow-2xl border-t border-slate-800 animate-slide-up"
                onClick={e => e.stopPropagation()}
              >
                  <div className="w-12 h-1.5 bg-slate-800 rounded-full mx-auto mt-4 mb-2"></div>
                  <header className="p-5 flex items-center justify-between border-b border-slate-800/50">
                      <div>
                        <h3 className="text-xl font-black text-white italic tracking-tighter uppercase">选择游戏厂商</h3>
                        <p className="text-[10px] text-slate-500 font-bold tracking-widest">SELECT GAME PROVIDER</p>
                      </div>
                      <button onClick={() => setIsBrandDrawerOpen(false)} className="p-2 bg-slate-800 rounded-full text-gray-400 hover:text-white transition-colors">
                          <CloseIcon className="w-5 h-5" />
                      </button>
                  </header>

                  <div className="overflow-y-auto no-scrollbar py-4 px-5 space-y-3">
                      <button 
                          onClick={() => handleBrandSelect('all')}
                          className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border-2 ${
                              activeBrandId === 'all' 
                              ? 'bg-blue-600/10 border-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.1)]' 
                              : 'bg-slate-800/50 border-slate-800 text-gray-500 hover:border-slate-700'
                          }`}
                      >
                          <div className="flex items-center space-x-4">
                              <div className={`p-2.5 rounded-xl ${activeBrandId === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-700'}`}>
                                  <SquaresFourIcon className="w-5 h-5" />
                              </div>
                              <span className="font-black text-base italic uppercase">全部厂商</span>
                          </div>
                          {activeBrandId === 'all' && <div className="bg-blue-500 p-1 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"><CheckIcon className="w-3.5 h-3.5 text-white" /></div>}
                      </button>

                      {GAME_BRANDS.map(brand => {
                          const isActive = activeBrandId === brand.providerId;
                          return (
                              <button
                                  key={brand.id}
                                  onClick={() => handleBrandSelect(brand.providerId)}
                                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border-2 ${
                                      isActive 
                                      ? 'bg-blue-600/10 border-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.1)]' 
                                      : 'bg-slate-800/50 border-slate-800 text-gray-500 hover:border-slate-700'
                                  }`}
                              >
                                  <div className="flex items-center space-x-4">
                                      <div className={`w-12 h-10 bg-white p-1 rounded-lg flex items-center justify-center overflow-hidden ${isActive ? 'ring-2 ring-blue-500' : ''}`}>
                                          <img src={brand.logoUrl} alt="" className="w-full h-full object-contain" />
                                      </div>
                                      <span className="font-black text-base italic uppercase">{brand.name}</span>
                                  </div>
                                  {isActive && <div className="bg-blue-500 p-1 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"><CheckIcon className="w-3.5 h-3.5 text-white" /></div>}
                              </button>
                          );
                      })}
                  </div>
                  <div className="h-8"></div>
              </div>
          </div>
      )}

      <style>{`
        @keyframes slideInUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-in-up { animation: slideInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
};

export default SearchPage;
