import { MetadataRoute } from "next";
import { getProducts } from "@/lib/shopify";
import { blogPosts } from "@/lib/data/blogs";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://www.thecleancratefoods.com";

    // Static routes
    const routes = [
        "",
        "/about",
        "/contact",
        "/products",
        "/blogs",
        "/privacy-policy",
        "/refund-policy",
        "/terms-of-service",
        "/cookie-policy",
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date().toISOString(),
        changeFrequency: "daily" as const,
        priority: route === "" ? 1 : route === "/products" ? 0.9 : route === "/blogs" ? 0.8 : 0.7,
    }));

    // Dynamic product routes
    const products = await getProducts();
    const productRoutes = products.map((product: any) => ({
        url: `${baseUrl}/products/${product.node.handle}`,
        lastModified: new Date().toISOString(),
        changeFrequency: "weekly" as const,
        priority: 0.9,
    }));

    // Blog post routes
    const blogRoutes = blogPosts.map((post) => ({
        url: `${baseUrl}/blogs/${post.slug}`,
        lastModified: new Date().toISOString(),
        changeFrequency: "monthly" as const,
        priority: 0.8,
    }));

    return [...routes, ...productRoutes, ...blogRoutes];
}
