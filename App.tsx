
import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import NotificationBar from './components/NotificationBar';
import PromoBanner from './components/PromoBanner';
import QuickAccessGrid from './components/QuickAccessGrid';
import SearchBar from './components/SearchBar';
import CategoryFilters from './components/CategoryFilters';
import HotGamesSection from './components/HotGamesSection';
import BottomNav from './components/BottomNav';
import AuthModal from './components/AuthModal';
import Sidebar from './components/Sidebar';
import OffersPage from './components/OffersPage';
import OfferDetailsPage from './components/OfferDetailsPage';
import GameCollectionRow from './components/GameCollectionRow';
import GameListPage from './components/GameListPage';
import JackpotPage from './components/JackpotPage';
import GameView from './components/GameView';
import ProfilePage from './components/ProfilePage';
import VipCenterPage from './components/VipCenterPage';
import VipWelcomePage from './components/VipWelcomePage';
import BettingHistoryPage from './components/BettingHistoryPage';
import TransactionHistoryPage from './components/TransactionHistoryPage';
import DepositModal from './components/DepositModal';
import WithdrawalModal from './components/WithdrawalModal';
import SettingsPage from './components/SettingsPage';
import SearchPage from './components/SearchPage';
import WithdrawalMethodsPage from './components/WithdrawalMethodsPage';
import AddBankCardModal from './components/AddBankCardModal';
import AddCryptoAddressModal from './components/AddCryptoAddressModal';
import RegionModal from './components/RegionModal';
import RoomSelectionDrawer from './components/RoomSelectionDrawer';
import MissionPage from './components/MissionPage';
import BonusCenterPage from './components/BonusCenterPage';
import HistoricalActivitiesPage from './components/HistoricalActivitiesPage';
import KolOverviewPage from './components/KolOverviewPage';
import ChannelManagementPage from './components/ChannelManagementPage';
import FriendListPage from './components/FriendListPage';
import CommissionListPage from './components/CommissionListPage';
import AgentAllPage from './components/AgentAllPage';
import InboxDrawer from './components/InboxDrawer';
import WalletDetailDrawer from './components/WalletDetailDrawer';
import WelcomeSelectionDrawer from './components/WelcomeSelectionDrawer';
import DistributorOverviewPage from './components/DistributorOverviewPage';
import { GlobalConfigModal, PageConfigModal } from './components/config/ConfigModals';

import { AuthModalView, PageView, Game, User, PromotionalBanner, HomeCategory, MissionAction, HomeOffer, WalletType } from './types';
import { 
  HOME_PAGE_GAME_COLLECTIONS, 
  HOT_GAMES, 
  ALL_GAMES_FOR_LIST_PAGE,
  PROMOTIONAL_BANNERS,
  GAME_BRANDS,
  WEEKLY_FEATURED_GAME,
  HOME_OFFERS,
  JACKPOT_BANNER_GAMES,
  MOCK_HISTORICAL_ACTIVITIES
} from './constants';
import { PAGE_DOCS, SYSTEM_DOCS, DEFAULT_DOC, SystemModule } from './documentation';
import AppDownloadBanner from './components/AppDownloadBanner';
import GameBrandsList from './components/GameBrandsList';
import WeeklyGameBanner from './components/WeeklyGameBanner';
import OffersSection from './components/OffersSection';
import JackpotBanner from './components/JackpotBanner';
import { 
    FireIcon, PhoneHorizontalIcon, PhoneVerticalIcon, StarIcon, InformationCircleIcon, 
    CogIcon, ListBulletIcon, CubeTransparentIcon, ArrowLeftIcon, ServerStackIcon,
    UserCircleIcon, ShieldCheckIcon, GlobeAltIcon, PencilSquareIcon, CheckIcon, RocketLaunchIcon,
    DocumentTextIcon, SparklesIcon, CircleStackIcon, PlayCircleIcon, BanknotesIcon, HeadsetMicIcon,
    CubeIcon, CpuChipIcon, ArrowsRightLeftIcon, CloseIcon, EyeIcon
} from './components/icons/GenericIcons';

const NewbieGuide: React.FC = () => {
    return (
        <div className="my-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-inner">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-3 flex items-center">
                <div className="w-1 h-3 bg-blue-500 mr-2 rounded-full"></div>
                新手快速引导
            </h3>
            <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center text-center space-y-1.5">
                    <div className="p-2.5 bg-blue-500/10 rounded-xl border border-blue-500/20">
                        <PlayCircleIcon className="w-5 h-5 text-blue-400" />
                    </div>
                    <p className="text-[10px] font-black text-white leading-tight">快速开始</p>
                    <p className="text-[8px] text-slate-500 font-bold leading-tight">点击大厅游戏<br/>即刻探索</p>
                </div>
                <div className="flex flex-col items-center text-center space-y-1.5">
                    <div className="p-2.5 bg-green-500/10 rounded-xl border border-green-500/20">
                        <BanknotesIcon className="w-5 h-5 text-green-400" />
                    </div>
                    <p className="text-[10px] font-black text-white leading-tight">余额保障</p>
                    <p className="text-[8px] text-slate-500 font-bold leading-tight">卢布结算<br/>隐藏金额隐私</p>
                </div>
                <div className="flex flex-col items-center text-center space-y-1.5">
                    <div className="p-2.5 bg-purple-500/10 rounded-xl border border-purple-500/20">
                        <HeadsetMicIcon className="w-5 h-5 text-purple-400" />
                    </div>
                    <p className="text-[10px] font-black text-white leading-tight">全天候支持</p>
                    <p className="text-[8px] text-slate-500 font-bold leading-tight">24/7 客服<br/>随时获取帮助</p>
                </div>
            </div>
        </div>
    );
};

// --- 分类游戏网格组件 ---
const GameGrid: React.FC<{ 
    games: Game[]; 
    onGameClick: (game: Game) => void;
    favoriteGames: Set<string>;
    onToggleFavorite: (id: string) => void;
}> = ({ games, onGameClick, favoriteGames, onToggleFavorite }) => (
    <div className="grid grid-cols-2 gap-3 pb-8 animate-fade-in">
        {games.map(game => (
            <div 
                key={game.id} 
                className="relative rounded-2xl overflow-hidden bg-slate-800 shadow-lg active:scale-95 transition-transform"
                onClick={() => onGameClick(game)}
            >
                <img src={game.imageSrc} alt={game.title} className="w-full h-44 object-cover" />
                <button 
                    onClick={(e) => { e.stopPropagation(); onToggleFavorite(game.id); }}
                    className="absolute top-2 right-2 p-1.5 bg-black/40 backdrop-blur-md rounded-full"
                >
                    <StarIcon className={`w-3.5 h-3.5 ${favoriteGames.has(game.id) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`} />
                </button>
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 to-transparent">
                    <h4 className="text-white text-xs font-bold truncate leading-tight">{game.title}</h4>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">{game.provider}</p>
                </div>
            </div>
        ))}
    </div>
);

const App: React.FC = () => {
  // --- SIMULATION STATE ---
  const [globalConfig, setGlobalConfig] = useState({
      isLoggedIn: true,
      user: {
          nickname: 'BCDGamer',
          avatarUrl: 'https://i.pravatar.cc/150?u=bcdgamer',
          currency: 'RUB',
          balance: 12345.67,
          lockedBalance: 500.00,
          bonusBalance: 2450.50,
          points: 8880,
          allAgentWithdrawable: 4500.00,
          allAgentLocked: 1200.00,
          kolCommission: 15800.00,
          vipLevel: 3,
          isPaidUser: true,
          roles: ['normal', 'kol'] 
      } as User
  });

  const [activePage, setActivePage] = useState<PageView>('home');
  const [activeWallet, setActiveWallet] = useState<WalletType>('cash');
  const [previousPage, setPreviousPage] = useState<PageView>('home');
  const [selectedCategoryForList, setSelectedCategoryForList] = useState<string | null>(null);

  // --- APP STATE ---
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<AuthModalView>('login');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isGameViewOpen, setIsGameViewOpen] = useState(false);
  const [currentGameForView, setCurrentGameForView] = useState<Game | null>(null);
  const [isRoomDrawerOpen, setIsRoomDrawerOpen] = useState(false);
  const [selectedGameForRoom, setSelectedGameForRoom] = useState<Game | null>(null);
  const [selectedRoomType, setSelectedRoomType] = useState<'high' | 'low' | 'bonus'>('low');
  const [selectedOffer, setSelectedOffer] = useState<PromotionalBanner | null>(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isWalletDrawerOpen, setIsWalletDrawerOpen] = useState(false);
  const [isWelcomeDrawerOpen, setIsWelcomeDrawerOpen] = useState(false);
  const [initialSearchBrandId, setInitialSearchBrandId] = useState<string | null>(null);
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);
  const [regionModalDefaultTab, setRegionModalDefaultTab] = useState<'language' | 'currency'>('language');
  const [languageCode, setLanguageCode] = useState('ru');
  const [activeHomeFilter, setActiveHomeFilter] = useState<string>('lobby');
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
  const [withdrawalMode, setWithdrawalMode] = useState<'balance' | 'commission'>('balance');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isInboxDrawerOpen, setIsInboxDrawerOpen] = useState(false);
  const [isAddBankCardModalOpen, setIsAddBankCardModalOpen] = useState(false);
  const [isAddCryptoModalOpen, setIsAddCryptoModalOpen] = useState(false);

  // Dev Tool State
  const [isGlobalConfigOpen, setIsGlobalConfigOpen] = useState(false);

  // Check for first-time visit
  useEffect(() => {
      const hasSelectedRegion = localStorage.getItem('has_selected_region');
      if (!hasSelectedRegion) {
          setIsWelcomeDrawerOpen(true);
      }
  }, []);

  const handleWelcomeConfirm = (countryId: string, langCode: string, currencyCode: string) => {
      setLanguageCode(langCode);
      setGlobalConfig(prev => ({
          ...prev,
          user: { ...prev.user, currency: currencyCode }
      }));
      localStorage.setItem('has_selected_region', 'true');
      setIsWelcomeDrawerOpen(false);
  };

  const isLoggedIn = globalConfig.isLoggedIn;
  const currentUser = isLoggedIn ? globalConfig.user : null;
  
  const [favoriteGames, setFavoriteGames] = useState<Set<string>>(new Set());

  const handleToggleFavorite = (gameId: string) => {
    setFavoriteGames(prev => {
        const newFavorites = new Set(prev);
        if (newFavorites.has(gameId)) newFavorites.delete(gameId);
        else newFavorites.add(gameId);
        return newFavorites;
    });
  };

  const handleNavigate = (page: PageView, categoryKey?: string) => { 
    if (page !== activePage) { setPreviousPage(activePage); } 
    if (categoryKey) setSelectedCategoryForList(categoryKey);
    setActivePage(page); 
    setIsSidebarOpen(false); 
    setIsSearchModalOpen(false);
  };

  const handleOpenSearch = (brandId?: string) => { 
    setInitialSearchBrandId(brandId || null);
    setIsSearchModalOpen(true); 
  };
  
  const handleOpenDepositModal = () => setIsDepositModalOpen(true);
  const handleOpenWithdrawalModal = (mode: 'balance' | 'commission' = 'balance') => {
      setWithdrawalMode(mode);
      setIsWithdrawalModalOpen(true);
  };

  const showToast = (message: string) => {
      setToastMessage(message);
      setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredGamesForHome = useMemo(() => {
    if (activeHomeFilter === 'lobby') return [];
    let base = ALL_GAMES_FOR_LIST_PAGE;
    if (activeHomeFilter === 'hot') return HOT_GAMES;
    return base.filter(g => g.category === activeHomeFilter);
  }, [activeHomeFilter]);

  // --- PRD VIEWER COMPONENT ---
  const PrdViewer = () => {
    const doc = PAGE_DOCS[activePage] || DEFAULT_DOC;
    const [inspectedModule, setInspectedModule] = useState<SystemModule | null>(null);
    
    return (
      <div className="flex-1 bg-slate-50 flex flex-col overflow-hidden relative">
        {/* Module Inspector Sidebar (Overlay) */}
        {inspectedModule && (
            <div className="absolute inset-0 z-50 flex justify-end animate-fade-in">
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setInspectedModule(null)}></div>
                <div className="relative w-full max-w-lg bg-white shadow-2xl flex flex-col h-full animate-slide-left border-l border-slate-200">
                    <header className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                         <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-200">
                                <CpuChipIcon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-800 tracking-tight">{inspectedModule.name}</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Backend Logic Deep-dive</p>
                            </div>
                         </div>
                         <button onClick={() => setInspectedModule(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
                            <CloseIcon className="w-6 h-6" />
                         </button>
                    </header>
                    <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
                        <section>
                            <h4 className="text-[11px] font-black text-purple-600 uppercase tracking-widest mb-4 flex items-center">
                                <div className="w-4 h-0.5 bg-purple-500 mr-2"></div>
                                核心业务逻辑 (Business Logic)
                            </h4>
                            <div className="bg-slate-900 rounded-3xl p-6 font-mono text-[13px] text-slate-300 border border-slate-800 shadow-inner">
                                {inspectedModule.logic}
                            </div>
                        </section>

                        <section>
                            <h4 className="text-[11px] font-black text-emerald-600 uppercase tracking-widest mb-4 flex items-center">
                                <div className="w-4 h-0.5 bg-emerald-500 mr-2"></div>
                                后端校验点 (QA Checkpoints)
                            </h4>
                            <div className="space-y-3">
                                {inspectedModule.checkpoints.map((cp, i) => (
                                    <div key={i} className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-2xl flex items-start space-x-3 group hover:bg-emerald-50 transition-colors">
                                        <div className="mt-1 flex-shrink-0"><CheckIcon className="w-4 h-4 text-emerald-500" /></div>
                                        <span className="text-[13px] font-bold text-slate-700">{cp}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                        
                        <div className="pt-4 p-6 bg-blue-50 rounded-3xl border border-blue-100 text-blue-700 text-xs font-medium leading-relaxed italic">
                            提示：以上逻辑为该模块的“黑盒”实现参考。在进行页面功能测试时，请结合数据库查询或开发者工具中的网络请求负载 (Payload) 进行核对。
                        </div>
                    </div>
                </div>
            </div>
        )}

        <div className="bg-white border-b border-slate-200 px-8 py-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-200">
              <DocumentTextIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">{doc.title}</h2>
              <div className="flex items-center mt-1 space-x-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Interaction Specification</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Logic Mapping Enabled</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
                {doc.relatedSystems.map(sysId => (
                <span key={sysId} className="px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-[10px] font-black text-blue-600 uppercase tracking-wider">
                    {SYSTEM_DOCS[sysId]?.title.split(' ')[0]}
                </span>
                ))}
            </div>
            <button 
                onClick={() => setIsGlobalConfigOpen(true)}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 transition-all active:scale-95 group border border-slate-200"
                title="开发者全局配置"
            >
                <CogIcon className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10 no-scrollbar bg-slate-50/50">
          {/* 1. 业务逻辑概览 */}
          <section className="animate-fade-in">
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center">
               <div className="w-4 h-0.5 bg-blue-500 mr-2"></div>
               页面逻辑说明 (Page Logic)
             </h3>
             <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <p className="text-slate-600 leading-relaxed text-lg font-medium">
                  {doc.overview}
                </p>
             </div>
          </section>

          {/* 2. 核心功能测试点 & 跨模块逻辑 */}
          <div className="grid grid-cols-2 gap-8">
            <section className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center">
                 <div className="w-4 h-0.5 bg-emerald-500 mr-2"></div>
                 测试关注点 (QA Checkpoints)
               </h3>
               <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
                  {doc.features.map((feature, i) => (
                    <div key={i} className="flex items-start space-x-3 p-3 hover:bg-slate-50 rounded-2xl transition-colors group">
                      <div className="mt-0.5 w-5 h-5 rounded-lg border-2 border-slate-100 flex items-center justify-center group-hover:border-emerald-400 transition-colors bg-slate-50">
                        <CheckIcon className="w-3 h-3 text-emerald-500" />
                      </div>
                      <span className="text-[13px] font-bold text-slate-700 leading-relaxed">{feature}</span>
                    </div>
                  ))}
               </div>
            </section>

            <section className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center">
                 <div className="w-4 h-0.5 bg-purple-500 mr-2"></div>
                 依赖系统逻辑 (Module Dependencies)
               </h3>
               <div className="space-y-4">
                  {doc.relatedSystems.map(sysId => {
                    const sys = SYSTEM_DOCS[sysId];
                    if (!sys) return null;
                    return (
                      <div key={sysId} className="bg-slate-900 rounded-3xl p-5 shadow-xl border border-slate-800 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                           <CubeIcon className="w-12 h-12 text-white" />
                        </div>
                        <div className="flex items-center space-x-2 mb-3">
                           <CpuChipIcon className="w-4 h-4 text-purple-400" />
                           <span className="text-white font-black uppercase tracking-widest">{sys.title}</span>
                        </div>
                        <p className="text-[11px] text-gray-400 leading-relaxed mb-4">{sys.description}</p>
                        <div className="flex flex-wrap gap-2">
                           {sys.modules.map((mod, mi) => (
                             <button 
                                key={mi} 
                                onClick={() => setInspectedModule(mod)}
                                className="group flex items-center space-x-1.5 text-[9px] font-black bg-white/5 border border-white/10 text-purple-300 px-3 py-1.5 rounded-lg hover:bg-purple-600 hover:text-white hover:border-purple-500 transition-all active:scale-95 shadow-sm"
                             >
                               <EyeIcon className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                               <span className="uppercase tracking-tighter">{mod.name}</span>
                             </button>
                           ))}
                        </div>
                      </div>
                    );
                  })}
               </div>
            </section>
          </div>

          {/* 3. 关键交互路径 (User Flows) */}
          <section className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center">
               <div className="w-4 h-0.5 bg-orange-500 mr-2"></div>
               关键测试路径 (Functional Flows)
             </h3>
             <div className="space-y-6">
                {doc.keyFlows.map((flow, i) => (
                  <div key={i} className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm relative">
                    <div className="flex items-center justify-between mb-8">
                       <h4 className="text-lg font-black text-slate-800 flex items-center italic uppercase tracking-tighter">
                          <RocketLaunchIcon className="w-5 h-5 mr-2 text-orange-500" />
                          {flow.name}
                       </h4>
                       <span className="text-[10px] font-black bg-slate-100 text-slate-400 px-3 py-1 rounded-full uppercase tracking-widest">End-to-End Test</span>
                    </div>
                    <div className="flex items-center overflow-x-auto no-scrollbar pb-4">
                      {flow.steps.map((step, si) => (
                        <React.Fragment key={si}>
                          <div className="flex flex-col items-center flex-shrink-0 w-32 text-center group">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 shadow-sm flex items-center justify-center text-blue-600 font-black text-sm mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all">
                              {si + 1}
                            </div>
                            <p className="text-[11px] font-black text-slate-500 leading-snug uppercase tracking-tight group-hover:text-slate-800 transition-colors">
                              {step}
                            </p>
                          </div>
                          {si < flow.steps.length - 1 && (
                            <div className="flex-none px-4 pt-1">
                               <ArrowsRightLeftIcon className="w-4 h-4 text-slate-200" />
                            </div>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
             </div>
          </section>

          {/* 4. 后端配置参考 */}
          <section className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center">
               <div className="w-4 h-0.5 bg-gray-400 mr-2"></div>
               后端及状态机约束 (Server-Side Schema)
             </h3>
             <div className="bg-slate-900 rounded-[2rem] p-8 shadow-2xl font-mono text-[13px] border border-slate-800">
                <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                  {doc.backendConfig.map((config, i) => (
                    <div key={i} className="flex flex-col space-y-2 border-l border-white/10 pl-6 py-1">
                      <span className="text-pink-400 font-black text-[11px] uppercase tracking-widest"># {config.label}</span>
                      <span className="text-emerald-400 leading-relaxed font-medium">{config.value}</span>
                    </div>
                  ))}
                </div>
             </div>
          </section>
        </div>
        
        <div className="bg-white border-t border-slate-200 px-8 py-4 flex items-center justify-between flex-shrink-0">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Document mapped to current system state: {globalConfig.isLoggedIn ? 'Authenticated' : 'Guest'} Mode
          </p>
          <div className="flex items-center space-x-2">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
             <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Realtime Sync Active</span>
          </div>
        </div>

        <style>{`
            @keyframes slideLeft {
                from { transform: translateX(100%); }
                to { transform: translateX(0); }
            }
            .animate-slide-left { animation: slideLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        `}</style>
      </div>
    );
  };

  const handleGameClick = (game: Game) => {
    setSelectedGameForRoom(game);
    setIsRoomDrawerOpen(true);
  };

  const handleRoomSelect = (type: 'high' | 'low' | 'bonus') => {
    setSelectedRoomType(type);
    setIsRoomDrawerOpen(false);
    setCurrentGameForView(selectedGameForRoom);
    setIsGameViewOpen(true);
  };

  // --- RENDER ---
  return (
    <div className="flex h-screen w-screen bg-slate-900 overflow-hidden font-sans">
        {/* Left: Mobile Simulator */}
        <div className="flex-none w-[420px] flex items-center justify-center bg-[#111827] border-r border-slate-800 relative">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
            <div className="relative flex flex-col items-center">
                <div className="w-[375px] h-[812px] bg-slate-900 rounded-[3rem] ring-8 ring-slate-800 shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden relative transform-gpu">
                    <div 
                        id="phone-scroll-container"
                        className="absolute inset-0 bg-slate-950 flex flex-col text-gray-200 overflow-y-auto no-scrollbar"
                    >
                        <div className="sticky top-0 z-[60]">
                            {activePage === 'home' && (
                                <Header 
                                    openAuthModal={() => { setAuthModalView('login'); setIsAuthModalOpen(true); }} 
                                    isLoggedIn={isLoggedIn} 
                                    currentUser={currentUser} 
                                    activeWallet={activeWallet}
                                    onBalanceClick={() => setIsWalletDrawerOpen(true)}
                                    onDepositClick={handleOpenDepositModal} 
                                    onMessagesClick={() => setIsInboxDrawerOpen(true)}
                                />
                            )}
                            
                            {/* NEW: Global Toast Notification System */}
                            {toastMessage && (
                                <div className="absolute top-4 left-4 right-4 z-[300] animate-toast-slide-down">
                                    <div className="bg-blue-600/90 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-2xl border border-white/20 flex items-center space-x-3">
                                        <div className="p-1.5 bg-white/20 rounded-lg">
                                            <CheckIcon className="w-4 h-4 text-white" />
                                        </div>
                                        <p className="text-xs font-black tracking-tight">{toastMessage}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <main className="flex-1 overflow-y-auto no-scrollbar pb-20">
                            {/* Page Router */}
                            {activePage === 'home' && (
                                <div className="px-4">
                                    <PromoBanner onClick={() => handleNavigate('offers')} />
                                    
                                    {/* 搜索与分类（常驻） */}
                                    <SearchBar onClick={() => handleOpenSearch()} />
                                    <CategoryFilters 
                                        onFilterClick={(id) => setActiveHomeFilter(id)} 
                                        activeFilter={activeHomeFilter} 
                                    />

                                    {/* 条件渲染视图 */}
                                    {activeHomeFilter === 'lobby' ? (
                                        <div className="animate-fade-in">
                                            <NewbieGuide />
                                            <QuickAccessGrid onNavigate={handleNavigate} />
                                            {HOME_PAGE_GAME_COLLECTIONS.map(collection => (
                                                <GameCollectionRow 
                                                    key={collection.id} 
                                                    collection={collection} 
                                                    onViewAll={() => setActiveHomeFilter(collection.categoryKey)}
                                                    onViewProviderCollection={() => setActiveHomeFilter(collection.categoryKey)}
                                                />
                                            ))}
                                            <HotGamesSection 
                                                games={HOT_GAMES} 
                                                onGameClick={handleGameClick} 
                                                title="热门推荐" 
                                                favoriteGames={favoriteGames} 
                                                onToggleFavorite={handleToggleFavorite} 
                                                onViewAll={() => setActiveHomeFilter('hot')} 
                                            />
                                            <GameBrandsList brands={GAME_BRANDS} onBrandClick={(id) => handleNavigate('gameList', id)} />
                                            <WeeklyGameBanner data={WEEKLY_FEATURED_GAME} onPlay={handleGameClick} />
                                            <OffersSection offers={HOME_OFFERS} onOfferClick={(action) => handleNavigate(action.page as PageView, action.offerId)} onViewAll={() => handleNavigate('offers')} />
                                            <JackpotBanner games={JACKPOT_BANNER_GAMES} onGameClick={handleGameClick} onViewAll={() => handleNavigate('jackpot')} />
                                        </div>
                                    ) : (
                                        <div className="mt-4 animate-fade-in">
                                            <div className="flex items-center justify-between mb-4 px-1">
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-1 h-5 bg-blue-500 rounded-full"></div>
                                                    <h2 className="text-lg font-black text-white italic uppercase tracking-tighter">
                                                        {activeHomeFilter === 'hot' ? '热门推荐' : 
                                                         activeHomeFilter === 'slot' ? '老虎机游戏' : 
                                                         activeHomeFilter === 'live' ? '真人视讯' : '精选游戏'}
                                                    </h2>
                                                </div>
                                                <button onClick={() => setActiveHomeFilter('lobby')} className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">
                                                    返回大厅
                                                </button>
                                            </div>
                                            <GameGrid 
                                                games={filteredGamesForHome} 
                                                onGameClick={handleGameClick} 
                                                favoriteGames={favoriteGames}
                                                onToggleFavorite={handleToggleFavorite}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            {activePage === 'offers' && <OffersPage setActivePage={handleNavigate} onOfferClick={(banner) => { setSelectedOffer(banner); handleNavigate('offerDetails'); }} />}
                            {activePage === 'offerDetails' && selectedOffer && <OfferDetailsPage offer={selectedOffer} onBack={() => handleNavigate('offers')} />}
                            {activePage === 'jackpot' && <JackpotPage setActivePage={handleNavigate} />}
                            {activePage === 'profile' && (
                                <ProfilePage 
                                    setActivePage={handleNavigate} 
                                    onLogout={() => setGlobalConfig({...globalConfig, isLoggedIn: false})} 
                                    onGameClick={handleGameClick}
                                    onOpenDepositModal={handleOpenDepositModal}
                                    onWithdrawClick={() => handleOpenWithdrawalModal('balance')}
                                    favoriteGames={favoriteGames}
                                    onToggleFavorite={handleToggleFavorite}
                                    onNavigateToBonusCenter={() => handleNavigate('myBonuses')}
                                />
                            )}
                            {activePage === 'vipCenter' && <VipCenterPage setActivePage={handleNavigate} />}
                            {activePage === 'gameList' && (
                                <GameListPage 
                                    categoryKey={selectedCategoryForList || 'all'} 
                                    onBack={() => handleNavigate('home')} 
                                    onGameClick={handleGameClick}
                                    onSearchClick={handleOpenSearch}
                                    favoriteGames={favoriteGames}
                                    onToggleFavorite={handleToggleFavorite}
                                />
                            )}
                            {activePage === 'betHistory' && <BettingHistoryPage setActivePage={handleNavigate} />}
                            {activePage === 'txHistory' && <TransactionHistoryPage setActivePage={handleNavigate} />}
                            {activePage === 'settings' && <SettingsPage onBack={() => handleNavigate('profile')} setActivePage={handleNavigate} />}
                            {activePage === 'withdrawalMethods' && <WithdrawalMethodsPage setActivePage={handleNavigate} onBack={() => handleNavigate('settings')} onAddBankCard={() => setIsAddBankCardModalOpen(true)} onAddCryptoAddress={() => setIsAddCryptoModalOpen(true)} />}
                            {activePage === 'mission' && <MissionPage setActivePage={handleNavigate} onAction={(action) => handleNavigate(action.page as PageView)} />}
                            {activePage === 'myBonuses' && <BonusCenterPage setActivePage={handleNavigate} setActiveHomeFilter={setActiveHomeFilter} />}
                            {activePage === 'history' && <HistoricalActivitiesPage activities={MOCK_HISTORICAL_ACTIVITIES} setActivePage={handleNavigate} />}
                            {activePage === 'distributorOverview' && (
                                <DistributorOverviewPage 
                                    setActivePage={handleNavigate} 
                                    user={currentUser} 
                                    onApplySuccess={() => {
                                        setGlobalConfig(prev => ({
                                            ...prev,
                                            user: {
                                                ...prev.user,
                                                roles: Array.from(new Set([...prev.user.roles, 'distributor' as any]))
                                            }
                                        }))
                                    }}
                                />
                            )}
                            
                            {/* Agent System */}
                            {activePage === 'kolOverview' && <KolOverviewPage setActivePage={handleNavigate} onOpenWithdrawal={() => handleOpenWithdrawalModal('commission')} />}
                            {activePage === 'channelManagement' && <ChannelManagementPage setActivePage={handleNavigate} />}
                            {activePage === 'friendList' && <FriendListPage setActivePage={handleNavigate} />}
                            {activePage === 'commissionList' && <CommissionListPage setActivePage={handleNavigate} />}
                            {activePage === 'agentAll' && <AgentAllPage setActivePage={handleNavigate} onOpenWithdrawal={() => handleOpenWithdrawalModal('commission')} />}
                        </main>

                        <BottomNav activePage={activePage} setActivePage={handleNavigate} isSidebarOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
                        
                        {/* Overlay components rendered inside mobile view context */}
                        {isSidebarOpen && (
                            <Sidebar 
                                isOpen={isSidebarOpen} 
                                onClose={() => setIsSidebarOpen(false)} 
                                isLoggedIn={isLoggedIn} 
                                currentUser={currentUser} 
                                handleNavigate={handleNavigate} 
                                openAuthModal={(view) => { setAuthModalView(view); setIsAuthModalOpen(true); }}
                                onRegionClick={(tab) => { setRegionModalDefaultTab(tab); setIsRegionModalOpen(true); }}
                                languageCode={languageCode}
                            />
                        )}
                        {isSearchModalOpen && (
                            <SearchPage 
                                onClose={() => setIsSearchModalOpen(false)} 
                                onGameClick={handleGameClick} 
                                favoriteGames={favoriteGames} 
                                onToggleFavorite={handleToggleFavorite}
                                initialBrandId={initialSearchBrandId}
                            />
                        )}
                        {isWalletDrawerOpen && currentUser && (
                            <WalletDetailDrawer 
                                isOpen={isWalletDrawerOpen} 
                                onClose={() => setIsWalletDrawerOpen(false)} 
                                user={currentUser}
                                activeWallet={activeWallet}
                                onSelectWallet={(type) => { setActiveWallet(type); setIsWalletDrawerOpen(false); }}
                            />
                        )}
                        {isWelcomeDrawerOpen && (
                            <WelcomeSelectionDrawer 
                                isOpen={isWelcomeDrawerOpen} 
                                onConfirm={handleWelcomeConfirm} 
                            />
                        )}
                    </div>
                </div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-black rounded-b-xl z-50 pointer-events-none"></div>
            </div>
        </div>

        {/* Right: Real-time PRD Dashboard */}
        <div className="flex-1 flex flex-col bg-white">
            <PrdViewer />
        </div>

        {/* Global Overlays */}
        {isAuthModalOpen && <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} initialView={authModalView} onLoginSuccess={() => { setGlobalConfig({...globalConfig, isLoggedIn: true}); setIsAuthModalOpen(false); }} />}
        <DepositModal isOpen={isDepositModalOpen} onClose={() => setIsDepositModalOpen(false)} />
        <WithdrawalModal 
            isOpen={isWithdrawalModalOpen} 
            onClose={() => setIsWithdrawalModalOpen(false)} 
            setActivePage={handleNavigate} 
            onAddBankCard={() => setIsAddBankCardModalOpen(true)} 
            onAddCryptoAddress={() => setIsAddCryptoModalOpen(true)}
            mode={withdrawalMode}
            onSuccessToast={showToast}
        />
        {isRoomDrawerOpen && <RoomSelectionDrawer isOpen={isRoomDrawerOpen} onClose={() => setIsRoomDrawerOpen(false)} game={selectedGameForRoom} onSelectRoom={handleRoomSelect} />}
        {isGameViewOpen && currentGameForView && <GameView game={currentGameForView} onClose={() => setIsGameViewOpen(false)} roomType={selectedRoomType} />}
        <InboxDrawer isOpen={isInboxDrawerOpen} onClose={() => setIsInboxDrawerOpen(false)} />
        <RegionModal isOpen={isRegionModalOpen} onClose={() => setIsRegionModalOpen(false)} defaultTab={regionModalDefaultTab} currentLanguage={languageCode} onLanguageChange={setLanguageCode} currentCurrency={currentUser?.currency || 'RUB'} onCurrencyChange={(c) => setGlobalConfig({...globalConfig, user: {...globalConfig.user, currency: c}})} />
        <AddBankCardModal isOpen={isAddBankCardModalOpen} onClose={() => setIsAddBankCardModalOpen(false)} />
        <AddCryptoAddressModal isOpen={isAddCryptoModalOpen} onClose={() => setIsAddCryptoModalOpen(false)} />

        {/* Developer Config Modal */}
        {isGlobalConfigOpen && (
            <GlobalConfigModal 
                isOpen={isGlobalConfigOpen} 
                onClose={() => setIsGlobalConfigOpen(false)} 
                config={globalConfig}
                onUpdate={setGlobalConfig}
            />
        )}

        <style>{`
            @keyframes toastSlideDown {
                from { transform: translateY(-20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            .animate-toast-slide-down {
                animation: toastSlideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
        `}</style>
    </div>
  );
};

export default App;
