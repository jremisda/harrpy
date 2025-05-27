#!/usr/bin/env node

/**
 * Performance Monitoring Script
 * Analyzes bundle size and provides optimization recommendations
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DIST_PATH = join(__dirname, '../dist');
const ASSETS_PATH = join(DIST_PATH, 'assets');

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function analyzeBundle() {
  if (!existsSync(DIST_PATH)) {
    console.log('❌ Build directory not found. Run "npm run build" first.');
    return;
  }

  console.log('🔍 Analyzing bundle performance...\n');

  try {
    const files = readdirSync(ASSETS_PATH);
    
    let totalSize = 0;
    const jsFiles = [];
    const cssFiles = [];
    const otherFiles = [];

    files.forEach(file => {
      const filePath = join(ASSETS_PATH, file);
      const stats = statSync(filePath);
      const size = stats.size;
      totalSize += size;

      const fileInfo = { name: file, size, formattedSize: formatBytes(size) };

      if (file.endsWith('.js')) {
        jsFiles.push(fileInfo);
      } else if (file.endsWith('.css')) {
        cssFiles.push(fileInfo);
      } else {
        otherFiles.push(fileInfo);
      }
    });

    // Sort by size (largest first)
    jsFiles.sort((a, b) => b.size - a.size);
    cssFiles.sort((a, b) => b.size - a.size);

    console.log('📊 Bundle Analysis Results:');
    console.log('═'.repeat(50));
    console.log(`Total Bundle Size: ${formatBytes(totalSize)}\n`);

    console.log('📄 JavaScript Files:');
    jsFiles.forEach(file => {
      const status = file.size > 500000 ? '🔴' : file.size > 250000 ? '🟡' : '🟢';
      console.log(`  ${status} ${file.name}: ${file.formattedSize}`);
    });

    console.log('\n🎨 CSS Files:');
    cssFiles.forEach(file => {
      const status = file.size > 100000 ? '🔴' : file.size > 50000 ? '🟡' : '🟢';
      console.log(`  ${status} ${file.name}: ${file.formattedSize}`);
    });

    if (otherFiles.length > 0) {
      console.log('\n📁 Other Assets:');
      otherFiles.forEach(file => {
        console.log(`  📄 ${file.name}: ${file.formattedSize}`);
      });
    }

    // Recommendations
    console.log('\n💡 Performance Recommendations:');
    console.log('═'.repeat(50));

    if (totalSize > 1000000) {
      console.log('🔴 Bundle size is large (>1MB). Consider:');
      console.log('   • Implementing more aggressive code splitting');
      console.log('   • Lazy loading non-critical components');
      console.log('   • Tree shaking unused dependencies');
    } else if (totalSize > 500000) {
      console.log('🟡 Bundle size is moderate (>500KB). Consider:');
      console.log('   • Code splitting for routes');
      console.log('   • Lazy loading heavy components');
    } else {
      console.log('🟢 Bundle size looks good!');
    }

    const largeJsFiles = jsFiles.filter(f => f.size > 250000);
    if (largeJsFiles.length > 0) {
      console.log('\n🔴 Large JavaScript files detected:');
      largeJsFiles.forEach(file => {
        console.log(`   • ${file.name} (${file.formattedSize})`);
      });
      console.log('   Consider splitting these files or lazy loading components.');
    }

    const largeCssFiles = cssFiles.filter(f => f.size > 50000);
    if (largeCssFiles.length > 0) {
      console.log('\n🟡 Large CSS files detected:');
      largeCssFiles.forEach(file => {
        console.log(`   • ${file.name} (${file.formattedSize})`);
      });
      console.log('   Consider critical CSS extraction or purging unused styles.');
    }

  } catch (error) {
    console.error('❌ Error analyzing bundle:', error.message);
  }
}

function checkPerformanceMetrics() {
  console.log('\n🎯 Performance Targets:');
  console.log('═'.repeat(50));
  console.log('🎯 First Contentful Paint: < 1.8s');
  console.log('🎯 Largest Contentful Paint: < 2.5s');
  console.log('🎯 Time to First Byte: < 0.6s');
  console.log('🎯 Cumulative Layout Shift: < 0.1');
  console.log('🎯 First Input Delay: < 100ms');
  console.log('🎯 Interaction to Next Paint: < 200ms');
  console.log('\n📈 Current Status (from Vercel Analytics):');
  console.log('🔴 First Contentful Paint: 3.27s (NEEDS IMPROVEMENT)');
  console.log('🔴 Time to First Byte: 2.31s (NEEDS IMPROVEMENT)');
  console.log('🔴 Largest Contentful Paint: 3.28s (NEEDS IMPROVEMENT)');
  console.log('🟢 Cumulative Layout Shift: 0.03 (GOOD)');
  console.log('🟢 First Input Delay: 2ms (EXCELLENT)');
  console.log('🟢 Interaction to Next Paint: 56ms (GOOD)');
}

// Run analysis
analyzeBundle();
checkPerformanceMetrics();

console.log('\n🚀 Next Steps:');
console.log('═'.repeat(50));
console.log('1. Deploy these optimizations to production');
console.log('2. Monitor Vercel Speed Insights for improvements');
console.log('3. Run this script after each build to track progress');
console.log('4. Consider implementing a Web Worker for heavy computations');
console.log('5. Optimize images with next-gen formats (WebP/AVIF)'); 