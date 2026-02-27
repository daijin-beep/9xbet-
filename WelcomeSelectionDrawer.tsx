
import React, { useState } from 'react';
import { COUNTRIES, LANGUAGES, CURRENCIES } from '../constants';
import { GlobeAltIcon, CheckIcon, RocketLaunchIcon, SparklesIcon, ChevronRightIcon } from './icons/GenericIcons';

interface WelcomeSelectionDrawerProps {
    isOpen: boolean;
    onConfirm: (countryId: string, langCode: string, currencyCode: string) => void;
}

const WelcomeSelectionDrawer: React.FC<WelcomeSelectionDrawerProps> = ({ isOpen, onConfirm }) => {
    const [selectedCountryId, setSelectedCountryId] = useState(COUNTRIES[0].id);
    const [selectedLangCode, setSelectedLangCode] = useState(COUNTRIES[0].defaultLanguage);

    if (!isOpen) return null;

    const currentCountry = COUNTRIES.find(c => c.id === selectedCountryId)!;
    const currentCurrency = CURRENCIES.find(curr => curr.code === currentCountry.defaultCurrency)!;

    const handleCountrySelect = (country: typeof COUNTRIES[0]) => {
        setSelectedCountryId(country.id);
        setSelectedLangCode(country.defaultLanguage);
    };

    return (
        <div className="fixed inset-0 z-[300] flex flex-col justify-end bg-black/90 backdrop-blur-md animate-fade-in">
            <div className="bg-[#0b101b] rounded-t-[3rem] p-8 shadow-[0_-20px_100px_rgba(0,0,0,0.9)] border-t border-white/10 animate-slide-up max-h-[90vh] flex flex-col overflow-hidden">
                <div className="w-12 h-1.5 bg-slate-800 rounded-full mx-auto mb-8 flex-shrink-0"></div>
                
                <header className="text-center mb-10 space-y-3 flex-shrink-0">
                    <div className="inline-flex p-4 bg-blue-600/20 rounded-[2rem] border border-blue-500/30 mb-2">
                        <SparklesIcon className="w-10 h-10 text-blue-400" />
                    </div>
                    <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Welcome to 3rr Arena</h2>
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-widest px-6 leading-relaxed">
                        Customize your localized experience for the best gaming performance
                    </p>
                </header>

                <main className="flex-1 overflow-y-auto no-scrollbar space-y-10 pb-6 px-2">
                    {/* 1. Country Selection */}
                    <section className="space-y-4">
                        <div className="flex items-center space-x-2 px-1">
                            <GlobeAltIcon className="w-5 h-5 text-blue-500" />
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Select Your Region</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {COUNTRIES.map(country => {
                                const isSelected = selectedCountryId === country.id;
                                return (
                                    <button 
                                        key={country.id}
                                        onClick={() => handleCountrySelect(country)}
                                        className={`relative p-5 rounded-3xl border-2 transition-all flex flex-col items-center justify-center space-y-3 ${
                                            isSelected 
                                            ? 'bg-blue-600/10 border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.2)]' 
                                            : 'bg-slate-900 border-white/5 hover:border-white/10'
                                        }`}
                                    >
                                        <span className="text-4xl drop-shadow-md">{country.flag}</span>
                                        <span className={`text-sm font-black uppercase tracking-tight ${isSelected ? 'text-white' : 'text-slate-500'}`}>
                                            {country.name}
                                        </span>
                                        {isSelected && (
                                            <div className="absolute top-2 right-2 bg-blue-500 p-1 rounded-full">
                                                <CheckIcon className="w-3 h-3 text-white stroke-[3]" />
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    {/* 2. Language Selection (Filtered based on country choice maybe, but here simple) */}
                    <section className="space-y-4">
                         <div className="flex items-center space-x-2 px-1">
                            <RocketLaunchIcon className="w-5 h-5 text-purple-500" />
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Preferred Language</h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {LANGUAGES.map(lang => {
                                const isSelected = selectedLangCode === lang.code;
                                return (
                                    <button
                                        key={lang.code}
                                        onClick={() => setSelectedLangCode(lang.code)}
                                        className={`px-6 py-3 rounded-2xl border-2 transition-all text-sm font-black uppercase tracking-widest ${
                                            isSelected
                                            ? 'bg-purple-600/20 border-purple-500 text-white shadow-lg shadow-purple-900/20'
                                            : 'bg-slate-900 border-white/5 text-slate-500 hover:text-slate-300'
                                        }`}
                                    >
                                        {lang.nativeName}
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    {/* 3. Automatic Currency Insight */}
                    <section className="bg-slate-900/50 rounded-[2rem] p-6 border border-white/5 flex items-center justify-between">
                         <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-yellow-500/20 rounded-2xl flex items-center justify-center border border-yellow-500/20">
                                <span className="text-2xl">{currentCurrency.flag}</span>
                            </div>
                            <div>
                                <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest mb-0.5">Billing Currency</p>
                                <p className="text-base font-black text-white">{currentCurrency.name} ({currentCurrency.code})</p>
                            </div>
                         </div>
                         <div className="p-2 bg-white/5 rounded-full">
                            <CheckIcon className="w-4 h-4 text-green-500" />
                         </div>
                    </section>
                </main>

                <footer className="p-2 pt-6 flex-shrink-0">
                    <button 
                        onClick={() => onConfirm(selectedCountryId, selectedLangCode, currentCountry.defaultCurrency)}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black text-xl py-5 rounded-[2rem] shadow-[0_20px_50px_rgba(59,130,246,0.4)] transition-all active:scale-95 uppercase italic tracking-tighter flex items-center justify-center group"
                    >
                        <span>Start Exploring Arena</span>
                        <ChevronRightIcon className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <p className="text-center text-[9px] text-slate-700 font-bold uppercase tracking-widest mt-6 opacity-40">
                        You can change these settings later in your profile profile
                    </p>
                </footer>
            </div>

            <style>{`
                @keyframes slideUp {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                .animate-slide-up { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .animate-fade-in { animation: fadeIn 0.4s ease-out; }
            `}</style>
        </div>
    );
};

export default WelcomeSelectionDrawer;
