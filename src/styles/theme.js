export const s = {
  shell: { display: "flex", width: "100vw", height: "100vh", background: "#f8fafc", overflow: "hidden" },
  sidebar: { width: "280px", background: "#ffffff", borderRight: "1px solid #e2e8f0", display: "flex", flexDirection: "column" },
  main: { flex: 1, height: "100vh", overflowY: "auto", padding: "40px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px", width: "100%" },
  navBtn: { width: "100%", padding: "16px 24px", border: "none", background: "none", textAlign: "left", cursor: "pointer", fontSize: "16px", color: "#475569", display: "flex", alignItems: "center", gap: "12px", transition: "0.2s" },
  navBtnActive: { background: "#eff6ff", color: "#2563eb", borderLeft: "4px solid #2563eb", fontWeight: "600" },
  uploadBox: { border: "2px dashed #cbd5e1", padding: "20px", borderRadius: "12px", textAlign: "center", marginTop: "15px", background: "#f8fafc" }
};