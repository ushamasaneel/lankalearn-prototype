import React, { useState } from 'react';
import { s } from '../styles/theme';
import { DB } from '../db';

export default function StudentPortal({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Filter subjects for the student
  const subjects = DB.courses;

  const handleUpload = (courseName) => {
    const fileName = prompt(`Upload work for ${courseName}:`, "lesson_notes.pdf");
    if (fileName) {
      DB.submissions.push({
        id: Date.now(),
        student: user.name,
        course: courseName,
        file: fileName,
        date: new Date().toLocaleDateString()
      });
      alert("Success! Your teacher can now review this.");
    }
  };

  return (
    <div style={s.shell}>
      {/* SIDEBAR */}
      <aside style={s.sidebar}>
        <div style={{ padding: "30px 24px" }}>
          <h2 style={{ color: "#2563eb", fontWeight: "800", margin: 0 }}>LankaLearn</h2>
          <span style={{ fontSize: "12px", color: "#94a3b8" }}>STUDENT PORTAL</span>
        </div>
        
        <nav style={{ flex: 1 }}>
          <button onClick={() => { setActiveTab("dashboard"); setSelectedCourse(null); }} 
                  style={{ ...s.navBtn, ...(activeTab === "dashboard" ? s.navBtnActive : {}) }}>🏠 Dashboard</button>
          <button onClick={() => { setActiveTab("assignments"); setSelectedCourse(null); }} 
                  style={{ ...s.navBtn, ...(activeTab === "assignments" ? s.navBtnActive : {}) }}>📝 Assignments</button>
        </nav>

        <div style={{ padding: "24px", borderTop: "1px solid #e2e8f0" }}>
          <button onClick={onLogout} style={{ width: "100%", padding: "10px", background: "#fee2e2", color: "#ef4444", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}>Sign Out</button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main style={s.main}>
        {!selectedCourse ? (
          <>
            <h1 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "8px" }}>Enrolled Courses</h1>
            <p style={{ color: "#64748b", marginBottom: "32px" }}>Select a subject to view materials and upload work.</p>
            
            <div style={s.grid}>
              {subjects.map(c => (
                <div key={c.id} style={s.courseCard} onClick={() => setSelectedCourse(c)}>
                  <div>
                    <h3 style={{ fontSize: "18px", margin: "0 0 10px 0", color: "#1e293b" }}>{c.name}</h3>
                    <span style={{ background: "#f1f5f9", padding: "4px 8px", borderRadius: "6px", fontSize: "12px", color: "#475569" }}>{c.code}</span>
                  </div>
                  <div style={{ marginTop: "20px", color: "#2563eb", fontWeight: "600", fontSize: "14px" }}>
                    Enter Course →
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* COURSE DETAIL VIEW */
          <div>
            <button onClick={() => setSelectedCourse(null)} style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer", marginBottom: "20px", padding: 0 }}>← Back to Dashboard</button>
            <h1 style={{ fontSize: "32px", fontWeight: "800" }}>{selectedCourse.name}</h1>
            <p style={{ color: "#64748b", marginBottom: "40px" }}>Course Materials & Submissions</p>

            <div style={{ background: "white", padding: "30px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
              <h3 style={{ marginBottom: "20px" }}>Submit Your Work</h3>
              <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "20px" }}>Upload your completed assignments or lesson notes for teacher review.</p>
              <button onClick={() => handleUpload(selectedCourse.name)} style={s.btnPrimary}>Upload Document</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}