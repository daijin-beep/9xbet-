import React from 'react';
import { PlayCircleIcon } from './icons/GenericIcons';

interface FeaturedGameBannerProps {
  bannerData: {
    title: string;
    gameName: string;
    description: string;
    imageUrl: string;
  };
}

const FeaturedGameBanner: React.FC<FeaturedGameBannerProps> = ({ bannerData }) => {
  return (
    <div
      className="relative rounded-xl overflow-hidden my-6 h-40 bg-cover bg-center p-6 flex flex-col justify-center items-start text-white shadow-lg group"
      style={{ backgroundImage: `url('${bannerData.imageUrl}')` }}
      role="banner"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-800/80 via-purple-600/50 to-transparent"></div>
      <div className="relative z-10">
        <p className="text-sm font-semibold text-yellow-300 uppercase tracking-wider">{bannerData.title}</p>
        <h2 className="text-4xl font-bold leading-tight drop-shadow-md my-1">{bannerData.gameName}</h2>
        <p className="text-md font-medium">{bannerData.description}</p>
      </div>
      <button 
        className="absolute bottom-6 right-6 z-10 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold py-2 px-5 rounded-lg flex items-center space-x-2 transition-transform transform group-hover:scale-105"
        aria-label={`Play ${bannerData.gameName}`}
      >
        <PlayCircleIcon className="w-6 h-6" />
        <span>Play Now</span>
      </button>
    </div>
  );
};

export default FeaturedGameBanner;