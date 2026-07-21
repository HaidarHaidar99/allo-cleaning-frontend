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
  const [description, setDescription] = useState('');
  const [imageBase64, setImageBase64] = useState('');
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
    setDescription('');
    setImageBase64('');
    setImagePreview('');
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (service) => {
    setIsEditMode(true);
    setSelectedServiceId(service.id);
    setName(service.name);
    setDescription(service.description);
    setImageBase64('');
    setImagePreview(service.imageBase64 || service.imageUrl || '');
    setError('');
    setIsModalOpen(true);
  };

  // Image Selection and Compression Handler (Base64)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Resize settings
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Compress to JPEG with 0.7 quality
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          setImageBase64(dataUrl);
          setImagePreview(dataUrl);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Create / Edit Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!name || !description) {
      setError('Name and description are required.');
      return;
    }

    if (!isEditMode && !imageBase64) {
      setError('Service image is required.');
      return;
    }

    const payload = {
      name,
      description,
    };
    
    if (imageBase64) {
      payload.imageBase64 = imageBase64;
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
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
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
  const getThumbnailUrl = (service) => {
    if (service.imageBase64) return service.imageBase64;
    if (service.imageUrl) {
      if (service.imageUrl.startsWith('http')) return service.imageUrl;
      return `${API_BASE_URL.replace('/api', '')}${service.imageUrl}`;
    }
    return 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=100&auto=format&fit=crop';
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
                  <th>Description Preview</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service.id}>
                    <td data-label="Image">
                      <img 
                        src={getThumbnailUrl(service)} 
                        alt={service.name} 
                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--admin-border)' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=100&auto=format&fit=crop';
                        }}
                      />
                    </td>
                    <td data-label="Name" className="font-bold">{service.name}</td>
                    <td data-label="Description" style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {service.description}
                    </td>
                    <td className="td-actions">
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
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--admin-text-light)' }}>
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

          {/* Image Upload Input */}
          <div className="form-group">
            <label>Service Image</label>
            <div className="image-upload-wrapper" style={{ border: '1.5px dashed var(--admin-border)', padding: '15px', borderRadius: '12px', textAlign: 'center', backgroundColor: 'var(--admin-bg)', position: 'relative' }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                required={!isEditMode}
              />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', color: 'var(--admin-text-light)' }}>
                <UploadCloud size={24} />
                <span style={{ fontSize: '0.8rem', fontWeight: 650 }}>{imageBase64 ? 'Image ready (Base64)' : 'Choose file or drag here'}</span>
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

export default ManageServices;
