import React from 'react';
import { s } from '../styles/theme';
import { DB } from '../db';

export default function TeacherPortal({ user, onLogout }) {
  return (
    <div style={s.shell}>
      <aside style={s.sidebar}>
         <div style={{ padding: "40px 24px" }}><h2 style={{ color: "#059669", fontWeight: "800" }}>Teacher View</h2></div>
         <button onClick={onLogout} style={{ margin: "24px", padding: "12px", background: "#ef4444", color: "white", border: "none", borderRadius: "8px" }}>Logout</button>
      </aside>

      <main style={s.main}>
        <h1 style={{ marginBottom: "20px" }}>Student Submissions</h1>
        <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: "12px", overflow: "hidden" }}>
          <thead>
            <tr style={{ background: "#f1f5f9", textAlign: "left" }}>
              <th style={{ padding: "16px" }}>Student</th>
              <th style={{ padding: "16px" }}>Subject</th>
              <th style={{ padding: "16px" }}>File</th>
              <th style={{ padding: "16px" }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {DB.submissions.map(sub => (
              <tr key={sub.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                <td style={{ padding: "16px" }}>{sub.student}</td>
                <td style={{ padding: "16px" }}>{sub.course}</td>
                <td style={{ padding: "16px", color: "#2563eb" }}>🔗 {sub.file}</td>
                <td style={{ padding: "16px" }}>{sub.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {DB.submissions.length === 0 && <p style={{ padding: "20px", color: "#64748b" }}>No uploads yet.</p>}
      </main>
    </div>
  );
}