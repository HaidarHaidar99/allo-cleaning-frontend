import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useSettings } from '../context/SettingsContext';
import { Sparkles, Heart, ShoppingCart, User, LogOut, Menu, X, Search } from 'lucide-react';
import '../styles/Navbar.css';

const Navbar = () => {
  const { cart } = useCart();
  const { favorites } = useFavorites();
  const { admin, logout } = useAdminAuth();
  const { settings } = useSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const activePages = settings?.activePages || { home: true, products: true, services: true, contact: true };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMobileMenu();
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/services?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowMobileSearch(false);
    }
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleNavClick = (sectionId, e) => {
    closeMobileMenu();
    if (location.pathname === '/') {
      e.preventDefault();
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="navbar glass-card">
      <div className="navbar-container container">
        {/* Left: Hamburger (Mobile) or Logo (Desktop) */}
        <div className="nav-left">
          <div className="navbar-hamburger" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </div>
          
          <Link to="/" className="navbar-logo logo-desktop" onClick={closeMobileMenu}>
            <div className="text-logo-luxury">
              <span className="logo-accent">Allo</span>
              <span className="logo-main">Cleaning</span>
              <Sparkles className="logo-sparkle" size={14} />
            </div>
          </Link>
        </div>

        {/* Center: Search Bar (Desktop) or Logo (Mobile) */}
        <div className="nav-center">
          <form onSubmit={handleSearchSubmit} className="search-bar-desktop">
            <input 
              type="text" 
              placeholder="Search services..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              <Search size={18} />
            </button>
          </form>

          <Link to="/" className="navbar-logo logo-mobile" onClick={closeMobileMenu}>
            <div className="text-logo-luxury">
              <span className="logo-accent">Allo</span>
              <span className="logo-main">Cleaning</span>
              <Sparkles className="logo-sparkle" size={14} />
            </div>
          </Link>
        </div>

        {/* Right: Menu links (Desktop) or Action Icons (Mobile) */}
        <div className="nav-right">
          {mobileMenuOpen && <div className="mobile-drawer-overlay" onClick={closeMobileMenu}></div>}
          <div className={`mobile-drawer-wrapper ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            <div className="drawer-header-luxury">
              <div className="text-logo-luxury">
                <span className="logo-accent">Allo</span>
                <span className="logo-main" style={{ color: '#ffffff' }}>Cleaning</span>
                <Sparkles className="logo-sparkle" size={14} />
              </div>
              <button className="drawer-close-btn" onClick={closeMobileMenu}>
                <X size={24} />
              </button>
            </div>
            
            <ul className="navbar-links">
              {activePages.home && (
                <li>
                  <Link to="/" className={isActive('/')} onClick={closeMobileMenu}>Home</Link>
                </li>
              )}
              {activePages.services && (
                <li>
                  <Link 
                    to="/#services-section" 
                    className={location.hash === '#services-section' ? 'active' : ''}
                    onClick={(e) => handleNavClick('services-section', e)}
                  >
                    Services
                  </Link>
                </li>
              )}
              {activePages.products && (
                <li>
                  <Link 
                    to="/#products-section" 
                    className={location.hash === '#products-section' ? 'active' : ''}
                    onClick={(e) => handleNavClick('products-section', e)}
                  >
                    Products
                  </Link>
                </li>
              )}
              <li>
                <Link to="/favorites" className={`nav-text-link ${isActive('/favorites')}`} onClick={closeMobileMenu}>
                  <span>Favorites</span>
                  {favorites.length > 0 && <span className="text-badge bg-green">{favorites.length}</span>}
                </Link>
              </li>
              <li>
                <Link to="/cart" className={`nav-text-link ${isActive('/cart')}`} onClick={closeMobileMenu}>
                  <span>Cart</span>
                  {cart.length > 0 && <span className="text-badge bg-cyan">{cart.length}</span>}
                </Link>
              </li>
              {activePages.contact && (
                <li>
                  <Link 
                    to="/#contact-section" 
                    className={location.hash === '#contact-section' ? 'active' : ''}
                    onClick={(e) => handleNavClick('contact-section', e)}
                  >
                    Contact Us
                  </Link>
                </li>
              )}
              
              {admin && (
                <li style={{ marginTop: 'auto', width: '100%' }}>
                  <button className="logout-btn" onClick={handleLogout} style={{ width: '100%', justifyContent: 'flex-start', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px' }}>
                    <LogOut size={16} />
                    <span>Admin Logout</span>
                  </button>
                </li>
              )}
            </ul>

            <div className="drawer-footer-luxury">
              <p className="drawer-footer-title">Need Premium Cleaning?</p>
              {settings.phone && <a href={`tel:${settings.phone}`} className="drawer-footer-link">{settings.phone}</a>}
              {settings.email && <a href={`mailto:${settings.email}`} className="drawer-footer-link">{settings.email}</a>}
            </div>
          </div>

          {/* Desktop Admin controls */}
          {admin && (
            <div className="desktop-admin-controls" style={{ display: 'flex', gap: '10px', marginRight: '15px' }}>
              <Link to="/admin/dashboard" className="admin-link-btn">
                <User size={14} />
                <span>Dashboard</span>
              </Link>
            </div>
          )}

          {/* Mobile Quick Action Icons */}
          <div className="mobile-action-icons">
            <button className="mobile-action-btn search-toggle" onClick={() => setShowMobileSearch(!showMobileSearch)}>
              <Search size={22} />
            </button>
            <Link to="/cart" className="mobile-action-btn mobile-cart-icon" onClick={closeMobileMenu}>
              <ShoppingCart size={22} />
              {cart.length > 0 && <span className="mobile-badge bg-cyan">{cart.length}</span>}
            </Link>
          </div>
        </div>
      </div>

      {/* Redesigned Floating mobile search overlay */}
      {showMobileSearch && (
        <div className="mobile-search-luxury-overlay animate-fade-in">
          <div className="mobile-search-luxury-box glass-card-dark">
            <form onSubmit={handleSearchSubmit} className="mobile-search-luxury-form">
              <Search size={18} className="search-icon-luxury" />
              <input 
                type="text" 
                placeholder="What service do you need?" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mobile-search-luxury-input"
                autoFocus
              />
              <button type="button" className="mobile-search-luxury-close" onClick={() => setShowMobileSearch(false)}>
                <X size={18} />
              </button>
            </form>
            <div className="mobile-search-suggestions">
              <span className="suggestions-label">Popular Searches:</span>
              <div className="suggestions-list">
                {['Deep Clean', 'Office', 'Carpet', 'Window'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className="suggestion-tag"
                    onClick={() => {
                      setSearchQuery(tag);
                      navigate(`/services?search=${encodeURIComponent(tag)}`);
                      setShowMobileSearch(false);
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
