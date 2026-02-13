const domain = "ufybyf-s9.myshopify.com";
const storefrontToken = "073200920991e76a0eefaff1261be35b";

async function ShopifyData(query: string, variables: any = {}) {
  const URL = `https://${domain}/api/2024-01/graphql.json`;

  const options = {
    endpoint: URL,
    method: "POST",
    headers: {
      "X-Shopify-Storefront-Access-Token": storefrontToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  };

  try {
    const response = await fetch(URL, options);
    const data = await response.json();
    if (data.errors) {
      console.error("Shopify API Errors:", data.errors);
    }
    return data;
  } catch (error) {
    console.error("Fetch Error:", error);
    throw new Error("Error fetching data from Shopify");
  }
}

export async function getProduct(handle: string) {
  const query = `
  {
    product(handle: "${handle}") {
      id
      title
      handle
      description
      availableForSale
      variants(first: 10) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            quantityAvailable
          }
        }
      }
      images(first: 5) {
        edges {
          node {
            url
            altText
          }
        }
      }
    }
  }`;

  try {
    const response = await ShopifyData(query);
    const product = response.data?.product;

    if (!product) return null;

    return {
      ...product,
      variants: {
        edges: product.variants.edges.map((e: any) => ({
          node: {
            ...e.node,
            price: e.node.price, // Already in correct format { amount, currencyCode }
            inventoryQuantity: e.node.quantityAvailable,
            availableForSale: e.node.quantityAvailable > 0
          }
        }))
      },
      priceRange: {
        minVariantPrice: product.variants.edges[0]?.node?.price || { amount: "0", currencyCode: "INR" }
      }
    };
  } catch (error) {
    console.log("Error fetching product, returning mock data");
    return {
      id: "8350944591917",
      title: "Ready to eat oats Mocha rush",
      handle: "mocha-rush-ready-to-eat-oats",
      description: "Start your day with Mocha Rush Ready To Eat Oats.",
      availableForSale: true,
      priceRange: { minVariantPrice: { amount: "110.00", currencyCode: "INR" } },
      images: { edges: [{ node: { url: "https://cdn.shopify.com/s/files/1/1012/1124/2577/files/WhatsAppImage2026-01-01at3.50.51PM.jpg", altText: "Mocha Rush" } }] },
      variants: { edges: [{ node: { id: "44416942178349", title: "Default Title", availableForSale: true, price: { amount: "599.00", currencyCode: "INR" }, inventoryQuantity: 100 } }] }
    };
  }
}

export async function getProducts() {
  const query = `
  {
    products(first: 9) {
      edges {
        node {
          id
          title
          handle
          availableForSale
          variants(first: 1) {
            edges {
              node {
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
        }
      }
    }
  }`;

  try {
    const response = await ShopifyData(query);
    return response.data?.products?.edges.map((e: any) => ({
      node: {
        ...e.node,
        priceRange: {
          minVariantPrice: e.node.variants.edges[0]?.node?.price || { amount: "0", currencyCode: "INR" }
        }
      }
    })) || [];
  } catch (e) {
    return [];
  }
}

// ============================================
// TESTIMONIALS (via Metaobjects)
// ============================================

export interface Testimonial {
  id: string | number;
  author: string;
  role: string;
  rating: number;
  text: string;
  date: string;
}

// Default testimonials as fallback
const defaultTestimonials: Testimonial[] = [
  {
    id: 1,
    author: "Sarah J.",
    role: "Verified Buyer",
    rating: 5,
    text: "Absolutely love the Mocha vibe! It's my go-to breakfast now. The coffee kick is real and it keeps me full for hours.",
    date: "2 days ago"
  },
  {
    id: 2,
    author: "Mike T.",
    role: "Fitness Enthusiast",
    rating: 5,
    text: "Best protein oats I've tried. Not too sweet, just perfect. The convenience of it being ready-to-eat is a game changer for my morning gym rush.",
    date: "1 week ago"
  },
  {
    id: 3,
    author: "Priya K.",
    role: "Verified Buyer",
    rating: 4,
    text: "Very tasty! I add a bit of almond milk and it's perfect. Love that it has no added sugar.",
    date: "2 weeks ago"
  },
  {
    id: 4,
    author: "David L.",
    role: "Verified Buyer",
    rating: 5,
    text: "I was skeptical about cold oats, but these are delicious. The mocha flavor is spot on.",
    date: "3 weeks ago"
  },
  {
    id: 5,
    author: "Emily R.",
    role: "Yoga Instructor",
    rating: 5,
    text: "Clean ingredients and great taste. Finally a healthy breakfast that doesn't taste like cardboard!",
    date: "1 month ago"
  }
];

// Token is already defined globally at the top of the file


/**
 * Fetches testimonials from Shopify Metaobjects via Storefront API.
 * Falls back to default testimonials if API fails or no data exists.
 */
export async function getTestimonials(): Promise<Testimonial[]> {
  const URL = `https://${domain}/api/2024-01/graphql.json`;

  const query = `
  {
    metaobjects(type: "testimonial", first: 20) {
      edges {
        node {
          handle
          fields {
            key
            value
          }
        }
      }
    }
  }`;

  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": storefrontToken,
      },
      body: JSON.stringify({ query }),
    });

    const result = await response.json();
    const metaobjects = result.data?.metaobjects?.edges;

    if (!metaobjects || metaobjects.length === 0) {
      console.log("No testimonial metaobjects found via Storefront API, using defaults");
      return defaultTestimonials;
    }

    const testimonials: Testimonial[] = metaobjects.map((edge: any, index: number) => {
      const fields = edge.node.fields.reduce((acc: any, field: any) => {
        acc[field.key] = field.value;
        return acc;
      }, {});

      return {
        id: edge.node.handle || index + 1,
        author: fields.author || "Anonymous",
        role: fields.role || "Customer",
        rating: parseInt(fields.rating) || 5,
        text: fields.text || "",
        date: fields.date || "Recently"
      };
    });

    return testimonials.length > 0 ? testimonials : defaultTestimonials;
  } catch (error) {
    console.log("Error fetching testimonials via Storefront API, using defaults:", error);
    return defaultTestimonials;
  }
}

// ============================================
// CHECKOUT HELPER (Client-Side Permalinks)
// ============================================

/**
 * Generates a direct Checkout URL for a list of items.
 * Format: https://store.com/cart/variant_id:qty,variant_id:qty
 */
export function createCheckoutUrl(items: { variantId: string; quantity: number }[]) {
  if (!items || items.length === 0) return `https://${domain}`;

  const param = items.map(item => {
    // Ensure ID is numeric (strip gid:// prefix)
    const numericId = item.variantId.split("/").pop();
    return `${numericId}:${item.quantity}`;
  }).join(',');

  return `https://${domain}/cart/${param}`;
}

// ============================================
// CUSTOMER AUTHENTICATION
// ============================================

export async function loginCustomer(email: string, password: string) {
  const query = `
    mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken {
          accessToken
          expiresAt
        }
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      email,
      password,
    },
  };

  const response = await ShopifyData(query, variables);

  if (response.data?.customerAccessTokenCreate?.customerUserErrors?.length > 0) {
    throw new Error(response.data.customerAccessTokenCreate.customerUserErrors[0].message);
  }

  const token = response.data?.customerAccessTokenCreate?.customerAccessToken;
  return token;
}

export async function getCustomer(accessToken: string) {
  const query = `
    query getCustomer($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
        id
        firstName
        lastName
        email
        orders(first: 10) {
          edges {
            node {
              id
              orderNumber
              fulfillmentStatus
              lineItems(first: 20) {
                edges {
                  node {
                    title
                    variant {
                      id
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const variables = {
    customerAccessToken: accessToken,
  };

  const response = await ShopifyData(query, variables);
  return response.data?.customer;
}

export async function createCustomer(email: string, password: string, firstName: string, lastName: string) {
  const query = `
    mutation customerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer {
          id
        }
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `;

  const input = {
    email,
    password,
    firstName,
    lastName,
  };

  const variables = { input };

  const response = await ShopifyData(query, variables);

  if (response.data?.customerCreate?.customerUserErrors?.length > 0) {
    throw new Error(response.data.customerCreate.customerUserErrors[0].message);
  }

  return response.data?.customerCreate?.customer;
}

// ============================================
// ADMIN API - ORDER CREATION
// ============================================

export async function createShopifyOrder(orderData: any) {
  const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "ufybyf-s9.myshopify.com";

  if (!adminToken || adminToken.includes("your_token_here")) {
    console.error("Missing SHOPIFY_ADMIN_ACCESS_TOKEN");
    throw new Error("Configuration Error: SHOPIFY_ADMIN_ACCESS_TOKEN is missing on server");
  }

  const URL = `https://${domain}/admin/api/2024-01/orders.json`;

  // Map to REST API structure
  const line_items = orderData.lineItems.map((item: any) => {
    // Extract numeric ID from GID if present
    const variant_id = item.variantId.toString().includes("/")
      ? item.variantId.split("/").pop()
      : item.variantId;
    return {
      variant_id: Number(variant_id),
      quantity: item.quantity
    };
  });

  const payload = {
    order: {
      line_items,
      customer: {
        first_name: orderData.customer.firstName,
        last_name: orderData.customer.lastName,
        email: orderData.customer.email,
        phone: orderData.customer.phone
      },
      shipping_address: {
        address1: orderData.customer.address,
        city: orderData.customer.city,
        province: orderData.customer.state,
        zip: orderData.customer.zip,
        country: "India", // Assuming India
        first_name: orderData.customer.firstName,
        last_name: orderData.customer.lastName,
        phone: orderData.customer.phone
      },
      billing_address: {
        address1: orderData.customer.address,
        city: orderData.customer.city,
        province: orderData.customer.state,
        zip: orderData.customer.zip,
        country: "India",
        first_name: orderData.customer.firstName,
        last_name: orderData.customer.lastName,
        phone: orderData.customer.phone
      },
      financial_status: orderData.financialStatus.toLowerCase() || "paid",
      tags: "Cashfree, Online Payment",
      note: `Payment ID: ${orderData.paymentId}`
    }
  };

  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": adminToken,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Shopify Order Create Error (REST):", JSON.stringify(result));
      throw new Error(JSON.stringify(result.errors) || "Failed to create order");
    }

    // Return the order object in the expected format (mapped to GraphQL-like structure if needed, or just return as is)
    // The existing code expects .id which works (but invalid format? REST returns numeric ID, GraphQL returns GID)
    // We should convert ID to GID to be consistent with other parts if they expect GID.
    // However, existing usage: app/api/payment/create-order/route.ts
    // const shopifyOrderId = shopifyOrder.id.split("/").pop(); 
    // If we return numeric ID, .split("/").pop() still works nicely (returns the ID itself).

    // But route.ts also returns `shopifyOrderId: shopifyOrder.id` to client.
    // If client expects GID, we should probably construct it.
    // But let's check: route.ts 
    // shopifyOrderId: shopifyOrder.id // Return full GID for client

    const order = result.order;
    // Normalize ID to GID for consistency
    const gid = `gid://shopify/Order/${order.id}`;

    return {
      ...order,
      id: gid,
      name: order.name
    };

  } catch (error) {
    console.error("Error creating Shopify order (REST):", error);
    throw error;
  }
}


export async function markShopifyOrderAsPaid(shopifyOrderId: string) {
  const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "ufybyf-s9.myshopify.com";

  if (!adminToken) return;

  const URL = `https://${domain}/admin/api/2024-01/graphql.json`;

  const query = `
      mutation orderMarkAsPaid($input: OrderMarkAsPaidInput!) {
        orderMarkAsPaid(input: $input) {
          order {
            id
            displayFinancialStatus
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

  const variables = {
    input: {
      id: shopifyOrderId
    }
  };

  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": adminToken,
      },
      body: JSON.stringify({ query, variables }),
    });

    const result = await response.json();
    if (result.data?.orderMarkAsPaid?.userErrors?.length > 0) {
      console.error("Error marking order as paid:", result.data.orderMarkAsPaid.userErrors);
    }
    return result.data?.orderMarkAsPaid?.order;
  } catch (error) {
    console.error("Failed to mark order as paid:", error);
    throw error;
  }
}
