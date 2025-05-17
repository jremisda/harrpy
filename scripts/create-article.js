#!/usr/bin/env node

/**
 * Script to generate a new article file with the correct structure
 * Usage: node scripts/create-article.js "Your Article Title"
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

// Get the directory where the script is located
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper to prompt for input
const prompt = (question) => new Promise((resolve) => {
  rl.question(question, (answer) => resolve(answer));
});

// Helper to convert string to slug
const toSlug = (str) => {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// Helper to calculate reading time from content
const calculateReadingTime = (content) => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

// Main function
async function createArticle() {
  console.log('📝 Creating a new article...\n');
  
  try {
    // Collect article information
    const title = await prompt('Title: ');
    const slug = await prompt(`Slug (default: ${toSlug(title)}): `) || toSlug(title);
    const summary = await prompt('Summary: ');
    
    // Calculate next article ID
    const articlesDir = path.join(rootDir, 'src', 'data', 'articles');
    const articles = fs.readdirSync(articlesDir)
      .filter(file => file.endsWith('.ts') && file !== 'index.ts');
    
    const nextId = `article-${articles.length + 1}`;
    
    // Get authors, categories, and tags for reference
    console.log('\nAvailable authors:');
    const authorsFile = path.join(rootDir, 'src', 'data', 'authors', 'index.ts');
    const authorsContent = fs.readFileSync(authorsFile, 'utf8');
    const authorsList = authorsContent.match(/id: ['"]([^'"]+)['"]/g)?.map(match => 
      match.replace(/id: ['"]([^'"]+)['"]/, '$1')
    ) || [];
    authorsList.forEach((id, i) => console.log(`${i + 1}. ${id}`));
    
    const authorIndex = parseInt(await prompt('Author (enter number): '), 10) - 1;
    const author = authorsList[authorIndex];
    
    console.log('\nAvailable categories:');
    const categoriesFile = path.join(rootDir, 'src', 'data', 'categories', 'index.ts');
    const categoriesContent = fs.readFileSync(categoriesFile, 'utf8');
    const categoriesList = categoriesContent.match(/id: ['"]([^'"]+)['"]/g)?.map(match => 
      match.replace(/id: ['"]([^'"]+)['"]/, '$1')
    ) || [];
    categoriesList.forEach((id, i) => console.log(`${i + 1}. ${id}`));
    
    const categoryIndex = parseInt(await prompt('Category (enter number): '), 10) - 1;
    const category = categoriesList[categoryIndex];
    
    console.log('\nAvailable tags:');
    const tagsFile = path.join(rootDir, 'src', 'data', 'tags', 'index.ts');
    const tagsContent = fs.readFileSync(tagsFile, 'utf8');
    const tagsList = tagsContent.match(/id: ['"]([^'"]+)['"]/g)?.map(match => 
      match.replace(/id: ['"]([^'"]+)['"]/, '$1')
    ) || [];
    tagsList.forEach((id, i) => console.log(`${i + 1}. ${id}`));
    
    const tagInput = await prompt('Tags (enter numbers separated by commas): ');
    const tagIndices = tagInput.split(',').map(idx => parseInt(idx.trim(), 10) - 1);
    const tags = tagIndices.map(idx => tagsList[idx]).filter(Boolean);
    
    const featured = (await prompt('Featured article? (y/n): ')).toLowerCase() === 'y';
    
    // Create article file content
    const today = new Date().toISOString();
    
    // Default content template
    const defaultContent = `
# ${title}

[Your article content goes here]
    `;
    
    // Calculate initial reading time (will be updated when content is filled in)
    const initialReadingTime = calculateReadingTime(defaultContent);
    
    const articleContent = `import { Article } from '../../types';
import { authors } from '../authors';
import { categories } from '../categories';
import { tags } from '../tags';
import { calculateReadingTime } from './index';

const content = \`
# ${title}

[Your article content goes here]
\`;

const article: Article = {
  id: '${nextId}',
  title: '${title}',
  slug: '${slug}',
  summary: '${summary}',
  content,
  publishedAt: '${today}',
  image: {
    url: '/images/articles/${slug}/hero.jpg',
    alt: '${title}',
    caption: 'Image for ${title}'
  },
  author: authors.find(a => a.id === '${author}')!,
  category: categories.find(c => c.id === '${category}')!,
  tags: [${tags.map(tag => `tags.find(t => t.id === '${tag}')`).join(', ')}],
  readingTime: ${initialReadingTime}, // Initial estimate, adjust if needed
  featured: ${featured},
  status: 'published',
  seo: {
    title: '${title}',
    description: '${summary}',
    keywords: [${tags.map(tag => `'${tag.replace('tag-', '')}'`).join(', ')}]
  }
};

export default article;
`;

    // Create article file
    const articleFilePath = path.join(articlesDir, `${slug}.ts`);
    fs.writeFileSync(articleFilePath, articleContent, 'utf8');
    
    // Create image directory
    const articleImagesDir = path.join(rootDir, 'public', 'images', 'articles', slug);
    if (!fs.existsSync(articleImagesDir)) {
      fs.mkdirSync(articleImagesDir, { recursive: true });
    }
    
    // Update index.ts to include the new article
    const indexPath = path.join(articlesDir, 'index.ts');
    let indexContent = fs.readFileSync(indexPath, 'utf8');
    
    // Add import
    const importStatement = `import ${toSlug(title).replace(/-/g, '')} from './${slug}';\n`;
    const importPosition = indexContent.lastIndexOf('import');
    const endOfImports = indexContent.indexOf('\n\n', importPosition);
    
    indexContent = 
      indexContent.slice(0, endOfImports) + 
      '\n' + importStatement +
      indexContent.slice(endOfImports);
    
    // Add to articles array
    const arrayStart = indexContent.indexOf('export const articles: Article[] = [');
    const arrayEnd = indexContent.indexOf('];', arrayStart);
    
    indexContent = 
      indexContent.slice(0, arrayEnd) + 
      `  ${toSlug(title).replace(/-/g, '')},\n` +
      indexContent.slice(arrayEnd);
    
    fs.writeFileSync(indexPath, indexContent, 'utf8');
    
    console.log(`\n✅ Article created successfully!`);
    console.log(`📄 File: ${articleFilePath}`);
    console.log(`🖼️  Images directory: ${articleImagesDir}`);
    console.log(`\n⚠️  Next steps:`);
    console.log(`1. Add a hero.jpg image to ${articleImagesDir}`);
    console.log(`2. Update the article content in ${articleFilePath}`);
    console.log(`3. Adjust the readingTime value based on your content length`);
    
  } catch (error) {
    console.error('\n❌ Error creating article:', error.message);
  } finally {
    rl.close();
  }
}

// Run the script
createArticle(); 