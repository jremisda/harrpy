import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

// Get directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.join(__dirname, '..');

// Configuration
const BASE_URL = process.env.SITE_URL || 'https://harrpy.vercel.app'; // Replace with your actual site URL
const MAX_REDIRECTS = 10;
const OUTPUT_FILE = path.join(PROJECT_ROOT, 'redirect-report.md');
const VERCEL_CONFIG = path.join(PROJECT_ROOT, 'vercel.json');

// Read all redirects from vercel.json
async function getConfiguredRedirects() {
  try {
    const vercelConfig = JSON.parse(fs.readFileSync(VERCEL_CONFIG, 'utf8'));
    return vercelConfig.redirects || [];
  } catch (error) {
    console.error('Error reading vercel.json:', error);
    return [];
  }
}

// Read all client-side redirects
async function getClientRedirects() {
  try {
    // Parse the redirects.ts file to extract LEGACY_PATHS
    const redirectsPath = path.join(PROJECT_ROOT, 'src/utils/redirects.ts');
    const redirectsContent = fs.readFileSync(redirectsPath, 'utf8');
    
    // Extract the LEGACY_PATHS object using regex
    const match = redirectsContent.match(/LEGACY_PATHS\s*:\s*Record<string,\s*string>\s*=\s*({[\s\S]*?});/);
    if (!match) return [];
    
    const objectText = match[1];
    
    // Extract key-value pairs using regex instead of JSON parsing
    // This is more robust against formatting issues
    const result = {};
    const regex = /['"]?(\/[^'"]+)['"]?\s*:\s*['"]?(\/[^'"]+)['"]?/g;
    let matchPath;
    
    while ((matchPath = regex.exec(objectText)) !== null) {
      if (matchPath[1] && matchPath[2]) {
        result[matchPath[1]] = matchPath[2];
      }
    }
    
    return result;
  } catch (error) {
    console.error('Error reading client redirects:', error);
    return [];
  }
}

// Find potential internal links in source code
async function findInternalLinks() {
  const links = new Set();
  
  // Look for route definitions
  const routesRegex = /<Route path="([^"]+)"/g;
  const linkRegex = /<Link to="([^"]+)"/g;
  const navigateRegex = /navigate\(['"]([^'"]+)['"]\)/g;
  
  // File extensions to search
  const extensions = ['.tsx', '.jsx', '.ts', '.js'];
  
  // Search through source files
  function searchDir(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const file of files) {
      const fullPath = path.join(dir, file.name);
      
      if (file.isDirectory() && file.name !== 'node_modules' && file.name !== 'dist' && !file.name.startsWith('.')) {
        searchDir(fullPath);
      } else if (file.isFile() && extensions.some(ext => file.name.endsWith(ext))) {
        const content = fs.readFileSync(fullPath, 'utf8');
        
        // Look for routes
        let match;
        while ((match = routesRegex.exec(content)) !== null) {
          if (match[1].startsWith('/') && !match[1].includes('*')) {
            links.add(match[1]);
          }
        }
        
        // Look for Link components
        while ((match = linkRegex.exec(content)) !== null) {
          if (match[1].startsWith('/')) {
            links.add(match[1]);
          }
        }
        
        // Look for navigate calls
        while ((match = navigateRegex.exec(content)) !== null) {
          if (match[1].startsWith('/')) {
            links.add(match[1]);
          }
        }
      }
    }
  }
  
  try {
    searchDir(path.join(PROJECT_ROOT, 'src'));
    return Array.from(links);
  } catch (error) {
    console.error('Error finding internal links:', error);
    return [];
  }
}

// Check a URL for redirects
async function checkRedirect(url, visited = []) {
  try {
    // Don't follow too many redirects
    if (visited.length >= MAX_REDIRECTS) {
      return { 
        url, 
        chain: [...visited, url],
        status: 'ERROR',
        message: 'Too many redirects'
      };
    }
    
    // Add current URL to visited
    visited.push(url);
    
    // Make request with redirect: manual to detect redirects
    const response = await fetch(url, { 
      method: 'HEAD',
      redirect: 'manual',
      timeout: 10000 
    });
    
    // Check if it's a redirect
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      
      if (!location) {
        return { 
          url, 
          chain: visited,
          status: 'ERROR',
          message: `Redirect status ${response.status} without Location header`
        };
      }
      
      // Resolve relative URLs
      const nextUrl = location.startsWith('http') 
        ? location 
        : new URL(location, url).toString();
      
      // Follow the redirect
      return checkRedirect(nextUrl, visited);
    }
    
    // Final destination
    return { 
      url, 
      chain: visited,
      status: response.status >= 200 && response.status < 300 ? 'OK' : 'ERROR',
      statusCode: response.status,
      message: response.status >= 200 && response.status < 300 
        ? 'Successful' 
        : `HTTP error ${response.status}`
    };
  } catch (error) {
    return { 
      url, 
      chain: visited,
      status: 'ERROR',
      message: `Error checking URL: ${error.message}`
    };
  }
}

// Format a chain for the report
function formatChain(chain) {
  if (chain.length === 1) {
    return `\`${chain[0]}\` (Direct)`;
  }
  
  return chain.map((url, index) => {
    if (index === chain.length - 1) {
      return `\`${url}\` (Final)`;
    } else {
      return `\`${url}\` → `;
    }
  }).join('');
}

// Generate a markdown report of all redirects
async function generateReport() {
  console.log('Analyzing redirects...');
  
  // Get all configured redirects
  const serverRedirects = await getConfiguredRedirects();
  const clientRedirects = await getClientRedirects();
  const internalLinks = await findInternalLinks();
  
  console.log(`Found ${serverRedirects.length} server redirects`);
  console.log(`Found ${Object.keys(clientRedirects).length} client redirects`);
  console.log(`Found ${internalLinks.length} internal links`);
  
  // URLs to check
  const urlsToCheck = [];
  
  // Add server redirects
  for (const redirect of serverRedirects) {
    // Convert glob patterns to actual URLs
    const source = redirect.source.replace(/\(\.\*\)/, 'example');
    urlsToCheck.push({
      type: 'Server Redirect',
      source: redirect.source,
      path: source.replace(/\/:([^/]+)/g, '/$1-example'),
      destination: redirect.destination,
    });
  }
  
  // Add client redirects
  for (const [source, destination] of Object.entries(clientRedirects)) {
    urlsToCheck.push({
      type: 'Client Redirect',
      source,
      path: source,
      destination,
    });
  }
  
  // Check all URLs
  const results = [];
  let count = 0;
  
  for (const url of urlsToCheck) {
    count++;
    process.stdout.write(`Checking URL ${count}/${urlsToCheck.length}: ${url.path}              \r`);
    
    // Skip checking external URLs
    if (url.destination.startsWith('http') && !url.destination.includes(BASE_URL)) {
      results.push({
        ...url,
        result: {
          status: 'SKIPPED',
          message: 'External URL'
        }
      });
      continue;
    }
    
    const fullUrl = url.path.startsWith('http') 
      ? url.path 
      : `${BASE_URL}${url.path}`;
    
    const result = await checkRedirect(fullUrl);
    
    results.push({
      ...url,
      result
    });
  }
  
  // Generate report
  const report = [
    '# Redirect Analysis Report',
    '',
    `**Generated on:** ${new Date().toLocaleString()}`,
    `**Site URL:** ${BASE_URL}`,
    '',
    '## Summary',
    '',
    `- **Total Redirects:** ${results.length}`,
    `- **Server Redirects:** ${serverRedirects.length}`,
    `- **Client Redirects:** ${Object.keys(clientRedirects).length}`,
    `- **Redirect Chains:** ${results.filter(r => r.result.chain && r.result.chain.length > 2).length}`,
    `- **Problematic Redirects:** ${results.filter(r => r.result.status === 'ERROR').length}`,
    '',
    '## Redirect Chain Analysis',
    '',
    '| Type | Source | Destination | Chain Length | Status | Details |',
    '|------|--------|-------------|--------------|--------|---------|',
  ];
  
  // Format each result
  for (const item of results) {
    const chainLength = item.result.chain ? item.result.chain.length : 1;
    const chainText = item.result.chain ? formatChain(item.result.chain) : 'N/A';
    
    report.push(
      `| ${item.type} | \`${item.source}\` | \`${item.destination}\` | ${chainLength} | ${item.result.status} | ${item.result.message || ''} |`
    );
  }
  
  // Add internal links section
  report.push(
    '',
    '## Internal Links',
    '',
    'These are internal links found in the codebase. This helps identify links that might need to be updated:',
    '',
    '```',
    ...internalLinks.sort().map(link => ` - ${link}`),
    '```',
    '',
    '## Recommendations',
    '',
    '### Redirect Chains to Fix',
    '',
  );
  
  // Add recommendations for chains longer than 2
  const chainsToFix = results.filter(r => r.result.chain && r.result.chain.length > 2);
  
  if (chainsToFix.length === 0) {
    report.push('No redirect chains found! 🎉');
  } else {
    for (const item of chainsToFix) {
      report.push(`1. Replace links to \`${item.source}\` with \`${item.result.chain[item.result.chain.length - 1]}\` (chain length: ${item.result.chain.length})`);
    }
  }
  
  // Add recommendations for problematic redirects
  const problematicRedirects = results.filter(r => r.result.status === 'ERROR');
  
  if (problematicRedirects.length > 0) {
    report.push(
      '',
      '### Problematic Redirects to Fix',
      '',
    );
    
    for (const item of problematicRedirects) {
      report.push(`1. Fix redirect from \`${item.source}\` - Error: ${item.result.message}`);
    }
  }
  
  // Save report
  fs.writeFileSync(OUTPUT_FILE, report.join('\n'));
  console.log(`\nAnalysis complete! Report saved to ${OUTPUT_FILE}`);
}

// Run the analysis
generateReport().catch(error => {
  console.error('Error generating report:', error);
  process.exit(1);
}); 