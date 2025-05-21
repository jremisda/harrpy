import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Article } from '../../types';

interface StructuredDataProps {
  pageType: 'home' | 'news' | 'article' | 'waitlist' | '404';
  url: string;
  title: string;
  description: string;
  imageUrl?: string;
  article?: Article;
}

const StructuredData: React.FC<StructuredDataProps> = ({ 
  pageType, 
  url, 
  title, 
  description, 
  imageUrl,
  article
}) => {
  // Basic organization schema that will be used across all pages
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'Harrpy',
    'url': 'https://harrpy.com',
    'logo': 'https://tdkqhl7odedylxty.public.blob.vercel-storage.com/harrpy-logo-rI7LZcaL4a4CIdfw48Eq3jYXenBi2d.png',
    'sameAs': [
      'https://twitter.com/harrpy',
      'https://instagram.com/harrpy',
      'https://linkedin.com/company/harrpy'
    ],
    'description': 'Harrpy connects verified creators and businesses for local collaborations through a swipe-to-match platform.'
  };

  // Website schema
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'Harrpy',
    'url': 'https://harrpy.com',
    'potentialAction': {
      '@type': 'SearchAction',
      'target': 'https://harrpy.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };

  // Generate specific schema based on page type
  let pageSpecificSchema = null;

  switch (pageType) {
    case 'home':
      pageSpecificSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        'url': url,
        'name': title,
        'description': description,
        'isPartOf': {
          '@type': 'WebSite',
          'name': 'Harrpy',
          'url': 'https://harrpy.com'
        },
        'primaryImageOfPage': {
          '@type': 'ImageObject',
          'url': imageUrl || 'https://harrpy.com/images/harrpy-social.png'
        }
      };
      break;

    case 'article':
      if (article) {
        pageSpecificSchema = {
          '@context': 'https://schema.org',
          '@type': 'Article',
          'headline': article.title,
          'description': article.summary,
          'image': article.image.url,
          'datePublished': article.publishedAt,
          'dateModified': article.updatedAt,
          'author': {
            '@type': 'Person',
            'name': article.author.name
          },
          'publisher': {
            '@type': 'Organization',
            'name': 'Harrpy',
            'logo': {
              '@type': 'ImageObject',
              'url': 'https://tdkqhl7odedylxty.public.blob.vercel-storage.com/harrpy-logo-rI7LZcaL4a4CIdfw48Eq3jYXenBi2d.png'
            }
          },
          'mainEntityOfPage': {
            '@type': 'WebPage',
            '@id': url
          },
          'articleSection': article.category.name,
          'keywords': article.tags.map(tag => tag.name).join(',')
        };
      }
      break;

    case 'news':
      pageSpecificSchema = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        'url': url,
        'name': title,
        'description': description,
        'isPartOf': {
          '@type': 'WebSite',
          'name': 'Harrpy',
          'url': 'https://harrpy.com'
        }
      };
      break;

    case 'waitlist':
      pageSpecificSchema = {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        'url': url,
        'name': title,
        'description': description,
        'isPartOf': {
          '@type': 'WebSite',
          'name': 'Harrpy',
          'url': 'https://harrpy.com'
        }
      };
      break;

    default:
      // 404 pages typically don't need special structured data
      break;
  }

  return (
    <Helmet>
      {/* Organization Schema */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>

      {/* Website Schema */}
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>

      {/* Page Specific Schema */}
      {pageSpecificSchema && (
        <script type="application/ld+json">
          {JSON.stringify(pageSpecificSchema)}
        </script>
      )}
    </Helmet>
  );
};

export default StructuredData; 