"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  auth,
  isFirebaseEnabled,
  loginWithGoogleFirebase,
  logoutFirebase,
  loginAnonymouslyFirebase,
  placeOrderFirebase,
  updateOrderStatusFirebase,
  clearAllOrdersFirebase,
  subscribeToOrdersFirebase,
} from "@/lib/firebase";

export interface CartItem {
  id: string;
  name: string;
  price: string;
  quantity: number;
  image: string;
  color: string;
  icon: string;
}

export interface GoogleUser {
  name: string;
  email: string;
  picture: string;
}

export interface Order {
  id: string;
  user: GoogleUser;
  items: CartItem[];
  subtotal: number;
  status: "preparing" | "delivering" | "completed" | "cancelled";
  timestamp: string;
}

interface CartContextType {
  cart: CartItem[];
  user: GoogleUser | null;
  orders: Order[];
  addToCart: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  loginWithGoogle: (email: string, name: string, picture: string) => Promise<void>;
  loginAnonymously: () => Promise<void>;
  logout: () => Promise<void>;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isOrdersOpen: boolean;
  setIsOrdersOpen: (open: boolean) => void;
  placeOrder: () => Promise<void>;
  updateOrderStatus: (id: string, status: Order["status"]) => Promise<void>;
  clearAllOrders: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart and check Auth state on mount
  useEffect(() => {
    // Load only cart from localStorage
    const savedCart = localStorage.getItem("hot_spicy_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error(e);
      }
    }

    if (isFirebaseEnabled) {
      // Firebase Auth state listener
      let unsubscribeAuth = () => {};
      if (auth) {
        unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
          if (firebaseUser) {
            if (firebaseUser.isAnonymous) {
              setUser({
                name: "مشرف النظام",
                email: "admin@hotspicy.com",
                picture: "A",
              });
            } else {
              setUser({
                name: firebaseUser.displayName || "مستخدم جديد",
                email: firebaseUser.email || "",
                picture: firebaseUser.displayName ? firebaseUser.displayName.charAt(0) : "U",
              });
            }
          } else {
            setUser(null);
          }
          setIsLoaded(true);
        });
      } else {
        setIsLoaded(true);
      }

      return () => {
        unsubscribeAuth();
      };
    } else {
      // LocalStorage Fallback logic
      const savedUser = localStorage.getItem("hot_spicy_user");
      const savedOrders = localStorage.getItem("hot_spicy_orders");
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.error(e);
        }
      }
      if (savedOrders) {
        try {
          setOrders(JSON.parse(savedOrders));
        } catch (e) {
          console.error(e);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  // Real-time Firestore Subscription (triggers only when user changes to avoid Permission Denied errors on load)
  useEffect(() => {
    if (!isFirebaseEnabled) return;

    if (user) {
      const unsubscribe = subscribeToOrdersFirebase((updatedOrders) => {
        setOrders(updatedOrders);
      }, user.email);

      return () => {
        unsubscribe();
      };
    } else {
      setOrders([]);
    }
  }, [user]);

  // Sync state when localStorage changes in other tabs (only if Firebase is disabled)
  useEffect(() => {
    if (isFirebaseEnabled) return;
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "hot_spicy_orders" && e.newValue) {
        try {
          setOrders(JSON.parse(e.newValue));
        } catch (err) {
          console.error(err);
        }
      }
      if (e.key === "hot_spicy_cart" && e.newValue) {
        try {
          setCart(JSON.parse(e.newValue));
        } catch (err) {
          console.error(err);
        }
      }
      if (e.key === "hot_spicy_user") {
        try {
          setUser(e.newValue ? JSON.parse(e.newValue) : null);
        } catch (err) {
          console.error(err);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Save cart changes to localStorage (always, since cart remains local)
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("hot_spicy_cart", JSON.stringify(cart));
  }, [cart, isLoaded]);

  // Save user changes to localStorage (only if Firebase is disabled)
  useEffect(() => {
    if (isFirebaseEnabled) return;
    if (!isLoaded) return;
    if (user) {
      localStorage.setItem("hot_spicy_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("hot_spicy_user");
    }
  }, [user, isLoaded]);

  // Save orders changes to localStorage (only if Firebase is disabled)
  useEffect(() => {
    if (isFirebaseEnabled) return;
    if (!isLoaded) return;
    localStorage.setItem("hot_spicy_orders", JSON.stringify(orders));
  }, [orders, isLoaded]);

  const addToCart = (newItem: Omit<CartItem, "quantity">, qty: number = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === newItem.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prevCart, { ...newItem, quantity: qty }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const loginWithGoogle = async (email: string, name: string, picture: string) => {
    if (isFirebaseEnabled) {
      const firebaseUser = await loginWithGoogleFirebase();
      setUser(firebaseUser);
    } else {
      setUser({ email, name, picture });
    }
  };

  const loginAnonymously = async () => {
    if (isFirebaseEnabled) {
      const firebaseUser = await loginAnonymouslyFirebase();
      setUser(firebaseUser);
    } else {
      setUser({
        name: "مشرف النظام",
        email: "admin@hotspicy.com",
        picture: "A",
      });
    }
  };


  const logout = async () => {
    if (isFirebaseEnabled) {
      await logoutFirebase();
    }
    setUser(null);
  };

  const placeOrder = async () => {
    if (!user || cart.length === 0) return;
    const subtotal = cart.reduce((total, item) => {
      const priceNum = parseInt(item.price.replace(/,/g, ""), 10);
      return total + priceNum * item.quantity;
    }, 0);
    const newOrder: Order = {
      id: `HS-${Math.floor(1000 + Math.random() * 9000)}`,
      user: user,
      items: [...cart],
      subtotal: subtotal,
      status: "preparing",
      timestamp: new Date().toISOString(),
    };

    if (isFirebaseEnabled) {
      await placeOrderFirebase(newOrder);
    } else {
      setOrders((prev) => [newOrder, ...prev]);
    }
  };


  const updateOrderStatus = async (id: string, status: Order["status"]) => {
    if (isFirebaseEnabled) {
      try {
        await updateOrderStatusFirebase(id, status);
      } catch (err) {
        console.error("Firebase updateOrderStatus Error, falling back to local:", err);
        setOrders((prev) =>
          prev.map((order) =>
            order.id === id ? { ...order, status } : order
          )
        );
      }
    } else {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === id ? { ...order, status } : order
        )
      );
    }
  };

  const clearAllOrders = async () => {
    if (isFirebaseEnabled) {
      try {
        await clearAllOrdersFirebase();
      } catch (err) {
        console.error("Firebase clearAllOrders Error, falling back to local:", err);
        setOrders([]);
      }
    } else {
      setOrders([]);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        user,
        orders,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        loginWithGoogle,
        loginAnonymously,
        logout,
        isCartOpen,
        setIsCartOpen,
        isOrdersOpen,
        setIsOrdersOpen,
        placeOrder,
        updateOrderStatus,
        clearAllOrders,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
