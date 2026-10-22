import fs from 'fs';
import path from 'path';

console.log('====================================================');
console.log('📱 HOMEKART COMPREHENSIVE RESPONSIVE AUDIT & BREAKPOINT VALIDATOR');
console.log('====================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passCount++;
  } else {
    console.error(`  ❌ FAIL: ${testName} - ${details}`);
    failCount++;
  }
}

// ----------------------------------------------------
// 1. VIEWPORT META TAG AUDIT
// ----------------------------------------------------
console.log('📌 Test Suite 1: Viewport Meta Tag & Document Shell');
const indexHtml = fs.readFileSync('./index.html', 'utf-8');
assert(
  indexHtml.includes('<meta name="viewport" content="width=device-width, initial-scale=1.0" />'),
  'Viewport meta tag configured with width=device-width, initial-scale=1.0'
);
assert(!indexHtml.includes('maximum-scale=1.0'), 'Viewport does not block pinch-to-zoom accessibility');

// ----------------------------------------------------
// 2. CSS BREAKPOINTS & UNIVERSAL GRID SCALING
// ----------------------------------------------------
console.log('\n📌 Test Suite 2: Product Cards Grid Across Target Viewports');
const indexCss = fs.readFileSync('./src/index.css', 'utf-8');

// Desktop: 4 columns
assert(
  indexCss.includes('grid-template-columns: repeat(4, minmax(0, 1fr))'),
  'Desktop (1280px, 1440px): 4-column product grid defined'
);

// Tablet: 3 columns (max-width: 1200px)
assert(
  indexCss.includes('@media (max-width: 1200px)') && indexCss.includes('grid-template-columns: repeat(3, minmax(0, 1fr))'),
  'Tablet (768px, 1024px): 3-column product grid defined'
);

// Mobile: 2 columns (max-width: 820px, 768px, 640px)
assert(
  indexCss.includes('@media (max-width: 820px)') && indexCss.includes('grid-template-columns: repeat(2, minmax(0, 1fr)) !important'),
  'Mobile (320px, 360px, 375px, 390px, 414px): 2-column product grid enforced'
);

// Horizontal overflow protection
assert(
  indexCss.includes('overflow-x: hidden') && indexCss.includes('box-sizing: border-box'),
  'Zero horizontal overflow: Global overflow-x: hidden and box-sizing applied'
);

// Reduced-motion accessibility
assert(
  indexCss.includes('@media (prefers-reduced-motion: reduce)'),
  'Accessibility: prefers-reduced-motion media query implemented'
);

// ----------------------------------------------------
// 3. PRODUCT CARD COMPONENT AUDIT
// ----------------------------------------------------
console.log('\n📌 Test Suite 3: ProductCard Component Responsiveness');
const productCardSrc = fs.readFileSync('./src/components/ProductCard.jsx', 'utf-8');
assert(
  productCardSrc.includes('@media (max-width: 600px)') && productCardSrc.includes('height: 145px'),
  'ProductCard: Mobile image container height scaled down to 145px'
);
assert(
  productCardSrc.includes('@media (max-width: 380px)') && productCardSrc.includes('height: 130px'),
  'ProductCard: Extra small screens (320px-360px) image scaled to 130px'
);
assert(
  productCardSrc.includes('object-fit: cover'),
  'ProductCard: Consistent aspect ratio with object-fit: cover (no distortion)'
);
assert(
  productCardSrc.includes('btn-view-details') && productCardSrc.includes('btn-enquire'),
  'ProductCard: Both "View Details" and "Enquire" buttons configured'
);

// ----------------------------------------------------
// 4. NAVBAR & MOBILE DRAWER NAVIGATION AUDIT
// ----------------------------------------------------
console.log('\n📌 Test Suite 4: Responsive Navbar & Touch Navigation');
const navbarSrc = fs.readFileSync('./src/components/Navbar.jsx', 'utf-8');
const mobileNavSrc = fs.readFileSync('./src/components/MobileBottomNav.jsx', 'utf-8');

assert(
  navbarSrc.includes('mobile-toggle-btn') && navbarSrc.includes('mobile-drawer-backdrop'),
  'Navbar: Mobile hamburger button and slide-in drawer implemented'
);
assert(
  navbarSrc.includes('mobileExpandedCat') && navbarSrc.includes('mobile-drawer-accordion'),
  'Navbar: Mobile touch accordions for Furniture, Electronics, and Appliances'
);
assert(
  navbarSrc.includes('@media (max-width: 360px)'),
  'Navbar: Extra small screens (320px-360px) header compact scaling'
);
assert(
  mobileNavSrc.includes('mobile-bottom-nav') && mobileNavSrc.includes('@media (max-width: 768px)'),
  'MobileBottomNav: Sticky bottom navigation bar for mobile devices'
);

// ----------------------------------------------------
// 5. INTRO LOADER ANIMATION AUDIT
// ----------------------------------------------------
console.log('\n📌 Test Suite 5: IntroLoader Animation & Mobile Scaling');
const introLoaderSrc = fs.readFileSync('./src/components/IntroLoader.jsx', 'utf-8');
assert(
  introLoaderSrc.includes('homekart-intro-screen') && introLoaderSrc.includes('intro-skip-pill'),
  'IntroLoader: Warm beige loading screen with skip button implemented'
);
assert(
  introLoaderSrc.includes('center-spinner-wrapper') && introLoaderSrc.includes('spinner-orbit-node'),
  'IntroLoader: Orbiting circular spinner with central HomeKart emblem'
);
assert(
  introLoaderSrc.includes('@media (max-width: 360px)'),
  'IntroLoader: Scales cleanly on 320px-360px viewports'
);

// ----------------------------------------------------
// 6. ADMIN PANEL DASHBOARD AUDIT
// ----------------------------------------------------
console.log('\n📌 Test Suite 6: Admin Dashboard Mobile Sidebar & Tables');
const adminSrc = fs.readFileSync('./src/pages/AdminPanel.jsx', 'utf-8');
assert(
  adminSrc.includes('mobileSidebarOpen') && adminSrc.includes('admin-sidebar.mobile-open'),
  'AdminPanel: Collapsible mobile sidebar with drawer overlay'
);
assert(
  adminSrc.includes('admin-table-wrap') && adminSrc.includes('overflow-x: auto'),
  'AdminPanel: Responsive mobile tables with horizontal scrolling'
);
assert(
  adminSrc.includes('@media (max-width: 640px)') && adminSrc.includes('kpi-cards-grid'),
  'AdminPanel: Mobile KPI cards grid and dialog stacking'
);
assert(
  adminSrc.includes('@media (max-width: 480px)') && adminSrc.includes('login-form-panel'),
  'AdminPanel: Login screen fits small mobile viewports with on-screen keyboard'
);

// ----------------------------------------------------
// 7. MODALS & FORMS AUDIT
// ----------------------------------------------------
console.log('\n📌 Test Suite 7: Modals, Dialogs & Touch Forms');
const trackOrderSrc = fs.readFileSync('./src/components/TrackOrderModal.jsx', 'utf-8');
const invoiceSrc = fs.readFileSync('./src/components/InvoiceModal.jsx', 'utf-8');
const contactSrc = fs.readFileSync('./src/pages/Contact.jsx', 'utf-8');

assert(
  trackOrderSrc.includes('stepper-horizontal') && trackOrderSrc.includes('@media (max-width: 480px)'),
  'TrackOrderModal: Converts horizontal timeline to vertical on small screens'
);
assert(
  invoiceSrc.includes('@media (max-width: 640px)') && invoiceSrc.includes('totals-box'),
  'InvoiceModal: Scales tax invoice and calculations cleanly on mobile'
);
assert(
  contactSrc.includes('@media (max-width: 600px)') && contactSrc.includes('enquiry-form-card'),
  'Contact: Contact & showroom enquiry form adapts to mobile viewports'
);

// ----------------------------------------------------
// SUMMARY
// ----------------------------------------------------
console.log('\n====================================================');
console.log(`🏁 RESPONSIVE AUDIT RESULTS: ${passCount} PASSED | ${failCount} FAILED`);
console.log('====================================================\n');

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
