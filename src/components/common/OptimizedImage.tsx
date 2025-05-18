import React, { useState } from 'react';
import useLazyLoad from '../../hooks/useLazyLoad';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  placeholderColor?: string;
  eager?: boolean; // For images that should load immediately (e.g., above the fold)
}

/**
 * OptimizedImage component that automatically uses WebP with PNG fallback.
 * It assumes optimized images are in the /images/optimized directory.
 * Includes lazy loading and placeholder support.
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({ 
  src, 
  alt, 
  className,
  placeholderColor = '#f8f8f8',
  eager = false,
  ...props 
}) => {
  // Track image loading state
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Use lazy loading hook unless eager loading is specified
  const { elementRef, isVisible } = useLazyLoad<HTMLDivElement>({
    once: true,
    rootMargin: '200px 0px', // Start loading when image is 200px from viewport
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

  // Extract base name and create optimized image paths
  const baseName = getBaseName(src);
  const webpSrc = `/images/optimized/${baseName}.webp`;
  const pngSrc = `/images/optimized/${baseName}.png`;
  
  // Fall back to original if needed
  const originalSrc = src.startsWith('/') ? src : `/${src}`;

  // Check if path includes articles - these might not be optimized
  const isArticleImage = src.includes('/articles/');

  // Handle image load event
  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div 
      ref={eager ? null : elementRef}
      className={`relative overflow-hidden ${className || ''}`}
      style={{
        backgroundColor: placeholderColor,
        width: '100%',
        height: '100%',
      }}
    >
      {shouldRender && (
        isArticleImage ? (
          // For article images, use original path directly to avoid 404s
          <img
            src={originalSrc}
            alt={alt}
            className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            loading={eager ? 'eager' : 'lazy'}
            onLoad={handleImageLoad}
            {...props}
          />
        ) : (
          // For other images, try optimized versions first with fallback
          <picture>
            <source srcSet={webpSrc} type="image/webp" />
            <source srcSet={pngSrc} type="image/png" />
            <img
              src={originalSrc}
              alt={alt}
              className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
              loading={eager ? 'eager' : 'lazy'}
              onLoad={handleImageLoad}
              {...props}
            />
          </picture>
        )
      )}
    </div>
  );
};

export default OptimizedImage; 