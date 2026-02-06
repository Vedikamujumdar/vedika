"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
    {
        id: "protein-oats",
        image: "/hero-oats.png",
        alt: "Delicious Protein Oats",
        title: <>Protein Oats <br /> Reimagined.</>,
        description: (
            <>
                Start your day with the perfect blend of taste and nutrition.
                <span className="font-black text-red-700"> 15g protein</span>, zero compromise.
                The breakfast you actually want to wake up for.
            </>
        ),
        ctaPrimary: { text: "Shop Now", href: "#products" },
        ctaSecondary: { text: "Learn more", href: "#about" },
        badge: "New Arrival",
        linkText: "See what's cooking"
    },
    {
        id: "protein-bites",
        image: "/hero-bites.jpg",
        alt: "Clean Crate Protein Bites",
        title: <>Protein Bites.</>,
        description: "Clean, high-protein bites made for smart snacking.",
        ctaPrimary: { text: "Explore Protein Bites", href: "#products" },
        ctaSecondary: null, // No secondary button requested for this slide
        badge: "New Arrival",
        linkText: "See what's cooking"
    }
];

export function HomeHeroCarousel() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000); // 6 seconds per slide
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    const slide = slides[currentSlide];

    return (
        <section id="home" className="relative h-[85vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden bg-[#FDFCF8] group">
            <AnimatePresence mode="wait">
                <motion.div
                    key={slide.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className="absolute inset-0 z-0"
                >
                    {/* Background Image */}
                    <div className="absolute inset-0 z-0">
                        <Image
                            src={slide.image}
                            alt={slide.alt}
                            fill
                            className="object-cover object-center"
                            priority
                        />
                        {/* Cinematic Lighting Overlay: Subtle Vignette + Warmth */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.15)_100%)]"></div>
                    </div>

                    {/* Content Container */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 w-full h-full flex items-center justify-start"
                    >
                        {/* Frosted Glass Card - Refined */}
                        <div className="max-w-xl p-10 md:p-12 rounded-[2.5rem] bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.04)] ring-1 ring-white/30">

                            {/* Minimal Badge */}
                            <div className="inline-flex items-center gap-x-3 mb-8">
                                <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase bg-zinc-900 text-white leading-none">
                                    {slide.badge}
                                </span>
                                <span className="h-px w-8 bg-zinc-900/10 hidden sm:block"></span>
                            </div>

                            {/* Headlines */}
                            <h1 className="font-heading text-5xl font-semibold tracking-tight text-zinc-900 sm:text-7xl mb-6 leading-[0.95] drop-shadow-sm">
                                {slide.title}
                            </h1>

                            <div className="text-lg leading-relaxed text-zinc-800 font-medium mb-10 max-w-md">
                                {slide.description}
                            </div>

                            {/* Buttons: Matte & Tactile */}
                            <div className="flex items-center gap-x-5">
                                <a
                                    href={slide.ctaPrimary.href}
                                    className="group relative rounded-full bg-zinc-900 text-white px-9 py-4 text-sm font-medium transition-all hover:bg-zinc-800 hover:shadow-lg hover:-translate-y-0.5"
                                >
                                    {slide.ctaPrimary.text}
                                </a>

                                {slide.ctaSecondary ? (
                                    <a
                                        href={slide.ctaSecondary.href}
                                        className="text-sm font-semibold text-zinc-900 hover:text-zinc-600 transition-colors border-b border-transparent hover:border-zinc-900 pb-0.5"
                                    >
                                        {slide.ctaSecondary.text}
                                    </a>
                                ) : (
                                    <a href="#products" className="text-sm font-semibold text-zinc-900 hover:text-zinc-600 transition-colors border-b border-transparent hover:border-zinc-900 pb-0.5">
                                        View Collection
                                    </a>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white/90 transition-all hover:scale-110 border border-white/10"
                aria-label="Previous slide"
            >
                <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white/90 transition-all hover:scale-110 border border-white/10"
                aria-label="Next slide"
            >
                <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
            </button>

            {/* Refined Indicators */}
            <div className="absolute bottom-10 left-12 flex gap-4 z-20">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-1 rounded-full transition-all duration-500 ${currentSlide === index ? "w-12 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}
