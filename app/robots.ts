import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/api/", "/admin/", "/checkout", "/order-success"],
        },
        sitemap: "https://www.thecleancratefoods.com/sitemap.xml",
    };
}
