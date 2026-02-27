import React, { useState, useEffect } from 'react';
import { CloseIcon } from './icons/GenericIcons';

interface VerificationModalProps {
  onClose: () => void;
  onConfirm: (code: string) => Promise<boolean>;
  actionDescription: string;
  contactMethod: string;
}

const VerificationModal: React.FC<VerificationModalProps> = ({
  onClose,
  onConfirm,
  actionDescription,
  contactMethod,
}) => {
  const [code, setCode] = useState('');
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendCode = () => {
    if (timer === 0) {
      setTimer(60);
      // In a real app, an API call would be made here to send the code
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const success = await onConfirm(code);
    setIsLoading(false);
    if (!success) {
      setError('Invalid verification code. Please try again.');
    }
  };
  
  const commonInputClasses = "w-full bg-slate-700 text-gray-200 border border-slate-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[100]">
      <div className="bg-slate-800 w-full max-w-sm p-6 rounded-lg shadow-xl relative text-gray-200">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white"><CloseIcon className="w-6 h-6" /></button>
        <h2 className="text-xl font-semibold mb-2 text-center text-white">Security Verification</h2>
        <p className="text-sm text-gray-400 text-center mb-4">
            To {actionDescription}, please enter the verification code sent to {contactMethod}.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="verification-code" className="text-sm font-medium text-gray-300 mb-1 block">Verification Code</label>
            <div className="flex items-center space-x-2">
              <input 
                id="verification-code"
                type="text" 
                value={code} 
                onChange={e => setCode(e.target.value)} 
                maxLength={6} 
                className={commonInputClasses} 
                required 
                inputMode="numeric"
              />
              <button 
                type="button"
                onClick={handleSendCode} 
                disabled={timer > 0} 
                className="text-sm text-blue-400 disabled:text-gray-500 disabled:cursor-not-allowed whitespace-nowrap px-3 py-2 bg-slate-700 rounded-md"
              >
                {timer > 0 ? `Resend (${timer}s)` : 'Send Code'}
              </button>
            </div>
          </div>
          
          {error && <p className="text-sm text-red-400 text-center">{error}</p>}

          <div className="pt-2">
            <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 font-semibold py-2.5 rounded-md disabled:bg-slate-600 disabled:cursor-wait"
            >
              {isLoading ? 'Verifying...' : 'Confirm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerificationModal;
