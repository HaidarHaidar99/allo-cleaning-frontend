import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useSettings } from '../../context/SettingsContext';
import { 
  Settings, Save, Globe, Smartphone, Mail, MapPin, 
  Layout, Star, MessageSquare, AlertCircle, Check, Camera, Image as ImageIcon, Eye, EyeOff, Plus
} from 'lucide-react';

const Facebook = ({ size = 24, className = '', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);


const ManageSettings = () => {
  const { token } = useAdminAuth();
  const { settings, refreshSettings, updateGlobalSettings } = useSettings();

  const [activeTab, setActiveTab] = useState('contact');
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    whatsapp: '',
    email: '',
    phone: '',
    address: '',
    instagram: '',
    facebook: '',
    heroTag: '',
    heroTitle: '',
    heroDescription: '',
    stat1Number: '',
    stat1Label: '',
    stat2Number: '',
    stat2Label: '',
    stat3Number: '',
    stat3Label: '',
    stat4Number: '',
    stat4Label: '',
    contactTitle: '',
    contactDescription: '',
    heroImageBase64: '',
    heroImage2: '',
    heroImage3: '',
    heroMode: 'single',
    offers: [],
    activePages: {
      home: true,
      products: true,
      services: true,
      contact: true
    }
  });

  // Populate form with current settings
  useEffect(() => {
    if (settings) {
      setFormData({
        whatsapp: settings.whatsapp || '',
        email: settings.email || '',
        phone: settings.phone || '',
        address: settings.address || '',
        instagram: settings.instagram || '',
        facebook: settings.facebook || '',
        heroTag: settings.heroTag || '',
        heroTitle: settings.heroTitle || '',
        heroDescription: settings.heroDescription || '',
        stat1Number: settings.stat1Number || '',
        stat1Label: settings.stat1Label || '',
        stat2Number: settings.stat2Number || '',
        stat2Label: settings.stat2Label || '',
        stat3Number: settings.stat3Number || '',
        stat3Label: settings.stat3Label || '',
        stat4Number: settings.stat4Number || '',
        stat4Label: settings.stat4Label || '',
        contactTitle: settings.contactTitle || '',
        contactDescription: settings.contactDescription || '',
        heroImageBase64: settings.heroImageBase64 || '',
        heroImage2: settings.heroImage2 || '',
        heroImage3: settings.heroImage3 || '',
        heroMode: settings.heroMode || 'single',
        offers: settings.offers || [],
        activePages: settings.activePages || {
          home: true,
          products: true,
          services: true,
          contact: true
        }
      });
    }
  }, [settings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePageToggle = (pageName) => {
    setFormData(prev => ({
      ...prev,
      activePages: {
        ...prev.activePages,
        [pageName]: !prev.activePages[pageName]
      }
    }));
  };

  // Canvas Image Compression for Hero Background
  const handleSlotImageChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const MAX_WIDTH = 1920;
          const MAX_HEIGHT = 1080;
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
          
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          setFormData(prev => ({ ...prev, [fieldName]: dataUrl }));
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const MAX_WIDTH = 1920; // Allow larger for background
          const MAX_HEIGHT = 1080;
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
          
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          setFormData(prev => ({ ...prev, heroImageBase64: dataUrl }));
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccessMessage('');

    const result = await updateGlobalSettings(formData, token);

    if (result.success) {
      setSuccessMessage('Global website configurations updated successfully!');
      refreshSettings();
    } else {
      setError(result.error || 'Failed to update settings. Please try again.');
    }
    setSaving(false);
  };

  return (
    <div className="manage-settings animate-fade-in">
      <div className="admin-panel-card">
        {/* Header */}
        <div className="panel-header-row" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '15px' }}>
          <div>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Settings className="text-cyan animate-spin-slow" size={24} />
              <span>Global Settings Manager</span>
            </h2>
            <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '4px' }}>
              Configure and modify live details, texts, titles, links, and content blocks across customer-facing pages.
            </p>
          </div>
        </div>

        {/* Alerts */}
        {successMessage && (
          <div className="alert alert-success" style={{ marginTop: '20px' }}>
            <Check size={18} />
            <span>{successMessage}</span>
          </div>
        )}

        {error && (
          <div className="alert alert-error" style={{ marginTop: '20px' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Tab Selection */}
        <div className="settings-tabs-container">
          <button 
            className={`settings-tab-btn ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => setActiveTab('contact')}
          >
            <Globe size={16} />
            <span>Contact & Socials</span>
          </button>
          <button 
            className={`settings-tab-btn ${activeTab === 'hero' ? 'active' : ''}`}
            onClick={() => setActiveTab('hero')}
          >
            <Layout size={16} />
            <span>Hero & Statistics</span>
          </button>
          <button 
            className={`settings-tab-btn ${activeTab === 'contact-page' ? 'active' : ''}`}
            onClick={() => setActiveTab('contact-page')}
          >
            <MessageSquare size={16} />
            <span>Contact Page Content</span>
          </button>
          <button 
            className={`settings-tab-btn ${activeTab === 'pages' ? 'active' : ''}`}
            onClick={() => setActiveTab('pages')}
            type="button"
          >
            <Eye size={16} />
            <span>Page Visibility</span>
          </button>
          <button 
            className={`settings-tab-btn ${activeTab === 'offers' ? 'active' : ''}`}
            onClick={() => setActiveTab('offers')}
            type="button"
          >
            <AlertCircle size={16} />
            <span>Special Offers</span>
          </button>
        </div>

        {/* Settings Form */}
        <form onSubmit={handleSubmit} style={{ marginTop: '30px' }}>
          
          {/* Tab 1: Contact & Social Info */}
          {activeTab === 'contact' && (
            <div className="settings-form-section animate-fade-in">
              <h3 className="settings-section-title">Contact Information & Links</h3>
              <p className="settings-section-desc">Manage your business telephone, email support, physical address, and social platform accounts (WhatsApp, Instagram, Facebook).</p>
              
              <div className="admin-form">
                <div className="form-group">
                  <label htmlFor="whatsapp">WhatsApp Number / Link</label>
                  <div className="input-with-icon">
                    <Smartphone size={16} className="input-icon" />
                    <input 
                      type="text" 
                      id="whatsapp" 
                      name="whatsapp" 
                      value={formData.whatsapp} 
                      onChange={handleChange} 
                      className="form-control"
                      placeholder="e.g. 15550192834 or https://wa.me/..."
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <div className="input-with-icon">
                    <Mail size={16} className="input-icon" />
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      className="form-control"
                      placeholder="info@allocleaning.com"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Display Phone Number</label>
                  <div className="input-with-icon">
                    <Smartphone size={16} className="input-icon" />
                    <input 
                      type="text" 
                      id="phone" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange} 
                      className="form-control"
                      placeholder="+1 (555) 019-2834"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="instagram">Instagram Profile URL</label>
                  <div className="input-with-icon">
                    <Camera size={16} className="input-icon" />
                    <input 
                      type="url" 
                      id="instagram" 
                      name="instagram" 
                      value={formData.instagram} 
                      onChange={handleChange} 
                      className="form-control"
                      placeholder="https://instagram.com/allocleaning"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="facebook">Facebook Page URL</label>
                  <div className="input-with-icon">
                    <Facebook size={16} className="input-icon" />
                    <input 
                      type="url" 
                      id="facebook" 
                      name="facebook" 
                      value={formData.facebook} 
                      onChange={handleChange} 
                      className="form-control"
                      placeholder="https://facebook.com/allocleaning"
                    />
                  </div>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="address">Office Address</label>
                  <div className="input-with-icon">
                    <MapPin size={16} className="input-icon" />
                    <input 
                      type="text" 
                      id="address" 
                      name="address" 
                      value={formData.address} 
                      onChange={handleChange} 
                      className="form-control"
                      placeholder="123 Sparkle Way, Clean City"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Homepage Hero & Stats */}
          {activeTab === 'hero' && (
            <div className="settings-form-section animate-fade-in">
              <h3 className="settings-section-title">Hero Section & Company Statistics</h3>
              <p className="settings-section-desc">Personalize your main landing page titles, tagline descriptions, and the four animated KPI stats grids.</p>
              
              <div className="admin-form">
                <div className="form-group">
                  <label htmlFor="heroTag">Hero Badge Tagline</label>
                  <input 
                    type="text" 
                    id="heroTag" 
                    name="heroTag" 
                    value={formData.heroTag} 
                    onChange={handleChange} 
                    className="form-control"
                    placeholder="Sparkling Clean, Guaranteed"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="heroTitle">Hero Title Text</label>
                  <input 
                    type="text" 
                    id="heroTitle" 
                    name="heroTitle" 
                    value={formData.heroTitle} 
                    onChange={handleChange} 
                    className="form-control"
                    placeholder="Professional Cleaning Services"
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="heroDescription">Hero Paragraph Description</label>
                  <textarea 
                    id="heroDescription" 
                    name="heroDescription" 
                    value={formData.heroDescription} 
                    onChange={handleChange} 
                    className="form-control"
                    placeholder="Experience the joy of a spotless environment..."
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="heroMode">Hero Image Mode</label>
                  <select 
                    id="heroMode"
                    name="heroMode"
                    value={formData.heroMode || 'single'}
                    onChange={handleChange}
                    className="form-control"
                    style={{ marginBottom: '20px' }}
                  >
                    <option value="single">Single Background Image (Slot 1 Only)</option>
                    <option value="carousel">Carousel Slide (Slot 1, 2, and 3 - Rotates every 3s)</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Hero Background Image Slots (Base64 compressed)</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginTop: '10px' }}>
                    {/* Slot 1 */}
                    <div style={{ backgroundColor: 'var(--admin-bg)', border: '1px solid var(--admin-border)', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase', color: 'var(--admin-text-main)' }}>Image Slot 1</span>
                      <div className="image-upload-wrapper" style={{ border: '1.5px dashed var(--admin-border)', padding: '10px', borderRadius: '8px', width: '100%', height: '80px', textAlign: 'center', backgroundColor: '#ffffff', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleSlotImageChange(e, 'heroImageBase64')}
                          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                        />
                        <ImageIcon size={20} style={{ color: 'var(--admin-text-muted)', marginBottom: '4px' }} />
                        <span style={{ fontSize: '0.65rem', fontWeight: 'bold' }}>{formData.heroImageBase64 ? 'Change' : 'Upload'}</span>
                      </div>
                      {formData.heroImageBase64 && (
                        <div style={{ marginTop: '8px', width: '100%', position: 'relative', textAlign: 'center' }}>
                          <img src={formData.heroImageBase64} alt="Preview 1" style={{ width: '100%', height: '60px', borderRadius: '4px', objectFit: 'cover' }} />
                          <button type="button" onClick={() => setFormData(prev => ({ ...prev, heroImageBase64: '' }))} style={{ position: 'absolute', top: '2px', right: '2px', backgroundColor: '#ef4444', color: '#ffffff', border: 'none', borderRadius: '50%', width: '16px', height: '16px', fontSize: '9px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                        </div>
                      )}
                    </div>

                    {/* Slot 2 */}
                    <div style={{ backgroundColor: 'var(--admin-bg)', border: '1px solid var(--admin-border)', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase', color: 'var(--admin-text-main)' }}>Image Slot 2</span>
                      <div className="image-upload-wrapper" style={{ border: '1.5px dashed var(--admin-border)', padding: '10px', borderRadius: '8px', width: '100%', height: '80px', textAlign: 'center', backgroundColor: '#ffffff', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleSlotImageChange(e, 'heroImage2')}
                          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                        />
                        <ImageIcon size={20} style={{ color: 'var(--admin-text-muted)', marginBottom: '4px' }} />
                        <span style={{ fontSize: '0.65rem', fontWeight: 'bold' }}>{formData.heroImage2 ? 'Change' : 'Upload'}</span>
                      </div>
                      {formData.heroImage2 && (
                        <div style={{ marginTop: '8px', width: '100%', position: 'relative', textAlign: 'center' }}>
                          <img src={formData.heroImage2} alt="Preview 2" style={{ width: '100%', height: '60px', borderRadius: '4px', objectFit: 'cover' }} />
                          <button type="button" onClick={() => setFormData(prev => ({ ...prev, heroImage2: '' }))} style={{ position: 'absolute', top: '2px', right: '2px', backgroundColor: '#ef4444', color: '#ffffff', border: 'none', borderRadius: '50%', width: '16px', height: '16px', fontSize: '9px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                        </div>
                      )}
                    </div>

                    {/* Slot 3 */}
                    <div style={{ backgroundColor: 'var(--admin-bg)', border: '1px solid var(--admin-border)', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase', color: 'var(--admin-text-main)' }}>Image Slot 3</span>
                      <div className="image-upload-wrapper" style={{ border: '1.5px dashed var(--admin-border)', padding: '10px', borderRadius: '8px', width: '100%', height: '80px', textAlign: 'center', backgroundColor: '#ffffff', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleSlotImageChange(e, 'heroImage3')}
                          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                        />
                        <ImageIcon size={20} style={{ color: 'var(--admin-text-muted)', marginBottom: '4px' }} />
                        <span style={{ fontSize: '0.65rem', fontWeight: 'bold' }}>{formData.heroImage3 ? 'Change' : 'Upload'}</span>
                      </div>
                      {formData.heroImage3 && (
                        <div style={{ marginTop: '8px', width: '100%', position: 'relative', textAlign: 'center' }}>
                          <img src={formData.heroImage3} alt="Preview 3" style={{ width: '100%', height: '60px', borderRadius: '4px', objectFit: 'cover' }} />
                          <button type="button" onClick={() => setFormData(prev => ({ ...prev, heroImage3: '' }))} style={{ position: 'absolute', top: '2px', right: '2px', backgroundColor: '#ef4444', color: '#ffffff', border: 'none', borderRadius: '50%', width: '16px', height: '16px', fontSize: '9px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stats row */}
                <div className="form-group full-width" style={{ marginTop: '20px' }}>
                  <h4 style={{ fontSize: '1rem', marginBottom: '15px', color: 'var(--admin-text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Star size={16} className="text-cyan" />
                    <span>Company Statistics Widgets</span>
                  </h4>
                  
                  <div className="stats-edit-grid">
                    <div className="stat-edit-box glass-card">
                      <h5>Stat Card 1</h5>
                      <input 
                        type="text" 
                        name="stat1Number" 
                        value={formData.stat1Number} 
                        onChange={handleChange} 
                        className="form-control" 
                        placeholder="Number (e.g. 5,000+)"
                        required
                      />
                      <input 
                        type="text" 
                        name="stat1Label" 
                        value={formData.stat1Label} 
                        onChange={handleChange} 
                        className="form-control" 
                        placeholder="Label (e.g. Happy Customers)"
                        required
                      />
                    </div>

                    <div className="stat-edit-box glass-card">
                      <h5>Stat Card 2</h5>
                      <input 
                        type="text" 
                        name="stat2Number" 
                        value={formData.stat2Number} 
                        onChange={handleChange} 
                        className="form-control" 
                        placeholder="Number (e.g. 12,000+)"
                        required
                      />
                      <input 
                        type="text" 
                        name="stat2Label" 
                        value={formData.stat2Label} 
                        onChange={handleChange} 
                        className="form-control" 
                        placeholder="Label (e.g. Completed Jobs)"
                        required
                      />
                    </div>

                    <div className="stat-edit-box glass-card">
                      <h5>Stat Card 3</h5>
                      <input 
                        type="text" 
                        name="stat3Number" 
                        value={formData.stat3Number} 
                        onChange={handleChange} 
                        className="form-control" 
                        placeholder="Number (e.g. 150+)"
                        required
                      />
                      <input 
                        type="text" 
                        name="stat3Label" 
                        value={formData.stat3Label} 
                        onChange={handleChange} 
                        className="form-control" 
                        placeholder="Label (e.g. Vetted Cleaners)"
                        required
                      />
                    </div>

                    <div className="stat-edit-box glass-card">
                      <h5>Stat Card 4</h5>
                      <input 
                        type="text" 
                        name="stat4Number" 
                        value={formData.stat4Number} 
                        onChange={handleChange} 
                        className="form-control" 
                        placeholder="Number (e.g. 100%)"
                        required
                      />
                      <input 
                        type="text" 
                        name="stat4Label" 
                        value={formData.stat4Label} 
                        onChange={handleChange} 
                        className="form-control" 
                        placeholder="Label (e.g. Satisfaction Rate)"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Contact Page Texts */}
          {activeTab === 'contact-page' && (
            <div className="settings-form-section animate-fade-in">
              <h3 className="settings-section-title">Contact Us Page Layout</h3>
              <p className="settings-section-desc">Modify specific textual greetings and context descriptions rendered on the client contact route.</p>
              
              <div className="admin-form">
                <div className="form-group full-width">
                  <label htmlFor="contactTitle">Contact Header Title</label>
                  <input 
                    type="text" 
                    id="contactTitle" 
                    name="contactTitle" 
                    value={formData.contactTitle} 
                    onChange={handleChange} 
                    className="form-control"
                    placeholder="Contact Our Support Team"
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="contactDescription">Contact Subtitle description</label>
                  <textarea 
                    id="contactDescription" 
                    name="contactDescription" 
                    value={formData.contactDescription} 
                    onChange={handleChange} 
                    className="form-control"
                    placeholder="Have questions about our packages or need a custom cleanup quote? Leave us a message..."
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Page Visibility Flags */}
          {activeTab === 'pages' && (
            <div className="settings-form-section animate-fade-in">
              <h3 className="settings-section-title">Page Visibility Settings</h3>
              <p className="settings-section-desc">Activate or deactivate public pages. Deactivating a page hides it from the user navigation, but data remains safe in the database.</p>
              
              <div className="admin-form" style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '400px' }}>
                {Object.keys(formData.activePages).map(page => (
                  <div key={page} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px', backgroundColor: 'var(--admin-bg)', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
                    <span style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{page} Page</span>
                    <button
                      type="button"
                      onClick={() => handlePageToggle(page)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        backgroundColor: formData.activePages[page] ? '#10b981' : 'var(--border-color)',
                        color: formData.activePages[page] ? '#000000' : 'var(--text-muted)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {formData.activePages[page] ? <Eye size={16} /> : <EyeOff size={16} />}
                      {formData.activePages[page] ? 'Active' : 'Hidden'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 5: Special Offers Banner */}
          {activeTab === 'offers' && (
            <div className="settings-form-section animate-fade-in">
              <h3 className="settings-section-title">Special Offers Top Banner</h3>
              <p className="settings-section-desc">Manage promotional announcements shown at the very top of the site. If multiple offers are active, they will rotate automatically every 5 seconds.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
                {formData.offers && formData.offers.length > 0 ? (
                  formData.offers.map((offer, idx) => (
                    <div key={offer.id || idx} style={{ display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: 'var(--admin-bg)', padding: '18px', borderRadius: '10px', border: '1px solid var(--admin-border)', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                      <textarea 
                        rows={3}
                        value={offer.text}
                        onChange={(e) => {
                          const updated = [...formData.offers];
                          updated[idx].text = e.target.value;
                          setFormData(prev => ({ ...prev, offers: updated }));
                        }}
                        className="form-control"
                        placeholder="Special Offer Announcement (e.g., Get 25% off deep cleaning packages this summer! Use code: SUMMER25)"
                        style={{ width: '100%', resize: 'vertical', minHeight: '80px', fontSize: '0.95rem', lineHeight: '1.5' }}
                        required
                      />
                      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px' }}>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...formData.offers];
                            updated[idx].active = !updated[idx].active;
                            setFormData(prev => ({ ...prev, offers: updated }));
                          }}
                          style={{
                            padding: '8px 18px',
                            borderRadius: '20px',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '0.85rem',
                            backgroundColor: offer.active ? '#10b981' : 'var(--border-color)',
                            color: offer.active ? '#ffffff' : 'var(--text-muted)',
                            minWidth: '95px',
                            textAlign: 'center'
                          }}
                        >
                          {offer.active ? 'Active' : 'Inactive'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = formData.offers.filter((_, i) => i !== idx);
                            setFormData(prev => ({ ...prev, offers: updated }));
                          }}
                          style={{
                            padding: '8px 18px',
                            borderRadius: '6px',
                            border: 'none',
                            cursor: 'pointer',
                            backgroundColor: '#fee2e2',
                            color: '#b91c1c',
                            fontWeight: 'bold',
                            fontSize: '0.85rem'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted" style={{ fontStyle: 'italic', fontSize: '0.85rem' }}>No offers added yet.</p>
                )}
              </div>

              <button
                type="button"
                className="btn btn-outline btn-small"
                onClick={() => {
                  const newOffer = { id: Date.now().toString(), text: '', active: true };
                  setFormData(prev => ({
                    ...prev,
                    offers: [...(prev.offers || []), newOffer]
                  }));
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Plus size={14} />
                <span>Add New Special Offer</span>
              </button>
            </div>
          )}

          {/* Form Actions */}
          <div className="settings-form-actions">
            <button 
              type="submit" 
              className="btn btn-primary btn-save" 
              disabled={saving}
            >
              <Save size={16} />
              <span>{saving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ManageSettings;
