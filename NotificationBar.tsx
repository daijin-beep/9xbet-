

import React from 'react';
import { BellIcon } from './icons/GenericIcons';

interface NotificationBarProps {
  onClick: () => void;
}

const NotificationBar: React.FC<NotificationBarProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-yellow-500 text-slate-900 p-2.5 flex items-center justify-center text-sm font-medium w-full text-left sm:text-center"
      aria-label="Get an extra 7% bonus on every deposit! Click to learn more."
    >
      <div className="flex items-center justify-center flex-1">
        <BellIcon className="h-5 w-5 mr-2 flex-shrink-0" />
        <span>Get an extra <span className="font-bold">7% bonus</span> on every deposit !</span>
      </div>
    </button>
  );
};

export default NotificationBar;
