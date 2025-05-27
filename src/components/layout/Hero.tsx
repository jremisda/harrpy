import React from 'react';

export const Hero: React.FC = () => {
  return (
    <div className="w-full px-4 sm:px-6 md:px-12 lg:px-24 pt-8 pb-8 sm:pt-12 sm:pb-12">
      <h1 className="font-headline text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-[0.9] tracking-tight max-w-full">
        <span className="md:hidden leading-[1.0] block">
          Swipe Into<br/>
          the Verified<br/>
          Collab Scene
        </span>
        <span className="hidden md:block lg:hidden leading-[1.0]">
          Swipe Into<br/>
          the Verified<br/>
          Collab Scene
        </span>
        <span className="hidden lg:inline">
          Swipe Into the<br/>Verified Collab Scene
        </span>
      </h1>
    </div>
  );
};

export default Hero; 