export interface ImageMetadata {
  width: number;
  height: number;
  format: string;
  size: number;
  hasAlpha?: boolean;
}

export interface OptimizedImage {
  url: string;
  width: number;
  height: number;
  alt: string;
  formats: {
    avif?: string;
    webp?: string;
    jpeg?: string;
    png?: string;
  };
  placeholder?: string;
  metadata?: ImageMetadata;
}

export interface ImageUploadResponse {
  url: string;
  width: number;
  height: number;
  formats: {
    avif: string;
    webp: string;
    jpeg: string;
  };
  metadata: ImageMetadata;
}

export interface ImageUploadOptions {
  maxSize?: number;
  allowedTypes?: string[];
  quality?: 'high' | 'medium' | 'low';
  generatePlaceholder?: boolean;
  preserveOriginal?: boolean;
}

export interface ImageProcessingConfig {
  sizes: {
    sm: { width: number; height: number | null; suffix: string };
    md: { width: number; height: number | null; suffix: string };
    lg: { width: number; height: number | null; suffix: string };
  };
  quality: {
    avif: { quality: number };
    webp: { quality: number };
    jpeg: { quality: number };
    png: { quality: number };
  };
  placeholder: {
    width: number;
    height: number;
    blur: number;
    quality: number;
  };
} 