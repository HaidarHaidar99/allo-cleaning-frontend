import React, { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import '../styles/OffersBanner.css';

const OffersBanner = () => {
  const { settings } = useSettings();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const activeOffers = (settings?.offers || []).filter(
    (o) => o.active && o.text && o.text.trim() !== ''
  );

  useEffect(() => {
    if (activeOffers.length <= 1) return;

    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % activeOffers.length);
        setFade(true);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, [activeOffers.length]);

  if (activeOffers.length === 0) return null;

  const currentOffer = activeOffers[currentIndex] || activeOffers[0];

  return (
    <div className="offers-banner">
      <div className="offers-banner-container">
        <div className={`offer-content ${fade ? 'fade-in' : 'fade-out'}`}>
          <span className="offer-text">{currentOffer.text}</span>
        </div>
      </div>
    </div>
  );
};

export default OffersBanner;
