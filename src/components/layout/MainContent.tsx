import React from 'react';
import { HeroCard } from '../sections/HeroCard';
import { MissionStatement } from '../sections/MissionStatement';
import { EarlyAccessBenefits } from '../sections/EarlyAccessBenefits';
import SEO from '../common/SEO';
import SocialMediaIcons from '../common/SocialMediaIcons';
import StructuredData from '../common/StructuredData';
import OptimizedImage from '../common/OptimizedImage';

interface MainContentProps {
  onEmailSubmit: (email: string) => void;
  onOpenWaitlist?: () => void;
}

export const MainContent: React.FC<MainContentProps> = ({ onEmailSubmit, onOpenWaitlist }) => {
  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      <h1 className="sr-only">Find Brand Deals. Hire Influencers. Collaborate Instantly.</h1>
      <SEO
        title="Harrpy | Creator Collaboration Platform & Influencer App for Brand Deals"
        description="Harrpy is the creator collaboration platform and influencer collaboration app for brand deals. Hire influencers for campaigns or swipe to match with creators—fast, direct, and verified."
      />
      <StructuredData
        pageType="home"
        url={typeof window !== 'undefined' ? window.location.origin : 'https://harrpy.com'}
        title="Harrpy | Swipe. Match. Collab"
        description="Connect with verified creators and local businesses through swipe-to-match collabs. Trusted, fast, and BS-free. Join the waitlist now."
        imageUrl="/images/harrpy-social.png"
      />
      
      <HeroCard onEmailSubmit={onEmailSubmit} onOpenWaitlist={onOpenWaitlist} />
      
      <section id="early-access">
        <EarlyAccessBenefits />
      </section>
      
      <section id="mission">
        <MissionStatement />
      </section>

      {/* Footer */}
      <footer className="w-full px-6 md:px-12 lg:px-24 py-8 mt-4">
        <div className="h-0.5 w-full bg-[#121212] mb-6"></div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-0 relative z-10">
          <div className="flex items-center mb-4 md:mb-0">
            <img 
              src="https://tdkqhl7odedylxty.public.blob.vercel-storage.com/website/harrpy-logo-IGmUpxKDo70m3qKI37igR2ZtKxwYqP.webp" 
              alt="Harrpy Logo" 
              className="h-10 w-auto mr-2"
              loading="eager"
            />
            <p className="text-black font-medium">Harrpy</p>
          </div>
          <div className="text-sm text-black/60 mb-4 md:mb-0 flex flex-col items-center gap-2">
            <span>© {new Date().getFullYear()} Harrpy. All rights reserved.</span>
            <div className="flex gap-4">
              <a href="/privacy" className="text-black/40 hover:text-black underline transition-colors duration-200">Privacy Policy</a>
              <a href="/terms" className="text-black/40 hover:text-black underline transition-colors duration-200">Terms of Use</a>
              <a href="/cookies" className="text-black/40 hover:text-black underline transition-colors duration-200">Cookie Policy</a>
            </div>
          </div>
          <SocialMediaIcons />
        </div>
      </footer>
    </div>
  );
};

export default MainContent; 