# Frontend Implementation Guide - Authentication

## Overview
This guide helps you implement the new authentication endpoints and validation feedback on the frontend.

---

## Password Validation Feedback

### Password Requirements to Display
Display these requirements in real-time as user types:

```javascript
// Example React component for password strength indicator

const PasswordStrengthIndicator = ({ password }) => {
  const requirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Contains uppercase letter (A-Z)", met: /[A-Z]/.test(password) },
    { label: "Contains lowercase letter (a-z)", met: /[a-z]/.test(password) },
    { label: "Contains number (0-9)", met: /\d/.test(password) },
    { label: "Contains special character (!@#$%^&*)", met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) }
  ];

  const metCount = requirements.filter(r => r.met).length;
  const strengthScore = metCount;
  const strengthLabel = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][strengthScore];
  const strengthColor = ['#d32f2f', '#ff9800', '#ffc107', '#4caf50', '#2196f3', '#1976d2'][strengthScore];

  return (
    <div>
      <div style={{ 
        height: '5px', 
        backgroundColor: '#e0e0e0', 
        borderRadius: '3px',
        marginBottom: '8px'
      }}>
        <div style={{ 
          height: '100%', 
          width: `${(strengthScore / 5) * 100}%`,
          backgroundColor: strengthColor,
          borderRadius: '3px',
          transition: 'width 0.3s'
        }}></div>
      </div>
      
      <p style={{ color: strengthColor, fontWeight: 'bold' }}>
        Strength: {strengthLabel}
      </p>

      <ul style={{ paddingLeft: '20px' }}>
        {requirements.map((req, idx) => (
          <li key={idx} style={{ 
            color: req.met ? '#4caf50' : '#999',
            textDecoration: req.met ? 'line-through' : 'none'
          }}>
            {req.met ? '✓' : '○'} {req.label}
          </li>
        ))}
      </ul>
    </div>
  );
};
```

---

## Email Validation Display

```javascript
const EmailValidation = ({ email }) => {
  const hasAt = email.includes('@');
  const hasDomain = email.includes('.');
  const isValid = hasAt && hasDomain && email.length > 5;
  
  const commonDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
  const domain = email.split('@')[1];
  const isCommonDomain = commonDomains.includes(domain?.toLowerCase());

  return (
    <div>
      <p style={{ color: isValid ? '#4caf50' : '#999' }}>
        {isValid ? '✓' : '○'} Contains @ symbol
      </p>
      <p style={{ color: isValid && isCommonDomain ? '#4caf50' : '#ff9800' }}>
        Domain: {isCommonDomain ? '✓ Common' : '⚠ Custom domain'}
      </p>
      {!isValid && email && (
        <p style={{ color: '#d32f2f', fontSize: '12px' }}>
          Invalid format. Use format: example@gmail.com
        </p>
      )}
    </div>
  );
};
```

---

## Phone Number Formatting and Validation

```javascript
const PhoneInput = ({ value, onChange }) => {
  const handlePhoneChange = (e) => {
    let input = e.target.value.replace(/\D/g, ''); // Remove non-digits
    
    // Format as user types (optional: format as (XXX) XXX-XXXX)
    let formatted = '';
    if (input.length > 0) {
      formatted = input.slice(0, 10);
      if (input.length > 10) {
        formatted = input.slice(0, 15);
      }
    }
    
    onChange(formatted);
  };

  const isValid = /^\d{10,15}$/.test(value);

  return (
    <div>
      <input 
        type="tel"
        value={value}
        onChange={handlePhoneChange}
        placeholder="Enter 10-15 digit phone number"
        maxLength="15"
      />
      <p style={{ color: isValid ? '#4caf50' : '#999', fontSize: '12px' }}>
        {isValid ? '✓' : '○'} {value.length}/10-15 digits
      </p>
    </div>
  );
};
```

---

## Registration Form Example

```javascript
import React, { useState } from 'react';
import axios from 'axios';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: ''
  });

  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors([]); // Clear errors on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/register',
        formData,
        { headers: { 'Content-Type': 'application/json' } }
      );

      setSuccess(true);
      alert('Registration successful! Check your email.');
      setFormData({ email: '', password: '', confirmPassword: '', name: '', phone: '' });
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else if (error.response?.data?.message) {
        setErrors([error.response.data.message]);
      } else {
        setErrors(['An error occurred. Please try again.']);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Full Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="First Last"
        />
      </div>

      <div>
        <label>Phone Number:</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="9876543210"
          maxLength="15"
        />
      </div>

      <div>
        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        {formData.password && <PasswordStrengthIndicator password={formData.password} />}
      </div>

      <div>
        <label>Confirm Password:</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        {formData.confirmPassword && formData.password !== formData.confirmPassword && (
          <p style={{ color: '#d32f2f' }}>Passwords do not match</p>
        )}
      </div>

      {errors.length > 0 && (
        <div style={{ backgroundColor: '#ffebee', padding: '10px', borderRadius: '4px' }}>
          <p style={{ color: '#d32f2f', fontWeight: 'bold' }}>Errors:</p>
          <ul style={{ color: '#d32f2f', margin: '5px 0' }}>
            {errors.map((error, idx) => <li key={idx}>{error}</li>)}
          </ul>
        </div>
      )}

      {success && (
        <div style={{ backgroundColor: '#e8f5e9', padding: '10px', borderRadius: '4px' }}>
          <p style={{ color: '#2e7d32' }}>Registration successful!</p>
        </div>
      )}

      <button type="submit" disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
};

export default RegistrationForm;
```

---

## Forgot Password Form

```javascript
import React, { useState } from 'react';
import axios from 'axios';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/forgot-password',
        { email },
        { headers: { 'Content-Type': 'application/json' } }
      );

      setMessage(response.data.message);
      setEmail('');
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Reset Password</h2>
      <p>Enter your email address and we'll send you a link to reset your password.</p>

      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your-email@gmail.com"
          required
        />
      </div>

      {message && (
        <div style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '10px', borderRadius: '4px' }}>
          {message}
        </div>
      )}

      {error && (
        <div style={{ backgroundColor: '#ffebee', color: '#d32f2f', padding: '10px', borderRadius: '4px' }}>
          {error}
        </div>
      )}

      <button type="submit" disabled={loading}>
        {loading ? 'Sending...' : 'Send Reset Link'}
      </button>
    </form>
  );
};

export default ForgotPasswordForm;
```

---

## Reset Password Form

```javascript
import React, { useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

const ResetPasswordForm = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [formData, setFormData] = useState({
    token,
    email,
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!token || !email) {
    return <p style={{ color: '#d32f2f' }}>Invalid or missing reset link</p>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/reset-password',
        formData,
        { headers: { 'Content-Type': 'application/json' } }
      );

      setSuccess(true);
      alert('Password reset successful! You can now login.');
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else if (error.response?.data?.message) {
        setErrors([error.response.data.message]);
      } else {
        setErrors(['An error occurred. Please try again.']);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Reset Password</h2>

      <div>
        <label>New Password:</label>
        <input
          type="password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          required
        />
        {formData.newPassword && <PasswordStrengthIndicator password={formData.newPassword} />}
      </div>

      <div>
        <label>Confirm Password:</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
      </div>

      {errors.length > 0 && (
        <div style={{ backgroundColor: '#ffebee', padding: '10px', borderRadius: '4px' }}>
          <ul style={{ color: '#d32f2f' }}>
            {errors.map((error, idx) => <li key={idx}>{error}</li>)}
          </ul>
        </div>
      )}

      {success && (
        <div style={{ backgroundColor: '#e8f5e9', padding: '10px', borderRadius: '4px' }}>
          <p style={{ color: '#2e7d32' }}>Password reset successful!</p>
        </div>
      )}

      <button type="submit" disabled={loading}>
        {loading ? 'Resetting...' : 'Reset Password'}
      </button>
    </form>
  );
};

export default ResetPasswordForm;
```

---

## Login Form

```javascript
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/login',
        formData,
        { headers: { 'Content-Type': 'application/json' } }
      );

      // Store token
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.userId);
      localStorage.setItem('userRole', response.data.role);

      // Redirect to dashboard or home
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      {error && (
        <div style={{ backgroundColor: '#ffebee', color: '#d32f2f', padding: '10px', borderRadius: '4px' }}>
          {error}
        </div>
      )}

      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>

      <p>
        <a href="/forgot-password">Forgot Password?</a>
      </p>
    </form>
  );
};

export default LoginForm;
```

---

## API Utility Functions

```javascript
// api/auth.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const authAPI = {
  register: (data) => axios.post(`${API_BASE_URL}/auth/register`, data),
  
  login: (email, password) => 
    axios.post(`${API_BASE_URL}/auth/login`, { email, password }),
  
  forgotPassword: (email) => 
    axios.post(`${API_BASE_URL}/auth/forgot-password`, { email }),
  
  resetPassword: (token, email, newPassword, confirmPassword) =>
    axios.post(`${API_BASE_URL}/auth/reset-password`, {
      token, email, newPassword, confirmPassword
    }),
  
  changePassword: (currentPassword, newPassword, confirmPassword, userId) =>
    axios.post(
      `${API_BASE_URL}/auth/change-password`,
      { currentPassword, newPassword, confirmPassword },
      { headers: { 'x-user-id': userId } }
    ),
  
  getProfile: (userId) =>
    axios.get(`${API_BASE_URL}/auth/me`, {
      headers: { 'x-user-id': userId }
    }),
  
  updateProfile: (userId, data) =>
    axios.put(`${API_BASE_URL}/auth/me`, data, {
      headers: { 'x-user-id': userId }
    })
};

export default authAPI;
```

---

## Error Handling Best Practices

```javascript
const handleAuthError = (error) => {
  if (error.response?.status === 401) {
    // Token expired or unauthorized
    localStorage.removeItem('token');
    window.location.href = '/login';
  } else if (error.response?.status === 400) {
    // Validation error
    return error.response.data.errors || [error.response.data.message];
  } else if (error.response?.status === 500) {
    // Server error
    return ['Server error. Please try again later.'];
  } else {
    // Network error
    return ['Network error. Please check your connection.'];
  }
};
```

---

## Real-time Validation Example

```javascript
const validateField = (fieldName, value) => {
  const errors = [];

  switch(fieldName) {
    case 'email':
      if (!value.includes('@')) errors.push('Email must contain @');
      if (!value.includes('.')) errors.push('Email must contain domain');
      break;

    case 'password':
      if (value.length < 8) errors.push('Minimum 8 characters');
      if (!/[A-Z]/.test(value)) errors.push('Need uppercase letter');
      if (!/[a-z]/.test(value)) errors.push('Need lowercase letter');
      if (!/\d/.test(value)) errors.push('Need a number');
      if (!/[!@#$%^&*]/.test(value)) errors.push('Need special character');
      break;

    case 'phone':
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length < 10 || cleaned.length > 15) 
        errors.push('Phone must be 10-15 digits');
      break;

    case 'name':
      if (value.length < 2) errors.push('Name too short');
      if (value.length > 100) errors.push('Name too long');
      if (!/^[a-zA-Z\s\-']+$/.test(value)) 
        errors.push('Invalid characters in name');
      break;
  }

  return errors;
};
```

---

## Next Steps for Frontend

1. ✅ Implement registration form with real-time validation
2. ✅ Add password strength meter
3. ✅ Create forgot password flow
4. ✅ Create password reset page
5. ✅ Update login form with error handling
6. ✅ Add profile update form
7. ✅ Implement change password functionality
8. Implement email verification flow
9. Add account security dashboard
10. Add login history page

