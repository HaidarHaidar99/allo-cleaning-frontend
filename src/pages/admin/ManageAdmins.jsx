import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Users, Plus, Key, Trash2, Check, AlertCircle, Clock, ShieldAlert, ShieldCheck, ArrowRight, RefreshCw, Eye, EyeOff } from 'lucide-react';
import Modal from '../../components/Modal';

const ManageAdmins = () => {
  const { 
    admin: currentAdmin, 
    fetchAdmins, 
    createAdmin,
    updateAdminPassword, 
    deleteAdmin,
    logout
  } = useAdminAuth();

  const navigate = useNavigate();

  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form Modals State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // New Admin Signup Data
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('Admin');

  // Selected Admin State (For Password updates)
  const [selectedAdminId, setSelectedAdminId] = useState(null);
  const [selectedAdminName, setSelectedAdminName] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [adminToDelete, setAdminToDelete] = useState(null);

  const loadAdmins = async () => {
    setLoading(true);
    try {
      const data = await fetchAdmins();
      setAdmins(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentAdmin && currentAdmin.role !== 'Super Admin') {
      navigate('/admin/dashboard');
    } else {
      loadAdmins();
    }
  }, [currentAdmin, navigate]);

  const openAddModal = () => {
    setFullName('');
    setEmail('');
    setPassword('');
    setRole('Admin');
    setShowPassword(false);
    setError('');
    setIsAddModalOpen(true);
  };

  const openPasswordModal = (admin) => {
    setSelectedAdminId(admin.id);
    setSelectedAdminName(admin.fullName);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowOldPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setError('');
    setIsPasswordModalOpen(true);
  };

  const openDeleteModal = (admin) => {
    setAdminToDelete(admin);
    setError('');
    setIsDeleteModalOpen(true);
  };

  // Submit new admin details to create account directly
  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!fullName || !email || !password || !role) {
      setError('All fields are required.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      await createAdmin({ fullName, email, password, role });
      setSuccessMessage('Admin account created successfully!');
      setIsAddModalOpen(false);
      loadAdmins();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Password Update (Direct credentials change)
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!oldPassword) {
      setError('Old password is required.');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }

    setLoading(true);
    try {
      await updateAdminPassword(selectedAdminId, oldPassword, newPassword);
      setSuccessMessage(`Password for ${selectedAdminName} updated successfully.`);
      setIsPasswordModalOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Delete Admin
  const handleDelete = async () => {
    if (!adminToDelete) return;
    setError('');
    setSuccessMessage('');

    setLoading(true);
    try {
      await deleteAdmin(adminToDelete.id);
      setSuccessMessage(`Admin account for ${adminToDelete.fullName} deleted successfully.`);
      setIsDeleteModalOpen(false);
      const wasSelf = adminToDelete.id === currentAdmin.id;
      setAdminToDelete(null);
      
      if (wasSelf) {
        logout();
      } else {
        loadAdmins();
      }
    } catch (err) {
      setError(err.message);
      setIsDeleteModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="manage-admins animate-fade-in">
      <div className="admin-panel-card">
        <div className="panel-header-row">
          <div>
            <h2>Admin Account Management</h2>
            <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '4px' }}>Register new administrators, delete accounts, or update login credentials.</p>
          </div>
          <button className="btn btn-primary btn-small" onClick={openAddModal}>
            <Plus size={16} />
            <span>Add New Admin</span>
          </button>
        </div>

        {successMessage && !isAddModalOpen && (
          <div className="alert alert-success" style={{ margin: '15px 0' }}>
            <Check size={16} />
            <span>{successMessage}</span>
          </div>
        )}

        {error && !isAddModalOpen && !isPasswordModalOpen && !isDeleteModalOpen && (
          <div className="alert alert-error" style={{ margin: '15px 0' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Admins Table */}
        {loading && admins.length === 0 ? (
          <div className="loading-spinner-wrapper">
            <div className="spinner"></div>
          </div>
        ) : admins.length > 0 ? (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Email Address</th>
                  <th>Role</th>
                  <th>Created Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((acc) => (
                  <tr key={acc.id} style={acc.id === currentAdmin.id ? { backgroundColor: 'var(--admin-primary-light)' } : {}}>
                    <td data-label="Name" className="font-bold">
                      {acc.fullName} {acc.id === currentAdmin.id && <span style={{ fontSize: '0.7rem', color: 'var(--admin-primary)', fontStyle: 'italic' }}>(You)</span>}
                    </td>
                    <td data-label="Email">{acc.email}</td>
                    <td data-label="Role">
                      <span className={`badge ${acc.role === 'Super Admin' ? 'badge-green' : 'badge-cyan'}`}>
                        {acc.role}
                      </span>
                    </td>
                    <td data-label="Created">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--admin-text-light)' }}>
                        <Clock size={12} />
                        <span>{new Date(acc.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="td-actions">
                      <div className="table-action-btns">
                        {acc.id === currentAdmin.id && acc.role !== 'Super Admin' && (
                          <button 
                            className="btn btn-outline btn-small" 
                            onClick={() => openPasswordModal(acc)} 
                            title="Change Password"
                            style={{ padding: '6px 12px' }}
                          >
                            <Key size={12} />
                          </button>
                        )}
                        {(acc.id === currentAdmin.id || (currentAdmin && currentAdmin.role === 'Super Admin' && acc.id !== currentAdmin.id)) && (
                          <button 
                            className="btn btn-danger btn-small" 
                            onClick={() => openDeleteModal(acc)} 
                            title="Delete Admin"
                            style={{ padding: '6px 12px' }}
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--admin-text-light)' }}>
            No admin accounts found.
          </div>
        )}
      </div>

      {/* 1. Add Admin Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register New Administrator"
      >
        {error && (
          <div className="alert alert-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleAddAdmin} className="admin-form">
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="form-control"
              placeholder="Full Name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
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

          <div className="form-group">
            <label htmlFor="password">Temporary Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                placeholder="Temporary Password"
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
                  color: 'var(--admin-text-light)',
                  padding: 0
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="role">Account Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="form-control"
              required
            >
              <option value="Admin">Admin</option>
              {currentAdmin && currentAdmin.role === 'Super Admin' && (
                <option value="Super Admin">Super Admin</option>
              )}
            </select>
          </div>

          <div className="form-group full-width" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
            <button type="button" className="btn btn-outline" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <span>{loading ? 'Registering...' : 'Register Administrator'}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </form>
      </Modal>

      {/* 2. Change Password Modal */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title={`Change Password for ${selectedAdminName}`}
      >
        {error && (
          <div className="alert alert-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

         <form onSubmit={handlePasswordSubmit} className="admin-form" style={{ gridTemplateColumns: '1fr' }}>
          <div className="form-group">
            <label htmlFor="oldPassword">Old Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showOldPassword ? 'text' : 'password'}
                id="oldPassword"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="form-control"
                placeholder="Old Password"
                required
                style={{ paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
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
                  color: 'var(--admin-text-light)',
                  padding: 0
                }}
              >
                {showOldPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showNewPassword ? 'text' : 'password'}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="form-control"
                placeholder="New Password"
                required
                style={{ paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
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
                  color: 'var(--admin-text-light)',
                  padding: 0
                }}
              >
                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-control"
                placeholder="Confirm New Password"
                required
                style={{ paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                  color: 'var(--admin-text-light)',
                  padding: 0
                }}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
            <button type="button" className="btn btn-outline" onClick={() => setIsPasswordModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Check size={16} />
              <span>{loading ? 'Saving...' : 'Update Password'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* 3. Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Account Deletion"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', color: '#b91c1c', backgroundColor: '#fee2e2', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <ShieldAlert size={20} style={{ flexShrink: 0 }} />
            <p style={{ fontSize: '0.85rem', fontWeight: 550, lineHeight: 1.4 }}>
              WARNING: You are deleting the administrator account for <strong>{adminToDelete?.fullName}</strong> ({adminToDelete?.email}). They will immediately lose access to the system.
            </p>
          </div>
          <p>Are you sure you want to proceed with this account deletion? This action is permanent.</p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button className="btn btn-outline" onClick={() => setIsDeleteModalOpen(false)} disabled={loading}>Cancel</button>
            <button className="btn btn-danger" onClick={handleDelete} disabled={loading}>
              <Trash2 size={16} />
              <span>{loading ? 'Deleting...' : 'Confirm Delete'}</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageAdmins;
