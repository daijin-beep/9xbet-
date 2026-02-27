import React, { useState } from 'react';
import {
    CoinIcon, ChevronDownIcon, LanguageIcon, ChevronRightIcon, PuzzlePieceIcon, FilmIcon,
    TrophyIcon, UsersIcon, QuestionMarkCircleIcon, ChatBubbleLeftRightIcon, DiceIcon as GenericDiceIcon, SparklesIcon, FireIcon, DevicePhoneMobileIcon, GiftIcon
} from './icons/GenericIcons';
import { CrownIcon } from './icons/QuickAccessIcons';
import { SlotMachineIcon as CategorySlotMachineIcon } from './icons/CategoryIcons';
import { FacebookIcon, WhatsappIcon } from './icons/SocialIcons';
import { SidebarNavItem, User, PageView, AuthModalView, SidebarPromoItem } from '../types';
import { SIDEBAR_NAV_ITEMS, SOCIAL_MEDIA_LINKS, SIDEBAR_PROMO_ITEMS, LANGUAGES, CURRENCIES } from '../constants';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    isLoggedIn: boolean;
    currentUser: User | null;
    handleNavigate: (page: PageView, categoryKey?: string) => void;
    openAuthModal: (view: AuthModalView) => void;
    onRegionClick: (defaultTab: 'language' | 'currency') => void;
    languageCode: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, isLoggedIn, currentUser, handleNavigate, openAuthModal, onRegionClick, languageCode }) => {
    const [isGamesMenuOpen, setIsGamesMenuOpen] = useState(true);
    
    const currentLanguageName = LANGUAGES.find(l => l.code === languageCode)?.name || 'English';
    const currentCurrency = CURRENCIES.find(c => c.code === (currentUser?.currency || 'PHP'));


    const handleNavItemClick = (item: SidebarNavItem) => {
        if (item.id === 'games') {
            setIsGamesMenuOpen(!isGamesMenuOpen);
            return;
        }
        if (item.navigateTo) {
            handleNavigate(item.navigateTo, item.categoryKey);
        } else if (item.action) {
            item.action();
        }
        onClose();
    };

    const LoggedInProfile = () => (
        <button onClick={() => handleNavigate('profile')} className="w-full text-left flex items-center p-4 bg-slate-700/50 rounded-lg hover:bg-slate-600/50 transition-colors">
            <img src={currentUser!.avatarUrl} alt="User Avatar" className="w-12 h-12 rounded-full object-cover border-2 border-slate-500 mr-3" />
            <div className="flex-1 min-w-0">
                <p className="text-white text-md font-semibold truncate">{currentUser!.nickname}</p>
                <div className="flex items-center text-xs text-yellow-400 mt-1">
                    <CoinIcon className="w-4 h-4 mr-1"/>
                    <span>{currentUser!.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    <span className="ml-1 text-gray-400">{currentUser!.currency}</span>
                </div>
            </div>
            <ChevronRightIcon className="w-5 h-5 text-gray-400" />
        </button>
    );

    const LoggedOutProfile = () => (
        <button onClick={() => {openAuthModal('login'); onClose();}} className="w-full text-left flex items-center p-4 bg-slate-700/50 rounded-lg hover:bg-slate-600/50 transition-colors">
            <img src="https://picsum.photos/seed/guest/100/100" alt="Guest Avatar" className="w-12 h-12 rounded-full object-cover border-2 border-slate-500 mr-3" />
            <div className="flex-1">
                <p className="text-white text-md font-semibold">Login / Register</p>
            </div>
            <ChevronRightIcon className="w-5 h-5 text-gray-400" />
        </button>
    );

    const SidebarPromoCard: React.FC<{ item: SidebarPromoItem; onClick: () => void; }> = ({ item, onClick }) => (
        <button 
            onClick={onClick} 
            className={`w-full p-2.5 rounded-lg flex items-center shadow-lg group transition-transform hover:scale-105 ${item.bgColorClass} ${item.textColorClass} min-h-[80px]`}
            aria-label={`Go to ${item.label}`}
        >
            <div className="flex-1 text-left min-w-0">
                <h4 className="font-bold text-sm truncate">{item.label}</h4>
                {item.description && <p className="text-[10px] opacity-80 truncate">{item.description}</p>}
            </div>
            {item.imageSrc && <img src={item.imageSrc} alt={item.label} className="w-10 h-10 object-cover rounded-md ml-2" />}
        </button>
    );

    return (
        <>
            {isOpen && <div onClick={onClose} className="fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ease-in-out" aria-hidden="true"></div>}
            <div
                className={`fixed top-0 left-0 h-full bg-[#0f172a] text-gray-200 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out z-50 w-[75vw] max-w-xs
                            ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
                role="dialog"
                aria-modal="true"
                aria-label="Main menu"
            >
                <div className="p-3">
                    {isLoggedIn && currentUser ? <LoggedInProfile /> : <LoggedOutProfile />}
                </div>

                <div className="flex-grow overflow-y-auto no-scrollbar px-3 space-y-2">
                    {/* Bonus Center */}
                    <button onClick={() => handleNavigate('offers')} className="w-full h-24 rounded-lg overflow-hidden relative group">
                        <img src="https://picsum.photos/seed/bonuscenter/400/200" alt="Bonus Center" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-2 left-3">
                            <h3 className="text-white text-lg font-bold">Bonus Center</h3>
                            <p className="text-yellow-300 text-xs">Claim Your Rewards</p>
                        </div>
                    </button>
                    
                    {/* New Promo Cards */}
                    <div className="grid grid-cols-2 gap-2 pt-2">
                        {SIDEBAR_PROMO_ITEMS.map(item => (
                            <SidebarPromoCard 
                                key={item.id} 
                                item={item} 
                                onClick={() => {
                                    handleNavigate(item.navigateTo);
                                    onClose();
                                }}
                            />
                        ))}
                    </div>


                    {/* Nav Items */}
                    <nav className="space-y-1 pt-2">
                        {SIDEBAR_NAV_ITEMS.map(item => (
                            <div key={item.id}>
                                <button onClick={() => handleNavItemClick(item)} className="w-full flex items-center p-3 rounded-md hover:bg-slate-700 transition-colors text-sm font-medium">
                                    <item.Icon className="w-5 h-5 mr-3 text-yellow-400" />
                                    <span className="flex-1 text-left">{item.label}</span>
                                    {item.subItems ? (
                                        <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${isGamesMenuOpen ? 'rotate-180' : ''}`} />
                                    ) : (
                                        <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                                    )}
                                </button>
                                {item.subItems && isGamesMenuOpen && (
                                    <div className="pl-6 mt-1 space-y-1">
                                        {item.subItems.map(subItem => (
                                            <button key={subItem.id} onClick={() => handleNavItemClick(subItem)} className="w-full flex items-center p-2 rounded-md hover:bg-slate-700 transition-colors text-sm">
                                                <subItem.Icon className="w-5 h-5 mr-3 text-gray-400" />
                                                <span className="flex-1 text-left text-gray-300">{subItem.label}</span>
                                                <ChevronRightIcon className="w-4 h-4 text-gray-500" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* Footer */}
                    <div className="py-3 border-t border-slate-700/50">
                         <div className="flex items-center gap-3 mb-4">
                            <button onClick={() => onRegionClick('language')} className="flex-1 flex items-center justify-between bg-slate-800 px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors text-sm border border-slate-700">
                               <div className="flex items-center gap-2 truncate">
                                    <LanguageIcon className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                                    <span className="text-white font-medium truncate">{currentLanguageName}</span>
                                </div>
                                <ChevronRightIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                            </button>
                             <button onClick={() => onRegionClick('currency')} className="flex-1 flex items-center justify-between bg-slate-800 px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors text-sm border border-slate-700">
                                <div className="flex items-center gap-2 truncate">
                                    {currentCurrency?.flag && <span className="text-lg flex-shrink-0">{currentCurrency.flag}</span>}
                                    <span className="text-white font-medium truncate">{currentCurrency?.code || 'PHP'}</span>
                                </div>
                                <ChevronRightIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                            </button>
                        </div>

                         {/* App Download CTA */}
                         <button
                            onClick={() => console.log('App download clicked')} // Placeholder action
                            className="w-full text-left p-4 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-0.5 group"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1 pr-2">
                                    <h4 className="font-bold text-base">Aplikasi</h4>
                                    <p className="text-xs opacity-90 mt-1">Buka Kegembiraan dengan Fitur Eksklusif</p>
                                </div>
                                <DevicePhoneMobileIcon className="w-10 h-10 text-white/80 flex-shrink-0" />
                            </div>
                            <div className="mt-4 w-full bg-yellow-400 text-slate-900 font-bold py-2 rounded-lg text-sm text-center group-hover:bg-yellow-300 transition-colors">
                                立即下载
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;