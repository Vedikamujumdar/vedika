
import Link from "next/link"

export function BrandStorySection() {
    return (
        <section className="py-24 md:py-32 bg-bg-secondary px-6">
            <div className="max-w-3xl mx-auto text-center">
                <span className="block text-xs font-bold tracking-[0.2em] text-accent uppercase mb-6">
                    Our Philosophy
                </span>
                <h2 className="text-4xl md:text-5xl font-heading font-medium text-foreground mb-8 leading-tight">
                    Clean Eating, <br /> Thoughtfully Crafted.
                </h2>
                <p className="text-lg md:text-xl text-text-muted leading-relaxed mb-10 font-light">
                    We believe nutrition shouldn't be complicated. Clean Crate is a modern functional food brand
                    dedicated to creating taste-first staples for your everyday life.
                    No fillers, no artificial nonsense—just pure, high-performance ingredients designed to
                    fuel your ambition and respect your body.
                </p>
                <Link
                    href="/#about"
                    className="inline-block border-b border-foreground text-foreground pb-0.5 text-sm font-semibold uppercase tracking-wide hover:text-accent hover:border-accent transition-all"
                >
                    Read Our Story
                </Link>
            </div>
        </section>
    )
}
