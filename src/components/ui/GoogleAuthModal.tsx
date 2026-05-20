"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { isFirebaseEnabled } from "@/lib/firebase";

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function GoogleAuthModal({
  isOpen,
  onClose,
  onSuccess,
}: GoogleAuthModalProps) {
  const { loginWithGoogle } = useCart();
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customEmail, setCustomEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const predefinedAccounts = [
    {
      name: "محمد اليماني",
      email: "mohammed.yemen@gmail.com",
      picture: "M",
      color: "bg-red-500",
    },
    {
      name: "أحمد الأصبحي",
      email: "ahmed.asbahi@gmail.com",
      picture: "A",
      color: "bg-blue-500",
    },
  ];

  const handleRealGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle("", "", "");
      setIsLoading(false);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  const handleSelectAccount = (acc: typeof predefinedAccounts[0]) => {
    setIsLoading(true);
    setTimeout(() => {
      loginWithGoogle(acc.email, acc.name, acc.picture);
      setIsLoading(false);
      if (onSuccess) onSuccess();
      onClose();
    }, 1500);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName || !customEmail) return;
    setIsLoading(true);
    setTimeout(() => {
      const firstLetter = customName.trim().charAt(0).toUpperCase();
      loginWithGoogle(customEmail, customName, firstLetter);
      setIsLoading(false);
      if (onSuccess) onSuccess();
      onClose();
      setIsCustomMode(false);
      setCustomName("");
      setCustomEmail("");
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-[#1a1a1a] border border-white/10 shadow-2xl p-8"
          >
            {/* Google Brand Header */}
            <div className="text-center mb-8">
              {/* Simulated Google Logo G */}
              <div className="flex justify-center gap-1 mb-4 text-3xl font-bold font-display select-none">
                <span className="text-[#4285F4]">G</span>
                <span className="text-[#EA4335]">o</span>
                <span className="text-[#FBBC05]">o</span>
                <span className="text-[#4285F4]">g</span>
                <span className="text-[#34A853]">l</span>
                <span className="text-[#EA4335]">e</span>
              </div>
              <h3 className="font-arabic text-xl font-bold text-white mb-2">
                تسجيل الدخول باستخدام Google
              </h3>
              <p className="font-arabic text-sm text-white/50">
                لإتمام طلبك وتأكيده مع مطعم هوت سبايسي
              </p>
            </div>

            {isLoading ? (
              /* Loading Spinner */
              <div className="py-12 flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full border-4 border-t-brand-orange border-white/10 animate-spin" />
                <p className="font-arabic text-sm text-white/60">جاري التحقق من الحساب...</p>
              </div>
            ) : !isCustomMode ? (
              /* Predefined Accounts List */
              <div className="space-y-3 font-arabic">
                {isFirebaseEnabled && (
                  <>
                    <button
                      type="button"
                      onClick={handleRealGoogleLogin}
                      className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-[#4285F4] to-[#34A853] hover:brightness-110 text-white font-bold text-sm shadow-xl active:scale-[0.98] transition-all"
                    >
                      <span className="text-lg">🔑</span>
                      <span>الدخول بحساب Google الحقيقي</span>
                    </button>
                    <div className="flex items-center gap-2 py-2">
                      <div className="flex-1 h-[1px] bg-white/10" />
                      <span className="text-white/30 text-[10px]">أو تجربة المحاكاة المحلية</span>
                      <div className="flex-1 h-[1px] bg-white/10" />
                    </div>
                  </>
                )}

                {predefinedAccounts.map((acc) => (
                  <button
                    key={acc.email}
                    onClick={() => handleSelectAccount(acc)}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all duration-300 group text-right"
                  >
                    <div
                      className={`w-10 h-10 rounded-full ${acc.color} flex items-center justify-center text-lg font-bold text-white shadow-lg`}
                    >
                      {acc.picture}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm group-hover:text-brand-orange transition-colors">
                        {acc.name}
                      </p>
                      <p className="text-white/40 text-xs truncate mt-0.5" dir="ltr">
                        {acc.email}
                      </p>
                    </div>
                    <span className="text-white/20 text-xs">←</span>
                  </button>
                ))}

                <button
                  onClick={() => setIsCustomMode(true)}
                  className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border border-dashed border-white/10 hover:border-white/25 text-white/50 hover:text-white transition-all duration-300 text-sm mt-4"
                >
                  <span>👤</span>
                  <span>استخدام حساب آخر</span>
                </button>
              </div>
            ) : (
              /* Custom Account Inputs Form */
              <form onSubmit={handleCustomSubmit} className="space-y-4 font-arabic">
                <div>
                  <label className="block text-white/50 text-xs mb-2">الاسم الكامل</label>
                  <input
                    type="text"
                    required
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="مثال: أحمد محمد"
                    className="w-full bg-white/5 border border-white/10 focus:border-brand-orange rounded-2xl py-3 px-4 text-white text-sm outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-white/50 text-xs mb-2">البريد الإلكتروني</label>
                  <input
                    type="email"
                    required
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full bg-white/5 border border-white/10 focus:border-brand-orange rounded-2xl py-3 px-4 text-white text-sm outline-none transition-colors text-left"
                    dir="ltr"
                  />
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-brand-red to-brand-orange text-white font-bold text-sm rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all"
                  >
                    تسجيل الدخول
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCustomMode(false)}
                    className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-sm rounded-2xl transition-all"
                  >
                    رجوع
                  </button>
                </div>
              </form>
            )}

            {/* Modal close icon button */}
            <button
              onClick={onClose}
              className="absolute top-4 left-4 text-white/30 hover:text-white transition-colors"
              aria-label="إغلاق"
            >
              ✕
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
