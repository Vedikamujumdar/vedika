
import { markShopifyOrderAsPaid } from "../lib/shopify";
import cashfree, { getCashfreeConfig } from "../lib/cashfree";
import dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

async function main() {
    // Get Order ID from command line arguments
    const orderId = process.argv[2];

    if (!orderId) {
        console.error("Please provide an Order ID as an argument.");
        console.error("Usage: npx tsx scripts/sync-single-order.ts <ORDER_ID>");
        return;
    }

    console.log(`Starting Sync for Order ID: ${orderId}...`);

    try {
        const cfConfig = getCashfreeConfig();

        // 1. Fetch Order Details from Cashfree
        console.log("Fetching order details from Cashfree...");
        const orderDetails = await cashfree.getOrder(cfConfig, orderId);

        if (!orderDetails.cfOrder) {
            console.error("❌ Order not found in Cashfree.");
            return;
        }

        console.log(`Cashfree Status: ${orderDetails.cfOrder.orderStatus}`);

        if (orderDetails.cfOrder.orderStatus !== "PAID") {
            console.error("❌ Order is NOT PAID. Skipping sync.");
            return;
        }

        // 2. Extract Shopify Order ID
        const orderData = orderDetails.cfOrder as any;
        let shopifyOrderId = orderData.orderTags?.shopify_order_id;

        if (!shopifyOrderId) {
            console.log("⚠️ Shopify Order ID not found in tags. Trying to extract from Order ID...");
            // Format: ORDER_<ShopifyID>_<Timestamp>
            const parts = orderId.split("_");
            if (parts.length >= 2 && parts[0] === "ORDER") {
                shopifyOrderId = parts[1];
            } else {
                console.error("❌ Could not determine Shopify Order ID.");
                return;
            }
        }

        console.log(`Shopify Order ID: ${shopifyOrderId}`);

        // 3. Update Shopify
        // Ensure GID format
        const gid = shopifyOrderId.toString().startsWith("gid://")
            ? shopifyOrderId
            : `gid://shopify/Order/${shopifyOrderId}`;

        console.log(`Marking Shopify Order ${gid} as PAId...`);
        const result = await markShopifyOrderAsPaid(gid);

        if (result) {
            console.log("✅ Order Successfully Marked as Paid in Shopify!");
            console.log("New Status:", result.displayFinancialStatus);
        } else {
            console.error("❌ Failed to update Shopify order.");
        }

    } catch (error: any) {
        console.error("❌ Sync Error:", error.message || error);
    }
}

main();
