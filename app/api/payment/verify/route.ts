import { NextResponse } from "next/server";
import cashfree, { getCashfreeConfig } from "@/lib/cashfree";
import { markShopifyOrderAsPaid } from "@/lib/shopify";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("order_id");

    if (!orderId) {
        return NextResponse.redirect(new URL("/checkout?error=Invalid+Order", req.url));
    }

    try {
        const cfConfig = getCashfreeConfig();

        // 1. Get Order Details to find Shopify ID
        const orderDetails = await cashfree.getOrder(cfConfig, orderId);

        if (!orderDetails || !orderDetails.cfOrder) {
            throw new Error("Order not found");
        }

        // 2. Check Payment Status
        // We can also check getPaymentsForOrder(orderId) to be sure
        // But orderDetails.cfOrder.orderStatus should be PAID

        if (orderDetails.cfOrder.orderStatus === "PAID") {
            // 3. Mark Shopify Order as PAID
            const orderData = orderDetails.cfOrder as any;
            const shopifyOrderId = orderData.orderTags?.shopify_order_id;
            if (shopifyOrderId) {
                // Format: gid://shopify/Order/12345 or just 12345
                // markShopifyOrderAsPaid handles numeric ID if we pass it as GID format?
                // The function expects a GID usually for mutation.
                // But wait, orderMarkAsPaid input.id expects GID.
                // In create-order we split it: shopifyOrderId = shopifyOrder.id.split("/").pop();
                // So we stored numeric ID.
                // We need to reconstruct GID.
                const gid = `gid://shopify/Order/${shopifyOrderId}`;
                await markShopifyOrderAsPaid(gid);
            }

            // 4. Redirect to Success Page
            // We can pass shopify order ID to show details
            return NextResponse.redirect(new URL(`/order-success?id=${shopifyOrderId}`, req.url));
        } else {
            // Payment Pending or Failed
            return NextResponse.redirect(new URL("/checkout?error=Payment+Failed+or+Pending", req.url));
        }

    } catch (error: any) {
        console.error("Payment Verification Error:", error);
        return NextResponse.redirect(new URL("/checkout?error=Verification+Error", req.url));
    }
}
