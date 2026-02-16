"use client"

export function NewsletterSection() {
    return (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-24">
            <div className="rounded-3xl bg-zinc-900 px-4 sm:px-6 md:px-12 py-14 sm:py-20 text-center text-white">
                <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight sm:text-4xl mb-4">Join the Club</h2>
                <p className="mx-auto max-w-lg text-zinc-400 mb-8 text-sm sm:text-base px-2">
                    Get 15% off your first order and exclusive access to new drops.
                </p>
                <div className="mx-auto flex flex-col sm:flex-row max-w-md gap-3 sm:gap-2 px-2">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="flex-1 rounded-lg border-0 bg-white/10 px-4 py-3 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                    <button className="rounded-lg bg-red-700 px-6 py-3 text-sm font-bold text-white hover:bg-red-800 transition-all shadow-lg shadow-red-700/20 hover:scale-105 whitespace-nowrap">
                        Subscribe
                    </button>
                </div>
            </div>
        </section>
    )
}
