import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IMAGES_DIR = path.join(__dirname, 'public', 'images');
const OPTIMIZED_DIR = path.join(__dirname, 'public', 'images', 'optimized');

// Ensure optimized directory exists
if (!fs.existsSync(OPTIMIZED_DIR)) {
  fs.mkdirSync(OPTIMIZED_DIR, { recursive: true });
}

// Get all image files
const imageFiles = fs.readdirSync(IMAGES_DIR).filter(file => {
  const ext = path.extname(file).toLowerCase();
  return ['.png', '.jpg', '.jpeg', '.webp'].includes(ext) && !file.startsWith('.');
});

// Optimize settings for different image types
const settings = {
  hero: { width: 1920, quality: 80 },      // Hero images
  background: { width: 1600, quality: 75 }, // Background images
  logo: { width: 200, quality: 90 }        // Logo and smaller images
};

async function optimizeImage(file) {
  const filePath = path.join(IMAGES_DIR, file);
  const fileStats = fs.statSync(filePath);
  const fileSizeMB = fileStats.size / (1024 * 1024);
  const fileExt = path.extname(file).toLowerCase();
  const fileName = path.basename(file, fileExt);
  
  console.log(`Processing ${file} (${fileSizeMB.toFixed(2)} MB)...`);
  
  let setting;
  
  // Determine appropriate settings based on filename or size
  if (file.includes('hero') || file.includes('background') || file.includes('bg') || fileSizeMB > 1.5) {
    setting = settings.hero;
  } else if (file.includes('logo') || fileSizeMB < 0.5) {
    setting = settings.logo;
  } else {
    setting = settings.background;
  }
  
  try {
    // Convert to WebP for better compression
    const webpOutput = path.join(OPTIMIZED_DIR, `${fileName}.webp`);
    await sharp(filePath)
      .resize(setting.width)
      .webp({ quality: setting.quality })
      .toFile(webpOutput);
      
    // Also keep a PNG version as fallback with reduced quality
    const pngOutput = path.join(OPTIMIZED_DIR, `${fileName}.png`);
    await sharp(filePath)
      .resize(setting.width)
      .png({ quality: Math.max(60, setting.quality - 10), compressionLevel: 9 })
      .toFile(pngOutput);
    
    const webpStats = fs.statSync(webpOutput);
    const webpSizeMB = webpStats.size / (1024 * 1024);
    
    console.log(`✅ Optimized ${file} from ${fileSizeMB.toFixed(2)} MB to ${webpSizeMB.toFixed(2)} MB (${((1 - webpSizeMB / fileSizeMB) * 100).toFixed(1)}% reduction)`);
  } catch (error) {
    console.error(`❌ Error optimizing ${file}:`, error.message);
  }
}

async function optimizeAllImages() {
  console.log(`Found ${imageFiles.length} images to optimize`);
  
  for (const file of imageFiles) {
    await optimizeImage(file);
  }
  
  console.log('Image optimization complete!');
}

optimizeAllImages().catch(error => {
  console.error('Image optimization script failed:', error);
  process.exit(1);
}); 