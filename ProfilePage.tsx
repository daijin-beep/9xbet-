
import React, { useState } from 'react';
import { PageView, ProfileQuickLink, Game } from '../types';
import { PROFILE_WALLET_SUMMARY, PROFILE_QUICK_LINKS, RECENTLY_PLAYED_GAMES } from '../constants';
import { 
    ArrowDownTrayIcon, 
    ArrowUpTrayIcon, 
    ChevronRightIcon,
    ArrowRightOnRectangleIcon,
    RocketLaunchIcon
} from './icons/GenericIcons';
import { CrownIcon } from './icons/QuickAccessIcons'; 
import VipProgressBar from './VipProgressBar';
import ProfileEditModal from './ProfileEditModal';
import RecentlyPlayedSection from './RecentlyPlayedSection';

interface ProfilePageProps {
  setActivePage: (page: PageView) => void;
  onLogout: () => void;
  onGameClick: (game: Game) => void;
  onOpenDepositModal: (cryptoId?: string) => void;
  onWithdrawClick: () => void;
  favoriteGames: Set<string>;
  onToggleFavorite: (gameId: string) => void;
  onNavigateToBonusCenter: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ setActivePage, onLogout, onGameClick, onOpenDepositModal, onWithdrawClick, favoriteGames, onToggleFavorite, onNavigateToBonusCenter }) => {
  const [nickname, setNickname] = useState('CasinoKing');
  const [avatarUrl, setAvatarUrl] = useState('https://picsum.photos/seed/useravatar/100/100');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Mock data for VIP progress
  const vipData = {
    levelName: 'Gold',
    recharge: { current: 7500, target: 15000 },
    turnover: { current: 185000, target: 250000 },
    currency: 'PKR',
  };

  const handleSaveProfile = (newNickname: string, newAvatarUrl: string) => {
    setNickname(newNickname);
    setAvatarUrl(newAvatarUrl);
    setIsEditModalOpen(false);
  };
  
  const handleQuickLinkClick = (link: ProfileQuickLink) => {
    if (link.navigateTo) {
      setActivePage(link.navigateTo);
    } else if (link.action) {
      link.action();
    }
  };

  return (
    <>
      <div className="flex flex-col h-full bg-slate-900 text-white">
        {/* Header */}
        <header className="sticky top-0 bg-slate-800 shadow-md z-20 p-3 flex items-center justify-center border-b border-slate-700">
          <h1 className="text-xl font-bold text-white">My Profile</h1>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto no-scrollbar">
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-slate-800 to-slate-900 p-4">
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setIsEditModalOpen(true)} className="flex items-center text-left group">
                <img src={avatarUrl} alt="User Avatar" className="w-16 h-16 rounded-full object-cover border-2 border-slate-600 group-hover:border-yellow-400 transition-colors" />
                <div className="ml-3">
                  <p className="font-semibold text-white text-xl">{nickname}</p>
                   <div className="flex items-center text-sm font-semibold bg-slate-700 px-2.5 py-1 rounded-full w-fit mt-1.5">
                      <CrownIcon className="w-4 h-4 mr-1.5 text-yellow-300" />
                      <span className="text-yellow-300">{vipData.levelName} VIP</span>
                    </div>
                </div>
              </button>
            </div>

            {/* VIP Progress Bars */}
            <div className="space-y-2">
              <VipProgressBar 
                title="VIP Recharge Progress"
                currentValue={vipData.recharge.current}
                targetValue={vipData.recharge.target}
                progressBarColor="bg-green-500"
                valueSuffix={` ${vipData.currency}`}
                onInfoClick={() => console.log('Recharge info clicked')}
              />
              <VipProgressBar 
                title="VIP Turnover Progress"
                currentValue={vipData.turnover.current}
                targetValue={vipData.turnover.target}
                progressBarColor="bg-blue-500"
                valueSuffix={` ${vipData.currency}`}
                onInfoClick={() => console.log('Turnover info clicked')}
              />
            </div>
          </section>

          {/* Wallet Balance */}
          <section className="p-4">
            <div className="bg-slate-800 p-4 rounded-lg shadow-md">
              <div className="grid grid-cols-3 divide-x divide-slate-700 text-center mb-6">
                {PROFILE_WALLET_SUMMARY.map(item => {
                  const content = (
                    <>
                      <p className={`text-xs ${item.isTotal ? 'text-gray-300' : 'text-gray-400'}`}>{item.label}</p>
                      <p className={`font-bold mt-1 ${item.isTotal ? 'text-xl text-yellow-400' : 'text-lg text-white'}`}>{item.amount}</p>
                      <p className="text-xs text-gray-500">{item.currency}</p>
                    </>
                  );

                  if (item.id === 'bonus') {
                    return (
                      <button key={item.id} onClick={onNavigateToBonusCenter} className="px-2 text-center hover:bg-slate-700/50 rounded-lg transition-colors flex flex-col justify-center">
                        {content}
                      </button>
                    );
                  }

                  return (
                    <div key={item.id} className="px-2 flex flex-col justify-center">
                      {content}
                    </div>
                  );
                })}
              </div>
              <div className="flex space-x-3">
                <button onClick={() => onOpenDepositModal()} className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-md flex items-center justify-center space-x-2 transition-colors">
                  <ArrowDownTrayIcon className="w-5 h-5" />
                  <span>Deposit</span>
                </button>
                <button onClick={onWithdrawClick} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-md flex items-center justify-center space-x-2 transition-colors">
                  <ArrowUpTrayIcon className="w-5 h-5" />
                  <span>Withdraw</span>
                </button>
              </div>
            </div>
          </section>

          {/* Recently Played */}
          <div className="px-4">
            <RecentlyPlayedSection 
              games={RECENTLY_PLAYED_GAMES} 
              onGameClick={onGameClick} 
              favoriteGames={favoriteGames}
              onToggleFavorite={onToggleFavorite}
            />
          </div>

          {/* Quick Links */}
          <section className="p-4 pt-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PROFILE_QUICK_LINKS.map(link => {
                const Icon = link.Icon;
                return (
                  <button 
                    key={link.id} 
                    onClick={() => handleQuickLinkClick(link)}
                    className="bg-slate-800 p-3 rounded-lg text-left hover:bg-slate-700/70 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Icon className="w-6 h-6 text-yellow-400" />
                        <span className="ml-3 font-semibold text-sm text-white">{link.label}</span>
                      </div>
                      <ChevronRightIcon className="w-4 h-4 text-gray-500" />
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Logout Button */}
          <section className="p-4">
            <button
              onClick={onLogout}
              className="w-full bg-red-600/20 hover:bg-red-500/30 text-red-400 font-semibold py-3 rounded-md flex items-center justify-center space-x-2 transition-colors border border-red-500/30"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </section>
          
          {/* Bottom Padding */}
          <div className="h-16 sm:h-12"></div>
        </main>
      </div>
      
      <ProfileEditModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentNickname={nickname}
        currentAvatarUrl={avatarUrl}
        onSave={handleSaveProfile}
      />
    </>
  );
};

export default ProfilePage;
