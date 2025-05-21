import { ImageProcessingConfig } from '../types/images';

export const IMAGE_CONFIG: ImageProcessingConfig = {
  sizes: {
    sm: { width: 640, height: null, suffix: '-sm' },
    md: { width: 1280, height: null, suffix: '-md' },
    lg: { width: 1920, height: null, suffix: '' },
  },
  quality: {
    avif: { quality: 65 },
    webp: { quality: 80 },
    jpeg: { quality: 85 },
    png: { quality: 85 },
  },
  placeholder: {
    width: 20,
    height: 20,
    blur: 5,
    quality: 60,
  },
};

export const UPLOAD_CONFIG = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedMimeTypes: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif',
  ],
  uploadDir: 'public/uploads',
  optimizedDir: 'public/uploads/optimized',
  placeholderDir: 'public/uploads/optimized/placeholders',
};

export const CACHE_CONFIG = {
  maxAge: 31536000, // 1 year in seconds
  staleWhileRevalidate: 86400, // 1 day in seconds
};

export const RATE_LIMIT_CONFIG = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many uploads from this IP, please try again later',
}; 