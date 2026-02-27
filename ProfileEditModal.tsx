
import React, { useState, useRef, useEffect } from 'react';
import { CloseIcon, ArrowUpTrayIcon } from './icons/GenericIcons';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentNickname: string;
  currentAvatarUrl: string;
  onSave: (newNickname: string, newAvatarUrl: string) => void;
}

const PREDEFINED_AVATARS = [
  'https://picsum.photos/seed/avatar1/100/100',
  'https://picsum.photos/seed/avatar2/100/100',
  'https://picsum.photos/seed/avatar3/100/100',
  'https://picsum.photos/seed/avatar4/100/100',
];

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  currentNickname,
  currentAvatarUrl,
  onSave,
}) => {
  const [nickname, setNickname] = useState(currentNickname);
  const [avatarUrl, setAvatarUrl] = useState(currentAvatarUrl);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setNickname(currentNickname);
    setAvatarUrl(currentAvatarUrl);
    setSelectedFile(null); // Reset file selection when modal reopens or props change
  }, [isOpen, currentNickname, currentAvatarUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePredefinedAvatarSelect = (url: string) => {
    setAvatarUrl(url);
    setSelectedFile(null); // Clear file if predefined is chosen
  };

  const handleSave = () => {
    onSave(nickname, avatarUrl);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[200]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-edit-modal-title"
    >
      <div className="bg-slate-800 w-full max-w-md p-6 rounded-lg shadow-xl relative text-gray-200">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
          aria-label="Close edit profile modal"
        >
          <CloseIcon className="w-6 h-6" />
        </button>

        <h2 id="profile-edit-modal-title" className="text-xl font-semibold mb-6 text-center text-white">
          Edit Profile
        </h2>

        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={avatarUrl}
            alt="Current Avatar"
            className="w-24 h-24 rounded-full object-cover mb-3 border-2 border-slate-600"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
            id="avatarUpload"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded-md flex items-center space-x-2 transition-colors"
            aria-label="Upload new avatar"
          >
            <ArrowUpTrayIcon className="w-5 h-5" />
            <span>Upload Avatar</span>
          </button>
        </div>

        {/* Predefined Avatars */}
        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-2 text-center">Or choose one:</p>
          <div className="flex justify-center space-x-3">
            {PREDEFINED_AVATARS.map((url) => (
              <button
                key={url}
                onClick={() => handlePredefinedAvatarSelect(url)}
                className={`rounded-full w-12 h-12 overflow-hidden border-2 transition-all
                            ${avatarUrl === url && !selectedFile ? 'border-yellow-400 ring-2 ring-yellow-400' : 'border-slate-600 hover:border-slate-400'}`}
                aria-label={`Select avatar ${PREDEFINED_AVATARS.indexOf(url) + 1}`}
              >
                <img src={url} alt={`Predefined avatar ${PREDEFINED_AVATARS.indexOf(url) + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Nickname Section */}
        <div className="mb-6">
          <label htmlFor="nickname" className="block text-sm font-medium text-gray-300 mb-1">
            Nickname
          </label>
          <input
            type="text"
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full bg-slate-700 text-gray-200 placeholder-gray-400 border border-slate-600 rounded-md py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={20}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 bg-slate-600 hover:bg-slate-500 text-gray-300 font-semibold py-2.5 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold py-2.5 rounded-md transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditModal;
