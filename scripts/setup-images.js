import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.join(__dirname, '../public');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');
const OPTIMIZED_DIR = path.join(IMAGES_DIR, 'optimized');
const PLACEHOLDERS_DIR = path.join(OPTIMIZED_DIR, 'placeholders');

// Create directories if they don't exist
function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`Creating directory: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Copy a sample image to optimized directory if there's no optimized images yet
async function copySampleImage() {
  // Find the first image in the images directory
  const files = fs.readdirSync(IMAGES_DIR).filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png'].includes(ext);
  });
  
  if (files.length === 0) {
    console.log('No images found in the images directory. Please add images first.');
    return;
  }
  
  const sampleImage = files[0];
  const sourcePath = path.join(IMAGES_DIR, sampleImage);
  const fileBaseName = path.parse(sampleImage).name;
  
  // Create optimized versions
  const formats = [
    { ext: '.jpg', outputPath: path.join(OPTIMIZED_DIR, `${fileBaseName}.jpg`) },
    { ext: '.webp', outputPath: path.join(OPTIMIZED_DIR, `${fileBaseName}.webp`) },
    { ext: '.jpg', outputPath: path.join(PLACEHOLDERS_DIR, `${fileBaseName}-tiny.jpg`) }
  ];
  
  // Copy the file for each format if they don't exist
  formats.forEach(format => {
    if (!fs.existsSync(format.outputPath)) {
      console.log(`Copying sample image to: ${format.outputPath}`);
      fs.copyFileSync(sourcePath, format.outputPath);
    }
  });
}

// Main function
async function main() {
  console.log('Setting up image directories for development...');
  
  // Create directories
  ensureDirectoryExists(IMAGES_DIR);
  ensureDirectoryExists(OPTIMIZED_DIR);
  ensureDirectoryExists(PLACEHOLDERS_DIR);
  
  // Copy sample image
  await copySampleImage();
  
  console.log('Image directories setup complete.');
  console.log('For best results, run `npm run optimize-images` to generate fully optimized images.');
}

main().catch(error => {
  console.error('Error during setup:', error);
  process.exit(1);
}); 