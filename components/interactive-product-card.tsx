"use client"

import * as React from "react"
import { motion, useMotionValue, useTransform, useSpring, PanInfo } from "framer-motion"
import Image from "next/image"
import { Product3DModal } from "@/components/product-3d-modal"

export function InteractiveProductCard() {
    // Rotation state
    const x = useMotionValue(0)
    const y = useMotionValue(0)

    // Interaction state
    const [isDragging, setIsDragging] = React.useState(false)
    const [isFlipped, setIsFlipped] = React.useState(false)
    const [isModalOpen, setIsModalOpen] = React.useState(false)

    // Smooth rotation spring
    const rotateX = useSpring(useTransform(y, [-100, 100], [0, 0]), { stiffness: 400, damping: 30 }) // Minimal X tilt
    const rotateY = useSpring(useTransform(x, [-100, 100], [-25, 25]), { stiffness: 400, damping: 30 })

    // Auto-rotate 180 degrees if flipped
    const rotationY = useTransform(x, (currentX) => {
        // Base rotation from drag
        const dragRotation = (currentX / 300) * 180;
        return isFlipped ? dragRotation + 180 : dragRotation;
    })

    // Smooth spring for the actual CSS transform
    const smoothRotateY = useSpring(rotationY, { stiffness: 200, damping: 20 })

    function handleDragEnd(event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
        setIsDragging(false)
        // If dragged enough, toggle flip state
        if (Math.abs(info.offset.x) > 100) {
            setIsFlipped(!isFlipped)
        }
        // Reset drag w/o toggle if just a small nudge, but we rely on state for permanent flip
        x.set(0)
        y.set(0)
    }

    return (
        <>
            <div className="relative w-full aspect-square perspective-1000 group cursor-grab active:cursor-grabbing text-center">

                <p className="absolute -top-8 left-0 right-0 text-xs text-zinc-400 font-medium animate-pulse">
                    Drag to rotate • Click to view in 3D
                </p>

                <motion.div
                    className="w-full h-full relative preserve-3d"
                    style={{
                        rotateY: smoothRotateY,
                        rotateX: 0,
                        cursor: 'grab'
                    }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    dragElastic={0.6}
                    onDragStart={() => setIsDragging(true)}
                    onDragEnd={handleDragEnd}
                    onClick={() => {
                        if (!isDragging) {
                            setIsModalOpen(true)
                        }
                    }}
                    whileTap={{ cursor: "grabbing" }}
                >
                    {/* Front Face */}
                    <div
                        className="absolute inset-0 backface-hidden flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 rounded-3xl overflow-hidden shadow-xl"
                        style={{ backfaceVisibility: 'hidden' }}
                    >
                        <Image
                            src="/pousht-pop-oats.jpg"
                            alt="Product Front"
                            fill
                            className="object-cover pointer-events-none"
                            priority
                        />
                        {/* Gloss/Reflection effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                        {/* 3D Icon Badge */}
                        <div className="absolute bottom-4 right-4 bg-black/80 text-white p-2 rounded-full backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                            </svg>
                        </div>
                    </div>

                    {/* Back Face */}
                    <div
                        className="absolute inset-0 backface-hidden flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 rounded-3xl overflow-hidden shadow-xl"
                        style={{
                            transform: "rotateY(180deg)",
                            backfaceVisibility: 'hidden'
                        }}
                    >
                        <Image
                            src="/pousht-pop-oats.jpg"
                            alt="Product Back"
                            fill
                            className="object-cover pointer-events-none"
                            priority
                        />
                        {/* Gloss/Reflection effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                </motion.div>

                {/* 3D Platform Shadow */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-1/2 h-4 bg-black/20 dark:bg-white/10 blur-xl rounded-full transform scale-y-50" />
            </div>

            <Product3DModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    )
}
