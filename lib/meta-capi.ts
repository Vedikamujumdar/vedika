/**
 * Meta Conversions API (CAPI) Utility
 * 
 * Server-side event tracking for Meta Pixel.
 * This sends events directly from the server to Meta, bypassing ad blockers
 * and browser restrictions for much more accurate tracking.
 * 
 * Requirements:
 * - META_PIXEL_ID in .env.local
 * - META_CAPI_ACCESS_TOKEN in .env.local (generate from Meta Events Manager)
 */

import crypto from "crypto";

const PIXEL_ID = process.env.META_PIXEL_ID || "737709785946835";
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN || "";
const API_VERSION = "v19.0";
const ENDPOINT = `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events`;

interface CAPIUserData {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    clientIpAddress?: string;
    clientUserAgent?: string;
    fbp?: string; // _fbp cookie value
    fbc?: string; // _fbc cookie value
}

interface CAPIEventData {
    eventName: string;
    eventTime?: number; // Unix timestamp
    eventSourceUrl?: string;
    actionSource?: "website" | "app" | "email" | "phone_call" | "chat" | "physical_store" | "system_generated" | "other";
    userData: CAPIUserData;
    customData?: Record<string, any>;
    eventId?: string; // For deduplication with browser pixel
}

/**
 * Hash a value using SHA-256 (required by Meta CAPI)
 * Meta requires PII to be hashed before sending
 */
function hashValue(value: string): string {
    return crypto
        .createHash("sha256")
        .update(value.trim().toLowerCase())
        .digest("hex");
}

/**
 * Prepare user data — hash PII fields as required by Meta
 */
function prepareUserData(userData: CAPIUserData): Record<string, any> {
    const prepared: Record<string, any> = {};

    if (userData.email) prepared.em = [hashValue(userData.email)];
    if (userData.phone) prepared.ph = [hashValue(userData.phone)];
    if (userData.firstName) prepared.fn = [hashValue(userData.firstName)];
    if (userData.lastName) prepared.ln = [hashValue(userData.lastName)];
    if (userData.city) prepared.ct = [hashValue(userData.city)];
    if (userData.state) prepared.st = [hashValue(userData.state)];
    if (userData.zip) prepared.zp = [hashValue(userData.zip)];
    if (userData.country) prepared.country = [hashValue(userData.country)];

    // These are NOT hashed
    if (userData.clientIpAddress) prepared.client_ip_address = userData.clientIpAddress;
    if (userData.clientUserAgent) prepared.client_user_agent = userData.clientUserAgent;
    if (userData.fbp) prepared.fbp = userData.fbp;
    if (userData.fbc) prepared.fbc = userData.fbc;

    return prepared;
}

/**
 * Send a server-side event to Meta Conversions API
 * 
 * Usage:
 * ```
 * await sendCAPIEvent({
 *     eventName: "Purchase",
 *     eventSourceUrl: "https://www.thecleancratefoods.com/order-success",
 *     userData: { email: "user@example.com", phone: "9876543210" },
 *     customData: { currency: "INR", value: 599 },
 *     eventId: "unique-event-id-123" // Use same ID as browser event for dedup
 * });
 * ```
 */
export async function sendCAPIEvent(event: CAPIEventData): Promise<boolean> {
    if (!ACCESS_TOKEN) {
        console.warn("[Meta CAPI] Access token not configured. Skipping server-side event:", event.eventName);
        return false;
    }

    const payload = {
        data: [
            {
                event_name: event.eventName,
                event_time: event.eventTime || Math.floor(Date.now() / 1000),
                event_source_url: event.eventSourceUrl,
                action_source: event.actionSource || "website",
                event_id: event.eventId,
                user_data: prepareUserData(event.userData),
                custom_data: event.customData,
            },
        ],
    };

    try {
        const response = await fetch(`${ENDPOINT}?access_token=${ACCESS_TOKEN}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok) {
            console.error("[Meta CAPI] Error:", result);
            return false;
        }

        console.log(`[Meta CAPI] ✓ ${event.eventName} event sent successfully. Events received: ${result.events_received}`);
        return true;
    } catch (error) {
        console.error("[Meta CAPI] Failed to send event:", error);
        return false;
    }
}

/**
 * Convenience: Send a Purchase event via CAPI
 * Typically called from the Cashfree webhook after payment confirmation
 */
export async function sendCAPIPurchaseEvent(options: {
    orderId: string;
    amount: number;
    currency?: string;
    customerEmail?: string;
    customerPhone?: string;
    customerFirstName?: string;
    customerLastName?: string;
    items?: Array<{ id: string; quantity: number }>;
    clientIpAddress?: string;
    clientUserAgent?: string;
    sourceUrl?: string;
}): Promise<boolean> {
    return sendCAPIEvent({
        eventName: "Purchase",
        eventSourceUrl: options.sourceUrl || "https://www.thecleancratefoods.com/order-success",
        eventId: `purchase_${options.orderId}`, // For deduplication
        userData: {
            email: options.customerEmail,
            phone: options.customerPhone,
            firstName: options.customerFirstName,
            lastName: options.customerLastName,
            country: "in",
        },
        customData: {
            currency: options.currency || "INR",
            value: options.amount,
            content_ids: options.items?.map((i) => i.id),
            contents: options.items?.map((i) => ({
                id: i.id,
                quantity: i.quantity,
            })),
            content_type: "product",
            order_id: options.orderId,
            num_items: options.items?.reduce((acc, i) => acc + i.quantity, 0) || 1,
        },
    });
}
