
import React, { useState } from 'react';
import { CloseIcon, GiftIcon, CheckIcon, InformationCircleIcon, PhotoIcon, BanknotesIcon } from './icons/GenericIcons';

interface Message {
  id: string;
  type: 'system' | 'activity';
  title: string;
  content: string;
  date: string;
  read: boolean;
  rewardAmount?: number; // 奖励金额
  imageUrl?: string;    // 图片链接
}

const MOCK_MESSAGES: Message[] = [
  { 
    id: '1', 
    type: 'activity', 
    title: '首存红利到账通知', 
    content: '您的首次充值 5000 RUB 已成功，额外赠送的 50% Bonus 已发放至您的红利钱包，请点击下方按钮领取激活。', 
    date: '10:30 AM', 
    read: false,
    rewardAmount: 2500
  },
  { 
    id: '2', 
    type: 'system', 
    title: '系统升级维护公告', 
    content: '为了提供更稳定的服务，我们将于本周日凌晨 02:00 进行停机维护，预计耗时 2 小时。给您带来的不便敬请谅解。', 
    date: 'Yesterday', 
    read: true 
  },
  { 
    id: '3', 
    type: 'activity', 
    title: '新游戏：埃及之秘上线', 
    content: '探索古埃及神秘宝藏，全新 5x3 老虎机现已开启。现在进入游戏即可享受 1.5 倍流水贡献系数！', 
    date: '2 days ago', 
    read: false,
    imageUrl: 'https://picsum.photos/seed/egypt/600/300'
  },
  { 
    id: '4', 
    type: 'system', 
    title: '账号登录异常提醒', 
    content: '检测到您的账号在莫斯科进行了新设备登录。如果不是您本人操作，请立即前往设置中心修改登录密码。', 
    date: '3 days ago', 
    read: true 
  },
  { 
    id: '5', 
    type: 'activity', 
    title: 'VIP 等级晋升礼', 
    content: '恭喜您晋升至 VIP 3 Gold 等级！我们为您准备了专属晋级现金券奖励，点击立即领取。', 
    date: '1 week ago', 
    read: true,
    rewardAmount: 500
  },
];

interface InboxDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const MessageCard: React.FC<{ 
  msg: Message; 
  onToggleRead: (id: string) => void;
  onClaim: (id: string, amount: number) => void;
}> = ({ msg, onToggleRead, onClaim }) => {
  const isReward = !!msg.rewardAmount;
  const isImage = !!msg.imageUrl;

  return (
    <div 
      onClick={() => !msg.read && onToggleRead(msg.id)}
      className={`relative w-full bg-slate-800/80 rounded-[1.5rem] overflow-hidden border transition-all duration-300 shadow-xl ${
        !msg.read ? 'border-blue-500/40 ring-1 ring-blue-500/20' : 'border-transparent opacity-80'
      }`}
    >
      {/* 图片部分 */}
      {isImage && (
        <div className="relative h-32 w-full overflow-hidden">
          <img src={msg.imageUrl} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-800 via-transparent to-transparent"></div>
        </div>
      )}

      <div className="p-4 space-y-3">
        {/* 标题与类型 */}
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
              msg.type === 'activity' ? 'bg-pink-500/20 text-pink-500' : 'bg-blue-500/20 text-blue-500'
            }`}>
              {msg.type === 'activity' ? '活动优惠' : '系统通知'}
            </span>
            <h4 className={`text-[13px] font-black tracking-tight ${!msg.read ? 'text-white' : 'text-slate-400'}`}>
              {msg.title}
            </h4>
          </div>
          <span className="text-[9px] text-slate-600 font-bold uppercase whitespace-nowrap">{msg.date}</span>
        </div>

        {/* 内容文本 */}
        <p className={`text-[11px] leading-relaxed font-medium ${!msg.read ? 'text-slate-300' : 'text-slate-500'}`}>
          {msg.content}
        </p>

        {/* 奖励区块 */}
        {isReward && (
          <div className="mt-2 bg-slate-900/60 rounded-2xl p-3 border border-white/5 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-yellow-500/10 rounded-xl">
                <BanknotesIcon className="w-4 h-4 text-yellow-500" />
              </div>
              <div>
                <p className="text-[8px] text-slate-500 font-black uppercase">可领取奖励</p>
                <p className="text-sm font-black text-white font-mono">{msg.rewardAmount?.toLocaleString()} <span className="text-[10px] text-slate-600">RUB</span></p>
              </div>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); onClaim(msg.id, msg.rewardAmount!); }}
              className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black px-4 py-2 rounded-xl shadow-lg shadow-blue-900/40 transition-all active:scale-95 uppercase tracking-widest flex items-center"
            >
              <GiftIcon className="w-3 h-3 mr-1.5" />
              立即领取
            </button>
          </div>
        )}

        {/* 未读状态指示器 */}
        {!msg.read && (
          <div className="absolute top-3 right-3 flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
          </div>
        )}
      </div>
    </div>
  );
};

const InboxDrawer: React.FC<InboxDrawerProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'system' | 'activity'>('all');
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);

  if (!isOpen) return null;

  const filteredMessages = messages.filter(msg => {
    if (activeTab === 'all') return true;
    return msg.type === activeTab;
  });

  const handleToggleRead = (id: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
  };

  const handleClaim = (id: string, amount: number) => {
    alert(`成功领取奖励: ${amount} RUB`);
    handleToggleRead(id); // 领取后自动标记为已读
  };

  const markAllRead = () => {
    setMessages(prev => prev.map(m => ({ ...m, read: true })));
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-start animate-fade-in">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Drawer Container */}
      <div className="relative w-full bg-[#0a0f1d] rounded-b-[2.5rem] shadow-2xl h-[80vh] flex flex-col transform transition-transform duration-300 ease-out animate-slide-down border-b border-white/5 mt-14 sm:mt-16 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5 bg-slate-900/50">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-black text-white italic tracking-tighter uppercase">消息中心</h2>
            <div className="bg-slate-800 px-2.5 py-1 rounded-lg text-[9px] font-black text-slate-500 border border-white/5">
              {messages.filter(m => !m.read).length} NEW
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={markAllRead}
              className="text-[10px] font-black text-slate-500 hover:text-blue-400 uppercase tracking-widest transition-colors mr-2"
            >
              全部已读
            </button>
            <button onClick={onClose} className="p-2 text-gray-500 hover:text-white rounded-full bg-white/5 transition-colors">
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex px-5 pt-3 border-b border-white/5 bg-slate-900/20">
          {(['all', 'system', 'activity'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 pb-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative ${
                activeTab === tab ? 'text-blue-400' : 'text-slate-600 hover:text-slate-400'
              }`}
            >
              {tab === 'all' ? '全部消息' : tab === 'system' ? '系统公告' : '优惠动态'}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-1/4 w-1/2 h-0.5 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.6)]"></div>
              )}
            </button>
          ))}
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
          {filteredMessages.length > 0 ? (
            filteredMessages.map((msg) => (
              <MessageCard 
                key={msg.id} 
                msg={msg} 
                onToggleRead={handleToggleRead}
                onClaim={handleClaim}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-700 space-y-4 py-12">
              <div className="p-8 bg-slate-900/50 border border-white/5 rounded-[2rem] shadow-inner">
                <InformationCircleIcon className="w-16 h-16 text-slate-800" />
              </div>
              <div className="text-center">
                <p className="text-xl font-black uppercase italic tracking-tighter text-slate-800">这里空空如也</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-800/50">Inbox is empty</p>
              </div>
            </div>
          )}
          <div className="h-10"></div>
        </div>
      </div>

      <style>{`
        .animate-fade-in { animation: fadeIn 0.2s ease-out; }
        .animate-slide-down { animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideDown { from { transform: translateY(-100%); } to { transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default InboxDrawer;
