import React, { useState } from 'react';

interface CookieSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (analyticsEnabled: boolean) => void;
  initialAnalyticsEnabled?: boolean;
}

const CookieSettingsModal: React.FC<CookieSettingsModalProps> = ({ isOpen, onClose, onSave, initialAnalyticsEnabled = true }) => {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(initialAnalyticsEnabled);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-[#181818] w-full max-w-4xl mx-4 md:mx-0 p-0 shadow-2xl border border-black/20 flex flex-col relative" style={{ borderRadius: 12 }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close privacy preferences"
          className="absolute top-4 right-4 text-[#FCEFDC]/80 hover:text-[#FFAF53] text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-[#FFAF53] rounded-full z-10 bg-transparent"
          tabIndex={0}
        >
          ×
        </button>
        {/* Header */}
        <header className="px-8 pt-8 pb-4 border-b border-[#FCEFDC]/10">
          <h2 className="text-2xl md:text-3xl font-satoshi font-medium text-[#FCEFDC] mb-2">Privacy Preferences</h2>
          <p className="text-[#FCEFDC]/80 text-base font-satoshi mb-2">We keep it simple: we use cookies to improve your experience, help us understand how people use Harrpy, and make the site faster and safer. Some cookies are essential. Others are optional.</p>
          <p className="text-[#FCEFDC]/80 text-base font-satoshi">You're in control. Choose what you're cool with below.</p>
        </header>

        {/* Required Section */}
        <section className="px-8 pt-6 pb-2">
          <h3 className="text-[#FCEFDC] text-lg font-satoshi font-semibold mb-2 border-b border-[#FCEFDC]/10 pb-1">Required</h3>
          <div className="mb-4 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 py-2">
              <div>
                <span className="font-satoshi text-[#FCEFDC] font-medium">Privacy Policy</span>
                <p className="text-[#FCEFDC]/80 text-sm font-satoshi">You've read and agree to our <a href='/privacy' className='underline hover:text-[#FFAF53] transition-colors'>Privacy Policy</a>.<br/>This one's non-negotiable — it tells you how we handle your info.</p>
              </div>
              <span className="text-[#FCEFDC] text-xs font-satoshi font-medium uppercase tracking-wider">Required</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 py-2">
              <div>
                <span className="font-satoshi text-[#FCEFDC] font-medium">Terms of Use</span>
                <p className="text-[#FCEFDC]/80 text-sm font-satoshi">You've read and agree to our <a href='/terms' className='underline hover:text-[#FFAF53] transition-colors'>Terms of Use</a>.<br/>Also required — these outline what you agree to by joining the waitlist or using the site.</p>
              </div>
              <span className="text-[#FCEFDC] text-xs font-satoshi font-medium uppercase tracking-wider">Required</span>
            </div>
          </div>
        </section>

        {/* Optional Section */}
        <section className="px-8 pt-4 pb-2">
          <h3 className="text-[#FCEFDC] text-lg font-satoshi font-semibold mb-2 border-b border-[#FCEFDC]/10 pb-1">Optional</h3>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 py-2">
            <div>
              <span className="font-satoshi text-[#FCEFDC] font-medium">Analytics Tracking</span>
              <p className="text-[#FCEFDC]/80 text-sm font-satoshi">We use Google Analytics and Vercel to understand how people move through the site — what's working, what's not. It's anonymous, and it helps us build Harrpy better.</p>
            </div>
            {/* Improved Toggle Switch */}
            <label
              className="relative inline-flex items-center cursor-pointer ml-2"
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === ' ' || e.key === 'Enter') setAnalyticsEnabled(v => !v);
              }}
            >
              <input
                type="checkbox"
                checked={analyticsEnabled}
                onChange={() => setAnalyticsEnabled(v => !v)}
                className="sr-only peer"
                aria-checked={analyticsEnabled}
                role="switch"
                tabIndex={-1}
                aria-label="Analytics Tracking"
              />
              <div
                className={`w-12 h-7 bg-[#333] peer-focus:ring-2 peer-focus:ring-[#FFAF53] rounded-full peer peer-checked:bg-[#FFAF53] transition-colors duration-200 border-2 border-[#FCEFDC]/30 flex items-center`}
              >
                <div
                  className={`h-5 w-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${analyticsEnabled ? 'translate-x-5' : 'translate-x-1'}`}
                  style={{ boxShadow: analyticsEnabled ? '0 0 8px #FFAF53' : '0 0 4px #888' }}
                />
              </div>
            </label>
          </div>
        </section>

        {/* Save Button */}
        <div className="px-8 pt-6 pb-8 flex flex-row justify-end border-t border-[#FCEFDC]/10">
          <button
            onClick={() => onSave(analyticsEnabled)}
            className="bg-[#FFAF53] text-black font-satoshi font-medium px-7 py-3 text-base tracking-wide uppercase transition-colors duration-200 hover:bg-[#ffd49a] focus:bg-[#ffd49a] outline-none border-0 rounded-md shadow-md"
          >
            Save Preferences
          </button>
        </div>

        {/* Footer */}
        <footer className="bg-[#181818] border-t border-[#FCEFDC]/10 px-8 py-4 text-[#FCEFDC]/70 text-sm font-satoshi flex flex-col md:flex-row md:items-center md:justify-between gap-2 rounded-b-md">
          <span>Need help? Reach us at <a href="mailto:contact@harrpy.com" className="underline hover:text-[#FFAF53] transition-colors">contact@harrpy.com</a></span>
          <span>Want to change this later? Head to "Cookie Settings" at the bottom of the site.</span>
        </footer>
      </div>
    </div>
  );
};

export default CookieSettingsModal; 