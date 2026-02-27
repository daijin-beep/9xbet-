
import React, { useState } from 'react';
import { PageView } from '../types';
import { CURRENT_AGENT_DATA, AGENT_REFERRAL_LINK } from '../constants';
import AgentHeader from './AgentHeader';
import { CrownIcon } from './icons/QuickAccessIcons';
import { BanknotesIcon, ShareIcon, UserPlusIcon, ChartPieIcon, InformationCircleIcon, ClipboardCopyIcon, QrCodeIcon, ArrowUpTrayIcon } from './icons/GenericIcons';

interface KolOverviewPageProps {
  setActivePage: (page: PageView) => void;
  onOpenWithdrawal: () => void;
}

const KolOverviewPage: React.FC<KolOverviewPageProps> = ({ setActivePage, onOpenWithdrawal }) => {
    const [copySuccess, setCopySuccess] = useState(false);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        });
    };

    const CommissionInfo: React.FC = () => {
        const { availableCommission } = CURRENT_AGENT_DATA;
        
        return (
            <section className="bg-slate-800 p-6 rounded-[2rem] border border-slate-700 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                     <ChartPieIcon className="w-32 h-32 text-blue-400" />
                </div>

                <div className="relative z-10 space-y-6">
                    <div className="text-center">
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mb-2">可提现余额 (Withdrawable)</p>
                        <div className="flex items-baseline justify-center space-x-1">
                            <span className="text-4xl font-black text-white font-mono tracking-tighter">{availableCommission.toLocaleString()}</span>
                            <span className="text-sm font-bold text-gray-400 uppercase">RUB</span>
                        </div>
                    </div>

                    <button 
                        onClick={onOpenWithdrawal}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-900/40 transition-all active:scale-95 uppercase tracking-widest text-sm flex items-center justify-center space-x-2"
                    >
                        <ArrowUpTrayIcon className="w-5 h-5" />
                        <span>立即提现 (Withdraw Now)</span>
                    </button>
                </div>
            </section>
        );
    };

    const EarningGuide: React.FC = () => {
        return (
            <section className="bg-slate-800 p-5 rounded-2xl border border-slate-700">
                <h3 className="font-black text-white text-md mb-6 uppercase tracking-tight flex items-center italic">
                    <span className="w-1.5 h-4 bg-yellow-500 rounded-full mr-2"></span>
                    KOL 收益流程
                </h3>
                
                <div className="space-y-6 relative">
                    <div className="absolute left-[19px] top-6 bottom-6 w-0.5 bg-slate-700"></div>
                    {[
                        { title: '分享推广海报', desc: '通过二维码或专属链接邀请好友加入。', Icon: ShareIcon },
                        { title: '产生有效佣金', desc: '下级成员产生流水后，系统实时结算佣金。', Icon: ChartPieIcon },
                        { title: '随时申请提现', desc: '佣金到达可提现余额后，可随时提取卢布。', Icon: BanknotesIcon },
                    ].map((item, index) => (
                        <div key={index} className="flex items-start space-x-4 relative z-10">
                            <div className="w-10 h-10 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center flex-shrink-0 text-yellow-400 font-black text-sm shadow-inner">
                                <item.Icon className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white mb-1">{item.title}</h4>
                                <p className="text-[11px] text-gray-500 leading-relaxed">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    };

    const QuickInvite: React.FC = () => (
        <section className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-4">
             <div className="flex items-center justify-between mb-2">
                <h3 className="font-black text-white text-md uppercase italic">专属链接</h3>
                <div className="flex items-center text-[10px] text-blue-400 font-bold">
                    <InformationCircleIcon className="w-3.5 h-3.5 mr-1" />
                    查看分成规则
                </div>
             </div>
             <div className="flex items-center bg-slate-900 p-1.5 rounded-xl border border-slate-700 shadow-inner">
                <div className="flex-1 px-3 text-[11px] text-gray-500 truncate font-mono">{AGENT_REFERRAL_LINK}</div>
                <button 
                    onClick={() => handleCopy(AGENT_REFERRAL_LINK)}
                    className={`px-5 py-2.5 rounded-lg text-[10px] font-black transition-all shadow-md ${copySuccess ? 'bg-green-600 text-white' : 'bg-blue-600 text-white active:scale-95'}`}
                >
                    {copySuccess ? '已复制!' : '复制'}
                </button>
             </div>
             <button className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-xl flex items-center justify-center space-x-2 transition-colors border border-white/5">
                <QrCodeIcon className="w-5 h-5" />
                <span className="text-xs uppercase tracking-widest font-black">保存推广二维码</span>
             </button>
        </section>
    );

    return (
        <div className="flex flex-col h-full bg-slate-950 text-white">
            <AgentHeader activePage="kolOverview" setActivePage={setActivePage} />
            <main className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-6">
                <CommissionInfo />
                <QuickInvite />
                
                {/* KOL 等级勋章展示 */}
                <section className="bg-slate-900/50 p-5 rounded-3xl border border-dashed border-slate-700 flex items-center justify-between shadow-inner">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-yellow-500/10 rounded-2xl border border-yellow-500/20 shadow-lg">
                            <CrownIcon className="w-8 h-8 text-yellow-500" />
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">当前 KOL 等级</p>
                            <p className="text-xl font-black text-yellow-500 italic uppercase">GOLD PARTNER</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-gray-500 font-bold uppercase">分成比例</p>
                        <p className="text-2xl font-black text-white font-mono">35%</p>
                    </div>
                </section>

                <EarningGuide />
                <div className="h-20"></div>
            </main>
        </div>
    );
};

export default KolOverviewPage;
