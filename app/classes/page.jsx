'use client';

import { useEffect, useState } from 'react';
import Modal from '@/components/Modal';
import { Plus } from 'lucide-react';

export default function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState({ text: '', type: 'success' });

  const [form, setForm] = useState({
    name: '',
    section: '',
    room: '',
    teacher_id: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [classRes, teacherRes] = await Promise.all([
        fetch('/api/classes'),
        fetch('/api/teachers'),
      ]);
      const classJson = await classRes.json();
      const teacherJson = await teacherRes.json();

      if (classJson.ok) setClasses(classJson.data);
      if (teacherJson.ok) setTeachers(teacherJson.data);
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

  const handleAddClass = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json.ok) {
        setClasses(json.data);
        setIsModalOpen(false);
        setForm({ name: '', section: '', room: '', teacher_id: '' });
        showMessage('Class added successfully.');
      } else {
        showMessage(json.error, 'error');
      }
    } catch (err) {
      showMessage(err.message, 'error');
    }
  };

  return (
    <section className="view classes-page">
      {message.text && <p className={`message ${message.type}`}>{message.text}</p>}

      <div className="section-toolbar">
        <div>
          <h2>Class List</h2>
          <span>{classes.length} total</span>
        </div>
        <button className="add-button" type="button" onClick={() => setIsModalOpen(true)}>
          <Plus size={17} />
          <span>Add Class</span>
        </button>
      </div>

      <section className="table-panel">
        <table>
          <thead>
            <tr>
              <th>Class</th>
              <th>Section</th>
              <th>Room</th>
              <th>Teacher</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="empty-table-cell">
                  Loading class records...
                </td>
              </tr>
            ) : classes.length === 0 ? (
              <tr>
                <td colSpan={4} className="empty-table-cell">
                  No classes found.
                </td>
              </tr>
            ) : (
              classes.map((classroom) => (
                <tr key={classroom.id} className="clickable-row">
                  <td>{classroom.name}</td>
                  <td>{classroom.section}</td>
                  <td>{classroom.room}</td>
                  <td>{classroom.teacher_name || 'Unassigned'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Class">
        <form className="modal-form" onSubmit={handleAddClass}>
          <label>
            Class Name
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Class 11"
              required
            />
          </label>
          <label>
            Section
            <input
              value={form.section}
              onChange={(e) => setForm({ ...form, section: e.target.value })}
              placeholder="e.g. A"
              required
            />
          </label>
          <label>
            Room
            <input
              value={form.room}
              onChange={(e) => setForm({ ...form, room: e.target.value })}
              placeholder="e.g. Room 111"
              required
            />
          </label>
          <label>
            Teacher
            <select
              value={form.teacher_id}
              onChange={(e) => setForm({ ...form, teacher_id: e.target.value })}
            >
              <option value="">Unassigned</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name} ({teacher.subject})
                </option>
              ))}
            </select>
          </label>
          <div className="modal-actions">
            <button
              className="secondary-button"
              type="button"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit">
              <Plus size={17} /> Add Class
            </button>
          </div>
        </form>
      </Modal>
    </section>
  );
}
