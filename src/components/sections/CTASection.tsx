import React, { useState, useEffect } from 'react';
import Toast from '../common/Toast';

interface CTASectionProps {
  onEmailSubmit: (email: string) => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onEmailSubmit }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

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
  
  return (
    <div className="relative">
      <div className="px-6 md:px-12 lg:px-24">
        <div className="h-0.5 w-full bg-[#121212] mb-3"></div>
      </div>
      
      <div className="px-6 md:px-12 lg:px-24 pt-8 pb-10">
        <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-8 md:gap-0">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-black">
            Ready to join Harrpy?
          </h2>
          
          <div className="w-full md:w-[480px]">
            <form onSubmit={handleSubmit} className="relative">
              <input
                type="email"
                placeholder="Enter your email to get chosen"
                className={`w-full px-6 py-4 rounded-[8px] bg-[#FFF5E9] text-black placeholder-black/60 border ${error ? 'border-black/50 ring-1 ring-black/30' : 'border-black/20'} focus:outline-none focus:border-black pr-[140px]`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <button
                  type="submit"
                  className="px-6 py-3 bg-transparent text-black font-medium rounded-[4px] border border-black shadow-[0_0_15px_rgba(0,0,0,0.2)] hover:bg-black/5 transition-colors duration-300 ease-in-out whitespace-nowrap"
                >
                  Join Waitlist
                </button>
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
    </div>
  );
}; 