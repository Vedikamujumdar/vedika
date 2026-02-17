import Link from "next/link"
import Image from "next/image"
import { getProducts } from "@/lib/shopify"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "All Products | The Clean Crate",
    description: "Browse our collection of healthy, clean, and delicious food products.",
}

export default async function ProductsPage() {
    const products = await getProducts();

    return (
        <div className="min-h-screen bg-background pt-32 pb-24">
            <div className="container-wide mx-auto max-w-7xl px-6 lg:px-8">
                <div className="flex flex-col items-center justify-center mb-16 text-center">
                    <h1 className="text-4xl md:text-6xl font-heading text-foreground mb-4">All Products</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                        Explore our complete collection of wholesome, preservative-free foods designed to fuel your vibe naturally.
                    </p>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-24">
                        <p className="text-xl text-muted-foreground">No products found.</p>
                    </div>
                ) : (
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
                                                className="object-contain transition-transform duration-700 ease-in-out group-hover:scale-105"
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
                )}
            </div>
        </div>
    )
}
