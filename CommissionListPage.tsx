
import React, { useState, useMemo } from 'react';
import { PageView, CommissionRecord } from '../types';
import { MOCK_COMMISSION_RECORDS, COMMISSION_EARNING_RULES } from '../constants';
// FIX: Removed non-existent MagnifyingGlassIcon from imports as it is unused in this file.
import { BanknotesIcon, CalendarDaysIcon, ChevronRightIcon, CloseIcon, InformationCircleIcon, ChevronDownIcon } from './icons/GenericIcons';
import AgentHeader from './AgentHeader';

interface CommissionListPageProps {
    setActivePage: (page: PageView) => void;
}

const CommissionListPage: React.FC<CommissionListPageProps> = ({ setActivePage }) => {
    const [records] = useState<CommissionRecord[]>(MOCK_COMMISSION_RECORDS);
    const [selectedRecord, setSelectedRecord] = useState<CommissionRecord | null>(null);
    const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
    
    // Custom Date Range State
    const todayStr = new Date().toISOString().split('00:00:00')[0].split('T')[0];
    const sevenDaysAgoStr = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const [startDate, setStartDate] = useState(sevenDaysAgoStr);
    const [endDate, setEndDate] = useState(todayStr);

    const filteredRecords = useMemo(() => {
        const start = new Date(startDate).setHours(0, 0, 0, 0);
        const end = new Date(endDate).setHours(23, 59, 59, 999);
        return records.filter(record => record.date >= start && record.date <= end);
    }, [records, startDate, endDate]);

    const RulesModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[110]" onClick={onClose}>
            <div className="bg-slate-800 w-full max-w-md p-6 rounded-lg shadow-xl" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white">规则说明</h3>
                    <button onClick={onClose}><CloseIcon className="w-6 h-6 text-gray-400"/></button>
                </div>
                <div className="space-y-3">
                    {COMMISSION_EARNING_RULES.map(rule => (
                        <div key={rule.id} className="bg-slate-700/50 p-3 rounded-lg flex justify-between items-center text-sm">
                            <span className="text-gray-300">{rule.condition}</span>
                            <span className="font-bold text-yellow-400">{rule.unlockPercentage}% 解锁</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const BreakdownModal: React.FC<{ record: CommissionRecord, onClose: () => void }> = ({ record, onClose }) => {
        const { breakdown } = record;
        const [activeTab, setActiveTab] = useState<'channel' | 'player'>('channel');

        const statusConfig = {
            Paid: { text: '已支付', classes: 'text-green-400' },
            Hold: { text: '挂起', classes: 'text-yellow-400' },
            Reviewing: { text: '风控审核', classes: 'text-orange-400' },
        };
        const status = statusConfig[breakdown.status];

        return (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[100]" onClick={onClose}>
                <div className="bg-slate-800 w-full max-w-md p-6 rounded-lg shadow-xl" onClick={e => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-white">佣金明细</h3>
                        <button onClick={onClose}><CloseIcon className="w-6 h-6 text-gray-400"/></button>
                    </div>
                    <div className="flex justify-between items-center bg-slate-700/50 p-3 rounded-lg mb-4">
                        <span className="text-sm text-gray-400">状态</span>
                        <span className={`font-bold ${status.classes}`}>{status.text}</span>
                    </div>
                    {breakdown.notes && <p className="text-xs text-yellow-400 bg-yellow-500/10 p-2 rounded mb-4">{breakdown.notes}</p>}
                    
                    <nav className="flex border-b border-slate-700 mb-4">
                        <button 
                            onClick={() => setActiveTab('channel')}
                            className={`flex-1 py-2 text-sm font-semibold text-center ${activeTab === 'channel' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
                        >
                            按渠道拆分
                        </button>
                        <button 
                            onClick={() => setActiveTab('player')}
                            className={`flex-1 py-2 text-sm font-semibold text-center ${activeTab === 'player' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
                        >
                            按玩家拆分
                        </button>
                    </nav>

                    <div className="text-sm space-y-1 h-48 overflow-y-auto no-scrollbar">
                        {activeTab === 'channel' && breakdown.byChannel.map(c => <div key={c.name} className="flex justify-between p-2 hover:bg-slate-700/50 rounded"><span>{c.name}</span><span className="font-mono text-white">{c.amount.toLocaleString()}</span></div>)}
                        {activeTab === 'player' && breakdown.byPlayer.map(p => <div key={p.name} className="flex justify-between p-2 hover:bg-slate-700/50 rounded"><span>{p.name}</span><span className="font-mono text-white">{p.amount.toLocaleString()}</span></div>)}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full bg-slate-900 text-white">
            <AgentHeader activePage="commissionList" setActivePage={setActivePage} />
            
            <main className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
                {/* Updated Summary Section */}
                <section className="grid grid-cols-3 gap-2 text-center bg-slate-800 p-4 rounded-lg border border-slate-700">
                    <div>
                        <p className="text-[10px] text-gray-400">用户累计充值</p>
                        <p className="text-md font-bold text-yellow-400 mt-1">1.25M <span className="text-[10px] text-gray-400">RUB</span></p>
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-400">用户累计下注</p>
                        <p className="text-md font-bold text-white mt-1">5.5M <span className="text-[10px] text-gray-400">RUB</span></p>
                    </div>
                    <div>
                        <div className="flex items-center justify-center text-[10px] text-gray-400">
                            <span>累计获取佣金</span>
                            <button onClick={() => setIsRulesModalOpen(true)} className="ml-1 text-gray-500 hover:text-white">
                                <InformationCircleIcon className="w-3 h-3" />
                            </button>
                        </div>
                        <p className="text-md font-bold text-green-400 mt-1">6,000 <span className="text-[10px] text-gray-400">RUB</span></p>
                    </div>
                </section>
                
                {/* Custom Date Filter Section */}
                <section className="bg-slate-800 p-3 rounded-xl border border-slate-700 space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-gray-300 flex items-center">
                            <CalendarDaysIcon className="w-4 h-4 mr-2 text-blue-400" />
                            时间筛选
                        </h3>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="flex-1">
                            <input 
                                type="date" 
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full bg-slate-700 text-xs text-white border border-slate-600 rounded-lg py-2 px-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <span className="text-gray-500 text-xs">至</span>
                        <div className="flex-1">
                            <input 
                                type="date" 
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full bg-slate-700 text-xs text-white border border-slate-600 rounded-lg py-2 px-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </section>

                {/* List Section */}
                <section className="space-y-3 pb-20">
                    <div className="flex justify-between items-center mb-1">
                         <h3 className="text-sm font-bold text-gray-400">佣金列表 ({filteredRecords.length})</h3>
                    </div>
                    {filteredRecords.length > 0 ? (
                        filteredRecords.map(record => (
                            <button key={record.id} onClick={() => setSelectedRecord(record)} className="w-full bg-slate-800 p-4 rounded-lg border border-slate-700 hover:bg-slate-700/50 transition-colors text-left space-y-3">
                                <div className="flex justify-between items-center pb-2 border-b border-slate-700/50">
                                    <div className="flex items-center space-x-2 text-sm text-gray-400 font-medium">
                                        <CalendarDaysIcon className="w-4 h-4"/>
                                        <span>{new Date(record.date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center text-xs text-blue-400 font-semibold">
                                        <span>详情</span>
                                        <ChevronRightIcon className="w-3 h-3 ml-1"/>
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                                    <div>
                                        <p className="text-gray-500 mb-1">币种</p>
                                        <p className="font-semibold text-white">{record.currency}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 mb-1">当日充值</p>
                                        <p className="font-semibold text-white">{record.dailyRecharge.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 mb-1">当日下注</p>
                                        <p className="font-semibold text-white">{record.dailyBet.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 mb-1">当日佣金</p>
                                        <p className="font-semibold text-green-400">{record.totalCommission.toLocaleString()}</p>
                                    </div>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="text-center py-16 text-gray-500 italic text-sm">
                            所选时间范围内无记录。
                        </div>
                    )}
                </section>
            </main>
            
            {selectedRecord && <BreakdownModal record={selectedRecord} onClose={() => setSelectedRecord(null)} />}
            {isRulesModalOpen && <RulesModal onClose={() => setIsRulesModalOpen(false)} />}
        </div>
    )
};

export default CommissionListPage;
