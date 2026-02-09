"use client"

import { useState, useEffect } from "react"
import { ReviewModal } from "./review-modal"

interface Testimonial {
    id: string | number;
    author: string;
    role: string;
    rating: number;
    text: string;
    date: string;
}

export function CustomerReviewsCarousel() {
    const [reviews, setReviews] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchReviews() {
            try {
                const res = await fetch('/api/testimonials');
                const data = await res.json();
                setReviews(data);
            } catch (error) {
                console.error("Failed to load reviews:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchReviews();
    }, []);

    // Calculate Average Rating
    const averageRating = reviews.length > 0
        ? Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length)
        : 5;

    // Duplicate reviews for infinite scroll
    const duplicatedReviews = [...reviews, ...reviews];

    // State for Review Modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (loading) return <div className="py-24 text-center">Loading reviews...</div>;

    return (
        <section className="py-24 bg-zinc-50 dark:bg-zinc-950 overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
                <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
                    Clean Crate <span className="text-yellow-500">Love</span>
                </h2>

                {/* Star Rating Summary */}
                <div className="flex items-center justify-center gap-2 text-yellow-500 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-6 h-6 ${star <= averageRating ? 'opacity-100' : 'opacity-30'}`}>
                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                        </svg>
                    ))}
                </div>
                <p className="text-zinc-500 mb-8">Based on {reviews.length} reviews</p>

                {/* WRITE A REVIEW BUTTON -> OPENS MODAL */}
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all shadow-sm active:scale-95 group"
                >
                    Write a Review
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                </button>
            </div>

            {/* Carousel */}
            <div className="relative w-full overflow-hidden mask-gradient-x">
                <div className="absolute left-0 top-0 bottom-0 z-10 w-24 bg-gradient-to-r from-white dark:from-zinc-950 to-transparent pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 z-10 w-24 bg-gradient-to-l from-white dark:from-zinc-950 to-transparent pointer-events-none" />

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
                <div className="flex gap-8 w-max px-8 animate-infinite-scroll">
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
                            {review.text && (
                                <h4 className="font-bold text-lg text-zinc-900 dark:text-white mb-2 leading-snug">"{review.text}"</h4>
                            )}
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

            {/* Review Modal */}
            <ReviewModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </section>
    )
}

