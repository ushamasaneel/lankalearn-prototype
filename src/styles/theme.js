export const s = {
  // Layout
  loginWrap: { minHeight: "100vh", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', 'Segoe UI', sans-serif" },
  loginCard: { background: "#ffffff", borderRadius: "16px", padding: "40px", width: "100%", maxWidth: "400px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0" },
  shell: { display: "flex", minHeight: "100vh", background: "#f1f5f9", color: "#1e293b" },
  sidebar: { width: 260, background: "#ffffff", display: "flex", flexDirection: "column", height: "100vh", position: "sticky", top: 0, borderRight: "1px solid #e2e8f0" },
  main: { flex: 1, padding: "40px", overflowY: "auto" },
  
  // Elements
  card: { background: "#ffffff", borderRadius: "12px", padding: "24px", marginBottom: "20px", border: "1px solid #e2e8f0", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" },
  
  // Inputs & Buttons
  input: { width: "100%", background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "8px", padding: "12px", color: "#1e293b", marginBottom: "12px", fontSize: "15px" },
  btn: { background: "#2563eb", color: "white", padding: "12px 24px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "600", transition: "background 0.2s" },
  btnDanger: { background: "#ef4444", color: "white", padding: "12px 24px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "600" },
  
  // Typography
  h1: { fontSize: "28px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" },
  subText: { color: "#64748b", fontSize: "15px", lineHeight: "1.5" },
  navItem: { padding: "12px 20px", color: "#475569", cursor: "pointer", fontWeight: "500", borderRadius: "8px", margin: "4px 10px" }
};