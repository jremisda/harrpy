import React from 'react';

interface CookieBannerProps {
  onAccept: () => void;
  onSettings: () => void;
}

const CookieBanner: React.FC<CookieBannerProps> = ({ onAccept, onSettings }) => {
  return (
    <div className="fixed bottom-0 left-0 w-full z-50 pointer-events-none">
      <div className="w-full bg-black border-t-2 border-[#FCEFDC] shadow-xl px-0 py-0 m-0 flex items-center justify-center pointer-events-auto animate-fade-in">
        <div className="flex flex-row items-center justify-between w-full px-6 md:px-16 py-5 md:py-6 gap-8 overflow-x-auto">
          <div className="flex-1 text-[#FCEFDC] text-base md:text-lg font-normal font-satoshi whitespace-nowrap overflow-x-auto select-none">
            We use cookies (from tools we trust) to make Harrpy faster, smarter, and smoother for you. Want to know more or tweak settings?
          </div>
          <div className="flex flex-row gap-3 md:gap-4 flex-shrink-0">
            <button
              onClick={onSettings}
              className="px-6 py-2 border-0 bg-white/10 text-[#FCEFDC] font-normal font-satoshi shadow-none hover:bg-white/20 focus:bg-white/20 transition-colors duration-200 text-base outline-none focus:ring-2 focus:ring-[#FCEFDC] focus:ring-offset-2 focus:ring-offset-black"
              aria-label="Privacy Settings"
            >
              Privacy Settings
            </button>
            <button
              onClick={onAccept}
              className="px-6 py-2 border-0 bg-[#FCEFDC] text-black font-normal font-satoshi shadow-none hover:bg-[#ffe3b3] focus:bg-[#ffe3b3] transition-colors duration-200 text-base outline-none focus:ring-2 focus:ring-[#FCEFDC] focus:ring-offset-2 focus:ring-offset-black"
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