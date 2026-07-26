'use client';

import { useEffect, useState } from 'react';
import Modal from '@/components/Modal';
import { ArrowLeft, Plus } from 'lucide-react';

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClassFilter, setSelectedClassFilter] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState({ text: '', type: 'success' });

  const [form, setForm] = useState({
    name: '',
    roll_number: '',
    class_name: '',
    section: 'None',
    phone: '',
  });

  const classOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/students');
      const json = await res.json();
      if (json.ok) {
        setStudents(json.data);
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
    fetchStudents();
  }, []);

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => {
      setMessage((prev) => (prev.text === text ? { text: '', type: 'success' } : prev));
    }, 3200);
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json.ok) {
        setStudents(json.data);
        setIsModalOpen(false);
        setForm({ name: '', roll_number: '', class_name: '', section: 'None', phone: '' });
        showMessage('Student added successfully.');
      } else {
        showMessage(json.error, 'error');
      }
    } catch (err) {
      showMessage(err.message, 'error');
    }
  };

  const filteredStudents = students.filter((s) => {
    if (!selectedClassFilter) return true;
    if (s.class_name === selectedClassFilter) return true;
    const selectedNum = selectedClassFilter.match(/\d+/)?.[0];
    const studentNum = s.class_name?.match(/\d+/)?.[0];
    return selectedNum && studentNum === selectedNum;
  });

  const getInitials = (name = '') =>
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join('');

  return (
    <section className="view students-page">
      {message.text && <p className={`message ${message.type}`}>{message.text}</p>}

      <div className="section-toolbar">
        <div>
          <h2>Student Records</h2>
          <span>{filteredStudents.length} total</span>
        </div>
        <div className="toolbar-right">
          <select
            className="filter-select"
            value={selectedClassFilter}
            onChange={(e) => setSelectedClassFilter(e.target.value)}
          >
            <option value="">All Classes</option>
            {classOptions.map((c) => (
              <option key={c} value={`Class ${c}`}>
                Class {c}
              </option>
            ))}
          </select>
          <button className="add-button" type="button" onClick={() => setIsModalOpen(true)}>
            <Plus size={17} />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {!selectedStudent ? (
        <section className="table-panel">
          <div className="table-context">
            <p>
              Showing students for{' '}
              <strong>{selectedClassFilter || 'all classes'}</strong>
            </p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Roll</th>
                <th>Class</th>
                <th>Section</th>
                <th>Phone</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="empty-table-cell">
                    Loading student records...
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty-table-cell">
                    No data found for {selectedClassFilter || 'all classes'}.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="clickable-row"
                    tabIndex={0}
                    onClick={() => setSelectedStudent(student)}
                    onKeyUp={(e) => e.key === 'Enter' && setSelectedStudent(student)}
                  >
                    <td>{student.name}</td>
                    <td>{student.roll_number}</td>
                    <td>{student.class_name}</td>
                    <td>{student.section || 'None'}</td>
                    <td>{student.phone}</td>
                    <td>
                      <span className="status-pill">{student.status}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      ) : (
        <section className="profile-panel profile-page">
          <button className="back-button" type="button" onClick={() => setSelectedStudent(null)}>
            <ArrowLeft size={17} />
            <span>Back</span>
          </button>

          <div className="profile-header">
            <div className="avatar">{getInitials(selectedStudent.name)}</div>
            <div>
              <p className="eyebrow">{selectedStudent.roll_number || 'Student Profile'}</p>
              <h2>{selectedStudent.name}</h2>
              <span className="status-pill">{selectedStudent.status || 'Active'}</span>
            </div>
          </div>

          <div className="profile-section">
            <h3>Details</h3>
            <dl>
              <div>
                <dt>Class</dt>
                <dd>{selectedStudent.class_name}</dd>
              </div>
              <div>
                <dt>Section</dt>
                <dd>{selectedStudent.section || 'None'}</dd>
              </div>
              <div>
                <dt>Guardian</dt>
                <dd>{selectedStudent.guardian || 'Not set'}</dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>{selectedStudent.phone || 'Not set'}</dd>
              </div>
              <div>
                <dt>Joined</dt>
                <dd>{selectedStudent.created_at || 'Not set'}</dd>
              </div>
            </dl>
          </div>
        </section>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Student"
      >
        <form className="modal-form" onSubmit={handleAddStudent}>
          <label>
            Name
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </label>
          <label>
            Roll Number
            <input
              value={form.roll_number}
              onChange={(e) => setForm({ ...form, roll_number: e.target.value })}
              required
            />
          </label>
          <label>
            Class
            <input
              value={form.class_name}
              onChange={(e) => setForm({ ...form, class_name: e.target.value })}
              placeholder="e.g. Class 1"
              required
            />
          </label>
          <label>
            Section
            <input
              value={form.section}
              onChange={(e) => setForm({ ...form, section: e.target.value })}
              placeholder="None"
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
          <div className="modal-actions">
            <button
              className="secondary-button"
              type="button"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit">
              <Plus size={17} /> Add Student
            </button>
          </div>
        </form>
      </Modal>
    </section>
  );
}
