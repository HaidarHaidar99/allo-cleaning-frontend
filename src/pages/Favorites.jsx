import React from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import ServiceCard from '../components/ServiceCard';
import { Heart, Sparkles, ArrowRight } from 'lucide-react';
import '../styles/Favorites.css';

const Favorites = () => {
  const { favorites } = useFavorites();

  return (
    <div className="favorites-page container animate-fade-in">
      {/* Header */}
      <div className="favorites-header text-center">
        <div className="favorites-tag">
          <Heart size={16} className="text-cyan fill-cyan animate-pulse" />
          <span>Your Favorites</span>
        </div>
        <h1>Your Favorite Cleaning Services</h1>
        <p>
          Keep track of the cleaning packages you like most. Add them to your cart when ready, or book immediately via WhatsApp!
        </p>
      </div>

      {/* Favorites List */}
      {favorites.length > 0 ? (
        <div className="services-grid">
          {favorites.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <div className="no-favorites-box text-center glass-card">
          <div className="heart-icon-wrapper">
            <Heart size={48} className="text-light" />
          </div>
          <h3>No Favorites Saved Yet</h3>
          <p>Browse our services and click the heart icon on any card to save it here for quick access!</p>
          <Link to="/services" className="btn btn-primary">
            <span>Browse Services</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
};


export default Favorites;
