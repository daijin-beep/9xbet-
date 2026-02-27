
import React from 'react';
import { CloseIcon, CoinIcon } from './icons/GenericIcons';

interface AppDownloadBannerProps {
  onClose: () => void;
}

const AppDownloadBanner: React.FC<AppDownloadBannerProps> = ({ onClose }) => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2.5 flex items-center justify-between shadow-md" role="banner">
      <div className="flex items-center flex-1">
        <CoinIcon className="w-8 h-8 text-yellow-300 flex-shrink-0" />
        <div className="ml-3 flex-1 min-w-0">
          <p className="font-bold text-sm truncate">下载官方 APP，解锁极致赢家模式</p>
          <p className="text-xs opacity-80 truncate">登录即领 500 RUB 新人礼包。更流畅、防劫持。</p>
        </div>
      </div>
      <div className="flex items-center space-x-3 ml-2">
        <button className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 text-xs font-bold py-2 px-4 rounded-full whitespace-nowrap transition-colors shadow-lg">
          立即领取
        </button>
        <button 
          onClick={onClose} 
          className="p-1.5 text-white/70 hover:text-white hover:bg-white/20 rounded-full" 
          aria-label="关闭提示"
        >
          <CloseIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default AppDownloadBanner;
