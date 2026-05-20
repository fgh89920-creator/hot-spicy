"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useCart, Order, CartItem } from "@/context/CartContext";

export default function AdminDashboard() {
  const { orders, updateOrderStatus, clearAllOrders } = useCart();
  const [mounted, setMounted] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [localOrders, setLocalOrders] = useState<Order[]>([]);

  // Avoid hydration mismatch by waiting for mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Synchronize local state with context orders (which read from localStorage)
  useEffect(() => {
    if (mounted) {
      setLocalOrders(orders);
    }
  }, [orders, mounted]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-surface-dark flex items-center justify-center font-arabic">
        <div className="w-12 h-12 rounded-full border-4 border-white/10 border-t-brand-orange animate-spin" />
      </div>
    );
  }

  // Calculate Statistics
  const totalOrders = localOrders.length;
  const activeOrders = localOrders.filter(
    (o) => o.status === "preparing" || o.status === "delivering"
  ).length;
  const completedOrders = localOrders.filter((o) => o.status === "completed").length;
  const totalSales = localOrders
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + o.subtotal, 0);

  // Dynamic Top Selling Item calculation
  const itemCounts: { [key: string]: { count: number; name: string } } = {};
  localOrders.forEach((o) => {
    o.items.forEach((item) => {
      if (itemCounts[item.id]) {
        itemCounts[item.id].count += item.quantity;
      } else {
        itemCounts[item.id] = { count: item.quantity, name: item.name };
      }
    });
  });
  let topItem = "لا توجد طلبات";
  let maxCount = 0;
  Object.keys(itemCounts).forEach((id) => {
    if (itemCounts[id].count > maxCount) {
      maxCount = itemCounts[id].count;
      topItem = itemCounts[id].name;
    }
  });

  // Filtered orders list
  const filteredOrders = localOrders.filter((order) => {
    if (filterStatus === "all") return true;
    return order.status === filterStatus;
  });

  // Simulate a random incoming order
  const handleSimulateOrder = () => {
    const names = [
      "خالد العنسي",
      "فاطمة الريمي",
      "عادل السنيدار",
      "أروى الحاشدي",
      "صالح الهمداني",
      "نسرين اليافعي",
    ];
    const emails = [
      "khaled.ansi@gmail.com",
      "fatima.rimi@gmail.com",
      "adel.snidar@gmail.com",
      "arwa.hashdi@gmail.com",
      "saleh.hamdani@gmail.com",
      "nesreen.yafei@gmail.com",
    ];
    const randomIdx = Math.floor(Math.random() * names.length);
    const mockItems: CartItem[] = [
      {
        id: "pizza",
        name: "بيتزا هوت سبايسي",
        price: "1,500",
        quantity: Math.floor(Math.random() * 2) + 1,
        image: "/images/pizza-base.png",
        color: "#EF4444",
        icon: "🍕",
      },
      {
        id: "shawarma",
        name: "شاورما عربي",
        price: "1,200",
        quantity: Math.floor(Math.random() * 3) + 1,
        image: "/images/shawarma.png",
        color: "#F59E0B",
        icon: "🌯",
      },
      {
        id: "broast",
        name: "بروست حار مقرمش",
        price: "2,000",
        quantity: 1,
        image: "/images/broast.png",
        color: "#FB923C",
        icon: "🍗",
      },
    ].slice(0, Math.floor(Math.random() * 3) + 1);

    const subtotal = mockItems.reduce((total, item) => {
      const priceNum = parseInt(item.price.replace(/,/g, ""), 10);
      return total + priceNum * item.quantity;
    }, 0);

    const newOrder: Order = {
      id: `HS-${Math.floor(1000 + Math.random() * 9000)}`,
      user: {
        name: names[randomIdx],
        email: emails[randomIdx],
        picture: names[randomIdx].charAt(0),
      },
      items: mockItems,
      subtotal: subtotal,
      status: "preparing",
      timestamp: new Date().toISOString(),
    };

    // Save directly to localStorage to sync
    const currentOrders = [newOrder, ...localOrders];
    localStorage.setItem("hot_spicy_orders", JSON.stringify(currentOrders));
    // Trigger state change
    window.dispatchEvent(new Event("storage"));
    setLocalOrders(currentOrders);
  };

  const handleClearOrders = () => {
    if (confirm("هل أنت متأكد من مسح جميع الطلبات؟")) {
      clearAllOrders();
      setLocalOrders([]);
    }
  };

  return (
    <div className="min-h-screen bg-surface-dark text-white font-arabic p-6 lg:p-12 relative overflow-hidden selection:bg-brand-orange selection:text-black">
      {/* Background glow effects */}
      <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] rounded-full bg-brand-red/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[600px] h-[600px] rounded-full bg-brand-orange/5 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">🔥</span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                لوحة تحكم الطلبات
              </h1>
            </div>
            <p className="text-white/40 text-xs sm:text-sm mt-1.5">
              مراقبة وتحديث وجبات العملاء الساخنة في الوقت الفعلي
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSimulateOrder}
              className="px-5 py-2.5 bg-gradient-to-r from-brand-red to-brand-orange hover:brightness-110 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-brand-red/10 active:scale-[0.98] flex items-center gap-1.5"
            >
              <span>⚡</span>
              <span>محاكاة طلب جديد</span>
            </button>
            <button
              onClick={handleClearOrders}
              className="px-5 py-2.5 bg-white/5 hover:bg-brand-red/20 hover:text-brand-red border border-white/10 hover:border-brand-red/30 text-white/70 font-bold text-xs sm:text-sm rounded-xl transition-all active:scale-[0.98]"
            >
              مسح السجل
            </button>
            <Link
              href="/"
              className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs sm:text-sm rounded-xl transition-all text-center"
            >
              الصفحة الرئيسية ←
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Card 1: Total Sales */}
          <div className="glass-card p-6 rounded-2xl border border-white/5 relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-orange/5 rounded-bl-full pointer-events-none group-hover:bg-brand-orange/10 transition-colors duration-500" />
            <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">
              إجمالي المبيعات المؤكدة
            </p>
            <h3 className="text-2xl font-black text-brand-orange mt-2 font-arabic">
              {new Intl.NumberFormat().format(totalSales)}
              <span className="text-xs text-white/40 font-normal mr-1">ريال</span>
            </h3>
            <p className="text-[10px] text-white/20 mt-1">الطلبات المكتملة فقط</p>
          </div>

          {/* Card 2: Total Orders */}
          <div className="glass-card p-6 rounded-2xl border border-white/5 relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-red/5 rounded-bl-full pointer-events-none group-hover:bg-brand-red/10 transition-colors duration-500" />
            <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">
              إجمالي الطلبات المستلمة
            </p>
            <h3 className="text-2xl font-black text-white mt-2">
              {totalOrders}
              <span className="text-xs text-white/40 font-normal mr-1">طلبات</span>
            </h3>
            <p className="text-[10px] text-white/20 mt-1">من كافة العملاء</p>
          </div>

          {/* Card 3: Active Orders */}
          <div className="glass-card p-6 rounded-2xl border border-white/5 relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full pointer-events-none group-hover:bg-blue-500/10 transition-colors duration-500" />
            <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">
              الطلبات النشطة (تحت الإعداد)
            </p>
            <h3 className="text-2xl font-black text-blue-400 mt-2">
              {activeOrders}
              <span className="text-xs text-white/40 font-normal mr-1">نشط</span>
            </h3>
            <p className="text-[10px] text-white/20 mt-1">تحضير أو توصيل</p>
          </div>

          {/* Card 4: Completed Orders */}
          <div className="glass-card p-6 rounded-2xl border border-white/5 relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-bl-full pointer-events-none group-hover:bg-green-500/10 transition-colors duration-500" />
            <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">
              الطلبات المكتملة بنجاح
            </p>
            <h3 className="text-2xl font-black text-green-400 mt-2">
              {completedOrders}
              <span className="text-xs text-white/40 font-normal mr-1">مكتمل</span>
            </h3>
            <p className="text-[10px] text-white/20 mt-1">تم تسليمها للعميل</p>
          </div>

          {/* Card 5: Top Selling Item */}
          <div className="glass-card p-6 rounded-2xl border border-white/5 relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold/5 rounded-bl-full pointer-events-none group-hover:bg-brand-gold/10 transition-colors duration-500" />
            <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">
              الوجبة الأكثر طلباً
            </p>
            <h3 className="text-lg font-black text-brand-gold mt-2 truncate">
              {topItem}
            </h3>
            <p className="text-[10px] text-white/20 mt-1">
              {maxCount > 0 ? `بيعت ${maxCount} مرات` : "سجل فارغ"}
            </p>
          </div>
        </div>

        {/* Main Section layout */}
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white/5 border border-white/5 p-4 rounded-2xl">
            <div className="flex items-center gap-2">
              <span className="text-white/40 text-xs font-bold">تصفية حسب الحالة:</span>
              <div className="flex gap-2">
                {[
                  { value: "all", label: "الكل" },
                  { value: "preparing", label: "تحت التحضير 🍳" },
                  { value: "delivering", label: "جاري التوصيل 🛵" },
                  { value: "completed", label: "مكتملة ✅" },
                  { value: "cancelled", label: "ملغية ❌" },
                ].map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setFilterStatus(f.value)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      filterStatus === f.value
                        ? "bg-white/10 text-white border border-white/15"
                        : "text-white/50 hover:text-white bg-transparent border border-transparent"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="text-xs text-white/30">
              يعرض {filteredOrders.length} من أصل {localOrders.length} طلبات
            </div>
          </div>

          {/* Orders Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredOrders.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="col-span-full py-16 text-center bg-white/5 border border-white/5 rounded-3xl"
                >
                  <p className="text-5xl opacity-20">📭</p>
                  <p className="text-white/40 text-sm mt-3">لا توجد طلبات متطابقة مع التصفية.</p>
                </motion.div>
              ) : (
                filteredOrders.map((order) => (
                  <motion.div
                    key={order.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="glass-card p-6 rounded-3xl border border-white/5 flex flex-col justify-between gap-6 hover:border-white/10 transition-colors relative overflow-hidden"
                  >
                    {/* Glowing status line indicator */}
                    <div
                      className="absolute top-0 inset-x-0 h-[3px]"
                      style={{
                        backgroundColor:
                          order.status === "preparing"
                            ? "#3B82F6"
                            : order.status === "delivering"
                            ? "#F59E0B"
                            : order.status === "completed"
                            ? "#10B981"
                            : "#EF4444",
                      }}
                    />

                    {/* Order Meta Info */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-orange/20 border border-brand-orange/30 flex items-center justify-center font-bold text-brand-orange">
                          {order.user.picture}
                        </div>
                        <div>
                          <h4 className="text-white text-sm font-bold">{order.user.name}</h4>
                          <p className="text-white/40 text-[10px] mt-0.5" dir="ltr">
                            {order.user.email}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-white font-mono text-xs font-bold bg-white/5 border border-white/5 px-3 py-1 rounded-full">
                          {order.id}
                        </span>
                        <p className="text-white/30 text-[10px] mt-1.5">
                          {new Date(order.timestamp).toLocaleTimeString("ar-YE", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          |{" "}
                          {new Date(order.timestamp).toLocaleDateString("ar-YE", {
                            day: "numeric",
                            month: "short",
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Order items details */}
                    <div className="space-y-2 border-y border-white/5 py-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-2">
                            <span>{item.icon}</span>
                            <span className="text-white/80">{item.name}</span>
                            <span className="text-white/30 text-xs">x {item.quantity}</span>
                          </div>
                          <span className="text-brand-orange font-bold text-xs font-arabic">
                            {new Intl.NumberFormat().format(
                              parseInt(item.price.replace(/,/g, ""), 10) * item.quantity
                            )}{" "}
                            ريال
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Actions and status toggles */}
                    <div className="flex items-center justify-between gap-4 pt-2">
                      <div>
                        <span className="text-white/40 text-[10px] block">المبلغ الإجمالي</span>
                        <span className="text-white font-black text-lg font-arabic">
                          {new Intl.NumberFormat().format(order.subtotal)} ريال
                        </span>
                      </div>

                      {/* Status selectors */}
                      <div className="flex items-center gap-1 bg-white/5 border border-white/5 rounded-2xl p-1">
                        {[
                          { status: "preparing", icon: "🍳", label: "تحضير" },
                          { status: "delivering", icon: "🛵", label: "توصيل" },
                          { status: "completed", icon: "✅", label: "مكتمل" },
                          { status: "cancelled", icon: "❌", label: "إلغاء" },
                        ].map((btn) => (
                          <button
                            key={btn.status}
                            onClick={() =>
                              updateOrderStatus(order.id, btn.status as Order["status"])
                            }
                            className={`px-3 py-1.5 rounded-xl text-[10px] font-bold flex flex-col items-center gap-0.5 transition-all ${
                              order.status === btn.status
                                ? btn.status === "preparing"
                                  ? "bg-blue-600/20 text-blue-400 border border-blue-600/30"
                                  : btn.status === "delivering"
                                  ? "bg-amber-600/20 text-amber-400 border border-amber-600/30"
                                  : btn.status === "completed"
                                  ? "bg-green-600/20 text-green-400 border border-green-600/30"
                                  : "bg-red-600/20 text-red-400 border border-red-600/30"
                                : "text-white/35 hover:text-white hover:bg-white/5 border border-transparent"
                            }`}
                            title={btn.label}
                          >
                            <span>{btn.icon}</span>
                            <span>{btn.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
