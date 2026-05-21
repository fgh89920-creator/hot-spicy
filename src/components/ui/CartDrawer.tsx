"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import GoogleAuthModal from "./GoogleAuthModal";

export default function CartDrawer() {
  const {
    cart,
    user,
    isCartOpen,
    setIsCartOpen,
    setIsOrdersOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    logout,
    placeOrder,
  } = useCart();

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [checkoutStatus, setCheckoutStatus] = useState<"idle" | "processing" | "success" | "error">("idle");

  // Two-way safeguard:
  // - When drawer OPENS: if a stale "success" state exists from a previous order, clear it
  //   immediately so the user sees fresh cart items (not the old success screen).
  //   Never touch "processing" so we don't cancel an ongoing checkout.
  // - When drawer CLOSES: reset everything after the exit animation (400ms).
  React.useEffect(() => {
    if (isCartOpen) {
      // Only clear stale "success" - leave "processing" untouched
      setCheckoutStatus((prev) => (prev === "success" ? "idle" : prev));
      setIsAuthOpen(false);
    } else {
      const t = setTimeout(() => {
        setCheckoutStatus("idle");
        setIsAuthOpen(false);
      }, 400);
      return () => clearTimeout(t);
    }
  }, [isCartOpen]);

  // Reset checkout status to idle whenever a new item is added to the cart
  React.useEffect(() => {
    if (cart.length > 0) {
      setCheckoutStatus("idle");
    }
  }, [cart.length]);






  const subtotal = cart.reduce((total, item) => {
    const priceNum = parseInt(item.price.replace(/,/g, ""), 10);
    return total + priceNum * item.quantity;
  }, 0);

  const formattedSubtotal = new Intl.NumberFormat().format(subtotal);

  const handleCheckout = async () => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    // Already logged in, process order
    setCheckoutStatus("processing");
    try {
      await placeOrder();
      setCheckoutStatus("success");
      clearCart();
    } catch (err) {
      console.error("Checkout error:", err);
      setCheckoutStatus("error");
    }
  };

  const handleAuthSuccess = async () => {
    // Auth successful — close auth modal first, then process order
    setIsAuthOpen(false);
    setCheckoutStatus("processing");
    try {
      await placeOrder();
      setCheckoutStatus("success");
      clearCart();
    } catch (err) {
      console.error("Auth checkout error:", err);
      setCheckoutStatus("error");
    }
  };


  return (
    <>
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-40 overflow-hidden font-arabic pointer-events-none">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
            />

            {/* Drawer container */}
            <div className="absolute inset-y-0 right-0 max-w-full flex pl-10 pointer-events-none">
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "tween", duration: 0.35 }}
                className="w-screen max-w-md bg-surface-dark/95 border-l border-white/5 shadow-2xl backdrop-blur-2xl flex flex-col pointer-events-auto"
              >
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🛒</span>
                    <h3 className="text-lg font-bold text-white">سلة الطلبات</h3>
                    {cart.length > 0 && (
                      <span className="bg-brand-red text-white text-xs px-2 py-0.5 rounded-full font-black">
                        {cart.reduce((sum, item) => sum + item.quantity, 0)}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="text-white/40 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {/* User Session Bar */}
                <div className="px-6 py-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
                  {user ? (
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-10 h-10 rounded-full bg-brand-orange/20 border border-brand-orange/40 flex items-center justify-center font-bold text-brand-orange">
                        {user.picture}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-semibold truncate leading-none">
                          {user.name}
                        </p>
                        <p className="text-white/40 text-xs truncate mt-1" dir="ltr">
                          {user.email}
                        </p>
                      </div>
                      <button
                        onClick={logout}
                        className="text-xs text-brand-red hover:text-white bg-brand-red/10 hover:bg-brand-red/30 px-3 py-1.5 rounded-xl transition-all"
                      >
                        خروج
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between w-full">
                      <p className="text-white/50 text-xs">سجل دخولك لحفظ وتأكيد طلباتك</p>
                      <button
                        onClick={() => setIsAuthOpen(true)}
                        className="text-xs text-white bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-1.5 rounded-xl transition-all font-semibold flex items-center gap-1.5"
                      >
                        <span className="text-blue-400">G</span>
                        <span>تسجيل الدخول</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {checkoutStatus === "processing" ? (
                    /* Checkout Processing State */
                    <div className="h-full flex flex-col items-center justify-center text-center gap-6 py-12">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full border-4 border-white/10 border-t-brand-orange animate-spin" />
                        <span className="absolute inset-0 flex items-center justify-center text-2xl">🔥</span>
                      </div>
                      <div>
                        <h4 className="text-white text-lg font-bold">جاري إرسال طلبك...</h4>
                        <p className="text-white/40 text-sm mt-1">يتم تجهيز الفاتورة وإرسالها للمطبخ</p>
                      </div>
                    </div>
                  ) : checkoutStatus === "success" ? (
                    /* Checkout Success State */
                    <div className="h-full flex flex-col items-center justify-center text-center gap-6 py-12">
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-4xl shadow-xl shadow-green-500/10"
                      >
                        ✅
                      </motion.div>
                      <div>
                        <h4 className="text-white text-xl font-bold">تم تأكيد الطلب بنجاح!</h4>
                        <p className="text-white/50 text-sm mt-2 leading-relaxed px-4">
                          شكراً لثقتك بنا! يقوم طهاتنا الآن بتحضير وجبتك الساخنة. سيصلك طلبك إلى موقعك في صنعاء قريباً.
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 w-full px-6">
                        <button
                          onClick={() => {
                            setCheckoutStatus("idle");
                            setIsCartOpen(false);
                            setIsOrdersOpen(true);
                          }}
                          className="w-full py-3 bg-gradient-to-r from-brand-red to-brand-orange text-white font-bold text-sm rounded-xl transition-all"
                        >
                          تتبع حالة الطلب حياً ⚡
                        </button>
                        <button
                          onClick={() => {
                            setCheckoutStatus("idle");
                            setIsCartOpen(false);
                          }}
                          className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm rounded-xl transition-all"
                        >
                          متابعة التصفح
                        </button>
                      </div>
                    </div>
                  ) : checkoutStatus === "error" ? (
                    /* Checkout Error State */
                    <div className="h-full flex flex-col items-center justify-center text-center gap-6 py-12">
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-20 h-20 rounded-full bg-brand-red/20 border border-brand-red/30 flex items-center justify-center text-4xl shadow-xl shadow-brand-red/10 animate-bounce"
                      >
                        ❌
                      </motion.div>
                      <div>
                        <h4 className="text-white text-xl font-bold">فشل إرسال الطلب!</h4>
                        <p className="text-white/50 text-sm mt-2 leading-relaxed px-4 font-arabic">
                          حدث خطأ أثناء الاتصال بالخادم ولم نتمكن من إيصال طلبك للمطبخ. يرجى التحقق من اتصالك بالإنترنت والمحاولة مجدداً.
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 w-full px-6">
                        <button
                          onClick={handleCheckout}
                          className="w-full py-3 bg-gradient-to-r from-brand-red to-brand-orange text-white font-bold text-sm rounded-xl transition-all"
                        >
                          إعادة المحاولة 🔄
                        </button>
                        <button
                          onClick={() => {
                            setCheckoutStatus("idle");
                          }}
                          className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm rounded-xl transition-all"
                        >
                          العودة للسلة
                        </button>
                      </div>
                    </div>
                  ) : cart.length === 0 ? (
                    /* Empty Cart State */
                    <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-12">
                      <span className="text-5xl opacity-40">🍽️</span>
                      <p className="text-white/40 text-sm">سلتك فارغة حالياً.</p>
                      <button
                        onClick={() => setIsCartOpen(false)}
                        className="px-6 py-2 bg-gradient-to-r from-brand-red to-brand-orange text-white text-xs font-bold rounded-full hover:brightness-110 transition-all"
                      >
                        اختر وجبتك الآن
                      </button>
                    </div>
                  ) : (
                    /* Active Cart Items List */
                    cart.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        className="flex gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl relative group overflow-hidden"
                      >
                        {/* Decorative background border glow */}
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500"
                          style={{
                            background: `radial-gradient(circle at center, ${item.color}, transparent 60%)`,
                          }}
                        />

                        {/* Image wrapper */}
                        <div className="w-16 h-16 rounded-xl bg-white/5 flex-shrink-0 flex items-center justify-center relative p-1.5 border border-white/5">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={56}
                            height={56}
                            className="object-contain"
                          />
                        </div>

                        {/* Item Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-white font-bold text-sm truncate">{item.name}</h4>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-white/20 hover:text-brand-red transition-colors text-xs"
                              aria-label="حذف"
                            >
                              ✕
                            </button>
                          </div>

                          <p className="text-brand-orange text-xs font-semibold mt-1 font-arabic">
                            {item.price} ريال
                          </p>

                          {/* Quantity Selector */}
                          <div className="flex items-center gap-3 mt-3">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white flex items-center justify-center text-sm transition-all"
                            >
                              -
                            </button>
                            <span className="text-white text-sm font-bold w-4 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white flex items-center justify-center text-sm transition-all"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>

                {/* Footer / Subtotal Actions */}
                {cart.length > 0 && checkoutStatus === "idle" && (
                  <div className="p-6 border-t border-white/5 space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/40">المجموع الفرعي</span>
                      <span className="text-white font-bold text-lg font-arabic">
                        {formattedSubtotal} ريال
                      </span>
                    </div>

                    <button
                      onClick={handleCheckout}
                      className="w-full py-4 bg-gradient-to-r from-brand-red to-brand-orange hover:from-brand-orange hover:to-brand-gold text-white font-bold rounded-2xl text-sm transition-all duration-500 shadow-xl shadow-brand-red/10 active:scale-[0.98]"
                    >
                      تأكيد الطلب
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Google Login popup trigger */}
      <GoogleAuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}
