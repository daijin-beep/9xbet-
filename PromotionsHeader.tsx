
import React from 'react';
import { ArrowLeftIcon } from './icons/GenericIcons';
import { OFFERS_TABS } from '../constants';
import { PageView } from '../types';

interface PromotionsHeaderProps {
  activePage: PageView;
  setActivePage: (page: PageView) => void;
}

const PromotionsHeader: React.FC<PromotionsHeaderProps> = ({ activePage, setActivePage }) => {
  const getActiveTabId = (page: PageView): string => {
      switch (page) {
          case 'offers': return 'event_list';
          case 'mission': return 'mission';
          case 'vipCenter': return 'vip_center';
          case 'myBonuses': return 'my_bonuses';
          case 'history': return 'history';
          default: return 'event_list';
      }
  };

  const activeTabId = getActiveTabId(activePage);

  const handleTabClick = (tabId: string) => {
      switch(tabId) {
          case 'event_list': setActivePage('offers'); break;
          case 'mission': setActivePage('mission'); break;
          case 'vip_center': setActivePage('vipCenter'); break;
          case 'my_bonuses': setActivePage('myBonuses'); break;
          case 'history': setActivePage('history'); break;
      }
  };

  return (
    <div className="flex-shrink-0 bg-slate-900 z-20 border-b border-slate-700">
        <header className="flex items-center p-3 shadow-sm">
            <button 
                onClick={() => setActivePage('home')} 
                className="p-2 mr-2 text-gray-300 hover:text-yellow-400 rounded-full hover:bg-slate-800 transition-colors"
                aria-label="Back to Home"
            >
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-white">Promotions</h1>
        </header>
        
        <nav className="flex overflow-x-auto no-scrollbar bg-slate-800/50">
            {OFFERS_TABS.map(tab => (
            <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex-shrink-0 py-3 px-4 text-sm font-semibold text-center whitespace-nowrap transition-colors border-b-2 ${
                activeTabId === tab.id
                    ? 'text-white border-blue-500 bg-slate-800'
                    : 'text-gray-400 hover:text-gray-200 border-transparent hover:bg-slate-800/30'
                }`}
            >
                {tab.label}
            </button>
            ))}
        </nav>
    </div>
  );
};

export default PromotionsHeader;
