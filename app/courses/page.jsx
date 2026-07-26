// Placeholder for Course Management UI

export default function CoursesPage() {
  return (
    <section className="view">
      <div className="section-toolbar">
        <div>
          <h2>Course Management</h2>
          <span>Coming soon</span>
        </div>
      </div>
      <section className="panel" style={{ padding: '40px', textAlign: 'center' }}>
        <p style={{ fontSize: '48px', margin: '0 0 16px' }}>📚</p>
        <h2 style={{ marginBottom: '8px' }}>Course Management</h2>
        <p style={{ color: 'var(--muted)' }}>
          Manage courses, chapters, and topics for each class.
        </p>
        <p style={{ color: 'var(--muted)', fontStyle: 'italic', marginTop: '24px' }}>
          This module is under development.
        </p>
      </section>
    </section>
  );
}