"use client"

import Image from "next/image"

export function BrandPromiseSection() {
    return (
        <section className="relative w-full h-[600px] flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=1600&auto=format&fit=crop&q=80"
                    alt="Healthy Breakfast Background"
                    fill
                    unoptimized
                    className="object-cover"
                />
            </div>

            {/* Content Box */}
            <div className="relative z-10 max-w-4xl mx-4 lg:mx-auto bg-white/70 dark:bg-black/60 backdrop-blur-xl border border-white/40 dark:border-white/10 p-10 md:p-16 rounded-[2.5rem] shadow-2xl text-center">
                <span className="block text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-sm mb-4">
                    Why Choose Us
                </span>
                <h2 className="font-heading text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-8 drop-shadow-sm">
                    Our Promise to Your Health
                </h2>
                <p className="text-zinc-800 dark:text-zinc-200 text-lg leading-relaxed max-w-2xl mx-auto font-medium">
                    The Clean Crate was born from a simple belief — that healthy eating should be natural, honest, and accessible to everyone.
                    We started our journey with a focus on carefully sourced ingredients and mindful preparation, creating nutritious foods that fit seamlessly into everyday life.
                    Every product we make reflects our commitment to quality, balance, and wellness, ensuring you enjoy food that not only tastes good but also supports a healthier lifestyle.
                    At The Clean Crate, we're not just making food — we're nurturing better habits, one bite at a time.
                </p>
            </div>
        </section>
    )
}
