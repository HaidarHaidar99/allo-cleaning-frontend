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

  // Helper to resolve images (either relative backend uploads or external URLs)
  const getServiceImage = (imageUrl) => {
    if (!imageUrl) return '/uploads/logo.jpg';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${ASSET_BASE_URL}${imageUrl}`;
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
      <div className="cart-header text-center">
        <div className="cart-tag">
          <ShoppingCart size={16} className="text-cyan animate-pulse" />
          <span>Your Bookings</span>
        </div>
        <h1>Your Shopping Cart</h1>
        <p>Review the cleaning packages you have selected. You can add or remove services before finalizing your booking request.</p>
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
                    src={getServiceImage(item.imageUrl)} 
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
        <div className="no-cart-box text-center glass-card">
          <div className="cart-icon-wrapper">
            <ShoppingCart size={48} className="text-light" />
          </div>
          <h3>Your Cart is Empty</h3>
          <p>You haven't added any cleaning services to your cart yet. Visit our services page to explore our offers!</p>
          <Link to="/services" className="btn btn-primary">
            <span>Explore Services</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
};

export default Cart;
