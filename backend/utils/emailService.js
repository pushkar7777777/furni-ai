/**
 * Email utilities for sending verification and password reset emails
 */

const nodemailer = require('nodemailer');

// Configure email transporter
// For development/testing, you can use gmail or other services
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password'
  }
});

/**
 * Send password reset email
 * @param {string} email - Recipient email
 * @param {string} name - Recipient name
 * @param {string} resetToken - Password reset token
 * @param {string} resetLink - Full reset link (can be constructed as: ${process.env.FRONTEND_URL}/reset-password?token=${resetToken})
 * @returns {Promise} - Email send result
 */
async function sendPasswordResetEmail(email, name, resetToken, resetLink) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@furni-ai.com',
      to: email,
      subject: 'Password Reset Request - Furni AI',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9f9f9; padding: 20px; }
            .footer { background-color: #333; color: white; padding: 10px; text-align: center; font-size: 12px; border-radius: 0 0 5px 5px; }
            .button { display: inline-block; padding: 12px 30px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .warning { color: #d32f2f; font-weight: bold; }
            .token-box { background-color: #e8f5e9; padding: 15px; border-left: 4px solid #4CAF50; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Hello <strong>${name || 'User'}</strong>,</p>
              
              <p>We received a request to reset the password for your Furni AI account associated with this email address.</p>
              
              <p>If you made this request, please click the button below to reset your password. This link will expire in 1 hour.</p>
              
              <center>
                <a href="${resetLink}" class="button">Reset Password</a>
              </center>
              
              <p>Or copy and paste this link in your browser:</p>
              <div class="token-box">
                <p style="word-break: break-all; margin: 0;">${resetLink}</p>
              </div>
              
              <p><span class="warning">IMPORTANT:</span> If you did not request a password reset, please ignore this email or contact our support team immediately. Your account security is important to us.</p>
              
              <p>This password reset link will expire in <strong>1 hour</strong> for security reasons.</p>
              
              <p>Best regards,<br><strong>Furni AI Team</strong></p>
            </div>
            <div class="footer">
              <p>&copy; 2026 Furni AI. All rights reserved. | Do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Hello ${name || 'User'},

We received a request to reset the password for your Furni AI account. If you made this request, please use this link to reset your password:

${resetLink}

This link will expire in 1 hour.

If you did not request a password reset, please ignore this email or contact our support team.

Best regards,
Furni AI Team
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.response);
    return { success: true, message: 'Password reset email sent successfully', info };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, message: 'Failed to send password reset email', error: error.message };
  }
}

/**
 * Send welcome email
 * @param {string} email - Recipient email
 * @param {string} name - Recipient name
 * @returns {Promise} - Email send result
 */
async function sendWelcomeEmail(email, name) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@furni-ai.com',
      to: email,
      subject: 'Welcome to Furni AI!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9f9f9; padding: 20px; }
            .footer { background-color: #333; color: white; padding: 10px; text-align: center; font-size: 12px; border-radius: 0 0 5px 5px; }
            .button { display: inline-block; padding: 12px 30px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Furni AI!</h1>
            </div>
            <div class="content">
              <p>Hello <strong>${name || 'User'}</strong>,</p>
              
              <p>Welcome to Furni AI! Your account has been successfully created.</p>
              
              <p>You can now log in and start exploring our amazing furniture collections and services.</p>
              
              <center>
                <a href="${process.env.FRONTEND_URL || 'https://furni-ai.com'}" class="button">Start Shopping</a>
              </center>
              
              <h3>What's Next?</h3>
              <ul>
                <li>Complete your profile with your preferences</li>
                <li>Browse our extensive furniture collection</li>
                <li>Get personalized AI recommendations</li>
                <li>Track your orders and deliveries</li>
              </ul>
              
              <p>If you have any questions, feel free to contact our support team.</p>
              
              <p>Best regards,<br><strong>Furni AI Team</strong></p>
            </div>
            <div class="footer">
              <p>&copy; 2026 Furni AI. All rights reserved. | Do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Hello ${name || 'User'},

Welcome to Furni AI! Your account has been successfully created. You can now log in and start exploring our collections.

Best regards,
Furni AI Team
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent:', info.response);
    return { success: true, message: 'Welcome email sent successfully', info };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, message: 'Failed to send welcome email', error: error.message };
  }
}

/**
 * Send verification email
 * @param {string} email - Recipient email
 * @param {string} name - Recipient name
 * @param {string} verificationLink - Full verification link
 * @returns {Promise} - Email send result
 */
async function sendVerificationEmail(email, name, verificationLink) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@furni-ai.com',
      to: email,
      subject: 'Verify Your Email - Furni AI',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #2196F3; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9f9f9; padding: 20px; }
            .footer { background-color: #333; color: white; padding: 10px; text-align: center; font-size: 12px; border-radius: 0 0 5px 5px; }
            .button { display: inline-block; padding: 12px 30px; background-color: #2196F3; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Verify Your Email</h1>
            </div>
            <div class="content">
              <p>Hello <strong>${name || 'User'}</strong>,</p>
              
              <p>Thank you for registering with Furni AI. Please verify your email address to complete your account setup.</p>
              
              <center>
                <a href="${verificationLink}" class="button">Verify Email</a>
              </center>
              
              <p>If you did not create this account, please ignore this email.</p>
              
              <p>Best regards,<br><strong>Furni AI Team</strong></p>
            </div>
            <div class="footer">
              <p>&copy; 2026 Furni AI. All rights reserved. | Do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Hello ${name || 'User'},

Thank you for registering. Please verify your email by clicking this link:

${verificationLink}

Best regards,
Furni AI Team
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent:', info.response);
    return { success: true, message: 'Verification email sent successfully', info };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { success: false, message: 'Failed to send verification email', error: error.message };
  }
}

module.exports = {
  sendPasswordResetEmail,
  sendWelcomeEmail,
  sendVerificationEmail
};
