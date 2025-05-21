import { put, list, del } from '@vercel/blob';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Load environment variables from .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(process.cwd(), '.env') });

async function testBlob() {
  try {
    console.log('🧪 Testing Vercel Blob connection...');
    console.log('Token available:', !!process.env.BLOB_READ_WRITE_TOKEN);

    // Test 1: Upload a small test file
    console.log('\n1. Testing file upload...');
    const testContent = 'Hello, Vercel Blob!';
    const blob = await put('test-blob.txt', testContent, {
      access: 'public',
      contentType: 'text/plain',
    });
    console.log('✅ Upload successful!');
    console.log('URL:', blob.url);

    // Test 2: List blobs
    console.log('\n2. Testing blob listing...');
    const { blobs } = await list();
    console.log('✅ List successful!');
    console.log('Found blobs:', blobs.length);

    // Test 3: Delete the test blob
    console.log('\n3. Testing blob deletion...');
    await del(blob.url);
    console.log('✅ Deletion successful!');

    console.log('\n✨ All tests passed! Your Vercel Blob setup is working correctly.');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.message.includes('token')) {
      console.log('\n🔑 Make sure you have set the BLOB_READ_WRITE_TOKEN environment variable correctly.');
      console.log('Current token:', process.env.BLOB_READ_WRITE_TOKEN ? 'Set' : 'Not set');
    }
    process.exit(1);
  }
}

testBlob(); 