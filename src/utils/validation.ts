/**
 * Utility functions for form validation
 */

/**
 * Validates if an email address is properly formatted
 * @param email - The email address to validate
 * @returns True if the email is valid, false otherwise
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

/**
 * Validates if a string is a work email (not a common personal email domain)
 * @param email - The email address to validate
 * @returns True if the email is likely a work email, false otherwise
 */
export const isWorkEmail = (email: string): boolean => {
  if (!isValidEmail(email)) return false;
  
  const personalDomains = [
    'gmail.com',
    'yahoo.com',
    'hotmail.com',
    'outlook.com',
    'aol.com',
    'icloud.com',
    'mail.com',
    'protonmail.com',
    'zoho.com',
    'yandex.com',
  ];
  
  const domain = email.split('@')[1].toLowerCase();
  return !personalDomains.includes(domain);
}; 