import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = 'Harrpy | Swipe. Match. Collab',
  description = 'Connect with verified creators and local businesses through swipe-to-match collabs. Trusted, fast, and BS-free. Join the waitlist now.',
  canonical,
  ogImage = '/images/harrpy-logo.png',
}) => {
  const fullTitle = title !== 'Harrpy | Swipe. Match. Collab' ? title : 'Harrpy | Swipe. Match. Collab';
  
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      {canonical && <meta property="og:url" content={canonical} />}
      {ogImage && <meta property="og:image" content={ogImage} />}
      
      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
    </Helmet>
  );
};

export default SEO; 