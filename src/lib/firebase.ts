import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  Auth
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  setDoc,
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  getDocs,
  deleteDoc,
  updateDoc,
  Firestore
} from "firebase/firestore";
import { Order } from "@/context/CartContext";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseEnabled = !!firebaseConfig.apiKey;

let app;
let auth: Auth | null = null;
let db: Firestore | null = null;
let googleProvider: GoogleAuthProvider | null = null;

if (isFirebaseEnabled) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
  } catch (error) {
    console.error("Error initializing Firebase:", error);
  }
}

export { auth, db };

// Auth Helper
export async function loginWithGoogleFirebase() {
  if (!isFirebaseEnabled || !auth || !googleProvider) {
    throw new Error("Firebase is not initialized");
  }
  const result = await signInWithPopup(auth, googleProvider);
  return {
    name: result.user.displayName || "مستخدم جديد",
    email: result.user.email || "",
    picture: result.user.displayName ? result.user.displayName.charAt(0) : "U",
  };
}

// Sign Out Helper
export async function logoutFirebase() {
  if (isFirebaseEnabled && auth) {
    await signOut(auth);
  }
}

// Place Order in Firestore
export async function placeOrderFirebase(order: Order) {
  if (!isFirebaseEnabled || !db) {
    throw new Error("Firebase is not initialized");
  }
  const orderRef = doc(db, "orders", order.id);
  await setDoc(orderRef, order);
}

// Update Order Status in Firestore
export async function updateOrderStatusFirebase(id: string, status: Order["status"]) {
  if (!isFirebaseEnabled || !db) {
    throw new Error("Firebase is not initialized");
  }
  const orderRef = doc(db, "orders", id);
  await updateDoc(orderRef, { status });
}

// Clear all orders in Firestore
export async function clearAllOrdersFirebase() {
  if (!isFirebaseEnabled || !db) {
    throw new Error("Firebase is not initialized");
  }
  const ordersCol = collection(db, "orders");
  const snapshot = await getDocs(ordersCol);
  const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
  await Promise.all(deletePromises);
}

// Subscribe to Orders in Firestore
export function subscribeToOrdersFirebase(onUpdate: (orders: Order[]) => void) {
  if (!isFirebaseEnabled || !db) {
    return () => {};
  }
  const ordersCol = collection(db, "orders");
  const q = query(ordersCol, orderBy("timestamp", "desc"));
  
  return onSnapshot(q, (snapshot) => {
    const orders: Order[] = [];
    snapshot.forEach((doc) => {
      orders.push(doc.data() as Order);
    });
    onUpdate(orders);
  }, (error) => {
    console.error("Firestore subscription error:", error);
  });
}
