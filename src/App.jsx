import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import AdminModal from './components/AdminModal';
import TrackOrderModal from './components/TrackOrderModal';
import InvoiceModal from './components/InvoiceModal';
import MobileBottomNav from './components/MobileBottomNav';
import IntroLoader from './components/IntroLoader';

import Home from './pages/Home';
import Furniture from './pages/Furniture';
import Electronics from './pages/Electronics';
import ProductDetails from './pages/ProductDetails';
import Offers from './pages/Offers';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminPanel from './pages/AdminPanel';
import Billing from './pages/Billing';

import { products as initialProducts } from './data/products';
import { MessageCircle, ArrowUp } from 'lucide-react';

const defaultOrders = [
  {
    id: 'HK-2026-8941',
    date: '16 Oct 2026, 04:30 PM',
    customer: {
      name: 'Priya Sharma',
      phone: '+91 98401 23456',
      email: 'priya.sharma@example.com',
      address: 'Plot 42, Green Park Avenue, Anna Nagar',
      city: 'Chennai',
      pincode: '600040'
    },
    items: [
      {
        id: 'f1',
        name: 'Royal Velvet 3-Seater Sofa',
        category: 'furniture',
        price: 34999,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80'
      },
      {
        id: 'e1',
        name: '55" Ultra HD 4K Smart OLED TV',
        category: 'electronics',
        price: 54999,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=400&q=80'
      }
    ],
    subtotal: 89998,
    discount: 5000,
    delivery: 0,
    total: 84998,
    paymentMethod: 'UPI (GPay / PhonePe)',
    paymentStatus: 'Paid',
    status: 'Out for Delivery',
    notes: 'Please ring the doorbell twice. Evening delivery preferred.'
  },
  {
    id: 'HK-2026-7820',
    date: '15 Oct 2026, 11:15 AM',
    customer: {
      name: 'Rajesh Kumar',
      phone: '+91 97890 54321',
      email: 'rajesh.k@example.com',
      address: 'Flat 302, Palm Meadows, Velachery Main Rd',
      city: 'Chennai',
      pincode: '600042'
    },
    items: [
      {
        id: 'a1',
        name: 'Digital Touch Air Fryer 5.5L',
        category: 'appliances',
        price: 4999,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=400&q=80'
      }
    ],
    subtotal: 4999,
    discount: 250,
    delivery: 0,
    total: 4749,
    paymentMethod: 'Credit / Debit Card',
    paymentStatus: 'Paid',
    status: 'Delivered',
    notes: 'Delivered at security reception desk.'
  }
];

export default function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    const path = (window.location.pathname || '').toLowerCase().replace(/^\/+/, '');
    const hash = (window.location.hash || '').toLowerCase().replace(/^#+/, '');
    if (path === 'admin' || hash === 'admin' || path.startsWith('admin')) {
      return 'admin';
    }
    try {
      const savedPage = localStorage.getItem('hk_current_page');
      if (savedPage === 'admin') {
        return 'admin';
      }
      const validPages = ['furniture', 'electronics', 'offers', 'about', 'contact', 'billing'];
      if (validPages.includes(path)) return path;
      return (savedPage === 'appliances' ? 'home' : savedPage) || 'home';
    } catch {
      return 'home';
    }
  });

  const [selectedProduct, setSelectedProduct] = useState(null);

  // Intro Loading Animation: Furniture appears one by one, fades away, electronics appear one by one, then transitions to homepage
  const [showIntro, setShowIntro] = useState(() => {
    try {
      const path = (window.location.pathname || '').toLowerCase();
      const saved = localStorage.getItem('hk_current_page');
      if (path.includes('admin') || saved === 'admin') {
        return false;
      }
      return !sessionStorage.getItem('hk_intro_shown');
    } catch {
      return true;
    }
  });

  // Dynamic Catalog State (persisted so admin changes remain live)
  const [catalogProducts, setCatalogProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('hk_catalog_products');
      return saved ? JSON.parse(saved) : initialProducts;
    } catch {
      return initialProducts;
    }
  });

  // Orders & Billing State (persisted)
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('hk_orders');
      return saved ? JSON.parse(saved) : defaultOrders;
    } catch {
      return defaultOrders;
    }
  });

  // Global Store Settings & Feature Toggles (managed from Admin Panel)
  const [storeSettings, setStoreSettings] = useState(() => {
    const defaultSettings = {
      storeLegalName: 'Sardar Mart',
      gstNumber: '33DVKPR2334L1Z9',
      showGstinBadge: false,   // Default OFF: Removes GST number across website
      showBillingPage: false,   // Default OFF: Only available in Admin Panel
      showWhatsAppButton: true,
      showOrderTracking: true,
      showWishlist: true,
      showOffersBanner: true,
      showWhiteGloveAssembly: true,
      showEmiOptions: true,
      showReviews: true,
      showStockBadges: true,
      // Payment Modes & Payment Status Settings (Step 3: Payment Mode & Tax Settlement)
      paymentUpiEnabled: true,
      upiMerchant: 'Sardar Mart',
      upiId: 'sardarmart@okaxis',
      upiShowQr: true,
      upiDefaultStatus: 'Paid Online (Verified)',
      upiTag: 'Zero Transaction Fees',
      paymentCardEnabled: true,
      cardSecurityBadge: '100% Secure 256-Bit SSL',
      cardDefaultStatus: 'Paid Online (Verified)',
      paymentEmiEnabled: true,
      emiTag: 'Showroom Promo',
      emiTenures: '3, 6, 9, 12, 18 Months',
      emiBanks: 'Bajaj Finserv, HDFC, ICICI, SBI',
      emiDefaultStatus: 'EMI Pre-Approved (Doorstep KYC)',
      paymentNetBankingEnabled: true,
      netBankingBanks: 'SBI, HDFC, ICICI, Axis, Kotak',
      netBankingDefaultStatus: 'Paid Online (Verified)',
      paymentCodEnabled: true,
      codBadge: 'Pay After Inspection',
      codDefaultStatus: 'Pending (Pay on Assembly)'
    };
    try {
      const saved = localStorage.getItem('hk_admin_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...defaultSettings,
          ...parsed,
          showBillingPage: parsed.showBillingPage !== undefined ? parsed.showBillingPage : false
        };
      }
      return defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  useEffect(() => {
    const handleSettingsUpdate = (e) => {
      if (e?.detail) {
        setStoreSettings(e.detail);
      } else {
        try {
          const saved = localStorage.getItem('hk_admin_settings');
          if (saved) setStoreSettings(prev => ({ ...prev, ...JSON.parse(saved) }));
        } catch {}
      }
    };
    window.addEventListener('hk_settings_changed', handleSettingsUpdate);
    window.addEventListener('storage', handleSettingsUpdate);
    return () => {
      window.removeEventListener('hk_settings_changed', handleSettingsUpdate);
      window.removeEventListener('storage', handleSettingsUpdate);
    };
  }, []);

  // Cart & Wishlist state
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('hk_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('hk_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Drawers & Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [trackOrderId, setTrackOrderId] = useState('');
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');

  // Toast notifications
  const [toast, setToast] = useState(null);

  // Scroll to top button visibility & Mobile bottom nav auto-hide on scroll
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isBottomNavVisible, setIsBottomNavVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    try {
      localStorage.setItem('hk_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('hk_wishlist', JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('hk_catalog_products', JSON.stringify(catalogProducts));
    } catch {}
  }, [catalogProducts]);

  useEffect(() => {
    try {
      localStorage.setItem('hk_orders', JSON.stringify(orders));
    } catch {}
  }, [orders]);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
      setShowScrollTop(currentScrollY > 400);

      if (!ticking) {
        window.requestAnimationFrame(() => {
          const diff = currentScrollY - lastScrollY.current;

          // Always visible near top of page
          if (currentScrollY < 30) {
            setIsBottomNavVisible(true);
          } else if (diff > 8) {
            // Scrolling down (finger swipe up) -> hide bottom navbar
            setIsBottomNavVisible(false);
          } else if (diff < -8) {
            // Scrolling up (finger swipe down) -> show bottom navbar
            setIsBottomNavVisible(true);
          }

          lastScrollY.current = currentScrollY <= 0 ? 0 : currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Synchronize currentPage with URL and localStorage so refresh stays on Admin Panel
  useEffect(() => {
    try {
      localStorage.setItem('hk_current_page', currentPage);
      const currentPath = (window.location.pathname || '').toLowerCase();
      if (currentPage === 'admin') {
        if (!currentPath.includes('/admin')) {
          window.history.pushState(null, '', '/admin');
        }
      } else if (currentPage === 'home') {
        if (currentPath.includes('/admin')) {
          window.history.pushState(null, '', '/');
        }
      }
    } catch {}
  }, [currentPage]);

  // Support browser Back/Forward buttons and URL changes
  useEffect(() => {
    const handlePopState = () => {
      const path = (window.location.pathname || '').toLowerCase().replace(/^\/+/, '');
      if (path === 'admin' || window.location.hash.includes('admin')) {
        setCurrentPage('admin');
      } else if (path) {
        setCurrentPage(path);
      } else {
        setCurrentPage('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Keyboard shortcut: Ctrl + Shift + A to open Admin Panel
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setCurrentPage((prev) => (prev === 'admin' ? 'home' : 'admin'));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  // Cart actions
  const handleAddToCart = (product, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [...prev, { ...product, quantity: qty }];
    });
    showToast(`Added "${product.name}" to cart`);
  };

  const handleUpdateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Wishlist actions
  const handleToggleWishlist = (product) => {
    const exists = wishlist.some((item) => item.id === product.id);
    if (exists) {
      setWishlist((prev) => prev.filter((item) => item.id !== product.id));
      showToast(`Removed "${product.name}" from wishlist`);
    } else {
      setWishlist((prev) => [...prev, product]);
      showToast(`Saved "${product.name}" to wishlist ❤️`);
    }
  };

  const handleRemoveWishlist = (productId) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  };

  // Navigation & Product selection
  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setCurrentPage('product-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (page, subcat = 'all') => {
    if (page === 'appliances') {
      page = 'home';
    }
    try {
      localStorage.setItem('hk_current_page', page);
      if (page === 'admin') {
        window.history.pushState(null, '', '/admin');
      } else if (page === 'home') {
        window.history.pushState(null, '', '/');
      } else {
        window.history.pushState(null, '', `/${page}`);
      }
    } catch {}
    setCurrentPage(page);
    setSelectedSubcategory(subcat);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Order Handlers (Billing & Tracking)
  const handlePlaceOrder = (newOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    showToast(`Order #${newOrder.id} placed successfully!`);
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    showToast(`Updated Order #${orderId} status to "${newStatus}"`);
  };

  const handleUpdatePaymentStatus = (orderId, newPaymentStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, paymentStatus: newPaymentStatus } : o))
    );
    showToast(`Updated Order #${orderId} payment status to "${newPaymentStatus}"`);
  };

  const handleEditOrder = (orderId, updatedOrder) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, ...updatedOrder } : o))
    );
    showToast(`Order #${orderId} details updated`);
  };

  const handleDeleteOrder = (orderId) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    showToast(`Order #${orderId} deleted from records`);
  };

  // Catalog Handlers (Admin Edit & Remove)
  const handleAddProductAdmin = (newProduct) => {
    setCatalogProducts((prev) => [newProduct, ...prev]);
    showToast(`Added "${newProduct.name}" to live catalog!`);
  };

  const handleEditProductAdmin = (productId, updatedProduct) => {
    setCatalogProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, ...updatedProduct } : p))
    );
    showToast(`Updated "${updatedProduct.name}"`);
  };

  const handleDeleteProductAdmin = (productId) => {
    setCatalogProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast(`Product removed from catalog`);
  };

  // Track Order & Invoice openers
  const handleOpenTrackOrder = (orderId = '') => {
    setTrackOrderId(orderId);
    setIsTrackOrderOpen(true);
  };

  const handleViewInvoice = (order) => {
    setActiveInvoiceOrder(order);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAdminPanel = () => {
    try {
      localStorage.setItem('hk_current_page', 'admin');
      window.history.pushState(null, '', '/admin');
    } catch {}
    setCurrentPage('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dedicated Executive Admin Panel View (Matches Mockup)
  if (currentPage === 'admin') {
    return (
      <>
        <AdminPanel
          products={catalogProducts}
          orders={orders}
          onAddProduct={handleAddProductAdmin}
          onEditProduct={handleEditProductAdmin}
          onDeleteProduct={handleDeleteProductAdmin}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onUpdatePaymentStatus={handleUpdatePaymentStatus}
          onEditOrder={handleEditOrder}
          onDeleteOrder={handleDeleteOrder}
          onViewInvoice={handleViewInvoice}
          onAddOrder={handlePlaceOrder}
          onBackToStore={() => {
            try {
              localStorage.setItem('hk_current_page', 'home');
              window.history.pushState(null, '', '/');
            } catch {}
            handleNavigate('home');
          }}
        />

        {/* Printable Tax Invoice Modal */}
        <InvoiceModal
          isOpen={!!activeInvoiceOrder}
          onClose={() => setActiveInvoiceOrder(null)}
          order={activeInvoiceOrder}
        />
      </>
    );
  }

  return (
    <div className="app-root">
      {/* Cinematic Intro Loading Animation */}
      {showIntro && (
        <IntroLoader 
          onComplete={() => {
            try {
              sessionStorage.setItem('hk_intro_shown', 'true');
            } catch {}
            setShowIntro(false);
          }} 
        />
      )}

      {/* Navbar */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={handleNavigate}
        storeSettings={storeSettings}
        cartCount={cart.reduce((acc, i) => acc + i.quantity, 0)}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={(cat) => {
          setSelectedCategory(cat);
          if (cat !== 'all') handleNavigate(cat);
        }}
        onSearch={(query) => {
          setSearchQuery(query);
          if (currentPage !== 'furniture' && currentPage !== 'electronics') {
            handleNavigate('furniture');
          }
        }}
        onOpenAdmin={handleOpenAdminPanel}
        onOpenTrackOrder={handleOpenTrackOrder}
        onNavigateSubcategory={handleNavigate}
      />

      {/* Main Pages Router */}
      <main className="main-content-wrapper">
        {currentPage === 'home' && (
          <Home
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            cart={cart}
            onUpdateQuantity={handleUpdateQuantity}
            products={catalogProducts}
          />
        )}

        {currentPage === 'furniture' && (
          <Furniture
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            cart={cart}
            onUpdateQuantity={handleUpdateQuantity}
            searchQuery={searchQuery}
            selectedSubcategory={selectedSubcategory}
            setSelectedSubcategory={setSelectedSubcategory}
            products={catalogProducts}
          />
        )}

        {currentPage === 'electronics' && (
          <Electronics
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            cart={cart}
            onUpdateQuantity={handleUpdateQuantity}
            searchQuery={searchQuery}
            selectedSubcategory={selectedSubcategory}
            setSelectedSubcategory={setSelectedSubcategory}
            products={catalogProducts}
          />
        )}

        {currentPage === 'product-details' && (
          <ProductDetails
            product={selectedProduct}
            onBack={() => handleNavigate(selectedProduct?.category || 'home')}
            onAddToCart={handleAddToCart}
            onSelectProduct={handleSelectProduct}
            isWishlisted={wishlist.some((item) => item.id === selectedProduct?.id)}
            onToggleWishlist={handleToggleWishlist}
            cartItem={cart.find((item) => item.id === selectedProduct?.id)}
            cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
            cart={cart}
            wishlist={wishlist}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveFromCart={handleRemoveFromCart}
            onOpenCart={() => setIsCartOpen(true)}
          />
        )}

        {currentPage === 'offers' && (
          <Offers
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            cart={cart}
            onUpdateQuantity={handleUpdateQuantity}
            products={catalogProducts}
          />
        )}

        {currentPage === 'about' && (
          <About onNavigate={handleNavigate} storeSettings={storeSettings} />
        )}

        {currentPage === 'contact' && (
          <Contact storeSettings={storeSettings} />
        )}

        {currentPage === 'billing' && (
          <Billing
            cart={cart}
            products={catalogProducts}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveFromCart={handleRemoveFromCart}
            onClearCart={handleClearCart}
            onPlaceOrder={handlePlaceOrder}
            onNavigate={handleNavigate}
            onViewInvoice={handleViewInvoice}
            onOpenTrackOrder={handleOpenTrackOrder}
            storeSettings={storeSettings}
          />
        )}
      </main>

      {/* Footer */}
      <Footer 
        onNavigate={handleNavigate} 
        onOpenAdmin={handleOpenAdminPanel}
        onOpenTrackOrder={handleOpenTrackOrder}
        storeSettings={storeSettings}
      />

      {/* Cart & Billing Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onPlaceOrder={handlePlaceOrder}
        onOpenTrackOrder={handleOpenTrackOrder}
        onViewInvoice={handleViewInvoice}
        onNavigateToBilling={() => {
          setIsCartOpen(false);
          handleNavigate('billing');
        }}
        storeSettings={storeSettings}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        onRemoveWishlist={handleRemoveWishlist}
        onAddToCart={handleAddToCart}
        onSelectProduct={handleSelectProduct}
      />

      {/* Admin Operations & CMS Modal (Edit & Remove Orders + Catalog) */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={catalogProducts}
        orders={orders}
        onAddProduct={handleAddProductAdmin}
        onEditProduct={handleEditProductAdmin}
        onDeleteProduct={handleDeleteProductAdmin}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onUpdatePaymentStatus={handleUpdatePaymentStatus}
        onEditOrder={handleEditOrder}
        onDeleteOrder={handleDeleteOrder}
        onViewInvoice={handleViewInvoice}
      />

      {/* Customer Live Order Tracking Modal */}
      <TrackOrderModal
        isOpen={isTrackOrderOpen}
        onClose={() => setIsTrackOrderOpen(false)}
        orders={orders}
        initialOrderId={trackOrderId}
        onViewInvoice={handleViewInvoice}
      />

      {/* Professional Tax Invoice Sheet Modal */}
      <InvoiceModal
        isOpen={!!activeInvoiceOrder}
        onClose={() => setActiveInvoiceOrder(null)}
        order={activeInvoiceOrder}
      />

      {/* Mobile Sticky Bottom Navigation (Storefront only) */}
      {currentPage !== 'admin' && (
        <MobileBottomNav
          currentPage={currentPage}
          onNavigate={handleNavigate}
          cartCount={cart.reduce((acc, i) => acc + i.quantity, 0)}
          wishlistCount={wishlist.length}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenWishlist={() => setIsWishlistOpen(true)}
          onOpenCategories={() => handleNavigate('furniture')}
          isVisible={isBottomNavVisible}
        />
      )}

      {/* Floating WhatsApp Quick Action Button */}
      {storeSettings?.showWhatsAppButton !== false && (
        <a
          href="https://wa.me/916383056338?text=Hi%20Sardar%20Mart%2C%20I%20am%20browsing%20your%20website%20and%20would%20like%20to%20enquire%20about%20your%20products"
          target="_blank"
          rel="noreferrer"
          className={`floating-wa-btn pulse-glow ${isBottomNavVisible ? 'nav-visible' : 'nav-hidden'}`}
          title="Chat on WhatsApp"
          aria-label="WhatsApp Showroom Help"
        >
          <MessageCircle size={28} />
          <span className="wa-bubble-label">Chat with Us</span>
        </a>
      )}

      {/* Scroll to top */}
      {showScrollTop && (
        <button
          className={`scroll-to-top-btn animate-fade-in ${isBottomNavVisible ? 'nav-visible' : 'nav-hidden'}`}
          onClick={scrollToTop}
          title="Back to Top"
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} />
        </button>
      )}

      {/* Toast Notification Container */}
      {toast && (
        <div className="toast-container">
          <div className="toast-msg">
            <span>{toast}</span>
          </div>
        </div>
      )}

      <style>{`
        .app-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: var(--color-warm-cream);
        }
        .main-content-wrapper {
          flex: 1;
        }

        /* Floating WhatsApp Button */
        .floating-wa-btn {
          position: fixed;
          bottom: 28px;
          right: 28px;
          background: var(--color-whatsapp);
          color: #ffffff;
          padding: 12px 18px 12px 14px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 6px 20px rgba(37, 211, 102, 0.45);
          z-index: 850;
          transition: all var(--transition-fast);
          font-weight: 700;
          font-size: 0.92rem;
        }
        .floating-wa-btn:hover {
          background: var(--color-whatsapp-hover);
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 10px 25px rgba(37, 211, 102, 0.6);
        }
        .wa-bubble-label {
          letter-spacing: 0.2px;
        }

        /* Scroll to Top */
        .scroll-to-top-btn {
          position: fixed;
          bottom: 28px;
          left: 28px;
          width: 44px;
          height: 44px;
          background: var(--color-warm-dark);
          color: #ffffff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-md);
          z-index: 850;
          transition: all var(--transition-fast);
        }
        .scroll-to-top-btn:hover {
          background: var(--color-primary);
          transform: translateY(-3px);
        }

        @media (max-width: 768px) {
          .app-root {
            padding-bottom: 64px;
          }
          .floating-wa-btn {
            bottom: 74px;
            right: 16px;
            padding: 12px;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            justify-content: center;
            box-shadow: 0 4px 16px rgba(37, 211, 102, 0.4);
            transition: bottom 0.32s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s ease, box-shadow 0.2s ease;
          }
          .floating-wa-btn.nav-hidden {
            bottom: 18px !important;
          }
          .wa-bubble-label {
            display: none;
          }
          .scroll-to-top-btn {
            bottom: 74px;
            left: 16px;
            width: 40px;
            height: 40px;
            transition: bottom 0.32s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s ease;
          }
          .scroll-to-top-btn.nav-hidden {
            bottom: 18px !important;
          }
        }
      `}</style>
    </div>
  );
}
