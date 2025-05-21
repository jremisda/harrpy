import React, { useState, useEffect } from 'react';
import { OptimizedImage } from '../../types/images';

interface ImagePreviewProps {
  image: OptimizedImage;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: 'high' | 'medium' | 'low';
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  image,
  className = '',
  priority = false,
  sizes = '100vw',
  quality = 'high',
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Determine quality suffix
  const qualitySuffix = quality === 'high' ? '' : quality === 'medium' ? '-md' : '-sm';

  // Generate srcset for different formats
  const generateSrcSet = (format: 'avif' | 'webp' | 'jpeg') => {
    const sizes = ['sm', 'md', 'lg'];
    return sizes
      .map((size) => {
        const suffix = size === 'lg' ? qualitySuffix : `-${size}${qualitySuffix}`;
        const url = image.formats[format]?.replace(/\.[^.]+$/, `${suffix}.${format}`);
        return url ? `${url} ${size === 'sm' ? '640w' : size === 'md' ? '1280w' : '1920w'}` : null;
      })
      .filter(Boolean)
      .join(', ');
  };

  // Handle image load
  const handleLoad = () => {
    setIsLoading(false);
    setError(null);
  };

  // Handle image error
  const handleError = () => {
    setIsLoading(false);
    setError('Failed to load image');
  };

  return (
    <div className={`relative ${className}`}>
      {/* Loading placeholder */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 rounded">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Image */}
      <picture>
        {/* AVIF format */}
        {image.formats.avif && (
          <source
            type="image/avif"
            srcSet={generateSrcSet('avif')}
            sizes={sizes}
          />
        )}

        {/* WebP format */}
        {image.formats.webp && (
          <source
            type="image/webp"
            srcSet={generateSrcSet('webp')}
            sizes={sizes}
          />
        )}

        {/* JPEG fallback */}
        <img
          src={image.formats.jpeg || image.url}
          alt={image.alt}
          width={image.width}
          height={image.height}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          onLoad={handleLoad}
          onError={handleError}
          className={`
            w-full h-full object-cover rounded
            transition-opacity duration-300
            ${isLoading ? 'opacity-0' : 'opacity-100'}
          `}
        />
      </picture>

      {/* Placeholder */}
      {image.placeholder && (
        <img
          src={image.placeholder}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 -z-10"
          aria-hidden="true"
        />
      )}
    </div>
  );
}; 