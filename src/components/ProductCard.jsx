import React from 'react';
import { Heart, ShoppingCart, MessageCircle } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import { ASSET_BASE_URL } from '../config';
import { useSettings } from '../context/SettingsContext';
import '../styles/ServiceCard.css'; // We'll just reuse the ServiceCard styling for now

const ProductCard = ({ product }) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addToCart, removeFromCart, isInCart } = useCart();
  const { settings } = useSettings();

  const { id, name, category, description, price, imageUrl } = product;

  // Format price
  const hasPrice = price !== undefined && price !== null && price !== '' && parseFloat(price) > 0;
  const formattedPrice = hasPrice ? `$${parseFloat(price).toFixed(2)}` : 'Contact Us';

  const getProductImage = () => {
    if (product.imageBase64) return product.imageBase64;
    if (!imageUrl) return 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${ASSET_BASE_URL}${imageUrl}`;
  };

  // Single Service "Buy Now" WhatsApp link generator
  const handleBuyNow = () => {
    const rawWhatsApp = settings.whatsapp || '1234567890';
    const message = `Hello,

I would like to purchase the following product:

Product Name: ${name}
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
  const inCart = isInCart(id);

  return (
    <div className="service-card glass-card animate-fade-in">
      {/* Category Badge */}
      <span className="service-badge">{category}</span>

      {/* Product Image */}
      <div className="service-image-wrapper">
        <img 
          src={getProductImage()}  
          alt={name} 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop'; // fallback clean image
          }} 
        />
        
        {/* Favorite Toggle Button */}
        <button 
          className={`favorite-btn ${favorited ? 'favorited' : ''}`} 
          onClick={() => toggleFavorite(product)}
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
            {/* Cart Button */}
            {inCart ? (
              <button 
                className="cart-toggle-btn in-cart" 
                onClick={() => removeFromCart(id)}
                title="Remove from Cart"
                style={{ flex: 1 }}
              >
                <ShoppingCart size={18} />
                <span>In Cart</span>
              </button>
            ) : (
              <button 
                className="cart-toggle-btn" 
                onClick={() => addToCart(product)}
                title="Add to Cart"
                style={{ flex: 1 }}
              >
                <ShoppingCart size={18} />
                <span>Add to Cart</span>
              </button>
            )}

            {/* Contact Us Button */}
            <button className="buy-now-btn" onClick={handleBuyNow} style={{ flex: 1, justifyContent: 'center' }}>
              <MessageCircle size={16} />
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
