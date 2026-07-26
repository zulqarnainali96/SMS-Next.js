'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  ClipboardCheck,
  School,
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { id: 'students', label: 'Students', href: '/students', icon: Users },
  { id: 'teachers', label: 'Teachers', href: '/teachers', icon: GraduationCap },
  { id: 'classes', label: 'Classes', href: '/classes', icon: BookOpen },
  { id: 'attendance', label: 'Attendance', href: '/attendance', icon: ClipboardCheck },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isLinkActive = (item) => {
    if (item.href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(item.href);
  };

  return (
    <aside className="sidebar">
      <div className="brand">
        <School className="brand-icon" size={28} />
        <div>
          <strong>School Desk</strong>
          <span>Management System</span>
        </div>
      </div>

      <nav className="nav-list" aria-label="Main sections">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isLinkActive(item);
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`nav-button ${active ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
