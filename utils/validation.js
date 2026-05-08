/**
 * Strict validation utilities for authentication and user data
 */

function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Email is required' };
  }

  const normalized = email.trim().toLowerCase();

  if (!normalized.includes('@')) {
    return { isValid: false, error: 'Email must contain @' };
  }

  if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(normalized)) {
    return { isValid: false, error: 'Email must be a valid gmail.com address' };
  }

  return { isValid: true, error: null, email: normalized };
}

function validatePassword(password) {
  const errors = [];

  if (!password || typeof password !== 'string') {
    return { isValid: false, errors: ['Password is required'] };
  }

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return { isValid: errors.length === 0, errors };
}

function validatePhoneNumber(phone) {
  if (!phone) {
    return { isValid: false, error: 'Phone number is required', phone: null };
  }

  const cleaned = String(phone).trim().replace(/[\s\-().+]/g, '');

  if (!/^\d+$/.test(cleaned)) {
    return { isValid: false, error: 'Phone number must contain only digits', phone: null };
  }

  if (cleaned.length < 10 || cleaned.length > 15) {
    return { isValid: false, error: 'Phone number must be between 10 and 15 digits', phone: cleaned };
  }

  return { isValid: true, error: null, phone: cleaned };
}

function validateName(name) {
  if (!name || typeof name !== 'string') {
    return { isValid: false, error: 'Name is required' };
  }

  const normalized = name.trim();

  if (normalized.length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters long' };
  }

  if (normalized.length > 100) {
    return { isValid: false, error: 'Name must be less than 100 characters' };
  }

  if (!/^[a-zA-Z\s\-']+$/.test(normalized)) {
    return { isValid: false, error: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
  }

  return { isValid: true, error: null, name: normalized };
}

function validateRegistration(data) {
  const errors = [];
  const { email, password, confirmPassword, name, phone } = data;

  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) errors.push(emailValidation.error);

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) errors.push(...passwordValidation.errors);

  if (password !== confirmPassword) {
    errors.push('Passwords do not match');
  }

  const nameValidation = validateName(name);
  if (!nameValidation.isValid) errors.push(nameValidation.error);

  const phoneValidation = validatePhoneNumber(phone);
  if (!phoneValidation.isValid) errors.push(phoneValidation.error);

  return { isValid: errors.length === 0, errors };
}

function validateLogin(data) {
  const errors = [];
  const { email, password } = data;

  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) errors.push(emailValidation.error);

  if (!password) {
    errors.push('Password is required');
  }

  return { isValid: errors.length === 0, errors };
}

module.exports = {
  validateEmail,
  validatePassword,
  validatePhoneNumber,
  validateName,
  validateRegistration,
  validateLogin
};
