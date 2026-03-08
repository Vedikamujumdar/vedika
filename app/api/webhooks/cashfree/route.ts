
import { NextResponse } from "next/server";
import cashfree, { getCashfreeConfig } from "@/lib/cashfree";
import { markShopifyOrderAsPaid } from "@/lib/shopify";
import { sendCAPIPurchaseEvent } from "@/lib/meta-capi";

// IMPORTANT: Cashfree Webhook Verification
// Documentation: https://docs.cashfree.com/docs/webhooks-integration

export async function POST(req: Request) {
    try {
        // 1. Get Raw Body and Signature
        const rawBody = await req.text();
        const signature = req.headers.get("x-webhook-signature") || req.headers.get("x-cashfree-signature");
        const timestamp = req.headers.get("x-webhook-timestamp") || req.headers.get("x-cashfree-timestamp");

        // Note: In production, verify signature here. 
        // For now, we rely on the order status check against Cashfree API which is secure.

        let data;
        try {
            data = JSON.parse(rawBody);
        } catch (e) {
            return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
        }

        // 3. Extract Order ID and Payment Status
        const type = data.type;

        // Check for PAYMENT_SUCCESS_WEBHOOK or manual success status in data
        if (type === "PAYMENT_SUCCESS_WEBHOOK" || data.data?.payment?.payment_status === "SUCCESS") {
            const orderId = data.data?.order?.order_id;

            if (!orderId) {
                console.error("Webhook: Order ID missing in payload");
                return NextResponse.json({ error: "Order ID missing" }, { status: 400 });
            }

            // 4. Verify Payment Status with Cashfree API (Double Check)
            const cfConfig = getCashfreeConfig();
            try {
                const orderDetails = await cashfree.getOrder(cfConfig, orderId);

                if (orderDetails.cfOrder && orderDetails.cfOrder.orderStatus === "PAID") {
                    // 5. Update Shopify Order
                    // We stored shopify_order_id in tags during creation
                    const orderData = orderDetails.cfOrder as any;
                    const orderTags = orderData.orderTags;
                    let shopifyOrderId = orderTags?.shopify_order_id;

                    if (!shopifyOrderId) {
                        // Fallback: Try to extract from Order ID (Format: ORDER_<ShopifyID>_<Timestamp>)
                        const parts = orderId.split("_");
                        if (parts.length >= 2 && parts[0] === "ORDER") {
                            shopifyOrderId = parts[1];
                            console.log(`Webhook: Extracted Shopify ID ${shopifyOrderId} from Order ID ${orderId}`);
                        }
                    }

                    if (shopifyOrderId) {
                        // Ensure GID format
                        const gid = shopifyOrderId.startsWith("gid://")
                            ? shopifyOrderId
                            : `gid://shopify/Order/${shopifyOrderId}`;

                        console.log(`Webhook: Marking Shopify Order ${shopifyOrderId} as PAID`);
                        await markShopifyOrderAsPaid(gid);

                        // Fire Meta CAPI Purchase event (server-to-server)
                        const orderAmount = Number(orderDetails.cfOrder.orderAmount) || 0;
                        sendCAPIPurchaseEvent({
                            orderId: orderId,
                            amount: orderAmount,
                            currency: "INR",
                        }).catch((err) => console.error("Meta CAPI Purchase event failed:", err));

                        return NextResponse.json({ status: "processed", shopify_order_id: shopifyOrderId });
                    } else {
                        console.error("Webhook: Shopify Order ID not found");
                        return NextResponse.json({ error: "Shopify ID missing" }, { status: 400 });
                    }
                } else {
                    console.log(`Webhook: Order ${orderId} is not PAID in Cashfree system. Status: ${orderDetails.cfOrder?.orderStatus}`);
                    return NextResponse.json({ status: "ignored", reason: "Order not paid" });
                }
            } catch (err: any) {
                console.error("Webhook: Failed to verify order with Cashfree", err.message);
                return NextResponse.json({ error: "Failed to verify order" }, { status: 500 });
            }
        }

        return NextResponse.json({ status: "received" });

    } catch (error: any) {
        console.error("Webhook Error:", error);
        return NextResponse.json(
            { error: error.message || "Webhook processing failed" },
            { status: 500 }
        );
    }
}
