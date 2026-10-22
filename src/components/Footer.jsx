import { 
  Phone, Mail, MapPin, Clock, MessageCircle, 
  ShieldCheck, CreditCard, Truck, RefreshCw, Lock, Package 
} from 'lucide-react';

export default function Footer({ onNavigate, onOpenAdmin, onOpenTrackOrder, storeSettings }) {
  const handleLink = (page) => {
    if (onNavigate) onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const siteContent = (() => {
    try {
      const saved = localStorage.getItem('hk_site_content');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })();

  const brandDesc = siteContent?.footerDescription || 'Your one-stop destination for premium stylish furniture and the latest smart home electronics. Transforming homes across Tamil Nadu and all over India with unmatched quality and value.';
  const instagram = siteContent?.instagramUrl || 'https://instagram.com';
  const facebook = siteContent?.facebookUrl || 'https://facebook.com';
  const youtube = siteContent?.youtubeUrl || 'https://youtube.com';
  const whatsappPhone = (siteContent?.phone || '+91 98765 43210').replace(/\D/g, '');

  return (
    <footer className="site-footer">
      {/* Pre-footer Value Bar */}
      <div className="pre-footer-trust-bar">
        <div className="container">
          <div className="trust-badges-grid">
            <div className="trust-item">
              <div className="trust-icon-circle">
                <Truck size={22} />
              </div>
              <div>
                <h4>Free Home Delivery</h4>
                <p>Safe door-step transit all over India</p>
              </div>
            </div>

            <div className="trust-item">
              <div className="trust-icon-circle">
                <CreditCard size={22} />
              </div>
              <div>
                <h4>Easy 0% EMI</h4>
                <p>No-cost options up to 18 months</p>
              </div>
            </div>

            <div className="trust-item">
              <div className="trust-icon-circle">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h4>100% Genuine Warranty</h4>
                <p>Direct manufacturer brand backing</p>
              </div>
            </div>

            <div className="trust-item">
              <div className="trust-icon-circle">
                <RefreshCw size={22} />
              </div>
              <div>
                <h4>7-Day Easy Returns</h4>
                <p>Hassle-free replacement guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="main-footer-body">
        <div className="container">
          <div className="footer-columns-grid">
            {/* Col 1: Brand Info */}
            <div className="footer-brand-col">
              <div className="footer-logo" onClick={() => handleLink('home')}>
                <div className="footer-logo-icon">▲</div>
                <div className="footer-logo-text">
                  <span>Sardar<strong>Mart</strong></span>
                  <small>FURNITURE &amp; ELECTRONICS</small>
                </div>
              </div>
              <p className="footer-brand-desc">
                {brandDesc}
              </p>

              <div className="footer-social-links">
                <a href={instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </a>
                <a href={facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
                <a href={youtube} target="_blank" rel="noreferrer" aria-label="YouTube">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><polygon points="10 15 15 12 10 9 10 15"/></svg>
                </a>
                <a href={`https://wa.me/${whatsappPhone}`} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="footer-wa-icon">
                  <MessageCircle size={18} />
                </a>
              </div>
            </div>

            {/* Col 2: Quick Links */}
            <div className="footer-links-col">
              <h3 className="footer-heading">Quick Links</h3>
              <ul className="footer-nav-list">
                <li><button onClick={() => handleLink('home')}>Home</button></li>
                <li><button onClick={() => handleLink('about')}>About Us &amp; Story</button></li>
                <li><button onClick={() => handleLink('furniture')}>Living &amp; Bedroom Furniture</button></li>
                <li><button onClick={() => handleLink('electronics')}>Smart TVs &amp; Electronics</button></li>
                <li><button onClick={() => handleLink('appliances')}>Kitchen &amp; Home Appliances</button></li>
                <li><button onClick={() => handleLink('offers')}>Festival Offers &amp; Combos</button></li>
                <li><button onClick={() => handleLink('contact')}>Our Flagship Showrooms</button></li>
              </ul>
            </div>

            {/* Col 3: Customer Service */}
            <div className="footer-links-col">
              <h3 className="footer-heading">Customer Service</h3>
              <ul className="footer-nav-list">
                <li><a href="#returns" onClick={(e) => { e.preventDefault(); alert('Returns & Refunds: 7 days free returns on damaged or transit issues.'); }}>Returns &amp; Refunds</a></li>
                <li><a href="#warranty" onClick={(e) => { e.preventDefault(); alert('Warranty: All products carry 1 to 10 year manufacturer warranty.'); }}>Warranty Registration</a></li>
                <li><a href="#emi" onClick={(e) => { e.preventDefault(); handleLink('offers'); }}>No Cost EMI Calculator</a></li>
                <li><a href="#shipping" onClick={(e) => { e.preventDefault(); alert('Free delivery within 24-48 hours in metro cities.'); }}>Shipping Policy</a></li>
                <li><a href="#privacy" onClick={(e) => { e.preventDefault(); alert('Your privacy is strictly protected.'); }}>Privacy Policy &amp; Terms</a></li>
              </ul>
            </div>

            {/* Col 4: Contact Us */}
            <div className="footer-contact-col">
              <h3 className="footer-heading">Contact Showroom</h3>
              <ul className="footer-contact-list">
                <li>
                  <Phone size={18} className="contact-icon" />
                  <div>
                    <strong>Direct Helpline:</strong>
                    <a href="tel:+919876543210">+91 98765 43210</a>
                  </div>
                </li>
                <li>
                  <MessageCircle size={18} className="contact-icon wa-color" />
                  <div>
                    <strong>WhatsApp Direct:</strong>
                    <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer">+91 98765 43210</a>
                  </div>
                </li>
                <li>
                  <Mail size={18} className="contact-icon" />
                  <div>
                    <strong>Support Email:</strong>
                    <a href="mailto:care@sardarmart.com">care@sardarmart.com</a>
                  </div>
                </li>
                <li>
                  <MapPin size={18} className="contact-icon" />
                  <div>
                    <strong>Experience Store:</strong>
                    <span>123, Market Street, Thousand Lights, Chennai, Tamil Nadu - 600001</span>
                  </div>
                </li>
                <li>
                  <Clock size={18} className="contact-icon" />
                  <div>
                    <strong>Hours:</strong>
                    <span>Mon - Sun: 09:30 AM – 09:30 PM</span>
                  </div>
                </li>
                {storeSettings?.showGstinBadge && (
                  <li className="footer-gst-badge-item" style={{ marginTop: '4px', background: 'rgba(255,255,255,0.06)', padding: '6px 10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <ShieldCheck size={16} className="contact-icon" style={{ color: '#10b981' }} />
                    <div>
                      <strong style={{ color: '#10b981', fontSize: '0.8rem' }}>GSTIN Registered:</strong>
                      <span style={{ fontSize: '0.78rem', letterSpacing: '0.5px', fontFamily: 'monospace' }}>{storeSettings?.gstNumber || '33DVKPR2334L1Z9'}</span>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom-bar">
        <div className="container bottom-bar-inner">
          <div className="copyright-group">
            <p className="copyright-text">
              © {new Date().getFullYear()} Sardar Mart Furniture &amp; Electronics. All rights reserved.
            </p>
            <span className="powered-by-divider">•</span>
            <p className="powered-by-text">
              Powered by{' '}
              <a 
                href="https://dmdigitallab.netlify.app" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="powered-by-link"
              >
                DM Digital Labs
              </a>
            </p>
          </div>
          <div className="bottom-bar-right-group">
            <div className="payment-modes">
              <span>Accepted Payments:</span>
              <span className="pay-badge">UPI / GPay / PhonePe</span>
              <span className="pay-badge">Visa &amp; Mastercard</span>
              <span className="pay-badge">RuPay</span>
              <span className="pay-badge">0% EMI</span>
              <span className="pay-badge">Cash on Delivery</span>
            </div>
            <button 
              onClick={onOpenAdmin} 
              className="staff-portal-btn"
              title="Authorized Staff & CMS Access (Hidden Portal)"
            >
              <Lock size={11} /> Staff Portal
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .bottom-bar-right-group {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        .staff-portal-btn {
          background: rgba(255, 255, 255, 0.05);
          color: #a89487;
          border: 1px solid rgba(255, 255, 255, 0.12);
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 0.72rem;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          cursor: pointer;
          transition: all 0.2s ease;
          opacity: 0.65;
        }
        .staff-portal-btn:hover {
          opacity: 1;
          color: #fde68a;
          border-color: rgba(253, 230, 138, 0.4);
          background: rgba(255, 255, 255, 0.1);
        }
        .site-footer {
          background: var(--color-warm-darker);
          color: #d8c7bc;
          font-size: 0.9rem;
        }

        /* Trust Bar */
        .pre-footer-trust-bar {
          background: #25130b;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding: 24px 0;
        }
        .trust-badges-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        .trust-item {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .trust-icon-circle {
          width: 48px;
          height: 48px;
          background: rgba(217, 119, 6, 0.15);
          color: #f59e0b;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .trust-item h4 {
          color: #ffffff;
          font-size: 0.95rem;
          margin-bottom: 2px;
        }
        .trust-item p {
          font-size: 0.78rem;
          color: #a89487;
        }

        /* Main footer */
        .main-footer-body {
          padding: 50px 0 40px;
        }
        .footer-columns-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr 1.3fr;
          gap: 40px;
        }

        .footer-brand-col {
          display: flex;
          flex-direction: column;
        }
        .footer-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          margin-bottom: 14px;
        }
        .footer-logo-icon {
          width: 36px;
          height: 36px;
          background: #b45309;
          color: #ffffff;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }
        .footer-logo-text {
          display: flex;
          flex-direction: column;
        }
        .footer-logo-text span {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1;
        }
        .footer-logo-text span strong {
          color: #f59e0b;
        }
        .footer-logo-text small {
          font-size: 0.6rem;
          letter-spacing: 2px;
          color: #cbd5e1;
        }
        .footer-brand-desc {
          font-size: 0.85rem;
          line-height: 1.6;
          color: #b7a296;
          margin-bottom: 20px;
        }
        .footer-social-links {
          display: flex;
          gap: 10px;
        }
        .footer-social-links a {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
        }
        .footer-social-links a:hover {
          background: var(--color-primary);
          transform: translateY(-2px);
        }
        .footer-social-links a.footer-wa-icon:hover {
          background: var(--color-whatsapp);
        }

        /* Headings */
        .footer-heading {
          color: #ffffff;
          font-size: 1.05rem;
          margin-bottom: 18px;
          position: relative;
          padding-bottom: 8px;
        }
        .footer-heading::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 32px;
          height: 2px;
          background: #b45309;
        }

        /* Lists */
        .footer-nav-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 9px;
        }
        .footer-nav-list li button,
        .footer-nav-list li a {
          color: #bfaea2;
          font-size: 0.86rem;
          transition: color var(--transition-fast);
          text-align: left;
        }
        .footer-nav-list li button:hover,
        .footer-nav-list li a:hover {
          color: #ffffff;
          padding-left: 4px;
        }

        /* Contact list */
        .footer-contact-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .footer-contact-list li {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 0.85rem;
        }
        .contact-icon {
          color: #f59e0b;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .contact-icon.wa-color {
          color: #22c55e;
        }
        .footer-contact-list div {
          display: flex;
          flex-direction: column;
        }
        .footer-contact-list strong {
          color: #ffffff;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }
        .footer-contact-list a {
          color: #d1b8a7;
          transition: color var(--transition-fast);
        }
        .footer-contact-list a:hover {
          color: #ffffff;
        }
        .footer-contact-list span {
          color: #bfaea2;
          line-height: 1.4;
        }

        /* Bottom bar */
        .footer-bottom-bar {
          background: #140a05;
          padding: 18px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          font-size: 0.8rem;
        }
        .bottom-bar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }
        .copyright-group {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .copyright-text {
          color: #8c766a;
          margin: 0;
        }
        .powered-by-divider {
          color: #5c4335;
          font-size: 0.8rem;
        }
        .powered-by-text {
          color: #a89487;
          font-size: 0.8rem;
          margin: 0;
        }
        .powered-by-link {
          color: #f59e0b;
          font-weight: 700;
          text-decoration: none;
          transition: color 0.2s ease, text-decoration 0.2s ease;
        }
        .powered-by-link:hover {
          color: #fde047;
          text-decoration: underline;
        }
        .payment-modes {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .payment-modes span {
          color: #8c766a;
        }
        .pay-badge {
          background: rgba(255, 255, 255, 0.08);
          color: #e2d5cb;
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 0.72rem;
          font-weight: 600;
        }

        @media (max-width: 992px) {
          .trust-badges-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .footer-columns-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 30px;
          }
        }
        @media (max-width: 640px) {
          .trust-badges-grid {
            grid-template-columns: 1fr;
          }
          .footer-columns-grid {
            grid-template-columns: 1fr;
          }
          .bottom-bar-inner {
            flex-direction: column;
            text-align: center;
            gap: 14px;
          }
          .copyright-group {
            justify-content: center;
            text-align: center;
            gap: 6px;
          }
          .payment-modes {
            justify-content: center;
          }
        }
      `}</style>
    </footer>
  );
}
