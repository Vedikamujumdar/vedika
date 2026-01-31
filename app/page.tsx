import Link from "next/link";
import Image from "next/image";
import { ModeToggle } from "@/components/mode-toggle";
import { ProductDetailsSection } from "@/components/product-details-section";
import { SiteFooter } from "@/components/site-footer";
import { CustomerReviewsCarousel } from "@/components/customer-reviews-carousel";
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
import { getProduct } from "@/lib/shopify";

// Rebuild force
export default async function Home() {
  const reels = await getLatestReels();
  const product = await getProduct("mocha-rush");

  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-black selection:text-white dark:bg-black dark:text-white dark:selection:bg-white dark:selection:text-black">
      {/* Navbar */}


      <main className="pt-20">
        {/* Hero Section */}
        <section id="home" className="relative h-[80vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/hero-oats.png"
              alt="Delicious Protein Oats"
              fill
              className="object-cover object-center"
              priority
            />
            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent dark:from-black/90 dark:via-black/60 dark:to-transparent"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 w-full">
            <div className="max-w-xl bg-white/20 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-white/40 shadow-xl">
              <div className="flex mb-6">
                <div className="relative flex items-center gap-x-4 rounded-full px-4 py-1.5 text-sm leading-6 ring-1 ring-zinc-900/20 bg-white/40 text-black font-semibold shadow-sm">
                  <span className="font-bold text-red-600">New Arrival</span>
                  <span className="h-4 w-px bg-zinc-900/20" aria-hidden="true" />
                  <a href="#products" className="flex items-center gap-x-1 hover:text-red-700 transition-colors">
                    See what's cooking <span aria-hidden="true">&rarr;</span>
                  </a>
                </div>
              </div>

              <h1 className="font-heading text-4xl font-black tracking-tight text-zinc-900 sm:text-6xl mb-6 drop-shadow-sm">
                Protein Oats <br /> Reimagined.
              </h1>

              <p className="text-lg leading-8 text-zinc-900 font-medium mb-8 max-w-lg drop-shadow-sm">
                Start your day with the perfect blend of taste and nutrition.
                <span className="font-black text-red-700"> 15g protein</span>, zero compromise.
                The breakfast you actually want to wake up for.
              </p>

              <div className="flex items-center gap-x-6">
                <a
                  href="#products"
                  className="rounded-full bg-black px-8 py-3.5 text-sm font-bold text-white shadow-xl hover:bg-zinc-800 transition-all hover:scale-105"
                >
                  Shop Now
                </a>
                <a href="#about" className="text-sm font-bold leading-6 text-black hover:text-red-700 transition-colors">
                  Learn more <span aria-hidden="true">→</span>
                </a>
              </div>

              {/* Social Proof */}
              <div className="mt-8 flex gap-6 text-sm font-bold text-zinc-900">
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-500 drop-shadow-sm">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <svg key={s} viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" /></svg>
                    ))}
                  </div>
                  <span>4.9/5 Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M20 6L9 17l-5-5"></path></svg>
                  <span>10k+ Happy Customers</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Marquee - Moved below Hero */}
        {/* Feature Marquee - Animated */}
        <FeatureMarquee />

        {/* How It Fits Section (New) */}
        <div id="how-it-works" className="scroll-mt-24">
          <HowItWorksSection />
        </div>

        {/* Product Details Section - Replicating Reference Image functionality */}
        <section id="products" className="mx-auto max-w-7xl px-6 py-24 lg:px-8 scroll-mt-24">
          <ProductDetailsSection product={product} />
        </section>

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
        <section id="reviews" className="bg-zinc-50 dark:bg-zinc-900 border-y border-zinc-200 dark:border-zinc-800 scroll-mt-24">
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
