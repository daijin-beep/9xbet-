
import React, { useState, useMemo } from 'react';
import { PageView, ReferredUser } from '../types';
import { MOCK_REFERRED_USERS } from '../constants';
import { UserGroupIcon, BanknotesIcon, ArrowsUpDownIcon, FilterIcon, SearchIcon, CloseIcon } from './icons/GenericIcons';
import AgentHeader from './AgentHeader';

interface FriendListPageProps {
    setActivePage: (page: PageView) => void;
}

const FriendListPage: React.FC<FriendListPageProps> = ({ setActivePage }) => {
    const [users] = useState<ReferredUser[]>(MOCK_REFERRED_USERS);
    const [sortConfig, setSortConfig] = useState<{ key: keyof ReferredUser; direction: 'asc' | 'dsc' } | null>({key: 'registrationTime', direction: 'dsc'});
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [searchId, setSearchId] = useState('');
    const [selectedUser, setSelectedUser] = useState<ReferredUser | null>(null);

    const handleSort = (key: keyof ReferredUser) => {
        let direction: 'asc' | 'dsc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'dsc';
        }
        setSortConfig({ key, direction });
    };

    const sortedUsers = useMemo(() => {
        let sortableUsers = [...users];
        if (searchId) {
            sortableUsers = sortableUsers.filter(u => u.userId.toLowerCase().includes(searchId.toLowerCase()));
        }

        if (sortConfig !== null) {
            sortableUsers.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableUsers;
    }, [users, sortConfig, searchId]);
    
    const totalRegistered = useMemo(() => users.length, [users]);
    const totalDepositing = useMemo(() => users.filter(u => u.depositAmount > 0).length, [users]);

    const SortableHeader: React.FC<{ sortKey: keyof ReferredUser, children: React.ReactNode }> = ({ sortKey, children }) => {
        return (
            <button onClick={() => handleSort(sortKey)} className="flex items-center space-x-1 text-left group">
                <span>{children}</span>
                <ArrowsUpDownIcon className={`w-3 h-3 transition-colors ${sortConfig?.key === sortKey ? 'text-blue-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
            </button>
        )
    };
    
    const UserDetailModal: React.FC<{ user: ReferredUser, onClose: () => void }> = ({ user, onClose }) => (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[100]" onClick={onClose}>
            <div className="bg-slate-800 w-full max-w-md p-6 rounded-lg shadow-xl" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white">玩家画像摘要</h3>
                    <button onClick={onClose}><CloseIcon className="w-6 h-6 text-gray-400"/></button>
                </div>
                 <div className="space-y-3 text-sm">
                    <div className="flex justify-between p-2 bg-slate-700/50 rounded"><span>会员ID:</span><span className="font-semibold text-white">{user.userId}</span></div>
                    <div className="flex justify-between p-2 bg-slate-700/50 rounded"><span>所属渠道:</span><span className="font-semibold text-white">{user.channel}</span></div>
                    <div className="flex justify-between p-2 bg-slate-700/50 rounded"><span>注册时间:</span><span className="font-semibold text-white">{new Date(user.registrationTime).toLocaleString()}</span></div>
                 </div>
                 <h4 className="font-bold text-lg text-yellow-400 my-4">数据详情</h4>
                 <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-700/50 p-3 rounded-lg text-center">
                        <p className="text-xs text-gray-400">充值金额</p>
                        <p className="font-semibold text-white text-lg">{user.depositAmount.toLocaleString()}</p>
                    </div>
                     <div className="bg-slate-700/50 p-3 rounded-lg text-center">
                        <p className="text-xs text-gray-400">本金投注倍数</p>
                        <p className="font-semibold text-white text-lg">{user.principalBettingMultiple.toFixed(2)}x</p>
                    </div>
                     <div className="bg-slate-700/50 p-3 rounded-lg text-center col-span-2">
                        <p className="text-xs text-gray-400">佣金贡献</p>
                        <p className="font-semibold text-green-400 text-xl">{user.commissionContribution.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                 </div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-slate-900 text-white">
            <AgentHeader activePage="friendList" setActivePage={setActivePage} />
            
            <main className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
                {/* Overview */}
                <section className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                        <p className="text-sm text-gray-400 flex items-center justify-center"><UserGroupIcon className="w-4 h-4 mr-1"/> 注册用户</p>
                        <p className="text-2xl font-bold text-white">{totalRegistered}</p>
                    </div>
                    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                        <p className="text-sm text-gray-400 flex items-center justify-center"><BanknotesIcon className="w-4 h-4 mr-1"/> 充值用户</p>
                        <p className="text-2xl font-bold text-white">{totalDepositing}</p>
                    </div>
                </section>
                
                {/* Filters */}
                <section className="flex items-center space-x-2">
                    <div className="relative flex-grow">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"/>
                        <input type="text" placeholder="搜索会员ID" value={searchId} onChange={e => setSearchId(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-blue-500"/>
                    </div>
                    <button onClick={() => setIsFilterModalOpen(true)} className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-gray-300 font-semibold py-2 px-4 rounded-lg border border-slate-700">
                        <FilterIcon className="w-5 h-5"/>
                        <span>筛选</span>
                    </button>
                </section>

                {/* Member List */}
                <section className="overflow-x-auto no-scrollbar">
                    <table className="w-full min-w-[700px] text-sm text-left text-gray-300">
                        <thead className="text-xs text-gray-400 uppercase bg-slate-800">
                            <tr>
                                <th scope="col" className="px-4 py-3">会员ID</th>
                                <th scope="col" className="px-4 py-3"><SortableHeader sortKey="registrationTime">注册时间</SortableHeader></th>
                                <th scope="col" className="px-4 py-3"><SortableHeader sortKey="depositAmount">充值金额</SortableHeader></th>
                                <th scope="col" className="px-4 py-3"><SortableHeader sortKey="principalBettingMultiple">本金投注倍数</SortableHeader></th>
                                <th scope="col" className="px-4 py-3"><SortableHeader sortKey="commissionContribution">佣金贡献</SortableHeader></th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedUsers.map((user) => (
                                <tr key={user.id} onClick={() => setSelectedUser(user)} className="bg-slate-800/50 border-b border-slate-700 hover:bg-slate-700/50 cursor-pointer">
                                    <td className="px-4 py-3 font-medium text-white">{user.userId}</td>
                                    <td className="px-4 py-3">{new Date(user.registrationTime).toLocaleDateString()}</td>
                                    <td className="px-4 py-3">{user.depositAmount.toLocaleString()}</td>
                                    <td className="px-4 py-3">{user.principalBettingMultiple.toFixed(2)}x</td>
                                    <td className="px-4 py-3 text-green-400 font-semibold">{user.commissionContribution.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </main>
            
            {selectedUser && <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
        </div>
    )
};

export default FriendListPage;
