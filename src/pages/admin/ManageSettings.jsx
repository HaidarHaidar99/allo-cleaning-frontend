import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useSettings } from '../../context/SettingsContext';
import { 
  Settings, Save, Globe, Smartphone, Mail, MapPin, 
  Layout, Star, MessageSquare, AlertCircle, Check, Camera 
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
    contactDescription: ''
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
        contactDescription: settings.contactDescription || ''
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

                {/* Stats row */}
                <div className="form-group full-width" style={{ marginTop: '20px' }}>
                  <h4 style={{ fontSize: '1rem', marginBottom: '15px', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
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
