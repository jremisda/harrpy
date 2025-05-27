import React from 'react';
import OptimizedImage from '../common/OptimizedImage';

export const MissionStatement: React.FC = () => {
  return (
    <div className="px-4 sm:px-6 md:px-12 lg:px-24 pt-4 sm:pt-8 pb-8 sm:pb-16">
      <div className="w-full">
        <div className="flex flex-col md:flex-row gap-6 sm:gap-12 md:gap-16 lg:gap-24">
          {/* Left column - Title and Text content */}
          <div className="w-full md:w-1/2">
            <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-10 leading-tight">
              First stop? Bali's scene.
            </h2>
            
            <div className="space-y-4 sm:space-y-8 text-base sm:text-lg md:text-xl text-gray-600">
              <p>
                This is where Harrpy swipes in. A next-gen creator collaboration platform where verified influencers, models, and content creators connect instantly with brands, agencies, and local businesses. No ghosting. No middlemen. Just a clean, swipe-to-match flow that gets you real results. Fast. Local creative collabs. Paid brand deals. No time wasted.
              </p>
              
              <p>
                We're launching first in Bali, the epicenter of creators, brands, and bold ideas. Whether you're a travel influencer, lifestyle creator, or a boutique hotel owner, Harrpy connects you to the right people for photoshoots, content campaigns, and social media collabs right where you are.
              </p>
              
              <p>
                Forget cold DMs and overpriced influencer agencies. This is simpler. Smoother. Fully verified. Creators show ID. Businesses submit real docs. No platform fees. No commission cuts. Payments and contracts? That's between you. Harrpy just gets you in the room.
              </p>
              
              <p className="font-medium">
                When the work's done, your Harrpy profile becomes your creative resume complete with private ratings and public trust badges that actually mean something. Whether you're a micro influencer, emerging model, or social media creator, Harrpy helps you build a verified track record that opens more doors. Harrpy makes fast feel safe. And the right match could last a career. Creative work, reworked. Fast. Trusted. Built for Bali and beyond.
              </p>
            </div>
          </div>
          
          {/* Right column - Image */}
          <div className="w-full md:w-1/2 flex items-stretch mt-4 md:mt-0">
            <div className="w-full h-[280px] sm:h-[400px] md:h-full rounded-[16px] sm:rounded-[24px] overflow-hidden flex-1">
              <OptimizedImage 
                src="https://tdkqhl7odedylxty.public.blob.vercel-storage.com/website/bali-bg-yHFnbWa6y48F2LdvjyWRkoEReip2uw.webp" 
                alt="Bali creative scene" 
                placeholderColor="#e9dbcd"
                style={{ height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 