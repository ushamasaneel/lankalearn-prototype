export const s = {
  // Global Shell (Prevents horizontal scroll)
  shell: { 
    display: "flex", 
    width: "100vw", 
    height: "100vh", 
    background: "#f8fafc", 
    overflow: "hidden", // Crucial: clips overflow
    margin: 0, 
    padding: 0,
    boxSizing: "border-box"
  },
  sidebar: { 
    width: "260px", 
    background: "#ffffff", 
    borderRight: "1px solid #e2e8f0", 
    display: "flex", 
    flexDirection: "column",
    flexShrink: 0 
  },
  main: { 
    flex: 1, 
    height: "100vh", 
    overflowY: "auto", 
    padding: "32px",
    boxSizing: "border-box" 
  },
  // Professional Grid
  grid: { 
    display: "grid", 
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", 
    gap: "20px", 
    width: "100%" 
  },
  // Course Card (Interactive)
  courseCard: {
    background: "white",
    padding: "24px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
  },
  // Login Fix
  loginWrap: { 
    width: "100vw", 
    height: "100vh", 
    background: "#f1f5f9", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center" 
  },
  loginCard: { 
    background: "white", 
    padding: "40px", 
    borderRadius: "16px", 
    width: "100%", 
    maxWidth: "400px", 
    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
    border: "1px solid #e2e8f0"
  },
  navBtn: { 
    width: "100%", 
    padding: "14px 24px", 
    border: "none", 
    background: "none", 
    textAlign: "left", 
    cursor: "pointer", 
    fontSize: "15px", 
    color: "#64748b",
    fontWeight: "500"
  },
  navBtnActive: { 
    color: "#2563eb", 
    background: "#eff6ff", 
    borderLeft: "4px solid #2563eb" 
  },
  btnPrimary: {
    background: "#2563eb",
    color: "white",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    fontWeight: "600",
    cursor: "pointer"
  }
};