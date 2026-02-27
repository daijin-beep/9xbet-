
import React, { useState, useMemo } from 'react';
import { PageView, Bonus } from '../types';
import { MY_BONUSES } from '../constants';
import BonusCard from './BonusCard';
import PromotionsHeader from './PromotionsHeader';
import BonusRulesModal from './BonusRulesModal';
import ForfeitConfirmationModal from './ForfeitConfirmationModal';
import { SparklesIcon, BanknotesIcon, CircleStackIcon, QuestionMarkCircleIcon, ExclamationTriangleIcon } from './icons/GenericIcons';

interface BonusCenterPageProps {
  setActivePage: (page: PageView) => void;
  setActiveHomeFilter: (filterId: string) => void;
}

const BonusCenterPage: React.FC<BonusCenterPageProps> = ({ setActivePage, setActiveHomeFilter }) => {
  const [bonuses, setBonuses] = useState<Bonus[]>(MY_BONUSES);
  const [showForfeitModal, setShowForfeitModal] = useState(false);
  const [targetBonusId, setTargetBonusId] = useState<string | null>(null);
  
  // 规则详情弹窗状态
  const [selectedBonusForRules, setSelectedBonusForRules] = useState<Bonus | null>(null);

  // --- 数据拆分逻辑 ---
  
  // 1. 寻找顶置 Bonus (Active/Locked)
  const topBonus = useMemo(() => 
    bonuses.find(b => b.category === 'bonus' && (b.status === 'active' || b.status === 'locked'))
  , [bonuses]);

  // 2. 寻找顶置 现金券 (Active/Locked)
  const topVoucher = useMemo(() => 
    bonuses.find(b => b.category === 'voucher' && (b.status === 'active' || b.status === 'locked'))
  , [bonuses]);

  // 3. 剩余列表 (过滤掉已经顶置的项目)
  const remainingList = useMemo(() => {
    const topIds = [topBonus?.id, topVoucher?.id].filter(Boolean);
    return bonuses
      .filter(b => !topIds.includes(b.id))
      .sort((a, b) => {
          const order = { active: 0, locked: 0, pending_claim: 1, queued: 2, completed: 3, expired: 4, void: 4 };
          return (order[a.status] || 99) - (order[b.status] || 99);
      });
  }, [bonuses, topBonus, topVoucher]);

  const handleAction = (id: string, action: string) => {
      if (action === 'forfeit') {
          setTargetBonusId(id);
          setShowForfeitModal(true);
      } else if (action === 'play') {
          setActiveHomeFilter('slot');
          setActivePage('home');
      } else if (action === 'promote') {
          handlePromote(id);
      }
  };

  const handlePromote = (id: string) => {
      alert('已申请优先排队，当前红利结算后将自动激活。');
  };

  const confirmForfeit = () => {
      if (targetBonusId) {
          setBonuses(prev => prev.map(b => b.id === targetBonusId ? { ...b, status: 'void' } : b));
          setTargetBonusId(null);
          setShowForfeitModal(false);
      }
  };

  // 获取正在被确认放弃的奖励对象
  const forfeitingBonus = useMemo(() => 
    bonuses.find(b => b.id === targetBonusId)
  , [bonuses, targetBonusId]);

  const ActivationSlot: React.FC<{ type: 'bonus' | 'voucher', activeItem?: Bonus }> = ({ type, activeItem }) => {
      const isBonus = type === 'bonus';
      const label = isBonus ? '当前激活 Bonus' : '当前激活现金券';
      const Icon = isBonus ? SparklesIcon : BanknotesIcon;
      const accentColor = isBonus ? 'text-purple-400' : 'text-emerald-400';

      return (
          <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                  <div className="flex items-center space-x-2">
                    <Icon className={`w-4 h-4 ${accentColor}`} />
                    <h3 className="text-[11px] font-black text-white uppercase tracking-widest italic">{label}</h3>
                  </div>
                  {!activeItem && <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter italic">暂无激活项</span>}
              </div>
              
              {activeItem ? (
                  <BonusCard 
                    bonus={activeItem} 
                    onAction={handleAction} 
                    isActivatedSlot={true} 
                    onShowRules={setSelectedBonusForRules} 
                  />
              ) : (
                  <div className="h-24 rounded-[2rem] border-2 border-dashed border-slate-800 bg-slate-900/20 flex flex-col items-center justify-center text-slate-700">
                      <div className="p-2 rounded-full bg-slate-800/50 mb-2">
                        <CircleStackIcon className="w-5 h-5" />
                      </div>
                      <p className="text-[10px] font-bold uppercase tracking-widest">等待奖励激活</p>
                  </div>
              )}
          </div>
      );
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white font-sans">
      <PromotionsHeader activePage="myBonuses" setActivePage={setActivePage} />

      <main className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-10">
          
          {/* 1. 置顶激活区 */}
          <section className="space-y-8">
              <ActivationSlot type="bonus" activeItem={topBonus} />
              <ActivationSlot type="voucher" activeItem={topVoucher} />
          </section>

          {/* 2. 其它列表区 */}
          <section className="space-y-5">
              <div className="flex items-center justify-between px-1">
                  <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] italic">全部奖金队列</h3>
                  <div className="flex items-center text-[10px] text-slate-600 font-bold cursor-pointer hover:text-white transition-colors">
                      <QuestionMarkCircleIcon className="w-3.5 h-3.5 mr-1" />
                      排队规则说明
                  </div>
              </div>
              
              <div className="space-y-4 pb-20">
                  {remainingList.length > 0 ? (
                      remainingList.map(bonus => (
                          <BonusCard 
                            key={bonus.id} 
                            bonus={bonus} 
                            onAction={handleAction} 
                            onShowRules={setSelectedBonusForRules} 
                          />
                      ))
                  ) : (
                      <div className="text-center py-10 opacity-30">
                          <p className="text-sm font-bold uppercase tracking-widest">暂无更多奖金记录</p>
                      </div>
                  )}
              </div>
          </section>
      </main>

      {/* 规则详情弹窗 */}
      {selectedBonusForRules && (
          <BonusRulesModal 
            isOpen={!!selectedBonusForRules} 
            bonus={selectedBonusForRules} 
            onClose={() => setSelectedBonusForRules(null)} 
          />
      )}

      {/* 放弃二次确认弹窗 (已优化) */}
      {showForfeitModal && forfeitingBonus && (
          <ForfeitConfirmationModal 
            isOpen={showForfeitModal}
            bonus={forfeitingBonus}
            onClose={() => { setShowForfeitModal(false); setTargetBonusId(null); }}
            onConfirm={confirmForfeit}
          />
      )}
    </div>
  );
};

export default BonusCenterPage;
