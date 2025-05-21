import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  type?: 'website' | 'article';
  publishedAt?: string;
  modifiedAt?: string;
  author?: string;
  section?: string;
  tags?: string[];
  siteName?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = 'Harrpy | Swipe. Match. Collab',
  description = 'Connect with verified creators and local businesses through swipe-to-match collabs. Trusted, fast, and BS-free. Join the waitlist now.',
  canonical,
  ogImage = 'https://tdkqhl7odedylxty.public.blob.vercel-storage.com/harrpy-logo-rI7LZcaL4a4CIdfw48Eq3jYXenBi2d.png',
  type = 'website',
  publishedAt,
  modifiedAt,
  author,
  section,
  tags = [],
  siteName = 'Harrpy',
}) => {
  const fullTitle = title !== 'Harrpy | Swipe. Match. Collab' ? title : 'Harrpy | Swipe. Match. Collab';
  
  // Make sure ogImage is an absolute URL
  let absoluteOgImage = ogImage;
  if (ogImage && !ogImage.startsWith('http')) {
    absoluteOgImage = `${window.location.origin}${ogImage.startsWith('/') ? '' : '/'}${ogImage}`;
  }
  
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      {canonical && <meta property="og:url" content={canonical} />}
      {absoluteOgImage && <meta property="og:image" content={absoluteOgImage} />}
      <meta property="og:site_name" content={siteName} />
      
      {/* Additional Open Graph tags for articles */}
      {type === 'article' && (
        <>
          {publishedAt && <meta property="article:published_time" content={publishedAt} />}
          {modifiedAt && <meta property="article:modified_time" content={modifiedAt} />}
          {section && <meta property="article:section" content={section} />}
          {author && <meta property="article:author" content={author} />}
          {tags && tags.map((tag, index) => (
            <meta key={`article:tag:${index}`} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Open Graph image dimensions for better sharing */}
      {absoluteOgImage && (
        <>
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:image:alt" content={fullTitle} />
        </>
      )}
      
      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@harrpy" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {absoluteOgImage && <meta name="twitter:image" content={absoluteOgImage} />}
      {absoluteOgImage && <meta name="twitter:image:alt" content={fullTitle} />}
    </Helmet>
  );
};

export default SEO; 