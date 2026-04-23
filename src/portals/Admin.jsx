import React from 'react';
import { s } from '../styles/theme';
import { PageHeader, Card } from '../components/UI';
import { DB } from '../db';

export default function AdminPortal({ user, onLogout }) {
  return (
    <div style={s.shell}>
      <aside style={s.sidebar}>
        <div style={{ padding: '20px', fontWeight: 'bold', fontSize: '20px', color: '#dc2626' }}>LankaLearn Admin</div>
        <div style={{ padding: '20px', borderTop: '1px solid #334155', marginTop: 'auto' }}>
          <button onClick={onLogout} style={{ ...s.btn, background: '#ef4444', width: '100%' }}>Logout</button>
        </div>
      </aside>
      <main style={s.main}>
        <PageHeader title="System Administration" sub="Platform-wide oversight and user management." />
        <div style={s.grid}>
          <Card title="User Statistics">
            <p>Total Users: {DB.users.length}</p>
            <p>Active Courses: {DB.courses.length}</p>
          </Card>
          <Card title="System Health">
            <p style={{ color: '#10b981' }}>● All Systems Operational</p>
          </Card>
        </div>
      </main>
    </div>
  );
}