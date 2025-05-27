import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  onNavigate: (view: string) => void;
  currentView: string;
  onOpenWaitlist?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView, onOpenWaitlist }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  const handleWaitlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (onOpenWaitlist) {
      onOpenWaitlist();
      return;
    }
    
    if (currentView !== 'main') {
      onNavigate('main');
      setTimeout(() => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
  
  return (
    <div className="relative">
      <nav className="py-4 sm:py-6 md:py-8 px-4 sm:px-6 md:px-12 lg:px-24">
        <div className="flex justify-between items-center">
          <Link 
            to="/" 
            className="flex items-center cursor-pointer hover:opacity-90 transition-opacity duration-200"
            onClick={scrollToTop}
          >
            <div className="h-10 sm:h-12 md:h-16 w-auto mr-0.5 md:mr-1">
              <img 
                src="https://tdkqhl7odedylxty.public.blob.vercel-storage.com/website/harrpy-logo-IGmUpxKDo70m3qKI37igR2ZtKxwYqP.webp" 
                alt="Harrpy Logo" 
                className="h-full w-auto"
                loading="eager"
              />
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl font-bold font-headline">Harrpy</div>
          </Link>
          <div className="flex items-center space-x-3 sm:space-x-8">
            <Link 
              to="/news" 
              className={`text-black hover:text-black/70 transition-colors duration-200 relative ${
                currentView === 'news' ? 'font-bold' : ''
              }`}
            >
              News
              {currentView === 'news' && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-black rounded-full"></span>
              )}
            </Link>
            <a 
              href="#" 
              onClick={handleWaitlistClick}
              className="px-3 py-2 sm:px-6 sm:py-3 text-sm sm:text-base bg-transparent text-black font-medium rounded-[4px] border border-black shadow-[0_0_15px_rgba(0,0,0,0.2)] hover:bg-black/5 transition-colors duration-300 ease-in-out whitespace-nowrap"
            >
              Join Waitlist
            </a>
          </div>
        </div>
      </nav>
      <div className="px-4 sm:px-6 md:px-12 lg:px-24">
        <div className="h-0.5 w-full bg-[#121212] -mt-1"></div>
      </div>
    </div>
  );
};

export default Navbar; 