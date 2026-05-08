# Authentication System - Setup & Testing Guide

## Overview
The authentication system now includes comprehensive validation and password reset functionality.

---

## Features Implemented

### 1. **Registration with Validation**
- **Email Validation**: Must contain @ and a valid domain
- **Password Requirements** (minimum 8 characters):
  - At least one uppercase letter (A-Z)
  - At least one lowercase letter (a-z)
  - At least one number (0-9)
  - At least one special character (!@#$%^&* etc)
- **Phone Validation**: Must contain only digits (10-15 digits)
- **Name Validation**: 2-100 characters, letters/spaces/hyphens/apostrophes only
- **Confirmation Password**: Must match the password field

### 2. **Login with Validation**
- Email format validation
- Password validation
- Automatic last login timestamp tracking

### 3. **Forgot Password**
- Secure token generation using crypto
- Token expires after 1 hour
- Email notification with password reset link
- Security: Email doesn't confirm if account exists

### 4. **Reset Password**
- Token verification and expiration check
- New password strength validation
- Secure hash storage using bcryptjs

### 5. **Change Password** (for authenticated users)
- Current password verification
- New password must be different from current
- New password strength validation

---

## Database Setup

### Migration: Add Password Reset Fields
Run this migration to update your existing users table:

```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_reset_token VARCHAR(255) NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_reset_expires DATETIME NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified_at DATETIME NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login DATETIME NULL;

CREATE INDEX IF NOT EXISTS idx_password_reset_token ON users(password_reset_token);
CREATE INDEX IF NOT EXISTS idx_email_verified ON users(email_verified);
```

Or use the migration file:
```bash
mysql -h localhost -u root -p furni_ai < backend/migrations/001_add_password_reset_fields.sql
```

---

## Environment Setup

### 1. Install Dependencies
```bash
cd backend
npm install
npm install nodemailer
```

### 2. Configure Email Service

Create a `.env` file in the backend directory:

```env
# Email Configuration (Gmail example)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password

# Frontend URL (for password reset links)
FRONTEND_URL=http://localhost:5173

# JWT Secret
JWT_SECRET=your_super_secret_key_here

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_db_password
DB_NAME=furni_ai
```

#### Gmail Configuration Steps:
1. Enable 2-Factor Authentication in your Google account
2. Generate an App Password (not your regular Google password):
   - Go to https://myaccount.google.com/apppasswords
   - Select Mail and Windows Computer
   - Copy the generated password
3. Use this password in `EMAIL_PASSWORD` in .env

#### Alternative Email Services:
- **SendGrid**: `EMAIL_SERVICE=sendgrid` with API key
- **Mailgun**: `EMAIL_SERVICE=mailgun` with API key
- **Outlook**: `EMAIL_SERVICE=outlook` with credentials

---

## API Endpoints

### 1. Register
**POST** `/api/auth/register`

Request Body:
```json
{
  "email": "user@gmail.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!",
  "name": "John Doe",
  "phone": "9876543210",
  "role": "customer"
}
```

Response (Success):
```json
{
  "message": "User registered successfully. Please check your email to verify your account.",
  "userId": 1,
  "email": "user@gmail.com",
  "requiresEmailVerification": true
}
```

Response (Validation Error):
```json
{
  "message": "Validation failed",
  "errors": [
    "Password must be at least 8 characters long",
    "Password must contain at least one uppercase letter (A-Z)",
    "Password must contain at least one special character (!@#$%^&* etc)"
  ]
}
```

---

### 2. Login
**POST** `/api/auth/login`

Request Body:
```json
{
  "email": "user@gmail.com",
  "password": "SecurePass123!"
}
```

Response (Success):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "customer",
  "email": "user@gmail.com",
  "userId": 1,
  "name": "John Doe",
  "emailVerified": false
}
```

---

### 3. Forgot Password
**POST** `/api/auth/forgot-password`

Request Body:
```json
{
  "email": "user@gmail.com"
}
```

Response:
```json
{
  "message": "If an account exists with this email, a password reset link has been sent. Please check your inbox."
}
```

---

### 4. Reset Password
**POST** `/api/auth/reset-password`

Request Body:
```json
{
  "token": "token_from_email_link",
  "email": "user@gmail.com",
  "newPassword": "NewSecurePass456!",
  "confirmPassword": "NewSecurePass456!"
}
```

Response (Success):
```json
{
  "message": "Password reset successfully. You can now login with your new password."
}
```

Response (Invalid Token):
```json
{
  "message": "Invalid or expired password reset token"
}
```

---

### 5. Change Password (Authenticated Users)
**POST** `/api/auth/change-password`

Headers:
```
x-user-id: 1
```

Request Body:
```json
{
  "currentPassword": "SecurePass123!",
  "newPassword": "NewSecurePass456!",
  "confirmPassword": "NewSecurePass456!"
}
```

Response (Success):
```json
{
  "message": "Password changed successfully"
}
```

---

### 6. Get User Profile
**GET** `/api/auth/me`

Headers:
```
x-user-id: 1
```

Response:
```json
{
  "id": 1,
  "email": "user@gmail.com",
  "role": "customer",
  "name": "John Doe",
  "phone": "9876543210",
  "address_line1": "123 Main St",
  "address_line2": "Apt 4B",
  "city": "New York",
  "state": "NY",
  "postal_code": "10001",
  "email_verified": false,
  "last_login": "2026-05-08T10:30:00.000Z",
  "created_at": "2026-05-08T09:00:00.000Z"
}
```

---

### 7. Update User Profile
**PUT** `/api/auth/me`

Headers:
```
x-user-id: 1
```

Request Body:
```json
{
  "name": "John Doe Updated",
  "phone": "9876543210",
  "address_line1": "456 Oak Ave",
  "city": "Boston",
  "state": "MA",
  "postal_code": "02101"
}
```

---

## Testing with cURL

### Test Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@gmail.com",
    "password": "TestPass123!",
    "confirmPassword": "TestPass123!",
    "name": "Test User",
    "phone": "9876543210"
  }'
```

### Test Password Requirements
```bash
# This will fail - password too short
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@gmail.com",
    "password": "short",
    "confirmPassword": "short",
    "name": "Test User",
    "phone": "9876543210"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@gmail.com",
    "password": "TestPass123!"
  }'
```

### Test Forgot Password
```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "test@gmail.com"}'
```

---

## Password Strength Levels

The system calculates password strength (0-5 scale):

| Score | Requirements Met |
|-------|------------------|
| 5 | Length ≥12 chars + uppercase + lowercase + numbers + special chars |
| 4 | Length ≥8 chars + uppercase + lowercase + numbers + special chars |
| 3 | Length ≥8 chars + mixed case + numbers or special chars |
| 2 | Length ≥12 chars or other combinations |
| 1 | Only basic length requirement met |
| 0 | Below minimum requirements |

### Example Strong Passwords:
- ✅ `SecurePass123!` (8 chars, 1 uppercase, 1 number, 1 special)
- ✅ `MyPassword#2024` (12+ chars, mixed case, numbers, special)
- ✅ `Test@Pass99!` (10 chars, uppercase, lowercase, numbers, special)

### Example Weak Passwords:
- ❌ `password123` (no uppercase, no special char)
- ❌ `Pass123` (7 chars, below 8 minimum)
- ❌ `PASSWORD123!` (no lowercase)
- ❌ `Pass@word` (no numbers)

---

## Email Verification (Optional)

To implement email verification:

1. Frontend: After registration, prompt user to verify email
2. Send verification code via email
3. User enters code on frontend
4. Call `POST /api/auth/verify-email` with verification code
5. Mark `email_verified = TRUE` in database

---

## Security Best Practices Implemented

1. ✅ Passwords are hashed using bcryptjs (10 salt rounds)
2. ✅ Password reset tokens are hashed before storage
3. ✅ Reset tokens expire after 1 hour
4. ✅ Email doesn't confirm if account exists (prevents user enumeration)
5. ✅ Strong password requirements enforced
6. ✅ Phone numbers validated for digits only
7. ✅ Email format validated
8. ✅ Input validation on all endpoints
9. ✅ JWT tokens expire after 7 days
10. ✅ Last login tracked for security audits

---

## Troubleshooting

### Email Not Sending?
- Check if `.env` file has correct email credentials
- Verify `EMAIL_SERVICE` is set correctly
- For Gmail: Ensure you've generated an App Password, not using your regular password
- Check server logs for error messages

### "Invalid or expired password reset token"
- Token expires after 1 hour
- Token may have been used already
- User can request a new password reset

### Phone Number Validation Errors
- Must contain only digits (0-9)
- Must be 10-15 digits long
- Remove any spaces, dashes, or parentheses

### Password Validation Errors
- Must be at least 8 characters
- Must have at least 1 uppercase letter
- Must have at least 1 lowercase letter
- Must have at least 1 number
- Must have at least 1 special character

---

## Next Steps

1. Update frontend login/registration forms with validation feedback
2. Add frontend password strength indicator
3. Implement email verification on frontend
4. Add rate limiting to prevent brute force attacks
5. Implement account lockout after failed login attempts
6. Add two-factor authentication (2FA) for enhanced security
7. Add login history tracking and device management

