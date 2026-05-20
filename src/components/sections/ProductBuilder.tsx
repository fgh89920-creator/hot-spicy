"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

/** Product variants that drive the 3D model color + ambient glow */
export interface ProductVariant {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  price: string;
  color: string;
  icon: string;
  image: string;
  features: string[];
}

const variants: ProductVariant[] = [
  {
    id: "shawarma",
    name: "شاورما عربي",
    nameAr: "Arabic Shawarma",
    description:
      "شاورما الدجاج المحضرة يدوياً مع الطحينة، اللفت المخلل، والأعشاب الطازجة ملفوفة بخبز عربي دافئ.",
    price: "1,500",
    color: "#E63946",
    icon: "🌯",
    image: "/images/shawarma.png",
    features: ["تتبيل 24 ساعة", "أعشاب طازجة", "بهارات سرية"],
  },
  {
    id: "broast",
    name: "بروست مقرمش",
    nameAr: "Crispy Broast",
    description:
      "دجاج ذهبي مقرمش مطهو تحت الضغط مع تتبيلة هوت سبايسي الحارة والسرية. يقدم مع الثومية وسلطة الملفوف.",
    price: "1,200",
    color: "#FF8C42",
    icon: "🍗",
    image: "/images/broast.png",
    features: ["مطهو بالضغط", "11 بهاراً سرياً", "قرمشة إضافية"],
  },
  {
    id: "pizza",
    name: "بيتزا هوت سبايسي",
    nameAr: "Hot Spicy Pizza",
    description:
      "عجينة محضرة يدوياً مغطاة بصلصتنا الحارة، مزيج من الأجبان الفاخرة، الببروني، الزيتون والهلابينو.",
    price: "3,000",
    color: "#FFD700",
    icon: "🍕",
    image: "/images/pizza.png",
    features: ["عجن يدوي", "نكهة الحطب", "أجبان فاخرة"],
  },
  {
    id: "burger",
    name: "برجر سبايسي",
    nameAr: "Spicy Burger 3×3",
    description:
      "ثلاث طبقات من لحم البقر المشوي مع جبنة تشيدر الذائبة، البصل المقرمش، ومايونيز حار بطعم أسطوري.",
    price: "1,700",
    color: "#FF4444",
    icon: "🍔",
    image: "/images/burger.png",
    features: ["لحم بقري فاخر", "جبنة ذائبة", "مايونيز حار"],
  },
  {
    id: "juice",
    name: "كوكتيل طبقات",
    nameAr: "Fresh Cocktail",
    description:
      "كوكتيل استوائي منعش مكوّن من طبقات المانجو والفراولة والكيوي الطازجة بالكامل وبدون إضافات.",
    price: "700",
    color: "#4ADE80",
    icon: "🥤",
    image: "/images/juice.png",
    features: ["فواكه طبيعية", "بدون إضافات", "طبقات ملونة"],
  },
];

interface ProductBuilderProps {
  onVariantChange: (color: string, image: string) => void;
}

export default function ProductBuilder({ onVariantChange }: ProductBuilderProps) {
  const [activeId, setActiveId] = useState(variants[0].id);
  const active = variants.find((v) => v.id === activeId)!;
  const { addToCart, setIsCartOpen } = useCart();
  const [toast, setToast] = useState<{ show: boolean; name: string } | null>(null);

  const handleSelect = (variant: ProductVariant) => {
    setActiveId(variant.id);
    onVariantChange(variant.color, variant.image);
  };

  const handleAddToOrder = () => {
    addToCart({
      id: active.id,
      name: active.name,
      price: active.price,
      image: active.image,
      color: active.color,
      icon: active.icon,
    });
    setToast({ show: true, name: active.name });
    setTimeout(() => {
      setToast(null);
    }, 3000);
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
          <span className="inline-block text-sm font-semibold tracking-[0.15em] uppercase text-brand-red mb-4 font-arabic">
            صمّم طلبك
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white">
            اختر نكهتك <span className="text-gradient-brand">المفضلة</span>
          </h2>
          <p className="mt-4 text-white/40 text-lg max-w-xl mx-auto">
            اختر صنفاً لتشاهده يتفاعل أمامك مباشرة. كل نكهة تنبض بالحياة بألوانها وتفاصيلها الفريدة.
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

                {/* Product thumbnail */}
                <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 relative">
                  <Image
                    src={v.image}
                    alt={v.name}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
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
                  {/* Product visual — REAL FOOD IMAGE */}
                  <div className="relative flex-shrink-0">
                    <motion.div
                      className="w-56 h-56 lg:w-64 lg:h-64 rounded-2xl flex items-center justify-center relative overflow-hidden"
                      style={{
                        background: `radial-gradient(circle at center, ${active.color}20, transparent 70%)`,
                      }}
                      animate={{ rotate: [0, 2, -2, 0] }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      {/* Food product image */}
                      <motion.div
                        className="relative w-full h-full"
                        animate={{ y: [0, -8, 0] }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <Image
                          src={active.image}
                          alt={active.name}
                          fill
                          className="object-contain drop-shadow-2xl"
                          sizes="(max-width: 768px) 224px, 256px"
                          priority
                        />
                      </motion.div>

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

                    {/* Glow underneath the image */}
                    <div
                      className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 rounded-full blur-xl opacity-40"
                      style={{ backgroundColor: active.color }}
                    />
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
                        <span className="text-white/30 text-sm font-arabic">
                          يبدأ من
                        </span>
                        <p
                          className="font-display text-4xl font-black"
                          style={{ color: active.color }}
                        >
                          {active.price}
                          <span className="text-base font-normal text-white/20 mr-1 font-arabic">
                            ريال
                          </span>
                        </p>
                      </div>
                      <motion.button
                        onClick={handleAddToOrder}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-3 rounded-full font-bold text-white text-sm transition-all duration-300 font-arabic"
                        style={{
                          background: `linear-gradient(135deg, ${active.color}, ${active.color}99)`,
                        }}
                      >
                        أضف للطلب
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 glass-card p-4 rounded-2xl flex items-center gap-3 border border-brand-orange/30 shadow-2xl shadow-brand-red/10 cursor-pointer"
            onClick={() => setIsCartOpen(true)}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-red to-brand-orange flex items-center justify-center text-lg text-white">
              🔥
            </div>
            <div>
              <p className="font-arabic text-white text-sm font-bold">تمت الإضافة!</p>
              <p className="font-arabic text-white/50 text-xs">تم إضافة {toast.name} إلى السلة.</p>
            </div>
            <span className="text-white/20 text-xs font-arabic border-r border-white/10 pr-3 mr-1 hover:text-white transition-colors duration-300">
              عرض السلة ←
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
