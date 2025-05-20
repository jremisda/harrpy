import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import article data
import { articles } from '../src/data/articles/index.js';

// Base URL of the site
const BASE_URL = 'https://harrpy.com';

// Sitemap generation function
async function generateSitemap() {
  try {
    console.log('Generating sitemap.xml...');
    
    // Static pages
    const staticPages = [
      { url: '/', changefreq: 'weekly', priority: '1.0' },
      { url: '/news', changefreq: 'daily', priority: '0.9' },
      { url: '/waitlist', changefreq: 'monthly', priority: '0.7' }
    ];
    
    // Collect article pages
    const articlePages = articles
      .filter(article => article.status === 'published')
      .map(article => ({
        url: `/articles/${article.slug}`,
        changefreq: 'monthly',
        priority: '0.8',
        lastmod: article.updatedAt || article.publishedAt
      }));
    
    // Combine all pages
    const allPages = [...staticPages, ...articlePages];
    
    // Generate XML content
    let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xmlContent += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    // Add each URL to the sitemap
    allPages.forEach(page => {
      xmlContent += '  <url>\n';
      xmlContent += `    <loc>${BASE_URL}${page.url}</loc>\n`;
      if (page.lastmod) {
        xmlContent += `    <lastmod>${new Date(page.lastmod).toISOString().split('T')[0]}</lastmod>\n`;
      }
      xmlContent += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xmlContent += `    <priority>${page.priority}</priority>\n`;
      xmlContent += '  </url>\n';
    });
    
    xmlContent += '</urlset>';
    
    // Write sitemap to public directory
    const sitemapPath = path.resolve(__dirname, '../public/sitemap.xml');
    fs.writeFileSync(sitemapPath, xmlContent);
    
    console.log(`Sitemap generated successfully at ${sitemapPath}`);
    console.log(`Total URLs in sitemap: ${allPages.length}`);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  }
}

// Run the sitemap generator
generateSitemap(); 