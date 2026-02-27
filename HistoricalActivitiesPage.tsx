
import React from 'react';
import { HistoricalActivityItem, PageView } from '../types';
import { CalendarDaysIcon, GiftIcon, TagIcon } from './icons/GenericIcons';
import PromotionsHeader from './PromotionsHeader';

interface HistoryCardProps {
  item: HistoricalActivityItem;
}

const HistoryCard: React.FC<HistoryCardProps> = ({ item }) => {
  const statusConfig = {
    Ongoing: { text: '进行中', classes: 'bg-green-500/20 text-green-400' },
    Ended: { text: '已结束', classes: 'bg-slate-600 text-gray-400' },
  };
  
  const currentStatus = statusConfig[item.status];

  return (
    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-md space-y-3">
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-white text-md flex items-center">
            <TagIcon className="w-5 h-5 mr-2 text-blue-400" />
            {item.activityName}
        </h3>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${currentStatus.classes}`}>
          {currentStatus.text}
        </span>
      </div>
      
      <div className="space-y-2 text-sm border-t border-slate-700 pt-3">
        <div className="flex items-center text-gray-300">
            <GiftIcon className="w-4 h-4 mr-2 text-yellow-400" />
            <span className="text-gray-400 mr-2">获得奖励:</span>
            <span className="font-semibold">{item.reward}</span>
        </div>
        <div className="flex items-center text-gray-300">
            <CalendarDaysIcon className="w-4 h-4 mr-2 text-gray-400" />
            <span className="text-gray-400 mr-2">参与时间:</span>
            <span>{new Date(item.participationTime).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};


interface HistoricalActivitiesPageProps {
    activities: HistoricalActivityItem[];
    setActivePage: (page: PageView) => void;
}

const HistoricalActivitiesPage: React.FC<HistoricalActivitiesPageProps> = ({ activities, setActivePage }) => {
  return (
    <div className="flex flex-col h-full bg-slate-900 text-white">
      <PromotionsHeader activePage="history" setActivePage={setActivePage} />

      <div className="p-3 space-y-3 flex-1 overflow-y-auto no-scrollbar">
          {activities.length > 0 ? (
              activities.map(activity => <HistoryCard key={activity.id} item={activity} />)
          ) : (
              <div className="text-center text-gray-500 pt-16">
                  <p className="text-lg">No activity history found.</p>
                  <p className="text-sm">You haven't participated in any events yet.</p>
              </div>
          )}
      </div>
    </div>
  );
};

export default HistoricalActivitiesPage;
