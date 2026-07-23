import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useSettings } from '../context/SettingsContext';
import { ShoppingCart, Menu, X, Search, Sun, Moon } from 'lucide-react';
import '../styles/Navbar.css';

const Navbar = () => {
  const { cart } = useCart();
  const { favorites } = useFavorites();
  const { settings } = useSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Dark mode state management
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };
  
  const activePages = settings?.activePages || { home: true, products: true, services: true, contact: true };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
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
            </div>
          </Link>
        </div>

        {/* Center: Search Bar (Desktop) or Logo (Mobile) */}
        <div className="nav-center">
          <form onSubmit={handleSearchSubmit} className="search-bar-desktop">
            <input 
              type="text" 
              placeholder="Search services or products..." 
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
            </div>
          </Link>
        </div>

        {/* Right: Menu links (Desktop) or Action Icons (Mobile) */}
        <div className="nav-right">
          {/* Desktop Nav Links */}
          <ul className="navbar-links desktop-only-links">
            {activePages.home && (
              <li>
                <Link to="/" className={isActive('/')}>Home</Link>
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
              <Link to="/favorites" className={`nav-text-link ${isActive('/favorites')}`}>
                <span>Favorites</span>
                {favorites.length > 0 && <span className="text-badge bg-green">{favorites.length}</span>}
              </Link>
            </li>
            <li>
              <Link to="/cart" className={`nav-text-link ${isActive('/cart')}`}>
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
            <li>
              <button type="button" className="theme-toggle-btn" onClick={toggleDarkMode} title="Toggle Theme">
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </li>
          </ul>

          {/* Mobile Drawer Overlay */}
          {mobileMenuOpen && <div className="mobile-drawer-overlay" onClick={closeMobileMenu}></div>}
          <div className={`mobile-drawer-wrapper ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            <div className="drawer-header-luxury">
              <div className="text-logo-luxury">
                <span className="logo-accent">Allo</span>
                <span className="logo-main" style={{ color: 'var(--text-dark)' }}>Cleaning</span>
              </div>
              <button className="drawer-close-btn" onClick={closeMobileMenu}>
                <X size={24} />
              </button>
            </div>
            
            <ul className="navbar-links mobile-drawer-links">
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
            </ul>
          </div>

          {/* Mobile Quick Action Icons */}
          <div className="mobile-action-icons">
            <button type="button" className="theme-toggle-btn" onClick={toggleDarkMode} title="Toggle Theme">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
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

      {/* Clean White Floating Mobile Search Overlay */}
      {showMobileSearch && (
        <div className="mobile-search-luxury-overlay animate-fade-in" onClick={(e) => { if(e.target.className.includes('mobile-search-luxury-overlay')) setShowMobileSearch(false); }}>
          <div className="mobile-search-luxury-box glass-card-white">
            <form onSubmit={handleSearchSubmit} className="mobile-search-luxury-form-white">
              <Search size={20} className="search-icon-inside" />
              <input 
                type="text" 
                placeholder="Search services or products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mobile-search-input-white"
                autoFocus
              />
              <button type="button" className="mobile-search-close-white" onClick={() => setShowMobileSearch(false)}>
                <X size={20} />
              </button>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
