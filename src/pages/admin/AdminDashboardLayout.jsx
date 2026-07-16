import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { LayoutDashboard, Sparkles, Inbox, Users, LogOut, UserCheck } from 'lucide-react';
import { API_BASE_URL } from '../../config';
import '../../styles/AdminDashboard.css';

const getAvatarColor = (email) => {
  if (!email) return '#10b981';
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = email.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    '#ef4444', '#f97316', '#f59e0b', '#10b981', '#14b8a6',
    '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#ec4899'
  ];
  return colors[Math.abs(hash) % colors.length];
};

const AdminDashboardLayout = () => {
  const { token, admin, logout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Route security check: redirect if not authenticated or user deleted
  useEffect(() => {
    if (!token) {
      navigate('/admin');
      return;
    }

    // Validate that the admin user still exists in the database
    fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.status !== 200) {
          logout();
          navigate('/admin');
        }
      })
      .catch((err) => console.error('Auth check error:', err));
  }, [token, navigate, location.pathname, logout]);

  if (!token || !admin) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Securing connection...</p>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const isTabActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="admin-dashboard">
      {/* 1. Sidebar Navigation */}
      <aside className="admin-sidebar glass-card">
        <div className="sidebar-logo-section">
          <Link to="/" className="sidebar-logo">
            <Sparkles className="logo-icon text-cyan" />
            <span>Allo Admin</span>
          </Link>
          <span className="admin-badge">Admin Panel</span>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li>
              <Link to="/admin/dashboard" className={isTabActive('/admin/dashboard')}>
                <LayoutDashboard size={18} />
                <span>Overview</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/dashboard/services" className={isTabActive('/admin/dashboard/services')}>
                <Sparkles size={18} />
                <span>Services</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/dashboard/forms" className={isTabActive('/admin/dashboard/forms')}>
                <Inbox size={18} />
                <span>Forms</span>
              </Link>
            </li>
            {admin && admin.role === 'Super Admin' && (
              <li>
                <Link to="/admin/dashboard/admins" className={isTabActive('/admin/dashboard/admins')}>
                  <Users size={18} />
                  <span>Admins</span>
                </Link>
              </li>
            )}
            <li>
              <Link to="/admin/dashboard/profile" className={isTabActive('/admin/dashboard/profile')}>
                <UserCheck size={18} />
                <span>Profile</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="sidebar-logout-btn">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Viewport Content */}
      <main className="admin-viewport">
        {/* Header Profile Bar */}
        <header className="admin-header glass-card">
          <div className="header-greeting">
            <h1>Welcome, {admin.fullName}</h1>
            <p>Role: <strong>{admin.role}</strong></p>
          </div>
          <div className="header-profile">
            <div 
              style={{
                backgroundColor: getAvatarColor(admin.email),
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '1.2rem',
                flexShrink: 0
              }}
            >
              {admin.fullName ? admin.fullName.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="profile-text">
              <h4>{admin.fullName}</h4>
              <p>{admin.email}</p>
            </div>
          </div>
        </header>

        {/* Dashboard Pages Mount */}
        <div className="admin-content-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardLayout;
