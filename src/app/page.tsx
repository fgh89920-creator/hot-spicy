"use client";

import { useState, lazy, Suspense } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/ui/Navbar";
import LoadingScreen from "@/components/ui/LoadingScreen";
import HeroSection from "@/components/sections/HeroSection";
import ShowcaseSection from "@/components/sections/ShowcaseSection";
import ProductBuilder from "@/components/sections/ProductBuilder";
import AboutSection from "@/components/sections/AboutSection";
import Footer from "@/components/sections/Footer";

// Dynamic import for the 3D scene — avoids SSR issues with Three.js
const Scene = dynamic(() => import("@/components/three/Scene"), {
  ssr: false,
  loading: () => null,
});

export default function Home() {
  // Accent color state — shared between ProductBuilder and 3D Scene
  const [accentColor, setAccentColor] = useState("#E63946");

  return (
    <>
      <LoadingScreen />

      {/* ─── 3D Canvas (fixed behind content) ─── */}
      <Scene accentColor={accentColor} />

      {/* ─── Ambient background glow (follows accent color) ─── */}
      <div
        className="ambient-glow"
        style={{
          background: `radial-gradient(circle, ${accentColor}08 0%, transparent 70%)`,
        }}
      />

      {/* ─── UI Layer ─── */}
      <div className="relative z-10">
        <Navbar />

        <main>
          {/* Section 1: Full-screen hero with 3D model behind */}
          <HeroSection />

          {/* Section 2: Scroll-triggered product showcase */}
          <ShowcaseSection />

          {/* Section 3: Interactive product builder / selector */}
          <ProductBuilder onColorChange={setAccentColor} />

          {/* Section 4: About / Stats */}
          <AboutSection />
        </main>

        <Footer />
      </div>
    </>
  );
}
