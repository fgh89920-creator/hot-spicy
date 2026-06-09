import type { Metadata, Viewport } from "next";
import { Inter, Outfit, Cairo } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/ui/CartDrawer";
import OrderHistoryDrawer from "@/components/ui/OrderHistoryDrawer";
import LiveNotificationListener from "@/components/ui/LiveNotificationListener";
import MobileBottomNav from "@/components/ui/MobileBottomNav";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "هوت سبايسي | تجربة وجبات سريعة فاخرة",
  description:
    "اكتشف النكهات الجريئة مع هوت سبايسي للوجبات السريعة — شاورما، بروست، بيتزا فاخرة، برجر وعصائر طازجة. تجربة فريدة مصممة بشغف.",
  keywords: [
    "Hot Spicy",
    "Fast Food",
    "Shawarma",
    "Broast",
    "Pizza",
    "Burgers",
    "Restaurant",
    "صنعاء",
    "هوت سبايسي",
    "مطعم وجبات سريعة",
  ],
  openGraph: {
    title: "هوت سبايسي | تجربة وجبات سريعة فاخرة",
    description:
      "نكهات جريئة وجودة ممتازة. شاورما، بروست، بيتزا والمزيد.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <body
        className={`${inter.variable} ${outfit.variable} ${cairo.variable} font-body antialiased noise-overlay`}
      >
        <CartProvider>
          {children}
          <CartDrawer />
          <OrderHistoryDrawer />
          <LiveNotificationListener />
          <MobileBottomNav />
        </CartProvider>
      </body>
    </html>
  );
}
