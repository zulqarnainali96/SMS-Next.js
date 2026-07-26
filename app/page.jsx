'use client';

import { useEffect, useState } from 'react';
import { Users, GraduationCap, BookOpen, ClipboardCheck } from 'lucide-react';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/dashboard');
      const json = await res.json();
      if (json.ok) {
        setData(json.data);
      } else {
        setError(json.error || 'Failed to load dashboard data');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <section className="view">
        <div style={{ padding: '20px 0', color: 'var(--muted)' }}>Loading dashboard metrics...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="view">
        <p className="message error">{error}</p>
      </section>
    );
  }

  const {
    students = 0,
    teachers = 0,
    classes = 0,
    attendance_today = { Present: 0, Absent: 0, Late: 0 },
    recent_students = [],
    recent_teachers = [],
    recent_classes = [],
  } = data || {};

  return (
    <section className="view">
      <div className="metric-grid">
        <article className="metric-card">
          <Users size={22} />
          <span>Students</span>
          <strong>{students}</strong>
        </article>
        <article className="metric-card">
          <GraduationCap size={22} />
          <span>Teachers</span>
          <strong>{teachers}</strong>
        </article>
        <article className="metric-card">
          <BookOpen size={22} />
          <span>Classes</span>
          <strong>{classes}</strong>
        </article>
        <article className="metric-card">
          <ClipboardCheck size={22} />
          <span>Present Today</span>
          <strong>{attendance_today.Present}</strong>
        </article>
      </div>

      <div className="two-column">
        <section className="panel">
          <div className="panel-heading">
            <h2>Today's Attendance</h2>
          </div>
          <div className="attendance-strip">
            <div>
              <span>Present</span>
              <strong>{attendance_today.Present}</strong>
            </div>
            <div>
              <span>Absent</span>
              <strong>{attendance_today.Absent}</strong>
            </div>
            <div>
              <span>Late</span>
              <strong>{attendance_today.Late}</strong>
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel-heading">
            <h2>Recent Students</h2>
          </div>
          <ul className="compact-list">
            {recent_students.map((student) => (
              <li key={student.id || student.roll_number}>
                <span>{student.name}</span>
                <small>{student.roll_number} · {student.class_name}</small>
              </li>
            ))}
            {recent_students.length === 0 && (
              <li style={{ color: 'var(--muted)' }}>No student records found.</li>
            )}
          </ul>
        </section>
      </div>

      <div className="two-column">
        <section className="panel">
          <div className="panel-heading">
            <h2>Recent Teachers</h2>
          </div>
          <ul className="compact-list">
            {recent_teachers.map((teacher) => (
              <li key={teacher.id || teacher.employee_id}>
                <span>{teacher.name}</span>
                <small>{teacher.subject} · {teacher.status}</small>
              </li>
            ))}
            {recent_teachers.length === 0 && (
              <li style={{ color: 'var(--muted)' }}>No teacher records found.</li>
            )}
          </ul>
        </section>

        <section className="panel">
          <div className="panel-heading">
            <h2>Recent Classes</h2>
          </div>
          <ul className="compact-list">
            {recent_classes.map((classroom) => (
              <li key={classroom.id || (classroom.name + classroom.section)}>
                <span>{classroom.name} ({classroom.section})</span>
                <small>{classroom.room} · {classroom.teacher_name || 'Unassigned'}</small>
              </li>
            ))}
            {recent_classes.length === 0 && (
              <li style={{ color: 'var(--muted)' }}>No class records found.</li>
            )}
          </ul>
        </section>
      </div>
    </section>
  );
}
