
import React, { useState, useMemo, useEffect } from 'react';
import { CryptoWithdrawalCurrency, Bank } from '../types';
import { WITHDRAWAL_CRYPTO_CURRENCIES, BANK_LIST } from '../constants';
import { CloseIcon, ChevronDownIcon, CreditCardIcon, BanknotesIcon, ArrowLeftIcon } from './icons/GenericIcons';

interface AddWithdrawalMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMethod?: 'crypto' | 'bank';
}

const AddCryptoAddressModal: React.FC<AddWithdrawalMethodModalProps> = ({ isOpen, onClose, defaultMethod = 'crypto' }) => {
    const [methodType, setMethodType] = useState(defaultMethod);

    // Crypto form state
    const [selectedCurrency, setSelectedCurrency] = useState<CryptoWithdrawalCurrency | undefined>(WITHDRAWAL_CRYPTO_CURRENCIES[0]);
    const [selectedNetwork, setSelectedNetwork] = useState<string>(selectedCurrency?.networks?.[0]?.id || '');
    const [address, setAddress] = useState('');
    const [label, setLabel] = useState('');
    
    // Bank form state
    const [cardholderName] = useState('CasinoKing'); // Mock
    const [selectedBank, setSelectedBank] = useState<string>('');
    const [accountNumber, setAccountNumber] = useState('');
    const [confirmAccountNumber, setConfirmAccountNumber] = useState('');
    const [fundPassword, setFundPassword] = useState('');

    const [error, setError] = useState('');

    useEffect(() => {
        if(isOpen) {
            setMethodType(defaultMethod);
            setError('');
            // Reset fields
            const firstCurrency = WITHDRAWAL_CRYPTO_CURRENCIES[0];
            setSelectedCurrency(firstCurrency);
            if (firstCurrency?.networks?.[0]) {
                setSelectedNetwork(firstCurrency.networks[0].id);
            } else {
                setSelectedNetwork('');
            }
            setAddress('');
            setLabel('');
            setSelectedBank('');
            setAccountNumber('');
            setConfirmAccountNumber('');
            setFundPassword('');
        }
    }, [isOpen, defaultMethod]);

    const handleCurrencyChange = (currencyId: string) => {
        const currency = WITHDRAWAL_CRYPTO_CURRENCIES.find(c => c.id === currencyId);
        if (currency) {
            setSelectedCurrency(currency);
            setSelectedNetwork(currency.networks?.[0]?.id || '');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (methodType === 'crypto') {
            if (!address.trim()) {
                setError('Address is required.');
                return;
            }
            if (!label.trim()) {
                setError('Label is required.');
                return;
            }
            if (address.length < 20) {
                 setError('Address seems too short.');
                return;
            }
            alert('Crypto address added successfully!');
        } else { // bank
             if (!selectedBank) {
                setError('Please select a bank.');
                return;
            }
            if (accountNumber.length < 8) {
                setError('Bank account number is too short.');
                return;
            }
            if (accountNumber !== confirmAccountNumber) {
                setError('Account numbers do not match.');
                return;
            }
            if (!fundPassword) {
                setError('Please enter your fund password.');
                return;
            }
            alert('Withdrawal method added successfully!');
        }
        
        onClose();
    };
    
    const commonInputClasses = "w-full bg-slate-700 text-gray-200 border border-slate-600 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500";

    if (!isOpen) return null;

    const renderCryptoForm = () => (
        <>
            <div className="relative">
                <label htmlFor="crypto-currency-select" className="text-sm font-medium text-gray-400 mb-1 block">Currency</label>
                <select id="crypto-currency-select" value={selectedCurrency?.id || ''} onChange={(e) => handleCurrencyChange(e.target.value)} className={`${commonInputClasses} appearance-none`}>
                    <option value="" disabled>Select currency</option>
                    {WITHDRAWAL_CRYPTO_CURRENCIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <ChevronDownIcon className="w-5 h-5 text-gray-400 absolute right-4 top-10 pointer-events-none" />
            </div>
             <div className="relative">
                <label htmlFor="crypto-network-select" className="text-sm font-medium text-gray-400 mb-1 block">Network</label>
                <select id="crypto-network-select" value={selectedNetwork} onChange={(e) => setSelectedNetwork(e.target.value)} className={`${commonInputClasses} appearance-none`}>
                    <option value="" disabled>Select network</option>
                    {selectedCurrency?.networks?.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
                </select>
                <ChevronDownIcon className="w-5 h-5 text-gray-400 absolute right-4 top-10 pointer-events-none" />
            </div>
            <div>
                <label htmlFor="crypto-address" className="text-sm font-medium text-gray-400 mb-1 block">Address</label>
                <input id="crypto-address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter withdrawal address" className={commonInputClasses}/>
            </div>
             <div>
                <label htmlFor="crypto-label" className="text-sm font-medium text-gray-400 mb-1 block">Label</label>
                <input id="crypto-label" type="text" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g., My Binance Wallet" className={commonInputClasses}/>
            </div>
        </>
    );

    const renderBankForm = () => (
        <>
            <div>
                <label className="text-sm font-medium text-gray-400 mb-1 block">Cardholder Name</label>
                <input
                    type="text"
                    value={cardholderName}
                    readOnly
                    className="w-full bg-slate-900 text-gray-300 border border-slate-700 rounded-md py-3 px-4 cursor-not-allowed"
                />
            </div>
             <div className="relative">
                <label htmlFor="bank-select" className="text-sm font-medium text-gray-400 mb-1 block">Bank Name</label>
                <select
                    id="bank-select"
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className={`${commonInputClasses} appearance-none`}
                >
                    <option value="" disabled>-- Select your bank --</option>
                    {BANK_LIST.map(bank => (
                        <option key={bank.id} value={bank.id}>{bank.name}</option>
                    ))}
                </select>
                <ChevronDownIcon className="w-5 h-5 text-gray-400 absolute right-4 top-10 pointer-events-none" />
            </div>
            <div>
                <label htmlFor="account-number" className="text-sm font-medium text-gray-400 mb-1 block">Bank Account Number</label>
                <input
                    id="account-number"
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter account number"
                    className={commonInputClasses}
                    inputMode="numeric"
                />
            </div>
             <div>
                <label htmlFor="confirm-account-number" className="text-sm font-medium text-gray-400 mb-1 block">Confirm Account Number</label>
                <input
                    id="confirm-account-number"
                    type="text"
                    value={confirmAccountNumber}
                    onChange={(e) => setConfirmAccountNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="Re-enter account number"
                    className={commonInputClasses}
                    inputMode="numeric"
                />
            </div>
             <div>
                <label htmlFor="fund-password" className="text-sm font-medium text-gray-400 mb-1 block">Fund Password</label>
                <input
                    id="fund-password"
                    type="password"
                    value={fundPassword}
                    onChange={(e) => setFundPassword(e.target.value)}
                    placeholder="Enter your fund password"
                    className={commonInputClasses}
                />
            </div>
        </>
    );
    
    const MethodTypeCard: React.FC<{ type: 'crypto' | 'bank', label: string, Icon: React.FC<any> }> = ({ type, label, Icon }) => {
        const isActive = methodType === type;
        return (
             <button
                type="button"
                onClick={() => setMethodType(type)}
                className={`flex-1 p-4 rounded-lg flex items-center justify-center space-x-3 transition-all border-2 ${isActive ? 'bg-blue-600/20 border-blue-500' : 'bg-slate-700 border-slate-600 hover:border-slate-500'}`}
             >
                <Icon className={`w-8 h-8 ${isActive ? 'text-blue-400' : 'text-gray-400'}`} />
                <span className={`text-lg font-semibold ${isActive ? 'text-white' : 'text-gray-300'}`}>{label}</span>
             </button>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[210]">
            <div className="bg-slate-800 w-full max-w-md p-6 rounded-lg shadow-xl relative text-white">
                <header className="flex items-center justify-center mb-6 relative">
                    <button onClick={onClose} className="absolute top-1/2 -translate-y-1/2 left-0 text-gray-400 hover:text-white" aria-label="Go back">
                        <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                    <h2 className="text-xl font-bold">New Withdraw Method</h2>
                </header>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="flex space-x-3">
                       <MethodTypeCard type="crypto" label="Crypto" Icon={CreditCardIcon} />
                       <MethodTypeCard type="bank" label="Bank" Icon={BanknotesIcon} />
                    </div>
                    
                    {methodType === 'crypto' ? renderCryptoForm() : renderBankForm()}
                    
                    {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                    
                    <div className="pt-4">
                        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg shadow-lg transition-colors hover:bg-blue-700">
                            Confirm & Add
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCryptoAddressModal;
