import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AuthScreen = ({ setUser, setCurrentUserData, socket, setStatuses }) => {
  const [authData, setAuthData] = useState({ username: '', password: '', mobile: '', email: '' });
  const [isRegistering, setIsRegistering] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  return (
    <div className="auth-wrapper">
      <form className="auth-form" onSubmit={async (e) => {
        e.preventDefault();
        if (isRegistering) {
          const pwd = authData.password;
          if (pwd.length < 8 || !/[a-z]/.test(pwd) || !/[A-Z]/.test(pwd) || !/\d/.test(pwd) || !/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) {
            setPasswordError('Password must be at least 8 chars, with uppercase, lowercase, number & special character.');
            return;
          }
        }
        setPasswordError('');
        try {
          const res = await axios.post(`${API_URL}/api/auth`, authData);
          setUser(res.data.username);
          setCurrentUserData(res.data);
          socket.emit('user_login', res.data.username);
          try {
            const statRes = await axios.get(`${API_URL}/api/status`);
            setStatuses(statRes.data);
          } catch (e) { }
        } catch (err) { alert(err.response?.data?.error || 'Auth failed'); }
      }}>
        <div className="auth-logo">
          <svg viewBox="0 0 55 55" width="48" height="48">
            <path fill="#25d366" d="M27.5 0C12.3 0 0 12.3 0 27.5c0 4.8 1.3 9.4 3.6 13.3L0 55l14.5-3.8c3.8 2 8.1 3.2 12.9 3.2C42.8 54.5 55 42.2 55 27 55 12.3 42.7 0 27.5 0z" />
            <path fill="#fff" d="M40.9 34.4c-.7-.3-4.1-2-4.7-2.3-.6-.2-1-.3-1.4.3-.4.6-1.6 2-2 2.5-.4.4-.7.5-1.4.2-3.7-1.9-6.2-3.3-8.6-7.5-.7-1.2.7-1.1 1.9-3.6.2-.4.1-.8-.1-1.1-.2-.3-1.4-3.4-2-4.7-.5-1.2-1.1-1-1.4-1.1h-1.2c-.4 0-1.1.2-1.7.9-.6.7-2.2 2.1-2.2 5.2 0 3.1 2.2 6 2.5 6.4 3 4.6 6.5 6.6 9.8 7.5 3.5 1 3.5.7 4.2.6.8-.1 2.5-1 2.9-2 .4-.9.4-1.7.3-1.9-.2-.2-.5-.3-1.1-.5z" />
          </svg>
          <h2>WhatsApp</h2>
        </div>
        <p className="auth-sub">Sign in to continue</p>
        <input required placeholder="Username" value={authData.username}
          onChange={e => setAuthData({ ...authData, username: e.target.value })} />
        {isRegistering && (
          <>
            <input required type="email" placeholder="Email ID" value={authData.email}
              onChange={e => setAuthData({ ...authData, email: e.target.value })} />
            <input required type="tel" maxLength="10" placeholder="Mobile"
              value={authData.mobile} onChange={e => setAuthData({ ...authData, mobile: e.target.value })} />
          </>
        )}
        <input required type="password" placeholder="Password" value={authData.password}
          onChange={e => { setAuthData({ ...authData, password: e.target.value }); setPasswordError(''); }} />
        {passwordError && <div className="error-text">{passwordError}</div>}
        <button type="submit">{isRegistering ? 'Sign Up' : 'Login'}</button>
        <span className="toggle-auth" onClick={() => {
          setIsRegistering(!isRegistering);
          setAuthData({ username: '', password: '', mobile: '', email: '' });
          setPasswordError('');
        }}>
          {isRegistering ? 'Already have an account? Login' : 'New here? Register'}
        </span>
      </form>
    </div>
  );
};

export default AuthScreen;
