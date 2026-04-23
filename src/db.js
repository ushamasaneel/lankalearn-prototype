export const DB = {
  users: [
    { id: 1, name: "Nimal Perera", email: "nimal@student.lk", password: "student123", role: "student", avatar: "NP" },
    { id: 3, name: "Dr. Suresh", email: "suresh@teacher.lk", password: "teacher123", role: "teacher", avatar: "SF" },
  ],
  courses: [
    { id: 1, name: "English", code: "ENG" },
    { id: 2, name: "Mathematics", code: "MAT" },
    { id: 3, name: "Islam", code: "ISL" },
    { id: 4, name: "Tamil", code: "TAM" },
    { id: 5, name: "History", code: "HIS" },
    { id: 6, name: "Literature", code: "LIT" },
    { id: 7, name: "Health Science", code: "HEA" },
    { id: 8, name: "Business Studies", code: "BUS" },
  ],
  // This is where student uploads will live
  submissions: [], 
};