import React, { useState } from 'react';
import { s } from '../styles/theme';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  return (
    <div style={s.loginWrap}>
      <div style={s.loginCard}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <span style={{ fontSize: '50px' }}>🎓</span>
          <h1 style={{ color: 'white', fontSize: '32px' }}>LankaLearn</h1>
        </div>
        <input style={s.input} placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <div style={{ height: '15px' }} />
        <input style={s.input} type="password" placeholder="Password" value={pass} onChange={e => setPass(e.target.value)} />
        <button style={{ ...s.btn, width: '100%', marginTop: '20px' }} onClick={() => onLogin(email, pass)}>Sign In</button>
      </div>
    </div>
  );
}