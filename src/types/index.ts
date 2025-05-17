/**
 * Common types used throughout the application
 */

/**
 * Email submission handler type
 */
export type EmailSubmitHandler = (email: string) => void;

/**
 * User type for waitlist
 */
export type UserType = 'creator' | 'business' | null;

/**
 * Social media handles for creators
 */
export interface SocialMediaHandles {
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  x?: string;
}

/**
 * Creator form data structure
 */
export interface CreatorFormData {
  firstName: string;
  lastName: string;
  socialMediaHandles: SocialMediaHandles;
  email: string;
  aboutYourself?: string;
}

/**
 * Business form data structure
 */
export interface BusinessFormData {
  businessName: string;
  websiteUrl: string;
  email: string;
  creatorDescription?: string;
}

/**
 * Waitlist form submission handler
 */
export type WaitlistSubmitHandler = (data: CreatorFormData | BusinessFormData, userType: UserType) => void;

/**
 * Base component props with common properties
 */
export interface BaseComponentProps {
  className?: string;
  id?: string;
}

/**
 * Form field props
 */
export interface FormFieldProps extends BaseComponentProps {
  label?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
}

/**
 * Button props
 */
export interface ButtonProps extends BaseComponentProps {
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

// Article and Blog types
export interface Author {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  role?: string;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

export interface ArticleImage {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  caption?: string;
  credit?: string;
}

export interface ArticleTag {
  id: string;
  name: string;
  slug: string;
}

export interface ArticleCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface ArticleSEO {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  canonicalUrl?: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string; // Markdown or HTML content
  publishedAt: string; // ISO date string
  updatedAt?: string; // ISO date string
  image: ArticleImage;
  author: Author;
  category: ArticleCategory;
  tags: ArticleTag[];
  readingTime: number; // In minutes
  featured: boolean;
  status: 'draft' | 'published' | 'archived';
  seo?: ArticleSEO;
  relatedArticles?: string[]; // Array of article IDs
}

export interface ArticleListItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  publishedAt: string;
  image: ArticleImage;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
  readingTime: number;
  featured: boolean;
}

export interface ArticlesResponse {
  articles: ArticleListItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
}

export interface ArticleFilters {
  category?: string;
  tag?: string;
  author?: string;
  featured?: boolean;
  search?: string;
  sortBy?: 'publishedAt' | 'updatedAt' | 'title' | 'readingTime';
  sortOrder?: 'asc' | 'desc';
} 