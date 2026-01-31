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
    checkoutUrl: string
    cartCount: number
    openCart: () => void
    closeCart: () => void
    addItem: (item: CartItem) => void
    removeItem: (variantId: string) => void
    updateQuantity: (variantId: string, delta: number) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [mounted, setMounted] = useState(false)

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

    // Computed Properties
    const cartCount = items.reduce((acc, item) => acc + item.quantity, 0)

    // Generate Permalink using the helper
    const checkoutUrl = createCheckoutUrl(items.map(i => ({
        variantId: i.variantId,
        quantity: i.quantity
    })))

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
            checkoutUrl
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
