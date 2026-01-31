"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { InstagramReel } from "@/lib/instagram"
import { useState } from "react"

export function FloatingReels({ reels }: { reels: InstagramReel[] }) {
    // Select a subset of reels for floating (e.g. 4 reels)
    const floaters = reels.slice(0, 4)

    // Positions for 4 floating cards (Left/Right gutters)
    const positions = [
        { top: "5%", left: "2%", delay: 0, duration: 8 },
        { top: "60%", left: "5%", delay: 2, duration: 10 },
        { top: "10%", right: "2%", delay: 1, duration: 9 },
        { top: "55%", right: "5%", delay: 3, duration: 11 },
    ]

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden hidden xl:block">
            {floaters.map((reel, idx) => {
                const pos = positions[idx % positions.length]
                return (
                    <FloatingCard
                        key={`float-${reel.id}`}
                        reel={reel}
                        pos={pos}
                    />
                )
            })}
        </div>
    )
}

function FloatingCard({ reel, pos }: { reel: InstagramReel, pos: any }) {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <motion.div
            className="absolute w-48 aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl border border-white/20 dark:border-white/10 pointer-events-auto cursor-pointer"
            style={{
                top: pos.top,
                left: pos.left,
                right: pos.right
            }}
            initial={{ y: 0 }}
            animate={{
                y: [0, -30, 0],
                rotate: [0, 2, -2, 0]
            }}
            transition={{
                duration: pos.duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: pos.delay
            }}
            whileHover={{ scale: 1.1, zIndex: 10, rotate: 0 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            onClick={() => window.open(reel.permalink, "_blank")}
        >
            <div className={`relative w-full h-full transition-all duration-500 ${isHovered ? 'brightness-110' : 'brightness-90 opacity-80'}`}>
                <Image
                    src={reel.media_type === "VIDEO" && reel.thumbnail_url ? reel.thumbnail_url : reel.media_url}
                    alt={reel.caption || "Floating Reel"}
                    fill
                    className="object-cover"
                />

                {/* Overlay on Hover */}
                <div className={`absolute inset-0 bg-black/40 flex flex-col items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white mb-2">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    <span className="text-white text-xs font-bold">Watch</span>
                </div>
            </div>
        </motion.div>
    )
}
