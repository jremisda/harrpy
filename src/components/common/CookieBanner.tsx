import React from 'react';

interface CookieBannerProps {
  onAccept: () => void;
  onSettings: () => void;
}

const CookieBanner: React.FC<CookieBannerProps> = ({ onAccept, onSettings }) => {
  return (
    <div className="fixed bottom-0 left-0 w-[28%] z-50 pointer-events-none">
      <div className="w-full bg-black/80 backdrop-blur-md border-t-2 border-r-2 border-[#FCEFDC] shadow-xl px-0 py-0 m-0 flex items-center justify-center pointer-events-auto animate-fade-in">
        <div className="flex flex-col items-start justify-between w-full px-4 py-4 gap-4">
          <div className="text-[#FCEFDC] text-sm font-normal font-satoshi select-none">
            We use cookies (from tools we trust) to make Harrpy faster, smarter, and smoother for you. Want to know more or tweak settings?
          </div>
          <div className="flex flex-row gap-2 w-full">
            <button
              onClick={onSettings}
              className="flex-1 px-4 py-2 border-0 bg-white/10 text-[#FCEFDC] font-normal font-satoshi shadow-none hover:bg-white/20 focus:bg-white/20 transition-colors duration-200 text-sm outline-none focus:ring-2 focus:ring-[#FCEFDC] focus:ring-offset-2 focus:ring-offset-black"
              aria-label="Privacy Settings"
            >
              Settings
            </button>
            <button
              onClick={onAccept}
              className="flex-1 px-4 py-2 border-0 bg-[#FCEFDC] text-black font-normal font-satoshi shadow-none hover:bg-[#ffe3b3] focus:bg-[#ffe3b3] transition-colors duration-200 text-sm outline-none focus:ring-2 focus:ring-[#FCEFDC] focus:ring-offset-2 focus:ring-offset-black"
              aria-label="I agree to cookies"
            >
              I agree
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner; 