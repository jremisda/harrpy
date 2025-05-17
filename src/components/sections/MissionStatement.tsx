import React from 'react';

export const MissionStatement: React.FC = () => {
  return (
    <div className="px-6 md:px-12 lg:px-24 pt-8 pb-16">
      <div className="w-full">
        <div className="flex flex-col md:flex-row gap-12 md:gap-16 lg:gap-24">
          {/* Left column - Title and Text content */}
          <div className="w-full md:w-1/2">
            <h2 className="font-headline text-4xl md:text-5xl lg:text-6xl font-black mb-10 leading-tight">
              First stop? Bali's scene.
            </h2>
            
            <div className="space-y-8 text-lg md:text-xl text-gray-600">
              <p>
                This is where Harrpy swipes in first. Verified creators and serious businesses connect instantly through a clean swipe to match flow. No ghosting. No middlemen. A fast way to discover local creative collabs that actually go somewhere.
              </p>
              
              <p>
                Forget cold DMs and overpriced agencies. Harrpy makes finding your next shoot, content partner, or creative project simple and verified. Every user is vetted. Creators show ID. Businesses upload legit documents. Payments and contracts? That's between you. Harrpy just makes the match.
              </p>
              
              <p className="font-medium">
                When the work is done, your profile speaks for itself, with private ratings and public badges that actually matter. <span className="font-bold text-black">Harrpy makes fast feel safe. And the right match could last a career. This is creative work, reworked.</span>
              </p>
            </div>
          </div>
          
          {/* Right column - Image */}
          <div className="w-full md:w-1/2 h-[400px] md:h-[500px]">
            <div className="w-full h-full rounded-[24px] overflow-hidden">
              <img 
                src="/images/bali-bg.png" 
                alt="Bali creative scene" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 