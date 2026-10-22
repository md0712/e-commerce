import React from 'react';
import { X, SlidersHorizontal, ArrowUpDown, Tag, Star, RotateCcw, Check } from 'lucide-react';

export default function FilterModal({
  isOpen,
  onClose,
  title = "Filter & Sort Products",
  subcategories = [],
  selectedSubcat = 'all',
  setSelectedSubcat,
  sortBy = 'popular',
  setSortBy,
  maxPrice,
  setMaxPrice,
  minPriceLimit = 2000,
  maxPriceLimit = 60000,
  pricePresets = [],
  totalResults = 0
}) {
  if (!isOpen) return null;

  const handleReset = () => {
    setSelectedSubcat('all');
    setSortBy('popular');
    setMaxPrice(maxPriceLimit);
  };

  const sortOptions = [
    { id: 'popular', label: 'Popularity' },
    { id: 'price-low', label: 'Price: Low to High' },
    { id: 'price-high', label: 'Price: High to Low' },
    { id: 'discount', label: 'Highest Discount (%)' },
    { id: 'rating', label: 'Customer Rating (Top Rated)' }
  ];

  return (
    <div className="filter-modal-backdrop" onClick={onClose}>
      <div className="filter-modal-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="filter-modal-header">
          <div className="filter-title-group">
            <SlidersHorizontal size={18} className="filter-head-icon" />
            <h3>{title}</h3>
          </div>
          <div className="filter-header-actions">
            <button type="button" className="btn-reset-filters" onClick={handleReset}>
              <RotateCcw size={13} /> Reset
            </button>
            <button type="button" className="btn-close-filter-modal" onClick={onClose} aria-label="Close Filter">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="filter-modal-body">
          {/* Section 1: Price Range Filter */}
          <div className="filter-section">
            <div className="filter-section-title-row">
              <h4>Max Price Filter</h4>
              <span className="price-tag-highlight">Up to ₹{maxPrice?.toLocaleString('en-IN')}</span>
            </div>
            
            {/* Quick Price Presets */}
            {pricePresets.length > 0 && (
              <div className="filter-chip-grid">
                <button
                  type="button"
                  className={`filter-option-chip ${maxPrice >= maxPriceLimit ? 'selected' : ''}`}
                  onClick={() => setMaxPrice(maxPriceLimit)}
                >
                  All Prices
                </button>
                {pricePresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`filter-option-chip ${maxPrice === preset.val ? 'selected' : ''}`}
                    onClick={() => setMaxPrice(preset.val)}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            )}

            {/* Slider */}
            <div className="price-slider-wrap">
              <input
                type="range"
                min={minPriceLimit}
                max={maxPriceLimit}
                step={Math.round((maxPriceLimit - minPriceLimit) / 20)}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="modal-range-slider"
                aria-label="Filter maximum price"
              />
              <div className="slider-limits-row">
                <span>₹{minPriceLimit.toLocaleString('en-IN')}</span>
                <span>₹{maxPriceLimit.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Subcategories */}
          {subcategories.length > 0 && (
            <div className="filter-section">
              <h4>Category Filter</h4>
              <div className="filter-chip-grid">
                {subcategories.map((sub) => (
                  <button
                    key={sub.id}
                    type="button"
                    className={`filter-option-chip ${selectedSubcat === sub.id ? 'selected' : ''}`}
                    onClick={() => setSelectedSubcat(sub.id)}
                  >
                    {selectedSubcat === sub.id && <Check size={13} className="check-chip-icon" />}
                    {sub.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Sort Options */}
          <div className="filter-section">
            <div className="filter-section-title-row">
              <h4>Sort By</h4>
              <ArrowUpDown size={14} color="#8c3b10" />
            </div>
            <div className="filter-radio-list">
              {sortOptions.map((opt) => (
                <label 
                  key={opt.id} 
                  className={`filter-radio-item ${sortBy === opt.id ? 'active' : ''}`}
                  onClick={() => setSortBy(opt.id)}
                >
                  <input
                    type="radio"
                    name="sortByRadio"
                    value={opt.id}
                    checked={sortBy === opt.id}
                    onChange={() => setSortBy(opt.id)}
                  />
                  <span className="radio-label-text">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="filter-modal-footer">
          <button type="button" className="btn-apply-filters" onClick={onClose}>
            Apply Filters ({totalResults} Products)
          </button>
        </div>
      </div>

      <style>{`
        .filter-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.65);
          backdrop-filter: blur(4px);
          z-index: 1300;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          animation: fadeInBackdrop 0.2s ease-out;
        }
        @keyframes fadeInBackdrop {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .filter-modal-sheet {
          background: #ffffff;
          width: 100%;
          max-width: 520px;
          border-radius: 20px 20px 0 0;
          max-height: 85vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.2);
          animation: slideUpSheet 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes slideUpSheet {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }

        .filter-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid #ebdcd0;
          background: #faf7f2;
          border-radius: 20px 20px 0 0;
        }
        .filter-title-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .filter-head-icon {
          color: #8c3b10;
        }
        .filter-title-group h3 {
          font-size: 1.05rem;
          font-weight: 800;
          color: #24140e;
          margin: 0;
        }
        .filter-header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .btn-reset-filters {
          background: none;
          border: none;
          color: #8c3b10;
          font-size: 0.76rem;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 6px;
        }
        .btn-reset-filters:hover {
          background: #f4eee5;
        }
        .btn-close-filter-modal {
          background: #f0e6de;
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #24140e;
          transition: background 0.15s ease;
        }
        .btn-close-filter-modal:hover {
          background: #ebdcd0;
        }

        .filter-modal-body {
          padding: 16px 20px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .filter-section h4 {
          font-size: 0.85rem;
          font-weight: 700;
          color: #24140e;
          margin-bottom: 8px;
        }
        .filter-section-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .filter-section-title-row h4 {
          margin-bottom: 0;
        }
        .price-tag-highlight {
          font-size: 0.82rem;
          font-weight: 800;
          color: #8c3b10;
          background: #fff3ec;
          padding: 2px 8px;
          border-radius: 6px;
        }

        .filter-chip-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .filter-option-chip {
          padding: 6px 12px;
          border-radius: 20px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #334155;
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          transition: all 0.15s ease;
        }
        .filter-option-chip:hover {
          background: #f1f5f9;
        }
        .filter-option-chip.selected {
          background: #8c3b10;
          color: #ffffff;
          border-color: #8c3b10;
        }
        .check-chip-icon {
          color: #ffffff;
        }

        .price-slider-wrap {
          margin-top: 10px;
        }
        .modal-range-slider {
          width: 100%;
          height: 6px;
          accent-color: #8c3b10;
          cursor: pointer;
        }
        .slider-limits-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.72rem;
          color: #64748b;
          margin-top: 4px;
        }

        .filter-radio-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .filter-radio-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          border-radius: 8px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .filter-radio-item:hover {
          background: #f1f5f9;
        }
        .filter-radio-item.active {
          background: #fff3ec;
          border-color: #8c3b10;
        }
        .filter-radio-item input[type="radio"] {
          accent-color: #8c3b10;
          cursor: pointer;
        }
        .radio-label-text {
          font-size: 0.82rem;
          font-weight: 600;
          color: #1e293b;
        }

        .filter-modal-footer {
          padding: 14px 20px;
          border-top: 1px solid #ebdcd0;
          background: #faf7f2;
        }
        .btn-apply-filters {
          width: 100%;
          background: #8c3b10;
          color: #ffffff;
          border: none;
          padding: 12px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .btn-apply-filters:hover {
          background: #732f0c;
        }
      `}</style>
    </div>
  );
}
