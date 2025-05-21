# Image Optimization for SEO and Performance

This document explains the image optimization approach implemented in the Harrpy website to improve SEO scores, page performance, and user experience.

## Features

- **Multiple Format Generation**: Automatically converts images to modern formats (AVIF, WebP) with fallbacks (JPG/PNG)
- **Responsive Images**: Creates multiple sizes for different viewport widths (-sm, -md, full size)
- **Blur-up Loading**: Tiny placeholder images for blur-up loading effect
- **Lazy Loading**: Images only load when they approach the viewport
- **Quality Optimization**: Balances visual quality and file size
- **Transparent PNG Support**: Maintains transparency when needed

## Components

1. **OptimizedImage Component** (`src/components/common/OptimizedImage.tsx`)
   - React component for displaying optimized images
   - Uses `<picture>` element with appropriate sources
   - Implements lazy loading and blur-up effect
   - Handles fallbacks for browsers with limited format support

2. **Setup Script** (`scripts/setup-images.js`)
   - Sets up required directories for development
   - Creates sample optimized images for testing

3. **Optimization Script** (`scripts/optimize-images.js`)
   - Processes all images in the project
   - Generates multiple formats and sizes
   - Creates tiny placeholder images for blur effect

## Usage

### Using the OptimizedImage Component

```tsx
import OptimizedImage from '../components/common/OptimizedImage';

// Basic usage
<OptimizedImage 
  src="/images/example.jpg" 
  alt="Example image" 
/>

// With additional options
<OptimizedImage 
  src="/images/example.jpg" 
  alt="Example image description" 
  className="rounded-lg" 
  eager={true} // Load immediately (for above-the-fold images)
  quality="high" // Quality level (high, medium, low)
  blurPlaceholder={true} // Use blur effect while loading
  sizes="(max-width: 640px) 100vw, 50vw" // Responsive sizing
/>
```

### Running the Image Optimization

```bash
# Setup image directories (runs automatically with npm run dev)
npm run setup-images

# Optimize all images in the project
npm run optimize-images

# Build for production with image optimization
npm run build-production
```

## Workflow

1. Place original images in the `/public/images/` directory
2. Run `npm run optimize-images` to generate optimized versions
3. Use the `OptimizedImage` component in your React code
4. Images will automatically use the optimized versions if available

## Performance Impact

- **Reduced Page Weight**: Modern formats (AVIF, WebP) reduce file size by 30-80% compared to JPG/PNG
- **Faster Loading**: Responsive images load appropriate sizes based on viewport
- **Improved Core Web Vitals**: Reduced CLS (Content Layout Shift) and LCP (Largest Contentful Paint)
- **Better User Experience**: Progressive loading with blur-up effect
- **SEO Benefits**: Faster page speed improves search engine rankings 