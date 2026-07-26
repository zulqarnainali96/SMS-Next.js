'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal';
import { Plus } from 'lucide-react';

export default function TeachersPage() {
  const router = useRouter();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState({ text: '', type: 'success' });

  const [form, setForm] = useState({
    employee_id: '',
    name: '',
    subject: '',
    phone: '',
    email: '',
    address: '',
    qualification: '',
    experience_years: 0,
    emergency_contact: '',
    joined_date: new Date().toISOString().slice(0, 10),
    status: 'Active',
  });

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/teachers');
      const json = await res.json();
      if (json.ok) {
        setTeachers(json.data);
      } else {
        showMessage(json.error, 'error');
      }
    } catch (err) {
      showMessage(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => {
      setMessage((prev) => (prev.text === text ? { text: '', type: 'success' } : prev));
    }, 3200);
  };

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/teachers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json.ok) {
        setTeachers(json.data);
        setIsModalOpen(false);
        setForm({
          employee_id: '',
          name: '',
          subject: '',
          phone: '',
          email: '',
          address: '',
          qualification: '',
          experience_years: 0,
          emergency_contact: '',
          joined_date: new Date().toISOString().slice(0, 10),
          status: 'Active',
        });
        showMessage('Teacher added successfully.');
      } else {
        showMessage(json.error, 'error');
      }
    } catch (err) {
      showMessage(err.message, 'error');
    }
  };

  return (
    <section className="view teachers-page">
      {message.text && <p className={`message ${message.type}`}>{message.text}</p>}

      <div className="section-toolbar">
        <div>
          <h2>Teacher Directory</h2>
          <span>{teachers.length} total</span>
        </div>
        <button className="add-button" type="button" onClick={() => setIsModalOpen(true)}>
          <Plus size={17} />
          <span>Add Teacher</span>
        </button>
      </div>

      <section className="table-panel">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Subject</th>
              <th>Joined</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="empty-table-cell">
                  Loading teacher records...
                </td>
              </tr>
            ) : teachers.length === 0 ? (
              <tr>
                <td colSpan={5} className="empty-table-cell">
                  No teachers found.
                </td>
              </tr>
            ) : (
              teachers.map((teacher) => (
                <tr
                  key={teacher.id}
                  className="clickable-row"
                  tabIndex={0}
                  onClick={() => router.push(`/teachers/${teacher.id}`)}
                  onKeyUp={(e) => e.key === 'Enter' && router.push(`/teachers/${teacher.id}`)}
                >
                  <td>{teacher.employee_id || 'Not set'}</td>
                  <td>{teacher.name}</td>
                  <td>{teacher.subject}</td>
                  <td>{teacher.joined_date || 'Not set'}</td>
                  <td>
                    <span className="status-pill">{teacher.status || 'Active'}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Teacher">
        <form className="modal-form" onSubmit={handleAddTeacher}>
          <label>
            Employee ID
            <input
              value={form.employee_id}
              onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
              required
            />
          </label>
          <label>
            Name
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </label>
          <label>
            Subject
            <input
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              required
            />
          </label>
          <label>
            Joined Date
            <input
              type="date"
              value={form.joined_date}
              onChange={(e) => setForm({ ...form, joined_date: e.target.value })}
              required
            />
          </label>
          <label>
            Phone
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </label>
          <label>
            Address
            <textarea
              rows={3}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              required
            />
          </label>
          <label>
            Qualification
            <input
              value={form.qualification}
              onChange={(e) => setForm({ ...form, qualification: e.target.value })}
            />
          </label>
          <label>
            Experience Years
            <input
              type="number"
              min="0"
              value={form.experience_years}
              onChange={(e) => setForm({ ...form, experience_years: e.target.value })}
            />
          </label>
          <label>
            Emergency Contact
            <input
              value={form.emergency_contact}
              onChange={(e) => setForm({ ...form, emergency_contact: e.target.value })}
            />
          </label>
          <label>
            Status
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option>Active</option>
              <option>On Leave</option>
              <option>Inactive</option>
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
              <Plus size={17} /> Add Teacher
            </button>
          </div>
        </form>
      </Modal>
    </section>
  );
}
