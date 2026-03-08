"use client";

import { useEffect } from "react";
import { fbqTrack } from "@/components/meta-pixel";

interface ProductViewTrackerProps {
    productTitle: string;
    productId: string;
    value: number;
    currency: string;
}

/**
 * Client component that fires Meta Pixel ViewContent event on product pages.
 * Drop this into any server-rendered product page.
 */
export function ProductViewTracker({
    productTitle,
    productId,
    value,
    currency,
}: ProductViewTrackerProps) {
    useEffect(() => {
        fbqTrack("ViewContent", {
            content_name: productTitle,
            content_ids: [productId],
            content_type: "product",
            value,
            currency,
        });
    }, [productTitle, productId, value, currency]);

    return null; // This component renders nothing — it's purely for tracking
}
