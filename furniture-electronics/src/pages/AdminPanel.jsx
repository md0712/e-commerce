import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Package, Layers, ShoppingCart, MessageSquare, 
  Users, Tag, Globe, Star, BarChart3, Settings, ShieldCheck, 
  LogOut, Search, Bell, Calendar, ChevronDown, Plus, Eye, EyeOff, 
  Edit3, Trash2, Printer, CheckCircle, Clock, Truck, Home, 
  FileText, ArrowRight, ArrowLeft, Mail, Lock, Check, AlertCircle,
  Menu, X, IndianRupee, Phone, ExternalLink, RefreshCw, Sparkles, Filter, MessageCircle
} from 'lucide-react';

export default function AdminPanel({
  products = [],
  orders = [],
  initialTab = 'dashboard',
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onEditOrder,
  onDeleteOrder,
  onViewInvoice,
  onBackToStore
}) {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return localStorage.getItem('hk_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  const [loginEmail, setLoginEmail] = useState('admin@homekart.com');
  const [loginPassword, setLoginPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState('');

  // Active Admin Tab (defaults to initialTab, e.g. 'settings' or 'dashboard')
  const [activeTab, setActiveTab] = useState(initialTab || 'dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Search in Admin
  const [adminGlobalSearch, setAdminGlobalSearch] = useState('');

  // Products Tab states
  const [productSearch, setProductSearch] = useState('');
  const [productCatFilter, setProductCatFilter] = useState('all');
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Orders Tab states
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [editingOrder, setEditingOrder] = useState(null);

  // Sales Chart Period
  const [salesPeriod, setSalesPeriod] = useState('This Week');

  // Enquiries State
  const [enquiries, setEnquiries] = useState(() => {
    try {
      const saved = localStorage.getItem('hk_enquiries');
      return saved ? JSON.parse(saved) : [
        {
          id: 'enq-101',
          name: 'Imran Khan',
          contact: '+91 98765 43210',
          email: 'imran@example.com',
          product: 'Royal Velvet 3-Seater Sofa',
          date: '16 Oct 2026',
          status: 'New',
          message: 'Is customization available in beige fabric for this sofa set?'
        },
        {
          id: 'enq-102',
          name: 'Nisha Sundaram',
          contact: '+91 87654 32109',
          email: 'nisha.s@example.com',
          product: 'AI Front Load 8kg Washing Machine',
          date: '15 Oct 2026',
          status: 'Replied',
          message: 'Does it include complimentary demo and unboxing by technician?'
        },
        {
          id: 'enq-103',
          name: 'Suresh Kumar',
          contact: '+91 76543 21098',
          email: 'suresh.k@example.com',
          product: '1.5 Ton Dual Inverter 5-Star Split AC',
          date: '15 Oct 2026',
          status: 'New',
          message: 'Interested in copper piping charges and 18-month No-Cost EMI.'
        },
        {
          id: 'enq-104',
          name: 'Fatima Zahra',
          contact: '+91 65432 10987',
          email: 'fatima.z@example.com',
          product: '6-Seater Solid Sheesham Dining Table',
          date: '14 Oct 2026',
          status: 'Pending',
          message: 'Would like to visit showroom this Saturday to inspect finish.'
        }
      ];
    } catch {
      return [];
    }
  });

  // Website Content State
  const [siteContent, setSiteContent] = useState(() => {
    try {
      const saved = localStorage.getItem('hk_site_content');
      const defaultContent = {
        storeName: 'HomeKart Furniture & Electronics',
        phone: '+91 98765 43210',
        email: 'care@homekart.com',
        address: '42, Grand Southern Trunk Rd, Chromepet, Chennai, Tamil Nadu 600044',
        timing: '10:00 AM – 09:30 PM (All 7 Days)',
        announcement1: 'Free Express Delivery & 0% Easy EMI All Over India',
        announcement2: 'Festive Mega Sale: Flat ₹5,000 OFF on Orders Above ₹40,000',
        footerDescription: 'Your one-stop destination for premium stylish furniture and the latest smart home electronics. Transforming homes across Tamil Nadu and all over India with unmatched quality and value.',
        instagramUrl: 'https://instagram.com',
        facebookUrl: 'https://facebook.com',
        youtubeUrl: 'https://youtube.com',
        whatsappNumber: '+91 98765 43210'
      };
      return saved ? { ...defaultContent, ...JSON.parse(saved) } : defaultContent;
    } catch {
      return {
        storeName: 'HomeKart Furniture & Electronics',
        phone: '+91 98765 43210',
        email: 'care@homekart.com',
        address: '42, Grand Southern Trunk Rd, Chromepet, Chennai, Tamil Nadu 600044',
        timing: '10:00 AM – 09:30 PM (All 7 Days)',
        announcement1: 'Free Express Delivery & 0% Easy EMI All Over India',
        announcement2: 'Festive Mega Sale: Flat ₹5,000 OFF on Orders Above ₹40,000',
        footerDescription: 'Your one-stop destination for premium stylish furniture and the latest smart home electronics. Transforming homes across Tamil Nadu and all over India with unmatched quality and value.',
        instagramUrl: 'https://instagram.com',
        facebookUrl: 'https://facebook.com',
        youtubeUrl: 'https://youtube.com',
        whatsappNumber: '+91 98765 43210'
      };
    }
  });

  // Settings State (Admin Set)
  const [storeSettings, setStoreSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('hk_admin_settings');
      return saved ? JSON.parse(saved) : {
        storeLegalName: 'HomeKart Furniture & Electronics Pvt Ltd',
        gstNumber: '33AAAAH1234A1Z5',
        currency: 'INR (₹)',
        taxGst: '18%',
        invoicePrefix: 'HK-2026-',
        freeShippingThreshold: '4999',
        standardDeliveryFee: '0',
        courierPartner: 'HomeKart Express White-Glove Fleet',
        defaultOrderStatus: 'Order Placed',
        whatsappAlerts: true,
        smsAlerts: true,
        emailReports: true,
        twoFactorAuth: false
      };
    } catch {
      return {
        storeLegalName: 'HomeKart Furniture & Electronics Pvt Ltd',
        gstNumber: '33AAAAH1234A1Z5',
        currency: 'INR (₹)',
        taxGst: '18%',
        invoicePrefix: 'HK-2026-',
        freeShippingThreshold: '4999',
        standardDeliveryFee: '0',
        courierPartner: 'HomeKart Express White-Glove Fleet',
        defaultOrderStatus: 'Order Placed',
        whatsappAlerts: true,
        smsAlerts: true,
        emailReports: true,
        twoFactorAuth: false
      };
    }
  });

  // Admin Profile Credentials State
  const [adminProfile, setAdminProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('hk_admin_profile');
      return saved ? JSON.parse(saved) : {
        name: 'Administrator',
        email: 'admin@homekart.com',
        role: 'Super Admin',
        phone: '+91 98765 43210'
      };
    } catch {
      return {
        name: 'Administrator',
        email: 'admin@homekart.com',
        role: 'Super Admin',
        phone: '+91 98765 43210'
      };
    }
  });

  const [adminPasswordForm, setAdminPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // New Product Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'furniture',
    subcategory: 'sofas',
    price: '',
    originalPrice: '',
    discount: '25',
    badge: 'BEST SELLER',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    description: '',
    featured: true
  });

  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // Sync state to local storage
  useEffect(() => {
    try {
      localStorage.setItem('hk_admin_auth', isAuthenticated ? 'true' : 'false');
    } catch {}
  }, [isAuthenticated]);

  useEffect(() => {
    try {
      localStorage.setItem('hk_enquiries', JSON.stringify(enquiries));
    } catch {}
  }, [enquiries]);

  useEffect(() => {
    try {
      localStorage.setItem('hk_site_content', JSON.stringify(siteContent));
    } catch {}
  }, [siteContent]);

  useEffect(() => {
    try {
      localStorage.setItem('hk_admin_settings', JSON.stringify(storeSettings));
    } catch {}
  }, [storeSettings]);

  useEffect(() => {
    try {
      localStorage.setItem('hk_admin_profile', JSON.stringify(adminProfile));
    } catch {}
  }, [adminProfile]);

  // Handle Login
  const handleLogin = (e) => {
    if (e) e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError('Please enter both Email and Password');
      return;
    }

    // Default credential check or 1-click test login
    if (
      (loginEmail.toLowerCase() === 'admin@homekart.com' && loginPassword === 'admin123') ||
      loginEmail.includes('admin')
    ) {
      setIsAuthenticated(true);
      setLoginError('');
      showToast('Welcome back, Administrator!');
    } else {
      setLoginError('Invalid credentials. Use demo: admin@homekart.com / admin123');
    }
  };

  const handleQuickDemoLogin = () => {
    setLoginEmail('admin@homekart.com');
    setLoginPassword('admin123');
    setIsAuthenticated(true);
    setLoginError('');
    showToast('Logged in as Administrator (Demo)');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    showToast('Logged out of Admin Panel');
  };

  // Calculations for KPI Cards
  const totalProductsCount = products.length;
  const totalOrdersCount = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0) + 163902; // Sample base + live orders
  const totalEnquiriesCount = enquiries.length;

  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  // -------------------------------------------------------------
  // VIEW 1: LOGIN & ACCESS SCREEN (Matches Screenshot Part 1)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="admin-login-layout animate-fade-in">
        {/* Left Visual Column */}
        <div className="login-visual-panel">
          <div className="visual-overlay"></div>
          <div className="visual-content">
            <div className="brand-logo-badge">
              <div className="brand-icon-box">
                <Home size={28} />
              </div>
              <div className="brand-text">
                <h1>HomeKart</h1>
                <span>FURNITURE &amp; ELECTRONICS</span>
              </div>
            </div>

            <div className="visual-hero-text">
              <h2>Admin Panel Access</h2>
              <p>Manage Products • Orders • Enquiries • Offers • Website Content</p>
            </div>

            <div className="trust-pills-row">
              <div className="trust-pill-box">
                <Lock size={18} />
                <span>Secure Access</span>
              </div>
              <div className="trust-pill-box">
                <ShieldCheck size={18} />
                <span>Data Protection</span>
              </div>
              <div className="trust-pill-box">
                <CheckCircle size={18} />
                <span>Easy Management</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Card Column */}
        <div className="login-form-panel">
          <div className="login-card">
            <div className="card-top-icon-wrap">
              <div className="login-sofa-icon">
                <Home size={26} />
              </div>
            </div>

            <h3 className="login-title">Welcome Back</h3>
            <p className="login-subtitle">Login to Admin Panel</p>

            <form onSubmit={handleLogin} className="login-inputs-form">
              {loginError && (
                <div className="login-error-alert animate-fade-in">
                  <AlertCircle size={16} />
                  <span>{loginError}</span>
                </div>
              )}

              <div className="login-input-group">
                <div className="input-with-icon">
                  <Mail size={18} className="field-icon" />
                  <input
                    id="admin-login-email"
                    name="email"
                    type="email"
                    autoComplete="username"
                    aria-label="Admin email address"
                    placeholder="Enter your email address"
                    value={loginEmail}
                    onChange={(e) => {
                      setLoginEmail(e.target.value);
                      setLoginError('');
                    }}
                    required
                  />
                </div>
              </div>

              <div className="login-input-group">
                <div className="input-with-icon">
                  <Lock size={18} className="field-icon" />
                  <input
                    id="admin-login-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    aria-label="Admin password"
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      setLoginError('');
                    }}
                    required
                  />
                  <button
                    type="button"
                    className="eye-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="login-options-row">
                <label className="remember-label" htmlFor="admin-remember-me">
                  <input
                    id="admin-remember-me"
                    name="rememberMe"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  className="forgot-pass-btn"
                  onClick={() => showToast('Password reset link sent to registered email')}
                >
                  Forgot password?
                </button>
              </div>

              <button type="submit" className="login-primary-btn">
                Login
              </button>

              <div className="login-or-divider">
                <span>or</span>
              </div>

              <button
                type="button"
                className="google-login-btn"
                onClick={handleQuickDemoLogin}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" className="google-icon">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Login with Google</span>
              </button>

              <button
                type="button"
                className="demo-instant-btn"
                onClick={handleQuickDemoLogin}
              >
                <Sparkles size={16} /> 1-Click Instant Demo Login
              </button>

              <div className="login-footer-note">
                Don't have an account? <span className="contact-link">Contact Admin</span>
              </div>

              <div className="back-store-wrap">
                <button
                  type="button"
                  className="back-store-btn"
                  onClick={onBackToStore}
                >
                  <ArrowLeft size={14} /> Back to Storefront
                </button>
              </div>
            </form>
          </div>
        </div>

        <style>{`
          .admin-login-layout {
            min-height: 100vh;
            display: grid;
            grid-template-columns: 1fr 1fr;
            background: #f8fafc;
          }
          .login-visual-panel {
            position: relative;
            background: url('https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80') center/cover no-repeat;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 48px;
            color: #ffffff;
          }
          .visual-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, rgba(43, 23, 14, 0.94) 0%, rgba(61, 35, 20, 0.88) 100%);
          }
          .visual-content {
            position: relative;
            z-index: 2;
            max-width: 520px;
            display: flex;
            flex-direction: column;
            gap: 40px;
          }
          .brand-logo-badge {
            display: flex;
            align-items: center;
            gap: 14px;
          }
          .brand-icon-box {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            background: rgba(255, 255, 255, 0.15);
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid rgba(255, 255, 255, 0.25);
          }
          .brand-text h1 {
            font-size: 1.8rem;
            font-weight: 800;
            margin: 0;
            color: #ffffff;
            letter-spacing: -0.5px;
          }
          .brand-text span {
            font-size: 0.72rem;
            color: #fde68a;
            font-weight: 700;
            letter-spacing: 1.5px;
          }
          .visual-hero-text h2 {
            font-size: 2.2rem;
            font-weight: 800;
            margin-bottom: 12px;
            color: #ffffff;
          }
          .visual-hero-text p {
            font-size: 0.95rem;
            color: #e2e8f0;
            line-height: 1.6;
          }
          .trust-pills-row {
            display: flex;
            gap: 14px;
            flex-wrap: wrap;
          }
          .trust-pill-box {
            display: flex;
            align-items: center;
            gap: 8px;
            background: rgba(255, 255, 255, 0.12);
            padding: 8px 16px;
            border-radius: 24px;
            font-size: 0.82rem;
            font-weight: 700;
            color: #ffffff;
            border: 1px solid rgba(255, 255, 255, 0.2);
          }

          /* Right Form Column */
          .login-form-panel {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px 24px;
            background: #ffffff;
          }
          .login-card {
            width: 100%;
            max-width: 420px;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          .card-top-icon-wrap {
            margin-bottom: 16px;
          }
          .login-sofa-icon {
            width: 58px;
            height: 58px;
            border-radius: 14px;
            background: #fef3c7;
            color: #854d0e;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .login-title {
            font-size: 1.7rem;
            font-weight: 800;
            color: #0f172a;
            margin-bottom: 4px;
          }
          .login-subtitle {
            font-size: 0.9rem;
            color: #64748b;
            margin-bottom: 24px;
          }
          .login-inputs-form {
            width: 100%;
            text-align: left;
          }
          .login-error-alert {
            background: #fef2f2;
            color: #b91c1c;
            border: 1px solid #fecaca;
            padding: 10px 14px;
            border-radius: 8px;
            font-size: 0.82rem;
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 16px;
          }
          .login-input-group {
            margin-bottom: 16px;
          }
          .input-with-icon {
            position: relative;
            display: flex;
            align-items: center;
          }
          .field-icon {
            position: absolute;
            left: 14px;
            color: #94a3b8;
          }
          .input-with-icon input {
            width: 100%;
            padding: 12px 42px 12px 42px;
            border: 1.5px solid #cbd5e1;
            border-radius: 8px;
            font-size: 0.9rem;
            color: #0f172a;
            outline: none;
            transition: all 0.2s ease;
          }
          .input-with-icon input:focus {
            border-color: #854d0e;
            box-shadow: 0 0 0 3px rgba(133, 77, 14, 0.15);
          }
          .eye-toggle-btn {
            position: absolute;
            right: 14px;
            background: none;
            border: none;
            color: #94a3b8;
            cursor: pointer;
            padding: 0;
            display: flex;
            align-items: center;
          }

          .login-options-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.82rem;
            margin-bottom: 20px;
          }
          .remember-label {
            display: flex;
            align-items: center;
            gap: 6px;
            color: #475569;
            cursor: pointer;
          }
          .forgot-pass-btn {
            background: none;
            border: none;
            color: #854d0e;
            font-weight: 600;
            cursor: pointer;
            padding: 0;
          }

          .login-primary-btn {
            width: 100%;
            background: #854d0e;
            color: #ffffff;
            border: none;
            padding: 12px;
            border-radius: 8px;
            font-size: 0.95rem;
            font-weight: 700;
            cursor: pointer;
            transition: background 0.2s ease;
          }
          .login-primary-btn:hover {
            background: #713f12;
          }

          .login-or-divider {
            position: relative;
            text-align: center;
            margin: 18px 0;
          }
          .login-or-divider::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            height: 1px;
            background: #e2e8f0;
          }
          .login-or-divider span {
            position: relative;
            background: #ffffff;
            padding: 0 12px;
            font-size: 0.8rem;
            color: #94a3b8;
          }

          .google-login-btn {
            width: 100%;
            background: #ffffff;
            border: 1.5px solid #cbd5e1;
            color: #334155;
            padding: 11px;
            border-radius: 8px;
            font-size: 0.9rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            cursor: pointer;
            transition: all 0.2s ease;
            margin-bottom: 12px;
          }
          .google-login-btn:hover {
            background: #f8fafc;
            border-color: #94a3b8;
          }

          .demo-instant-btn {
            width: 100%;
            background: #fef3c7;
            border: 1px dashed #d97706;
            color: #92400e;
            padding: 10px;
            border-radius: 8px;
            font-size: 0.84rem;
            font-weight: 700;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            cursor: pointer;
            margin-bottom: 18px;
          }
          .demo-instant-btn:hover {
            background: #fde68a;
          }

          .login-footer-note {
            text-align: center;
            font-size: 0.82rem;
            color: #64748b;
          }
          .contact-link {
            color: #854d0e;
            font-weight: 700;
            cursor: pointer;
          }

          .back-store-wrap {
            margin-top: 24px;
            text-align: center;
          }
          .back-store-btn {
            background: none;
            border: none;
            color: #64748b;
            font-size: 0.82rem;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            cursor: pointer;
          }
          .back-store-btn:hover {
            color: #0f172a;
          }

          @media (max-width: 860px) {
            .admin-login-layout {
              grid-template-columns: 1fr;
            }
            .login-visual-panel {
              display: none;
            }
            .login-form-panel {
              padding: 40px 16px;
            }
          }

          @media (max-width: 480px) {
            .login-form-panel {
              padding: 24px 12px;
            }
            .login-card {
              max-width: 100%;
            }
            .login-title {
              font-size: 1.4rem;
            }
            .login-subtitle {
              font-size: 0.8rem;
              margin-bottom: 18px;
            }
            .demo-creds-row {
              flex-direction: column;
              gap: 4px;
            }
            .login-inputs-form input {
              font-size: 0.85rem;
              padding: 10px 36px;
            }
          }
        `}</style>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: AUTHENTICATED EXECUTIVE DASHBOARD & PORTAL
  // -------------------------------------------------------------
  return (
    <div className="admin-portal-wrapper">
      {/* Toast */}
      {toast && (
        <div className="admin-toast-banner animate-fade-in">
          <span>{toast}</span>
        </div>
      )}

      {/* Mobile Drawer Overlay */}
      {mobileSidebarOpen && (
        <div 
          className="admin-mobile-backdrop" 
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* LEFT SIDEBAR (Dark brand luxury brown styling matching screenshot) */}
      <aside className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-brand-header">
          <div className="sidebar-brand-icon">
            <Home size={22} />
          </div>
          {!sidebarCollapsed && (
            <div className="sidebar-brand-title">
              <h3>HomeKart</h3>
              <small>FURNITURE &amp; ELECTRONICS</small>
            </div>
          )}
          <button 
            className="mobile-close-sidebar" 
            onClick={() => setMobileSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav-menu">
          <button 
            className={`nav-item-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => { setActiveTab('dashboard'); setMobileSidebarOpen(false); }}
            title="Dashboard"
          >
            <LayoutDashboard size={19} />
            {!sidebarCollapsed && <span>Dashboard</span>}
          </button>

          <button 
            className={`nav-item-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => { setActiveTab('products'); setMobileSidebarOpen(false); }}
            title="Products"
          >
            <Package size={19} />
            {!sidebarCollapsed && <span>Products</span>}
            {!sidebarCollapsed && <span className="sidebar-count-badge">{products.length}</span>}
          </button>

          <button 
            className={`nav-item-btn ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => { setActiveTab('categories'); setMobileSidebarOpen(false); }}
            title="Categories"
          >
            <Layers size={19} />
            {!sidebarCollapsed && <span>Categories</span>}
          </button>

          <button 
            className={`nav-item-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => { setActiveTab('orders'); setMobileSidebarOpen(false); }}
            title="Orders & Billing"
          >
            <ShoppingCart size={19} />
            {!sidebarCollapsed && <span>Orders</span>}
            {!sidebarCollapsed && <span className="sidebar-count-badge gold">{orders.length}</span>}
          </button>

          <button 
            className={`nav-item-btn ${activeTab === 'enquiries' ? 'active' : ''}`}
            onClick={() => { setActiveTab('enquiries'); setMobileSidebarOpen(false); }}
            title="Enquiries"
          >
            <MessageSquare size={19} />
            {!sidebarCollapsed && <span>Enquiries</span>}
            {!sidebarCollapsed && (
              <span className="sidebar-count-badge orange">
                {enquiries.filter(e => e.status === 'New').length || enquiries.length}
              </span>
            )}
          </button>

          <button 
            className={`nav-item-btn ${activeTab === 'customers' ? 'active' : ''}`}
            onClick={() => { setActiveTab('customers'); setMobileSidebarOpen(false); }}
            title="Customers"
          >
            <Users size={19} />
            {!sidebarCollapsed && <span>Customers</span>}
          </button>

          <button 
            className={`nav-item-btn ${activeTab === 'offers' ? 'active' : ''}`}
            onClick={() => { setActiveTab('offers'); setMobileSidebarOpen(false); }}
            title="Offers & Banners"
          >
            <Tag size={19} />
            {!sidebarCollapsed && <span>Offers &amp; Banners</span>}
          </button>

          <button 
            className={`nav-item-btn ${activeTab === 'content' ? 'active' : ''}`}
            onClick={() => { setActiveTab('content'); setMobileSidebarOpen(false); }}
            title="Website Content"
          >
            <Globe size={19} />
            {!sidebarCollapsed && <span>Website Content</span>}
          </button>

          <button 
            className={`nav-item-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => { setActiveTab('reviews'); setMobileSidebarOpen(false); }}
            title="Reviews"
          >
            <Star size={19} />
            {!sidebarCollapsed && <span>Reviews</span>}
          </button>

          <button 
            className={`nav-item-btn ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => { setActiveTab('reports'); setMobileSidebarOpen(false); }}
            title="Reports"
          >
            <BarChart3 size={19} />
            {!sidebarCollapsed && <span>Reports</span>}
          </button>

          <button 
            className={`nav-item-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => { setActiveTab('settings'); setMobileSidebarOpen(false); }}
            title="Settings"
          >
            <Settings size={19} />
            {!sidebarCollapsed && <span>Settings</span>}
          </button>

          <button 
            className={`nav-item-btn ${activeTab === 'admin-users' ? 'active' : ''}`}
            onClick={() => { setActiveTab('admin-users'); setMobileSidebarOpen(false); }}
            title="Admin Users"
          >
            <ShieldCheck size={19} />
            {!sidebarCollapsed && <span>Admin Users</span>}
          </button>
        </nav>

        {/* Sidebar Footer Actions */}
        <div className="sidebar-bottom-actions">
          <button 
            className="sidebar-storefront-btn"
            onClick={onBackToStore}
            title="Return to customer store"
          >
            <ExternalLink size={17} />
            {!sidebarCollapsed && <span>View Storefront</span>}
          </button>

          <button 
            className="sidebar-logout-btn"
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut size={17} />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* MAIN ADMIN CONTENT AREA */}
      <div className="admin-main-viewport">
        {/* Top Header Bar */}
        <header className="admin-top-header">
          <div className="header-left-group">
            <button 
              className="toggle-sidebar-btn" 
              onClick={() => {
                if (window.innerWidth <= 900) {
                  setMobileSidebarOpen(!mobileSidebarOpen);
                } else {
                  setSidebarCollapsed(!sidebarCollapsed);
                }
              }}
              title="Toggle Menu"
            >
              <Menu size={20} />
            </button>

            <div className="header-search-box">
              <Search size={17} className="search-icon" />
              <input
                type="text"
                placeholder="Search products, orders, customers..."
                value={adminGlobalSearch}
                onChange={(e) => setAdminGlobalSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="header-right-group">
            {/* Date Range Picker */}
            <div className="date-range-badge">
              <Calendar size={15} />
              <span>Oct 16, 2026 - Oct 22, 2026</span>
              <ChevronDown size={14} />
            </div>

            {/* Notification Bell */}
            <div className="notification-bell-btn" title="3 New Notifications">
              <Bell size={19} />
              <span className="bell-badge-count">3</span>
            </div>

            {/* Admin Avatar Profile */}
            <div className="admin-avatar-card">
              <div className="avatar-circle">A</div>
              <div className="avatar-meta">
                <strong>Admin</strong>
                <small>Administrator</small>
              </div>
            </div>
          </div>
        </header>

        {/* TAB 1: DASHBOARD (Matches Screenshot Section 2) */}
        {activeTab === 'dashboard' && (
          <div className="dashboard-content-area animate-fade-in">
            {/* Dashboard Title Header */}
            <div className="dashboard-welcome-row">
              <div>
                <h2>Dashboard</h2>
                <p>Welcome back! Here's what's happening with your store.</p>
              </div>
              <button 
                className="add-quick-product-btn"
                onClick={() => { setActiveTab('products'); setIsAddProductModalOpen(true); }}
              >
                <Plus size={16} /> Add Product
              </button>
            </div>

            {/* 4 Metric KPI Cards (Matches Screenshot) */}
            <div className="kpi-cards-grid">
              {/* Card 1: Total Products */}
              <div className="kpi-card">
                <div className="kpi-icon-wrap brown">
                  <Package size={22} />
                </div>
                <div className="kpi-data-wrap">
                  <span className="kpi-number">{totalProductsCount}</span>
                  <span className="kpi-label">Total Products</span>
                </div>
                <div className="kpi-growth-pill positive">+12%</div>
              </div>

              {/* Card 2: New Orders */}
              <div className="kpi-card">
                <div className="kpi-icon-wrap orange">
                  <ShoppingCart size={22} />
                </div>
                <div className="kpi-data-wrap">
                  <span className="kpi-number">{totalOrdersCount + 23}</span>
                  <span className="kpi-label">New Orders</span>
                </div>
                <div className="kpi-growth-pill positive">+8%</div>
              </div>

              {/* Card 3: Enquiries */}
              <div className="kpi-card">
                <div className="kpi-icon-wrap blue">
                  <Users size={22} />
                </div>
                <div className="kpi-data-wrap">
                  <span className="kpi-number">{totalEnquiriesCount + 44}</span>
                  <span className="kpi-label">Enquiries</span>
                </div>
                <div className="kpi-growth-pill positive">+15%</div>
              </div>

              {/* Card 4: Total Sales */}
              <div className="kpi-card">
                <div className="kpi-icon-wrap green">
                  <IndianRupee size={22} />
                </div>
                <div className="kpi-data-wrap">
                  <span className="kpi-number">{formatPrice(totalRevenue)}</span>
                  <span className="kpi-label">Total Sales</span>
                </div>
                <div className="kpi-growth-pill positive">+22%</div>
              </div>
            </div>

            {/* Visual Analytics Row: Sales Overview & Top Categories */}
            <div className="analytics-two-col-grid">
              {/* Left: Sales Overview Bar Chart */}
              <div className="chart-card">
                <div className="chart-card-header">
                  <h4>Sales Overview</h4>
                  <div className="chart-filter-select">
                    <select 
                      value={salesPeriod} 
                      onChange={(e) => setSalesPeriod(e.target.value)}
                    >
                      <option value="This Week">This Week</option>
                      <option value="This Month">This Month</option>
                      <option value="This Quarter">This Quarter</option>
                    </select>
                  </div>
                </div>

                <div className="bar-chart-visual">
                  {/* Visual Bar Columns matching the screenshot */}
                  {[
                    { day: 'Mon', value: 20, amount: '₹20K' },
                    { day: 'Tue', value: 38, amount: '₹38K' },
                    { day: 'Wed', value: 28, amount: '₹28K' },
                    { day: 'Thu', value: 34, amount: '₹34K' },
                    { day: 'Fri', value: 24, amount: '₹24K' },
                    { day: 'Sat', value: 52, amount: '₹52K' },
                    { day: 'Sun', value: 42, amount: '₹42K' }
                  ].map((bar, idx) => (
                    <div key={idx} className="bar-column-wrap">
                      <div className="bar-track">
                        <div 
                          className="bar-fill" 
                          style={{ height: `${bar.value * 1.6}px` }}
                          title={`${bar.day}: ${bar.amount}`}
                        ></div>
                      </div>
                      <span className="bar-day-label">{bar.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Top Categories Donut / Progress */}
              <div className="chart-card">
                <div className="chart-card-header">
                  <h4>Top Categories</h4>
                  <span className="chart-subtitle-note">By Volume</span>
                </div>

                <div className="donut-category-visual">
                  {/* Stylized SVG Donut Chart */}
                  <div className="donut-svg-wrap">
                    <svg viewBox="0 0 100 100" className="donut-svg">
                      <circle cx="50" cy="50" r="38" stroke="#e2e8f0" strokeWidth="14" fill="none" />
                      {/* Furniture 35% */}
                      <circle cx="50" cy="50" r="38" stroke="#854d0e" strokeWidth="14" fill="none"
                        strokeDasharray="83.5 155.5" strokeDashoffset="0" />
                      {/* Electronics 30% */}
                      <circle cx="50" cy="50" r="38" stroke="#d97706" strokeWidth="14" fill="none"
                        strokeDasharray="71.6 167.4" strokeDashoffset="-83.5" />
                      {/* Appliances 20% */}
                      <circle cx="50" cy="50" r="38" stroke="#3b82f6" strokeWidth="14" fill="none"
                        strokeDasharray="47.7 191.3" strokeDashoffset="-155.1" />
                      {/* Others 15% */}
                      <circle cx="50" cy="50" r="38" stroke="#10b981" strokeWidth="14" fill="none"
                        strokeDasharray="35.8 203.2" strokeDashoffset="-202.8" />
                    </svg>
                    <div className="donut-center-label">
                      <strong>100%</strong>
                      <small>Category Share</small>
                    </div>
                  </div>

                  {/* Legend list matching screenshot */}
                  <div className="donut-legend-list">
                    <div className="legend-item">
                      <span className="legend-dot" style={{ background: '#854d0e' }}></span>
                      <span className="legend-name">Furniture</span>
                      <strong className="legend-pct">35%</strong>
                    </div>
                    <div className="legend-item">
                      <span className="legend-dot" style={{ background: '#d97706' }}></span>
                      <span className="legend-name">Electronics</span>
                      <strong className="legend-pct">30%</strong>
                    </div>
                    <div className="legend-item">
                      <span className="legend-dot" style={{ background: '#3b82f6' }}></span>
                      <span className="legend-name">Home Appliances</span>
                      <strong className="legend-pct">20%</strong>
                    </div>
                    <div className="legend-item">
                      <span className="legend-dot" style={{ background: '#10b981' }}></span>
                      <span className="legend-name">Others / Combos</span>
                      <strong className="legend-pct">15%</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: Recent Orders & Latest Enquiries (Matches Screenshot) */}
            <div className="recent-data-tables-grid">
              {/* Recent Orders Table Card */}
              <div className="data-table-card">
                <div className="data-table-header">
                  <h4>Recent Orders</h4>
                  <button 
                    className="view-all-link-btn"
                    onClick={() => setActiveTab('orders')}
                  >
                    View All <ArrowRight size={14} />
                  </button>
                </div>

                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Customer</th>
                        <th>Product</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map((ord) => (
                        <tr key={ord.id}>
                          <td><strong>#{ord.id}</strong></td>
                          <td>{ord.customer?.name || 'Customer'}</td>
                          <td>
                            <div className="table-product-cell">
                              {ord.items?.[0]?.name || 'Home Furniture'}
                              {ord.items?.length > 1 && (
                                <small> +{ord.items.length - 1} more</small>
                              )}
                            </div>
                          </td>
                          <td><strong>{formatPrice(ord.total)}</strong></td>
                          <td>
                            <span className={`status-pill-badge ${ord.status.toLowerCase().replace(/\s+/g, '-')}`}>
                              {ord.status}
                            </span>
                          </td>
                          <td><small>{ord.date?.split(',')[0] || 'Today'}</small></td>
                          <td>
                            <button
                              className="table-action-icon-btn"
                              onClick={() => onViewInvoice && onViewInvoice(ord)}
                              title="View Invoice"
                            >
                              <Printer size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Latest Enquiries Card */}
              <div className="data-table-card">
                <div className="data-table-header">
                  <h4>Latest Enquiries</h4>
                  <button 
                    className="view-all-link-btn"
                    onClick={() => setActiveTab('enquiries')}
                  >
                    View All <ArrowRight size={14} />
                  </button>
                </div>

                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Product</th>
                        <th>Contact</th>
                        <th>Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {enquiries.slice(0, 4).map((enq) => (
                        <tr key={enq.id}>
                          <td><strong>{enq.name}</strong></td>
                          <td>
                            <span className="table-truncate-text" title={enq.product}>
                              {enq.product}
                            </span>
                          </td>
                          <td><small>{enq.contact}</small></td>
                          <td><small>{enq.date}</small></td>
                          <td>
                            <a
                              href={`https://wa.me/${enq.contact.replace(/\D/g, '')}?text=Hi%20${enq.name}%2C%20thank%20you%20for%20your%20enquiry%20regarding%20${enq.product}.`}
                              target="_blank"
                              rel="noreferrer"
                              className="table-whatsapp-reply-btn"
                              title="Reply on WhatsApp"
                            >
                              Reply
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="admin-subpage-card animate-fade-in">
            <div className="subpage-header-row">
              <div>
                <h3>Products Management</h3>
                <p>Manage product catalog inventory, pricing, discounts, and badges.</p>
              </div>
              <button 
                className="add-quick-product-btn"
                onClick={() => setIsAddProductModalOpen(true)}
              >
                <Plus size={16} /> Add New Product
              </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="subpage-filters-bar">
              <div className="filter-search-box">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search products by title or keywords..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                />
              </div>

              <div className="filter-dropdown-wrap">
                <Filter size={16} />
                <select
                  value={productCatFilter}
                  onChange={(e) => setProductCatFilter(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  <option value="furniture">Furniture</option>
                  <option value="electronics">Electronics</option>
                  <option value="appliances">Appliances</option>
                </select>
              </div>
            </div>

            {/* Products Table */}
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Category</th>
                    <th>Selling Price</th>
                    <th>Original MRP</th>
                    <th>Discount</th>
                    <th>Badge</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products
                    .filter((p) => {
                      const matchCat = productCatFilter === 'all' || p.category === productCatFilter;
                      const matchSearch = productSearch === '' || 
                        p.name.toLowerCase().includes(productSearch.toLowerCase());
                      return matchCat && matchSearch;
                    })
                    .map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="product-table-item-cell">
                            <img src={item.image} alt={item.name} className="product-thumb-sm" />
                            <div>
                              <strong>{item.name}</strong>
                              <small>ID: {item.id}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="category-pill-tag">{item.category}</span>
                        </td>
                        <td><strong>{formatPrice(item.price)}</strong></td>
                        <td><span className="text-strike">{formatPrice(item.originalPrice || item.price * 1.25)}</span></td>
                        <td><span className="discount-tag">{item.discount || 20}% OFF</span></td>
                        <td>
                          {item.badge ? (
                            <span className="badge-promo-pill">{item.badge}</span>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                        <td>
                          <span className="in-stock-badge">In Stock</span>
                        </td>
                        <td>
                          <div className="table-actions-group">
                            <button
                              className="table-action-icon-btn edit"
                              onClick={() => setEditingProduct(item)}
                              title="Edit Product"
                            >
                              <Edit3 size={15} />
                            </button>
                            <button
                              className="table-action-icon-btn delete"
                              onClick={() => {
                                if (window.confirm(`Delete "${item.name}" from catalog?`)) {
                                  onDeleteProduct && onDeleteProduct(item.id);
                                  showToast('Product removed');
                                }
                              }}
                              title="Delete Product"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS & BILLING MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="admin-subpage-card animate-fade-in">
            <div className="subpage-header-row">
              <div>
                <h3>Order &amp; Billing Management</h3>
                <p>Track customer orders, update live delivery status, and print tax invoices.</p>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="subpage-filters-bar">
              <div className="filter-search-box">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search by Order ID, Customer Name, or Phone..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                />
              </div>

              <div className="filter-dropdown-wrap">
                <Filter size={16} />
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="Order Placed">Order Placed</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Packed">Packed</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer Details</th>
                    <th>Items</th>
                    <th>Total Amount</th>
                    <th>Payment</th>
                    <th>Live Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders
                    .filter((ord) => {
                      const matchStatus = orderStatusFilter === 'all' || ord.status === orderStatusFilter;
                      const term = orderSearch.toLowerCase();
                      const matchSearch = orderSearch === '' ||
                        ord.id.toLowerCase().includes(term) ||
                        (ord.customer?.name || '').toLowerCase().includes(term) ||
                        (ord.customer?.phone || '').includes(term);
                      return matchStatus && matchSearch;
                    })
                    .map((ord) => (
                      <tr key={ord.id}>
                        <td>
                          <strong>#{ord.id}</strong>
                          <small className="d-block text-muted">{ord.date?.split(',')[0]}</small>
                        </td>
                        <td>
                          <div className="customer-cell-info">
                            <strong>{ord.customer?.name}</strong>
                            <small>{ord.customer?.phone}</small>
                            <small className="address-text">{ord.customer?.city}</small>
                          </div>
                        </td>
                        <td>
                          <div className="order-items-preview">
                            {ord.items?.map((it, idx) => (
                              <div key={idx} className="order-mini-item">
                                {it.name} (×{it.quantity})
                              </div>
                            ))}
                          </div>
                        </td>
                        <td>
                          <strong className="order-total-price">{formatPrice(ord.total)}</strong>
                        </td>
                        <td>
                          <span className="pay-method-badge">{ord.paymentMethod}</span>
                          <small className="pay-status-text">{ord.paymentStatus}</small>
                        </td>
                        <td>
                          <select
                            className={`status-selector-input ${ord.status.toLowerCase().replace(/\s+/g, '-')}`}
                            value={ord.status}
                            onChange={(e) => onUpdateOrderStatus && onUpdateOrderStatus(ord.id, e.target.value)}
                          >
                            <option value="Order Placed">Order Placed</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Packed">Packed</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td>
                          <div className="table-actions-group">
                            <button
                              className="table-action-icon-btn invoice"
                              onClick={() => onViewInvoice && onViewInvoice(ord)}
                              title="Print Tax Invoice"
                            >
                              <Printer size={15} />
                            </button>
                            <button
                              className="table-action-icon-btn edit"
                              onClick={() => setEditingOrder(ord)}
                              title="Edit Customer Details"
                            >
                              <Edit3 size={15} />
                            </button>
                            <button
                              className="table-action-icon-btn delete"
                              onClick={() => {
                                if (window.confirm(`Delete order #${ord.id}?`)) {
                                  onDeleteOrder && onDeleteOrder(ord.id);
                                  showToast(`Order #${ord.id} deleted`);
                                }
                              }}
                              title="Delete Order"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: ENQUIRIES */}
        {activeTab === 'enquiries' && (
          <div className="admin-subpage-card animate-fade-in">
            <div className="subpage-header-row">
              <div>
                <h3>Customer Enquiries</h3>
                <p>Direct enquiries received from showroom visitors and product pages.</p>
              </div>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Customer Name</th>
                    <th>Product of Interest</th>
                    <th>Message / Query</th>
                    <th>Contact Info</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {enquiries.map((enq) => (
                    <tr key={enq.id}>
                      <td><strong>{enq.name}</strong></td>
                      <td><span className="product-enq-name">{enq.product}</span></td>
                      <td><p className="enq-message-box">{enq.message}</p></td>
                      <td>
                        <small>📞 {enq.contact}</small><br />
                        <small>✉️ {enq.email}</small>
                      </td>
                      <td><small>{enq.date}</small></td>
                      <td>
                        <a
                          href={`https://wa.me/${enq.contact.replace(/\D/g, '')}?text=Hi%20${enq.name}%2C%20thank%20you%20for%20contacting%20HomeKart.`}
                          target="_blank"
                          rel="noreferrer"
                          className="table-whatsapp-reply-btn"
                        >
                          WhatsApp Reply
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: CATEGORIES */}
        {activeTab === 'categories' && (
          <div className="admin-subpage-card animate-fade-in">
            <div className="subpage-header-row">
              <div>
                <h3>Categories Management</h3>
                <p>Manage product department hierarchies and subcategories.</p>
              </div>
            </div>

            <div className="categories-admin-grid">
              {[
                { name: 'Furniture', count: '24+ Models', sub: ['Sofas & Recliners', 'Beds & Mattresses', 'Dining Sets', 'Wardrobes', 'Study Chairs'] },
                { name: 'Electronics', count: '20+ Models', sub: ['4K Smart TVs & OLED', 'Inverter Refrigerators', 'Front Load Washers', 'Split Inverter ACs'] },
                { name: 'Home Appliances', count: '16+ Models', sub: ['Heavy Duty Mixers', 'Digital Air Fryers', 'RO Water Purifiers', 'Microwaves'] }
              ].map((cat, idx) => (
                <div key={idx} className="category-admin-box">
                  <div className="cat-box-header">
                    <h4>{cat.name}</h4>
                    <span className="cat-count-badge">{cat.count}</span>
                  </div>
                  <div className="cat-sub-list">
                    <strong>Subcategories:</strong>
                    <ul>
                      {cat.sub.map((s, sidx) => (
                        <li key={sidx}>{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: OFFERS & BANNERS */}
        {activeTab === 'offers' && (
          <div className="admin-subpage-card animate-fade-in">
            <div className="subpage-header-row">
              <div>
                <h3>Offers &amp; Coupon Codes</h3>
                <p>Manage active promotional discounts, bank EMI partners, and banners.</p>
              </div>
            </div>

            <div className="coupons-admin-grid">
              {[
                { code: 'FESTIVE50', desc: 'Flat ₹5,000 OFF on orders above ₹40,000', discount: 'Flat ₹5,000', status: 'Active' },
                { code: 'COMBOBEST', desc: '10% OFF on all Living Room & Dining Combos', discount: '10% OFF', status: 'Active' },
                { code: 'HOME5', desc: '5% Instant Savings for Showroom Pickups', discount: '5% OFF', status: 'Active' }
              ].map((c, idx) => (
                <div key={idx} className="coupon-admin-card">
                  <div className="coupon-code-pill">🏷️ {c.code}</div>
                  <p>{c.desc}</p>
                  <div className="coupon-card-footer">
                    <strong>{c.discount}</strong>
                    <span className="active-tag">{c.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: WEBSITE CONTENT */}
        {activeTab === 'content' && (
          <div className="admin-subpage-card animate-fade-in">
            <div className="subpage-header-row">
              <div>
                <h3>Website Content &amp; Showroom Details</h3>
                <p>Edit showroom contact details, address, opening timings, and announcement tickers.</p>
              </div>
            </div>

            <div className="content-edit-form">
              <div className="content-form-grid">
                <div className="form-field-group">
                  <label>Store Name</label>
                  <input
                    type="text"
                    value={siteContent.storeName}
                    onChange={(e) => setSiteContent({ ...siteContent, storeName: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label>Contact Phone</label>
                  <input
                    type="text"
                    value={siteContent.phone}
                    onChange={(e) => setSiteContent({ ...siteContent, phone: e.target.value })}
                  />
                </div>

                <div className="form-field-group full-width">
                  <label>Showroom Address</label>
                  <input
                    type="text"
                    value={siteContent.address}
                    onChange={(e) => setSiteContent({ ...siteContent, address: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label>Showroom Timings</label>
                  <input
                    type="text"
                    value={siteContent.timing}
                    onChange={(e) => setSiteContent({ ...siteContent, timing: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label>Support Email</label>
                  <input
                    type="email"
                    value={siteContent.email}
                    onChange={(e) => setSiteContent({ ...siteContent, email: e.target.value })}
                  />
                </div>

                <div className="form-field-group full-width">
                  <label>Announcement Bar 1 (Top Ticker)</label>
                  <input
                    type="text"
                    value={siteContent.announcement1}
                    onChange={(e) => setSiteContent({ ...siteContent, announcement1: e.target.value })}
                  />
                </div>
              </div>

              {/* Dedicated Footer Branding & Social Media Editor (Matches User Image) */}
              <div className="footer-brand-editor-box">
                <div className="editor-subhead">
                  <Home size={18} className="editor-icon" />
                  <div>
                    <h4>Footer Brand &amp; Social Links Management</h4>
                    <small>Customize the brand description, tagline, and social media handles shown in the footer</small>
                  </div>
                </div>

                <div className="content-form-grid">
                  <div className="form-field-group full-width">
                    <label htmlFor="admin-footer-desc">Footer Brand Description / Mission Statement</label>
                    <textarea
                      id="admin-footer-desc"
                      name="footerDescription"
                      rows="3"
                      className="editor-textarea"
                      value={siteContent.footerDescription}
                      onChange={(e) => setSiteContent({ ...siteContent, footerDescription: e.target.value })}
                    />
                  </div>

                  <div className="form-field-group">
                    <label htmlFor="admin-footer-insta">Instagram URL</label>
                    <input
                      id="admin-footer-insta"
                      name="instagramUrl"
                      type="url"
                      placeholder="https://instagram.com/homekart"
                      value={siteContent.instagramUrl}
                      onChange={(e) => setSiteContent({ ...siteContent, instagramUrl: e.target.value })}
                    />
                  </div>

                  <div className="form-field-group">
                    <label htmlFor="admin-footer-fb">Facebook URL</label>
                    <input
                      id="admin-footer-fb"
                      name="facebookUrl"
                      type="url"
                      placeholder="https://facebook.com/homekart"
                      value={siteContent.facebookUrl}
                      onChange={(e) => setSiteContent({ ...siteContent, facebookUrl: e.target.value })}
                    />
                  </div>

                  <div className="form-field-group">
                    <label htmlFor="admin-footer-yt">YouTube Channel URL</label>
                    <input
                      id="admin-footer-yt"
                      name="youtubeUrl"
                      type="url"
                      placeholder="https://youtube.com/@homekart"
                      value={siteContent.youtubeUrl}
                      onChange={(e) => setSiteContent({ ...siteContent, youtubeUrl: e.target.value })}
                    />
                  </div>

                  <div className="form-field-group">
                    <label htmlFor="admin-footer-wa">WhatsApp Number (with country code)</label>
                    <input
                      id="admin-footer-wa"
                      name="whatsappNumber"
                      type="text"
                      placeholder="+91 98765 43210"
                      value={siteContent.whatsappNumber}
                      onChange={(e) => setSiteContent({ ...siteContent, whatsappNumber: e.target.value })}
                    />
                  </div>
                </div>

                {/* Live Visual Card Preview (Exact representation of user image) */}
                <div className="footer-preview-wrapper">
                  <span className="preview-label">Live Preview of Footer Branding Block:</span>
                  <div className="footer-brand-live-preview">
                    <div className="preview-logo-row">
                      <div className="preview-logo-icon">▲</div>
                      <div className="preview-logo-text">
                        <span>Home<strong>Kart</strong></span>
                        <small>FURNITURE &amp; ELECTRONICS</small>
                      </div>
                    </div>
                    <p className="preview-desc-text">
                      {siteContent.footerDescription}
                    </p>
                    <div className="preview-social-icons-row">
                      <div className="preview-social-btn" title="Instagram">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                      </div>
                      <div className="preview-social-btn" title="Facebook">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                      </div>
                      <div className="preview-social-btn" title="YouTube">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><polygon points="10 15 15 12 10 9 10 15"/></svg>
                      </div>
                      <div className="preview-social-btn" title="WhatsApp">
                        <MessageCircle size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                className="save-content-btn"
                onClick={() => {
                  try {
                    localStorage.setItem('hk_site_content', JSON.stringify(siteContent));
                    showToast('Website content & Footer branding saved successfully!');
                  } catch {
                    showToast('Saved!');
                  }
                }}
              >
                Save Content Changes
              </button>
            </div>
          </div>
        )}

        {/* TAB 8: SETTINGS (ADMIN SET) */}
        {activeTab === 'settings' && (
          <div className="admin-subpage-card animate-fade-in">
            <div className="subpage-header-row">
              <div>
                <h3>Admin Settings &amp; Configuration</h3>
                <p>Manage administrator credentials, store legal profile, tax GST rates, billing, and system backups.</p>
              </div>
              <button 
                className="save-content-btn"
                onClick={() => {
                  try {
                    localStorage.setItem('hk_admin_settings', JSON.stringify(storeSettings));
                    localStorage.setItem('hk_admin_profile', JSON.stringify(adminProfile));
                    showToast('All settings and credentials saved successfully!');
                  } catch {
                    showToast('Settings saved!');
                  }
                }}
              >
                <Check size={16} /> Save All Settings
              </button>
            </div>

            {/* Sub-section 1: Admin Account Credentials */}
            <div className="settings-section-panel">
              <div className="settings-section-head">
                <ShieldCheck size={20} className="section-icon" />
                <div>
                  <h4>Admin Account &amp; Login Credentials</h4>
                  <small>Manage your administrator profile name, login email, and password</small>
                </div>
              </div>

              <div className="settings-form-grid">
                <div className="form-field-group">
                  <label>Administrator Display Name</label>
                  <input
                    type="text"
                    value={adminProfile.name}
                    onChange={(e) => setAdminProfile({ ...adminProfile, name: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label>Admin Login Email</label>
                  <input
                    type="email"
                    value={adminProfile.email}
                    onChange={(e) => setAdminProfile({ ...adminProfile, email: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label>Admin Mobile Phone</label>
                  <input
                    type="text"
                    value={adminProfile.phone}
                    onChange={(e) => setAdminProfile({ ...adminProfile, phone: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label>Security Role</label>
                  <input
                    type="text"
                    value={adminProfile.role}
                    disabled
                    style={{ background: '#f1f5f9', cursor: 'not-allowed' }}
                  />
                </div>
              </div>

              {/* Password change sub-box */}
              <div className="password-change-box">
                <h5>Change Admin Password</h5>
                <div className="settings-form-grid">
                  <div className="form-field-group">
                    <label>New Password</label>
                    <input
                      type="password"
                      placeholder="Enter new secure password"
                      value={adminPasswordForm.newPassword}
                      onChange={(e) => setAdminPasswordForm({ ...adminPasswordForm, newPassword: e.target.value })}
                    />
                  </div>
                  <div className="form-field-group">
                    <label>Confirm New Password</label>
                    <input
                      type="password"
                      placeholder="Repeat new password"
                      value={adminPasswordForm.confirmPassword}
                      onChange={(e) => setAdminPasswordForm({ ...adminPasswordForm, confirmPassword: e.target.value })}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-update-pwd"
                  onClick={() => {
                    if (!adminPasswordForm.newPassword) {
                      alert('Please enter a new password');
                      return;
                    }
                    if (adminPasswordForm.newPassword !== adminPasswordForm.confirmPassword) {
                      alert('Passwords do not match');
                      return;
                    }
                    setLoginPassword(adminPasswordForm.newPassword);
                    setAdminPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    showToast('Admin password updated successfully!');
                  }}
                >
                  <Lock size={14} /> Update Admin Password
                </button>
              </div>
            </div>

            {/* Sub-section 2: Business & Store Legal Profile */}
            <div className="settings-section-panel">
              <div className="settings-section-head">
                <Home size={20} className="section-icon" />
                <div>
                  <h4>Store &amp; Business Legal Profile</h4>
                  <small>Appears on customer invoices, receipts, and order tracking slips</small>
                </div>
              </div>

              <div className="settings-form-grid">
                <div className="form-field-group">
                  <label>Legal Business / Entity Name</label>
                  <input
                    type="text"
                    value={storeSettings.storeLegalName}
                    onChange={(e) => setStoreSettings({ ...storeSettings, storeLegalName: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label>GSTIN Tax Registration Number</label>
                  <input
                    type="text"
                    value={storeSettings.gstNumber}
                    onChange={(e) => setStoreSettings({ ...storeSettings, gstNumber: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label>Showroom Contact Helpline</label>
                  <input
                    type="text"
                    value={siteContent.phone}
                    onChange={(e) => setSiteContent({ ...siteContent, phone: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label>Official Customer Support Email</label>
                  <input
                    type="email"
                    value={siteContent.email}
                    onChange={(e) => setSiteContent({ ...siteContent, email: e.target.value })}
                  />
                </div>

                <div className="form-field-group full-width">
                  <label>Registered Showroom Address</label>
                  <input
                    type="text"
                    value={siteContent.address}
                    onChange={(e) => setSiteContent({ ...siteContent, address: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Sub-section 3: Billing, Tax & Invoicing Rules */}
            <div className="settings-section-panel">
              <div className="settings-section-head">
                <IndianRupee size={20} className="section-icon" />
                <div>
                  <h4>Billing, Tax &amp; Invoicing Rules</h4>
                  <small>Customize currency symbols, GST calculation, and invoice serial numbers</small>
                </div>
              </div>

              <div className="settings-form-grid">
                <div className="form-field-group">
                  <label>Store Currency</label>
                  <input
                    type="text"
                    value={storeSettings.currency}
                    onChange={(e) => setStoreSettings({ ...storeSettings, currency: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label>Standard GST Tax Rate (%)</label>
                  <input
                    type="text"
                    value={storeSettings.taxGst}
                    onChange={(e) => setStoreSettings({ ...storeSettings, taxGst: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label>Bill / Order Number Prefix</label>
                  <input
                    type="text"
                    value={storeSettings.invoicePrefix}
                    onChange={(e) => setStoreSettings({ ...storeSettings, invoicePrefix: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label>Free Shipping Minimum Order (₹)</label>
                  <input
                    type="number"
                    value={storeSettings.freeShippingThreshold}
                    onChange={(e) => setStoreSettings({ ...storeSettings, freeShippingThreshold: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label>Standard Delivery Charge (₹)</label>
                  <input
                    type="number"
                    value={storeSettings.standardDeliveryFee}
                    onChange={(e) => setStoreSettings({ ...storeSettings, standardDeliveryFee: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label>Default Status on New Order</label>
                  <select
                    value={storeSettings.defaultOrderStatus}
                    onChange={(e) => setStoreSettings({ ...storeSettings, defaultOrderStatus: e.target.value })}
                  >
                    <option value="Order Placed">Order Placed</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Processing">Processing</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Sub-section 4: Logistics & Notification Alerts */}
            <div className="settings-section-panel">
              <div className="settings-section-head">
                <Truck size={20} className="section-icon" />
                <div>
                  <h4>Logistics Fleet &amp; Notification Alerts</h4>
                  <small>Delivery carrier and instant customer communication settings</small>
                </div>
              </div>

              <div className="settings-form-grid">
                <div className="form-field-group">
                  <label>Default Courier Partner Name</label>
                  <input
                    type="text"
                    value={storeSettings.courierPartner}
                    onChange={(e) => setStoreSettings({ ...storeSettings, courierPartner: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label>WhatsApp Instant Alerts</label>
                  <select
                    value={storeSettings.whatsappAlerts ? 'yes' : 'no'}
                    onChange={(e) => setStoreSettings({ ...storeSettings, whatsappAlerts: e.target.value === 'yes' })}
                  >
                    <option value="yes">Enabled (Send WhatsApp alert on order dispatch)</option>
                    <option value="no">Disabled</option>
                  </select>
                </div>

                <div className="form-field-group">
                  <label>SMS Notifications</label>
                  <select
                    value={storeSettings.smsAlerts ? 'yes' : 'no'}
                    onChange={(e) => setStoreSettings({ ...storeSettings, smsAlerts: e.target.value === 'yes' })}
                  >
                    <option value="yes">Enabled (Send SMS receipt to customer)</option>
                    <option value="no">Disabled</option>
                  </select>
                </div>

                <div className="form-field-group">
                  <label>Admin Daily Email Reports</label>
                  <select
                    value={storeSettings.emailReports ? 'yes' : 'no'}
                    onChange={(e) => setStoreSettings({ ...storeSettings, emailReports: e.target.value === 'yes' })}
                  >
                    <option value="yes">Enabled (Send summary to admin email)</option>
                    <option value="no">Disabled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Sub-section 5: System & Data Backup Controls */}
            <div className="settings-section-panel">
              <div className="settings-section-head">
                <RefreshCw size={20} className="section-icon" />
                <div>
                  <h4>System Data, Backup &amp; Reset</h4>
                  <small>Download store records or reset demo orders and catalog</small>
                </div>
              </div>

              <div className="system-actions-grid">
                <button
                  type="button"
                  className="system-action-btn export"
                  onClick={() => {
                    const data = {
                      products,
                      orders,
                      enquiries,
                      storeSettings,
                      siteContent,
                      adminProfile,
                      exportedAt: new Date().toISOString()
                    };
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `HomeKart-Data-Backup-${Date.now()}.json`;
                    a.click();
                    showToast('Store data backup downloaded!');
                  }}
                >
                  <FileText size={16} /> Export Store Data (.JSON)
                </button>

                <button
                  type="button"
                  className="system-action-btn"
                  onClick={() => {
                    if (window.confirm('Reset catalog products to original showroom defaults?')) {
                      localStorage.removeItem('hk_catalog_products');
                      window.location.reload();
                    }
                  }}
                >
                  <RefreshCw size={16} /> Reset Catalog to Defaults
                </button>

                <button
                  type="button"
                  className="system-action-btn danger"
                  onClick={() => {
                    if (window.confirm('Clear all demo orders and tracking history?')) {
                      localStorage.removeItem('hk_orders');
                      window.location.reload();
                    }
                  }}
                >
                  <Trash2 size={16} /> Reset Demo Orders
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: ADMIN USERS */}
        {activeTab === 'admin-users' && (
          <div className="admin-subpage-card animate-fade-in">
            <div className="subpage-header-row">
              <div>
                <h3>Admin Users &amp; Roles</h3>
                <p>Manage staff accounts and administrative permissions.</p>
              </div>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Last Active</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Admin Administrator', email: 'admin@homekart.com', role: 'Super Admin', status: 'Active', time: 'Just now' },
                    { name: 'Showroom Sales Staff', email: 'sales@homekart.com', role: 'Staff Manager', status: 'Active', time: '2 hours ago' },
                    { name: 'Logistics Team', email: 'dispatch@homekart.com', role: 'Dispatch Lead', status: 'Active', time: 'Yesterday' }
                  ].map((u, idx) => (
                    <tr key={idx}>
                      <td><strong>{u.name}</strong></td>
                      <td>{u.email}</td>
                      <td><span className="role-tag">{u.role}</span></td>
                      <td><span className="in-stock-badge">{u.status}</span></td>
                      <td><small>{u.time}</small></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: ADD NEW PRODUCT */}
      {isAddProductModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsAddProductModalOpen(false)}>
          <div className="admin-dialog-card" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <h4>Add New Product to Catalog</h4>
              <button className="dialog-close-btn" onClick={() => setIsAddProductModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newProduct.name || !newProduct.price) {
                  alert('Please enter product name and price');
                  return;
                }
                const created = {
                  id: 'hk-' + Date.now().toString(36),
                  name: newProduct.name,
                  category: newProduct.category,
                  subcategory: newProduct.subcategory,
                  price: parseFloat(newProduct.price),
                  originalPrice: parseFloat(newProduct.originalPrice || newProduct.price * 1.3),
                  discount: parseInt(newProduct.discount) || 20,
                  badge: newProduct.badge,
                  image: newProduct.image,
                  description: newProduct.description || 'Premium furniture piece handcrafted with durable finishes.',
                  featured: newProduct.featured,
                  rating: 4.8,
                  reviews: 12
                };
                onAddProduct && onAddProduct(created);
                setIsAddProductModalOpen(false);
                showToast(`Product "${created.name}" published!`);
              }}
              className="dialog-form-body"
            >
              <div className="dialog-grid">
                <div className="form-field-group full-width">
                  <label>Product Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Chesterfield 3-Seater Velvet Sofa"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label>Department Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  >
                    <option value="furniture">Furniture</option>
                    <option value="electronics">Electronics</option>
                    <option value="appliances">Home Appliances</option>
                  </select>
                </div>

                <div className="form-field-group">
                  <label>Promotional Badge</label>
                  <input
                    type="text"
                    placeholder="e.g. BEST SELLER or HOT DEAL"
                    value={newProduct.badge}
                    onChange={(e) => setNewProduct({ ...newProduct, badge: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label>Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 29999"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label>Original MRP (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 42000"
                    value={newProduct.originalPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })}
                  />
                </div>

                <div className="form-field-group full-width">
                  <label>Image URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  />
                </div>
              </div>

              <div className="dialog-footer-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsAddProductModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-confirm">
                  Publish to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT PRODUCT */}
      {editingProduct && (
        <div className="admin-modal-overlay" onClick={() => setEditingProduct(null)}>
          <div className="admin-dialog-card" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <h4>Edit Product Details</h4>
              <button className="dialog-close-btn" onClick={() => setEditingProduct(null)}>
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onEditProduct && onEditProduct(editingProduct.id, editingProduct);
                setEditingProduct(null);
                showToast(`Updated "${editingProduct.name}"`);
              }}
              className="dialog-form-body"
            >
              <div className="dialog-grid">
                <div className="form-field-group full-width">
                  <label>Product Title</label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-field-group">
                  <label>Selling Price (₹)</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>

                <div className="form-field-group">
                  <label>Original MRP (₹)</label>
                  <input
                    type="number"
                    value={editingProduct.originalPrice || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: parseFloat(e.target.value) || 0 })}
                  />
                </div>

                <div className="form-field-group">
                  <label>Discount (%)</label>
                  <input
                    type="number"
                    value={editingProduct.discount || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, discount: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div className="form-field-group">
                  <label>Badge</label>
                  <input
                    type="text"
                    value={editingProduct.badge || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                  />
                </div>
              </div>

              <div className="dialog-footer-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setEditingProduct(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-confirm">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT ORDER CUSTOMER DETAILS */}
      {editingOrder && (
        <div className="admin-modal-overlay" onClick={() => setEditingOrder(null)}>
          <div className="admin-dialog-card" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <h4>Edit Order #{editingOrder.id} Details</h4>
              <button className="dialog-close-btn" onClick={() => setEditingOrder(null)}>
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onEditOrder && onEditOrder(editingOrder.id, editingOrder);
                setEditingOrder(null);
                showToast(`Order #${editingOrder.id} updated`);
              }}
              className="dialog-form-body"
            >
              <div className="dialog-grid">
                <div className="form-field-group">
                  <label>Customer Name</label>
                  <input
                    type="text"
                    value={editingOrder.customer?.name || ''}
                    onChange={(e) => setEditingOrder({
                      ...editingOrder,
                      customer: { ...editingOrder.customer, name: e.target.value }
                    })}
                    required
                  />
                </div>

                <div className="form-field-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    value={editingOrder.customer?.phone || ''}
                    onChange={(e) => setEditingOrder({
                      ...editingOrder,
                      customer: { ...editingOrder.customer, phone: e.target.value }
                    })}
                    required
                  />
                </div>

                <div className="form-field-group full-width">
                  <label>Delivery Address</label>
                  <input
                    type="text"
                    value={editingOrder.customer?.address || ''}
                    onChange={(e) => setEditingOrder({
                      ...editingOrder,
                      customer: { ...editingOrder.customer, address: e.target.value }
                    })}
                    required
                  />
                </div>

                <div className="form-field-group">
                  <label>City</label>
                  <input
                    type="text"
                    value={editingOrder.customer?.city || ''}
                    onChange={(e) => setEditingOrder({
                      ...editingOrder,
                      customer: { ...editingOrder.customer, city: e.target.value }
                    })}
                  />
                </div>

                <div className="form-field-group">
                  <label>Pincode</label>
                  <input
                    type="text"
                    value={editingOrder.customer?.pincode || ''}
                    onChange={(e) => setEditingOrder({
                      ...editingOrder,
                      customer: { ...editingOrder.customer, pincode: e.target.value }
                    })}
                  />
                </div>
              </div>

              <div className="dialog-footer-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setEditingOrder(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-confirm">
                  Save Order Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COMPREHENSIVE STYLING MATCHING SCREENSHOT */}
      <style>{`
        .admin-portal-wrapper {
          display: flex;
          min-height: 100vh;
          background: #f1f5f9;
          font-family: inherit;
          color: #1e293b;
        }

        /* Toast */
        .admin-toast-banner {
          position: fixed;
          top: 20px;
          right: 20px;
          background: #1e293b;
          color: #ffffff;
          padding: 10px 18px;
          border-radius: 8px;
          font-size: 0.88rem;
          font-weight: 700;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
          z-index: 1300;
        }

        /* LEFT SIDEBAR (Dark brand warm brown) */
        .admin-sidebar {
          width: 250px;
          background: #2b170e;
          color: #ffffff;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          transition: width 0.25s ease;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
          z-index: 100;
        }
        .admin-sidebar.collapsed {
          width: 72px;
        }
        .sidebar-brand-header {
          padding: 22px 18px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .sidebar-brand-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          flex-shrink: 0;
        }
        .sidebar-brand-title h3 {
          font-size: 1.15rem;
          font-weight: 800;
          margin: 0;
          color: #ffffff;
          letter-spacing: -0.3px;
        }
        .sidebar-brand-title small {
          font-size: 0.62rem;
          color: #fde68a;
          font-weight: 700;
          letter-spacing: 1px;
          display: block;
        }
        .mobile-close-sidebar {
          display: none;
          background: none;
          border: none;
          color: #ffffff;
          margin-left: auto;
          cursor: pointer;
        }

        /* Navigation items */
        .sidebar-nav-menu {
          padding: 16px 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }
        .nav-item-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          background: none;
          border: none;
          color: #cbd5e1;
          border-radius: 8px;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
          width: 100%;
        }
        .nav-item-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
        }
        .nav-item-btn.active {
          background: #854d0e;
          color: #ffffff;
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(133, 77, 14, 0.4);
        }
        .sidebar-count-badge {
          margin-left: auto;
          background: rgba(255, 255, 255, 0.18);
          color: #ffffff;
          font-size: 0.72rem;
          padding: 2px 7px;
          border-radius: 12px;
          font-weight: 700;
        }
        .sidebar-count-badge.gold {
          background: #d97706;
          color: #ffffff;
        }
        .sidebar-count-badge.orange {
          background: #ea580c;
          color: #ffffff;
        }

        /* Bottom Sidebar Actions */
        .sidebar-bottom-actions {
          padding: 14px 12px 18px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .sidebar-storefront-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.14);
          color: #fde68a;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
        }
        .sidebar-logout-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          background: none;
          border: none;
          color: #ef4444;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
        }
        .sidebar-logout-btn:hover {
          background: rgba(239, 68, 68, 0.15);
        }

        /* MAIN VIEWPORT */
        .admin-main-viewport {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          overflow-x: hidden;
        }

        /* Top Header */
        .admin-top-header {
          height: 68px;
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 90;
        }
        .header-left-group {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 1;
          max-width: 500px;
        }
        .toggle-sidebar-btn {
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #334155;
          cursor: pointer;
        }
        .header-search-box {
          position: relative;
          flex: 1;
        }
        .header-search-box .search-icon {
          position: absolute;
          left: 12px;
          top: 10px;
          color: #94a3b8;
        }
        .header-search-box input {
          width: 100%;
          padding: 9px 14px 9px 36px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 0.86rem;
          outline: none;
          background: #f8fafc;
        }
        .header-search-box input:focus {
          border-color: #854d0e;
          background: #ffffff;
        }

        .header-right-group {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .date-range-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 600;
          color: #334155;
          cursor: pointer;
        }
        .notification-bell-btn {
          position: relative;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #334155;
          cursor: pointer;
        }
        .bell-badge-count {
          position: absolute;
          top: -2px;
          right: -2px;
          background: #ef4444;
          color: #ffffff;
          font-size: 0.65rem;
          font-weight: 800;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #ffffff;
        }
        .admin-avatar-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-left: 10px;
          border-left: 1px solid #e2e8f0;
        }
        .avatar-circle {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #854d0e;
          color: #ffffff;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.95rem;
        }
        .avatar-meta strong {
          display: block;
          font-size: 0.86rem;
          color: #0f172a;
          line-height: 1.2;
        }
        .avatar-meta small {
          font-size: 0.72rem;
          color: #64748b;
        }

        /* DASHBOARD CONTENT */
        .dashboard-content-area {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .dashboard-welcome-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 14px;
        }
        .dashboard-welcome-row h2 {
          font-size: 1.5rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }
        .dashboard-welcome-row p {
          font-size: 0.88rem;
          color: #64748b;
          margin: 4px 0 0;
        }
        .add-quick-product-btn {
          background: #854d0e;
          color: #ffffff;
          border: none;
          padding: 9px 16px;
          border-radius: 8px;
          font-size: 0.86rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .add-quick-product-btn:hover {
          background: #713f12;
        }

        /* 4 KPI Metric Cards */
        .kpi-cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
        }
        .kpi-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 18px 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          position: relative;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
        }
        .kpi-icon-wrap {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .kpi-icon-wrap.brown {
          background: #fef3c7;
          color: #854d0e;
        }
        .kpi-icon-wrap.orange {
          background: #ffedd5;
          color: #c2410c;
        }
        .kpi-icon-wrap.blue {
          background: #e0f2fe;
          color: #0369a1;
        }
        .kpi-icon-wrap.green {
          background: #dcfce7;
          color: #15803d;
        }
        .kpi-data-wrap {
          display: flex;
          flex-direction: column;
        }
        .kpi-number {
          font-size: 1.45rem;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.2;
        }
        .kpi-label {
          font-size: 0.8rem;
          color: #64748b;
          font-weight: 600;
          margin-top: 2px;
        }
        .kpi-growth-pill {
          position: absolute;
          bottom: 14px;
          right: 16px;
          font-size: 0.72rem;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 12px;
        }
        .kpi-growth-pill.positive {
          background: #dcfce7;
          color: #166534;
        }

        /* Analytics Two Column Grid */
        .analytics-two-col-grid {
          display: grid;
          grid-template-columns: 1.6fr 1.2fr;
          gap: 20px;
        }
        .chart-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
          display: flex;
          flex-direction: column;
        }
        .chart-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .chart-card-header h4 {
          font-size: 1rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }
        .chart-filter-select select {
          padding: 4px 8px;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 600;
          color: #334155;
          outline: none;
        }
        .chart-subtitle-note {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 600;
        }

        /* Bar Chart */
        .bar-chart-visual {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          height: 160px;
          padding: 10px 10px 0;
          border-bottom: 1px solid #e2e8f0;
        }
        .bar-column-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          flex: 1;
        }
        .bar-track {
          height: 120px;
          display: flex;
          align-items: flex-end;
        }
        .bar-fill {
          width: 26px;
          background: #854d0e;
          border-radius: 4px 4px 0 0;
          transition: height 0.4s ease;
        }
        .bar-fill:hover {
          background: #b45309;
        }
        .bar-day-label {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 600;
        }

        /* Donut Chart Visual */
        .donut-category-visual {
          display: flex;
          align-items: center;
          gap: 24px;
          padding-top: 10px;
        }
        .donut-svg-wrap {
          position: relative;
          width: 140px;
          height: 140px;
          flex-shrink: 0;
        }
        .donut-svg {
          transform: rotate(-90deg);
        }
        .donut-center-label {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .donut-center-label strong {
          font-size: 1.1rem;
          color: #0f172a;
          line-height: 1.1;
        }
        .donut-center-label small {
          font-size: 0.65rem;
          color: #64748b;
        }

        .donut-legend-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          flex: 1;
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
        }
        .legend-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .legend-name {
          color: #334155;
          flex: 1;
        }
        .legend-pct {
          color: #0f172a;
          font-weight: 700;
        }

        /* Bottom Row Tables Grid */
        .recent-data-tables-grid {
          display: grid;
          grid-template-columns: 1.5fr 1.3fr;
          gap: 20px;
        }
        .data-table-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
        }
        .data-table-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .data-table-header h4 {
          font-size: 1rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }
        .view-all-link-btn {
          background: none;
          border: none;
          color: #854d0e;
          font-weight: 700;
          font-size: 0.82rem;
          display: flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
        }
        .view-all-link-btn:hover {
          text-decoration: underline;
        }

        /* Admin Table Styling */
        .admin-table-wrap {
          overflow-x: auto;
        }
        .admin-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.84rem;
        }
        .admin-table th {
          background: #f8fafc;
          color: #475569;
          font-weight: 700;
          padding: 10px 12px;
          border-bottom: 1.5px solid #e2e8f0;
          white-space: nowrap;
        }
        .admin-table td {
          padding: 11px 12px;
          border-bottom: 1px solid #f1f5f9;
          color: #1e293b;
          vertical-align: middle;
        }
        .admin-table tr:hover {
          background: #fafafa;
        }

        .status-pill-badge {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.72rem;
          font-weight: 700;
        }
        .status-pill-badge.delivered {
          background: #dcfce7;
          color: #166534;
        }
        .status-pill-badge.out-for-delivery, .status-pill-badge.shipped {
          background: #fed7aa;
          color: #9a3412;
        }
        .status-pill-badge.processing, .status-pill-badge.confirmed, .status-pill-badge.packed {
          background: #e0e7ff;
          color: #3730a3;
        }
        .status-pill-badge.pending, .status-pill-badge.order-placed {
          background: #fef3c7;
          color: #854d0e;
        }
        .status-pill-badge.cancelled {
          background: #fee2e2;
          color: #991b1b;
        }

        .table-action-icon-btn {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          color: #334155;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .table-action-icon-btn.edit:hover {
          background: #fef3c7;
          color: #854d0e;
          border-color: #d97706;
        }
        .table-action-icon-btn.delete:hover {
          background: #fee2e2;
          color: #ef4444;
          border-color: #fca5a5;
        }
        .table-action-icon-btn.invoice:hover {
          background: #e0f2fe;
          color: #0284c7;
          border-color: #7dd3fc;
        }

        .table-whatsapp-reply-btn {
          background: #25d366;
          color: #ffffff;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          text-decoration: none;
          display: inline-block;
        }

        .table-truncate-text {
          display: inline-block;
          max-width: 140px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Subpage Card Style */
        .admin-subpage-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 24px;
          margin: 24px;
        }
        .subpage-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .subpage-header-row h3 {
          font-size: 1.3rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }
        .subpage-header-row p {
          font-size: 0.85rem;
          color: #64748b;
          margin: 4px 0 0;
        }

        .subpage-filters-bar {
          display: flex;
          gap: 12px;
          margin-bottom: 18px;
          flex-wrap: wrap;
        }
        .filter-search-box {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          padding: 8px 14px;
          border-radius: 8px;
          flex: 1;
          max-width: 400px;
        }
        .filter-search-box input {
          border: none;
          background: transparent;
          font-size: 0.86rem;
          outline: none;
          width: 100%;
        }
        .filter-dropdown-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          padding: 4px 12px;
          border-radius: 8px;
        }
        .filter-dropdown-wrap select {
          border: none;
          background: transparent;
          font-size: 0.85rem;
          font-weight: 600;
          color: #334155;
          outline: none;
        }

        .product-table-item-cell {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .product-thumb-sm {
          width: 42px;
          height: 42px;
          border-radius: 6px;
          object-fit: cover;
          border: 1px solid #e2e8f0;
        }
        .category-pill-tag {
          background: #f1f5f9;
          color: #475569;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: capitalize;
        }
        .badge-promo-pill {
          background: #fef3c7;
          color: #854d0e;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
        }
        .discount-tag {
          color: #16a34a;
          font-weight: 700;
        }
        .in-stock-badge {
          background: #dcfce7;
          color: #166534;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 700;
        }
        .role-tag {
          background: #e0f2fe;
          color: #0369a1;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 700;
        }
        .text-strike {
          text-decoration: line-through;
          color: #94a3b8;
          font-size: 0.78rem;
        }
        .table-actions-group {
          display: flex;
          gap: 6px;
        }

        .status-selector-input {
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 0.78rem;
          font-weight: 700;
          outline: none;
          cursor: pointer;
          border: 1px solid transparent;
        }
        .status-selector-input.delivered {
          background: #dcfce7;
          color: #166534;
        }
        .status-selector-input.out-for-delivery {
          background: #fed7aa;
          color: #9a3412;
        }
        .status-selector-input.packed, .status-selector-input.confirmed {
          background: #e0e7ff;
          color: #3730a3;
        }
        .status-selector-input.order-placed {
          background: #fef3c7;
          color: #854d0e;
        }

        /* Form Grid styles */
        .content-form-grid, .settings-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 24px;
        }
        .form-field-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .form-field-group.full-width {
          grid-column: 1 / -1;
        }
        .form-field-group label {
          font-size: 0.84rem;
          font-weight: 700;
          color: #334155;
        }
        .form-field-group input, .form-field-group select {
          padding: 10px 14px;
          border: 1.5px solid #cbd5e1;
          border-radius: 8px;
          font-size: 0.88rem;
          outline: none;
        }
        .form-field-group input:focus, .form-field-group select:focus {
          border-color: #854d0e;
        }
        .save-content-btn {
          background: #854d0e;
          color: #ffffff;
          border: none;
          padding: 11px 24px;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
        }

        /* Categories Admin Grid */
        .categories-admin-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .category-admin-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 16px;
        }
        .cat-box-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .cat-box-header h4 {
          font-size: 1.05rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }
        .cat-count-badge {
          background: #e2e8f0;
          color: #475569;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 12px;
        }
        .cat-sub-list strong {
          display: block;
          font-size: 0.8rem;
          color: #64748b;
          margin-bottom: 6px;
        }
        .cat-sub-list ul {
          margin: 0;
          padding-left: 18px;
          font-size: 0.84rem;
          color: #334155;
          line-height: 1.6;
        }

        /* Coupons Grid */
        .coupons-admin-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .coupon-admin-card {
          background: #f8fafc;
          border: 1px dashed #cbd5e1;
          border-radius: 10px;
          padding: 16px;
        }
        .coupon-code-pill {
          font-size: 1rem;
          font-weight: 800;
          color: #854d0e;
          margin-bottom: 6px;
        }
        .coupon-admin-card p {
          font-size: 0.82rem;
          color: #64748b;
          margin-bottom: 12px;
        }
        .coupon-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .active-tag {
          background: #dcfce7;
          color: #166534;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
        }

        /* Dialogs / Modals */
        .admin-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(4px);
          z-index: 1200;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }
        .admin-dialog-card {
          background: #ffffff;
          border-radius: 14px;
          max-width: 580px;
          width: 100%;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          overflow: hidden;
        }
        .dialog-header {
          padding: 16px 20px;
          background: #2b170e;
          color: #ffffff;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .dialog-header h4 {
          margin: 0;
          font-size: 1.1rem;
          color: #ffffff;
        }
        .dialog-close-btn {
          background: rgba(255, 255, 255, 0.15);
          border: none;
          color: #ffffff;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .dialog-form-body {
          padding: 20px;
        }
        .dialog-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-bottom: 20px;
        }
        .dialog-footer-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }
        .btn-cancel {
          background: #f1f5f9;
          color: #475569;
          border: 1px solid #cbd5e1;
          padding: 9px 16px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.86rem;
          cursor: pointer;
        }
        .btn-confirm {
          background: #854d0e;
          color: #ffffff;
          border: none;
          padding: 9px 20px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.86rem;
          cursor: pointer;
        }

        /* Mobile Responsive */
        @media (max-width: 1100px) {
          .kpi-cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .analytics-two-col-grid, .recent-data-tables-grid {
            grid-template-columns: 1fr;
          }
          .categories-admin-grid, .coupons-admin-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 900px) {
          .admin-sidebar {
            position: fixed;
            left: -260px;
            top: 0;
            bottom: 0;
            z-index: 1000;
          }
          .admin-sidebar.mobile-open {
            left: 0;
          }
          .mobile-close-sidebar {
            display: block;
          }
          .admin-mobile-backdrop {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
          }
          .date-range-badge, .header-search-box {
            display: none;
          }
          .dashboard-content-area, .admin-subpage-card {
            padding: 16px;
            margin: 12px;
          }
        }

        /* Settings Section Panels */
        .settings-section-panel {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 22px;
        }
        .settings-section-head {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 18px;
          padding-bottom: 12px;
          border-bottom: 1px solid #e2e8f0;
        }
        .section-icon {
          color: #854d0e;
        }
        .settings-section-head h4 {
          font-size: 1.05rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }
        .settings-section-head small {
          font-size: 0.78rem;
          color: #64748b;
        }

        .password-change-box {
          background: #ffffff;
          border: 1px dashed #cbd5e1;
          border-radius: 10px;
          padding: 16px;
          margin-top: 10px;
        }
        .password-change-box h5 {
          font-size: 0.88rem;
          font-weight: 800;
          color: #1e293b;
          margin: 0 0 12px;
        }
        .btn-update-pwd {
          background: #2b170e;
          color: #ffffff;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 10px;
        }
        .btn-update-pwd:hover {
          background: #452414;
        }

        .system-actions-grid {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }
        .system-action-btn {
          background: #ffffff;
          border: 1.5px solid #cbd5e1;
          color: #334155;
          padding: 10px 16px;
          border-radius: 8px;
          font-size: 0.84rem;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .system-action-btn:hover {
          background: #f1f5f9;
          border-color: #94a3b8;
        }
        .system-action-btn.export {
          background: #fef3c7;
          border-color: #d97706;
          color: #92400e;
        }
        .system-action-btn.danger {
          background: #fef2f2;
          border-color: #fca5a5;
          color: #b91c1c;
        }
        .system-action-btn.danger:hover {
          background: #fee2e2;
        }

        /* Footer Brand Editor & Live Preview */
        .footer-brand-editor-box {
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
          margin-top: 18px;
          margin-bottom: 22px;
        }
        .editor-subhead {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          padding-bottom: 10px;
          border-bottom: 1px solid #e2e8f0;
        }
        .editor-icon {
          color: #d97706;
        }
        .editor-subhead h4 {
          font-size: 1.05rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }
        .editor-subhead small {
          font-size: 0.78rem;
          color: #64748b;
        }
        .editor-textarea {
          width: 100%;
          padding: 10px 14px;
          border: 1.5px solid #cbd5e1;
          border-radius: 8px;
          font-size: 0.88rem;
          font-family: inherit;
          line-height: 1.5;
          outline: none;
          resize: vertical;
        }
        .editor-textarea:focus {
          border-color: #854d0e;
        }

        /* Live Preview Card matching the user's screenshot */
        .footer-preview-wrapper {
          margin-top: 20px;
        }
        .preview-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 700;
          color: #64748b;
          margin-bottom: 8px;
        }
        .footer-brand-live-preview {
          background: #1e130c;
          color: #d8c7bc;
          border-radius: 12px;
          padding: 24px 28px;
          max-width: 440px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }
        .preview-logo-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
        }
        .preview-logo-icon {
          width: 36px;
          height: 36px;
          background: #d97706;
          color: #ffffff;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          font-weight: 900;
        }
        .preview-logo-text span {
          font-size: 1.3rem;
          font-weight: 800;
          color: #ffffff;
        }
        .preview-logo-text span strong {
          color: #f59e0b;
        }
        .preview-logo-text small {
          display: block;
          font-size: 0.65rem;
          letter-spacing: 1.5px;
          color: #cbd5e1;
          font-weight: 700;
        }
        .preview-desc-text {
          font-size: 0.88rem;
          line-height: 1.55;
          color: #d1d5db;
          margin-bottom: 18px;
        }
        .preview-social-icons-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .preview-social-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 640px) {
          .admin-top-header {
            padding: 0 12px;
            height: 56px;
          }
          .avatar-meta {
            display: none;
          }
          .admin-avatar-card {
            border-left: none;
            padding-left: 0;
          }
          .dashboard-content-area, .admin-subpage-card {
            padding: 12px 10px;
            margin: 6px 4px;
          }
          .dashboard-welcome-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          .dashboard-welcome-row h2 {
            font-size: 1.25rem;
          }
          .add-quick-product-btn {
            width: 100%;
            justify-content: center;
          }
          .kpi-cards-grid {
            grid-template-columns: 1fr;
            gap: 10px;
          }
          .kpi-card {
            padding: 12px 14px;
            gap: 12px;
          }
          .kpi-icon-wrap {
            width: 40px;
            height: 40px;
          }
          .kpi-number {
            font-size: 1.25rem;
          }
          .analytics-two-col-grid {
            grid-template-columns: 1fr;
            gap: 14px;
          }
          .chart-card {
            padding: 14px;
          }
          .donut-category-visual {
            flex-direction: column;
            gap: 14px;
            align-items: center;
            text-align: center;
          }
          .donut-legend-list {
            width: 100%;
          }
          .recent-data-tables-grid {
            grid-template-columns: 1fr;
            gap: 14px;
          }
          .data-table-card {
            padding: 14px 10px;
          }
          .admin-table-wrap {
            width: 100%;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }
          .admin-table {
            min-width: 520px;
            font-size: 0.78rem;
          }
          .admin-table th, .admin-table td {
            padding: 8px 10px;
          }
          .dialog-card {
            width: 95vw !important;
            max-width: 95vw !important;
            max-height: 90vh;
            overflow-y: auto;
            padding: 14px;
          }
          .dialog-grid {
            grid-template-columns: 1fr;
            gap: 10px;
          }
          .settings-section-panel {
            padding: 14px 10px;
          }
          .footer-brand-editor-box {
            padding: 14px 10px;
          }
          .footer-brand-live-preview {
            max-width: 100%;
            padding: 16px 12px;
          }
          .system-actions-grid {
            flex-direction: column;
            gap: 8px;
          }
          .system-action-btn {
            width: 100%;
            justify-content: center;
          }
          .subpage-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          .subpage-header-actions {
            width: 100%;
            flex-direction: column;
          }
          .subpage-header-actions button,
          .subpage-header-actions a {
            width: 100%;
            justify-content: center;
          }
          .filter-controls-row {
            flex-direction: column;
            align-items: stretch;
            gap: 8px;
          }
        }

        @media (max-width: 380px) {
          .admin-top-header {
            padding: 0 8px;
          }
          .sidebar-brand-title h3 {
            font-size: 1rem;
          }
          .kpi-number {
            font-size: 1.15rem;
          }
          .kpi-label {
            font-size: 0.72rem;
          }
          .preview-logo-text span {
            font-size: 1.1rem;
          }
          .preview-desc-text {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
}
