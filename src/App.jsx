import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import OffersBanner from './components/OffersBanner';
import Footer from './components/Footer';
import { Home as HomeIcon, Phone as PhoneIcon, Layers, Package } from 'lucide-react';

const WhatsAppSVG = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a5.8 5.8 0 00-.571-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.271 1.263.433 1.694.555.712.202 1.36.173 1.871.105.574-.077 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

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
          <WhatsAppSVG size={28} />
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

// Guard to prevent access to standalone routes if they are deactivated in settings
const PageVisibilityGuard = ({ pageKey, children }) => {
  const { settings } = useSettings();
  const activePages = settings?.activePages || { home: true, products: true, services: true, contact: true };

  if (activePages[pageKey] === false) {
    return (
      <div style={{ padding: '120px 20px', textAlign: 'center', minHeight: '60vh' }}>
        <h2 style={{ fontSize: '2rem', color: 'var(--primary-dark)', marginBottom: '16px' }}>Page Unavailable</h2>
        <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>This page is currently deactivated by the administrator.</p>
        <a href="/" className="btn btn-primary" style={{ display: 'inline-flex', marginTop: '30px' }}>Go Back Home</a>
      </div>
    );
  }

  return children;
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
                  <Route index element={
                    <PageVisibilityGuard pageKey="home">
                      <Home />
                    </PageVisibilityGuard>
                  } />
                  <Route path="services" element={
                    <PageVisibilityGuard pageKey="services">
                      <Services />
                    </PageVisibilityGuard>
                  } />
                  <Route path="favorites" element={<Favorites />} />
                  <Route path="cart" element={<Cart />} />
                  <Route path="contact" element={
                    <PageVisibilityGuard pageKey="contact">
                      <Contact />
                    </PageVisibilityGuard>
                  } />
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
