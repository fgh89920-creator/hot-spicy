"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: "10K+", label: "Happy Customers", icon: "😍" },
  { value: "50+", label: "Menu Items", icon: "🍽️" },
  { value: "24/7", label: "Delivery Hours", icon: "🛵" },
  { value: "4.9", label: "Rating", icon: "⭐" },
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".about-content",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        ".stat-card",
        { y: 40, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.12,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: ".stats-grid",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="relative py-32 lg:py-40">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-0 w-[300px] h-[300px] bg-brand-red/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="about-content max-w-3xl mx-auto text-center mb-20">
          <span className="inline-block text-sm font-semibold tracking-[0.3em] uppercase text-brand-red mb-4">
            Our Story
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
            Born From{" "}
            <span className="text-gradient-fire">Fire</span>
          </h2>
          <p className="mt-6 text-white/40 text-lg leading-relaxed">
            What started as a small kitchen with a big dream has grown into
            Sana'a&apos;s most beloved fast food destination. We believe in bold
            flavors, fresh ingredients, and the kind of spice that makes you
            come back for more. Every recipe is crafted with passion and a
            relentless pursuit of taste perfection.
          </p>
          <p className="mt-4 text-white/40 text-lg leading-relaxed font-arabic">
            ما بدأ كمطبخ صغير بحلم كبير أصبح الوجهة المفضلة للوجبات السريعة في صنعاء
          </p>
        </div>

        {/* Stats grid */}
        <div className="stats-grid grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              whileHover={{ y: -6, scale: 1.02 }}
              className="stat-card glass-card rounded-2xl p-6 lg:p-8 text-center group cursor-default"
            >
              <span className="text-4xl mb-4 block group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </span>
              <p className="font-display text-3xl lg:text-4xl font-black text-gradient-brand">
                {stat.value}
              </p>
              <p className="text-white/40 text-sm mt-2 tracking-wide">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
