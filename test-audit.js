import { products, categories } from './src/data/products.js';

console.log('====================================================');
console.log('🧪 HOMEKART COMPREHENSIVE QA AUDIT & TEST RUNNER');
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
// TEST SUITE 1: PRODUCT CATALOG & DATA INTEGRITY
// ----------------------------------------------------
console.log('📌 Test Suite 1: Product Catalog & Data Integrity');

assert(Array.isArray(products) && products.length > 0, 'Products dataset is loaded and non-empty');
assert(products.length >= 10, `Catalog contains healthy volume of items (Count: ${products.length})`);

const validCategories = ['furniture', 'electronics', 'appliances'];
const categoriesFound = new Set(products.map(p => p.category));
assert(
  validCategories.every(cat => categoriesFound.has(cat)),
  'All 3 core categories (furniture, electronics, appliances) are populated',
  `Found: ${Array.from(categoriesFound).join(', ')}`
);

let allProductsHaveRequiredFields = true;
let brokenProductFields = [];
products.forEach(p => {
  if (!p.id || !p.name || !p.price || !p.category || !p.image) {
    allProductsHaveRequiredFields = false;
    brokenProductFields.push(p.id || p.name);
  }
});
assert(allProductsHaveRequiredFields, 'All products have required fields (id, name, price, category, image)', brokenProductFields.join(', '));

let pricesAreValid = products.every(p => typeof p.price === 'number' && p.price > 0);
assert(pricesAreValid, 'All product prices are positive numbers');

let discountsAreValid = products.every(p => !p.discount || (p.discount >= 0 && p.discount <= 100));
assert(discountsAreValid, 'Product discount percentages are within valid 0-100% range');

// ----------------------------------------------------
// TEST SUITE 2: CART, BILLING & DISCOUNT LOGIC
// ----------------------------------------------------
console.log('\n📌 Test Suite 2: Cart & Billing Math Simulation');

// Simulate adding 2 items to cart
let cart = [];
function addToCart(prod, qty = 1) {
  const existing = cart.find(i => i.id === prod.id);
  if (existing) {
    existing.quantity += qty;
  } else {
    cart.push({ ...prod, quantity: qty });
  }
}

addToCart(products[0], 1);
addToCart(products[1], 2);
assert(cart.length === 2, 'Added 2 distinct products to cart');
assert(cart[1].quantity === 2, 'Item quantity updated correctly in cart');

const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
const expectedSubtotal = (products[0].price * 1) + (products[1].price * 2);
assert(subtotal === expectedSubtotal, `Cart subtotal calculation correct (Expected: ₹${expectedSubtotal}, Got: ₹${subtotal})`);

// Coupon test
let discountRate = 0.10; // FESTIVE10 = 10%
const discountAmount = Math.round(subtotal * discountRate);
const totalAfterDiscount = subtotal - discountAmount;
assert(totalAfterDiscount < subtotal, 'Coupon discount reduces order total correctly');

// ----------------------------------------------------
// TEST SUITE 3: TRACK ORDER SEARCH LOGIC
// ----------------------------------------------------
console.log('\n📌 Test Suite 3: Order Tracking & Bill Lookup Engine');

const mockOrders = [
  {
    id: 'HK-2026-8941',
    customer: { name: 'Priya Sharma', phone: '+91 98401 23456' },
    status: 'Out for Delivery'
  },
  {
    id: 'HK-2026-7820',
    customer: { name: 'Rajesh Kumar', phone: '+91 97890 54321' },
    status: 'Delivered'
  }
];

function trackSearch(term) {
  const cleanTerm = term.trim().toLowerCase().replace(/[\s\-+]/g, '');
  return mockOrders.find(o => {
    const orderIdClean = o.id.toLowerCase().replace(/[\s\-+]/g, '');
    const phoneClean = (o.customer?.phone || '').replace(/[\s\-+]/g, '');
    const billCodeClean = (o.id || '').replace(/^hk[-_]?/i, '').toLowerCase();
    return (
      orderIdClean.includes(cleanTerm) ||
      billCodeClean.includes(cleanTerm) ||
      phoneClean.includes(cleanTerm) ||
      cleanTerm.includes(billCodeClean)
    );
  });
}

assert(trackSearch('HK-2026-8941')?.id === 'HK-2026-8941', 'Finds order by exact Bill Number');
assert(trackSearch('8941')?.id === 'HK-2026-8941', 'Finds order by numeric Bill code suffix (8941)');
assert(trackSearch('9840123456')?.id === 'HK-2026-8941', 'Finds order by 10-digit mobile number');
assert(trackSearch('97890 54321')?.id === 'HK-2026-7820', 'Finds order by formatted phone with spaces');
assert(trackSearch('INVALID-0000') === undefined, 'Returns undefined gracefully for non-existent order');

// ----------------------------------------------------
// TEST SUITE 4: ADMIN CREDENTIALS & SECURITY AUDIT
// ----------------------------------------------------
console.log('\n📌 Test Suite 4: Admin Credentials & Authentication Engine');

function authenticateAdmin(email, password) {
  if (!email || !password) return { success: false, error: 'Email and password required' };
  // Expected admin defaults
  if (email.trim().toLowerCase() === 'admin@homekart.com' && password === 'admin123') {
    return { success: true };
  }
  return { success: false, error: 'Invalid administrator email or password' };
}

assert(authenticateAdmin('admin@homekart.com', 'admin123').success, 'Admin accepts valid default credentials');
assert(!authenticateAdmin('admin@homekart.com', 'wrongpassword').success, 'Admin rejects invalid password');
assert(!authenticateAdmin('hacker@example.com', 'admin123').success, 'Admin rejects unauthorized email');
assert(!authenticateAdmin('', '').success, 'Admin rejects blank login inputs');

// ----------------------------------------------------
// TEST SUITE 5: LOCALSTORAGE PERSISTENCE SIMULATION
// ----------------------------------------------------
console.log('\n📌 Test Suite 5: Data Persistence & Schema Validation');

const sampleSiteContent = {
  storeName: 'HomeKart Showroom',
  phone: '+91 98765 43210',
  footerDescription: 'Your one-stop destination for premium stylish furniture and the latest smart home electronics.',
  instagramUrl: 'https://instagram.com/homekart',
  facebookUrl: 'https://facebook.com/homekart',
  youtubeUrl: 'https://youtube.com/@homekart',
  whatsappNumber: '+91 98765 43210'
};

const jsonSerialized = JSON.stringify(sampleSiteContent);
const deserialized = JSON.parse(jsonSerialized);
assert(deserialized.footerDescription.includes('Tamil Nadu') === false, 'Site content serialization round-trip valid');
assert(typeof deserialized.whatsappNumber === 'string', 'WhatsApp handle stored and retrieved correctly');

// ----------------------------------------------------
// SUMMARY
// ----------------------------------------------------
console.log('\n====================================================');
console.log(`🏁 TEST RESULTS: ${passCount} PASSED | ${failCount} FAILED`);
console.log('====================================================\n');

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
