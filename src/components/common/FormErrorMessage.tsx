import React from 'react';

interface FormErrorMessageProps {
  message: string;
}

/**
 * Form error message component for displaying field-level validation errors
 */
const FormErrorMessage: React.FC<FormErrorMessageProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="flex items-center mt-1.5 space-x-1">
      <span className="text-black/70">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </span>
      <span className="text-black/70 text-xs">{message}</span>
    </div>
  );
};

export default FormErrorMessage; 