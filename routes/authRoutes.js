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
const { sendPasswordResetEmail } = require("../utils/emailService");

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

const generateResetToken = () => crypto.randomBytes(32).toString("hex");

// Register Route
router.post("/register", async (req, res) => {
  try {
    const { email, password, confirmPassword, role, name, phone } = req.body;

    const validation = validateRegistration({ email, password, confirmPassword, name, phone });
    if (!validation.isValid) {
      return res.status(400).json({ message: "Validation failed", errors: validation.errors });
    }

    const userRole = role || "customer";
    const normalizedEmail = email.trim().toLowerCase();
    const cleanedPhone = String(phone).trim().replace(/[\s\-().+]/g, "");

    const existingUser = await queryDB("SELECT * FROM users WHERE email = ?", [normalizedEmail]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await queryDB(
      "INSERT INTO users (email, password_hash, role, name, phone, email_verified) VALUES (?, ?, ?, ?, ?, ?)",
      [normalizedEmail, hashedPassword, userRole, name.trim(), cleanedPhone, false]
    );

    res.status(201).json({
      message: "User registered successfully",
      userId: result.insertId 
    });

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const validation = validateLogin({ email, password });
    if (!validation.isValid) {
      return res.status(400).json({ message: "Validation failed", errors: validation.errors });
    }

    const users = await queryDB("SELECT * FROM users WHERE email = ?", [email.trim().toLowerCase()]);
    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    await queryDB("UPDATE users SET last_login = NOW() WHERE id = ?", [user.id]);

    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' }, (err, token) => {
      if (err) throw err;
      res.json({ token, role: user.role, email: user.email, userId: user.id, name: user.name || "" });
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return res.status(400).json({ message: emailValidation.error });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const users = await queryDB("SELECT * FROM users WHERE email = ?", [normalizedEmail]);

    if (!users.length) {
      return res.status(200).json({
        message: "If this account exists, password reset instructions have been sent."
      });
    }

    const user = users[0];
    const resetToken = generateResetToken();
    const tokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");
    const expiryTime = new Date(Date.now() + 60 * 60 * 1000);

    await queryDB(
      "UPDATE users SET password_reset_token = ?, password_reset_expires = ? WHERE id = ?",
      [tokenHash, expiryTime, user.id]
    );

    const resetLink = `${FRONTEND_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(normalizedEmail)}`;
    const emailResult = await sendPasswordResetEmail(normalizedEmail, user.name || "User", resetToken, resetLink);

    if (!emailResult.success) {
      return res.status(500).json({ message: "Failed to send password reset email" });
    }

    return res.status(200).json({ message: "Password reset link sent. It expires in 1 hour." });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { token, email, newPassword, confirmPassword } = req.body;

    if (!token || !email || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return res.status(400).json({ message: emailValidation.error });
    }

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        message: "Password does not meet requirements",
        errors: passwordValidation.errors
      });
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const users = await queryDB(
      "SELECT * FROM users WHERE email = ? AND password_reset_token = ? AND password_reset_expires > NOW()",
      [email.trim().toLowerCase(), tokenHash]
    );

    if (!users.length) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await queryDB(
      "UPDATE users SET password_hash = ?, password_reset_token = NULL, password_reset_expires = NULL WHERE id = ?",
      [hashedPassword, users[0].id]
    );

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/me", async (req, res) => {
  try {
    const userId = Number(req.headers["x-user-id"]);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const users = await queryDB(
      "SELECT id, email, role, name, phone, address_line1, address_line2, city, state, postal_code, created_at FROM users WHERE id = ?",
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

    await queryDB(
      `UPDATE users
       SET name = ?, phone = ?, address_line1 = ?, address_line2 = ?, city = ?, state = ?, postal_code = ?
       WHERE id = ?`,
      [name || null, phone || null, address_line1 || null, address_line2 || null, city || null, state || null, postal_code || null, userId]
    );

    const users = await queryDB(
      "SELECT id, email, role, name, phone, address_line1, address_line2, city, state, postal_code, created_at FROM users WHERE id = ?",
      [userId]
    );

    res.json(users[0]);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
