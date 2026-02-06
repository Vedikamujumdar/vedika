
import { Star } from "lucide-react"

const TESTIMONIALS = [
    {
        id: 1,
        text: "The mocha oats are a complete game changer. It feels like a cheat meal but fits perfectly into my macros.",
        author: "Sarah J.",
        role: "Verified Buyer"
    },
    {
        id: 2,
        text: "Finally, a functional food brand that understands design and taste. The packaging is beautiful, the product is even better.",
        author: "Davide M.",
        role: "Architect"
    },
    {
        id: 3,
        text: "Clean ingredients, zero bloating, and actually delicious. I keep a jar in my office for busy mornings.",
        author: "Priya K.",
        role: "Yoga Instructor"
    }
]

export function MinimalTestimonials() {
    return (
        <section className="py-24 bg-background">
            <div className="container-wide">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-heading text-foreground mb-4">Trusted by the Community</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {TESTIMONIALS.map((t) => (
                        <div key={t.id} className="bg-bg-secondary p-8 rounded-sm hover:-translate-y-1 transition-transform duration-300">
                            <div className="flex gap-1 mb-6 text-accent">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-current" />
                                ))}
                            </div>
                            <p className="text-lg text-foreground font-medium mb-8 leading-relaxed">
                                &quot;{t.text}&quot;
                            </p>
                            <div>
                                <p className="text-sm font-bold text-foreground">{t.author}</p>
                                <p className="text-xs text-text-muted uppercase tracking-wide mt-1">{t.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
