import React from 'react';

interface GlassyLoaderProps {
  isLoading: boolean;
}

const GlassyLoader: React.FC<GlassyLoaderProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#FFF5E9]">
      <div className="spin-animation loader-animation">
        <img 
          src="/images/harrpy-logo.png" 
          alt="Harrpy" 
          className="w-24 h-24 object-contain"
        />
      </div>
    </div>
  );
};

export default GlassyLoader; 