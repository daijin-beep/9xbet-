import React, { useState, useMemo, useEffect } from 'react';
import { CloseIcon, SearchIcon } from './icons/GenericIcons';
import { LANGUAGES, CURRENCIES } from '../constants';

interface RegionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab: 'language' | 'currency';
  currentLanguage: string;
  onLanguageChange: (langCode: string) => void;
  currentCurrency: string;
  onCurrencyChange: (currencyCode: string) => void;
}

const RegionModal: React.FC<RegionModalProps> = ({
  isOpen,
  onClose,
  defaultTab,
  currentLanguage,
  onLanguageChange,
  currentCurrency,
  onCurrencyChange,
}) => {
  const [activeTab, setActiveTab] = useState<'language' | 'currency'>(defaultTab);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
        setActiveTab(defaultTab);
        setSearchTerm(''); // Reset search on open
    }
  }, [isOpen, defaultTab]);

  const filteredLanguages = useMemo(() => {
    if (!searchTerm) return LANGUAGES;
    const lowercasedFilter = searchTerm.toLowerCase();
    return LANGUAGES.filter(
      (lang) =>
        lang.name.toLowerCase().includes(lowercasedFilter) ||
        lang.nativeName.toLowerCase().includes(lowercasedFilter)
    );
  }, [searchTerm]);

  const filteredCurrencies = useMemo(() => {
    if (!searchTerm) return CURRENCIES;
    const lowercasedFilter = searchTerm.toLowerCase();
    return CURRENCIES.filter(
      (curr) =>
        curr.name.toLowerCase().includes(lowercasedFilter) ||
        curr.code.toLowerCase().includes(lowercasedFilter)
    );
  }, [searchTerm]);

  if (!isOpen) return null;

  const RadioIcon: React.FC<{ checked: boolean }> = ({ checked }) => (
    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${checked ? 'border-blue-500' : 'border-slate-600'}`}>
        {checked && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>}
    </div>
  );

  return (
    <div
      className="fixed inset-0 bg-black/70 flex flex-col items-center justify-end z-[200]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="region-modal-title"
    >
      <div
        className="bg-slate-800 w-full max-w-md h-[80vh] rounded-t-2xl shadow-xl flex flex-col modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center p-4 border-b border-slate-700 flex-shrink-0">
          <div className="flex-1"></div>
          <div className="flex-1 text-center">
             <h2 id="region-modal-title" className="text-lg font-semibold text-white">Region Settings</h2>
          </div>
          <div className="flex-1 flex justify-end">
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-slate-700">
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>
        </header>

        <nav className="flex px-4 border-b border-slate-700 flex-shrink-0">
          <button
            onClick={() => setActiveTab('language')}
            className={`flex-1 py-3 text-sm font-semibold text-center transition-all ${
              activeTab === 'language'
                ? 'text-white border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Bahasa
          </button>
          <button
            onClick={() => setActiveTab('currency')}
            className={`flex-1 py-3 text-sm font-semibold text-center transition-all ${
              activeTab === 'currency'
                ? 'text-white border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Lihat dalam mata uang
          </button>
        </nav>

        <div className="p-4 flex-shrink-0">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input 
                type="text"
                placeholder="Mencari"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-md py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <main className="overflow-y-auto no-scrollbar px-4 pb-4 flex-1">
          {activeTab === 'language' && (
            <div className="space-y-1">
              {filteredLanguages.map((lang) => {
                const isSelected = currentLanguage === lang.code;
                return (
                    <button
                        key={lang.code}
                        onClick={() => {
                            onLanguageChange(lang.code);
                            onClose();
                        }}
                        className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                            isSelected ? 'bg-slate-700' : 'hover:bg-slate-700/50'
                        }`}
                    >
                        <span className={`font-medium ${isSelected ? 'text-white' : 'text-gray-300'}`}>{lang.name}</span>
                        <RadioIcon checked={isSelected} />
                    </button>
                );
              })}
            </div>
          )}

          {activeTab === 'currency' && (
            <div className="space-y-1">
              {filteredCurrencies.map((curr) => {
                const isSelected = currentCurrency === curr.code;
                return (
                     <button
                        key={curr.code}
                        onClick={() => {
                            onCurrencyChange(curr.code);
                            onClose();
                        }}
                        className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                            isSelected ? 'bg-slate-700' : 'hover:bg-slate-700/50'
                        }`}
                    >
                         <span className={`font-medium ${isSelected ? 'text-white' : 'text-gray-300'}`}>{curr.flag} {curr.name} ({curr.code})</span>
                        <RadioIcon checked={isSelected} />
                    </button>
                );
              })}
            </div>
          )}
        </main>
      </div>
       <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .modal-content { animation: slideUp 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default RegionModal;
