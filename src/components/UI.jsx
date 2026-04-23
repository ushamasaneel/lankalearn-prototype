import React from 'react';
import { s } from '../styles/theme';

export const Card = ({ title, children }) => (
  <div style={s.card}>
    {title && <h3 style={{ marginBottom: "16px", fontSize: "18px" }}>{title}</h3>}
    {children}
  </div>
);

export const PageHeader = ({ title, sub }) => (
  <div style={{ marginBottom: "30px" }}>
    <h1 style={{ fontSize: "28px", fontWeight: "800" }}>{title}</h1>
    <p style={{ color: "#94a3b8" }}>{sub}</p>
  </div>
);