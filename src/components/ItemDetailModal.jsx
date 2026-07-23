import React from 'react';
import { X, Heart } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { ASSET_BASE_URL } from '../config';

const ItemDetailModal = ({ item, isProduct = false, onClose }) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addToCart, removeFromCart, isInCart } = useCart();
  const { settings } = useSettings();

  if (!item) return null;

  const { id, name, category, description, imageUrl, imageBase64 } = item;

  const getItemImage = () => {
    if (imageBase64) return imageBase64;
    if (!imageUrl) return 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${ASSET_BASE_URL}${imageUrl}`;
  };

  const handleContactUs = () => {
    const rawWhatsApp = settings.whatsapp || '1234567890';
    const message = `Hello,

I would like to inquire about the following ${isProduct ? 'product' : 'service'}:

Name: ${name}
Category: ${category}

Description:
${description}

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

  const favorited = isFavorite(id);
  const inCart = isInCart(id);

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(5px)', WebkitBackdropFilter: 'blur(5px)', zIndex: 1100 }}>
      <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px', width: '90%', maxHeight: '90vh', overflowY: 'auto', padding: '24px', position: 'relative', margin: 'auto' }}>
        {/* Close button */}
        <button className="modal-close-btn" onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-light)' }}>
          <X size={22} />
        </button>

        {/* Modal Image */}
        <div style={{ position: 'relative', width: '100%', height: '200px', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '16px' }}>
          <img src={getItemImage()} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <span className="service-badge">{category}</span>
          <button 
            className={`favorite-btn ${favorited ? 'favorited' : ''}`} 
            onClick={() => toggleFavorite(item)}
            style={{ position: 'absolute', top: '12px', right: '12px' }}
          >
            <Heart size={20} fill={favorited ? '#ef4444' : 'none'} />
          </button>
        </div>

        {/* Title & Description */}
        <h2 style={{ fontSize: '1.3rem', color: 'var(--primary-dark)', marginBottom: '10px' }}>{name}</h2>
        <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '24px' }}>
          {description}
        </p>

        {/* Modal Actions */}
        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
          {isProduct && (
            inCart ? (
              <button className="cart-toggle-btn in-cart" onClick={() => removeFromCart(id)} style={{ flex: 1, justifyContent: 'center' }}>
                <span>In Cart</span>
              </button>
            ) : (
              <button className="cart-toggle-btn" onClick={() => addToCart(item)} style={{ flex: 1, justifyContent: 'center' }}>
                <span>Add to Cart</span>
              </button>
            )
          )}
          <button className="buy-now-btn" onClick={handleContactUs} style={{ flex: 1, justifyContent: 'center' }}>
            <span>Contact Us</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailModal;
