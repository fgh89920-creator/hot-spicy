import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Hot Spicy brand palette
        brand: {
          red: "#E63946",
          "red-dark": "#B71C1C",
          "red-light": "#FF6B6B",
          orange: "#FF8C42",
          gold: "#FFD700",
          cream: "#FFF5E1",
        },
        surface: {
          dark: "#0A0A0A",
          card: "#141414",
          "card-hover": "#1C1C1C",
          border: "#2A2A2A",
        },
      },
      fontFamily: {
        display: ["var(--font-outfit)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        arabic: ["var(--font-cairo)", "sans-serif"],
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "slide-up": "slide-up 0.8s ease-out forwards",
        "fade-in": "fade-in 1s ease-out forwards",
        "spin-slow": "spin 20s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotateY(0deg)" },
          "50%": { transform: "translateY(-20px) rotateY(180deg)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        "slide-up": {
          "0%": { transform: "translateY(60px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-glow": "radial-gradient(ellipse at center, rgba(230,57,70,0.15) 0%, transparent 70%)",
      },
    },
  },
  plugins: [],
};

export default config;
