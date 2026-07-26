'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function TeacherProfilePage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    const fetchTeacher = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/teachers/${id}`);
        const json = await res.json();
        if (json.ok) {
          setTeacher(json.data);
        } else {
          setError(json.error || 'Teacher not found.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacher();
  }, [id]);

  const teacherInitials = (name) => {
    if (!name) return 'T';
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join('');
  };

  if (loading) {
    return (
      <section className="profile-panel profile-page">
        <p style={{ color: 'var(--muted)' }}>Loading teacher profile...</p>
      </section>
    );
  }

  if (error || !teacher) {
    return (
      <section className="profile-panel profile-page">
        <button className="back-button" type="button" onClick={() => router.push('/teachers')}>
          <ArrowLeft size={17} />
          <span>Back</span>
        </button>
        <p className="message error">{error || 'Teacher profile not found.'}</p>
      </section>
    );
  }

  return (
    <section className="profile-panel profile-page">
      <button className="back-button" type="button" onClick={() => router.push('/teachers')}>
        <ArrowLeft size={17} />
        <span>Back</span>
      </button>

      <div className="profile-header">
        <div className="avatar">{teacherInitials(teacher.name)}</div>
        <div>
          <p className="eyebrow">{teacher.employee_id || 'Teacher Profile'}</p>
          <h2>{teacher.name}</h2>
          <span className="status-pill">{teacher.status || 'Active'}</span>
        </div>
      </div>

      <div className="profile-section">
        <h3>Teaching Overview</h3>
        <dl>
          <div>
            <dt>Subject</dt>
            <dd>{teacher.subject}</dd>
          </div>
          <div>
            <dt>Joined Date</dt>
            <dd>{teacher.joined_date || 'Not set'}</dd>
          </div>
          <div>
            <dt>Qualification</dt>
            <dd>{teacher.qualification || 'Not set'}</dd>
          </div>
          <div>
            <dt>Experience</dt>
            <dd>{teacher.experience_years || 0} years</dd>
          </div>
        </dl>
      </div>

      <div className="profile-section">
        <h3>Contact Details</h3>
        <dl>
          <div>
            <dt>Email</dt>
            <dd>{teacher.email}</dd>
          </div>
          <div>
            <dt>Phone</dt>
            <dd>{teacher.phone}</dd>
          </div>
          <div>
            <dt>Emergency Contact</dt>
            <dd>{teacher.emergency_contact || 'Not set'}</dd>
          </div>
          <div>
            <dt>Address</dt>
            <dd>{teacher.address || 'Not set'}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
