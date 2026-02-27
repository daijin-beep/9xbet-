
import React, { useState } from 'react';
import { MissionAction, PageView } from '../types';
import { NEWBIE_MISSIONS, WEEKLY_MISSIONS, MISSION_TABS } from '../constants';
import MissionCard from './MissionCard';
import PromotionsHeader from './PromotionsHeader';

interface MissionPageProps {
  onAction: (action: MissionAction) => void;
  setActivePage: (page: PageView) => void;
}

const MissionPage: React.FC<MissionPageProps> = ({ onAction, setActivePage }) => {
  const [activeTab, setActiveTab] = useState<'newbie' | 'weekly'>('newbie');
  
  const missions = activeTab === 'newbie' ? NEWBIE_MISSIONS : WEEKLY_MISSIONS;

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white">
      <PromotionsHeader activePage="mission" setActivePage={setActivePage} />

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Tabs Navigation */}
        <nav className="flex space-x-2 p-3 bg-slate-800/50 border-b border-slate-700 overflow-x-auto no-scrollbar flex-shrink-0">
          {MISSION_TABS.map(tab => (
              <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'newbie' | 'weekly')}
                  className={`flex-1 min-w-[120px] py-2 px-4 rounded-lg text-sm text-center font-semibold transition-all duration-200
                      ${activeTab === tab.id 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'bg-slate-700/50 text-gray-400 hover:bg-slate-700 hover:text-gray-200'
                      }`}
                  aria-pressed={activeTab === tab.id}
              >
                  {tab.label}
              </button>
          ))}
        </nav>
        
        <section className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-4">
          <div className="space-y-3">
              {missions.length > 0 ? (
                  missions.map(mission => (
                      <MissionCard key={mission.id} mission={mission} onAction={onAction} />
                  ))
              ) : (
                  <div className="text-center text-gray-500 pt-16">
                      <p className="text-lg">No missions available.</p>
                      <p className="text-sm">Check back later for new challenges!</p>
                  </div>
              )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default MissionPage;
