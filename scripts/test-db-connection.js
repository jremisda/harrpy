// Test database connection script
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testConnection() {
  console.log('Testing database connection...');
  
  const dbUrl = process.env.NEON_DATABASE_URL;
  if (!dbUrl) {
    console.error('Database URL not configured in environment variables');
    process.exit(1);
  }
  
  try {
    console.log('Creating database connection...');
    const sql = neon(dbUrl);
    
    // Run a simple query
    console.log('Running test query...');
    const result = await sql`SELECT now() as time`;
    
    console.log('Database connection successful!');
    console.log('Server time:', result[0].time);
    
    console.log('\nTesting table access...');
    // Ensure tables exist
    await sql`
      CREATE TABLE IF NOT EXISTS waitlist_creators (
        id SERIAL PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        instagram TEXT,
        tiktok TEXT,
        youtube TEXT,
        x TEXT,
        about_yourself TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    await sql`
      CREATE TABLE IF NOT EXISTS waitlist_businesses (
        id SERIAL PRIMARY KEY,
        business_name TEXT NOT NULL,
        website_url TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        creator_description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    // Check if tables exist
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_name IN ('waitlist_creators', 'waitlist_businesses')
    `;
    
    console.log('Tables found:', tables.map(t => t.table_name).join(', '));
    
    // Get counts
    const creatorCount = await sql`SELECT COUNT(*) as count FROM waitlist_creators`;
    const businessCount = await sql`SELECT COUNT(*) as count FROM waitlist_businesses`;
    
    console.log('waitlist_creators count:', creatorCount[0].count);
    console.log('waitlist_businesses count:', businessCount[0].count);
    
    console.log('\nDatabase testing complete. Everything looks good!');
  } catch (error) {
    console.error('Error testing database connection:', error);
    process.exit(1);
  }
}

testConnection(); 