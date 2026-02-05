/**
 * Shopify Storefront API Client
 * Uses public Storefront Access Token for checkout creation
 */

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "cleancrate-8642.myshopify.com";
const storefrontToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN || "";

type CartLineItem = {
    variantId: string;
    quantity: number;
};

/**
 * Make a request to the Shopify Storefront API
 */
async function storefrontFetch(query: string, variables?: Record<string, any>) {
    const url = `https://${domain}/api/2024-01/graphql.json`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Shopify-Storefront-Access-Token": storefrontToken,
        },
        body: JSON.stringify({ query, variables }),
    });

    const data = await response.json();

    if (data.errors) {
        console.error("Storefront API Error:", data.errors);
        throw new Error(data.errors[0]?.message || "Storefront API error");
    }

    return data;
}

/**
 * Convert variant ID to Storefront API format
 * Admin API: gid://shopify/ProductVariant/123456
 * Storefront: gid://shopify/ProductVariant/123456
 * Numeric: 123456 -> gid://shopify/ProductVariant/123456
 */
function formatVariantId(id: string): string {
    if (id.startsWith("gid://")) return id;
    // If it's just a numeric ID, format it
    const numericId = id.split("/").pop() || id;
    return `gid://shopify/ProductVariant/${numericId}`;
}

/**
 * Create a cart with the given line items and return the checkout URL
 * This helps bypass the password page logic by using the Cart API
 */
export async function createStorefrontCheckout(items: CartLineItem[]): Promise<string> {
    if (!storefrontToken) {
        // Fallback to cart permalink if no storefront token
        console.warn("No Storefront token, falling back to cart permalink");
        const param = items.map(item => {
            const numericId = item.variantId.split("/").pop();
            return `${numericId}:${item.quantity}`;
        }).join(',');
        return `https://${domain}/cart/${param}`;
    }

    const lines = items.map(item => ({
        merchandiseId: formatVariantId(item.variantId),
        quantity: item.quantity,
    }));

    const mutation = `
    mutation cartCreate($lines: [CartLineInput!]!) {
      cartCreate(input: { lines: $lines }) {
        cart {
          id
          checkoutUrl
        }
        userErrors {
          code
          field
          message
        }
      }
    }
  `;

    try {
        const response = await storefrontFetch(mutation, {
            lines: lines,
        });

        const { cart, userErrors } = response.data.cartCreate;

        if (userErrors && userErrors.length > 0) {
            console.error("Cart creation errors:", userErrors);
            throw new Error(userErrors[0].message);
        }

        if (!cart?.checkoutUrl) {
            throw new Error("No checkout URL returned");
        }

        return cart.checkoutUrl;
    } catch (error) {
        console.error("Failed to create checkout via API, falling back to permalink:", error);
        // Fallback to cart permalink
        const param = items.map(item => {
            const numericId = item.variantId.split("/").pop();
            return `${numericId}:${item.quantity}`;
        }).join(',');
        return `https://${domain}/cart/${param}`;
    }
}
