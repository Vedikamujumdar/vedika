import fs from 'fs';
import path from 'path';

// Manually load env vars FIRST
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach((line) => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            const value = match[2].trim().replace(/^["']|["']$/g, '');
            process.env[key] = value;
        }
    });
    console.log("Env vars loaded. Token present:", !!process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN);
} else {
    console.warn("Warning: .env.local file not found.");
}

async function run() {
    console.log("Starting checkout test...");

    // Dynamic import AFTER env vars are loaded
    const { createStorefrontCheckout } = await import('@/lib/storefront');

    // A mock item
    const items = [
        {
            variantId: "gid://shopify/ProductVariant/59037374054481",
            quantity: 1
        }
    ];

    try {
        const url = await createStorefrontCheckout(items);
        console.log("---------------------------------------------------");
        console.log("SUCCESS: Checkout URL generated:");
        console.log(url);
        console.log("---------------------------------------------------");

        if (url.includes('/cart/c/')) {
            console.log("VERIFIED: URL format indicates a Storefront Cart checkout (Correct).");
        } else if (url.includes('/checkouts/cn/') || url.includes('/checkouts/co/')) {
            console.log("VERIFIED: URL format indicates a Storefront Checkout (Acceptable).");
        } else {
            console.log("WARNING: URL format suggests permalink or other method. Check if this is intended.");
        }

    } catch (error) {
        console.error("FAILED: Checkout creation error:", error);
    }
}

run();
