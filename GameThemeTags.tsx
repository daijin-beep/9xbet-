import React from 'react';
// Fix: Use HOME_PAGE_GAME_COLLECTIONS as it exists and fits the purpose, instead of the missing PROMO_BANNER_TAGS.
import { HOME_PAGE_GAME_COLLECTIONS } from '../constants';
import { HomeCategory } from '../types';

interface GameThemeTagsProps {
    onTagClick: (categoryKey: HomeCategory) => void;
    activeCategory: HomeCategory;
}

const GameThemeTags: React.FC<GameThemeTagsProps> = ({ onTagClick, activeCategory }) => {
  return (
    <div className="my-4">
      <div className="flex justify-around items-center space-x-3 sm:space-x-4">
        {HOME_PAGE_GAME_COLLECTIONS.map((tag) => {
          const isActive = activeCategory === tag.categoryKey;
          return (
            <button
              key={tag.id}
              onClick={() => onTagClick(tag.categoryKey as HomeCategory)}
              className={`flex-1 sm:flex-initial flex flex-col items-center justify-center space-y-1 text-gray-300 transition-all duration-200 rounded-lg p-2 w-full sm:w-24 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75
                ${isActive 
                  ? 'bg-yellow-500 text-slate-900 shadow-lg scale-105' 
                  : 'bg-slate-800 hover:bg-slate-700 hover:text-yellow-300'
                }`}
              aria-pressed={isActive}
              // Fix: Use tag.title instead of tag.label
              aria-label={`Go to ${tag.title} games`}
            >
              <tag.Icon className={`w-7 h-7 ${isActive ? 'text-slate-900' : 'text-yellow-400'}`} />
              {/* Fix: Use tag.title instead of tag.label */}
              <span className={`text-xs font-semibold ${isActive ? 'text-slate-900' : ''}`}>{tag.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default GameThemeTags;
