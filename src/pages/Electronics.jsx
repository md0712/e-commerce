import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, ArrowUpDown, Tv, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';

export default function Electronics({ 
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
  const [maxPrice, setMaxPrice] = useState(100000);

  const electronicsProducts = useMemo(() => {
    return allProducts.filter(p => p.category === 'electronics');
  }, [allProducts]);

  const subcategories = [
    { id: 'all', label: 'All Electronics' },
    { id: 'tvs', label: 'Smart TVs & OLED' },
    { id: 'refrigerators', label: 'Inverter Refrigerators' },
    { id: 'washers', label: 'Washing Machines' },
    { id: 'acs', label: 'Air Conditioners' }
  ];

  const filteredProducts = useMemo(() => {
    return electronicsProducts.filter(p => {
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
  }, [electronicsProducts, selectedSubcat, maxPrice, searchQuery, sortBy]);

  return (
    <div className="catalog-page">
      {/* Banner */}
      <div className="catalog-hero-banner electronics-banner">
        <div className="container banner-inner">
          <span className="banner-badge">Official Brand Warranty &amp; Installation</span>
          <h1 className="banner-heading">Smart Electronics for Modern Homes</h1>
          <p className="banner-sub">
            4K UHD Smart TVs, Frost-Free Inverter Refrigerators, AI Steam Washers &amp; 5-Star Split ACs at unbeatable showroom prices.
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
              className={`filter-shortcut-chip ${maxPrice >= 100000 ? 'active' : ''}`}
              onClick={() => setMaxPrice(100000)}
            >
              All Prices
            </button>
            <button 
              type="button"
              className={`filter-shortcut-chip ${maxPrice === 35000 ? 'active' : ''}`}
              onClick={() => setMaxPrice(35000)}
            >
              &lt; ₹35K
            </button>
            <button 
              type="button"
              className={`filter-shortcut-chip ${maxPrice === 60000 ? 'active' : ''}`}
              onClick={() => setMaxPrice(60000)}
            >
              &lt; ₹60K
            </button>

            {/* Compact inline slider if custom price needed */}
            <div className="compact-price-slider">
              <span className="compact-price-text">Max: ₹{maxPrice.toLocaleString('en-IN')}</span>
              <input 
                type="range" 
                min="15000" 
                max="100000" 
                step="5000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="compact-range-slider"
                aria-label="Filter maximum price"
              />
            </div>
          </div>
        </div>

        {/* Count Bar */}
        <div className="results-count-bar">
          <span>Showing <strong>{filteredProducts.length}</strong> smart electronics</span>
          {searchQuery && (
            <span className="search-filter-tag">Search query: "{searchQuery}"</span>
          )}
        </div>

        {/* Product Grid */}
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
            <p>No electronics found matching your filters.</p>
            <button 
              className="btn-primary" 
              onClick={() => { setSelectedSubcat('all'); setMaxPrice(100000); }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      <style>{`
        .electronics-banner {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%) !important;
        }
        .electronics-banner .banner-badge {
          background: rgba(56, 189, 248, 0.2);
          color: #38bdf8;
        }
      `}</style>
    </div>
  );
}
