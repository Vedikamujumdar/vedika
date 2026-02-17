"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/cart-context";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { load } from "@cashfreepayments/cashfree-js";

export default function CheckoutPage() {
    const { items, cartCount } = useCart();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zip: "",
    });

    // Calculate totals
    // Assuming fixed shipping for now or free over X
    const subtotal = items.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);
    const shipping = subtotal > 1500 ? 0 : 99; // Example logic
    const total = subtotal + shipping;

    useEffect(() => {
        // Wait for hydration/mounting before checking items
        // We can check if window / document is defined, but best is if context gives us a flag
        // Let's assume passed mounted from context or just simple timeout/check

        // Actually, better to use the mounted flag from context if available, 
        // or just wait for client side mount.

        const timeout = setTimeout(() => {
            if (items.length === 0) {
                router.push("/");
            }
        }, 500); // Give it a moment to load from local storage

        return () => clearTimeout(timeout);
    }, [items, router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Create Order on Backend
            const response = await fetch("/api/payment/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items,
                    customer: formData,
                    total
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to initiate payment");
            }

            // 2. Load Cashfree SDK
            const cashfree = await load({
                mode: "production", // or "sandbox"
            });

            // 3. Initiate Checkout
            const checkoutOptions = {
                paymentSessionId: data.paymentSessionId,
                returnUrl: `${window.location.origin}/api/payment/verify?order_id=${data.orderId}`,
            };

            await cashfree.checkout(checkoutOptions);

        } catch (error: any) {
            console.error("Payment Error:", error);
            alert(error.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) return null;

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold font-heading mb-8 text-center sm:text-left">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Column: Shipping Form */}
                    <div className="space-y-8">
                        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800">
                            <h2 className="text-xl font-semibold mb-6">Shipping Details</h2>
                            <form id="checkout-form" onSubmit={handlePayment} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">First Name</label>
                                        <input
                                            required name="firstName" placeholder="John"
                                            className="w-full p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent"
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Last Name</label>
                                        <input
                                            required name="lastName" placeholder="Doe"
                                            className="w-full p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent"
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email</label>
                                    <input
                                        required type="email" name="email" placeholder="john@example.com"
                                        className="w-full p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent"
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Phone</label>
                                    <input
                                        required type="tel" name="phone" placeholder="9876543210"
                                        className="w-full p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent"
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Address</label>
                                    <input
                                        required name="address" placeholder="123 Main St, Apt 4B"
                                        className="w-full p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent"
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">City</label>
                                        <input
                                            required name="city" placeholder="Mumbai"
                                            className="w-full p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent"
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">State</label>
                                        <input
                                            required name="state" placeholder="MH"
                                            className="w-full p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent"
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Zip</label>
                                        <input
                                            required name="zip" placeholder="400001"
                                            className="w-full p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent"
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right Column: Order Summary & Payment */}
                    <div className="space-y-8">
                        {/* Order Summary */}
                        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 sticky top-24">
                            <h2 className="text-xl font-bold font-heading mb-6">Price Summary</h2>

                            {/* Items List */}
                            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {items.map((item) => (
                                    <div key={item.variantId} className="flex gap-4 group">
                                        <div className="relative w-16 h-16 bg-zinc-50 rounded-lg overflow-hidden shrink-0 border border-zinc-100">
                                            <Image
                                                src={item.image} alt={item.title} fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-sm line-clamp-2 text-zinc-900 dark:text-zinc-100">{item.productTitle}</h4>
                                            <p className="text-xs text-zinc-500 mt-1">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                                            ₹{Number(item.price) * item.quantity}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-zinc-500">Subtotal</span>
                                    <span className="font-medium">₹{subtotal}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-zinc-500">Shipping</span>
                                    <span className="text-green-600 font-medium">{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                                </div>
                                <div className="flex justify-between items-center text-lg font-bold pt-2 border-t border-dashed border-zinc-200 dark:border-zinc-700 mt-2">
                                    <span>Total</span>
                                    <span>₹{total}</span>
                                </div>
                            </div>

                            {/* Payment Method Selection UI */}
                            <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                                <h3 className="text-sm font-semibold mb-3 text-zinc-900 dark:text-white">Payment Method</h3>
                                <div className="border border-blue-600/30 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl p-4 relative overflow-hidden">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5">
                                            <div className="w-4 h-4 rounded-full border-[5px] border-blue-600 bg-white" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm text-zinc-900 dark:text-white flex items-center justify-between">
                                                Cashfree Payments
                                                {/* Payment Icons Row */}
                                                <div className="flex items-center gap-1.5">
                                                    {/* UPI */}
                                                    <span className="h-5 px-1.5 bg-white rounded border border-zinc-200 flex items-center justify-center text-[9px] font-bold text-green-700 tracking-tight">UPI</span>
                                                    {/* Visa */}
                                                    <span className="h-5 px-1.5 bg-white rounded border border-zinc-200 flex items-center justify-center">
                                                        <svg viewBox="0 0 48 16" className="h-3 w-auto" fill="none">
                                                            <path d="M19.2 1.6L12.8 14.4H8.8L5.6 4.4C5.4 3.6 5.2 3.4 4.6 3C3.6 2.4 2 1.8 0.6 1.6L0.8 1.2H7.6C8.6 1.2 9.4 1.8 9.6 3L11.2 11.2L15 1.6H19.2ZM34 10.8L36 1.6H40L38 14.4H34L34 10.8ZM32 1.6L28.4 14.4H24.4L28 1.6H32ZM46.4 10.4L47.2 6.8L44 1.6H48L46.4 10.4Z" fill="#1A1F71" />
                                                        </svg>
                                                    </span>
                                                    {/* Mastercard */}
                                                    <span className="h-5 px-1 bg-white rounded border border-zinc-200 flex items-center justify-center">
                                                        <svg viewBox="0 0 24 16" className="h-3.5 w-auto" fill="none">
                                                            <circle cx="9" cy="8" r="7" fill="#EB001B" opacity="0.9" />
                                                            <circle cx="15" cy="8" r="7" fill="#F79E1B" opacity="0.9" />
                                                            <path d="M12 2.8a7 7 0 0 1 0 10.4 7 7 0 0 1 0-10.4z" fill="#FF5F00" />
                                                        </svg>
                                                    </span>
                                                    {/* +more */}
                                                    <span className="h-5 w-6 bg-zinc-100 border border-zinc-200 rounded flex items-center justify-center text-[8px] font-bold text-zinc-500">+4</span>
                                                </div>
                                            </p>
                                            <p className="text-xs text-zinc-500 mt-1">UPI, Cards, Wallets, NetBanking</p>
                                        </div>
                                    </div>
                                    <div className="mt-3 text-xs text-blue-700 dark:text-blue-300 bg-blue-100/50 dark:bg-blue-900/30 p-2 rounded-lg text-center">
                                        You'll be redirected to Cashfree to complete your purchase securely.
                                    </div>
                                </div>
                            </div>

                            {/* Pay Button */}
                            <button
                                type="submit"
                                form="checkout-form"
                                disabled={loading}
                                className="w-full mt-6 bg-zinc-900 text-white dark:bg-white dark:text-black py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 group"
                            >
                                {loading ? (
                                    <>Processing...</>
                                ) : (
                                    <>
                                        Pay ₹{total}
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                        </svg>
                                    </>
                                )}
                            </button>

                            {/* Trust Badges */}
                            <div className="mt-6 flex items-center justify-center gap-2 text-zinc-500 text-xs">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-green-600">
                                    <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08Zm3.094 8.016a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                </svg>
                                <span className="font-medium">100% Secured Payments</span>
                            </div>

                            <div className="mt-3 flex justify-center gap-3 opacity-60 grayscale hover:grayscale-0 transition-all">
                                {/* Generic visual representation of payment methods using simple SVGs can go here if needed, but the top section covers it */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
