"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { InstagramReel } from "@/lib/instagram"
import { FloatingReels } from "@/components/floating-reels"

export function InstagramFeedSection({ reels }: { reels: InstagramReel[] }) {
    const [selectedReelIndex, setSelectedReelIndex] = useState<number | null>(null)

    const handleReelClick = (e: React.MouseEvent, index: number) => {
        e.preventDefault()
        setSelectedReelIndex(index)
    }

    const handleClose = () => setSelectedReelIndex(null)

    const handlePrevious = useCallback(
        (e?: React.MouseEvent) => {
            e?.stopPropagation()
            setSelectedReelIndex((prev) =>
                prev !== null ? (prev > 0 ? prev - 1 : reels.length - 1) : null
            )
        },
        [reels.length]
    )

    const handleNext = useCallback(
        (e?: React.MouseEvent) => {
            e?.stopPropagation()
            setSelectedReelIndex((prev) =>
                prev !== null ? (prev < reels.length - 1 ? prev + 1 : 0) : null
            )
        },
        [reels.length]
    )

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedReelIndex === null) return
            if (e.key === "Escape") handleClose()
            if (e.key === "ArrowLeft") handlePrevious()
            if (e.key === "ArrowRight") handleNext()
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [selectedReelIndex, handlePrevious, handleNext])

    const selectedReel =
        selectedReelIndex !== null ? reels[selectedReelIndex] : null

    // Layout strategy: First item is "Featured" (Vertical), others are standard.
    // We will display a subset of reels for the grid.
    const featuredReel = reels[0];
    const gridReels = reels.slice(1, 7); // Next 6 items

    return (
        <section className="py-24 bg-white dark:bg-zinc-950 relative overflow-hidden">
            {/* Background Floating Reels */}
            <FloatingReels reels={reels} />

            <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">

                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl mb-4 font-heading">
                        From Our Community
                    </h2>
                    <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                        Real people. Real food. Clean eating done right.
                    </p>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[250px] md:auto-rows-[300px]">

                    {/* Featured Vertical Reel (Spans 2 rows, 1 col on mobile, 2 rows 1 col on desktop) */}
                    {featuredReel && (
                        <div
                            onClick={(e) => handleReelClick(e, 0)}
                            className="group relative col-span-2 row-span-2 md:col-span-1 md:row-span-2 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500"
                        >
                            <Image
                                src={featuredReel.media_type === "VIDEO" && featuredReel.thumbnail_url ? featuredReel.thumbnail_url : featuredReel.media_url}
                                alt={featuredReel.caption || "Community Feature"}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            {/* Premium Gradient Overlay */}
                            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* Play Icon */}
                            {featuredReel.media_type === "VIDEO" && (
                                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white pointer-events-none">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M8 5v14l11-7z" /></svg>
                                </div>
                            )}

                            {/* Caption Text */}
                            <div className="absolute bottom-0 left-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                <p className="font-bold text-lg mb-1 line-clamp-2">
                                    {featuredReel.caption || "Clean Cravings ✨"}
                                </p>
                                <span className="text-sm font-medium text-white/80 inline-flex items-center gap-1">
                                    View Reel <span aria-hidden="true">&rarr;</span>
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Standard Grid Items */}
                    {gridReels.map((reel, idx) => {
                        const actualIndex = idx + 1;
                        return (
                            <div
                                key={reel.id}
                                onClick={(e) => handleReelClick(e, actualIndex)}
                                className="group relative col-span-1 row-span-1 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300"
                            >
                                <Image
                                    src={reel.media_type === "VIDEO" && reel.thumbnail_url ? reel.thumbnail_url : reel.media_url}
                                    alt={reel.caption || "Post"}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <p className="text-white text-xs md:text-sm font-semibold px-4 text-center line-clamp-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        {reel.caption?.slice(0, 60)}...
                                    </p>
                                </div>
                                {reel.media_type === "VIDEO" && (
                                    <div className="absolute top-2 right-2 text-white/90 drop-shadow-md">
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M8 5v14l11-7z" /></svg>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* Footer CTA */}
                <div className="mt-16 text-center border-t border-zinc-100 dark:border-zinc-800 pt-12">
                    <p className="text-lg font-medium text-zinc-900 dark:text-white mb-6">
                        Tag <span className="text-blue-600">@cleancrate</span> or <span className="text-blue-600">#CleanCravings</span> to get featured
                    </p>
                    <a
                        href="https://instagram.com/poushtpop"
                        target="_blank"
                        className="inline-flex items-center gap-2 rounded-full bg-zinc-900 dark:bg-zinc-100 px-8 py-4 text-sm font-bold text-white dark:text-black shadow-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all hover:scale-105"
                    >
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                        Follow us on Instagram
                    </a>
                </div>

            </div>

            {/* Modal remains unchanged */}
            <AnimatePresence>
                {selectedReel && (
                    <motion.div
                        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                    >
                        {/* Close Button */}
                        <button className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors z-50">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div
                            className="relative w-full max-w-5xl h-full flex flex-col md:flex-row bg-black rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Media Side */}
                            <div className="flex-1 bg-zinc-900 relative flex items-center justify-center h-[50vh] md:h-full">
                                <Image
                                    src={selectedReel.media_type === "VIDEO" && selectedReel.thumbnail_url ? selectedReel.thumbnail_url : selectedReel.media_url}
                                    alt={selectedReel.caption || "Instagram post"}
                                    fill
                                    className="object-contain"
                                />
                            </div>

                            {/* Details Side */}
                            <div className="w-full md:w-[400px] bg-white dark:bg-zinc-900 p-6 flex flex-col h-[50vh] md:h-full overflow-y-auto border-l border-zinc-800">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">CC</div>
                                    <div>
                                        <p className="font-bold text-zinc-900 dark:text-white text-sm">cleancrate</p>
                                        <p className="text-xs text-zinc-500">Original Audio</p>
                                    </div>
                                    <a href={selectedReel.permalink} target="_blank" className="ml-auto text-blue-500 text-sm font-medium hover:underline">View on IG</a>
                                </div>

                                <p className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed mb-6 whitespace-pre-wrap">
                                    {selectedReel.caption || "No caption provided."}
                                </p>

                                <div className="mt-auto border-t border-zinc-100 dark:border-zinc-800 pt-4">
                                    <div className="flex gap-4 mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-zinc-900 dark:text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-zinc-900 dark:text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" /></svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-zinc-900 dark:text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.126A59.768 59.768 0 0 1 21.485 12 59.77 59.77 0 0 1 3.27 20.876L5.999 12Zm0 0h7.5" /></svg>
                                    </div>
                                    <p className="text-xs text-zinc-400 uppercase tracking-wide">3 days ago</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    )
}
