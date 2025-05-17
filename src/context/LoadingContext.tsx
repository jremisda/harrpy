import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the context type
interface LoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  startLoading: () => void;
  stopLoading: () => void;
}

// Create the context with default values
const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  setLoading: () => {},
  startLoading: () => {},
  stopLoading: () => {}
});

// Define props for the provider component
interface LoadingProviderProps {
  children: ReactNode;
}

// Create provider component
export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const startLoading = () => {
    setIsLoading(true);
  };

  const stopLoading = () => {
    setIsLoading(false);
  };

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        setLoading,
        startLoading,
        stopLoading
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

// Create a custom hook for using the loading context
export const useLoading = () => useContext(LoadingContext);

export default LoadingContext; 