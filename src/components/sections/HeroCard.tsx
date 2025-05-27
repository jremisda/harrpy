import React, { useEffect, useState } from 'react';
import Button from '../common/Button';
import Toast from '../common/Toast';
import OptimizedImage from '../common/OptimizedImage';

interface HeroCardProps {
  onEmailSubmit: (email: string) => void;
  onOpenWaitlist?: () => void;
}

export const HeroCard: React.FC<HeroCardProps> = ({ onEmailSubmit, onOpenWaitlist }) => {
  const [animated, setAnimated] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Start animation after component is mounted
    const timer = setTimeout(() => {
      setAnimated(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Reset error when email changes
  useEffect(() => {
    if (error) {
      setError(null);
    }
  }, [email]);

  const validateEmail = (email: string): boolean => {
    // Basic email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please include an \'@\' in the email address');
      return;
    }

    onEmailSubmit(email);
    setEmail(''); // Clear the input
  };

  const handleJoinWaitlist = () => {
    if (onOpenWaitlist) {
      onOpenWaitlist();
      return;
    }

    // Fallback to form submission if no direct waitlist opener provided
    handleSubmit(new Event('submit') as unknown as React.FormEvent);
  };

  return (
    <div className="px-4 sm:px-6 md:px-12 lg:px-24 pb-6 sm:pb-12">
      <div className="relative w-full h-[420px] md:h-[400px] rounded-[24px] sm:rounded-[32px] overflow-hidden">
        {/* Image background */}
        <div className="absolute inset-0 w-full h-full">
          <OptimizedImage 
            src="https://tdkqhl7odedylxty.public.blob.vercel-storage.com/website/hero-background-jNdT5rAkZJuFIayFPP6AxGUVNyiNqv.webp" 
            alt="Hero background"
            eager={true} // This is above the fold, so load eagerly
            placeholderColor="#f4e9db"
          />
          {/* Very subtle overlay */}
          <div className="absolute inset-0 bg-black/10"></div>
        </div>
        
        <div className="relative h-full px-4 py-8 sm:px-6 sm:py-12 md:p-12 lg:p-16 flex flex-col">
          {/* Main SEO Heading - removed as per user request */}
          <div className="flex justify-end mb-4">
            <p className="text-black text-lg md:text-xl max-w-md text-right font-medium">
              Where verified creators &<br />
              local businesses connect<br />
              fast, direct, and with zero BS.
            </p>
          </div>
          
          <div className="mt-auto">
            <form onSubmit={handleSubmit} className="relative">
              <div className="flex flex-col sm:flex-row sm:relative">
                <input
                  type="email"
                  id="hero-email"
                  name="email"
                  placeholder="Enter your email to get chosen"
                  className="w-full px-4 sm:px-6 py-4 rounded-[8px] bg-white/20 backdrop-blur-sm text-white placeholder-white/70 border border-white/30 focus:outline-none sm:pr-[140px] mb-3 sm:mb-0 min-h-[48px]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <div className="sm:absolute sm:right-2 sm:top-1/2 sm:transform sm:-translate-y-1/2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleJoinWaitlist}
                    className="w-full sm:w-auto px-6 py-3 bg-transparent text-black font-medium rounded-[4px] border border-black shadow-[0_0_15px_rgba(0,0,0,0.2)] hover:bg-black/5 transition-colors duration-300 ease-in-out whitespace-nowrap min-h-[48px]"
                  >
                    Join Waitlist
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Toast Error */}
      {error && (
        <Toast 
          message={error} 
          type="error" 
          onClose={() => setError(null)}
        />
      )}
      
      <div className="text-center py-4 sm:py-6 text-black mt-2 overflow-hidden">
        <div 
          className={`transition-all duration-700 ease-in-out ${
            animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Mobile version */}
          <div className="sm:hidden flex flex-col items-center text-lg">
            <span className="inline-block animate-bounce-down text-xl mb-2">▼</span>
            <div className="mb-1">
              <span className="font-semibold">6 months free Harrpy Pro.</span>
            </div>
            <div className="mb-1">
              <span className="animate-pulse inline-block">250+ already applied.</span>
            </div>
            <div className="mb-2">
              <span className="relative inline-block">
                You next?
              </span>
            </div>
            <span className="inline-block animate-bounce-down text-xl">▼</span>
          </div>
          
          {/* Desktop version */}
          <div className="hidden sm:block">
            <span className="inline-block animate-bounce-down mr-2 text-base sm:text-xl">▼</span>
            <span className="font-semibold">6 months free Harrpy Pro.</span>{' '}
            <span className="animate-pulse inline-block">250+ already applied.</span>{' '}
            <span className="relative inline-block">
              You next?
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black origin-left transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
            </span>
            <span className="inline-block animate-bounce-down ml-2 text-base sm:text-xl">▼</span>
          </div>
        </div>
      </div>
    </div>
  );
}; 