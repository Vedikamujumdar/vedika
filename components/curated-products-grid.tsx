import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import { getProducts } from "@/lib/shopify"

export async function CuratedProductsGrid() {
    const products = await getProducts();

    if (!products || products.length === 0) return null;

    return (
        <section className="py-24 bg-background">
            <div className="container-wide mx-auto max-w-7xl px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-12 gap-4 text-center md:text-left">
                    <h2 className="text-3xl md:text-5xl font-heading text-foreground">Our Collection</h2>
                    <Link href="/products" className="hidden md:flex items-center gap-2 text-sm font-semibold uppercase tracking-wide border-b border-foreground pb-0.5 hover:text-accent transition-colors">
                        View All Products <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((item: any) => {
                        const product = item.node;
                        const image = product.images?.edges?.[0]?.node;
                        const price = product.priceRange?.minVariantPrice;

                        return (
                            <div key={product.id} className="group relative w-full aspect-[3/4] overflow-hidden bg-zinc-100 dark:bg-zinc-800 rounded-2xl">
                                <Link href={`/products/${product.handle}`} className="block w-full h-full">
                                    {image ? (
                                        <Image
                                            src={image.url}
                                            alt={image.altText || product.title}
                                            fill
                                            className="object-cover object-center transition-transform duration-700 ease-in-out group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-zinc-400">
                                            No Image
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 md:opacity-0 md:group-hover:opacity-40 transition-opacity duration-500" />

                                    <div className="absolute bottom-6 left-6 right-6">
                                        <h3 className="text-2xl font-bold text-white md:text-zinc-900 md:dark:text-white md:group-hover:text-white transition-colors duration-300 mb-1">
                                            {product.title}
                                        </h3>
                                        <p className="text-white/90 md:text-zinc-600 md:dark:text-zinc-400 md:group-hover:text-white/90 transition-colors duration-300 text-sm mb-4">
                                            {/* Minimal description or price if description is too long */}
                                            {price ? `₹ ${parseFloat(price.amount).toFixed(2)}` : "View Details"}
                                        </p>
                                        <span className="inline-block bg-white text-black px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wide opacity-100 md:opacity-0 md:translate-y-4 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-500">
                                            Shop Now
                                        </span>
                                    </div>
                                </Link>
                            </div>
                        )
                    })}
                </div>

                <div className="mt-8 text-center md:hidden">
                    <Link href="/products" className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide border-b border-foreground pb-0.5">
                        View All Products <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    )
}
