import React, { createContext, useState, useEffect, useContext } from 'react';
import { API_BASE_URL } from '../config';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('allo_cleaning_admin_token') || null);
  const [admin, setAdmin] = useState(() => {
    const savedAdmin = localStorage.getItem('allo_cleaning_admin_user');
    return savedAdmin ? JSON.parse(savedAdmin) : null;
  });
  const [loading, setLoading] = useState(false);

  // Set Authorization headers helper
  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  });

  // Check token expiration periodically or on boot
  useEffect(() => {
    if (token) {
      // Validate token status using /api/auth/me
      fetch(`${API_BASE_URL}/auth/me`, {
        headers: getAuthHeaders(),
      })
        .then((res) => {
          if (res.status !== 200) {
            logout(); // Auto-logout if token is expired/invalid/deleted (404)
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
        .catch((err) => console.error('Token validation failed:', err));
    }
  }, [token]);

  // Direct Admin Login (Email & Password)
  const login = async (email, password) => {
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
  };


  const logout = () => {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem('allo_cleaning_admin_token');
    localStorage.removeItem('allo_cleaning_admin_user');
  };

  // Fetch Admin Accounts (Admin only)
  const fetchAdmins = async () => {
    const res = await fetch(`${API_BASE_URL}/admins`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to fetch admin accounts.');
    }
    return await res.json();
  };

  // Create Admin directly
  const createAdmin = async (adminData) => {
    const res = await fetch(`${API_BASE_URL}/admins`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(adminData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to create admin account.');
    }

    if (data.callerDemoted && admin) {
      const updatedAdmin = { ...admin, role: 'Admin' };
      setAdmin(updatedAdmin);
      localStorage.setItem('allo_cleaning_admin_user', JSON.stringify(updatedAdmin));
    }

    return data;
  };


  // Update Admin Password (Admin only)
  const updateAdminPassword = async (adminId, oldPassword, newPassword) => {
    const res = await fetch(`${API_BASE_URL}/admins/${adminId}/password`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ oldPassword, newPassword }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to update password.');
    }
    return data;
  };

  // Update Admin Profile Details (Admin only)
  const updateAdminProfile = async (adminId, profileData) => {
    const res = await fetch(`${API_BASE_URL}/admins/${adminId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to update profile.');
    }

    if (admin && adminId === admin.id) {
      const updatedAdmin = { ...admin, ...profileData };
      setAdmin(updatedAdmin);
      localStorage.setItem('allo_cleaning_admin_user', JSON.stringify(updatedAdmin));
    }

    return data;
  };

  // Delete Admin Account (Admin only)
  const deleteAdmin = async (adminId) => {
    const res = await fetch(`${API_BASE_URL}/admins/${adminId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to delete admin account.');
    }
    return data;
  };

  // Fetch Dashboard Stats (Admin only)
  const fetchDashboardStats = async () => {
    const res = await fetch(`${API_BASE_URL}/stats`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      throw new Error('Failed to fetch dashboard stats.');
    }
    return await res.json();
  };

  return (
    <AdminAuthContext.Provider
      value={{
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
      }}
    >
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
