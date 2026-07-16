import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Sparkles, Inbox, Users, Clock, ArrowRight, Eye } from 'lucide-react';

const DashboardHome = () => {
  const { fetchDashboardStats, getAuthHeaders, API_BASE_URL } = useAdminAuth();
  
  const [stats, setStats] = useState({
    totalServices: 0,
    totalForms: 0,
    totalAdmins: 0,
  });
  
  const [recentForms, setRecentForms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // 1. Fetch KPI counters
        const statsData = await fetchDashboardStats();
        setStats(statsData);

        // 2. Fetch all contact forms and slice the first 5
        const formsRes = await fetch(`${API_BASE_URL}/forms`, {
          headers: getAuthHeaders(),
        });
        if (formsRes.ok) {
          const formsData = await formsRes.json();
          setRecentForms(formsData.slice(0, 5));
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="loading-spinner-wrapper">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-home animate-fade-in">
      {/* 1. Statistics Grid */}
      <div className="admin-card-grid">
        {/* Services Count */}
        <div className="admin-card">
          <div className="admin-card-icon bg-cyan">
            <Sparkles className="text-white" size={24} />
          </div>
          <div className="admin-card-info">
            <h3>Total Services</h3>
            <div className="count-val">{stats.totalServices}</div>
          </div>
        </div>

        {/* Contact Forms Count */}
        <div className="admin-card">
          <div className="admin-card-icon bg-green">
            <Inbox className="text-white" size={24} />
          </div>
          <div className="admin-card-info">
            <h3>Total Forms</h3>
            <div className="count-val">{stats.totalForms}</div>
          </div>
        </div>

        {/* Admins Count */}
        <div className="admin-card">
          <div className="admin-card-icon bg-cyan">
            <Users className="text-white" size={24} />
          </div>
          <div className="admin-card-info">
            <h3>Total Admins</h3>
            <div className="count-val">{stats.totalAdmins}</div>
          </div>
        </div>
      </div>

      {/* 2. Recent Contact Messages Feed */}
      <div className="admin-panel-card recent-forms-panel">
        <div className="panel-header-row">
          <h2>Recent Form Submissions</h2>
          <Link to="/admin/dashboard/forms" className="btn btn-outline btn-small">
            <span>View All Forms</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="table-responsive">
          {recentForms.length > 0 ? (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Client Name</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th>Submitted Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentForms.map((form) => (
                  <tr key={form.id}>
                    <td className="font-bold">{form.fullName}</td>
                    <td>{form.email}</td>
                    <td>{form.phoneNumber}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-light)' }}>
                        <Clock size={12} />
                        <span>{new Date(form.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td>
                      <Link to="/admin/dashboard/forms" className="btn btn-outline btn-small" style={{ padding: '6px 12px' }}>
                        <Eye size={12} />
                        <span style={{ fontSize: '0.75rem' }}>View</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-light)' }}>
              No messages have been submitted yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
