import React from 'react';

interface ToastProps {
  message: string;
  type?: 'error' | 'success' | 'info' | 'warning';
  onClose?: () => void;
  className?: string;
}

/**
 * A toast notification component for displaying messages
 */
const Toast: React.FC<ToastProps> = ({ 
  message, 
  type = 'error',
  onClose,
  className = '' 
}) => {
  if (!message) return null;

  // Set icon based on type
  const getIcon = () => {
    switch (type) {
      case 'error':
        return (
          <div className="bg-red-100 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        );
      case 'success':
        return (
          <div className="bg-green-100 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'info':
        return (
          <div className="bg-blue-100 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'warning':
        return (
          <div className="bg-yellow-100 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className={`fixed bottom-8 right-8 bg-[#FFF5E9] border border-black/20 shadow-lg rounded-lg p-4 z-50 animate-fade-in ${className}`}
    >
      <div className="flex items-center space-x-3">
        {getIcon()}
        <div>
          <p className="text-black font-medium">{message}</p>
          {type === 'success' && <p className="text-black/60 text-sm">Link has been copied to clipboard.</p>}
        </div>
      </div>
    </div>
  );
};

export default Toast; 