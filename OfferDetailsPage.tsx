
import React, { useState } from 'react';
import { PromotionalBanner } from '../types';
import { ArrowLeftIcon, CheckIcon, UsersIcon, DevicePhoneMobileIcon, CircleStackIcon, ClockIcon, CalendarDaysIcon } from './icons/GenericIcons';

interface OfferDetailsPageProps {
  offer: PromotionalBanner;
  onBack: () => void;
}

const OfferDetailsPage: React.FC<OfferDetailsPageProps> = ({ offer, onBack }) => {
  const [isJoined, setIsJoined] = useState(false);

  const handleJoin = () => {
    if (!isJoined) {
      setIsJoined(true);
    }
  };

  // 奖励机制文案映射
  const getMechanismTitle = () => {
      switch(offer.rewardConfig?.mechanism) {
          case 'tiered_percentage': return '分级比例奖励';
          case 'tiered_fixed': return '分级固定值奖励';
          case 'fixed_percentage': return '固定比例奖励';
          case 'fixed_value': return '固定值奖励';
          default: return '奖励详情';
      }
  };

  // 计算详情页时间展示
  const renderTimeBadge = () => {
    if (offer.activityType === 'daily' && offer.cycleConfig) {
        return (
            <span className="bg-blue-600 text-white text-[10px] font-black px-4 py-2 rounded-full shadow-lg flex items-center uppercase tracking-widest">
                <ClockIcon className="w-3.5 h-3.5 mr-2" />
                周期：每日 {offer.cycleConfig.startTime} - {offer.cycleConfig.endTime}
            </span>
        );
    }
    if (offer.activityType === 'weekly' && offer.cycleConfig) {
        return (
            <span className="bg-purple-600 text-white text-[10px] font-black px-4 py-2 rounded-full shadow-lg flex items-center uppercase tracking-widest">
                <CalendarDaysIcon className="w-3.5 h-3.5 mr-2" />
                周期：每周 {offer.cycleConfig.startDay} 至 {offer.cycleConfig.endDay}
            </span>
        );
    }
    return (
        <span className="bg-white text-slate-900 text-[10px] font-black px-4 py-2 rounded-full shadow-sm border border-slate-200 uppercase tracking-widest">
            有效期: {offer.dateRange || '永久有效'}
        </span>
    );
  };

  return (
    <div className="relative h-full flex flex-col bg-slate-100 text-slate-800">
      <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
        {/* Header Image */}
        <div className="relative h-60 bg-cover bg-center" style={{ backgroundImage: `url(${offer.imageUrl})` }}>
           <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
            <button
                onClick={onBack}
                className="absolute top-4 left-4 p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-colors"
                aria-label="Back to offers"
            >
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
        </div>

        {/* Main Content Card */}
        <div className="bg-slate-100 transform -translate-y-6 rounded-t-[2.5rem] shadow-2xl relative z-10 p-5 space-y-6">
          
          {/* Validity Badge */}
          <div className="flex justify-start">
            {renderTimeBadge()}
          </div>
          
          <section>
            <h1 className="text-3xl font-black text-slate-900 leading-tight mb-3 italic uppercase tracking-tighter drop-shadow-sm">{offer.detailsTitle || offer.title}</h1>
            {offer.description && (
              <p 
                  className="text-slate-500 leading-relaxed text-sm font-medium"
                  dangerouslySetInnerHTML={{ __html: offer.description }}
              />
            )}
          </section>

          {/* 1. 可参与信息 (结构化) */}
          <section className="grid grid-cols-2 gap-3">
              <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">
                  <UsersIcon className="w-3.5 h-3.5 mr-1.5 text-blue-500" /> 可参与用户
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(offer.targetUsers || ['全部用户']).map((u, i) => (
                    <span key={i} className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-lg">{u}</span>
                  ))}
                </div>
              </div>
              <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">
                  <DevicePhoneMobileIcon className="w-3.5 h-3.5 mr-1.5 text-indigo-500" /> 可参与端
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(offer.targetPlatforms || ['全部平台']).map((p, i) => (
                    <span key={i} className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-lg">{p}</span>
                  ))}
                </div>
              </div>
          </section>

          {/* 2. 奖励规则 (根据机制渲染) */}
          {offer.rewardConfig && (
            <section className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                <header className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <h3 className="font-black text-slate-800 text-sm uppercase tracking-tight italic flex items-center">
                        <CircleStackIcon className="w-4 h-4 mr-2 text-blue-500" />
                        {getMechanismTitle()}
                    </h3>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${offer.rewardConfig.rewardType === 'bonus' ? 'text-blue-500 border-blue-100 bg-blue-50' : 'text-green-600 border-green-100 bg-green-50'}`}>
                        {offer.rewardConfig.rewardType === 'bonus' ? 'Bonus 奖励' : '现金券奖励'}
                    </span>
                </header>

                <div className="p-5">
                    {/* 表格类展示: 分级比例 / 分级固定值 */}
                    {(offer.rewardConfig.mechanism === 'tiered_percentage' || offer.rewardConfig.mechanism === 'tiered_fixed') && offer.rewardConfig.table ? (
                        <div className="rounded-2xl border border-slate-100 overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50">
                                    <tr>
                                        <th className="px-4 py-3">达成条件 (RUB)</th>
                                        <th className="px-4 py-3 text-right">获得奖励</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {offer.rewardConfig.table.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-4 py-3 font-bold text-slate-700">{row.condition}</td>
                                            <td className="px-4 py-3 text-right font-black text-blue-600 font-mono">{row.reward}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        /* 非表格展示: 固定值 / 固定比例 */
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                             <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">奖励数值</p>
                                <p className="text-2xl font-black text-blue-600 italic uppercase font-mono">{offer.rewardConfig.fixedValue}</p>
                             </div>
                             <div className="text-right">
                                {offer.rewardConfig.exchangeRate && (
                                    <div className="mb-2">
                                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">当前参考汇率</p>
                                        <p className="text-xs font-mono font-bold text-slate-700">{offer.rewardConfig.exchangeRate}</p>
                                    </div>
                                )}
                                {offer.rewardConfig.minCondition && (
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">参与门槛</p>
                                        <p className="text-sm font-bold text-slate-700">{offer.rewardConfig.minCondition}</p>
                                    </div>
                                )}
                             </div>
                        </div>
                    )}
                </div>
            </section>
          )}

          {/* 3. 如何参加 */}
          {offer.participationSteps && offer.participationSteps.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tight flex items-center">
                  <span className="w-1.5 h-5 bg-slate-900 mr-2 rounded-full"></span>
                  如何参加:
              </h2>
              <div className="space-y-4">
                {offer.participationSteps.map(step => (
                  <div key={step.number} className="flex items-start">
                    <div className="flex-shrink-0 mr-4 w-10 h-10 flex items-center justify-center bg-white text-slate-900 font-black text-lg rounded-2xl shadow-sm border border-slate-200">
                      {step.number}
                    </div>
                    <p 
                      className="text-slate-600 leading-relaxed pt-1.5 font-medium text-sm"
                      dangerouslySetInnerHTML={{ __html: step.htmlText }}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
      
      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-slate-100 via-slate-100 to-transparent z-40">
        <button 
          onClick={handleJoin}
          disabled={isJoined}
          className={`w-full font-black text-xl py-5 rounded-3xl shadow-2xl transition-all duration-300 transform active:scale-95 italic tracking-tighter uppercase ${
            isJoined 
            ? 'bg-green-500 text-white cursor-default shadow-green-900/20' 
            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-900/20'
          }`}
          aria-label={isJoined ? "Joined offer" : "Participate in offer"}
        >
          {isJoined ? (
            <span className="flex items-center justify-center">
              <CheckIcon className="w-6 h-6 mr-2 stroke-[3]" />
              已参加 (Joined)
            </span>
          ) : '立即参加 (Join Now)'}
        </button>
      </div>

       <style>{`
        .text-slate-600 strong, .text-slate-500 strong {
            color: #0f172a; /* slate-900 */
            font-weight: 900;
        }
       `}</style>
    </div>
  );
};

export default OfferDetailsPage;
