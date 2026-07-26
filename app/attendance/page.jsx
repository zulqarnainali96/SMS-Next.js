'use client';

import { useEffect, useState } from 'react';
import { ClipboardCheck } from 'lucide-react';

export default function AttendancePage() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: 'success' });

  const todayStr = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({
    student_id: '',
    attendance_date: todayStr,
    status: 'Present',
    note: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [studentRes, attendanceRes] = await Promise.all([
        fetch('/api/students'),
        fetch('/api/attendance'),
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
  }, []);

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => {
      setMessage((prev) => (prev.text === text ? { text: '', type: 'success' } : prev));
    }, 3200);
  };

  const handleSaveAttendance = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json.ok) {
        setAttendance(json.data);
        setForm((prev) => ({ ...prev, note: '' }));
        showMessage('Attendance saved successfully.');
      } else {
        showMessage(json.error, 'error');
      }
    } catch (err) {
      showMessage(err.message, 'error');
    }
  };

  const todayRecords = attendance.filter((r) => r.attendance_date === todayStr);

  return (
    <section className="view split-view">
      {message.text && <p className={`message ${message.type}`} style={{ gridColumn: '1 / -1' }}>{message.text}</p>}

      <form className="form-panel" onSubmit={handleSaveAttendance}>
        <h2>Mark Attendance</h2>
        <label>
          Student
          <select
            value={form.student_id}
            onChange={(e) => setForm({ ...form, student_id: e.target.value })}
            required
          >
            <option value="" disabled>
              Select student
            </option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} · {s.roll_number} ({s.class_name})
              </option>
            ))}
          </select>
        </label>
        <label>
          Date
          <input
            type="date"
            value={form.attendance_date}
            onChange={(e) => setForm({ ...form, attendance_date: e.target.value })}
            required
          />
        </label>
        <label>
          Status
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            required
          >
            <option>Present</option>
            <option>Absent</option>
            <option>Late</option>
          </select>
        </label>
        <label>
          Note
          <input
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            placeholder="Optional note"
          />
        </label>
        <button type="submit">
          <ClipboardCheck size={17} />
          <span>Save Attendance</span>
        </button>
      </form>

      <section className="table-panel">
        <div className="panel-heading">
          <h2>Today's Attendance</h2>
          <span>{todayRecords.length} records</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Student</th>
              <th>Class</th>
              <th>Status</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="empty-table-cell">
                  Loading attendance records...
                </td>
              </tr>
            ) : todayRecords.length === 0 ? (
              <tr>
                <td colSpan={5} className="empty-table-cell">
                  No attendance marked for today yet.
                </td>
              </tr>
            ) : (
              todayRecords.map((record) => (
                <tr key={record.id}>
                  <td>{record.attendance_date}</td>
                  <td>{record.student_name}</td>
                  <td>{record.class_name}</td>
                  <td>
                    <span className="status-pill">{record.status}</span>
                  </td>
                  <td>{record.note || '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </section>
  );
}
