"use client"

import * as React from "react"
import type { Testimonial } from "@/lib/shopify"

const isInstagramUrl = (url?: string) => {
    return typeof url === "string" && url.includes("cdninstagram.com");
};

// Default reviews as fallback
const defaultReviews: Testimonial[] = [
    {
        id: 1,
        author: "Sarah J.",
        role: "Verified Buyer",
        rating: 5,
        text: "Absolutely love the Mocha vibe! It's my go-to breakfast now. The coffee kick is real and it keeps me full for hours.",
        date: "2 days ago"
    },
    {
        id: 2,
        author: "Mike T.",
        role: "Fitness Enthusiast",
        rating: 5,
        text: "Best protein oats I've tried. Not too sweet, just perfect. The convenience of it being ready-to-eat is a game changer for my morning gym rush.",
        date: "1 week ago"
    },
    {
        id: 3,
        author: "Priya K.",
        role: "Verified Buyer",
        rating: 4,
        text: "Very tasty! I add a bit of almond milk and it's perfect. Love that it has no added sugar.",
        date: "2 weeks ago"
    },
    {
        id: 4,
        author: "David L.",
        role: "Verified Buyer",
        rating: 5,
        text: "I was skeptical about cold oats, but these are delicious. The mocha flavor is spot on.",
        date: "3 weeks ago"
    },
    {
        id: 5,
        author: "Emily R.",
        role: "Yoga Instructor",
        rating: 5,
        text: "Clean ingredients and great taste. Finally a healthy breakfast that doesn't taste like cardboard!",
        date: "1 month ago"
    }
]

interface CustomerReviewsCarouselProps {
    testimonials?: Testimonial[];
}

export function CustomerReviewsCarousel({ testimonials }: CustomerReviewsCarouselProps) {
    // Use provided testimonials or fall back to defaults
    const reviews = testimonials && testimonials.length > 0 ? testimonials : defaultReviews;

    // Duplicate reviews to create infinite scroll effect
    const duplicatedReviews = [...reviews, ...reviews]

    return (
        <section className="w-full py-24 bg-zinc-50/50 dark:bg-zinc-900/20 overflow-hidden">
            <div className="text-center mb-16 px-6">
                <span className="block text-center text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-sm mb-4">
                    Reviews
                </span>
                <h2 className="font-heading text-4xl font-bold text-zinc-900 dark:text-white mb-4 tracking-tight">
                    Customer Reviews
                </h2>
                <div className="flex items-center justify-center gap-2 text-yellow-500 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                        </svg>
                    ))}
                </div>
                <p className="text-zinc-500">Based on 124 reviews</p>
            </div>

            {/* Auto-Scrolling Marquee */}
            <div className="relative w-full overflow-hidden mask-gradient-x">
                {/* Gradient Masks for smooth fade edges */}
                <div className="absolute left-0 top-0 bottom-0 z-10 w-24 bg-gradient-to-r from-white dark:from-zinc-950 to-transparent pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 z-10 w-24 bg-gradient-to-l from-white dark:from-zinc-950 to-transparent pointer-events-none" />

                {/* Custom CSS for infinite scroll with pause */}
                <style jsx>{`
                    @keyframes scroll {
                        from { transform: translateX(0); }
                        to { transform: translateX(-50%); }
                    }
                    .animate-infinite-scroll {
                        animation: scroll 40s linear infinite;
                    }
                    .animate-infinite-scroll:hover {
                         animation-play-state: paused;
                    }
                `}</style>
                <div
                    className="flex gap-8 w-max px-8 animate-infinite-scroll"
                >
                    {duplicatedReviews.map((review, index) => (
                        <div
                            key={`${review.id}-${index}`}
                            className="w-[350px] md:w-[450px] bg-white dark:bg-zinc-900/80 p-8 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800 flex-shrink-0 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                        >
                            <div className="flex gap-1 text-yellow-500 mb-4">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-4 h-4 ${i < review.rating ? 'opacity-100' : 'opacity-30'}`}>
                                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                    </svg>
                                ))}
                            </div>
                            <h4 className="font-bold text-lg text-zinc-900 dark:text-white mb-2 leading-snug">"{review.text}"</h4>
                            <div className="flex justify-between items-end mt-6">
                                <div>
                                    <p className="font-semibold text-zinc-900 dark:text-white">{review.author}</p>
                                    <p className="text-xs text-zinc-500">{review.role}</p>
                                </div>
                                <span className="text-xs text-zinc-400">{review.date}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
