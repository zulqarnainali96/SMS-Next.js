'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from './ThemeProvider';
import { Sun, Moon, RefreshCcw, LogOut } from 'lucide-react';
import { useAuth } from './AuthProvider';

export default function Header({ title }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [todayLabel, setTodayLabel] = useState('');

  useEffect(() => {
    const today = new Date();
    setTodayLabel(
      today.toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    );
  }, []);

  const getTitle = () => {
    if (title) return title;
    if (pathname === '/') return 'Dashboard';
    if (pathname.startsWith('/students')) return 'Students';
    if (pathname.startsWith('/teachers')) return 'Teachers';
    if (pathname.startsWith('/classes')) return 'Classes';
    if (pathname.startsWith('/attendance')) return 'Attendance';
    return 'School Desk';
  };

  const handleRefresh = () => {
    router.refresh();
  };

  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">{todayLabel}</p>
        <h1>{getTitle()}</h1>
      </div>
      <div className="topbar-actions">
        {user?.username && (
          <span className="topbar-user">{user.username}</span>
        )}
        <button
          className="theme-toggle"
          type="button"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          onClick={toggleTheme}
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>
        <button className="refresh-button" type="button" onClick={handleRefresh}>
          <RefreshCcw size={17} />
          <span>Refresh</span>
        </button>
        <button className="secondary-button" type="button" onClick={logout}>
          <LogOut size={17} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
