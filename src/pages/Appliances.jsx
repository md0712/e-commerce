import React, { useState, useMemo } from 'react';
import { ArrowUpDown, Sparkles, ChefHat } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';

export default function Appliances({ 
  onSelectProduct, 
  onAddToCart, 
  wishlist = [], 
  onToggleWishlist,
  cart = [],
  onUpdateQuantity,
  searchQuery = '',
  selectedSubcategory = 'all',
  setSelectedSubcategory,
  products: customProducts
}) {
  const allProducts = customProducts || products;
  const [selectedSubcat, setSelectedSubcat] = useState(selectedSubcategory);

  React.useEffect(() => {
    if (selectedSubcategory) {
      setSelectedSubcat(selectedSubcategory);
    }
  }, [selectedSubcategory]);

  const [sortBy, setSortBy] = useState('popular');
  const [maxPrice, setMaxPrice] = useState(20000);

  const appliancesProducts = useMemo(() => {
    return allProducts.filter(p => p.category === 'appliances');
  }, [allProducts]);

  const subcategories = [
    { id: 'all', label: 'All Appliances' },
    { id: 'mixers', label: 'Mixer Grinders' },
    { id: 'kitchen', label: 'Air Fryers & Microwave' },
    { id: 'home', label: 'RO Water Purifiers' }
  ];

  const filteredProducts = useMemo(() => {
    return appliancesProducts.filter(p => {
      const matchSubcat = selectedSubcat === 'all' || p.subcategory === selectedSubcat;
      const matchPrice = p.price <= maxPrice;
      const matchSearch = searchQuery === '' || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSubcat && matchPrice && matchSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'discount') return b.discount - a.discount;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [appliancesProducts, selectedSubcat, maxPrice, searchQuery, sortBy]);

  return (
    <div className="catalog-page">
      <div className="catalog-hero-banner appliances-banner">
        <div className="container banner-inner">
          <span className="banner-badge">Smart Kitchen &amp; Home Living</span>
          <h1 className="banner-heading">Kitchen &amp; Home Appliances</h1>
          <p className="banner-sub">
            Heavy-duty mixer grinders, oil-free digital air fryers, convection ovens, and copper mineral water purifiers.
          </p>
        </div>
      </div>

      <div className="container main-catalog-container">
        {/* Compact Short-Size Quick-Shortcut Toolbar */}
        <div className="compact-catalog-toolbar">
          {/* Row 1: Subcategory Shortcut Pills */}
          <div className="subcat-shortcut-strip">
            {subcategories.map(sub => (
              <button
                key={sub.id}
                className={`shortcut-pill-btn ${selectedSubcat === sub.id ? 'active' : ''}`}
                onClick={() => setSelectedSubcat(sub.id)}
              >
                {sub.label}
              </button>
            ))}
          </div>

          {/* Row 2: 1-Tap Sort & Price Shortcuts (Short & Easy) */}
          <div className="quick-filter-shortcuts-row">
            <span className="shortcuts-label">
              <Sparkles size={13} className="sparkle-shortcut-icon" /> Shortcuts:
            </span>

            {/* Quick Sort Shortcuts */}
            <button 
              type="button"
              className={`filter-shortcut-chip ${sortBy === 'popular' ? 'active' : ''}`}
              onClick={() => setSortBy('popular')}
            >
              Popular
            </button>
            <button 
              type="button"
              className={`filter-shortcut-chip ${sortBy === 'price-low' ? 'active' : ''}`}
              onClick={() => setSortBy('price-low')}
            >
              ↓ Price: Low-High
            </button>
            <button 
              type="button"
              className={`filter-shortcut-chip ${sortBy === 'price-high' ? 'active' : ''}`}
              onClick={() => setSortBy('price-high')}
            >
              ↑ Price: High-Low
            </button>
            <button 
              type="button"
              className={`filter-shortcut-chip ${sortBy === 'discount' ? 'active' : ''}`}
              onClick={() => setSortBy('discount')}
            >
              % Offers
            </button>
            <button 
              type="button"
              className={`filter-shortcut-chip ${sortBy === 'rating' ? 'active' : ''}`}
              onClick={() => setSortBy('rating')}
            >
              ★ Top Rated
            </button>

            <span className="shortcut-divider">|</span>

            {/* Quick Price Shortcuts */}
            <button 
              type="button"
              className={`filter-shortcut-chip ${maxPrice >= 20000 ? 'active' : ''}`}
              onClick={() => setMaxPrice(20000)}
            >
              All Prices
            </button>
            <button 
              type="button"
              className={`filter-shortcut-chip ${maxPrice === 6000 ? 'active' : ''}`}
              onClick={() => setMaxPrice(6000)}
            >
              &lt; ₹6K
            </button>
            <button 
              type="button"
              className={`filter-shortcut-chip ${maxPrice === 12000 ? 'active' : ''}`}
              onClick={() => setMaxPrice(12000)}
            >
              &lt; ₹12K
            </button>

            {/* Compact inline slider if custom price needed */}
            <div className="compact-price-slider">
              <span className="compact-price-text">Max: ₹{maxPrice.toLocaleString('en-IN')}</span>
              <input 
                type="range" 
                min="2000" 
                max="20000" 
                step="1000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="compact-range-slider"
                aria-label="Filter maximum price"
              />
            </div>
          </div>
        </div>

        <div className="results-count-bar">
          <span>Showing <strong>{filteredProducts.length}</strong> appliances</span>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="catalog-products-grid">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={onSelectProduct}
                onAddToCart={onAddToCart}
                isWishlisted={wishlist.some(item => item.id === product.id)}
                onToggleWishlist={onToggleWishlist}
                cartQuantity={cart?.find(item => item.id === product.id)?.quantity || 0}
                onUpdateQuantity={onUpdateQuantity}
              />
            ))}
          </div>
        ) : (
          <div className="no-products-box">
            <p>No appliances found matching your filters.</p>
            <button 
              className="btn-primary" 
              onClick={() => { setSelectedSubcat('all'); setMaxPrice(20000); }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      <style>{`
        .appliances-banner {
          background: linear-gradient(135deg, #14532d 0%, #064e3b 100%) !important;
        }
        .appliances-banner .banner-badge {
          background: rgba(74, 222, 128, 0.2);
          color: #86efac;
        }
      `}</style>
    </div>
  );
}
