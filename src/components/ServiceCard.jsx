import React from 'react';
import { Heart, Send, MessageCircle } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { ASSET_BASE_URL } from '../config';
import { useSettings } from '../context/SettingsContext';
import '../styles/ServiceCard.css';

const ServiceCard = ({ service }) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { settings } = useSettings();

  const { id, name, category, description, price, imageUrl } = service;

  // Format price
  const hasPrice = price !== undefined && price !== null && price !== '' && parseFloat(price) > 0;
  const formattedPrice = hasPrice ? `$${parseFloat(price).toFixed(2)}` : 'Contact Us';

  // Helper to resolve images (either Base64 string, relative backend uploads, or external URLs)
  const getServiceImage = () => {
    if (service.imageBase64) return service.imageBase64;
    if (!imageUrl) return 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop';
    if (imageUrl.startsWith('http')) return imageUrl;
    // Prefix relative paths with Express server base URL
    return `${ASSET_BASE_URL}${imageUrl}`;
  };

  // Single Service "Buy Now" WhatsApp link generator
  const handleBuyNow = () => {
    const rawWhatsApp = settings.whatsapp || '1234567890';
    const message = `Hello,

I would like to request the following service:

Service Name: ${name}
Category: ${category}
Price: ${formattedPrice}

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

  return (
    <div className="service-card glass-card animate-fade-in">
      {/* Category Badge */}
      <span className="service-badge">{category}</span>

      {/* Service Image */}
      <div className="service-image-wrapper">
        <img 
          src={getServiceImage()} 
          alt={name} 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop'; // fallback clean image
          }} 
        />
        
        {/* Favorite Toggle Button */}
        <button 
          className={`favorite-btn ${favorited ? 'favorited' : ''}`} 
          onClick={() => toggleFavorite(service)}
          title={favorited ? 'Remove from Favorites' : 'Add to Favorites'}
        >
          <Heart size={20} fill={favorited ? '#ef4444' : 'none'} />
        </button>
      </div>

      {/* Service Details */}
      <div className="service-details">
        <h3 className="service-title">{name}</h3>
        <p className="service-description">{description}</p>
        
        <div className="service-footer">
          <div className="service-price">
            <span className="price-label">Price</span>
            <span className="price-amount">{formattedPrice}</span>
          </div>

          <div className="service-actions">
            {/* Contact Us Button */}
            <button className="buy-now-btn" onClick={handleBuyNow} style={{ width: '100%', justifyContent: 'center' }}>
              <MessageCircle size={16} />
              <span>Contact Us</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
