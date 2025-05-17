import { neon, neonConfig } from '@neondatabase/serverless';
import { CreatorFormData, BusinessFormData, UserType } from '../types';
import 'dotenv/config';

// Configure Neon client
neonConfig.fetchConnectionCache = true;

// Get the database connection string from environment variables
const databaseUrl = process.env.NEON_DATABASE_URL || '';

// Initialize the SQL client
const sql = neon(databaseUrl);

/**
 * Initialize the database by creating necessary tables if they don't exist
 */
export const initDatabase = async (): Promise<void> => {
  try {
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
    throw error;
  }
};

/**
 * Save creator submission to database
 */
export const saveCreatorSubmission = async (data: CreatorFormData): Promise<number> => {
  try {
    const { firstName, lastName, email, socialMediaHandles, aboutYourself } = data;
    
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
    
    return result[0].id;
  } catch (error) {
    console.error('Error saving creator submission:', error);
    throw error;
  }
};

/**
 * Save business submission to database
 */
export const saveBusinessSubmission = async (data: BusinessFormData): Promise<number> => {
  try {
    const { businessName, websiteUrl, email, creatorDescription } = data;
    
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
    
    return result[0].id;
  } catch (error) {
    console.error('Error saving business submission:', error);
    throw error;
  }
};

/**
 * Save a waitlist submission based on user type
 */
export const saveWaitlistSubmission = async (
  data: CreatorFormData | BusinessFormData, 
  userType: UserType
): Promise<number | null> => {
  try {
    if (userType === 'creator') {
      return await saveCreatorSubmission(data as CreatorFormData);
    } else if (userType === 'business') {
      return await saveBusinessSubmission(data as BusinessFormData);
    }
    return null;
  } catch (error) {
    console.error('Error saving waitlist submission:', error);
    throw error;
  }
};

export default {
  initDatabase,
  saveCreatorSubmission,
  saveBusinessSubmission,
  saveWaitlistSubmission
}; 