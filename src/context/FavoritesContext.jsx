import React, { createContext, useState, useEffect, useContext } from 'react';
import { API_BASE_URL } from '../config';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('allo_cleaning_favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  useEffect(() => {
    localStorage.setItem('allo_cleaning_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Validation: Auto-remove favorites if they were deleted from the database
  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE_URL}/services`).then(res => res.json()).catch(() => []),
      fetch(`${API_BASE_URL}/products`).then(res => res.json()).catch(() => [])
    ]).then(([services, products]) => {
      if (Array.isArray(services) && Array.isArray(products)) {
        const validIds = new Set([
          ...services.map(s => s.id),
          ...products.map(p => p.id)
        ]);
        
        setFavorites(prev => {
          const filtered = prev.filter(item => validIds.has(item.id));
          if (filtered.length !== prev.length) {
            console.log("Removed deleted items from favorites");
          }
          return filtered;
        });
      }
    });
  }, []);

  const addToFavorites = (service) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.some((item) => item.id === service.id)) {
        return prevFavorites;
      }
      return [...prevFavorites, service];
    });
  };

  const removeFromFavorites = (serviceId) => {
    setFavorites((prevFavorites) => prevFavorites.filter((item) => item.id !== serviceId));
  };

  const toggleFavorite = (service) => {
    if (isFavorite(service.id)) {
      removeFromFavorites(service.id);
    } else {
      addToFavorites(service);
    }
  };

  const isFavorite = (serviceId) => {
    return favorites.some((item) => item.id === serviceId);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
