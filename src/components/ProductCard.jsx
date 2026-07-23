import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import { ASSET_BASE_URL } from '../config';
import { useSettings } from '../context/SettingsContext';
import ItemDetailModal from './ItemDetailModal';
import '../styles/ServiceCard.css';

const ProductCard = ({ product }) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addToCart, removeFromCart, isInCart } = useCart();
  const { settings } = useSettings();
  const [showModal, setShowModal] = useState(false);

  const { id, name, category, description, imageUrl } = product;

  const getProductImage = () => {
    if (product.imageBase64) return product.imageBase64;
    if (!imageUrl) return 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${ASSET_BASE_URL}${imageUrl}`;
  };

  const handleContactUs = () => {
    const rawWhatsApp = settings.whatsapp || '1234567890';
    const message = `Hello,

I would like to inquire about the following product:

Product Name: ${name}
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
    <>
      <div className="service-card glass-card animate-fade-in">
        {/* Category Badge */}
        <span className="service-badge">{category}</span>

        {/* Product Image */}
        <div className="service-image-wrapper" onClick={() => setShowModal(true)} style={{ cursor: 'pointer' }}>
          <img 
            src={getProductImage()}  
            alt={name} 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop';
            }} 
          />
          
          {/* Top Favorite Action */}
          <div className="card-top-actions">
            <button 
              className={`favorite-btn ${favorited ? 'favorited' : ''}`} 
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(product);
              }}
              title={favorited ? 'Remove from Favorites' : 'Add to Favorites'}
            >
              <Heart size={18} fill={favorited ? '#ef4444' : 'none'} />
            </button>
          </div>
        </div>

        {/* Service Details */}
        <div className="service-details">
          <h3 className="service-title" onClick={() => setShowModal(true)} style={{ cursor: 'pointer' }}>{name}</h3>
          <p className="service-description">{description}</p>
          
          <div className="service-footer">
            <div className="service-actions" style={{ width: '100%' }}>
              {/* Cart Button */}
              {inCart ? (
                <button 
                  className="cart-toggle-btn in-cart" 
                  onClick={() => removeFromCart(id)}
                  title="Remove from Cart"
                  style={{ flex: 1 }}
                >
                  <span>In Cart</span>
                </button>
              ) : (
                <button 
                  className="cart-toggle-btn" 
                  onClick={() => addToCart(product)}
                  title="Add to Cart"
                  style={{ flex: 1 }}
                >
                  <span>Add to Cart</span>
                </button>
              )}

              {/* Contact Us Button */}
              <button className="buy-now-btn" onClick={handleContactUs} style={{ flex: 1, justifyContent: 'center' }}>
                <span>Contact Us</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <ItemDetailModal 
          item={product} 
          isProduct={true} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </>
  );
};

export default ProductCard;
