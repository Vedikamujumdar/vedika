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

                    {/* Right Column: Order Summary */}
                    <div>
                        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 sticky top-24">
                            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
                                {items.map((item) => (
                                    <div key={item.variantId} className="flex gap-4">
                                        <div className="relative w-16 h-16 bg-zinc-100 rounded-lg overflow-hidden shrink-0">
                                            <Image
                                                src={item.image} alt={item.title} fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-sm line-clamp-2">{item.productTitle}</h4>
                                            <p className="text-xs text-zinc-500 mt-1">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="font-semibold text-sm">
                                            ₹{Number(item.price) * item.quantity}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-zinc-500">Subtotal</span>
                                    <span>₹{subtotal}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-zinc-500">Shipping</span>
                                    <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                                </div>
                                <div className="flex justify-between items-center text-lg font-bold pt-2">
                                    <span>Total</span>
                                    <span>₹{total}</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                form="checkout-form"
                                disabled={loading}
                                className="w-full mt-6 bg-black text-white dark:bg-white dark:text-black py-4 rounded-full font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Processing..." : `Pay ₹${total}`}
                            </button>

                            <p className="text-xs text-center text-zinc-400 mt-4">
                                Secure payments by Cashfree.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
