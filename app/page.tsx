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

// Rebuild force v2

export default async function Home() {
  const reels = await getLatestReels();
  // const product = await getProduct("mocha-rush-ready-to-eat-oats"); // Unused now

  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-black selection:text-white dark:bg-black dark:text-white dark:selection:bg-white dark:selection:text-black">
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
        <FAQSection />

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
