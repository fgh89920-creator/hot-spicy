"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const showcaseItems = [
  {
    title: "الشاورما الأسطورية",
    titleAr: "Legendary Shawarma",
    description:
      "شاورما عربي مجهزة على نار هادئة، مقطعة بدقة وملفوفة بإتقان. تُنقع شاورما الدجاج الخاصة بنا لمدة 24 ساعة في مزيج بهارات سري يضفي عليها طعماً غنياً وحرارة لا تقاوم.",
    stat: "1500+",
    statLabel: "طلب يومياً",
    accent: "#E63946",
    image: "/images/shawarma.png",
  },
  {
    title: "البروست المقرمش",
    titleAr: "Crispy Broast",
    description:
      "ذهبي ومقرمش من الخارج — طري ولذيذ من الداخل. مطهو تحت الضغط باستخدام تقنية هوت سبايسي الفريدة للحصول على أفضل تجربة دجاج مقرمش.",
    stat: "8 قطع",
    statLabel: "وجبات عائلية",
    accent: "#FF8C42",
    image: "/images/broast.png",
  },
  {
    title: "بيتزا هوت سبايسي",
    titleAr: "Gourmet Pizza",
    description:
      "عجينة محضرة يدوياً، وإضافات فاخرة، مع صلصة هوت سبايسي الحارة الخاصة بنا. بيتزا هوت سبايسي الشهيرة محملة بقطع الببروني والهلابينو والجبنة الغنية.",
    stat: "3,000",
    statLabel: "ريال للبيتزا الكبيرة",
    accent: "#FFD700",
    image: "/images/pizza.png",
  },
];

export default function ShowcaseSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate each showcase card on scroll
      cardsRef.current.forEach((card, i) => {
        if (!card) return;

        gsap.fromTo(
          card,
          {
            y: 100,
            opacity: 0,
            rotateX: 15,
          },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              end: "top 50%",
              toggleActions: "play none none reverse",
            },
          }
        );

        // Parallax effect on the stat number
        const statEl = card.querySelector(".stat-number");
        if (statEl) {
          gsap.fromTo(
            statEl,
            { scale: 0.5, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.8,
              ease: "back.out(1.7)",
              scrollTrigger: {
                trigger: card,
                start: "top 75%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      });

      // Section heading animation
      gsap.fromTo(
        ".showcase-heading",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="showcase"
      ref={sectionRef}
      className="relative py-20 sm:py-32 lg:py-40 overflow-hidden"
    >
      {/* Section background accent */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-red/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-orange/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section heading */}
        <div className="showcase-heading text-center mb-20">
          <motion.span
            className="inline-block text-sm font-semibold tracking-[0.15em] uppercase text-brand-red mb-4 font-arabic"
          >
            أطباقنا المميزة
          </motion.span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
            معرض{" "}
            <span className="text-gradient-brand">النكهات</span>
          </h2>
          <p className="mt-4 text-white/40 text-lg max-w-xl mx-auto">
            كل طبق يروي قصة من البهارات الجريئة، والمكونات الطازجة، وحرفية الطهي الرفيعة.
          </p>
        </div>

        {/* Showcase cards */}
        <div className="space-y-12 sm:space-y-24 lg:space-y-32">
          {showcaseItems.map((item, i) => (
            <div
              key={item.title}
              ref={(el) => { cardsRef.current[i] = el; }}
              className="glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-12 relative overflow-hidden group"
              style={{ perspective: "1000px" }}
            >
              {/* Accent border glow */}
              <div
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{
                  boxShadow: `inset 0 0 60px ${item.accent}15, 0 0 40px ${item.accent}10`,
                }}
              />

              <div
                className={`flex flex-col ${
                  i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                } items-center gap-6 sm:gap-12`}
              >
                {/* Text side */}
                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-1 h-12 rounded-full"
                      style={{ backgroundColor: item.accent }}
                    />
                    <div>
                      <h3 className="font-display text-3xl lg:text-4xl font-bold text-white">
                        {item.title}
                      </h3>
                      <p className="font-arabic text-lg text-white/30 mt-1">
                        {item.titleAr}
                      </p>
                    </div>
                  </div>

                  <p className="text-white/50 text-lg leading-relaxed">
                    {item.description}
                  </p>

                  {/* Stat */}
                  <div className="flex items-end gap-3 pt-2 sm:pt-4">
                    <span
                      className="stat-number font-display text-4xl sm:text-5xl lg:text-6xl font-black"
                      style={{ color: item.accent }}
                    >
                      {item.stat}
                    </span>
                    <span className="text-white/30 text-sm pb-2 tracking-wide uppercase">
                      {item.statLabel}
                    </span>
                  </div>
                </div>

                {/* Visual side — REAL FOOD IMAGE */}
                <div className="flex-1 relative">
                  <div
                    className="w-full aspect-square max-w-md mx-auto rounded-3xl flex items-center justify-center relative overflow-hidden"
                    style={{
                      background: `radial-gradient(circle at center, ${item.accent}20, transparent 70%)`,
                    }}
                  >
                    {/* Decorative circles */}
                    <div
                      className="absolute w-48 h-48 rounded-full border opacity-10 animate-spin-slow"
                      style={{ borderColor: item.accent }}
                    />
                    <div
                      className="absolute w-64 h-64 rounded-full border opacity-5 animate-spin-slow"
                      style={{
                        borderColor: item.accent,
                        animationDirection: "reverse",
                        animationDuration: "30s",
                      }}
                    />

                    {/* Food product image */}
                    <motion.div
                      className="relative w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80 z-10"
                      whileHover={{ scale: 1.05, rotate: i % 2 === 0 ? 5 : -5 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-contain drop-shadow-2xl"
                        sizes="(max-width: 768px) 288px, 320px"
                      />
                    </motion.div>

                    {/* Floor glow shadow */}
                    <div
                      className="absolute bottom-4 left-1/2 -translate-x-1/2 w-2/3 h-6 rounded-full blur-xl opacity-40 pointer-events-none"
                      style={{ backgroundColor: item.accent }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
