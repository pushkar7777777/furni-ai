/**
 * Validation utilities for authentication and user data
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {object} - { isValid: boolean, error: string|null }
 */
function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: "Email is required" };
  }

  email = email.trim().toLowerCase();
  
  // Email regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: "Invalid email format. Must contain @ and domain (e.g., example@gmail.com)" };
  }

  // Check for common domains
  const validDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'aol.com', 'protonmail.com', 'icloud.com', 'mail.com'];
  const domain = email.split('@')[1];
  
  // Allow custom domains but warn if not common
  const isCommonDomain = validDomains.includes(domain);

  return { isValid: true, error: null, email, isCommonDomain };
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} - { isValid: boolean, errors: array }
 */
function validatePassword(password) {
  const errors = [];

  if (!password || typeof password !== 'string') {
    return { isValid: false, errors: ["Password is required"] };
  }

  // Check minimum length (8 characters)
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  // Check for uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter (A-Z)");
  }

  // Check for lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter (a-z)");
  }

  // Check for number
  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number (0-9)");
  }

  // Check for special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Password must contain at least one special character (!@#$%^&* etc)");
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength: calculatePasswordStrength(password)
  };
}

/**
 * Calculate password strength on a scale of 0-5
 * @param {string} password - Password to evaluate
 * @returns {number} - Strength score (0-5)
 */
function calculatePasswordStrength(password) {
  let strength = 0;

  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength++;

  return strength;
}

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {object} - { isValid: boolean, error: string|null, phone: string }
 */
function validatePhoneNumber(phone) {
  if (!phone) {
    return { isValid: false, error: "Phone number is required", phone: null };
  }

  phone = String(phone).trim();

  // Remove common separators
  const cleanedPhone = phone.replace(/[\s\-\(\)\.]/g, '');

  // Check if only digits
  if (!/^\d+$/.test(cleanedPhone)) {
    return { isValid: false, error: "Phone number must contain only digits", phone: null };
  }

  // Check length (10-15 digits is standard international range)
  if (cleanedPhone.length < 10 || cleanedPhone.length > 15) {
    return { isValid: false, error: "Phone number must be between 10 and 15 digits", phone: cleanedPhone };
  }

  return { isValid: true, error: null, phone: cleanedPhone };
}

/**
 * Validate name
 * @param {string} name - Name to validate
 * @returns {object} - { isValid: boolean, error: string|null }
 */
function validateName(name) {
  if (!name || typeof name !== 'string') {
    return { isValid: false, error: "Name is required" };
  }

  name = name.trim();

  if (name.length < 2) {
    return { isValid: false, error: "Name must be at least 2 characters long" };
  }

  if (name.length > 100) {
    return { isValid: false, error: "Name must be less than 100 characters" };
  }

  // Allow letters, spaces, hyphens, apostrophes
  if (!/^[a-zA-Z\s\-']+$/.test(name)) {
    return { isValid: false, error: "Name can only contain letters, spaces, hyphens, and apostrophes" };
  }

  return { isValid: true, error: null, name };
}

/**
 * Validate registration data
 * @param {object} data - Registration data { email, password, confirmPassword, name, phone }
 * @returns {object} - { isValid: boolean, errors: array }
 */
function validateRegistration(data) {
  const errors = [];
  const { email, password, confirmPassword, name, phone } = data;

  // Validate email
  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    errors.push(emailValidation.error);
  }

  // Validate password
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    errors.push(...passwordValidation.errors);
  }

  // Validate password confirmation
  if (password !== confirmPassword) {
    errors.push("Passwords do not match");
  }

  // Validate name if provided
  if (name) {
    const nameValidation = validateName(name);
    if (!nameValidation.isValid) {
      errors.push(nameValidation.error);
    }
  }

  // Validate phone if provided
  if (phone) {
    const phoneValidation = validatePhoneNumber(phone);
    if (!phoneValidation.isValid) {
      errors.push(phoneValidation.error);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate login data
 * @param {object} data - Login data { email, password }
 * @returns {object} - { isValid: boolean, errors: array }
 */
function validateLogin(data) {
  const errors = [];
  const { email, password } = data;

  if (!email) {
    errors.push("Email is required");
  }

  if (!password) {
    errors.push("Password is required");
  }

  // Basic email format check
  if (email && !email.includes('@')) {
    errors.push("Invalid email format");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

module.exports = {
  validateEmail,
  validatePassword,
  validatePhoneNumber,
  validateName,
  validateRegistration,
  validateLogin,
  calculatePasswordStrength
};
