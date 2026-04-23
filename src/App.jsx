import React, { useState } from "react";
import { DB } from "./db";
import Login from "./auth/Login";
import StudentPortal from "./portals/Student";
import TeacherPortal from "./portals/Teacher";
import AdminPortal from "./portals/Admin";

export default function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (email, password) => {
    const found = DB.users.find(u => u.email === email && u.password === password);
    if (found) {
      setUser(found);
      return true;
    }
    alert("Invalid credentials!");
    return false;
  };

  if (!user) return <Login onLogin={handleLogin} />;

  return (
    <>
      {user.role === "student" && <StudentPortal user={user} onLogout={() => setUser(null)} />}
      {user.role === "teacher" && <TeacherPortal user={user} onLogout={() => setUser(null)} />}
      {user.role === "admin" && <AdminPortal user={user} onLogout={() => setUser(null)} />}
    </>
  );
}