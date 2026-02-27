
import React, { useState } from 'react';
import { PageView, PromotionChannel, ChannelStatus, ChannelGroup } from '../types';
import { MOCK_PROMOTION_CHANNELS } from '../constants';
import { 
    PlusIcon, 
    QrCodeIcon, 
    TrashIcon, 
    EllipsisHorizontalIcon,
    LinkIcon,
    UsersIcon,
    UserGroupIcon,
    CloseIcon,
    CheckIcon,
    ChevronDownIcon,
    PauseCircleIcon,
    PlayCircleIcon
} from './icons/GenericIcons';
import { VKIcon, FacebookIcon, TwitterIcon, TelegramIcon } from './icons/SocialIcons';
import AgentHeader from './AgentHeader';

interface ChannelManagementPageProps {
    setActivePage: (page: PageView) => void;
}

const AddChannelModal: React.FC<{
    onClose: () => void;
    onAdd: (name: string, group: ChannelGroup) => void;
}> = ({ onClose, onAdd }) => {
    const [name, setName] = useState('');
    const [selectedGroup, setSelectedGroup] = useState<ChannelGroup>('Facebook');

    const groups: ChannelGroup[] = ['VK', 'Facebook', 'Twitter', 'Telegram'];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onAdd(name, selectedGroup);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[200] animate-fade-in" onClick={onClose}>
            <div className="bg-slate-900 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden border border-slate-700" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
                    <h3 className="font-bold text-lg text-white">新增推广渠道</h3>
                    <button onClick={onClose} className="p-1 text-gray-400 hover:text-white"><CloseIcon className="w-5 h-5" /></button>
                </header>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">渠道名称</label>
                        <input 
                            type="text" 
                            autoFocus
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="请输入渠道描述名称"
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">渠道类型</label>
                        <div className="grid grid-cols-2 gap-3">
                            {groups.map(group => {
                                const Icon = group === 'VK' ? VKIcon : 
                                             group === 'Facebook' ? FacebookIcon :
                                             group === 'Twitter' ? TwitterIcon : TelegramIcon;
                                
                                const label = group === 'Twitter' ? 'X (Twitter)' : 
                                              group === 'Facebook' ? 'FB (Facebook)' : group;

                                return (
                                    <button
                                        key={group}
                                        type="button"
                                        onClick={() => setSelectedGroup(group)}
                                        className={`flex items-center p-3 rounded-xl border-2 transition-all ${
                                            selectedGroup === group 
                                            ? 'bg-blue-600/20 border-blue-500 text-white' 
                                            : 'bg-slate-800 border-slate-700 text-gray-400 hover:border-slate-600'
                                        }`}
                                    >
                                        <div className={`p-1.5 rounded-lg mr-2 transition-colors ${selectedGroup === group ? 'bg-blue-600 text-white' : 'bg-slate-700'}`}>
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <span className="font-semibold text-sm">{label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <button 
                        disabled={!name.trim()}
                        className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 transition-all active:scale-95"
                    >
                        确认创建
                    </button>
                </form>
            </div>
        </div>
    );
};

const getChannelGroupIcon = (group: ChannelGroup) => {
    switch(group) {
        case 'VK': return <VKIcon className="w-5 h-5" />;
        case 'Facebook': return <FacebookIcon className="w-5 h-5" />;
        case 'Twitter': return <TwitterIcon className="w-5 h-5" />;
        case 'Telegram': return <TelegramIcon className="w-5 h-5" />;
        default: return <LinkIcon className="w-5 h-5" />;
    }
};

const ChannelStatusBadge: React.FC<{ status: ChannelStatus }> = ({ status }) => {
    const config = {
        active: { text: '推广中', classes: 'bg-green-500/20 text-green-400' },
        paused: { text: '已暂停', classes: 'bg-yellow-500/20 text-yellow-400' },
        removed: { text: '已删除', classes: 'bg-slate-600 text-gray-400' },
    };
    const { text, classes } = config[status];
    return <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${classes}`}>{text}</span>;
};

const ChannelCard: React.FC<{
    channel: PromotionChannel;
    onDelete: (id: string) => void;
    onToggleStatus: (id: string) => void;
}> = ({ channel, onDelete, onToggleStatus }) => {
    const [copySuccess, setCopySuccess] = useState(false);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(channel.link).then(() => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        });
    };

    const isPaused = channel.status === 'paused';

    return (
        <div className={`bg-slate-800 p-4 rounded-lg border border-slate-700 space-y-3 transition-opacity ${isPaused ? 'opacity-75' : 'opacity-100'}`}>
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center space-x-2">
                        <div className="p-1 bg-slate-700 rounded-full">{getChannelGroupIcon(channel.group)}</div>
                        <h3 className="font-bold text-white text-md">{channel.name}</h3>
                    </div>
                </div>
                <ChannelStatusBadge status={channel.status} />
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-slate-700/50 p-3 rounded-lg">
                    <p className="text-xs text-gray-400 flex items-center"><UserGroupIcon className="w-4 h-4 mr-1"/> 有效用户</p>
                    <p className="font-semibold text-white text-lg">{channel.effectiveUsers}</p>
                </div>
                <div className="bg-slate-700/50 p-3 rounded-lg">
                    <p className="text-xs text-gray-400 flex items-center"><UsersIcon className="w-4 h-4 mr-1"/> 注册人数</p>
                    <p className="font-semibold text-white text-lg">{channel.registrations}</p>
                </div>
            </div>

            <div className="flex items-stretch bg-slate-700/50 rounded-md p-1">
                <div className="flex items-center space-x-2 p-2 flex-grow">
                    <LinkIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <input type="text" readOnly value={channel.link} className="bg-transparent text-gray-400 text-xs w-full focus:outline-none truncate" />
                </div>
                 <button onClick={handleCopyLink} className={`text-white text-[10px] font-bold py-1 px-3 rounded-md transition-colors whitespace-nowrap ${copySuccess ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                    {copySuccess ? '已复制' : '复制链接'}
                </button>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-700/50">
                <button className="flex items-center space-x-2 text-xs font-semibold text-gray-400 hover:text-yellow-400 transition-colors">
                    <QrCodeIcon className="w-4 h-4"/>
                    <span>二维码</span>
                </button>
                <div className="flex items-center space-x-1">
                    <button 
                        onClick={() => onToggleStatus(channel.id)} 
                        className={`p-2 rounded-full transition-colors ${isPaused ? 'text-green-500 hover:bg-green-500/10' : 'text-yellow-500 hover:bg-yellow-500/10'}`}
                        title={isPaused ? "启用" : "暂停"}
                    >
                        {isPaused ? <PlayCircleIcon className="w-5 h-5" /> : <PauseCircleIcon className="w-5 h-5" />}
                    </button>
                    <button 
                        onClick={() => onDelete(channel.id)} 
                        className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-slate-700 transition-colors"
                        title="删除"
                    >
                        <TrashIcon className="w-5 h-5"/>
                    </button>
                    <button className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-slate-700 transition-colors">
                        <EllipsisHorizontalIcon className="w-5 h-5"/>
                    </button>
                </div>
            </div>
        </div>
    );
};


const ChannelManagementPage: React.FC<ChannelManagementPageProps> = ({ setActivePage }) => {
    const [channels, setChannels] = useState<PromotionChannel[]>(MOCK_PROMOTION_CHANNELS);
    const [filter, setFilter] = useState<'all' | ChannelGroup>('all');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    
    const handleDelete = (id: string) => {
        if (window.confirm('确定要删除该推广渠道吗？删除后该链接将失效。')) {
             setChannels(prev => prev.filter(ch => ch.id !== id));
        }
    };

    const handleToggleStatus = (id: string) => {
        setChannels(prev => prev.map(ch => {
            if (ch.id === id) {
                const newStatus: ChannelStatus = ch.status === 'active' ? 'paused' : 'active';
                return { ...ch, status: newStatus };
            }
            return ch;
        }));
    };

    const handleAddChannel = (name: string, group: ChannelGroup) => {
        const newChannel: PromotionChannel = {
            id: `ch-${Date.now()}`,
            name,
            group,
            link: `https://3rr.com/r/${Math.random().toString(36).substring(7)}`,
            qrCodeUrl: '',
            effectiveUsers: 0,
            registrations: 0,
            status: 'active'
        };
        setChannels(prev => [newChannel, ...prev]);
    };
    
    const filteredChannels = channels.filter(ch => filter === 'all' || ch.group === filter);

    const channelGroups: ('all' | ChannelGroup)[] = ['all', 'VK', 'Facebook', 'Twitter', 'Telegram'];

    return (
        <div className="flex flex-col h-full bg-slate-900 text-white">
            <AgentHeader activePage="channelManagement" setActivePage={setActivePage} />
            
            <main className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
                <section className="flex justify-between items-center">
                    <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
                        {channelGroups.map(group => (
                            <button key={group} onClick={() => setFilter(group)} className={`px-4 py-2 text-sm font-semibold rounded-lg whitespace-nowrap transition-colors ${filter === group ? 'bg-blue-600 text-white' : 'bg-slate-800 text-gray-300 hover:bg-slate-700'}`}>
                                {group === 'all' ? '全部' : group}
                            </button>
                        ))}
                    </div>
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg whitespace-nowrap ml-4 transition-transform active:scale-95 shadow-lg shadow-purple-900/20"
                    >
                        <PlusIcon className="w-5 h-5"/>
                        <span>新增</span>
                    </button>
                </section>
                
                <section className="space-y-3 pb-20">
                    {filteredChannels.length > 0 ? (
                        filteredChannels.map(channel => (
                            <ChannelCard 
                                key={channel.id} 
                                channel={channel}
                                onDelete={handleDelete}
                                onToggleStatus={handleToggleStatus}
                            />
                        ))
                    ) : (
                        <div className="text-center py-16 text-gray-500 italic">
                            没有找到对应的推广渠道。
                        </div>
                    )}
                </section>
            </main>

            {isAddModalOpen && <AddChannelModal onClose={() => setIsAddModalOpen(false)} onAdd={handleAddChannel} />}
        </div>
    );
};

export default ChannelManagementPage;
