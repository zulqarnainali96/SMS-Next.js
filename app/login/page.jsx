'use client';

import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { GraduationCap } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(form.username, form.password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <section className="login-card">
        <div className="login-brand">
          <GraduationCap size={32} />
          <div>
            <p className="eyebrow">School Management System</p>
            <h1>Sign in</h1>
          </div>
        </div>

        <p className="login-copy">
          Use your School Management API credentials. Update BASE_URL in lib/config.js to point at your backend.
        </p>

        {error && <p className="message error">{error}</p>}

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            Username
            <input
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              autoComplete="username"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              autoComplete="current-password"
              required
            />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </section>
    </div>
  );
}
