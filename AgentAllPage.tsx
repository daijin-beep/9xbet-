
import React, { useState } from 'react';
import { PageView } from '../types';
import { CURRENT_AGENT_DATA, AGENT_REFERRAL_LINK } from '../constants';
import AgentHeader from './AgentHeader';
import { BanknotesIcon, ArrowUpTrayIcon, ArrowsRightLeftIcon, LockClosedIcon, ChartPieIcon, ShareIcon, UserPlusIcon, InformationCircleIcon, ClipboardCopyIcon, QrCodeIcon } from './icons/GenericIcons';
import TransferCommissionModal from './TransferCommissionModal';

interface AgentAllPageProps {
  setActivePage: (page: PageView) => void;
  onOpenWithdrawal: () => void;
}

const AgentAllPage: React.FC<AgentAllPageProps> = ({ setActivePage, onOpenWithdrawal }) => {
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        });
    };

    return (
        <div className="flex flex-col h-full bg-slate-950 text-white">
            <AgentHeader activePage="agentAll" setActivePage={setActivePage} />
            
            <main className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-6">
                
                {/* 资金卡片 */}
                <section className="bg-slate-800 rounded-[2.5rem] p-6 border border-slate-700 shadow-2xl space-y-8">
                    <div className="grid grid-cols-2 gap-6 relative">
                        {/* 分割线 */}
                        <div className="absolute left-1/2 top-2 bottom-2 w-px bg-slate-700 opacity-50"></div>

                        <div className="text-center space-y-1">
                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">可提现余额</p>
                            <p className="text-2xl font-black text-green-400 font-mono tracking-tighter">
                                {CURRENT_AGENT_DATA.availableCommission.toLocaleString()}
                                <span className="text-[10px] ml-0.5">₽</span>
                            </p>
                        </div>
                        <div className="text-center space-y-1">
                            <div className="flex items-center justify-center space-x-1">
                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">未解锁佣金</p>
                                <LockClosedIcon className="w-3 h-3 text-slate-600" />
                            </div>
                            <p className="text-2xl font-black text-slate-400 font-mono tracking-tighter">
                                1,200
                                <span className="text-[10px] ml-0.5">₽</span>
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button 
                            onClick={onOpenWithdrawal}
                            className="bg-slate-900 hover:bg-slate-800 text-blue-400 font-black py-4 rounded-2xl border border-blue-500/20 transition-all active:scale-95 text-xs uppercase tracking-widest flex items-center justify-center space-x-2"
                        >
                            <ArrowUpTrayIcon className="w-4 h-4" />
                            <span>立即提现</span>
                        </button>
                        <button 
                            onClick={() => setIsTransferModalOpen(true)}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-900/40 transition-all active:scale-95 text-xs uppercase tracking-widest flex items-center justify-center space-x-2"
                        >
                            <ArrowsRightLeftIcon className="w-4 h-4" />
                            <span>划转到钱包</span>
                        </button>
                    </div>
                </section>

                {/* 推广工具 */}
                <section className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-4">
                     <div className="flex items-center justify-between mb-1">
                        <h3 className="font-black text-white text-md uppercase italic tracking-tight">全民推广链接</h3>
                        <div className="text-[10px] text-slate-500 font-bold bg-slate-900 px-2 py-0.5 rounded border border-white/5">
                            Level: Bronze
                        </div>
                     </div>
                     <div className="flex items-center bg-slate-900 p-1.5 rounded-xl border border-slate-700 shadow-inner">
                        <div className="flex-1 px-3 text-[11px] text-gray-500 truncate font-mono">{AGENT_REFERRAL_LINK}</div>
                        <button 
                            onClick={() => handleCopy(AGENT_REFERRAL_LINK)}
                            className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all ${copySuccess ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'}`}
                        >
                            {copySuccess ? 'DONE' : 'COPY'}
                        </button>
                     </div>
                     <button className="w-full bg-slate-700/50 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-xl flex items-center justify-center space-x-2 border border-white/5 transition-colors">
                        <QrCodeIcon className="w-5 h-5 text-gray-500" />
                        <span className="text-xs font-black uppercase tracking-widest">保存我的推广码</span>
                     </button>
                </section>

                {/* 全民代理简介 */}
                <section className="p-5 bg-blue-600/5 border border-blue-500/10 rounded-3xl flex items-start space-x-3">
                    <InformationCircleIcon className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                        <p className="text-xs font-black text-blue-200">全民代理规则</p>
                        <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                            全民代理模式下，您邀请的每位好友进行投注都会为您产生基础佣金。
                            当好友完成实名认证且产生首充后，未解锁佣金将自动转入可提现余额。
                        </p>
                    </div>
                </section>

                <div className="h-20"></div>
            </main>

            <TransferCommissionModal 
                isOpen={isTransferModalOpen}
                onClose={() => setIsTransferModalOpen(false)}
                availableAmount={CURRENT_AGENT_DATA.availableCommission}
                onSuccess={() => alert('划转成功！佣金已转入您的游戏钱包余额。')}
            />
        </div>
    );
};

export default AgentAllPage;
