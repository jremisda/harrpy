import React from 'react';
import { HeroCard } from '../sections/HeroCard';
import { MissionStatement } from '../sections/MissionStatement';
import { EarlyAccessBenefits } from '../sections/EarlyAccessBenefits';

interface MainContentProps {
  onEmailSubmit: (email: string) => void;
  onOpenWaitlist?: () => void;
}

export const MainContent: React.FC<MainContentProps> = ({ onEmailSubmit, onOpenWaitlist }) => {
  return (
    <div className="w-full min-h-screen overflow-x-hidden">
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
              src="/images/harrpy-logo.png" 
              alt="Harrpy Logo" 
              className="h-10 w-auto mr-2"
            />
            <p className="text-black font-medium">Harrpy</p>
          </div>
          <div className="text-sm text-black/60">
            © {new Date().getFullYear()} Harrpy. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainContent; 