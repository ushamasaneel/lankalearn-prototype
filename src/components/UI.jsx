import React from 'react';
import { s } from '../styles/theme';

export const Card = ({ title, children }) => (
  <div style={s.card}>
    {title && <h3 style={{ marginBottom: "16px", fontSize: "18px", color: "#1e293b", fontWeight: "700" }}>{title}</h3>}
    <div style={{ color: "#475569" }}>{children}</div>
  </div>
);

export const PageHeader = ({ title, sub }) => (
  <div style={{ marginBottom: "32px", borderBottom: "1px solid #e2e8f0", paddingBottom: "20px" }}>
    <h1 style={s.h1}>{title}</h1>
    <p style={s.subText}>{sub}</p>
  </div>
);