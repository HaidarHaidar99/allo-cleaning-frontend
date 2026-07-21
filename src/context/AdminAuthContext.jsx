import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { API_BASE_URL } from '../config';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('allo_cleaning_admin_token') || null);
  const [admin, setAdmin] = useState(() => {
    const savedAdmin = localStorage.getItem('allo_cleaning_admin_user');
    return savedAdmin ? JSON.parse(savedAdmin) : null;
  });
  const [loading, setLoading] = useState(false);

  // Stable logout function — will NOT be recreated on every render
  const logout = useCallback(() => {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem('allo_cleaning_admin_token');
    localStorage.removeItem('allo_cleaning_admin_user');
  }, []);

  // Stable auth headers builder
  const getAuthHeaders = useCallback(() => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  }), [token]);

  // Validate token once on mount / when token changes
  useEffect(() => {
    if (token) {
      fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (res.status !== 200) {
            logout();
          } else {
            return res.json();
          }
        })
        .then((data) => {
          if (data && data.admin) {
            setAdmin(data.admin);
            localStorage.setItem('allo_cleaning_admin_user', JSON.stringify(data.admin));
          }
        })
        .catch((err) => {
          console.error('Token validation failed:', err);
          logout();
        });
    }
  }, [token, logout]);

  // Direct Admin Login (Email & Password)
  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(`Server error (status ${response.status}): ${text.substring(0, 80)}... Please verify the backend API server is running.`);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed. Please check credentials.');
      }

      setToken(data.token);
      setAdmin(data.admin);
      localStorage.setItem('allo_cleaning_admin_token', data.token);
      localStorage.setItem('allo_cleaning_admin_user', JSON.stringify(data.admin));

      setLoading(false);
      return { success: true, admin: data.admin };
    } catch (error) {
      setLoading(false);
      throw error;
    }
  }, []);

  // Fetch Admin Accounts (Admin only)
  const fetchAdmins = useCallback(async () => {
    const headers = getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/admins`, { headers });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to fetch admin accounts.');
    }
    return await res.json();
  }, [getAuthHeaders]);

  // Create Admin directly
  const createAdmin = useCallback(async (adminData) => {
    const headers = getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/admins`, {
      method: 'POST',
      headers,
      body: JSON.stringify(adminData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to create admin account.');
    }

    if (data.callerDemoted) {
      setAdmin(prev => {
        if (!prev) return prev;
        const updatedAdmin = { ...prev, role: 'Admin' };
        localStorage.setItem('allo_cleaning_admin_user', JSON.stringify(updatedAdmin));
        return updatedAdmin;
      });
    }

    return data;
  }, [getAuthHeaders]);

  // Update Admin Password (Admin only)
  const updateAdminPassword = useCallback(async (adminId, oldPassword, newPassword) => {
    const headers = getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/admins/${adminId}/password`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ oldPassword, newPassword }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to update password.');
    }
    return data;
  }, [getAuthHeaders]);

  // Update Admin Profile Details (Admin only)
  const updateAdminProfile = useCallback(async (adminId, profileData) => {
    const headers = getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/admins/${adminId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(profileData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to update profile.');
    }

    setAdmin(prev => {
      if (prev && adminId === prev.id) {
        const updatedAdmin = { ...prev, ...profileData };
        localStorage.setItem('allo_cleaning_admin_user', JSON.stringify(updatedAdmin));
        return updatedAdmin;
      }
      return prev;
    });

    return data;
  }, [getAuthHeaders]);

  // Delete Admin Account (Admin only)
  const deleteAdmin = useCallback(async (adminId) => {
    const headers = getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/admins/${adminId}`, {
      method: 'DELETE',
      headers,
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to delete admin account.');
    }
    return data;
  }, [getAuthHeaders]);

  // Fetch Dashboard Stats (Admin only)
  const fetchDashboardStats = useCallback(async () => {
    const headers = getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/stats`, { headers });
    if (!res.ok) {
      throw new Error('Failed to fetch dashboard stats.');
    }
    return await res.json();
  }, [getAuthHeaders]);

  // Memoize the context value so consumers don't re-render unless actual data changes
  const contextValue = useMemo(() => ({
    token,
    admin,
    setAdmin,
    loading,
    login,
    logout,
    fetchAdmins,
    createAdmin,
    updateAdminPassword,
    updateAdminProfile,
    deleteAdmin,
    fetchDashboardStats,
    getAuthHeaders,
    API_BASE_URL,
  }), [token, admin, loading, login, logout, fetchAdmins, createAdmin, updateAdminPassword, updateAdminProfile, deleteAdmin, fetchDashboardStats, getAuthHeaders]);

  return (
    <AdminAuthContext.Provider value={contextValue}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
