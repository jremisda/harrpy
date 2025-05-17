import React, { useEffect, useState } from 'react';
import Navbar from './components/layout/Navbar';
import Hero from './components/layout/Hero';
import MainContent from './components/layout/MainContent';
import CursorTrail from './components/common/CursorTrail';
import './styles/animations.css';

// Font preloading helper
const preloadFonts = () => {
  return new Promise<void>((resolve) => {
    // Check if document is loaded
    if (document.readyState === 'complete') {
      resolve();
      return;
    }

    // Create Inter and Satoshi font preloaders
    const interFont = new FontFace('Inter', 'url(https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZJhjp-Ek-_EeAmM.woff2) format("woff2")');
    
    // Explicitly load and add the font to document.fonts
    interFont.load()
      .then((loadedFont) => {
        document.fonts.add(loadedFont);
        // Wait a little longer to ensure fonts are applied
        setTimeout(resolve, 100);
      })
      .catch(() => {
        // If loading fails, still resolve so the app continues
        resolve();
      });
  });
};

/**
 * Main App component that serves as the entry point for the Harrpy application.
 * It assembles the primary layout components and decorative elements.
 */
function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Preload fonts
  useEffect(() => {
    preloadFonts().then(() => {
      setFontsLoaded(true);
    });
  }, []);

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
    <div className={`min-h-screen bg-[#FFF5E9] font-sans ${fontsLoaded ? 'fonts-loaded' : 'fonts-loading'}`}>
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