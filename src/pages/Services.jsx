import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ServiceCard from '../components/ServiceCard';
import { Sparkles } from 'lucide-react';
import { API_BASE_URL } from '../config';
import '../styles/Services.css';

const Services = () => {
  const [activeTab, setActiveTab] = useState('services');
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`${API_BASE_URL}/services`).then((res) => res.json()).catch(() => []),
      fetch(`${API_BASE_URL}/products`).then((res) => res.json()).catch(() => [])
    ])
      .then(([servicesData, productsData]) => {
        if (Array.isArray(servicesData)) {
          setServices(servicesData);
        }
        if (Array.isArray(productsData)) {
          setProducts(productsData);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching catalog data:', err);
        setLoading(false);
      });
  }, []);

  // Update categories and reset category selection when tab changes
  useEffect(() => {
    const currentItems = activeTab === 'services' ? services : products;
    const uniqueCategories = ['All', ...new Set(currentItems.map((item) => item.category))];
    setCategories(uniqueCategories);
    setSelectedCategory('All');
  }, [activeTab, services, products]);

  // Filter and sort active items
  useEffect(() => {
    const currentItems = activeTab === 'services' ? services : products;
    let filtered = [...currentItems];

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((item) => 
        item.name.toLowerCase().includes(q) || 
        item.category.toLowerCase().includes(q) || 
        (item.description && item.description.toLowerCase().includes(q))
      );
    }

    // Sort operations
    if (sortBy === 'price-asc') {
      filtered.sort((a, b) => parseFloat(a.price || 0) - parseFloat(b.price || 0));
    } else if (sortBy === 'price-desc') {
      filtered.sort((a, b) => parseFloat(b.price || 0) - parseFloat(a.price || 0));
    } else if (sortBy === 'name-asc') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name-desc') {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    }

    setFilteredItems(filtered);
  }, [activeTab, services, products, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="services-page container animate-fade-in">
      {/* Header */}
      <div className="services-header text-center">
        <div className="services-tag">
          <Sparkles size={16} className="text-cyan animate-pulse" />
          <span>Our Cleaning Catalog</span>
        </div>
        <h1>
          {activeTab === 'services' 
            ? 'Explore Our Professional Services' 
            : 'Browse Our Premium Cleaning Products'}
        </h1>
        <p>
          {activeTab === 'services'
            ? 'Compare prices, browse categories, and select the perfect cleaning solutions. Book instantly or add to your cart to customize your booking.'
            : 'High-quality, eco-friendly cleaning supplies and equipment recommended by our professionals. Purchase directly or add to your booking.'}
        </p>
      </div>

      {/* Catalog Selector Tabs */}
      <div className="catalog-tabs" style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '40px' }}>
        <button 
          className={`catalog-tab-btn ${activeTab === 'services' ? 'active' : ''}`}
          onClick={() => setActiveTab('services')}
          style={{
            padding: '12px 28px',
            fontSize: '1rem',
            fontWeight: '700',
            borderRadius: '50px',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            border: activeTab === 'services' ? '2px solid var(--accent-cyan)' : '2px solid var(--border-color)',
            backgroundColor: activeTab === 'services' ? 'var(--accent-cyan-light, #ecfeff)' : 'transparent',
            color: activeTab === 'services' ? 'var(--accent-cyan-hover, #0891b2)' : 'var(--text-medium)'
          }}
        >
          Services
        </button>
        <button 
          className={`catalog-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
          style={{
            padding: '12px 28px',
            fontSize: '1rem',
            fontWeight: '700',
            borderRadius: '50px',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            border: activeTab === 'products' ? '2px solid var(--accent-cyan)' : '2px solid var(--border-color)',
            backgroundColor: activeTab === 'products' ? 'var(--accent-cyan-light, #ecfeff)' : 'transparent',
            color: activeTab === 'products' ? 'var(--accent-cyan-hover, #0891b2)' : 'var(--text-medium)'
          }}
        >
          Products
        </button>
      </div>

      {/* Filter and Sort Control Bar */}
      <div className="filter-sort-bar">
        <div className="filter-group">
          <label htmlFor="category-select">Category</label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sort-select">Sort By</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="default">Recommended</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
          </select>
        </div>
      </div>

      {/* Grid Display */}
      {loading ? (
        <div className="loading-spinner-wrapper">
          <div className="spinner"></div>
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="services-grid">
          {filteredItems.map((item) => (
            <ServiceCard key={item.id} service={item} />
          ))}
        </div>
      ) : (
        <div className="no-services-box text-center glass-card">
          <h3>No {activeTab === 'services' ? 'Services' : 'Products'} Found</h3>
          <p>We couldn't find any {activeTab === 'services' ? 'services' : 'products'} matching the selected criteria. Try resetting filters!</p>
        </div>
      )}
    </div>
  );
};

export default Services;
