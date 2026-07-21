import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Home as HomeIcon, Phone as PhoneIcon, Layers, Package, MessageCircle } from 'lucide-react';

// Context Providers
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { SettingsProvider, useSettings } from './context/SettingsContext';


// Public Pages
import Home from './pages/Home';
import Services from './pages/Services';
import Favorites from './pages/Favorites';
import Cart from './pages/Cart';
import Contact from './pages/Contact';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboardLayout from './pages/admin/AdminDashboardLayout';
import DashboardHome from './pages/admin/DashboardHome';
import ManageServices from './pages/admin/ManageServices';
import ManageProducts from './pages/admin/ManageProducts';
import ManageForms from './pages/admin/ManageForms';
import ManageAdmins from './pages/admin/ManageAdmins';
import ManageSettings from './pages/admin/ManageSettings';
import Profile from './pages/admin/Profile';


// Import CSS
import './styles/global.css';

// Scroll to top helper that handles route changes and hash navigation
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Small timeout to allow DOM rendering before scroll
      const timer = setTimeout(() => {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};

// Public Layout wrapper containing Navbar and Footer
const PublicLayout = () => {
  const location = useLocation();
  const { settings } = useSettings();

  const handleBottomNavClick = (sectionId, e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const hideFooter = location.pathname === '/cart' || location.pathname === '/favorites';
  const activePages = settings?.activePages || { home: true, products: true, services: true, contact: true };

  return (
    <div className="public-layout" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div className="main-content" style={{ flexGrow: 1 }}>
        <Outlet />
      </div>
      {!hideFooter && <Footer />}

      {/* Floating WhatsApp Icon - Premium Design */}
      {settings?.whatsapp && (
        <a 
          href={settings.whatsapp.startsWith('http') ? settings.whatsapp : `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="whatsapp-float premium-float animate-bounce-slow"
          title="Chat on WhatsApp"
          style={{
            position: 'fixed',
            bottom: '80px',
            right: '20px',
            backgroundColor: '#25D366',
            color: 'white',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(37, 211, 102, 0.4)',
            zIndex: 999,
            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
          }}
        >
          <MessageCircle size={28} />
        </a>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <div className="mobile-bottom-bar">
        {activePages.home && (
          <NavLink 
            to="/" 
            className={() => `bottom-bar-link ${location.pathname === '/' && location.hash === '' ? 'active' : ''}`}
          >
            <HomeIcon size={20} />
            <span>Home</span>
          </NavLink>
        )}
        {activePages.services && (
          <NavLink 
            to="/#services-section" 
            className={() => `bottom-bar-link ${location.hash === '#services-section' ? 'active' : ''}`}
            onClick={(e) => handleBottomNavClick('services-section', e)}
          >
            <Layers size={20} />
            <span>Services</span>
          </NavLink>
        )}
        {activePages.products && (
          <NavLink 
            to="/#products-section" 
            className={() => `bottom-bar-link ${location.hash === '#products-section' ? 'active' : ''}`}
            onClick={(e) => handleBottomNavClick('products-section', e)}
          >
            <Package size={20} />
            <span>Products</span>
          </NavLink>
        )}
        {activePages.contact && (
          <NavLink 
            to="/#contact-section" 
            className={() => `bottom-bar-link ${location.hash === '#contact-section' ? 'active' : ''}`}
            onClick={(e) => handleBottomNavClick('contact-section', e)}
          >
            <PhoneIcon size={20} />
            <span>Contact</span>
          </NavLink>
        )}
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AdminAuthProvider>
        <SettingsProvider>
          <FavoritesProvider>
            <CartProvider>
              <Routes>
                {/* Public Customer Routes */}
                <Route path="/" element={<PublicLayout />}>
                  <Route index element={<Home />} />
                  <Route path="services" element={<Services />} />
                  <Route path="favorites" element={<Favorites />} />
                  <Route path="cart" element={<Cart />} />
                  <Route path="contact" element={<Contact />} />
                </Route>

                {/* Admin Login (Completely alone, no customer navbar/footer/whatsapp float) */}
                <Route path="/admin" element={<AdminLogin />} />

                {/* Admin Dashboard Protected Routes */}
                <Route path="/admin/dashboard" element={<AdminDashboardLayout />}>
                  <Route index element={<DashboardHome />} />
                  <Route path="services" element={<ManageServices />} />
                  <Route path="products" element={<ManageProducts />} />
                  <Route path="forms" element={<ManageForms />} />
                  <Route path="admins" element={<ManageAdmins />} />
                  <Route path="settings" element={<ManageSettings />} />
                  <Route path="profile" element={<Profile />} />
                </Route>

                {/* Fallback route */}
                <Route path="*" element={
                  <div style={{ padding: '80px 20px', textAlign: 'center' }}>
                    <h2>404 - Page Not Found</h2>
                    <p style={{ marginTop: '10px' }}>The page you are looking for does not exist.</p>
                    <a href="/" className="btn btn-primary" style={{ display: 'inline-flex', marginTop: '20px' }}>Go Home</a>
                  </div>
                } />
              </Routes>
            </CartProvider>
          </FavoritesProvider>
        </SettingsProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}

export default App;
