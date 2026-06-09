"use client";

import { motion } from "framer-motion";

const footerLinks = {
  "قائمة الطعام": [
    { label: "شاورما", href: "#showcase" },
    { label: "بروست", href: "#showcase" },
    { label: "بيتزا", href: "#showcase" },
    { label: "برجر", href: "#builder" },
    { label: "عصائر طازجة", href: "#builder" },
  ],
  "الشركة": [
    { label: "من نحن", href: "#about" },
    { label: "قصتنا", href: "#about" },
    { label: "الوظائف", href: "#" },
    { label: "الصحافة", href: "#" },
  ],
  "الدعم والمساعدة": [
    { label: "اتصل بنا", href: "#contact" },
    { label: "خدمة التوصيل", href: "#" },
    { label: "الأسئلة الشائعة", href: "#" },
    { label: "الملاحظات", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer id="contact" className="relative border-t border-white/5 font-arabic">
      {/* Top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-brand-red/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand column */}
          <div className="lg:col-span-1 text-right">
            <div className="flex items-center gap-3 mb-6 justify-start">
              <span className="text-3xl">🔥</span>
              <div>
                <span className="font-display text-xl font-bold text-white">
                  هوت <span className="text-gradient-brand">سبايسي</span>
                </span>
                <p className="text-[10px] text-white/30 tracking-[0.1em] uppercase -mt-1 font-arabic">
                  وجبات سريعة
                </p>
              </div>
            </div>
            <p className="text-white/40 text-sm leading-relaxed mb-6 font-arabic">
              صُنع بالنار والشغف منذ اليوم الأول. تجربة وجبات سريعة فاخرة في صنعاء، اليمن.
            </p>

            {/* Contact info */}
            <div className="space-y-2 text-sm text-white/30 font-arabic">
              <p>📍 صنعاء - الأصبحي - شارع 22 مايو</p>
              <p dir="ltr" className="text-right">📞 01 620062</p>
              <p dir="ltr" className="text-right">📱 776820068 - 770620062</p>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-3 mt-6 justify-start">
              {["Facebook", "Instagram", "Twitter"].map((social) => (
                <motion.a
                  key={social}
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-brand-red hover:border-brand-red/30 transition-colors duration-300"
                  aria-label={social}
                >
                  {social === "Facebook" && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  )}
                  {social === "Instagram" && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  )}
                  {social === "Twitter" && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  )}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="text-right">
              <h4 className="font-arabic font-bold text-white text-sm uppercase tracking-wider mb-6">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-white/40 hover:text-white text-sm transition-colors duration-300 font-arabic"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/20 text-xs">
            © {new Date().getFullYear()} هوت سبايسي للوجبات السريعة. جميع الحقوق محفوظة.
          </p>
          <p className="text-white/20 text-xs font-arabic">
            @HotSpicy020 🔥
          </p>
        </div>
      </div>
    </footer>
  );
}
