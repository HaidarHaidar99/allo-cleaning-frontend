import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Phone, Mail, MapPin } from 'lucide-react';
import '../styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer animate-fade-in">
      <div className="footer-top container">
        {/* Info Column */}
        <div className="footer-col info-col">
          <Link to="/" className="footer-logo">
            <Sparkles className="logo-icon text-cyan" />
            <span className="logo-text">Allo <span className="text-cyan">Cleaning</span></span>
          </Link>
          <p className="footer-desc">
            We provide premium residential and commercial cleaning services. Spotless, sanitized, and fresh environments for your home and office.
          </p>
          <div className="footer-socials">
            {/* Social handles could go here */}
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
              <span>+1 (555) 019-2834</span>
            </li>
            <li>
              <Mail size={18} className="text-cyan" />
              <span>info@allocleaning.com</span>
            </li>
            <li>
              <MapPin size={18} className="text-cyan" />
              <span>123 Sparkle Way, Clean City</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-container container">
          <p>&copy; {currentYear} Allo Cleaning. All rights reserved.</p>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
