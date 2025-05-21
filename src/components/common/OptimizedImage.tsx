import React, { useState, useEffect, useRef, memo } from 'react';
import useLazyLoad from '../../hooks/useLazyLoad';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  placeholderColor?: string;
  eager?: boolean; // For images that should load immediately (e.g., above the fold)
  sizes?: string; // Responsive sizes attribute
  quality?: 'high' | 'medium' | 'low'; // Image quality level
  blurPlaceholder?: boolean; // Whether to use blur placeholder
  fallbackToOriginal?: boolean; // Whether to fall back to original image if optimized version doesn't exist
}

/**
 * OptimizedImage component that automatically uses modern formats with fallbacks.
 * It assumes optimized images are in the /images/optimized directory.
 * Includes lazy loading, placeholder support, and next-gen formats (AVIF, WebP).
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({ 
  src, 
  alt, 
  className,
  placeholderColor = '#f8f8f8',
  eager = false,
  sizes = '100vw',
  quality = 'high',
  blurPlaceholder = false,
  fallbackToOriginal = true,
  ...props 
}) => {
  // Track image loading state
  const [isLoaded, setIsLoaded] = useState(false);
  const [optimizedImagesExist, setOptimizedImagesExist] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  
  // Use lazy loading hook unless eager loading is specified
  const { elementRef, isVisible } = useLazyLoad<HTMLDivElement>({
    once: true,
    rootMargin: '300px 0px', // Increased margin to preload images sooner
  });

  // Always render eagerly loaded images
  const shouldRender = eager || isVisible;

  // Extract the file name without extension
  const getBaseName = (path: string) => {
    // Extract just the filename
    const fileName = path.split('/').pop() || '';
    // Remove extension
    return fileName.split('.')[0];
  };

  // Extract base name and create optimized image paths - memoize for performance
  const baseName = getBaseName(src);
  
  // Get quality suffix based on quality prop
  const qualitySuffix = quality === 'high' ? '' : `-${quality}`;
  
  // Generate responsive image paths with different formats
  const avifSrc = `/images/optimized/${baseName}${qualitySuffix}.avif`;
  const webpSrc = `/images/optimized/${baseName}${qualitySuffix}.webp`;
  const pngSrc = `/images/optimized/${baseName}${qualitySuffix}.png`;
  const jpgSrc = `/images/optimized/${baseName}${qualitySuffix}.jpg`;
  
  // Fall back to original if needed
  const originalSrc = src.startsWith('/') ? src : `/${src}`;

  // Check if path includes articles - these might not be optimized
  const isArticleImage = src.includes('/articles/');
  
  // Handle image load event with requestAnimationFrame for smoother transitions
  const handleImageLoad = () => {
    requestAnimationFrame(() => {
      setIsLoaded(true);
    });
  };
  
  // Handle image error - fall back to original
  const handleImageError = () => {
    if (fallbackToOriginal) {
      setOptimizedImagesExist(false);
    }
  };
  
  // Check if optimized directory exists - only once per image
  useEffect(() => {
    // Skip check for article images
    if (isArticleImage) return;
    
    // If we're already visible, prioritize loading the full image first
    if (shouldRender) {
      // Set a short timeout to check for optimized images after the main image starts loading
      const checkTimer = setTimeout(() => {
        const img = new Image();
        img.onload = () => setOptimizedImagesExist(true);
        img.onerror = () => setOptimizedImagesExist(false);
        img.src = jpgSrc; // Check if the jpg version exists
      }, 100);
      
      return () => clearTimeout(checkTimer);
    } else {
      // If not visible yet, we can check for optimized images immediately
      const img = new Image();
      img.onload = () => setOptimizedImagesExist(true);
      img.onerror = () => setOptimizedImagesExist(false);
      img.src = jpgSrc; // Check if the jpg version exists
    }
  }, [jpgSrc, isArticleImage, shouldRender]);

  // Calculate srcSet for responsive images - inline function is fine since it's only called when rendered
  const generateSrcSet = (basePath: string, ext: string) => {
    return `
      ${basePath.replace(ext, `-sm${ext}`)} 640w,
      ${basePath.replace(ext, `-md${ext}`)} 1280w,
      ${basePath} 1920w
    `;
  };

  // Set fetchpriority attribute manually
  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.setAttribute('fetchpriority', eager ? 'high' : 'auto');
    }
  }, [eager]);

  return (
    <div 
      ref={eager ? null : elementRef}
      className={`optimized-image-container ${className || ''}`}
      style={{ 
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: placeholderColor,
        contain: 'layout', // Less restrictive containment for better rendering
      }}
    >
      {/* Static color background - always present for immediate display */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: placeholderColor,
          zIndex: 0
        }}
      />
      
      {shouldRender && (
        <div 
          className="absolute inset-0 z-1"
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.2s ease-out',
          }}
        >
          {isArticleImage || !optimizedImagesExist ? (
            // For article images or when optimized images don't exist, use original path
            <img
              ref={imageRef}
              src={originalSrc}
              alt={alt}
              className="w-full h-full object-cover"
              loading={eager ? 'eager' : 'lazy'}
              onLoad={handleImageLoad}
              decoding="async"
              sizes={sizes}
              {...props}
            />
          ) : (
            // For other images with optimized versions
            <picture>
              {/* AVIF format - best compression, modern browsers */}
              <source 
                srcSet={generateSrcSet(avifSrc, '.avif')}
                type="image/avif" 
                sizes={sizes}
              />
              
              {/* WebP format - good compression, wide support */}
              <source 
                srcSet={generateSrcSet(webpSrc, '.webp')}
                type="image/webp" 
                sizes={sizes}
              />
              
              {/* JPEG format - universal fallback */}
              <source 
                srcSet={generateSrcSet(jpgSrc, '.jpg')}
                type="image/jpeg" 
                sizes={sizes}
              />
              
              {/* Ultimate fallback */}
              <img
                ref={imageRef}
                src={originalSrc}
                alt={alt}
                className="w-full h-full object-cover"
                loading={eager ? 'eager' : 'lazy'}
                onLoad={handleImageLoad}
                onError={handleImageError}
                decoding="async"
                sizes={sizes}
                {...props}
              />
            </picture>
          )}
        </div>
      )}
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(OptimizedImage); 