"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const layersData = [
  {
    id: "toppings",
    name: "الإضافات الحارة",
    nameAr: "Spicy Toppings",
    desc: "طبقة حارة من الهلابينو الأخضر، الفلفل الأحمر البارد، وشرائح الفطر التي تضفي الحرارة المميزة.",
    offsetY: -280,
    rotate: -15,
    sliceTop: "0%",
  },
  {
    id: "cheese",
    name: "جبنة موزاريلا غنية",
    nameAr: "Melted Mozzarella",
    desc: "غطاء غني من جبنة الموزاريلا الفاخرة التي تذوب وتمتد فوق صلصة المارينارا الساخنة.",
    offsetY: -140,
    rotate: 10,
    sliceTop: "20%",
  },
  {
    id: "sauce",
    name: "صلصة الطماطم الحارة",
    nameAr: "Spicy Tomato Sauce",
    desc: "صلصة البيتزا الحمراء الحارة الأسطورية، ممزوجة بالبهارات العربية الأصيلة والأعشاب الطازجة.",
    offsetY: 0,
    rotate: -5,
    sliceTop: "40%",
  },
  {
    id: "crust",
    name: "عجينة مقرمشة على الحطب",
    nameAr: "Wood-Fired Crust",
    desc: "عجينة بيتزا ذهبية محضرة يدوياً، مخبوزة حتى القرمشة المثالية بحواف هشة.",
    offsetY: 140,
    rotate: 8,
    sliceTop: "60%",
  },
  {
    id: "pan",
    name: "مقلاة الحديد الزهر",
    nameAr: "Cast Iron Pan",
    desc: "المقلاة الحديدية الثقيلة التي تحتفظ بحرارة هائلة لخبز العجينة بشكل متساوٍ.",
    offsetY: 280,
    rotate: -10,
    sliceTop: "80%",
  },
];

export default function PizzaExplodedSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef<(HTMLDivElement | null)[]>([]);
  const textLeftRef = useRef<HTMLDivElement>(null);
  const textRightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Create the timeline for the scroll animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: "+=150%", // How long the scroll remains pinned
          pin: true,
          scrub: 1, // Smooth scrolling effect
          anticipatePin: 1,
        },
      });

      // 1. Animate layers coming together (Deconstructed -> Assembled)
      layersData.forEach((layer, index) => {
        const el = layersRef.current[index];
        if (!el) return;

        // Start state: dispersed in Y space and rotated
        gsap.set(el, {
          y: layer.offsetY,
          rotate: layer.rotate,
          opacity: 0.85,
        });

        // Animate to assembled state (center, zero rotation)
        tl.to(
          el,
          {
            y: 0,
            rotate: 0,
            opacity: 1,
            ease: "none",
          },
          0 // All layers animate in parallel at time 0
        );
      });

      // 2. Animate the descriptions/headings text fading and moving
      tl.fromTo(
        ".exploded-title",
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" },
        0
      );

      // Left column texts sequence
      const leftItems = textLeftRef.current?.children;
      if (leftItems) {
        Array.from(leftItems).forEach((item, i) => {
          tl.fromTo(
            item,
            { x: -50, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.4, ease: "power2.out" },
            0.1 + i * 0.15
          );
        });
      }

      // Right column texts sequence
      const rightItems = textRightRef.current?.children;
      if (rightItems) {
        Array.from(rightItems).forEach((item, i) => {
          tl.fromTo(
            item,
            { x: 50, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.4, ease: "power2.out" },
            0.1 + i * 0.15
          );
        });
      }

      // 3. Add a scale glow at the end when assembled
      tl.to(
        ".assembly-glow",
        {
          scale: 1.2,
          opacity: 0.3,
          duration: 0.5,
          ease: "power2.out",
        },
        "-=0.2"
      );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative bg-surface-dark overflow-hidden">
      <div
        ref={triggerRef}
        className="min-h-screen flex flex-col justify-center items-center py-20 px-6 relative"
      >
        {/* Glow behind assembly */}
        <div className="assembly-glow absolute w-96 h-96 rounded-full bg-brand-red/10 blur-[100px] pointer-events-none opacity-0 transition-opacity duration-500" />

        {/* Section Heading */}
        <div className="exploded-title text-center max-w-2xl mb-12 z-20">
          <span className="inline-block text-sm font-semibold tracking-[0.15em] uppercase text-brand-red mb-3 font-arabic">
            ولدت من النار
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-black text-white leading-tight">
            تفكيك <span className="text-gradient-brand">البيتزا الاسطورية</span>
          </h2>
          <p className="mt-3 text-white/40 text-sm sm:text-base">
            مرر لأسفل لتشاهد طبقات البيتزا الحارة المطهوة على الحطب وهي تتجمع في الوقت الفعلي.
          </p>
        </div>

        {/* Main interactive area */}
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 items-center gap-12 z-10">
          {/* Left Text Info Column */}
          <div ref={textLeftRef} className="space-y-8 text-left hidden lg:block">
            {layersData.slice(0, 2).map((layer) => (
              <div key={layer.id} className="glass-card p-6 rounded-2xl border border-white/5 hover:border-brand-red/20 transition-all duration-300">
                <span className="text-xs font-semibold tracking-wider text-brand-red uppercase">
                  {layer.nameAr}
                </span>
                <h4 className="text-lg font-bold text-white mt-1">{layer.name}</h4>
                <p className="text-xs text-white/50 mt-2 leading-relaxed">{layer.desc}</p>
              </div>
            ))}
          </div>

          {/* Center Pizza Slice Assembly Column */}
          <div className="flex justify-center items-center relative h-[500px]">
            {/* Outer orbits/lines */}
            <div className="absolute w-[420px] h-[420px] rounded-full border border-white/5 pointer-events-none" />
            <div className="absolute w-[480px] h-[480px] rounded-full border border-white/5 border-dashed pointer-events-none animate-spin-slow" />

            {/* Exploded pizza container */}
            <div className="relative w-[360px] h-[360px] md:w-[400px] md:h-[400px] flex flex-col justify-center items-center">
              {layersData.map((layer, index) => (
                <div
                  key={layer.id}
                  ref={(el) => { layersRef.current[index] = el; }}
                  className="absolute w-[360px] h-[360px] md:w-[400px] md:h-[400px] overflow-hidden rounded-full pointer-events-none"
                  style={{
                    // Show only 20% of the image height for each layer
                    clipPath: `inset(${index * 20}% 0% ${(4 - index) * 20}% 0%)`,
                  }}
                >
                  <Image
                    src="/images/pizza-exploded.png"
                    alt={layer.name}
                    fill
                    sizes="(max-width: 768px) 360px, 400px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Text Info Column */}
          <div ref={textRightRef} className="space-y-8 text-right hidden lg:block">
            {layersData.slice(2).map((layer) => (
              <div key={layer.id} className="glass-card p-6 rounded-2xl border border-white/5 hover:border-brand-red/20 transition-all duration-300">
                <span className="text-xs font-semibold tracking-wider text-brand-red uppercase">
                  {layer.nameAr}
                </span>
                <h4 className="text-lg font-bold text-white mt-1">{layer.name}</h4>
                <p className="text-xs text-white/50 mt-2 leading-relaxed">{layer.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile View Info List */}
        <div className="w-full max-w-md grid grid-cols-1 gap-4 mt-8 lg:hidden z-10">
          {layersData.map((layer) => (
            <div key={layer.id} className="glass-card p-4 rounded-xl border border-white/5">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold text-white">{layer.name}</h4>
                <span className="text-[10px] font-semibold text-brand-red uppercase tracking-wider">
                  {layer.nameAr}
                </span>
              </div>
              <p className="text-xs text-white/50 mt-1 leading-normal">{layer.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
