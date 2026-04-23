import React from 'react';
import { s } from '../styles/theme';
import { PageHeader, Card } from '../components/UI';
import { DB } from '../db';

export default function StudentPortal({ user, onLogout }) {
  const myCourses = DB.courses.filter(c => c.students.includes(user.id));

  return (
    <div style={s.shell}>
      <aside style={s.sidebar}>
        <div style={{ padding: '30px 20px', textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#2563eb' }}>LankaLearn</h2>
        </div>
        <nav style={{ flex: 1, paddingTop: '20px' }}>
          <div style={s.navItem}>📚 My Courses</div>
          <div style={s.navItem}>📝 Assignments</div>
          <div style={s.navItem}>📊 Gradebook</div>
        </nav>
        <div style={{ padding: '20px', borderTop: '1px solid #e2e8f0' }}>
          <button onClick={onLogout} style={{ ...s.btnDanger, width: '100%' }}>Sign Out</button>
        </div>
      </aside>
      <main style={s.main}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <PageHeader title={`Welcome, ${user.name}`} sub={`Viewing Student Dashboard for ${user.course}`} />
          <div style={s.grid}>
            {myCourses.map(c => (
              <Card key={c.id} title={c.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '600' }}>{c.code}</span>
                  <span style={{ color: '#2563eb', fontSize: '12px', fontWeight: 'bold' }}>{c.credits} CREDITS</span>
                </div>
                <p style={{ marginTop: '12px', fontSize: '14px', color: '#64748b' }}>{c.description}</p>
                <button style={{ ...s.btn, width: '100%', marginTop: '20px', background: '#f1f5f9', color: '#2563eb' }}>View Materials</button>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}