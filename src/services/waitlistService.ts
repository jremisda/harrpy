import { CreatorFormData, BusinessFormData, UserType } from '../types';

/**
 * Initialize the database by creating necessary tables if they don't exist
 * This will now be handled by the API endpoint
 */
export const initDatabase = async (): Promise<void> => {
  // This is now handled by the API endpoint
  console.log('Database initialization handled by API endpoint');
  return;
};

/**
 * Get the base URL for API calls
 */
const getApiBaseUrl = (): string => {
  // In production (harrpy.com), use the absolute URL
  // In development, use the relative URL
  return process.env.NODE_ENV === 'production' 
    ? `${window.location.origin}/api` 
    : '/api';
};

/**
 * Save creator submission via API
 */
export const saveCreatorSubmission = async (data: CreatorFormData): Promise<number | null> => {
  try {
    const apiUrl = `${getApiBaseUrl()}/submit-waitlist`;
    console.log(`Submitting creator form to: ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data,
        userType: 'creator'
      }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error('Error submitting creator form:', result.error);
      return null;
    }
    
    console.log('Creator submission successful:', result);
    return result.id;
  } catch (error) {
    console.error('Error saving creator submission:', error);
    return null;
  }
};

/**
 * Save business submission via API
 */
export const saveBusinessSubmission = async (data: BusinessFormData): Promise<number | null> => {
  try {
    const apiUrl = `${getApiBaseUrl()}/submit-waitlist`;
    console.log(`Submitting business form to: ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data,
        userType: 'business'
      }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error('Error submitting business form:', result.error);
      return null;
    }
    
    console.log('Business submission successful:', result);
    return result.id;
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