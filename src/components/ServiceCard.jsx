import React, { useState } from 'react';
import { Heart, Eye } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { ASSET_BASE_URL } from '../config';
import { useSettings } from '../context/SettingsContext';
import ItemDetailModal from './ItemDetailModal';
import '../styles/ServiceCard.css';

const ServiceCard = ({ service }) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { settings } = useSettings();
  const [showModal, setShowModal] = useState(false);

  const { id, name, category, description, imageUrl } = service;

  const getServiceImage = () => {
    if (service.imageBase64) return service.imageBase64;
    if (!imageUrl) return 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${ASSET_BASE_URL}${imageUrl}`;
  };

  const handleContactUs = () => {
    const rawWhatsApp = settings.whatsapp || '1234567890';
    const message = `Hello,

I would like to request the following service:

Service Name: ${name}
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

  return (
    <>
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
              e.target.src = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop';
            }} 
          />
          
          {/* Top Quick Actions */}
          <div className="card-top-actions">
            <button 
              className="quick-eye-btn" 
              onClick={() => setShowModal(true)}
              title="View Details"
            >
              <Eye size={18} />
            </button>
            <button 
              className={`favorite-btn ${favorited ? 'favorited' : ''}`} 
              onClick={() => toggleFavorite(service)}
              title={favorited ? 'Remove from Favorites' : 'Add to Favorites'}
            >
              <Heart size={18} fill={favorited ? '#ef4444' : 'none'} />
            </button>
          </div>
        </div>

        {/* Service Details */}
        <div className="service-details">
          <h3 className="service-title">{name}</h3>
          <p className="service-description">{description}</p>
          
          <div className="service-footer">
            <div className="service-actions" style={{ width: '100%' }}>
              {/* Contact Us Button */}
              <button className="buy-now-btn" onClick={handleContactUs} style={{ width: '100%', justifyContent: 'center' }}>
                <span>Contact Us</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <ItemDetailModal 
          item={service} 
          isProduct={false} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </>
  );
};

export default ServiceCard;
