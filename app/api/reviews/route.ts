import { NextResponse } from "next/server";

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "cleancrate-8642.myshopify.com";
const apiSecret = process.env.SHOPIFY_API_SECRET || "";

/**
 * POST handler for submitting reviews to Shopify Metaobjects
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { author, role, rating, text, date } = body;

        if (!author || !rating || !text) {
            return NextResponse.json(
                { error: "Author, rating, and text are required" },
                { status: 400 }
            );
        }

        // Shopify Admin API GraphQL Mutation to create a Metaobject
        // This requires the 'testimonial' metaobject definition to exist in Shopify Admin
        const query = `
        mutation CreateMetaobject($metaobject: MetaobjectCreateInput!) {
          metaobjectCreate(metaobject: $metaobject) {
            metaobject {
              id
              handle
            }
            userErrors {
              field
              message
              code
            }
          }
        }
        `;

        const variables = {
            metaobject: {
                type: "testimonial",
                fields: [
                    { key: "author", value: author },
                    { key: "role", value: role || "Verified Buyer" },
                    { key: "rating", value: rating.toString() },
                    { key: "text", value: text },
                    { key: "date", value: date || "Recently" }
                ]
            }
        };

        const URL = `https://${domain}/admin/api/2024-01/graphql.json`;
        const apiKey = process.env.SHOPIFY_API_KEY || "";

        const options = {
            method: "POST",
            headers: {
                "X-Shopify-Access-Token": apiSecret,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query, variables }),
        };

        let response = await fetch(URL, options);

        // Fallback to Basic Auth if direct token fails (common for private apps)
        if (response.status === 401) {
            console.warn("Direct token failed in reviews API, trying Basic Auth...");
            const basicAuth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
            const basicOptions = {
                ...options,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Basic ${basicAuth}`
                }
            };
            response = await fetch(URL, basicOptions);
        }

        const result = await response.json();

        if (result.errors) {
            console.error("Shopify API Errors:", result.errors);
            return NextResponse.json(
                { error: "Shopify API Error", details: result.errors },
                { status: 500 }
            );
        }

        const { metaobject, userErrors } = result.data.metaobjectCreate;

        if (userErrors && userErrors.length > 0) {
            console.error("Metaobject Creation Errors:", userErrors);
            return NextResponse.json(
                { error: userErrors[0].message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            id: metaobject.id,
            handle: metaobject.handle
        });

    } catch (error: any) {
        console.error("Review API Route Error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
