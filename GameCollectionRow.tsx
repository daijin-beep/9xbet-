import React from 'react';
import { GameCollection, GameProviderCollectionItem } from '../types';
import { ChevronRightIcon, PhoneHorizontalIcon, PhoneVerticalIcon } from './icons/GenericIcons';

interface GameProviderCollectionCardProps {
  item: GameProviderCollectionItem;
  onClick: () => void;
}

const GameProviderCollectionCard: React.FC<GameProviderCollectionCardProps> = ({ item, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="flex-shrink-0 w-36 rounded-lg overflow-hidden shadow-lg bg-slate-800 relative mr-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 hover:shadow-yellow-500/30 transition-all duration-200"
      aria-label={`View ${item.name} by ${item.subProviderName}`}
    >
      <img src={item.imageSrc} alt={item.name} className="w-full h-48 object-cover" />
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0 mr-1">
            <h4 className="text-white text-xs font-bold truncate">{item.name}</h4>
            <p className="text-yellow-400 text-[10px] uppercase font-semibold">{item.subProviderName}</p>
          </div>
          {item.orientation === 'landscape' && (
            <PhoneHorizontalIcon className="w-5 h-5 text-gray-200 flex-shrink-0" aria-hidden="true" />
          )}
          {item.orientation === 'portrait' && (
            <PhoneVerticalIcon className="w-5 h-5 text-gray-200 flex-shrink-0" aria-hidden="true" />
          )}
        </div>
      </div>
    </button>
  );
};

interface GameCollectionRowProps {
  collection: GameCollection;
  onViewAll: () => void;
  onViewProviderCollection: () => void;
}

const GameCollectionRow: React.FC<GameCollectionRowProps> = ({ collection, onViewAll, onViewProviderCollection }) => {
  return (
    <div className="my-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className="w-8 h-8 mr-2 bg-purple-500 rounded-lg flex items-center justify-center">
            <collection.Icon className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white">{collection.title}</h3>
        </div>
        <button
          onClick={onViewAll}
          className="px-4 py-1.5 text-sm font-semibold bg-slate-200 text-slate-900 rounded-full hover:bg-white transition-colors"
          aria-label={`View all ${collection.title} games`}
        >
          Все
        </button>
      </div>
      <div className="flex overflow-x-auto no-scrollbar pb-2">
        {collection.items.map((item) => (
          <GameProviderCollectionCard 
            key={item.id} 
            item={item} 
            onClick={onViewProviderCollection}
          />
        ))}
        <div className="flex-shrink-0 w-px"></div> {/* Spacer */}
      </div>
    </div>
  );
};

export default GameCollectionRow;