"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";

export default function HeroSection() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      badgeRef.current,
      { y: 30, opacity: 0, scale: 0.9 },
      { y: 0, opacity: 1, scale: 1, duration: 0.8, delay: 0.3 }
    )
      .fromTo(
        headingRef.current,
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        "-=0.4"
      )
      .fromTo(
        subtitleRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        "-=0.5"
      )
      .fromTo(
        ctaRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 },
        "-=0.3"
      );
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-hero-glow pointer-events-none" />

      {/* Decorative grid lines */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center w-full">
        {/* Badge */}
        <div ref={badgeRef} className="inline-flex items-center gap-2 mb-8 opacity-0">
          <div className="px-4 py-1.5 rounded-full glass-card border border-brand-red/20">
            <span className="text-xs font-semibold tracking-wider uppercase text-brand-red-light">
              🔥 صُنع بالنار والشغف
            </span>
          </div>
        </div>

        {/* Main heading */}
        <h1
          ref={headingRef}
          className="font-display font-black leading-[1.1] tracking-tight opacity-0"
          style={{ fontSize: 'clamp(3rem, 14vw, 10rem)' }}
        >
          <span className="block text-white">تذوّق طعم</span>
          <span className="block text-gradient-fire mt-2">اللهب</span>
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="mt-8 text-lg sm:text-xl text-white/50 max-w-2xl mx-auto font-light leading-relaxed opacity-0"
        >
          وجبات سريعة فاخرة تشعل حواسك. من{" "}
          <span className="text-brand-orange font-semibold">الشاورما الأسطورية</span> إلى{" "}
          <span className="text-brand-gold font-semibold">البروست المقرمش</span> — كل قضمة هي انفجار من النكهات.
        </p>

        {/* CTA Buttons */}
        <div ref={ctaRef} className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 opacity-0 px-2 sm:px-0">
          <motion.a
            href="#builder"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative w-full sm:w-auto px-10 py-4 rounded-full text-white font-bold text-lg overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-brand-red via-brand-orange to-brand-gold" />
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-brand-gold via-brand-orange to-brand-red" />
            <span className="absolute inset-[2px] bg-surface-dark rounded-full opacity-0 group-hover:opacity-0" />
            <span className="relative flex items-center gap-2">
              استكشف القائمة
              <svg
                className="w-5 h-5 group-hover:-translate-x-1 transition-transform rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </span>
          </motion.a>

          <motion.a
            href="#showcase"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group w-full sm:w-auto px-10 py-4 rounded-full border border-white/10 text-white/70 hover:text-white hover:border-brand-red/40 font-medium text-lg transition-all duration-500"
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />
              شاهد قصتنا
            </span>
          </motion.a>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-xs text-white/30 tracking-widest uppercase">
              مرر للأسفل
            </span>
            <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1.5">
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-1 h-2 rounded-full bg-brand-red"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
