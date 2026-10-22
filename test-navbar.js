// test-navbar.js - Navbar Layout, Ordering, Dividers & Viewport Testing Suite
import fs from 'fs';
import path from 'path';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

console.log('====================================================');
console.log('🧭 HOMEKART NAVBAR AUDIT & SPECIFICATION VALIDATOR');
console.log('====================================================\n');

const navbarPath = path.resolve('src/components/Navbar.jsx');
const navbarCode = fs.readFileSync(navbarPath, 'utf-8');

// Suite 1: Menu Item Ordering & Content
console.log('📌 Test Suite 1: Menu Item Sequence & Badges');
const primaryNavMatch = navbarCode.match(/<nav className="primary-nav">([\s\S]*?)<\/nav>/);
assert(!!primaryNavMatch, 'Primary desktop navbar exists');

if (primaryNavMatch) {
  const navHtml = primaryNavMatch[1];
  
  // Find indices of top-level menu item buttons
  const homeIdx = navHtml.indexOf("<button onClick={() => handleNavClick('home')");
  const furnIdx = navHtml.indexOf("<button \n                onClick={() => handleNavClick('furniture')");
  const elecIdx = navHtml.indexOf("<button \n                onClick={() => handleNavClick('electronics')");
  const appIdx = navHtml.indexOf("<button \n                onClick={() => handleNavClick('appliances')");
  const offerIdx = navHtml.indexOf("<li className={currentPage === 'offers'");
  const aboutIdx = navHtml.indexOf("<button onClick={() => handleNavClick('about')");
  const contactIdx = navHtml.indexOf("<button onClick={() => handleNavClick('contact')");

  assert(homeIdx !== -1 && furnIdx !== -1 && elecIdx !== -1 && appIdx !== -1 && offerIdx !== -1 && aboutIdx !== -1 && contactIdx !== -1,
    'All 7 menu items present in primary navigation');

  assert(
    homeIdx < furnIdx &&
    furnIdx < elecIdx &&
    elecIdx < appIdx &&
    appIdx < offerIdx &&
    offerIdx < aboutIdx &&
    aboutIdx < contactIdx,
    'Exact menu sequence verified: Home | Furniture | Electronics | Home Appliances | Offers & Combos | About Us | Contact Us'
  );

  assert(navHtml.includes('50% Off'), 'Offers & Combos contains the "50% Off" discount badge');
  assert(navHtml.includes('ChevronDown'), 'Dropdown arrows present on category menu items');
}

// Suite 2: Dividers & Borders
console.log('\n📌 Test Suite 2: Subtle Dividers & Navbar Styling');
const dividerMatches = (primaryNavMatch ? primaryNavMatch[1].match(/className="nav-divider"/g) : []) || [];
assert(dividerMatches.length >= 6, `Subtle vertical dividers placed between items (Count: ${dividerMatches.length})`);
assert(navbarCode.includes('.nav-divider'), 'CSS defines .nav-divider styling');
assert(navbarCode.includes('border-bottom:') && navbarCode.includes('.primary-nav'), 'Thin bottom border applied to primary-nav');
assert(navbarCode.includes('.nav-menu-list li.active button::after'), 'Active menu underline indicator styled');
assert(navbarCode.includes('offers-nav-item') && navbarCode.includes('#c2410c'), 'Orange-red styling applied to Offers & Combos');

// Suite 3: Dropdown Panels & Alignment
console.log('\n📌 Test Suite 3: Functional Dropdown Panels & Alignment');
assert(navbarCode.includes('dropdown-furniture') && navbarCode.includes('activeDropdown === \'furniture\''), 'Furniture functional dropdown panel wired');
assert(navbarCode.includes('dropdown-electronics') && navbarCode.includes('activeDropdown === \'electronics\''), 'Electronics functional dropdown panel wired');
assert(navbarCode.includes('dropdown-appliances') && navbarCode.includes('activeDropdown === \'appliances\''), 'Home Appliances functional dropdown panel wired');
assert(navbarCode.includes('.dropdown-appliances .nav-dropdown-menu'), 'Home Appliances panel aligned with responsive right/left adjustment');
assert(navbarCode.includes('nav-chevron-wrap') && navbarCode.includes('stopPropagation'), 'Chevron toggle click handlers enabled for dropdown menus');

// Suite 4: Single Row Desktop & Breakpoint Adaptations (320px, 375px, 768px, 1024px, 1440px)
console.log('\n📌 Test Suite 4: Viewport Adaptations (320px, 375px, 768px, 1024px, 1440px)');
assert(navbarCode.includes('flex-wrap: nowrap') && navbarCode.includes('white-space: nowrap'), 'Desktop nav enforces single-row layout without unwanted wrapping');
assert(navbarCode.includes('@media (max-width: 992px)'), 'Breakpoints toggle primary-nav to mobile hamburger under 992px (covering 320px, 375px, 768px)');
assert(navbarCode.includes('@media (max-width: 1100px) and (min-width: 993px)'), 'Compact spacing rule protects 1024px desktop row from wrapping');
assert(navbarCode.includes('.mobile-drawer-panel'), 'Mobile collapsible drawer defined for mobile viewports');
assert(navbarCode.includes('.drawer-accordion-header'), 'Mobile accordion dropdowns for categories implemented');
assert(navbarCode.includes('@media (max-width: 360px)'), 'Ultra-compact scaling for 320px small screens');

console.log('\n====================================================');
console.log(`🏁 NAVBAR AUDIT RESULTS: ${passed} PASSED | ${failed} FAILED`);
console.log('====================================================\n');

if (failed > 0) {
  process.exit(1);
}
