import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await forgotPassword(email.trim());
      setMessage(res.message || 'If your account exists, reset instructions have been sent.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request password reset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0f0a07] text-white">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white/5 border border-white/10 p-8 rounded-2xl space-y-4">
        <h1 className="text-2xl font-bold">Forgot Password</h1>
        <p className="text-white/70 text-sm">Enter your gmail address to receive a reset link.</p>
        {message && <div className="text-green-300 text-sm">{message}</div>}
        {error && <div className="text-red-300 text-sm">{error}</div>}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-white/10 outline-none"
          placeholder="example@gmail.com"
          required
        />
        <button disabled={loading} className="w-full bg-[#FFF8F0] text-[#2E1F13] py-3 rounded-xl font-semibold">
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
        <Link className="text-sm text-[#FFDAB9]" to="/login">Back to login</Link>
      </form>
    </div>
  );
};

export default ForgotPassword;
