
import React, { useState, useMemo } from 'react';
import { SearchIcon, ClockIcon, CalendarDaysIcon } from './icons/GenericIcons';
import { PROMOTIONAL_BANNERS, OFFERS_FILTER_TABS } from '../constants';
import { PromotionalBanner, PageView } from '../types';
import PromotionsHeader from './PromotionsHeader';

interface OffersPageProps {
  setActivePage: (page: PageView) => void;
  onOfferClick: (banner: PromotionalBanner) => void;
}

const OffersPage: React.FC<OffersPageProps> = ({ setActivePage, onOfferClick }) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filteredBanners = useMemo(() => {
    if (activeFilter === 'all') {
      return PROMOTIONAL_BANNERS;
    }
    return PROMOTIONAL_BANNERS.filter(banner => banner.offerType === activeFilter);
  }, [activeFilter]);

  const BannerCard: React.FC<{ banner: PromotionalBanner }> = ({ banner }) => {
    const LogoIcon = banner.logoIcon;
    
    // 计算显示的时间文本
    const getTimeDisplay = () => {
        if (banner.activityType === 'daily' && banner.cycleConfig) {
            return (
                <div className="flex items-center space-x-1">
                    <ClockIcon className="w-3 h-3 text-blue-300" />
                    <span>每日 {banner.cycleConfig.startTime} - {banner.cycleConfig.endTime}</span>
                </div>
            );
        }
        if (banner.activityType === 'weekly' && banner.cycleConfig) {
             return (
                <div className="flex items-center space-x-1">
                    <CalendarDaysIcon className="w-3 h-3 text-purple-300" />
                    <span>每周 {banner.cycleConfig.startDay} 至 {banner.cycleConfig.endDay}</span>
                </div>
            );
        }
        return banner.dateRange || '永久有效';
    };

    return (
      <button 
        onClick={() => onOfferClick(banner)}
        className="relative w-full rounded-2xl overflow-hidden h-44 bg-cover bg-center p-5 flex flex-col justify-between items-start text-white shadow-xl group text-left border border-white/5"
        style={{ backgroundImage: `url(${banner.imageUrl})` }}
        role="article"
        aria-labelledby={`banner-title-${banner.id}`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity"></div>
        
        {/* 类型角标 */}
        {banner.activityType && banner.activityType !== 'fixed' && (
            <div className={`absolute top-0 right-0 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-bl-xl z-20 ${banner.activityType === 'daily' ? 'bg-blue-600' : 'bg-purple-600'}`}>
                {banner.activityType === 'daily' ? '日循环' : '周循环'}
            </div>
        )}

        <div className="relative z-10 flex-1">
          <h3 id={`banner-title-${banner.id}`} className="text-xl sm:text-2xl font-black italic tracking-tighter uppercase leading-tight drop-shadow-lg">{banner.title}</h3>
          {banner.amount && <p className="text-2xl font-black text-blue-400 drop-shadow-md my-1 font-mono">{banner.amount}</p>}
          {banner.subtitle && <p className="text-xs sm:text-sm font-bold opacity-80 drop-shadow-md">{banner.subtitle}</p>}
        </div>

        <div className="relative z-10 w-full flex items-end justify-between">
           <div className="text-[10px] font-black uppercase tracking-widest bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-gray-200">
               {getTimeDisplay()}
           </div>
           {LogoIcon && (
               <LogoIcon className="w-6 h-6 text-white/30" />
           )}
        </div>
      </button>
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white">
      <PromotionsHeader activePage="offers" setActivePage={setActivePage} />

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Filter Tabs */}
        <nav className="flex space-x-2 p-3 bg-slate-800/50 border-b border-slate-700 overflow-x-auto no-scrollbar flex-shrink-0">
            {OFFERS_FILTER_TABS.map(tab => (
            <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`flex-shrink-0 py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap
                ${activeFilter === tab.id 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-slate-700/50 text-gray-400 hover:bg-slate-700 hover:text-gray-200'
                }`}
                aria-pressed={activeFilter === tab.id}
            >
                {tab.label}
            </button>
            ))}
        </nav>

        <section className="flex-1 overflow-y-auto no-scrollbar bg-slate-900">
            <div className="space-y-4 p-4 pb-24">
            {filteredBanners.length > 0 ? (
                filteredBanners.map(banner => (
                <BannerCard key={banner.id} banner={banner} />
                ))
            ) : (
                <div className="text-center text-gray-500 pt-16">
                <SearchIcon className="w-16 h-16 mb-4 text-slate-700 mx-auto" />
                <p className="text-lg font-semibold">No promotions found.</p>
                <p className="text-sm">There are no offers in this category right now.</p>
                </div>
            )}
            </div>
        </section>
      </div>
    </div>
  );
};

export default OffersPage;
