import React from 'react';
import { s } from '../styles/theme';
import { PageHeader, Card } from '../components/UI';
import { DB } from '../db';

export default function TeacherPortal({ user, onLogout }) {
  const teacherCourses = DB.courses.filter(c => c.teacher === user.id);

  return (
    <div style={s.shell}>
      <aside style={s.sidebar}>
        <div style={{ padding: '20px', fontWeight: 'bold', fontSize: '20px', color: '#059669' }}>LankaLearn</div>
        <nav style={{ flex: 1, padding: '10px' }}>
          <div style={{ color: '#059669', fontSize: '12px', fontWeight: 'bold', padding: '10px' }}>TEACHER MENU</div>
        </nav>
        <div style={{ padding: '20px', borderTop: '1px solid #334155' }}>
          <button onClick={onLogout} style={{ ...s.btn, background: '#ef4444', width: '100%' }}>Logout</button>
        </div>
      </aside>
      <main style={s.main}>
        <PageHeader title={`Welcome, ${user.name}`} sub="Manage your courses and grade students." />
        <div style={s.grid}>
          {teacherCourses.map(c => (
            <Card key={c.id} title={c.name}>
              <p style={{ color: '#94a3b8' }}>{c.code} • {c.students.length} Students Enrolled</p>
              <button style={{ ...s.btn, marginTop: '10px', fontSize: '12px', padding: '8px' }}>Manage Course</button>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}