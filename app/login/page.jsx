'use client';

import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { GraduationCap, Eye, EyeOff, Loader2, UserPlus, LogIn } from 'lucide-react';

export default function LoginPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'student',
    phone: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        await login(form.username, form.password);
      } else {
        const result = await register({
          username: form.username,
          email: form.email,
          password: form.password,
          first_name: form.first_name,
          last_name: form.last_name,
          role: form.role,
          phone: form.phone,
        });
        if (result.ok) {
          // Auto-login after successful registration
          await login(form.username, form.password);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
    setForm({ username: '', email: '', password: '', first_name: '', last_name: '', role: 'student', phone: '' });
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Left Panel - Branding */}
        <div className="login-branding">
          <div className="branding-content">
            <div className="branding-icon-wrapper">
              <GraduationCap size={48} />
            </div>
            <h1 className="branding-title">School Management System</h1>
            <p className="branding-subtitle">
              Comprehensive school management platform for administrators, teachers, and students.
            </p>
            <div className="branding-features">
              <div className="branding-feature">
                <div className="feature-dot" />
                <span>Student & Teacher Management</span>
              </div>
              <div className="branding-feature">
                <div className="feature-dot" />
                <span>Attendance Tracking</span>
              </div>
              <div className="branding-feature">
                <div className="feature-dot" />
                <span>Exams & Results</span>
              </div>
              <div className="branding-feature">
                <div className="feature-dot" />
                <span>Fee Management</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="login-form-panel">
          <div className="login-form-wrapper">
            <div className="login-form-header">
              <h2>{mode === 'login' ? 'Welcome back' : 'Create account'}</h2>
              <p>
                {mode === 'login'
                  ? 'Sign in to your account to continue'
                  : 'Register to get started with the system'}
              </p>
            </div>

            {error && (
              <div className="login-error">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <form className="login-form" onSubmit={handleSubmit}>
              {mode === 'register' && (
                <div className="login-row">
                  <div className="login-field">
                    <label htmlFor="first_name">First Name</label>
                    <div className="input-wrapper">
                      <input
                        id="first_name"
                        type="text"
                        value={form.first_name}
                        onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                        placeholder="First name"
                      />
                    </div>
                  </div>
                  <div className="login-field">
                    <label htmlFor="last_name">Last Name</label>
                    <div className="input-wrapper">
                      <input
                        id="last_name"
                        type="text"
                        value={form.last_name}
                        onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                        placeholder="Last name"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="login-field">
                <label htmlFor="username">Username</label>
                <div className="input-wrapper">
                  <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <input
                    id="username"
                    type="text"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    autoComplete="username"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>

              {mode === 'register' && (
                <div className="login-field">
                  <label htmlFor="email">Email</label>
                  <div className="input-wrapper">
                    <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      autoComplete="email"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="login-field">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    placeholder={mode === 'login' ? 'Enter your password' : 'Create a password'}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {mode === 'register' && (
                <div className="login-field">
                  <label htmlFor="role">Role</label>
                  <div className="input-wrapper">
                    <select
                      id="role"
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                      className="login-select"
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="parent">Parent</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
              )}

              <button type="submit" className="login-submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 size={18} className="spinner" />
                    <span>{mode === 'login' ? 'Signing in...' : 'Creating account...'}</span>
                  </>
                ) : mode === 'login' ? (
                  <>
                    <LogIn size={18} />
                    <span>Sign in</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={18} />
                    <span>Create account</span>
                  </>
                )}
              </button>
            </form>

            <div className="login-toggle">
              <p>
                {mode === 'login' ? (
                  <>
                    Don't have an account?{' '}
                    <button type="button" className="toggle-link" onClick={toggleMode}>
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button type="button" className="toggle-link" onClick={toggleMode}>
                      Sign in
                    </button>
                  </>
                )}
              </p>
            </div>

            <p className="login-footer-text">
              Use your School Management API credentials to sign in.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}