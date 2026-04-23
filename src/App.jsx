import { useState, useEffect, useRef } from "react";

// ── MOCK DATABASE (in-memory backend) ───────────────────────────────────────
const DB = {
  users: [
    { id: 1, name: "Nimal Perera",    email: "nimal@student.lk",  password: "student123", role: "student",  avatar: "NP", course: "Computer Science" },
    { id: 2, name: "Kamala Silva",    email: "kamala@student.lk", password: "student123", role: "student",  avatar: "KS", course: "Information Technology" },
    { id: 3, name: "Dr. Suresh Fernando", email: "suresh@teacher.lk", password: "teacher123", role: "teacher", avatar: "SF", subject: "Programming Fundamentals" },
    { id: 4, name: "Ms. Dilini Jayawardena", email: "dilini@teacher.lk", password: "teacher123", role: "teacher", avatar: "DJ", subject: "Database Systems" },
    { id: 5, name: "Admin Wickrama", email: "admin@edu.lk", password: "admin123", role: "admin", avatar: "AW" },
  ],
  courses: [
    { id: 1, code: "CS101", name: "Programming Fundamentals", teacher: 3, students: [1, 2], credits: 3, description: "Introduction to programming using Python" },
    { id: 2, code: "IT201", name: "Database Systems", teacher: 4, students: [1], credits: 3, description: "Relational databases and SQL" },
    { id: 3, code: "CS202", name: "Data Structures", teacher: 3, students: [2], credits: 3, description: "Arrays, linked lists, trees and graphs" },
  ],
  materials: [
    { id: 1, courseId: 1, title: "Week 1 - Python Basics", type: "pdf", uploadedBy: 3, date: "2025-01-15", size: "2.4 MB", description: "Variables, data types, and operators" },
    { id: 2, courseId: 1, title: "Week 2 - Control Flow", type: "pdf", uploadedBy: 3, date: "2025-01-22", size: "1.8 MB", description: "If statements, loops, and functions" },
    { id: 3, courseId: 1, title: "Python Crash Course Slides", type: "ppt", uploadedBy: 3, date: "2025-01-10", size: "5.1 MB", description: "Presentation slides for lectures 1-4" },
    { id: 4, courseId: 2, title: "Database Design Principles", type: "pdf", uploadedBy: 4, date: "2025-01-18", size: "3.2 MB", description: "ER diagrams and normalization" },
  ],
  assignments: [
    { id: 1, courseId: 1, title: "Python Calculator", description: "Build a simple calculator using Python. Must support +, -, *, / operations and handle errors gracefully.", dueDate: "2025-02-10", points: 100, type: "code", teacherId: 3 },
    { id: 2, courseId: 1, title: "FizzBuzz Challenge", description: "Solve the classic FizzBuzz problem with extended requirements.", dueDate: "2025-02-20", points: 50, type: "code", teacherId: 3 },
    { id: 3, courseId: 2, title: "ER Diagram Assignment", description: "Design an ER diagram for a university library system.", dueDate: "2025-02-15", points: 80, type: "document", teacherId: 4 },
  ],
  submissions: [
    { id: 1, assignmentId: 1, studentId: 1, content: "# My Calculator\ndef add(a,b): return a+b\n# Works great!", submittedAt: "2025-02-08", grade: 92, feedback: "Excellent work! Clean code structure.", status: "graded" },
  ],
  announcements: [
    { id: 1, courseId: 1, title: "Midterm Exam Schedule", content: "The midterm exam will be held on March 5th from 9:00 AM - 11:00 AM in Hall B.", teacherId: 3, date: "2025-01-30", important: true },
    { id: 2, courseId: null, title: "System Maintenance", content: "EduLanka will undergo scheduled maintenance on Sunday 2:00 AM - 4:00 AM.", teacherId: null, isAdmin: true, date: "2025-01-28", important: false },
  ],
};

let nextId = { materials: 5, assignments: 4, submissions: 2, announcements: 3, courses: 4 };

// ── HELPER ──────────────────────────────────────────────────────────────────
const typeIcon = { pdf: "📄", ppt: "📊", doc: "📝", video: "🎬", code: "💻", document: "📝" };
const gradeColor = g => g >= 90 ? "#10b981" : g >= 70 ? "#3b82f6" : g >= 50 ? "#f59e0b" : "#ef4444";

// ── CLAUDE AI HELPER ─────────────────────────────────────────────────────────
async function askClaude(prompt, systemPrompt) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt || "You are EduBot, a helpful AI tutor for Sri Lankan students. Be concise, friendly, and encouraging. Give practical examples.",
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await res.json();
  return data.content?.[0]?.text || "Sorry, I couldn't process that right now.";
}

// ── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("login");

  const login = (email, password) => {
    const found = DB.users.find(u => u.email === email && u.password === password);
    if (found) { setUser(found); setPage("dashboard"); return true; }
    return false;
  };
  const logout = () => { setUser(null); setPage("login"); };

  if (!user) return <Login onLogin={login} />;
  if (user.role === "student") return <StudentPortal user={user} onLogout={logout} />;
  if (user.role === "teacher") return <TeacherPortal user={user} onLogout={logout} />;
  if (user.role === "admin")   return <AdminPortal user={user} onLogout={logout} />;
}

// ── LOGIN ─────────────────────────────────────────────────────────────────────
function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const demo = (e, p) => { setEmail(e); setPass(p); };
  const submit = () => {
    setLoading(true);
    setTimeout(() => {
      if (!onLogin(email, pass)) setError("Invalid credentials. Try a demo account.");
      setLoading(false);
    }, 600);
  };

  return (
    <div style={s.loginWrap}>
      <div style={s.loginCard}>
        <div style={s.loginLogo}>
          <span style={s.logoIcon}>🎓</span>
          <h1 style={s.logoText}>EduLanka</h1>
          <p style={s.logoSub}>Smart Education Platform</p>
        </div>

        <div style={s.field}>
          <label style={s.label}>Email Address</label>
          <input style={s.input} value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.lk" onKeyDown={e => e.key === "Enter" && submit()} />
        </div>
        <div style={s.field}>
          <label style={s.label}>Password</label>
          <input style={s.input} type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === "Enter" && submit()} />
        </div>
        {error && <p style={s.error}>{error}</p>}
        <button style={s.btn} onClick={submit} disabled={loading}>
          {loading ? "Signing in…" : "Sign In →"}
        </button>

        <div style={s.demoSection}>
          <p style={s.demoTitle}>🚀 Try Demo Accounts</p>
          <div style={s.demoGrid}>
            {[
              { label: "👨‍🎓 Student", e: "nimal@student.lk", p: "student123" },
              { label: "👩‍🏫 Teacher", e: "suresh@teacher.lk", p: "teacher123" },
              { label: "🔧 Admin",   e: "admin@edu.lk",      p: "admin123" },
            ].map(d => (
              <button key={d.label} style={s.demoBtn} onClick={() => { demo(d.e, d.p); setError(""); }}>
                {d.label}
              </button>
            ))}
          </div>
        </div>
        <p style={s.footer}>EduLanka © 2025 · Empowering Sri Lankan Students</p>
      </div>
    </div>
  );
}

// ── SHELL ─────────────────────────────────────────────────────────────────────
function Shell({ user, onLogout, nav, active, setActive, children }) {
  const roleColors = { student: "#6366f1", teacher: "#059669", admin: "#dc2626" };
  const color = roleColors[user.role];

  return (
    <div style={s.shell}>
      <aside style={{ ...s.sidebar, borderRight: `3px solid ${color}` }}>
        <div style={s.sideTop}>
          <div style={{ ...s.sideLogoWrap, background: color }}>
            <span style={{ fontSize: 22 }}>🎓</span>
            <span style={s.sideLogo}>EduLanka</span>
          </div>
          <div style={s.sideUser}>
            <div style={{ ...s.avatar, background: color }}>{user.avatar}</div>
            <div>
              <div style={s.sideUserName}>{user.name}</div>
              <div style={{ ...s.sideUserRole, color }}>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</div>
            </div>
          </div>
        </div>
        <nav style={s.nav}>
          {nav.map(n => (
            <button key={n.id} style={{ ...s.navBtn, ...(active === n.id ? { ...s.navBtnActive, background: color + "20", color, borderLeft: `3px solid ${color}` } : {}) }}
              onClick={() => setActive(n.id)}>
              <span style={s.navIcon}>{n.icon}</span>
              {n.label}
            </button>
          ))}
        </nav>
        <button style={s.logoutBtn} onClick={onLogout}>← Sign Out</button>
      </aside>
      <main style={s.main}>{children}</main>
    </div>
  );
}

// ── STUDENT PORTAL ────────────────────────────────────────────────────────────
function StudentPortal({ user, onLogout }) {
  const [active, setActive] = useState("dashboard");
  const nav = [
    { id: "dashboard", icon: "🏠", label: "Dashboard" },
    { id: "courses", icon: "📚", label: "My Courses" },
    { id: "assignments", icon: "📝", label: "Assignments" },
    { id: "grades", icon: "📊", label: "Grades" },
    { id: "announcements", icon: "📢", label: "Announcements" },
    { id: "ai", icon: "🤖", label: "AI Tutor" },
  ];

  const myCourses = DB.courses.filter(c => c.students.includes(user.id));
  const myAssignments = DB.assignments.filter(a => myCourses.some(c => c.id === a.courseId));
  const mySubmissions = DB.submissions.filter(s => s.studentId === user.id);
  const pending = myAssignments.filter(a => !mySubmissions.some(s => s.assignmentId === a.id));

  return (
    <Shell user={user} onLogout={onLogout} nav={nav} active={active} setActive={setActive}>
      {active === "dashboard" && <StudentDash user={user} courses={myCourses} pending={pending} submissions={mySubmissions} setActive={setActive} />}
      {active === "courses" && <StudentCourses user={user} courses={myCourses} />}
      {active === "assignments" && <StudentAssignments user={user} assignments={myAssignments} submissions={mySubmissions} courses={myCourses} />}
      {active === "grades" && <StudentGrades assignments={myAssignments} submissions={mySubmissions} courses={myCourses} />}
      {active === "announcements" && <Announcements user={user} />}
      {active === "ai" && <AITutor user={user} />}
    </Shell>
  );
}

function StudentDash({ user, courses, pending, submissions, setActive }) {
  const graded = submissions.filter(s => s.status === "graded");
  const avg = graded.length ? Math.round(graded.reduce((a, s) => a + s.grade, 0) / graded.length) : null;

  return (
    <div style={s.page}>
      <h2 style={s.pageTitle}>Welcome back, {user.name.split(" ")[0]}! 👋</h2>
      <p style={s.pageSub}>Here's your learning summary for today.</p>

      <div style={s.statsRow}>
        {[
          { label: "Enrolled Courses", val: courses.length, icon: "📚", color: "#6366f1" },
          { label: "Pending Tasks", val: pending.length, icon: "⏳", color: "#f59e0b" },
          { label: "Submitted", val: submissions.length, icon: "✅", color: "#10b981" },
          { label: "Avg Grade", val: avg ? avg + "%" : "N/A", icon: "🏆", color: "#3b82f6" },
        ].map(stat => (
          <div key={stat.label} style={{ ...s.statCard, borderTop: `4px solid ${stat.color}` }}>
            <span style={{ fontSize: 28 }}>{stat.icon}</span>
            <div style={{ ...s.statVal, color: stat.color }}>{stat.val}</div>
            <div style={s.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={s.twoCol}>
        <div style={s.card}>
          <h3 style={s.cardTitle}>📅 Upcoming Deadlines</h3>
          {pending.length === 0 ? <p style={s.empty}>🎉 All caught up!</p> : pending.slice(0,3).map(a => (
            <div key={a.id} style={s.listItem}>
              <span style={s.listDot}>●</span>
              <div><div style={s.listTitle}>{a.title}</div><div style={s.listSub}>Due {a.dueDate} · {a.points} pts</div></div>
            </div>
          ))}
          <button style={s.linkBtn} onClick={() => {}}>View all assignments →</button>
        </div>
        <div style={s.card}>
          <h3 style={s.cardTitle}>📚 My Courses</h3>
          {courses.map(c => {
            const teacher = DB.users.find(u => u.id === c.teacher);
            return (
              <div key={c.id} style={s.listItem}>
                <span style={{ fontSize: 28 }}>📗</span>
                <div><div style={s.listTitle}>{c.name}</div><div style={s.listSub}>{c.code} · {teacher?.name}</div></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StudentCourses({ user, courses }) {
  const [selected, setSelected] = useState(null);

  if (selected) {
    const course = courses.find(c => c.id === selected);
    const teacher = DB.users.find(u => u.id === course.teacher);
    const materials = DB.materials.filter(m => m.courseId === selected);
    return (
      <div style={s.page}>
        <button style={s.backBtn} onClick={() => setSelected(null)}>← Back to Courses</button>
        <h2 style={s.pageTitle}>{course.name}</h2>
        <p style={s.pageSub}>{course.code} · {course.credits} Credits · {teacher?.name}</p>
        <p style={{ ...s.pageSub, marginTop: 8 }}>{course.description}</p>

        <h3 style={{ ...s.cardTitle, marginTop: 24 }}>📁 Course Materials</h3>
        {materials.length === 0 ? <p style={s.empty}>No materials uploaded yet.</p> : (
          <div style={s.materialGrid}>
            {materials.map(m => (
              <div key={m.id} style={s.materialCard}>
                <span style={{ fontSize: 36 }}>{typeIcon[m.type] || "📄"}</span>
                <div style={s.materialTitle}>{m.title}</div>
                <div style={s.materialMeta}>{m.description}</div>
                <div style={s.materialMeta}>{m.date} · {m.size}</div>
                <button style={s.dlBtn}>⬇ Download</button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={s.page}>
      <h2 style={s.pageTitle}>My Courses</h2>
      <p style={s.pageSub}>You are enrolled in {courses.length} course(s) this semester.</p>
      <div style={s.courseGrid}>
        {courses.map(c => {
          const teacher = DB.users.find(u => u.id === c.teacher);
          const mats = DB.materials.filter(m => m.courseId === c.id).length;
          const asgs = DB.assignments.filter(a => a.courseId === c.id).length;
          return (
            <div key={c.id} style={s.courseCard} onClick={() => setSelected(c.id)}>
              <div style={s.courseHeader}><span style={{ fontSize: 32 }}>📗</span><span style={s.courseCode}>{c.code}</span></div>
              <div style={s.courseName}>{c.name}</div>
              <div style={s.courseTeacher}>👩‍🏫 {teacher?.name}</div>
              <div style={s.courseStats}>
                <span>📁 {mats} materials</span>
                <span>📝 {asgs} assignments</span>
              </div>
              <div style={s.courseFooter}>{c.credits} Credits · Click to view →</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StudentAssignments({ user, assignments, submissions, courses }) {
  const [selected, setSelected] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [text, setText] = useState("");
  const [msg, setMsg] = useState("");

  const submit = (asgId) => {
    if (!text.trim()) { setMsg("Please write your answer before submitting."); return; }
    const sub = { id: nextId.submissions++, assignmentId: asgId, studentId: user.id, content: text, submittedAt: new Date().toISOString().split("T")[0], grade: null, feedback: null, status: "submitted" };
    DB.submissions.push(sub);
    setMsg("✅ Assignment submitted successfully!"); setText(""); setSubmitting(false);
    setTimeout(() => { setSelected(null); setMsg(""); }, 1500);
  };

  if (selected) {
    const a = assignments.find(x => x.id === selected);
    const sub = submissions.find(s => s.assignmentId === selected);
    const course = courses.find(c => c.id === a.courseId);

    return (
      <div style={s.page}>
        <button style={s.backBtn} onClick={() => { setSelected(null); setSubmitting(false); setText(""); setMsg(""); }}>← Back</button>
        <h2 style={s.pageTitle}>{a.title}</h2>
        <div style={s.asgMeta}><span>📚 {course?.name}</span><span>📅 Due: {a.dueDate}</span><span>🏆 {a.points} pts</span></div>
        <div style={s.card}>
          <h3 style={s.cardTitle}>📋 Instructions</h3>
          <p style={{ color: "#e2e8f0", lineHeight: 1.7 }}>{a.description}</p>
        </div>
        {sub ? (
          <div style={{ ...s.card, borderLeft: "4px solid #10b981" }}>
            <h3 style={{ ...s.cardTitle, color: "#10b981" }}>✅ Submitted</h3>
            <p style={{ color: "#94a3b8" }}>Submitted on {sub.submittedAt}</p>
            <pre style={s.codeBox}>{sub.content}</pre>
            {sub.status === "graded" && (
              <div style={s.gradeBox}>
                <div style={{ color: gradeColor(sub.grade), fontSize: 28, fontWeight: 700 }}>{sub.grade}/{a.points}</div>
                <div style={{ color: "#cbd5e1" }}>📝 {sub.feedback}</div>
              </div>
            )}
          </div>
        ) : submitting ? (
          <div style={s.card}>
            <h3 style={s.cardTitle}>✍️ Your Submission</h3>
            <textarea style={s.textarea} value={text} onChange={e => setText(e.target.value)} placeholder={a.type === "code" ? "# Paste or write your code here..." : "Type your answer here..."} rows={10} />
            {msg && <p style={s.success}>{msg}</p>}
            <div style={s.btnRow}>
              <button style={s.btn} onClick={() => submit(a.id)}>Submit Assignment</button>
              <button style={s.btnGhost} onClick={() => setSubmitting(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <button style={{ ...s.btn, marginTop: 16 }} onClick={() => setSubmitting(true)}>✍️ Start Submission</button>
        )}
      </div>
    );
  }

  const pending = assignments.filter(a => !submissions.some(s => s.assignmentId === a.id));
  const done = assignments.filter(a => submissions.some(s => s.assignmentId === a.id));

  return (
    <div style={s.page}>
      <h2 style={s.pageTitle}>Assignments</h2>
      <h3 style={s.sectionTitle}>⏳ Pending ({pending.length})</h3>
      {pending.length === 0 ? <p style={s.empty}>All done! 🎉</p> : pending.map(a => {
        const course = courses.find(c => c.id === a.courseId);
        return (
          <div key={a.id} style={{ ...s.asgCard, borderLeft: "4px solid #f59e0b" }} onClick={() => setSelected(a.id)}>
            <div style={s.asgTitle}>{a.title}</div>
            <div style={s.asgMeta2}><span>📚 {course?.code}</span><span>📅 {a.dueDate}</span><span>🏆 {a.points} pts</span></div>
          </div>
        );
      })}
      <h3 style={{ ...s.sectionTitle, marginTop: 32 }}>✅ Submitted ({done.length})</h3>
      {done.map(a => {
        const sub = submissions.find(s => s.assignmentId === a.id);
        const course = courses.find(c => c.id === a.courseId);
        return (
          <div key={a.id} style={{ ...s.asgCard, borderLeft: "4px solid #10b981" }} onClick={() => setSelected(a.id)}>
            <div style={s.asgTitle}>{a.title}</div>
            <div style={s.asgMeta2}>
              <span>📚 {course?.code}</span>
              <span>{sub?.status === "graded" ? `🏆 ${sub.grade}/${a.points}` : "⌛ Awaiting grade"}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StudentGrades({ assignments, submissions, courses }) {
  const graded = submissions.filter(s => s.status === "graded");
  const avg = graded.length ? Math.round(graded.reduce((a, s) => a + s.grade, 0) / graded.length) : null;

  return (
    <div style={s.page}>
      <h2 style={s.pageTitle}>My Grades</h2>
      {avg && (
        <div style={{ ...s.card, textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 56, fontWeight: 800, color: gradeColor(avg) }}>{avg}%</div>
          <div style={{ color: "#94a3b8" }}>Overall Average</div>
        </div>
      )}
      {courses.map(course => {
        const courseAsgs = assignments.filter(a => a.courseId === course.id);
        return (
          <div key={course.id} style={{ ...s.card, marginBottom: 16 }}>
            <h3 style={s.cardTitle}>{course.code} — {course.name}</h3>
            {courseAsgs.map(a => {
              const sub = submissions.find(s => s.assignmentId === a.id);
              return (
                <div key={a.id} style={s.gradeRow}>
                  <span style={{ color: "#e2e8f0" }}>{a.title}</span>
                  <span style={{ color: sub?.status === "graded" ? gradeColor(sub.grade) : "#64748b", fontWeight: 600 }}>
                    {sub?.status === "graded" ? `${sub.grade}/${a.points}` : sub ? "Submitted" : "Not submitted"}
                  </span>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

// ── AI TUTOR ──────────────────────────────────────────────────────────────────
function AITutor({ user }) {
  const [msgs, setMsgs] = useState([
    { role: "ai", text: `Hi ${user.name.split(" ")[0]}! 👋 I'm EduBot, your personal AI tutor. Ask me anything about your courses, programming concepts, or study tips!` }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const q = input.trim();
    setInput("");
    setMsgs(m => [...m, { role: "user", text: q }]);
    setLoading(true);
    const answer = await askClaude(q, "You are EduBot, a helpful AI tutor for Sri Lankan university students. You help with programming, computer science, database systems, mathematics, and general study skills. Be friendly, concise, and give examples relevant to Sri Lankan context when helpful. Use emojis occasionally to keep things engaging.");
    setMsgs(m => [...m, { role: "ai", text: answer }]);
    setLoading(false);
  };

  return (
    <div style={s.page}>
      <h2 style={s.pageTitle}>🤖 AI Tutor — EduBot</h2>
      <p style={s.pageSub}>Ask me anything about your courses, concepts, or assignments!</p>
      <div style={s.chatBox}>
        {msgs.map((m, i) => (
          <div key={i} style={{ ...s.chatBubble, ...(m.role === "user" ? s.chatUser : s.chatAI) }}>
            {m.role === "ai" && <span style={s.chatAvatar}>🤖</span>}
            <div style={s.chatText}>{m.text}</div>
            {m.role === "user" && <span style={s.chatAvatar}>👤</span>}
          </div>
        ))}
        {loading && <div style={{ ...s.chatBubble, ...s.chatAI }}><span style={s.chatAvatar}>🤖</span><div style={s.chatText}>Thinking…</div></div>}
        <div ref={bottomRef} />
      </div>
      <div style={s.chatInput}>
        <input style={{ ...s.input, flex: 1 }} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Ask EduBot anything…" />
        <button style={{ ...s.btn, width: "auto", padding: "12px 20px" }} onClick={send} disabled={loading}>Send</button>
      </div>
    </div>
  );
}

// ── ANNOUNCEMENTS ─────────────────────────────────────────────────────────────
function Announcements({ user }) {
  const announcements = DB.announcements.filter(a => a.isAdmin || DB.courses.some(c => c.id === a.courseId && (user.role === "teacher" ? c.teacher === user.id : c.students?.includes(user.id))));

  return (
    <div style={s.page}>
      <h2 style={s.pageTitle}>📢 Announcements</h2>
      {announcements.length === 0 ? <p style={s.empty}>No announcements yet.</p> : announcements.map(a => (
        <div key={a.id} style={{ ...s.card, borderLeft: `4px solid ${a.important ? "#ef4444" : "#6366f1"}`, marginBottom: 16 }}>
          {a.important && <span style={s.importantBadge}>🔴 Important</span>}
          <h3 style={{ color: "#f1f5f9", marginBottom: 8 }}>{a.title}</h3>
          <p style={{ color: "#cbd5e1", lineHeight: 1.6 }}>{a.content}</p>
          <p style={{ color: "#64748b", fontSize: 13, marginTop: 8 }}>📅 {a.date}</p>
        </div>
      ))}
    </div>
  );
}

// ── TEACHER PORTAL ────────────────────────────────────────────────────────────
function TeacherPortal({ user, onLogout }) {
  const [active, setActive] = useState("dashboard");
  const nav = [
    { id: "dashboard", icon: "🏠", label: "Dashboard" },
    { id: "courses", icon: "📚", label: "My Courses" },
    { id: "materials", icon: "📁", label: "Upload Materials" },
    { id: "assignments", icon: "📝", label: "Assignments" },
    { id: "grading", icon: "✅", label: "Grading" },
    { id: "announcements", icon: "📢", label: "Announce" },
    { id: "ai", icon: "🤖", label: "AI Assistant" },
  ];

  const myCourses = DB.courses.filter(c => c.teacher === user.id);

  return (
    <Shell user={user} onLogout={onLogout} nav={nav} active={active} setActive={setActive}>
      {active === "dashboard" && <TeacherDash user={user} courses={myCourses} />}
      {active === "courses" && <TeacherCourses user={user} courses={myCourses} />}
      {active === "materials" && <TeacherUpload user={user} courses={myCourses} />}
      {active === "assignments" && <TeacherAssignments user={user} courses={myCourses} />}
      {active === "grading" && <TeacherGrading user={user} courses={myCourses} />}
      {active === "announcements" && <TeacherAnnounce user={user} courses={myCourses} />}
      {active === "ai" && <AITutor user={user} />}
    </Shell>
  );
}

function TeacherDash({ user, courses }) {
  const totalStudents = [...new Set(courses.flatMap(c => c.students))].length;
  const totalMats = DB.materials.filter(m => m.uploadedBy === user.id).length;
  const totalAsgs = DB.assignments.filter(a => a.teacherId === user.id).length;
  const pending = DB.submissions.filter(s => s.status === "submitted" && DB.assignments.some(a => a.id === s.assignmentId && a.teacherId === user.id)).length;

  return (
    <div style={s.page}>
      <h2 style={s.pageTitle}>Teacher Dashboard</h2>
      <p style={s.pageSub}>Hello, {user.name}! Here's your teaching overview.</p>
      <div style={s.statsRow}>
        {[
          { label: "My Courses", val: courses.length, icon: "📚", color: "#059669" },
          { label: "Total Students", val: totalStudents, icon: "👥", color: "#6366f1" },
          { label: "Materials Uploaded", val: totalMats, icon: "📁", color: "#3b82f6" },
          { label: "Pending Grading", val: pending, icon: "⏳", color: "#f59e0b" },
        ].map(stat => (
          <div key={stat.label} style={{ ...s.statCard, borderTop: `4px solid ${stat.color}` }}>
            <span style={{ fontSize: 28 }}>{stat.icon}</span>
            <div style={{ ...s.statVal, color: stat.color }}>{stat.val}</div>
            <div style={s.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>
      <div style={s.card}>
        <h3 style={s.cardTitle}>📚 My Courses</h3>
        {courses.map(c => (
          <div key={c.id} style={s.listItem}>
            <span style={{ fontSize: 28 }}>📗</span>
            <div>
              <div style={s.listTitle}>{c.name} <span style={s.badge}>{c.code}</span></div>
              <div style={s.listSub}>{c.students.length} students enrolled</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TeacherCourses({ user, courses }) {
  return (
    <div style={s.page}>
      <h2 style={s.pageTitle}>My Courses</h2>
      <div style={s.courseGrid}>
        {courses.map(c => (
          <div key={c.id} style={s.courseCard}>
            <div style={s.courseHeader}><span style={{ fontSize: 32 }}>📗</span><span style={s.courseCode}>{c.code}</span></div>
            <div style={s.courseName}>{c.name}</div>
            <div style={s.courseTeacher}>👥 {c.students.length} students</div>
            <div style={s.courseStats}>
              <span>📁 {DB.materials.filter(m => m.courseId === c.id).length} materials</span>
              <span>📝 {DB.assignments.filter(a => a.courseId === c.id).length} assignments</span>
            </div>
            <div style={s.courseFooter}>{c.credits} Credits</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TeacherUpload({ user, courses }) {
  const [form, setForm] = useState({ courseId: "", title: "", type: "pdf", description: "" });
  const [msg, setMsg] = useState("");

  const upload = () => {
    if (!form.courseId || !form.title) { setMsg("Please fill in all required fields."); return; }
    DB.materials.push({ id: nextId.materials++, courseId: +form.courseId, title: form.title, type: form.type, uploadedBy: user.id, date: new Date().toISOString().split("T")[0], size: "1.0 MB", description: form.description });
    setMsg("✅ Material uploaded successfully!"); setForm({ courseId: "", title: "", type: "pdf", description: "" });
    setTimeout(() => setMsg(""), 2000);
  };

  return (
    <div style={s.page}>
      <h2 style={s.pageTitle}>Upload Course Material</h2>
      <div style={s.card}>
        <div style={s.field}>
          <label style={s.label}>Course *</label>
          <select style={s.input} value={form.courseId} onChange={e => setForm({ ...form, courseId: e.target.value })}>
            <option value="">Select a course…</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.code} — {c.name}</option>)}
          </select>
        </div>
        <div style={s.field}>
          <label style={s.label}>Material Title *</label>
          <input style={s.input} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Week 3 - Functions" />
        </div>
        <div style={s.field}>
          <label style={s.label}>Type</label>
          <select style={s.input} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
            {["pdf", "ppt", "doc", "video", "code"].map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
          </select>
        </div>
        <div style={s.field}>
          <label style={s.label}>Description</label>
          <textarea style={s.textarea} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Brief description of this material…" />
        </div>
        <div style={{ ...s.field, border: "2px dashed #334155", borderRadius: 8, padding: "24px", textAlign: "center", color: "#64748b" }}>
          📎 Drag & drop file here or click to browse<br /><span style={{ fontSize: 12 }}>(PDF, PPT, DOC, MP4 — max 50MB)</span>
        </div>
        {msg && <p style={msg.startsWith("✅") ? s.success : s.error}>{msg}</p>}
        <button style={s.btn} onClick={upload}>⬆ Upload Material</button>
      </div>

      <h3 style={{ ...s.sectionTitle, marginTop: 32 }}>Recently Uploaded</h3>
      {DB.materials.filter(m => m.uploadedBy === user.id).slice(-5).reverse().map(m => (
        <div key={m.id} style={s.listItem}>
          <span style={{ fontSize: 28 }}>{typeIcon[m.type]}</span>
          <div>
            <div style={s.listTitle}>{m.title}</div>
            <div style={s.listSub}>{DB.courses.find(c => c.id === m.courseId)?.code} · {m.date} · {m.size}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TeacherAssignments({ user, courses }) {
  const [form, setForm] = useState({ courseId: "", title: "", description: "", dueDate: "", points: "", type: "document" });
  const [msg, setMsg] = useState("");

  const create = () => {
    if (!form.courseId || !form.title || !form.dueDate) { setMsg("Fill all required fields."); return; }
    DB.assignments.push({ id: nextId.assignments++, courseId: +form.courseId, title: form.title, description: form.description, dueDate: form.dueDate, points: +form.points || 100, type: form.type, teacherId: user.id });
    setMsg("✅ Assignment created!"); setForm({ courseId: "", title: "", description: "", dueDate: "", points: "", type: "document" });
    setTimeout(() => setMsg(""), 2000);
  };

  const myAssignments = DB.assignments.filter(a => a.teacherId === user.id);

  return (
    <div style={s.page}>
      <h2 style={s.pageTitle}>Create Assignment</h2>
      <div style={s.card}>
        <div style={s.twoCol2}>
          <div style={s.field}>
            <label style={s.label}>Course *</label>
            <select style={s.input} value={form.courseId} onChange={e => setForm({ ...form, courseId: e.target.value })}>
              <option value="">Select…</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.code}</option>)}
            </select>
          </div>
          <div style={s.field}>
            <label style={s.label}>Type</label>
            <select style={s.input} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
              <option value="document">Document</option><option value="code">Code</option><option value="quiz">Quiz</option>
            </select>
          </div>
        </div>
        <div style={s.field}>
          <label style={s.label}>Title *</label>
          <input style={s.input} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Assignment title" />
        </div>
        <div style={s.field}>
          <label style={s.label}>Instructions</label>
          <textarea style={s.textarea} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={4} placeholder="Describe the assignment in detail…" />
        </div>
        <div style={s.twoCol2}>
          <div style={s.field}>
            <label style={s.label}>Due Date *</label>
            <input style={s.input} type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
          </div>
          <div style={s.field}>
            <label style={s.label}>Total Points</label>
            <input style={s.input} type="number" value={form.points} onChange={e => setForm({ ...form, points: e.target.value })} placeholder="100" />
          </div>
        </div>
        {msg && <p style={msg.startsWith("✅") ? s.success : s.error}>{msg}</p>}
        <button style={s.btn} onClick={create}>📝 Create Assignment</button>
      </div>

      <h3 style={{ ...s.sectionTitle, marginTop: 32 }}>My Assignments</h3>
      {myAssignments.map(a => {
        const subs = DB.submissions.filter(s => s.assignmentId === a.id).length;
        return (
          <div key={a.id} style={s.asgCard}>
            <div style={s.asgTitle}>{a.title}</div>
            <div style={s.asgMeta2}><span>📚 {DB.courses.find(c => c.id === a.courseId)?.code}</span><span>📅 {a.dueDate}</span><span>📨 {subs} submission(s)</span></div>
          </div>
        );
      })}
    </div>
  );
}

function TeacherGrading({ user, courses }) {
  const [sel, setSel] = useState(null);
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");
  const [msg, setMsg] = useState("");

  const toGrade = DB.submissions.filter(s => s.status === "submitted" && DB.assignments.some(a => a.id === s.assignmentId && a.teacherId === user.id));

  const submitGrade = (sub) => {
    sub.grade = +grade; sub.feedback = feedback; sub.status = "graded";
    setMsg("✅ Grade saved!"); setSel(null); setGrade(""); setFeedback("");
    setTimeout(() => setMsg(""), 2000);
  };

  return (
    <div style={s.page}>
      <h2 style={s.pageTitle}>Grade Submissions</h2>
      {msg && <p style={s.success}>{msg}</p>}
      {toGrade.length === 0 ? <p style={s.empty}>🎉 No pending submissions to grade.</p> : toGrade.map(sub => {
        const asg = DB.assignments.find(a => a.id === sub.assignmentId);
        const student = DB.users.find(u => u.id === sub.studentId);
        return (
          <div key={sub.id} style={{ ...s.card, marginBottom: 16 }}>
            <div style={s.gradeRow}>
              <div>
                <div style={s.listTitle}>{asg?.title}</div>
                <div style={s.listSub}>👨‍🎓 {student?.name} · Submitted {sub.submittedAt}</div>
              </div>
              <button style={s.btn2} onClick={() => setSel(sel === sub.id ? null : sub.id)}>
                {sel === sub.id ? "Close" : "Grade"}
              </button>
            </div>
            {sel === sub.id && (
              <div style={{ marginTop: 16 }}>
                <pre style={s.codeBox}>{sub.content}</pre>
                <div style={s.twoCol2}>
                  <div style={s.field}>
                    <label style={s.label}>Grade (out of {asg?.points})</label>
                    <input style={s.input} type="number" value={grade} onChange={e => setGrade(e.target.value)} placeholder="e.g. 85" />
                  </div>
                  <div style={s.field}>
                    <label style={s.label}>Feedback</label>
                    <input style={s.input} value={feedback} onChange={e => setFeedback(e.target.value)} placeholder="Great work!" />
                  </div>
                </div>
                <button style={s.btn} onClick={() => submitGrade(sub)}>Save Grade</button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function TeacherAnnounce({ user, courses }) {
  const [form, setForm] = useState({ title: "", content: "", courseId: "", important: false });
  const [msg, setMsg] = useState("");

  const post = () => {
    if (!form.title || !form.content) { setMsg("Title and content required."); return; }
    DB.announcements.push({ id: nextId.announcements++, courseId: form.courseId ? +form.courseId : null, title: form.title, content: form.content, teacherId: user.id, date: new Date().toISOString().split("T")[0], important: form.important });
    setMsg("✅ Announcement posted!"); setForm({ title: "", content: "", courseId: "", important: false });
    setTimeout(() => setMsg(""), 2000);
  };

  return (
    <div style={s.page}>
      <h2 style={s.pageTitle}>Post Announcement</h2>
      <div style={s.card}>
        <div style={s.field}>
          <label style={s.label}>Course (leave blank for all)</label>
          <select style={s.input} value={form.courseId} onChange={e => setForm({ ...form, courseId: e.target.value })}>
            <option value="">All my courses</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div style={s.field}>
          <label style={s.label}>Title</label>
          <input style={s.input} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Announcement title" />
        </div>
        <div style={s.field}>
          <label style={s.label}>Message</label>
          <textarea style={s.textarea} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={4} placeholder="Write your announcement here…" />
        </div>
        <label style={{ color: "#94a3b8", display: "flex", gap: 8, alignItems: "center", cursor: "pointer" }}>
          <input type="checkbox" checked={form.important} onChange={e => setForm({ ...form, important: e.target.checked })} />
          Mark as important (shown in red)
        </label>
        {msg && <p style={msg.startsWith("✅") ? s.success : s.error}>{msg}</p>}
        <button style={{ ...s.btn, marginTop: 16 }} onClick={post}>📢 Post Announcement</button>
      </div>
    </div>
  );
}

// ── ADMIN PORTAL ──────────────────────────────────────────────────────────────
function AdminPortal({ user, onLogout }) {
  const [active, setActive] = useState("dashboard");
  const nav = [
    { id: "dashboard", icon: "🏠", label: "Dashboard" },
    { id: "users", icon: "👥", label: "Manage Users" },
    { id: "courses", icon: "📚", label: "Manage Courses" },
    { id: "announcements", icon: "📢", label: "Announcements" },
    { id: "reports", icon: "📊", label: "Reports" },
    { id: "ai", icon: "🤖", label: "AI Assistant" },
  ];

  return (
    <Shell user={user} onLogout={onLogout} nav={nav} active={active} setActive={setActive}>
      {active === "dashboard" && <AdminDash />}
      {active === "users" && <AdminUsers />}
      {active === "courses" && <AdminCourses />}
      {active === "announcements" && <AdminAnnounce user={user} />}
      {active === "reports" && <AdminReports />}
      {active === "ai" && <AITutor user={user} />}
    </Shell>
  );
}

function AdminDash() {
  const students = DB.users.filter(u => u.role === "student").length;
  const teachers = DB.users.filter(u => u.role === "teacher").length;
  return (
    <div style={s.page}>
      <h2 style={s.pageTitle}>Admin Dashboard</h2>
      <p style={s.pageSub}>EduLanka Platform Overview</p>
      <div style={s.statsRow}>
        {[
          { label: "Total Students", val: students, icon: "👨‍🎓", color: "#6366f1" },
          { label: "Teachers", val: teachers, icon: "👩‍🏫", color: "#059669" },
          { label: "Active Courses", val: DB.courses.length, icon: "📚", color: "#3b82f6" },
          { label: "Total Submissions", val: DB.submissions.length, icon: "📝", color: "#f59e0b" },
        ].map(stat => (
          <div key={stat.label} style={{ ...s.statCard, borderTop: `4px solid ${stat.color}` }}>
            <span style={{ fontSize: 28 }}>{stat.icon}</span>
            <div style={{ ...s.statVal, color: stat.color }}>{stat.val}</div>
            <div style={s.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>
      <div style={s.card}>
        <h3 style={s.cardTitle}>🏫 Platform Health</h3>
        {[["Active Users", `${DB.users.length} / ${DB.users.length}`,"#10b981"], ["Course Materials", `${DB.materials.length} files uploaded`, "#3b82f6"], ["Assignments", `${DB.assignments.length} created`, "#6366f1"], ["System Status", "All systems operational ✅", "#10b981"]].map(([k,v,c]) => (
          <div key={k} style={s.gradeRow}><span style={{ color: "#94a3b8" }}>{k}</span><span style={{ color: c, fontWeight: 600 }}>{v}</span></div>
        ))}
      </div>
    </div>
  );
}

function AdminUsers() {
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "student" });
  const [msg, setMsg] = useState("");

  const add = () => {
    if (!newUser.name || !newUser.email) { setMsg("Name and email required."); return; }
    DB.users.push({ id: DB.users.length + 10, ...newUser, avatar: newUser.name.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase() });
    setMsg("✅ User added!"); setNewUser({ name: "", email: "", password: "", role: "student" });
    setTimeout(() => setMsg(""), 2000);
  };

  return (
    <div style={s.page}>
      <h2 style={s.pageTitle}>Manage Users</h2>
      <div style={s.card}>
        <h3 style={s.cardTitle}>➕ Add New User</h3>
        <div style={s.twoCol2}>
          <div style={s.field}><label style={s.label}>Full Name</label><input style={s.input} value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} placeholder="Full name" /></div>
          <div style={s.field}><label style={s.label}>Email</label><input style={s.input} value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} placeholder="email@edu.lk" /></div>
          <div style={s.field}><label style={s.label}>Password</label><input style={s.input} type="password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} placeholder="••••••••" /></div>
          <div style={s.field}><label style={s.label}>Role</label>
            <select style={s.input} value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
              <option value="student">Student</option><option value="teacher">Teacher</option><option value="admin">Admin</option>
            </select>
          </div>
        </div>
        {msg && <p style={msg.startsWith("✅") ? s.success : s.error}>{msg}</p>}
        <button style={s.btn} onClick={add}>Add User</button>
      </div>

      <h3 style={s.sectionTitle}>All Users ({DB.users.length})</h3>
      <div style={s.tableWrap}>
        <table style={s.table}>
          <thead><tr>{["Name","Email","Role","Avatar"].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
          <tbody>
            {DB.users.map(u => (
              <tr key={u.id} style={s.tr}>
                <td style={s.td}>{u.name}</td>
                <td style={s.td}>{u.email}</td>
                <td style={s.td}><span style={{ ...s.badge, background: u.role==="admin"?"#dc262620":u.role==="teacher"?"#05966920":"#6366f120", color: u.role==="admin"?"#dc2626":u.role==="teacher"?"#059669":"#6366f1" }}>{u.role}</span></td>
                <td style={s.td}><div style={{ ...s.avatar, width: 32, height: 32, fontSize: 13 }}>{u.avatar}</div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminCourses() {
  return (
    <div style={s.page}>
      <h2 style={s.pageTitle}>Manage Courses</h2>
      <div style={s.tableWrap}>
        <table style={s.table}>
          <thead><tr>{["Code","Name","Teacher","Students","Credits"].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
          <tbody>
            {DB.courses.map(c => {
              const teacher = DB.users.find(u => u.id === c.teacher);
              return (
                <tr key={c.id} style={s.tr}>
                  <td style={s.td}><span style={s.badge}>{c.code}</span></td>
                  <td style={s.td}>{c.name}</td>
                  <td style={s.td}>{teacher?.name}</td>
                  <td style={s.td}>{c.students.length}</td>
                  <td style={s.td}>{c.credits}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminAnnounce({ user }) {
  const [form, setForm] = useState({ title: "", content: "" });
  const [msg, setMsg] = useState("");
  const post = () => {
    if (!form.title || !form.content) { setMsg("Both fields required."); return; }
    DB.announcements.push({ id: nextId.announcements++, courseId: null, title: form.title, content: form.content, isAdmin: true, date: new Date().toISOString().split("T")[0], important: false });
    setMsg("✅ Platform-wide announcement posted!"); setForm({ title: "", content: "" });
    setTimeout(() => setMsg(""), 2000);
  };
  return (
    <div style={s.page}>
      <h2 style={s.pageTitle}>Platform Announcement</h2>
      <div style={s.card}>
        <p style={{ color: "#94a3b8", marginBottom: 16 }}>This will be visible to all students and teachers on the platform.</p>
        <div style={s.field}><label style={s.label}>Title</label><input style={s.input} value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Announcement title" /></div>
        <div style={s.field}><label style={s.label}>Message</label><textarea style={s.textarea} value={form.content} onChange={e => setForm({...form, content: e.target.value})} rows={5} placeholder="Your message…" /></div>
        {msg && <p style={msg.startsWith("✅") ? s.success : s.error}>{msg}</p>}
        <button style={s.btn} onClick={post}>📢 Broadcast to All</button>
      </div>
    </div>
  );
}

function AdminReports() {
  const graded = DB.submissions.filter(s => s.status === "graded");
  const avg = graded.length ? Math.round(graded.reduce((a,s)=>a+s.grade,0)/graded.length) : 0;
  return (
    <div style={s.page}>
      <h2 style={s.pageTitle}>Platform Reports</h2>
      <div style={s.statsRow}>
        {[
          { label: "Assignments Created", val: DB.assignments.length, icon: "📝", color: "#6366f1" },
          { label: "Total Submissions", val: DB.submissions.length, icon: "📨", color: "#3b82f6" },
          { label: "Graded", val: graded.length, icon: "✅", color: "#10b981" },
          { label: "Platform Avg Grade", val: avg + "%", icon: "📊", color: "#f59e0b" },
        ].map(stat => (
          <div key={stat.label} style={{ ...s.statCard, borderTop: `4px solid ${stat.color}` }}>
            <span style={{ fontSize: 28 }}>{stat.icon}</span>
            <div style={{ ...s.statVal, color: stat.color }}>{stat.val}</div>
            <div style={s.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>
      <div style={s.card}>
        <h3 style={s.cardTitle}>📊 Course Summary</h3>
        {DB.courses.map(c => {
          const asgs = DB.assignments.filter(a => a.courseId === c.id).length;
          const subs = DB.submissions.filter(s => DB.assignments.some(a => a.id === s.assignmentId && a.courseId === c.id)).length;
          return (
            <div key={c.id} style={s.gradeRow}>
              <span style={{ color: "#e2e8f0" }}>{c.code} — {c.name}</span>
              <span style={{ color: "#94a3b8" }}>{c.students.length} students · {asgs} assignments · {subs} submissions</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── STYLES ────────────────────────────────────────────────────────────────────
const s = {
  loginWrap: { minHeight: "100vh", background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', system-ui, sans-serif", padding: 16 },
  loginCard: { background: "#1e293b", borderRadius: 20, padding: "40px 36px", width: "100%", maxWidth: 420, boxShadow: "0 25px 60px rgba(0,0,0,0.5)" },
  loginLogo: { textAlign: "center", marginBottom: 32 },
  logoIcon: { fontSize: 56, display: "block" },
  logoText: { color: "#f1f5f9", fontSize: 32, fontWeight: 800, margin: "8px 0 4px", letterSpacing: -1 },
  logoSub: { color: "#6366f1", fontSize: 14, fontWeight: 500 },
  field: { marginBottom: 16 },
  label: { display: "block", color: "#94a3b8", fontSize: 13, fontWeight: 500, marginBottom: 6 },
  input: { width: "100%", background: "#0f172a", border: "1px solid #334155", borderRadius: 8, padding: "12px 14px", color: "#f1f5f9", fontSize: 15, outline: "none", boxSizing: "border-box" },
  textarea: { width: "100%", background: "#0f172a", border: "1px solid #334155", borderRadius: 8, padding: "12px 14px", color: "#f1f5f9", fontSize: 14, outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" },
  btn: { width: "100%", background: "linear-gradient(135deg, #6366f1, #4f46e5)", border: "none", borderRadius: 10, padding: "14px", color: "#fff", fontSize: 16, fontWeight: 600, cursor: "pointer", marginTop: 8 },
  btn2: { background: "#6366f1", border: "none", borderRadius: 8, padding: "8px 16px", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" },
  btnGhost: { flex: 1, background: "transparent", border: "1px solid #334155", borderRadius: 10, padding: "14px", color: "#94a3b8", fontSize: 15, cursor: "pointer", marginTop: 8 },
  demoSection: { marginTop: 24, padding: "16px", background: "#0f172a", borderRadius: 12 },
  demoTitle: { color: "#94a3b8", fontSize: 13, textAlign: "center", marginBottom: 12 },
  demoGrid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 },
  demoBtn: { background: "#1e293b", border: "1px solid #334155", borderRadius: 8, padding: "8px", color: "#cbd5e1", fontSize: 12, cursor: "pointer" },
  error: { color: "#ef4444", fontSize: 13, textAlign: "center", margin: "8px 0" },
  success: { color: "#10b981", fontSize: 13, margin: "8px 0" },
  footer: { color: "#475569", fontSize: 12, textAlign: "center", marginTop: 24 },

  shell: { display: "flex", minHeight: "100vh", background: "#0f172a", fontFamily: "'Segoe UI', system-ui, sans-serif" },
  sidebar: { width: 240, background: "#1e293b", display: "flex", flexDirection: "column", flexShrink: 0, position: "sticky", top: 0, height: "100vh", overflowY: "auto" },
  sideTop: { padding: "20px 16px", borderBottom: "1px solid #334155" },
  sideLogoWrap: { display: "flex", alignItems: "center", gap: 8, borderRadius: 10, padding: "8px 12px", marginBottom: 16 },
  sideLogo: { color: "#fff", fontWeight: 700, fontSize: 16 },
  sideUser: { display: "flex", alignItems: "center", gap: 10 },
  avatar: { width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14, flexShrink: 0 },
  sideUserName: { color: "#f1f5f9", fontSize: 13, fontWeight: 600, lineHeight: 1.3 },
  sideUserRole: { fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.5 },
  nav: { padding: "12px 8px", flex: 1 },
  navBtn: { display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", background: "transparent", border: "none", borderRadius: 8, color: "#94a3b8", fontSize: 14, cursor: "pointer", textAlign: "left", borderLeft: "3px solid transparent", marginBottom: 2 },
  navBtnActive: { fontWeight: 600 },
  navIcon: { fontSize: 18, width: 22, textAlign: "center" },
  logoutBtn: { margin: 12, padding: "10px", background: "transparent", border: "1px solid #334155", borderRadius: 8, color: "#64748b", cursor: "pointer", fontSize: 13 },

  main: { flex: 1, overflowY: "auto" },
  page: { padding: "32px 28px", maxWidth: 900 },
  pageTitle: { color: "#f1f5f9", fontSize: 26, fontWeight: 800, marginBottom: 6 },
  pageSub: { color: "#64748b", fontSize: 15, marginBottom: 24 },
  sectionTitle: { color: "#cbd5e1", fontSize: 17, fontWeight: 700, marginBottom: 12 },

  statsRow: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 },
  statCard: { background: "#1e293b", borderRadius: 12, padding: "20px 16px", textAlign: "center" },
  statVal: { fontSize: 32, fontWeight: 800, marginTop: 8, marginBottom: 4 },
  statLabel: { color: "#64748b", fontSize: 13 },

  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 },
  twoCol2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  card: { background: "#1e293b", borderRadius: 14, padding: "20px 22px", marginBottom: 16 },
  cardTitle: { color: "#f1f5f9", fontSize: 16, fontWeight: 700, marginBottom: 14 },

  listItem: { display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 0", borderBottom: "1px solid #1e293b" },
  listDot: { color: "#6366f1", marginTop: 2 },
  listTitle: { color: "#e2e8f0", fontSize: 14, fontWeight: 600 },
  listSub: { color: "#64748b", fontSize: 12, marginTop: 2 },
  linkBtn: { background: "none", border: "none", color: "#6366f1", fontSize: 13, cursor: "pointer", padding: "8px 0" },

  courseGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 },
  courseCard: { background: "#1e293b", borderRadius: 14, padding: "20px", cursor: "pointer", transition: "transform .15s", borderTop: "4px solid #6366f1" },
  courseHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  courseCode: { background: "#6366f120", color: "#6366f1", fontSize: 12, fontWeight: 600, padding: "2px 8px", borderRadius: 6 },
  courseName: { color: "#f1f5f9", fontSize: 16, fontWeight: 700, marginBottom: 6 },
  courseTeacher: { color: "#94a3b8", fontSize: 13, marginBottom: 10 },
  courseStats: { display: "flex", gap: 12, color: "#64748b", fontSize: 12, marginBottom: 8 },
  courseFooter: { color: "#6366f1", fontSize: 12, fontWeight: 600 },

  materialGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14 },
  materialCard: { background: "#1e293b", borderRadius: 12, padding: "16px", textAlign: "center" },
  materialTitle: { color: "#f1f5f9", fontSize: 14, fontWeight: 600, margin: "8px 0 4px" },
  materialMeta: { color: "#64748b", fontSize: 12, marginBottom: 4 },
  dlBtn: { background: "#6366f120", border: "none", color: "#6366f1", borderRadius: 6, padding: "6px 12px", cursor: "pointer", fontSize: 12, marginTop: 8 },

  asgCard: { background: "#1e293b", borderRadius: 12, padding: "16px 18px", marginBottom: 10, cursor: "pointer", borderLeft: "4px solid #6366f1" },
  asgTitle: { color: "#f1f5f9", fontSize: 15, fontWeight: 600, marginBottom: 6 },
  asgMeta: { display: "flex", gap: 20, color: "#64748b", fontSize: 13, marginBottom: 16 },
  asgMeta2: { display: "flex", gap: 16, color: "#64748b", fontSize: 13 },

  gradeRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #0f172a" },
  gradeBox: { background: "#0f172a", borderRadius: 10, padding: 16, marginTop: 12, textAlign: "center" },
  codeBox: { background: "#0f172a", borderRadius: 8, padding: "12px 14px", color: "#a5f3fc", fontSize: 13, overflowX: "auto", marginTop: 8 },

  badge: { background: "#6366f120", color: "#6366f1", fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 6, marginLeft: 6 },
  importantBadge: { background: "#ef444420", color: "#ef4444", fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 6, display: "inline-block", marginBottom: 6 },
  backBtn: { background: "none", border: "none", color: "#6366f1", fontSize: 14, cursor: "pointer", padding: "0 0 16px", display: "block" },
  btnRow: { display: "flex", gap: 10, flexWrap: "wrap" },
  empty: { color: "#64748b", fontSize: 15, padding: "20px 0" },

  chatBox: { background: "#1e293b", borderRadius: 14, padding: "16px", height: 360, overflowY: "auto", marginBottom: 12, display: "flex", flexDirection: "column", gap: 12 },
  chatBubble: { display: "flex", gap: 10, alignItems: "flex-start", maxWidth: "85%" },
  chatUser: { flexDirection: "row-reverse", alignSelf: "flex-end" },
  chatAI: { alignSelf: "flex-start" },
  chatAvatar: { fontSize: 24, flexShrink: 0 },
  chatText: { background: "#0f172a", borderRadius: 10, padding: "10px 14px", color: "#e2e8f0", fontSize: 14, lineHeight: 1.6 },
  chatInput: { display: "flex", gap: 10 },

  tableWrap: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { background: "#1e293b", color: "#94a3b8", fontSize: 12, fontWeight: 600, padding: "12px 14px", textAlign: "left", borderBottom: "1px solid #334155" },
  tr: { borderBottom: "1px solid #1e293b" },
  td: { padding: "12px 14px", color: "#cbd5e1", fontSize: 14 },
};