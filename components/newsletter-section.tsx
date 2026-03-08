"use client"

import { useState } from "react"
import { fbqTrack } from "@/components/meta-pixel"

export function NewsletterSection() {
    const [email, setEmail] = useState("")
    const [status, setStatus] = useState<"idle" | "success">("idle")

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return

        // Fire Meta Pixel Lead event
        fbqTrack("Lead", {
            content_name: "Newsletter Signup",
            content_category: "Newsletter",
        })

        setStatus("success")
        setEmail("")

        // Reset after 3 seconds
        setTimeout(() => setStatus("idle"), 3000)
    }

    return (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-24">
            <div className="rounded-3xl bg-zinc-900 px-4 sm:px-6 md:px-12 py-14 sm:py-20 text-center text-white">
                <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight sm:text-4xl mb-4">Join the Club</h2>
                <p className="mx-auto max-w-lg text-zinc-400 mb-8 text-sm sm:text-base px-2">
                    Get 15% off your first order and exclusive access to new drops.
                </p>
                <form onSubmit={handleSubscribe} className="mx-auto flex flex-col sm:flex-row max-w-md gap-3 sm:gap-2 px-2">
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="flex-1 rounded-lg border-0 bg-white/10 px-4 py-3 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                    <button
                        type="submit"
                        className="rounded-lg bg-red-700 px-6 py-3 text-sm font-bold text-white hover:bg-red-800 transition-all shadow-lg shadow-red-700/20 hover:scale-105 whitespace-nowrap"
                    >
                        {status === "success" ? "Subscribed! ✓" : "Subscribe"}
                    </button>
                </form>
            </div>
        </section>
    )
}
