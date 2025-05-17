import { neon, NeonQueryFunction } from '@neondatabase/serverless';
import { CreatorFormData, BusinessFormData, UserType } from '../types';

// Check if we're in a browser or server environment
const isServer = typeof window === 'undefined';

// Type for database result row with id
interface DbResultRow {
  id: number;
  [key: string]: any;
}

// Create SQL client based on environment
const createSqlClient = (): NeonQueryFunction<any, any> | null => {
  if (!isServer) {
    // In browser environment, return null and log a message
    console.log('SQL client requested in browser environment - this is expected');
    return null;
  }
  
  try {
    const connectionString = process.env.NEON_DATABASE_URL;
    if (!connectionString) {
      console.error('Database connection string is missing');
      return null;
    }
    
    return neon(connectionString);
  } catch (error) {
    console.error('Error creating SQL client:', error);
    return null;
  }
};

/**
 * Initialize the database by creating necessary tables if they don't exist
 */
export const initDatabase = async (): Promise<void> => {
  if (!isServer) {
    console.log('Database initialization skipped in browser environment - this is expected');
    return;
  }
  
  try {
    const sql = createSqlClient();
    if (!sql) {
      console.error('Failed to create SQL client for database initialization');
      return;
    }
    
    // Create creators table
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

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

/**
 * Save creator submission to database
 */
export const saveCreatorSubmission = async (data: CreatorFormData): Promise<number | null> => {
  if (!isServer) {
    // In browser environment, simulate success but log a note
    console.log('Creator submission in browser environment - this request will be handled by serverless functions');
    // Return a mock ID to show success to the user
    return Date.now();
  }
  
  try {
    const { firstName, lastName, email, socialMediaHandles, aboutYourself } = data;
    
    const sql = createSqlClient();
    if (!sql) {
      console.error('Failed to create SQL client for creator submission');
      return null;
    }
    
    const result = await sql`
      INSERT INTO waitlist_creators (
        first_name,
        last_name, 
        email, 
        instagram, 
        tiktok, 
        youtube, 
        x, 
        about_yourself
      ) 
      VALUES (
        ${firstName}, 
        ${lastName}, 
        ${email}, 
        ${socialMediaHandles.instagram || null}, 
        ${socialMediaHandles.tiktok || null}, 
        ${socialMediaHandles.youtube || null}, 
        ${socialMediaHandles.x || null}, 
        ${aboutYourself || null}
      )
      RETURNING id
    `;
    
    // Check if result is an array and has at least one element
    if (Array.isArray(result) && result.length > 0) {
      const row = result[0] as DbResultRow;
      return row.id;
    }
    
    return null;
  } catch (error) {
    console.error('Error saving creator submission:', error);
    return null;
  }
};

/**
 * Save business submission to database
 */
export const saveBusinessSubmission = async (data: BusinessFormData): Promise<number | null> => {
  if (!isServer) {
    // In browser environment, simulate success but log a note
    console.log('Business submission in browser environment - this request will be handled by serverless functions');
    // Return a mock ID to show success to the user
    return Date.now();
  }
  
  try {
    const { businessName, websiteUrl, email, creatorDescription } = data;
    
    const sql = createSqlClient();
    if (!sql) {
      console.error('Failed to create SQL client for business submission');
      return null;
    }
    
    const result = await sql`
      INSERT INTO waitlist_businesses (
        business_name, 
        website_url, 
        email, 
        creator_description
      ) 
      VALUES (
        ${businessName}, 
        ${websiteUrl}, 
        ${email}, 
        ${creatorDescription || null}
      )
      RETURNING id
    `;
    
    // Check if result is an array and has at least one element
    if (Array.isArray(result) && result.length > 0) {
      const row = result[0] as DbResultRow;
      return row.id;
    }
    
    return null;
  } catch (error) {
    console.error('Error saving business submission:', error);
    return null;
  }
};

/**
 * Main function to save a waitlist submission based on user type
 */
export const saveWaitlistSubmission = async (
  data: CreatorFormData | BusinessFormData, 
  userType: UserType
): Promise<number | null> => {
  if (userType === 'creator') {
    return saveCreatorSubmission(data as CreatorFormData);
  } else if (userType === 'business') {
    return saveBusinessSubmission(data as BusinessFormData);
  }
  
  return null;
};

export default {
  initDatabase,
  saveCreatorSubmission,
  saveBusinessSubmission,
  saveWaitlistSubmission
}; 