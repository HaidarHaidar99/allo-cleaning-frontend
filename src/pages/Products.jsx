import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { Sparkles } from 'lucide-react';
import { API_BASE_URL } from '../config';
import '../styles/Services.css';

const Products = () => {
  const [products, setProducts] = useState([]);
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
    fetch(`${API_BASE_URL}/products`)
      .then((res) => res.json())
      .then((productsData) => {
        if (Array.isArray(productsData)) {
          setProducts(productsData);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching products data:', err);
        setLoading(false);
      });
  }, []);

  // Update categories
  useEffect(() => {
    const uniqueCategories = ['All', ...new Set(products.map((item) => item.category))];
    setCategories(uniqueCategories);
    setSelectedCategory('All');
  }, [products]);

  // Filter and sort active items
  useEffect(() => {
    let filtered = [...products];

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
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="services-page container animate-fade-in">
      {/* Header */}
      <div className="services-header text-center">
        <div className="services-tag">
          <Sparkles size={16} className="text-cyan animate-pulse" />
          <span>Our Cleaning Products</span>
        </div>
        <h1>Browse Our Premium Cleaning Products</h1>
        <p>High-quality, eco-friendly cleaning supplies and equipment recommended by our professionals. Purchase directly or add to your cart.</p>
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
          <div className="products-grid">
            {filteredItems.slice(0, visibleCount).map((item) => (
              <ProductCard key={item.id} product={item} />
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
          <h3>No Products Found</h3>
          <p>We couldn't find any products matching the selected criteria. Try resetting filters!</p>
        </div>
      )}
    </div>
  );
};

export default Products;
