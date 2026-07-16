import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { User, Key, Trash2, Check, AlertCircle, ShieldAlert, Eye, EyeOff, ShieldCheck, UserCheck } from 'lucide-react';
import Modal from '../../components/Modal';

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

const Profile = () => {
  const { 
    admin: currentAdmin, 
    updateAdminProfile, 
    updateAdminPassword, 
    deleteAdmin, 
    fetchAdmins,
    logout 
  } = useAdminAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Profile Details State
  const [fullName, setFullName] = useState(currentAdmin?.fullName || '');
  const [role, setRole] = useState(currentAdmin?.role || 'Admin');
  
  // Super Admin Role Transfer State
  const [otherAdmins, setOtherAdmins] = useState([]);
  const [transferOption, setTransferOption] = useState('existing'); // existing | new
  const [transferEmail, setTransferEmail] = useState('');
  
  // New Super Admin Account Info
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [showNewAdminPassword, setShowNewAdminPassword] = useState(false);

  // Password Change State
  const [oldPassword, setOldPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Load other admin accounts if current user is Super Admin
  useEffect(() => {
    if (currentAdmin?.role === 'Super Admin') {
      fetchAdmins()
        .then(data => {
          const list = data.filter(acc => acc.id !== currentAdmin.id);
          setOtherAdmins(list);
          if (list.length > 0) {
            setTransferEmail(list[0].email);
          }
        })
        .catch(err => console.error('Failed to load other admins:', err));
    }
  }, [currentAdmin]);

  // Sync role state when currentAdmin profile changes
  useEffect(() => {
    if (currentAdmin) {
      setRole(currentAdmin.role);
    }
  }, [currentAdmin]);

  // Update Profile Info / Role Transfer
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!fullName || fullName.trim() === '') {
      setError('Full name is required.');
      return;
    }

    const isDemotingSelf = currentAdmin.role === 'Super Admin' && role === 'Admin';
    const profileData = {
      fullName: fullName.trim(),
      role: role
    };

    if (isDemotingSelf) {
      profileData.transferOption = transferOption;
      if (transferOption === 'existing') {
        if (!transferEmail) {
          setError('Please select an existing admin account to transfer status.');
          return;
        }
        profileData.transferEmail = transferEmail;
      } else {
        if (!newAdminName || !newAdminEmail || !newAdminPassword) {
          setError('All details for the new Super Admin account are required.');
          return;
        }
        profileData.transferNewAdmin = {
          fullName: newAdminName.trim(),
          email: newAdminEmail.trim(),
          password: newAdminPassword
        };
      }
    }

    setLoading(true);
    try {
      const response = await updateAdminProfile(currentAdmin.id, profileData);
      if (response.roleTransferred) {
        setSuccessMessage('Super Admin status transferred. Your role is now Admin.');
      } else {
        setSuccessMessage('Profile details updated successfully.');
      }
      
      // Reset transfer states
      setNewAdminName('');
      setNewAdminEmail('');
      setNewAdminPassword('');
      setShowNewAdminPassword(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update Password
  const handleUpdatePassword = async (e) => {
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
      await updateAdminPassword(currentAdmin.id, oldPassword, newPassword);
      setSuccessMessage('Password updated successfully.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowOldPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete self account
  const handleDeleteAccount = async () => {
    setError('');
    setLoading(true);
    try {
      await deleteAdmin(currentAdmin.id);
      setIsDeleteModalOpen(false);
      logout();
    } catch (err) {
      setError(err.message);
      setIsDeleteModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="manage-admins animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Page Title */}
      <div style={{ textAlign: 'center' }}>
        <h2>My Profile Settings</h2>
        <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '4px' }}>
          Manage your personal details, secure your account, or delete your registration.
        </p>
      </div>

      {/* Dynamic Avatar */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0 10px 0' }}>
        <div 
          style={{
            backgroundColor: getAvatarColor(currentAdmin?.email),
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '2.5rem',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
          }}
        >
          {currentAdmin?.fullName ? currentAdmin.fullName.charAt(0).toUpperCase() : 'A'}
        </div>
      </div>

      {/* Global notifications */}
      {error && (
        <div className="alert alert-error">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success">
          <Check size={16} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* 1. Account Details Form */}
      <div className="admin-panel-card">
        <div className="panel-header-row" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <User className="text-cyan" size={20} />
            <h3 style={{ margin: 0 }}>Account Information</h3>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="admin-form" style={{ gridTemplateColumns: '1fr', marginTop: '20px' }}>
          <div className="form-group">
            <label>Email Address (Cannot change)</label>
            <input 
              type="text" 
              className="form-control" 
              value={currentAdmin?.email || ''} 
              disabled 
              style={{ backgroundColor: 'var(--bg-light)', color: 'var(--text-light)', cursor: 'not-allowed' }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="profName">Full Name</label>
            <input
              type="text"
              id="profName"
              className="form-control"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full Name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="profRole">Account Role</label>
            {currentAdmin?.role === 'Super Admin' ? (
              <select
                id="profRole"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="form-control"
                required
              >
                <option value="Super Admin">Super Admin</option>
                <option value="Admin">Admin (Demote self)</option>
              </select>
            ) : (
              <input 
                type="text" 
                id="profRole"
                className="form-control" 
                value={currentAdmin?.role || ''} 
                disabled 
                style={{ backgroundColor: 'var(--bg-light)', color: 'var(--text-light)', cursor: 'not-allowed' }}
              />
            )}
          </div>

          {/* Role Demotion Transfer Options */}
          {currentAdmin?.role === 'Super Admin' && role === 'Admin' && (
            <div style={{ padding: '20px', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '8px', backgroundColor: 'rgba(245, 158, 11, 0.05)', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <ShieldCheck className="text-green" size={20} />
                <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Transfer Super Admin Role</h4>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-medium)', lineHeight: 1.4, margin: 0 }}>
                There must always be a Super Admin. To demote your account to Admin, you must promote another administrator account.
              </p>

              {/* Toggle Options */}
              <div style={{ display: 'flex', gap: '20px', marginTop: '5px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="transferOpt" 
                    value="existing"
                    checked={transferOption === 'existing'}
                    onChange={() => setTransferOption('existing')} 
                  />
                  <span>Transfer to an existing admin</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="transferOpt" 
                    value="new" 
                    checked={transferOption === 'new'}
                    onChange={() => setTransferOption('new')}
                  />
                  <span>Create a new admin as Super Admin</span>
                </label>
              </div>

              {/* Transfer option: Existing admin */}
              {transferOption === 'existing' && (
                <div className="form-group" style={{ marginTop: '10px' }}>
                  <label htmlFor="existAdmin">Target Administrator Email</label>
                  <input
                    type="email"
                    id="existAdmin"
                    list="existingAdminsList"
                    value={transferEmail}
                    onChange={(e) => setTransferEmail(e.target.value)}
                    className="form-control"
                    placeholder="Target Administrator Email"
                    required
                  />
                  <datalist id="existingAdminsList">
                    {otherAdmins.map(acc => (
                      <option key={acc.id} value={acc.email}>
                        {acc.fullName}
                      </option>
                    ))}
                  </datalist>
                </div>
              )}

              {/* Transfer option: New admin */}
              {transferOption === 'new' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
                  <div className="form-group">
                    <label htmlFor="newAdminFullName">New Admin Full Name</label>
                    <input
                      type="text"
                      id="newAdminFullName"
                      className="form-control"
                      value={newAdminName}
                      onChange={(e) => setNewAdminName(e.target.value)}
                      placeholder="New Admin Full Name"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="newAdminEmail">New Admin Email Address</label>
                    <input
                      type="email"
                      id="newAdminEmail"
                      className="form-control"
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      placeholder="New Admin Email Address"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="newAdminPass">New Admin Temporary Password</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showNewAdminPassword ? 'text' : 'password'}
                        id="newAdminPass"
                        className="form-control"
                        value={newAdminPassword}
                        onChange={(e) => setNewAdminPassword(e.target.value)}
                        placeholder="New Admin Temporary Password"
                        required
                        style={{ paddingRight: '40px' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewAdminPassword(!showNewAdminPassword)}
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
                        {showNewAdminPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Check size={16} />
              <span>{loading ? 'Saving...' : 'Save Profile details'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Security (Change Password) Form */}
      <div className="admin-panel-card">
        <div className="panel-header-row" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Key className="text-cyan" size={20} />
            <h3 style={{ margin: 0 }}>Security Settings</h3>
          </div>
        </div>

        <form onSubmit={handleUpdatePassword} className="admin-form" style={{ gridTemplateColumns: '1fr', marginTop: '20px' }}>
          <div className="form-group">
            <label htmlFor="oldPass">Old Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showOldPassword ? 'text' : 'password'}
                id="oldPass"
                className="form-control"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
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
                  color: 'var(--text-light)',
                  padding: 0
                }}
              >
                {showOldPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="newPass">New Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showNewPassword ? 'text' : 'password'}
                id="newPass"
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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
                  color: 'var(--text-light)',
                  padding: 0
                }}
              >
                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPass">Confirm New Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPass"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                  color: 'var(--text-light)',
                  padding: 0
                }}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Check size={16} />
              <span>{loading ? 'Saving...' : 'Update Password'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 3. Danger Zone (Delete Account) Card */}
      <div className="admin-panel-card" style={{ border: '1px solid rgba(239, 68, 68, 0.2)' }}>
        <div className="panel-header-row" style={{ borderBottom: '1px solid rgba(239, 68, 68, 0.1)', paddingBottom: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Trash2 style={{ color: '#ef4444' }} size={20} />
            <h3 style={{ margin: 0, color: '#ef4444' }}>Danger Zone</h3>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', gap: '20px', flexWrap: 'wrap' }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Delete Administrator Account</h4>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'var(--text-light)', lineHeight: 1.4 }}>
              Deleting your account is permanent and cannot be undone. You will lose access immediately.
            </p>
          </div>
          <button 
            type="button" 
            className="btn btn-danger" 
            onClick={() => setIsDeleteModalOpen(true)}
            disabled={loading}
          >
            <Trash2 size={16} />
            <span>Delete Account</span>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Your Account?"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', color: '#b91c1c', backgroundColor: '#fee2e2', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <ShieldAlert size={20} style={{ flexShrink: 0 }} />
            <p style={{ fontSize: '0.85rem', fontWeight: 550, lineHeight: 1.4 }}>
              Are you sure you want to delete your administrator profile? This action will permanently remove your user access and log you out.
            </p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button className="btn btn-outline" onClick={() => setIsDeleteModalOpen(false)} disabled={loading}>Cancel</button>
            <button className="btn btn-danger" onClick={handleDeleteAccount} disabled={loading}>
              <Trash2 size={16} />
              <span>{loading ? 'Deleting...' : 'Confirm Delete'}</span>
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default Profile;
