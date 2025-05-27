import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import OptimizedImage from '../common/OptimizedImage';

export const EarlyAccessBenefits: React.FC = () => {
  const [activeView, setActiveView] = useState<'creators' | 'businesses'>('creators');
  const [isAnimating, setIsAnimating] = useState(false);

  // Prevent any animation on initial render
  const [initialRender, setInitialRender] = useState(true);
  useEffect(() => {
    setInitialRender(false);
  }, []);

  const handleViewChange = (view: 'creators' | 'businesses') => {
    if (view !== activeView && !isAnimating) {
      setIsAnimating(true);
      setActiveView(view);
      // Reset animation state after animation completes
      // Extended to ensure all animations are completed
      setTimeout(() => setIsAnimating(false), 700);
    }
  };

  return (
    <div className="px-4 sm:px-6 md:px-12 lg:px-24 pt-6 sm:pt-8 pb-16 sm:pb-24">
      <div className="w-full">
        <div className="rounded-[24px] sm:rounded-[32px] h-[900px] sm:h-[550px] md:h-[600px] lg:h-[650px] overflow-hidden relative">
          {/* Background images with transition */}
          <div className="absolute inset-0 w-full h-full">
            {/* Creator background */}
            <div 
              className={`absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out ${
                activeView === 'creators' ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <OptimizedImage 
                src="https://tdkqhl7odedylxty.public.blob.vercel-storage.com/website/early-access-background-NogUz6sZtaRKbxnzh5SDVAJnKtUDLs.webp" 
                alt="Early access background" 
                placeholderColor="#242424"
              />
            </div>
            
            {/* Business background */}
            <div 
              className={`absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out ${
                activeView === 'businesses' ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <OptimizedImage 
                src="https://tdkqhl7odedylxty.public.blob.vercel-storage.com/website/business-button-bg-oFxlVHQHJ0UMDUOZ2eLHZwExBuOTNe.webp" 
                alt="Business background" 
                placeholderColor="#242424"
              />
            </div>
          </div>

          <div className="absolute inset-0 p-6 sm:p-12 md:p-16">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 sm:gap-12 h-full">
              <div className="flex-1 flex flex-col">
                <h2 className="font-headline text-5xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-3 sm:mb-6 relative z-10">Early Access.<br />Real Perks.</h2>
                
                {/* Toggle buttons with enhanced styling */}
                <div className="mb-3 sm:mb-6 flex space-x-3 sm:space-x-4 relative z-10">
                  <button 
                    onClick={() => handleViewChange('creators')}
                    className={`px-8 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium rounded-[4px] border transition-colors duration-300 ease-in-out ${
                      activeView === 'creators' 
                        ? 'bg-transparent text-white border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
                        : 'bg-transparent text-white/50 border-white/30 hover:text-white hover:border-white/70'
                    }`}
                    disabled={isAnimating}
                  >
                    Creators
                  </button>
                  <button 
                    onClick={() => handleViewChange('businesses')}
                    className={`px-8 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium rounded-[4px] border transition-colors duration-300 ease-in-out ${
                      activeView === 'businesses' 
                        ? 'bg-transparent text-white border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
                        : 'bg-transparent text-white/50 border-white/30 hover:text-white hover:border-white/70'
                    }`}
                    disabled={isAnimating}
                  >
                    Businesses
                  </button>
                </div>
                
                {/* Common description for both views */}
                <p className="text-base sm:text-lg md:text-xl text-gray-300 relative z-10 mb-1 sm:mb-0">
                  Get early access to Harrpy's first drop. If selected, you'll unlock six months of Harrpy Pro, top placement in the match feed, and much more.
                </p>
              </div>
              
              <div className="w-full md:w-1/2 flex flex-col relative z-10 mt-0 sm:mt-0" style={{ perspective: '1000px' }}>
                <h3 className="font-headline text-white text-lg sm:text-xl mb-3 sm:mb-6 transition-all duration-300 ease-in-out">
                  {activeView === 'creators' ? 'Creator Perks' : 'Business/Agency Perks'}
                </h3>
                
                <div className="relative h-[520px] sm:h-[360px] md:h-[400px]">
                  {/* Creator benefits */}
                  <div 
                    className={`absolute inset-0 space-y-2.5 sm:space-y-4 transition-all ${initialRender ? '' : 'duration-500 ease-out'} will-change-transform will-change-opacity ${
                      activeView === 'creators' 
                        ? 'opacity-100 z-10' 
                        : 'opacity-0 z-0 pointer-events-none'
                    }`}
                    style={{ 
                      transformStyle: 'preserve-3d',
                      backfaceVisibility: 'hidden',
                      transform: activeView === 'creators' || initialRender 
                        ? 'translateZ(0) rotateY(0deg)' 
                        : 'translateZ(0) rotateY(90deg)'
                    }}
                  >
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-5 border border-white/5 shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-shadow duration-300">
                      <p className="text-white text-lg sm:text-xl font-medium">6 Months Free Pro Access</p>
                      <p className="text-sm sm:text-base text-gray-300">Full access to all features including unlimited swipes, advanced filters, and profile visibility boosts.</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-5 border border-white/5 shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-shadow duration-300">
                      <p className="text-white text-lg sm:text-xl font-medium">Top of the Feed</p>
                      <p className="text-sm sm:text-base text-gray-300">Appear first when businesses browse, increasing your chances of being discovered and booked.</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-5 border border-white/5 shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-shadow duration-300">
                      <p className="text-white text-lg sm:text-xl font-medium">Verified & Early</p>
                      <p className="text-sm sm:text-base text-gray-300">Get a verified profile with Early Adopter status to build instant trust as part of the founding creator group.</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-5 border border-white/5 shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-shadow duration-300">
                      <p className="text-white text-lg sm:text-xl font-medium">Lock In 50% Off</p>
                      <p className="text-sm sm:text-base text-gray-300">After your free access, keep Harrpy Pro at half the price for two years.</p>
                    </div>
                  </div>
                  
                  {/* Business benefits */}
                  <div 
                    className={`absolute inset-0 space-y-2.5 sm:space-y-4 transition-all ${initialRender ? '' : 'duration-500 ease-out'} will-change-transform will-change-opacity ${
                      activeView === 'businesses' 
                        ? 'opacity-100 z-10' 
                        : 'opacity-0 z-0 pointer-events-none'
                    }`}
                    style={{ 
                      transformStyle: 'preserve-3d',
                      backfaceVisibility: 'hidden',
                      transform: activeView === 'businesses' && !initialRender 
                        ? 'translateZ(0) rotateY(0deg)' 
                        : 'translateZ(0) rotateY(-90deg)'
                    }}
                  >
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-5 border border-white/5 shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-shadow duration-300">
                      <p className="text-white text-lg sm:text-xl font-medium">6 Months Free Pro Access</p>
                      <p className="text-sm sm:text-base text-gray-300">Unlock unlimited collab briefs, direct replies, and enhanced visibility in the creator feed.</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-5 border border-white/5 shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-shadow duration-300">
                      <p className="text-white text-lg sm:text-xl font-medium">Top of the Feed</p>
                      <p className="text-sm sm:text-base text-gray-300">Your offers appear first to verified creators, increasing exposure and response speed.</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-5 border border-white/5 shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-shadow duration-300">
                      <p className="text-white text-lg sm:text-xl font-medium">Verified & Early</p>
                      <p className="text-sm sm:text-base text-gray-300">Get a verified badge and Early Adopter status that builds trust and shows you're a founding brand.</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-5 border border-white/5 shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-shadow duration-300">
                      <p className="text-white text-lg sm:text-xl font-medium">Lock In 50% Off</p>
                      <p className="text-sm sm:text-base text-gray-300">After your free access, keep Harrpy Pro at half the price for two years.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// For backward compatibility
export const SecuritySection = EarlyAccessBenefits;
export const InnerCircleSection = EarlyAccessBenefits; 