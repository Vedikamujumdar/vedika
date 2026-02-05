"use client"

import * as React from "react"
import { useCart } from "@/context/cart-context"
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"
import Image from "next/image"

export function CartDrawer() {
    const { items, isOpen, closeCart, removeItem, updateQuantity, handleCheckout, isCheckingOut } = useCart()

    // Calculate Subtotal
    const subtotal = items.reduce((acc, item) => {
        return acc + (Number(item.price) * item.quantity)
    }, 0)

    // Prevent scrolling when cart is open
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "unset"
        }
        return () => {
            document.body.style.overflow = "unset"
        }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={closeCart}
            />

            {/* Drawer */}
            <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl animate-in slide-in-from-right duration-500 ease-out flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800">
                    <h2 className="text-xl font-bold font-heading">Your Cart</h2>
                    <button
                        onClick={closeCart}
                        className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                            <div className="p-4 rounded-full bg-zinc-100 dark:bg-zinc-800">
                                <ShoppingBag className="w-8 h-8 opacity-50" />
                            </div>
                            <div>
                                <p className="font-medium text-lg">Your cart is empty</p>
                                <p className="text-sm text-zinc-500">Looks like you haven't added anything yet.</p>
                            </div>
                            <button
                                onClick={closeCart}
                                className="mt-4 text-blue-600 font-medium hover:underline"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.variantId} className="flex gap-4">
                                <div className="relative w-24 h-24 bg-zinc-50 dark:bg-zinc-800 rounded-xl overflow-hidden shrink-0 border border-zinc-100 dark:border-zinc-800">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div>
                                        <h3 className="font-semibold text-zinc-900 dark:text-white line-clamp-2">
                                            {item.productTitle}
                                        </h3>
                                        <div className="flex items-center justify-between mt-1">
                                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                                ₹{item.price}
                                            </p>
                                            <button
                                                onClick={() => removeItem(item.variantId)}
                                                className="text-red-500 hover:bg-red-50 p-1 rounded transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 mt-2">
                                        <div className="flex items-center border border-zinc-200 dark:border-zinc-700 rounded-lg h-8">
                                            <button
                                                onClick={() => updateQuantity(item.variantId, -1)}
                                                className="px-2 h-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="px-2 text-sm font-medium min-w-[1.5rem] text-center">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.variantId, 1)}
                                                className="px-2 h-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <div className="ml-auto font-bold">
                                            {new Intl.NumberFormat('en-IN', {
                                                style: 'currency',
                                                currency: 'INR'
                                            }).format(Number(item.price) * item.quantity)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-zinc-500">Subtotal</span>
                                <span className="font-semibold">
                                    {new Intl.NumberFormat('en-IN', {
                                        style: 'currency',
                                        currency: 'INR'
                                    }).format(subtotal)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-zinc-500">Shipping</span>
                                <span className="text-zinc-500 text-xs">(Calculated at checkout)</span>
                            </div>
                        </div>
                        <button
                            onClick={handleCheckout}
                            disabled={isCheckingOut}
                            className="flex h-12 w-full items-center justify-center rounded-full bg-zinc-900 text-white font-medium shadow-sm hover:bg-zinc-800 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-all"
                        >
                            {isCheckingOut ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                    Redirecting to Secure Checkout...
                                </div>
                            ) : (
                                "Checkout"
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
