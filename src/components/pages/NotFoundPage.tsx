import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../common/SEO';
import OptimizedImage from '../common/OptimizedImage';
import SocialMediaIcons from '../common/SocialMediaIcons';
import StructuredData from '../common/StructuredData';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const [animated, setAnimated] = useState(false);
  
  // Start animations after component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimated(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      <SEO
        title="Page Not Found | Harrpy"
        description="The page you were looking for could not be found."
        canonical={`${window.location.origin}/404`}
      />
      <StructuredData
        pageType="404"
        url={typeof window !== 'undefined' ? window.location.origin + '/404' : 'https://harrpy.com/404'}
        title="Page Not Found | Harrpy"
        description="The page you were looking for could not be found."
      />
      
      {/* 404 Hero Section (similar to home hero card) */}
      <div className="px-6 md:px-12 lg:px-24 pb-12 pt-12 md:pt-20">
        <div className="relative w-full h-[480px] md:h-[530px] rounded-[32px] overflow-hidden">
          {/* Image background */}
          <div className="absolute inset-0 w-full h-full">
            <OptimizedImage 
              src="https://tdkqhl7odedylxty.public.blob.vercel-storage.com/hero-background-dl8bwgQxeGXnbPXYbD4YH3M02j88XC.png" 
              alt="404 background"
              eager={true}
              placeholderColor="#f4e9db"
            />
            {/* Very subtle overlay */}
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
          
          <div className="relative h-full px-6 py-12 md:p-12 lg:p-16 flex flex-col justify-center items-center">
            {/* 404 Number */}
            <div 
              className={`font-headline text-[10rem] md:text-[14rem] font-black leading-none mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 select-none transition-opacity duration-1000 ${
                animated ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ textShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
            >
              404
            </div>
            
            {/* Title */}
            <h1 
              className={`text-2xl md:text-3xl text-center font-headline font-bold mb-6 text-white transform transition-all duration-1000 ease-out ${
                animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              This Page Ghosted You.
            </h1>
            
            {/* Subtitle */}
            <p 
              className={`text-white/90 text-lg text-center mb-10 max-w-lg transform transition-all duration-1000 ease-out delay-300 ${
                animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              Maybe it unmatched. Maybe it was never verified to begin with. Either way, it's not here.
            </p>
            
            {/* Button with hover effect */}
            <div 
              className={`transform transition-all duration-1000 ease-out delay-500 ${
                animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <button
                onClick={() => navigate('/')}
                className="group px-8 py-4 bg-white/30 backdrop-blur-sm text-white font-medium rounded-[12px] border border-white/30 shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:bg-white/40 transition-all duration-300 ease-in-out relative overflow-hidden"
              >
                <span className="relative z-10">Back to the verified zone</span>
                <div className="absolute inset-0 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer - matching main page footer */}
      <footer className="w-full px-6 md:px-12 lg:px-24 py-8 mt-auto">
        <div className="h-0.5 w-full bg-[#121212] mb-6"></div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-0 relative z-10">
          <div className="flex items-center mb-4 md:mb-0">
            <img 
              src="https://tdkqhl7odedylxty.public.blob.vercel-storage.com/harrpy-logo-rl7LZcaL4a4Cldfw48Eq3jYXenBi2d.png" 
              alt="Harrpy Logo" 
              className="h-10 w-auto mr-2"
              loading="eager"
            />
            <p className="text-black font-medium">Harrpy</p>
          </div>
          <div className="text-sm text-black/60 mb-4 md:mb-0 flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <span>© {new Date().getFullYear()} Harrpy. All rights reserved.</span>
            <a href="/privacy" className="text-black/40 hover:text-black underline transition-colors duration-200">Privacy Policy</a>
            <a href="/terms" className="text-black/40 hover:text-black underline transition-colors duration-200">Terms of Use</a>
            <a href="/cookies" className="text-black/40 hover:text-black underline transition-colors duration-200">Cookie Policy</a>
          </div>
          <SocialMediaIcons />
        </div>
      </footer>
    </div>
  );
};

export default NotFoundPage; 