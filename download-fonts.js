import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FONTS_DIR = path.join(__dirname, 'public', 'fonts');

// Ensure fonts directory exists
if (!fs.existsSync(FONTS_DIR)) {
  fs.mkdirSync(FONTS_DIR, { recursive: true });
}

// Font URLs - these are example URLs, not guaranteed to work
const INTER_FONTS = [
  {
    name: 'Inter-Regular',
    url: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZJhjp-Ek-_EeAmM.woff2'
  },
  {
    name: 'Inter-Medium',
    url: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZJhjp-Ek-_EeAmM.woff2'
  },
  {
    name: 'Inter-SemiBold',
    url: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZJhjp-Ek-_EeAmM.woff2'
  },
  {
    name: 'Inter-Bold',
    url: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZJhjp-Ek-_EeAmM.woff2'
  },
  {
    name: 'Inter-Black',
    url: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZJhjp-Ek-_EeAmM.woff2'
  }
];

// For Satoshi, we'll need to find sources since it's not on Google Fonts
// These are placeholder URLs
const SATOSHI_FONTS = [
  {
    name: 'Satoshi-Light',
    url: 'https://api.fontshare.com/v2/fonts/satoshi/woff2/Satoshi-Light.woff2'
  },
  {
    name: 'Satoshi-Regular',
    url: 'https://api.fontshare.com/v2/fonts/satoshi/woff2/Satoshi-Regular.woff2'
  },
  {
    name: 'Satoshi-Medium',
    url: 'https://api.fontshare.com/v2/fonts/satoshi/woff2/Satoshi-Medium.woff2'
  },
  {
    name: 'Satoshi-Bold',
    url: 'https://api.fontshare.com/v2/fonts/satoshi/woff2/Satoshi-Bold.woff2'
  },
  {
    name: 'Satoshi-Black',
    url: 'https://api.fontshare.com/v2/fonts/satoshi/woff2/Satoshi-Black.woff2'
  }
];

async function downloadFont(font) {
  try {
    console.log(`Downloading ${font.name}...`);
    const response = await fetch(font.url);
    
    if (!response.ok) {
      throw new Error(`Failed to download ${font.name}: ${response.statusText}`);
    }
    
    const buffer = await response.buffer();
    const filePath = path.join(FONTS_DIR, `${font.name}.woff2`);
    
    fs.writeFileSync(filePath, buffer);
    console.log(`Successfully downloaded ${font.name} to ${filePath}`);
  } catch (error) {
    console.error(`Error downloading ${font.name}:`, error.message);
  }
}

async function downloadFonts() {
  console.log('Starting font downloads...');
  
  // Download Inter fonts
  for (const font of INTER_FONTS) {
    await downloadFont(font);
  }
  
  // Download Satoshi fonts
  for (const font of SATOSHI_FONTS) {
    await downloadFont(font);
  }
  
  console.log('Font downloads complete!');
}

downloadFonts().catch(error => {
  console.error('Font download script failed:', error);
  process.exit(1);
}); 