'use client';

import { useEffect, useState, useMemo } from 'react';
import { Search, Calendar } from 'lucide-react';

export default function AttendancePage() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: 'success' });

  const todayStr = new Date().toISOString().slice(0, 10);
  const [selectedClass, setSelectedClass] = useState('Class 9');
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [searchQuery, setSearchQuery] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [studentRes, attendanceRes] = await Promise.all([
        fetch('/api/students'),
        fetch(`/api/attendance?date=${selectedDate}`),
      ]);
      const studentJson = await studentRes.json();
      const attendanceJson = await attendanceRes.json();

      if (studentJson.ok) setStudents(studentJson.data);
      if (attendanceJson.ok) setAttendance(attendanceJson.data);
    } catch (err) {
      showMessage(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => {
      setMessage((prev) => (prev.text === text ? { text: '', type: 'success' } : prev));
    }, 3200);
  };

  const classOptions = useMemo(() => {
    const classSet = new Set(students.map((s) => s.class_name));
    return Array.from(classSet).sort((a, b) => {
      const aNum = parseInt(a.match(/\d+/)?.[0] || '0');
      const bNum = parseInt(b.match(/\d+/)?.[0] || '0');
      return aNum - bNum;
    });
  }, [students]);

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesClass = s.class_name === selectedClass;
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesClass && matchesSearch;
    });
  }, [students, selectedClass, searchQuery]);

  const getAttendanceStatus = (studentId) => {
    const record = attendance.find(
      (r) => r.student_id === studentId && r.attendance_date === selectedDate
    );
    return record?.status || null;
  };

  const stats = useMemo(() => {
    const total = filteredStudents.length;
    const present = filteredStudents.filter((s) => getAttendanceStatus(s.id) === 'Present').length;
    const absent = filteredStudents.filter((s) => getAttendanceStatus(s.id) === 'Absent').length;
    const leave = filteredStudents.filter((s) => getAttendanceStatus(s.id) === 'Late').length;
    return { total, present, absent, leave };
  }, [filteredStudents, attendance, selectedDate]);

  const handleStatusToggle = (studentId, status) => {
    setAttendance((prev) => {
      const existing = prev.find(
        (r) => r.student_id === studentId && r.attendance_date === selectedDate
      );
      if (existing) {
        if (existing.status === status) {
          return prev.filter((r) => !(r.student_id === studentId && r.attendance_date === selectedDate));
        }
        return prev.map((r) =>
          r.student_id === studentId && r.attendance_date === selectedDate
            ? { ...r, status }
            : r
        );
      }
      return [
        ...prev,
        {
          id: Date.now() + Math.random(),
          student_id: studentId,
          attendance_date: selectedDate,
          status,
          note: '',
        },
      ];
    });
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const promises = attendance
        .filter((r) => r.attendance_date === selectedDate)
        .map((record) =>
          fetch('/api/attendance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(record),
          })
        );
      await Promise.all(promises);
      showMessage('Attendance saved successfully.');
    } catch (err) {
      showMessage(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name = '') =>
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join('');

  return (
    <section className="attendance-page">
      {message.text && <p className={`message ${message.type}`}>{message.text}</p>}

      <div className="attendance-toolbar">
        <div className="toolbar-left">
          <select
            className="class-select"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            {classOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <div className="date-picker">
            <Calendar size={16} />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <div className="search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Student ka naam search karein"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="toolbar-right">
          <button className="more-button" type="button">
            •••
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card total-card">
          <div className="stat-label">Total students</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat-card present-card">
          <div className="stat-label">Present</div>
          <div className="stat-value">{stats.present}</div>
        </div>
        <div className="stat-card absent-card">
          <div className="stat-label">Absent</div>
          <div className="stat-value">{stats.absent}</div>
        </div>
        <div className="stat-card leave-card">
          <div className="stat-label">Leave</div>
          <div className="stat-value">{stats.leave}</div>
        </div>
      </div>

      <section className="attendance-table-panel">
        <div className="attendance-table-header">
          <span>Roll</span>
          <span>Student</span>
          <span>Status</span>
        </div>

        {loading ? (
          <div className="empty-table-cell">Loading student records...</div>
        ) : filteredStudents.length === 0 ? (
          <div className="empty-table-cell">No students found.</div>
        ) : (
          filteredStudents.map((student) => {
            const status = getAttendanceStatus(student.id);
            return (
              <div key={student.id} className="attendance-row">
                <span className="roll-cell">{student.roll_number}</span>
                <div className="student-cell">
                  <div className="student-avatar">{getInitials(student.name)}</div>
                  <span className="student-name">{student.name}</span>
                </div>
                <div className="status-buttons">
                  <button
                    type="button"
                    className={`status-btn present ${status === 'Present' ? 'active' : ''}`}
                    onClick={() => handleStatusToggle(student.id, 'Present')}
                  >
                    P
                  </button>
                  <button
                    type="button"
                    className={`status-btn absent ${status === 'Absent' ? 'active' : ''}`}
                    onClick={() => handleStatusToggle(student.id, 'Absent')}
                  >
                    A
                  </button>
                  <button
                    type="button"
                    className={`status-btn leave ${status === 'Late' ? 'active' : ''}`}
                    onClick={() => handleStatusToggle(student.id, 'Late')}
                  >
                    L
                  </button>
                </div>
              </div>
            );
          })
        )}
      </section>

      <button
        className="save-attendance-button"
        type="button"
        onClick={handleSaveAll}
        disabled={saving}
      >
        <span className="save-icon">💾</span>
        <span>{saving ? 'Saving...' : 'Save attendance'}</span>
      </button>
    </section>
  );
}