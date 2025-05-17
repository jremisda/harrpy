// Script to test the waitlist submission functionality
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

async function main() {
  console.log('Testing waitlist submission functionality...');
  
  try {
    // Test creator submission
    console.log('\nTesting CREATOR submission:');
    const creatorData = {
      firstName: 'Test',
      lastName: 'Creator',
      email: `creator-${Date.now()}@example.com`, // Using timestamp to ensure uniqueness
      socialMediaHandles: {
        instagram: 'testcreator',
        tiktok: 'testcreator',
        youtube: 'TestCreator',
        x: 'testcreator'
      },
      aboutYourself: 'This is a test submission for a creator account.'
    };
    
    console.log('Inserting creator test data...');
    const creatorResult = await sql`
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
        ${creatorData.firstName}, 
        ${creatorData.lastName}, 
        ${creatorData.email}, 
        ${creatorData.socialMediaHandles.instagram || null}, 
        ${creatorData.socialMediaHandles.tiktok || null}, 
        ${creatorData.socialMediaHandles.youtube || null}, 
        ${creatorData.socialMediaHandles.x || null}, 
        ${creatorData.aboutYourself || null}
      )
      RETURNING id
    `;
    
    if (creatorResult && creatorResult.length > 0) {
      console.log(`✅ Creator submission successful! ID: ${creatorResult[0].id}`);
    } else {
      console.error('❌ Creator submission failed.');
    }
    
    // Test business submission
    console.log('\nTesting BUSINESS submission:');
    const businessData = {
      businessName: 'Test Business',
      websiteUrl: 'https://testbusiness.com',
      email: `business-${Date.now()}@example.com`, // Using timestamp to ensure uniqueness
      creatorDescription: 'We are looking for creators who specialize in tech content.'
    };
    
    console.log('Inserting business test data...');
    const businessResult = await sql`
      INSERT INTO waitlist_businesses (
        business_name, 
        website_url, 
        email, 
        creator_description
      ) 
      VALUES (
        ${businessData.businessName}, 
        ${businessData.websiteUrl}, 
        ${businessData.email}, 
        ${businessData.creatorDescription || null}
      )
      RETURNING id
    `;
    
    if (businessResult && businessResult.length > 0) {
      console.log(`✅ Business submission successful! ID: ${businessResult[0].id}`);
    } else {
      console.error('❌ Business submission failed.');
    }
    
    // Query and display data
    console.log('\nAll Creator Submissions:');
    const creators = await sql`SELECT * FROM waitlist_creators`;
    console.table(creators);
    
    console.log('\nAll Business Submissions:');
    const businesses = await sql`SELECT * FROM waitlist_businesses`;
    console.table(businesses);
    
    console.log('\nAll tests completed!');
  } catch (error) {
    console.error('Error during test:', error);
    process.exit(1);
  }
}

main(); 