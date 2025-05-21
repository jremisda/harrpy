import React from 'react';
import OptimizedImage from '../common/OptimizedImage';

interface GlassyLoaderProps {
  isLoading: boolean;
}

const GlassyLoader: React.FC<GlassyLoaderProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#FFF5E9]">
      <div className="spin-animation loader-animation">
        <img 
          src="https://tdkqhl7odedylxty.public.blob.vercel-storage.com/harrpy-logo-rI7LZcaL4a4CIdfw48Eq3jYXenBi2d.png" 
          alt="Harrpy" 
          className="w-24 h-24 object-contain"
          loading="eager"
        />
      </div>
    </div>
  );
};

export default GlassyLoader; 