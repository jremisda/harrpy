import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

// Get directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.join(__dirname, '../public');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');
const OPTIMIZED_DIR = path.join(IMAGES_DIR, 'optimized');
const PLACEHOLDERS_DIR = path.join(OPTIMIZED_DIR, 'placeholders');

// Ensure directories exist
function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Image size configurations
const SIZES = {
  sm: { width: 640, height: null, suffix: '-sm' },
  md: { width: 1280, height: null, suffix: '-md' },
  lg: { width: 1920, height: null, suffix: '' }, // Original size (no suffix)
};

// Image quality configurations
const QUALITY = {
  avif: { quality: 65 },
  webp: { quality: 80 },
  jpeg: { quality: 85 },
  png: { quality: 85 },
};

// Skip certain directories
const SKIP_DIRS = ['node_modules', 'dist', 'build', 'optimized', 'images/optimized'];

// Find all images recursively
async function findImages() {
  const imagePattern = path.join(PUBLIC_DIR, '**/*.{jpg,jpeg,png,gif}');
  const images = await glob(imagePattern, { ignore: SKIP_DIRS.map(dir => `**/${dir}/**`) });
  return images;
}

// Process a single image
async function processImage(imagePath) {
  try {
    // Get base name and create output directory if needed
    const relativePath = path.relative(PUBLIC_DIR, imagePath);
    const dirName = path.dirname(relativePath);
    const fileName = path.basename(relativePath);
    const baseName = path.parse(fileName).name;
    
    // Structure all optimized files consistently by ensuring the optimized path
    // does not duplicate the 'images' part more than once
    let outputDir;
    if (relativePath === fileName) {
      // File is at root level - put it in images/optimized/root
      outputDir = path.join(OPTIMIZED_DIR, 'root');
    } else {
      // File is in a subdirectory - preserve that structure
      outputDir = path.join(OPTIMIZED_DIR, dirName);
    }
    
    ensureDirectoryExists(outputDir);
    
    console.log(`Processing: ${relativePath}`);
    
    // Check if file exists and is readable
    try {
      fs.accessSync(imagePath, fs.constants.R_OK);
    } catch (error) {
      console.error(`Cannot access file ${imagePath}: ${error.message}`);
      return false;
    }
    
    // Check file size - skip if too large or zero bytes
    const stats = fs.statSync(imagePath);
    if (stats.size === 0 || stats.size > 50 * 1024 * 1024) { // Skip empty files or >50MB
      console.log(`Skipping ${relativePath} (${stats.size === 0 ? 'empty file' : 'file too large'})`);
      return false;
    }
    
    // Skip processing if file extension doesn't match standard image types
    const ext = path.extname(imagePath).toLowerCase();
    if (!['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) {
      console.log(`Skipping ${relativePath} (unsupported file extension: ${ext})`);
      
      // Copy the file as-is to the output directory
      const destPath = path.join(outputDir, fileName);
      fs.copyFileSync(imagePath, destPath);
      console.log(`Copied original file to ${destPath}`);
      
      return false;
    }
    
    // Load image with error handling
    let metadata;
    try {
      const image = sharp(imagePath);
      metadata = await image.metadata();
      
      // Skip SVGs and very small images
      if (metadata.format === 'svg' || (metadata.width < 200 && metadata.height < 200)) {
        console.log(`Skipping ${relativePath} (SVG or too small)`);
        
        // Copy the file as-is to the output directory
        const destPath = path.join(outputDir, fileName);
        fs.copyFileSync(imagePath, destPath);
        console.log(`Copied original file to ${destPath}`);
        
        return false;
      }
      
      // Skip unsupported formats
      if (!metadata.format || !['jpeg', 'png', 'gif', 'webp'].includes(metadata.format)) {
        console.log(`Skipping ${relativePath} (unsupported format: ${metadata.format || 'unknown'})`);
        
        // Copy the file as-is to the output directory
        const destPath = path.join(outputDir, fileName);
        fs.copyFileSync(imagePath, destPath);
        console.log(`Copied original file to ${destPath}`);
        
        return false;
      }
      
      // Generate optimized images in different sizes and formats
      for (const [sizeName, sizeConfig] of Object.entries(SIZES)) {
        // Skip smaller sizes if the original is already smaller
        if (metadata.width <= sizeConfig.width) continue;
        
        const resizedImage = sharp(imagePath).resize({
          width: sizeConfig.width,
          height: sizeConfig.height,
          fit: 'inside',
          withoutEnlargement: true
        });
        
        // Convert to different formats
        await Promise.all([
          // AVIF format
          resizedImage.clone()
            .avif(QUALITY.avif)
            .toFile(path.join(outputDir, `${baseName}${sizeConfig.suffix}.avif`)),
            
          // WebP format
          resizedImage.clone()
            .webp(QUALITY.webp)
            .toFile(path.join(outputDir, `${baseName}${sizeConfig.suffix}.webp`)),
            
          // JPEG format (even for PNGs to provide a fallback)
          resizedImage.clone()
            .jpeg(QUALITY.jpeg)
            .toFile(path.join(outputDir, `${baseName}${sizeConfig.suffix}.jpg`)),
        ]);
        
        // For PNGs with transparency, keep a PNG version too
        if (metadata.format === 'png' && metadata.hasAlpha) {
          await resizedImage.clone()
            .png(QUALITY.png)
            .toFile(path.join(outputDir, `${baseName}${sizeConfig.suffix}.png`));
        }
      }
      
      // Create tiny placeholder for blur-up effect
      ensureDirectoryExists(PLACEHOLDERS_DIR);
      await sharp(imagePath)
        .resize({ width: 20, height: 20, fit: 'inside' })
        .blur(5)
        .jpeg({ quality: 60 })
        .toFile(path.join(PLACEHOLDERS_DIR, `${baseName}-tiny.jpg`));
        
      return true;
    } catch (error) {
      console.error(`Cannot process ${relativePath}: ${error.message}`);
      // Copy file as-is if we can't process it
      const destPath = path.join(outputDir, fileName);
      fs.copyFileSync(imagePath, destPath);
      console.log(`Copied original file to ${destPath} (couldn't process)`);
      return false;
    }
  } catch (error) {
    console.error(`Error processing ${imagePath}:`, error);
    return false;
  }
}

// Main function
async function main() {
  console.log('Starting image optimization...');
  
  // Create necessary directories
  ensureDirectoryExists(IMAGES_DIR);
  ensureDirectoryExists(OPTIMIZED_DIR);
  ensureDirectoryExists(PLACEHOLDERS_DIR);
  
  // Find all images
  const images = await findImages();
  console.log(`Found ${images.length} images to process`);
  
  // Process images in batches to avoid memory issues
  const BATCH_SIZE = 5;
  let processed = 0;
  let successful = 0;
  
  for (let i = 0; i < images.length; i += BATCH_SIZE) {
    const batch = images.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(batch.map(processImage));
    
    processed += batch.length;
    successful += results.filter(Boolean).length;
    
    console.log(`Progress: ${processed}/${images.length} (${Math.round(processed/images.length*100)}%)`);
  }
  
  console.log(`Optimization complete! Successfully processed ${successful}/${images.length} images.`);
}

main().catch(error => {
  console.error('Error during image optimization:', error);
  process.exit(1);
}); 