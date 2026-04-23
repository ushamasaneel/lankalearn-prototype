import React, { useState } from 'react';
import { s } from '../styles/theme';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  return (
    <div style={s.loginWrap}>
      <div style={s.loginCard}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{ fontSize: '48px', display: 'block', marginBottom: '10px' }}>🎓</span>
          <h1 style={{ color: '#0f172a', fontSize: '28px', fontWeight: '800' }}>LankaLearn</h1>
          <p style={{ color: '#64748b', fontSize: '14px' }}>Education Portal • Pilot v1.0</p>
        </div>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: '#475569' }}>Email Address</label>
        <input style={s.input} type="email" placeholder="name@school.com" value={email} onChange={e => setEmail(e.target.value)} />
        
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: '#475569', marginTop: '10px' }}>Password</label>
        <input style={s.input} type="password" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} />
        
        <button style={{ ...s.btn, width: '100%', marginTop: '24px' }} onClick={() => onLogin(email, pass)}>
          Sign In to LankaLearn
        </button>
      </div>
    </div>
  );
}