const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

async function sendPasswordResetEmail(email, name, resetToken, resetLink) {
  const fallbackText = `Password reset for ${name || 'User'}: ${resetLink}`;

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.warn('EMAIL_USER/EMAIL_PASSWORD not set. Reset link:', resetLink);
    return { success: true, message: 'Email config missing; reset link logged to server', preview: fallbackText };
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request - Furni AI',
      text: `Hello ${name || 'User'},\n\nUse this link to reset your password (valid for 1 hour):\n${resetLink}\n\nIf you did not request this, ignore this email.`
    });

    return { success: true, info };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = { sendPasswordResetEmail };
