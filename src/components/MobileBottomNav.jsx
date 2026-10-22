import React, { useState, useEffect, useRef } from 'react';
import { Home, Grid, Sparkles, Heart, ShoppingBag, Receipt, ReceiptIndianRupee } from 'lucide-react';

export default function MobileBottomNav({
  currentPage,
  onNavigate,
  cartCount = 0,
  wishlistCount = 0,
  onOpenCart,
  onOpenWishlist,
  onOpenCategories,
  isVisible: externalVisible
}) {
  const [internalVisible, setInternalVisible] = useState(true);

  // Keep bottom navigation always visible and accessible on mobile
  useEffect(() => {
    setInternalVisible(true);
  }, []);

  const visible = externalVisible !== undefined ? externalVisible : internalVisible;

  return (
    <nav 
      className={`mobile-bottom-nav ${visible ? 'nav-visible' : 'nav-hidden'}`}
      aria-label="Storefront Mobile Navigation"
    >
      {/* 1. Home */}
      <button 
        type="button"
        className={`mob-nav-btn ${currentPage === 'home' ? 'active' : ''}`}
        onClick={() => {
          onNavigate('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        aria-label="Home"
      >
        <Home size={19} />
        <span>Home</span>
        {currentPage === 'home' && <span className="active-pill-dot" />}
      </button>

      {/* 2. Browse / Categories */}
      <button 
        type="button"
        className={`mob-nav-btn ${currentPage === 'furniture' || currentPage === 'electronics' || currentPage === 'appliances' ? 'active' : ''}`}
        onClick={() => {
          if (onOpenCategories) {
            onOpenCategories();
          } else {
            onNavigate('furniture');
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        aria-label="Browse Categories"
      >
        <Grid size={19} />
        <span>Browse</span>
        {(currentPage === 'furniture' || currentPage === 'electronics' || currentPage === 'appliances') && (
          <span className="active-pill-dot" />
        )}
      </button>

      {/* 3. Showroom Billing & Tax Invoice */}
      <button 
        type="button"
        className={`mob-nav-btn ${currentPage === 'billing' ? 'active' : ''}`}
        onClick={() => {
          onNavigate('billing');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        aria-label="Showroom Billing & Tax Invoice"
        title="Billing"
      >
        <ReceiptIndianRupee size={19} />
        <span>Billing</span>
        {currentPage === 'billing' && <span className="active-pill-dot" />}
      </button>

      {/* 4. Offers */}
      <button 
        type="button"
        className={`mob-nav-btn ${currentPage === 'offers' ? 'active' : ''}`}
        onClick={() => {
          onNavigate('offers');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        aria-label="Offers"
      >
        <div className="icon-with-micro-tag">
          <Sparkles size={19} className="sparkle-mob-icon" />
          <span className="mob-offer-dot" />
        </div>
        <span>Offers</span>
        {currentPage === 'offers' && <span className="active-pill-dot" />}
      </button>

      {/* 5. Wishlist */}
      <button 
        type="button"
        className="mob-nav-btn"
        onClick={onOpenWishlist}
        aria-label="Wishlist"
      >
        <div className="icon-with-micro-tag">
          <Heart size={19} />
          {wishlistCount > 0 && <span className="mob-badge wishlist-accent">{wishlistCount}</span>}
        </div>
        <span>Wishlist</span>
      </button>

      {/* 6. Cart */}
      <button 
        type="button"
        className="mob-nav-btn"
        onClick={onOpenCart}
        aria-label="Shopping Cart"
      >
        <div className="icon-with-micro-tag">
          <ShoppingBag size={19} />
          {cartCount > 0 && <span className="mob-badge cart-accent">{cartCount}</span>}
        </div>
        <span>Cart</span>
      </button>

      <style>{`
        /* -------------------------------------------------------------
           STOREFRONT LUXURY MOBILE BOTTOM NAVBAR
           Curved White Dock with Elevated Center Floating Purple Action Button
           ------------------------------------------------------------- */
        .mobile-bottom-nav {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 64px;
          background: #ffffff;
          border-radius: 24px 24px 0 0;
          box-shadow: 0 -4px 25px rgba(15, 23, 42, 0.09);
          border-top: 1px solid rgba(226, 232, 240, 0.9);
          z-index: 1000;
          padding: 4px 6px calc(6px + env(safe-area-inset-bottom, 0px));
          justify-content: space-around;
          align-items: center;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease;
          transform: translateY(0);
          will-change: transform;
        }

        .mobile-bottom-nav.nav-hidden {
          transform: translateY(140%) !important;
          opacity: 0 !important;
          pointer-events: none !important;
          visibility: hidden !important;
        }

        .mob-nav-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2px;
          background: none;
          border: none;
          color: #64748b;
          font-size: 0.65rem;
          font-weight: 600;
          padding: 4px 2px;
          border-radius: 10px;
          position: relative;
          cursor: pointer;
          transition: all 0.2s ease;
          flex: 1;
          min-width: 0;
          max-width: 58px;
        }

        .mob-nav-btn span {
          font-size: 0.63rem;
          line-height: 1.1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .mob-nav-btn:hover,
        .mob-nav-btn.active {
          color: #7c3aed;
        }

        .mob-nav-btn.active span {
          font-weight: 800;
          color: #7c3aed;
        }

        .active-pill-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #7c3aed;
          margin-top: 1px;
        }

        .icon-with-micro-tag {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Center Elevated Floating Purple Button Container */
        .mob-center-wrapper {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: -24px;
          z-index: 1010;
          flex: 1;
          max-width: 60px;
        }

        .mob-elevated-btn {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
          color: #ffffff;
          border: 4px solid #ffffff;
          box-shadow: 0 8px 22px rgba(109, 40, 217, 0.45), 0 2px 6px rgba(0, 0, 0, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.22s ease;
        }

        .mob-elevated-btn:hover {
          transform: translateY(-2px) scale(1.06);
          box-shadow: 0 12px 28px rgba(109, 40, 217, 0.55);
        }

        .mob-elevated-btn.active {
          background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%);
          box-shadow: 0 10px 26px rgba(109, 40, 217, 0.6), 0 0 0 4px rgba(139, 92, 246, 0.25);
          transform: translateY(-2px) scale(1.08);
        }

        .elevated-folder-icon {
          color: #ffffff;
          fill: rgba(255, 255, 255, 0.15);
        }

        .mob-center-label {
          font-size: 0.65rem;
          font-weight: 700;
          color: #64748b;
          margin-top: 2px;
          transition: color 0.2s ease;
        }

        .mob-center-label.active {
          color: #7c3aed;
          font-weight: 800;
        }

        .mob-badge {
          position: absolute;
          top: -4px;
          right: -8px;
          font-size: 0.52rem;
          font-weight: 800;
          min-width: 14px;
          height: 14px;
          border-radius: 7px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 2px;
          border: 1.5px solid #ffffff;
          color: #ffffff;
        }

        .mob-badge.cart-accent {
          background: #d97706;
        }

        .mob-badge.wishlist-accent {
          background: #e11d48;
        }

        .sparkle-mob-icon {
          color: #ea580c;
        }

        .mob-offer-dot {
          position: absolute;
          top: -2px;
          right: -4px;
          width: 6px;
          height: 6px;
          background: #dc2626;
          border-radius: 50%;
          border: 1px solid #ffffff;
        }

        @media (max-width: 900px) {
          .mobile-bottom-nav {
            display: flex;
          }
        }
      `}</style>
    </nav>
  );
}
