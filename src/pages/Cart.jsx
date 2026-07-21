import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingCart, Send, ArrowRight, ArrowLeft } from 'lucide-react';
import { ASSET_BASE_URL } from '../config';
import { useSettings } from '../context/SettingsContext';
import '../styles/Cart.css';

const Cart = () => {
  const { cart, removeFromCart, cartTotal, clearCart } = useCart();
  const { settings } = useSettings();

  // Helper to resolve images (either Base64, relative backend uploads or external URLs)
  const getServiceImage = (item) => {
    if (item.imageBase64) return item.imageBase64;
    if (!item.imageUrl) return 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop';
    if (item.imageUrl.startsWith('http')) return item.imageUrl;
    return `${ASSET_BASE_URL}${item.imageUrl}`;
  };

  // Cart-wide Checkout "Buy Now" WhatsApp Link Generator
  const handleCheckout = () => {
    const rawWhatsApp = settings.whatsapp || '1234567890';
    
    let servicesListText = '';
    cart.forEach((item, index) => {
      const hasItemPrice = item.price !== undefined && item.price !== null && item.price !== '' && parseFloat(item.price) > 0;
      const itemPriceText = hasItemPrice ? `$${parseFloat(item.price).toFixed(2)}` : 'Contact Us';
      servicesListText += `\n${index + 1}. Service Name: ${item.name}
   Category: ${item.category}
   Price: ${itemPriceText}
   Description: ${item.description}\n`;
    });

    const totalText = cartTotal > 0 ? `$${cartTotal.toFixed(2)}` : 'Contact Us / TBD';

    const message = `Hello,

I would like to request the following services:
${servicesListText}
Total Price: ${totalText}

Thank you.`;

    const encodedMessage = encodeURIComponent(message);
    
    let whatsappUrl;
    if (rawWhatsApp.startsWith('http')) {
      whatsappUrl = rawWhatsApp.includes('?') ? `${rawWhatsApp}&text=${encodedMessage}` : `${rawWhatsApp}?text=${encodedMessage}`;
    } else {
      const cleanNumber = rawWhatsApp.replace(/\D/g, '');
      whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
    }
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="cart-page container animate-fade-in">
      {/* Header */}
      <div className="cart-header" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px' }}>
        <ShoppingCart size={28} className="text-cyan" />
        <h1 style={{ margin: 0, fontSize: '2rem' }}>Cart</h1>
      </div>

      {/* Cart Grid Layout */}
      {cart.length > 0 ? (
        <div className="cart-container">
          {/* 1. Items List */}
          <div className="cart-items-list">
            {cart.map((item) => (
              <div key={item.id} className="cart-item glass-card">
                <div className="cart-item-image">
                  <img 
                    src={getServiceImage(item)} 
                    alt={item.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop';
                    }}
                  />
                </div>
                <div className="cart-item-details">
                  <div className="cart-item-header">
                    <div>
                      <span className="cart-item-category">{item.category}</span>
                      <h3>{item.name}</h3>
                    </div>
                    <button 
                      className="cart-item-remove-btn" 
                      onClick={() => removeFromCart(item.id)}
                      title="Remove from Cart"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <p className="cart-item-description">{item.description}</p>
                  <div className="cart-item-footer">
                    <span className="cart-item-price">${parseFloat(item.price || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}

            <div className="cart-actions-footer">
              <Link to="/services" className="back-link">
                <ArrowLeft size={16} />
                <span>Continue Browsing</span>
              </Link>
              <button className="clear-cart-btn" onClick={clearCart}>
                <span>Clear All Items</span>
              </button>
            </div>
          </div>

          {/* 2. Summary Sidebar */}
          <div className="cart-summary-sidebar glass-card">
            <h3>Order Summary</h3>
            <div className="summary-details">
              <div className="summary-row">
                <span>Selected Services</span>
                <span>{cart.length}</span>
              </div>
              <hr />
              <div className="summary-row total-row">
                <span>Total Price</span>
                <span>{cartTotal > 0 ? `$${cartTotal.toFixed(2)}` : 'Contact Us'}</span>
              </div>
            </div>
            
            <button className="checkout-btn" onClick={handleCheckout}>
              <Send size={18} />
              <span>Book via WhatsApp Now</span>
            </button>
            
            <div className="checkout-info text-center">
              <p>Clicking "Book via WhatsApp" will open a chat with our representative containing your selected services and pricing.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="no-cart-box text-center" style={{ padding: '40px 0' }}>
          <p style={{ color: 'var(--text-light)', marginBottom: '15px' }}>Your cart is currently empty.</p>
          <Link to="/" className="btn btn-outline btn-small" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <ArrowLeft size={14} />
            <span>Go Back</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Cart;
