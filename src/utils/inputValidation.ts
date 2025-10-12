export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateEmail = (email: string): ValidationResult => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email.trim()) {
    return { isValid: false, error: 'Email is required' };
  }
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  if (email.length > 255) {
    return { isValid: false, error: 'Email must be less than 255 characters' };
  }
  
  return { isValid: true };
};

export const validatePhone = (phone: string): ValidationResult => {
  const phoneRegex = /^[\d\s\-+()]+$/;
  
  if (!phone.trim()) {
    return { isValid: false, error: 'Phone number is required' };
  }
  
  if (!phoneRegex.test(phone)) {
    return { isValid: false, error: 'Please enter a valid phone number' };
  }
  
  if (phone.replace(/\D/g, '').length < 10) {
    return { isValid: false, error: 'Phone number must be at least 10 digits' };
  }
  
  return { isValid: true };
};

// South African name validation
export const validateName = (name: string, fieldName: string = 'Name'): ValidationResult => {
  const trimmed = name.trim();
  
  if (!trimmed) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  if (trimmed.length < 2 || trimmed.length > 40) {
    return { isValid: false, error: `${fieldName} must be between 2 and 40 characters` };
  }
  
  // Name must start with a letter
  if (!/^[A-Za-zÀ-ÿ]/.test(trimmed)) {
    return { isValid: false, error: `${fieldName} must start with a letter` };
  }
  
  // Only letters (including accented), hyphens, and apostrophes allowed
  if (!/^[A-Za-zÀ-ÿ\s'-]+$/.test(trimmed)) {
    return { isValid: false, error: `${fieldName} can only contain letters, hyphens, and apostrophes` };
  }
  
  return { isValid: true };
};

// South African phone validation (10 digits)
export const validateSAPhone = (phone: string): ValidationResult => {
  const digits = phone.replace(/\D/g, '');
  
  if (!phone.trim()) {
    return { isValid: false, error: 'Phone number is required' };
  }
  
  if (digits.length !== 10) {
    return { isValid: false, error: 'Phone number must be exactly 10 digits' };
  }
  
  // SA numbers typically start with 0
  if (!digits.startsWith('0')) {
    return { isValid: false, error: 'South African phone numbers should start with 0' };
  }
  
  return { isValid: true };
};

export const validateText = (text: string, fieldName: string, minLength = 1, maxLength = 1000): ValidationResult => {
  const trimmed = text.trim();
  
  if (!trimmed) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  if (trimmed.length < minLength) {
    return { isValid: false, error: `${fieldName} must be at least ${minLength} characters` };
  }
  
  if (trimmed.length > maxLength) {
    return { isValid: false, error: `${fieldName} must be less than ${maxLength} characters` };
  }
  
  return { isValid: true };
};

export const validateNumber = (value: string, fieldName: string, min?: number, max?: number): ValidationResult => {
  const num = parseFloat(value);
  
  if (isNaN(num)) {
    return { isValid: false, error: `${fieldName} must be a valid number` };
  }
  
  if (min !== undefined && num < min) {
    return { isValid: false, error: `${fieldName} must be at least ${min}` };
  }
  
  if (max !== undefined && num > max) {
    return { isValid: false, error: `${fieldName} must be at most ${max}` };
  }
  
  return { isValid: true };
};