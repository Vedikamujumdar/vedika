import { NextResponse } from "next/server";
import cashfree, { getCashfreeConfig } from "@/lib/cashfree";
import { CFOrderRequest, CFCustomerDetails } from "cashfree-pg-sdk-nodejs";
import { createShopifyOrder } from "@/lib/shopify";

export async function POST(req: Request) {
    try {
        const { items, customer, total } = await req.json();

        if (!items || !customer || !total) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 1. Create Shopify Order (PENDING)
        // We do this first to reserve inventory and get a valid Order ID
        const shopifyOrder = await createShopifyOrder({
            lineItems: items.map((item: any) => ({
                variantId: item.variantId,
                quantity: item.quantity
            })),
            customer,
            financialStatus: "PENDING",
            paymentId: "PENDING_CASHFREE"
        });

        if (!shopifyOrder) {
            return NextResponse.json({ error: "Failed to create Shopify Order" }, { status: 500 });
        }

        const shopifyOrderId = shopifyOrder.id.split("/").pop(); // Extract numeric ID
        // Cashfree Order ID must be unique. If we retry, we might need a suffix.
        // Format: ORDER_<ShopifyID>_<Timestamp>
        const orderId = `ORDER_${shopifyOrderId}_${Date.now().toString().slice(-4)}`;

        const customerId = `CUST_${Date.now()}`;

        const customerDetails = new CFCustomerDetails();
        customerDetails.customerId = customerId;
        customerDetails.customerPhone = customer.phone;
        customerDetails.customerEmail = customer.email;
        customerDetails.customerName = `${customer.firstName} ${customer.lastName}`;

        const cFOrderRequest = new CFOrderRequest();
        cFOrderRequest.orderAmount = total;
        cFOrderRequest.orderCurrency = "INR";
        cFOrderRequest.customerDetails = customerDetails;
        cFOrderRequest.orderId = orderId;

        // Store Shopify Order ID in tags for retrieval in verify webhook
        const tags: any = {
            "shopify_order_id": shopifyOrderId,
            "shopify_order_name": shopifyOrder.name
        };
        cFOrderRequest.orderTags = tags;

        const cfConfig = getCashfreeConfig();

        const result = await cashfree.orderCreate(
            cfConfig,
            cFOrderRequest
        );

        if (result && result.cfOrder && result.cfOrder.paymentSessionId) {
            return NextResponse.json({
                paymentSessionId: result.cfOrder.paymentSessionId,
                orderId: orderId, // This is Cashfree Order ID
                shopifyOrderId: shopifyOrder.id // Return full GID for client
            });
        } else {
            console.error("Cashfree Order Creation Failed:", result);
            return NextResponse.json({ error: "Failed to create payment session" }, { status: 500 });
        }

    } catch (error: any) {
        console.error("Create Order Error:", error);
        return NextResponse.json(
            { error: error?.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
