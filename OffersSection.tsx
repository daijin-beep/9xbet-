import React from 'react';
import { HomeOffer } from '../types';
import OfferCard from './OfferCard';
import { ChevronRightIcon } from './icons/GenericIcons';
import { PromoPercentIcon } from './icons/PromoPercentIcon';

interface OffersSectionProps {
  offers: HomeOffer[];
  onOfferClick: (action: HomeOffer['action']) => void;
  onViewAll: () => void;
}

const OffersSection: React.FC<OffersSectionProps> = ({ offers, onOfferClick, onViewAll }) => {
  return (
    <div className="my-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-bold text-white flex items-center">
          <div className="w-8 h-8 mr-2 bg-pink-500 rounded-lg flex items-center justify-center">
            <PromoPercentIcon className="w-5 h-5 text-white" />
          </div>
          Акции
        </h3>
        <button
          onClick={onViewAll}
          className="px-4 py-1.5 text-sm font-semibold bg-slate-200 text-slate-900 rounded-full hover:bg-white transition-colors"
        >
          Все
        </button>
      </div>
      <div className="flex overflow-x-auto no-scrollbar pb-2 space-x-3">
        {offers.map((offer) => (
          <OfferCard key={offer.id} offer={offer} onClick={onOfferClick} />
        ))}
        <div className="flex-shrink-0 w-px"></div>
      </div>
    </div>
  );
};

export default OffersSection;