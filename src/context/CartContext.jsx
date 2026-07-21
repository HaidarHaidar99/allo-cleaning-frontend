import React, { createContext, useState, useEffect, useContext } from 'react';
import { API_BASE_URL } from '../config';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('allo_cleaning_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('allo_cleaning_cart', JSON.stringify(cart));
  }, [cart]);

  // Validation: Auto-remove cart items if they were deleted from the database
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
        
        setCart(prev => {
          const filtered = prev.filter(item => validIds.has(item.id));
          if (filtered.length !== prev.length) {
            console.log("Removed deleted items from cart");
          }
          return filtered;
        });
      }
    });
  }, []);

  const addToCart = (service) => {
    setCart((prevCart) => {
      // Avoid adding duplicate services to the cart
      if (prevCart.some((item) => item.id === service.id)) {
        return prevCart;
      }
      return [...prevCart, service];
    });
  };

  const removeFromCart = (serviceId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== serviceId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const isInCart = (serviceId) => {
    return cart.some((item) => item.id === serviceId);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + parseFloat(item.price || 0), 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        isInCart,
        cartTotal: getCartTotal(),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
