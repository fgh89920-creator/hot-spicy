"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useCart, Order } from "@/context/CartContext";
import GoogleAuthModal from "./GoogleAuthModal";

export default function OrderHistoryDrawer() {
  const {
    orders,
    user,
    isOrdersOpen,
    setIsOrdersOpen,
  } = useCart();

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Filter orders for the current user
  const userOrders = user
    ? orders.filter((order) => order.user.email.toLowerCase() === user.email.toLowerCase())
    : [];

  const toggleExpandOrder = (id: string) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const getStatusText = (status: Order["status"]) => {
    switch (status) {
      case "preparing":
        return "جاري التحضير بالمطبخ";
      case "delivering":
        return "خارج للتوصيل مع المندوب";
      case "completed":
        return "تم التوصيل بنجاح";
      case "cancelled":
        return "تم إلغاء الطلب";
      default:
        return "معلق";
    }
  };

  const getStatusColorClass = (status: Order["status"]) => {
    switch (status) {
      case "preparing":
        return "text-brand-orange bg-brand-orange/10 border-brand-orange/20";
      case "delivering":
        return "text-brand-gold bg-brand-gold/10 border-brand-gold/20";
      case "completed":
        return "text-green-500 bg-green-500/10 border-green-500/20";
      case "cancelled":
        return "text-brand-red bg-brand-red/10 border-brand-red/20";
      default:
        return "text-white/40 bg-white/5 border-white/10";
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("ar-YE", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return isoString;
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOrdersOpen && (
          <div className="fixed inset-0 z-40 overflow-hidden font-arabic">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOrdersOpen(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            />

            {/* Drawer container */}
            <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "tween", duration: 0.35 }}
                className="w-screen max-w-md bg-surface-dark/95 border-l border-white/5 shadow-2xl backdrop-blur-2xl flex flex-col"
              >
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📦</span>
                    <h3 className="text-lg font-bold text-white">سجل طلباتي</h3>
                  </div>
                  <button
                    onClick={() => setIsOrdersOpen(false)}
                    className="text-white/40 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {!user ? (
                    /* Unauthorized State */
                    <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-12">
                      <span className="text-5xl opacity-40">🔐</span>
                      <div>
                        <h4 className="text-white text-base font-bold">يرجى تسجيل الدخول أولاً</h4>
                        <p className="text-white/40 text-xs mt-2 px-6 leading-relaxed">
                          يجب تسجيل الدخول باستخدام حساب Google لتتمكن من تتبع حالة طلباتك الحالية واستعراض السجل السابق.
                        </p>
                      </div>
                      <button
                        onClick={() => setIsAuthOpen(true)}
                        className="mt-2 text-sm text-white bg-gradient-to-r from-brand-red to-brand-orange px-6 py-2.5 rounded-xl font-bold hover:brightness-110 active:scale-[0.97] transition-all"
                      >
                        تسجيل الدخول الآن
                      </button>
                    </div>
                  ) : userOrders.length === 0 ? (
                    /* Empty State */
                    <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-12">
                      <span className="text-5xl opacity-40">📜</span>
                      <div>
                        <h4 className="text-white text-base font-bold">لا توجد طلبات سابقة</h4>
                        <p className="text-white/40 text-xs mt-2 px-6 leading-relaxed">
                          لم تقم بطلب أي وجبات حتى الآن. عندما تقوم بالطلب، ستظهر قائمة طلباتك هنا مع إمكانية التتبع المباشر.
                        </p>
                      </div>
                      <button
                        onClick={() => setIsOrdersOpen(false)}
                        className="mt-2 text-xs text-white/60 bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-2.5 rounded-xl transition-all"
                      >
                        استكشف القائمة واطلب الآن
                      </button>
                    </div>
                  ) : (
                    /* Active Orders List */
                    <div className="space-y-4">
                      <p className="text-xs text-white/40 mb-2">لديك {userOrders.length} طلبات مسجلة:</p>
                      
                      {userOrders.map((order) => {
                        const isExpanded = expandedOrderId === order.id;
                        return (
                          <motion.div
                            key={order.id}
                            layout
                            className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-colors"
                          >
                            {/* Card Header (clickable to expand) */}
                            <div
                              onClick={() => toggleExpandOrder(order.id)}
                              className="p-4 cursor-pointer flex flex-col gap-2 select-none hover:bg-white/[0.02] transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-white font-bold text-sm" dir="ltr">#{order.id}</span>
                                <span className={`text-[11px] px-2.5 py-1 rounded-full font-bold border ${getStatusColorClass(order.status)}`}>
                                  {getStatusText(order.status)}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-white/40">{formatDate(order.timestamp)}</span>
                                <span className="text-brand-orange font-semibold">{new Intl.NumberFormat().format(order.subtotal)} ريال</span>
                              </div>
                              
                              {/* Small prompt to expand */}
                              <div className="text-[10px] text-white/20 text-left -mt-1">
                                {isExpanded ? "▲ إغلاق التفاصيل" : "▼ عرض تفاصيل الفاتورة وتتبع الحالة"}
                              </div>
                            </div>

                            {/* Collapsible Details */}
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="border-t border-white/5 bg-black/20 overflow-hidden"
                                >
                                  <div className="p-4 space-y-4">
                                    {/* Real-time Stepper (Show only if not cancelled) */}
                                    {order.status !== "cancelled" ? (
                                      <div className="py-2">
                                        <p className="text-[11px] text-white/40 mb-3 font-semibold">تتبع حالة الطلب حياً ⚡:</p>
                                        <div className="flex justify-between items-center relative px-2">
                                          {/* Connecting progress line */}
                                          <div className="absolute top-3 left-6 right-6 h-0.5 bg-white/10 z-0">
                                            <div
                                              className="h-full bg-brand-orange transition-all duration-700"
                                              style={{
                                                width: order.status === "preparing" ? "0%" : order.status === "delivering" ? "50%" : "100%"
                                              }}
                                            />
                                          </div>
                                          
                                          {/* Step 1: Preparing */}
                                          <div className="flex flex-col items-center gap-1.5 z-10">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                              order.status === "preparing" || order.status === "delivering" || order.status === "completed"
                                                ? "bg-brand-orange text-white shadow-lg shadow-brand-orange/30 scale-110"
                                                : "bg-[#2a2a2a] text-white/40"
                                            }`}>
                                              🍳
                                            </div>
                                            <span className={`text-[10px] ${
                                              order.status === "preparing" || order.status === "delivering" || order.status === "completed"
                                                ? "text-brand-orange font-bold"
                                                : "text-white/30"
                                            }`}>تجهيز</span>
                                          </div>

                                          {/* Step 2: Delivering */}
                                          <div className="flex flex-col items-center gap-1.5 z-10">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                              order.status === "delivering" || order.status === "completed"
                                                ? "bg-brand-orange text-white shadow-lg shadow-brand-orange/30 scale-110"
                                                : "bg-[#2a2a2a] text-white/40"
                                            }`}>
                                              🛵
                                            </div>
                                            <span className={`text-[10px] ${
                                              order.status === "delivering" || order.status === "completed"
                                                ? "text-brand-orange font-bold"
                                                : "text-white/30"
                                            }`}>توصيل</span>
                                          </div>

                                          {/* Step 3: Completed */}
                                          <div className="flex flex-col items-center gap-1.5 z-10">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                              order.status === "completed"
                                                ? "bg-green-500 text-white shadow-lg shadow-green-500/30 scale-110"
                                                : "bg-[#2a2a2a] text-white/40"
                                            }`}>
                                              ✓
                                            </div>
                                            <span className={`text-[10px] ${
                                              order.status === "completed"
                                                ? "text-green-500 font-bold"
                                                : "text-white/30"
                                            }`}>استلام</span>
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="p-3 bg-brand-red/10 border border-brand-red/20 rounded-xl text-center">
                                        <p className="text-xs text-brand-red font-bold">تم إلغاء هذا الطلب من قبل الإدارة</p>
                                      </div>
                                    )}

                                    {/* Items List */}
                                    <div className="space-y-2 border-t border-white/5 pt-3">
                                      <p className="text-[11px] text-white/40 font-semibold">تفاصيل الوجبات:</p>
                                      {order.items.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between text-xs p-1">
                                          <div className="flex items-center gap-2">
                                            <span className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded text-white/60">
                                              {item.quantity}x
                                            </span>
                                            <span className="text-white/80">{item.name}</span>
                                          </div>
                                          <span className="text-white/50">{item.price} ريال</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      <GoogleAuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </>
  );
}
