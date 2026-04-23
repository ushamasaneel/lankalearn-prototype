import React, { useState } from 'react';
import { s } from '../styles/theme';
import { DB } from '../db';

export default function StudentPortal({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("courses");

  const handleUpload = (courseName) => {
    const fileName = prompt(`Upload document for ${courseName}:`, "assignment1.pdf");
    if (fileName) {
      DB.submissions.push({
        id: Date.now(),
        student: user.name,
        course: courseName,
        file: fileName,
        date: new Date().toLocaleDateString()
      });
      alert("Uploaded! Your teacher can now see this.");
    }
  };

  return (
    <div style={s.shell}>
      <aside style={s.sidebar}>
        <div style={{ padding: "40px 24px" }}><h2 style={{ color: "#2563eb", fontWeight: "800" }}>LankaLearn</h2></div>
        
        <button onClick={() => setActiveTab("courses")} style={{ ...s.navBtn, ...(activeTab === "courses" ? s.navBtnActive : {}) }}>📚 My Courses</button>
        <button onClick={() => setActiveTab("assignments")} style={{ ...s.navBtn, ...(activeTab === "assignments" ? s.navBtnActive : {}) }}>📝 Assignments</button>
        <button onClick={() => setActiveTab("grades")} style={{ ...s.navBtn, ...(activeTab === "grades" ? s.navBtnActive : {}) }}>📊 Gradebook</button>

        <div style={{ marginTop: "auto", padding: "24px" }}>
          <button onClick={onLogout} style={{ width: "100%", padding: "12px", background: "#fee2e2", color: "#ef4444", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}>Sign Out</button>
        </div>
      </aside>

      <main style={s.main}>
        <h1 style={{ fontSize: "32px", fontWeight: "800", marginBottom: "8px" }}>{activeTab.toUpperCase()}</h1>
        <p style={{ color: "#64748b", marginBottom: "32px" }}>LankaLearn • {user.name}</p>

        {activeTab === "courses" && (
          <div style={s.grid}>
            {DB.courses.map(c => (
              <div key={c.id} style={{ background: "white", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                <h3 style={{ fontSize: "20px", marginBottom: "8px" }}>{c.name}</h3>
                <p style={{ color: "#64748b", fontSize: "14px" }}>Subject Code: {c.code}</p>
                <div style={s.uploadBox}>
                   <button onClick={() => handleUpload(c.name)} style={{ background: "#2563eb", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer" }}>Upload Work</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}