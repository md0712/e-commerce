import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, User, Phone, Mail, MapPin, CreditCard, 
  CheckCircle2, Truck, ShieldCheck, FileText, Printer, Download,
  QrCode, ArrowLeft, Trash2, Plus, Minus, Tag, Building, 
  Clock, Sparkles, Percent, MessageCircle, Lock, AlertCircle,
  Check, ArrowRight, ExternalLink, Search, Package, Receipt,
  RefreshCw
} from 'lucide-react';
import { products as initialProducts, storeInfo } from '../data/products';

export default function Billing({ 
  cart = [], 
  products = [],
  onAddToCart,
  onUpdateQuantity, 
  onRemoveFromCart, 
  onClearCart, 
  onPlaceOrder, 
  onNavigate,
  onViewInvoice,
  onOpenTrackOrder,
  storeSettings
}) {
  // Billing Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    landmark: '',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600001',
    deliverySlot: 'morning',
    specialNotes: '',
    paymentMethod: 'upi',
    upiId: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    cardName: '',
    selectedEmiMonths: 6,
    selectedBank: 'sbi'
  });

  // Catalog Picker state
  const catalogList = (products && products.length > 0) ? products : initialProducts;
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogCat, setCatalogCat] = useState('all');

  // Manage Bill Items (initialized from cart or fallback)
  const [billItems, setBillItems] = useState(cart && cart.length > 0 ? cart : []);

  // Sync billItems whenever cart changes
  useEffect(() => {
    if (cart && cart.length > 0) {
      setBillItems(cart);
    }
  }, [cart]);

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState('');

  // Order submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  // Currency Formatter
  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  // Calculations
  const subtotal = billItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const taxableAmount = Math.round(subtotal / 1.18);
  const gstAmount = subtotal - taxableAmount;
  const cgst = Math.round(gstAmount / 2);
  const sgst = gstAmount - cgst;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  // EMI Calculation helper (0% interest for demo showroom promotion)
  const calculateEmi = (months) => {
    return Math.round(finalTotal / months);
  };

  // Form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 1-Click Add product to bill from catalog
  const handleAddProductToBill = (prod) => {
    const existing = billItems.find(item => item.id === prod.id);
    if (existing) {
      const newQty = existing.quantity + 1;
      setBillItems(prev => prev.map(item => item.id === prod.id ? { ...item, quantity: newQty } : item));
      if (onUpdateQuantity) onUpdateQuantity(prod.id, newQty);
    } else {
      const newItem = {
        id: prod.id,
        name: prod.name,
        price: prod.price,
        quantity: 1,
        image: prod.image,
        category: prod.category || 'furniture'
      };
      setBillItems(prev => [...prev, newItem]);
      if (onAddToCart) {
        onAddToCart(newItem, 1);
      } else if (onUpdateQuantity) {
        onUpdateQuantity(prod.id, 1);
      }
    }
  };

  // Update item quantity in bill
  const handleUpdateItemQty = (id, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(id);
      return;
    }
    setBillItems(prev => prev.map(item => item.id === id ? { ...item, quantity: newQty } : item));
    if (onUpdateQuantity) onUpdateQuantity(id, newQty);
  };

  // Remove item from bill
  const handleRemoveItem = (id) => {
    setBillItems(prev => prev.filter(item => item.id !== id));
    if (onRemoveFromCart) onRemoveFromCart(id);
  };

  // Clear all items in bill
  const handleClearAllBillItems = () => {
    setBillItems([]);
    if (onClearCart) onClearCart();
  };

  // Add custom line item (e.g. assembly, carpentry, custom warranty)
  const handleAddCustomLineItem = () => {
    const customName = window.prompt('Enter Custom Item or Service Name:', 'Custom Woodwork & Assembly');
    if (!customName || !customName.trim()) return;
    const priceStr = window.prompt('Enter Unit Price (₹):', '1500');
    const customPrice = Math.max(0, Number(priceStr) || 0);
    const customItem = {
      id: `custom-${Date.now()}`,
      name: customName.trim(),
      price: customPrice,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=200&q=80',
      category: 'services'
    };
    setBillItems(prev => [...prev, customItem]);
    if (onAddToCart) {
      onAddToCart(customItem, 1);
    } else if (onUpdateQuantity) {
      onUpdateQuantity(customItem.id, 1);
    }
  };

  // 1-Click Autofill Demo Customer
  const handleAutofillDemoClient = () => {
    setFormData(prev => ({
      ...prev,
      name: 'Priya Sharma',
      phone: '9840123456',
      email: 'priya.sharma@example.com',
      address: 'Plot 42, Green Park Avenue, Anna Nagar',
      landmark: 'Near Roundtana Metro Station',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600040',
      specialNotes: 'Showroom Counter Billing - Please arrange express white-glove delivery.'
    }));
  };

  // Apply Coupon
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    if (code === 'SARDAR5000') {
      if (subtotal < 30000) {
        setCouponError('Coupon SARDAR5000 is valid on orders above ₹30,000');
        return;
      }
      setDiscountAmount(5000);
      setAppliedCoupon('SARDAR5000');
    } else if (code === 'FESTIVE10') {
      const disc = Math.round(subtotal * 0.10);
      setDiscountAmount(disc);
      setAppliedCoupon('FESTIVE10 (10% OFF)');
    } else if (code === 'WELCOME') {
      setDiscountAmount(1500);
      setAppliedCoupon('WELCOME (₹1,500 OFF)');
    } else {
      setCouponError('Invalid coupon code. Try: SARDAR5000, FESTIVE10, or WELCOME');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponCode('');
    setCouponError('');
  };

  // Add sample demo items if bill is empty
  const handleAddSampleItems = () => {
    const sampleItems = [
      {
        id: 'f1',
        name: 'Royal Velvet 3-Seater Living Room Sofa',
        category: 'furniture',
        price: 34999,
        originalPrice: 48999,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'e1',
        name: '55" Ultra HD 4K Smart OLED TV',
        category: 'electronics',
        price: 54999,
        originalPrice: 79999,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=600&q=80'
      }
    ];
    setBillItems(sampleItems);
    sampleItems.forEach(item => {
      if (onAddToCart) {
        onAddToCart(item, item.quantity);
      } else if (onUpdateQuantity) {
        onUpdateQuantity(item.id, item.quantity);
      }
    });
  };

  // Handle Order Submission
  const handleSubmitOrder = (e) => {
    e.preventDefault();

    if (billItems.length === 0) {
      alert('⚠️ Your bill is currently empty. Please select at least one product from the Showroom Catalog below.');
      return;
    }

    if (!formData.name.trim()) {
      alert('Please enter customer full name for billing.');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      alert('Please enter a valid 10-digit mobile number for dispatch updates and tax invoice.');
      return;
    }
    if (!formData.address.trim()) {
      alert('Please enter complete street delivery address (or enter "Showroom Walk-in Counter").');
      return;
    }

    setIsSubmitting(true);

    const orderId = `SM-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }) + ', ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    let readablePaymentMethod = 'UPI (Instant QR / App)';
    if (formData.paymentMethod === 'card') readablePaymentMethod = 'Credit / Debit Card (256-bit Encrypted)';
    if (formData.paymentMethod === 'emi') readablePaymentMethod = `0% No-Cost EMI (${formData.selectedEmiMonths} Months @ ${formatPrice(calculateEmi(formData.selectedEmiMonths))}/mo)`;
    if (formData.paymentMethod === 'netbanking') readablePaymentMethod = `Net Banking (${formData.selectedBank.toUpperCase()})`;
    if (formData.paymentMethod === 'cod') readablePaymentMethod = 'Cash on Delivery / Showroom Handover';

    const newOrder = {
      id: orderId,
      date: formattedDate,
      customer: {
        name: formData.name,
        phone: formData.phone,
        email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
        address: `${formData.address}${formData.landmark ? ', Near ' + formData.landmark : ''}`,
        city: formData.city || 'Chennai',
        state: formData.state || 'Tamil Nadu',
        pincode: formData.pincode || '600001'
      },
      items: billItems.map(i => ({
        id: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        image: i.image,
        category: i.category || 'furniture'
      })),
      subtotal,
      discount: discountAmount,
      taxableAmount,
      cgst,
      sgst,
      gstAmount,
      delivery: 0,
      total: finalTotal,
      paymentMethod: readablePaymentMethod,
      paymentStatus: formData.paymentMethod === 'cod' 
        ? (storeSettings?.codDefaultStatus || 'Pending (Pay on Assembly)') 
        : formData.paymentMethod === 'emi'
        ? (storeSettings?.emiDefaultStatus || 'EMI Pre-Approved (Doorstep KYC)')
        : formData.paymentMethod === 'netbanking'
        ? (storeSettings?.netBankingDefaultStatus || 'Paid Online (Verified)')
        : formData.paymentMethod === 'card'
        ? (storeSettings?.cardDefaultStatus || 'Paid Online (Verified)')
        : (storeSettings?.upiDefaultStatus || 'Paid Online (Verified)'),
      status: 'Order Placed',
      courier: 'Sardar Mart Express Delivery Fleet',
      deliverySlot: formData.deliverySlot,
      trackingNumber: `SM-EXP-${Math.floor(10000 + Math.random() * 90000)}`,
      notes: formData.specialNotes || 'Showroom POS billing with white-glove handover.'
    };

    setTimeout(() => {
      if (onPlaceOrder) onPlaceOrder(newOrder);
      if (onClearCart) onClearCart();
      setPlacedOrder(newOrder);
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Immediately open official Tax Invoice Modal for on-screen print & view
      if (onViewInvoice) {
        onViewInvoice(newOrder);
      }
    }, 600);
  };

  // WhatsApp Order Forwarding
  const handleSendOrderOnWhatsApp = (order) => {
    const itemsList = order.items
      .map(i => `• ${i.name} (Qty: ${i.quantity}) - ${formatPrice(i.price * i.quantity)}`)
      .join('%0A');

    const msg = encodeURIComponent(
      `Hello Sardar Mart Team!%0A%0AI have placed an order:%0A*Order Bill No:* #${order.id}%0A*Customer Name:* ${order.customer.name}%0A*Phone:* ${order.customer.phone}%0A*Delivery City:* ${order.customer.city} (${order.customer.pincode})%0A%0A*Items:*%0A${itemsList}%0A%0A*Grand Total:* ${formatPrice(order.total)}%0A*Payment Mode:* ${order.paymentMethod}%0A${storeSettings?.showGstinBadge ? `*GSTIN:* ${storeSettings?.gstNumber || '33DVKPR2334L1Z9'}%0A` : ''}%0APlease confirm my delivery schedule and dispatch timing!`
    );

    window.open(`https://wa.me/919876543210?text=${msg}`, '_blank');
  };

  // Download Official Tax Invoice File (Instant HTML/PDF Download + Print Modal)
  const handleDownloadInvoiceFile = (order) => {
    if (!order) return;

    const itemsRows = (order.items || []).map((it, idx) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center;">${idx + 1}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">
          <strong>${it.name}</strong>
          <div style="font-size: 11px; color: #64748b;">Category: ${it.category || 'Retail Goods'}</div>
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center;">${it.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right;">${formatPrice(it.price)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 700;">${formatPrice(it.price * it.quantity)}</td>
      </tr>
    `).join('');

    const invoiceDoc = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Tax_Invoice_${order.id}_Sardar_Mart</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; margin: 0; padding: 24px; color: #1e293b; background: #f8fafc; }
    .invoice-wrapper { max-width: 820px; margin: 0 auto; background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
    .header-row { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #5c2c16; padding-bottom: 20px; margin-bottom: 24px; }
    .brand-h1 { font-size: 26px; font-weight: 800; color: #5c2c16; margin: 0; }
    .brand-sub { font-size: 12px; font-weight: 700; color: #b45309; letter-spacing: 1px; margin-top: 2px; }
    .brand-addr { font-size: 12px; color: #64748b; margin-top: 8px; line-height: 1.4; }
    .invoice-right { text-align: right; }
    .invoice-title { font-size: 20px; font-weight: 800; color: #5c2c16; }
    .invoice-ref { font-size: 14px; font-weight: 700; color: #0f172a; margin-top: 4px; }
    .invoice-date { font-size: 12px; color: #64748b; margin-top: 2px; }
    .gst-tag { display: inline-block; background: #dcfce7; color: #166534; font-size: 11px; font-weight: 700; padding: 4px 8px; border-radius: 4px; margin-top: 8px; border: 1px solid #bbf7d0; }
    .grid-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
    .col-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; font-size: 13px; line-height: 1.5; }
    .col-card-title { font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.5px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 13px; }
    th { background: #f1f5f9; padding: 10px; border-bottom: 2px solid #cbd5e1; text-align: left; font-weight: 700; color: #334155; }
    .totals-area { display: flex; justify-content: flex-end; margin-bottom: 24px; }
    .totals-box { width: 340px; font-size: 13px; }
    .totals-line { display: flex; justify-content: space-between; padding: 5px 0; color: #475569; }
    .grand-total-line { display: flex; justify-content: space-between; padding: 10px 0; margin-top: 6px; border-top: 2px solid #5c2c16; font-size: 16px; font-weight: 800; color: #5c2c16; }
    .footer-seal-row { border-top: 1px solid #e2e8f0; padding-top: 18px; display: flex; justify-content: space-between; align-items: flex-end; font-size: 12px; color: #64748b; }
    .seal-box { text-align: center; border: 1.5px dashed #cbd5e1; padding: 10px 20px; border-radius: 8px; background: #fafaf9; }
    @media print {
      body { background: #fff; padding: 0; }
      .invoice-wrapper { border: none; box-shadow: none; padding: 0; }
    }
  </style>
</head>
<body>
  <div class="invoice-wrapper">
    <div class="header-row">
      <div>
        <h1 class="brand-h1">Sardar Mart</h1>
        <div class="brand-sub">FURNITURE &amp; ELECTRONICS</div>
        <div class="brand-addr">
          190, Erukkenchery High Rd, Anbalagan Colony, Vyasarpadi, Chennai, Tamil Nadu 600039<br>
          ${storeSettings?.showGstinBadge ? `GSTIN: <strong>${storeSettings?.gstNumber || '33DVKPR2334L1Z9'}</strong> • ` : ''}Contact: +91 98765 43210
        </div>
      </div>
      <div class="invoice-right">
        <div class="invoice-title">${storeSettings?.showGstinBadge ? 'OFFICIAL TAX INVOICE' : 'OFFICIAL RETAIL INVOICE'}</div>
        <div class="invoice-ref">#${order.id}</div>
        <div class="invoice-date">${order.date}</div>
        ${storeSettings?.showGstinBadge 
          ? '<div class="gst-tag">ORIGINAL TAX INVOICE (GST COMPLIANT)</div>' 
          : '<div class="gst-tag" style="background:#f1f5f9;color:#334155;border-color:#cbd5e1;">OFFICIAL RETAIL BILL</div>'}
      </div>
    </div>

    <div class="grid-cols">
      <div class="col-card">
        <div class="col-card-title">Billed &amp; Delivered To:</div>
        <strong style="font-size: 14px; color: #0f172a;">${order.customer?.name}</strong><br>
        ${order.customer?.address}<br>
        ${order.customer?.city} - ${order.customer?.pincode}, Tamil Nadu<br>
        Phone: <strong>${order.customer?.phone}</strong><br>
        Email: ${order.customer?.email || 'N/A'}
      </div>
      <div class="col-card">
        <div class="col-card-title">Billing &amp; Dispatch Details:</div>
        Payment Method: <strong>${order.paymentMethod}</strong><br>
        Payment Status: <strong>${order.paymentStatus}</strong><br>
        Logistics Fleet: <strong>${order.courier || 'Sardar Mart Express Delivery Fleet'}</strong><br>
        Authorized Signatory: <strong>Rahim Baig</strong> (Proprietor)<br>
        Delivery Notes: ${order.notes || 'Handle with white-glove care and technician assembly.'}
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 40px; text-align: center;">#</th>
          <th>Item Description</th>
          <th style="width: 60px; text-align: center;">Qty</th>
          <th style="width: 120px; text-align: right;">Unit Price</th>
          <th style="width: 130px; text-align: right;">Total Amount</th>
        </tr>
      </thead>
      <tbody>
        ${itemsRows}
      </tbody>
    </table>

    <div class="totals-area">
      <div class="totals-box">
        <div class="totals-line">
          <span>Taxable Value (Goods):</span>
          <span>${formatPrice(order.taxableAmount)}</span>
        </div>
        <div class="totals-line">
          <span>CGST (9%):</span>
          <span>${formatPrice(Math.round((order.gstAmount || 0) / 2))}</span>
        </div>
        <div class="totals-line">
          <span>SGST (9%):</span>
          <span>${formatPrice((order.gstAmount || 0) - Math.round((order.gstAmount || 0) / 2))}</span>
        </div>
        ${order.discount > 0 ? `
          <div class="totals-line" style="color: #15803d; font-weight: 700;">
            <span>Promotional Discount:</span>
            <span>-${formatPrice(order.discount)}</span>
          </div>
        ` : ''}
        <div class="totals-line">
          <span>Delivery &amp; Assembly:</span>
          <span style="color: #15803d; font-weight: 700;">FREE (₹0)</span>
        </div>
        <div class="grand-total-line">
          <span>Total Payable Amount:</span>
          <span>${formatPrice(order.total)}</span>
        </div>
      </div>
    </div>

    <div class="footer-seal-row">
      <div>
        <p style="margin: 0 0 4px; font-weight: 600; color: #1e293b;">Thank you for shopping with Sardar Mart!</p>
        <p style="margin: 0;">1-Year Official Warranty on Furniture Frame &amp; Manufacturer Electronics Warranty.</p>
        <p style="margin: 4px 0 0; font-size: 11px;">${storeSettings?.showGstinBadge ? `GSTIN: ${storeSettings?.gstNumber || '33DVKPR2334L1Z9'} • ` : ''}Computer-generated official invoice verified by Rahim Baig.</p>
      </div>
      <div class="seal-box">
        <strong style="color: #5c2c16; font-size: 13px; display: block;">SARDAR MART</strong>
        <span style="color: #166534; font-size: 10px; font-weight: 700; letter-spacing: 0.5px; display: block; margin: 2px 0;">OFFICIALLY VERIFIED</span>
        <small style="color: #64748b; font-size: 11px;">Authorized Signatory: Rahim Baig</small>
      </div>
    </div>
  </div>
  <script>
    window.onload = function() {
      // Auto trigger print when opened
      // window.print();
    };
  </script>
</body>
</html>`;

    // Trigger instant download of HTML file
    const blob = new Blob([invoiceDoc], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Sardar_Mart_Invoice_${order.id}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Also open on-screen invoice modal for instant PDF printing
    if (onViewInvoice) {
      onViewInvoice(order);
    }
  };

  // SUCCESS VIEW: When order is placed
  if (placedOrder) {
    return (
      <div className="billing-page-wrap">
        <div className="container" style={{ maxWidth: '900px', padding: '40px 16px' }}>
          <div className="order-success-hero animate-fade-in">
            <div className="success-badge-circle">
              <CheckCircle2 size={54} color="#15803d" />
            </div>
            <span className="success-tag">Order Confirmed &amp; Invoiced</span>
            <h1 className="success-title">Thank You, {placedOrder.customer.name}!</h1>
            <p className="success-lead">
              Your order has been officially registered with <strong>Sardar Mart</strong>. Our logistics fleet is preparing your items for white-glove delivery and assembly.
            </p>

            {/* Bill Summary Card */}
            <div className="confirmed-bill-card">
              <div className="bill-card-header">
                <div>
                  <span className="bill-label">TAX INVOICE REFERENCE</span>
                  <h3 className="bill-id">#{placedOrder.id}</h3>
                  <small className="bill-date">{placedOrder.date}</small>
                </div>
                <div className="bill-tax-seal">
                  <ShieldCheck size={22} color="#15803d" className="seal-shield-icon" />
                  <div className="seal-text-group">
                    {storeSettings?.showGstinBadge && (
                      <span className="gstin-code">GSTIN: <strong>33DVKPR2334L1Z9</strong></span>
                    )}
                    <span className="signatory-name">Authorized Signatory: <strong>Rahim Baig</strong></span>
                  </div>
                </div>
              </div>

              {/* PROMINENT TOP DOWNLOAD FILE BUTTON LAYOUT */}
              <div className="invoice-download-cta-banner">
                <div className="download-cta-left">
                  <div className="download-file-icon-box">
                    <FileText size={26} />
                  </div>
                  <div className="download-cta-info">
                    <div className="download-badge-row">
                      <span className="doc-pill">OFFICIAL TAX INVOICE</span>
                      <span className="ready-pill">
                        <span className="pulse-dot"></span> Ready for Download
                      </span>
                    </div>
                    <h4 className="download-doc-title">Invoice #{placedOrder.id} • GST Compliant</h4>
                    <p className="download-doc-subtitle">
                      Download the official computer-generated tax invoice document with GST breakdown, HSN classification, and store warranty.
                    </p>
                  </div>
                </div>

                <div className="download-cta-actions">
                  <button 
                    type="button"
                    className="btn-download-primary"
                    onClick={() => handleDownloadInvoiceFile(placedOrder)}
                    title="Download Official Tax Invoice File (PDF / HTML)"
                  >
                    <Download size={20} className="download-arrow-icon" />
                    <div className="btn-text-column">
                      <strong className="btn-main-title">Download Invoice (PDF)</strong>
                      <small className="btn-sub-caption">Save Official Tax Receipt File</small>
                    </div>
                  </button>

                  <button 
                    type="button"
                    className="btn-print-secondary"
                    onClick={() => onViewInvoice && onViewInvoice(placedOrder)}
                    title="View and Print Invoice in Browser"
                  >
                    <Printer size={17} />
                    <span>View &amp; Print</span>
                  </button>
                </div>
              </div>

              <div className="bill-card-body">
                <div className="bill-grid-row">
                  <div>
                    <span className="b-label">Delivery Address:</span>
                    <p className="b-val">{placedOrder.customer.address}, {placedOrder.customer.city} - {placedOrder.customer.pincode}</p>
                  </div>
                  <div>
                    <span className="b-label">Contact Mobile:</span>
                    <p className="b-val">{placedOrder.customer.phone}</p>
                  </div>
                </div>

                <div className="bill-grid-row" style={{ marginTop: '12px' }}>
                  <div>
                    <span className="b-label">Payment Mode:</span>
                    <p className="b-val">{placedOrder.paymentMethod}</p>
                  </div>
                  <div>
                    <span className="b-label">Logistics Fleet:</span>
                    <p className="b-val">🚚 {placedOrder.courier}</p>
                  </div>
                </div>

                {/* Items Mini List */}
                <div className="bill-items-summary">
                  <h4>Ordered Products ({placedOrder.items.length})</h4>
                  <div className="mini-items-list">
                    {placedOrder.items.map(item => (
                      <div key={item.id} className="mini-item-row">
                        <img src={item.image} alt={item.name} className="mini-item-thumb" />
                        <div className="mini-item-info">
                          <strong>{item.name}</strong>
                          <span>Qty: {item.quantity} × {formatPrice(item.price)}</span>
                        </div>
                        <strong className="mini-item-total">{formatPrice(item.price * item.quantity)}</strong>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Amount Totals */}
                <div className="bill-totals-box">
                  <div className="totals-line">
                    <span>Taxable Value:</span>
                    <span>{formatPrice(placedOrder.taxableAmount)}</span>
                  </div>
                  <div className="totals-line">
                    <span>CGST (9%) + SGST (9%):</span>
                    <span>{formatPrice(placedOrder.gstAmount)}</span>
                  </div>
                  {placedOrder.discount > 0 && (
                    <div className="totals-line discount-line">
                      <span>Promotional Discount:</span>
                      <span>-{formatPrice(placedOrder.discount)}</span>
                    </div>
                  )}
                  <div className="totals-line">
                    <span>White-Glove Delivery &amp; Setup:</span>
                    <span style={{ color: '#15803d', fontWeight: 600 }}>FREE (₹0)</span>
                  </div>
                  <div className="totals-line grand-total-line">
                    <strong>Invoice Total (Incl. Taxes):</strong>
                    <strong className="grand-val">{formatPrice(placedOrder.total)}</strong>
                  </div>
                </div>
              </div>

              {/* Bottom Action Buttons Grid with Download File */}
              <div className="bill-card-actions">
                <button 
                  type="button"
                  className="btn-download-bill-footer"
                  onClick={() => handleDownloadInvoiceFile(placedOrder)}
                  title="Download Tax Invoice File to your device"
                >
                  <Download size={18} />
                  <span>Download Invoice (PDF)</span>
                </button>
                <button 
                  type="button"
                  className="btn-print-bill"
                  onClick={() => onViewInvoice && onViewInvoice(placedOrder)}
                  title="Print Official Tax Invoice"
                >
                  <Printer size={18} />
                  <span>View &amp; Print Invoice</span>
                </button>
                <button 
                  type="button"
                  className="btn-track-bill"
                  onClick={() => onOpenTrackOrder && onOpenTrackOrder(placedOrder.id)}
                  title="Track delivery status live"
                >
                  <Truck size={18} />
                  <span>Track Delivery Status</span>
                </button>
                <button 
                  type="button"
                  className="btn-wa-bill"
                  onClick={() => handleSendOrderOnWhatsApp(placedOrder)}
                  title="Receive order copy on WhatsApp"
                >
                  <MessageCircle size={18} />
                  <span>WhatsApp Order Copy</span>
                </button>
              </div>
            </div>

            <div className="back-to-shop-wrap" style={{ marginTop: '24px', textAlign: 'center' }}>
              <button 
                className="btn-return-home"
                onClick={() => onNavigate && onNavigate('home')}
              >
                ← Continue Browsing Sardar Mart
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="billing-page-wrap">
      {/* 1. Header Banner */}
      <section className="billing-header-banner">
        <div className="container">
          <div className="billing-header-content">
            <div className="header-top-nav">
              <button 
                onClick={() => onNavigate ? onNavigate('furniture') : window.history.back()} 
                className="btn-back-link"
              >
                <ArrowLeft size={16} /> Continue Shopping
              </button>
              {storeSettings?.showGstinBadge && (
                <div className="gst-badge-pill">
                  <ShieldCheck size={16} className="text-emerald" />
                  <span>Govt. Tax Verified • <strong>GSTIN: 33DVKPR2334L1Z9</strong> • Authorized Signatory: Rahim Baig</span>
                </div>
              )}
            </div>

            <h1 className="billing-headline">Showroom POS Billing &amp; Tax Invoicing</h1>
            <p className="billing-sub">
              Create instant showroom bills, browse and add catalog products, calculate GST breakdown, and issue official printable Tax Invoices.
            </p>

            {/* Quick Showroom Actions Bar */}
            <div className="header-quick-actions-row">
              <button
                type="button"
                className="btn-header-quick-action"
                onClick={handleAutofillDemoClient}
                title="Autofill realistic customer contact & address"
              >
                <User size={14} /> ⚡ 1-Click Demo Client
              </button>
              <button
                type="button"
                className="btn-header-quick-action"
                onClick={handleAddSampleItems}
                title="Add 2 sample demo items to bill"
              >
                <Sparkles size={14} /> + Add 2 Demo Items
              </button>
              <button
                type="button"
                className="btn-header-quick-action"
                onClick={handleAddCustomLineItem}
                title="Add custom carpentry, delivery, or warranty charge"
              >
                <Plus size={14} /> + Custom Item / Charge
              </button>
              {billItems.length > 0 && (
                <button
                  type="button"
                  className="btn-header-quick-action action-danger"
                  onClick={handleClearAllBillItems}
                  title="Clear all bill items"
                >
                  <Trash2 size={14} /> Clear Bill
                </button>
              )}
            </div>

            {/* 4-Step Visual Progress Stepper */}
            <div className="checkout-stepper-bar">
              <div className="step-node completed">
                <div className="step-circle"><Check size={14} /></div>
                <span>1. Bill Items</span>
              </div>
              <div className="step-divider active"></div>
              <div className="step-node active">
                <div className="step-circle">2</div>
                <span>2. Customer &amp; Delivery</span>
              </div>
              <div className="step-divider active"></div>
              <div className="step-node active">
                <div className="step-circle">3</div>
                <span>3. Tax &amp; Settlement</span>
              </div>
              <div className="step-divider"></div>
              <div className="step-node">
                <div className="step-circle">4</div>
                <span>4. Print Tax Invoice</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Checkout Layout */}
      <section className="billing-main-section">
        <div className="container">
          <form onSubmit={handleSubmitOrder} className="billing-layout-grid">
            
            {/* LEFT COLUMN: Customer Info, Shipping Address, Catalog Picker, Payment */}
            <div className="billing-left-col">
              
              {/* Section 1: Customer Information */}
              <div className="billing-card-panel">
                <div className="card-panel-head" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div className="panel-icon-wrap">
                      <User size={20} />
                    </div>
                    <div>
                      <h3>1. Customer Contact Details</h3>
                      <p>Used for official GST tax invoice and live delivery alerts</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-autofill-demo-badge"
                    onClick={handleAutofillDemoClient}
                    title="1-Click Autofill sample customer information"
                  >
                    ⚡ Autofill Demo Client
                  </button>
                </div>

                <div className="panel-form-grid">
                  <div className="form-field-item">
                    <label htmlFor="b-name">Full Customer Name <span className="req">*</span></label>
                    <input 
                      id="b-name" 
                      name="name" 
                      type="text" 
                      required 
                      placeholder="e.g. Priya Sharma" 
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                    </div>

                    <div className="form-field-item">
                      <label htmlFor="b-phone">Mobile Phone (WhatsApp Delivery Updates) <span className="req">*</span></label>
                      <input 
                        id="b-phone" 
                        name="phone" 
                        type="tel" 
                        required 
                        placeholder="e.g. 98401 23456" 
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="form-field-item full-width">
                      <label htmlFor="b-email">Email Address (For PDF Tax Invoice Receipt)</label>
                      <input 
                        id="b-email" 
                        name="email" 
                        type="email" 
                        placeholder="e.g. priya.sharma@example.com" 
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Delivery & Shipping Address */}
                <div className="billing-card-panel">
                  <div className="card-panel-head">
                    <div className="panel-icon-wrap">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h3>2. Doorstep Delivery Address</h3>
                      <p>Free white-glove transit &amp; assembly by Sardar Mart Logistics Fleet</p>
                    </div>
                  </div>

                  <div className="panel-form-grid">
                    <div className="form-field-item full-width">
                      <label htmlFor="b-address">Flat / House / Building / Street Address <span className="req">*</span></label>
                      <input 
                        id="b-address" 
                        name="address" 
                        type="text" 
                        required 
                        placeholder="e.g. Flat 4B, Emerald Heights, Anna Nagar Main Road" 
                        value={formData.address}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="form-field-item">
                      <label htmlFor="b-landmark">Prominent Landmark</label>
                      <input 
                        id="b-landmark" 
                        name="landmark" 
                        type="text" 
                        placeholder="e.g. Opp. Roundtana Metro Station" 
                        value={formData.landmark}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="form-field-item">
                      <label htmlFor="b-city">City / District <span className="req">*</span></label>
                      <input 
                        id="b-city" 
                        name="city" 
                        type="text" 
                        required 
                        value={formData.city}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="form-field-item">
                      <label htmlFor="b-state">State</label>
                      <select 
                        id="b-state" 
                        name="state" 
                        value={formData.state} 
                        onChange={handleInputChange}
                      >
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Delhi NCR">Delhi NCR</option>
                        <option value="Other States">Other Indian States</option>
                      </select>
                    </div>

                    <div className="form-field-item">
                      <label htmlFor="b-pincode">Pincode <span className="req">*</span></label>
                      <input 
                        id="b-pincode" 
                        name="pincode" 
                        type="text" 
                        required 
                        placeholder="e.g. 600040" 
                        value={formData.pincode}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="form-field-item full-width">
                      <label>Preferred Delivery Time Slot</label>
                      <div className="slots-grid">
                        {[
                          { id: 'morning', label: 'Morning Slot', time: '09:30 AM – 01:00 PM' },
                          { id: 'afternoon', label: 'Afternoon Slot', time: '01:30 PM – 05:30 PM' },
                          { id: 'evening', label: 'Evening Slot', time: '06:00 PM – 09:30 PM' }
                        ].map(slot => (
                          <label key={slot.id} className={`slot-radio-card ${formData.deliverySlot === slot.id ? 'active' : ''}`}>
                            <input 
                              type="radio" 
                              name="deliverySlot" 
                              value={slot.id}
                              checked={formData.deliverySlot === slot.id}
                              onChange={handleInputChange}
                            />
                            <strong>{slot.label}</strong>
                            <small>{slot.time}</small>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="form-field-item full-width">
                      <label htmlFor="b-notes">Special Unboxing &amp; Installation Instructions (Optional)</label>
                      <input 
                        id="b-notes" 
                        name="specialNotes" 
                        type="text" 
                        placeholder="e.g. 2nd floor with service lift, wall mounting needed for 55 inch TV" 
                        value={formData.specialNotes}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Showroom Product Catalog (Browse & Add to Bill) */}
                <div className="billing-card-panel catalog-picker-panel">
                  <div className="card-panel-head" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div className="panel-icon-wrap" style={{ background: '#f5f3ff', color: '#7c3aed', borderColor: '#ddd6fe' }}>
                        <Package size={20} />
                      </div>
                      <div>
                        <h3>3. Select Products from Showroom Catalog</h3>
                        <p>Click &quot;+ Add to Bill&quot; to include products or add custom showroom line items</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="pos-custom-item-btn"
                      onClick={handleAddCustomLineItem}
                      title="Add Custom Item (Assembly, Polishing, Extended Warranty)"
                    >
                      <Plus size={14} /> Custom Item / Charge
                    </button>
                  </div>

                  {/* Search & Category Filter */}
                  <div className="catalog-picker-filter-row">
                    <div className="catalog-search-box">
                      <Search size={16} />
                      <input
                        type="text"
                        placeholder="Search furniture, TVs, fridges by name or specs..."
                        value={catalogSearch}
                        onChange={(e) => setCatalogSearch(e.target.value)}
                      />
                    </div>

                    <div className="catalog-cat-pills-row">
                      {['all', 'furniture', 'electronics', 'appliances'].map(cat => (
                        <button
                          key={cat}
                          type="button"
                          className={`cat-pill-btn ${catalogCat === cat ? 'active' : ''}`}
                          onClick={() => setCatalogCat(cat)}
                        >
                          {cat === 'all' ? 'All Items' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Product Grid */}
                  <div className="catalog-products-grid">
                    {catalogList
                      .filter(p => {
                        const matchCat = catalogCat === 'all' || p.category === catalogCat;
                        const matchSearch = !catalogSearch.trim() || 
                          p.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
                          (p.category || '').toLowerCase().includes(catalogSearch.toLowerCase());
                        return matchCat && matchSearch;
                      })
                      .slice(0, 8)
                      .map(p => {
                        const inBill = billItems.find(it => it.id === p.id);
                        return (
                          <div key={p.id} className={`billing-product-item-card ${inBill ? 'selected' : ''}`}>
                            <div className="billing-prod-img-wrap">
                              <img src={p.image} alt={p.name} loading="lazy" />
                              <span className="billing-prod-cat-badge">{p.category}</span>
                            </div>
                            <div className="billing-prod-info">
                              <strong className="billing-prod-name" title={p.name}>{p.name}</strong>
                              <span className="billing-prod-price">{formatPrice(p.price)}</span>
                              <small className="billing-prod-stock">In Showroom Stock</small>
                            </div>
                            <button
                              type="button"
                              className={`billing-add-prod-btn ${inBill ? 'in-bill' : ''}`}
                              onClick={() => handleAddProductToBill(p)}
                            >
                              {inBill ? (
                                <>
                                  <Check size={14} /> Added (×{inBill.quantity})
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

                {/* Section 4: Payment Method Selection */}
                <div className="billing-card-panel">
                  <div className="card-panel-head">
                    <div className="panel-icon-wrap">
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <h3>4. Payment Mode &amp; Tax Settlement</h3>
                      <p>Select your preferred payment method (100% Secure 256-bit SSL)</p>
                    </div>
                  </div>

                  {/* Payment Tabs / Radio selector */}
                  <div className="payment-methods-selector">
                    
                    {/* Method 1: UPI */}
                    {storeSettings?.paymentUpiEnabled !== false && (
                      <div className={`payment-method-box ${formData.paymentMethod === 'upi' ? 'selected' : ''}`}>
                        <label className="method-label">
                          <input 
                            type="radio" 
                            name="paymentMethod" 
                            value="upi" 
                            checked={formData.paymentMethod === 'upi'} 
                            onChange={handleInputChange} 
                          />
                          <div className="method-title-wrap">
                            <strong>UPI Instant Payment (GPay / PhonePe / Paytm / BHIM)</strong>
                            <span className="pay-tag-recom">{storeSettings?.upiTag || 'Zero Transaction Fees'}</span>
                          </div>
                        </label>

                        {formData.paymentMethod === 'upi' && (
                          <div className="method-expanded-content animate-fade-in">
                            <div className="upi-payment-details">
                              {storeSettings?.upiShowQr !== false && (
                                <div className="upi-qr-box">
                                  {/* QR Code Graphic */}
                                  <div className="simulated-qr">
                                    <QrCode size={90} color="#8c3b10" />
                                    <span className="qr-scan-text">Scan with any UPI App</span>
                                  </div>
                                </div>
                              )}
                              <div className="upi-info-col">
                                <span className="upi-merchant-name">Verified Merchant: <strong>{storeSettings?.upiMerchant || 'Sardar Mart'}</strong></span>
                                <div className="upi-id-badge">
                                  <span>UPI ID: <strong>{storeSettings?.upiId || 'sardarmart@okaxis'}</strong></span>
                                </div>
                                <p className="upi-help-note">
                                  Scan the showroom QR code or enter your VPA to approve payment directly on your mobile device.
                                </p>
                                <div className="upi-vpa-input-wrap">
                                  <input 
                                    type="text" 
                                    placeholder="Or enter your UPI ID (e.g. yourname@okhdfcbank)"
                                    name="upiId"
                                    value={formData.upiId}
                                    onChange={handleInputChange}
                                    className="vpa-input"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Method 2: Cards */}
                    {storeSettings?.paymentCardEnabled !== false && (
                      <div className={`payment-method-box ${formData.paymentMethod === 'card' ? 'selected' : ''}`}>
                        <label className="method-label">
                          <input 
                            type="radio" 
                            name="paymentMethod" 
                            value="card" 
                            checked={formData.paymentMethod === 'card'} 
                            onChange={handleInputChange} 
                          />
                          <div className="method-title-wrap">
                            <strong>Credit / Debit Card (Visa, MasterCard, RuPay)</strong>
                            <span className="cards-accepted-icons">{storeSettings?.cardSecurityBadge || '💳 🔒 256-Bit'}</span>
                          </div>
                        </label>

                        {formData.paymentMethod === 'card' && (
                          <div className="method-expanded-content animate-fade-in">
                            <div className="card-inputs-grid">
                              <div className="form-field-item full-width">
                                <label>Card Number</label>
                                <input 
                                  type="text" 
                                  placeholder="4532 •••• •••• 8910" 
                                  name="cardNumber" 
                                  value={formData.cardNumber} 
                                  onChange={handleInputChange} 
                                />
                              </div>
                              <div className="form-field-item">
                                <label>Expiry Date</label>
                                <input 
                                  type="text" 
                                  placeholder="MM / YY" 
                                  name="cardExpiry" 
                                  value={formData.cardExpiry} 
                                  onChange={handleInputChange} 
                                />
                              </div>
                              <div className="form-field-item">
                                <label>CVV / CVC</label>
                                <input 
                                  type="password" 
                                  placeholder="•••" 
                                  maxLength={4}
                                  name="cardCvv" 
                                  value={formData.cardCvv} 
                                  onChange={handleInputChange} 
                                />
                              </div>
                              <div className="form-field-item full-width">
                                <label>Name on Card</label>
                                <input 
                                  type="text" 
                                  placeholder="As printed on card" 
                                  name="cardName" 
                                  value={formData.cardName} 
                                  onChange={handleInputChange} 
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Method 3: 0% Easy EMI */}
                    {storeSettings?.paymentEmiEnabled !== false && (
                      <div className={`payment-method-box ${formData.paymentMethod === 'emi' ? 'selected' : ''}`}>
                        <label className="method-label">
                          <input 
                            type="radio" 
                            name="paymentMethod" 
                            value="emi" 
                            checked={formData.paymentMethod === 'emi'} 
                            onChange={handleInputChange} 
                          />
                          <div className="method-title-wrap">
                            <strong>0% No-Cost EMI (Bajaj Finserv, HDFC, ICICI, SBI)</strong>
                            <span className="pay-tag-popular">{storeSettings?.emiTag || 'Showroom Promo'}</span>
                          </div>
                        </label>

                        {formData.paymentMethod === 'emi' && (
                          <div className="method-expanded-content animate-fade-in">
                            <p className="emi-headline">Select tenure for {formatPrice(finalTotal)}:</p>
                            <div className="emi-tenure-grid">
                              {[3, 6, 9, 12, 18].map(months => (
                                <div 
                                  key={months} 
                                  className={`emi-tenure-card ${formData.selectedEmiMonths === months ? 'active' : ''}`}
                                  onClick={() => setFormData(p => ({ ...p, selectedEmiMonths: months }))}
                                >
                                  <span className="emi-months">{months} Months</span>
                                  <strong className="emi-amount">{formatPrice(calculateEmi(months))}/mo</strong>
                                  <small className="emi-interest">0% Interest</small>
                                </div>
                              ))}
                            </div>
                            <p className="emi-sub-note">No credit card required for Bajaj Finserv EMI Card. Standard KYC documents verified at doorstep during delivery.</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Method 4: Net Banking */}
                    {storeSettings?.paymentNetBankingEnabled !== false && (
                      <div className={`payment-method-box ${formData.paymentMethod === 'netbanking' ? 'selected' : ''}`}>
                        <label className="method-label">
                          <input 
                            type="radio" 
                            name="paymentMethod" 
                            value="netbanking" 
                            checked={formData.paymentMethod === 'netbanking'} 
                            onChange={handleInputChange} 
                          />
                          <div className="method-title-wrap">
                            <strong>Net Banking (All Major Indian Banks)</strong>
                          </div>
                        </label>

                        {formData.paymentMethod === 'netbanking' && (
                          <div className="method-expanded-content animate-fade-in">
                            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px' }}>Select Bank:</label>
                            <div className="bank-chips-row">
                              {[
                                { id: 'sbi', name: 'State Bank of India (SBI)' },
                                { id: 'hdfc', name: 'HDFC Bank' },
                                { id: 'icici', name: 'ICICI Bank' },
                                { id: 'axis', name: 'Axis Bank' },
                                { id: 'kotak', name: 'Kotak Mahindra' }
                              ].map(bank => (
                                <button 
                                  key={bank.id} 
                                  type="button" 
                                  className={`bank-chip ${formData.selectedBank === bank.id ? 'active' : ''}`}
                                  onClick={() => setFormData(p => ({ ...p, selectedBank: bank.id }))}
                                >
                                  {bank.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Method 5: COD / Pay on Delivery */}
                    {storeSettings?.paymentCodEnabled !== false && (
                      <div className={`payment-method-box ${formData.paymentMethod === 'cod' ? 'selected' : ''}`}>
                        <label className="method-label">
                          <input 
                            type="radio" 
                            name="paymentMethod" 
                            value="cod" 
                            checked={formData.paymentMethod === 'cod'} 
                            onChange={handleInputChange} 
                          />
                          <div className="method-title-wrap">
                            <strong>Cash on Delivery (COD) / Pay on Assembly</strong>
                            <span className="pay-tag-flexible">{storeSettings?.codBadge || 'Pay After Inspection'}</span>
                          </div>
                        </label>
                        {formData.paymentMethod === 'cod' && (
                          <div className="method-expanded-content animate-fade-in">
                            <div className="cod-alert-box">
                              <CheckCircle2 size={18} color="#15803d" />
                              <p>{storeSettings?.codNote || 'Inspect your sofa, bed, or television at your home before paying. You can pay via Cash or UPI QR Code directly to our delivery executive.'}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: Order Items, Coupons, GST Tax Calculation, Submit CTA */}
              <div className="billing-right-col">
                
                {/* 1. Order Items Summary */}
                <div className="order-review-card">
                  <div className="review-card-head">
                    <div className="head-left">
                      <ShoppingBag size={18} />
                      <h4>Bill Items ({billItems.reduce((a, b) => a + b.quantity, 0)})</h4>
                    </div>
                    {billItems.length > 0 && (
                      <button 
                        type="button" 
                        className="btn-clear-bill-link"
                        onClick={handleClearAllBillItems}
                        title="Remove all products from bill"
                      >
                        Clear Bill
                      </button>
                    )}
                  </div>

                  <div className="review-items-scroll">
                    {billItems.length === 0 ? (
                      <div className="empty-bill-items-placeholder">
                        <ShoppingBag size={40} color="#8c3b10" style={{ opacity: 0.6 }} />
                        <p><strong>Your bill is currently empty.</strong></p>
                        <small>Click &quot;+ Add to Bill&quot; on any product from the catalog on the left to include items.</small>
                        <div style={{ marginTop: '12px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button type="button" onClick={handleAddSampleItems} className="btn-quick-sample">
                            <Sparkles size={13} /> Add Demo Items
                          </button>
                          <button type="button" onClick={handleAddCustomLineItem} className="btn-quick-custom">
                            <Plus size={13} /> Custom Charge
                          </button>
                        </div>
                      </div>
                    ) : (
                      billItems.map(item => (
                        <div key={item.id} className="review-item-row">
                          {item.image && (
                            <img src={item.image} alt={item.name} className="review-item-thumb" />
                          )}
                          <div className="review-item-details">
                            <span className="review-item-cat">{item.category}</span>
                            <strong className="review-item-name">{item.name}</strong>
                            <div className="review-item-meta">
                              <span className="price-tag">{formatPrice(item.price)}</span>
                              <div className="qty-controls">
                                <button 
                                  type="button" 
                                  onClick={() => handleUpdateItemQty(item.id, item.quantity - 1)}
                                  title="Decrease quantity"
                                >
                                  -
                                </button>
                                <span>{item.quantity}</span>
                                <button 
                                  type="button" 
                                  onClick={() => handleUpdateItemQty(item.id, item.quantity + 1)}
                                  title="Increase quantity"
                                >
                                  +
                                </button>
                              </div>
                              <button 
                                type="button"
                                className="btn-del-item"
                                onClick={() => handleRemoveItem(item.id)}
                                title="Remove item from bill"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                          <div className="review-item-price-col">
                            <strong>{formatPrice(item.price * item.quantity)}</strong>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Coupon Box */}
                  <div className="billing-coupon-card">
                    <div className="coupon-form-wrap">
                      <div className="input-wrap">
                        <Tag size={16} className="tag-icon" />
                        <input 
                          type="text" 
                          placeholder="Coupon (e.g. SARDAR5000)" 
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                        />
                      </div>
                      <button 
                        type="button" 
                        className="btn-apply-coupon"
                        onClick={handleApplyCoupon}
                      >
                        Apply
                      </button>
                    </div>

                    {appliedCoupon && (
                      <div className="applied-coupon-pill animate-fade-in">
                        <Check size={14} /> Coupon <strong>{appliedCoupon}</strong> Applied! (-{formatPrice(discountAmount)})
                        <button type="button" onClick={handleRemoveCoupon} className="btn-remove-coupon">×</button>
                      </div>
                    )}
                    {couponError && (
                      <div className="coupon-error-pill animate-fade-in">
                        <AlertCircle size={14} /> {couponError}
                      </div>
                    )}

                    <div className="suggested-coupons">
                      <span>Available: </span>
                      <button type="button" onClick={() => { setCouponCode('SARDAR5000'); }}>SARDAR5000</button>
                      <button type="button" onClick={() => { setCouponCode('FESTIVE10'); }}>FESTIVE10</button>
                      <button type="button" onClick={() => { setCouponCode('WELCOME'); }}>WELCOME</button>
                    </div>
                  </div>

                  {/* Comprehensive GST Calculation Breakdown */}
                  <div className="billing-calculation-sheet">
                    <div className="sheet-heading">
                      <FileText size={15} />
                      <span>Commercial Tax Invoice Breakdown</span>
                    </div>

                    <div className="calc-item-line">
                      <span>Gross Catalog Value:</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>

                    <div className="calc-item-line">
                      <span>Taxable Amount (Base):</span>
                      <span>{formatPrice(taxableAmount)}</span>
                    </div>

                    <div className="calc-item-line tax-line">
                      <span>CGST (Central Tax @ 9%):</span>
                      <span>+{formatPrice(cgst)}</span>
                    </div>

                    <div className="calc-item-line tax-line">
                      <span>SGST (State Tax @ 9%):</span>
                      <span>+{formatPrice(sgst)}</span>
                    </div>

                    <div className="calc-item-line total-tax-badge">
                      <span>Total Indian GST (18% Included):</span>
                      <span>{formatPrice(gstAmount)}</span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="calc-item-line discount-line">
                        <span>Promotional Discount:</span>
                        <span>-{formatPrice(discountAmount)}</span>
                      </div>
                    )}

                    <div className="calc-item-line">
                      <span>White-Glove Doorstep Delivery:</span>
                      <span className="free-pill">FREE (₹0)</span>
                    </div>

                    <div className="calc-item-line">
                      <span>Unpacking &amp; Expert Installation:</span>
                      <span className="free-pill">FREE (₹0)</span>
                    </div>

                    <div className="calc-grand-total-row">
                      <div>
                        <strong>Net Amount Payable:</strong>
                        <small>Inclusive of all applicable Indian taxes</small>
                      </div>
                      <strong className="grand-price-text">{formatPrice(finalTotal)}</strong>
                    </div>
                  </div>

                  {/* Submission CTA Button */}
                  <div className="submit-action-box">
                    <button 
                      type="submit" 
                      className="btn-place-order-now"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span>Registering Order &amp; Generating Bill...</span>
                      ) : (
                        <>
                          <CheckCircle2 size={20} />
                          <span>Confirm Order &amp; Issue GST Tax Invoice</span>
                        </>
                      )}
                    </button>

                    <div className="secure-checkout-guarantee">
                      <Lock size={14} />
                      <span>256-Bit SSL Encrypted Commercial Transaction</span>
                    </div>

                    {/* Official Registration Stamp */}
                    <div className="store-official-stamp">
                      <div className="stamp-icon">🏛️</div>
                      <div className="stamp-text">
                        <strong>SARDAR MART RETAIL</strong>
                        {storeSettings?.showGstinBadge && (
                          <span>GSTIN: 33DVKPR2334L1Z9 • Authorized Signatory: Rahim Baig</span>
                        )}
                        <small>Flagship Showroom: 190, Erukkenchery High Rd, Vyasarpadi, Chennai - 600039</small>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </form>
        </div>
      </section>

      {/* Embedded High-Aesthetic Styling */}
      <style>{`
        .billing-page-wrap {
          background-color: #faf7f2;
          min-height: 100vh;
          padding-bottom: 80px;
        }

        .billing-header-banner {
          background: linear-gradient(135deg, #2a1810 0%, #170d07 100%);
          color: #ffffff;
          padding: 36px 0 32px 0;
          border-bottom: 2px solid #8c3b10;
        }

        .header-top-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .btn-back-link {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #f5ede3;
          padding: 6px 14px;
          border-radius: 20px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.84rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-back-link:hover {
          background: rgba(255, 255, 255, 0.18);
          color: #ffffff;
        }

        .gst-badge-pill {
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.35);
          color: #6ee7b7;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.8rem;
          display: inline-flex;
          align-items: center;
          gap: 7px;
        }

        .billing-headline {
          font-family: var(--font-heading);
          font-size: 2.2rem;
          font-weight: 700;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
        }

        .billing-sub {
          color: #d1b8ab;
          font-size: 0.96rem;
          max-width: 650px;
          line-height: 1.5;
          margin-bottom: 20px;
        }

        .header-quick-actions-row {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 24px;
        }

        .btn-header-quick-action {
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.22);
          color: #ffffff;
          padding: 7px 14px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-header-quick-action:hover {
          background: rgba(255, 255, 255, 0.24);
          transform: translateY(-1px);
        }

        .btn-header-quick-action.action-danger {
          background: rgba(239, 68, 68, 0.2);
          border-color: rgba(239, 68, 68, 0.4);
          color: #fca5a5;
        }

        .btn-header-quick-action.action-danger:hover {
          background: rgba(239, 68, 68, 0.35);
          color: #ffffff;
        }

        .btn-autofill-demo-badge {
          background: #fef3c7;
          border: 1px solid #fde68a;
          color: #92400e;
          font-size: 0.76rem;
          font-weight: 700;
          padding: 5px 12px;
          border-radius: 16px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          transition: all 0.2s ease;
        }

        .btn-autofill-demo-badge:hover {
          background: #fde68a;
          transform: translateY(-1px);
        }

        /* Showroom Catalog Picker in Billing */
        .catalog-picker-panel {
          border: 1.5px solid #ddd6fe !important;
          background: #faf5ff !important;
        }

        .pos-custom-item-btn {
          background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
          color: #ffffff;
          border: none;
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 2px 8px rgba(124, 58, 237, 0.25);
        }

        .pos-custom-item-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.35);
        }

        .catalog-picker-filter-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          align-items: center;
          margin-bottom: 18px;
        }

        .catalog-search-box {
          flex: 1;
          min-width: 220px;
          display: flex;
          align-items: center;
          gap: 8px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 8px 12px;
          color: #64748b;
        }

        .catalog-search-box input {
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
          padding: 0 !important;
          font-size: 0.86rem;
          width: 100%;
          color: #1e293b;
        }

        .catalog-cat-pills-row {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .cat-pill-btn {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: #475569;
          font-size: 0.78rem;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 18px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .cat-pill-btn:hover {
          border-color: #7c3aed;
          color: #7c3aed;
        }

        .cat-pill-btn.active {
          background: #7c3aed;
          border-color: #7c3aed;
          color: #ffffff;
          font-weight: 700;
        }

        .catalog-products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 14px;
        }

        .billing-product-item-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .billing-product-item-card.selected {
          border-color: #7c3aed;
          background: #fdf4ff;
          box-shadow: 0 2px 10px rgba(124, 58, 237, 0.12);
        }

        .billing-prod-img-wrap {
          position: relative;
          height: 100px;
          border-radius: 6px;
          overflow: hidden;
          background: #f1f5f9;
        }

        .billing-prod-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .billing-prod-cat-badge {
          position: absolute;
          top: 6px;
          left: 6px;
          background: rgba(15, 23, 42, 0.75);
          color: #ffffff;
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          padding: 2px 6px;
          border-radius: 4px;
          backdrop-filter: blur(4px);
        }

        .billing-prod-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
        }

        .billing-prod-name {
          font-size: 0.82rem;
          font-weight: 700;
          color: #1e293b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .billing-prod-price {
          font-size: 0.95rem;
          font-weight: 800;
          color: #8c3b10;
        }

        .billing-prod-stock {
          font-size: 0.68rem;
          color: #16a34a;
          font-weight: 600;
        }

        .billing-add-prod-btn {
          width: 100%;
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          color: #334155;
          font-size: 0.76rem;
          font-weight: 700;
          padding: 7px 10px;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.15s ease;
        }

        .billing-add-prod-btn:hover {
          background: #7c3aed;
          border-color: #7c3aed;
          color: #ffffff;
        }

        .billing-add-prod-btn.in-bill {
          background: #7c3aed;
          border-color: #7c3aed;
          color: #ffffff;
        }

        .btn-clear-bill-link {
          background: none;
          border: none;
          color: #dc2626;
          font-size: 0.76rem;
          font-weight: 700;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 4px;
        }

        .btn-clear-bill-link:hover {
          background: #fee2e2;
        }

        .empty-bill-items-placeholder {
          text-align: center;
          padding: 24px 12px;
          background: #faf7f5;
          border: 1.5px dashed #ebdcd0;
          border-radius: 8px;
        }

        .empty-bill-items-placeholder p {
          margin: 6px 0 2px 0;
          color: #38241b;
          font-size: 0.88rem;
        }

        .empty-bill-items-placeholder small {
          color: #786358;
          font-size: 0.78rem;
        }

        .btn-quick-sample {
          background: #8c3b10;
          color: #ffffff;
          border: none;
          font-size: 0.74rem;
          font-weight: 700;
          padding: 6px 10px;
          border-radius: 6px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
        }

        .btn-quick-custom {
          background: #7c3aed;
          color: #ffffff;
          border: none;
          font-size: 0.74rem;
          font-weight: 700;
          padding: 6px 10px;
          border-radius: 6px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
        }

        /* Stepper */
        .checkout-stepper-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 680px;
          margin-top: 10px;
        }
        .step-node {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #8c766b;
          font-size: 0.82rem;
          font-weight: 500;
        }
        .step-node.active {
          color: #f5ede3;
          font-weight: 600;
        }
        .step-node.completed {
          color: #10b981;
        }
        .step-circle {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
        }
        .step-node.active .step-circle {
          background: #8c3b10;
          border-color: #d97706;
          color: #fff;
        }
        .step-node.completed .step-circle {
          background: #10b981;
          color: #fff;
          border-color: #10b981;
        }
        .step-divider {
          flex: 1;
          height: 2px;
          background: rgba(255, 255, 255, 0.12);
          margin: 0 10px;
        }
        .step-divider.active {
          background: #8c3b10;
        }

        /* Main Section */
        .billing-main-section {
          padding-top: 36px;
        }

        .billing-layout-grid {
          display: grid;
          grid-template-columns: 1.35fr 1fr;
          gap: 32px;
          align-items: start;
        }

        @media (max-width: 1024px) {
          .billing-layout-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Cards on Left */
        .billing-card-panel {
          background: #ffffff;
          border: 1px solid #ebdcd0;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 4px 14px rgba(42, 24, 16, 0.04);
        }

        .card-panel-head {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 20px;
          padding-bottom: 14px;
          border-bottom: 1px solid #f3ebe3;
        }
        .panel-icon-wrap {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          background: #fdf5f0;
          color: #8c3b10;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #f2ded1;
        }
        .card-panel-head h3 {
          font-size: 1.15rem;
          font-weight: 700;
          color: #24140e;
        }
        .card-panel-head p {
          font-size: 0.82rem;
          color: #786358;
          margin-top: 2px;
        }

        .panel-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .form-field-item.full-width {
          grid-column: span 2;
        }
        @media (max-width: 640px) {
          .panel-form-grid {
            grid-template-columns: 1fr;
          }
          .form-field-item.full-width {
            grid-column: span 1;
          }
        }

        .form-field-item label {
          display: block;
          font-size: 0.85rem;
          font-weight: 600;
          color: #38241b;
          margin-bottom: 6px;
        }
        .form-field-item label .req {
          color: #dc2626;
        }
        .form-field-item input,
        .form-field-item select {
          width: 100%;
          padding: 10px 14px;
          border: 1px solid #d8c4b6;
          border-radius: 8px;
          font-size: 0.92rem;
          color: #24140e;
          background: #ffffff;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .form-field-item input:focus,
        .form-field-item select:focus {
          outline: none;
          border-color: #8c3b10;
          box-shadow: 0 0 0 3px rgba(140, 59, 16, 0.12);
        }

        /* Delivery Slots */
        .slots-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 12px;
        }
        .slot-radio-card {
          border: 1px solid #e5d5c9;
          border-radius: 8px;
          padding: 12px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 4px;
          transition: all 0.2s ease;
          background: #fdfcfb;
        }
        .slot-radio-card.active {
          border-color: #8c3b10;
          background: #fff8f4;
          box-shadow: 0 2px 8px rgba(140, 59, 16, 0.08);
        }
        .slot-radio-card input {
          display: none;
        }
        .slot-radio-card strong {
          font-size: 0.88rem;
          color: #24140e;
        }
        .slot-radio-card small {
          font-size: 0.76rem;
          color: #786358;
        }

        /* Payment Methods */
        .payment-methods-selector {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .payment-method-box {
          border: 1.5px solid #e7d8cd;
          border-radius: 10px;
          padding: 14px 18px;
          transition: all 0.2s ease;
          background: #ffffff;
        }
        .payment-method-box.selected {
          border-color: #8c3b10;
          background: #fdfaf7;
          box-shadow: 0 3px 12px rgba(140, 59, 16, 0.06);
        }
        .method-label {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          width: 100%;
        }
        .method-title-wrap {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          gap: 10px;
          flex-wrap: wrap;
        }
        .method-title-wrap strong {
          font-size: 0.94rem;
          color: #24140e;
        }
        .pay-tag-recom {
          font-size: 0.72rem;
          background: #10b981;
          color: #ffffff;
          padding: 2px 8px;
          border-radius: 12px;
          font-weight: 600;
        }
        .pay-tag-popular {
          font-size: 0.72rem;
          background: #8c3b10;
          color: #ffffff;
          padding: 2px 8px;
          border-radius: 12px;
          font-weight: 600;
        }
        .pay-tag-flexible {
          font-size: 0.72rem;
          background: #f59e0b;
          color: #1e293b;
          padding: 2px 8px;
          border-radius: 12px;
          font-weight: 600;
        }
        .method-expanded-content {
          margin-top: 14px;
          padding-top: 14px;
          border-top: 1px dashed #e2d2c5;
        }

        /* UPI Details */
        .upi-payment-details {
          display: flex;
          gap: 20px;
          align-items: center;
          flex-wrap: wrap;
        }
        .simulated-qr {
          border: 1px solid #e0c8b6;
          border-radius: 8px;
          padding: 10px;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }
        .qr-scan-text {
          font-size: 0.7rem;
          font-weight: 600;
          color: #8c3b10;
        }
        .upi-info-col {
          flex: 1;
          min-width: 240px;
        }
        .upi-merchant-name {
          font-size: 0.85rem;
          color: #4b362c;
          display: block;
          margin-bottom: 6px;
        }
        .upi-id-badge {
          background: #f2e9e1;
          padding: 6px 12px;
          border-radius: 6px;
          display: inline-block;
          font-size: 0.88rem;
          color: #8c3b10;
          border: 1px dashed #cbb09d;
          margin-bottom: 8px;
        }
        .upi-help-note {
          font-size: 0.8rem;
          color: #6e584f;
          margin-bottom: 10px;
        }
        .vpa-input {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #d8c4b6;
          border-radius: 6px;
          font-size: 0.85rem;
        }

        /* EMI Grid */
        .emi-tenure-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
          gap: 10px;
          margin: 10px 0;
        }
        .emi-tenure-card {
          border: 1px solid #decac0;
          border-radius: 8px;
          padding: 10px;
          text-align: center;
          cursor: pointer;
          background: #ffffff;
          transition: all 0.2s ease;
        }
        .emi-tenure-card.active {
          border-color: #8c3b10;
          background: #fff6f0;
          box-shadow: 0 2px 8px rgba(140, 59, 16, 0.1);
        }
        .emi-months {
          font-size: 0.78rem;
          color: #786358;
          display: block;
        }
        .emi-amount {
          font-size: 0.96rem;
          color: #8c3b10;
          display: block;
          margin: 2px 0;
        }
        .emi-interest {
          font-size: 0.72rem;
          color: #15803d;
          font-weight: 600;
        }
        .emi-sub-note {
          font-size: 0.76rem;
          color: #786358;
          margin-top: 6px;
        }

        /* Bank Chips */
        .bank-chips-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .bank-chip {
          padding: 6px 12px;
          border-radius: 6px;
          border: 1px solid #d8c4b6;
          background: #ffffff;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .bank-chip.active {
          background: #8c3b10;
          color: #ffffff;
          border-color: #8c3b10;
        }

        .cod-alert-box {
          display: flex;
          gap: 10px;
          align-items: center;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          padding: 10px 14px;
          border-radius: 8px;
          color: #166534;
          font-size: 0.84rem;
        }

        /* Card Inputs */
        .card-inputs-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        /* RIGHT COLUMN: Review Card */
        .order-review-card {
          background: #ffffff;
          border: 1px solid #ebdcd0;
          border-radius: 12px;
          padding: 22px;
          box-shadow: 0 6px 20px rgba(42, 24, 16, 0.05);
          position: sticky;
          top: 20px;
        }
        .review-card-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid #f2e7de;
        }
        .head-left {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #24140e;
        }
        .head-left h4 {
          font-size: 1.05rem;
          font-weight: 700;
        }
        .btn-edit-cart-link {
          background: none;
          border: none;
          color: #8c3b10;
          font-size: 0.84rem;
          font-weight: 600;
          cursor: pointer;
        }
        .btn-edit-cart-link:hover {
          text-decoration: underline;
        }

        /* Review Items List */
        .review-items-scroll {
          max-height: 280px;
          overflow-y: auto;
          margin-bottom: 16px;
          padding-right: 4px;
        }
        .review-item-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 0;
          border-bottom: 1px solid #f6f0ea;
        }
        .review-item-thumb {
          width: 52px;
          height: 52px;
          border-radius: 8px;
          object-fit: cover;
          border: 1px solid #eedfd4;
        }
        .review-item-details {
          flex: 1;
        }
        .review-item-cat {
          font-size: 0.65rem;
          text-transform: uppercase;
          color: #9c887e;
          font-weight: 600;
          display: block;
        }
        .review-item-name {
          font-size: 0.86rem;
          color: #24140e;
          display: block;
          line-height: 1.25;
          margin-bottom: 4px;
        }
        .review-item-meta {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .price-tag {
          font-size: 0.82rem;
          color: #786358;
        }
        .qty-controls {
          display: flex;
          align-items: center;
          border: 1px solid #dec8b8;
          border-radius: 4px;
          overflow: hidden;
        }
        .qty-controls button {
          background: #f7eee7;
          border: none;
          width: 22px;
          height: 22px;
          font-size: 0.8rem;
          cursor: pointer;
        }
        .qty-controls span {
          padding: 0 6px;
          font-size: 0.78rem;
          font-weight: 600;
        }
        .btn-del-item {
          background: none;
          border: none;
          color: #b91c1c;
          cursor: pointer;
          display: flex;
          align-items: center;
        }
        .review-item-price-col {
          text-align: right;
          font-size: 0.92rem;
          color: #24140e;
        }

        /* Coupon Card */
        .billing-coupon-card {
          background: #fdfaf7;
          border: 1px dashed #d8c2b3;
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 18px;
        }
        .coupon-form-wrap {
          display: flex;
          gap: 8px;
        }
        .coupon-form-wrap .input-wrap {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
        }
        .coupon-form-wrap .tag-icon {
          position: absolute;
          left: 10px;
          color: #8c3b10;
        }
        .coupon-form-wrap input {
          width: 100%;
          padding: 8px 10px 8px 32px;
          border: 1px solid #dec7b7;
          border-radius: 6px;
          font-size: 0.85rem;
          text-transform: uppercase;
        }
        .btn-apply-coupon {
          background: #8c3b10;
          color: #fff;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .btn-apply-coupon:hover {
          background: #732f0c;
        }
        .applied-coupon-pill {
          margin-top: 8px;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #15803d;
          font-size: 0.8rem;
          padding: 4px 10px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .btn-remove-coupon {
          background: none;
          border: none;
          color: #dc2626;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
        }
        .coupon-error-pill {
          margin-top: 8px;
          background: #fef2f2;
          color: #dc2626;
          font-size: 0.78rem;
          padding: 4px 8px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .suggested-coupons {
          margin-top: 8px;
          font-size: 0.72rem;
          color: #786358;
        }
        .suggested-coupons button {
          background: rgba(140, 59, 16, 0.08);
          border: 1px solid rgba(140, 59, 16, 0.2);
          color: #8c3b10;
          font-size: 0.72rem;
          padding: 2px 6px;
          border-radius: 4px;
          margin-left: 4px;
          cursor: pointer;
          font-weight: 600;
        }

        /* Calculations Sheet */
        .billing-calculation-sheet {
          border-top: 1px solid #f2e7de;
          padding-top: 14px;
          margin-bottom: 20px;
        }
        .sheet-heading {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          font-weight: 700;
          color: #8c3b10;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 10px;
        }
        .calc-item-line {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.88rem;
          color: #4b362c;
          margin-bottom: 7px;
        }
        .calc-item-line.tax-line {
          font-size: 0.82rem;
          color: #786358;
          padding-left: 10px;
        }
        .total-tax-badge {
          background: #f7eee7;
          padding: 5px 10px;
          border-radius: 6px;
          font-weight: 600;
          color: #8c3b10;
          font-size: 0.82rem;
          margin: 6px 0;
        }
        .calc-item-line.discount-line {
          color: #15803d;
          font-weight: 600;
        }
        .free-pill {
          background: #f0fdf4;
          color: #15803d;
          font-weight: 700;
          font-size: 0.78rem;
          padding: 2px 6px;
          border-radius: 4px;
        }
        .calc-grand-total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 14px;
          padding-top: 12px;
          border-top: 2px solid #ecdacf;
        }
        .calc-grand-total-row strong {
          font-size: 1.05rem;
          color: #24140e;
        }
        .calc-grand-total-row small {
          display: block;
          font-size: 0.72rem;
          color: #8c766b;
        }
        .grand-price-text {
          font-family: var(--font-heading);
          font-size: 1.55rem;
          color: #8c3b10;
          font-weight: 800;
        }

        /* Submit Action Box */
        .btn-place-order-now {
          width: 100%;
          background: linear-gradient(135deg, #8c3b10 0%, #b45309 100%);
          color: #ffffff;
          border: none;
          padding: 15px;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 4px 14px rgba(140, 59, 16, 0.25);
        }
        .btn-place-order-now:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(140, 59, 16, 0.35);
          background: linear-gradient(135deg, #782f0a 0%, #9a4406 100%);
        }
        .btn-place-order-now:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .secure-checkout-guarantee {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          color: #8c766b;
          font-size: 0.74rem;
          margin-top: 12px;
        }

        .store-official-stamp {
          margin-top: 16px;
          background: #fdfbf8;
          border: 1px solid #ebdcd0;
          border-radius: 8px;
          padding: 10px 14px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .stamp-icon {
          font-size: 1.4rem;
        }
        .stamp-text strong {
          display: block;
          font-size: 0.8rem;
          color: #24140e;
          letter-spacing: 0.5px;
        }
        .stamp-text span {
          display: block;
          font-size: 0.75rem;
          color: #8c3b10;
          font-weight: 600;
          font-family: monospace;
        }
        .stamp-text small {
          display: block;
          font-size: 0.68rem;
          color: #9c887e;
        }

        /* Empty Card */
        .empty-billing-card {
          background: #ffffff;
          border: 1px solid #ebdcd0;
          border-radius: 16px;
          padding: 60px 20px;
          text-align: center;
          max-width: 600px;
          margin: 40px auto;
          box-shadow: 0 8px 30px rgba(42, 24, 16, 0.05);
        }
        .empty-cart-icon-wrap {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: #fdf5f0;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px auto;
          border: 2px dashed #e8d0bf;
        }
        .empty-billing-card h2 {
          font-size: 1.6rem;
          font-weight: 700;
          color: #24140e;
          margin-bottom: 8px;
        }
        .empty-billing-card p {
          color: #786358;
          font-size: 0.95rem;
          margin-bottom: 24px;
        }
        .empty-actions-row {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .btn-sample-cart {
          background: #8c3b10;
          color: #fff;
          border: none;
          padding: 12px 20px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .btn-browse-cat {
          background: #ffffff;
          color: #8c3b10;
          border: 1px solid #8c3b10;
          padding: 12px 20px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        /* CONFIRMED SUCCESS VIEW */
        .order-success-hero {
          text-align: center;
          margin-bottom: 30px;
        }
        .success-badge-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: #dcfce7;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px auto;
        }
        .success-tag {
          font-size: 0.8rem;
          background: #15803d;
          color: #fff;
          padding: 4px 12px;
          border-radius: 20px;
          font-weight: 700;
          text-transform: uppercase;
        }
        .success-title {
          font-family: var(--font-heading);
          font-size: 2.2rem;
          font-weight: 800;
          color: #24140e;
          margin-top: 12px;
          margin-bottom: 8px;
        }
        .success-lead {
          font-size: 1rem;
          color: #6e584f;
          max-width: 600px;
          margin: 0 auto 30px auto;
          line-height: 1.5;
        }

        .confirmed-bill-card {
          background: #ffffff;
          border: 1px solid #ebdcd0;
          border-radius: 16px;
          padding: 32px;
          text-align: left;
          box-shadow: 0 10px 35px rgba(42, 24, 16, 0.08);
        }
        .bill-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #f3ece5;
          padding-bottom: 18px;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .bill-label {
          font-size: 0.72rem;
          color: #9c887e;
          font-weight: 700;
          letter-spacing: 0.5px;
        }
        .bill-id {
          font-size: 1.6rem;
          font-weight: 800;
          color: #8c3b10;
        }
        .bill-date {
          font-size: 0.82rem;
          color: #786358;
        }
        .bill-tax-seal {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          padding: 10px 16px;
          border-radius: 10px;
        }
        .seal-shield-icon {
          flex-shrink: 0;
        }
        .seal-text-group {
          display: flex;
          flex-direction: column;
          gap: 2px;
          text-align: left;
        }
        .gstin-code {
          font-size: 0.82rem;
          color: #166534;
          font-family: monospace;
          display: block;
        }
        .signatory-name {
          font-size: 0.74rem;
          color: #15803d;
          display: block;
        }

        /* -------------------------------------------------------------
           DOWNLOAD TAX INVOICE FILE CTA BANNER LAYOUT
           ------------------------------------------------------------- */
        .invoice-download-cta-banner {
          background: linear-gradient(135deg, #fdf8f4 0%, #f6ebe2 100%);
          border: 1.5px solid #ecd8ca;
          border-radius: 12px;
          padding: 18px 22px;
          margin-bottom: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          box-shadow: 0 4px 16px rgba(92, 44, 22, 0.05);
        }
        @media (max-width: 768px) {
          .invoice-download-cta-banner {
            flex-direction: column;
            align-items: stretch;
            padding: 16px;
          }
        }
        .download-cta-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .download-file-icon-box {
          width: 52px;
          height: 52px;
          border-radius: 12px;
          background: linear-gradient(135deg, #5c2c16 0%, #8c3b10 100%);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(92, 44, 22, 0.25);
        }
        .download-cta-info {
          display: flex;
          flex-direction: column;
        }
        .download-badge-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }
        .doc-pill {
          background: #5c2c16;
          color: #ffffff;
          font-size: 0.68rem;
          font-weight: 800;
          padding: 2px 7px;
          border-radius: 4px;
          letter-spacing: 0.5px;
        }
        .ready-pill {
          background: #dcfce7;
          color: #166534;
          border: 1px solid #bbf7d0;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }
        .pulse-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #16a34a;
          box-shadow: 0 0 0 2px rgba(22, 163, 74, 0.3);
          animation: pulseAnim 1.8s infinite;
        }
        @keyframes pulseAnim {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.7); }
          70% { transform: scale(1.1); box-shadow: 0 0 0 6px rgba(22, 163, 74, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(22, 163, 74, 0); }
        }
        .download-doc-title {
          margin: 0;
          font-size: 1.05rem;
          font-weight: 800;
          color: #24140e;
        }
        .download-doc-subtitle {
          margin: 3px 0 0;
          font-size: 0.78rem;
          color: #786358;
          line-height: 1.35;
        }

        .download-cta-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }
        @media (max-width: 540px) {
          .download-cta-actions {
            flex-direction: column;
            width: 100%;
          }
          .btn-download-primary, .btn-print-secondary {
            width: 100%;
            justify-content: center;
          }
        }
        .btn-download-primary {
          background: linear-gradient(135deg, #8c3b10 0%, #5c2c16 100%);
          color: #ffffff;
          border: none;
          padding: 10px 18px;
          border-radius: 9px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(92, 44, 22, 0.35);
          transition: all 0.2s ease;
          text-align: left;
        }
        .btn-download-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(92, 44, 22, 0.45);
          background: linear-gradient(135deg, #a14413 0%, #6e341b 100%);
        }
        .download-arrow-icon {
          flex-shrink: 0;
          color: #ffffff;
        }
        .btn-text-column {
          display: flex;
          flex-direction: column;
        }
        .btn-main-title {
          font-size: 0.92rem;
          font-weight: 800;
          line-height: 1.15;
        }
        .btn-sub-caption {
          font-size: 0.7rem;
          opacity: 0.88;
          font-weight: 500;
          margin-top: 1px;
        }

        .btn-print-secondary {
          background: #ffffff;
          color: #5c2c16;
          border: 1.5px solid #d9c2b2;
          padding: 11px 16px;
          border-radius: 9px;
          font-weight: 700;
          font-size: 0.88rem;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-print-secondary:hover {
          background: #fdfaf7;
          border-color: #5c2c16;
        }

        /* -------------------------------------------------------------
           BOTTOM ACTION BUTTONS
           ------------------------------------------------------------- */
        .bill-card-actions {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
          margin-top: 26px;
          padding-top: 20px;
          border-top: 1.5px dashed #ebdcd0;
        }
        .btn-download-bill-footer {
          background: #15803d;
          color: #ffffff;
          border: none;
          padding: 13px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: background 0.2s ease;
          box-shadow: 0 3px 10px rgba(21, 128, 61, 0.25);
        }
        .btn-download-bill-footer:hover {
          background: #166534;
        }
        .btn-print-bill {
          background: #8c3b10;
          color: #fff;
          border: none;
          padding: 13px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .btn-print-bill:hover {
          background: #732f0c;
        }
        .btn-track-bill {
          background: #ffffff;
          color: #8c3b10;
          border: 1.5px solid #8c3b10;
          padding: 13px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
        }
        .btn-track-bill:hover {
          background: #fdf5f0;
        }
        .btn-wa-bill {
          background: #25d366;
          color: #ffffff;
          border: none;
          padding: 13px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
        }
        .btn-wa-bill:hover {
          background: #1ebd5a;
        }

        .bill-grid-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        @media (max-width: 600px) {
          .bill-grid-row {
            grid-template-columns: 1fr;
          }
        }
        .b-label {
          font-size: 0.78rem;
          color: #8c766b;
          font-weight: 600;
          display: block;
        }
        .b-val {
          font-size: 0.94rem;
          color: #24140e;
          font-weight: 600;
          margin-top: 2px;
        }

        .bill-items-summary {
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid #f3ece5;
        }
        .bill-items-summary h4 {
          font-size: 0.95rem;
          color: #24140e;
          margin-bottom: 12px;
        }
        .mini-items-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .mini-item-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px;
          background: #fdfbf9;
          border-radius: 8px;
        }
        .mini-item-thumb {
          width: 44px;
          height: 44px;
          border-radius: 6px;
          object-fit: cover;
        }
        .mini-item-info {
          flex: 1;
        }
        .mini-item-info strong {
          display: block;
          font-size: 0.86rem;
          color: #24140e;
        }
        .mini-item-info span {
          font-size: 0.78rem;
          color: #786358;
        }
        .mini-item-total {
          font-size: 0.92rem;
          color: #8c3b10;
        }

        .bill-totals-box {
          margin-top: 20px;
          background: #fcf9f6;
          border: 1px solid #ebdcd0;
          border-radius: 10px;
          padding: 16px;
        }
        .totals-line {
          display: flex;
          justify-content: space-between;
          font-size: 0.88rem;
          color: #4b362c;
          margin-bottom: 6px;
        }
        .totals-line.discount-line {
          color: #15803d;
          font-weight: 600;
        }
        .totals-line.grand-total-line {
          margin-top: 10px;
          padding-top: 10px;
          border-top: 2px solid #ecdacf;
          font-size: 1.15rem;
          color: #24140e;
        }
        .grand-val {
          font-size: 1.35rem;
          color: #8c3b10;
          font-weight: 800;
        }

        .bill-card-actions {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 12px;
          margin-top: 24px;
        }
        .btn-print-bill {
          background: #8c3b10;
          color: #fff;
          border: none;
          padding: 13px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .btn-print-bill:hover {
          background: #732f0c;
        }
        .btn-track-bill {
          background: #ffffff;
          color: #8c3b10;
          border: 1.5px solid #8c3b10;
          padding: 13px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
        }
        .btn-track-bill:hover {
          background: #fdf5f0;
        }
        .btn-wa-bill {
          background: #25d366;
          color: #ffffff;
          border: none;
          padding: 13px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
        }
        .btn-wa-bill:hover {
          background: #1ebd5a;
        }

        .btn-return-home {
          background: none;
          border: none;
          color: #8c3b10;
          font-size: 0.92rem;
          font-weight: 600;
          cursor: pointer;
        }
        .btn-return-home:hover {
          text-decoration: underline;
        }

        /* Comprehensive Mobile Responsiveness for Billing Page */
        @media (max-width: 768px) {
          .billing-main-section {
            padding-top: 18px;
            padding-bottom: 90px;
          }
          .billing-layout-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .billing-card-panel {
            padding: 18px 14px;
            margin-bottom: 16px;
            border-radius: 12px;
          }
          .card-panel-head {
            gap: 10px;
            margin-bottom: 14px;
            padding-bottom: 10px;
          }
          .panel-icon-wrap {
            width: 36px;
            height: 36px;
            border-radius: 8px;
          }
          .card-panel-head h3 {
            font-size: 1.05rem;
          }
          .catalog-products-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
          }
          .billing-product-item-card {
            padding: 8px;
          }
          .billing-prod-img-wrap {
            height: 85px;
          }
          .billing-prod-name {
            font-size: 0.78rem;
          }
          .billing-prod-price {
            font-size: 0.86rem;
          }
          .billing-add-prod-btn {
            padding: 6px 8px;
            font-size: 0.72rem;
          }
          .catalog-cat-pills-row {
            flex-wrap: nowrap;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            padding-bottom: 4px;
            scrollbar-width: none;
          }
          .catalog-cat-pills-row::-webkit-scrollbar {
            display: none;
          }
          .cat-pill-btn {
            white-space: nowrap;
            padding: 5px 10px;
            font-size: 0.74rem;
          }
          .bill-card-actions {
            grid-template-columns: 1fr;
            gap: 10px;
          }
          .b-row {
            grid-template-columns: 1fr;
            gap: 12px;
          }
        }

        @media (max-width: 550px) {
          .checkout-stepper-bar {
            gap: 4px;
          }
          .step-node span {
            font-size: 0.72rem;
          }
          .step-circle {
            width: 22px;
            height: 22px;
            font-size: 0.7rem;
          }
          .step-divider {
            margin: 0 4px;
          }
          .panel-form-grid {
            grid-template-columns: 1fr;
            gap: 10px;
          }
          .form-field-item.full-width {
            grid-column: span 1;
          }
          .slots-grid {
            grid-template-columns: 1fr;
            gap: 8px;
          }
          .payment-method-box {
            padding: 10px 12px;
          }
          .method-title-wrap {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          }
          .upi-payment-details {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          .upi-info-col {
            min-width: 100%;
          }
          .emi-tenure-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
          }
          .review-item-row {
            gap: 8px;
            padding: 8px 0;
          }
          .review-item-thumb {
            width: 42px;
            height: 42px;
          }
          .review-item-name {
            font-size: 0.8rem;
          }
          .review-item-price-col {
            font-size: 0.85rem;
          }
          .grand-price-text {
            font-size: 1.35rem;
          }
          .btn-place-order-now {
            padding: 13px;
            font-size: 0.94rem;
          }
          .empty-billing-card {
            padding: 30px 14px;
            margin: 20px 8px;
          }
        }

        @media (max-width: 380px) {
          .step-node span {
            display: none;
          }
          .checkout-stepper-bar {
            justify-content: center;
          }
          .billing-card-panel {
            padding: 14px 10px;
          }
          .coupon-form-wrap {
            flex-direction: column;
          }
          .btn-apply-coupon {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
