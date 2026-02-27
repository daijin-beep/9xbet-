
import React from 'react';
import { SearchIcon } from './icons/GenericIcons';

interface SearchBarProps {
  onClick: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onClick }) => {
  return (
    <div className="my-5 px-0.5">
      <button
        onClick={onClick}
        className="w-full bg-slate-800/80 backdrop-blur-sm text-left text-gray-400 border border-slate-700 rounded-2xl py-3.5 px-5 flex items-center group transition-all hover:bg-slate-700 hover:border-slate-600 active:scale-[0.98]"
        aria-label="Search for games"
      >
        <SearchIcon className="h-5 w-5 text-gray-500 mr-3 group-hover:text-blue-400 transition-colors" />
        <span className="flex-1 font-medium">搜索游戏或厂商...</span>
        <div className="bg-slate-700 px-2 py-1 rounded text-[10px] font-bold text-gray-500 border border-slate-600 hidden sm:block">
            SEARCH
        </div>
      </button>
    </div>
  );
};

export default SearchBar;
