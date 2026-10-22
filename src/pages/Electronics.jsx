import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, ArrowUpDown, Tv, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import FilterModal from '../components/FilterModal';
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
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

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

          {/* Row 2: 1-Tap Filter & Sort (Compact & Easy) */}
          <div className="quick-filter-shortcuts-row">
            <span className="shortcuts-label filter-label">
              <SlidersHorizontal size={13} className="filter-label-icon" /> Filter:
            </span>

            {/* All Filters Button */}
            <button 
              type="button"
              className={`filter-shortcut-chip main-filter-btn ${maxPrice < 100000 || selectedSubcat !== 'all' ? 'has-active-filters' : ''}`}
              onClick={() => setIsFilterModalOpen(true)}
              title="Open All Filters"
            >
              <Filter size={12} />
              <span>All Filters</span>
              {(maxPrice < 100000 || selectedSubcat !== 'all') && (
                <span className="active-dot"></span>
              )}
            </button>

            {/* Quick Price Filters */}
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
            <button 
              type="button"
              className={`filter-shortcut-chip ${maxPrice >= 100000 ? 'active' : ''}`}
              onClick={() => setMaxPrice(100000)}
            >
              All Prices
            </button>

            <span className="shortcut-divider">|</span>

            {/* Quick Sort Options */}
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
              ↓ Low-High
            </button>
            <button 
              type="button"
              className={`filter-shortcut-chip ${sortBy === 'price-high' ? 'active' : ''}`}
              onClick={() => setSortBy('price-high')}
            >
              ↑ High-Low
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

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        title="Filter & Sort Electronics"
        subcategories={subcategories}
        selectedSubcat={selectedSubcat}
        setSelectedSubcat={setSelectedSubcat}
        sortBy={sortBy}
        setSortBy={setSortBy}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        minPriceLimit={15000}
        maxPriceLimit={100000}
        pricePresets={[
          { label: '< ₹35,000', val: 35000 },
          { label: '< ₹60,000', val: 60000 }
        ]}
        totalResults={filteredProducts.length}
      />

      <style>{`
        .electronics-banner {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%) !important;
        }
        .electronics-banner .banner-badge {
          background: rgba(56, 189, 248, 0.2);
          color: #38bdf8;
        }
        .main-filter-btn {
          background: #8c3b10 !important;
          color: #ffffff !important;
          border-color: #8c3b10 !important;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          font-weight: 700;
        }
        .main-filter-btn:hover {
          background: #732f0c !important;
        }
        .has-active-filters {
          background: #b45309 !important;
        }
        .active-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #fde047;
          display: inline-block;
        }
        .filter-label-icon {
          color: #8c3b10;
        }
      `}</style>
    </div>
  );
}
