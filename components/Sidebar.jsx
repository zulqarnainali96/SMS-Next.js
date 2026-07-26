'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  ClipboardCheck,
  School,
  ChevronDown,
  ChevronRight,
  NotebookPen,
  BookMarked,
  ClipboardList,
  Wallet,
  CalendarClock,
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { id: 'students', label: 'Students', href: '/students', icon: Users },
  { id: 'teachers', label: 'Teachers', href: '/teachers', icon: GraduationCap },
  { id: 'classes', label: 'Classes', href: '/classes', icon: BookOpen },
  { id: 'attendance', label: 'Attendance', href: '/attendance', icon: ClipboardCheck },
];

const newPages = [
  { id: 'assignments', label: 'Assignments', href: '/assignments', icon: NotebookPen },
  { id: 'courses', label: 'Courses', href: '/courses', icon: BookMarked },
  { id: 'exams', label: 'Exams', href: '/exams', icon: ClipboardList },
  { id: 'fees', label: 'Fees', href: '/fees', icon: Wallet },
  { id: 'timetable', label: 'Timetable', href: '/timetable', icon: CalendarClock },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [newPagesOpen, setNewPagesOpen] = useState(false);

  const isLinkActive = (item) => {
    if (item.href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(item.href);
  };

  const isNewPageActive = newPages.some((item) => pathname.startsWith(item.href));

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

        <div className="nav-divider" />

        <button
          className={`nav-button dropdown-toggle ${isNewPageActive ? 'active' : ''}`}
          type="button"
          onClick={() => setNewPagesOpen(!newPagesOpen)}
        >
          {newPagesOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          <span>New Pages</span>
        </button>

        {newPagesOpen && (
          <div className="dropdown-items">
            {newPages.map((item) => {
              const Icon = item.icon;
              const active = isLinkActive(item);
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`nav-button dropdown-item ${active ? 'active' : ''}`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </nav>
    </aside>
  );
}