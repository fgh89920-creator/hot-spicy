"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/** Product variants that drive the 3D model color + ambient glow */
export interface ProductVariant {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  price: string;
  color: string;
  icon: string;
  features: string[];
}

const variants: ProductVariant[] = [
  {
    id: "shawarma",
    name: "Arabic Shawarma",
    nameAr: "شاورما عربي",
    description:
      "Our signature hand-carved shawarma with tahini sauce, pickled turnips, and fresh herbs wrapped in warm Arabic bread.",
    price: "1,500",
    color: "#E63946",
    icon: "🌯",
    features: ["24hr Marinated", "Fresh Herbs", "Secret Spice Blend"],
  },
  {
    id: "broast",
    name: "Crispy Broast",
    nameAr: "بروست مقرمش",
    description:
      "Pressure-fried golden chicken with our special Hot Spicy seasoning. Served with coleslaw and garlic sauce.",
    price: "1,200",
    color: "#FF8C42",
    icon: "🍗",
    features: ["Pressure Cooked", "11 Spices", "Extra Crispy"],
  },
  {
    id: "pizza",
    name: "Hot Spicy Pizza",
    nameAr: "بيتزا هوت سبايسي",
    description:
      "Hand-tossed dough topped with our fiery sauce, premium cheese blend, pepperoni, olives, and jalapeños.",
    price: "3,000",
    color: "#FFD700",
    icon: "🍕",
    features: ["Hand-Tossed", "Wood-Fire Taste", "Premium Cheese"],
  },
  {
    id: "burger",
    name: "Spicy Burger 3×3",
    nameAr: "برجر سبايسي",
    description:
      "Triple-stacked beef patties with melted cheddar, crispy onions, and our legendary spicy mayo.",
    price: "1,700",
    color: "#FF4444",
    icon: "🍔",
    features: ["Triple Patty", "Smashed Style", "Spicy Mayo"],
  },
  {
    id: "juice",
    name: "Fresh Cocktail",
    nameAr: "كوكتيل طبقات",
    description:
      "Layered tropical cocktail with mango, strawberry, and kiwi blended with fresh fruits.",
    price: "700",
    color: "#4ADE80",
    icon: "🥤",
    features: ["Freshly Blended", "No Additives", "Layered Art"],
  },
];

interface ProductBuilderProps {
  onColorChange: (color: string) => void;
}

export default function ProductBuilder({ onColorChange }: ProductBuilderProps) {
  const [activeId, setActiveId] = useState(variants[0].id);
  const active = variants.find((v) => v.id === activeId)!;

  const handleSelect = (variant: ProductVariant) => {
    setActiveId(variant.id);
    onColorChange(variant.color);
  };

  return (
    <section id="builder" className="relative py-32 lg:py-40 overflow-hidden">
      {/* Ambient background glow — shifts with active color */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none blur-[150px]"
        animate={{
          background: `radial-gradient(circle, ${active.color}12 0%, transparent 70%)`,
        }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block text-sm font-semibold tracking-[0.3em] uppercase text-brand-red mb-4">
            Build Your Order
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white">
            Choose Your{" "}
            <span className="text-gradient-brand">Flavor</span>
          </h2>
          <p className="mt-4 text-white/40 text-lg max-w-xl mx-auto">
            Select a product to see it come alive. Each choice transforms the
            experience.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* ─── Selector pills ─── */}
          <div className="w-full lg:w-80 flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-none">
            {variants.map((v) => (
              <motion.button
                key={v.id}
                onClick={() => handleSelect(v)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative flex items-center gap-4 px-5 py-4 rounded-2xl text-left transition-all duration-500 min-w-[200px] lg:min-w-0 ${
                  activeId === v.id
                    ? "glass-card border-brand-red/30"
                    : "bg-transparent border border-white/5 hover:border-white/10"
                }`}
              >
                {/* Active indicator bar */}
                {activeId === v.id && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-3 bottom-3 w-1 rounded-full"
                    style={{ backgroundColor: v.color }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}

                <span className="text-3xl">{v.icon}</span>
                <div>
                  <p
                    className={`font-semibold text-sm transition-colors duration-300 ${
                      activeId === v.id ? "text-white" : "text-white/50"
                    }`}
                  >
                    {v.name}
                  </p>
                  <p className="font-arabic text-xs text-white/25">{v.nameAr}</p>
                </div>
                <span
                  className={`ml-auto font-display font-bold text-sm transition-colors duration-300 ${
                    activeId === v.id ? "text-white" : "text-white/30"
                  }`}
                >
                  {v.price}
                </span>
              </motion.button>
            ))}
          </div>

          {/* ─── Product detail card ─── */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{
                  duration: 0.5,
                  ease: [0.4, 0, 0.2, 1],
                }}
                className="glass-card rounded-3xl p-8 lg:p-12 relative overflow-hidden"
              >
                {/* Accent corner glow */}
                <div
                  className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-[80px] opacity-20 pointer-events-none"
                  style={{ backgroundColor: active.color }}
                />

                <div className="flex flex-col md:flex-row gap-10 items-center">
                  {/* Product visual */}
                  <div className="relative flex-shrink-0">
                    <motion.div
                      className="w-48 h-48 rounded-2xl flex items-center justify-center relative"
                      style={{
                        background: `radial-gradient(circle at center, ${active.color}20, transparent 70%)`,
                      }}
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <span className="text-8xl drop-shadow-2xl">
                        {active.icon}
                      </span>

                      {/* Pulsing ring */}
                      <motion.div
                        className="absolute inset-0 rounded-2xl border-2 opacity-20"
                        style={{ borderColor: active.color }}
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    </motion.div>
                  </div>

                  {/* Product info */}
                  <div className="flex-1 space-y-6">
                    <div>
                      <h3 className="font-display text-3xl lg:text-4xl font-bold text-white">
                        {active.name}
                      </h3>
                      <p className="font-arabic text-lg text-white/30 mt-1">
                        {active.nameAr}
                      </p>
                    </div>

                    <p className="text-white/50 leading-relaxed">
                      {active.description}
                    </p>

                    {/* Feature tags */}
                    <div className="flex flex-wrap gap-2">
                      {active.features.map((f) => (
                        <motion.span
                          key={f}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="px-4 py-1.5 rounded-full text-xs font-medium tracking-wide border"
                          style={{
                            borderColor: `${active.color}30`,
                            color: active.color,
                            backgroundColor: `${active.color}08`,
                          }}
                        >
                          {f}
                        </motion.span>
                      ))}
                    </div>

                    {/* Price + CTA */}
                    <div className="flex items-center gap-6 pt-4">
                      <div>
                        <span className="text-white/30 text-sm">
                          Starting at
                        </span>
                        <p
                          className="font-display text-4xl font-black"
                          style={{ color: active.color }}
                        >
                          {active.price}
                          <span className="text-base font-normal text-white/20 ml-1">
                            YER
                          </span>
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-3 rounded-full font-bold text-white text-sm transition-all duration-300"
                        style={{
                          background: `linear-gradient(135deg, ${active.color}, ${active.color}99)`,
                        }}
                      >
                        Add to Order
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
