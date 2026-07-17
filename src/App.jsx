import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Home as HomeIcon, Sparkles as SparklesIcon, Phone as PhoneIcon } from 'lucide-react';

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

  return (
    <div className="public-layout" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div className="main-content" style={{ flexGrow: 1 }}>
        <Outlet />
      </div>
      <Footer />

      {/* Floating WhatsApp Icon */}
      <a 
        href={settings.whatsapp.startsWith('http') ? settings.whatsapp : `https://wa.me/${settings.whatsapp}`} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="whatsapp-float"
        title="Chat on WhatsApp"
      >

        <svg className="whatsapp-icon-svg" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.858-4.42 9.861-9.864.001-2.639-1.026-5.12-2.89-6.988C16.578 1.884 14.1 .856 11.997.856c-5.44 0-9.866 4.42-9.869 9.865-.001 1.77.476 3.5 1.38 5.005L2.464 21.5l5.962-1.564c1.554.85 3.102 1.218 4.774 1.218zM17.43 14.88c-.313-.157-1.85-.913-2.137-1.018-.287-.105-.497-.157-.706.157-.21.314-.813 1.018-.996 1.226-.183.208-.366.236-.68.08-1.022-.512-1.745-.884-2.42-2.037-.584-.997-.84-2.18-.948-2.678-.112-.513.342-.497.682-.937.155-.2.08-.364-.04-.522-.12-.157-.996-2.397-1.365-3.287-.36-.867-.724-.75-1.0-.763l-.707-.01c-.245 0-.64.093-.976.468-.335.376-1.28 1.256-1.28 3.06 0 1.805 1.315 3.55 1.5 3.8.183.25 2.58 3.94 6.25 5.525.874.378 1.556.604 2.088.773.878.278 1.678.24 2.31.146.705-.104 1.85-.757 2.112-1.454.26-.697.26-1.296.183-1.424-.078-.127-.287-.205-.6-.362z"/>
        </svg>
      </a>

      {/* Mobile Bottom Navigation Bar */}
      <div className="mobile-bottom-bar">
        <NavLink 
          to="/" 
          className={() => `bottom-bar-link ${location.pathname === '/' && location.hash === '' ? 'active' : ''}`}
        >
          <HomeIcon size={20} />
          <span>Home</span>
        </NavLink>
        <NavLink 
          to="/#services-section" 
          className={() => `bottom-bar-link ${location.hash === '#services-section' ? 'active' : ''}`}
          onClick={(e) => handleBottomNavClick('services-section', e)}
        >
          <SparklesIcon size={20} />
          <span>Services</span>
        </NavLink>
        <NavLink 
          to="/#contact-section" 
          className={() => `bottom-bar-link ${location.hash === '#contact-section' ? 'active' : ''}`}
          onClick={(e) => handleBottomNavClick('contact-section', e)}
        >
          <PhoneIcon size={20} />
          <span>Contact</span>
        </NavLink>
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
