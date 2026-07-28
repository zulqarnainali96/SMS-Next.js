'use client';

import { useEffect, useState } from 'react';

export default function FeesPage() {
  const [records, setRecords] = useState([]);
  const [structures, setStructures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFees = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/fees');
        const json = await res.json();
        if (json.ok) {
          setRecords(json.data.records || []);
          setStructures(json.data.structures || []);
        } else {
          setError(json.error || 'Failed to load fee data.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFees();
  }, []);

  return (
    <section className="view">
      <div className="section-toolbar">
        <div>
          <h2>Fee Management</h2>
          <span>{records.length} records · {structures.length} structures</span>
        </div>
      </div>

      {error && <p className="message error">{error}</p>}

      <div className="two-column">
        <section className="panel">
          <div className="panel-heading">
            <h2>Fee Structures</h2>
          </div>
          <ul className="compact-list">
            {loading ? (
              <li style={{ color: 'var(--muted)' }}>Loading fee structures...</li>
            ) : structures.length === 0 ? (
              <li style={{ color: 'var(--muted)' }}>No fee structures found.</li>
            ) : (
              structures.map((structure) => (
                <li key={structure.id}>
                  <span>{structure.name}</span>
                  <small>{structure.amount}</small>
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="panel">
          <div className="panel-heading">
            <h2>Fee Records</h2>
          </div>
          <ul className="compact-list">
            {loading ? (
              <li style={{ color: 'var(--muted)' }}>Loading fee records...</li>
            ) : records.length === 0 ? (
              <li style={{ color: 'var(--muted)' }}>No fee records found.</li>
            ) : (
              records.map((record) => (
                <li key={record.id}>
                  <span>{record.student_name}</span>
                  <small>
                    {record.status} · {record.amount_paid} · due {record.due_date}
                  </small>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>
    </section>
  );
}
