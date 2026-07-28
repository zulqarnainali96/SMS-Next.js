'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export default function AppShell({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  if (isLoginPage) {
    return children;
  }

  return (
    <div className="shell">
      <Sidebar />
      <main className="content">
        <Header />
        {children}
      </main>
    </div>
  );
}
