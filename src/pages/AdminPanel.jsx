import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, Package, Layers, ShoppingCart, MessageSquare, 
  Users, User, Tag, Globe, Star, BarChart3, Settings, ShieldCheck, 
  LogOut, Search, Bell, Calendar, ChevronDown, Plus, Minus, Eye, EyeOff, 
  Edit3, Trash2, Printer, CheckCircle, Clock, Truck, Home, 
  FileText, ArrowRight, ArrowLeft, Mail, Lock, Check, AlertCircle,
  Menu, X, IndianRupee, Phone, ExternalLink, RefreshCw, Sparkles, Filter, MessageCircle,
  MapPin, Award, UserPlus, Download, UserCheck, Sliders, Heart, CreditCard, QrCode, Wallet,
  TrendingUp, ShoppingBag, Folder, Receipt, ReceiptIndianRupee
} from 'lucide-react';

export default function AdminPanel({
  products = [],
  orders = [],
  initialTab = 'dashboard',
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onUpdatePaymentStatus,
  onEditOrder,
  onDeleteOrder,
  onViewInvoice,
  onBackToStore,
  onAddOrder
}) {
  // Authentication State (Direct Access: Login Screen completely bypassed)
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const [loginEmail, setLoginEmail] = useState('admin@sardarmart.com');
  const [loginPassword, setLoginPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState('');

  // Active Admin Tab (persisted in localStorage so page reload stays on the same tab)
  const [activeTab, setActiveTab] = useState(() => {
    try {
      const saved = localStorage.getItem('hk_admin_active_tab');
      return saved || initialTab || 'dashboard';
    } catch {
      return initialTab || 'dashboard';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('hk_admin_active_tab', activeTab);
    } catch {}
  }, [activeTab]);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Mobile Bottom Navigation Bar Auto-Hide on Scroll (hides on scroll down, reveals on scroll up)
  const [isMobileNavVisible, setIsMobileNavVisible] = useState(true);
  const lastAdminScrollY = useRef(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
          const diff = currentScrollY - lastAdminScrollY.current;

          // Always visible near top of page
          if (currentScrollY < 30) {
            setIsMobileNavVisible(true);
          } else if (diff > 8) {
            // Scrolling down (finger swipe up) -> hide bottom navbar
            setIsMobileNavVisible(false);
          } else if (diff < -8) {
            // Scrolling up (finger swipe down) -> show bottom navbar
            setIsMobileNavVisible(true);
          }

          lastAdminScrollY.current = currentScrollY <= 0 ? 0 : currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  const [editingOrder, setEditingOrder] = useState(null);

  // Invoices Tab states (Dashboard > Invoices)
  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [invoicePaymentFilter, setInvoicePaymentFilter] = useState('all');
  const [invoiceDeliveryFilter, setInvoiceDeliveryFilter] = useState('all');

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
        storeName: 'Sardar Mart Furniture & Electronics',
        phone: '+91 98765 43210',
        email: 'care@sardarmart.com',
        address: '190, Erukkenchery High Rd, Anbalagan Colony, Vyasarpadi, Chennai, Tamil Nadu 600039',
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
        storeName: 'Sardar Mart Furniture & Electronics',
        phone: '+91 98765 43210',
        email: 'care@sardarmart.com',
        address: '190, Erukkenchery High Rd, Anbalagan Colony, Vyasarpadi, Chennai, Tamil Nadu 600039',
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
    const defaultSettings = {
      storeLegalName: 'Sardar Mart',
      gstNumber: '33DVKPR2334L1Z9',
      currency: 'INR (₹)',
      taxGst: '18%',
      invoicePrefix: 'SM-2026-',
      freeShippingThreshold: '4999',
      standardDeliveryFee: '0',
      courierPartner: 'Sardar Mart Express Fleet',
      defaultOrderStatus: 'Order Placed',
      whatsappAlerts: true,
      smsAlerts: true,
      emailReports: true,
      twoFactorAuth: false,
      // Live Website Feature Toggles
      showGstinBadge: false,        // Default OFF: Removes GST number from website as requested
      showBillingPage: false,       // Default OFF: Removes Billing Tax Invoice from shop list
      showWhatsAppButton: true,
      showOrderTracking: true,
      showWishlist: true,
      showOffersBanner: true,
      showWhiteGloveAssembly: true,
      showEmiOptions: true,
      showReviews: true,
      showStockBadges: true,
      // Payment Modes & Payment Status Settings (Customer Checkout Step 3)
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
      codNote: 'Inspect your sofa, bed, or television at your home before paying. You can pay via Cash or UPI QR Code directly to our delivery executive.',
      codDefaultStatus: 'Pending (Pay on Assembly)'
    };
    try {
      const saved = localStorage.getItem('hk_admin_settings');
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  const updateFeatureToggle = (key, value) => {
    const updated = { ...storeSettings, [key]: value };
    setStoreSettings(updated);
    try {
      localStorage.setItem('hk_admin_settings', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('hk_settings_changed', { detail: updated }));
    } catch {}
    showToast(`Setting Updated: ${key} is now ${value ? 'ON' : 'OFF'}`);
  };

  // Admin Profile Credentials State
  const [adminProfile, setAdminProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('hk_admin_profile');
      return saved ? JSON.parse(saved) : {
        name: 'Rahim Baig',
        email: 'admin@sardarmart.com',
        role: 'Super Admin / Owner',
        phone: '+91 98765 43210'
      };
    } catch {
      return {
        name: 'Rahim Baig',
        email: 'admin@sardarmart.com',
        role: 'Super Admin / Owner',
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

  // Download HTML Tax Invoice helper
  const handleDownloadInvoiceHtml = (ord) => {
    if (!ord) return;
    const invId = ord.id || 'INV';
    const taxable = Math.round((ord.total || 0) / 1.18);
    const gstTotal = (ord.total || 0) - taxable;
    const cgst = Math.round(gstTotal / 2);
    const sgst = gstTotal - cgst;

    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Tax_Invoice_${invId}_Sardar_Mart</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 32px; color: #1e293b; max-width: 800px; margin: 0 auto; line-height: 1.5; }
    .header { display: flex; justify-content: space-between; border-bottom: 2px solid #7c3aed; padding-bottom: 16px; margin-bottom: 24px; }
    .brand { font-size: 24px; font-weight: 800; color: #4c1d95; }
    .meta { text-align: right; font-size: 13px; color: #64748b; }
    .bill-to { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px; }
    th { background: #f1f5f9; text-align: left; padding: 10px; border-bottom: 1px solid #cbd5e1; }
    td { padding: 10px; border-bottom: 1px solid #e2e8f0; }
    .totals { margin-left: auto; width: 300px; }
    .totals table td { border: none; padding: 4px 0; }
    .grand-total { font-size: 18px; font-weight: 800; color: #7c3aed; border-top: 2px solid #cbd5e1; }
    .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; text-align: center; color: #94a3b8; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">SARDAR MART</div>
      <div style="font-size: 12px; color: #64748b;">Furniture &amp; Electronics Showroom</div>
      <div style="font-size: 12px; color: #64748b;">GSTIN: 33DVKPR2334L1Z9</div>
    </div>
    <div class="meta">
      <div style="font-size: 18px; font-weight: 700; color: #1e293b;">OFFICIAL TAX INVOICE</div>
      <div><strong>Invoice #:</strong> #${invId}</div>
      <div><strong>Date:</strong> ${ord.date || new Date().toLocaleDateString('en-IN')}</div>
      <div><strong>Payment:</strong> ${ord.paymentMethod || 'UPI / Cash'}</div>
    </div>
  </div>

  <div class="bill-to">
    <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">Customer Information:</div>
    <div style="font-size: 15px; font-weight: 700;">${ord.customer?.name || 'Walk-In Customer'}</div>
    <div style="font-size: 13px; color: #475569;">${ord.customer?.phone || ''} ${ord.customer?.email ? '• ' + ord.customer.email : ''}</div>
    <div style="font-size: 13px; color: #475569;">${ord.customer?.address || ''} ${ord.customer?.city ? ord.customer.city + ' - ' + (ord.customer?.pincode || '') : ''}</div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Item Description</th>
        <th style="text-align: center;">Qty</th>
        <th style="text-align: right;">Unit Price</th>
        <th style="text-align: right;">Total</th>
      </tr>
    </thead>
    <tbody>
      ${(ord.items || []).map(it => `
        <tr>
          <td><strong>${it.name || 'Product'}</strong></td>
          <td style="text-align: center;">${it.quantity || 1}</td>
          <td style="text-align: right;">₹${Number(it.price || 0).toLocaleString('en-IN')}</td>
          <td style="text-align: right;">₹${(Number(it.price || 0) * Number(it.quantity || 1)).toLocaleString('en-IN')}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="totals">
    <table>
      <tr><td>Taxable Value (Excl. GST):</td><td style="text-align: right;">₹${taxable.toLocaleString('en-IN')}</td></tr>
      <tr><td>CGST (9%):</td><td style="text-align: right;">₹${cgst.toLocaleString('en-IN')}</td></tr>
      <tr><td>SGST (9%):</td><td style="text-align: right;">₹${sgst.toLocaleString('en-IN')}</td></tr>
      <tr class="grand-total"><td style="padding-top: 8px;">Net Total:</td><td style="text-align: right; padding-top: 8px;">₹${Number(ord.total || 0).toLocaleString('en-IN')}</td></tr>
    </table>
  </div>

  <div class="footer">
    Thank you for shopping with Sardar Mart. Computer-generated official tax invoice.
  </div>
</body>
</html>`;

    try {
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Invoice_${invId}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast(`Invoice #${invId} downloaded successfully`);
    } catch {
      window.print();
    }
  };

  // -------------------------------------------------------------
  // CUSTOMER DIRECTORY & CRM STATE
  // -------------------------------------------------------------
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerFilter, setCustomerFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [newCustomerForm, setNewCustomerForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: 'Chennai',
    pincode: '600044',
    tier: 'Verified Buyer',
    notes: ''
  });

  // Registered showroom and phone customers
  const [manualCustomers, setManualCustomers] = useState(() => {
    try {
      const saved = localStorage.getItem('sm_manual_customers');
      return saved ? JSON.parse(saved) : [
        {
          id: 'CUST-SM-103',
          name: 'Ananya Iyer',
          phone: '+91 94441 88992',
          email: 'ananya.iyer@example.com',
          address: 'No. 18, 4th Main Road, Besant Nagar',
          city: 'Chennai',
          pincode: '600090',
          joinDate: '12 Sep 2026',
          notes: 'High-frequency buyer. Premium interior designer ordering for residential luxury villas.',
          vipTier: 'VIP Platinum',
          customSpend: 145000,
          customOrdersCount: 4
        },
        {
          id: 'CUST-SM-104',
          name: 'Vikram Patel',
          phone: '+91 98200 45678',
          email: 'vikram.p@example.com',
          address: 'Villa 7, Orchid Enclave, ECR Road',
          city: 'Chennai',
          pincode: '600115',
          joinDate: '01 Oct 2026',
          notes: 'Interested in 75-inch QLED TV & Dolby Atmos surround sound bar.',
          vipTier: 'Gold Club',
          customSpend: 78500,
          customOrdersCount: 2
        },
        {
          id: 'CUST-SM-105',
          name: 'Karthik R',
          phone: '+91 98840 11223',
          email: 'karthik.r@example.com',
          address: '22, GST Road, Chromepet',
          city: 'Chennai',
          pincode: '600044',
          joinDate: '05 Oct 2026',
          notes: 'Chromepet showroom regular. Prefers pure solid Sheesham wood furniture.',
          vipTier: 'Verified Buyer',
          customSpend: 32400,
          customOrdersCount: 1
        }
      ];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('sm_manual_customers', JSON.stringify(manualCustomers));
    } catch {}
  }, [manualCustomers]);

  // Dynamic Customer Directory aggregation from Orders, Enquiries, and Registered Clients
  const allCustomers = React.useMemo(() => {
    const customerMap = new Map();

    // 1. Process from Live/Saved Orders
    orders.forEach((ord) => {
      const cust = ord.customer;
      if (!cust) return;
      const key = (cust.phone || cust.name || '').trim().toLowerCase();
      if (!key) return;

      if (!customerMap.has(key)) {
        customerMap.set(key, {
          id: `CUST-SM-${Math.abs(key.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)).toString().slice(0, 4)}`,
          name: cust.name || 'Valued Customer',
          phone: cust.phone || '',
          email: cust.email || '',
          address: cust.address || '',
          city: cust.city || 'Chennai',
          pincode: cust.pincode || '',
          orders: [ord],
          enquiries: [],
          totalSpent: ord.total || 0,
          lastActive: ord.date || 'Recent',
          notes: ord.notes || '',
          joinDate: ord.date?.split(',')[0] || 'Oct 2026',
          isManual: false
        });
      } else {
        const existing = customerMap.get(key);
        existing.orders.push(ord);
        existing.totalSpent += (ord.total || 0);
        if (ord.address && !existing.address) existing.address = ord.address;
        if (ord.email && !existing.email) existing.email = ord.email;
        if (ord.notes && !existing.notes) existing.notes = ord.notes;
      }
    });

    // 2. Process from Enquiries
    enquiries.forEach((enq) => {
      const key = (enq.contact || enq.name || '').trim().toLowerCase();
      if (!key) return;

      if (!customerMap.has(key)) {
        customerMap.set(key, {
          id: `LEAD-SM-${enq.id?.replace(/\D/g, '') || Math.floor(Math.random() * 900 + 100)}`,
          name: enq.name || 'Showroom Lead',
          phone: enq.contact || '',
          email: enq.email || '',
          address: 'Chromepet Showroom / Online Store Lead',
          city: 'Chennai',
          pincode: '600044',
          orders: [],
          enquiries: [enq],
          totalSpent: 0,
          lastActive: enq.date || 'Recent',
          notes: `Interested in ${enq.product}: "${enq.message}"`,
          joinDate: enq.date || 'Oct 2026',
          isManual: false
        });
      } else {
        const existing = customerMap.get(key);
        existing.enquiries.push(enq);
      }
    });

    // 3. Process from Registered Showroom Clients
    manualCustomers.forEach((mc) => {
      const key = (mc.phone || mc.name || '').trim().toLowerCase();
      if (!customerMap.has(key)) {
        customerMap.set(key, {
          id: mc.id || `CUST-SM-${Math.floor(Math.random() * 900 + 100)}`,
          name: mc.name,
          phone: mc.phone,
          email: mc.email,
          address: mc.address,
          city: mc.city || 'Chennai',
          pincode: mc.pincode,
          orders: [],
          enquiries: [],
          totalSpent: mc.customSpend || 0,
          customOrdersCount: mc.customOrdersCount || 0,
          lastActive: mc.joinDate || 'Oct 2026',
          notes: mc.notes || '',
          vipTier: mc.vipTier,
          joinDate: mc.joinDate || 'Oct 2026',
          isManual: true
        });
      } else {
        const existing = customerMap.get(key);
        if (mc.notes && !existing.notes) existing.notes = mc.notes;
      }
    });

    // Format and assign tiers
    return Array.from(customerMap.values()).map((c) => {
      const orderCount = (c.orders?.length || 0) + (c.customOrdersCount || 0);
      let tier = c.vipTier;
      if (!tier) {
        if (c.totalSpent >= 50000) tier = 'VIP Platinum';
        else if (c.totalSpent >= 20000) tier = 'Gold Club';
        else if (orderCount > 0) tier = 'Verified Buyer';
        else tier = 'Showroom Lead';
      }
      const loyaltyPoints = Math.floor(c.totalSpent / 100);

      return {
        ...c,
        orderCount,
        tier,
        loyaltyPoints
      };
    });
  }, [orders, enquiries, manualCustomers]);

  // Export Customer Directory to CSV file
  const handleExportCustomers = () => {
    const headers = ['Customer ID', 'Full Name', 'Phone', 'Email', 'Address', 'City', 'Pincode', 'Tier', 'Orders Count', 'Total Spent (INR)', 'Loyalty Points', 'Last Active'];
    const rows = allCustomers.map(c => [
      c.id,
      `"${c.name.replace(/"/g, '""')}"`,
      `"${c.phone}"`,
      `"${c.email}"`,
      `"${c.address.replace(/"/g, '""')}"`,
      `"${c.city}"`,
      `"${c.pincode}"`,
      `"${c.tier}"`,
      c.orderCount,
      c.totalSpent,
      c.loyaltyPoints,
      `"${c.lastActive}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Sardar_Mart_Customers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Customer directory exported to CSV!');
  };

  // Add new Customer Handler
  const handleAddCustomerSubmit = (e) => {
    e.preventDefault();
    if (!newCustomerForm.name.trim() || !newCustomerForm.phone.trim()) {
      showToast('Please enter both Customer Name and Phone Number');
      return;
    }

    const newCust = {
      id: `CUST-SM-${Math.floor(Math.random() * 900 + 100)}`,
      name: newCustomerForm.name.trim(),
      phone: newCustomerForm.phone.trim(),
      email: newCustomerForm.email.trim(),
      address: newCustomerForm.address.trim() || 'Showroom Client',
      city: newCustomerForm.city.trim() || 'Chennai',
      pincode: newCustomerForm.pincode.trim() || '600044',
      joinDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      notes: newCustomerForm.notes.trim() || 'Direct showroom registration.',
      vipTier: newCustomerForm.tier,
      customSpend: 0,
      customOrdersCount: 0
    };

    setManualCustomers(prev => [newCust, ...prev]);
    setIsAddCustomerModalOpen(false);
    setNewCustomerForm({
      name: '',
      phone: '',
      email: '',
      address: '',
      city: 'Chennai',
      pincode: '600044',
      tier: 'Verified Buyer',
      notes: ''
    });
    showToast(`Added customer profile for "${newCust.name}"!`);
  };

  // Update Customer Notes Handler
  const handleSaveCustomerNotes = (targetId, updatedNotes) => {
    setManualCustomers(prev => {
      const exists = prev.find(c => c.id === targetId);
      if (exists) {
        return prev.map(c => c.id === targetId ? { ...c, notes: updatedNotes } : c);
      } else {
        // If not in manualCustomers, create an override entry
        const found = allCustomers.find(c => c.id === targetId);
        if (found) {
          return [
            {
              id: found.id,
              name: found.name,
              phone: found.phone,
              email: found.email,
              address: found.address,
              city: found.city,
              pincode: found.pincode,
              joinDate: found.joinDate,
              notes: updatedNotes,
              vipTier: found.tier,
              customSpend: found.totalSpent,
              customOrdersCount: found.orderCount
            },
            ...prev
          ];
        }
        return prev;
      }
    });

    if (selectedCustomer && selectedCustomer.id === targetId) {
      setSelectedCustomer(prev => ({ ...prev, notes: updatedNotes }));
    }
    showToast('Customer notes updated successfully');
  };

  // -------------------------------------------------------------
  // SHOWROOM POS / CREATE BILLING & TAX INVOICE STATE & HANDLERS
  // -------------------------------------------------------------
  const [billingCustomerMode, setBillingCustomerMode] = useState('existing'); // 'existing' | 'new'
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [billingCustomer, setBillingCustomer] = useState({
    name: 'Priya Sharma',
    phone: '+91 98401 23456',
    email: 'priya.sharma@example.com',
    address: 'Plot 42, Green Park Avenue, Anna Nagar',
    city: 'Chennai',
    pincode: '600040'
  });

  const [billingItems, setBillingItems] = useState(() => {
    if (products.length > 0) {
      return [{
        id: products[0].id,
        name: products[0].name,
        price: products[0].price,
        quantity: 1,
        image: products[0].image,
        category: products[0].category || 'furniture'
      }];
    }
    return [];
  });

  const [billingProductSearch, setBillingProductSearch] = useState('');
  const [billingProductCat, setBillingProductCat] = useState('all');
  const [billingDiscount, setBillingDiscount] = useState(0);
  const [billingDeliveryFee, setBillingDeliveryFee] = useState(0);
  const [billingPaymentMethod, setBillingPaymentMethod] = useState('UPI (GPay / PhonePe)');
  const [billingPaymentStatus, setBillingPaymentStatus] = useState('Paid Online (Verified)');
  const [billingOrderStatus, setBillingOrderStatus] = useState('Delivered');
  const [billingNotes, setBillingNotes] = useState('Showroom billing invoice with direct customer handover.');

  // Billing Handlers
  const handleAddProductToBill = (prod) => {
    setBillingItems(prev => {
      const existing = prev.find(item => item.id === prod.id);
      if (existing) {
        showToast(`Increased quantity of "${prod.name}"`);
        return prev.map(item => item.id === prod.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      showToast(`Added "${prod.name}" to bill!`);
      return [...prev, {
        id: prod.id,
        name: prod.name,
        price: prod.price,
        quantity: 1,
        image: prod.image,
        category: prod.category || 'furniture'
      }];
    });
  };

  const handleUpdateBillingItemQty = (id, delta) => {
    setBillingItems(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const nextQty = item.quantity + delta;
          return nextQty > 0 ? { ...item, quantity: nextQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const handleRemoveBillingItem = (id) => {
    setBillingItems(prev => prev.filter(item => item.id !== id));
  };

  const handleAddCustomLineItem = () => {
    const customName = window.prompt('Enter Custom Item or Service Name:', 'Custom Woodwork & Assembly');
    if (!customName || !customName.trim()) return;
    const priceStr = window.prompt('Enter Unit Price (₹):', '1500');
    const customPrice = Math.max(0, Number(priceStr) || 0);
    setBillingItems(prev => [
      ...prev,
      {
        id: `custom-${Date.now()}`,
        name: customName.trim(),
        price: customPrice,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=200&q=80',
        category: 'services'
      }
    ]);
    showToast(`Added "${customName}" to current bill!`);
  };

  const handleSelectCustomerForBilling = (custId) => {
    setSelectedCustomerId(custId);
    const found = allCustomers.find(c => c.id === custId);
    if (found) {
      setBillingCustomer({
        name: found.name || '',
        phone: found.phone || '',
        email: found.email || '',
        address: found.address || '',
        city: found.city || 'Chennai',
        pincode: found.pincode || '600001'
      });
      showToast(`Autofilled customer "${found.name}"`);
    }
  };

  const handleResetBillingForm = () => {
    setBillingCustomer({
      name: '',
      phone: '',
      email: '',
      address: '',
      city: 'Chennai',
      pincode: '600001'
    });
    setBillingItems([]);
    setBillingDiscount(0);
    setBillingDeliveryFee(0);
    setSelectedCustomerId('');
    showToast('Billing form reset');
  };

  const billingSubtotal = billingItems.reduce((acc, it) => acc + (it.price * it.quantity), 0);
  const billingTotal = Math.max(0, billingSubtotal - Number(billingDiscount || 0) + Number(billingDeliveryFee || 0));

  const handleGenerateBillOrder = (andPrint = false) => {
    if (!billingCustomer.name.trim()) {
      showToast('⚠️ Please enter Customer Name');
      return;
    }
    if (!billingCustomer.phone.trim()) {
      showToast('⚠️ Please enter Customer Phone Number');
      return;
    }
    if (billingItems.length === 0) {
      showToast('⚠️ Please add at least 1 product to the bill');
      return;
    }

    const orderNum = Math.floor(1000 + Math.random() * 9000);
    const newOrderId = `HK-2026-${orderNum}`;
    const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + 
      ', ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const newBillOrder = {
      id: newOrderId,
      date: dateStr,
      customer: {
        name: billingCustomer.name.trim(),
        phone: billingCustomer.phone.trim(),
        email: billingCustomer.email.trim() || `${billingCustomer.name.toLowerCase().replace(/\s+/g, '')}@example.com`,
        address: billingCustomer.address.trim() || 'Showroom Walk-in Counter',
        city: billingCustomer.city.trim() || 'Chennai',
        pincode: billingCustomer.pincode.trim() || '600001'
      },
      items: billingItems.map(it => ({
        id: it.id,
        name: it.name,
        price: it.price,
        quantity: it.quantity,
        category: it.category || 'furniture',
        image: it.image
      })),
      subtotal: billingSubtotal,
      discount: Number(billingDiscount || 0),
      delivery: Number(billingDeliveryFee || 0),
      total: billingTotal,
      paymentMethod: billingPaymentMethod,
      paymentStatus: billingPaymentStatus,
      status: billingOrderStatus,
      notes: billingNotes.trim() || 'Showroom Billing Tax Invoice'
    };

    if (onAddOrder) {
      onAddOrder(newBillOrder);
    } else {
      try {
        const saved = localStorage.getItem('hk_orders');
        const existingOrders = saved ? JSON.parse(saved) : [];
        localStorage.setItem('hk_orders', JSON.stringify([newBillOrder, ...existingOrders]));
      } catch {}
    }

    // Update customer stats
    setManualCustomers(prev => {
      const exists = prev.find(c => c.phone === newBillOrder.customer.phone || c.name === newBillOrder.customer.name);
      if (exists) {
        return prev.map(c => c.id === exists.id ? { 
          ...c, 
          customSpend: (c.customSpend || 0) + newBillOrder.total,
          customOrdersCount: (c.customOrdersCount || 0) + 1
        } : c);
      }
      return [
        {
          id: `CUST-SM-${Math.floor(Math.random() * 900 + 100)}`,
          name: newBillOrder.customer.name,
          phone: newBillOrder.customer.phone,
          email: newBillOrder.customer.email,
          address: newBillOrder.customer.address,
          city: newBillOrder.customer.city,
          pincode: newBillOrder.customer.pincode,
          joinDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          notes: 'Registered via Showroom POS Billing',
          vipTier: 'Verified Buyer',
          customSpend: newBillOrder.total,
          customOrdersCount: 1
        },
        ...prev
      ];
    });

    showToast(`🎉 Tax Invoice #${newOrderId} generated! Total: ${formatPrice(billingTotal)}`);

    if (andPrint && onViewInvoice) {
      onViewInvoice(newBillOrder);
    }

    setActiveTab('orders');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      (loginEmail.toLowerCase() === 'admin@sardarmart.com' && loginPassword === 'admin123') ||
      (loginEmail.toLowerCase() === 'admin@homekart.com' && loginPassword === 'admin123') ||
      (loginEmail.toLowerCase().includes('rahim') && loginPassword === 'admin123') ||
      loginEmail.includes('admin')
    ) {
      setIsAuthenticated(true);
      setLoginError('');
      showToast(`Welcome back, ${adminProfile.name || 'Rahim Baig'}!`);
    } else {
      setLoginError('Invalid credentials. Use demo: admin@sardarmart.com / admin123');
    }
  };

  const handleQuickDemoLogin = () => {
    setLoginEmail('admin@sardarmart.com');
    setLoginPassword('admin123');
    setIsAuthenticated(true);
    setLoginError('');
    showToast(`Logged in as ${adminProfile.name || 'Rahim Baig'} (Demo)`);
  };

  const handleLogout = () => {
    showToast('Returning to Storefront');
    if (onBackToStore) onBackToStore();
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
  // VIEW 1: LOGIN & ACCESS SCREEN (Bypassed: Login screen never shown)
  // -------------------------------------------------------------
  if (false && !isAuthenticated) {
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
                <h1>Sardar Mart</h1>
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
    <div className={`admin-portal-wrapper ${mobileSidebarOpen ? 'drawer-open' : ''}`}>
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
              <h3>Sardar Mart</h3>
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

          {/* Invoices right under Dashboard */}
          <button 
            className={`nav-item-btn ${activeTab === 'invoices' ? 'active' : ''}`}
            onClick={() => { setActiveTab('invoices'); setMobileSidebarOpen(false); }}
            title="Invoices & Tax Bills (Dashboard > Invoices)"
          >
            <FileText size={19} />
            {!sidebarCollapsed && <span>Invoices</span>}
            {!sidebarCollapsed && <span className="sidebar-count-badge gold">{orders.length}</span>}
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

          {/* Create Billing / Showroom POS */}
          <button 
            className={`nav-item-btn ${activeTab === 'create-billing' ? 'active' : ''}`}
            onClick={() => { setActiveTab('create-billing'); setMobileSidebarOpen(false); }}
            title="Create Billing / Tax Invoice"
            style={activeTab === 'create-billing' ? {
              background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
              color: '#ffffff',
              fontWeight: 800,
              boxShadow: '0 4px 14px rgba(109, 40, 217, 0.4)'
            } : {
              background: 'rgba(139, 92, 246, 0.12)',
              color: '#c4b5fd',
              border: '1px solid rgba(139, 92, 246, 0.28)',
              margin: '3px 0'
            }}
          >
            <Receipt size={19} style={{ color: activeTab === 'create-billing' ? '#ffffff' : '#a78bfa' }} />
            {!sidebarCollapsed && <span style={{ fontWeight: 700 }}>Create Billing</span>}
            {!sidebarCollapsed && (
              <span className="sidebar-count-badge" style={{ background: '#7c3aed', color: '#ffffff', fontSize: '0.65rem', marginLeft: 'auto' }}>
                POS
              </span>
            )}
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
            {!sidebarCollapsed && (
              <span className="sidebar-count-badge brown">
                {allCustomers.length}
              </span>
            )}
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

            <div className="admin-header-title-badge">
              <strong>Sardar Mart</strong>
              <small>Executive Admin</small>
            </div>

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
              <div className="avatar-circle">{(adminProfile?.name || 'R').charAt(0)}</div>
              <div className="avatar-meta">
                <strong>{adminProfile?.name || 'Rahim Baig'}</strong>
                <small>{adminProfile?.role || 'Super Admin'}</small>
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
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button 
                  type="button"
                  className="admin-secondary-btn"
                  onClick={() => { setActiveTab('invoices'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{ gap: '6px', fontSize: '0.84rem' }}
                  title="View All Tax Invoices (Dashboard > Invoices)"
                >
                  <FileText size={15} /> All Invoices ({orders.length})
                </button>
                <button 
                  className="add-quick-product-btn"
                  onClick={() => { setActiveTab('create-billing'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                    boxShadow: '0 4px 14px rgba(109, 40, 217, 0.35)',
                    gap: '6px'
                  }}
                >
                  <Receipt size={16} /> + Create New Bill
                </button>
                <button 
                  className="add-quick-product-btn"
                  onClick={() => { setActiveTab('products'); setIsAddProductModalOpen(true); }}
                >
                  <Plus size={16} /> Add Product
                </button>
              </div>
            </div>

            {/* Metric KPI Cards (Matches 2nd Image: Clean Card Style with Top-Left Pastel Icon) */}
            <div className="kpi-cards-grid second-image-style">
              {/* Card 1: Total Sales */}
              <div className="kpi-modern-card">
                <div className="modern-kpi-icon-wrap cyan">
                  <IndianRupee size={22} />
                </div>
                <span className="modern-kpi-title">Total Sales</span>
                <strong className="modern-kpi-value">{formatPrice(totalRevenue || 253649)}</strong>
                <span className="modern-kpi-subtext">{orders.length} invoices recorded</span>
              </div>

              {/* Card 2: Total Purchases */}
              <div className="kpi-modern-card">
                <div className="modern-kpi-icon-wrap amber">
                  <ShoppingBag size={22} />
                </div>
                <span className="modern-kpi-title">Total Purchases</span>
                <strong className="modern-kpi-value">{totalOrdersCount > 0 ? (totalOrdersCount + 23) : 25}</strong>
                <span className="modern-kpi-subtext">{totalOrdersCount > 0 ? totalOrdersCount : 25} purchase orders</span>
              </div>

              {/* Card 3: Total Revenue */}
              <div className="kpi-modern-card">
                <div className="modern-kpi-icon-wrap green">
                  <TrendingUp size={22} />
                </div>
                <span className="modern-kpi-title">Total Revenue</span>
                <strong className="modern-kpi-value">{formatPrice(totalRevenue || 253649)}</strong>
                <span className="modern-kpi-subtext">Net settled revenue</span>
              </div>

              {/* Card 4: Total Expenses */}
              <div className="kpi-modern-card">
                <div className="modern-kpi-icon-wrap rose">
                  <CreditCard size={22} />
                </div>
                <span className="modern-kpi-title">Total Expenses</span>
                <strong className="modern-kpi-value">₹0.00</strong>
                <span className="modern-kpi-subtext">0 claims recorded</span>
              </div>

              {/* Card 5: Total Products */}
              <div className="kpi-modern-card">
                <div className="modern-kpi-icon-wrap purple">
                  <Package size={22} />
                </div>
                <span className="modern-kpi-title">Total Products</span>
                <strong className="modern-kpi-value">{totalProductsCount}</strong>
                <span className="modern-kpi-subtext">Active showroom catalog</span>
              </div>

              {/* Card 6: Enquiries */}
              <div className="kpi-modern-card">
                <div className="modern-kpi-icon-wrap teal">
                  <Users size={22} />
                </div>
                <span className="modern-kpi-title">Enquiries</span>
                <strong className="modern-kpi-value">{totalEnquiriesCount + 44}</strong>
                <span className="modern-kpi-subtext">{enquiries.filter(e => e.status === 'New').length || 4} new leads today</span>
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
                  <h4>Recent Orders &amp; Invoices</h4>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button 
                      type="button"
                      className="view-all-link-btn"
                      onClick={() => { setActiveTab('invoices'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      title="View all customer tax invoices"
                    >
                      All Invoices ({orders.length}) <ArrowRight size={14} />
                    </button>
                    <button 
                      type="button"
                      className="view-all-link-btn"
                      onClick={() => { setActiveTab('orders'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      title="View orders management"
                      style={{ color: '#64748b' }}
                    >
                      Orders <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

                {/* Desktop Table View */}
                <div className="admin-table-wrap dashboard-table-desktop">
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

                {/* Mobile Responsive Order Cards List (shows on <= 768px) */}
                <div className="dashboard-mobile-cards-list">
                  {orders.slice(0, 5).map((ord) => (
                    <div key={ord.id} className="dash-mob-order-card">
                      <div className="dash-mob-card-top">
                        <div className="dash-mob-id-block">
                          <strong className="dash-mob-id">#{ord.id}</strong>
                          <span className="dash-mob-date">{ord.date?.split(',')[0] || 'Today'}</span>
                        </div>
                        <span className={`status-pill-badge ${ord.status.toLowerCase().replace(/\s+/g, '-')}`}>
                          {ord.status}
                        </span>
                      </div>

                      <div className="dash-mob-card-mid">
                        <span className="dash-mob-cust-name">👤 {ord.customer?.name || 'Customer'}</span>
                        <div className="dash-mob-product-name">
                          📦 {ord.items?.[0]?.name || 'Home Furniture'}
                          {ord.items?.length > 1 && <span className="dash-mob-more-badge">+{ord.items.length - 1} more</span>}
                        </div>
                      </div>

                      <div className="dash-mob-card-bot">
                        <div className="dash-mob-amount-wrap">
                          <span className="dash-mob-amount-label">Amount</span>
                          <strong className="dash-mob-amount">{formatPrice(ord.total)}</strong>
                        </div>
                        <button
                          type="button"
                          className="dash-mob-print-btn"
                          onClick={() => onViewInvoice && onViewInvoice(ord)}
                          title="Print / View Tax Invoice"
                        >
                          <Printer size={14} /> View Invoice
                        </button>
                      </div>
                    </div>
                  ))}
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

                {/* Desktop Table View */}
                <div className="admin-table-wrap dashboard-table-desktop">
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

                {/* Mobile Responsive Enquiry Cards List */}
                <div className="dashboard-mobile-cards-list">
                  {enquiries.slice(0, 4).map((enq) => (
                    <div key={enq.id} className="dash-mob-enquiry-card">
                      <div className="dash-mob-card-top">
                        <strong className="dash-mob-cust-name">{enq.name}</strong>
                        <span className="dash-mob-date">{enq.date}</span>
                      </div>
                      <div className="dash-mob-card-mid">
                        <span className="dash-mob-product-name">Interested in: <strong>{enq.product}</strong></span>
                        <small className="dash-mob-phone">📞 {enq.contact}</small>
                      </div>
                      <div className="dash-mob-card-bot">
                        <a
                          href={`https://wa.me/${enq.contact.replace(/\D/g, '')}?text=Hi%20${enq.name}%2C%20thank%20you%20for%20your%20enquiry%20regarding%20${enq.product}.`}
                          target="_blank"
                          rel="noreferrer"
                          className="table-whatsapp-reply-btn"
                          style={{ width: '100%', justifyContent: 'center' }}
                        >
                          <MessageCircle size={14} /> Reply on WhatsApp
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: INVOICES DIRECTORY (Dashboard > Invoices) */}
        {activeTab === 'invoices' && (
          <div className="admin-subpage-card animate-fade-in">
            {/* Breadcrumb Header */}
            <div className="admin-breadcrumb-bar">
              <button 
                type="button" 
                className="admin-breadcrumb-link"
                onClick={() => { setActiveTab('dashboard'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              >
                <LayoutDashboard size={14} /> Dashboard
              </button>
              <span className="admin-breadcrumb-sep">&gt;</span>
              <span className="admin-breadcrumb-current">
                <FileText size={14} /> Invoices
              </span>
            </div>

            <div className="subpage-header-row">
              <div>
                <h3>Tax Invoices &amp; Billing Directory</h3>
                <p>Manage all customer tax invoices, review GST breakdown, and print or download official receipts.</p>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="add-quick-product-btn"
                  onClick={() => { setActiveTab('create-billing'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                    boxShadow: '0 4px 14px rgba(109, 40, 217, 0.35)',
                    gap: '8px'
                  }}
                >
                  <Plus size={16} /> Create New Bill
                </button>
              </div>
            </div>

            {/* Invoices KPI Quick Stats */}
            <div className="invoices-kpi-grid">
              <div className="invoice-kpi-card">
                <div className="invoice-kpi-icon violet">
                  <FileText size={18} />
                </div>
                <div>
                  <span className="invoice-kpi-label">Total Invoices</span>
                  <strong className="invoice-kpi-val">{orders.length}</strong>
                </div>
              </div>

              <div className="invoice-kpi-card">
                <div className="invoice-kpi-icon emerald">
                  <IndianRupee size={18} />
                </div>
                <div>
                  <span className="invoice-kpi-label">Total Invoiced</span>
                  <strong className="invoice-kpi-val">
                    {formatPrice(orders.reduce((sum, o) => sum + (o.total || 0), 0))}
                  </strong>
                </div>
              </div>

              <div className="invoice-kpi-card">
                <div className="invoice-kpi-icon green">
                  <CheckCircle size={18} />
                </div>
                <div>
                  <span className="invoice-kpi-label">Paid Invoices</span>
                  <strong className="invoice-kpi-val">
                    {orders.filter(o => (o.paymentStatus || 'Paid') === 'Paid' && !o.paymentMethod?.toLowerCase().includes('cod')).length}
                  </strong>
                </div>
              </div>

              <div className="invoice-kpi-card">
                <div className="invoice-kpi-icon amber">
                  <Clock size={18} />
                </div>
                <div>
                  <span className="invoice-kpi-label">COD / Pending</span>
                  <strong className="invoice-kpi-val">
                    {orders.filter(o => o.paymentStatus === 'Pending' || o.paymentMethod?.toLowerCase().includes('cod')).length}
                  </strong>
                </div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="subpage-filters-bar">
              <div className="filter-search-box">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search by Invoice #, Customer Name, Mobile, or Product..."
                  value={invoiceSearch}
                  onChange={(e) => setInvoiceSearch(e.target.value)}
                  aria-label="Search Invoices"
                />
                {invoiceSearch && (
                  <button 
                    type="button" 
                    className="clear-search-btn" 
                    onClick={() => setInvoiceSearch('')}
                    title="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <div className={`filter-dropdown-wrap ${invoicePaymentFilter !== 'all' ? 'active' : ''}`} title="Filter by Payment Status">
                <CreditCard size={16} />
                <select
                  value={invoicePaymentFilter}
                  onChange={(e) => setInvoicePaymentFilter(e.target.value)}
                  aria-label="Filter Payment Status"
                >
                  <option value="all">Payment</option>
                  <option value="Paid">🟢 Paid / Verified</option>
                  <option value="Pending">🟡 Pending Verification</option>
                  <option value="Assembly">🟠 Pay on Assembly (COD)</option>
                  <option value="EMI">🔵 EMI Pre-Approved</option>
                  <option value="Failed">🔴 Payment Failed</option>
                  <option value="Refunded">🟣 Refunded</option>
                </select>
                {invoicePaymentFilter !== 'all' && <span className="filter-active-dot" />}
              </div>

              <div className={`filter-dropdown-wrap ${invoiceDeliveryFilter !== 'all' ? 'active' : ''}`} title="Filter by Delivery Status">
                <Filter size={16} />
                <select
                  value={invoiceDeliveryFilter}
                  onChange={(e) => setInvoiceDeliveryFilter(e.target.value)}
                  aria-label="Filter Delivery Status"
                >
                  <option value="all">Delivery</option>
                  <option value="Order Placed">Order Placed</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Packed">Packed</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                {invoiceDeliveryFilter !== 'all' && <span className="filter-active-dot" />}
              </div>
            </div>

            {/* Desktop & Laptop Responsive Table */}
            <div className="admin-table-wrap invoices-table-desktop">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>Date &amp; Time</th>
                    <th>Customer</th>
                    <th>Items Billed</th>
                    <th>Taxable + GST (18%)</th>
                    <th>Total Billed</th>
                    <th>Payment</th>
                    <th>Delivery</th>
                    <th style={{ textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders
                    .filter((ord) => {
                      const q = invoiceSearch.toLowerCase().trim();
                      const matchSearch = !q || 
                        (ord.id && ord.id.toLowerCase().includes(q)) ||
                        (ord.customer?.name && ord.customer.name.toLowerCase().includes(q)) ||
                        (ord.customer?.phone && ord.customer.phone.includes(q)) ||
                        (ord.customer?.email && ord.customer.email.toLowerCase().includes(q)) ||
                        (ord.items && ord.items.some(i => i.name && i.name.toLowerCase().includes(q)));
                      
                      const payment = ord.paymentStatus || (ord.paymentMethod?.toLowerCase().includes('cod') ? 'Assembly' : 'Paid');
                      const matchPayment = invoicePaymentFilter === 'all' || 
                        payment.toLowerCase().includes(invoicePaymentFilter.toLowerCase()) ||
                        (ord.paymentMethod && ord.paymentMethod.toLowerCase().includes(invoicePaymentFilter.toLowerCase()));

                      const matchDelivery = invoiceDeliveryFilter === 'all' || 
                        (ord.status && ord.status.toLowerCase() === invoiceDeliveryFilter.toLowerCase());

                      return matchSearch && matchPayment && matchDelivery;
                    })
                    .map((ord) => {
                      const taxable = Math.round((ord.total || 0) / 1.18);
                      const gstTotal = (ord.total || 0) - taxable;
                      const isPaid = (ord.paymentStatus || 'Paid') === 'Paid' && !ord.paymentMethod?.toLowerCase().includes('cod');
                      return (
                        <tr key={ord.id}>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <strong style={{ color: '#4c1d95', fontSize: '0.88rem' }}>#{ord.id}</strong>
                              <small style={{ color: '#64748b', fontSize: '0.72rem' }}>INV-{ord.id?.replace(/^HK-/i, '')}</small>
                            </div>
                          </td>
                          <td>
                            <small style={{ color: '#334155', fontWeight: 600 }}>{ord.date || 'Today'}</small>
                          </td>
                          <td>
                            <div className="table-customer-cell">
                              <strong>{ord.customer?.name || 'Walk-In Customer'}</strong>
                              <small>{ord.customer?.phone || 'No phone'}</small>
                              {ord.customer?.city && <small style={{ color: '#94a3b8' }}>📍 {ord.customer.city}</small>}
                            </div>
                          </td>
                          <td>
                            <div className="table-items-cell">
                              {ord.items?.map((it, idx) => (
                                <span key={idx} className="table-item-chip" title={`${it.name} (Qty: ${it.quantity})`}>
                                  {it.name} (x{it.quantity})
                                </span>
                              ))}
                            </div>
                          </td>
                          <td>
                            <div style={{ fontSize: '0.8rem' }}>
                              <div>Taxable: <strong>{formatPrice(taxable)}</strong></div>
                              <small style={{ color: '#64748b' }}>GST (18%): {formatPrice(gstTotal)}</small>
                            </div>
                          </td>
                          <td>
                            <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>{formatPrice(ord.total)}</strong>
                          </td>
                          <td>
                            <span className={`payment-pill ${isPaid ? 'paid' : (ord.paymentStatus || 'pending').toLowerCase()}`}>
                              {ord.paymentStatus || (ord.paymentMethod?.toLowerCase().includes('cod') ? 'Pay on COD' : 'Paid')}
                            </span>
                          </td>
                          <td>
                            <span className={`status-pill-badge ${(ord.status || 'Confirmed').toLowerCase().replace(/\s+/g, '-')}`}>
                              {ord.status || 'Confirmed'}
                            </span>
                          </td>
                          <td>
                            <div className="table-actions-group" style={{ justifyContent: 'center' }}>
                              <button
                                type="button"
                                className="table-action-icon-btn invoice"
                                onClick={() => onViewInvoice && onViewInvoice(ord)}
                                title="Print / View Official Tax Invoice"
                              >
                                <Printer size={15} />
                              </button>
                              <button
                                type="button"
                                className="table-action-icon-btn"
                                onClick={() => handleDownloadInvoiceHtml(ord)}
                                title="Download Tax Invoice HTML"
                                style={{ background: '#f8fafc', color: '#475569' }}
                              >
                                <Download size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            {/* Mobile Invoices Cards View (Visible on screens <= 768px) */}
            <div className="invoices-mobile-cards-list">
              {orders
                .filter((ord) => {
                  const q = invoiceSearch.toLowerCase().trim();
                  const matchSearch = !q || 
                    (ord.id && ord.id.toLowerCase().includes(q)) ||
                    (ord.customer?.name && ord.customer.name.toLowerCase().includes(q)) ||
                    (ord.customer?.phone && ord.customer.phone.includes(q)) ||
                    (ord.customer?.email && ord.customer.email.toLowerCase().includes(q)) ||
                    (ord.items && ord.items.some(i => i.name && i.name.toLowerCase().includes(q)));
                  
                  const payment = ord.paymentStatus || (ord.paymentMethod?.toLowerCase().includes('cod') ? 'Assembly' : 'Paid');
                  const matchPayment = invoicePaymentFilter === 'all' || 
                    payment.toLowerCase().includes(invoicePaymentFilter.toLowerCase()) ||
                    (ord.paymentMethod && ord.paymentMethod.toLowerCase().includes(invoicePaymentFilter.toLowerCase()));

                  const matchDelivery = invoiceDeliveryFilter === 'all' || 
                    (ord.status && ord.status.toLowerCase() === invoiceDeliveryFilter.toLowerCase());

                  return matchSearch && matchPayment && matchDelivery;
                })
                .map((ord) => {
                  const taxable = Math.round((ord.total || 0) / 1.18);
                  const gstTotal = (ord.total || 0) - taxable;
                  const isPaid = (ord.paymentStatus || 'Paid') === 'Paid' && !ord.paymentMethod?.toLowerCase().includes('cod');
                  return (
                    <div key={ord.id} className="invoice-mobile-card">
                      <div className="inv-mob-card-head">
                        <div className="inv-mob-id-block">
                          <span className="inv-mob-num">#{ord.id}</span>
                          <span className="inv-mob-date">{ord.date || 'Today'}</span>
                        </div>
                        <div className="inv-mob-badges">
                          <span className={`payment-pill ${isPaid ? 'paid' : (ord.paymentStatus || 'pending').toLowerCase()}`}>
                            {ord.paymentStatus || (ord.paymentMethod?.toLowerCase().includes('cod') ? 'Pay on COD' : 'Paid')}
                          </span>
                          <span className={`status-pill-badge ${(ord.status || 'Confirmed').toLowerCase().replace(/\s+/g, '-')}`}>
                            {ord.status || 'Confirmed'}
                          </span>
                        </div>
                      </div>

                      <div className="inv-mob-customer-row">
                        <div className="inv-mob-cust-info">
                          <strong>{ord.customer?.name || 'Walk-In Customer'}</strong>
                          {ord.customer?.phone && (
                            <a href={`tel:${ord.customer.phone}`} className="inv-mob-phone-link">
                              📞 {ord.customer.phone}
                            </a>
                          )}
                        </div>
                        {ord.customer?.city && (
                          <span className="inv-mob-city">📍 {ord.customer.city}</span>
                        )}
                      </div>

                      <div className="inv-mob-items-summary">
                        <span className="inv-mob-items-count">{ord.items?.length || 0} Items Billed:</span>
                        <div className="inv-mob-chips-wrap">
                          {ord.items?.map((it, idx) => (
                            <span key={idx} className="table-item-chip">
                              {it.name} (×{it.quantity})
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="inv-mob-financials-bar">
                        <div className="inv-mob-tax-meta">
                          <span>Taxable: {formatPrice(taxable)}</span>
                          <small>GST (18%): {formatPrice(gstTotal)}</small>
                        </div>
                        <div className="inv-mob-total-val">
                          <span>Total</span>
                          <strong>{formatPrice(ord.total)}</strong>
                        </div>
                      </div>

                      <div className="inv-mob-actions-row">
                        <button
                          type="button"
                          className="inv-mob-action-btn primary"
                          onClick={() => onViewInvoice && onViewInvoice(ord)}
                        >
                          <Printer size={15} /> Print Invoice
                        </button>
                        <button
                          type="button"
                          className="inv-mob-action-btn secondary"
                          onClick={() => handleDownloadInvoiceHtml(ord)}
                        >
                          <Download size={15} /> Download
                        </button>
                      </div>
                    </div>
                  );
                })}
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
                  aria-label="Search products"
                />
                {productSearch && (
                  <button 
                    className="clear-search-btn" 
                    onClick={() => setProductSearch('')}
                    title="Clear search"
                    type="button"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <div className={`filter-dropdown-wrap ${productCatFilter !== 'all' ? 'active' : ''}`} title="Filter by Category">
                <Filter size={16} />
                <select
                  value={productCatFilter}
                  onChange={(e) => setProductCatFilter(e.target.value)}
                  aria-label="Filter by Category"
                >
                  <option value="all">Category</option>
                  <option value="furniture">Furniture</option>
                  <option value="electronics">Electronics</option>
                  <option value="appliances">Appliances</option>
                </select>
                {productCatFilter !== 'all' && <span className="filter-active-dot" />}
              </div>

              <div className="filter-stats-badge">
                Showing {products.filter((p) => {
                  const matchCat = productCatFilter === 'all' || p.category === productCatFilter;
                  const matchSearch = productSearch === '' || 
                    p.name.toLowerCase().includes(productSearch.toLowerCase());
                  return matchCat && matchSearch;
                }).length} Products
              </div>
            </div>

            {/* Touch/Swipe Scroll Hint for Tablets and Laptops */}
            <div className="table-scroll-hint-bar">
              <span>⇄ Swipe horizontally to inspect complete catalog data</span>
            </div>

            {/* Desktop & Laptop Responsive Table */}
            <div className="admin-table-wrap product-table-desktop">
              <table className="admin-table product-data-table">
                <thead>
                  <tr>
                    <th style={{ minWidth: '280px' }}>Item</th>
                    <th style={{ minWidth: '110px' }}>Category</th>
                    <th style={{ minWidth: '120px', textAlign: 'right' }}>Selling Price</th>
                    <th style={{ minWidth: '120px', textAlign: 'right' }}>Original MRP</th>
                    <th style={{ minWidth: '95px', textAlign: 'center' }}>Discount</th>
                    <th style={{ minWidth: '110px', textAlign: 'center' }}>Badge</th>
                    <th style={{ minWidth: '95px', textAlign: 'center' }}>Status</th>
                    <th style={{ minWidth: '100px', textAlign: 'center' }}>Actions</th>
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
                      <tr key={item.id} className="product-table-row">
                        <td>
                          <div className="product-table-item-cell">
                            <div className="product-thumb-container">
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="product-thumb-sm"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=150&q=80';
                                }} 
                              />
                            </div>
                            <div className="product-item-text-info">
                              <span className="product-item-title-text" title={item.name}>{item.name}</span>
                              <div className="product-item-id-row">
                                <span className="product-id-badge">ID: {item.id}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="category-pill-tag">{item.category}</span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <strong className="selling-price-text">{formatPrice(item.price)}</strong>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <span className="text-strike">{formatPrice(item.originalPrice || item.price * 1.25)}</span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span className="discount-tag">{item.discount || 20}% OFF</span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          {item.badge ? (
                            <span className="badge-promo-pill">{item.badge}</span>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span className="in-stock-badge">In Stock</span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <div className="table-actions-group" style={{ justifyContent: 'center' }}>
                            <button
                              className="table-action-icon-btn edit"
                              onClick={() => setEditingProduct(item)}
                              title="Edit Product"
                              aria-label={`Edit ${item.name}`}
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
                              aria-label={`Delete ${item.name}`}
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

            {/* Mobile Product Cards View (Visible on screens <= 768px) */}
            <div className="products-mobile-cards-list">
              {products
                .filter((p) => {
                  const matchCat = productCatFilter === 'all' || p.category === productCatFilter;
                  const matchSearch = productSearch === '' || 
                    p.name.toLowerCase().includes(productSearch.toLowerCase());
                  return matchCat && matchSearch;
                })
                .map((item) => (
                  <div key={item.id} className="product-mobile-card">
                    <div className="pm-card-header">
                      <div className="pm-card-thumb-wrap">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="pm-card-thumb"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=150&q=80';
                          }}
                        />
                      </div>
                      <div className="pm-card-meta">
                        <div className="pm-card-badges-top">
                          <span className="category-pill-tag">{item.category}</span>
                          {item.badge && <span className="badge-promo-pill">{item.badge}</span>}
                          <span className="in-stock-badge">In Stock</span>
                        </div>
                        <h4 className="pm-card-title">{item.name}</h4>
                        <span className="product-id-badge">ID: {item.id}</span>
                      </div>
                    </div>

                    <div className="pm-card-pricing-row">
                      <div className="pm-price-box">
                        <span className="pm-label">Selling Price</span>
                        <strong className="pm-val-selling">{formatPrice(item.price)}</strong>
                      </div>
                      <div className="pm-price-box">
                        <span className="pm-label">Original MRP</span>
                        <span className="text-strike">{formatPrice(item.originalPrice || item.price * 1.25)}</span>
                      </div>
                      <div className="pm-price-box">
                        <span className="pm-label">Discount</span>
                        <span className="discount-tag">{item.discount || 20}% OFF</span>
                      </div>
                    </div>

                    <div className="pm-card-actions-row">
                      <button
                        className="pm-card-btn edit"
                        onClick={() => setEditingProduct(item)}
                      >
                        <Edit3 size={15} /> Edit Product
                      </button>
                      <button
                        className="pm-card-btn delete"
                        onClick={() => {
                          if (window.confirm(`Delete "${item.name}" from catalog?`)) {
                            onDeleteProduct && onDeleteProduct(item.id);
                            showToast('Product removed');
                          }
                        }}
                      >
                        <Trash2 size={15} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB: SHOWROOM POS / CREATE BILLING & TAX INVOICE */}
        {activeTab === 'create-billing' && (
          <div className="admin-subpage-card animate-fade-in pos-billing-screen">
            {/* Header */}
            <div className="subpage-header-row">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ 
                    background: '#f5f3ff', 
                    color: '#7c3aed', 
                    padding: '3px 10px', 
                    borderRadius: '8px', 
                    fontSize: '0.75rem', 
                    fontWeight: 800,
                    letterSpacing: '0.5px' 
                  }}>
                    SHOWROOM POS
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                    Tax Invoice Generator
                  </span>
                </div>
                <h3>Create New Bill &amp; Tax Invoice</h3>
                <p>Instant showroom checkout for walk-in clients, phone orders, and direct sales settlement.</p>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={handleResetBillingForm}
                  style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <RefreshCw size={14} /> Clear Form
                </button>
                <button
                  type="button"
                  className="btn-confirm"
                  onClick={() => { setActiveTab('orders'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{ background: '#334155', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <ShoppingCart size={15} /> View Orders ({orders.length})
                </button>
              </div>
            </div>

            {/* Top Section: Customer Information (Full Width Card) */}
            <div className="pos-card-box pos-customer-top-card">
              <div className="pos-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={18} style={{ color: '#7c3aed' }} />
                  <h4>Customer Information</h4>
                </div>

                {/* Mode Toggle */}
                <div className="pos-mode-toggle">
                  <button
                    type="button"
                    className={`pos-mode-btn ${billingCustomerMode === 'existing' ? 'active' : ''}`}
                    onClick={() => setBillingCustomerMode('existing')}
                  >
                    Existing Client
                  </button>
                  <button
                    type="button"
                    className={`pos-mode-btn ${billingCustomerMode === 'new' ? 'active' : ''}`}
                    onClick={() => {
                      setBillingCustomerMode('new');
                      setSelectedCustomerId('');
                      setBillingCustomer({
                        name: '',
                        phone: '',
                        email: '',
                        address: '',
                        city: 'Chennai',
                        pincode: '600001'
                      });
                    }}
                  >
                    + Walk-In / New
                  </button>
                </div>
              </div>

              {billingCustomerMode === 'existing' ? (
                <div className="pos-existing-client-picker">
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                      Choose Existing Customer from Directory:
                    </label>
                    <select
                      className="pos-input-select"
                      value={selectedCustomerId}
                      onChange={(e) => handleSelectCustomerForBilling(e.target.value)}
                    >
                      <option value="">-- Select Customer Profile ({allCustomers.length} Available) --</option>
                      {allCustomers.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.phone}) • {c.tier}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Customer Details Inputs (editable preview) */}
                  <div className="pos-customer-compact-grid">
                    <div className="pos-form-field">
                      <label>Customer Full Name *</label>
                      <input
                        type="text"
                        placeholder="Customer Name"
                        value={billingCustomer.name}
                        onChange={(e) => setBillingCustomer(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="pos-form-field">
                      <label>Phone Number *</label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={billingCustomer.phone}
                        onChange={(e) => setBillingCustomer(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    <div className="pos-form-field">
                      <label>Billing &amp; Delivery Address</label>
                      <input
                        type="text"
                        placeholder="Plot / Flat / Street address"
                        value={billingCustomer.address}
                        onChange={(e) => setBillingCustomer(prev => ({ ...prev, address: e.target.value }))}
                      />
                    </div>
                    <div className="pos-form-field">
                      <label>City &amp; Pincode</label>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <input
                          type="text"
                          placeholder="Chennai"
                          value={billingCustomer.city}
                          onChange={(e) => setBillingCustomer(prev => ({ ...prev, city: e.target.value }))}
                          style={{ flex: 1.2 }}
                        />
                        <input
                          type="text"
                          placeholder="600001"
                          value={billingCustomer.pincode}
                          onChange={(e) => setBillingCustomer(prev => ({ ...prev, pincode: e.target.value }))}
                          style={{ flex: 1 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="pos-customer-compact-grid">
                  <div className="pos-form-field">
                    <label>Customer Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Anandha Krishnan"
                      value={billingCustomer.name}
                      onChange={(e) => setBillingCustomer(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="pos-form-field">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      placeholder="+91 98400 12345"
                      value={billingCustomer.phone}
                      onChange={(e) => setBillingCustomer(prev => ({ ...prev, phone: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="pos-form-field">
                    <label>Billing &amp; Delivery Address</label>
                    <input
                      type="text"
                      placeholder="Door No, Street Name, Area (or Walk-In)"
                      value={billingCustomer.address}
                      onChange={(e) => setBillingCustomer(prev => ({ ...prev, address: e.target.value }))}
                    />
                  </div>
                  <div className="pos-form-field">
                    <label>City &amp; Pincode</label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <input
                        type="text"
                        placeholder="Chennai"
                        value={billingCustomer.city}
                        onChange={(e) => setBillingCustomer(prev => ({ ...prev, city: e.target.value }))}
                        style={{ flex: 1.2 }}
                      />
                      <input
                        type="text"
                        placeholder="600044"
                        value={billingCustomer.pincode}
                        onChange={(e) => setBillingCustomer(prev => ({ ...prev, pincode: e.target.value }))}
                        style={{ flex: 1 }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 2-Column POS Layout: Left = Product Catalog, Right = Bill & Settlement (Sticky) */}
            <div className="pos-billing-layout-grid">
              {/* Left Column: Showroom Product Picker */}
              <div className="pos-col-left pos-col-catalog">
                <div className="pos-card-box">
                  <div className="pos-card-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Package size={18} style={{ color: '#7c3aed' }} />
                      <h4>Select Products from Showroom Catalog</h4>
                    </div>

                    <button
                      type="button"
                      className="pos-custom-item-btn"
                      onClick={handleAddCustomLineItem}
                      title="Add Custom Line Item (Assembly, Polishing, Custom Work)"
                    >
                      <Plus size={14} /> Custom Item / Charge
                    </button>
                  </div>

                  {/* Filter & Search */}
                  <div className="pos-catalog-search-row">
                    <div className="filter-search-box" style={{ flex: 1, maxWidth: '100%' }}>
                      <Search size={16} />
                      <input
                        type="text"
                        placeholder="Search products by name, model or specs..."
                        value={billingProductSearch}
                        onChange={(e) => setBillingProductSearch(e.target.value)}
                      />
                    </div>

                    <div className="pos-category-pills-row">
                      {['all', 'furniture', 'electronics', 'appliances'].map(cat => (
                        <button
                          key={cat}
                          type="button"
                          className={`pos-cat-pill ${billingProductCat === cat ? 'active' : ''}`}
                          onClick={() => setBillingProductCat(cat)}
                        >
                          {cat === 'all' ? 'All Items' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Product Grid */}
                  <div className="pos-products-grid">
                    {products
                      .filter(p => {
                        const matchCat = billingProductCat === 'all' || p.category === billingProductCat;
                        const matchSearch = !billingProductSearch.trim() || 
                          p.name.toLowerCase().includes(billingProductSearch.toLowerCase()) ||
                          (p.category || '').toLowerCase().includes(billingProductSearch.toLowerCase());
                        return matchCat && matchSearch;
                      })
                      .slice(0, 12)
                      .map(p => {
                        const inBillItem = billingItems.find(it => it.id === p.id);
                        return (
                          <div key={p.id} className={`pos-product-item-card ${inBillItem ? 'selected' : ''}`}>
                            <div className="pos-prod-img-wrap">
                              <img src={p.image} alt={p.name} loading="lazy" />
                              <span className="pos-prod-cat-badge">{p.category}</span>
                            </div>
                            <div className="pos-prod-info">
                              <strong className="pos-prod-name" title={p.name}>{p.name}</strong>
                              <span className="pos-prod-price">{formatPrice(p.price)}</span>
                              {p.inStock !== false && <small className="pos-stock-tag">In Showroom Stock</small>}
                            </div>
                            <button
                              type="button"
                              className={`pos-add-btn ${inBillItem ? 'in-bill' : ''}`}
                              onClick={() => handleAddProductToBill(p)}
                            >
                              {inBillItem ? (
                                <>
                                  <Check size={14} /> Added (×{inBillItem.quantity})
                                </>
                              ) : (
                                <>
                                  <Plus size={14} /> Add to Bill
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>

              {/* Right Column: Bill Items Table, Calculations, Payment & Generate Actions (Sticky) */}
              <div className="pos-col-right pos-col-bill">
                {/* Card: Current Bill Items */}
                <div className="pos-card-box pos-summary-card">
                  <div className="pos-card-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ShoppingCart size={18} style={{ color: '#7c3aed' }} />
                      <h4>Bill Items ({billingItems.reduce((acc, it) => acc + it.quantity, 0)})</h4>
                    </div>
                    {billingItems.length > 0 && (
                      <button
                        type="button"
                        className="pos-clear-items-btn"
                        onClick={() => setBillingItems([])}
                      >
                        Remove All
                      </button>
                    )}
                  </div>

                  {/* Items List */}
                  {billingItems.length === 0 ? (
                    <div className="pos-empty-bill-state">
                      <ShoppingBag size={38} className="pos-empty-icon" />
                      <p><strong>No products in bill yet.</strong></p>
                      <small>Click &quot;+ Add to Bill&quot; from the catalog on the left to include products.</small>
                    </div>
                  ) : (
                    <div className="pos-bill-items-list">
                      {billingItems.map(item => (
                        <div key={item.id} className="pos-bill-item-row">
                          {item.image && (
                            <img src={item.image} alt={item.name} className="pos-bill-thumb" />
                          )}
                          <div className="pos-bill-item-details">
                            <span className="pos-item-title">{item.name}</span>
                            <span className="pos-item-rate">{formatPrice(item.price)} each</span>
                          </div>

                          {/* Quantity Controls */}
                          <div className="pos-qty-controls">
                            <button
                              type="button"
                              className="pos-qty-btn"
                              onClick={() => handleUpdateBillingItemQty(item.id, -1)}
                              title="Decrease Quantity"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="pos-qty-val">{item.quantity}</span>
                            <button
                              type="button"
                              className="pos-qty-btn"
                              onClick={() => handleUpdateBillingItemQty(item.id, 1)}
                              title="Increase Quantity"
                            >
                              <Plus size={13} />
                            </button>
                          </div>

                          <div className="pos-item-row-total">
                            <strong>{formatPrice(item.price * item.quantity)}</strong>
                          </div>

                          <button
                            type="button"
                            className="pos-item-del-btn"
                            onClick={() => handleRemoveBillingItem(item.id)}
                            title="Remove from Bill"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Calculations & Settlement */}
                  <div className="pos-calculations-box">
                    <div className="pos-calc-row">
                      <span>Subtotal ({billingItems.length} items):</span>
                      <strong>{formatPrice(billingSubtotal)}</strong>
                    </div>

                    <div className="pos-calc-row">
                      <span>Showroom Discount (₹):</span>
                      <div className="pos-inline-input-wrap">
                        <input
                          type="number"
                          min="0"
                          value={billingDiscount}
                          onChange={(e) => setBillingDiscount(Math.max(0, Number(e.target.value) || 0))}
                          className="pos-mini-num-input"
                        />
                      </div>
                    </div>

                    <div className="pos-calc-row">
                      <span>Delivery &amp; White-Glove Assembly:</span>
                      <div className="pos-inline-input-wrap">
                        <input
                          type="number"
                          min="0"
                          value={billingDeliveryFee}
                          onChange={(e) => setBillingDeliveryFee(Math.max(0, Number(e.target.value) || 0))}
                          className="pos-mini-num-input"
                        />
                      </div>
                    </div>

                    <div className="pos-grand-total-banner">
                      <div>
                        <span className="pos-total-label">Grand Total Payable</span>
                        <small className="pos-tax-note">Inclusive of all showroom taxes (GST)</small>
                      </div>
                      <strong className="pos-total-amount">{formatPrice(billingTotal)}</strong>
                    </div>
                  </div>

                  {/* Payment & Status Details */}
                  <div className="pos-payment-section">
                    <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '8px' }}>
                      Payment Method:
                    </label>
                    <div className="pos-payment-methods-grid">
                      {[
                        'UPI (GPay / PhonePe)',
                        'Credit / Debit Card',
                        'Cash at Counter',
                        'No-Cost EMI',
                        'Net Banking',
                        'Cash on Delivery'
                      ].map(method => (
                        <button
                          key={method}
                          type="button"
                          className={`pos-pay-opt-btn ${billingPaymentMethod === method ? 'active' : ''}`}
                          onClick={() => setBillingPaymentMethod(method)}
                        >
                          <CheckCircle size={13} className="pay-check-icon" />
                          <span>{method}</span>
                        </button>
                      ))}
                    </div>

                    <div className="pos-form-two-col" style={{ marginTop: '14px' }}>
                      <div className="pos-form-field">
                        <label>Payment Settlement Status</label>
                        <select
                          className="pos-input-select"
                          value={billingPaymentStatus}
                          onChange={(e) => setBillingPaymentStatus(e.target.value)}
                        >
                          <option value="Paid Online (Verified)">🟢 Paid Online (Verified)</option>
                          <option value="Paid Cash at Counter">🟢 Paid Cash at Counter</option>
                          <option value="Paid">🟢 Paid (General)</option>
                          <option value="Pending Verification">🟡 Pending Verification</option>
                          <option value="EMI Pre-Approved (Doorstep KYC)">🔵 EMI Pre-Approved</option>
                          <option value="Pending (Pay on Assembly)">🟠 Pay on Assembly (COD)</option>
                        </select>
                      </div>

                      <div className="pos-form-field">
                        <label>Delivery / Order Status</label>
                        <select
                          className="pos-input-select"
                          value={billingOrderStatus}
                          onChange={(e) => setBillingOrderStatus(e.target.value)}
                        >
                          <option value="Delivered">✅ Delivered (Immediate Handover)</option>
                          <option value="Confirmed">📦 Confirmed (Delivery Scheduled)</option>
                          <option value="Packed">🎁 Packed (Ready in Warehouse)</option>
                          <option value="Out for Delivery">🚚 Out for Delivery</option>
                          <option value="Order Placed">📝 Order Placed</option>
                        </select>
                      </div>
                    </div>

                    <div className="pos-form-field full" style={{ marginTop: '10px' }}>
                      <label>Showroom Bill Remarks / Invoice Notes</label>
                      <input
                        type="text"
                        placeholder="e.g. Complimentary cushions included, delivery scheduled Friday 11 AM"
                        value={billingNotes}
                        onChange={(e) => setBillingNotes(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Primary Generation Buttons */}
                  <div className="pos-actions-row">
                    <button
                      type="button"
                      className="pos-primary-submit-btn"
                      onClick={() => handleGenerateBillOrder(true)}
                      title="Save and automatically open the official Printable Tax Invoice"
                    >
                      <Printer size={18} />
                      <span>Generate Bill &amp; Print Tax Invoice</span>
                    </button>

                    <button
                      type="button"
                      className="pos-secondary-submit-btn"
                      onClick={() => handleGenerateBillOrder(false)}
                      title="Save to Orders without printing"
                    >
                      <Check size={16} /> Save Bill to Orders
                    </button>
                  </div>
                </div>
              </div>
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
              <button
                type="button"
                className="add-quick-product-btn"
                onClick={() => { setActiveTab('create-billing'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                style={{
                  background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                  boxShadow: '0 4px 14px rgba(109, 40, 217, 0.35)',
                  gap: '8px'
                }}
              >
                <Plus size={16} /> Create New Bill
              </button>
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

              <div className={`filter-dropdown-wrap ${orderStatusFilter !== 'all' ? 'active' : ''}`} title="Filter by Delivery Status">
                <Filter size={16} />
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  aria-label="Filter Delivery Status"
                >
                  <option value="all">Delivery</option>
                  <option value="Order Placed">Order Placed</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Packed">Packed</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                {orderStatusFilter !== 'all' && <span className="filter-active-dot" />}
              </div>

              <div className={`filter-dropdown-wrap ${paymentStatusFilter !== 'all' ? 'active' : ''}`} title="Filter by Payment Status">
                <CreditCard size={16} />
                <select
                  value={paymentStatusFilter}
                  onChange={(e) => setPaymentStatusFilter(e.target.value)}
                  aria-label="Filter Payment Status"
                >
                  <option value="all">Payment</option>
                  <option value="Paid">🟢 Paid / Verified</option>
                  <option value="Pending">🟡 Pending Verification</option>
                  <option value="Assembly">🟠 Pay on Assembly (COD)</option>
                  <option value="EMI">🔵 EMI Pre-Approved</option>
                  <option value="Failed">🔴 Payment Failed</option>
                  <option value="Refunded">🟣 Refunded</option>
                </select>
                {paymentStatusFilter !== 'all' && <span className="filter-active-dot" />}
              </div>
            </div>

            {/* Desktop & Laptop Responsive Table */}
            <div className="admin-table-wrap orders-table-desktop">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer Details</th>
                    <th>Items</th>
                    <th>Total Amount</th>
                    <th>Payment &amp; Status</th>
                    <th>Live Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders
                    .filter((ord) => {
                      const matchStatus = orderStatusFilter === 'all' || ord.status === orderStatusFilter;
                      const matchPay = paymentStatusFilter === 'all' || 
                        (ord.paymentStatus || '').toLowerCase().includes(paymentStatusFilter.toLowerCase());
                      const term = orderSearch.toLowerCase();
                      const matchSearch = orderSearch === '' ||
                        ord.id.toLowerCase().includes(term) ||
                        (ord.customer?.name || '').toLowerCase().includes(term) ||
                        (ord.customer?.phone || '').includes(term);
                      return matchStatus && matchPay && matchSearch;
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
                          <div style={{ marginTop: '5px' }}>
                            <select
                              className="order-pay-status-select"
                              value={ord.paymentStatus || 'Paid Online (Verified)'}
                              onChange={(e) => {
                                const newStat = e.target.value;
                                if (onUpdatePaymentStatus) {
                                  onUpdatePaymentStatus(ord.id, newStat);
                                } else if (onEditOrder) {
                                  onEditOrder(ord.id, { ...ord, paymentStatus: newStat });
                                }
                                showToast(`Order #${ord.id} Payment Status: ${newStat}`);
                              }}
                              title="Click to update payment status"
                            >
                              <option value="Paid Online (Verified)">🟢 Paid Online (Verified)</option>
                              <option value="Paid">🟢 Paid</option>
                              <option value="Pending Verification">🟡 Pending Verification</option>
                              <option value="Pending (Pay on Assembly)">🟠 Pending (Pay on Assembly)</option>
                              <option value="EMI Pre-Approved (Doorstep KYC)">🔵 EMI Pre-Approved</option>
                              <option value="Payment Failed">🔴 Payment Failed</option>
                              <option value="Refunded">🟣 Refunded</option>
                            </select>
                          </div>
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

            {/* Mobile Orders Cards View (Visible on screens <= 768px) */}
            <div className="orders-mobile-cards-list">
              {orders
                .filter((ord) => {
                  const matchStatus = orderStatusFilter === 'all' || ord.status === orderStatusFilter;
                  const matchPay = paymentStatusFilter === 'all' || 
                    (ord.paymentStatus || '').toLowerCase().includes(paymentStatusFilter.toLowerCase());
                  const term = orderSearch.toLowerCase();
                  const matchSearch = orderSearch === '' ||
                    ord.id.toLowerCase().includes(term) ||
                    (ord.customer?.name || '').toLowerCase().includes(term) ||
                    (ord.customer?.phone || '').includes(term);
                  return matchStatus && matchPay && matchSearch;
                })
                .map((ord) => (
                  <div key={ord.id} className="order-mobile-card">
                    <div className="ord-mob-head">
                      <div>
                        <span className="ord-mob-id">#{ord.id}</span>
                        <span className="ord-mob-date">{ord.date?.split(',')[0]}</span>
                      </div>
                      <strong className="ord-mob-total">{formatPrice(ord.total)}</strong>
                    </div>

                    <div className="ord-mob-cust">
                      <strong>{ord.customer?.name || 'Customer'}</strong>
                      {ord.customer?.phone && (
                        <a href={`tel:${ord.customer.phone}`} className="ord-mob-tel">
                          📞 {ord.customer.phone}
                        </a>
                      )}
                      {ord.customer?.address && (
                        <small className="ord-mob-addr">📍 {ord.customer.address}, {ord.customer.city}</small>
                      )}
                    </div>

                    <div className="ord-mob-items-box">
                      <span className="ord-mob-items-label">Items Billed:</span>
                      <div className="ord-mob-chips-wrap">
                        {ord.items?.map((it, idx) => (
                          <span key={idx} className="table-item-chip">
                            {it.name} (×{it.quantity})
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="ord-mob-status-controls">
                      <div className="ord-mob-select-field">
                        <label>Delivery Status</label>
                        <select
                          className={`status-selector-input ${(ord.status || 'Confirmed').toLowerCase().replace(/\s+/g, '-')}`}
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
                      </div>

                      <div className="ord-mob-select-field">
                        <label>Payment Settlement</label>
                        <select
                          className="order-pay-status-select"
                          value={ord.paymentStatus || 'Paid Online (Verified)'}
                          onChange={(e) => {
                            const newStat = e.target.value;
                            if (onUpdatePaymentStatus) {
                              onUpdatePaymentStatus(ord.id, newStat);
                            } else if (onEditOrder) {
                              onEditOrder(ord.id, { ...ord, paymentStatus: newStat });
                            }
                            showToast(`Order #${ord.id} Payment: ${newStat}`);
                          }}
                        >
                          <option value="Paid Online (Verified)">🟢 Paid Online</option>
                          <option value="Paid">🟢 Paid</option>
                          <option value="Pending Verification">🟡 Pending</option>
                          <option value="Pending (Pay on Assembly)">🟠 Pay on COD</option>
                          <option value="EMI Pre-Approved (Doorstep KYC)">🔵 EMI</option>
                          <option value="Payment Failed">🔴 Failed</option>
                          <option value="Refunded">🟣 Refunded</option>
                        </select>
                      </div>
                    </div>

                    <div className="ord-mob-actions-row">
                      <button
                        type="button"
                        className="ord-mob-act-btn invoice"
                        onClick={() => onViewInvoice && onViewInvoice(ord)}
                      >
                        <Printer size={15} /> Invoice
                      </button>
                      <button
                        type="button"
                        className="ord-mob-act-btn edit"
                        onClick={() => setEditingOrder(ord)}
                      >
                        <Edit3 size={15} /> Edit
                      </button>
                      <button
                        type="button"
                        className="ord-mob-act-btn delete"
                        onClick={() => {
                          if (window.confirm(`Delete order #${ord.id}?`)) {
                            onDeleteOrder && onDeleteOrder(ord.id);
                            showToast(`Order #${ord.id} deleted`);
                          }
                        }}
                      >
                        <Trash2 size={15} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
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
                          href={`https://wa.me/${enq.contact.replace(/\D/g, '')}?text=Hi%20${enq.name}%2C%20thank%20you%20for%20contacting%20Sardar%20Mart.`}
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

        {/* TAB: CUSTOMER DIRECTORY & CRM (Full customer details, addresses, spend, and WhatsApp) */}
        {activeTab === 'customers' && (
          <div className="admin-subpage-card animate-fade-in">
            {/* Subpage Header */}
            <div className="subpage-header-row">
              <div>
                <h3>Customer Directory &amp; CRM</h3>
                <p>Manage customer profiles, delivery addresses, order histories, lifetime value, and instant WhatsApp support.</p>
              </div>
              <div className="subpage-header-actions">
                <button
                  type="button"
                  className="admin-secondary-btn"
                  onClick={handleExportCustomers}
                  title="Download all customer details as CSV file"
                >
                  <Download size={15} />
                  <span>Export CSV</span>
                </button>
                <button
                  type="button"
                  className="admin-primary-btn"
                  onClick={() => setIsAddCustomerModalOpen(true)}
                  title="Register new walk-in or phone customer"
                >
                  <UserPlus size={15} />
                  <span>Add Customer</span>
                </button>
              </div>
            </div>

            {/* KPI Overview Cards */}
            <div className="customer-kpis-grid">
              <div className="customer-kpi-card">
                <div className="c-kpi-icon-wrap brown">
                  <Users size={22} />
                </div>
                <div className="c-kpi-data">
                  <span className="c-kpi-label">TOTAL CUSTOMERS</span>
                  <strong className="c-kpi-value">{allCustomers.length}</strong>
                  <span className="c-kpi-desc">Buyers &amp; Showroom Leads</span>
                </div>
              </div>

              <div className="customer-kpi-card">
                <div className="c-kpi-icon-wrap amber">
                  <IndianRupee size={22} />
                </div>
                <div className="c-kpi-data">
                  <span className="c-kpi-label">CUSTOMER LIFETIME VALUE</span>
                  <strong className="c-kpi-value">
                    {formatPrice(allCustomers.reduce((acc, c) => acc + (c.totalSpent || 0), 0))}
                  </strong>
                  <span className="c-kpi-desc">Cumulative Store Spend</span>
                </div>
              </div>

              <div className="customer-kpi-card">
                <div className="c-kpi-icon-wrap gold">
                  <Award size={22} />
                </div>
                <div className="c-kpi-data">
                  <span className="c-kpi-label">VIP &amp; CLUB MEMBERS</span>
                  <strong className="c-kpi-value">
                    {allCustomers.filter(c => c.tier.includes('VIP') || c.tier.includes('Gold')).length}
                  </strong>
                  <span className="c-kpi-desc">Spend &gt; ₹20,000 Threshold</span>
                </div>
              </div>

              <div className="customer-kpi-card">
                <div className="c-kpi-icon-wrap green">
                  <MessageCircle size={22} />
                </div>
                <div className="c-kpi-data">
                  <span className="c-kpi-label">WHATSAPP REACH</span>
                  <strong className="c-kpi-value">
                    {allCustomers.filter(c => c.phone).length}
                  </strong>
                  <span className="c-kpi-desc">Direct Messaging Ready</span>
                </div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="subpage-filters-bar">
              <div className="filter-search-box">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search by customer name, mobile, email, city, address, or ID..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                />
                {customerSearch && (
                  <button 
                    type="button" 
                    className="clear-search-btn" 
                    onClick={() => setCustomerSearch('')}
                    title="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <div className={`filter-dropdown-wrap ${customerFilter !== 'all' ? 'active' : ''}`} title="Filter by Customer Tier">
                <Filter size={16} />
                <select
                  value={customerFilter}
                  onChange={(e) => setCustomerFilter(e.target.value)}
                  aria-label="Filter Customer Tier"
                >
                  <option value="all">Tier</option>
                  <option value="vip">VIP Platinum (&gt;₹50K)</option>
                  <option value="gold">Gold Club (&gt;₹20K)</option>
                  <option value="buyers">Verified Buyers ({allCustomers.filter(c => c.orderCount > 0).length})</option>
                  <option value="leads">Showroom Leads ({allCustomers.filter(c => c.orderCount === 0).length})</option>
                </select>
                {customerFilter !== 'all' && <span className="filter-active-dot" />}
              </div>
            </div>

            {/* Customers Directory Table */}
            <div className="admin-table-wrap">
              <table className="admin-table customer-table">
                <thead>
                  <tr>
                    <th>Customer Name &amp; ID</th>
                    <th>Contact &amp; WhatsApp</th>
                    <th>Delivery Address</th>
                    <th>Orders &amp; Lifetime Spend</th>
                    <th>Loyalty Points</th>
                    <th>Membership Tier</th>
                    <th>Last Active</th>
                    <th style={{ textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allCustomers
                    .filter((cust) => {
                      // Filter by tier
                      if (customerFilter === 'vip' && cust.tier !== 'VIP Platinum') return false;
                      if (customerFilter === 'gold' && cust.tier !== 'Gold Club') return false;
                      if (customerFilter === 'buyers' && cust.orderCount === 0) return false;
                      if (customerFilter === 'leads' && cust.orderCount > 0) return false;

                      // Filter by search
                      if (!customerSearch.trim()) return true;
                      const q = customerSearch.toLowerCase();
                      return (
                        (cust.name || '').toLowerCase().includes(q) ||
                        (cust.phone || '').includes(q) ||
                        (cust.email || '').toLowerCase().includes(q) ||
                        (cust.city || '').toLowerCase().includes(q) ||
                        (cust.address || '').toLowerCase().includes(q) ||
                        (cust.pincode || '').includes(q) ||
                        (cust.id || '').toLowerCase().includes(q)
                      );
                    })
                    .map((cust) => {
                      const cleanPhone = cust.phone ? cust.phone.replace(/\D/g, '') : '';
                      const initials = cust.name
                        ? cust.name.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
                        : 'SM';

                      return (
                        <tr key={cust.id} className="customer-row">
                          <td>
                            <div className="customer-cell-main">
                              <div className="customer-avatar-badge" title={cust.name}>
                                {initials}
                              </div>
                              <div className="customer-text-meta">
                                <strong>{cust.name}</strong>
                                <span className="customer-sub-id">#{cust.id}</span>
                              </div>
                            </div>
                          </td>

                          <td>
                            <div className="customer-contact-cell">
                              <div className="c-contact-item">
                                <Phone size={13} className="text-muted" />
                                <span>{cust.phone || 'No phone'}</span>
                              </div>
                              {cust.email && (
                                <div className="c-contact-item email">
                                  <Mail size={13} className="text-muted" />
                                  <small>{cust.email}</small>
                                </div>
                              )}
                            </div>
                          </td>

                          <td>
                            <div className="customer-address-cell">
                              <div className="c-address-line">
                                <MapPin size={13} className="pin-icon" />
                                <span>{cust.address || 'Showroom Customer'}</span>
                              </div>
                              <small className="c-city-badge">
                                {cust.city || 'Chennai'} {cust.pincode ? `• ${cust.pincode}` : ''}
                              </small>
                            </div>
                          </td>

                          <td>
                            <div className="customer-spend-cell">
                              <strong className="c-spend-amount">{formatPrice(cust.totalSpent)}</strong>
                              <span className="c-orders-count-badge">
                                <ShoppingCart size={12} />
                                {cust.orderCount} Order{cust.orderCount !== 1 ? 's' : ''}
                              </span>
                            </div>
                          </td>

                          <td>
                            <div className="loyalty-pill">
                              <Sparkles size={12} />
                              <span>{cust.loyaltyPoints} Pts</span>
                            </div>
                          </td>

                          <td>
                            <span className={`customer-tier-badge ${cust.tier.toLowerCase().replace(/\s+/g, '-')}`}>
                              {cust.tier.includes('VIP') && <Award size={13} />}
                              {cust.tier}
                            </span>
                          </td>

                          <td>
                            <span className="customer-date-text">{cust.lastActive}</span>
                          </td>

                          <td>
                            <div className="table-actions-group" style={{ justifyContent: 'center' }}>
                              {/* WhatsApp Chat Button */}
                              {cust.phone && (
                                <a
                                  href={`https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(cust.name)}%2C%20greetings%20from%20Sardar%20Mart%20Furniture%20%26%20Electronics!%20How%20can%20we%20assist%20you%20today%3F`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="table-action-icon-btn whatsapp"
                                  title={`Chat with ${cust.name} on WhatsApp`}
                                >
                                  <MessageCircle size={15} />
                                </a>
                              )}

                              {/* Phone Call Button */}
                              {cust.phone && (
                                <a
                                  href={`tel:${cleanPhone}`}
                                  className="table-action-icon-btn call"
                                  title={`Call ${cust.phone}`}
                                >
                                  <Phone size={14} />
                                </a>
                              )}

                              {/* View Full Customer Details & Order History */}
                              <button
                                type="button"
                                className="table-action-icon-btn profile-view"
                                onClick={() => setSelectedCustomer(cust)}
                                title="View Customer Details & Full Order History"
                              >
                                <Eye size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>

              {allCustomers.filter((cust) => {
                if (customerFilter === 'vip' && cust.tier !== 'VIP Platinum') return false;
                if (customerFilter === 'gold' && cust.tier !== 'Gold Club') return false;
                if (customerFilter === 'buyers' && cust.orderCount === 0) return false;
                if (customerFilter === 'leads' && cust.orderCount > 0) return false;
                if (!customerSearch.trim()) return true;
                const q = customerSearch.toLowerCase();
                return (
                  (cust.name || '').toLowerCase().includes(q) ||
                  (cust.phone || '').includes(q) ||
                  (cust.email || '').toLowerCase().includes(q) ||
                  (cust.city || '').toLowerCase().includes(q) ||
                  (cust.address || '').toLowerCase().includes(q) ||
                  (cust.pincode || '').includes(q) ||
                  (cust.id || '').toLowerCase().includes(q)
                );
              }).length === 0 && (
                <div className="empty-results-box">
                  <Search size={36} className="empty-icon" />
                  <h4>No matching customer records found</h4>
                  <p>Try searching with another name, phone number, pincode, or reset your tier filter.</p>
                  <button
                    type="button"
                    className="admin-secondary-btn"
                    onClick={() => { setCustomerSearch(''); setCustomerFilter('all'); }}
                  >
                    Reset Search &amp; Filters
                  </button>
                </div>
              )}
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
                      placeholder="https://instagram.com/sardarmart"
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
                      placeholder="https://facebook.com/sardarmart"
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
                      placeholder="https://youtube.com/@sardarmart"
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

            {/* Sub-section 2: Live Website Feature & Module Toggles */}
            <div className="settings-section-panel">
              <div className="settings-section-head">
                <Sliders size={20} className="section-icon" />
                <div>
                  <h4>Website Features &amp; Module Toggles</h4>
                  <small>Turn live storefront features, tax badges, menus, and customer widgets ON or OFF instantly</small>
                </div>
              </div>

              <div className="feature-toggles-grid">
                {/* Toggle 1: GSTIN & Tax Registration Badge */}
                <div className="feature-toggle-card">
                  <div className="toggle-card-info">
                    <div className="toggle-card-title-row">
                      <ShieldCheck size={18} className="toggle-icon" />
                      <strong>Display GSTIN &amp; Tax Badges</strong>
                    </div>
                    <p>Show GSTIN number ({storeSettings.gstNumber || '33DVKPR2334L1Z9'}) and tax verification badges across footer, contact, and checkout.</p>
                  </div>
                  <label className="switch-toggle" htmlFor="toggle-gstin">
                    <input 
                      id="toggle-gstin"
                      type="checkbox" 
                      checked={!!storeSettings.showGstinBadge}
                      onChange={(e) => updateFeatureToggle('showGstinBadge', e.target.checked)}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>

                {/* Toggle 2: Billing & Tax Invoice Nav Menu */}
                <div className="feature-toggle-card">
                  <div className="toggle-card-info">
                    <div className="toggle-card-title-row">
                      <FileText size={18} className="toggle-icon" />
                      <strong>Billing &amp; Tax Invoice Menu</strong>
                    </div>
                    <p>Display "Billing &amp; Tax Invoice" link in the primary shop navigation bar and mobile drawer.</p>
                  </div>
                  <label className="switch-toggle" htmlFor="toggle-billing">
                    <input 
                      id="toggle-billing"
                      type="checkbox" 
                      checked={!!storeSettings.showBillingPage}
                      onChange={(e) => updateFeatureToggle('showBillingPage', e.target.checked)}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>

                {/* Toggle 3: Floating WhatsApp Button */}
                <div className="feature-toggle-card">
                  <div className="toggle-card-info">
                    <div className="toggle-card-title-row">
                      <MessageCircle size={18} className="toggle-icon" />
                      <strong>Floating WhatsApp Quick Chat</strong>
                    </div>
                    <p>Display the bottom-right green "Chat with Us" floating WhatsApp widget for instant customer inquiries.</p>
                  </div>
                  <label className="switch-toggle" htmlFor="toggle-whatsapp">
                    <input 
                      id="toggle-whatsapp"
                      type="checkbox" 
                      checked={storeSettings.showWhatsAppButton !== false}
                      onChange={(e) => updateFeatureToggle('showWhatsAppButton', e.target.checked)}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>

                {/* Toggle 4: Customer Order Tracking */}
                <div className="feature-toggle-card">
                  <div className="toggle-card-info">
                    <div className="toggle-card-title-row">
                      <Package size={18} className="toggle-icon" />
                      <strong>Order Tracking &amp; Invoices</strong>
                    </div>
                    <p>Allow customers to track dispatch progress, delivery stage, and view printable invoices using Order ID.</p>
                  </div>
                  <label className="switch-toggle" htmlFor="toggle-tracking">
                    <input 
                      id="toggle-tracking"
                      type="checkbox" 
                      checked={storeSettings.showOrderTracking !== false}
                      onChange={(e) => updateFeatureToggle('showOrderTracking', e.target.checked)}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>

                {/* Toggle 5: Customer Wishlist Module */}
                <div className="feature-toggle-card">
                  <div className="toggle-card-info">
                    <div className="toggle-card-title-row">
                      <Heart size={18} className="toggle-icon" />
                      <strong>Customer Wishlist Drawer</strong>
                    </div>
                    <p>Enable heart button saving, product bookmarking, and wishlist slide-out drawer for shoppers.</p>
                  </div>
                  <label className="switch-toggle" htmlFor="toggle-wishlist">
                    <input 
                      id="toggle-wishlist"
                      type="checkbox" 
                      checked={storeSettings.showWishlist !== false}
                      onChange={(e) => updateFeatureToggle('showWishlist', e.target.checked)}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>

                {/* Toggle 6: Announcement Bar & Offers */}
                <div className="feature-toggle-card">
                  <div className="toggle-card-info">
                    <div className="toggle-card-title-row">
                      <Sparkles size={18} className="toggle-icon" />
                      <strong>Top Announcement Bar &amp; Offers</strong>
                    </div>
                    <p>Display top notice marquee, festival coupon announcements, and the Offers &amp; Combos navigation item.</p>
                  </div>
                  <label className="switch-toggle" htmlFor="toggle-offers">
                    <input 
                      id="toggle-offers"
                      type="checkbox" 
                      checked={storeSettings.showOffersBanner !== false}
                      onChange={(e) => updateFeatureToggle('showOffersBanner', e.target.checked)}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>

                {/* Toggle 7: White-Glove Installation */}
                <div className="feature-toggle-card">
                  <div className="toggle-card-info">
                    <div className="toggle-card-title-row">
                      <Truck size={18} className="toggle-icon" />
                      <strong>White-Glove Doorstep Assembly</strong>
                    </div>
                    <p>Display technician installation, free doorstep setup, and unboxing warranty badges on product pages.</p>
                  </div>
                  <label className="switch-toggle" htmlFor="toggle-assembly">
                    <input 
                      id="toggle-assembly"
                      type="checkbox" 
                      checked={storeSettings.showWhiteGloveAssembly !== false}
                      onChange={(e) => updateFeatureToggle('showWhiteGloveAssembly', e.target.checked)}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>

                {/* Toggle 8: 0% Easy EMI Financing */}
                <div className="feature-toggle-card">
                  <div className="toggle-card-info">
                    <div className="toggle-card-title-row">
                      <IndianRupee size={18} className="toggle-icon" />
                      <strong>0% Easy EMI Financing Options</strong>
                    </div>
                    <p>Display monthly EMI estimates, credit card no-cost EMI tags, and financing plan details on products.</p>
                  </div>
                  <label className="switch-toggle" htmlFor="toggle-emi">
                    <input 
                      id="toggle-emi"
                      type="checkbox" 
                      checked={storeSettings.showEmiOptions !== false}
                      onChange={(e) => updateFeatureToggle('showEmiOptions', e.target.checked)}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>
            </div>

            {/* Sub-section 3: Customer Payment Modes & Payment Status Settings */}
            <div className="settings-section-panel">
              <div className="settings-section-head">
                <CreditCard size={20} className="section-icon" />
                <div>
                  <h4>Payment Modes &amp; Tax Settlement Settings</h4>
                  <small>Matches Customer Checkout Step 3: Configure payment gateway toggles, showroom UPI credentials, and order payment statuses</small>
                </div>
              </div>

              {/* 5 Payment Mode Cards matching the screenshot */}
              <div className="payment-settings-cards-grid">
                
                {/* 1. UPI Payment */}
                <div className={`payment-config-card ${storeSettings.paymentUpiEnabled !== false ? 'active-config' : 'inactive-config'}`}>
                  <div className="payment-config-header">
                    <div className="payment-config-title-wrap">
                      <div className="config-icon-circle upi">
                        <QrCode size={18} />
                      </div>
                      <div>
                        <strong>UPI Instant Payment (GPay / PhonePe / Paytm / BHIM)</strong>
                        <span className="pay-tag-badge green">{storeSettings.upiTag || 'Zero Transaction Fees'}</span>
                      </div>
                    </div>
                    <label className="switch-toggle" htmlFor="cfg-upi-enable">
                      <input 
                        id="cfg-upi-enable"
                        type="checkbox" 
                        checked={storeSettings.paymentUpiEnabled !== false}
                        onChange={(e) => updateFeatureToggle('paymentUpiEnabled', e.target.checked)}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  <div className="payment-config-body">
                    <div className="config-fields-two-col">
                      <div className="form-field-group">
                        <label>Verified Merchant Display Name</label>
                        <input 
                          type="text" 
                          value={storeSettings.upiMerchant || 'Sardar Mart'} 
                          onChange={(e) => setStoreSettings({ ...storeSettings, upiMerchant: e.target.value })}
                          placeholder="e.g. Sardar Mart"
                        />
                      </div>
                      <div className="form-field-group">
                        <label>Showroom UPI ID / VPA Address</label>
                        <input 
                          type="text" 
                          value={storeSettings.upiId || 'sardarmart@okaxis'} 
                          onChange={(e) => setStoreSettings({ ...storeSettings, upiId: e.target.value })}
                          placeholder="e.g. sardarmart@okaxis"
                        />
                      </div>
                    </div>
                    <div className="config-fields-two-col" style={{ marginTop: '10px' }}>
                      <div className="form-field-group">
                        <label>Default Payment Status for UPI Orders</label>
                        <select
                          value={storeSettings.upiDefaultStatus || 'Paid Online (Verified)'}
                          onChange={(e) => setStoreSettings({ ...storeSettings, upiDefaultStatus: e.target.value })}
                        >
                          <option value="Paid Online (Verified)">🟢 Paid Online (Verified) - Recommended</option>
                          <option value="Pending Verification">🟡 Pending Verification</option>
                          <option value="Manual Review">🟠 Manual Staff Review</option>
                        </select>
                      </div>
                      <div className="form-field-group">
                        <label>Showroom QR Code Scanner Display</label>
                        <select
                          value={storeSettings.upiShowQr !== false ? 'yes' : 'no'}
                          onChange={(e) => setStoreSettings({ ...storeSettings, upiShowQr: e.target.value === 'yes' })}
                        >
                          <option value="yes">Visible (Display Dynamic QR Code on Checkout)</option>
                          <option value="no">VPA Only (Hide QR Code Box)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Credit / Debit Card */}
                <div className={`payment-config-card ${storeSettings.paymentCardEnabled !== false ? 'active-config' : 'inactive-config'}`}>
                  <div className="payment-config-header">
                    <div className="payment-config-title-wrap">
                      <div className="config-icon-circle card">
                        <CreditCard size={18} />
                      </div>
                      <div>
                        <strong>Credit / Debit Card (Visa, MasterCard, RuPay)</strong>
                        <span className="pay-tag-badge blue">{storeSettings.cardSecurityBadge || '🔒 256-Bit SSL'}</span>
                      </div>
                    </div>
                    <label className="switch-toggle" htmlFor="cfg-card-enable">
                      <input 
                        id="cfg-card-enable"
                        type="checkbox" 
                        checked={storeSettings.paymentCardEnabled !== false}
                        onChange={(e) => updateFeatureToggle('paymentCardEnabled', e.target.checked)}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  <div className="payment-config-body">
                    <div className="config-fields-two-col">
                      <div className="form-field-group">
                        <label>Security &amp; Encryption Badge Text</label>
                        <input 
                          type="text" 
                          value={storeSettings.cardSecurityBadge || '100% Secure 256-Bit SSL'} 
                          onChange={(e) => setStoreSettings({ ...storeSettings, cardSecurityBadge: e.target.value })}
                        />
                      </div>
                      <div className="form-field-group">
                        <label>Default Payment Status for Card Orders</label>
                        <select
                          value={storeSettings.cardDefaultStatus || 'Paid Online (Verified)'}
                          onChange={(e) => setStoreSettings({ ...storeSettings, cardDefaultStatus: e.target.value })}
                        >
                          <option value="Paid Online (Verified)">🟢 Paid Online (Verified)</option>
                          <option value="Pending Verification">🟡 Pending Gateway Clearance</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. 0% No-Cost EMI */}
                <div className={`payment-config-card ${storeSettings.paymentEmiEnabled !== false ? 'active-config' : 'inactive-config'}`}>
                  <div className="payment-config-header">
                    <div className="payment-config-title-wrap">
                      <div className="config-icon-circle emi">
                        <IndianRupee size={18} />
                      </div>
                      <div>
                        <strong>0% No-Cost EMI (Bajaj Finserv, HDFC, ICICI, SBI)</strong>
                        <span className="pay-tag-badge brown">{storeSettings.emiTag || 'Showroom Promo'}</span>
                      </div>
                    </div>
                    <label className="switch-toggle" htmlFor="cfg-emi-enable">
                      <input 
                        id="cfg-emi-enable"
                        type="checkbox" 
                        checked={storeSettings.paymentEmiEnabled !== false}
                        onChange={(e) => updateFeatureToggle('paymentEmiEnabled', e.target.checked)}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  <div className="payment-config-body">
                    <div className="config-fields-two-col">
                      <div className="form-field-group">
                        <label>Approved Financing Partners</label>
                        <input 
                          type="text" 
                          value={storeSettings.emiBanks || 'Bajaj Finserv, HDFC, ICICI, SBI'} 
                          onChange={(e) => setStoreSettings({ ...storeSettings, emiBanks: e.target.value })}
                        />
                      </div>
                      <div className="form-field-group">
                        <label>Default Payment Status for EMI Orders</label>
                        <select
                          value={storeSettings.emiDefaultStatus || 'EMI Pre-Approved (Doorstep KYC)'}
                          onChange={(e) => setStoreSettings({ ...storeSettings, emiDefaultStatus: e.target.value })}
                        >
                          <option value="EMI Pre-Approved (Doorstep KYC)">🔵 EMI Pre-Approved (Doorstep KYC)</option>
                          <option value="Pending Verification">🟡 Pending Bank Review</option>
                          <option value="Paid Online (Verified)">🟢 Paid Online (Verified)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Net Banking */}
                <div className={`payment-config-card ${storeSettings.paymentNetBankingEnabled !== false ? 'active-config' : 'inactive-config'}`}>
                  <div className="payment-config-header">
                    <div className="payment-config-title-wrap">
                      <div className="config-icon-circle net">
                        <Home size={18} />
                      </div>
                      <div>
                        <strong>Net Banking (All Major Indian Banks)</strong>
                        <span className="pay-tag-badge slate">Instant Settlement</span>
                      </div>
                    </div>
                    <label className="switch-toggle" htmlFor="cfg-net-enable">
                      <input 
                        id="cfg-net-enable"
                        type="checkbox" 
                        checked={storeSettings.paymentNetBankingEnabled !== false}
                        onChange={(e) => updateFeatureToggle('paymentNetBankingEnabled', e.target.checked)}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  <div className="payment-config-body">
                    <div className="config-fields-two-col">
                      <div className="form-field-group">
                        <label>Supported Core Banks</label>
                        <input 
                          type="text" 
                          value={storeSettings.netBankingBanks || 'SBI, HDFC, ICICI, Axis, Kotak'} 
                          onChange={(e) => setStoreSettings({ ...storeSettings, netBankingBanks: e.target.value })}
                        />
                      </div>
                      <div className="form-field-group">
                        <label>Default Payment Status for Net Banking</label>
                        <select
                          value={storeSettings.netBankingDefaultStatus || 'Paid Online (Verified)'}
                          onChange={(e) => setStoreSettings({ ...storeSettings, netBankingDefaultStatus: e.target.value })}
                        >
                          <option value="Paid Online (Verified)">🟢 Paid Online (Verified)</option>
                          <option value="Pending Verification">🟡 Pending Bank Authorization</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. Cash on Delivery (COD) / Pay on Assembly */}
                <div className={`payment-config-card ${storeSettings.paymentCodEnabled !== false ? 'active-config' : 'inactive-config'}`}>
                  <div className="payment-config-header">
                    <div className="payment-config-title-wrap">
                      <div className="config-icon-circle cod">
                        <Wallet size={18} />
                      </div>
                      <div>
                        <strong>Cash on Delivery (COD) / Pay on Assembly</strong>
                        <span className="pay-tag-badge amber">{storeSettings.codBadge || 'Pay After Inspection'}</span>
                      </div>
                    </div>
                    <label className="switch-toggle" htmlFor="cfg-cod-enable">
                      <input 
                        id="cfg-cod-enable"
                        type="checkbox" 
                        checked={storeSettings.paymentCodEnabled !== false}
                        onChange={(e) => updateFeatureToggle('paymentCodEnabled', e.target.checked)}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  <div className="payment-config-body">
                    <div className="config-fields-two-col">
                      <div className="form-field-group">
                        <label>Customer Guarantee Tagline</label>
                        <input 
                          type="text" 
                          value={storeSettings.codBadge || 'Pay After Inspection'} 
                          onChange={(e) => setStoreSettings({ ...storeSettings, codBadge: e.target.value })}
                        />
                      </div>
                      <div className="form-field-group">
                        <label>Default Payment Status for COD Orders</label>
                        <select
                          value={storeSettings.codDefaultStatus || 'Pending (Pay on Assembly)'}
                          onChange={(e) => setStoreSettings({ ...storeSettings, codDefaultStatus: e.target.value })}
                        >
                          <option value="Pending (Pay on Assembly)">🟠 Pending (Pay on Assembly)</option>
                          <option value="COD - Unpaid">🟠 COD - Unpaid</option>
                          <option value="Pending Verification">🟡 Pending Verification</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-field-group" style={{ marginTop: '10px' }}>
                      <label>Doorstep Payment &amp; Unboxing Note</label>
                      <input 
                        type="text" 
                        value={storeSettings.codNote || 'Inspect your sofa, bed, or television at your home before paying. You can pay via Cash or UPI QR Code directly to our delivery executive.'} 
                        onChange={(e) => setStoreSettings({ ...storeSettings, codNote: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Save Button for Payment Settings */}
              <div style={{ marginTop: '18px', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn-save-settings"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#15803d', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '0.92rem' }}
                  onClick={() => {
                    try {
                      localStorage.setItem('hk_admin_settings', JSON.stringify(storeSettings));
                      window.dispatchEvent(new CustomEvent('hk_settings_changed', { detail: storeSettings }));
                    } catch {}
                    showToast('Payment Mode & Payment Status Settings saved successfully!');
                  }}
                >
                  <Check size={16} /> Save Payment &amp; Status Settings
                </button>
              </div>
            </div>

            {/* Sub-section 4: Business & Store Legal Profile */}
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
                    a.download = `SardarMart-Data-Backup-${Date.now()}.json`;
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
                    { name: 'Rahim Baig', email: 'admin@sardarmart.com', role: 'Super Admin / Owner', status: 'Active', time: 'Just now' },
                    { name: 'Showroom Sales Staff', email: 'sales@sardarmart.com', role: 'Staff Manager', status: 'Active', time: '2 hours ago' },
                    { name: 'Logistics Team', email: 'dispatch@sardarmart.com', role: 'Dispatch Lead', status: 'Active', time: 'Yesterday' }
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

      {/* MODAL: CUSTOMER PROFILE & ORDER HISTORY */}
      {selectedCustomer && (
        <div className="admin-modal-overlay" onClick={() => setSelectedCustomer(null)}>
          <div className="admin-dialog-card customer-profile-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <div className="customer-modal-title-group">
                <div className="customer-avatar-badge large">
                  {selectedCustomer.name
                    ? selectedCustomer.name.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
                    : 'SM'}
                </div>
                <div>
                  <h4>{selectedCustomer.name}</h4>
                  <div className="c-modal-sub-meta">
                    <span className="customer-sub-id">#{selectedCustomer.id}</span>
                    <span className={`customer-tier-badge ${selectedCustomer.tier.toLowerCase().replace(/\s+/g, '-')}`}>
                      {selectedCustomer.tier}
                    </span>
                    <span className="c-active-date">• Member since {selectedCustomer.joinDate || '2026'}</span>
                  </div>
                </div>
              </div>
              <button 
                type="button" 
                className="dialog-close-btn" 
                onClick={() => setSelectedCustomer(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="customer-modal-scrollable-body">
              {/* Quick Contact & Action Buttons */}
              <div className="customer-quick-actions-bar">
                {selectedCustomer.phone && (
                  <a
                    href={`https://wa.me/${selectedCustomer.phone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(selectedCustomer.name)}%2C%20thank%20you%20for%20choosing%20Sardar%20Mart.%20How%20can%20we%20assist%20you%20today%3F`}
                    target="_blank"
                    rel="noreferrer"
                    className="c-action-btn whatsapp"
                  >
                    <MessageCircle size={15} />
                    <span>WhatsApp Chat</span>
                  </a>
                )}
                {selectedCustomer.phone && (
                  <a
                    href={`tel:${selectedCustomer.phone.replace(/\D/g, '')}`}
                    className="c-action-btn call"
                  >
                    <Phone size={15} />
                    <span>Call Customer</span>
                  </a>
                )}
                {selectedCustomer.email && (
                  <a
                    href={`mailto:${selectedCustomer.email}`}
                    className="c-action-btn email"
                  >
                    <Mail size={15} />
                    <span>Send Email</span>
                  </a>
                )}
              </div>

              {/* 4 Lifetime Metrics */}
              <div className="c-modal-stats-grid">
                <div className="c-modal-stat-box">
                  <span className="c-m-label">LIFETIME ORDERS</span>
                  <strong className="c-m-val">{selectedCustomer.orderCount}</strong>
                  <small>Completed &amp; Live Orders</small>
                </div>
                <div className="c-modal-stat-box highlight">
                  <span className="c-m-label">TOTAL SPENT</span>
                  <strong className="c-m-val">{formatPrice(selectedCustomer.totalSpent)}</strong>
                  <small>Cumulative Revenue</small>
                </div>
                <div className="c-modal-stat-box">
                  <span className="c-m-label">LOYALTY REWARDS</span>
                  <strong className="c-m-val">{selectedCustomer.loyaltyPoints} Pts</strong>
                  <small>₹1 = 1 Point Cashback</small>
                </div>
                <div className="c-modal-stat-box">
                  <span className="c-m-label">AVG ORDER VALUE</span>
                  <strong className="c-m-val">
                    {formatPrice(selectedCustomer.orderCount ? Math.round(selectedCustomer.totalSpent / selectedCustomer.orderCount) : 0)}
                  </strong>
                  <small>Per Transaction</small>
                </div>
              </div>

              {/* 2-Column Details: Delivery Address & Contact Info */}
              <div className="c-modal-info-grid">
                <div className="c-info-card">
                  <h5><MapPin size={16} /> Delivery Address &amp; Location</h5>
                  <div className="c-info-content">
                    <p className="c-full-address">{selectedCustomer.address || 'Address not registered yet'}</p>
                    <div className="c-location-tags">
                      <span className="c-tag"><strong>City:</strong> {selectedCustomer.city || 'Chennai'}</span>
                      <span className="c-tag"><strong>Pincode:</strong> {selectedCustomer.pincode || '600044'}</span>
                      <span className="c-tag"><strong>State:</strong> Tamil Nadu</span>
                    </div>
                  </div>
                </div>

                <div className="c-info-card">
                  <h5><UserCheck size={16} /> Contact &amp; Account Details</h5>
                  <div className="c-info-content">
                    <div className="c-detail-row">
                      <span>Primary Phone:</span>
                      <strong>{selectedCustomer.phone || 'N/A'}</strong>
                    </div>
                    <div className="c-detail-row">
                      <span>Email Address:</span>
                      <strong>{selectedCustomer.email || 'N/A'}</strong>
                    </div>
                    <div className="c-detail-row">
                      <span>Customer Tier:</span>
                      <span className={`customer-tier-badge ${selectedCustomer.tier.toLowerCase().replace(/\s+/g, '-')}`}>
                        {selectedCustomer.tier}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order History Timeline & Invoices */}
              <div className="c-history-section">
                <h5><ShoppingCart size={16} /> Order History &amp; Tax Invoices ({selectedCustomer.orders?.length || 0})</h5>
                {selectedCustomer.orders && selectedCustomer.orders.length > 0 ? (
                  <div className="c-orders-list">
                    {selectedCustomer.orders.map((ord) => (
                      <div key={ord.id} className="c-order-card">
                        <div className="c-order-card-header">
                          <div>
                            <strong className="c-order-id">#{ord.id}</strong>
                            <span className="c-order-date">{ord.date}</span>
                          </div>
                          <div className="c-order-header-right">
                            <span className={`status-pill ${ord.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                              {ord.status}
                            </span>
                            <button
                              type="button"
                              className="c-invoice-btn"
                              onClick={() => onViewInvoice && onViewInvoice(ord)}
                              title="Print GST Tax Invoice"
                            >
                              <Printer size={13} />
                              <span>Invoice</span>
                            </button>
                          </div>
                        </div>

                        <div className="c-order-items-row">
                          {ord.items?.map((it, idx) => (
                            <div key={idx} className="c-order-item-chip">
                              {it.image && <img src={it.image} alt={it.name} className="c-item-thumb" />}
                              <div>
                                <span className="c-item-name">{it.name}</span>
                                <small className="c-item-qty">Qty: {it.quantity} × {formatPrice(it.price)}</small>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="c-order-card-footer">
                          <span>Payment: <strong>{ord.paymentMethod}</strong> ({ord.paymentStatus})</span>
                          <span className="c-order-grand-total">Total: <strong>{formatPrice(ord.total)}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="c-no-orders-msg">
                    <p>No e-commerce orders recorded yet for this customer profile.</p>
                  </div>
                )}
              </div>

              {/* Showroom Enquiries if any */}
              {selectedCustomer.enquiries && selectedCustomer.enquiries.length > 0 && (
                <div className="c-enquiries-section">
                  <h5><MessageSquare size={16} /> Showroom Enquiries &amp; Interests ({selectedCustomer.enquiries.length})</h5>
                  <div className="c-enquiries-list">
                    {selectedCustomer.enquiries.map((enq, idx) => (
                      <div key={idx} className="c-enquiry-card">
                        <div className="c-enq-header">
                          <strong className="c-enq-product">Product: {enq.product}</strong>
                          <span className="c-enq-date">{enq.date}</span>
                        </div>
                        <p className="c-enq-msg">"{enq.message}"</p>
                        <div className="c-enq-footer">
                          <span className={`c-enq-status ${enq.status?.toLowerCase()}`}>Status: {enq.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Internal Admin Notes */}
              <div className="c-notes-section">
                <h5><FileText size={16} /> Internal Showroom Notes &amp; Customer Preferences</h5>
                <p className="c-notes-hint">Record showroom visit remarks, product preferences, or delivery timing notes.</p>
                <div className="c-notes-editor">
                  <textarea
                    id="customer-notes-textarea"
                    rows={3}
                    defaultValue={selectedCustomer.notes || ''}
                    placeholder="Enter preferences e.g. 'Customer is interested in 6-seater solid wood dining table in teak finish. Prefers weekend evening delivery.'"
                  />
                  <div className="c-notes-actions">
                    <button
                      type="button"
                      className="admin-primary-btn"
                      onClick={() => {
                        const val = document.getElementById('customer-notes-textarea')?.value || '';
                        handleSaveCustomerNotes(selectedCustomer.id, val);
                      }}
                    >
                      <Check size={14} /> Save Notes
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="dialog-footer-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setSelectedCustomer(null)}
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW CUSTOMER PROFILE */}
      {isAddCustomerModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsAddCustomerModalOpen(false)}>
          <div className="admin-dialog-card" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <h4>Add New Customer Profile</h4>
              <button 
                type="button" 
                className="dialog-close-btn" 
                onClick={() => setIsAddCustomerModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddCustomerSubmit} className="dialog-form-body">
              <div className="dialog-grid">
                <div className="form-field-group">
                  <label>Full Customer Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Venkataraman"
                    value={newCustomerForm.name}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, name: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label>Mobile Number (WhatsApp) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={newCustomerForm.phone}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, phone: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. ramesh@example.com"
                    value={newCustomerForm.email}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, email: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label>Customer Tier</label>
                  <select
                    value={newCustomerForm.tier}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, tier: e.target.value })}
                  >
                    <option value="Verified Buyer">Verified Buyer</option>
                    <option value="Gold Club">Gold Club Member</option>
                    <option value="VIP Platinum">VIP Platinum Member</option>
                    <option value="Showroom Lead">Showroom Inquiry Lead</option>
                  </select>
                </div>

                <div className="form-field-group full-width">
                  <label>Street Delivery Address</label>
                  <input
                    type="text"
                    placeholder="e.g. Flat 4B, Emerald Heights, Chromepet"
                    value={newCustomerForm.address}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, address: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label>City</label>
                  <input
                    type="text"
                    placeholder="e.g. Chennai"
                    value={newCustomerForm.city}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, city: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label>Pincode</label>
                  <input
                    type="text"
                    placeholder="e.g. 600044"
                    value={newCustomerForm.pincode}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, pincode: e.target.value })}
                  />
                </div>

                <div className="form-field-group full-width">
                  <label>Showroom Remarks / Notes</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Interested in King Size Teak Bed and Inverter Split AC."
                    value={newCustomerForm.notes}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, notes: e.target.value })}
                  />
                </div>
              </div>

              <div className="dialog-footer-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsAddCustomerModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-confirm">
                  Save Customer Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <nav 
        className={`admin-mobile-bottom-nav ${isMobileNavVisible && !mobileSidebarOpen ? 'nav-visible' : 'nav-hidden'}`} 
        aria-label="Admin Mobile Navigation"
      >
        {/* 1. Dashboard (Home Page) */}
        <button
          type="button"
          className={`admin-mob-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => { setActiveTab('dashboard'); setMobileSidebarOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          aria-label="Dashboard"
        >
          <LayoutDashboard size={19} />
          <span>Dashboard</span>
          {activeTab === 'dashboard' && <span className="active-pill-dot" />}
        </button>

        {/* 2. Invoices */}
        <button
          type="button"
          className={`admin-mob-nav-btn ${activeTab === 'invoices' ? 'active' : ''}`}
          onClick={() => { setActiveTab('invoices'); setMobileSidebarOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          aria-label="Invoices"
        >
          <div className="admin-mob-btn-icon-wrap">
            <FileText size={19} />
            {orders.length > 0 && <span className="admin-mob-badge-dot gold">{orders.length}</span>}
          </div>
          <span>Invoices</span>
          {activeTab === 'invoices' && <span className="active-pill-dot" />}
        </button>

        {/* 3. Billing & Tax Invoice */}
        <button
          type="button"
          className={`admin-mob-nav-btn ${activeTab === 'create-billing' ? 'active' : ''}`}
          onClick={() => { setActiveTab('create-billing'); setMobileSidebarOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          aria-label="Create Showroom Billing & Invoice"
          title="Billing"
        >
          <ReceiptIndianRupee size={19} />
          <span>Billing</span>
          {activeTab === 'create-billing' && <span className="active-pill-dot" />}
        </button>

        {/* 4. Product List */}
        <button
          type="button"
          className={`admin-mob-nav-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => { setActiveTab('products'); setMobileSidebarOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          aria-label="Product List"
        >
          <div className="admin-mob-btn-icon-wrap">
            <Package size={19} />
            {products.length > 0 && <span className="admin-mob-badge-dot" />}
          </div>
          <span>Products</span>
          {activeTab === 'products' && <span className="active-pill-dot" />}
        </button>

        {/* 5. Customers */}
        <button
          type="button"
          className={`admin-mob-nav-btn ${activeTab === 'customers' ? 'active' : ''}`}
          onClick={() => { setActiveTab('customers'); setMobileSidebarOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          aria-label="Customers"
        >
          <div className="admin-mob-btn-icon-wrap">
            <Users size={19} />
            {allCustomers.length > 0 && <span className="admin-mob-badge-dot purple" />}
          </div>
          <span>Customers</span>
          {activeTab === 'customers' && <span className="active-pill-dot" />}
        </button>

        {/* 6. Settings */}
        <button
          type="button"
          className={`admin-mob-nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => { setActiveTab('settings'); setMobileSidebarOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          aria-label="Settings"
        >
          <Settings size={19} />
          <span>Settings</span>
          {activeTab === 'settings' && <span className="active-pill-dot" />}
        </button>
      </nav>

      {/* COMPREHENSIVE STYLING MATCHING SCREENSHOT */}
      <style>{`
        .admin-portal-wrapper {
          display: flex;
          width: 100%;
          max-width: 100vw;
          min-height: 100vh;
          background: #f1f5f9;
          font-family: inherit;
          color: #1e293b;
          overflow-x: hidden;
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
          width: 100%;
          max-width: 100vw;
          min-width: 0;
          overflow-x: hidden;
          box-sizing: border-box;
        }

        /* Top Header - Fixed & Sticky */
        .admin-top-header {
          height: 68px;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-bottom: 1px solid #e2e8f0;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 950;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          overflow: hidden;
        }
        .header-left-group {
          display: flex;
          align-items: center;
          gap: 14px;
          flex: 1 1 auto;
          max-width: 480px;
          min-width: 0;
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
          flex-shrink: 0;
        }
        .header-search-box {
          position: relative;
          flex: 1 1 auto;
          min-width: 0;
          max-width: 280px;
        }
        .header-search-box .search-icon {
          position: absolute;
          left: 12px;
          top: 10px;
          color: #94a3b8;
        }
        .header-search-box input {
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
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
          gap: 12px;
          flex-shrink: 0;
          min-width: 0;
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

        /* Admin Header Title Badge & Action Pills */
        .admin-header-title-badge {
          display: flex;
          flex-direction: column;
          line-height: 1.15;
          margin-right: 4px;
          flex-shrink: 0;
        }
        .admin-header-title-badge strong {
          font-size: 0.95rem;
          color: #1e293b;
          font-weight: 800;
          letter-spacing: -0.3px;
        }
        .admin-header-title-badge small {
          font-size: 0.64rem;
          color: #854d0e;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.6px;
        }
        .admin-header-nav-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #f5f3ff;
          border: 1.5px solid #ddd6fe;
          color: #7c3aed;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .admin-header-nav-pill:hover,
        .admin-header-nav-pill.active {
          background: #7c3aed;
          color: #ffffff;
          border-color: #6d28d9;
          box-shadow: 0 2px 8px rgba(124, 58, 237, 0.25);
        }
        .admin-header-nav-pill .pill-counter {
          background: #ddd6fe;
          color: #5b21b6;
          font-size: 0.68rem;
          padding: 1px 6px;
          border-radius: 10px;
          font-weight: 800;
        }
        .admin-header-nav-pill.active .pill-counter {
          background: rgba(255, 255, 255, 0.25);
          color: #ffffff;
        }
        .admin-header-store-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #fafaf9;
          border: 1.5px solid #e7e5e4;
          color: #44403c;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .admin-header-store-btn:hover {
          background: #2b170e;
          color: #fde68a;
          border-color: #2b170e;
          box-shadow: 0 2px 8px rgba(43, 23, 14, 0.2);
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

        /* 4 KPI Metric Cards & 2nd Image Modern Card Style */
        .kpi-cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        /* 2nd Image Card Style: Clean white card, top-left pastel squircle icon, title, bold value, subtext */
        .kpi-cards-grid.second-image-style {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }
        @media (max-width: 1200px) {
          .kpi-cards-grid.second-image-style {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (max-width: 900px) {
          .kpi-cards-grid.second-image-style {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
        }
        @media (max-width: 480px) {
          .kpi-cards-grid.second-image-style {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
          }
        }

        .kpi-modern-card {
          background: #ffffff;
          border: 1px solid #eef2f6;
          border-radius: 18px;
          padding: 22px 20px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02), 0 4px 14px rgba(0, 0, 0, 0.03);
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
          position: relative;
        }
        .kpi-modern-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06);
          border-color: #cbd5e1;
        }

        .modern-kpi-icon-wrap {
          width: 46px;
          height: 46px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          flex-shrink: 0;
        }
        .modern-kpi-icon-wrap.cyan {
          background: #f0f9ff;
          color: #0284c7;
        }
        .modern-kpi-icon-wrap.amber {
          background: #fffbeb;
          color: #d97706;
        }
        .modern-kpi-icon-wrap.green {
          background: #f0fdf4;
          color: #16a34a;
        }
        .modern-kpi-icon-wrap.rose {
          background: #fff1f2;
          color: #e11d48;
        }
        .modern-kpi-icon-wrap.purple {
          background: #faf5ff;
          color: #9333ea;
        }
        .modern-kpi-icon-wrap.teal {
          background: #f0fdfa;
          color: #0d9488;
        }

        .modern-kpi-title {
          font-size: 0.88rem;
          font-weight: 600;
          color: #64748b;
          margin-bottom: 6px;
          display: block;
        }

        .modern-kpi-value {
          font-size: 1.62rem;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.15;
          margin-bottom: 8px;
          display: block;
          letter-spacing: -0.4px;
        }

        .modern-kpi-subtext {
          font-size: 0.78rem;
          font-weight: 500;
          color: #94a3b8;
          display: block;
        }

        @media (max-width: 520px) {
          .kpi-modern-card {
            padding: 16px 14px;
            border-radius: 14px;
          }
          .modern-kpi-icon-wrap {
            width: 38px;
            height: 38px;
            border-radius: 11px;
            margin-bottom: 10px;
          }
          .modern-kpi-title {
            font-size: 0.78rem;
            margin-bottom: 4px;
          }
          .modern-kpi-value {
            font-size: 1.25rem;
            margin-bottom: 4px;
          }
          .modern-kpi-subtext {
            font-size: 0.7rem;
          }
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

        /* -------------------------------------------------------------
           CUSTOMER DIRECTORY & CRM STYLES
           ------------------------------------------------------------- */
        .customer-kpis-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 22px;
        }
        @media (max-width: 1024px) {
          .customer-kpis-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 640px) {
          .customer-kpis-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
          }
        }
        .customer-kpi-card {
          background: #ffffff;
          border: 1px solid #eef2f6;
          border-radius: 18px;
          padding: 20px 18px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02), 0 4px 14px rgba(0, 0, 0, 0.03);
        }
        .customer-kpi-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06);
          border-color: #cbd5e1;
        }
        .c-kpi-icon-wrap {
          width: 44px;
          height: 44px;
          border-radius: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-bottom: 14px;
        }
        .c-kpi-icon-wrap.brown {
          background: #f0f9ff;
          color: #0284c7;
        }
        .c-kpi-icon-wrap.amber {
          background: #fffbeb;
          color: #d97706;
        }
        .c-kpi-icon-wrap.gold {
          background: #fef3c7;
          color: #b45309;
        }
        .c-kpi-icon-wrap.green {
          background: #f0fdf4;
          color: #16a34a;
        }
        .c-kpi-data {
          display: flex;
          flex-direction: column;
          width: 100%;
        }
        .c-kpi-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: #64748b;
          letter-spacing: 0.02em;
          text-transform: capitalize;
        }
        .c-kpi-value {
          font-size: 1.55rem;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.15;
          margin: 4px 0 6px;
          letter-spacing: -0.4px;
        }
        .c-kpi-desc {
          font-size: 0.76rem;
          font-weight: 500;
          color: #94a3b8;
        }
        @media (max-width: 520px) {
          .customer-kpi-card {
            padding: 14px 12px;
            border-radius: 14px;
          }
          .c-kpi-icon-wrap {
            width: 38px;
            height: 38px;
            border-radius: 10px;
            margin-bottom: 10px;
          }
          .c-kpi-value {
            font-size: 1.25rem;
          }
        }

        /* Customer Table Cells */
        .customer-table th {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        .customer-row:hover {
          background: #fdfaf7 !important;
        }
        .customer-cell-main {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .customer-avatar-badge {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: linear-gradient(135deg, #5c2c16, #8c4826);
          color: #ffffff;
          font-size: 0.85rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(92, 44, 22, 0.25);
          flex-shrink: 0;
        }
        .customer-avatar-badge.large {
          width: 52px;
          height: 52px;
          font-size: 1.15rem;
        }
        .customer-text-meta {
          display: flex;
          flex-direction: column;
        }
        .customer-text-meta strong {
          color: #0f172a;
          font-size: 0.92rem;
        }
        .customer-sub-id {
          font-size: 0.74rem;
          color: #64748b;
          font-family: monospace;
          font-weight: 600;
        }

        .customer-contact-cell {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .c-contact-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.82rem;
          color: #334155;
        }
        .c-contact-item.email small {
          color: #64748b;
          font-size: 0.75rem;
        }

        .customer-address-cell {
          display: flex;
          flex-direction: column;
          gap: 3px;
          max-width: 240px;
        }
        .c-address-line {
          display: flex;
          align-items: flex-start;
          gap: 5px;
          font-size: 0.82rem;
          color: #1e293b;
          line-height: 1.35;
        }
        .c-address-line .pin-icon {
          color: #5c2c16;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .c-city-badge {
          display: inline-block;
          font-size: 0.73rem;
          font-weight: 600;
          color: #5c2c16;
          background: #fbf5ef;
          padding: 1px 7px;
          border-radius: 4px;
          align-self: flex-start;
          margin-left: 18px;
        }

        .customer-spend-cell {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .c-spend-amount {
          font-size: 0.95rem;
          font-weight: 800;
          color: #0f172a;
        }
        .c-orders-count-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.72rem;
          font-weight: 600;
          color: #475569;
          background: #f1f5f9;
          padding: 1px 6px;
          border-radius: 4px;
          width: fit-content;
        }

        .loyalty-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 3px 8px;
          background: #fffbeb;
          border: 1px solid #fde68a;
          color: #b45309;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 700;
        }

        /* Tier Badges */
        .customer-tier-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 9px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 700;
        }
        .customer-tier-badge.vip-platinum {
          background: linear-gradient(135deg, #fef3c7, #fde68a);
          color: #78350f;
          border: 1px solid #fcd34d;
          box-shadow: 0 1px 3px rgba(245, 158, 11, 0.2);
        }
        .customer-tier-badge.gold-club {
          background: #fef3c7;
          color: #92400e;
          border: 1px solid #fde68a;
        }
        .customer-tier-badge.verified-buyer {
          background: #dcfce7;
          color: #166534;
          border: 1px solid #bbf7d0;
        }
        .customer-tier-badge.showroom-lead {
          background: #f1f5f9;
          color: #475569;
          border: 1px solid #e2e8f0;
        }

        .customer-date-text {
          font-size: 0.78rem;
          color: #64748b;
          white-space: nowrap;
        }

        /* Table Action Buttons for Customers */
        .table-action-icon-btn.whatsapp {
          background: #25d366;
          color: #ffffff;
          border-color: #22c55e;
        }
        .table-action-icon-btn.whatsapp:hover {
          background: #1eb857;
          transform: scale(1.05);
        }
        .table-action-icon-btn.call {
          background: #eff6ff;
          color: #2563eb;
          border-color: #bfdbfe;
        }
        .table-action-icon-btn.call:hover {
          background: #dbeafe;
          transform: scale(1.05);
        }
        .table-action-icon-btn.profile-view {
          background: #fbf5ef;
          color: #5c2c16;
          border-color: #e5d3c3;
        }
        .table-action-icon-btn.profile-view:hover {
          background: #5c2c16;
          color: #ffffff;
          border-color: #5c2c16;
          transform: scale(1.05);
        }

        .clear-search-btn {
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 4px;
        }
        .clear-search-btn:hover {
          color: #334155;
        }

        /* Empty State */
        .empty-results-box {
          text-align: center;
          padding: 48px 24px;
          color: #64748b;
        }
        .empty-results-box .empty-icon {
          color: #cbd5e1;
          margin-bottom: 12px;
        }
        .empty-results-box h4 {
          font-size: 1.1rem;
          color: #1e293b;
          margin-bottom: 6px;
        }
        .empty-results-box p {
          font-size: 0.88rem;
          margin-bottom: 16px;
        }

        /* -------------------------------------------------------------
           CUSTOMER PROFILE MODAL STYLES
           ------------------------------------------------------------- */
        .customer-profile-dialog {
          max-width: 820px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          padding: 0;
          overflow: hidden;
        }
        .customer-profile-dialog .dialog-header {
          padding: 20px 24px;
          border-bottom: 1px solid #e2e8f0;
          background: #fafaf9;
        }
        .customer-modal-title-group {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .customer-modal-title-group h4 {
          margin: 0;
          font-size: 1.25rem;
          color: #0f172a;
        }
        .c-modal-sub-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 4px;
        }
        .c-active-date {
          font-size: 0.78rem;
          color: #64748b;
        }

        .customer-modal-scrollable-body {
          padding: 24px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        /* Quick Action Bar */
        .customer-quick-actions-bar {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .c-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 0.84rem;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s;
        }
        .c-action-btn.whatsapp {
          background: #25d366;
          color: #ffffff;
        }
        .c-action-btn.whatsapp:hover {
          background: #1eb857;
          box-shadow: 0 4px 10px rgba(37, 211, 102, 0.3);
        }
        .c-action-btn.call {
          background: #eff6ff;
          color: #1d4ed8;
          border: 1px solid #bfdbfe;
        }
        .c-action-btn.call:hover {
          background: #dbeafe;
        }
        .c-action-btn.email {
          background: #f8fafc;
          color: #334155;
          border: 1px solid #cbd5e1;
        }
        .c-action-btn.email:hover {
          background: #e2e8f0;
        }

        /* Modal Stats Grid */
        .c-modal-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        @media (max-width: 640px) {
          .c-modal-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        .c-modal-stat-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 12px;
          display: flex;
          flex-direction: column;
        }
        .c-modal-stat-box.highlight {
          background: #fbf5ef;
          border-color: #ecd4c1;
        }
        .c-m-label {
          font-size: 0.7rem;
          font-weight: 700;
          color: #64748b;
        }
        .c-m-val {
          font-size: 1.2rem;
          font-weight: 800;
          color: #0f172a;
          margin: 3px 0;
        }
        .c-modal-stat-box.highlight .c-m-val {
          color: #5c2c16;
        }
        .c-modal-stat-box small {
          font-size: 0.72rem;
          color: #94a3b8;
        }

        /* 2-Column Info Cards */
        .c-modal-info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        @media (max-width: 640px) {
          .c-modal-info-grid {
            grid-template-columns: 1fr;
          }
        }
        .c-info-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 16px;
        }
        .c-info-card h5 {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0 0 12px;
          font-size: 0.9rem;
          color: #1e293b;
        }
        .c-full-address {
          font-size: 0.88rem;
          color: #334155;
          line-height: 1.4;
          margin-bottom: 10px;
        }
        .c-location-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .c-tag {
          font-size: 0.74rem;
          background: #f1f5f9;
          padding: 2px 8px;
          border-radius: 4px;
          color: #475569;
        }
        .c-detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.85rem;
          padding: 6px 0;
          border-bottom: 1px dashed #f1f5f9;
        }
        .c-detail-row:last-child {
          border-bottom: none;
        }
        .c-detail-row span {
          color: #64748b;
        }

        /* Order History */
        .c-history-section h5, .c-enquiries-section h5, .c-notes-section h5 {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.95rem;
          color: #0f172a;
          margin: 0 0 12px;
        }
        .c-orders-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .c-order-card {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 14px;
          background: #fafaf9;
        }
        .c-order-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          padding-bottom: 8px;
          border-bottom: 1px solid #f1f5f9;
        }
        .c-order-id {
          font-size: 0.92rem;
          color: #5c2c16;
          margin-right: 10px;
        }
        .c-order-date {
          font-size: 0.76rem;
          color: #64748b;
        }
        .c-order-header-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .status-pill {
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 0.72rem;
          font-weight: 700;
          background: #e2e8f0;
          color: #334155;
        }
        .status-pill.delivered {
          background: #dcfce7;
          color: #166534;
        }
        .status-pill.out-for-delivery {
          background: #fed7aa;
          color: #9a3412;
        }
        .c-invoice-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 8px;
          border-radius: 4px;
          border: 1px solid #cbd5e1;
          background: #ffffff;
          font-size: 0.74rem;
          font-weight: 600;
          color: #334155;
          cursor: pointer;
        }
        .c-invoice-btn:hover {
          background: #f1f5f9;
          color: #0284c7;
          border-color: #7dd3fc;
        }
        .c-order-items-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 10px;
        }
        .c-order-item-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 6px 10px;
        }
        .c-item-thumb {
          width: 32px;
          height: 32px;
          object-fit: cover;
          border-radius: 4px;
        }
        .c-item-name {
          font-size: 0.8rem;
          font-weight: 600;
          color: #1e293b;
          display: block;
        }
        .c-item-qty {
          font-size: 0.72rem;
          color: #64748b;
        }
        .c-order-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.82rem;
          color: #475569;
          padding-top: 6px;
          border-top: 1px solid #f1f5f9;
        }
        .c-order-grand-total strong {
          color: #0f172a;
          font-size: 0.95rem;
        }
        .c-no-orders-msg {
          padding: 16px;
          background: #f8fafc;
          border-radius: 6px;
          color: #64748b;
          font-size: 0.85rem;
          text-align: center;
        }

        /* Showroom Enquiries List */
        .c-enquiries-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .c-enquiry-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 10px 14px;
        }
        .c-enq-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 4px;
        }
        .c-enq-product {
          font-size: 0.84rem;
          color: #5c2c16;
        }
        .c-enq-date {
          font-size: 0.74rem;
          color: #94a3b8;
        }
        .c-enq-msg {
          font-size: 0.82rem;
          color: #334155;
          margin: 0 0 6px;
          font-style: italic;
        }
        .c-enq-status {
          font-size: 0.72rem;
          font-weight: 700;
          color: #166534;
        }

        /* Notes Editor */
        .c-notes-hint {
          font-size: 0.78rem;
          color: #64748b;
          margin-top: -6px;
          margin-bottom: 8px;
        }
        .c-notes-editor textarea {
          width: 100%;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          padding: 10px 12px;
          font-size: 0.85rem;
          font-family: inherit;
          resize: vertical;
          outline: none;
        }
        .c-notes-editor textarea:focus {
          border-color: #5c2c16;
        }
        .c-notes-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 8px;
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

        .subpage-header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .admin-primary-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: #854d0e;
          color: #ffffff;
          padding: 8px 16px;
          border-radius: 9px;
          font-size: 0.84rem;
          font-weight: 700;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(133, 77, 14, 0.25);
          text-decoration: none;
        }

        .admin-primary-btn:hover {
          background: #713f12;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(133, 77, 14, 0.35);
        }

        .admin-secondary-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: #ffffff;
          color: #334155;
          padding: 8px 14px;
          border-radius: 9px;
          font-size: 0.84rem;
          font-weight: 700;
          border: 1px solid #cbd5e1;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
          text-decoration: none;
        }

        .admin-secondary-btn:hover {
          background: #f8fafc;
          border-color: #94a3b8;
          transform: translateY(-1px);
        }

        .subpage-filters-bar {
          display: flex;
          gap: 10px;
          margin-bottom: 18px;
          align-items: center;
          flex-wrap: wrap;
        }
        .filter-search-box {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          padding: 7px 12px;
          border-radius: 8px;
          flex: 1;
          max-width: 400px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .filter-search-box:focus-within {
          border-color: #7c3aed;
          box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.1);
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
          gap: 6px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          padding: 6px 12px;
          border-radius: 8px;
          position: relative;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .filter-dropdown-wrap:hover {
          border-color: #94a3b8;
          background: #f8fafc;
        }
        .filter-dropdown-wrap.active {
          background: #f5f3ff;
          border-color: #8b5cf6;
          color: #7c3aed;
        }
        .filter-dropdown-wrap.active svg {
          color: #7c3aed;
        }
        .filter-dropdown-wrap select {
          border: none;
          background: transparent;
          font-size: 0.84rem;
          font-weight: 600;
          color: #334155;
          outline: none;
          cursor: pointer;
        }
        .filter-dropdown-wrap.active select {
          color: #7c3aed;
        }
        .filter-active-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #7c3aed;
          flex-shrink: 0;
        }

        /* Breadcrumb Bar (Dashboard > Invoices) */
        .admin-breadcrumb-bar {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 12px;
          font-size: 0.82rem;
          color: #64748b;
        }
        .admin-breadcrumb-link {
          background: none;
          border: none;
          padding: 0;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.82rem;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
          transition: color 0.15s ease;
        }
        .admin-breadcrumb-link:hover {
          color: #7c3aed;
        }
        .admin-breadcrumb-sep {
          color: #94a3b8;
          font-size: 0.8rem;
          font-weight: bold;
        }
        .admin-breadcrumb-current {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: #7c3aed;
          font-weight: 700;
        }

        /* Invoices KPI Grid */
        .invoices-kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
          margin-bottom: 18px;
        }
        .invoice-kpi-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 12px 14px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .invoice-kpi-card:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
        }
        .invoice-kpi-icon {
          width: 38px;
          height: 38px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .invoice-kpi-icon.violet { background: #f5f3ff; color: #7c3aed; }
        .invoice-kpi-icon.emerald { background: #ecfdf5; color: #059669; }
        .invoice-kpi-icon.green { background: #f0fdf4; color: #16a34a; }
        .invoice-kpi-icon.amber { background: #fffbeb; color: #d97706; }
        .invoice-kpi-label {
          display: block;
          font-size: 0.72rem;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }
        .invoice-kpi-val {
          display: block;
          font-size: 1.15rem;
          font-weight: 800;
          color: #0f172a;
        }

        /* Products Management Layout & Responsiveness */
        .product-data-table {
          width: 100%;
          min-width: 980px;
          border-collapse: separate;
          border-spacing: 0;
          background: #ffffff;
        }
        .product-data-table th {
          background: #f8fafc;
          color: #475569;
          font-size: 0.76rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          padding: 12px 14px;
          border-bottom: 2px solid #e2e8f0;
          white-space: nowrap;
        }
        .product-data-table td {
          padding: 12px 14px;
          border-bottom: 1px solid #f1f5f9;
          vertical-align: middle;
        }
        .product-table-row:hover {
          background: #faf7f5;
        }

        .product-table-item-cell {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 260px;
        }
        .product-thumb-container {
          width: 48px;
          height: 48px;
          min-width: 48px;
          border-radius: 8px;
          overflow: hidden;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .product-thumb-sm {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .product-item-text-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
        }
        .product-item-title-text {
          font-size: 0.88rem;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.35;
          word-break: break-word;
          display: block;
        }
        .product-item-id-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .product-id-badge {
          font-size: 0.72rem;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          background: #f1f5f9;
          color: #64748b;
          padding: 2px 6px;
          border-radius: 4px;
          border: 1px solid #e2e8f0;
          font-weight: 600;
          display: inline-block;
          width: fit-content;
        }
        .selling-price-text {
          color: #0f172a;
          font-size: 0.92rem;
          font-weight: 800;
        }

        .filter-stats-badge {
          margin-left: auto;
          font-size: 0.8rem;
          font-weight: 700;
          color: #64748b;
          background: #f1f5f9;
          padding: 6px 12px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          align-self: center;
          white-space: nowrap;
        }
        .clear-search-btn {
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 2px;
          display: flex;
          align-items: center;
        }
        .clear-search-btn:hover {
          color: #475569;
        }

        .table-scroll-hint-bar {
          display: none;
          background: #f8fafc;
          border: 1px dashed #cbd5e1;
          color: #64748b;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 6px 10px;
          border-radius: 6px;
          margin-bottom: 10px;
          text-align: center;
        }

        /* Mobile Cards Styling */
        .products-mobile-cards-list {
          display: none;
        }
        .product-mobile-card {
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          padding: 14px;
          margin-bottom: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.03);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .product-mobile-card:hover {
          border-color: #cbd5e1;
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
        }
        .pm-card-header {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          margin-bottom: 12px;
        }
        .pm-card-thumb-wrap {
          width: 56px;
          height: 56px;
          min-width: 56px;
          border-radius: 8px;
          overflow: hidden;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          flex-shrink: 0;
        }
        .pm-card-thumb {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .pm-card-meta {
          flex: 1;
          min-width: 0;
        }
        .pm-card-badges-top {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          margin-bottom: 4px;
        }
        .pm-card-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 6px 0;
          line-height: 1.35;
        }
        .pm-card-pricing-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 8px;
          background: #f8fafc;
          border: 1px solid #f1f5f9;
          border-radius: 8px;
          padding: 8px 10px;
          margin-bottom: 12px;
          text-align: center;
        }
        .pm-price-box {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .pm-label {
          font-size: 0.68rem;
          color: #64748b;
          font-weight: 600;
          text-transform: uppercase;
        }
        .pm-val-selling {
          font-size: 0.92rem;
          color: #0f172a;
          font-weight: 800;
        }
        .pm-card-actions-row {
          display: flex;
          gap: 8px;
        }
        .pm-card-btn {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 9px 12px;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          border: 1px solid transparent;
          transition: all 0.2s ease;
        }
        .pm-card-btn.edit {
          background: #f1f5f9;
          color: #1e293b;
          border-color: #cbd5e1;
        }
        .pm-card-btn.edit:hover {
          background: #e2e8f0;
          color: #0f172a;
        }
        .pm-card-btn.delete {
          background: #fef2f2;
          color: #dc2626;
          border-color: #fecaca;
        }
        .pm-card-btn.delete:hover {
          background: #fee2e2;
        }

        /* Invoices & Orders Mobile Cards Styling (hidden on desktop) */
        .invoices-mobile-cards-list,
        .orders-mobile-cards-list {
          display: none;
        }

        .invoice-mobile-card,
        .order-mobile-card {
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          padding: 14px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
          transition: border-color 0.15s, box-shadow 0.15s;
          margin-bottom: 12px;
        }
        .invoice-mobile-card:hover,
        .order-mobile-card:hover {
          border-color: #cbd5e1;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
        }

        .inv-mob-card-head,
        .ord-mob-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 10px;
          padding-bottom: 10px;
          border-bottom: 1px solid #f1f5f9;
          margin-bottom: 10px;
        }
        .inv-mob-num,
        .ord-mob-id {
          display: block;
          font-size: 0.94rem;
          font-weight: 800;
          color: #4c1d95;
        }
        .inv-mob-date,
        .ord-mob-date {
          display: block;
          font-size: 0.72rem;
          color: #64748b;
          font-weight: 600;
        }
        .inv-mob-badges {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
        }
        .ord-mob-total {
          font-size: 1.05rem;
          font-weight: 900;
          color: #0f172a;
        }

        .inv-mob-customer-row,
        .ord-mob-cust {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 4px;
          margin-bottom: 10px;
          font-size: 0.85rem;
        }
        .inv-mob-cust-info strong,
        .ord-mob-cust strong {
          display: block;
          color: #0f172a;
          font-weight: 700;
        }
        .inv-mob-phone-link,
        .ord-mob-tel {
          display: inline-block;
          font-size: 0.78rem;
          color: #7c3aed;
          font-weight: 600;
          text-decoration: none;
        }
        .inv-mob-city,
        .ord-mob-addr {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 500;
        }

        .inv-mob-items-summary,
        .ord-mob-items-box {
          background: #f8fafc;
          border: 1px solid #f1f5f9;
          border-radius: 8px;
          padding: 8px 10px;
          margin-bottom: 10px;
        }
        .inv-mob-items-count,
        .ord-mob-items-label {
          display: block;
          font-size: 0.72rem;
          font-weight: 700;
          color: #475569;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }
        .inv-mob-chips-wrap,
        .ord-mob-chips-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }

        .inv-mob-financials-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 10px;
          background: #f5f3ff;
          border: 1px solid #ddd6fe;
          border-radius: 8px;
          margin-bottom: 12px;
        }
        .inv-mob-tax-meta {
          display: flex;
          flex-direction: column;
          font-size: 0.75rem;
          color: #5b21b6;
        }
        .inv-mob-tax-meta small {
          color: #7c3aed;
          font-size: 0.7rem;
        }
        .inv-mob-total-val {
          text-align: right;
        }
        .inv-mob-total-val span {
          display: block;
          font-size: 0.68rem;
          color: #6d28d9;
          font-weight: 600;
          text-transform: uppercase;
        }
        .inv-mob-total-val strong {
          font-size: 1.15rem;
          font-weight: 900;
          color: #4c1d95;
        }

        .ord-mob-status-controls {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 12px;
        }
        .ord-mob-select-field {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .ord-mob-select-field label {
          font-size: 0.68rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
        }
        .ord-mob-select-field select {
          width: 100%;
          font-size: 0.76rem;
        }

        .inv-mob-actions-row,
        .ord-mob-actions-row {
          display: flex;
          gap: 8px;
        }
        .inv-mob-action-btn,
        .ord-mob-act-btn {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 9px 12px;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          border: 1px solid transparent;
          transition: all 0.2s ease;
        }
        .inv-mob-action-btn.primary,
        .ord-mob-act-btn.invoice {
          background: #7c3aed;
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(124, 58, 237, 0.25);
        }
        .inv-mob-action-btn.primary:hover,
        .ord-mob-act-btn.invoice:hover {
          background: #6d28d9;
        }
        .inv-mob-action-btn.secondary,
        .ord-mob-act-btn.edit {
          background: #f1f5f9;
          color: #334155;
          border-color: #cbd5e1;
        }
        .inv-mob-action-btn.secondary:hover,
        .ord-mob-act-btn.edit:hover {
          background: #e2e8f0;
        }
        .ord-mob-act-btn.delete {
          flex: 0 0 42px;
          background: #fef2f2;
          color: #dc2626;
          border-color: #fecaca;
        }

        /* Dashboard Mobile Order & Enquiry Cards */
        .dashboard-mobile-cards-list {
          display: none;
          flex-direction: column;
          gap: 10px;
          margin-top: 10px;
          width: 100%;
        }
        .dash-mob-order-card,
        .dash-mob-enquiry-card {
          background: #ffffff;
          border: 1.5px solid #eef2f6;
          border-radius: 12px;
          padding: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100%;
          box-sizing: border-box;
          transition: border-color 0.15s ease;
        }
        .dash-mob-order-card:hover,
        .dash-mob-enquiry-card:hover {
          border-color: #cbd5e1;
        }
        .dash-mob-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 6px;
          border-bottom: 1px dashed #f1f5f9;
        }
        .dash-mob-id-block {
          display: flex;
          align-items: baseline;
          gap: 6px;
        }
        .dash-mob-id {
          font-size: 0.88rem;
          font-weight: 800;
          color: #0f172a;
        }
        .dash-mob-date {
          font-size: 0.72rem;
          color: #94a3b8;
          font-weight: 500;
        }
        .dash-mob-card-mid {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .dash-mob-cust-name {
          font-size: 0.84rem;
          font-weight: 700;
          color: #334155;
        }
        .dash-mob-product-name {
          font-size: 0.8rem;
          color: #64748b;
          line-height: 1.35;
        }
        .dash-mob-more-badge {
          background: #f1f5f9;
          color: #475569;
          font-size: 0.68rem;
          font-weight: 700;
          padding: 1px 5px;
          border-radius: 4px;
          margin-left: 4px;
        }
        .dash-mob-phone {
          font-size: 0.76rem;
          color: #64748b;
        }
        .dash-mob-card-bot {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 6px;
          border-top: 1px solid #f8fafc;
        }
        .dash-mob-amount-wrap {
          display: flex;
          flex-direction: column;
        }
        .dash-mob-amount-label {
          font-size: 0.65rem;
          color: #94a3b8;
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 0.4px;
        }
        .dash-mob-amount {
          font-size: 1rem;
          font-weight: 800;
          color: #0f172a;
        }
        .dash-mob-print-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #faf5ff;
          border: 1px solid #d8b4fe;
          color: #7c3aed;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .dash-mob-print-btn:hover {
          background: #7c3aed;
          color: #ffffff;
        }

        .category-pill-tag {
          background: #f1f5f9;
          color: #475569;
          padding: 3px 9px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: capitalize;
          display: inline-block;
          border: 1px solid #e2e8f0;
        }
        .badge-promo-pill {
          background: #fef3c7;
          color: #854d0e;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 4px;
          display: inline-block;
          border: 1px solid #fde68a;
        }
        .discount-tag {
          color: #16a34a;
          font-weight: 700;
          background: #dcfce7;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.75rem;
          display: inline-block;
        }
        .in-stock-badge {
          background: #dcfce7;
          color: #166534;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 700;
          display: inline-block;
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
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
          width: 100%;
          max-width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }
        .form-field-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          min-width: 0;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }
        .form-field-group.full-width {
          grid-column: 1 / -1;
        }
        .form-field-group label {
          font-size: 0.84rem;
          font-weight: 700;
          color: #334155;
          white-space: normal;
          overflow-wrap: break-word;
        }
        .form-field-group input, 
        .form-field-group select,
        .form-field-group textarea {
          padding: 10px 14px;
          border: 1.5px solid #cbd5e1;
          border-radius: 8px;
          font-size: 0.88rem;
          outline: none;
          width: 100%;
          max-width: 100%;
          min-width: 0;
          box-sizing: border-box;
          background: #ffffff;
        }
        .form-field-group select {
          text-overflow: ellipsis;
        }
        .form-field-group input:focus, 
        .form-field-group select:focus,
        .form-field-group textarea:focus {
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

        /* Feature Toggles Styles */
        .feature-toggles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 14px;
          margin-top: 14px;
          width: 100%;
          max-width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }
        .feature-toggle-card {
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          transition: all 0.2s ease;
          min-width: 0;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }
        .feature-toggle-card:hover {
          border-color: #cbd5e1;
          background: #ffffff;
          box-shadow: 0 4px 12px rgba(0,0,0,0.04);
        }
        .toggle-card-info {
          flex: 1;
          min-width: 0;
        }
        .toggle-card-title-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }
        .toggle-card-title-row strong {
          font-size: 0.9rem;
          color: #0f172a;
          font-weight: 700;
        }
        .toggle-icon {
          color: #a24e23;
          flex-shrink: 0;
        }
        .toggle-card-info p {
          font-size: 0.78rem;
          color: #64748b;
          margin: 0;
          line-height: 1.4;
        }

        /* Modern Toggle Switch Component */
        .switch-toggle {
          position: relative;
          display: inline-block;
          width: 48px;
          height: 26px;
          flex-shrink: 0;
          cursor: pointer;
        }
        .switch-toggle input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #cbd5e1;
          transition: .3s ease;
          border-radius: 34px;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 20px;
          width: 20px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .3s ease;
          border-radius: 50%;
          box-shadow: 0 1px 3px rgba(0,0,0,0.25);
        }
        .switch-toggle input:checked + .slider {
          background-color: #16a34a;
        }
        .switch-toggle input:checked + .slider:before {
          transform: translateX(22px);
        }

        /* Payment Settings & Gateways Grid */
        .payment-settings-cards-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 14px;
        }
        .payment-config-card {
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          padding: 18px 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.03);
          transition: all 0.2s ease;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          min-width: 0;
          overflow: hidden;
        }
        .payment-config-card.active-config {
          border-color: #cbd5e1;
        }
        .payment-config-card.inactive-config {
          opacity: 0.65;
          background: #f8fafc;
          border-style: dashed;
        }
        .payment-config-card:hover {
          box-shadow: 0 6px 18px rgba(0,0,0,0.06);
          border-color: #a24e23;
        }
        .payment-config-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 14px;
          border-bottom: 1px solid #f1f5f9;
          margin-bottom: 14px;
        }
        .payment-config-title-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .config-icon-circle {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .config-icon-circle.upi { background: #dcfce7; color: #15803d; }
        .config-icon-circle.card { background: #e0f2fe; color: #0284c7; }
        .config-icon-circle.emi { background: #fef3c7; color: #b45309; }
        .config-icon-circle.net { background: #f1f5f9; color: #475569; }
        .config-icon-circle.cod { background: #ffedd5; color: #c2410c; }

        .payment-config-title-wrap strong {
          display: block;
          font-size: 0.94rem;
          color: #0f172a;
          margin-bottom: 2px;
        }
        .pay-tag-badge {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 12px;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }
        .pay-tag-badge.green { background: #dcfce7; color: #166534; }
        .pay-tag-badge.blue { background: #e0f2fe; color: #0369a1; }
        .pay-tag-badge.brown { background: #fef3c7; color: #92400e; }
        .pay-tag-badge.slate { background: #f1f5f9; color: #334155; }
        .pay-tag-badge.amber { background: #ffedd5; color: #9a3412; }

        .config-fields-two-col {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 14px;
          width: 100%;
          max-width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }

        /* Inline Order Payment Status Selector in Orders Table */
        .order-pay-status-select {
          font-size: 0.76rem;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 6px;
          border: 1px solid #cbd5e1;
          background: #ffffff;
          color: #1e293b;
          cursor: pointer;
          outline: none;
          max-width: 170px;
          transition: all 0.2s ease;
        }
        .order-pay-status-select:focus {
          border-color: #854d0e;
          box-shadow: 0 0 0 2px rgba(133, 77, 14, 0.15);
        }

        @media (max-width: 900px) {
          .config-fields-two-col,
          .settings-form-grid,
          .content-form-grid,
          .feature-toggles-grid {
            grid-template-columns: 1fr !important;
            gap: 12px;
          }
          .payment-config-card {
            padding: 14px 12px;
          }
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
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          min-width: 0;
          overflow: hidden;
        }
        .password-change-box .settings-form-grid {
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          margin-bottom: 12px;
          gap: 12px;
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

        /* -------------------------------------------------------------
           ADMIN MOBILE BOTTOM NAVBAR (Matches Reference Image)
           Curved White Dock with Elevated Center Floating Purple Action Button
           ------------------------------------------------------------- */
        .admin-mobile-bottom-nav {
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

        .admin-portal-wrapper.drawer-open .admin-mobile-bottom-nav,
        .admin-mobile-bottom-nav.nav-hidden {
          transform: translateY(140%) !important;
          pointer-events: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
        }

        .admin-mob-nav-btn {
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

        .admin-mob-nav-btn span {
          font-size: 0.63rem;
          line-height: 1.1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .admin-mob-nav-btn:hover,
        .admin-mob-nav-btn.active {
          color: #7c3aed;
        }

        .admin-mob-nav-btn.active span {
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

        .admin-mob-btn-icon-wrap {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .admin-mob-badge-dot {
          position: absolute;
          top: -2px;
          right: -4px;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #d97706;
          border: 1.5px solid #ffffff;
        }
        .admin-mob-badge-dot.gold {
          background: #f59e0b;
          color: #ffffff;
          font-size: 0.52rem;
          font-weight: 800;
          min-width: 14px;
          height: 14px;
          border-radius: 7px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 2px;
          top: -4px;
          right: -8px;
        }
        .admin-mob-badge-dot.purple {
          background: #7c3aed;
        }

        /* Center Elevated Floating Purple Button Container */
        .admin-mob-center-wrapper {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: -16px;
          z-index: 1010;
          flex: 1;
          max-width: 58px;
        }

        .admin-mob-elevated-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
          color: #ffffff;
          border: 3.5px solid #ffffff;
          box-shadow: 0 4px 14px rgba(109, 40, 217, 0.38), 0 2px 5px rgba(0, 0, 0, 0.06);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.22s ease;
        }

        .admin-mob-elevated-btn:hover {
          transform: translateY(-2px) scale(1.06);
          box-shadow: 0 12px 28px rgba(109, 40, 217, 0.55);
        }

        .admin-mob-elevated-btn.active {
          background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%);
          box-shadow: 0 10px 26px rgba(109, 40, 217, 0.6), 0 0 0 4px rgba(139, 92, 246, 0.25);
          transform: translateY(-2px) scale(1.08);
        }

        .elevated-folder-icon {
          color: #ffffff;
          fill: rgba(255, 255, 255, 0.15);
        }

        .admin-mob-center-label {
          font-size: 0.65rem;
          font-weight: 700;
          color: #64748b;
          margin-top: 2px;
          transition: color 0.2s ease;
        }
        .admin-mob-center-label.active {
          color: #7c3aed;
          font-weight: 800;
        }

        @media (max-width: 900px) {
          .admin-sidebar {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            width: 270px;
            max-width: 82vw;
            z-index: 99999 !important;
            transform: translateX(-100%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 4px 0 24px rgba(0, 0, 0, 0.35);
            padding-bottom: 95px !important;
            overflow-y: auto;
          }
          .admin-sidebar.mobile-open {
            transform: translateX(0) !important;
          }
          .mobile-close-sidebar {
            display: block;
          }
          .admin-mobile-backdrop {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.55);
            backdrop-filter: blur(3px);
            -webkit-backdrop-filter: blur(3px);
            z-index: 99990 !important;
          }
          .admin-mobile-bottom-nav {
            display: flex;
          }
          .admin-main-viewport {
            padding-bottom: 110px !important;
          }
          .date-range-badge {
            display: none !important;
          }
        }

        @media (max-width: 1024px) {
          .table-scroll-hint-bar {
            display: block;
          }
        }

        @media (max-width: 768px) {
          .subpage-filters-bar {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 8px;
            width: 100%;
            flex-wrap: nowrap;
          }
          .filter-search-box {
            flex: 1;
            min-width: 0;
            max-width: none;
            width: auto;
            padding: 7px 10px;
            height: 38px;
            box-sizing: border-box;
          }
          .filter-search-box input {
            font-size: 0.82rem;
          }
          .filter-dropdown-wrap {
            position: relative;
            width: 38px;
            height: 38px;
            min-width: 38px;
            max-width: 38px;
            padding: 0;
            border-radius: 9px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            background: #ffffff;
            border: 1px solid #cbd5e1;
            cursor: pointer;
            box-sizing: border-box;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
          }
          .filter-dropdown-wrap.active {
            background: #f5f3ff;
            border-color: #8b5cf6;
            color: #7c3aed;
            box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.15);
          }
          .filter-dropdown-wrap svg {
            color: #475569;
            pointer-events: none;
            flex-shrink: 0;
          }
          .filter-dropdown-wrap.active svg {
            color: #7c3aed;
          }
          .filter-dropdown-wrap select {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            cursor: pointer;
            -webkit-appearance: menulist-button;
            appearance: menulist-button;
            z-index: 2;
          }
          .filter-active-dot {
            position: absolute;
            top: 3px;
            right: 3px;
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: #7c3aed;
            border: 1.5px solid #ffffff;
            z-index: 3;
            pointer-events: none;
          }
          .filter-stats-badge {
            display: none;
          }
          .subpage-header-row {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
          }
          .subpage-header-row h3 {
            font-size: 1.25rem;
          }
          .add-quick-product-btn {
            width: 100%;
            justify-content: center;
            padding: 10px 16px;
          }
          /* Switch product, invoices, orders and dashboard tables to luxury responsive mobile cards */
          .product-table-desktop,
          .invoices-table-desktop,
          .orders-table-desktop,
          .dashboard-table-desktop {
            display: none !important;
          }
          .products-mobile-cards-list,
          .invoices-mobile-cards-list,
          .orders-mobile-cards-list,
          .dashboard-mobile-cards-list {
            display: flex !important;
            flex-direction: column;
            gap: 10px;
          }
          .table-scroll-hint-bar {
            display: none !important;
          }
        }

        @media (max-width: 1200px) {
          .date-range-badge {
            display: none !important;
          }
        }

        @media (max-width: 1024px) {
          .avatar-meta {
            display: none !important;
          }
          .admin-avatar-card {
            border-left: none;
            padding-left: 4px;
          }
          .header-search-box {
            max-width: 200px;
          }
          .header-right-group {
            gap: 8px;
          }
        }

        @media (max-width: 900px) {
          .desk-only-text {
            display: none !important;
          }
          .admin-header-title-badge small {
            display: none !important;
          }
          .header-search-box {
            max-width: 160px;
          }
        }

        @media (max-width: 768px) {
          .header-search-box {
            display: none !important;
          }
          .admin-top-header {
            padding: 0 14px;
          }
        }

        @media (max-width: 640px) {
          .admin-top-header {
            padding: 0 10px;
            height: 56px;
            position: sticky;
            top: 0;
            z-index: 950;
            background: rgba(255, 255, 255, 0.98);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            gap: 8px;
          }
          .header-left-group {
            gap: 8px;
            flex: 1;
            min-width: 0;
          }
          .header-search-box {
            display: none !important;
          }
          .admin-header-title-badge strong {
            font-size: 0.84rem;
          }
          .admin-header-title-badge small {
            display: none !important;
          }
          .header-right-group {
            gap: 6px;
            flex-shrink: 0;
          }
          .desk-only-text {
            display: none !important;
          }
          .admin-header-nav-pill, .admin-header-store-btn {
            padding: 5px 8px;
            font-size: 0.76rem;
            gap: 4px;
          }
          .notification-bell-btn {
            width: 32px;
            height: 32px;
          }
          .avatar-circle {
            width: 32px;
            height: 32px;
            font-size: 0.85rem;
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
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
          }
          .kpi-card {
            padding: 10px 12px;
            gap: 10px;
          }
          .kpi-icon-wrap {
            width: 36px;
            height: 36px;
          }
          .kpi-number {
            font-size: 1.15rem;
          }
          /* Invoices KPI Grid on Mobile: Crisp 2x2 grid */
          .invoices-kpi-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 8px !important;
            margin-bottom: 14px !important;
          }
          .invoice-kpi-card {
            padding: 9px 10px !important;
            gap: 8px !important;
          }
          .invoice-kpi-icon {
            width: 32px !important;
            height: 32px !important;
            border-radius: 8px !important;
          }
          .invoice-kpi-label {
            font-size: 0.65rem !important;
          }
          .invoice-kpi-val {
            font-size: 1.05rem !important;
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
          .dialog-card,
          .admin-dialog-card {
            width: 95vw !important;
            max-width: 95vw !important;
            max-height: 90vh !important;
            overflow-y: auto !important;
            padding: 14px !important;
            margin: auto !important;
          }
          .dialog-grid {
            grid-template-columns: 1fr !important;
            gap: 10px !important;
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
            display: flex;
            flex-direction: row;
            gap: 10px;
            margin-top: 12px;
          }
          .subpage-header-actions button,
          .subpage-header-actions a {
            flex: 1;
            justify-content: center;
            padding: 9px 12px;
            font-size: 0.82rem;
          }
          .filter-controls-row {
            flex-direction: column;
            align-items: stretch;
            gap: 8px;
          }
        }

        /* -------------------------------------------------------------
           SHOWROOM POS BILLING & TAX INVOICE STYLES
           ------------------------------------------------------------- */
        .pos-billing-screen {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 24px;
          margin: 20px;
        }

        .pos-customer-top-card {
          padding: 16px 20px;
          margin-bottom: 20px;
        }

        .pos-customer-compact-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          align-items: end;
        }

        .pos-billing-layout-grid {
          display: grid;
          grid-template-columns: 1.18fr 0.92fr;
          gap: 22px;
          align-items: start;
        }

        .pos-col-catalog {
          min-width: 0;
        }

        .pos-col-bill {
          position: sticky;
          top: 20px;
          min-width: 0;
        }

        .pos-card-box {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.03);
        }

        .pos-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 10px;
          border-bottom: 1px solid #f1f5f9;
          padding-bottom: 12px;
        }

        .pos-card-header h4 {
          margin: 0;
          font-size: 1.05rem;
          font-weight: 800;
          color: #0f172a;
        }

        .pos-mode-toggle {
          display: inline-flex;
          background: #f1f5f9;
          padding: 3px;
          border-radius: 8px;
        }

        .pos-mode-btn {
          padding: 5px 12px;
          border: none;
          background: transparent;
          font-size: 0.78rem;
          font-weight: 700;
          color: #64748b;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .pos-mode-btn.active {
          background: #ffffff;
          color: #7c3aed;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        }

        .pos-input-select {
          width: 100%;
          padding: 10px 14px;
          border: 1.5px solid #cbd5e1;
          border-radius: 8px;
          font-size: 0.88rem;
          font-weight: 600;
          color: #0f172a;
          outline: none;
          background: #f8fafc;
        }

        .pos-input-select:focus {
          border-color: #7c3aed;
          background: #ffffff;
        }

        .pos-form-two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .pos-form-field {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .pos-form-field.full {
          grid-column: 1 / -1;
        }

        .pos-form-field label {
          font-size: 0.78rem;
          font-weight: 700;
          color: #475569;
        }

        .pos-form-field input {
          padding: 9px 12px;
          border: 1.5px solid #cbd5e1;
          border-radius: 8px;
          font-size: 0.86rem;
          outline: none;
          background: #ffffff;
          color: #0f172a;
        }

        .pos-form-field input:focus {
          border-color: #7c3aed;
        }

        .pos-custom-item-btn {
          background: #f5f3ff;
          color: #7c3aed;
          border: 1px solid #ddd6fe;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.78rem;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .pos-custom-item-btn:hover {
          background: #ede9fe;
        }

        .pos-catalog-search-row {
          margin-bottom: 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .pos-category-pills-row {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 4px;
        }

        .pos-cat-pill {
          padding: 5px 12px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          border-radius: 20px;
          font-size: 0.76rem;
          font-weight: 700;
          color: #64748b;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
        }

        .pos-cat-pill.active {
          background: #7c3aed;
          color: #ffffff;
          border-color: #7c3aed;
        }

        .pos-products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 12px;
          max-height: 480px;
          overflow-y: auto;
          padding-right: 4px;
        }

        .pos-product-item-card {
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          transition: all 0.2s;
        }

        .pos-product-item-card:hover {
          border-color: #cbd5e1;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .pos-product-item-card.selected {
          border-color: #7c3aed;
          background: #faf8ff;
        }

        .pos-prod-img-wrap {
          position: relative;
          width: 100%;
          height: 100px;
          border-radius: 8px;
          overflow: hidden;
          background: #f1f5f9;
        }

        .pos-prod-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .pos-prod-cat-badge {
          position: absolute;
          top: 6px;
          left: 6px;
          background: rgba(15, 23, 42, 0.75);
          color: #ffffff;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
          text-transform: capitalize;
        }

        .pos-prod-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
        }

        .pos-prod-name {
          font-size: 0.8rem;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.25;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .pos-prod-price {
          font-size: 0.88rem;
          font-weight: 800;
          color: #7c3aed;
        }

        .pos-stock-tag {
          font-size: 0.68rem;
          color: #166534;
          font-weight: 600;
        }

        .pos-add-btn {
          width: 100%;
          padding: 7px 10px;
          border-radius: 6px;
          border: 1px solid #7c3aed;
          background: #ffffff;
          color: #7c3aed;
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          transition: all 0.2s;
        }

        .pos-add-btn:hover {
          background: #7c3aed;
          color: #ffffff;
        }

        .pos-add-btn.in-bill {
          background: #dcfce7;
          color: #166534;
          border-color: #86efac;
        }

        /* Bill Summary & Items List */
        .pos-clear-items-btn {
          background: none;
          border: none;
          color: #ef4444;
          font-size: 0.76rem;
          font-weight: 700;
          cursor: pointer;
        }

        .pos-clear-items-btn:hover {
          text-decoration: underline;
        }

        .pos-empty-bill-state {
          text-align: center;
          padding: 36px 16px;
          color: #94a3b8;
        }

        .pos-empty-icon {
          color: #cbd5e1;
          margin-bottom: 8px;
        }

        .pos-bill-items-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-height: 260px;
          overflow-y: auto;
          margin-bottom: 16px;
          padding-right: 4px;
        }

        .pos-bill-item-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          background: #f8fafc;
          border: 1px solid #f1f5f9;
          border-radius: 8px;
        }

        .pos-bill-thumb {
          width: 38px;
          height: 38px;
          border-radius: 6px;
          object-fit: cover;
          flex-shrink: 0;
        }

        .pos-bill-item-details {
          flex: 1;
          min-width: 0;
        }

        .pos-item-title {
          font-size: 0.8rem;
          font-weight: 700;
          color: #0f172a;
          display: block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .pos-item-rate {
          font-size: 0.72rem;
          color: #64748b;
        }

        .pos-qty-controls {
          display: flex;
          align-items: center;
          gap: 4px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          padding: 2px 4px;
        }

        .pos-qty-btn {
          background: none;
          border: none;
          color: #475569;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 2px;
        }

        .pos-qty-btn:hover {
          color: #0f172a;
        }

        .pos-qty-val {
          font-size: 0.8rem;
          font-weight: 800;
          color: #0f172a;
          min-width: 18px;
          text-align: center;
        }

        .pos-item-row-total {
          font-size: 0.84rem;
          color: #0f172a;
          min-width: 65px;
          text-align: right;
        }

        .pos-item-del-btn {
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
        }

        .pos-item-del-btn:hover {
          color: #ef4444;
        }

        /* Calculations */
        .pos-calculations-box {
          border-top: 1px solid #e2e8f0;
          padding-top: 14px;
          margin-top: 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .pos-calc-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.84rem;
          color: #475569;
        }

        .pos-mini-num-input {
          width: 90px;
          padding: 4px 8px;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          text-align: right;
          font-size: 0.82rem;
          font-weight: 700;
          outline: none;
        }

        .pos-mini-num-input:focus {
          border-color: #7c3aed;
        }

        .pos-grand-total-banner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
          border: 1.5px solid #ddd6fe;
          border-radius: 10px;
          padding: 12px 14px;
          margin-top: 8px;
        }

        .pos-total-label {
          font-size: 0.92rem;
          font-weight: 800;
          color: #5b21b6;
          display: block;
        }

        .pos-tax-note {
          font-size: 0.68rem;
          color: #7c3aed;
          font-weight: 600;
        }

        .pos-total-amount {
          font-size: 1.45rem;
          font-weight: 900;
          color: #4c1d95;
        }

        /* Payment methods grid */
        .pos-payment-section {
          border-top: 1px solid #e2e8f0;
          padding-top: 14px;
          margin-top: 14px;
        }

        .pos-payment-methods-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        .pos-pay-opt-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 10px;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.74rem;
          font-weight: 700;
          color: #475569;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s;
        }

        .pos-pay-opt-btn .pay-check-icon {
          color: #cbd5e1;
          flex-shrink: 0;
        }

        .pos-pay-opt-btn.active {
          background: #faf5ff;
          border-color: #7c3aed;
          color: #7c3aed;
        }

        .pos-pay-opt-btn.active .pay-check-icon {
          color: #7c3aed;
        }

        /* Actions */
        .pos-actions-row {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 18px;
        }

        .pos-primary-submit-btn {
          width: 100%;
          padding: 12px 16px;
          background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
          color: #ffffff;
          border: none;
          border-radius: 10px;
          font-size: 0.95rem;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 6px 20px rgba(109, 40, 217, 0.35);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .pos-primary-submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(109, 40, 217, 0.45);
        }

        .pos-secondary-submit-btn {
          width: 100%;
          padding: 10px 16px;
          background: #f1f5f9;
          color: #334155;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          font-size: 0.86rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.2s;
        }

        .pos-secondary-submit-btn:hover {
          background: #e2e8f0;
          color: #0f172a;
        }

        @media (max-width: 1024px) {
          .pos-billing-layout-grid {
            grid-template-columns: 1fr;
          }
          .pos-col-bill {
            position: static;
          }
          .pos-customer-compact-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .pos-payment-methods-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .pos-billing-screen {
            padding: 12px 8px;
            margin: 6px 4px;
            border-radius: 12px;
          }
          .pos-card-box {
            padding: 12px 10px;
            margin-bottom: 12px;
            border-radius: 10px;
          }
          .pos-customer-compact-grid {
            grid-template-columns: 1fr;
            gap: 8px;
          }
          .pos-form-two-col {
            grid-template-columns: 1fr;
            gap: 8px;
          }
          .pos-payment-methods-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 6px;
          }
          .pos-pay-opt-btn {
            padding: 7px 8px;
            font-size: 0.72rem;
          }
          .pos-products-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
            max-height: 360px;
          }
          .pos-product-item-card {
            padding: 8px;
          }
          .pos-prod-img-wrap {
            height: 85px;
          }
          .pos-prod-name {
            font-size: 0.76rem;
          }
          .pos-prod-price {
            font-size: 0.82rem;
          }
          .pos-add-btn {
            padding: 6px 6px;
            font-size: 0.72rem;
          }
          .pos-bill-item-row {
            padding: 8px;
            gap: 8px;
            flex-wrap: wrap;
          }
          .pos-bill-thumb {
            width: 34px;
            height: 34px;
          }
          .pos-bill-item-details {
            flex: 1 1 120px;
            min-width: 110px;
          }
          .pos-item-title {
            font-size: 0.78rem;
          }
          .pos-qty-controls {
            padding: 2px 4px;
          }
          .pos-item-row-total {
            font-size: 0.82rem;
            min-width: auto;
          }
          .pos-grand-total-banner {
            padding: 10px 12px;
          }
          .pos-total-amount {
            font-size: 1.25rem;
          }
          .pos-primary-submit-btn {
            font-size: 0.88rem;
            padding: 11px 12px;
          }
          .pos-secondary-submit-btn {
            font-size: 0.82rem;
            padding: 9px 12px;
          }
          .pos-customer-top-card .pos-card-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
          .pos-mode-toggle {
            width: 100%;
          }
          .pos-mode-btn {
            flex: 1;
            text-align: center;
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
