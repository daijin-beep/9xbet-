
import React from 'react';
import { BOTTOM_NAV_ITEMS } from '../constants';
import { BottomNavItem, PageView } from '../types';

interface NavItemProps {
  item: BottomNavItem;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ item, isActive, onClick }) => {
  const activeColor = 'text-yellow-500';
  const inactiveColor = 'text-gray-400 hover:text-yellow-400';
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center flex-1 p-2 sm:p-1 focus:outline-none transition-colors ${isActive ? activeColor : inactiveColor}`}
      aria-current={isActive ? 'page' : undefined}
      aria-label={item.label}
    >
      <item.Icon className={`w-6 h-6 mb-0.5 ${isActive ? 'fill-current' : ''}`} />
      <span className={`text-xs font-medium ${isActive ? 'font-semibold' : ''}`}>{item.label}</span>
    </button>
  );
};

const CasinoNavItem: React.FC<{ item: BottomNavItem; isActive: boolean; onClick: () => void; }> = ({ item, isActive, onClick }) => {
    const activeColor = 'bg-yellow-500';
    const inactiveColor = 'bg-blue-600';
    const iconColor = isActive ? 'text-slate-900' : 'text-white';
    
    return (
        <div className="flex-1 flex justify-center">
            <div className="relative w-20 flex flex-col items-center">
                <button
                    onClick={onClick}
                    className={`absolute -top-6 w-16 h-16 rounded-full flex items-center justify-center shadow-lg border-4 border-slate-900 transition-all duration-300 hover:scale-110
                                ${isActive ? activeColor : inactiveColor}`}
                    aria-label={item.label}
                    aria-current={isActive ? 'page' : undefined}
                >
                    <item.Icon className={`w-8 h-8 transition-colors ${iconColor}`} />
                </button>
                <span className={`absolute bottom-1.5 sm:bottom-0.5 text-xs font-medium transition-colors ${isActive ? 'text-yellow-500' : 'text-gray-400'}`}>
                    {item.label}
                </span>
            </div>
        </div>
    );
};


interface BottomNavProps {
  activePage: PageView;
  setActivePage: (page: PageView) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activePage, setActivePage, isSidebarOpen, toggleSidebar }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 flex items-stretch justify-around shadow-lg z-50 h-16 sm:h-12">
      {BOTTOM_NAV_ITEMS.map((item) => {
        const isActive = item.id === 'menu' ? isSidebarOpen : activePage === item.id;
        const onClick = item.id === 'menu' 
          ? toggleSidebar 
          : () => setActivePage(item.id as PageView);

        if (item.id === 'home') {
            return <CasinoNavItem key={item.id} item={item} isActive={isActive} onClick={onClick} />;
        }

        return (
            <NavItem 
              key={item.id} 
              item={item} 
              isActive={isActive}
              onClick={onClick}
            />
        );
      })}
    </nav>
  );
};

export default BottomNav;