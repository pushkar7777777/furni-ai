-- Migration: Add password reset and email verification fields to users table
-- Run this migration to update the users table schema

ALTER TABLE users ADD COLUMN password_reset_token VARCHAR(255) NULL;
ALTER TABLE users ADD COLUMN password_reset_expires DATETIME NULL;
ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN email_verified_at DATETIME NULL;
ALTER TABLE users ADD COLUMN last_login DATETIME NULL;

-- Create index for faster token lookups
CREATE INDEX idx_password_reset_token ON users(password_reset_token);
CREATE INDEX idx_email_verified ON users(email_verified);
