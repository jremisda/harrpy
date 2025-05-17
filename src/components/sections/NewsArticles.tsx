import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import OptimizedImage from '../common/OptimizedImage';
import { articleService } from '../../services/articleService';
import { ArticleCategory, ArticleFilters, ArticleListItem } from '../../types';

interface NewsArticlesProps {
  categories?: ArticleCategory[];
  selectedCategory?: string | null;
  onCategoryChange?: (category: string | null) => void;
  onCategoriesLoaded?: (categories: ArticleCategory[]) => void;
}

const NewsArticles: React.FC<NewsArticlesProps> = ({
  categories: externalCategories,
  selectedCategory: externalSelectedCategory,
  onCategoryChange,
  onCategoriesLoaded
}) => {
  // Animation state
  const [animated, setAnimated] = useState(false);
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(externalSelectedCategory || null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  
  // Article state
  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [featuredArticles, setFeaturedArticles] = useState<ArticleListItem[]>([]);
  const [categories, setCategories] = useState<ArticleCategory[]>(externalCategories || []);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalArticles, setTotalArticles] = useState(0);

  // Update internal state when external props change
  useEffect(() => {
    if (externalSelectedCategory !== undefined) {
      setSelectedCategory(externalSelectedCategory);
    }
  }, [externalSelectedCategory]);

  useEffect(() => {
    if (externalCategories && externalCategories.length > 0) {
      setCategories(externalCategories);
    }
  }, [externalCategories]);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        // Only fetch categories if not provided externally
        if (!externalCategories || externalCategories.length === 0) {
          const categoriesData = await articleService.getCategories();
          setCategories(categoriesData);
          
          // If we have a callback, send the categories to parent
          if (onCategoriesLoaded) {
            onCategoriesLoaded(categoriesData);
          }
        }
        
        // Fetch featured articles
        const featuredData = await articleService.getFeaturedArticles(2);
        setFeaturedArticles(featuredData);
        
        // Fetch initial articles
        const articlesResponse = await articleService.getArticles(1, 6);
        setArticles(articlesResponse.articles);
        setPage(articlesResponse.page);
        setHasMore(articlesResponse.hasMore);
        setTotalArticles(articlesResponse.totalCount);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [externalCategories, onCategoriesLoaded]);

  // Handle category change
  useEffect(() => {
    const fetchFilteredArticles = async () => {
      if (selectedCategory !== null) {
        setIsLoading(true);
        setIsTransitioning(true);
        setVisibleItems(new Set()); // Reset visible items for new animation
        
        try {
          const filters: ArticleFilters = {
            category: selectedCategory
          };
          
          const articlesResponse = await articleService.getArticles(1, 6, filters);
          
          // Slight delay for smoother transition
          setTimeout(() => {
            setArticles(articlesResponse.articles);
            setPage(articlesResponse.page);
            setHasMore(articlesResponse.hasMore);
            setTotalArticles(articlesResponse.totalCount);
            setIsLoading(false);
            
            // Trigger staggered visibility after content change
            setTimeout(() => {
              setIsTransitioning(false);
            }, 100);
          }, 300);
        } catch (error) {
          console.error("Error fetching filtered articles:", error);
          setIsLoading(false);
          setIsTransitioning(false);
        }
      }
    };

    // Don't fetch on initial mount
    if (selectedCategory !== null) {
      fetchFilteredArticles();
    }
  }, [selectedCategory]);

  // Start animation after component is mounted
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimated(true);
      
      // Start staggered item animations after main container is visible
      setTimeout(() => {
        // Get all article IDs to make visible
        const allIds = new Set([
          ...(featuredArticles.map(a => a.id)),
          ...(articles.map(a => a.id))
        ]);
        setVisibleItems(allIds);
      }, 300);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [articles, featuredArticles]);

  // Set up intersection observer for scrolling animations
  useEffect(() => {
    if (!gridRef.current) return;
    
    const options = {
      root: null,
      rootMargin: '0px 0px -10% 0px', // Trigger a bit before elements come into view
      threshold: 0.1 // Trigger when at least 10% is visible
    };
    
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('data-article-id');
          if (id) {
            setVisibleItems(prev => new Set([...prev, id]));
          }
        }
      });
    };
    
    const observer = new IntersectionObserver(handleIntersect, options);
    
    // Observe all article cards
    const articleElements = gridRef.current.querySelectorAll('[data-article-id]');
    articleElements.forEach(el => observer.observe(el));
    
    return () => observer.disconnect();
  }, [articles, isTransitioning]);

  const handleCategoryChange = (categorySlug: string | null) => {
    if (categorySlug === selectedCategory) return;
    
    setIsTransitioning(true);
    setVisibleItems(new Set()); // Reset visible items for new animation
    
    // Slide out with slight delay before changing data
    setTimeout(() => {
      setSelectedCategory(categorySlug);
      // If we have a callback, send the category change to parent
      if (onCategoryChange) {
        onCategoryChange(categorySlug);
      }
    }, 300);
  };

  const handleLoadMore = async () => {
    if (!hasMore || isLoading) return;
    
    setIsLoading(true);
    
    try {
      const filters: ArticleFilters | undefined = selectedCategory 
        ? { category: selectedCategory }
        : undefined;
      
      const nextPage = page + 1;
      const articlesResponse = await articleService.getArticles(nextPage, 6, filters);
      
      const newArticles = [...articles, ...articlesResponse.articles];
      setArticles(newArticles);
      setPage(articlesResponse.page);
      setHasMore(articlesResponse.hasMore);
      
      // Add new article IDs to visible set after a short delay
      setTimeout(() => {
        setVisibleItems(prev => {
          const newSet = new Set(prev);
          articlesResponse.articles.forEach(article => newSet.add(article.id));
          return newSet;
        });
      }, 100);
    } catch (error) {
      console.error("Error loading more articles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // We separate recent (first 3) and older articles
  const recentArticles = articles.slice(0, 3);
  const olderArticles = articles.slice(3);

  // Add a featured flag to the first article if we have featured articles
  const firstArticle = featuredArticles.length > 0 
    ? featuredArticles[0] 
    : recentArticles.length > 0 ? recentArticles[0] : null;
    
  // Second and third articles
  const secondaryArticles = featuredArticles.length > 1 
    ? [featuredArticles[1]] 
    : recentArticles.slice(1, 2);
  
  // If we have a second featured article, add the first from recent to secondary
  if (featuredArticles.length > 1 && recentArticles.length > 0) {
    secondaryArticles.push(recentArticles[0]);
  } else if (featuredArticles.length <= 1) {
    secondaryArticles.push(...recentArticles.slice(1, 3 - secondaryArticles.length));
  }

  // Check if an article is visible for animation
  const isVisible = (id: string) => visibleItems.has(id);

  // For articles with "load more" button, we need less bottom padding
  const bottomPadding = hasMore ? "pb-8" : "pb-12";

  return (
    <div className={`bg-[#FFF5E9] px-6 md:px-12 lg:px-24 pt-12 ${bottomPadding}`} ref={containerRef}>
      {/* Remove the heading and category filters as they're now in the NewsCategories component */}
      
      {/* Content with transition */}
      <div 
        className={`news-grid page-transition-container transition-opacity duration-500 ease-natural-out ${
          animated ? 'opacity-100' : 'opacity-0'
        } ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}
        style={{ minHeight: '500px' }}
        ref={gridRef}
      >
        {isLoading && articles.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        ) : (
          <>
            {firstArticle && (
              <div className={`grid grid-cols-1 md:grid-cols-12 gap-8 mb-16`}>
                {/* First article - large feature */}
                <div 
                  data-article-id={firstArticle.id}
                  className={`news-grid-item md:col-span-7 lg:col-span-8 bg-white rounded-lg overflow-hidden shadow-lg hover-lift transition-all duration-300 delay-0 ${
                    isVisible(firstArticle.id) ? 'visible' : ''
                  }`}
                >
                  <div className="h-60 md:h-80 relative">
                    <OptimizedImage 
                      src={firstArticle.image.url} 
                      alt={firstArticle.image.alt}
                      placeholderColor="#f4e9db"
                    />
                    {firstArticle.featured && (
                      <div className="absolute top-4 right-4 px-3 py-1 bg-black/80 text-white rounded-md text-sm font-medium">
                        Featured
                      </div>
                    )}
                    <div className="absolute top-4 left-4 px-3 py-1 bg-black/80 text-white rounded-md text-sm">
                      {firstArticle.category.name}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-2">
                      <p className="text-sm text-gray-500">{new Date(firstArticle.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      <span className="text-gray-400">•</span>
                      <p className="text-sm text-gray-500">{firstArticle.readingTime} min read</p>
                    </div>
                    <h3 className="font-headline text-2xl font-bold mb-3">{firstArticle.title}</h3>
                    <p className="text-gray-700 mb-4">{firstArticle.summary}</p>
                    
                    <Link 
                      to={`/articles/${firstArticle.slug}`} 
                      className="mt-2 px-4 py-2 bg-transparent text-black font-medium rounded-[4px] border border-black shadow-[0_0_10px_rgba(0,0,0,0.1)] hover:bg-black/5 inline-block transition-all duration-300 ease-bounce"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
                
                {/* Second and third articles - smaller */}
                <div className="md:col-span-5 lg:col-span-4 flex flex-col gap-8">
                  {secondaryArticles.map((article, index) => (
                    <div 
                      key={article.id}
                      data-article-id={article.id}
                      className={`news-grid-item bg-white rounded-lg overflow-hidden shadow-lg hover-lift flex-1 delay-${index + 1} ${
                        isVisible(article.id) ? 'visible' : ''
                      }`}
                    >
                      <div className="h-40 relative">
                        <OptimizedImage 
                          src={article.image.url} 
                          alt={article.image.alt}
                          placeholderColor="#f4e9db"
                        />
                        <div className="absolute top-4 left-4 px-3 py-1 bg-black/80 text-white rounded-md text-sm">
                          {article.category.name}
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="text-xs text-gray-500">{new Date(article.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                          <span className="text-gray-400">•</span>
                          <p className="text-xs text-gray-500">{article.readingTime} min read</p>
                        </div>
                        <h3 className="font-headline text-lg font-bold mb-2">{article.title}</h3>
                        <Link 
                          to={`/articles/${article.slug}`} 
                          className="text-sm font-medium text-black hover:underline transition-all duration-300"
                        >
                          Read Article →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Grid of smaller articles */}
            {olderArticles.length > 0 && (
              <div className="mt-12">
                <h3 className="text-2xl font-bold mb-8 animate-in">Latest Articles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {olderArticles.map((article, index) => (
                    <div 
                      key={article.id}
                      data-article-id={article.id}
                      className={`news-grid-item bg-white rounded-lg overflow-hidden shadow-lg hover-lift delay-${Math.min(index + 3, 6)} ${
                        isVisible(article.id) ? 'visible' : ''
                      }`}
                    >
                      <div className="h-48 relative">
                        <OptimizedImage 
                          src={article.image.url} 
                          alt={article.image.alt}
                          placeholderColor="#f4e9db"
                        />
                        <div className="absolute top-4 left-4 px-3 py-1 bg-black/80 text-white rounded-md text-sm">
                          {article.category.name}
                        </div>
                      </div>
                      
                      <div className="p-5">
                        <div className="flex items-center space-x-2 mb-2">
                          <p className="text-sm text-gray-500">{new Date(article.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                          <span className="text-gray-400">•</span>
                          <p className="text-sm text-gray-500">{article.readingTime} min read</p>
                        </div>
                        <h3 className="font-headline text-xl font-bold mb-3">{article.title}</h3>
                        <p className="text-gray-700 mb-3 line-clamp-2">{article.summary}</p>
                        <Link 
                          to={`/articles/${article.slug}`} 
                          className="mt-1 inline-block text-sm font-medium text-black hover:underline transition-all duration-300"
                        >
                          Read Article →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Load more button */}
            {hasMore && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="px-6 py-3 bg-transparent text-black font-medium rounded-[4px] border border-black shadow-[0_0_10px_rgba(0,0,0,0.1)] hover:bg-black/5 transition-all duration-300 ease-bounce disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-t-2 border-b-2 border-black rounded-full animate-spin mr-2"></div>
                      Loading...
                    </div>
                  ) : (
                    `Load More (${articles.length} of ${totalArticles})`
                  )}
                </button>
              </div>
            )}
            
            {/* Empty state */}
            {!isLoading && articles.length === 0 && (
              <div className="py-16 text-center animate-in">
                <p className="text-lg text-gray-700 mb-4">No articles found for this category.</p>
                <button
                  onClick={() => handleCategoryChange(null)}
                  className="px-4 py-2 bg-black text-white font-medium rounded-[4px] transition-all duration-300 ease-bounce"
                >
                  View All Articles
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NewsArticles; 