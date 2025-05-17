import React, { useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Hero from './components/layout/Hero';
import MainContent from './components/layout/MainContent';
import CursorTrail from './components/common/CursorTrail';
import './styles/animations.css';

/**
 * Main App component that serves as the entry point for the Harrpy application.
 * It assembles the primary layout components and decorative elements.
 */
function App() {
  // Scroll to top when component mounts or page refreshes
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
    
    // Set up history state change listener to handle back/forward navigation
    const handleScrollToTop = () => {
      window.scrollTo(0, 0);
    };
    
    window.addEventListener('beforeunload', handleScrollToTop);
    
    return () => {
      window.removeEventListener('beforeunload', handleScrollToTop);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF5E9] font-sans">
      {/* Custom cursor with swirl trail effect */}
      <CursorTrail />
      
      <div className="relative z-10" id="top">
        <Navbar />
        <Hero />
        <MainContent />
      </div>
    </div>
  );
}

export default App;