import { NextResponse } from "next/server";
import { createStorefrontCheckout } from "@/lib/storefront";

export async function POST(req: Request) {
    try {
        const { items } = await req.json();

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                { error: "Items are required" },
                { status: 400 }
            );
        }

        const checkoutUrl = await createStorefrontCheckout(items);

        return NextResponse.json({ checkoutUrl });
    } catch (error: any) {
        console.error("Checkout API Route Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to create checkout" },
            { status: 500 }
        );
    }
}
