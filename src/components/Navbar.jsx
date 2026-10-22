import React, { useState, useEffect } from 'react';
import { 
  Search, Heart, ShoppingBag, Phone, MapPin, 
  Menu, X, ChevronDown, Sparkles, MessageCircle, 
  ShieldCheck, Truck, User, PlusCircle, ArrowRight, Package, FileText,
  Tv, Armchair, Refrigerator, CookingPot, Layers
} from 'lucide-react';

export default function Navbar({ 
  currentPage, 
  setCurrentPage, 
  cartCount = 0, 
  wishlistCount = 0,
  onOpenCart,
  onOpenWishlist,
  onSearch,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  onOpenAdmin,
  onOpenTrackOrder,
  onNavigateSubcategory,
  storeSettings
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchVisible, setMobileSearchVisible] = useState(false);
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [slideDir, setSlideDir] = useState('right');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileExpandedCat, setMobileExpandedCat] = useState({
    furniture: false,
    electronics: false,
    appliances: false
  });

  const handleNavClick = (page) => {
    setCurrentPage(page);
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubcatClick = (category, subcat) => {
    if (onNavigateSubcategory) {
      onNavigateSubcategory(category, subcat);
    } else {
      handleNavClick(category);
    }
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  };

  const announcements = [
    {
      id: 1,
      icon: <Truck size={14} className="inline-icon" />,
      text: "Free Express Delivery & 0% Easy EMI All Over India",
      badge: "Free Delivery",
      action: () => handleNavClick('offers')
    },
    {
      id: 2,
      icon: <Sparkles size={14} className="inline-icon" />,
      text: "Festival Offers: Up to 50% OFF on Sofas, Beds & 4K OLED TVs",
      badge: "50% OFF",
      action: () => handleNavClick('offers')
    },
    {
      id: 3,
      icon: <MapPin size={14} className="inline-icon" />,
      text: "Visit Our Flagship Chennai Showrooms (Open 9:30 AM – 9:30 PM)",
      badge: "Showrooms",
      action: () => handleNavClick('contact')
    },
    {
      id: 4,
      icon: <MessageCircle size={14} className="inline-icon text-wa" />,
      text: "Instant WhatsApp Showroom Help: +91 63830 56338",
      badge: "WhatsApp Help",
      action: () => window.open('https://wa.me/916383056338', '_blank')
    }
  ];

  const [isPaused, setIsPaused] = useState(false);

  // Auto-slide announcement ticker every 3.6s (pauses on hover)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setSlideDir('right');
      setAnnouncementIndex((prev) => (prev + 1) % announcements.length);
    }, 3600);
    return () => clearInterval(timer);
  }, [announcements.length, isPaused]);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (currentPage !== 'furniture' && currentPage !== 'electronics' && currentPage !== 'appliances') {
        setCurrentPage('furniture');
      }
      if (onSearch) onSearch(searchQuery);
      setMobileMenuOpen(false);
    }
  };

  const currentAnn = announcements[announcementIndex];

  return (
    <header className="navbar-wrapper">
      {/* 1. Sliding Top Announcement Bar */}
      <div className="top-announcement-bar">
        <div className="container announcement-inner">
          <div 
            className="announcement-slider-wrapper"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div 
              className={`announcement-slide-track slide-anim-${slideDir}`}
              key={announcementIndex}
              onClick={currentAnn.action}
              title="Click to view details"
            >
              <span className="slide-badge">{currentAnn.badge}</span>
              <span className="announcement-highlight">
                {currentAnn.icon}
                <span className="slide-text">{currentAnn.text}</span>
              </span>
            </div>

            <div className="slider-dots">
              {announcements.map((_, i) => (
                <span 
                  key={i} 
                  className={`slider-dot ${i === announcementIndex ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSlideDir(i > announcementIndex ? 'right' : 'left');
                    setAnnouncementIndex(i);
                  }}
                  title={`Announcement ${i + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="announcement-right desk-only-flex">
            <button onClick={() => handleNavClick('contact')} className="top-link">
              <MapPin size={13} /> Find Showrooms
            </button>
            <span className="bar-separator">|</span>
            <a href="https://wa.me/916383056338" target="_blank" rel="noreferrer" className="top-link top-whatsapp">
              <MessageCircle size={13} /> WhatsApp Help
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Branding & Search Header */}
      <div className="main-header">
        <div className="container header-container">
          {/* Logo */}
          <div className="brand-logo" onClick={() => handleNavClick('home')}>
            <div className="logo-emblem">
              <span className="logo-icon-roof">▲</span>
              <span className="logo-icon-seat">🛋️</span>
            </div>
            <div className="brand-text">
              <div className="brand-title">
                Sardar<span>Mart</span>
              </div>
              <div className="brand-subtitle">FURNITURE &amp; ELECTRONICS</div>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <form className="search-bar-form desk-search" onSubmit={handleSearchSubmit}>
            <div className="category-select-wrapper">
              <select 
                id="header-category-select"
                name="category"
                aria-label="Filter by category"
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="category-dropdown"
              >
                <option value="all">All Categories</option>
                <option value="furniture">Furniture</option>
                <option value="electronics">Electronics</option>
                <option value="appliances">Home Appliances</option>
              </select>
              <ChevronDown size={14} className="dropdown-arrow" />
            </div>
            <div className="search-input-wrapper">
              <input
                id="header-search-input"
                name="search"
                type="text"
                autoComplete="off"
                aria-label="Search furniture and electronics"
                placeholder="Search sofas, beds, 4K TVs, refrigerators, washing machines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <button type="submit" className="search-submit-btn" aria-label="Search">
              <Search size={16} />
            </button>
          </form>

          {/* Right Header Actions */}
          <div className="header-actions">
            {/* WhatsApp Quick Dial (Desktop) */}
            <a 
              href="https://wa.me/916383056338?text=Hi%20Sardar%20Mart%2C%20I%20would%20like%20to%20enquire%20about%20your%20products"
              target="_blank" 
              rel="noreferrer"
              className="quick-whatsapp-btn"
              title="Quick WhatsApp Enquiry"
            >
              <div className="wa-icon-circle">
                <MessageCircle size={15} />
              </div>
              <div className="wa-text-block">
                <span className="wa-label">Enquiry Helpline</span>
                <span className="wa-number">+91 63830 56338</span>
              </div>
            </a>

            {/* Mobile Search Toggle */}
            <button 
              className="mobile-search-toggle-btn"
              onClick={() => setMobileSearchVisible(!mobileSearchVisible)}
              aria-label="Toggle search"
            >
              <Search size={22} />
            </button>



            {/* Wishlist */}
            <button 
              className="action-icon-btn" 
              onClick={onOpenWishlist}
              title="My Wishlist"
              aria-label="Wishlist"
            >
              <div className="icon-with-badge">
                <Heart size={20} />
                {wishlistCount > 0 && <span className="counter-badge">{wishlistCount}</span>}
              </div>
              <span className="icon-btn-label">Wishlist</span>
            </button>

            {/* Cart */}
            <button 
              className="action-icon-btn" 
              onClick={onOpenCart}
              title="Shopping Cart"
              aria-label="Cart"
            >
              <div className="icon-with-badge">
                <ShoppingBag size={20} />
                {cartCount > 0 && <span className="counter-badge badge-accent">{cartCount}</span>}
              </div>
              <span className="icon-btn-label">Cart</span>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button 
              className="mobile-toggle-btn"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open mobile menu"
            >
              <Menu size={26} />
            </button>
          </div>
        </div>

        {/* Mobile Search Input Row */}
        {mobileSearchVisible && (
          <div className="container mobile-search-row animate-fade-in">
            <form onSubmit={handleSearchSubmit} className="mobile-search-form">
              <input 
                id="mobile-search-input"
                name="mobileSearch"
                type="text" 
                autoComplete="off"
                aria-label="Search products"
                placeholder="Search furniture, TVs, fridges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button type="submit" aria-label="Search"><Search size={18} /></button>
            </form>
          </div>
        )}
      </div>

      {/* 3. Primary Desktop Navigation Bar */}
      <nav className="primary-nav">
        <div className="container nav-container">
          <ul className="nav-menu-list">
            <li className={currentPage === 'home' ? 'active' : ''}>
              <button onClick={() => handleNavClick('home')}>Home</button>
            </li>
            <li className="nav-divider" aria-hidden="true" />
            {/* 1. Furniture with Drop List */}
            <li 
              className={`nav-item-dropdown dropdown-furniture ${currentPage === 'furniture' ? 'active' : ''}`}
              onMouseEnter={() => setActiveDropdown('furniture')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button 
                onClick={() => handleNavClick('furniture')}
                className="nav-btn-with-dropdown"
                aria-expanded={activeDropdown === 'furniture'}
                aria-haspopup="true"
              >
                <span>Furniture</span>
                <span 
                  className="nav-chevron-wrap"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveDropdown(activeDropdown === 'furniture' ? null : 'furniture');
                  }}
                  title="Toggle Furniture menu"
                >
                  <ChevronDown size={14} className={`nav-chevron ${activeDropdown === 'furniture' ? 'open' : ''}`} />
                </span>
              </button>

              {/* Furniture Drop List Menu */}
              <div className={`nav-dropdown-menu ${activeDropdown === 'furniture' ? 'show' : ''}`}>
                <div className="dropdown-grid">
                  <div className="dropdown-links-col">
                    <span className="dropdown-col-heading">POPULAR FURNITURE CATEGORIES</span>
                    <div className="dropdown-links-list">
                      <button onClick={(e) => { e.stopPropagation(); handleSubcatClick('furniture', 'sofas'); }} className="dropdown-item-link">
                        <span className="dropdown-item-icon">🛋️</span>
                        <div className="dropdown-item-content">
                          <strong className="dropdown-item-title">Sofas &amp; Recliners</strong>
                          <span className="dropdown-item-desc">L-Shape, Sectionals, 3-Seater Leatherette</span>
                        </div>
                        <span className="dropdown-item-badge">24+ Models</span>
                      </button>

                      <button onClick={(e) => { e.stopPropagation(); handleSubcatClick('furniture', 'beds'); }} className="dropdown-item-link">
                        <span className="dropdown-item-icon">🛏️</span>
                        <div className="dropdown-item-content">
                          <strong className="dropdown-item-title">Beds &amp; Mattresses</strong>
                          <span className="dropdown-item-desc">King, Queen Hydraulic Storage &amp; Ortho</span>
                        </div>
                        <span className="dropdown-item-badge">18+ Models</span>
                      </button>

                      <button onClick={(e) => { e.stopPropagation(); handleSubcatClick('furniture', 'dining'); }} className="dropdown-item-link">
                        <span className="dropdown-item-icon">🪑</span>
                        <div className="dropdown-item-content">
                          <strong className="dropdown-item-title">Dining Sets &amp; Tables</strong>
                          <span className="dropdown-item-desc">Solid Sheesham Wood 6-Seater &amp; Marble</span>
                        </div>
                        <span className="dropdown-item-badge">15+ Models</span>
                      </button>

                      <button onClick={(e) => { e.stopPropagation(); handleSubcatClick('furniture', 'wardrobes'); }} className="dropdown-item-link">
                        <span className="dropdown-item-icon">🚪</span>
                        <div className="dropdown-item-content">
                          <strong className="dropdown-item-title">Wardrobes &amp; Almirahs</strong>
                          <span className="dropdown-item-desc">3-Door, Sliding Mirrors &amp; Modern Closets</span>
                        </div>
                        <span className="dropdown-item-badge">12+ Models</span>
                      </button>

                      <button onClick={(e) => { e.stopPropagation(); handleSubcatClick('furniture', 'chairs'); }} className="dropdown-item-link">
                        <span className="dropdown-item-icon">💼</span>
                        <div className="dropdown-item-content">
                          <strong className="dropdown-item-title">Chairs &amp; Study Desks</strong>
                          <span className="dropdown-item-desc">Ergonomic Mesh Chairs &amp; Workstations</span>
                        </div>
                        <span className="dropdown-item-badge">10+ Models</span>
                      </button>
                    </div>

                    <div className="dropdown-footer-link">
                      <button onClick={() => { setActiveDropdown(null); handleNavClick('furniture'); }}>
                        View Full Furniture Showroom Collection <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Dropdown Spotlight Card */}
                  <div className="dropdown-spotlight-card" onClick={() => { setActiveDropdown(null); handleNavClick('offers'); }}>
                    <div className="spotlight-badge">HOT DEAL</div>
                    <img 
                      src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80" 
                      alt="Living Room Gala" 
                      className="spotlight-img"
                    />
                    <div className="spotlight-body">
                      <h4>Living Room Gala</h4>
                      <p>Up to 50% OFF on Chesterfield &amp; L-shaped Sofas + 0% Easy EMI.</p>
                      <span className="spotlight-action">Explore Deals →</span>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li className="nav-divider" aria-hidden="true" />

            {/* 2. Electronics with Drop List */}
            <li 
              className={`nav-item-dropdown dropdown-electronics ${currentPage === 'electronics' ? 'active' : ''}`}
              onMouseEnter={() => setActiveDropdown('electronics')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button 
                onClick={() => handleNavClick('electronics')}
                className="nav-btn-with-dropdown"
                aria-expanded={activeDropdown === 'electronics'}
                aria-haspopup="true"
              >
                <span>Electronics</span>
                <span 
                  className="nav-chevron-wrap"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveDropdown(activeDropdown === 'electronics' ? null : 'electronics');
                  }}
                  title="Toggle Electronics menu"
                >
                  <ChevronDown size={14} className={`nav-chevron ${activeDropdown === 'electronics' ? 'open' : ''}`} />
                </span>
              </button>

              {/* Electronics Drop List Menu */}
              <div className={`nav-dropdown-menu ${activeDropdown === 'electronics' ? 'show' : ''}`}>
                <div className="dropdown-grid">
                  <div className="dropdown-links-col">
                    <span className="dropdown-col-heading">FEATURED ELECTRONICS CATEGORIES</span>
                    <div className="dropdown-links-list">
                      <button onClick={(e) => { e.stopPropagation(); handleSubcatClick('electronics', 'tvs'); }} className="dropdown-item-link">
                        <span className="dropdown-item-icon">📺</span>
                        <div className="dropdown-item-content">
                          <strong className="dropdown-item-title">Smart TVs &amp; OLED Displays</strong>
                          <span className="dropdown-item-desc">55" &amp; 65" 4K Google TVs, Dolby Atmos</span>
                        </div>
                        <span className="dropdown-item-badge">20+ Models</span>
                      </button>

                      <button onClick={(e) => { e.stopPropagation(); handleSubcatClick('electronics', 'refrigerators'); }} className="dropdown-item-link">
                        <span className="dropdown-item-icon">❄️</span>
                        <div className="dropdown-item-content">
                          <strong className="dropdown-item-title">Inverter Refrigerators</strong>
                          <span className="dropdown-item-desc">Double Door Frost Free, Multi-Door</span>
                        </div>
                        <span className="dropdown-item-badge">16+ Models</span>
                      </button>

                      <button onClick={(e) => { e.stopPropagation(); handleSubcatClick('electronics', 'washers'); }} className="dropdown-item-link">
                        <span className="dropdown-item-icon">🧺</span>
                        <div className="dropdown-item-content">
                          <strong className="dropdown-item-title">Washing Machines</strong>
                          <span className="dropdown-item-desc">Front Load AI DirectDrive &amp; Top Load</span>
                        </div>
                        <span className="dropdown-item-badge">14+ Models</span>
                      </button>

                      <button onClick={(e) => { e.stopPropagation(); handleSubcatClick('electronics', 'acs'); }} className="dropdown-item-link">
                        <span className="dropdown-item-icon">💨</span>
                        <div className="dropdown-item-content">
                          <strong className="dropdown-item-title">Air Conditioners</strong>
                          <span className="dropdown-item-desc">1.5 Ton 5-Star Dual Inverter Split ACs</span>
                        </div>
                        <span className="dropdown-item-badge">12+ Models</span>
                      </button>
                    </div>

                    <div className="dropdown-footer-link">
                      <button onClick={() => { setActiveDropdown(null); handleNavClick('electronics'); }}>
                        View Full Electronics Showroom Collection <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Dropdown Spotlight Card */}
                  <div className="dropdown-spotlight-card" onClick={() => { setActiveDropdown(null); handleNavClick('offers'); }}>
                    <div className="spotlight-badge">CINEMA SALE</div>
                    <img 
                      src="https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=600&q=80" 
                      alt="4K Smart OLED Fest" 
                      className="spotlight-img"
                    />
                    <div className="spotlight-body">
                      <h4>4K OLED Cinema Fest</h4>
                      <p>Exchange bonus up to ₹8,000 + 10-Yr Inverter Warranty.</p>
                      <span className="spotlight-action">Shop Big Screen Deals →</span>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li className="nav-divider" aria-hidden="true" />

            {/* 3. Home Appliances with Drop List */}
            <li 
              className={`nav-item-dropdown dropdown-appliances ${currentPage === 'appliances' ? 'active' : ''}`}
              onMouseEnter={() => setActiveDropdown('appliances')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button 
                onClick={() => handleNavClick('appliances')}
                className="nav-btn-with-dropdown"
                aria-expanded={activeDropdown === 'appliances'}
                aria-haspopup="true"
              >
                <span>Home Appliances</span>
                <span 
                  className="nav-chevron-wrap"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveDropdown(activeDropdown === 'appliances' ? null : 'appliances');
                  }}
                  title="Toggle Home Appliances menu"
                >
                  <ChevronDown size={14} className={`nav-chevron ${activeDropdown === 'appliances' ? 'open' : ''}`} />
                </span>
              </button>

              {/* Appliances Drop List Menu */}
              <div className={`nav-dropdown-menu ${activeDropdown === 'appliances' ? 'show' : ''}`}>
                <div className="dropdown-grid">
                  <div className="dropdown-links-col">
                    <span className="dropdown-col-heading">KITCHEN &amp; HOME ESSENTIALS</span>
                    <div className="dropdown-links-list">
                      <button onClick={(e) => { e.stopPropagation(); handleSubcatClick('appliances', 'mixers'); }} className="dropdown-item-link">
                        <span className="dropdown-item-icon">🍲</span>
                        <div className="dropdown-item-content">
                          <strong className="dropdown-item-title">Mixer Grinders &amp; Blenders</strong>
                          <span className="dropdown-item-desc">1000W Heavy Duty Copper Motor, 4 Jars</span>
                        </div>
                        <span className="dropdown-item-badge">8+ Models</span>
                      </button>

                      <button onClick={(e) => { e.stopPropagation(); handleSubcatClick('appliances', 'kitchen'); }} className="dropdown-item-link">
                        <span className="dropdown-item-icon">🍳</span>
                        <div className="dropdown-item-content">
                          <strong className="dropdown-item-title">Air Fryers &amp; Microwaves</strong>
                          <span className="dropdown-item-desc">Digital Air Fryers &amp; Convection OTGs</span>
                        </div>
                        <span className="dropdown-item-badge">10+ Models</span>
                      </button>

                      <button onClick={(e) => { e.stopPropagation(); handleSubcatClick('appliances', 'home'); }} className="dropdown-item-link">
                        <span className="dropdown-item-icon">💧</span>
                        <div className="dropdown-item-content">
                          <strong className="dropdown-item-title">RO Water Purifiers</strong>
                          <span className="dropdown-item-desc">Active Copper + Mineralizer + UV Tech</span>
                        </div>
                        <span className="dropdown-item-badge">6+ Models</span>
                      </button>
                    </div>

                    <div className="dropdown-footer-link">
                      <button onClick={() => { setActiveDropdown(null); handleNavClick('appliances'); }}>
                        View Full Appliances Collection <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Dropdown Spotlight Card */}
                  <div className="dropdown-spotlight-card" onClick={() => { setActiveDropdown(null); handleNavClick('offers'); }}>
                    <div className="spotlight-badge">COMBO OFFER</div>
                    <img 
                      src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80" 
                      alt="Kitchen Essentials" 
                      className="spotlight-img"
                    />
                    <div className="spotlight-body">
                      <h4>Smart Kitchen Trio</h4>
                      <p>Buy Chimney + Cooktop + Mixer &amp; Save Flat ₹5,000.</p>
                      <span className="spotlight-action">View Appliance Bundles →</span>
                    </div>
                  </div>
                </div>
              </div>
            </li>

            <li className="nav-divider" aria-hidden="true" />
            <li className={currentPage === 'offers' ? 'active offers-nav-item' : 'offers-nav-item'}>
              <button onClick={() => handleNavClick('offers')}>
                <Sparkles size={14} className="sparkle-icon" /> Offers &amp; Combos
                <span className="nav-discount-tag">50% Off</span>
              </button>
            </li>
            <li className="nav-divider" aria-hidden="true" />
            <li className={currentPage === 'about' ? 'active' : ''}>
              <button onClick={() => handleNavClick('about')}>About Us</button>
            </li>
            <li className="nav-divider" aria-hidden="true" />
            <li className={currentPage === 'contact' ? 'active' : ''}>
              <button onClick={() => handleNavClick('contact')}>Contact Us</button>
            </li>

          </ul>
        </div>
      </nav>

      {/* 4. Luxury Mobile Side Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-backdrop" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer-panel" onClick={(e) => e.stopPropagation()}>
            {/* Drawer Header */}
            <div className="drawer-top-brand">
              <div className="drawer-brand" onClick={() => handleNavClick('home')}>
                <div className="logo-emblem" style={{ width: '38px', height: '38px' }}>
                  <span className="logo-icon-seat" style={{ fontSize: '16px' }}>🛋️</span>
                </div>
                <div>
                  <h3 className="brand-title" style={{ fontSize: '1.35rem' }}>Sardar<span>Mart</span></h3>
                  <small style={{ fontSize: '0.6rem', color: '#9c887e', letterSpacing: '1px' }}>FURNITURE &amp; ELECTRONICS</small>
                </div>
              </div>
              <button className="drawer-close-btn" onClick={() => setMobileMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>

            {/* Mobile Drawer Search Form */}
            <form onSubmit={handleSearchSubmit} className="drawer-search-form">
              <Search size={16} className="drawer-search-icon" />
              <input 
                id="drawer-search-input"
                name="drawerSearch"
                type="text" 
                autoComplete="off"
                aria-label="Search catalog"
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit">Go</button>
            </form>

            {/* Drawer Navigation Links */}
            <div className="drawer-links-scrollable">
              <span className="drawer-section-label">MAIN CATEGORIES</span>
              
              <button 
                className={`drawer-link-btn ${currentPage === 'home' ? 'active' : ''}`}
                onClick={() => handleNavClick('home')}
              >
                <span>🏠 Home</span>
                <ArrowRight size={16} />
              </button>

              {/* Mobile Furniture Accordion Drop List */}
              <div className="mobile-drawer-accordion">
                <div className="drawer-accordion-header">
                  <button 
                    className={`drawer-link-btn ${currentPage === 'furniture' ? 'active' : ''}`}
                    onClick={() => handleNavClick('furniture')}
                  >
                    <span>🛋️ Furniture</span>
                  </button>
                  <button 
                    className="drawer-accordion-toggle"
                    onClick={() => setMobileExpandedCat(prev => ({ ...prev, furniture: !prev.furniture }))}
                    aria-label="Expand Furniture subcategories"
                  >
                    <ChevronDown size={18} className={`accordion-chevron ${mobileExpandedCat.furniture ? 'open' : ''}`} />
                  </button>
                </div>
                {mobileExpandedCat.furniture && (
                  <div className="drawer-accordion-body animate-fade-in">
                    <button onClick={() => handleSubcatClick('furniture', 'sofas')} className="drawer-subcat-btn">
                      <span>🛋️ Sofas &amp; Recliners</span>
                      <small>24+ Models</small>
                    </button>
                    <button onClick={() => handleSubcatClick('furniture', 'beds')} className="drawer-subcat-btn">
                      <span>🛏️ Beds &amp; Mattresses</span>
                      <small>18+ Models</small>
                    </button>
                    <button onClick={() => handleSubcatClick('furniture', 'dining')} className="drawer-subcat-btn">
                      <span>🪑 Dining Sets &amp; Tables</span>
                      <small>15+ Models</small>
                    </button>
                    <button onClick={() => handleSubcatClick('furniture', 'wardrobes')} className="drawer-subcat-btn">
                      <span>🚪 Wardrobes &amp; Closets</span>
                      <small>12+ Models</small>
                    </button>
                    <button onClick={() => handleSubcatClick('furniture', 'chairs')} className="drawer-subcat-btn">
                      <span>💼 Chairs &amp; Study Desks</span>
                      <small>10+ Models</small>
                    </button>
                    <button onClick={() => handleSubcatClick('furniture', 'all')} className="drawer-subcat-btn view-all-subcat">
                      <span>Explore All Furniture →</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Electronics Accordion Drop List */}
              <div className="mobile-drawer-accordion">
                <div className="drawer-accordion-header">
                  <button 
                    className={`drawer-link-btn ${currentPage === 'electronics' ? 'active' : ''}`}
                    onClick={() => handleNavClick('electronics')}
                  >
                    <span>📺 Electronics</span>
                  </button>
                  <button 
                    className="drawer-accordion-toggle"
                    onClick={() => setMobileExpandedCat(prev => ({ ...prev, electronics: !prev.electronics }))}
                    aria-label="Expand Electronics subcategories"
                  >
                    <ChevronDown size={18} className={`accordion-chevron ${mobileExpandedCat.electronics ? 'open' : ''}`} />
                  </button>
                </div>
                {mobileExpandedCat.electronics && (
                  <div className="drawer-accordion-body animate-fade-in">
                    <button onClick={() => handleSubcatClick('electronics', 'tvs')} className="drawer-subcat-btn">
                      <span>📺 Smart TVs &amp; OLED</span>
                      <small>20+ Models</small>
                    </button>
                    <button onClick={() => handleSubcatClick('electronics', 'refrigerators')} className="drawer-subcat-btn">
                      <span>❄️ Inverter Refrigerators</span>
                      <small>16+ Models</small>
                    </button>
                    <button onClick={() => handleSubcatClick('electronics', 'washers')} className="drawer-subcat-btn">
                      <span>🧺 Washing Machines</span>
                      <small>14+ Models</small>
                    </button>
                    <button onClick={() => handleSubcatClick('electronics', 'acs')} className="drawer-subcat-btn">
                      <span>💨 Air Conditioners</span>
                      <small>12+ Models</small>
                    </button>
                    <button onClick={() => handleSubcatClick('electronics', 'all')} className="drawer-subcat-btn view-all-subcat">
                      <span>Explore All Electronics →</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Appliances Accordion Drop List */}
              <div className="mobile-drawer-accordion">
                <div className="drawer-accordion-header">
                  <button 
                    className={`drawer-link-btn ${currentPage === 'appliances' ? 'active' : ''}`}
                    onClick={() => handleNavClick('appliances')}
                  >
                    <span>🍳 Home Appliances</span>
                  </button>
                  <button 
                    className="drawer-accordion-toggle"
                    onClick={() => setMobileExpandedCat(prev => ({ ...prev, appliances: !prev.appliances }))}
                    aria-label="Expand Appliances subcategories"
                  >
                    <ChevronDown size={18} className={`accordion-chevron ${mobileExpandedCat.appliances ? 'open' : ''}`} />
                  </button>
                </div>
                {mobileExpandedCat.appliances && (
                  <div className="drawer-accordion-body animate-fade-in">
                    <button onClick={() => handleSubcatClick('appliances', 'mixers')} className="drawer-subcat-btn">
                      <span>🍲 Mixer Grinders</span>
                      <small>8+ Models</small>
                    </button>
                    <button onClick={() => handleSubcatClick('appliances', 'kitchen')} className="drawer-subcat-btn">
                      <span>🍳 Air Fryers &amp; Microwaves</span>
                      <small>10+ Models</small>
                    </button>
                    <button onClick={() => handleSubcatClick('appliances', 'home')} className="drawer-subcat-btn">
                      <span>💧 RO Water Purifiers</span>
                      <small>6+ Models</small>
                    </button>
                    <button onClick={() => handleSubcatClick('appliances', 'all')} className="drawer-subcat-btn view-all-subcat">
                      <span>Explore All Appliances →</span>
                    </button>
                  </div>
                )}
              </div>





              <button 
                className={`drawer-link-btn drawer-offers-btn ${currentPage === 'offers' ? 'active' : ''}`}
                onClick={() => handleNavClick('offers')}
              >
                <span>✨ Offers &amp; Combo Deals</span>
                <span className="drawer-badge-red">50% OFF</span>
              </button>

              <span className="drawer-section-label" style={{ marginTop: '14px' }}>ABOUT &amp; SUPPORT</span>

              <button 
                className={`drawer-link-btn ${currentPage === 'about' ? 'active' : ''}`}
                onClick={() => handleNavClick('about')}
              >
                <span>🏢 About Us &amp; Heritage</span>
                <ArrowRight size={16} />
              </button>

              <button 
                className={`drawer-link-btn ${currentPage === 'contact' ? 'active' : ''}`}
                onClick={() => handleNavClick('contact')}
              >
                <span>📍 Showroom Locations &amp; Map</span>
                <ArrowRight size={16} />
              </button>

              <button 
                className="drawer-link-btn"
                onClick={() => { setMobileMenuOpen(false); onOpenTrackOrder(); }}
              >
                <span>📦 Track Order Status</span>
                <ArrowRight size={16} />
              </button>

              {/* Direct WhatsApp Callout in Drawer */}
              <div className="drawer-whatsapp-box">
                <div className="wa-box-header">
                  <MessageCircle size={20} color="#22c55e" />
                  <strong>Need Immediate Assistance?</strong>
                </div>
                <p>Chat directly with our Chennai showroom managers on WhatsApp.</p>
                <a 
                  href="https://wa.me/916383056338?text=Hi%20Sardar%20Mart%2C%20I%20need%20assistance%20with%20products" 
                  target="_blank" 
                  rel="noreferrer"
                  className="btn-whatsapp"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <MessageCircle size={18} /> Chat: +91 63830 56338
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Styles for Navbar */}
      <style>{`
        .navbar-wrapper {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: #ffffff;
          box-shadow: 0 2px 12px rgba(42, 24, 16, 0.08);
          width: 100%;
        }

        /* Top Sliding Announcement Bar */
        .top-announcement-bar {
          background: var(--color-warm-dark);
          color: #eeddd2;
          font-size: 0.76rem;
          padding: 3px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          overflow: hidden;
        }
        .announcement-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        .announcement-slider-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 8px;
          overflow: hidden;
          position: relative;
          min-height: 22px;
        }

        .announcement-slide-track {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .announcement-slide-track:hover .slide-text {
          text-decoration: underline;
        }

        .slide-badge {
          background: rgba(245, 158, 11, 0.25);
          color: #fde047;
          border: 1px solid rgba(253, 224, 71, 0.3);
          font-size: 0.62rem;
          font-weight: 800;
          padding: 1px 6px;
          border-radius: var(--radius-full);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          flex-shrink: 0;
        }

        .announcement-highlight {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #fbd38d;
          font-weight: 600;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .slide-text {
          color: #ffffff;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .slider-dots {
          display: flex;
          gap: 4px;
          align-items: center;
          flex-shrink: 0;
        }
        .slider-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.25);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .slider-dot.active {
          width: 14px;
          border-radius: 4px;
          background: #fde047;
        }

        /* Slide animations */
        @keyframes slideInRightAnim {
          from { opacity: 0; transform: translateX(25px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInLeftAnim {
          from { opacity: 0; transform: translateX(-25px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .slide-anim-right {
          animation: slideInRightAnim 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .slide-anim-left {
          animation: slideInLeftAnim 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .text-wa { color: #4ade80 !important; }
        .text-adm { color: #fde047 !important; }

        .announcement-right {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }
        .top-link {
          color: #f1dfd3;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.76rem;
          transition: color var(--transition-fast);
        }
        .top-link:hover {
          color: #ffffff;
        }
        .top-whatsapp {
          color: #86efac;
        }
        .bar-separator {
          color: #664f43;
          font-size: 0.75rem;
        }
        .admin-pill {
          background: rgba(217, 119, 6, 0.25);
          color: #fcd34d;
          padding: 2px 8px;
          border-radius: var(--radius-full);
          border: 1px solid rgba(252, 211, 77, 0.35);
        }

        /* Main Header */
        .main-header {
          padding: 7px 0;
          background: #ffffff;
          border-bottom: 1px solid var(--color-border-subtle);
        }
        .header-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        /* Brand Logo */
        .brand-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          user-select: none;
          flex-shrink: 0;
        }
        .logo-emblem {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #a24e23 0%, #6d2f0d 100%);
          border-radius: 9px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 3px 10px rgba(162, 78, 35, 0.25);
        }
        .logo-icon-roof {
          font-size: 9px;
          line-height: 1;
          margin-bottom: -2px;
          color: #fed7aa;
        }
        .logo-icon-seat {
          font-size: 15px;
          line-height: 1;
        }
        .brand-text {
          display: flex;
          flex-direction: column;
        }
        .brand-title {
          font-family: var(--font-heading);
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--color-warm-dark);
          letter-spacing: -0.5px;
          line-height: 1.1;
        }
        .brand-title span {
          color: var(--color-primary);
        }
        .brand-subtitle {
          font-size: 0.58rem;
          font-weight: 700;
          letter-spacing: 1.8px;
          color: var(--color-text-muted);
          margin-top: 1px;
        }

        /* Search Form */
        .search-bar-form {
          flex: 1;
          max-width: 580px;
          height: 36px;
          display: flex;
          align-items: center;
          border: 1.5px solid #d4c2b5;
          border-radius: var(--radius-full);
          background: #ffffff;
          overflow: hidden;
        }
        .search-bar-form:focus-within {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(162, 78, 35, 0.15);
        }
        .category-select-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          background: #faf6f2;
          border-right: 1px solid #e7d8cd;
          padding: 0 10px;
          height: 36px;
        }
        .category-dropdown {
          appearance: none;
          background: transparent;
          border: none;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--color-text-main);
          padding: 6px 14px 6px 2px;
          cursor: pointer;
          outline: none;
        }
        .dropdown-arrow {
          position: absolute;
          right: 6px;
          pointer-events: none;
          color: var(--color-text-muted);
        }
        .search-input-wrapper {
          flex: 1;
          display: flex;
        }
        .search-input {
          width: 100%;
          border: none;
          padding: 6px 12px;
          outline: none;
          color: var(--color-text-main);
          font-size: 0.84rem;
        }
        .search-submit-btn {
          background: var(--color-primary);
          color: #ffffff;
          padding: 0 14px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Actions */
        .header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .quick-whatsapp-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 3px 10px 3px 5px;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: var(--radius-full);
        }
        .wa-icon-circle {
          width: 24px;
          height: 24px;
          background: var(--color-whatsapp);
          color: #ffffff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .wa-text-block {
          display: flex;
          flex-direction: column;
        }
        .wa-label {
          font-size: 0.6rem;
          text-transform: uppercase;
          font-weight: 700;
          color: #166534;
        }
        .wa-number {
          font-size: 0.74rem;
          font-weight: 700;
          color: #14532d;
        }

        .mobile-search-toggle-btn {
          display: none;
          color: var(--color-warm-dark);
          padding: 6px;
        }

        .action-icon-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          color: var(--color-warm-dark);
          position: relative;
          padding: 3px;
        }
        .icon-with-badge {
          position: relative;
        }
        .counter-badge {
          position: absolute;
          top: -5px;
          right: -9px;
          background: var(--color-primary);
          color: white;
          font-size: 0.64rem;
          font-weight: 700;
          width: 17px;
          height: 17px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
        }
        .counter-badge.badge-accent {
          background: #b45309;
        }
        .icon-btn-label {
          font-size: 0.68rem;
          font-weight: 600;
        }

        .mobile-toggle-btn {
          display: none;
          color: var(--color-warm-dark);
          padding: 6px;
          cursor: pointer;
        }

        /* Primary Nav */
        .primary-nav {
          background: var(--color-warm-cream);
          border-bottom: 1px solid rgba(140, 59, 16, 0.14);
          box-shadow: 0 1px 3px rgba(46, 28, 20, 0.03);
          position: relative;
          z-index: 100;
          width: 100%;
        }
        .nav-container {
          display: flex;
          align-items: center;
          justify-content: center;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 16px;
          overflow-x: visible;
        }
        .nav-menu-list {
          display: flex;
          align-items: center;
          justify-content: center;
          list-style: none;
          gap: 2px;
          margin: 0;
          padding: 0;
          flex-wrap: nowrap;
          white-space: nowrap;
          width: 100%;
        }
        .nav-menu-list > li {
          display: inline-flex;
          align-items: center;
          position: relative;
          flex-shrink: 0;
        }
        .nav-divider {
          width: 1px;
          height: 14px;
          background: rgba(140, 59, 16, 0.2);
          margin: 0 3px;
          flex-shrink: 0;
          align-self: center;
          pointer-events: none;
        }
        .nav-menu-list li button {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 7px 13px;
          font-size: 0.84rem;
          font-weight: 600;
          color: var(--color-text-main);
          position: relative;
          white-space: nowrap;
          background: transparent;
          border-radius: var(--radius-sm);
          transition: color 0.18s ease, background-color 0.18s ease;
          cursor: pointer;
          border: none;
          outline: none;
        }
        .nav-menu-list li button:hover {
          color: var(--color-primary);
          background: rgba(140, 59, 16, 0.05);
        }
        .nav-menu-list li.active button {
          color: var(--color-primary);
          font-weight: 700;
        }
        .nav-menu-list li.active button::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 14px;
          right: 14px;
          height: 2.5px;
          background: var(--color-primary);
          border-radius: 4px 4px 0 0;
        }
        .billing-nav-item button {
          color: var(--color-primary) !important;
          font-weight: 700 !important;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .billing-nav-item button:hover {
          background: rgba(162, 78, 35, 0.08) !important;
        }
        .billing-nav-icon {
          color: var(--color-primary);
          flex-shrink: 0;
        }
        .offers-nav-item button {
          color: #c2410c !important;
          font-weight: 700 !important;
        }
        .offers-nav-item button:hover {
          background: rgba(194, 65, 12, 0.07) !important;
        }
        .sparkle-icon {
          color: #ea580c;
          flex-shrink: 0;
        }
        .nav-discount-tag {
          background: #fee2e2;
          color: #b91c1c;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 1px 7px;
          border-radius: var(--radius-full);
          margin-left: 4px;
          flex-shrink: 0;
          border: 1px solid rgba(220, 38, 38, 0.2);
        }
        .admin-nav-item button {
          color: #7c3aed !important;
          font-weight: 700 !important;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .admin-nav-item button:hover {
          background: rgba(124, 58, 237, 0.08) !important;
          color: #6d28d9 !important;
        }
        .admin-nav-icon {
          color: #7c3aed;
          flex-shrink: 0;
        }
        .nav-admin-tag {
          background: #ede9fe;
          color: #6d28d9;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 1px 7px;
          border-radius: var(--radius-full);
          margin-left: 4px;
          flex-shrink: 0;
          border: 1px solid rgba(109, 40, 217, 0.2);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .admin-quick-btn {
          color: #7c3aed !important;
        }
        .admin-quick-btn:hover {
          color: #6d28d9 !important;
        }
        .admin-header-icon {
          color: #7c3aed;
        }

        /* Drop List (Mega Dropdown Menu) */
        .nav-item-dropdown {
          position: relative;
        }
        .nav-btn-with-dropdown {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .nav-chevron-wrap {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 2px 4px;
          border-radius: 4px;
          transition: background-color 0.15s ease;
          cursor: pointer;
        }
        .nav-chevron-wrap:hover {
          background: rgba(140, 59, 16, 0.12);
        }
        .nav-chevron {
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          flex-shrink: 0;
        }
        .nav-chevron.open,
        .nav-item-dropdown:hover .nav-chevron {
          transform: rotate(180deg);
          color: var(--color-primary);
        }

        .nav-dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          width: 640px;
          max-width: calc(100vw - 32px);
          background: #ffffff;
          border-radius: 0 0 var(--radius-lg) var(--radius-lg);
          box-shadow: 0 20px 40px -10px rgba(46, 28, 20, 0.22), 0 0 1px rgba(46, 28, 20, 0.15);
          border: 1px solid rgba(140, 59, 16, 0.15);
          border-top: 3px solid var(--color-primary);
          opacity: 0;
          visibility: hidden;
          transform: translateY(8px);
          transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.2s;
          z-index: 999;
          padding: 22px;
          pointer-events: none;
        }

        .nav-dropdown-menu.show,
        .nav-item-dropdown:hover .nav-dropdown-menu {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
          pointer-events: auto;
        }

        /* Specific dropdown alignments */
        .dropdown-appliances .nav-dropdown-menu {
          left: -80px;
        }
        @media (max-width: 1200px) {
          .dropdown-appliances .nav-dropdown-menu {
            left: auto;
            right: -60px;
          }
        }
        @media (max-width: 1100px) and (min-width: 993px) {
          .nav-menu-list li button {
            padding: 11px 11px;
            font-size: 0.85rem;
            gap: 4px;
          }
          .nav-divider {
            margin: 0 2px;
          }
          .nav-discount-tag {
            font-size: 0.6rem;
            padding: 1px 5px;
          }
        }

        .dropdown-grid {
          display: grid;
          grid-template-columns: 1fr 220px;
          gap: 20px;
        }

        .dropdown-links-col {
          display: flex;
          flex-direction: column;
        }
        .dropdown-col-heading {
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--color-text-muted);
          letter-spacing: 0.8px;
          margin-bottom: 12px;
          display: block;
        }
        .dropdown-links-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .dropdown-item-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 10px;
          border-radius: var(--radius-md);
          background: transparent;
          transition: all var(--transition-fast);
          text-align: left;
          border: 1px solid transparent;
          width: 100%;
          cursor: pointer;
        }
        .dropdown-item-link:hover {
          background: var(--color-warm-sand);
          border-color: rgba(140, 59, 16, 0.12);
          transform: translateX(4px);
        }
        .dropdown-item-icon {
          font-size: 1.25rem;
          width: 32px;
          height: 32px;
          border-radius: var(--radius-sm);
          background: rgba(140, 59, 16, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .dropdown-item-content {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .dropdown-item-title {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--color-text-main);
          line-height: 1.2;
        }
        .dropdown-item-link:hover .dropdown-item-title {
          color: var(--color-primary);
        }
        .dropdown-item-desc {
          font-size: 0.73rem;
          color: var(--color-text-muted);
          line-height: 1.3;
        }
        .dropdown-item-badge {
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--color-primary);
          background: rgba(140, 59, 16, 0.08);
          padding: 3px 8px;
          border-radius: var(--radius-full);
          white-space: nowrap;
        }

        .dropdown-footer-link {
          margin-top: 14px;
          padding-top: 10px;
          border-top: 1px solid var(--color-border);
        }
        .dropdown-footer-link button {
          color: var(--color-primary);
          font-size: 0.82rem;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          transition: gap 0.2s ease;
        }
        .dropdown-footer-link button:hover {
          text-decoration: underline;
          gap: 9px;
        }

        /* Dropdown Spotlight Card */
        .dropdown-spotlight-card {
          position: relative;
          border-radius: var(--radius-md);
          overflow: hidden;
          background: var(--color-warm-dark);
          color: #ffffff;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.12);
          transition: transform 0.2s ease;
        }
        .dropdown-spotlight-card:hover {
          transform: translateY(-2px);
        }
        .spotlight-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background: #ea580c;
          color: #ffffff;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 4px;
          z-index: 2;
          letter-spacing: 0.5px;
        }
        .spotlight-img {
          width: 100%;
          height: 110px;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .dropdown-spotlight-card:hover .spotlight-img {
          transform: scale(1.05);
        }
        .spotlight-body {
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .spotlight-body h4 {
          font-size: 0.92rem;
          font-weight: 700;
          color: #fde047;
          margin: 0;
        }
        .spotlight-body p {
          font-size: 0.72rem;
          color: #e5d5cc;
          line-height: 1.35;
          margin: 0;
        }
        .spotlight-action {
          margin-top: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          color: #ffffff;
          text-decoration: underline;
        }

        /* Mobile Drawer Accordions */
        .mobile-drawer-accordion {
          border-bottom: 1px solid var(--color-border);
          margin-bottom: 4px;
        }
        .drawer-accordion-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .drawer-accordion-header .drawer-link-btn {
          border-bottom: none;
          flex: 1;
        }
        .drawer-accordion-toggle {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          color: var(--color-text-main);
          border: none;
          cursor: pointer;
        }
        .accordion-chevron {
          transition: transform 0.25s ease;
        }
        .accordion-chevron.open {
          transform: rotate(180deg);
          color: var(--color-primary);
        }
        .drawer-accordion-body {
          background: var(--color-warm-sand);
          padding: 8px 12px 12px 14px;
          border-radius: var(--radius-md);
          margin: 0 10px 10px 10px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .drawer-subcat-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 10px;
          background: #ffffff;
          border-radius: var(--radius-sm);
          border: 1px solid rgba(140, 59, 16, 0.08);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-text-main);
          text-align: left;
          cursor: pointer;
        }
        .drawer-subcat-btn:hover {
          background: #fff7ed;
          color: var(--color-primary);
        }
        .drawer-subcat-btn small {
          color: var(--color-primary);
          font-size: 0.72rem;
          font-weight: 700;
          background: rgba(140, 59, 16, 0.08);
          padding: 2px 6px;
          border-radius: 4px;
        }
        .drawer-subcat-btn.view-all-subcat {
          background: var(--color-primary);
          color: #ffffff;
          justify-content: center;
          font-weight: 700;
          margin-top: 4px;
        }
        .drawer-subcat-btn.view-all-subcat:hover {
          background: var(--color-primary-hover);
        }

        /* Mobile Search Row */
        .mobile-search-row {
          padding-top: 10px;
        }
        .mobile-search-form {
          display: flex;
          border: 1.5px solid var(--color-primary);
          border-radius: var(--radius-full);
          overflow: hidden;
          background: #ffffff;
        }
        .mobile-search-form input {
          flex: 1;
          border: none;
          padding: 10px 16px;
          outline: none;
          font-size: 0.9rem;
        }
        .mobile-search-form button {
          background: var(--color-primary);
          color: #ffffff;
          padding: 0 16px;
        }

        /* Luxury Mobile Drawer */
        .mobile-drawer-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(18, 10, 6, 0.7);
          backdrop-filter: blur(4px);
          z-index: 1500;
          display: flex;
          animation: fadeIn 0.2s ease;
        }
        .mobile-drawer-panel {
          width: 85%;
          max-width: 340px;
          height: 100%;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          box-shadow: 4px 0 24px rgba(0,0,0,0.25);
          animation: slideInRight 0.25s ease;
        }
        .drawer-top-brand {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px;
          background: #faf6f1;
          border-bottom: 1px solid var(--color-border);
        }
        .drawer-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .drawer-close-btn {
          color: var(--color-warm-dark);
          padding: 6px;
        }

        .drawer-search-form {
          margin: 14px 18px 6px;
          display: flex;
          align-items: center;
          background: #f4eee5;
          border-radius: var(--radius-md);
          padding: 6px 12px;
          border: 1px solid #ebdcd0;
        }
        .drawer-search-icon {
          color: #8c766a;
          margin-right: 8px;
        }
        .drawer-search-form input {
          flex: 1;
          border: none;
          background: transparent;
          outline: none;
          font-size: 0.88rem;
          color: var(--color-text-main);
        }
        .drawer-search-form button {
          background: var(--color-primary);
          color: white;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 4px;
        }

        .drawer-links-scrollable {
          flex: 1;
          overflow-y: auto;
          padding: 14px 18px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .drawer-section-label {
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 1.2px;
          color: #a89487;
          margin: 6px 0 2px 4px;
        }
        .drawer-link-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 14px;
          border-radius: var(--radius-md);
          font-size: 0.92rem;
          font-weight: 600;
          color: var(--color-text-main);
          text-align: left;
          background: #ffffff;
          transition: background var(--transition-fast);
        }
        .drawer-link-btn:hover,
        .drawer-link-btn.active {
          background: #fff3ec;
          color: var(--color-primary);
        }
        .drawer-offers-btn {
          color: #c2410c;
        }
        .drawer-badge-red {
          background: #fee2e2;
          color: #dc2626;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: var(--radius-full);
        }

        .drawer-whatsapp-box {
          margin-top: 18px;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: var(--radius-lg);
          padding: 14px;
        }
        .wa-box-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: #166534;
          margin-bottom: 6px;
        }
        .drawer-whatsapp-box p {
          font-size: 0.78rem;
          color: #14532d;
          line-height: 1.4;
          margin-bottom: 12px;
        }

        /* Breakpoints */
        @media (max-width: 992px) {
          .quick-whatsapp-btn {
            display: none !important;
          }
          .desk-search {
            display: none !important;
          }
          .primary-nav {
            display: none !important;
          }
          .mobile-toggle-btn {
            display: flex !important;
            align-items: center;
            justify-content: center;
          }
          .mobile-search-toggle-btn {
            display: flex !important;
            align-items: center;
            justify-content: center;
          }
          .icon-btn-label {
            display: none !important;
          }
          .desk-only-flex {
            display: none !important;
          }
        }

        @media (max-width: 768px) {
          .navbar-wrapper {
            position: sticky;
            top: 0;
            z-index: 1000;
            width: 100%;
            background: #ffffff;
            box-shadow: 0 2px 10px rgba(42, 24, 16, 0.08);
          }
          .top-announcement-bar {
            padding: 3px 0;
            font-size: 0.72rem;
          }
          .announcement-slider-wrapper {
            width: 100%;
            justify-content: center;
            min-height: 20px;
          }
          .announcement-slide-track {
            justify-content: center;
          }
          .slide-text {
            font-size: 0.72rem;
          }
          .main-header {
            padding: 6px 0;
          }
          .header-container {
            padding: 0 12px;
            gap: 8px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
          }
          .brand-logo {
            gap: 8px;
            flex-shrink: 0;
          }
          .logo-emblem {
            width: 32px;
            height: 32px;
            border-radius: 8px;
          }
          .brand-title {
            font-size: 1.2rem;
            line-height: 1.1;
          }
          .header-actions {
            display: flex;
            align-items: center;
            gap: 4px;
            flex-shrink: 0;
          }
          .action-icon-btn, .mobile-search-toggle-btn, .mobile-toggle-btn {
            padding: 4px;
            min-width: 32px;
            min-height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            color: var(--color-warm-dark);
          }
        }

        @media (max-width: 500px) {
          .header-container {
            padding: 0 10px;
            gap: 6px;
          }
          .slide-badge {
            display: none !important;
          }
          .slider-dots {
            display: none !important;
          }
          .top-announcement-bar {
            padding: 2.5px 0;
          }
          .slide-text {
            font-size: 0.7rem;
          }
          .brand-logo {
            gap: 6px;
          }
          .logo-emblem {
            width: 28px;
            height: 28px;
            border-radius: 7px;
          }
          .logo-icon-seat {
            font-size: 13px;
          }
          .brand-title {
            font-size: 1.12rem;
          }
          .brand-subtitle {
            display: none !important;
          }
          .header-actions {
            gap: 3px;
          }
          .action-icon-btn, .mobile-search-toggle-btn, .mobile-toggle-btn {
            padding: 3px;
            min-width: 30px;
            min-height: 30px;
          }
          .action-icon-btn svg, .mobile-search-toggle-btn svg, .mobile-toggle-btn svg {
            width: 19px;
            height: 19px;
          }
        }

        @media (max-width: 380px) {
          .header-container {
            padding: 0 6px;
            gap: 4px;
          }
          .brand-logo {
            gap: 5px;
          }
          .brand-title {
            font-size: 1.05rem;
            letter-spacing: -0.3px;
          }
          .logo-emblem {
            width: 26px;
            height: 26px;
          }
          .logo-icon-seat {
            font-size: 12px;
          }
          .header-actions {
            gap: 2px;
          }
          .action-icon-btn, .mobile-search-toggle-btn, .mobile-toggle-btn {
            padding: 2px;
            min-width: 28px;
            min-height: 28px;
          }
          .action-icon-btn svg, .mobile-search-toggle-btn svg, .mobile-toggle-btn svg {
            width: 17px;
            height: 17px;
          }
          .counter-badge {
            width: 14px;
            height: 14px;
            font-size: 0.58rem;
            top: -3px;
            right: -5px;
          }
        }
      `}</style>
    </header>
  );
}
