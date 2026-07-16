import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, Compass, CheckCircle, ArrowRight, Award, Smile } from 'lucide-react';
import Services from './Services';
import Contact from './Contact';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-page animate-fade-in">
      {/* 1. Hero Section */}
      <header className="hero-section">
        <div className="hero-container container">
          <div className="hero-content">
            <div className="hero-tag">
              <Sparkles size={16} className="text-cyan animate-pulse" />
              <span>Sparkling Clean, Guaranteed</span>
            </div>
            <h1>Professional Cleaning Services for Home & Office</h1>
            <p>
              Experience the joy of a spotless environment. We deliver top-tier, reliable, and eco-friendly cleaning services tailored to your exact needs.
            </p>
            <div className="hero-actions">
              <a href="#services-section" className="btn btn-primary">
                <span>Explore Services</span>
                <ArrowRight size={18} />
              </a>
              <a href="#contact-section" className="btn btn-outline">
                <span>Book Appointment</span>
              </a>
            </div>
          </div>
          <div className="hero-visual">
            <div className="blob-bg bg-cyan"></div>
            <img 
              src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop" 
              alt="Professional Cleaning"
              className="hero-img glass-card"
            />
          </div>
        </div>
      </header>

      {/* 2. Company Introduction / Stats */}
      <section className="stats-section">
        <div className="stats-container container">
          <div className="stat-card glass-card">
            <Smile size={36} className="text-cyan" />
            <div className="stat-number">5,000+</div>
            <div className="stat-label">Happy Customers</div>
          </div>
          <div className="stat-card glass-card">
            <CheckCircle size={36} className="text-green" />
            <div className="stat-number">12,000+</div>
            <div className="stat-label">Completed Jobs</div>
          </div>
          <div className="stat-card glass-card">
            <Shield size={36} className="text-cyan" />
            <div className="stat-number">150+</div>
            <div className="stat-label">Vetted Cleaners</div>
          </div>
          <div className="stat-card glass-card">
            <Award size={36} className="text-green" />
            <div className="stat-number">100%</div>
            <div className="stat-label">Satisfaction Rate</div>
          </div>
        </div>
      </section>

      {/* 3. Services Section */}
      <section id="services-section" className="section" style={{ borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-light)' }}>
        <Services />
      </section>

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
      <section id="contact-section" className="section" style={{ borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-white)' }}>
        <Contact />
      </section>
    </div>
  );
};

export default Home;
