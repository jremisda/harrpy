import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_DIR = path.join(process.cwd(), 'public/images');
const OPTIMIZED_DIR = path.join(process.cwd(), 'public/images/optimized');

// Image sizes for responsive images
const SIZES = {
  sm: 640,
  md: 1280,
  lg: 1920,
};

// Quality settings for different formats
const QUALITY = {
  jpeg: 80,
  webp: 80,
  avif: 60,
};

async function ensureDirectoryExists(dir) {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

async function optimizeImage(inputPath, outputDir, filename) {
  const image = sharp(inputPath);
  const metadata = await image.metadata();
  const baseName = path.parse(filename).name;

  // Create optimized versions for each size
  for (const [size, width] of Object.entries(SIZES)) {
    const resizedImage = image.clone().resize({
      width,
      withoutEnlargement: true,
    });

    // Generate JPEG
    await resizedImage
      .jpeg({ quality: QUALITY.jpeg })
      .toFile(path.join(outputDir, `${baseName}-${size}.jpg`));

    // Generate WebP
    await resizedImage
      .webp({ quality: QUALITY.webp })
      .toFile(path.join(outputDir, `${baseName}-${size}.webp`));

    // Generate AVIF
    await resizedImage
      .avif({ quality: QUALITY.avif })
      .toFile(path.join(outputDir, `${baseName}-${size}.avif`));
  }

  // Generate tiny placeholder
  await image
    .resize(20, 20, { fit: 'inside' })
    .blur(10)
    .jpeg({ quality: 40 })
    .toFile(path.join(outputDir, `${baseName}-placeholder.jpg`));

  return {
    width: metadata.width,
    height: metadata.height,
    format: metadata.format,
  };
}

async function processImages() {
  try {
    await ensureDirectoryExists(OPTIMIZED_DIR);

    const files = await fs.readdir(SOURCE_DIR);
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|webp|avif)$/i.test(file)
    );

    console.log(`Found ${imageFiles.length} images to optimize`);

    for (const file of imageFiles) {
      console.log(`Processing ${file}...`);
      const inputPath = path.join(SOURCE_DIR, file);
      const metadata = await optimizeImage(inputPath, OPTIMIZED_DIR, file);
      console.log(`✓ Optimized ${file} (${metadata.width}x${metadata.height})`);
    }

    console.log('✨ All images optimized successfully!');
  } catch (error) {
    console.error('Error optimizing images:', error);
    process.exit(1);
  }
}

processImages(); 