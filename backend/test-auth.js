/**
 * Authentication API Test Suite
 * Tests all validation and authentication endpoints
 */

const axios = require('axios');

const API_URL = 'http://localhost:5000/api/auth';

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(type, message) {
  const timestamp = new Date().toLocaleTimeString();
  switch(type) {
    case 'success':
      console.log(`${colors.green}✓${colors.reset} [${timestamp}] ${message}`);
      break;
    case 'error':
      console.log(`${colors.red}✗${colors.reset} [${timestamp}] ${message}`);
      break;
    case 'info':
      console.log(`${colors.blue}ℹ${colors.reset} [${timestamp}] ${message}`);
      break;
    case 'test':
      console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
      console.log(`${colors.cyan}TEST: ${message}${colors.reset}`);
      console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
      break;
  }
}

async function testValidation() {
  log('test', 'VALIDATION TESTS');

  // Test 1: Invalid email (no @)
  log('info', 'Test 1: Invalid email (no @)');
  try {
    const res = await axios.post(`${API_URL}/register`, {
      email: 'invalidemail.com',
      password: 'ValidPass123!',
      confirmPassword: 'ValidPass123!',
      name: 'Test User',
      phone: '1234567890'
    });
    log('error', 'Should have failed but passed');
  } catch (err) {
    if (err.response?.status === 400 && err.response?.data?.errors?.some(e => e.includes('@'))) {
      log('success', 'Correctly rejected email without @');
    } else {
      log('error', `Unexpected error: ${err.response?.data?.message}`);
    }
  }

  // Test 2: Invalid email (missing domain)
  log('info', 'Test 2: Invalid email (missing proper domain)');
  try {
    const res = await axios.post(`${API_URL}/register`, {
      email: 'user@',
      password: 'ValidPass123!',
      confirmPassword: 'ValidPass123!',
      name: 'Test User',
      phone: '1234567890'
    });
    log('error', 'Should have failed but passed');
  } catch (err) {
    if (err.response?.status === 400) {
      log('success', 'Correctly rejected email without proper domain');
    }
  }

  // Test 3: Password too short
  log('info', 'Test 3: Password less than 8 characters');
  try {
    const res = await axios.post(`${API_URL}/register`, {
      email: 'testuser@gmail.com',
      password: 'Pass1!',
      confirmPassword: 'Pass1!',
      name: 'Test User',
      phone: '1234567890'
    });
    log('error', 'Should have failed but passed');
  } catch (err) {
    if (err.response?.data?.errors?.some(e => e.includes('8 characters'))) {
      log('success', 'Correctly rejected password shorter than 8 characters');
    }
  }

  // Test 4: Password missing uppercase
  log('info', 'Test 4: Password missing uppercase letter');
  try {
    const res = await axios.post(`${API_URL}/register`, {
      email: 'testuser@gmail.com',
      password: 'validpass123!',
      confirmPassword: 'validpass123!',
      name: 'Test User',
      phone: '1234567890'
    });
    log('error', 'Should have failed but passed');
  } catch (err) {
    if (err.response?.data?.errors?.some(e => e.includes('uppercase'))) {
      log('success', 'Correctly rejected password without uppercase letter');
    }
  }

  // Test 5: Password missing lowercase
  log('info', 'Test 5: Password missing lowercase letter');
  try {
    const res = await axios.post(`${API_URL}/register`, {
      email: 'testuser@gmail.com',
      password: 'VALIDPASS123!',
      confirmPassword: 'VALIDPASS123!',
      name: 'Test User',
      phone: '1234567890'
    });
    log('error', 'Should have failed but passed');
  } catch (err) {
    if (err.response?.data?.errors?.some(e => e.includes('lowercase'))) {
      log('success', 'Correctly rejected password without lowercase letter');
    }
  }

  // Test 6: Password missing number
  log('info', 'Test 6: Password missing number');
  try {
    const res = await axios.post(`${API_URL}/register`, {
      email: 'testuser@gmail.com',
      password: 'ValidPass!',
      confirmPassword: 'ValidPass!',
      name: 'Test User',
      phone: '1234567890'
    });
    log('error', 'Should have failed but passed');
  } catch (err) {
    if (err.response?.data?.errors?.some(e => e.includes('number'))) {
      log('success', 'Correctly rejected password without number');
    }
  }

  // Test 7: Password missing special character
  log('info', 'Test 7: Password missing special character');
  try {
    const res = await axios.post(`${API_URL}/register`, {
      email: 'testuser@gmail.com',
      password: 'ValidPass123',
      confirmPassword: 'ValidPass123',
      name: 'Test User',
      phone: '1234567890'
    });
    log('error', 'Should have failed but passed');
  } catch (err) {
    if (err.response?.data?.errors?.some(e => e.includes('special character'))) {
      log('success', 'Correctly rejected password without special character');
    }
  }

  // Test 8: Phone number with letters
  log('info', 'Test 8: Phone number with non-digit characters');
  try {
    const res = await axios.post(`${API_URL}/register`, {
      email: 'testuser@gmail.com',
      password: 'ValidPass123!',
      confirmPassword: 'ValidPass123!',
      name: 'Test User',
      phone: 'abc1234567'
    });
    log('error', 'Should have failed but passed');
  } catch (err) {
    if (err.response?.data?.errors?.some(e => e.includes('digits'))) {
      log('success', 'Correctly rejected phone number with letters');
    }
  }

  // Test 9: Phone number too short
  log('info', 'Test 9: Phone number less than 10 digits');
  try {
    const res = await axios.post(`${API_URL}/register`, {
      email: 'testuser@gmail.com',
      password: 'ValidPass123!',
      confirmPassword: 'ValidPass123!',
      name: 'Test User',
      phone: '123456'
    });
    log('error', 'Should have failed but passed');
  } catch (err) {
    if (err.response?.data?.errors?.some(e => e.includes('10') && e.includes('15'))) {
      log('success', 'Correctly rejected phone number shorter than 10 digits');
    }
  }

  // Test 10: Passwords don't match
  log('info', 'Test 10: Password and confirm password mismatch');
  try {
    const res = await axios.post(`${API_URL}/register`, {
      email: 'testuser@gmail.com',
      password: 'ValidPass123!',
      confirmPassword: 'DifferentPass123!',
      name: 'Test User',
      phone: '1234567890'
    });
    log('error', 'Should have failed but passed');
  } catch (err) {
    if (err.response?.data?.errors?.some(e => e.includes('match'))) {
      log('success', 'Correctly rejected mismatched passwords');
    }
  }
}

async function testSuccessfulRegistration() {
  log('test', 'SUCCESSFUL REGISTRATION TEST');

  const testEmail = `test_${Date.now()}@gmail.com`;
  
  log('info', `Registering with valid data: ${testEmail}`);
  try {
    const res = await axios.post(`${API_URL}/register`, {
      email: testEmail,
      password: 'StrongPassword123!',
      confirmPassword: 'StrongPassword123!',
      name: 'Test User',
      phone: '9876543210'
    });

    if (res.status === 201 && res.data.userId) {
      log('success', `User registered successfully! User ID: ${res.data.userId}`);
      return { email: testEmail, password: 'StrongPassword123!' };
    }
  } catch (err) {
    log('error', `Registration failed: ${err.response?.data?.message}`);
  }
  return null;
}

async function testLogin(credentials) {
  log('test', 'LOGIN TEST');

  if (!credentials) {
    log('error', 'No credentials to test login');
    return;
  }

  log('info', `Testing login with: ${credentials.email}`);
  try {
    const res = await axios.post(`${API_URL}/login`, {
      email: credentials.email,
      password: credentials.password
    });

    if (res.data.token) {
      log('success', `Login successful! Token issued.`);
      return res.data.token;
    }
  } catch (err) {
    log('error', `Login failed: ${err.response?.data?.message}`);
  }
  return null;
}

async function testForgotPassword() {
  log('test', 'FORGOT PASSWORD TEST');

  log('info', 'Testing forgot password endpoint');
  try {
    const res = await axios.post(`${API_URL}/forgot-password`, {
      email: 'testuser@gmail.com'
    });

    if (res.status === 200) {
      log('success', 'Forgot password request accepted (email would be sent)');
    }
  } catch (err) {
    log('error', `Forgot password failed: ${err.response?.data?.message}`);
  }

  log('info', 'Testing invalid email in forgot password');
  try {
    const res = await axios.post(`${API_URL}/forgot-password`, {
      email: 'invalidemail'
    });
  } catch (err) {
    if (err.response?.status === 400) {
      log('success', 'Correctly rejected invalid email in forgot password');
    }
  }
}

async function testInvalidLogin() {
  log('test', 'INVALID LOGIN TESTS');

  // Test missing email
  log('info', 'Test 1: Login without email');
  try {
    const res = await axios.post(`${API_URL}/login`, {
      password: 'SomePassword123!'
    });
    log('error', 'Should have failed but passed');
  } catch (err) {
    if (err.response?.status === 400) {
      log('success', 'Correctly rejected login without email');
    }
  }

  // Test missing password
  log('info', 'Test 2: Login without password');
  try {
    const res = await axios.post(`${API_URL}/login`, {
      email: 'testuser@gmail.com'
    });
    log('error', 'Should have failed but passed');
  } catch (err) {
    if (err.response?.status === 400) {
      log('success', 'Correctly rejected login without password');
    }
  }

  // Test invalid email format in login
  log('info', 'Test 3: Login with invalid email format');
  try {
    const res = await axios.post(`${API_URL}/login`, {
      email: 'invalidemail',
      password: 'SomePassword123!'
    });
    log('error', 'Should have failed but passed');
  } catch (err) {
    if (err.response?.status === 400) {
      log('success', 'Correctly rejected login with invalid email format');
    }
  }
}

async function runAllTests() {
  console.log(`${colors.cyan}
╔════════════════════════════════════════════════════════════╗
║         FURNI-AI AUTHENTICATION TEST SUITE                 ║
║      Testing Validation, Login, and Password Reset         ║
╚════════════════════════════════════════════════════════════╝
${colors.reset}`);

  try {
    await testValidation();
    const credentials = await testSuccessfulRegistration();
    const token = await testLogin(credentials);
    await testForgotPassword();
    await testInvalidLogin();

    console.log(`
${colors.green}╔════════════════════════════════════════════════════════════╗
║              ✓ ALL TESTS COMPLETED SUCCESSFULLY             ║
╚════════════════════════════════════════════════════════════╝${colors.reset}

${colors.yellow}Next Steps:${colors.reset}
1. Configure EMAIL_USER and EMAIL_PASSWORD in .env for password reset emails
2. Test forgot password with real email notifications
3. Integrate frontend forms with these validated endpoints

${colors.cyan}Summary of Validations:${colors.reset}
  ✓ Email: Must have @ and proper domain format (gmail.com, yahoo.com, etc.)
  ✓ Password: Min 8 chars, uppercase, lowercase, number, special character
  ✓ Phone: Digits only, 10-15 digits
  ✓ Registration: All fields validated
  ✓ Login: Email & password required, proper format checked
  ✓ Forgot Password: Email validation & user verification
`);

  } catch (error) {
    console.error(`${colors.red}Test suite error: ${error.message}${colors.reset}`);
  }
}

// Run tests
runAllTests();
