
import React, { useState } from 'react';
import { PageView } from '../types';
import { VIP_WELCOME_BENEFITS, VIP_WELCOME_FAQ } from '../constants';
import { FaqItem as FaqItemType } from '../types';
import { ChevronDownIcon, StarIcon } from './icons/GenericIcons';
import PromotionsHeader from './PromotionsHeader';

interface VipWelcomePageProps {
  setActivePage: (page: PageView) => void;
  onBecomeVip: () => void;
  isEmbedded?: boolean;
}

const FaqItem: React.FC<{ item: FaqItemType }> = ({ item }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="bg-slate-800 rounded-lg border border-slate-700">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 text-left"
                aria-expanded={isOpen}
            >
                <span className="font-semibold text-white">{item.question}</span>
                <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-40' : 'max-h-0'}`}>
                <div className="px-4 pb-4 text-gray-300 text-sm">
                    {item.answer}
                </div>
            </div>
        </div>
    );
};


const VipWelcomePage: React.FC<VipWelcomePageProps> = ({ setActivePage, onBecomeVip, isEmbedded = false }) => {
  const rootClasses = isEmbedded 
    ? "bg-slate-900 text-white" 
    : "flex flex-col h-full bg-slate-900 text-white";
  const mainClasses = isEmbedded 
    ? "no-scrollbar" 
    : "flex-1 overflow-y-auto no-scrollbar";

  return (
    <div className={rootClasses}>
      {!isEmbedded && <PromotionsHeader activePage="vipCenter" setActivePage={setActivePage} />}

      <main className={mainClasses}>
        {/* Hero Section */}
        <section 
          className="relative h-64 bg-cover bg-center flex flex-col justify-center items-center text-center p-4" 
          style={{ backgroundImage: "url('https://picsum.photos/seed/vip-hero/800/400?blur=1')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent"></div>
          <div className="relative z-10">
            <StarIcon className="w-12 h-12 text-yellow-400 mx-auto mb-2" />
            <h2 className="text-3xl font-bold text-white drop-shadow-lg">成为 VIP，尊享专属特权</h2>
            <p className="mt-2 text-md text-gray-300">升级为 VIP，解锁更多奖励和服务</p>
          </div>
        </section>

        {/* Fast Track Section */}
        <section className="p-4 transform -translate-y-12">
            <div className="bg-slate-800 p-5 rounded-xl shadow-2xl border border-slate-700">
                <h3 className="text-lg font-semibold text-center text-white mb-4">快速升级为 VIP</h3>
                <p className="text-center text-gray-400 text-sm mb-2">只需完成首次充值即可解锁 VIP 福利！</p>
                <div className="text-center mb-4">
                    <span className="text-3xl font-bold text-yellow-400">¥100.00</span>
                    <span className="text-gray-400"> 起</span>
                </div>
                <button 
                    onClick={onBecomeVip}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold text-lg py-3 px-6 rounded-lg shadow-lg transition-transform hover:scale-[1.02]"
                >
                    立即充值
                </button>
            </div>
        </section>

        {/* Benefits Section */}
        <section id="vip-benefits" className="px-4 pb-6">
          <h3 className="text-2xl font-bold text-white text-center mb-6">VIP 用户尊享权益</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {VIP_WELCOME_BENEFITS.map(benefit => {
              const Icon = benefit.icon;
              return (
                <div key={benefit.id} className="bg-slate-800 p-4 rounded-lg text-center flex flex-col items-center shadow-md">
                  <Icon className="w-10 h-10 text-yellow-400 mb-3" />
                  <h4 className="font-semibold text-white text-sm mb-1">{benefit.name}</h4>
                  <p className="text-xs text-gray-400 leading-snug">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="px-4 pb-6">
            <h3 className="text-2xl font-bold text-white text-center mb-6">常见问题</h3>
            <div className="space-y-2 max-w-2xl mx-auto">
                {VIP_WELCOME_FAQ.map(item => <FaqItem key={item.id} item={item} />)}
            </div>
        </section>

        {!isEmbedded && (
          /* Padding for bottom nav */
          <div className="h-16 sm:h-12"></div>
        )}
      </main>
    </div>
  );
};

export default VipWelcomePage;
