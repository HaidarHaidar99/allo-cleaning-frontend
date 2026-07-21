import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useSettings } from '../context/SettingsContext';
import { Sparkles, Heart, ShoppingCart, User, LogOut, Menu, X, Search, Layers, Package } from 'lucide-react';
import '../styles/Navbar.css';

const getAvatarColor = (email) => {
  if (!email) return '#10b981';
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = email.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    '#ef4444', '#f97316', '#f59e0b', '#10b981', '#14b8a6',
    '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#ec4899'
  ];
  return colors[Math.abs(hash) % colors.length];
};

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
            <div className="text-logo">
              <span className="text-logo-top">Allo</span>
              <span className="text-logo-bottom">Cleaning</span>
            </div>
          </Link>
        </div>

        {/* Center: Search (Desktop) or Logo (Mobile) */}
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
            <div className="text-logo">
              <span className="text-logo-top">Allo</span>
              <span className="text-logo-bottom">Cleaning</span>
            </div>
          </Link>
        </div>

        {/* Right: Menu links (Desktop) or Action Icons (Mobile) */}
        <div className="nav-right">
          {mobileMenuOpen && <div className="mobile-drawer-overlay" onClick={closeMobileMenu}></div>}
          <div className={`mobile-drawer-wrapper ${mobileMenuOpen ? 'mobile-open' : ''}`}>
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
                  <Layers size={16} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }}/>
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
                  <Package size={16} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }}/>
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
            </ul>
          </div>

          {/* Mobile Quick Action Icons */}
          <div className="mobile-action-icons">
            <button className="mobile-action-btn search-toggle" onClick={() => setShowMobileSearch(!showMobileSearch)}>
              <Search size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay Bar */}
      {showMobileSearch && (
        <div className="mobile-search-overlay animate-fade-in">
          <form onSubmit={handleSearchSubmit} className="mobile-search-form">
            <input 
              type="text" 
              placeholder="Search services..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mobile-search-input"
              autoFocus
            />
            <button type="submit" className="mobile-search-submit">
              <Search size={18} />
            </button>
            <button type="button" className="mobile-search-close" onClick={() => setShowMobileSearch(false)}>
              <X size={18} />
            </button>
          </form>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
