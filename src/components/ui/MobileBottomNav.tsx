"use client";

import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";

const navItems = [
  { label: "الرئيسية", href: "#hero", icon: "🏠" },
  { label: "القائمة", href: "#showcase", icon: "🍽️" },
  { label: "اطلب", href: "#builder", icon: "🔥", isPrimary: true },
  { label: "طلباتي", href: "#", action: "orders", icon: "📦" },
  { label: "السلة", href: "#", action: "cart", icon: "🛒" },
];

export default function MobileBottomNav() {
  const { cart, setIsCartOpen, setIsOrdersOpen } = useCart();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleClick = (item: typeof navItems[0]) => {
    if (item.action === "cart") {
      setIsCartOpen(true);
    } else if (item.action === "orders") {
      setIsOrdersOpen(true);
    }
  };

  return (
    <nav className="bottom-nav font-arabic" aria-label="التنقل السريع">
      {navItems.map((item) =>
        item.isPrimary ? (
          <a
            key={item.label}
            href={item.href}
            className="flex flex-col items-center gap-0.5 -mt-5"
          >
            <motion.div
              whileTap={{ scale: 0.9 }}
              className="w-14 h-14 rounded-full bg-gradient-to-tr from-brand-red to-brand-orange flex items-center justify-center text-2xl shadow-xl shadow-brand-red/40 border-4 border-[#0a0a0a]"
            >
              {item.icon}
            </motion.div>
            <span className="text-[9px] text-brand-orange font-bold mt-0.5">
              {item.label}
            </span>
          </a>
        ) : item.action ? (
          <button
            key={item.label}
            onClick={() => handleClick(item)}
            className="flex flex-col items-center gap-0.5 px-2 relative touch-target"
          >
            <span className="text-xl">{item.icon}</span>
            {item.action === "cart" && cartCount > 0 && (
              <span className="absolute -top-1 right-1 bg-brand-red text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-black">
                {cartCount}
              </span>
            )}
            <span className="text-[9px] text-white/40">{item.label}</span>
          </button>
        ) : (
          <a
            key={item.label}
            href={item.href}
            className="flex flex-col items-center gap-0.5 px-2 touch-target"
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-[9px] text-white/40">{item.label}</span>
          </a>
        )
      )}
    </nav>
  );
}
