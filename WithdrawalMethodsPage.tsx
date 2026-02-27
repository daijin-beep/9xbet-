import React, { useState } from 'react';
import { PageView, UserBankCard, UserCryptoAddress } from '../types';
import { USER_BANK_CARDS, USER_CRYPTO_ADDRESSES } from '../constants';
import { ArrowLeftIcon, BanknotesIcon, TrashIcon, CreditCardIcon, UsdtIcon, BtcIcon, EthIcon } from './icons/GenericIcons';

interface WithdrawalMethodsPageProps {
  setActivePage: (page: PageView) => void;
  onBack: () => void;
  onAddBankCard: () => void;
  onAddCryptoAddress: () => void;
}

const getCryptoIcon = (currency: string) => {
    switch (currency.toLowerCase()) {
        case 'usdt': return <UsdtIcon className="w-10 h-10" />;
        case 'btc': return <BtcIcon className="w-10 h-10" />;
        case 'eth': return <EthIcon className="w-10 h-10" />;
        default: return <CreditCardIcon className="w-10 h-10 text-gray-400" />;
    }
};

const WithdrawalMethodsPage: React.FC<WithdrawalMethodsPageProps> = ({ setActivePage, onBack, onAddBankCard, onAddCryptoAddress }) => {
    const [activeTab, setActiveTab] = useState<'crypto' | 'bank'>('crypto');
    const [bankCards, setBankCards] = useState<UserBankCard[]>(USER_BANK_CARDS);
    const [cryptoAddresses, setCryptoAddresses] = useState<UserCryptoAddress[]>(USER_CRYPTO_ADDRESSES);
  
    // In a real app, deletion would involve an API call and likely a confirmation modal.
    const handleDeleteBankCard = (id: string) => {
        setBankCards(current => current.filter(card => card.id !== id));
    };
    
    const handleDeleteCryptoAddress = (id: string) => {
        setCryptoAddresses(current => current.filter(addr => addr.id !== id));
    };

    const renderCryptoAddresses = () => (
        <div className="space-y-3">
            {cryptoAddresses.length > 0 ? (
                cryptoAddresses.map(addr => (
                    <div key={addr.id} className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="p-1 bg-slate-700 rounded-full mr-4">
                                {getCryptoIcon(addr.currency)}
                            </div>
                            <div>
                                <p className="font-semibold text-white">{addr.label} <span className="text-xs text-gray-400">({addr.network})</span></p>
                                <p className="text-sm text-gray-400 font-mono">{addr.address.substring(0, 6)}...{addr.address.slice(-6)}</p>
                            </div>
                        </div>
                        <button onClick={() => handleDeleteCryptoAddress(addr.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-slate-700 rounded-full">
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </div>
                ))
            ) : (
                <div className="text-center text-gray-500 py-16">
                    <CreditCardIcon className="w-16 h-16 mb-4 text-slate-700 mx-auto" />
                    <p className="text-lg">No Crypto Addresses.</p>
                    <p className="text-sm">Add an address to get started.</p>
                </div>
            )}
        </div>
    );

    const renderBankCards = () => (
        <div className="space-y-3">
            {bankCards.length > 0 ? (
                bankCards.map(card => (
                    <div key={card.id} className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex items-center justify-between">
                        <div className="flex items-center">
                            <img src={card.logoUrl} alt={card.bankName} className="w-10 h-10 rounded-full mr-4" />
                            <div>
                                <p className="font-semibold text-white">{card.bankName}</p>
                                <p className="text-sm text-gray-400 font-mono">{card.accountNumber}</p>
                            </div>
                        </div>
                        <button onClick={() => handleDeleteBankCard(card.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-slate-700 rounded-full">
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </div>
                ))
            ) : (
                <div className="text-center text-gray-500 py-16">
                    <BanknotesIcon className="w-16 h-16 mb-4 text-slate-700 mx-auto" />
                    <p className="text-lg">No Bank Cards.</p>
                    <p className="text-sm">Add a bank card to get started.</p>
                </div>
            )}
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-slate-900 text-white">
            <header className="sticky top-0 bg-slate-800 shadow-md z-20 p-3 flex items-center border-b border-slate-700">
                <button 
                    onClick={onBack}
                    className="p-2 mr-2 text-gray-300 hover:text-yellow-400 rounded-full hover:bg-slate-700 transition-colors"
                    aria-label="Go back"
                >
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold text-white">Withdrawal Methods</h1>
            </header>

            <nav className="flex-shrink-0 bg-slate-800 border-b border-slate-700 flex">
                <button
                    onClick={() => setActiveTab('crypto')}
                    className={`flex-1 py-3 text-sm font-semibold text-center transition-all ${activeTab === 'crypto' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400'}`}
                >
                    Crypto Addresses
                </button>
                <button
                    onClick={() => setActiveTab('bank')}
                    className={`flex-1 py-3 text-sm font-semibold text-center transition-all ${activeTab === 'bank' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400'}`}
                >
                    Bank Cards
                </button>
            </nav>

            <main className="flex-1 overflow-y-auto no-scrollbar p-3 pb-24">
                {activeTab === 'crypto' ? renderCryptoAddresses() : renderBankCards()}
            </main>

            <footer className="absolute bottom-0 left-0 right-0 p-4 bg-slate-900/80 backdrop-blur-sm border-t border-slate-700">
                <button
                    onClick={activeTab === 'crypto' ? onAddCryptoAddress : onAddBankCard}
                    className="w-full flex items-center justify-center text-center bg-blue-600 p-4 rounded-lg hover:bg-blue-700 transition-colors text-white font-semibold"
                >
                    <CreditCardIcon className="w-5 h-5 mr-2" />
                    <span>{activeTab === 'crypto' ? 'Add New Crypto Address' : 'Add New Bank Card'}</span>
                </button>
            </footer>
        </div>
    );
};

export default WithdrawalMethodsPage;