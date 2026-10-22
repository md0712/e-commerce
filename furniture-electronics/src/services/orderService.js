import { 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

const ORDERS_COLLECTION = 'orders';

/**
 * Place a new order into Firestore
 */
export async function createOrder(orderData, customerUid = null) {
  const cleanOrder = {
    ...orderData,
    customerUid: customerUid || 'guest',
    subtotal: Number(orderData.subtotal) || 0,
    discount: Number(orderData.discount) || 0,
    delivery: Number(orderData.delivery) || 0,
    total: Number(orderData.total) || 0,
    status: orderData.status || 'Order Placed',
    paymentStatus: orderData.paymentStatus || 'Pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  if (orderData.id) {
    const docRef = doc(db, ORDERS_COLLECTION, String(orderData.id));
    await setDoc(docRef, cleanOrder);
    return { id: orderData.id, ...cleanOrder };
  } else {
    const colRef = collection(db, ORDERS_COLLECTION);
    const docRef = await addDoc(colRef, cleanOrder);
    return { id: docRef.id, ...cleanOrder };
  }
}

/**
 * Fetch orders belonging to a specific customer
 */
export async function getOrdersForCustomer(customerUid) {
  if (!customerUid) return [];
  try {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      where('customerUid', '==', customerUid)
    );
    const snap = await getDocs(q);
    const list = [];
    snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
    return list;
  } catch (err) {
    console.warn('Error fetching customer orders:', err);
    return [];
  }
}

/**
 * Get all orders (Admin only)
 */
export async function getOrdersAdmin() {
  try {
    const colRef = collection(db, ORDERS_COLLECTION);
    const snap = await getDocs(colRef);
    const list = [];
    snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
    return list;
  } catch (err) {
    console.warn('Error fetching all orders for admin:', err);
    return [];
  }
}

/**
 * Real-time listener for Orders in Admin Panel
 * Returns an unsubscribe function for React useEffect cleanup
 */
export function subscribeToOrdersAdmin(onUpdate, onError) {
  try {
    const colRef = collection(db, ORDERS_COLLECTION);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const list = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() });
        });
        onUpdate(list);
      },
      (error) => {
        console.warn('Real-time orders listener notice:', error.message);
        if (onError) onError(error);
      }
    );
  } catch (err) {
    console.warn('Could not establish real-time order listener:', err);
    return () => {};
  }
}

/**
 * Update order status (Admin only)
 */
export async function updateOrderStatus(orderId, status) {
  const docRef = doc(db, ORDERS_COLLECTION, String(orderId));
  await updateDoc(docRef, {
    status,
    updatedAt: serverTimestamp()
  });
  return { id: orderId, status };
}

/**
 * Edit order details (Admin only)
 */
export async function editOrder(orderId, updates) {
  const docRef = doc(db, ORDERS_COLLECTION, String(orderId));
  const cleanUpdates = {
    ...updates,
    updatedAt: serverTimestamp()
  };
  await updateDoc(docRef, cleanUpdates);
  return { id: orderId, ...cleanUpdates };
}

/**
 * Delete order from Firestore (Admin only)
 */
export async function deleteOrder(orderId) {
  const docRef = doc(db, ORDERS_COLLECTION, String(orderId));
  await deleteDoc(docRef);
  return orderId;
}
