import { isValidEmail, isWorkEmail } from '../utils/validation';

describe('Email Validation', () => {
  describe('isValidEmail', () => {
    test('should return true for valid email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('user+tag@domain.org')).toBe(true);
    });

    test('should return false for invalid email addresses', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('test')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test@example')).toBe(false);
    });
  });

  describe('isWorkEmail', () => {
    test('should return true for work email addresses', () => {
      expect(isWorkEmail('user@company.com')).toBe(true);
      expect(isWorkEmail('user@healthcare.org')).toBe(true);
      expect(isWorkEmail('user@hospital.gov')).toBe(true);
    });

    test('should return false for common personal email domains', () => {
      expect(isWorkEmail('user@gmail.com')).toBe(false);
      expect(isWorkEmail('user@yahoo.com')).toBe(false);
      expect(isWorkEmail('user@hotmail.com')).toBe(false);
      expect(isWorkEmail('user@outlook.com')).toBe(false);
    });

    test('should return false for invalid emails', () => {
      expect(isWorkEmail('not-an-email')).toBe(false);
    });
  });
}); 