import React, { useState, useEffect, useRef } from 'react';
import { ArticleCategory } from '../../types';
import NewsArticles from '../sections/NewsArticles';
import CategoryButtons from '../sections/CategoryButtons';
import SEO from '../common/SEO';

// SVG icons for social media
const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const NewsContent: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [headingVisible, setHeadingVisible] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Add state for categories and selected category
  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Add loading effects with staggered timing - completely optimized
  useEffect(() => {
    // Immediately start animations
    document.documentElement.classList.add('animations-enabled');
    document.documentElement.classList.remove('animations-paused');
    
    // Use passive observer to determine when to show content
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // On intersection, immediately load content
          setIsLoaded(true);
          setHeadingVisible(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.01,
        rootMargin: '0px'
      }
    );
    
    // If containerRef is ready, observe it or just show content immediately
    if (containerRef.current) {
      observer.observe(containerRef.current);
    } else {
      // Fallback if ref isn't ready
      setIsLoaded(true);
      setHeadingVisible(true);
    }
    
    // Set a backup timer to ensure content shows even if observer fails
    const backupTimer = setTimeout(() => {
      setIsLoaded(true);
      setHeadingVisible(true);
    }, 100);
    
    return () => {
      observer.disconnect();
      clearTimeout(backupTimer);
    };
  }, []);

  // Intersection observer for heading animations - optimized for performance
  useEffect(() => {
    if (!headingRef.current) return;
    
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.01 // Reduced threshold for earlier triggering
    };
    
    const handleIntersect = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Use requestAnimationFrame to ensure animation happens on the next paint cycle
          requestAnimationFrame(() => {
            entry.target.classList.add('animate-in');
            // Immediately mark as visible to prevent flashing
            entry.target.classList.add('visible');
          });
          observer.unobserve(entry.target);
        }
      });
    };
    
    const observer = new IntersectionObserver(handleIntersect, options);
    observer.observe(headingRef.current);
    
    return () => observer.disconnect();
  }, []);

  // Handler for category changes
  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
  };

  // Handler to receive categories from NewsArticles
  const handleCategoriesLoaded = (loadedCategories: ArticleCategory[]) => {
    setCategories(loadedCategories);
  };

  return (
    <div 
      ref={containerRef}
      className={`w-full min-h-screen overflow-x-hidden transition-opacity transition-transform duration-500 ease-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      style={{ 
        contain: 'content',
        willChange: isLoaded ? 'auto' : 'opacity, transform'
      }}
    >
      <SEO
        pageType="news"
        description="The latest from Harrpy. Real stories from inside the scene. No noise. Just what matters."
      />
      
      <div className="pt-16 px-6 md:px-12 lg:px-24 overflow-hidden">
        <h1 
          ref={headingRef}
          className={`font-headline text-7xl md:text-8xl lg:text-9xl font-black leading-[0.9] tracking-tight max-w-full transition-all duration-500 ease-out transform ${
            headingVisible 
            ? 'translate-y-0 opacity-100' 
            : 'translate-y-10 opacity-0'
          }`}
          style={{ 
            backfaceVisibility: 'hidden',
            transformStyle: 'preserve-3d',
            willChange: headingVisible ? 'auto' : 'transform, opacity'
          }}
        >
          From the Verified
        </h1>
        <p 
          className={`text-xl text-gray-700 max-w-3xl mt-4 transition-all duration-500 ease-out transform ${
            headingVisible 
            ? 'translate-y-0 opacity-100 delay-100' 
            : 'translate-y-10 opacity-0'
          }`}
          style={{ 
            backfaceVisibility: 'hidden',
            transformStyle: 'preserve-3d',
            willChange: headingVisible ? 'auto' : 'transform, opacity'
          }}
        >
          What's Really Happening Behind the Swipe
        </p>
      </div>
      
      {/* Category buttons - directly below the subheading */}
      <div 
        className={`mt-6 transition-all duration-500 ease-out transform ${
          headingVisible 
          ? 'translate-y-0 opacity-100 delay-200' 
          : 'translate-y-10 opacity-0'
        }`}
        style={{ 
          backfaceVisibility: 'hidden',
          transformStyle: 'preserve-3d',
          willChange: headingVisible ? 'auto' : 'transform, opacity'
        }}
      >
        <CategoryButtons 
          categories={categories} 
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
      </div>
      
      <section id="news-articles" className="mt-0">
        <NewsArticles 
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          onCategoriesLoaded={handleCategoriesLoaded}
        />
      </section>
      
      {/* Footer */}
      <footer className="w-full px-6 md:px-12 lg:px-24 py-8 mt-4">
        {/* Line matching the header style */}
        <div className="h-0.5 w-full bg-[#121212] mb-6"></div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-0 relative z-10">
          {/* Logo on the left */}
          <div className="flex items-center mb-4 md:mb-0">
            <img 
              src="/images/harrpy-logo.png" 
              alt="Harrpy Logo" 
              className="h-10 w-auto mr-2"
              loading="lazy"
              decoding="async"
            />
            <p className="text-black font-medium">Harrpy</p>
          </div>
          
          {/* Copyright text in center */}
          <div className="text-sm text-black/60 mb-4 md:mb-0">
            © {new Date().getFullYear()} Harrpy. All rights reserved.
          </div>
          
          {/* Social Icons on right */}
          <div className="flex items-center space-x-3">
            <a 
              href="https://www.instagram.com/harrpy.official/" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Follow us on Instagram"
              className="bg-[#FFF5E9] text-black p-2.5 rounded-[4px] shadow-[0_0_10px_rgba(0,0,0,0.1)] hover:bg-[#FFF5E9]/80 transition-all duration-300 ease-bounce"
            >
              <InstagramIcon />
            </a>
            <a 
              href="https://facebook.com/harrpy.official" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Like us on Facebook"
              className="bg-[#FFF5E9] text-black p-2.5 rounded-[4px] shadow-[0_0_10px_rgba(0,0,0,0.1)] hover:bg-[#FFF5E9]/80 transition-all duration-300 ease-bounce"
            >
              <FacebookIcon />
            </a>
            <a 
              href="https://x.com/Harrpy_" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Follow us on X"
              className="bg-[#FFF5E9] text-black p-2.5 rounded-[4px] shadow-[0_0_10px_rgba(0,0,0,0.1)] hover:bg-[#FFF5E9]/80 transition-all duration-300 ease-bounce"
            >
              <XIcon />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NewsContent; 