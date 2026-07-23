import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ServiceCard from '../components/ServiceCard';
import { Sparkles } from 'lucide-react';
import { API_BASE_URL } from '../config';
import '../styles/Services.css';

const Services = () => {
  const [services, setServices] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  
  const [visibleCount, setVisibleCount] = useState(6);
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/services`)
      .then((res) => res.json())
      .then((servicesData) => {
        if (Array.isArray(servicesData)) {
          setServices(servicesData);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching services data:', err);
        setLoading(false);
      });
  }, []);

  // Update categories when services change
  useEffect(() => {
    const uniqueCategories = ['All', ...new Set(services.map((item) => item.category))];
    setCategories(uniqueCategories);
    setSelectedCategory('All');
  }, [services]);

  // Filter and sort active items
  useEffect(() => {
    let filtered = [...services];

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
    setVisibleCount(6);
  }, [services, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="services-page container animate-fade-in">
      {/* Header */}
      <div className="services-header text-center" style={{ marginBottom: '24px' }}>
        <h1>Services</h1>
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
        <>
          <div className="services-grid">
            {filteredItems.slice(0, visibleCount).map((item) => (
              <ServiceCard key={item.id} service={item} />
            ))}
          </div>
          {filteredItems.length > visibleCount && (
            <div className="text-center" style={{ marginTop: '30px', marginBottom: '50px' }}>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={() => setVisibleCount(prev => prev + 6)}
              >
                <span>Show More</span>
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="no-services-box text-center glass-card">
          <h3>No Services Found</h3>
          <p>We couldn't find any services matching the selected criteria. Try resetting filters!</p>
        </div>
      )}
    </div>
  );
};

export default Services;
