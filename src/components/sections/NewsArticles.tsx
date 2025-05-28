import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import OptimizedImage from '../common/OptimizedImage';
import { articleService } from '../../services/articleService';
import { ArticleCategory, ArticleFilters, ArticleListItem, Article } from '../../types';

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
  const [featuredFullArticle, setFeaturedFullArticle] = useState<Article | null>(null);

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
        const filters: ArticleFilters = { 
          excludeIds: featuredData.map(article => article.id) 
        };
        const articlesResponse = await articleService.getArticles(1, 6, filters);
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
        
        // Only reset visible items when changing from one specific category to another
        // Don't reset when going from null (all) to a specific category
        const previousArticleIds = new Set(articles.map(a => a.id));
        
        try {
          // Filter by category AND exclude featured articles to prevent duplication
          const filters: ArticleFilters = {
            category: selectedCategory,
            excludeIds: featuredArticles.map(article => article.id)
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
            // Add new articles to visible items
            setTimeout(() => {
              setIsTransitioning(false);
              
              // Make new articles visible
              const newArticleIds = articlesResponse.articles.map(a => a.id);
              setVisibleItems(prev => {
                const newSet = new Set(prev);
                newArticleIds.forEach(id => newSet.add(id));
                return newSet;
              });
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
  }, [selectedCategory, articles]);

  // Start animation after component is mounted
  useEffect(() => {
    if (isLoading) return; // Don't start animations while loading
    
    // Use requestAnimationFrame for better paint timing
    requestAnimationFrame(() => {
      setAnimated(true);
      
      // Start staggered item animations after main container is visible
      setTimeout(() => {
        // Get all article IDs to make visible
        const allIds = new Set([
          ...(featuredArticles.map(a => a.id)),
          ...(articles.map(a => a.id))
        ]);
        
        requestAnimationFrame(() => {
          setVisibleItems(prevItems => {
            // Merge with previous items instead of replacing them
            return new Set([...prevItems, ...allIds]);
          });
        });
      }, 200); // Reduced delay for faster initial rendering
    });
    
  }, [articles, featuredArticles, isLoading]);
  
  // Handle article filtering effects
  useEffect(() => {
    if (isTransitioning && !isLoading) {
      // Use requestAnimationFrame to ensure smooth animation
      const transitionTimer = setTimeout(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(false);
        });
      }, 250); // Shorter transition time
      
      return () => clearTimeout(transitionTimer);
    }
  }, [isTransitioning, isLoading]);

  // Set up intersection observer for scrolling animations - heavily optimized
  useEffect(() => {
    if (!gridRef.current || isTransitioning) return;
    
    // Pre-mark all visible items immediately to prevent flickering
    const preMarkVisible = () => {
      if (!gridRef.current) return;
      
      const articleElements = gridRef.current.querySelectorAll('[data-article-id]');
      const newIds: string[] = [];
      
      articleElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const isInViewport = 
          rect.top < (window.innerHeight + 300) &&
          rect.bottom > -100 &&
          rect.left < window.innerWidth &&
          rect.right > 0;
        
        const id = el.getAttribute('data-article-id');
        if (id && isInViewport && !visibleItems.has(id) && !el.classList.contains('visible')) {
          el.classList.add('visible');
          newIds.push(id);
        }
      });
      
      // Batch update state once for all new IDs
      if (newIds.length > 0) {
        setVisibleItems(prev => {
          const newSet = new Set(prev);
          newIds.forEach(id => newSet.add(id));
          return newSet;
        });
      }
    };
    
    // Immediately mark items in viewport
    preMarkVisible();
    
    // Use a much more lightweight observer configuration
    const options = {
      root: null,
      rootMargin: '300px 0px', // Much larger margin to preload animations
      threshold: 0.01 // Almost immediately visible
    };
    
    // Use a single observer instance for better performance
    const handleIntersect = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      // Batch update for multiple entries
      const newIds: string[] = [];
      
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('data-article-id');
          if (id && !visibleItems.has(id)) {
            entry.target.classList.add('visible');
            newIds.push(id);
            observer.unobserve(entry.target);
          }
        }
      });
      
      // Single state update for all new IDs
      if (newIds.length > 0) {
        setVisibleItems(prev => {
          const newSet = new Set(prev);
          newIds.forEach(id => newSet.add(id));
          return newSet;
        });
      }
    };
    
    const observer = new IntersectionObserver(handleIntersect, options);
    
    // Only observe elements that aren't already visible
    const articleElements = gridRef.current.querySelectorAll('[data-article-id]');
    articleElements.forEach(el => {
      const id = el.getAttribute('data-article-id');
      if (id && !el.classList.contains('visible') && !visibleItems.has(id)) {
        observer.observe(el);
      }
    });
    
    // Add scroll handler for fallback visibility detection
    const handleScroll = () => {
      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(preMarkVisible);
      } else {
        preMarkVisible();
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [articles, isTransitioning, visibleItems]);

  const handleCategoryChange = (categorySlug: string | null) => {
    if (categorySlug === selectedCategory) return;
    
    setIsTransitioning(true);
    
    // Only clear visible items when changing to a completely different category
    // Don't clear when going from a category to "all" or from "all" to a category
    if (categorySlug !== null && selectedCategory !== null) {
      setVisibleItems(new Set()); // Reset visible items for new animation
    }
    
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
      // Create filters including exclusion of featured articles
      const filters: ArticleFilters = {
        ...(selectedCategory ? { category: selectedCategory } : {}),
        excludeIds: featuredArticles.map(article => article.id)
      };
      
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

  // Combine all articles (featured + regular), remove duplicates, and sort by publishedAt descending
  const allArticlesMap = new Map<string, ArticleListItem>();
  [...featuredArticles, ...articles].forEach(article => {
    allArticlesMap.set(article.id, article);
  });
  const allArticlesSorted = Array.from(allArticlesMap.values()).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  // The newest article is the featured (biggest) card
  const firstArticle = allArticlesSorted[0] || null;
  // The next two are secondary
  const secondaryArticles = allArticlesSorted.slice(1, 3);
  // The rest go into the grid
  const filteredOlderArticles = allArticlesSorted.slice(3);

  // Check if an article is visible for animation
  const isVisible = (id: string) => visibleItems.has(id);

  // For articles with "load more" button, we need less bottom padding
  const bottomPadding = hasMore ? "pb-8" : "pb-12";

  // Fetch the full article for the featured card when it changes
  useEffect(() => {
    if (firstArticle) {
      articleService.getArticleBySlug(firstArticle.slug).then(setFeaturedFullArticle);
    } else {
      setFeaturedFullArticle(null);
    }
  }, [firstArticle]);

  // Utility to get a longer preview for the featured article
  const getFeaturedPreview = () => {
    if (featuredFullArticle && featuredFullArticle.content) {
      const plain = featuredFullArticle.content.replace(/[#*_`>-]/g, '').replace(/\n+/g, ' ');
      return plain.split(' ').slice(0, 80).join(' ') + '...';
    }
    if (firstArticle) {
      return firstArticle.summary + (firstArticle.summary.length < 300 ? ' ' + firstArticle.summary : '');
    }
    return '';
  };

  return (
    <div className={`relative ${bottomPadding}`}>
      <div className="mx-auto px-6 md:px-12 lg:px-24">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="w-8 h-8 border-t-2 border-b-2 border-black rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {firstArticle && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6 items-stretch">
                {/* Left: Featured Article */}
                <div 
                  data-article-id={firstArticle.id}
                  className={`news-grid-item md:col-span-2 flex flex-col h-full transition-all duration-300 delay-0 ${
                    isVisible(firstArticle.id) ? 'visible' : ''
                  }`}
                  style={{ backgroundColor: '#FDB35B', border: 'none', borderRadius: '0.5rem', overflow: 'hidden', minHeight: '32rem' }}
                >
                  <Link to={`/articles/${firstArticle.slug}`} className="block h-full">
                    <div className="h-72 md:h-[22rem] lg:h-[24rem] xl:h-[28rem] relative" style={{ backgroundColor: '#FDB35B' }}>
                      <OptimizedImage 
                        src={firstArticle.image.url} 
                        alt={firstArticle.image.alt}
                        placeholderColor="#f4e9db"
                      />
                      {firstArticle.featured && (
                        <div className="absolute top-4 right-4 px-3 py-1 text-black rounded-md text-sm font-medium" style={{ backgroundColor: '#64CBED' }}>
                          Featured
                        </div>
                      )}
                      <div className="absolute top-4 left-4 px-3 py-1 bg-black/80 text-white rounded-md text-sm">
                        {firstArticle.category.name}
                      </div>
                    </div>
                    <div style={{ backgroundColor: '#FDB35B', width: '100%', borderTop: 'none' }}>
                      <div className="p-8 flex flex-col justify-between h-full" style={{ backgroundColor: 'transparent', minHeight: '16rem' }}>
                        <div>
                          <div className="flex items-center space-x-2 mb-3">
                            <p className="text-sm text-black">{new Date(firstArticle.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            <span className="text-black">•</span>
                            <p className="text-sm text-black">{firstArticle.readingTime} min read</p>
                          </div>
                          <h3 className="font-headline text-3xl font-bold mb-4">{firstArticle.title}</h3>
                          <p className="text-gray-700 mb-6 text-lg">{getFeaturedPreview()}</p>
                        </div>
                        <div className="mt-4">
                          <Link 
                            to={`/articles/${firstArticle.slug}`} 
                            className="px-6 py-3 bg-transparent text-black font-medium rounded-[4px] border border-black shadow-[0_0_10px_rgba(0,0,0,0.1)] hover:bg-black/5 inline-block transition-all duration-300 ease-bounce"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Read More
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
                {/* Right: Two Secondary Articles stacked */}
                <div className="flex flex-col gap-8 h-full justify-between">
                  {secondaryArticles.map((article, index) => (
                    <div 
                      key={article.id}
                      data-article-id={article.id}
                      className={`news-grid-item bg-white rounded-lg overflow-hidden shadow-lg hover-lift flex-1 flex flex-col transition-all duration-300 delay-${index + 1} ${
                        isVisible(article.id) ? 'visible' : ''
                      }`}
                      style={{ minHeight: '15rem' }}
                    >
                      <Link to={`/articles/${article.slug}`} className="block h-full">
                        <div className="h-48 md:h-40 lg:h-48 relative">
                          <OptimizedImage 
                            src={article.image.url} 
                            alt={article.image.alt}
                            placeholderColor="#f4e9db"
                          />
                          <div className="absolute top-4 left-4 px-3 py-1 bg-black/80 text-white rounded-md text-sm">
                            {article.category.name}
                          </div>
                        </div>
                        <div className="p-6 flex flex-col h-full" style={{ backgroundColor: '#FDB35B' }}>
                          <div className="flex items-center space-x-2 mb-2">
                            <p className="text-xs text-black">{new Date(article.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            <span className="text-black">•</span>
                            <p className="text-xs text-black">{article.readingTime} min read</p>
                          </div>
                          <h3 className="font-headline text-xl font-bold mb-3">{article.title}</h3>
                          <p className="text-gray-700 mb-4 line-clamp-2">{article.summary}</p>
                          <div className="mt-auto">
                            <Link 
                              to={`/articles/${article.slug}`} 
                              className="mt-2 px-4 py-2 bg-transparent text-black font-medium rounded-[4px] border border-black shadow-[0_0_10px_rgba(0,0,0,0.1)] hover:bg-black/5 inline-block transition-all duration-300 ease-bounce"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Read More
                            </Link>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Grid of smaller articles */}
            {filteredOlderArticles.length > 0 && (
              <div className="mt-6">
                <h3 className="text-2xl font-bold mb-4 animate-in">Latest Articles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredOlderArticles.map((article, index) => (
                    <div 
                      key={article.id}
                      data-article-id={article.id}
                      className={`news-grid-item bg-white rounded-lg overflow-hidden shadow-lg hover-lift delay-${Math.min(index + 3, 6)} ${
                        isVisible(article.id) ? 'visible' : ''
                      }`}
                    >
                      <Link to={`/articles/${article.slug}`} className="block h-full">
                        <div className="h-56 relative">
                          <OptimizedImage 
                            src={article.image.url} 
                            alt={article.image.alt}
                            placeholderColor="#f4e9db"
                          />
                          <div className="absolute top-4 left-4 px-3 py-1 bg-black/80 text-white rounded-md text-sm">
                            {article.category.name}
                          </div>
                        </div>
                        
                        <div className="p-4" style={{ backgroundColor: '#FDB35B' }}>
                          <div className="flex items-center space-x-2 mb-2">
                            <p className="text-sm text-black">{new Date(article.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            <span className="text-black">•</span>
                            <p className="text-sm text-black">{article.readingTime} min read</p>
                          </div>
                          <h3 className="font-headline text-xl font-bold mb-3">{article.title}</h3>
                          <p className="text-gray-700 line-clamp-2">{article.summary}</p>
                        </div>
                      </Link>
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
            {!isLoading && articles.length === 0 && !firstArticle && secondaryArticles.length === 0 && (
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