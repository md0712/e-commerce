import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, Search, Share2, Heart, ShoppingBag, Plus, Minus, 
  ChevronDown, ChevronUp, ChevronRight, Percent, Star, CheckCircle2, 
  Truck, ShieldCheck, MapPin, MessageCircle, Info, Sparkles
} from 'lucide-react';
import { products } from '../data/products';

export default function ProductDetails({ 
  product, 
  onBack, 
  onAddToCart, 
  onSelectProduct,
  isWishlisted = false, 
  onToggleWishlist,
  cartItem,
  cartCount = 0,
  cart = [],
  wishlist = [],
  onUpdateQuantity,
  onRemoveFromCart,
  onOpenCart
}) {
  if (!product) return null;

  const {
    id,
    name,
    category,
    subcategory,
    price,
    originalPrice,
    discount,
    rating = 4.8,
    reviewsCount = 84,
    badge,
    image,
    gallery = [image],
    description,
    features = [],
    specifications = {}
  } = product;

  const [activeImage, setActiveImage] = useState(gallery[0] || image);
  const [localAddedQty, setLocalAddedQty] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [shareToast, setShareToast] = useState(false);
  const carouselRef = useRef(null);

  // Quick-Commerce Accordion States (About the Product OPEN by default as in screenshot)
  const [openAccordions, setOpenAccordions] = useState({
    about: true,        // Open by default
    ingredients: false, // Collapsed
    nutritional: false, // Collapsed
    otherInfo: false    // Collapsed
  });

  const toggleAccordion = (key) => {
    setOpenAccordions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Sync with cart item quantity
  const currentQty = cartItem ? cartItem.quantity : localAddedQty;

  const handleAddInitialToCart = () => {
    if (onAddToCart) {
      onAddToCart(product, 1);
    }
    setLocalAddedQty(1);
  };

  const handleIncreaseQty = () => {
    const nextQty = currentQty + 1;
    if (onUpdateQuantity && cartItem) {
      onUpdateQuantity(product.id, nextQty);
    } else if (onAddToCart) {
      onAddToCart(product, 1);
    }
    setLocalAddedQty(nextQty);
  };

  const handleDecreaseQty = () => {
    if (currentQty > 1) {
      const nextQty = currentQty - 1;
      if (onUpdateQuantity && cartItem) {
        onUpdateQuantity(product.id, nextQty);
      }
      setLocalAddedQty(nextQty);
    } else {
      if (onRemoveFromCart && cartItem) {
        onRemoveFromCart(product.id);
      }
      setLocalAddedQty(0);
    }
  };

  const formatPrice = (val) => {
    if (!val) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${name} | Sardar Mart`,
        text: `Check out ${name} at Sardar Mart:`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2400);
    }
  };

  const handleWhatsAppChat = () => {
    const msg = encodeURIComponent(
      `Hello Sardar Mart! I'm interested in "${name}" (${id}) priced at ${formatPrice(price)}. Could you share showroom availability and delivery details?`
    );
    window.open(`https://wa.me/916383056338?text=${msg}`, '_blank');
  };

  const scrollCarouselRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 240, behavior: 'smooth' });
    }
  };

  // Dynamic unit / pack size label (e.g. 950 g / 3-Seater / 55-Inch)
  const getUnitTag = () => {
    if (specifications) {
      if (specifications['Seating Capacity']) return specifications['Seating Capacity'];
      if (specifications['Capacity']) return specifications['Capacity'];
      if (specifications['Screen Size']) return specifications['Screen Size'];
      if (specifications['Weight']) return specifications['Weight'];
      if (specifications['Dimensions (W x D x H)']) {
        return specifications['Dimensions (W x D x H)'].split('x')[0].trim();
      }
    }
    return category === 'furniture' ? 'Standard Size' : '1 Unit';
  };

  // Recommended "People also bought" items
  const relatedProducts = products
    .filter(p => p.id !== id)
    .sort((a, b) => (b.category === category ? 1 : 0) - (a.category === category ? 1 : 0))
    .slice(0, 8);

  return (
    <div className="qk-product-page">
      {/* 1. TOP STICKY APP BAR (Exact layout from screenshot) */}
      <header className="qk-top-bar">
        <button className="qk-circle-icon-btn back-btn" onClick={onBack} aria-label="Go back" title="Back">
          <ArrowLeft size={18} />
        </button>

        <div className="qk-top-title-stack">
          <h1 className="qk-top-product-name" title={name}>{name}</h1>
          <div className="qk-top-price-row">
            <strong className="qk-top-curr-price">{formatPrice(price)}</strong>
            {originalPrice && originalPrice > price && (
              <span className="qk-top-mrp">{formatPrice(originalPrice)}</span>
            )}
            <span className="qk-top-unit-pill">{getUnitTag()}</span>
          </div>
        </div>

        <div className="qk-top-actions">
          <button 
            className="qk-circle-icon-btn" 
            onClick={() => setSearchOpen(!searchOpen)} 
            aria-label="Search" 
            title="Search products"
          >
            <Search size={18} />
          </button>
          <button 
            className="qk-circle-icon-btn" 
            onClick={handleShare} 
            aria-label="Share" 
            title="Share Product"
          >
            <Share2 size={18} />
          </button>
        </div>
      </header>

      {/* Slide-down search drawer if toggled */}
      {searchOpen && (
        <div className="qk-search-drawer animate-fade-in">
          <div className="qk-search-box">
            <Search size={16} className="qk-search-box-icon" />
            <input 
              type="text" 
              placeholder={`Search similar to ${name}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Copy link toast feedback */}
      {shareToast && (
        <div className="qk-toast-alert animate-fade-in">
          <span>✓ Link copied to clipboard!</span>
        </div>
      )}

      <main className="qk-main-scroll-content">
        <div className="qk-content-container">
          {/* 2. PRODUCT HERO MEDIA DISPLAY */}
          <section className="qk-hero-media-card">
            <div className="qk-hero-image-wrap">
              <img src={activeImage} alt={name} className="qk-hero-img" />
              
              {badge && <span className="qk-hero-pill-badge">{badge}</span>}
              {discount > 0 && <span className="qk-hero-discount-pill">{discount}% OFF</span>}
              
              <button 
                className={`qk-hero-wishlist-btn ${isWishlisted ? 'active' : ''}`}
                onClick={() => onToggleWishlist(product)}
                aria-label="Wishlist"
                title={isWishlisted ? "Saved in Wishlist" : "Add to Wishlist"}
              >
                <Heart 
                  size={20} 
                  fill={isWishlisted ? "#e11d48" : "none"} 
                  color={isWishlisted ? "#e11d48" : "#4b5563"} 
                />
              </button>
            </div>

            {/* Gallery Thumbnails if multiple images exist */}
            {gallery.length > 1 && (
              <div className="qk-thumbnails-strip">
                {gallery.map((imgUrl, idx) => (
                  <button 
                    key={idx}
                    className={`qk-thumb-btn ${activeImage === imgUrl ? 'active' : ''}`}
                    onClick={() => setActiveImage(imgUrl)}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* 3. PRODUCT DETAILS SECTION (Exact Accordion Model from screenshot) */}
          <section className="qk-details-section">
            <h2 className="qk-section-heading">Product details</h2>

            <div className="qk-accordions-group">
              {/* Accordion 1: About the Product (Expanded by default as in screenshot) */}
              <div className={`qk-accordion-card ${openAccordions.about ? 'is-open' : ''}`}>
                <button 
                  type="button"
                  className="qk-accordion-header" 
                  onClick={() => toggleAccordion('about')}
                  aria-expanded={openAccordions.about}
                >
                  <span className="qk-accordion-title">About the Product</span>
                  <span className="qk-chevron-wrap">
                    {openAccordions.about ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </span>
                </button>
                {openAccordions.about && (
                  <div className="qk-accordion-body animate-fade-in">
                    <p className="qk-body-text">{description}</p>
                    <p className="qk-body-text sub">
                      Every piece at Sardar Mart is curated with rigorous quality standards, engineered for durability, and crafted to deliver timeless comfort. Built to celebrate moments of happiness in your home.
                    </p>
                  </div>
                )}
              </div>

              {/* Accordion 2: Ingredients / Key Highlights & Features */}
              <div className={`qk-accordion-card ${openAccordions.ingredients ? 'is-open' : ''}`}>
                <button 
                  type="button"
                  className="qk-accordion-header" 
                  onClick={() => toggleAccordion('ingredients')}
                  aria-expanded={openAccordions.ingredients}
                >
                  <span className="qk-accordion-title">
                    {category === 'appliances' ? 'Highlights & Safety Features' : 'Ingredients & Materials'}
                  </span>
                  <span className="qk-chevron-wrap">
                    {openAccordions.ingredients ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </span>
                </button>
                {openAccordions.ingredients && (
                  <div className="qk-accordion-body animate-fade-in">
                    <ul className="qk-features-bullets">
                      {(features && features.length > 0 ? features : [
                        'Heavy-duty kiln-dried hardwood & structural reinforcement',
                        'High-density 32-gauge resilient foam cushioning',
                        'Stain-resistant, easy-to-wipe breathable premium upholstery',
                        'Tested for 100,000+ stress & durability cycles',
                        'Zero harmful chemical emissions & eco-certified finishes'
                      ]).map((feat, i) => (
                        <li key={i}>
                          <span className="qk-bullet-point">•</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Accordion 3: Nutritional Facts / Technical Specifications */}
              <div className={`qk-accordion-card ${openAccordions.nutritional ? 'is-open' : ''}`}>
                <button 
                  type="button"
                  className="qk-accordion-header" 
                  onClick={() => toggleAccordion('nutritional')}
                  aria-expanded={openAccordions.nutritional}
                >
                  <span className="qk-accordion-title">
                    {category === 'appliances' ? 'Technical Specs & Energy Rating' : 'Nutritional Facts & Dimensions'}
                  </span>
                  <span className="qk-chevron-wrap">
                    {openAccordions.nutritional ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </span>
                </button>
                {openAccordions.nutritional && (
                  <div className="qk-accordion-body animate-fade-in">
                    <div className="qk-specs-table">
                      {Object.entries(specifications).map(([key, val], idx) => (
                        <div key={idx} className="qk-specs-row">
                          <span className="qk-spec-label">{key}</span>
                          <span className="qk-spec-value">{val}</span>
                        </div>
                      ))}
                      <div className="qk-specs-row">
                        <span className="qk-spec-label">Model Identifier</span>
                        <span className="qk-spec-value">{id.toUpperCase()}</span>
                      </div>
                      <div className="qk-specs-row">
                        <span className="qk-spec-label">Customer Rating</span>
                        <span className="qk-spec-value">★ {rating} / 5.0 ({reviewsCount} verified reviews)</span>
                      </div>
                      <div className="qk-specs-row">
                        <span className="qk-spec-label">Package Inclusions</span>
                        <span className="qk-spec-value">Main Unit, Installation Kit, User Handbook &amp; GST Warranty Card</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 4: Other Product Info */}
              <div className={`qk-accordion-card ${openAccordions.otherInfo ? 'is-open' : ''}`}>
                <button 
                  type="button"
                  className="qk-accordion-header" 
                  onClick={() => toggleAccordion('otherInfo')}
                  aria-expanded={openAccordions.otherInfo}
                >
                  <span className="qk-accordion-title">Other Product Info</span>
                  <span className="qk-chevron-wrap">
                    {openAccordions.otherInfo ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </span>
                </button>
                {openAccordions.otherInfo && (
                  <div className="qk-accordion-body animate-fade-in">
                    <div className="qk-info-rows">
                      <div className="qk-info-block">
                        <strong>Country of Origin:</strong>
                        <span>India</span>
                      </div>
                      <div className="qk-info-block">
                        <strong>Authorized Showroom &amp; Dispatcher:</strong>
                        <span>Sardar Mart, 190, Erukkenchery High Rd, Anbalagan Colony, Vyasarpadi, Chennai, Tamil Nadu 600039</span>
                      </div>
                      <div className="qk-info-block">
                        <strong>Showroom Phone Helpline:</strong>
                        <span>+91 63830 56338</span>
                      </div>
                      <div className="qk-info-block">
                        <strong>GST &amp; Invoicing:</strong>
                        <span>100% Tax Compliant Invoice (GSTIN Included) with White-Glove Handover</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* 4. "PEOPLE ALSO BOUGHT" HORIZONTAL CAROUSEL (Exact model from screenshot) */}
          <section className="qk-people-bought-section">
            <div className="qk-people-bought-header">
              <h3 className="qk-people-heading">People also bought</h3>
              <button 
                type="button"
                className="qk-carousel-arrow-btn" 
                onClick={scrollCarouselRight} 
                aria-label="Next items"
                title="Scroll next"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="qk-carousel-scroll-track" ref={carouselRef}>
              {relatedProducts.map((relProduct) => {
                const isRelWish = wishlist?.some(w => w.id === relProduct.id);
                const relVariantLabel = 
                  relProduct.specifications?.['Seating Capacity'] || 
                  relProduct.specifications?.['Capacity'] || 
                  relProduct.specifications?.['Screen Size'] || 
                  'Standard ▾';

                return (
                  <div key={relProduct.id} className="qk-product-card-unit">
                    <div 
                      className="qk-card-img-box" 
                      onClick={() => onSelectProduct && onSelectProduct(relProduct)}
                    >
                      {/* Top Badges (AD badge & Veg/Quality assurance icon) */}
                      <div className="qk-card-badge-row">
                        <span className="qk-badge-ad">AD</span>
                        <span className="qk-badge-quality-dot" title="Quality Certified">
                          <span className="dot-green" />
                        </span>
                      </div>

                      <img src={relProduct.image} alt={relProduct.name} className="qk-card-thumb" />

                      {/* Wishlist Heart Icon (Bottom-Left of Image) */}
                      <button 
                        type="button"
                        className="qk-card-heart-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWishlist && onToggleWishlist(relProduct);
                        }}
                        aria-label="Wishlist"
                        title={isRelWish ? "In Wishlist" : "Save to Wishlist"}
                      >
                        <Heart 
                          size={15} 
                          fill={isRelWish ? "#e11d48" : "none"} 
                          color={isRelWish ? "#e11d48" : "#9ca3af"} 
                        />
                      </button>

                      {/* Circular Green Plus Button (Bottom-Right of Image) */}
                      <button 
                        type="button"
                        className="qk-card-quick-add-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart && onAddToCart(relProduct, 1);
                        }}
                        aria-label="Quick Add to Basket"
                        title="Add 1 to Basket"
                      >
                        <Plus size={18} color="#ffffff" strokeWidth={2.8} />
                      </button>
                    </div>

                    {/* Weight / Variant Dropdown Selector Pill */}
                    <div className="qk-variant-dropdown-pill">
                      <span>{relVariantLabel.replace('▾', '').trim()}</span>
                      <ChevronDown size={13} className="pill-arrow" />
                    </div>

                    {/* Product Name & Pricing */}
                    <div 
                      className="qk-card-text-block" 
                      onClick={() => onSelectProduct && onSelectProduct(relProduct)}
                    >
                      <h4 className="qk-card-product-name" title={relProduct.name}>
                        {relProduct.name}
                      </h4>
                      <div className="qk-card-price-stack">
                        <strong className="qk-card-price">{formatPrice(relProduct.price)}</strong>
                        {relProduct.originalPrice && relProduct.originalPrice > relProduct.price && (
                          <span className="qk-card-mrp">{formatPrice(relProduct.originalPrice)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* WhatsApp Direct Showroom Chat Link */}
          <section className="qk-showroom-chat-section">
            <button 
              type="button" 
              className="qk-wa-contact-btn"
              onClick={handleWhatsAppChat}
            >
              <MessageCircle size={18} color="#22c55e" />
              <span>Have a question about this product? Chat with our Showroom</span>
            </button>
          </section>
        </div>
      </main>

      {/* 5. FLOATING PROMO / UNLOCK PILL (Positioned right above sticky bottom bar) */}
      <div className="qk-promo-sticky-wrapper">
        <div className="qk-promo-unlock-pill">
          <div className="qk-promo-left-meta">
            <div className="qk-promo-badge-circle">
              <Percent size={13} color="#059669" strokeWidth={3} />
            </div>
            <div className="qk-promo-copy">
              <strong>Pick 2 products</strong>
              <span>₹9 store unlocked • Free Delivery!</span>
            </div>
          </div>
          <ChevronRight size={18} className="qk-promo-chevron" />
        </div>
      </div>

      {/* 6. STICKY BOTTOM BAR (Exact Basket & Quantity Pill from screenshot) */}
      <footer className="qk-sticky-bottom-bar">
        <div className="qk-bottom-bar-inner">
          {/* Left: Basket Pill Button (Opens Cart Drawer) */}
          <button 
            type="button"
            className="qk-basket-pill-button"
            onClick={() => onOpenCart && onOpenCart()}
            aria-label="View Basket"
            title="Open Basket"
          >
            <div className="qk-basket-bag-icon">
              <ShoppingBag size={19} color="#059669" />
            </div>
            <span className="qk-basket-word">Basket</span>
            <span className="qk-basket-count-bubble">{cartCount || 0}</span>
          </button>

          {/* Right: Quantity Selector Capsule (Minus, Count, Plus Circle) */}
          {currentQty === 0 ? (
            <button 
              type="button"
              className="qk-add-basket-cta"
              onClick={handleAddInitialToCart}
            >
              <Plus size={18} strokeWidth={2.6} />
              <span>Add</span>
            </button>
          ) : (
            <div className="qk-qty-capsule-control">
              <button 
                type="button"
                className="qk-qty-btn-minus"
                onClick={handleDecreaseQty}
                aria-label="Decrease quantity"
                title={currentQty === 1 ? "Remove from basket" : "Decrease"}
              >
                <Minus size={16} strokeWidth={2.6} />
              </button>
              <span className="qk-qty-value-num">{currentQty}</span>
              <button 
                type="button"
                className="qk-qty-btn-plus"
                onClick={handleIncreaseQty}
                aria-label="Increase quantity"
                title="Add 1 more"
              >
                <Plus size={16} color="#ffffff" strokeWidth={2.6} />
              </button>
            </div>
          )}
        </div>
      </footer>

      {/* SCOPED COMPONENT STYLES (Pixel-matched to screenshot) */}
      <style>{`
        .qk-product-page {
          background: #ffffff;
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          color: #111827;
          position: relative;
          padding-bottom: 150px;
        }

        /* 1. TOP STICKY BAR */
        .qk-top-bar {
          position: sticky;
          top: 0;
          left: 0;
          right: 0;
          background: #ffffff;
          z-index: 100;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 16px;
          border-bottom: 1px solid #f1f3f5;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
        }

        .qk-circle-icon-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #f3f4f6;
          border: 1px solid #e5e7eb;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #1f2937;
          cursor: pointer;
          flex-shrink: 0;
          transition: background 0.15s ease, transform 0.1s ease;
        }
        .qk-circle-icon-btn:hover {
          background: #e5e7eb;
        }
        .qk-circle-icon-btn:active {
          transform: scale(0.95);
        }

        .qk-top-title-stack {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .qk-top-product-name {
          font-size: 0.96rem;
          font-weight: 700;
          color: #111827;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.25;
        }

        .qk-top-price-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.88rem;
          line-height: 1.2;
        }
        .qk-top-curr-price {
          font-size: 1.05rem;
          font-weight: 800;
          color: #111827;
        }
        .qk-top-mrp {
          color: #9ca3af;
          text-decoration: line-through;
          font-size: 0.84rem;
        }
        .qk-top-unit-pill {
          color: #6b7280;
          font-size: 0.82rem;
          border-left: 1px solid #e5e7eb;
          padding-left: 8px;
          font-weight: 500;
          white-space: nowrap;
        }

        .qk-top-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        /* Search Drawer */
        .qk-search-drawer {
          background: #ffffff;
          padding: 8px 16px 12px;
          border-bottom: 1px solid #e5e7eb;
        }
        .qk-search-box {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #f3f4f6;
          border-radius: 10px;
          padding: 8px 14px;
        }
        .qk-search-box-icon {
          color: #6b7280;
        }
        .qk-search-box input {
          flex: 1;
          border: none;
          background: transparent;
          font-size: 0.9rem;
          outline: none;
          color: #111827;
        }

        /* Toast */
        .qk-toast-alert {
          position: fixed;
          top: 66px;
          left: 50%;
          transform: translateX(-50%);
          background: #111827;
          color: #ffffff;
          padding: 8px 18px;
          border-radius: 20px;
          font-size: 0.84rem;
          font-weight: 600;
          z-index: 1000;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        /* MAIN CONTENT */
        .qk-main-scroll-content {
          width: 100%;
        }
        .qk-content-container {
          max-width: 680px;
          margin: 0 auto;
          padding: 16px;
        }

        /* 2. PRODUCT HERO DISPLAY */
        .qk-hero-media-card {
          margin-bottom: 24px;
        }
        .qk-hero-image-wrap {
          position: relative;
          width: 100%;
          height: 380px;
          background: #fbfbfc;
          border-radius: 18px;
          overflow: hidden;
          border: 1px solid #f1f3f5;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .qk-hero-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          transition: transform 0.3s ease;
        }

        .qk-hero-pill-badge {
          position: absolute;
          top: 14px;
          left: 14px;
          background: #111827;
          color: #ffffff;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 6px;
          letter-spacing: 0.5px;
        }
        .qk-hero-discount-pill {
          position: absolute;
          top: 14px;
          left: 100px;
          background: #dc2626;
          color: #ffffff;
          font-size: 0.72rem;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 6px;
        }
        .qk-hero-wishlist-btn {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(4px);
          border: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.06);
          transition: transform 0.15s ease;
        }
        .qk-hero-wishlist-btn:active {
          transform: scale(0.9);
        }

        .qk-thumbnails-strip {
          display: flex;
          gap: 10px;
          margin-top: 12px;
          overflow-x: auto;
          scrollbar-width: none;
          padding-bottom: 2px;
        }
        .qk-thumbnails-strip::-webkit-scrollbar {
          display: none;
        }
        .qk-thumb-btn {
          width: 64px;
          height: 64px;
          border-radius: 10px;
          background: #f9fafb;
          border: 1.5px solid #e5e7eb;
          padding: 4px;
          cursor: pointer;
          flex-shrink: 0;
          transition: border-color 0.2s ease;
        }
        .qk-thumb-btn.active {
          border-color: #059669;
        }
        .qk-thumb-btn img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 6px;
        }

        /* 3. "PRODUCT DETAILS" ACCORDIONS */
        .qk-details-section {
          margin-bottom: 30px;
        }
        .qk-section-heading {
          font-size: 1.28rem;
          font-weight: 800;
          color: #111827;
          margin: 0 0 16px 2px;
          letter-spacing: -0.3px;
        }

        .qk-accordions-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .qk-accordion-card {
          background: #f9fafb;
          border: 1px solid #f3f4f6;
          border-radius: 14px;
          overflow: hidden;
          transition: background 0.2s ease, border-color 0.2s ease;
        }
        .qk-accordion-card.is-open {
          background: #f9fafb;
          border-color: #e5e7eb;
        }

        .qk-accordion-header {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 18px;
          background: transparent;
          border: none;
          cursor: pointer;
          text-align: left;
        }
        .qk-accordion-title {
          font-size: 1.02rem;
          font-weight: 700;
          color: #111827;
          letter-spacing: -0.2px;
        }
        .qk-chevron-wrap {
          color: #374151;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .qk-accordion-body {
          padding: 0 18px 18px;
        }
        .qk-body-text {
          font-size: 0.92rem;
          color: #4b5563;
          line-height: 1.6;
          margin: 0 0 10px;
        }
        .qk-body-text.sub {
          margin-bottom: 0;
          color: #6b7280;
          font-size: 0.88rem;
        }

        .qk-features-bullets {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .qk-features-bullets li {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 0.9rem;
          color: #4b5563;
          line-height: 1.5;
        }
        .qk-bullet-point {
          color: #059669;
          font-weight: 900;
          font-size: 1.1rem;
          line-height: 1;
        }

        .qk-specs-table {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .qk-specs-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #edf0f2;
          font-size: 0.88rem;
        }
        .qk-specs-row:last-child {
          border-bottom: none;
        }
        .qk-spec-label {
          color: #6b7280;
          font-weight: 500;
          width: 42%;
        }
        .qk-spec-value {
          color: #111827;
          font-weight: 600;
          width: 58%;
          text-align: right;
        }

        .qk-info-rows {
          display: flex;
          flex-direction: column;
          gap: 10px;
          font-size: 0.88rem;
        }
        .qk-info-block {
          line-height: 1.5;
        }
        .qk-info-block strong {
          color: #111827;
          display: block;
          margin-bottom: 2px;
        }
        .qk-info-block span {
          color: #4b5563;
        }

        /* 4. "PEOPLE ALSO BOUGHT" CAROUSEL */
        .qk-people-bought-section {
          margin-bottom: 28px;
        }
        .qk-people-bought-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }
        .qk-people-heading {
          font-size: 1.25rem;
          font-weight: 800;
          color: #111827;
          margin: 0;
          letter-spacing: -0.3px;
        }
        .qk-carousel-arrow-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #f3f4f6;
          border: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #374151;
          cursor: pointer;
        }

        .qk-carousel-scroll-track {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          padding-bottom: 6px;
          scrollbar-width: none;
        }
        .qk-carousel-scroll-track::-webkit-scrollbar {
          display: none;
        }

        .qk-product-card-unit {
          width: 156px;
          flex-shrink: 0;
          scroll-snap-align: start;
          display: flex;
          flex-direction: column;
        }

        .qk-card-img-box {
          position: relative;
          width: 100%;
          height: 140px;
          background: #f9fafb;
          border-radius: 14px;
          border: 1px solid #f1f3f5;
          overflow: hidden;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .qk-card-img-box:hover .qk-card-thumb {
          transform: scale(1.04);
        }
        .qk-card-thumb {
          width: 90%;
          height: 90%;
          object-fit: contain;
          transition: transform 0.25s ease;
        }

        .qk-card-badge-row {
          position: absolute;
          top: 6px;
          left: 6px;
          right: 6px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          pointer-events: none;
        }
        .qk-badge-ad {
          background: #e5e7eb;
          color: #4b5563;
          font-size: 0.6rem;
          font-weight: 800;
          padding: 1px 4px;
          border-radius: 3px;
        }
        .qk-badge-quality-dot {
          width: 14px;
          height: 14px;
          border: 1.5px solid #16a34a;
          border-radius: 3px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ffffff;
        }
        .dot-green {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #16a34a;
        }

        .qk-card-heart-btn {
          position: absolute;
          bottom: 6px;
          left: 6px;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: rgba(255,255,255,0.85);
          border: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .qk-card-quick-add-btn {
          position: absolute;
          bottom: 6px;
          right: 6px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #059669;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(5, 150, 105, 0.35);
          transition: transform 0.15s ease, background 0.15s ease;
        }
        .qk-card-quick-add-btn:active {
          transform: scale(0.9);
          background: #047857;
        }

        .qk-variant-dropdown-pill {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f3f4f6;
          border-radius: 6px;
          padding: 4px 8px;
          margin: 6px 0 4px;
          font-size: 0.72rem;
          font-weight: 600;
          color: #374151;
          cursor: pointer;
        }
        .pill-arrow {
          color: #6b7280;
        }

        .qk-card-text-block {
          cursor: pointer;
        }
        .qk-card-product-name {
          font-size: 0.8rem;
          font-weight: 600;
          color: #111827;
          margin: 0 0 3px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.25;
          min-height: 32px;
        }
        .qk-card-price-stack {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .qk-card-price {
          font-size: 0.88rem;
          font-weight: 800;
          color: #111827;
        }
        .qk-card-mrp {
          font-size: 0.74rem;
          color: #9ca3af;
          text-decoration: line-through;
        }

        .qk-showroom-chat-section {
          margin-top: 10px;
        }
        .qk-wa-contact-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          padding: 12px;
          border-radius: 12px;
          color: #15803d;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
        }
        .qk-wa-contact-btn:hover {
          background: #dcfce7;
        }

        /* 5. PROMO UNLOCK PILL */
        .qk-promo-sticky-wrapper {
          position: fixed;
          bottom: 74px;
          left: 0;
          right: 0;
          z-index: 99;
          display: flex;
          justify-content: center;
          pointer-events: none;
          padding: 0 16px;
        }
        .qk-promo-unlock-pill {
          pointer-events: auto;
          max-width: 680px;
          width: 100%;
          background: #eaf7ee;
          border: 1px solid #bbf7d0;
          border-radius: 28px;
          padding: 6px 14px 6px 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 2px 10px rgba(0,0,0,0.06);
          cursor: pointer;
        }
        .qk-promo-left-meta {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .qk-promo-badge-circle {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #dcfce7;
          border: 1.5px solid #059669;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .qk-promo-copy {
          display: flex;
          flex-direction: column;
          line-height: 1.15;
        }
        .qk-promo-copy strong {
          font-size: 0.78rem;
          color: #064e3b;
        }
        .qk-promo-copy span {
          font-size: 0.7rem;
          color: #047857;
        }
        .qk-promo-chevron {
          color: #059669;
        }

        /* 6. STICKY BOTTOM BAR */
        .qk-sticky-bottom-bar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: #ffffff;
          border-top: 1px solid #edf0f2;
          box-shadow: 0 -4px 20px rgba(0,0,0,0.06);
          z-index: 1000;
          padding: 10px 16px;
        }
        .qk-bottom-bar-inner {
          max-width: 680px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
        }

        /* Basket Pill Button */
        .qk-basket-pill-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #eaf7ee;
          border: 1.5px solid #a7f3d0;
          border-radius: 28px;
          padding: 8px 16px 8px 12px;
          color: #065f46;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .qk-basket-pill-button:hover {
          background: #dcfce7;
        }
        .qk-basket-bag-icon {
          display: flex;
          align-items: center;
        }
        .qk-basket-word {
          font-size: 0.95rem;
          font-weight: 700;
        }
        .qk-basket-count-bubble {
          min-width: 22px;
          height: 22px;
          padding: 0 6px;
          border-radius: 11px;
          background: #059669;
          color: #ffffff;
          font-size: 0.75rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Add to Basket CTA */
        .qk-add-basket-cta {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #059669;
          color: #ffffff;
          border: none;
          border-radius: 28px;
          padding: 10px 24px;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 3px 10px rgba(5, 150, 105, 0.3);
          transition: transform 0.15s ease, background 0.15s ease;
        }
        .qk-add-basket-cta:active {
          transform: scale(0.96);
          background: #047857;
        }

        /* Quantity Capsule Control (Minus, Count, Plus) */
        .qk-qty-capsule-control {
          display: flex;
          align-items: center;
          background: #eef2f6;
          border-radius: 28px;
          padding: 4px;
          gap: 12px;
        }
        .qk-qty-btn-minus {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: transparent;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #374151;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .qk-qty-btn-minus:hover {
          background: rgba(0,0,0,0.06);
        }
        .qk-qty-value-num {
          font-size: 1.05rem;
          font-weight: 800;
          color: #111827;
          min-width: 18px;
          text-align: center;
        }
        .qk-qty-btn-plus {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #059669;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(5, 150, 105, 0.3);
          transition: transform 0.15s ease, background 0.15s ease;
        }
        .qk-qty-btn-plus:active {
          transform: scale(0.92);
          background: #047857;
        }

        /* Desktop Enhancement */
        @media (min-width: 769px) {
          .qk-content-container {
            max-width: 900px;
            padding: 24px;
          }
          .qk-hero-image-wrap {
            height: 460px;
          }
          .qk-product-card-unit {
            width: 172px;
          }
          .qk-card-img-box {
            height: 156px;
          }
        }
      `}</style>
    </div>
  );
}
