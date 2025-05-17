/**
 * Common types used throughout the application
 */

/**
 * Email submission handler type
 */
export type EmailSubmitHandler = (email: string) => void;

/**
 * User type for waitlist
 */
export type UserType = 'creator' | 'business' | null;

/**
 * Social media handles for creators
 */
export interface SocialMediaHandles {
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  x?: string;
}

/**
 * Creator form data structure
 */
export interface CreatorFormData {
  firstName: string;
  lastName: string;
  socialMediaHandles: SocialMediaHandles;
  email: string;
  aboutYourself?: string;
}

/**
 * Business form data structure
 */
export interface BusinessFormData {
  businessName: string;
  websiteUrl: string;
  email: string;
  creatorDescription?: string;
}

/**
 * Waitlist form submission handler
 */
export type WaitlistSubmitHandler = (data: CreatorFormData | BusinessFormData, userType: UserType) => void;

/**
 * Base component props with common properties
 */
export interface BaseComponentProps {
  className?: string;
  id?: string;
}

/**
 * Form field props
 */
export interface FormFieldProps extends BaseComponentProps {
  label?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
}

/**
 * Button props
 */
export interface ButtonProps extends BaseComponentProps {
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
} 