import { useState, ChangeEvent, FormEvent } from 'react';

interface FormValues {
  [key: string]: string;
}

interface FormErrors {
  [key: string]: string;
}

type ValidationRules = {
  [key: string]: (value: string) => string | null;
};

/**
 * Custom hook for handling form state, validation, and submission
 * @param initialValues - Initial form values
 * @param validationRules - Rules to validate form values
 * @param onSubmit - Function to call on form submission
 * @returns Form handling utilities
 */
export const useForm = <T extends FormValues>(
  initialValues: T,
  validationRules: ValidationRules = {},
  onSubmit: (values: T) => void
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validate = (): boolean => {
    let newErrors: FormErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach((key) => {
      const error = validationRules[key](values[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      setIsSubmitting(true);
      onSubmit(values);
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
  };

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm,
  };
};

export default useForm; 