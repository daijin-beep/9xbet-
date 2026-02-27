

import React from 'react';
import { QUICK_ACCESS_ITEMS } from '../constants';
import { QuickAccessItem, PageView } from '../types';
import { ChevronRightIcon } from './icons/GenericIcons';

interface QuickAccessGridProps {
  onNavigate: (page: PageView) => void;
}

const QuickAccessCard: React.FC<{ item: QuickAccessItem; onClick: () => void; }> = ({ item, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-slate-800 p-3 rounded-lg flex items-center justify-between shadow hover:bg-slate-700 transition-colors text-left w-full"
    >
      <div className="flex-1 mr-2">
        <h3 className="text-sm font-semibold text-white">{item.label}</h3>
        {item.description && <p className="text-xs text-gray-400">{item.description}</p>}
        <div className="mt-1">
            <ChevronRightIcon className="w-4 h-4 text-gray-500 inline-block bg-slate-700 p-0.5 rounded-full"/>
        </div>
      </div>
      <img src={item.imageSrc} alt={item.label} className="w-14 h-12 object-cover rounded-md" />
    </button>
  );
};

const QuickAccessGrid: React.FC<QuickAccessGridProps> = ({ onNavigate }) => {
  return (
    <div className="my-4 grid grid-cols-2 gap-3">
      {QUICK_ACCESS_ITEMS.map((item) => (
        <QuickAccessCard 
          key={item.id} 
          item={item} 
          onClick={() => {
            if (item.navigateTo) {
              onNavigate(item.navigateTo);
            }
          }} 
        />
      ))}
    </div>
  );
};

export default QuickAccessGrid;