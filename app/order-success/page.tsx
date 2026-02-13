"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useCart } from "@/context/cart-context";

function OrderSuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("id");
    const { items } = useCart();

    useEffect(() => {
        if (orderId) {
            localStorage.removeItem("local_cart_items");
        }
    }, [orderId]);

    return (
        <div className="w-full max-w-md bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto text-green-600 dark:text-green-400">
                <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
                <h1 className="text-2xl font-bold font-heading">Order Placed Successfully!</h1>
                <p className="text-zinc-500 dark:text-zinc-400">
                    Thank you for your purchase. Your order #{orderId} has been confirmed.
                </p>
            </div>

            <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800">
                <Link
                    href="/"
                    className="block w-full bg-black text-white dark:bg-white dark:text-black py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
                >
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4">
            <Suspense fallback={<div>Loading...</div>}>
                <OrderSuccessContent />
            </Suspense>
        </div>
    );
}
