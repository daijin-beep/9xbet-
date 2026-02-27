import React from 'react';
import { ChatBubbleLeftRightIcon, QuestionMarkCircleIcon } from './icons/GenericIcons';

const VipSupport: React.FC = () => {
  return (
    <section className="bg-slate-800 p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-white mb-4">VIP Support & Help</h2>
      <div className="space-y-3">
        <button className="w-full flex items-center justify-between p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
          <div className="flex items-center">
            <ChatBubbleLeftRightIcon className="w-6 h-6 text-green-400 mr-3" />
            <div>
              <p className="text-md font-semibold text-white">Exclusive Customer Service</p>
              <p className="text-xs text-green-400 font-medium">Online</p>
            </div>
          </div>
          <span className="text-xs font-semibold bg-green-500 text-white px-3 py-1 rounded-full">Contact</span>
        </button>
        <button className="w-full flex items-center justify-between p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
          <div className="flex items-center">
            <QuestionMarkCircleIcon className="w-6 h-6 text-blue-400 mr-3" />
            <p className="text-md font-semibold text-white">Frequently Asked Questions</p>
          </div>
          <span className="text-xs font-semibold bg-blue-500 text-white px-3 py-1 rounded-full">View</span>
        </button>
      </div>
    </section>
  );
};

export default VipSupport;
