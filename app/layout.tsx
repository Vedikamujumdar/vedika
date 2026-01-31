import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google"; // turbo
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Clean Crate | High Protein Oats",
  description: "Fuel your day with our premium protein-packed oat mixes. 100% natural, delicious, and convenient.",
};

import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { CartProvider } from "@/context/cart-context";
import { CartDrawer } from "@/components/cart-drawer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body
        className={`${inter.variable} ${outfit.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CartProvider>
            <SiteHeader />
            <CartDrawer />
            <div className="flex flex-col min-h-screen">
              {children}
            </div>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
