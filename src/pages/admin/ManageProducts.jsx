import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Plus, Edit2, Trash2, X, Check, AlertCircle, UploadCloud } from 'lucide-react';
import Modal from '../../components/Modal';

const ManageProducts = () => {
  const { token, API_BASE_URL } = useAdminAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // Delete Confirmation State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Fetch all products
  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/products`);

      // Defensive check: ensure server returned JSON, not HTML
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Backend API is not reachable. Please ensure the backend server is running.');
      }

      if (!res.ok) throw new Error('Failed to load products.');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openAddModal = () => {
    setIsEditMode(false);
    setSelectedProductId(null);
    setName('');
    setCategory('');
    setDescription('');
    setPrice('');
    setImageFile(null);
    setImagePreview('');
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setIsEditMode(true);
    setSelectedProductId(product.id);
    setName(product.name);
    setCategory(product.category);
    setDescription(product.description);
    setPrice(product.price !== null && product.price !== undefined ? product.price : '');
    setImageFile(null);
    setImagePreview(product.imageUrl ? (product.imageUrl.startsWith('http') ? product.imageUrl : `${API_BASE_URL.replace('/api', '')}${product.imageUrl}`) : '');
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
      setError('Product image file is required.');
      return;
    }

    // Build FormData object
    const formData = new FormData();
    formData.append('name', name);
    formData.append('category', category);
    formData.append('description', description);
    if (price) {
      formData.append('price', price);
    } else {
      formData.append('price', '');
    }
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const url = isEditMode 
        ? `${API_BASE_URL}/products/${selectedProductId}` 
        : `${API_BASE_URL}/products`;
        
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      // Defensive check for HTML response
      const responseContentType = response.headers.get('content-type');
      if (!responseContentType || !responseContentType.includes('application/json')) {
        throw new Error('Backend API returned an unexpected response. Please check that the server is running.');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save product.');
      }

      setSuccessMessage(isEditMode ? 'Product updated successfully!' : 'Product created successfully!');
      setIsModalOpen(false);
      loadProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete Action Handlers
  const confirmDelete = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/products/${productToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete product.');
      }

      setSuccessMessage('Product deleted successfully!');
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
      loadProducts();
    } catch (err) {
      setError(err.message);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="manage-services animate-fade-in">
      <div className="admin-panel-card">
        {/* Header Section */}
        <div className="panel-header-row">
          <div>
            <h2>Manage Cleaning Products</h2>
            <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '4px' }}>
              Add, update, or remove products from the public catalog.
            </p>
          </div>
          <button className="btn btn-primary" onClick={openAddModal}>
            <Plus size={18} />
            <span>Add Product</span>
          </button>
        </div>

        {/* Global Action Alerts */}
        {successMessage && (
          <div className="alert alert-success" style={{ marginBottom: '25px' }}>
            <Check size={18} />
            <span>{successMessage}</span>
          </div>
        )}

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '25px' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Products Grid / Table View */}
        {loading ? (
          <div className="loading-spinner-wrapper">
            <div className="spinner"></div>
          </div>
        ) : products.length > 0 ? (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td data-label="Image">
                      <img 
                        src={product.imageUrl ? (product.imageUrl.startsWith('http') ? product.imageUrl : `${API_BASE_URL.replace('/api', '')}${product.imageUrl}`) : 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=100&auto=format&fit=crop'} 
                        alt={product.name} 
                        style={{ width: '45px', height: '45px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--admin-border)' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=100&auto=format&fit=crop';
                        }}
                      />
                    </td>
                    <td data-label="Name" style={{ fontWeight: '700' }}>{product.name}</td>
                    <td data-label="Category">
                      <span className="badge" style={{ backgroundColor: 'var(--admin-badge-bg)', color: 'var(--admin-badge-text)', border: '1px solid var(--admin-badge-border)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                        {product.category}
                      </span>
                    </td>
                    <td data-label="Description" style={{ maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--admin-text-light)' }}>
                      {product.description}
                    </td>
                    <td data-label="Price" style={{ fontWeight: '800' }}>
                      {product.price !== null && product.price !== undefined && parseFloat(product.price) > 0 
                        ? `$${parseFloat(product.price).toFixed(2)}` 
                        : 'Contact Us'}
                    </td>
                    <td className="td-actions">
                      <div className="table-action-btns">
                        <button 
                          className="btn btn-outline btn-small"
                          onClick={() => openEditModal(product)}
                        >
                          <Edit2 size={14} />
                          <span>Edit</span>
                        </button>
                        <button 
                          className="btn btn-danger btn-small"
                          onClick={() => confirmDelete(product)}
                        >
                          <Trash2 size={14} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '50px', border: '1.5px dashed var(--admin-border)', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>No Products Available</h3>
            <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '20px' }}>Get started by adding your first product to the catalog.</p>
            <button className="btn btn-primary btn-small" onClick={openAddModal}>
              <Plus size={16} />
              <span>Add Product</span>
            </button>
          </div>
        )}
      </div>

      {/* 1. Modal: Add / Edit Product */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={isEditMode ? 'Edit Product' : 'Add New Product'}
      >
        {error && (
          <div className="alert alert-error" style={{ marginBottom: '15px' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label htmlFor="productName">Product Name</label>
            <input
              type="text"
              id="productName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              placeholder="Product Name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="productCategory">Category</label>
            <input
              type="text"
              id="productCategory"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-control"
              placeholder="Category"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="productPrice">Price ($) (Optional)</label>
            <input
              type="number"
              id="productPrice"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="form-control"
              placeholder="Price ($)"
            />
          </div>

          {/* Image Upload Input */}
          <div className="form-group">
            <label>Product Image</label>
            <div className="image-upload-wrapper" style={{ border: '1.5px dashed var(--admin-border)', padding: '15px', borderRadius: '10px', textAlign: 'center', backgroundColor: 'var(--admin-bg)', position: 'relative' }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
              />
              <UploadCloud size={32} style={{ color: 'var(--admin-text-muted)', marginBottom: '8px' }} />
              <p style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Click or Drag Image Here</p>
              <p className="text-muted" style={{ fontSize: '0.7rem', marginTop: '2px' }}>PNG, JPG, JPEG or WEBP (Max. 5MB)</p>
            </div>
            {imagePreview && (
              <div style={{ marginTop: '12px', textAlign: 'center' }}>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  style={{ maxHeight: '100px', borderRadius: '6px', border: '1px solid var(--admin-border)' }} 
                />
              </div>
            )}
          </div>

          <div className="form-group full-width">
            <label htmlFor="productDescription">Description</label>
            <textarea
              id="productDescription"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-control"
              placeholder="Provide a detailed description of the product..."
              required
              style={{ resize: 'vertical' }}
            />
          </div>

          <div className="form-group full-width" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '15px' }}>
            <button 
              type="button" 
              className="btn btn-outline" 
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
            >
              {isEditMode ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </Modal>

      {/* 2. Modal: Delete Confirmation */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
      >
        <div style={{ padding: '10px 0' }}>
          <p style={{ fontSize: '0.95rem', marginBottom: '20px', lineHeight: '1.5' }}>
            Are you sure you want to delete the product <strong>{productToDelete?.name}</strong>? This action is permanent and will remove the product from the catalog.
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button className="btn btn-outline" onClick={() => setIsDeleteModalOpen(false)} disabled={loading}>Cancel</button>
            <button className="btn btn-danger" onClick={handleDelete} disabled={loading} style={{ width: '160px', justifyContent: 'center' }}>
              <Trash2 size={16} />
              <span>{loading ? 'Deleting...' : 'Confirm Delete'}</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageProducts;
