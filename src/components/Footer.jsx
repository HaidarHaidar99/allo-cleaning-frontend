import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Phone, Mail, MapPin, Camera } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import '../styles/Footer.css';

const Facebook = ({ size = 24, className = '', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const EmailSVG = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
  </svg>
);

const InstagramSVG = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm3.98-10.181a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" />
  </svg>
);

const WhatsAppSVG = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a5.8 5.8 0 00-.571-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.271 1.263.433 1.694.555.712.202 1.36.173 1.871.105.574-.077 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);


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
                className="social-icon-link instagram-icon"
                title="Follow us on Instagram"
                style={{ color: '#E1306C', transition: 'transform 0.2s' }}
              >
                <InstagramSVG size={24} />
              </a>
            )}

            {settings.whatsapp && (
              <a
                href={settings.whatsapp.startsWith('http') ? settings.whatsapp : `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon-link whatsapp-icon"
                title="Message us on WhatsApp"
                style={{ color: '#25D366', transition: 'transform 0.2s' }}
              >
                <WhatsAppSVG size={24} />
              </a>
            )}

            {settings.email && (
              <a
                href={`mailto:${settings.email}`}
                className="social-icon-link email-icon"
                title="Email us"
                style={{ color: '#0ea5e9', transition: 'transform 0.2s' }}
              >
                <EmailSVG size={24} />
              </a>
            )}

            {settings.facebook && (
              <a
                href={settings.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon-link facebook-icon"
                title="Follow us on Facebook"
                style={{ color: '#1877F2', transition: 'transform 0.2s' }}
              >
                <Facebook size={24} />
              </a>
            )}
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="footer-col links-col">
          <h3>Quick Links</h3>
          <ul>
            {settings?.activePages?.home && <li><Link to="/">Home</Link></li>}
            {settings?.activePages?.services && <li><Link to="/#services-section">Our Services</Link></li>}
            {settings?.activePages?.products && <li><Link to="/#products-section">Products</Link></li>}
            <li><Link to="/favorites">Favorites</Link></li>
            <li><Link to="/cart">Cart / Bookings</Link></li>
            {settings?.activePages?.contact && <li><Link to="/#contact-section">Contact Us</Link></li>}
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