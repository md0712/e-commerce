import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, ArrowUpDown, Sparkles, ChefHat } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import FilterModal from '../components/FilterModal';
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
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

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

          {/* Row 2: 1-Tap Filter & Sort (Compact & Easy) */}
          <div className="quick-filter-shortcuts-row">
            <span className="shortcuts-label filter-label">
              <SlidersHorizontal size={13} className="filter-label-icon" /> Filter:
            </span>

            {/* All Filters Button */}
            <button 
              type="button"
              className={`filter-shortcut-chip main-filter-btn ${maxPrice < 20000 || selectedSubcat !== 'all' ? 'has-active-filters' : ''}`}
              onClick={() => setIsFilterModalOpen(true)}
              title="Open All Filters"
            >
              <Filter size={12} />
              <span>All Filters</span>
              {(maxPrice < 20000 || selectedSubcat !== 'all') && (
                <span className="active-dot"></span>
              )}
            </button>

            {/* Quick Price Filters */}
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
            <button 
              type="button"
              className={`filter-shortcut-chip ${maxPrice >= 20000 ? 'active' : ''}`}
              onClick={() => setMaxPrice(20000)}
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

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        title="Filter & Sort Appliances"
        subcategories={subcategories}
        selectedSubcat={selectedSubcat}
        setSelectedSubcat={setSelectedSubcat}
        sortBy={sortBy}
        setSortBy={setSortBy}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        minPriceLimit={2000}
        maxPriceLimit={20000}
        pricePresets={[
          { label: '< ₹6,000', val: 6000 },
          { label: '< ₹12,000', val: 12000 }
        ]}
        totalResults={filteredProducts.length}
      />

      <style>{`
        .appliances-banner {
          background: linear-gradient(135deg, #14532d 0%, #064e3b 100%) !important;
        }
        .appliances-banner .banner-badge {
          background: rgba(74, 222, 128, 0.2);
          color: #86efac;
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
