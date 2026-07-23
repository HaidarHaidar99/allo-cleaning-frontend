import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Heart } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { ASSET_BASE_URL } from '../config';

const ItemDetailModal = ({ item, isProduct = false, onClose }) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addToCart, removeFromCart, isInCart } = useCart();
  const { settings } = useSettings();

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  if (!item) return null;

  const { id, name, category, description, imageUrl, imageBase64 } = item;

  const getItemImage = () => {
    if (imageBase64) return imageBase64;
    if (!imageUrl) return '';
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

  const imgSrc = getItemImage();

  // Use createPortal to render directly into document.body — guarantees centering
  return createPortal(
    <div
      className="item-detail-modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        zIndex: 9999,
        padding: '20px',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div
        className="item-detail-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '480px',
          width: '100%',
          maxHeight: '85vh',
          overflowY: 'auto',
          padding: '24px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--bg-white)',
          border: '1px solid var(--border-color)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)',
          position: 'relative',
          transform: 'none'
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '12px', right: '12px',
            background: 'var(--bg-light)', border: '1px solid var(--border-color)',
            borderRadius: '50%', width: '32px', height: '32px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--text-light)', zIndex: 10
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Image */}
        {imgSrc && (
          <div style={{ position: 'relative', width: '100%', borderRadius: 'var(--radius-sm)', overflow: 'hidden', marginBottom: '16px' }}>
            <img
              src={imgSrc}
              alt={name}
              style={{ width: '100%', height: 'auto', maxHeight: '260px', objectFit: 'cover', display: 'block' }}
            />
            <span className="service-badge">{category}</span>
            <button
              className={`favorite-btn ${favorited ? 'favorited' : ''}`}
              onClick={() => toggleFavorite(item)}
              style={{ position: 'absolute', top: '10px', right: '10px' }}
            >
              <Heart size={18} fill={favorited ? '#ef4444' : 'none'} />
            </button>
          </div>
        )}

        {/* Title & Description */}
        <h2 style={{ fontSize: '1.3rem', color: 'var(--primary-dark)', marginBottom: '8px', fontFamily: "'Outfit', sans-serif" }}>{name}</h2>
        <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem', lineHeight: '1.65', marginBottom: '20px' }}>
          {description}
        </p>

        {/* Modal Actions */}
        <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
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
    </div>,
    document.body
  );
};

export default ItemDetailModal;
