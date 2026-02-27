import React from 'react';
import { REWARD_HISTORY_ITEMS } from '../constants';
import { CalendarDaysIcon } from './icons/GenericIcons';

const VipRewardHistory: React.FC = () => {
  return (
    <section className="bg-slate-800 p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-white mb-4">Reward History</h2>
      <div className="space-y-2">
        {REWARD_HISTORY_ITEMS.length > 0 ? (
          REWARD_HISTORY_ITEMS.map(item => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-md">
              <div>
                <p className="font-semibold text-gray-200">{item.type}</p>
                <div className="flex items-center text-xs text-gray-400 mt-1">
                  <CalendarDaysIcon className="w-4 h-4 mr-1.5" />
                  <span>{item.date}</span>
                </div>
              </div>
              <p className="text-lg font-bold text-green-400">{item.amount}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-4">No reward history available.</p>
        )}
      </div>
    </section>
  );
};

export default VipRewardHistory;
