import React from 'react';

export const GradientBlobs: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute left-[-20%] top-[-10%] w-[70%] h-[70%] rounded-full bg-purple-300/30 animate-float-slow"></div>
      <div className="absolute right-[-20%] top-[30%] w-[60%] h-[60%] rounded-full bg-blue-300/20 animate-float-medium"></div>
      <div className="absolute left-[10%] bottom-[-20%] w-[50%] h-[50%] rounded-full bg-indigo-300/20 animate-float-fast"></div>
    </div>
  );
};

export default GradientBlobs; 