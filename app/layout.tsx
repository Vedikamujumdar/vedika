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
  metadataBase: new URL("https://www.thecleancratefoods.com"),
  title: {
    default: "The Clean Crate | Ready to Eat Protein Oats | Quick to Prepare Oats India",
    template: "%s | The Clean Crate Foods",
  },
  description: "Buy the best ready-to-eat protein oats in India. Quick to prepare, high-protein, no added sugar oats by The Clean Crate. Order instant oats, protein bites & healthy breakfast online at thecleancratefoods.com.",
  keywords: [
    "ready to eat oats",
    "quick to prepare oats",
    "instant oats India",
    "protein oats",
    "protein oats India",
    "high protein oats",
    "healthy breakfast India",
    "no added sugar oats",
    "The Clean Crate",
    "The Clean Crate Foods",
    "clean eating",
    "fitness food India",
    "protein bites",
    "overnight oats",
    "buy oats online India",
    "best oats brand India",
    "gluten free oats",
  ],
  authors: [{ name: "The Clean Crate Foods" }],
  creator: "The Clean Crate Foods",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.thecleancratefoods.com",
    title: "The Clean Crate | Ready to Eat Protein Oats | Buy Online India",
    description: "Buy the best ready-to-eat protein oats in India. Quick to prepare, high-protein, no added sugar oats. Order online at thecleancratefoods.com.",
    siteName: "The Clean Crate Foods",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "The Clean Crate Foods - Ready to Eat Protein Oats India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Clean Crate | Ready to Eat Protein Oats India",
    description: "Buy the best ready-to-eat protein oats in India. Quick to prepare, high-protein, no added sugar.",
    images: ["/og-image.jpg"],
    creator: "@thecleancrate",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { CartProvider } from "@/context/cart-context";
import { AuthProvider } from "@/context/auth-context";
import { CartDrawer } from "@/components/cart-drawer";
import { MetaPixel } from "@/components/meta-pixel";

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
        <MetaPixel />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CartProvider>
            <AuthProvider>
              <SiteHeader />
              <CartDrawer />
              <div className="flex flex-col min-h-screen">
                {children}
              </div>
            </AuthProvider>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
