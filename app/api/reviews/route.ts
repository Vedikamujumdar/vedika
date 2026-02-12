import { NextResponse } from "next/server";

// ============================================
// Shopify Admin API Configuration
// ============================================
const SHOP_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "ufybyf-s9.myshopify.com";
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || "";

// Google Form Fallback
const GOOGLE_FORM_ACTION_URL = "https://docs.google.com/forms/d/e/1FAIpQLSejBS1pA4ddRU_2DMPv1LsJmbzCF9md-CidHUaHOF87ERAK0w/formResponse";
const FIELD_MAPPING = {
    name: "entry.1283266528",
    role: "entry.122595403",
    rating: "entry.1197868331",
    review: "entry.287233578"
};

/**
 * Submit a review via Shopify Admin API (Metaobjects).
 * Falls back to Google Forms if no Admin token is configured.
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { author, role, rating, text } = body;

        if (!author || !rating || !text) {
            return NextResponse.json(
                { error: "Author, rating, and text are required" },
                { status: 400 }
            );
        }

        // ── Primary: Shopify Metaobject ──
        if (ADMIN_TOKEN) {
            return await submitToShopify(author, role || "Customer", rating, text);
        }

        // ── Fallback: Google Forms ──
        console.warn("SHOPIFY_ADMIN_ACCESS_TOKEN not set – falling back to Google Forms");
        return await submitToGoogleForms(author, role || "Customer", rating, text);

    } catch (error: any) {
        console.error("Review API Route Error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

// ============================================
// Shopify Metaobject Submission
// ============================================
async function submitToShopify(author: string, role: string, rating: number, text: string) {
    const mutation = `
        mutation MetaobjectCreate($metaobject: MetaobjectCreateInput!) {
            metaobjectCreate(metaobject: $metaobject) {
                metaobject {
                    handle
                    fields {
                        key
                        value
                    }
                }
                userErrors {
                    field
                    message
                }
            }
        }
    `;

    const today = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    const variables = {
        metaobject: {
            type: "testimonial",
            fields: [
                { key: "author", value: author },
                { key: "role", value: role },
                { key: "rating", value: rating.toString() },
                { key: "text", value: text },
                { key: "date", value: today },
            ],
        },
    };

    const response = await fetch(
        `https://${SHOP_DOMAIN}/admin/api/2024-01/graphql.json`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Access-Token": ADMIN_TOKEN,
            },
            body: JSON.stringify({ query: mutation, variables }),
        }
    );

    const result = await response.json();

    // Check for GraphQL user errors
    const userErrors = result.data?.metaobjectCreate?.userErrors;
    if (userErrors && userErrors.length > 0) {
        console.error("Shopify Metaobject UserErrors:", userErrors);
        return NextResponse.json(
            { error: userErrors.map((e: any) => e.message).join(", ") },
            { status: 422 }
        );
    }

    // Check for top-level API errors
    if (result.errors) {
        console.error("Shopify Admin API Errors:", result.errors);
        return NextResponse.json(
            { error: "Failed to submit review to Shopify" },
            { status: 500 }
        );
    }

    return NextResponse.json({ success: true, source: "shopify" });
}

// ============================================
// Google Forms Fallback
// ============================================
async function submitToGoogleForms(author: string, role: string, rating: number, text: string) {
    const formData = new URLSearchParams();
    formData.append(FIELD_MAPPING.name, author);
    formData.append(FIELD_MAPPING.role, role);
    formData.append(FIELD_MAPPING.rating, rating.toString());
    formData.append(FIELD_MAPPING.review, text);

    const response = await fetch(GOOGLE_FORM_ACTION_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
    });

    if (response.ok) {
        return NextResponse.json({ success: true, source: "google_forms" });
    } else {
        console.error("Google Form Submission Failed:", response.status, response.statusText);
        return NextResponse.json({ error: "Failed to submit to Google Form" }, { status: 500 });
    }
}
