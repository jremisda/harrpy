import React, { useState, useEffect, useRef } from 'react';
import { ArticleCategory } from '../../types';
import NewsArticles from '../sections/NewsArticles';
import CategoryButtons from '../sections/CategoryButtons';
import SEO from '../common/SEO';
import SocialMediaIcons from '../common/SocialMediaIcons';
import StructuredData from '../common/StructuredData';
import OptimizedImage from '../common/OptimizedImage';

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
        title="News | From the Verified | Harrpy"
        description="The latest from Harrpy. Real stories from inside the scene. No noise. Just what matters."
      />
      <StructuredData
        pageType="news"
        url={typeof window !== 'undefined' ? window.location.origin + '/news' : 'https://harrpy.com/news'}
        title="News | From the Verified | Harrpy"
        description="The latest from Harrpy. Real stories from inside the scene. No noise. Just what matters."
        imageUrl="/images/harrpy-social.png"
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
        <div className="h-0.5 w-full bg-[#121212] mb-6"></div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-0 relative z-10">
          {/* Logo on the left */}
          <div className="flex items-center mb-4 md:mb-0">
            <img 
              src="https://tdkqhl7odedylxty.public.blob.vercel-storage.com/harrpy-logo-rl7LZcaL4a4Cldfw48Eq3jYXenBi2d.png" 
              alt="Harrpy Logo" 
              className="h-10 w-auto mr-2"
              loading="lazy"
              decoding="async"
            />
            <p className="text-black font-medium">Harrpy</p>
          </div>
          
          {/* Copyright and policy links centered */}
          <div className="text-sm text-black/60 mb-4 md:mb-0 flex flex-col items-center gap-2">
            <span>© {new Date().getFullYear()} Harrpy. All rights reserved.</span>
            <div className="flex gap-4">
              <a href="/privacy" className="text-black/40 hover:text-black underline transition-colors duration-200">Privacy Policy</a>
              <a href="/terms" className="text-black/40 hover:text-black underline transition-colors duration-200">Terms of Use</a>
              <a href="/cookies" className="text-black/40 hover:text-black underline transition-colors duration-200">Cookie Policy</a>
            </div>
          </div>
          
          {/* Social Icons on right */}
          <SocialMediaIcons />
        </div>
      </footer>
    </div>
  );
};

export default NewsContent; 