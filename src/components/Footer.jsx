import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Phone, Mail, MapPin, Camera, Facebook } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import '../styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { settings } = useSettings();

  return (
    <footer className="footer animate-fade-in">
      <div className="footer-top container">
        {/* Info Column */}
        <div className="footer-col info-col">
          <Link to="/" className="footer-logo">
            <Sparkles className="logo-icon text-cyan" />
            <span className="logo-text">
              Allo <span className="text-cyan">Cleaning</span>
            </span>
          </Link>

          <p className="footer-desc">
            We provide premium residential and commercial cleaning services.
            Spotless, sanitized, and fresh environments for your home and office.
          </p>

          <div
            className="footer-socials"
            style={{ display: 'flex', gap: '15px', marginTop: '20px' }}
          >
            {settings.instagram && (
              <a
                href={settings.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon-link"
                title="Follow us on Instagram"
                style={{ color: 'var(--text-light)', transition: 'var(--transition-fast)' }}
              >
                <Camera size={20} />
              </a>
            )}

            {settings.facebook && (
              <a
                href={settings.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon-link"
                title="Follow us on Facebook"
                style={{ color: 'var(--text-light)', transition: 'var(--transition-fast)' }}
              >
                <Facebook size={20} />
              </a>
            )}
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="footer-col links-col">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/services">Our Services</Link></li>
            <li><Link to="/favorites">Favorites</Link></li>
            <li><Link to="/cart">Cart / Bookings</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>

        {/* Contact Info Column */}
        <div className="footer-col contact-col">
          <h3>Contact Info</h3>
          <ul>
            <li>
              <Phone size={18} className="text-cyan" />
              <span>{settings.phone}</span>
            </li>

            <li>
              <Mail size={18} className="text-cyan" />
              <span>{settings.email}</span>
            </li>

            <li>
              <MapPin size={18} className="text-cyan" />
              <span>{settings.address}</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-container container">
          <p>
            &copy; {currentYear} Allo Cleaning. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;