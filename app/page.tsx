import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "The Clean Crate Foods | Ready to Eat Protein Oats | Quick to Prepare Oats India",
  },
  description: "Buy the best ready-to-eat protein oats online in India. Quick to prepare, high-protein, no added sugar oats & protein bites by The Clean Crate. 100% natural, gluten free. Order now at thecleancratefoods.com.",
  alternates: {
    canonical: "https://www.thecleancratefoods.com",
  },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import Image from "next/image";
import { ModeToggle } from "@/components/mode-toggle";
import { SiteFooter } from "@/components/site-footer";
// import { CustomerReviewsCarousel } from "@/components/customer-reviews-carousel";
import { HowItWorksSection } from "@/components/how-it-works-section";
import { BrandPromiseSection } from "@/components/brand-promise-section";
import { AboutUsSection } from "@/components/about-us-section";
import { BlogSection } from "@/components/blog-section";
import { InstagramFeedSection } from "@/components/instagram-feed-section";
import { ContactSection } from "@/components/contact-section";
import { NewsletterSection } from "@/components/newsletter-section";
import { getLatestReels } from "@/lib/instagram";
import { BenefitsSection } from "@/components/benefits-section";
import { FeatureMarquee } from "@/components/feature-marquee";
import { FAQSection } from "@/components/faq-section";
// import { getTestimonials } from "@/lib/shopify"; // Removing this
// import { EasyReviewsWidget } from "@/components/easy-reviews-widget";
import { CustomerReviewsCarousel } from "@/components/customer-reviews-carousel";
import { HomeHeroCarousel } from "@/components/home-hero-carousel";
import { CuratedProductsGrid } from "@/components/curated-products-grid";
import { JsonLd } from "@/components/json-ld";

// Organization structured data for Google Knowledge Panel
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "The Clean Crate Foods",
  url: "https://www.thecleancratefoods.com",
  logo: "https://www.thecleancratefoods.com/logo-new.jpg",
  sameAs: [
    "https://www.instagram.com/thecleancrateofficial/",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    email: "info@thecleancratefoods.com",
    contactType: "customer service",
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "M/S Unjunked, Marthanda Nagar",
    addressLocality: "Hyderabad",
    postalCode: "500049",
    addressCountry: "IN",
  },
  description: "The Clean Crate Foods is a women-founded healthy snacking brand offering ready-to-eat protein oats and protein bites with clean, natural ingredients.",
  foundingDate: "2025",
};

// FAQ structured data for rich results in Google
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What makes The Clean Crate different from other oat brands?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Clean Crate combines high protein content (15g per serving) with zero added sugar and 100% natural ingredients. We focus on 'Ready to Eat' convenience without compromising on health or taste, using premium gluten-free oats and plant-based proteins.",
      },
    },
    {
      "@type": "Question",
      name: "Are your products totally gluten-free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! We use certified gluten-free oats in all our products, making them safe for those with gluten sensitivities. However, they are processed in a facility that handles nuts.",
      },
    },
    {
      "@type": "Question",
      name: "How do I prepare the Ready-to-Eat oats?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It's super simple! Just add water or your favorite milk (hot or cold), stir, and let it sit for 2 minutes. For 'Overnight Oats' style, soak them in milk and refrigerate overnight.",
      },
    },
    {
      "@type": "Question",
      name: "Is there any added sugar in your products?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely not. We sweeten our products naturally using dates, monk fruit, or stevia, ensuring you get a delicious taste without the sugar crash.",
      },
    },
    {
      "@type": "Question",
      name: "Are The Clean Crate products vegan?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, our entire range is 100% plant-based and vegan-friendly. We use pea protein and other plant-derived ingredients.",
      },
    },
    {
      "@type": "Question",
      name: "What is the shelf life of your products?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our products have a shelf life of 9 months from the date of manufacturing when stored in a cool, dry place.",
      },
    },
    {
      "@type": "Question",
      name: "Do you offer international shipping?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Currently, we ship across India. We are working on expanding our delivery network to international locations soon!",
      },
    },
    {
      "@type": "Question",
      name: "Is it safe for children?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, our products are made with clean, natural ingredients and are safe for children. However, we recommend checking the ingredient list for any specific nut allergies.",
      },
    },
  ],
};

// Rebuild force v2

export default async function Home() {
  const reels = await getLatestReels();
  // const product = await getProduct("mocha-rush-ready-to-eat-oats"); // Unused now

  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-black selection:text-white dark:bg-black dark:text-white dark:selection:bg-white dark:selection:text-black">
      <JsonLd data={organizationJsonLd} />
      <JsonLd data={faqJsonLd} />
      {/* Navbar */}


      <main className="pt-20">
        {/* Hero Section - Carousel */}
        <HomeHeroCarousel />

        {/* Feature Marquee - Moved below Hero */}
        {/* Feature Marquee - Animated */}
        <FeatureMarquee />

        {/* How It Fits Section (New) */}
        <div id="how-it-works" className="scroll-mt-24">
          <HowItWorksSection />
        </div>

        {/* Dynamic Product Grid */}
        <div id="products" className="scroll-mt-24">
          <CuratedProductsGrid />
        </div>

        {/* About Us Story Section */}
        <div id="about" className="scroll-mt-24">
          <AboutUsSection />
        </div>

        {/* Brand Promise Section (New) */}
        <div id="benefits" className="scroll-mt-24">
          <BrandPromiseSection />

          {/* Benefits Section */}
          <BenefitsSection />
        </div>

        {/* Testimonials Section */}
        <section id="reviews">
          <CustomerReviewsCarousel />
        </section>

        {/* Latest Blogs Section */}
        <div id="blog" className="scroll-mt-24">
          <BlogSection />
        </div>

        {/* Instagram Feed Section */}
        <div id="social" className="scroll-mt-24">
          <InstagramFeedSection reels={reels} />
        </div>

        {/* FAQ Section */}
        <div id="faq" className="scroll-mt-24">
          <FAQSection />
        </div>

        {/* Contact Us Section */}
        <div id="contact" className="scroll-mt-24">
          <ContactSection />
        </div>

        {/* Newsletter / CTA */}
        <NewsletterSection />

      </main>

      <SiteFooter />
    </div>
  );
}
