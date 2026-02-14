import { NextResponse } from "next/server";

export async function GET() {
    const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
    const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;

    if (!adminToken || !domain) {
        return NextResponse.json({
            status: "error",
            message: "Missing credentials in request environment",
            details: {
                hasToken: !!adminToken,
                hasDomain: !!domain
            }
        });
    }

    const URL = `https://${domain}/admin/api/2024-01/shop.json`;

    try {
        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Access-Token": adminToken,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json({
                status: "failed",
                statusCode: response.status,
                error: data.errors || "Unknown error",
                message: "Shopify rejected the credentials."
            });
        }

        return NextResponse.json({
            status: "success",
            shop: data.shop.name,
            domain: data.shop.domain,
            email: data.shop.email,
            message: "Credentials are VALID."
        });

    } catch (error: any) {
        return NextResponse.json({
            status: "error",
            message: "Network or Fetch error",
            error: error.message
        });
    }
}
