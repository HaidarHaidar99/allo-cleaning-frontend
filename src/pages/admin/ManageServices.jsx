import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Plus, Edit2, Trash2, X, Check, AlertCircle, UploadCloud } from 'lucide-react';
import Modal from '../../components/Modal';

const ManageServices = () => {
  const { token, API_BASE_URL } = useAdminAuth();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // Delete Confirmation State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  // Fetch all services
  const loadServices = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/services`);
      if (!res.ok) throw new Error('Failed to load services.');
      const data = await res.json();
      setServices(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const openAddModal = () => {
    setIsEditMode(false);
    setSelectedServiceId(null);
    setName('');
    setCategory('');
    setDescription('');
    setPrice('');
    setImageFile(null);
    setImagePreview('');
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (service) => {
    setIsEditMode(true);
    setSelectedServiceId(service.id);
    setName(service.name);
    setCategory(service.category);
    setDescription(service.description);
    setPrice(service.price);
    setImageFile(null);
    setImagePreview(service.imageUrl ? `${API_BASE_URL.replace('/api', '')}${service.imageUrl}` : '');
    setError('');
    setIsModalOpen(true);
  };

  // Image Selection Handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle Create / Edit Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!name || !category || !description) {
      setError('Name, category, and description are required.');
      return;
    }

    if (!isEditMode && !imageFile) {
      setError('Service image file is required.');
      return;
    }

    // Build FormData object
    const formData = new FormData();
    formData.append('name', name);
    formData.append('category', category);
    formData.append('description', description);
    formData.append('price', price);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const url = isEditMode 
        ? `${API_BASE_URL}/services/${selectedServiceId}` 
        : `${API_BASE_URL}/services`;
        
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          // Note: Do NOT set Content-Type header when sending FormData!
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save service.');
      }

      setSuccessMessage(isEditMode ? 'Service updated successfully!' : 'Service created successfully!');
      setIsModalOpen(false);
      loadServices(); // reload services list
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete Action Handlers
  const confirmDelete = (service) => {
    setServiceToDelete(service);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!serviceToDelete) return;
    setError('');
    setSuccessMessage('');

    try {
      const res = await fetch(`${API_BASE_URL}/services/${serviceToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete service.');

      setSuccessMessage('Service deleted successfully!');
      setIsDeleteModalOpen(false);
      setServiceToDelete(null);
      loadServices();
    } catch (err) {
      setError(err.message);
      setIsDeleteModalOpen(false);
    }
  };

  // Helper to render image thumbnails in table
  const getThumbnailUrl = (imageUrl) => {
    if (!imageUrl) return '/uploads/logo.jpg';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${API_BASE_URL.replace('/api', '')}${imageUrl}`;
  };

  return (
    <div className="manage-services">
      {/* 1. Header panel card */}
      <div className="admin-panel-card">
        <div className="panel-header-row">
          <div>
            <h2>Service Catalog Management</h2>
            <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '4px' }}>Add, edit, or delete the cleaning packages offered on the website.</p>
          </div>
          <button className="btn btn-primary btn-small" onClick={openAddModal}>
            <Plus size={16} />
            <span>Add New Service</span>
          </button>
        </div>

        {successMessage && (
          <div className="alert alert-success" style={{ margin: '15px 0' }}>
            <Check size={16} />
            <span>{successMessage}</span>
          </div>
        )}

        {error && !isModalOpen && (
          <div className="alert alert-error" style={{ margin: '15px 0' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Services Table */}
        {loading ? (
          <div className="loading-spinner-wrapper">
            <div className="spinner"></div>
          </div>
        ) : services.length > 0 ? (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Service Name</th>
                  <th>Category</th>
                  <th>Description Preview</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service.id}>
                    <td data-label="Image">
                      <img 
                        src={getThumbnailUrl(service.imageUrl)} 
                        alt={service.name} 
                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--admin-border)' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=100&auto=format&fit=crop';
                        }}
                      />
                    </td>
                    <td data-label="Name" className="font-bold">{service.name}</td>
                    <td data-label="Category"><span className="badge badge-cyan">{service.category}</span></td>
                    <td data-label="Description" style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {service.description}
                    </td>
                    <td data-label="Price" className="font-bold">${parseFloat(service.price || 0).toFixed(2)}</td>
                    <td data-label="">
                      <div className="table-action-btns">
                        <button className="btn btn-outline btn-small" onClick={() => openEditModal(service)} style={{ padding: '6px 12px' }}>
                          <Edit2 size={12} />
                        </button>
                        <button className="btn btn-danger btn-small" onClick={() => confirmDelete(service)} style={{ padding: '6px 12px' }}>
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
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-light)' }}>
            No cleaning services registered yet. Click "Add New Service" to start!
          </div>
        )}
      </div>

      {/* 2. Add / Edit Modal Form */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={isEditMode ? 'Edit Cleaning Service' : 'Add New Cleaning Service'}
      >
        {error && (
          <div className="alert alert-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label htmlFor="serviceName">Service Name</label>
            <input
              type="text"
              id="serviceName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              placeholder="Service Name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="serviceCategory">Category</label>
            <input
              type="text"
              id="serviceCategory"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-control"
              placeholder="Category"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="servicePrice">Price ($) (Optional)</label>
            <input
              type="number"
              id="servicePrice"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="form-control"
              placeholder="Price ($)"
            />
          </div>

          {/* Image Upload Input */}
          <div className="form-group">
            <label>Service Image</label>
            <div className="image-upload-wrapper" style={{ border: '1.5px dashed var(--border-color)', padding: '15px', borderRadius: 'var(--radius-md)', textAlign: 'center', backgroundColor: 'var(--bg-light)', position: 'relative' }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                required={!isEditMode}
              />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', color: 'var(--text-light)' }}>
                <UploadCloud size={24} />
                <span style={{ fontSize: '0.8rem', fontWeight: 650 }}>{imageFile ? imageFile.name : 'Choose file or drag here'}</span>
              </div>
            </div>
          </div>

          <div className="form-group full-width">
            <label htmlFor="serviceDescription">Service Description</label>
            <textarea
              id="serviceDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-control"
              placeholder="Service Description"
              required
            />
          </div>

          {imagePreview && (
            <div className="form-group full-width text-center">
              <label>Image Preview</label>
              <img 
                src={imagePreview} 
                alt="Preview" 
                style={{ maxWidth: '100%', maxHeight: '180px', objectFit: 'contain', borderRadius: '6px', border: '1px solid var(--border-color)', marginTop: '8px' }} 
              />
            </div>
          )}

          <div className="form-group full-width" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
            <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              <Check size={16} />
              <span>{isEditMode ? 'Save Changes' : 'Create Service'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* 3. Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Service Deletion"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <p>Are you sure you want to delete the service <strong>{serviceToDelete?.name}</strong>? This action is permanent and will remove the service from the database and the customer page catalog.</p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button className="btn btn-outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
            <button className="btn btn-danger" onClick={handleDelete}>
              <Trash2 size={16} />
              <span>Confirm Delete</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageServices;
