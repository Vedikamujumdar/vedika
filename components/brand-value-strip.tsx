
import { Check } from "lucide-react"

const VALUES = [
    "Clean Ingredients",
    "High Protein",
    "Zero Added Sugar",
    "No Preservatives",
    "Everyday Nutrition"
]

export function BrandValueStrip() {
    return (
        <section className="border-y border-border bg-background py-6">
            <div className="container-wide">
                <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3 md:justify-around">
                    {VALUES.map((value, index) => (
                        <div key={index} className="flex items-center gap-3">
                            {/* Optional: Minimal check icon or just text. Using text + divider approach for cleanest look */}
                            <span className="text-sm md:text-base font-medium text-muted-foreground uppercase tracking-widest">
                                {value}
                            </span>
                            {index !== VALUES.length - 1 && (
                                <span className="hidden md:block h-4 w-px bg-border/80" aria-hidden="true" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
