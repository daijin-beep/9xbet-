import React, { useState, useMemo } from 'react';
import { PageView, BettingHistoryItem, BettingHistoryTab } from '../types';
import { MOCK_BETTING_HISTORY, BETTING_HISTORY_TABS } from '../constants';
import { 
    ArrowLeftIcon,
    PuzzlePieceIcon,
    FilmIcon,
    DiceIcon as GenericDiceIcon
} from './icons/GenericIcons';
import { SlotMachineIcon as CategorySlotMachineIcon } from './icons/CategoryIcons';


interface BettingHistoryPageProps {
  setActivePage: (page: PageView) => void;
}

const getGameTypeIcon = (type: BettingHistoryItem['gameType']) => {
    switch(type) {
        case 'slot': return <CategorySlotMachineIcon className="w-5 h-5 text-gray-400" />;
        case 'live': return <FilmIcon className="w-5 h-5 text-gray-400" />;
        case 'quick': return <GenericDiceIcon className="w-5 h-5 text-gray-400" />;
        case 'table': return <PuzzlePieceIcon className="w-5 h-5 text-gray-400" />;
        default: return null;
    }
};

const BetCard: React.FC<{ item: BettingHistoryItem }> = ({ item }) => {
    const isWin = item.status === 'won';
    const isLoss = item.status === 'lost';
    
    const statusClasses: { [key in BettingHistoryItem['status']]: string } = {
        won: 'bg-green-500/20 text-green-400 border-green-500/30',
        lost: 'bg-red-500/20 text-red-400 border-red-500/30',
        pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    };

    const payoutColor = isWin ? 'text-green-400' : isLoss ? 'text-red-400' : 'text-gray-400';

    return (
        <div className={`bg-slate-800 p-4 rounded-lg border ${statusClasses[item.status]} shadow-md`}>
            <div className="flex justify-between items-start mb-2">
                <div>
                    <div className="flex items-center space-x-2">
                        {getGameTypeIcon(item.gameType)}
                        <h3 className="font-bold text-white text-md">{item.gameName}</h3>
                    </div>
                    <p className="text-xs text-gray-400">{item.gameProvider}</p>
                </div>
                <div className={`text-xs font-bold px-2 py-1 rounded-full ${statusClasses[item.status]}`}>
                    {item.status.toUpperCase()}
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm border-t border-slate-700 pt-3 mt-3">
                <div className="text-left">
                    <p className="text-gray-400 text-xs">Bet Amount</p>
                    <p className="font-semibold text-white">{item.betAmount.toLocaleString()} {item.currency}</p>
                </div>
                 <div className="text-right">
                    <p className="text-gray-400 text-xs">Payout</p>
                    <p className={`font-semibold ${payoutColor}`}>
                        {isWin ? '+' : ''}{item.payoutAmount.toLocaleString()} {item.currency}
                    </p>
                </div>
            </div>
            <div className="text-xs text-gray-500 mt-3 flex justify-between">
                <span>ID: {item.id}</span>
                <span>{new Date(item.betTime).toLocaleString()}</span>
            </div>
        </div>
    );
};

const BettingHistoryPage: React.FC<BettingHistoryPageProps> = ({ setActivePage }) => {
    const [activeTab, setActiveTab] = useState<BettingHistoryTab['id']>('all');

    const filteredBets = useMemo(() => {
        if (activeTab === 'all') {
            return MOCK_BETTING_HISTORY;
        }
        return MOCK_BETTING_HISTORY.filter(bet => bet.status === activeTab);
    }, [activeTab]);

    return (
        <div className="flex flex-col h-full bg-slate-900 text-white">
            <header className="sticky top-0 bg-slate-800 shadow-md z-20 p-3 flex items-center border-b border-slate-700">
                <button 
                    onClick={() => setActivePage('profile')}
                    className="p-2 mr-2 text-gray-300 hover:text-yellow-400 rounded-full hover:bg-slate-700 transition-colors"
                    aria-label="Go back to profile"
                >
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold text-white">Betting History</h1>
            </header>

            <nav className="sticky top-[68px] bg-slate-800 z-10 p-2 border-b border-slate-700 flex justify-around">
                {BETTING_HISTORY_TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors
                            ${activeTab === tab.id 
                                ? 'bg-blue-600 text-white' 
                                : 'text-gray-400 hover:bg-slate-700'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>

            <main className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-3">
                {filteredBets.length > 0 ? (
                    filteredBets.map(bet => <BetCard key={bet.id} item={bet} />)
                ) : (
                    <div className="text-center text-gray-500 pt-16">
                        <p className="text-lg">No records found.</p>
                        <p className="text-sm">There are no bets in this category.</p>
                    </div>
                )}
                <div className="h-16 sm:h-12"></div>
            </main>
        </div>
    );
};

export default BettingHistoryPage;