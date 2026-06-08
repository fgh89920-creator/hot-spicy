"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="loader-container"
        >
          <div className="flex flex-col items-center gap-6">
            {/* Animated flame spinner */}
            <div className="relative">
              <div className="loader-flame" />
              <div className="absolute inset-0 loader-flame blur-xl opacity-50" />
            </div>

            {/* Brand name reveal */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <p className="font-display text-2xl font-bold text-white">
                Hot <span className="text-gradient-brand">Spicy</span>
              </p>
              <motion.p
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.8, duration: 1.2, ease: "easeInOut" }}
                className="h-0.5 bg-gradient-to-r from-brand-red to-brand-orange mt-2 overflow-hidden"
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
