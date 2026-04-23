import React from 'react';
import { s } from '../styles/theme';
import { PageHeader, Card } from '../components/UI';
import { DB } from '../db';

export default function StudentPortal({ user, onLogout }) {
  const myCourses = DB.courses.filter(c => c.students.includes(user.id));

  return (
    <div style={s.shell}>
      <aside style={s.sidebar}>
        <div style={{ padding: '20px', fontWeight: 'bold', fontSize: '20px' }}>LankaLearn</div>
        <div style={{ padding: '20px', borderTop: '1px solid #334155', marginTop: 'auto' }}>
          <button onClick={onLogout} style={{ ...s.btn, background: '#ef4444', width: '100%' }}>Logout</button>
        </div>
      </aside>
      <main style={s.main}>
        <PageHeader title={`Ayubowan, ${user.name}!`} sub="Welcome to your digital classroom." />
        <div style={s.grid}>
          {myCourses.map(c => (
            <Card key={c.id} title={c.name}>
              <p style={{ color: '#94a3b8' }}>{c.code} • {c.credits} Credits</p>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}