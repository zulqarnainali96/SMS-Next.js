'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const AuthContext = createContext(null);

const PUBLIC_PATHS = ['/login'];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      const json = await res.json();
      if (json.ok) {
        setUser(json.data);
        return true;
      }
      setUser(null);
      return false;
    } catch {
      setUser(null);
      return false;
    }
  }, []);

  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      const authenticated = await fetchProfile();
      if (!active) return;

      if (!authenticated && !PUBLIC_PATHS.includes(pathname)) {
        router.replace('/login');
      } else if (authenticated && pathname === '/login') {
        router.replace('/');
      }

      setLoading(false);
    };

    bootstrap();
    return () => {
      active = false;
    };
  }, [fetchProfile, pathname, router]);

  const login = useCallback(async (username, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const json = await res.json();
    if (!json.ok) throw new Error(json.error || 'Login failed');

    await fetchProfile();
    router.replace('/');
    return json;
  }, [fetchProfile, router]);

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.replace('/login');
  }, [router]);

  const value = useMemo(
    () => ({ user, loading, login, logout, refreshProfile: fetchProfile }),
    [user, loading, login, logout, fetchProfile]
  );

  if (loading && !PUBLIC_PATHS.includes(pathname)) {
    return (
      <div className="auth-loading">
        <p>Connecting to School Management API...</p>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
