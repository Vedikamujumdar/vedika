"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { createCheckoutUrl } from "@/lib/shopify"

export type CartItem = {
    variantId: string
    quantity: number
    title: string
    price: string
    image: string
    productTitle: string
}

type CartContextType = {
    items: CartItem[]
    isOpen: boolean
    cartCount: number
    isCheckingOut: boolean
    openCart: () => void
    closeCart: () => void
    addItem: (item: CartItem) => void
    removeItem: (variantId: string) => void
    updateQuantity: (variantId: string, delta: number) => void
    handleCheckout: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [isCheckingOut, setIsCheckingOut] = useState(false)

    // Load from Local Storage on mount
    useEffect(() => {
        const stored = localStorage.getItem("local_cart_items")
        if (stored) {
            try {
                setItems(JSON.parse(stored))
            } catch (e) {
                console.error("Failed to parse cart items", e)
            }
        }
        setMounted(true)
    }, [])

    // Sync to Local Storage whenever items change
    useEffect(() => {
        if (!mounted) return
        localStorage.setItem("local_cart_items", JSON.stringify(items))
    }, [items, mounted])

    const openCart = () => setIsOpen(true)
    const closeCart = () => setIsOpen(false)

    const addItem = (newItem: CartItem) => {
        setItems(current => {
            const existing = current.find(i => i.variantId === newItem.variantId)
            if (existing) {
                return current.map(i =>
                    i.variantId === newItem.variantId
                        ? { ...i, quantity: i.quantity + newItem.quantity }
                        : i
                )
            }
            return [...current, newItem]
        })
        setIsOpen(true)
    }

    const removeItem = (variantId: string) => {
        setItems(current => current.filter(i => i.variantId !== variantId))
    }

    const updateQuantity = (variantId: string, delta: number) => {
        setItems(current =>
            current.map(i => {
                if (i.variantId === variantId) {
                    const newQty = Math.max(1, i.quantity + delta)
                    return { ...i, quantity: newQty }
                }
                return i
            })
        )
    }

    const handleCheckout = async () => {
        if (items.length === 0 || isCheckingOut) return;

        setIsCheckingOut(true);
        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    items: items.map(i => ({
                        variantId: i.variantId,
                        quantity: i.quantity
                    }))
                }),
            });

            const data = await response.json();
            if (data.checkoutUrl) {
                window.location.href = data.checkoutUrl;
            } else {
                throw new Error(data.error || "Failed to get checkout URL");
            }
        } catch (error) {
            console.error("Checkout error:", error);
            alert("Ready to Checkout? We were unable to redirect you directly to the secure checkout page. Please try again or contact support if the issue persists.");
        } finally {
            setIsCheckingOut(false);
        }
    };

    // Computed Properties
    const cartCount = items.reduce((acc, item) => acc + item.quantity, 0)

    return (
        <CartContext.Provider value={{
            items,
            isOpen,
            openCart,
            closeCart,
            addItem,
            removeItem,
            updateQuantity,
            cartCount,
            handleCheckout,
            isCheckingOut
        }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider")
    }
    return context
}
