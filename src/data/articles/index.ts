import { Article } from '../../types';
import whatIsHarrpy from './what-is-harrpy';

// Add all articles to this array
export const articles: Article[] = [
  whatIsHarrpy,
  // Add new articles here
];

// Utility function to calculate reading time from content
export const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

// Helper function to get article by slug
export const getArticleBySlug = (slug: string): Article | undefined => {
  return articles.find(article => article.slug === slug);
};

// Helper function to get featured articles
export const getFeaturedArticles = (limit: number = 3): Article[] => {
  return articles
    .filter(article => article.featured && article.status === 'published')
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
};

// Helper function to get articles by category
export const getArticlesByCategory = (categorySlug: string): Article[] => {
  return articles
    .filter(article => article.category.slug === categorySlug && article.status === 'published')
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
};

// Helper function to get articles by tag
export const getArticlesByTag = (tagSlug: string): Article[] => {
  return articles
    .filter(article => article.tags.some(tag => tag.slug === tagSlug) && article.status === 'published')
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
};

export default articles; 