import React, { useState } from 'react';
import { s } from '../styles/theme';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  return (
    <div style={s.loginWrap}>
      <div style={s.loginCard}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>🎓</div>
          <h1 style={{ color: '#0f172a', fontSize: '28px', fontWeight: '800', margin: 0 }}>LankaLearn</h1>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '5px' }}>Netherfield International School</p>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Email</label>
          <input style={{ ...s.input, marginBottom: 0 }} type="email" placeholder="student@school.lk" value={email} onChange={e => setEmail(e.target.value)} />
        </div>

        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Password</label>
          <input style={{ ...s.input, marginBottom: 0 }} type="password" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} />
        </div>

        <button style={{ ...s.btnPrimary, width: '100%' }} onClick={() => onLogin(email, pass)}>
          Sign In
        </button>
        
        <p style={{ textAlign: 'center', fontSize: '12px', color: '#94a3b8', marginTop: '24px' }}>
          © 2026 LankaLearn Education Technologies
        </p>
      </div>
    </div>
  );
}