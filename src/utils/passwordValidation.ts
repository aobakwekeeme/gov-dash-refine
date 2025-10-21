export interface PasswordStrength {
  score: number; // 0-4
  label: string;
  color: string;
  suggestions: string[];
}

export const validatePassword = (password: string): PasswordStrength => {
  let score = 0;
  const suggestions: string[] = [];

  // Minimum length check
  if (password.length >= 8) {
    score++;
  } else {
    suggestions.push('Use at least 8 characters');
  }

  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score++;
  } else {
    suggestions.push('Add uppercase letters');
  }

  // Lowercase check
  if (/[a-z]/.test(password)) {
    score++;
  } else {
    suggestions.push('Add lowercase letters');
  }

  // Number check
  if (/\d/.test(password)) {
    score++;
  } else {
    suggestions.push('Add numbers');
  }

  // Special character check
  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    score++;
  } else {
    suggestions.push('Add special characters (!@#$%^&*)');
  }

  // Determine label and color
  let label = '';
  let color = '';

  if (score === 0 || score === 1) {
    label = 'Weak';
    color = 'bg-red-500';
  } else if (score === 2) {
    label = 'Fair';
    color = 'bg-orange-500';
  } else if (score === 3) {
    label = 'Good';
    color = 'bg-yellow-500';
  } else if (score === 4) {
    label = 'Strong';
    color = 'bg-green-500';
  } else {
    label = 'Very Strong';
    color = 'bg-green-600';
  }

  return { score, label, color, suggestions };
};

export const meetsMinimumRequirements = (password: string): boolean => {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
  );
};