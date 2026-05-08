import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { resetPassword } from '../services/api';

const ResetPassword = () => {
  const [params] = useSearchParams();
  const token = params.get('token');
  const email = params.get('email');
  const validLink = useMemo(() => Boolean(token && email), [token, email]);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const res = await resetPassword({ token, email, newPassword, confirmPassword });
      setMessage(res.message || 'Password reset successful');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (!validLink) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#0f0a07] text-white">
        <div className="w-full max-w-md bg-white/5 border border-white/10 p-8 rounded-2xl space-y-3">
          <h1 className="text-2xl font-bold">Invalid Reset Link</h1>
          <p className="text-white/70 text-sm">Please request a new password reset link.</p>
          <Link className="text-sm text-[#FFDAB9]" to="/forgot-password">Go to forgot password</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0f0a07] text-white">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white/5 border border-white/10 p-8 rounded-2xl space-y-4">
        <h1 className="text-2xl font-bold">Reset Password</h1>
        {message && <div className="text-green-300 text-sm">{message}</div>}
        {error && <div className="text-red-300 text-sm">{error}</div>}
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-white/10 outline-none"
          placeholder="New password"
          required
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-white/10 outline-none"
          placeholder="Confirm new password"
          required
        />
        <button disabled={loading} className="w-full bg-[#FFF8F0] text-[#2E1F13] py-3 rounded-xl font-semibold">
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
        <Link className="text-sm text-[#FFDAB9]" to="/login">Back to login</Link>
      </form>
    </div>
  );
};

export default ResetPassword;
