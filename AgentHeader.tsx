
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeftIcon, ChevronDownIcon, CheckIcon, InformationCircleIcon } from './icons/GenericIcons';
import { PageView } from '../types';
import { KOL_AGENT_TABS } from '../constants';

interface AgentHeaderProps {
  activePage: PageView;
  setActivePage: (page: PageView) => void;
}

const AgentHeader: React.FC<AgentHeaderProps> = ({ activePage, setActivePage }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const isKolMode = activePage !== 'agentAll';

  const handleModeSwitch = (mode: 'kol' | 'all') => {
    if (mode === 'kol') {
      if (!isKolMode) setActivePage('kolOverview');
    } else {
      if (isKolMode) setActivePage('agentAll');
    }
    setIsDropdownOpen(false);
  };

  const handleTabClick = (tabId: string) => {
      // Directly navigate to the PageView corresponding to the tab
      setActivePage(tabId as PageView);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
        document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className="flex-shrink-0 bg-slate-900 z-20 border-b border-slate-700 relative">
        {/* Main Title Bar */}
        <header className="flex items-center p-3 shadow-sm relative z-30">
            <button 
                onClick={() => setActivePage('home')} 
                className="p-2 mr-2 text-gray-300 hover:text-yellow-400 rounded-full hover:bg-slate-800 transition-colors"
                aria-label="Back to Home"
            >
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
            
            <div className="relative" ref={dropdownRef}>
                <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 text-xl font-bold text-white hover:text-gray-200 transition-colors focus:outline-none"
                >
                    <span>{isKolMode ? 'KOL Agent Mode' : '全民代理模式'}</span>
                    <ChevronDownIcon className={`w-5 h-5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                    <div className="absolute top-full left-0 mt-3 w-72 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-fade-in z-50">
                        <div className="p-2 space-y-1">
                            <button
                                onClick={() => handleModeSwitch('kol')}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${isKolMode ? 'bg-blue-600/20 text-blue-400' : 'text-gray-300 hover:bg-slate-700'}`}
                            >
                                <span className="font-semibold">KOL Agent Mode</span>
                                {isKolMode && <CheckIcon className="w-5 h-5" />}
                            </button>
                            <button
                                onClick={() => handleModeSwitch('all')}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${!isKolMode ? 'bg-blue-600/20 text-blue-400' : 'text-gray-300 hover:bg-slate-700'}`}
                            >
                                <span className="font-semibold">全民代理模式</span>
                                {!isKolMode && <CheckIcon className="w-5 h-5" />}
                            </button>
                        </div>
                        
                        <div className="bg-slate-900/80 p-3 border-t border-slate-700 backdrop-blur-sm">
                            <div className="flex items-start space-x-2 text-xs text-gray-400">
                                <InformationCircleIcon className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-500" />
                                <p className="leading-relaxed">
                                    KOL模式和全民代理模式邀请的用户相互独立，且用户只能被邀请一次。
                                    <button className="text-blue-400 hover:underline ml-1 block mt-1 font-medium">
                                        点击了解更多详情 -&gt;
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
        
        {/* Sub-navigation Tabs (Only for KOL Mode) */}
        {isKolMode && (
            <nav className="flex overflow-x-auto no-scrollbar bg-slate-800/50">
                {KOL_AGENT_TABS.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`flex-shrink-0 py-3 px-4 text-sm font-semibold text-center whitespace-nowrap transition-colors border-b-2 ${
                    activePage === tab.id
                        ? 'text-white border-blue-500 bg-slate-800'
                        : 'text-gray-400 hover:text-gray-200 border-transparent hover:bg-slate-800/30'
                    }`}
                >
                    {tab.label}
                </button>
                ))}
            </nav>
        )}
    </div>
  );
};

export default AgentHeader;
