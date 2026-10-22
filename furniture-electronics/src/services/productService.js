import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { products as initialProducts } from '../data/products';

const PRODUCTS_COLLECTION = 'products';

/**
 * Fetch all products from Firestore.
 * Fallback to bundled initialProducts if Firestore is currently unseeded.
 */
export async function getProducts() {
  try {
    const colRef = collection(db, PRODUCTS_COLLECTION);
    const snapshot = await getDocs(colRef);

    if (snapshot.empty) {
      // If collection is empty, return local catalog for seamless UX
      return initialProducts;
    }

    const items = [];
    snapshot.forEach((docSnap) => {
      items.push({
        id: docSnap.id,
        ...docSnap.data()
      });
    });

    return items;
  } catch (error) {
    console.warn('Firestore getProducts error, falling back to local catalog:', error.message);
    return initialProducts;
  }
}

/**
 * Fetch a single product by ID
 */
export async function getProductById(productId) {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, String(productId));
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() };
    }
    // Check fallback catalog
    return initialProducts.find((p) => String(p.id) === String(productId)) || null;
  } catch (error) {
    console.warn(`Firestore getProductById error for ${productId}:`, error.message);
    return initialProducts.find((p) => String(p.id) === String(productId)) || null;
  }
}

/**
 * Create a new product in Firestore (Admin only)
 */
export async function createProduct(productData) {
  const colRef = collection(db, PRODUCTS_COLLECTION);
  const cleanData = {
    ...productData,
    price: Number(productData.price) || 0,
    originalPrice: Number(productData.originalPrice) || Number(productData.price) || 0,
    discount: Number(productData.discount) || 0,
    stock: Number(productData.stock) || 10,
    active: productData.active !== undefined ? productData.active : true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  if (productData.id && typeof productData.id === 'string' && !productData.id.startsWith('new_')) {
    const docRef = doc(db, PRODUCTS_COLLECTION, productData.id);
    await setDoc(docRef, cleanData);
    return { id: productData.id, ...cleanData };
  } else {
    const docRef = await addDoc(colRef, cleanData);
    return { id: docRef.id, ...cleanData };
  }
}

/**
 * Update existing product (Admin only)
 */
export async function updateProduct(productId, updates) {
  const docRef = doc(db, PRODUCTS_COLLECTION, String(productId));
  const cleanUpdates = {
    ...updates,
    updatedAt: serverTimestamp()
  };
  if (updates.price !== undefined) cleanUpdates.price = Number(updates.price);
  if (updates.originalPrice !== undefined) cleanUpdates.originalPrice = Number(updates.originalPrice);
  if (updates.stock !== undefined) cleanUpdates.stock = Number(updates.stock);

  await setDoc(docRef, cleanUpdates, { merge: true });
  return { id: productId, ...cleanUpdates };
}

/**
 * Delete product (Admin only)
 */
export async function deleteProduct(productId) {
  const docRef = doc(db, PRODUCTS_COLLECTION, String(productId));
  await deleteDoc(docRef);
  return productId;
}

/**
 * Seed initial catalog to Firestore (Admin utility)
 * Copies bundled products into Firestore using a batch write.
 */
export async function seedProductsToFirestore(productsList = initialProducts) {
  const batch = writeBatch(db);
  const now = new Date();

  productsList.forEach((prod) => {
    const docRef = doc(db, PRODUCTS_COLLECTION, String(prod.id));
    batch.set(docRef, {
      ...prod,
      price: Number(prod.price) || 0,
      originalPrice: Number(prod.originalPrice) || Number(prod.price) || 0,
      active: true,
      stock: prod.stock || 15,
      createdAt: now,
      updatedAt: now
    });
  });

  await batch.commit();
  return productsList.length;
}
