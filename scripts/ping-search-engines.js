import fetch from 'node-fetch';

const SITE_URL = 'https://harrpy.com';
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;

// List of search engine ping URLs
const PING_URLS = [
  `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`,
  `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`
];

async function pingSearchEngines() {
  console.log('Pinging search engines about sitemap update...');
  
  for (const pingUrl of PING_URLS) {
    try {
      const response = await fetch(pingUrl);
      if (response.ok) {
        console.log(`Successfully pinged: ${pingUrl}`);
      } else {
        console.error(`Failed to ping: ${pingUrl}, Status: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error pinging ${pingUrl}:`, error);
    }
  }
}

// Execute the ping
pingSearchEngines(); 