import React from 'react';
import OptimizedImage from '../common/OptimizedImage';

export const Navbar: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <div className="relative">
      <nav className="py-8 px-6 md:px-12 lg:px-24">
        <div className="flex justify-between items-center">
          <a 
            href="#top" 
            className="flex items-center cursor-pointer hover:opacity-90 transition-opacity duration-200"
            onClick={(e) => {
              e.preventDefault();
              scrollToTop();
            }}
          >
            <div className="h-12 md:h-16 w-auto mr-0.5 md:mr-1">
              <img 
                src="/images/harrpy-logo.png" 
                alt="Harrpy Logo" 
                className="h-full w-auto"
                loading="eager"
              />
            </div>
            <div className="text-2xl md:text-3xl font-bold font-headline">Harrpy</div>
          </a>
          <div className="space-x-8">
            <a href="#news" className="text-black hover:text-black/70 transition-colors duration-200">News</a>
            <a 
              href="#contact" 
              className="px-6 py-3 bg-transparent text-black font-medium rounded-[4px] border border-black shadow-[0_0_15px_rgba(0,0,0,0.2)] hover:bg-black/5 transition-colors duration-300 ease-in-out whitespace-nowrap"
            >
              Join Waitlist
            </a>
          </div>
        </div>
      </nav>
      <div className="px-6 md:px-12 lg:px-24">
        <div className="h-0.5 w-full bg-[#121212] -mt-3"></div>
      </div>
    </div>
  );
};

export default Navbar; 