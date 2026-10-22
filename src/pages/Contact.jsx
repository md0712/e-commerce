import React, { useState } from 'react';
import { 
  Phone, MessageCircle, Mail, MapPin, Clock, 
  Send, CheckCircle, Navigation, Sparkles, Building, ShieldCheck 
} from 'lucide-react';
import { storeInfo } from '../data/products';

export default function Contact({ storeSettings }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    category: 'Furniture & Living Room',
    branch: 'Flagship Showroom (Vyasarpadi, Chennai)',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [activeBranchIndex, setActiveBranchIndex] = useState(0);

  const branches = [
    {
      name: 'Flagship Mega Showroom (Vyasarpadi)',
      city: 'Chennai North',
      address: '190, Erukkenchery High Rd, Anbalagan Colony, Vyasarpadi, Chennai, Tamil Nadu 600039',
      phone: '+91 63830 56338',
      whatsapp: '916383056338',
      email: 'chennai.central@sardarmart.com',
      timing: '9:30 AM – 9:30 PM (All 7 Days Open)',
      // Google Maps embed URL for Chennai Vyasarpadi / Erukkenchery High Rd
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3885.6797825316335!2d80.2582766!3d13.1194212!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5265ecb902e861%3A0x6bfa5f73d8e578c7!2sErukkenchery%20High%20Rd%2C%20Chennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
      directionsUrl: 'https://maps.google.com/?q=190,+Erukkenchery+High+Rd,+Anbalagan+Colony,+Vyasarpadi,+Chennai,+Tamil+Nadu+600039'
    },
    {
      name: 'OMR Tech Corridor Experience Center',
      city: 'Chennai South',
      address: 'Plot 45, IT Highway, Thoraipakkam, OMR, Chennai, Tamil Nadu - 600097',
      phone: '+91 98765 43211',
      whatsapp: '919876543211',
      email: 'omr@sardarmart.com',
      timing: '10:00 AM – 9:00 PM (Everyday)',
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.756247348924!2d80.232371!3d12.923412!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525c34e8b5c92f%3A0xc3cf9c9a35e466b0!2sThoraipakkam%2C%20Chennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
      directionsUrl: 'https://maps.google.com/?q=Thoraipakkam+Chennai'
    },
    {
      name: 'Coimbatore Flagship Experience Center',
      city: 'Coimbatore',
      address: '88, Avinashi Road, Near Lakshmi Mills, Coimbatore, Tamil Nadu - 641037',
      phone: '+91 98765 43212',
      whatsapp: '919876543212',
      email: 'coimbatore@sardarmart.com',
      timing: '10:00 AM – 9:00 PM (Everyday)',
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.326887483789!2d76.980614!3d11.011681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba859a53164964f%3A0xc6657cbb592efb72!2sAvinashi%20Rd%2C%20Coimbatore%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
      directionsUrl: 'https://maps.google.com/?q=Avinashi+Road+Coimbatore'
    }
  ];

  const currentBranch = branches[activeBranchIndex];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('Please provide your name and phone number so our showroom consultant can contact you.');
      return;
    }
    setSubmitted(true);
  };

  const handleForwardToWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello Sardar Mart Team! My name is ${formData.name}. Phone: ${formData.phone}. Interested in: ${formData.category} for ${formData.branch}. Message: ${formData.message}`
    );
    window.open(`https://wa.me/${currentBranch.whatsapp}?text=${text}`, '_blank');
  };

  return (
    <div className="contact-page">
      {/* Header */}
      <section className="contact-hero">
        <div className="container">
          <div className="contact-hero-content">
            <span className="badge-pill badge-bestseller">We're Here For You</span>
            <h1 className="contact-headline">Contact Sardar Mart Showrooms &amp; Support</h1>
            <p className="contact-sub">
              Have questions about customized sofa fabrics, bulk order discounts, or 0% EMI financing? Our showroom consultants and Proprietor Rahim Baig are ready to assist.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content: Info & Form */}
      <section className="contact-main-section">
        <div className="container">
          <div className="contact-layout-grid">
            {/* Left: Contact Info & Branch Switcher */}
            <div className="contact-info-col">
              {/* Verified Store & Tax Credentials Badge */}
              <div className="channel-card" style={{ gridColumn: 'span 2', background: 'linear-gradient(135deg, rgba(162, 78, 35, 0.08) 0%, rgba(200, 115, 60, 0.12) 100%)', border: '1.5px solid rgba(162, 78, 35, 0.25)', padding: '14px 18px' }}>
                <div className="channel-icon-circle" style={{ background: '#a24e23', color: '#fff' }}>
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, fontSize: '1rem', color: '#1e293b' }}>Sardar Mart</span>
                    <span style={{ fontSize: '0.72rem', background: '#10b981', color: '#fff', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>Showroom Verified</span>
                  </div>
                  {storeSettings?.showGstinBadge ? (
                    <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '3px' }}>
                      <strong>GSTIN:</strong> <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#a24e23', letterSpacing: '0.5px' }}>33DVKPR2334L1Z9</span> • <strong>Proprietor:</strong> Rahim Baig
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '3px' }}>
                      <strong>Authorized Showroom</strong> • <strong>Proprietor:</strong> Rahim Baig
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Communication Cards */}
              <div className="quick-channels-grid">
                <a href="tel:+916383056338" className="channel-card">
                  <div className="channel-icon-circle">
                    <Phone size={20} />
                  </div>
                  <div>
                    <span className="channel-label">Call Showroom</span>
                    <strong>+91 63830 56338</strong>
                  </div>
                </a>

                <a 
                  href="https://wa.me/916383056338" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="channel-card wa-channel"
                >
                  <div className="channel-icon-circle wa-icon-bg">
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <span className="channel-label">WhatsApp Chat</span>
                    <strong>Instant Response</strong>
                  </div>
                </a>

                <a href="mailto:care@sardarmart.com" className="channel-card">
                  <div className="channel-icon-circle">
                    <Mail size={20} />
                  </div>
                  <div>
                    <span className="channel-label">Email Support</span>
                    <strong>care@sardarmart.com</strong>
                  </div>
                </a>

                <div className="channel-card">
                  <div className="channel-icon-circle">
                    <Clock size={20} />
                  </div>
                  <div>
                    <span className="channel-label">Store Hours</span>
                    <strong>9:30 AM – 9:30 PM</strong>
                  </div>
                </div>
              </div>

              {/* Showroom Branch Switcher */}
              <div className="branch-selector-card">
                <h3 className="card-subhead">
                  <Building size={18} /> Select Showroom Branch
                </h3>
                <div className="branch-tabs">
                  {branches.map((b, idx) => (
                    <button
                      key={idx}
                      className={`branch-tab-btn ${activeBranchIndex === idx ? 'active' : ''}`}
                      onClick={() => setActiveBranchIndex(idx)}
                    >
                      <strong>{b.city}</strong>
                      <span>{b.name.split('(')[0]}</span>
                    </button>
                  ))}
                </div>

                <div className="active-branch-details">
                  <h4>{currentBranch.name}</h4>
                  <p className="branch-address-text">
                    <MapPin size={16} className="inline-pin" /> {currentBranch.address}
                  </p>
                  <p className="branch-hours-text">
                    <Clock size={16} className="inline-pin" /> {currentBranch.timing}
                  </p>
                  <div className="branch-action-row">
                    <a 
                      href={currentBranch.directionsUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="btn-outline branch-dir-btn"
                    >
                      <Navigation size={15} /> Open in Google Maps
                    </a>
                    <a 
                      href={`https://wa.me/${currentBranch.whatsapp}?text=Hi%20Sardar%20Mart%2C%20I%20am%20enquiring%20about%20your%20${currentBranch.city}%20showroom`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-whatsapp branch-wa-btn"
                    >
                      <MessageCircle size={15} /> Chat with Store Manager
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Enquiry Form */}
            <div className="contact-form-col">
              <div className="enquiry-card">
                {!submitted ? (
                  <>
                    <div className="form-header">
                      <span className="form-badge">Priority Consultation</span>
                      <h2>Send Us an Enquiry</h2>
                      <p>Fill out the form below and an interior or appliance specialist will call or WhatsApp you within 15 minutes.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="enquiry-form">
                      <div className="form-row-2">
                        <div className="form-group">
                          <label>Full Name *</label>
                          <input 
                            type="text" 
                            name="name" 
                            required 
                            placeholder="e.g. Ramesh Kumar" 
                            value={formData.name}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group">
                          <label>Phone / WhatsApp Number *</label>
                          <input 
                            type="tel" 
                            name="phone" 
                            required 
                            placeholder="e.g. 98765 43210" 
                            value={formData.phone}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Email Address</label>
                        <input 
                          type="email" 
                          name="email" 
                          placeholder="e.g. ramesh@example.com" 
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-row-2">
                        <div className="form-group">
                          <label>Interested In</label>
                          <select 
                            name="category" 
                            value={formData.category}
                            onChange={handleChange}
                          >
                            <option>Furniture &amp; Living Room</option>
                            <option>Bedroom Suites &amp; Mattresses</option>
                            <option>Smart TVs &amp; Home Audio</option>
                            <option>Refrigerators &amp; Washers</option>
                            <option>Kitchen &amp; Home Appliances</option>
                            <option>Complete Home Combo Bundles</option>
                            <option>Bulk / Commercial Showroom Orders</option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label>Preferred Showroom</label>
                          <select 
                            name="branch" 
                            value={formData.branch}
                            onChange={handleChange}
                          >
                            <option>Flagship Showroom (Vyasarpadi, Chennai)</option>
                            <option>OMR Tech Showroom (Thoraipakkam)</option>
                            <option>Coimbatore Experience Center</option>
                            <option>Online Order &amp; Home Delivery Assistance</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Your Message / Specific Product Requirements</label>
                        <textarea 
                          name="message" 
                          rows={4} 
                          placeholder="Tell us about the products you're looking for, room dimensions, custom fabric color preferences, or discount queries..."
                          value={formData.message}
                          onChange={handleChange}
                        ></textarea>
                      </div>

                      <button type="submit" className="btn-primary submit-enquiry-btn">
                        <Send size={18} /> Submit Showroom Enquiry
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="submitted-confirmation-box animate-fade-in">
                    <div className="conf-icon-circle">
                      <CheckCircle size={46} color="#15803d" />
                    </div>
                    <h2>Thank You, {formData.name}!</h2>
                    <p className="conf-sub">
                      Your enquiry has been successfully registered with reference <strong>#HK-{Math.floor(100000 + Math.random() * 900000)}</strong>.
                    </p>
                    <div className="conf-details-card">
                      <p><strong>Selected Branch:</strong> {formData.branch}</p>
                      <p><strong>Interest Area:</strong> {formData.category}</p>
                      <p><strong>Callback Phone:</strong> {formData.phone}</p>
                    </div>
                    <p className="conf-callout">
                      Our Senior Consultant from {formData.branch} is reviewing your requirements and will contact you shortly.
                    </p>
                    <div className="conf-actions">
                      <button 
                        className="btn-whatsapp"
                        onClick={handleForwardToWhatsApp}
                      >
                        <MessageCircle size={18} /> Continue to WhatsApp Chat
                      </button>
                      <button 
                        className="btn-secondary"
                        onClick={() => setSubmitted(false)}
                      >
                        Send Another Query
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Google Maps Section */}
      <section className="google-map-section">
        <div className="container">
          <div className="map-header">
            <div>
              <span className="badge-pill badge-popular">Interactive Map</span>
              <h2 className="section-main-heading">Showroom Location &amp; Driving Directions</h2>
              <p className="section-sub-heading">Currently viewing: {currentBranch.name}</p>
            </div>
            <a 
              href={currentBranch.directionsUrl} 
              target="_blank" 
              rel="noreferrer"
              className="btn-primary"
            >
              <Navigation size={16} /> Get Driving Route
            </a>
          </div>

          <div className="map-embed-container">
            <iframe
              title={`Map for ${currentBranch.name}`}
              src={currentBranch.mapEmbedUrl}
              width="100%"
              height="420"
              style={{ border: 0, borderRadius: '16px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      <style>{`
        .contact-page {
          padding-bottom: 60px;
        }

        .contact-hero {
          background: linear-gradient(135deg, #2a1810 0%, #170d07 100%);
          color: #ffffff;
          padding: 55px 0;
          text-align: center;
        }
        .contact-hero-content {
          max-width: 700px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .contact-headline {
          font-size: 2.5rem;
          color: #ffffff;
          margin: 12px 0 8px;
          line-height: 1.2;
        }
        .contact-sub {
          color: #e2d5cb;
          font-size: 1rem;
          line-height: 1.5;
        }

        /* Layout Grid */
        .contact-main-section {
          padding: 40px 0;
        }
        .contact-layout-grid {
          display: grid;
          grid-template-columns: 1fr 1.25fr;
          gap: 36px;
        }

        /* Channels */
        .quick-channels-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
          margin-bottom: 24px;
        }
        .channel-card {
          background: #ffffff;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 14px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: var(--shadow-sm);
          transition: all var(--transition-fast);
        }
        .channel-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
          border-color: var(--color-primary);
        }
        .channel-icon-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--color-primary-light);
          color: var(--color-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .wa-channel:hover {
          border-color: var(--color-whatsapp);
        }
        .wa-icon-bg {
          background: #f0fdf4;
          color: var(--color-whatsapp);
        }
        .channel-label {
          font-size: 0.72rem;
          color: var(--color-text-light);
          display: block;
          text-transform: uppercase;
          font-weight: 700;
        }
        .channel-card strong {
          font-size: 0.88rem;
          color: var(--color-text-main);
        }

        /* Branch Selector */
        .branch-selector-card {
          background: #ffffff;
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-border);
          padding: 24px;
          box-shadow: var(--shadow-sm);
        }
        .card-subhead {
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }
        .branch-tabs {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
        }
        .branch-tab-btn {
          padding: 12px 16px;
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border);
          background: #faf6f1;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          transition: all var(--transition-fast);
        }
        .branch-tab-btn:hover {
          background: #f4ece4;
        }
        .branch-tab-btn.active {
          background: #fff3ec;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 1px var(--color-primary);
        }
        .branch-tab-btn strong {
          font-size: 0.95rem;
          color: var(--color-primary);
        }
        .branch-tab-btn span {
          font-size: 0.8rem;
          color: var(--color-text-muted);
        }

        .active-branch-details {
          background: #fcf9f5;
          border-radius: var(--radius-md);
          padding: 18px;
          border: 1px solid #eddcd0;
        }
        .active-branch-details h4 {
          font-size: 1rem;
          margin-bottom: 10px;
          color: var(--color-warm-dark);
        }
        .branch-address-text, .branch-hours-text {
          font-size: 0.85rem;
          color: var(--color-text-muted);
          line-height: 1.5;
          margin-bottom: 8px;
          display: flex;
          align-items: flex-start;
          gap: 6px;
        }
        .inline-pin {
          color: var(--color-primary);
          flex-shrink: 0;
          margin-top: 3px;
        }
        .branch-action-row {
          display: flex;
          gap: 10px;
          margin-top: 14px;
          flex-wrap: wrap;
        }
        .branch-dir-btn, .branch-wa-btn {
          font-size: 0.82rem;
          padding: 8px 14px;
        }

        /* Enquiry Form Card */
        .enquiry-card {
          background: #ffffff;
          border-radius: var(--radius-xl);
          border: 1px solid var(--color-border);
          padding: 36px;
          box-shadow: var(--shadow-md);
        }
        .form-header {
          margin-bottom: 24px;
        }
        .form-badge {
          background: #fff7ed;
          color: var(--color-primary);
          padding: 4px 10px;
          border-radius: var(--radius-full);
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
        }
        .form-header h2 {
          font-size: 1.8rem;
          margin: 6px 0 4px;
        }
        .form-header p {
          font-size: 0.88rem;
          color: var(--color-text-muted);
        }

        .enquiry-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .form-row-2 {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .form-group label {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--color-text-main);
        }
        .form-group input, 
        .form-group select, 
        .form-group textarea {
          border: 1.5px solid #d8c7bb;
          border-radius: var(--radius-md);
          padding: 10px 14px;
          outline: none;
          color: var(--color-text-main);
          transition: border-color var(--transition-fast);
          background: #ffffff;
        }
        .form-group input:focus, 
        .form-group select:focus, 
        .form-group textarea:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(162, 78, 35, 0.12);
        }
        .submit-enquiry-btn {
          width: 100%;
          padding: 13px;
          font-size: 1rem;
          margin-top: 8px;
        }

        /* Confirmation */
        .submitted-confirmation-box {
          text-align: center;
          padding: 30px 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .conf-icon-circle {
          width: 76px;
          height: 76px;
          border-radius: 50%;
          background: #f0fdf4;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }
        .submitted-confirmation-box h2 {
          font-size: 1.8rem;
          margin-bottom: 8px;
        }
        .conf-sub {
          font-size: 0.95rem;
          color: var(--color-text-muted);
          margin-bottom: 20px;
        }
        .conf-details-card {
          background: #faf6f2;
          border-radius: var(--radius-md);
          padding: 16px 24px;
          text-align: left;
          width: 100%;
          max-width: 400px;
          margin-bottom: 18px;
          font-size: 0.88rem;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .conf-callout {
          font-size: 0.88rem;
          color: #785949;
          margin-bottom: 24px;
          max-width: 440px;
        }
        .conf-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: center;
        }

        /* Google Map */
        .google-map-section {
          padding: 30px 0 40px;
        }
        .map-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .map-embed-container {
          background: #f4ede5;
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: var(--shadow-md);
          border: 1px solid var(--color-border);
        }

        @media (max-width: 992px) {
          .contact-layout-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 600px) {
          .enquiry-form-card {
            padding: 20px 14px;
          }
          .form-header h2 {
            font-size: 1.4rem;
          }
          .form-row-2 {
            grid-template-columns: 1fr;
          }
          .quick-channels-grid {
            grid-template-columns: 1fr;
          }
          .branch-item-card {
            padding: 14px 12px;
          }
          .map-embed-container iframe {
            height: 280px;
          }
        }

        @media (max-width: 380px) {
          .contact-headline {
            font-size: 1.5rem;
          }
          .channel-card {
            padding: 10px 12px;
          }
          .channel-icon-circle {
            width: 36px;
            height: 36px;
          }
        }
      `}</style>
    </div>
  );
}
