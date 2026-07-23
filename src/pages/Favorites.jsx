import React from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import ServiceCard from '../components/ServiceCard';
import ProductCard from '../components/ProductCard';
import { Heart, ArrowLeft } from 'lucide-react';
import '../styles/Favorites.css';

const Favorites = () => {
  const { favorites } = useFavorites();

  return (
    <div className="favorites-page container animate-fade-in">
      {/* Header */}
      <div className="favorites-header" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px' }}>
        <Heart size={28} className="text-cyan fill-cyan" />
        <h1 style={{ margin: 0, fontSize: '2rem' }}>Favorites</h1>
      </div>

      {/* Favorites List */}
      {favorites.length > 0 ? (
        <div className="services-grid">
          {favorites.map((item) => (
            item.price 
              ? <ProductCard key={item.id} product={item} /> 
              : <ServiceCard key={item.id} service={item} />
          ))}
        </div>
      ) : (
        <div className="no-favorites-box text-center" style={{ padding: '40px 0' }}>
          <p style={{ color: 'var(--text-light)', marginBottom: '15px' }}>No favorites saved yet.</p>
          <Link to="/" className="btn btn-primary btn-small" style={{ display: 'inline-flex', alignItems: 'center' }}>
            <span>Go Back</span>
          </Link>
        </div>
      )}
    </div>
  );
};


export default Favorites;
