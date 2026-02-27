
import React, { useState } from 'react';
import { PageView, User, InvitedKol } from '../types';
import { 
    ArrowLeftIcon, 
    UserGroupIcon, 
    PresentationChartLineIcon, 
    SparklesIcon, 
    BanknotesIcon, 
    ChevronRightIcon,
    ShieldCheckIcon,
    ChartPieIcon,
    GiftIcon,
    CloseIcon,
    CheckIcon,
    ArrowPathIcon,
    UserCircleIcon,
    EnvelopeIcon,
    DevicePhoneMobileIcon,
    InformationCircleIcon,
    ArrowsRightLeftIcon
} from './icons/GenericIcons';
import TransferToKolModal from './TransferToKolModal';

interface DistributorOverviewPageProps {
  setActivePage: (page: PageView) => void;
  user: User | null;
  onApplySuccess?: () => void;
}

const ApplicationModal: React.FC<{ isOpen: boolean; onClose: () => void; onComplete: () => void }> = ({ isOpen, onClose, onComplete }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // 模拟 API 请求
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
            setTimeout(() => {
                onComplete();
                onClose();
                setIsSuccess(false);
            }, 2000);
        }, 1500);
    };

    if (!isOpen) return null;

    const inputClasses = "w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all text-sm";

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div className="bg-slate-950 w-full max-w-sm rounded-[2.5rem] shadow-2xl border border-slate-800 overflow-hidden flex flex-col animate-slide-up" onClick={e => e.stopPropagation()}>
                <header className="p-6 border-b border-slate-900 flex justify-between items-center bg-slate-900/50">
                    <div>
                        <h3 className="font-black text-xl text-white italic tracking-tighter uppercase">分销商申请</h3>
                        <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Master Partner Application</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-600 hover:text-white bg-slate-900 rounded-full transition-colors"><CloseIcon className="w-5 h-5" /></button>
                </header>

                <main className="p-6">
                    {!isSuccess ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center">
                                    <UserCircleIcon className="w-3 h-3 mr-1" /> 姓名 / Name
                                </label>
                                <input required type="text" placeholder="请输入您的真实姓名" className={inputClasses} />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center">
                                    <EnvelopeIcon className="w-3 h-3 mr-1" /> 电子邮箱 / Email
                                </label>
                                <input required type="email" placeholder="example@mail.com" className={inputClasses} />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center">
                                    <DevicePhoneMobileIcon className="w-3 h-3 mr-1" /> 手机号码 / Phone
                                </label>
                                <input required type="tel" placeholder="请输入联系电话" className={inputClasses} />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center">
                                    <InformationCircleIcon className="w-3 h-3 mr-1" /> 申请说明 / Description
                                </label>
                                <textarea 
                                    rows={3} 
                                    placeholder="请简述您的推广资源或分销计划..." 
                                    className={`${inputClasses} resize-none`}
                                />
                            </div>

                            <button 
                                disabled={isSubmitting}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-95 text-base uppercase tracking-widest flex items-center justify-center group relative overflow-hidden mt-4"
                            >
                                {isSubmitting ? <ArrowPathIcon className="w-6 h-6 animate-spin" /> : '提交申请 (Submit)'}
                            </button>
                        </form>
                    ) : (
                        <div className="py-10 flex flex-col items-center justify-center space-y-6 animate-fade-in text-center">
                            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20 shadow-[0_0_40px_rgba(34,197,94,0.2)]">
                                <CheckIcon className="w-10 h-10 text-green-500 stroke-[3]" />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter">提交成功</h4>
                                <p className="text-sm text-slate-500 font-bold tracking-widest uppercase">Application Under Review</p>
                                <p className="text-xs text-slate-400 mt-4 px-6 leading-relaxed">
                                    我们已收到您的分销申请。专员将在 1-3 个工作日内通过邮件或电话与您联系。
                                </p>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

const DistributorOverviewPage: React.FC<DistributorOverviewPageProps> = ({ setActivePage, user, onApplySuccess }) => {
  const isDistributor = user?.roles.includes('distributor');
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [withdrawableBalance, setWithdrawableBalance] = useState(user?.allAgentWithdrawable || 4500.00);

  const handleTransferSuccess = (amount: number, recipient: InvitedKol) => {
      setWithdrawableBalance(prev => prev - amount);
      // 后续可在此添加全局状态更新逻辑
  };

  const benefits = [
    {
      title: '专属 KOL 代理发展',
      desc: '分销商可以招募并管理自己的 KOL 代理团队，建立多级分销体系。',
      icon: UserGroupIcon,
      color: 'text-blue-400'
    },
    {
      title: '自由设定返佣比',
      desc: '灵活配置下级返佣比例，掌控您的商业收益结构。',
      icon: PresentationChartLineIcon,
      color: 'text-purple-400'
    },
    {
      title: '超高提成上限',
      desc: '享受分销商专属顶级佣金系数，收益上不封顶，助力财富增长。',
      icon: BanknotesIcon,
      color: 'text-emerald-400'
    },
    {
        title: '独立分销后台',
        desc: '提供专业的数据报表分析后台，实时监控下级业绩。',
        icon: ChartPieIcon,
        color: 'text-orange-400'
    }
  ];

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white font-sans overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 bg-slate-900 shadow-md z-20 p-4 flex items-center border-b border-slate-800">
        <button 
          onClick={() => setActivePage('profile')}
          className="p-2 mr-4 text-gray-400 hover:text-blue-400 rounded-full hover:bg-slate-800 transition-colors"
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-xl font-black italic tracking-tighter uppercase leading-none">分销商计划</h1>
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">Distributor Master Program</p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-8">
        {/* Hero Section */}
        <section className={`relative h-48 rounded-[2.5rem] p-8 overflow-hidden shadow-2xl border border-white/10 group transition-all duration-700 ${isDistributor ? 'bg-gradient-to-br from-yellow-600 to-amber-900' : 'bg-gradient-to-br from-blue-600 to-indigo-900'}`}>
            <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 group-hover:scale-110 transition-transform">
                <SparklesIcon className="w-40 h-40" />
            </div>
            <div className="relative z-10 space-y-2">
                <h2 className="text-3xl font-black italic tracking-tighter uppercase leading-tight">
                    {isDistributor ? 'Elite Partner' : 'Master Partner'}
                </h2>
                <p className="text-sm text-blue-100 font-medium">
                    {isDistributor ? '您的专属分销版图已开启，掌控全局收益' : '成为顶级合伙人，开启您的商业版图'}
                </p>
                {!isDistributor && (
                    <button 
                        onClick={() => setIsApplyModalOpen(true)}
                        className="mt-4 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black py-2.5 px-6 rounded-xl text-xs uppercase tracking-widest shadow-lg transition-all active:scale-95"
                    >
                        立即申请
                    </button>
                )}
            </div>
        </section>

        {isDistributor ? (
          /* Distributor Info Section */
          <section className="space-y-4 animate-fade-in">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-inner space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">分销商身份</p>
                        <h3 className="text-xl font-black text-yellow-400 italic">ELITE DISTRIBUTOR</h3>
                    </div>
                    <ShieldCheckIcon className="w-10 h-10 text-blue-500" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 text-center">
                        <p className="text-[9px] text-slate-500 font-bold uppercase mb-1">团队规模</p>
                        <p className="text-2xl font-black font-mono">15 <span className="text-[10px] text-slate-600 uppercase ml-0.5">KOLs</span></p>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 text-center">
                        <p className="text-[9px] text-slate-500 font-bold uppercase mb-1">当前可提现</p>
                        <p className="text-2xl font-black font-mono text-green-400">{withdrawableBalance.toLocaleString()} <span className="text-[10px] text-slate-600 uppercase ml-0.5">RUB</span></p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button className="bg-slate-800 hover:bg-slate-700 text-white font-black py-4 rounded-2xl shadow-lg transition-all active:scale-95 text-xs uppercase tracking-widest flex items-center justify-center space-x-2 border border-white/5">
                        <span>管理后台</span>
                    </button>
                    <button 
                        onClick={() => setIsTransferModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-900/20 transition-all active:scale-95 text-xs uppercase tracking-widest flex items-center justify-center space-x-2 border border-white/10 group"
                    >
                        <ArrowsRightLeftIcon className="w-4 h-4" />
                        <span>给下级转账</span>
                    </button>
                </div>
              </div>

              {/* 分销商快捷统计预览 */}
              <div className="grid grid-cols-1 gap-4">
                  <div className="bg-slate-900 border border-white/5 p-5 rounded-3xl flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                          <div className="p-2 bg-purple-500/10 rounded-xl"><UserGroupIcon className="w-5 h-5 text-purple-400" /></div>
                          <div>
                              <p className="text-[10px] text-slate-500 font-bold uppercase">下级活跃 KOL</p>
                              <p className="text-lg font-black">12 <span className="text-[10px] text-slate-600">在线</span></p>
                          </div>
                      </div>
                      <ChevronRightIcon className="w-5 h-5 text-slate-700" />
                  </div>
                  <div className="bg-slate-900 border border-white/5 p-5 rounded-3xl flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                          <div className="p-2 bg-emerald-500/10 rounded-xl"><ChartPieIcon className="w-5 h-5 text-emerald-400" /></div>
                          <div>
                              <p className="text-[10px] text-slate-500 font-bold uppercase">下级产生总流水</p>
                              <p className="text-lg font-black">1.25M <span className="text-[10px] text-slate-600">RUB</span></p>
                          </div>
                      </div>
                      <ChevronRightIcon className="w-5 h-5 text-slate-700" />
                  </div>
              </div>
          </section>
        ) : (
          /* Benefits Introduction */
          <section className="space-y-6">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] px-1 italic">分销商核心权益 (Distributor Benefits)</h3>
            <div className="grid grid-cols-1 gap-4">
              {benefits.map((benefit, i) => (
                <div key={i} className="bg-slate-900 border border-slate-800 p-5 rounded-3xl flex items-start space-x-4 shadow-lg hover:border-slate-700 transition-colors">
                  <div className={`p-3 bg-slate-800 rounded-2xl ${benefit.color} border border-white/5`}>
                    <benefit.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-white text-base tracking-tight mb-1">{benefit.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="h-20"></div>
      </main>

      {/* 申请弹窗 */}
      <ApplicationModal 
        isOpen={isApplyModalOpen} 
        onClose={() => setIsApplyModalOpen(false)} 
        onComplete={() => onApplySuccess?.()}
      />

      {/* 新增：KOL 转账弹窗 */}
      <TransferToKolModal 
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        availableAmount={withdrawableBalance}
        onSuccess={handleTransferSuccess}
      />

      <style>{`
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default DistributorOverviewPage;
