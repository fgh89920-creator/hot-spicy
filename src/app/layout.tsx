import type { Metadata } from "next";
import { Inter, Outfit, Cairo } from "next/font/google";
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
  title: "Hot Spicy | Premium Fast Food Experience",
  description:
    "Discover the bold flavors of Hot Spicy Fast Food — Shawarma, Broast, Gourmet Pizza, Burgers & Fresh Juices. An immersive dining experience crafted with passion.",
  keywords: [
    "Hot Spicy",
    "Fast Food",
    "Shawarma",
    "Broast",
    "Pizza",
    "Burgers",
    "Restaurant",
    "صنعاء",
  ],
  openGraph: {
    title: "Hot Spicy | Premium Fast Food Experience",
    description:
      "Bold flavors, premium quality. Shawarma, Broast, Pizza & more.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${outfit.variable} ${cairo.variable} font-body antialiased noise-overlay`}
      >
        {children}
      </body>
    </html>
  );
}
