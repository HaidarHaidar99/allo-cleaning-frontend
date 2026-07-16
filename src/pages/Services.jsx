import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ServiceCard from '../components/ServiceCard';
import { Sparkles } from 'lucide-react';
import { API_BASE_URL } from '../config';
import '../styles/Services.css';

const Services = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    // Fetch services from the backend API
    fetch(`${API_BASE_URL}/services`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setServices(data);

          // Dynamically extract categories from services list
          const uniqueCategories = ['All', ...new Set(data.map(s => s.category))];
          setCategories(uniqueCategories);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching services:', err);
        setLoading(false);
      });
  }, []);

  // Apply filtering based on selected category, search query, and sorting
  useEffect(() => {
    let filtered = [...services];

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(s => s.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(q) || 
        s.category.toLowerCase().includes(q) || 
        (s.description && s.description.toLowerCase().includes(q))
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

    setFilteredServices(filtered);
  }, [services, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="services-page container animate-fade-in">
      {/* Header */}
      <div className="services-header text-center">
        <div className="services-tag">
          <Sparkles size={16} className="text-cyan animate-pulse" />
          <span>Our Cleaning Catalog</span>
        </div>
        <h1>Explore Our Professional Services</h1>
        <p>
          Compare prices, browse categories, and select the perfect cleaning solutions. Book instantly or add to your cart to customize your booking.
        </p>
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

      {/* Services Grid */}
      {loading ? (
        <div className="loading-spinner-wrapper">
          <div className="spinner"></div>
        </div>
      ) : filteredServices.length > 0 ? (
        <div className="services-grid">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <div className="no-services-box text-center glass-card">
          <h3>No Services Found</h3>
          <p>We couldn't find any services matching the selected category. Try checking another category!</p>
        </div>
      )}
    </div>
  );
};

export default Services;
