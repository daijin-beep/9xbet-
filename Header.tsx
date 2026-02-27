
import React from 'react';
import { CoinIcon, ArrowDownTrayIcon, ChevronDownIcon, BellIcon, GiftIcon, BanknotesIcon } from './icons/GenericIcons';
import { AuthModalView, User, WalletType } from '../types';

interface HeaderProps {
  openAuthModal: (view: AuthModalView) => void;
  isLoggedIn: boolean;
  currentUser: User | null;
  activeWallet: WalletType;
  onBalanceClick: () => void;
  onDepositClick: () => void;
  onMessagesClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ openAuthModal, isLoggedIn, currentUser, activeWallet, onBalanceClick, onDepositClick, onMessagesClick }) => {
  if (isLoggedIn && currentUser) {
    const displayBalance = activeWallet === 'cash' ? currentUser.balance : currentUser.bonusBalance;
    const WalletIcon = activeWallet === 'cash' ? BanknotesIcon : GiftIcon;
    const walletLabel = activeWallet === 'cash' ? 'Cash' : 'Bonus';

    return (
      <header className="bg-slate-900 p-3 flex items-center justify-between shadow-md">
        <div className="flex items-center flex-1 min-w-0 mr-2">
          <img src={currentUser.avatarUrl} alt="User Avatar" className="w-9 h-9 rounded-full object-cover border-2 border-slate-600 mr-2 flex-shrink-0" />
          
          <button 
            onClick={onBalanceClick}
            className="flex flex-col items-start min-w-0 bg-slate-800/50 hover:bg-slate-800 px-2 py-1 rounded-xl transition-colors active:scale-95 text-left"
          >
            <div className="flex items-center space-x-1 text-[10px] font-black text-slate-500 uppercase tracking-tight">
                <WalletIcon className={`w-2.5 h-2.5 ${activeWallet === 'cash' ? 'text-green-500' : 'text-purple-400'}`} />
                <span>{walletLabel} Balance</span>
            </div>
            <div className="flex items-center text-sm font-black">
              <span className={`font-mono ${activeWallet === 'cash' ? 'text-yellow-400' : 'text-purple-400'}`}>
                {displayBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="ml-1 text-[10px] text-gray-500">{currentUser.currency}</span>
              <ChevronDownIcon className="w-3.5 h-3.5 ml-0.5 text-gray-600" />
            </div>
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={onMessagesClick} 
            className="relative p-2 text-gray-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full transition-colors"
            aria-label="Messages"
          >
            <BellIcon className="w-6 h-6" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-800"></span>
          </button>
          <button onClick={onDepositClick} className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-black py-2 px-4 rounded-full flex items-center space-x-1 shadow-lg shadow-blue-900/20 transition-all active:scale-95 uppercase tracking-widest">
            <ArrowDownTrayIcon className="w-4 h-4" />
            <span>Deposit</span>
          </button>
        </div>
      </header>
    );
  }

  // Logged out state
  return (
    <header className="bg-slate-900 p-4 flex items-center justify-between shadow-md">
       <div className="flex-1"></div>
      <div className="flex items-center flex-1 justify-center">
        <CoinIcon className="h-7 w-7 text-yellow-400 mr-1" />
        <span className="text-white text-xl font-bold">3rr.com</span>
      </div>
      <div className="flex items-center space-x-2 flex-1 justify-end">
        <button 
          onClick={() => openAuthModal('login')}
          className="bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold py-2 px-3 rounded-lg"
          aria-label="Open login modal"
        >
          Log in
        </button>
        <button 
          onClick={() => openAuthModal('register')}
          className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 text-sm font-semibold py-2 px-3 rounded-lg"
          aria-label="Open registration modal"
        >
          Register
        </button>
      </div>
    </header>
  );
};

export default Header;
