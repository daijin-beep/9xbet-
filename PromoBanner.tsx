import React from 'react';

interface PromoBannerProps {
  onClick: () => void;
}

const PromoBanner: React.FC<PromoBannerProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="relative rounded-xl overflow-hidden my-4 h-48 bg-cover bg-center p-6 flex flex-col justify-end items-start text-white shadow-lg w-full text-left group transition-transform hover:scale-[1.02]"
      style={{ backgroundImage: "url('https://picsum.photos/seed/dropsfrenzy/800/400')" }}
      aria-label="Drops Frenzy promotion for €15,000. Click for details."
    >
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/70 via-green-600/50 to-transparent transition-all group-hover:from-green-500/80"></div>

      {/* Original Content at the bottom left */}
      <div className="relative z-10">
        <h2 className="text-3xl font-bold leading-tight drop-shadow-md">€15,000</h2>
        <p className="text-xl font-semibold drop-shadow-md">DROPS FRENZY</p>
        <div className="mt-2">
          <span className="bg-black/50 backdrop-blur-sm px-3 py-1 rounded text-sm font-medium">BGAMING</span>
        </div>
      </div>
    </button>
  );
};

export default PromoBanner;
