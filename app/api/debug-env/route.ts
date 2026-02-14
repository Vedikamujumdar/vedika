import { NextResponse } from "next/server";

export async function GET() {
    const vars = [
        "SHOPIFY_ADMIN_ACCESS_TOKEN",
        "NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN",
        "SHOPIFY_STOREFRONT_ACCESS_TOKEN",
        "CASHFREE_APP_ID",
        "CASHFREE_SECRET_KEY",
        "CASHFREE_ENV",
        "INSTAGRAM_ACCESS_TOKEN",
        "TEST_VAR",
        "VERCEL",
        "VERCEL_ENV",
        "CI",
        "NODE_ENV"
    ];

    const status = vars.reduce((acc, key) => {
        const value = process.env[key];
        acc[key] = value ? `Present (Length: ${value.length})` : "MISSING";
        return acc;
    }, {} as Record<string, string>);

    return NextResponse.json({
        message: "Environment Variable Diagnostic (v2 - Triggered Build)",
        timestamp: new Date().toISOString(),
        status
    });
}
