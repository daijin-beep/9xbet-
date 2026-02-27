import React from 'react';
import { GameBrand } from '../types';
import { TrophyIcon } from './icons/GenericIcons';

interface GameBrandCardProps {
  brand: GameBrand;
  onBrandClick: (providerId: string) => void;
}

const GameBrandCard: React.FC<GameBrandCardProps> = ({ brand, onBrandClick }) => {
  return (
    <button
      onClick={() => onBrandClick(brand.providerId)}
      className="flex-shrink-0 w-32 h-20 rounded-lg overflow-hidden shadow-lg bg-slate-800 relative mr-3 group hover:border-2 hover:border-yellow-400 transition-all duration-200"
      aria-label={`View games from ${brand.name}`}
    >
      <img src={brand.logoUrl} alt={`${brand.name} logo`} className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform" />
    </button>
  );
};

interface GameBrandsListProps {
  onBrandClick: (providerId: string) => void;
  brands: GameBrand[];
}

const GameBrandsList: React.FC<GameBrandsListProps> = ({ onBrandClick, brands }) => {
    // Duplicate the brands to create a seamless looping effect
    const duplicatedBrands = [...brands, ...brands];

  return (
    <div className="my-6">
        <style>{`
            @keyframes scroll {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
            }
            .scroller {
                overflow: hidden;
                -webkit-mask: linear-gradient(90deg, transparent, white 20%, white 80%, transparent);
                mask: linear-gradient(90deg, transparent, white 20%, white 80%, transparent);
            }
            .scroller[data-animated="true"] .scroller__inner {
                width: max-content;
                display: flex;
                flex-wrap: nowrap;
                animation: scroll 40s linear infinite;
            }
            .scroller:hover .scroller__inner {
                animation-play-state: paused;
            }
        `}</style>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-bold text-white flex items-center">
          <TrophyIcon className="w-6 h-6 text-yellow-500 mr-2" />
          Top Brands
        </h3>
      </div>
      <div className="scroller" data-animated="true">
        <div className="scroller__inner">
            {duplicatedBrands.map((brand, index) => (
                <GameBrandCard key={`${brand.id}-${index}`} brand={brand} onBrandClick={onBrandClick} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default GameBrandsList;