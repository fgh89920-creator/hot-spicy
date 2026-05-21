"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRealGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await loginWithGoogle("", "", "");
      setIsLoading(false);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      setIsLoading(false);
      setError(
        err.message || "حدث خطأ أثناء تسجيل الدخول بحساب Google. يرجى المحاولة مرة أخرى."
      );
    }
  };


  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/75 backdrop-blur-md pointer-events-auto"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-[#1a1a1a] border border-white/10 shadow-2xl p-8 pointer-events-auto"
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

            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-brand-red/10 border border-brand-red/20 text-brand-red text-sm text-center font-arabic flex items-center justify-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}


            {isLoading ? (
              /* Loading Spinner */
              <div className="py-12 flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full border-4 border-t-brand-orange border-white/10 animate-spin" />
                <p className="font-arabic text-sm text-white/60">جاري تسجيل الدخول...</p>
              </div>
            ) : (
              /* Login Button */
              <div className="space-y-3 font-arabic">
                <button
                  type="button"
                  onClick={handleRealGoogleLogin}
                  className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-[#4285F4] to-[#34A853] hover:brightness-110 text-white font-bold text-sm shadow-xl active:scale-[0.98] transition-all"
                >
                  <span className="text-lg">🔑</span>
                  <span>الدخول بحساب Google الحقيقي</span>
                </button>
              </div>
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
