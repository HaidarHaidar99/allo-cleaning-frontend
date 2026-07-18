import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Inbox, Eye, Trash2, Clock, Check, AlertCircle, Phone, Mail, User } from 'lucide-react';
import Modal from '../../components/Modal';

const ManageForms = () => {
  const { token, getAuthHeaders, API_BASE_URL } = useAdminAuth();

  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Selected Form Details State
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);

  // Delete Confirmation State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [formToDelete, setFormToDelete] = useState(null);

  const loadForms = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/forms`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to load form submissions.');
      const data = await res.json();
      setForms(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadForms();
  }, []);

  const openDetailsModal = (form) => {
    setSelectedForm(form);
    setIsDetailsOpen(true);
  };

  const confirmDelete = (form) => {
    setFormToDelete(form);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!formToDelete) return;
    setError('');
    setSuccessMessage('');

    try {
      const res = await fetch(`${API_BASE_URL}/forms/${formToDelete.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete submission.');

      setSuccessMessage('Form submission deleted successfully!');
      setIsDeleteOpen(false);
      setFormToDelete(null);
      loadForms();
    } catch (err) {
      setError(err.message);
      setIsDeleteOpen(false);
    }
  };

  return (
    <div className="manage-forms animate-fade-in">
      <div className="admin-panel-card">
        <div className="panel-header-row">
          <div>
            <h2>Contact Form Submissions</h2>
            <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '4px' }}>View customer feedback and cleaning quote requests submitted via the contact form.</p>
          </div>
        </div>

        {successMessage && (
          <div className="alert alert-success" style={{ margin: '15px 0' }}>
            <Check size={16} />
            <span>{successMessage}</span>
          </div>
        )}

        {error && (
          <div className="alert alert-error" style={{ margin: '15px 0' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Forms Table */}
        {loading ? (
          <div className="loading-spinner-wrapper">
            <div className="spinner"></div>
          </div>
        ) : forms.length > 0 ? (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Client Name</th>
                  <th>Email Address</th>
                  <th>Phone Number</th>
                  <th>Submitted Date</th>
                  <th>Short Preview</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {forms.map((form) => (
                  <tr key={form.id}>
                    <td data-label="Name" className="font-bold">{form.fullName}</td>
                    <td data-label="Email">{form.email}</td>
                    <td data-label="Phone">{form.phoneNumber}</td>
                    <td data-label="Date">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--admin-text-light)' }}>
                        <Clock size={12} />
                        <span>{new Date(form.createdAt).toLocaleString()}</span>
                      </div>
                    </td>
                    <td data-label="Preview" style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {form.message}
                    </td>
                    <td className="td-actions">
                      <div className="table-action-btns">
                        <button 
                          className="btn btn-outline btn-small" 
                          onClick={() => openDetailsModal(form)} 
                          title="View Message Details"
                          style={{ padding: '6px 12px' }}
                        >
                          <Eye size={12} />
                        </button>
                        <button 
                          className="btn btn-danger btn-small" 
                          onClick={() => confirmDelete(form)} 
                          title="Delete Submission"
                          style={{ padding: '6px 12px' }}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--admin-text-light)' }}>
            <Inbox size={32} style={{ marginBottom: '10px', color: 'var(--admin-text-muted)' }} />
            <p>No customer contact forms have been submitted yet.</p>
          </div>
        )}
      </div>

      {/* Details View Modal */}
      <Modal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title="Form Submission Details"
      >
        {selectedForm && (
          <div className="form-details-view" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Metadata Info Panel */}
            <div className="contact-metadata-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px', padding: '16px', backgroundColor: 'var(--admin-bg)', borderRadius: '12px', border: '1px solid var(--admin-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <User size={16} className="text-cyan" />
                <span><strong>Name:</strong> {selectedForm.fullName}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={16} className="text-cyan" />
                <span><strong>Email:</strong> {selectedForm.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={16} className="text-cyan" />
                <span><strong>Phone:</strong> {selectedForm.phoneNumber}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Clock size={16} className="text-cyan" />
                <span><strong>Submitted:</strong> {new Date(selectedForm.createdAt).toLocaleString()}</span>
              </div>
            </div>

            {/* Message Body */}
            <div>
              <h3 style={{ fontSize: '1rem', marginBottom: '8px', color: 'var(--admin-text-main)' }}>Client Message</h3>
              <div style={{ padding: '16px 20px', border: '1px solid var(--admin-border)', borderRadius: '12px', backgroundColor: 'var(--admin-card-bg)', whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '0.95rem' }}>
                {selectedForm.message}
              </div>
            </div>

            {/* Action Footer */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
              <button className="btn btn-outline" onClick={() => setIsDetailsOpen(false)}>Close</button>
              <button 
                className="btn btn-danger" 
                onClick={() => {
                  setIsDetailsOpen(false);
                  confirmDelete(selectedForm);
                }}
              >
                <Trash2 size={16} />
                <span>Delete Message</span>
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Confirm Submission Deletion"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <p>Are you sure you want to delete the submission from <strong>{formToDelete?.fullName}</strong>? This action is permanent and cannot be undone.</p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button className="btn btn-outline" onClick={() => setIsDeleteOpen(false)}>Cancel</button>
            <button className="btn btn-danger" onClick={handleDelete} style={{ width: '160px', justifyContent: 'center' }}>
              <Trash2 size={16} />
              <span>Confirm Delete</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageForms;
