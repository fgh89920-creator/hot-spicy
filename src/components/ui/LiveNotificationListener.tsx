"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart, Order } from "@/context/CartContext";

interface ToastMessage {
  id: string;
  orderId: string;
  status: Order["status"];
  title: string;
  message: string;
}

export default function LiveNotificationListener() {
  const { orders, user, setIsOrdersOpen } = useCart();
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const prevStatusesRef = useRef<{ [orderId: string]: Order["status"] }>({});

  // Clean up order status map if user logs out
  useEffect(() => {
    if (!user) {
      prevStatusesRef.current = {};
      return;
    }

    // Filter user's orders
    const userOrders = (orders || []).filter(
      (order) =>
        order?.user?.email &&
        user?.email &&
        order.user.email.toLowerCase() === user.email.toLowerCase()
    );

    userOrders.forEach((order) => {
      const prevStatus = prevStatusesRef.current[order.id];

      // If we already had this order tracked, and its status changed:
      if (prevStatus !== undefined && prevStatus !== order.status) {
        let title = "";
        let message = "";
        
        switch (order.status) {
          case "preparing":
            title = "🍳 بدأ تحضير طلبك!";
            message = `طلبك رقم #${order.id} قيد التحضير الآن في المطبخ بلهيب حار! انقر للمتابعة.`;
            break;
          case "delivering":
            title = "🛵 طلبك في الطريق!";
            message = `وجبتك الساخنة من طلب #${order.id} مع المندوب وفي طريقها إليك الآن! انقر للتتبع.`;
            break;
          case "completed":
            title = "✅ تم تسليم الطلب!";
            message = `تم توصيل الطلب #${order.id} بنجاح. بالهناء والشفاء!`;
            break;
          case "cancelled":
            title = "❌ إلغاء الطلب";
            message = `نعتذر منك، لقد تم إلغاء طلبك رقم #${order.id} من قبل الإدارة.`;
            break;
        }

        // Add toast to stack
        const newToast: ToastMessage = {
          id: `${order.id}-${Date.now()}`,
          orderId: order.id,
          status: order.status,
          title,
          message,
        };

        setToasts((prev) => [...prev, newToast]);

        // Auto remove toast after 6 seconds
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
        }, 6000);
      }

      // Update ref with current status
      prevStatusesRef.current[order.id] = order.status;
    });

    // Populate ref for newly loaded orders that weren't in it yet
    userOrders.forEach((order) => {
      if (prevStatusesRef.current[order.id] === undefined) {
        prevStatusesRef.current[order.id] = order.status;
      }
    });
  }, [orders, user]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "preparing":
        return "border-brand-orange bg-brand-orange/10 text-brand-orange";
      case "delivering":
        return "border-brand-gold bg-brand-gold/10 text-brand-gold";
      case "completed":
        return "border-green-500 bg-green-500/10 text-green-500";
      case "cancelled":
        return "border-brand-red bg-brand-red/10 text-brand-red";
      default:
        return "border-white/10 bg-white/5 text-white";
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col gap-3 w-full max-w-sm pointer-events-none font-arabic">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
            onClick={() => {
              setIsOrdersOpen(true);
              removeToast(toast.id);
            }}
            className={`pointer-events-auto cursor-pointer p-4 rounded-2xl border backdrop-blur-xl shadow-2xl flex flex-col gap-1 relative overflow-hidden bg-surface-dark/90 hover:brightness-110 active:scale-[0.98] transition-all select-none ${getStatusColor(
              toast.status
            )}`}
          >
            <div className="flex items-start justify-between">
              <h4 className="font-black text-sm text-white flex items-center gap-1.5">
                <span>{toast.title}</span>
              </h4>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Avoid triggering parent onClick
                  removeToast(toast.id);
                }}
                className="text-white/45 hover:text-white transition-colors text-xs p-1"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-white/70 leading-relaxed mt-1">
              {toast.message}
            </p>
            {/* Glowing progress line at the bottom */}
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 6, ease: "linear" }}
              className="absolute bottom-0 inset-x-0 h-1 bg-current"
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
