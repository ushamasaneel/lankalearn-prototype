export const DB = {
  users: [
    { id: 1, name: "Nimal Perera", email: "nimal@student.lk", password: "student123", role: "student", avatar: "NP", course: "Computer Science" },
    { id: 2, name: "Kamala Silva", email: "kamala@student.lk", password: "student123", role: "student", avatar: "KS", course: "Information Technology" },
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
  ],
  assignments: [
    { id: 1, courseId: 1, title: "Python Calculator", description: "Build a simple calculator.", dueDate: "2025-02-10", points: 100, type: "code", teacherId: 3 },
  ],
  submissions: [],
  announcements: [
    { id: 1, courseId: null, title: "Welcome to LankaLearn", content: "Platform is live!", isAdmin: true, date: "2025-01-28", important: true },
  ],
};

export const typeIcon = { pdf: "📄", ppt: "📊", doc: "📝", video: "🎬", code: "💻", document: "📝" };
export const gradeColor = g => g >= 90 ? "#10b981" : g >= 70 ? "#3b82f6" : g >= 50 ? "#f59e0b" : "#ef4444";