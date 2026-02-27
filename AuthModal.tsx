import React, { useState } from 'react';
import { CloseIcon, ChevronDownIcon, CheckboxCheckedIcon, CheckboxIcon } from './icons/GenericIcons';
import { AuthModalView } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView: AuthModalView;
  onLoginSuccess: () => void;
}

// FIX: Added CustomCheckbox implementation to resolve compilation error.
const CustomCheckbox: React.FC<{ id: string; checked: boolean; onChange: (v: boolean) => void; label: React.ReactNode }> = ({ id, checked, onChange, label }) => (
    <label htmlFor={id} className="flex items-start space-x-2 cursor-pointer text-xs text-gray-400 select-none">
        <div className="mt-0.5" onClick={(e) => { e.preventDefault(); onChange(!checked); }}>
            {checked ? <CheckboxCheckedIcon className="w-4 h-4 text-blue-500" /> : <CheckboxIcon className="w-4 h-4 text-gray-600" />}
        </div>
        <span>{label}</span>
    </label>
);

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialView, onLoginSuccess }) => {
  const [view, setView] = useState<AuthModalView>(initialView);
  // FIX: Added currency and agreeTerms state variables to resolve compilation errors.
  const [currency, setCurrency] = useState('RUB');
  const [agreeTerms, setAgreeTerms] = useState(true);
  
  if (!isOpen) return null;

  // FIX: Defined commonInputClasses to resolve compilation error.
  const commonInputClasses = "w-full bg-slate-800 border border-slate-700 rounded-xl py-3.5 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
        <div className="bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-800 p-8 relative">
            <button onClick={onClose} className="absolute top-6 right-6 p-2 text-gray-500 hover:text-white bg-slate-800 rounded-full transition-colors"><CloseIcon className="w-5 h-5" /></button>
            <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-8">{view === 'login' ? 'Welcome Back' : 'Join Now'}</h2>
            <div className="space-y-4">
                <input type="text" placeholder="Username" className={commonInputClasses} />
                <input type="password" placeholder="Password" className={commonInputClasses} />
                {view === 'register' && (
                   <>
                    <div className="relative">
                        <select 
                            value={currency} 
                            onChange={(e) => setCurrency(e.target.value)}
                            className={`${commonInputClasses} appearance-none pr-8`}
                            aria-label="选择币种"
                        >
                        <option value="PKR">PKR (Pakistani Rupee)</option>
                        <option value="RUB">RUB (Russian Ruble)</option>
                        </select>
                        <ChevronDownIcon className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    <p className="text-[10px] text-yellow-400/80 leading-snug">注册币种将决定您后续所有的支付渠道和游戏币种，一经选定无法修改，请谨慎选择。</p>
                    <CustomCheckbox
                        id="agreeTerms"
                        checked={agreeTerms}
                        onChange={setAgreeTerms}
                        label={<>我已年满 18 周岁，且已阅读并同意 <a href="#" className="text-blue-400 hover:underline">《用户隐私协议》</a>和<a href="#" className="text-blue-400 hover:underline">《博彩负责声明》</a></>}
                    />
                   </>
                )}
                <button onClick={onLoginSuccess} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-900/20 transition-all active:scale-95 text-lg uppercase tracking-widest">{view === 'login' ? 'Login' : 'Register'}</button>
            </div>
            <div className="mt-8 text-center">
                <button onClick={() => setView(view === 'login' ? 'register' : 'login')} className="text-sm font-bold text-gray-400 hover:text-white transition-colors underline decoration-gray-700 underline-offset-8 uppercase tracking-widest">{view === 'login' ? 'Create an account' : 'Already have an account?'}</button>
            </div>
        </div>
    </div>
  );
};

export default AuthModal;