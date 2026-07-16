import React, { useState } from 'react';
import { Sparkles, Phone, Mail, MapPin, Send, MessageSquare, Check } from 'lucide-react';
import { API_BASE_URL } from '../config';
import '../styles/Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch(`${API_BASE_URL}/forms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit the form. Please try again.');
      }

      setSuccess(true);
      setFormData({
        fullName: '',
        email: '',
        phoneNumber: '',
        message: '',
      });
    } catch (err) {
      console.error('Contact form error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page container animate-fade-in">
      {/* Header */}
      <div className="contact-header text-center">
        <div className="contact-tag">
          <MessageSquare size={16} className="text-cyan animate-pulse" />
          <span>Get In Touch</span>
        </div>
        <h1>Contact Our Support Team</h1>
        <p>Have questions about our packages or need a custom cleanup quote? Leave us a message below, and our team will reach out shortly!</p>
      </div>

      <div className="contact-layout">
        {/* 1. Contact Form Card */}
        <div className="contact-form-card glass-card">
          <h2>Send Us a Message</h2>
          <p className="card-subtitle">Fill out the form below and we'll respond within 24 hours.</p>

          {success && (
            <div className="alert alert-success">
              <Check size={18} />
              <span>Your message has been submitted successfully! We'll contact you soon.</span>
            </div>
          )}

          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
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
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Email Address"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Phone Number"
                  required
                />
              </div>
            </div>

            <div className="form-group message-group">
              <label htmlFor="message">Your Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="form-control"
                placeholder="Your Message"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary submit-btn" disabled={loading}>
              <Send size={16} />
              <span>{loading ? 'Submitting...' : 'Send Message'}</span>
            </button>
          </form>
        </div>

        {/* 2. Contact Info Details Card */}
        <div className="contact-info-panel glass-card">
          <h2>Direct Contact</h2>
          <p className="card-subtitle font-sm">Need immediate assistance? Give us a call or visit our office.</p>

          <div className="info-items">
            <div className="info-item">
              <div className="info-icon bg-cyan">
                <Phone size={20} className="text-white" />
              </div>
              <div className="info-text">
                <h4>Call Us</h4>
                <p>+1 (555) 019-2834</p>
                <span className="info-sub">Toll-free, Mon-Sat</span>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon bg-green">
                <Mail size={20} className="text-white" />
              </div>
              <div className="info-text">
                <h4>Email Support</h4>
                <p>info@allocleaning.com</p>
                <span className="info-sub">Response within 24h</span>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon bg-cyan">
                <MapPin size={20} className="text-white" />
              </div>
              <div className="info-text">
                <h4>Visit Office</h4>
                <p>123 Sparkle Way, Clean City</p>
                <span className="info-sub">Floor 2, Clean Building</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
