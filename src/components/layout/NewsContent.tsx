import React, { useState, useEffect, useRef } from 'react';
import { ArticleCategory } from '../../types';
import NewsArticles from '../sections/NewsArticles';
import NewsCategories from '../sections/NewsCategories';

export const NewsContent: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [headingVisible, setHeadingVisible] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);
  
  // Add state for categories and selected category
  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Add loading effects with staggered timing
  useEffect(() => {
    // First set the container to loaded
    const containerTimer = setTimeout(() => {
      setIsLoaded(true);
      
      // Then fade in the heading elements
      setTimeout(() => {
        setHeadingVisible(true);
      }, 200);
    }, 100);
    
    return () => clearTimeout(containerTimer);
  }, []);

  // Intersection observer for heading animations
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    
    const handleIntersect = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    };
    
    const observer = new IntersectionObserver(handleIntersect, options);
    
    if (headingRef.current) observer.observe(headingRef.current);
    if (subheadingRef.current) observer.observe(subheadingRef.current);
    
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
    <div className={`w-full min-h-screen overflow-x-hidden transition-all duration-700 ease-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="pt-16 px-6 md:px-12 lg:px-24 overflow-hidden">
        <h1 
          ref={headingRef}
          className={`font-headline text-7xl md:text-8xl lg:text-9xl font-black leading-[0.9] tracking-tight max-w-full transition-all duration-700 ease-out transform ${
            headingVisible 
            ? 'translate-y-0 opacity-100' 
            : 'translate-y-10 opacity-0'
          }`}
        >
          From the Verified
        </h1>
        <p 
          ref={subheadingRef}
          className={`text-xl text-gray-700 max-w-3xl mt-4 transition-all duration-700 delay-100 ease-out transform ${
            headingVisible 
            ? 'translate-y-0 opacity-100' 
            : 'translate-y-10 opacity-0'
          }`}
        >
          What's Really Happening Behind the Swipe
        </p>
      </div>
      
      <section id="news-categories" className="mt-8">
        <NewsCategories 
          categories={categories} 
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
      </section>
      
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
          <div className="flex items-center mb-4 md:mb-0">
            <img 
              src="/images/harrpy-logo.png" 
              alt="Harrpy Logo" 
              className="h-10 w-auto mr-2"
            />
            <p className="text-black font-medium">Harrpy</p>
          </div>
          <div className="text-sm text-black/60">
            © {new Date().getFullYear()} Harrpy. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NewsContent; 