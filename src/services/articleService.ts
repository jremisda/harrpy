import {
  Article,
  ArticleCategory,
  ArticleFilters,
  ArticleListItem,
  ArticlesResponse,
  ArticleTag,
  Author
} from '../types';

// Import data from modular structure
import { authors } from '../data/authors';
import { categories } from '../data/categories'; 
import { tags } from '../data/tags';
import { articles as mockArticles, getArticleBySlug as getArticleBySlugHelper } from '../data/articles';

// Utility function to convert full Article to ArticleListItem
const convertToListItem = (article: Article): ArticleListItem => {
  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    summary: article.summary,
    publishedAt: article.publishedAt,
    image: article.image,
    author: {
      id: article.author.id,
      name: article.author.name,
      avatar: article.author.avatar
    },
    category: {
      id: article.category.id,
      name: article.category.name,
      slug: article.category.slug
    },
    readingTime: article.readingTime,
    featured: article.featured
  };
};

// Mock API endpoint functions
export const articleService = {
  // Get paginated list of articles with optional filtering
  getArticles: async (page = 1, pageSize = 10, filters?: ArticleFilters): Promise<ArticlesResponse> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Filter articles based on provided filters
    let filteredArticles = [...mockArticles].filter(article => article.status === 'published');
    
    if (filters) {
      if (filters.category) {
        filteredArticles = filteredArticles.filter(article => 
          article.category.slug === filters.category
        );
      }
      
      if (filters.tag) {
        filteredArticles = filteredArticles.filter(article => 
          article.tags.some(tag => tag.slug === filters.tag)
        );
      }
      
      if (filters.author) {
        filteredArticles = filteredArticles.filter(article => 
          article.author.id === filters.author
        );
      }
      
      if (filters.featured !== undefined) {
        filteredArticles = filteredArticles.filter(article => 
          article.featured === filters.featured
        );
      }
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredArticles = filteredArticles.filter(article => 
          article.title.toLowerCase().includes(searchLower) ||
          article.summary.toLowerCase().includes(searchLower) ||
          article.content.toLowerCase().includes(searchLower)
        );
      }
      
      // Sort articles
      if (filters.sortBy) {
        filteredArticles.sort((a, b) => {
          if (filters.sortBy === 'title') {
            return a.title.localeCompare(b.title);
          } else if (filters.sortBy === 'readingTime') {
            return a.readingTime - b.readingTime;
          } else if (filters.sortBy === 'publishedAt' || filters.sortBy === 'updatedAt') {
            const dateA = new Date(a[filters.sortBy] || a.publishedAt);
            const dateB = new Date(b[filters.sortBy] || b.publishedAt);
            return dateA.getTime() - dateB.getTime();
          }
          return 0;
        });
        
        // Apply sort order
        if (filters.sortOrder === 'desc') {
          filteredArticles.reverse();
        }
      } else {
        // Default sort by publishedAt desc
        filteredArticles.sort((a, b) => 
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
      }
    } else {
      // Default sort by publishedAt desc if no filters provided
      filteredArticles.sort((a, b) => 
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    }
    
    // Calculate pagination
    const totalCount = filteredArticles.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedArticles = filteredArticles.slice(startIndex, endIndex);
    
    // Convert to list items
    const articleItems = paginatedArticles.map(convertToListItem);
    
    return {
      articles: articleItems,
      totalCount,
      page,
      pageSize,
      totalPages,
      hasMore: page < totalPages
    };
  },
  
  // Get a single article by slug
  getArticleBySlug: async (slug: string): Promise<Article | null> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const article = getArticleBySlugHelper(slug);
    return article && article.status === 'published' ? article : null;
  },
  
  // Get featured articles
  getFeaturedArticles: async (limit = 3): Promise<ArticleListItem[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const featuredArticles = mockArticles
      .filter(article => article.featured && article.status === 'published')
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, limit);
      
    return featuredArticles.map(convertToListItem);
  },
  
  // Get related articles
  getRelatedArticles: async (articleId: string, limit = 3): Promise<ArticleListItem[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const article = mockArticles.find(a => a.id === articleId);
    
    if (!article) {
      return [];
    }
    
    // If article has explicitly defined related articles, use those
    if (article.relatedArticles && article.relatedArticles.length > 0) {
      const relatedArticles = article.relatedArticles
        .map(id => mockArticles.find(a => a.id === id))
        .filter((a): a is Article => a !== undefined && a.status === 'published')
        .slice(0, limit);
        
      return relatedArticles.map(convertToListItem);
    }
    
    // Otherwise, find articles with the same category or tags
    const relatedByCategoryAndTags = mockArticles.filter(a => 
      a.id !== articleId &&
      a.status === 'published' &&
      (a.category.id === article.category.id ||
       a.tags.some(t1 => article.tags.some(t2 => t1.id === t2.id)))
    );
    
    // Sort by number of matching tags
    relatedByCategoryAndTags.sort((a, b) => {
      const aMatches = a.tags.filter(t1 => 
        article.tags.some(t2 => t1.id === t2.id)
      ).length;
      
      const bMatches = b.tags.filter(t1 => 
        article.tags.some(t2 => t1.id === t2.id)
      ).length;
      
      return bMatches - aMatches;
    });
    
    return relatedByCategoryAndTags.slice(0, limit).map(convertToListItem);
  },
  
  // Get categories
  getCategories: async (): Promise<ArticleCategory[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return categories;
  },
  
  // Get tags
  getTags: async (): Promise<ArticleTag[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return tags;
  },
  
  // Get authors
  getAuthors: async (): Promise<Author[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return authors;
  }
};

export default articleService; 