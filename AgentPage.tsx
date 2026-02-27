

import React, { useState } from 'react';
import { PageView, KolAgentTab } from '../types';
import { 
    AGENT_REFERRAL_LINK,
    CURRENT_AGENT_DATA,
    AGENT_POSTER_TEMPLATE,
    KOL_AGENT_TABS,
    COMMISSION_EARNING_RULES,
    MOCK_PROMOTION_CHANNELS,
    KOL_LEVELS
} from '../constants';
import { 
    ArrowLeftIcon,
    ClipboardCopyIcon, 
    QrCodeIcon, 
    ArrowDownTrayIcon,
    ChevronDownIcon,
    CloseIcon,
    UserGroupIcon,
    PresentationChartLineIcon,
    ShareIcon,
    BanknotesIcon,
    LinkIcon,
    PlusIcon,
    UserPlusIcon,
    ChartPieIcon,
    InformationCircleIcon
} from './icons/GenericIcons';
import { CrownIcon } from './icons/QuickAccessIcons';
import ChannelManagementPage from './ChannelManagementPage';
import FriendListPage from './FriendListPage';
import CommissionListPage from './CommissionListPage';

interface AgentPageProps {
  setActivePage: (page: PageView) => void;
}

// Modal for displaying and saving the generated poster
const GeneratedPosterModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  posterUrl: string;
  referralLink: string;
}> = ({ isOpen, onClose, posterUrl, referralLink }) => {
    if (!isOpen) return null;

    const handleSave = () => {
        const link = document.createElement('a');
        link.href = posterUrl;
        link.download = 'promotion-poster.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div 
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[100] animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div className="bg-slate-800 w-full max-w-sm p-4 rounded-lg shadow-xl relative" onClick={e => e.stopPropagation()}>
                <button 
                    onClick={onClose} 
                    className="absolute -top-3 -right-3 w-8 h-8 flex items-center justify-center bg-slate-600 hover:bg-slate-500 rounded-full text-white"
                    aria-label="Close poster view"
                >
                    <CloseIcon className="w-5 h-5" />
                </button>
                
                <h3 className="text-center font-bold text-white mb-3">Your Promotional Poster</h3>

                <div 
                    className="relative w-full aspect-[3/4] rounded-lg bg-cover bg-center flex flex-col items-center justify-center p-6 text-white overflow-hidden"
                    style={{ backgroundImage: `url(${posterUrl})`}}
                >
                    <div className="absolute inset-0 bg-black/40 rounded-lg"></div>
                    <div className="relative z-10 text-center flex flex-col items-center">
                        <p className="font-bold text-xl mb-4 drop-shadow-md">Scan to Register!</p>
                        <div className="bg-white p-2 rounded-md shadow-lg">
                            <QrCodeIcon className="w-32 h-32 text-slate-900" />
                        </div>
                        <p className="mt-4 text-xs bg-black/50 px-2 py-1 rounded">{referralLink}</p>
                    </div>
                </div>

                <button 
                    onClick={handleSave} 
                    className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-md flex items-center justify-center space-x-2"
                >
                    <ArrowDownTrayIcon className="w-5 h-5" />
                    <span>Save to Album</span>
                </button>
            </div>
        </div>
    );
};


const KolAgentOverview: React.FC = () => {
    const [isPosterModalOpen, setIsPosterModalOpen] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const [selectedChannel, setSelectedChannel] = useState('all');

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        });
    };
    
    const AccountInfo: React.FC = () => {
        const { nickname, avatarUrl, level, nextLevelProgress } = CURRENT_AGENT_DATA;
        
        const currentLevelInfo = KOL_LEVELS.find(l => l.level === level);
        const nextLevelInfo = KOL_LEVELS.find(l => l.level === nextLevelProgress.nextLevel);
        const ratioIncrease = nextLevelInfo && currentLevelInfo ? nextLevelInfo.ratio - currentLevelInfo.ratio : 0;
    
        const progressPercent = (nextLevelProgress.current / nextLevelProgress.target) * 100;
        
        return (
            <section className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                <div className="flex items-center mb-4">
                    <img src={avatarUrl} alt="Agent Avatar" className="w-16 h-16 rounded-full object-cover border-2 border-slate-600 mr-4" />
                    <div className="flex-1">
                        <p className="font-semibold text-white text-xl">{nickname}</p>
                        
                        <div className="relative group w-fit mt-1.5">
                            <div tabIndex={0} className="flex items-center text-sm font-semibold bg-slate-700 px-2.5 py-1 rounded-full space-x-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <CrownIcon className="w-4 h-4 text-yellow-300" />
                                <span className="text-yellow-300">{level} KOL</span>
                                <span className="text-gray-400">|</span>
                                <span className="text-white">{currentLevelInfo?.ratio}% Ratio</span>
                            </div>
                            
                            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-60 bg-slate-900 border border-slate-600 rounded-lg p-3 text-sm text-white opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus:opacity-100 group-focus:visible transition-opacity pointer-events-none group-hover:pointer-events-auto z-10">
                                <h4 className="font-bold mb-2 text-center text-base">KOL Level Ratios</h4>
                                <ul className="space-y-1">
                                    {KOL_LEVELS.map(levelInfo => (
                                        <li key={levelInfo.level} className={`flex justify-between p-1.5 rounded ${levelInfo.level === level ? 'bg-blue-600/50' : ''}`}>
                                            <span>{levelInfo.level}</span>
                                            <span className="font-semibold">{levelInfo.ratio}%</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-slate-600"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Next Level: {nextLevelProgress.nextLevel} {ratioIncrease > 0 && <span className="text-green-400">(+{ratioIncrease}% Ratio)</span>}</span>
                        <span>
                            <span className="text-white font-semibold">{nextLevelProgress.current.toLocaleString()}</span> / {nextLevelProgress.target.toLocaleString()}
                        </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2.5">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                </div>
            </section>
        );
    };
    
    const CommissionInfo: React.FC = () => {
        const { totalCommission, availableCommission, withdrawalConditions } = CURRENT_AGENT_DATA;
        
        return (
            <section className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                <div className="grid grid-cols-2 gap-4 text-center mb-4">
                    <div>
                        <p className="text-sm text-gray-400">Total Commission (RUB)</p>
                        <p className="text-2xl font-bold text-white">{totalCommission.toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Available (RUB)</p>
                        <p className="text-2xl font-bold text-green-400">{availableCommission.toLocaleString()}</p>
                    </div>
                </div>
                <div className="relative group">
                    <button
                        disabled={!withdrawalConditions.met}
                        className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow-lg transition-colors enabled:hover:bg-blue-700 disabled:bg-slate-700 disabled:text-gray-500 disabled:cursor-not-allowed"
                    >
                        可提现到现金账户
                    </button>
                    {!withdrawalConditions.met && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max p-2 bg-slate-900 border border-slate-600 text-xs text-yellow-400 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <InformationCircleIcon className="w-4 h-4 inline mr-1"/>
                            {withdrawalConditions.reason}
                        </div>
                    )}
                </div>
            </section>
        );
    };

    const DataOverview: React.FC = () => {
        const { invites, registrations, deposits, commission } = CURRENT_AGENT_DATA.stats;
        const stats = [
            { label: '注册用户数', value: invites, Icon: UserPlusIcon },
            { label: '有效会员用户数', value: registrations, Icon: UserGroupIcon },
            { label: '下级充值总金额', value: deposits.toLocaleString(), Icon: BanknotesIcon },
            { label: '累计佣金金额', value: commission.toLocaleString(), Icon: ChartPieIcon },
        ];
        
        return (
            <section className="bg-slate-800 rounded-lg border border-slate-700">
                <div className="p-4 flex justify-between items-center border-b border-slate-700">
                     <h3 className="font-bold text-white text-md">数据总览</h3>
                     <div className="relative">
                        <select className="bg-slate-700 text-sm text-white rounded-md py-1 px-3 appearance-none focus:outline-none">
                            <option>当期</option>
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                        <ChevronDownIcon className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"/>
                     </div>
                </div>
                <div className="grid grid-cols-2 gap-4 p-4">
                    {stats.map(stat => (
                        <div key={stat.label}>
                            <p className="text-sm text-gray-400 flex items-center"><stat.Icon className="w-4 h-4 mr-1"/> {stat.label}</p>
                            <p className="text-xl font-bold text-white mt-1">{stat.value}</p>
                        </div>
                    ))}
                </div>
            </section>
        );
    };

    const InviteFriends: React.FC = () => {
        return (
            <section className="bg-slate-800 p-4 rounded-lg border border-slate-700 space-y-4">
                <h3 className="font-bold text-white text-md">邀请好友</h3>
                <div className="relative">
                    <label className="text-sm text-gray-400 mb-1 block">渠道选择</label>
                    <select value={selectedChannel} onChange={e => setSelectedChannel(e.target.value)} className="w-full bg-slate-700 text-white rounded-md py-2 px-3 appearance-none focus:outline-none">
                        <option value="all">全部</option>
                        {MOCK_PROMOTION_CHANNELS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <ChevronDownIcon className="w-5 h-5 text-gray-400 absolute right-3 top-9 pointer-events-none"/>
                </div>
                <div className="flex items-stretch bg-slate-700 rounded-md p-1">
                    <input type="text" readOnly value={AGENT_REFERRAL_LINK} className="flex-grow bg-transparent text-gray-300 text-sm p-2 focus:outline-none"/>
                     <button onClick={() => handleCopy(AGENT_REFERRAL_LINK)} className={`text-white text-sm font-semibold py-2 px-4 rounded-md transition-colors ${copySuccess ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                        {copySuccess ? 'Copied!' : '复制链接'}
                    </button>
                </div>
                 <button onClick={() => setIsPosterModalOpen(true)} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-md flex items-center justify-center space-x-2">
                    <QrCodeIcon className="w-5 h-5" />
                    <span>生成海报</span>
                </button>
            </section>
        );
    };
    
    const EarningGuide: React.FC = () => {
        const steps = [
            { label: '创建推广渠道', Icon: PlusIcon },
            { label: '分享渠道链接', Icon: ShareIcon },
            { label: '赚取佣金', Icon: BanknotesIcon },
        ];

        return (
            <section className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                <h3 className="font-bold text-white text-md mb-4">佣金获取方式</h3>
                <div className="flex items-center justify-between mb-6">
                    {steps.map((step, index) => (
                        <React.Fragment key={index}>
                            <div className="flex flex-col items-center text-center w-24">
                                <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center mb-2">
                                    <step.Icon className="w-6 h-6 text-blue-400"/>
                                </div>
                                <p className="text-xs text-gray-300">{step.label}</p>
                            </div>
                            {index < steps.length - 1 && <div className="flex-1 h-px bg-slate-600 border-t border-dashed border-slate-500"></div>}
                        </React.Fragment>
                    ))}
                </div>

                <div className="space-y-3">
                    {COMMISSION_EARNING_RULES.map(rule => (
                        <div key={rule.id} className="bg-slate-700/50 p-3 rounded-lg flex justify-between items-center">
                            <span className="text-sm text-gray-300">{rule.condition}</span>
                            <span className="font-bold text-yellow-400 text-md">{rule.unlockPercentage}% 解锁</span>
                        </div>
                    ))}
                </div>
            </section>
        );
    };

    const KolLevelRatios: React.FC = () => {
        const { level: currentLevel } = CURRENT_AGENT_DATA;

        return (
            <section className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                <h3 className="font-bold text-white text-md mb-4">KOL等级佣金比例</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-400 uppercase bg-slate-700/50">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    KOL 等级
                                </th>
                                <th scope="col" className="px-6 py-3 text-right">
                                    佣金比例
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {KOL_LEVELS.map((levelInfo) => (
                                <tr 
                                    key={levelInfo.level} 
                                    className={`border-b border-slate-700 last:border-b-0 ${levelInfo.level === currentLevel ? 'bg-blue-600/30' : ''}`}
                                >
                                    <td className="px-6 py-4 font-medium text-white flex items-center">
                                        <CrownIcon className="w-4 h-4 mr-2 text-yellow-400" />
                                        {levelInfo.level}
                                    </td>
                                    <td className="px-6 py-4 text-right font-semibold text-green-400">
                                        {levelInfo.ratio}%
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        );
    };

    return (
        <>
        <div className="p-4 space-y-6">
            <AccountInfo />
            <CommissionInfo />
            <DataOverview />
            <InviteFriends />
            <EarningGuide />
            <KolLevelRatios />
        </div>
        <GeneratedPosterModal
            isOpen={isPosterModalOpen}
            onClose={() => setIsPosterModalOpen(false)}
            posterUrl={AGENT_POSTER_TEMPLATE.imageUrl}
            referralLink={AGENT_REFERRAL_LINK}
        />
        </>
    );
};

const AllAgentsOverview: React.FC = () => {
    return (
        <div className="p-4 text-center text-gray-400 mt-16">
            <PresentationChartLineIcon className="w-24 h-24 mx-auto text-slate-700" />
            <h2 className="text-2xl font-bold text-white mt-4">全民代理模式</h2>
            <p className="mt-2">Content for this mode will be implemented here.</p>
        </div>
    );
};


const AgentPage: React.FC<AgentPageProps> = ({ setActivePage }) => {
  const [agentMode, setAgentMode] = useState<'kol' | 'all'>('kol');
  const [activeKolTab, setActiveKolTab] = useState<KolAgentTab>('kolOverview');
  
  const renderKolContent = () => {
    switch (activeKolTab) {
      case 'kolOverview':
        return <KolAgentOverview />;
      case 'channelManagement':
        return <ChannelManagementPage setActivePage={setActivePage} />;
      case 'friendList':
        return <FriendListPage setActivePage={setActivePage} />;
      case 'commissionList':
        return <CommissionListPage setActivePage={setActivePage} />;
      default:
        return null;
    }
  };

  const ModeSwitcher = () => (
    <div className="p-4 bg-slate-900 sticky top-0 z-20">
        <div className="max-w-xs mx-auto p-1 bg-slate-800 rounded-full flex items-center space-x-1">
            <button
                onClick={() => setAgentMode('kol')}
                className={`flex-1 py-2 text-sm font-semibold rounded-full transition-colors ${agentMode === 'kol' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-slate-700'}`}
            >
                KOL模式
            </button>
            <button
                onClick={() => setAgentMode('all')}
                className={`flex-1 py-2 text-sm font-semibold rounded-full transition-colors ${agentMode === 'all' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-slate-700'}`}
            >
                全民代理模式
            </button>
        </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white">
        <ModeSwitcher />
        
        {agentMode === 'kol' ? (
            <>
                <header className="sticky top-[80px] bg-slate-800 shadow-md z-20 p-3 flex items-center border-b border-slate-700">
                    <button
                        onClick={() => setActivePage('home')}
                        className="p-2 mr-2 text-gray-300 hover:text-yellow-400 rounded-full hover:bg-slate-700 transition-colors"
                        aria-label="Go back"
                    >
                        <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-bold text-white">KOL Agent Mode</h1>
                </header>
                
                <nav className="sticky top-[148px] bg-slate-800 z-10 border-b border-slate-700 flex justify-around">
                    {KOL_AGENT_TABS.map(tab => (
                    <button
                        key={tab.id}
                        // FIX: Cast tab.id as KolAgentTab to fix string assignment error.
                        onClick={() => setActiveKolTab(tab.id as KolAgentTab)}
                        className={`flex-1 py-3 px-2 text-sm font-semibold text-center whitespace-nowrap transition-colors
                        ${activeKolTab === tab.id
                            ? 'text-white border-b-2 border-blue-400'
                            : 'text-gray-400 hover:text-gray-200'
                        }`}
                    >
                        {tab.label}
                    </button>
                    ))}
                </nav>

                <main className="flex-1 overflow-y-auto no-scrollbar">
                    {renderKolContent()}
                </main>
            </>
        ) : (
            <>
                 <header className="sticky top-[80px] bg-slate-800 shadow-md z-20 p-3 flex items-center border-b border-slate-700">
                    <button
                        onClick={() => setActivePage('home')}
                        className="p-2 mr-2 text-gray-300 hover:text-yellow-400 rounded-full hover:bg-slate-700 transition-colors"
                        aria-label="Go back"
                    >
                        <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-bold text-white">全民代理模式</h1>
                </header>
                <main className="flex-1 overflow-y-auto no-scrollbar">
                    <AllAgentsOverview />
                </main>
            </>
        )}
    </div>
  );
};

export default AgentPage;
