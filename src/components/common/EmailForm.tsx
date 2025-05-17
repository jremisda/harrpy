import React from 'react';
import useForm from '../../hooks/useForm';
import { isValidEmail, isWorkEmail } from '../../utils/validation';

interface EmailFormProps {
  onSubmit: (email: string) => void;
  buttonText: string;
  inputClassName?: string;
  buttonClassName?: string;
  placeholder?: string;
  requireWorkEmail?: boolean;
}

export const EmailForm: React.FC<EmailFormProps> = ({
  onSubmit,
  buttonText,
  inputClassName = '',
  buttonClassName = '',
  placeholder = 'Email address',
  requireWorkEmail = true
}) => {
  // Validation rules
  const validationRules = {
    email: (value: string) => {
      if (!value) return 'Email is required';
      if (!isValidEmail(value)) return 'Please enter a valid email address';
      if (requireWorkEmail && !isWorkEmail(value)) return 'Please use your work email address';
      return null;
    }
  };

  // Use our custom form hook
  const { 
    values, 
    errors, 
    isSubmitting, 
    handleChange, 
    handleSubmit, 
    resetForm 
  } = useForm(
    { email: '' },
    validationRules,
    (formValues) => {
      onSubmit(formValues.email);
      resetForm();
    }
  );

  const baseInputClasses = 'flex-grow px-6 py-4 rounded-[16px]';
  const baseButtonClasses = 'px-8 py-4 font-medium rounded-[16px] transition-colors duration-200';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
      <div className="flex-grow relative">
        <input
          type="email"
          name="email"
          placeholder={placeholder}
          value={values.email}
          onChange={handleChange}
          className={`w-full ${baseInputClasses} ${errors.email ? 'border-red-500' : ''} ${inputClassName}`}
          required
        />
        {errors.email && (
          <p className="absolute text-sm text-red-500 mt-1">{errors.email}</p>
        )}
      </div>
      <button
        type="submit"
        className={`${baseButtonClasses} ${buttonClassName}`}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : buttonText}
      </button>
    </form>
  );
}; 