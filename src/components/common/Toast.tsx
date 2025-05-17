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
          <div className="flex-shrink-0 h-[24px] w-[24px] rounded-sm bg-[#F3A146] flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        );
      case 'success':
        return (
          <div className="flex-shrink-0 h-[24px] w-[24px] rounded-sm bg-green-500 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'info':
        return (
          <div className="flex-shrink-0 h-[24px] w-[24px] rounded-sm bg-blue-500 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'warning':
        return (
          <div className="flex-shrink-0 h-[24px] w-[24px] rounded-sm bg-yellow-500 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
      className={`fixed z-50 animate-fade-in bg-white border border-black/20 shadow-lg rounded-lg px-4 py-3 ${className}`}
      style={{ 
        top: '30%',
        left: '50%',
        transform: 'translateX(-50%)',
        maxWidth: '90%',
        width: 'auto',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)'
      }}
    >
      <div className="flex items-center space-x-3">
        {getIcon()}
        <div className="flex-1">
          <p className="text-black font-medium">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 text-black/50 hover:text-black"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default Toast; 