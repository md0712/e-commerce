import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, ArrowUpDown, Check, Sparkles } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';

export default function Furniture({ 
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
  const [maxPrice, setMaxPrice] = useState(60000);

  const furnitureProducts = useMemo(() => {
    return allProducts.filter(p => p.category === 'furniture');
  }, [allProducts]);

  const subcategories = [
    { id: 'all', label: 'All Furniture' },
    { id: 'sofas', label: 'Sofas & Recliners' },
    { id: 'beds', label: 'Beds & Mattresses' },
    { id: 'dining', label: 'Dining Sets' },
    { id: 'wardrobes', label: 'Wardrobes' },
    { id: 'chairs', label: 'Chairs & Study' }
  ];

  const filteredProducts = useMemo(() => {
    return furnitureProducts.filter(p => {
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
      return 0; // Default popular
    });
  }, [furnitureProducts, selectedSubcat, maxPrice, searchQuery, sortBy]);

  return (
    <div className="catalog-page">
      {/* Catalog Hero Banner */}
      <div className="catalog-hero-banner">
        <div className="container banner-inner">
          <span className="banner-badge">Handcrafted Teak &amp; Sheesham</span>
          <h1 className="banner-heading">Living &amp; Bedroom Furniture</h1>
          <p className="banner-sub">
            Transform every corner of your home with timeless designs, ergonomic seating, and solid wood durability.
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
              className={`filter-shortcut-chip ${maxPrice >= 60000 ? 'active' : ''}`}
              onClick={() => setMaxPrice(60000)}
            >
              All Prices
            </button>
            <button 
              type="button"
              className={`filter-shortcut-chip ${maxPrice === 25000 ? 'active' : ''}`}
              onClick={() => setMaxPrice(25000)}
            >
              &lt; ₹25K
            </button>
            <button 
              type="button"
              className={`filter-shortcut-chip ${maxPrice === 40000 ? 'active' : ''}`}
              onClick={() => setMaxPrice(40000)}
            >
              &lt; ₹40K
            </button>

            {/* Compact inline slider if custom price needed */}
            <div className="compact-price-slider">
              <span className="compact-price-text">Max: ₹{maxPrice.toLocaleString('en-IN')}</span>
              <input 
                type="range" 
                min="5000" 
                max="60000" 
                step="2000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="compact-range-slider"
                aria-label="Filter maximum price"
              />
            </div>
          </div>
        </div>

        {/* Results Count & Active Status */}
        <div className="results-count-bar">
          <span>Showing <strong>{filteredProducts.length}</strong> premium furniture products</span>
          {searchQuery && (
            <span className="search-filter-tag">Filtered by: "{searchQuery}"</span>
          )}
        </div>

        {/* Products Grid */}
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
            <p>No furniture matches your filter criteria.</p>
            <button 
              className="btn-primary" 
              onClick={() => { setSelectedSubcat('all'); setMaxPrice(60000); }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      <style>{`
        .catalog-page {
          padding-bottom: 60px;
        }
        .catalog-hero-banner {
          background: linear-gradient(135deg, #3d2315 0%, #1e110a 100%);
          color: #ffffff;
          padding: 45px 0;
          margin-bottom: 30px;
        }
        .banner-inner {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .banner-badge {
          background: rgba(245, 158, 11, 0.2);
          color: #fde047;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: var(--radius-full);
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        .banner-heading {
          font-size: 2.2rem;
          color: #ffffff;
          margin-bottom: 8px;
        }
        .banner-sub {
          color: #e2d5cb;
          max-width: 600px;
          font-size: 0.95rem;
          line-height: 1.5;
        }

        /* Compact Short-Size Toolbar with 1-Tap Shortcuts */
        .compact-catalog-toolbar {
          background: #ffffff;
          border: 1px solid var(--color-border);
          border-radius: 14px;
          padding: 10px 14px;
          margin-bottom: 16px;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .subcat-shortcut-strip {
          display: flex;
          align-items: center;
          gap: 6px;
          overflow-x: auto;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
          padding-bottom: 2px;
        }
        .subcat-shortcut-strip::-webkit-scrollbar {
          display: none;
        }

        .shortcut-pill-btn {
          white-space: nowrap;
          padding: 6px 14px;
          border-radius: 20px;
          background: #f7f3ee;
          color: var(--color-text-main);
          font-size: 0.82rem;
          font-weight: 600;
          border: 1px solid transparent;
          cursor: pointer;
          transition: all 0.15s ease;
          flex-shrink: 0;
        }
        .shortcut-pill-btn:hover {
          background: #ebdcd0;
          color: var(--color-primary);
        }
        .shortcut-pill-btn.active {
          background: var(--color-primary);
          color: #ffffff;
          border-color: var(--color-primary);
        }

        .quick-filter-shortcuts-row {
          display: flex;
          align-items: center;
          gap: 6px;
          overflow-x: auto;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
          padding-top: 6px;
          border-top: 1px dashed #ebdcd0;
        }
        .quick-filter-shortcuts-row::-webkit-scrollbar {
          display: none;
        }

        .shortcuts-label {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.74rem;
          font-weight: 700;
          color: var(--color-warm-dark);
          white-space: nowrap;
          flex-shrink: 0;
          margin-right: 2px;
        }
        .sparkle-shortcut-icon {
          color: var(--color-primary);
        }

        .filter-shortcut-chip {
          white-space: nowrap;
          padding: 4px 10px;
          border-radius: 6px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          color: #374151;
          font-size: 0.76rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
          flex-shrink: 0;
        }
        .filter-shortcut-chip:hover {
          background: #f3f4f6;
          border-color: #d1d5db;
        }
        .filter-shortcut-chip.active {
          background: #fff3ec;
          border-color: var(--color-primary);
          color: var(--color-primary);
          font-weight: 700;
        }

        .shortcut-divider {
          color: #d1d5db;
          font-size: 0.75rem;
          flex-shrink: 0;
        }

        .compact-price-slider {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          padding: 2px 8px;
          flex-shrink: 0;
        }
        .compact-price-text {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--color-primary);
          white-space: nowrap;
        }
        .compact-range-slider {
          width: 80px;
          height: 4px;
          accent-color: var(--color-primary);
          cursor: pointer;
        }

        .results-count-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.85rem;
          color: var(--color-text-muted);
          margin-bottom: 24px;
        }
        .search-filter-tag {
          background: #fef3c7;
          color: #92400e;
          padding: 3px 10px;
          border-radius: var(--radius-full);
          font-weight: 600;
        }

        .catalog-products-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .no-products-box {
          text-align: center;
          padding: 60px 20px;
          background: #ffffff;
          border-radius: var(--radius-lg);
          border: 1px dashed var(--color-border);
        }
        .no-products-box p {
          margin-bottom: 16px;
          color: var(--color-text-muted);
          font-size: 1.05rem;
        }

        @media (max-width: 1100px) {
          .catalog-products-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 14px;
          }
        }
        @media (max-width: 800px) {
          .catalog-products-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
          .compact-catalog-toolbar {
            padding: 8px 10px;
            margin-bottom: 12px;
          }
        }
        @media (max-width: 640px) {
          .catalog-hero-banner {
            padding: 24px 0;
            margin-bottom: 14px;
          }
          .banner-heading {
            font-size: 1.5rem;
          }
          .banner-sub {
            font-size: 0.8rem;
          }
          .catalog-products-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
          }
          .results-count-bar {
            font-size: 0.78rem;
            margin-bottom: 12px;
          }
        }
      `}</style>
    </div>
  );
}
