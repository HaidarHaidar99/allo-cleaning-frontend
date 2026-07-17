import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Lock, Mail, KeyRound, ArrowRight, AlertCircle, Eye, EyeOff, Sun, Moon } from 'lucide-react';
import '../../styles/AdminLogin.css';

const AdminLogin = () => {
  const { login, admin } = useAdminAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [theme, setTheme] = useState(() => localStorage.getItem('allo_admin_theme') || 'light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('allo_admin_theme', newTheme);
  };

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (admin) {
      navigate('/admin/dashboard');
    }
  }, [admin, navigate]);

  // Handle credentials login submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`login-page admin-theme-${theme}`}>
      {/* Theme Toggle Button */}
      <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 100 }}>
        <button 
          type="button"
          onClick={toggleTheme} 
          className="theme-toggle-btn"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--admin-text-medium)',
            cursor: 'pointer',
            padding: '10px',
            borderRadius: '50%',
            backgroundColor: 'var(--admin-card-bg)',
            boxShadow: 'var(--admin-shadow)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--admin-border)'
          }}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>

      <div className="login-container glass-card animate-fade-in">
        {/* Header */}
        <div className="login-header">
          <div className="login-icon-wrapper bg-cyan">
            <Lock className="text-white" size={24} />
          </div>
          <h1>Admin Portal</h1>
          <p>Please authorize access to the Allo Cleaning management dashboard.</p>
        </div>

        {/* Error alerts */}
        {error && (
          <div className="alert alert-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-with-icon">
              <Mail className="input-icon" size={18} />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                placeholder="Email Address"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon" style={{ position: 'relative' }}>
              <KeyRound className="input-icon" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                placeholder="Password"
                required
                style={{ paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  color: 'var(--text-light)',
                  padding: 0
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
