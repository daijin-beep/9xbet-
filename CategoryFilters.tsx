
import React from 'react';
import { CATEGORY_FILTERS } from '../constants';
import { CategoryFilterItem } from '../types';

interface CategoryFiltersProps {
  onFilterClick: (filterId: string) => void;
  activeFilter: string;
}

const CategoryFilterButton: React.FC<{ item: CategoryFilterItem, onClick: () => void, isActive: boolean }> = ({ item, onClick, isActive }) => {
  const baseClasses = "flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all whitespace-nowrap active:scale-95";
  const activeClasses = "bg-blue-600 text-white shadow-lg shadow-blue-900/20";
  const inactiveClasses = "bg-slate-800 text-gray-400 hover:bg-slate-700";

  return (
    <button onClick={onClick} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
      <item.Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
      <span className="uppercase tracking-widest text-[11px]">{item.label}</span>
    </button>
  );
};

const CategoryFilters: React.FC<CategoryFiltersProps> = ({ onFilterClick, activeFilter }) => {
  return (
    <div className="my-5">
      <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-2">
        {CATEGORY_FILTERS.map((item) => (
          <CategoryFilterButton 
            key={item.id} 
            item={item} 
            onClick={() => onFilterClick(item.id)}
            isActive={item.id === activeFilter}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryFilters;
