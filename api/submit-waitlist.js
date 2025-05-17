// Serverless function to handle waitlist submissions
import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  console.log('API Route: /api/submit-waitlist received request', {
    method: req.method,
    headers: req.headers,
    body: typeof req.body === 'string' ? 'String body' : 'JSON body'
  });

  // Add CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { data, userType } = req.body;

    console.log('Received waitlist submission:', { userType, data });

    if (!data || !userType) {
      console.error('Missing required fields in request body');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify database URL is present
    const dbUrl = process.env.NEON_DATABASE_URL;
    if (!dbUrl) {
      console.error('Database URL not configured in environment variables');
      return res.status(500).json({ error: 'Database connection not configured' });
    }

    // Create a database connection
    console.log('Creating database connection...');
    const sql = neon(dbUrl);
    
    let submissionId;
    
    // Initialize tables if needed
    console.log('Initializing database tables...');
    await initTables(sql);

    // Handle based on user type
    if (userType === 'creator') {
      console.log('Saving creator submission...');
      submissionId = await saveCreatorSubmission(sql, data);
    } else if (userType === 'business') {
      console.log('Saving business submission...');
      submissionId = await saveBusinessSubmission(sql, data);
    } else {
      console.error('Invalid user type:', userType);
      return res.status(400).json({ error: 'Invalid user type' });
    }

    if (submissionId) {
      console.log('Submission saved successfully with ID:', submissionId);
      return res.status(200).json({ success: true, id: submissionId });
    } else {
      console.error('Failed to save submission - no ID returned');
      return res.status(500).json({ error: 'Failed to save submission' });
    }
  } catch (error) {
    console.error('Error in waitlist submission:', error);
    return res.status(500).json({ 
      error: 'Server error', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

// Initialize tables if they don't exist
async function initTables(sql) {
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
    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database tables:', error);
    throw error; // Re-throw to be handled by the main handler
  }
}

// Save creator submission
async function saveCreatorSubmission(sql, data) {
  try {
    const { firstName, lastName, email, socialMediaHandles, aboutYourself } = data;
    
    // Debug info
    console.log('Creator data:', {
      firstName,
      lastName,
      email,
      socialHandles: socialMediaHandles,
      aboutLength: aboutYourself ? aboutYourself.length : 0
    });
    
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
        ${socialMediaHandles?.instagram || null}, 
        ${socialMediaHandles?.tiktok || null}, 
        ${socialMediaHandles?.youtube || null}, 
        ${socialMediaHandles?.x || null}, 
        ${aboutYourself || null}
      )
      RETURNING id
    `;
    
    console.log('Database result:', result);
    
    if (Array.isArray(result) && result.length > 0) {
      return result[0].id;
    }
    
    return null;
  } catch (error) {
    console.error('Error in saveCreatorSubmission:', error);
    throw error; // Re-throw to be handled by the main handler
  }
}

// Save business submission
async function saveBusinessSubmission(sql, data) {
  try {
    const { businessName, websiteUrl, email, creatorDescription } = data;
    
    // Debug info
    console.log('Business data:', {
      businessName,
      websiteUrl,
      email,
      descriptionLength: creatorDescription ? creatorDescription.length : 0
    });
    
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
    
    console.log('Database result:', result);
    
    if (Array.isArray(result) && result.length > 0) {
      return result[0].id;
    }
    
    return null;
  } catch (error) {
    console.error('Error in saveBusinessSubmission:', error);
    throw error; // Re-throw to be handled by the main handler
  }
} 