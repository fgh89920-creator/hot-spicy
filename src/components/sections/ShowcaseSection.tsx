"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const showcaseItems = [
  {
    title: "Legendary Shawarma",
    titleAr: "شاورما عربي",
    description:
      "Slow-roasted, thinly sliced, and wrapped to perfection. Our Arabic shawarma is marinated for 24 hours in a secret spice blend that delivers heat, depth, and irresistible flavor.",
    stat: "1500+",
    statLabel: "Orders Daily",
    accent: "#E63946",
  },
  {
    title: "Crispy Broast",
    titleAr: "بروست",
    description:
      "Golden, crunchy on the outside — tender and juicy within. Pressure-cooked using our signature Hot Spicy technique for the ultimate crispy chicken experience.",
    stat: "8",
    statLabel: "Piece Family Packs",
    accent: "#FF8C42",
  },
  {
    title: "Gourmet Pizza",
    titleAr: "بيتزا هوت سبايسي",
    description:
      "Hand-tossed dough, premium toppings, and our fiery Hot Spicy sauce. From classic Margherita to our signature Hot Spicy Pizza loaded with pepperoni and jalapenos.",
    stat: "3000",
    statLabel: "Per Large Pizza",
    accent: "#FFD700",
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
      className="relative py-32 lg:py-40 overflow-hidden"
    >
      {/* Section background accent */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-red/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-orange/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Section heading */}
        <div className="showcase-heading text-center mb-20">
          <motion.span
            className="inline-block text-sm font-semibold tracking-[0.3em] uppercase text-brand-red mb-4"
          >
            Our Signature
          </motion.span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
            Flavor{" "}
            <span className="text-gradient-brand">Showcase</span>
          </h2>
          <p className="mt-4 text-white/40 text-lg max-w-xl mx-auto">
            Every dish tells a story of bold spices, fresh ingredients, and
            culinary craftsmanship.
          </p>
        </div>

        {/* Showcase cards */}
        <div className="space-y-24 lg:space-y-32">
          {showcaseItems.map((item, i) => (
            <div
              key={item.title}
              ref={(el) => { cardsRef.current[i] = el; }}
              className="glass-card rounded-3xl p-8 lg:p-12 relative overflow-hidden group"
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
                } items-center gap-12`}
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
                  <div className="flex items-end gap-3 pt-4">
                    <span
                      className="stat-number font-display text-5xl lg:text-6xl font-black"
                      style={{ color: item.accent }}
                    >
                      {item.stat}
                    </span>
                    <span className="text-white/30 text-sm pb-2 tracking-wide uppercase">
                      {item.statLabel}
                    </span>
                  </div>
                </div>

                {/* Visual side — placeholder for food images */}
                <div className="flex-1 relative">
                  <div
                    className="w-full aspect-square max-w-md mx-auto rounded-2xl flex items-center justify-center relative overflow-hidden"
                    style={{
                      background: `radial-gradient(circle at center, ${item.accent}15, transparent 70%)`,
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

                    {/* Placeholder icon */}
                    <div className="text-center">
                      <span className="text-7xl">
                        {i === 0 ? "🌯" : i === 1 ? "🍗" : "🍕"}
                      </span>
                      <p className="text-white/20 text-xs mt-4 tracking-widest uppercase">
                        Image placeholder
                      </p>
                    </div>
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
