'use client';

import { useEffect, useState } from 'react';

export default function ExamsPage() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/exams');
        const json = await res.json();
        if (json.ok) {
          setExams(json.data);
        } else {
          setError(json.error || 'Failed to load exams.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  return (
    <section className="view">
      <div className="section-toolbar">
        <div>
          <h2>Examination System</h2>
          <span>{exams.length} exams</span>
        </div>
      </div>

      {error && <p className="message error">{error}</p>}

      <section className="table-panel">
        <table>
          <thead>
            <tr>
              <th>Exam</th>
              <th>Class</th>
              <th>Subject</th>
              <th>Date</th>
              <th>Max Marks</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="empty-table-cell">
                  Loading exams from School Management API...
                </td>
              </tr>
            ) : exams.length === 0 ? (
              <tr>
                <td colSpan={5} className="empty-table-cell">
                  No exams found.
                </td>
              </tr>
            ) : (
              exams.map((exam) => (
                <tr key={exam.id}>
                  <td>{exam.name}</td>
                  <td>{exam.class_name}</td>
                  <td>{exam.subject}</td>
                  <td>{exam.date}</td>
                  <td>{exam.max_marks}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </section>
  );
}
