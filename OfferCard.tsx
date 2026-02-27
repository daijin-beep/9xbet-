import React from 'react';
import { HomeOffer } from '../types';

interface OfferCardProps {
  offer: HomeOffer;
  onClick: (action: HomeOffer['action']) => void;
}

const OfferCard: React.FC<OfferCardProps> = ({ offer, onClick }) => {
  return (
    <div
      onClick={() => onClick(offer.action)}
      className={`relative flex-shrink-0 w-64 h-40 rounded-xl overflow-hidden p-4 text-white shadow-lg cursor-pointer group transition-transform hover:scale-105 ${offer.bgClassName}`}
    >
      <h3 className="font-bold text-2xl leading-tight max-w-[160px]">{offer.title}</h3>
      <p className="text-sm mt-1 opacity-90 max-w-[150px]">{offer.description}</p>
      <button className="absolute bottom-4 left-4 bg-white/90 hover:bg-white text-slate-800 font-bold py-2 px-6 rounded-lg text-sm transition-colors">
        {offer.ctaText}
      </button>

      {/* Graphic element for 55% bonus from screenshot */}
      {offer.graphicImageUrl && (
          <img src={offer.graphicImageUrl} alt="" className="absolute -bottom-2 -right-2 h-28 w-auto pointer-events-none group-hover:scale-110 transition-transform" />
      )}
      
      {/* Decorative floating elements for the reload bonus card */}
      {offer.id === 'offer-reload' && (
        <>
            {/* Gift */}
            <div className="absolute bottom-16 right-[90px] w-6 h-6 bg-purple-400 rounded-sm rotate-[-15deg] opacity-70 group-hover:rotate-0 transition-transform">
                 <div className="absolute top-1/2 left-0 w-full h-1 bg-purple-300 -translate-y-1/2"></div>
                 <div className="absolute top-0 left-1/2 w-1 h-full bg-purple-300 -translate-x-1/2"></div>
            </div>
            {/* Coin 1 */}
            <div className="absolute bottom-8 right-6 w-5 h-5 bg-yellow-400 rounded-full opacity-70 shadow-md animate-pulse"></div>
            {/* Coin 2 */}
            <div className="absolute top-8 right-12 w-4 h-4 bg-yellow-300 rounded-full opacity-60 shadow animate-pulse delay-300"></div>
        </>
      )}
    </div>
  );
};

export default OfferCard;
