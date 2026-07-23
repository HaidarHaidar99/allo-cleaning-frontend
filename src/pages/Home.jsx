import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, Compass, CheckCircle, Award, Smile } from 'lucide-react';
import Services from './Services';
import Products from './Products';
import Contact from './Contact';
import OffersBanner from '../components/OffersBanner';
import { useSettings } from '../context/SettingsContext';
import '../styles/Home.css';

const Home = () => {
  const { settings } = useSettings();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Compile active hero images ONLY from admin settings (no hardcoded unsplash fallbacks)
  const images = [];
  if (settings.heroImageBase64) images.push(settings.heroImageBase64);
  if (settings.heroImage2) images.push(settings.heroImage2);
  if (settings.heroImage3) images.push(settings.heroImage3);

  // Active carousel if heroMode is carousel AND multiple images exist
  const isCarousel = settings.heroMode === 'carousel' && images.length > 1;

  useEffect(() => {
    if (!isCarousel || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isCarousel, images.length]);

  return (
    <div className="home-page animate-fade-in">
      {/* 1. Full Screen Hero Section */}
      <header className="hero-section full-screen">
        <OffersBanner />
        {/* Background image layers for fade transition */}
        {images.map((img, index) => (
          <div 
            key={index} 
            className={`hero-bg-layer ${index === currentImageIndex ? 'active' : ''}`}
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
        <div className="hero-overlay"></div>
        <div className="hero-container-full container">
          <div className="hero-content-full animate-fade-in-up">
            <div className="hero-tag-full">
              <Sparkles size={16} className="text-cyan animate-pulse" />
              <span>{settings.heroTag}</span>
            </div>
            <h1 className="hero-title-full">{settings.heroTitle}</h1>
            <p className="hero-desc-full">{settings.heroDescription}</p>
            <div className="hero-actions-full">
              <a href="#services-section" className="btn btn-primary btn-lg">
                <span>Explore Now</span>
              </a>
              <a href="#contact-section" className="btn btn-outline-light btn-lg">
                <span>Contact Us</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Company Introduction / Stats */}
      <section className="stats-section">
        <div className="stats-container container">
          <div className="stat-card glass-card">
            <Smile size={36} className="text-cyan" />
            <div className="stat-number">{settings.stat1Number}</div>
            <div className="stat-label">{settings.stat1Label}</div>
          </div>
          <div className="stat-card glass-card">
            <CheckCircle size={36} className="text-green" />
            <div className="stat-number">{settings.stat2Number}</div>
            <div className="stat-label">{settings.stat2Label}</div>
          </div>
          <div className="stat-card glass-card">
            <Shield size={36} className="text-cyan" />
            <div className="stat-number">{settings.stat3Number}</div>
            <div className="stat-label">{settings.stat3Label}</div>
          </div>
          <div className="stat-card glass-card">
            <Award size={36} className="text-green" />
            <div className="stat-number">{settings.stat4Number}</div>
            <div className="stat-label">{settings.stat4Label}</div>
          </div>
        </div>
      </section>

      {/* 3. Services Section */}
      {settings?.activePages?.services && (
        <section id="services-section" className="section" style={{ borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-light)' }}>
          <Services />
        </section>
      )}

      {/* 3.5 Products Section */}
      {settings?.activePages?.products && (
        <section id="products-section" className="section" style={{ borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-white)' }}>
          <Products />
        </section>
      )}

      {/* 4. Why Choose Us Section */}
      <section className="why-choose-us section">
        <div className="container">
          <h2 className="section-title">Why Choose Allo Cleaning?</h2>
          <p className="section-subtitle">
            We go above and beyond to provide a pristine and healthy environment for you.
          </p>

          <div className="why-grid">
            <div className="why-card glass-card">
              <div className="why-icon-box bg-cyan">
                <Shield size={24} className="text-white" />
              </div>
              <h3>Fully Insured & Vetted Staff</h3>
              <p>
                Every member of our professional team goes through extensive background checks and rigorous training to ensure your peace of mind.
              </p>
            </div>

            <div className="why-card glass-card">
              <div className="why-icon-box bg-green">
                <Compass size={24} className="text-white" />
              </div>
              <h3>Eco-Friendly Cleaning Products</h3>
              <p>
                We use safe, non-toxic, and biodegradable cleaning products that protect your family, pets, and the environment.
              </p>
            </div>

            <div className="why-card glass-card">
              <div className="why-icon-box bg-cyan">
                <Sparkles size={24} className="text-white" />
              </div>
              <h3>100% Satisfaction Guarantee</h3>
              <p>
                Not happy with our work? Let us know within 24 hours, and we will clean it again for free. No questions asked.
              </p>
            </div>

            <div className="why-card glass-card">
              <div className="why-icon-box bg-green">
                <CheckCircle size={24} className="text-white" />
              </div>
              <h3>WhatsApp Seamless Booking</h3>
              <p>
                Pick your services, add them to your cart, and book instantly over WhatsApp. No long forms or complex calls required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Contact Section */}
      {settings?.activePages?.contact && (
        <section id="contact-section" className="section" style={{ borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-white)' }}>
          <Contact />
        </section>
      )}
    </div>
  );
};

export default Home;
