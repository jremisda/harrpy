// Script to initialize the database tables
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get the database connection string
const databaseUrl = process.env.NEON_DATABASE_URL;

if (!databaseUrl) {
  console.error('Error: NEON_DATABASE_URL environment variable is not set');
  process.exit(1);
}

// Initialize the SQL client
const sql = neon(databaseUrl);

async function initDatabase() {
  try {
    console.log('Initializing database...');
    
    // Create creators table
    console.log('Creating waitlist_creators table...');
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

    // Create businesses table
    console.log('Creating waitlist_businesses table...');
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

    console.log('Database initialization complete!');
    
    // Check if tables exist
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    console.log('Available tables:');
    tables.forEach(table => {
      console.log(`- ${table.table_name}`);
    });
    
    console.log('\nDatabase initialization successful!');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

// Run the initialization
initDatabase(); 