"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/context/cart-context"

import { InteractiveProductCard } from "./interactive-product-card"

interface ProductDetailsSectionProps {
    showViewDetailsLink?: boolean;
    product?: any;
}

export function ProductDetailsSection({ showViewDetailsLink = true, product }: ProductDetailsSectionProps) {
    const { addItem } = useCart()
    const [isAdding, setIsAdding] = React.useState(false)
    const [quantity, setQuantity] = React.useState(1)

    // Fallback data if no product provided (for initial render/dev)
    const title = product?.title || "Ready to eat oats Mocha rush"
    const description = product?.description || "Start your day with the perfect blend of taste and nutrition."
    const price = product?.priceRange?.minVariantPrice?.amount || "110.00"
    const currency = product?.priceRange?.minVariantPrice?.currencyCode || "INR"
    const variantId = product?.variants?.edges[0]?.node?.id
    const availableForSale = product?.availableForSale ?? true

    // Format price
    const formattedPrice = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: currency,
    }).format(Number(price))

    const handleAddToCart = async () => {
        // Fallback for demo if variantId is missing (Use Real ID)
        const activeVariantId = variantId || "59037374054481";
        // Get image URL safely
        const imageUrl = product?.images?.edges?.[0]?.node?.url || "/pousht-pop-oats.jpg";

        console.log("Add to Cart Clicked!", { activeVariantId, quantity });

        setIsAdding(true)
        try {
            await addItem({
                variantId: activeVariantId,
                quantity: quantity,
                title: title,
                price: price,
                image: imageUrl,
                productTitle: title
            })
            console.log("Item added to cart via context");
        } catch (error) {
            console.error("Error adding to cart:", error)
        } finally {
            setIsAdding(false)
        }
    }

    const handleBuyNow = async () => {
        // For now, Buy Now acts like Add to Cart + Redirect (or just Add to Cart and Open)
        // Ideally we would create a new checkout URL here.
        // For simplicity in this iteration, we add to cart and open cart.
        await handleAddToCart();
        // The cart drawer opening is handled by addItem inside context usually, or we explicitly open it.
    }

    return (
        <div className="grid grid-cols-1 gap-10 lg:gap-16 lg:grid-cols-2 lg:items-center">
            {/* Mobile Heading (Heading -> Photo -> Text) */}
            <div className="lg:hidden text-center md:text-left">
                <span className="block text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-sm mb-2">
                    Premium Quality
                </span>
                <h2 className="font-heading text-4xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl mb-4">
                    {title}
                </h2>
            </div>

            {/* Product Image Column - 3D Interactive */}
            <div className="w-full max-w-md mx-auto lg:max-w-none">
                <InteractiveProductCard />
            </div>

            {/* Product Info Column */}
            <div>
                {/* Desktop Heading */}
                <div className="hidden lg:block">
                    <span className="block text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-sm mb-2">
                        Premium Quality
                    </span>
                    <h2 className="font-heading text-4xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl mb-4">
                        {title}
                    </h2>
                </div>

                <div className="flex items-center gap-4 mb-2">
                    <span className="text-xl text-zinc-400 line-through decoration-red-500/50">₹ 150.00</span>
                    <span className="text-2xl font-bold text-zinc-900 dark:text-white">{formattedPrice}</span>
                    <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-zinc-900 dark:bg-zinc-800 dark:text-white">
                        Sale
                    </span>
                </div>

                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">
                    <span className="underline decoration-zinc-300 underline-offset-4">Shipping</span> calculated at checkout.
                </p>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-zinc-900 dark:text-white mb-2">Quantity</label>
                    <div className="flex h-12 w-32 items-center justify-between rounded-lg border border-zinc-200 dark:border-zinc-700">
                        <button
                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                            className="flex h-full w-10 items-center justify-center text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-l-lg transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                            </svg>
                        </button>
                        <span className="text-sm font-semibold">{quantity}</span>
                        <button
                            onClick={() => setQuantity(q => q + 1)}
                            className="flex h-full w-10 items-center justify-center text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-r-lg transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={handleAddToCart}
                        disabled={!availableForSale || isAdding}
                        className="flex h-12 w-full items-center justify-center rounded-full border border-zinc-900 text-zinc-900 font-medium transition-colors hover:bg-zinc-50 dark:border-white dark:text-white dark:hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isAdding ? "Adding..." : availableForSale ? "Add to cart" : "Out of stock"}
                    </button>
                    <button
                        onClick={handleBuyNow}
                        disabled={!availableForSale || isAdding}
                        className="flex h-12 w-full items-center justify-center rounded-full bg-zinc-900 text-white font-medium shadow-sm transition-transform hover:scale-[1.01] active:scale-[0.99] dark:bg-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Buy it now
                    </button>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-zinc-100 pt-6 dark:border-zinc-800">
                    <button
                        onClick={() => {
                            if (navigator.share) {
                                navigator.share({
                                    title: title,
                                    text: `Check out ${title}!`,
                                    url: window.location.href,
                                }).catch(console.error);
                            } else {
                                navigator.clipboard.writeText(window.location.href);
                                alert("Link copied to clipboard!");
                            }
                        }}
                        className="flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                        </svg>
                        Share
                    </button>
                    {showViewDetailsLink && (
                        <Link href={`/products/${product?.handle || 'mocha-rush'}`} className="flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors">
                            View full details
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                            </svg>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    )
}
