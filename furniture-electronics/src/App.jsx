import React, { useState, useEffect } from 'react';
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
import Appliances from './pages/Appliances';
import ProductDetails from './pages/ProductDetails';
import Offers from './pages/Offers';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminPanel from './pages/AdminPanel';

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
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Intro Loading Animation: Furniture appears one by one, fades away, electronics appear one by one, then transitions to homepage
  const [showIntro, setShowIntro] = useState(() => {
    try {
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

  // Scroll to top button visibility
  const [showScrollTop, setShowScrollTop] = useState(false);

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
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
          onEditOrder={handleEditOrder}
          onDeleteOrder={handleDeleteOrder}
          onViewInvoice={handleViewInvoice}
          onBackToStore={() => handleNavigate('home')}
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
          if (currentPage !== 'furniture' && currentPage !== 'electronics' && currentPage !== 'appliances') {
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

        {currentPage === 'appliances' && (
          <Appliances
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
          <About onNavigate={handleNavigate} />
        )}

        {currentPage === 'contact' && (
          <Contact />
        )}
      </main>

      {/* Footer */}
      <Footer 
        onNavigate={handleNavigate} 
        onOpenAdmin={handleOpenAdminPanel}
        onOpenTrackOrder={handleOpenTrackOrder}
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

      {/* Mobile Sticky Bottom Navigation */}
      <MobileBottomNav
        currentPage={currentPage}
        onNavigate={handleNavigate}
        cartCount={cart.reduce((acc, i) => acc + i.quantity, 0)}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenCategories={() => handleNavigate('furniture')}
      />

      {/* Floating WhatsApp Quick Action Button */}
      <a
        href="https://wa.me/919876543210?text=Hi%20HomeKart%2C%20I%20am%20browsing%20your%20website%20and%20would%20like%20to%20enquire%20about%20your%20products"
        target="_blank"
        rel="noreferrer"
        className="floating-wa-btn pulse-glow"
        title="Chat on WhatsApp"
        aria-label="WhatsApp Showroom Help"
      >
        <MessageCircle size={28} />
        <span className="wa-bubble-label">Chat with Us</span>
      </a>

      {/* Scroll to top */}
      {showScrollTop && (
        <button
          className="scroll-to-top-btn animate-fade-in"
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

        @media (max-width: 600px) {
          .floating-wa-btn {
            bottom: 20px;
            right: 20px;
            padding: 12px;
            border-radius: 50%;
            width: 52px;
            height: 52px;
            justify-content: center;
          }
          .wa-bubble-label {
            display: none;
          }
          .scroll-to-top-btn {
            bottom: 20px;
            left: 20px;
          }
        }
      `}</style>
    </div>
  );
}
