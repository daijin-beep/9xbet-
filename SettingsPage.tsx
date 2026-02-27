import React, { useState } from 'react';
import { PageView } from '../types';
import { ArrowLeftIcon } from './icons/GenericIcons';
import SettingsProfile from './settings/SettingsProfile';
import SettingsSecurity from './settings/SettingsSecurity';
import SettingsFinancial from './settings/SettingsFinancial';
import SettingsSessions from './settings/SettingsSessions';
import ChangePasswordModal from './settings/modals/ChangePasswordModal';
import BindPhoneModal from './settings/modals/BindPhoneModal';
import BindEmailModal from './settings/modals/BindEmailModal';

interface SettingsPageProps {
  onBack: () => void;
  setActivePage: (page: PageView) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onBack, setActivePage }) => {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col h-full bg-slate-900 text-white">
        <header className="sticky top-0 bg-slate-800 shadow-md z-20 p-3 flex items-center border-b border-slate-700">
          <button 
            onClick={onBack}
            className="p-2 mr-2 text-gray-300 hover:text-yellow-400 rounded-full hover:bg-slate-700 transition-colors"
            aria-label="Go back to profile"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-white">Settings</h1>
        </header>

        <main className="flex-1 overflow-y-auto no-scrollbar p-3 md:p-4 space-y-4">
          <SettingsProfile />
          <SettingsSecurity 
            onChangePasswordClick={() => setIsPasswordModalOpen(true)}
            onBindPhoneClick={() => setIsPhoneModalOpen(true)}
            onBindEmailClick={() => setIsEmailModalOpen(true)}
          />
          <SettingsFinancial onManageMethodsClick={() => setActivePage('withdrawalMethods')} />
          <SettingsSessions />
          
          {/* Padding at the bottom */}
          <div className="h-4"></div>
        </main>
      </div>

      {isPasswordModalOpen && <ChangePasswordModal onClose={() => setIsPasswordModalOpen(false)} />}
      {isPhoneModalOpen && <BindPhoneModal onClose={() => setIsPhoneModalOpen(false)} />}
      {isEmailModalOpen && <BindEmailModal onClose={() => setIsEmailModalOpen(false)} />}
    </>
  );
};

export default SettingsPage;