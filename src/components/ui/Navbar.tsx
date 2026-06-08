"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Menu", href: "#showcase" },
  { label: "Flavors", href: "#builder" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-surface-dark/80 backdrop-blur-xl border-b border-white/5 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 flex items-center justify-center">
              {/* Fire emoji placeholder — replace with your SVG logo */}
              <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                🔥
              </span>
              <div className="absolute inset-0 bg-brand-red/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <div>
              <span className="font-display text-xl font-bold tracking-tight text-white">
                Hot{" "}
                <span className="text-gradient-brand">Spicy</span>
              </span>
              <p className="text-[10px] text-white/30 tracking-[0.3em] uppercase -mt-1">
                Fast Food
              </p>
            </div>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="animated-underline text-sm text-white/60 hover:text-white transition-colors duration-300 font-medium tracking-wide"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#builder"
              className="relative px-6 py-2.5 rounded-full text-sm font-semibold text-white overflow-hidden group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-brand-red to-brand-orange rounded-full" />
              <span className="absolute inset-0 bg-gradient-to-r from-brand-orange to-brand-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative">Order Now</span>
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden relative w-8 h-8 flex flex-col items-center justify-center gap-1.5"
            aria-label="Toggle menu"
          >
            <motion.span
              animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className="w-6 h-0.5 bg-white rounded-full block"
            />
            <motion.span
              animate={mobileOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
              className="w-6 h-0.5 bg-white rounded-full block"
            />
            <motion.span
              animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              className="w-6 h-0.5 bg-white rounded-full block"
            />
          </button>
        </nav>
      </motion.header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-surface-dark/95 backdrop-blur-2xl flex flex-col items-center justify-center gap-8"
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: i * 0.1 }}
                className="text-3xl font-display font-bold text-white/80 hover:text-gradient-brand transition-all duration-300"
              >
                {link.label}
              </motion.a>
            ))}
            <motion.a
              href="#builder"
              onClick={() => setMobileOpen(false)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-4 px-10 py-3 bg-gradient-to-r from-brand-red to-brand-orange rounded-full text-lg font-bold text-white"
            >
              Order Now
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
