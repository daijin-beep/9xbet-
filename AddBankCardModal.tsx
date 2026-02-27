import React, { useState } from 'react';
import { Bank } from '../types';
import { BANK_LIST } from '../constants';
import { CloseIcon, ChevronDownIcon } from './icons/GenericIcons';

interface AddBankCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddBankCardModal: React.FC<AddBankCardModalProps> = ({ isOpen, onClose }) => {
    const [cardholderName] = useState('CasinoKing'); // Mock, should come from user data
    const [selectedBank, setSelectedBank] = useState<string>('');
    const [accountNumber, setAccountNumber] = useState('');
    const [confirmAccountNumber, setConfirmAccountNumber] = useState('');
    const [fundPassword, setFundPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
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
        // In a real app, here you would call an API to save the card.
        alert('Withdrawal method added successfully!');
        onClose();
    };
    
    const commonInputClasses = "w-full bg-slate-700 text-gray-200 border border-slate-600 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500";

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[100]">
            <div className="bg-slate-800 w-full max-w-md p-6 rounded-lg shadow-xl relative text-white">
                <header className="flex items-center justify-center mb-6 relative">
                    <h2 className="text-xl font-bold">Add Bank Card</h2>
                    <button onClick={onClose} className="absolute top-1/2 -translate-y-1/2 right-0 text-gray-400 hover:text-white"><CloseIcon className="w-6 h-6" /></button>
                </header>
                
                <form onSubmit={handleSubmit} className="space-y-5">
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

                     {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg shadow-lg transition-colors hover:bg-blue-700 disabled:bg-slate-700 disabled:text-gray-500"
                        >
                            Confirm & Bind
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddBankCardModal;