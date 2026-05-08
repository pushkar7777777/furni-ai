const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const db = require("../config/db");
const { 
  validateRegistration, 
  validateLogin, 
  validateEmail,
  validatePassword 
} = require("../utils/validation");
const { 
  sendPasswordResetEmail, 
  sendWelcomeEmail 
} = require("../utils/emailService");

const JWT_SECRET = process.env.JWT_SECRET || "furni_ai_super_secret_key";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// Helper to query the DB
const queryDB = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

// Generate password reset token
const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Register Route - with comprehensive validation
router.post("/register", async (req, res) => {
  try {
    const { email, password, confirmPassword, role, name, phone } = req.body;

    // Validate input
    const validation = validateRegistration({ email, password, confirmPassword, name, phone });
    if (!validation.isValid) {
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: validation.errors 
      });
    }

    // Assign customer as default if role not provided
    const userRole = role || 'customer';

    // Check if user exists
    const existingUser = await queryDB("SELECT * FROM users WHERE email = ?", [email.toLowerCase()]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email already registered. Please login or use another email." });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user
    const result = await queryDB(
      "INSERT INTO users (email, password_hash, role, name, phone, email_verified) VALUES (?, ?, ?, ?, ?, ?)",
      [email.toLowerCase(), hashedPassword, userRole, name || null, phone || null, false]
    );

    const userId = result.insertId;

    // Send welcome email
    await sendWelcomeEmail(email, name || "User");

    res.status(201).json({ 
      message: "User registered successfully. Please check your email to verify your account.", 
      userId,
      email: email.toLowerCase(),
      requiresEmailVerification: true
    });

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// Login Route - with validation
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    const validation = validateLogin({ email, password });
    if (!validation.isValid) {
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: validation.errors 
      });
    }

    // Find User
    const users = await queryDB("SELECT * FROM users WHERE email = ?", [email.toLowerCase()]);
    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = users[0];

    // Check Password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Update last login
    await queryDB("UPDATE users SET last_login = NOW() WHERE id = ?", [user.id]);

    // Create JWT
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
      if (err) throw err;
      res.json({ 
        token, 
        role: user.role, 
        email: user.email, 
        userId: user.id, 
        name: user.name || "",
        emailVerified: user.email_verified
      });
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

// Forgot Password Route
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Validate email format
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return res.status(400).json({ message: emailValidation.error });
    }

    // Find user
    const users = await queryDB("SELECT * FROM users WHERE email = ?", [email.toLowerCase()]);
    
    if (users.length === 0) {
      // Don't reveal if email exists for security
      return res.status(200).json({ 
        message: "If an account exists with this email, a password reset link has been sent. Please check your inbox." 
      });
    }

    const user = users[0];

    // Generate reset token
    const resetToken = generateResetToken();
    const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const expiryTime = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Save token to database
    await queryDB(
      "UPDATE users SET password_reset_token = ?, password_reset_expires = ? WHERE id = ?",
      [tokenHash, expiryTime, user.id]
    );

    // Create reset link
    const resetLink = `${FRONTEND_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

    // Send password reset email
    const emailResult = await sendPasswordResetEmail(email, user.name || "User", resetToken, resetLink);

    if (!emailResult.success) {
      console.error("Email sending failed:", emailResult.error);
      return res.status(500).json({ message: "Failed to send password reset email. Please try again later." });
    }

    res.status(200).json({ 
      message: "Password reset link has been sent to your email. It will expire in 1 hour." 
    });

  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Server error while processing password reset request" });
  }
});

// Reset Password Route
router.post("/reset-password", async (req, res) => {
  try {
    const { token, email, newPassword, confirmPassword } = req.body;

    if (!token || !email || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Validate new password strength
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ 
        message: "Password does not meet security requirements", 
        errors: passwordValidation.errors 
      });
    }

    // Hash the token for comparison
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid reset token
    const users = await queryDB(
      "SELECT * FROM users WHERE email = ? AND password_reset_token = ? AND password_reset_expires > NOW()",
      [email.toLowerCase(), tokenHash]
    );

    if (users.length === 0) {
      return res.status(400).json({ message: "Invalid or expired password reset token" });
    }

    const user = users[0];

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password and clear reset token
    await queryDB(
      "UPDATE users SET password_hash = ?, password_reset_token = NULL, password_reset_expires = NULL WHERE id = ?",
      [hashedPassword, user.id]
    );

    res.status(200).json({ 
      message: "Password reset successfully. You can now login with your new password." 
    });

  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Server error while resetting password" });
  }
});

// Change Password Route (for authenticated users)
router.post("/change-password", async (req, res) => {
  try {
    const userId = Number(req.headers["x-user-id"]);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New passwords do not match" });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({ message: "New password must be different from current password" });
    }

    // Validate new password strength
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ 
        message: "New password does not meet security requirements", 
        errors: passwordValidation.errors 
      });
    }

    // Get current user
    const users = await queryDB("SELECT * FROM users WHERE id = ?", [userId]);
    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = users[0];

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await queryDB(
      "UPDATE users SET password_hash = ? WHERE id = ?",
      [hashedPassword, userId]
    );

    res.status(200).json({ 
      message: "Password changed successfully" 
    });

  } catch (error) {
    console.error("Change Password Error:", error);
    res.status(500).json({ message: "Server error while changing password" });
  }
});

// Get user profile
router.get("/me", async (req, res) => {
  try {
    const userId = Number(req.headers["x-user-id"]);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const users = await queryDB(
      "SELECT id, email, role, name, phone, address_line1, address_line2, city, state, postal_code, email_verified, last_login, created_at FROM users WHERE id = ?",
      [userId]
    );

    if (!users.length) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(users[0]);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update user profile
router.put("/me", async (req, res) => {
  try {
    const userId = Number(req.headers["x-user-id"]);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const {
      name,
      phone,
      address_line1,
      address_line2,
      city,
      state,
      postal_code
    } = req.body;

    // Validate phone if provided
    if (phone) {
      const phoneRegex = /^[0-9]{10,15}$/;
      if (!phoneRegex.test(phone.replace(/[\s\-\(\)\.]/g, ''))) {
        return res.status(400).json({ message: "Invalid phone number format" });
      }
    }

    // Validate name if provided
    if (name && (name.length < 2 || name.length > 100)) {
      return res.status(400).json({ message: "Name must be between 2 and 100 characters" });
    }

    await queryDB(
      `UPDATE users
       SET name = ?, phone = ?, address_line1 = ?, address_line2 = ?, city = ?, state = ?, postal_code = ?
       WHERE id = ?`,
      [name || null, phone || null, address_line1 || null, address_line2 || null, city || null, state || null, postal_code || null, userId]
    );

    const users = await queryDB(
      "SELECT id, email, role, name, phone, address_line1, address_line2, city, state, postal_code, email_verified, created_at FROM users WHERE id = ?",
      [userId]
    );

    res.json(users[0]);
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Verify email (if email verification is implemented)
router.post("/verify-email", async (req, res) => {
  try {
    const userId = Number(req.headers["x-user-id"]);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { verificationCode } = req.body;

    if (!verificationCode) {
      return res.status(400).json({ message: "Verification code is required" });
    }

    // For now, we'll just mark email as verified
    // In a production environment, you'd validate the code first
    await queryDB(
      "UPDATE users SET email_verified = TRUE, email_verified_at = NOW() WHERE id = ?",
      [userId]
    );

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error during email verification" });
  }
});

module.exports = router;
