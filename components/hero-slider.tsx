
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight } from "lucide-react"

interface Slide {
    id: number
    image: string
    title: string
    subtext: string
    ctaText: string
    ctaLink: string
    align?: "left" | "center" | "right"
}

const SLIDES: Slide[] = [
    {
        id: 1,
        image: "/hero-oats.png", // Using existing asset for now, typically would swap
        title: "Breakfast, Refined.",
        subtext: "High-protein oats crafted for clean nutrition and everyday balance.",
        ctaText: "Explore Oats",
        ctaLink: "/products/mocha-rush-ready-to-eat-oats",
        align: "left"
    },
    {
        id: 2,
        image: "/hero-protein-bites.png", // Will be generated
        title: "Smart Snacking.",
        subtext: "Protein bites crafted for clean energy and guilt-free indulgence.",
        ctaText: "Explore Protein Bites",
        ctaLink: "/#products",
        align: "center"
    }
]

export function HeroSlider() {
    const [currentSlide, setCurrentSlide] = useState(0)

    // Auto-slide effect
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % SLIDES.length)
        }, 6000) // 6 seconds per slide
        return () => clearInterval(timer)
    }, [])

    return (
        <section className="relative w-full h-[85vh] min-h-[600px] overflow-hidden bg-bg-secondary">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    className="absolute inset-0"
                >
                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0 z-0">
                        <Image
                            src={SLIDES[currentSlide].image}
                            alt={SLIDES[currentSlide].title}
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-black/20 dark:bg-black/40" />
                    </div>

                    {/* Content Content */}
                    <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex items-center">
                        <div className={`w-full max-w-2xl ${SLIDES[currentSlide].align === 'center' ? 'mx-auto text-center' : 'text-left'}`}>
                            <motion.h1
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                                className="text-5xl md:text-7xl font-bold text-white mb-6 font-heading tracking-tight"
                            >
                                {SLIDES[currentSlide].title}
                            </motion.h1>
                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                                className="text-lg md:text-xl text-white/90 mb-10 font-medium leading-relaxed max-w-lg mx-auto md:mx-0"
                            >
                                {SLIDES[currentSlide].subtext}
                            </motion.p>
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.8 }}
                            >
                                <Link
                                    href={SLIDES[currentSlide].ctaLink}
                                    className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-semibold text-sm hover:bg-white/90 transition-colors"
                                >
                                    {SLIDES[currentSlide].ctaText}
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Slide Indicators */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                {SLIDES.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-1 transition-all duration-300 rounded-full ${index === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'}`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    )
}
