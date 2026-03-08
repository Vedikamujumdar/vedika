
import { ProductDetailsSection } from "@/components/product-details-section";
import { EverythingYouNeedToKnow } from "@/components/everything-you-need-to-know";
import { CustomerReviewsCarousel } from "@/components/customer-reviews-carousel";
import { ProductReviewsWidget } from "@/components/product-reviews-widget";
import { SiteFooter } from "@/components/site-footer";
import Link from "next/link";
import { getProduct } from "@/lib/shopify";
import { ProductViewTracker } from "@/components/product-view-tracker";
import { notFound } from "next/navigation";

import { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
    const { handle } = await params;
    const product = await getProduct(handle);

    if (!product) {
        return {
            title: "Product Not Found",
            description: "The requested product could not be found."
        };
    }

    const title = `${product.title} | Buy Online India`;
    const rawDescription = product.description.substring(0, 120);
    const description = `${rawDescription} | Ready to eat, quick to prepare protein oats by The Clean Crate Foods. Order online at thecleancratefoods.com.`;
    const image = product.images.edges[0]?.node.url;

    return {
        title,
        description,
        keywords: ["ready to eat oats", "quick to prepare oats", "protein oats India", "The Clean Crate", product.title],
        alternates: {
            canonical: `https://www.thecleancratefoods.com/products/${handle}`,
        },
        openGraph: {
            title,
            description,
            url: `https://www.thecleancratefoods.com/products/${handle}`,
            images: [
                {
                    url: image,
                    width: 800,
                    height: 600,
                    alt: title,
                },
            ],
        },
    };
}

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
    const { handle } = await params;
    const product = await getProduct(handle);

    if (!product) {
        notFound();
    }

    const price = product.priceRange.minVariantPrice.amount;
    const currency = product.priceRange.minVariantPrice.currencyCode;

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.title,
        image: product.images.edges.map((e: any) => e.node.url),
        description: product.description,
        sku: product.variants.edges[0]?.node.id,
        brand: {
            "@type": "Brand",
            name: "The Clean Crate"
        },
        offers: {
            "@type": "Offer",
            url: `https://www.thecleancratefoods.com/products/${handle}`,
            priceCurrency: currency,
            price: price,
            availability: product.availableForSale ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            itemCondition: "https://schema.org/NewCondition",
            seller: {
                "@type": "Organization",
                name: "The Clean Crate Foods",
            },
        },
    };

    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://www.thecleancratefoods.com",
            },
            {
                "@type": "ListItem",
                position: 2,
                name: "Products",
                item: "https://www.thecleancratefoods.com/products",
            },
            {
                "@type": "ListItem",
                position: 3,
                name: product.title,
                item: `https://www.thecleancratefoods.com/products/${handle}`,
            },
        ],
    };

    return (
        <div className="min-h-screen bg-white text-zinc-900 selection:bg-black selection:text-white dark:bg-black dark:text-white dark:selection:bg-white dark:selection:text-black">
            <JsonLd data={jsonLd} />
            <JsonLd data={breadcrumbJsonLd} />
            <ProductViewTracker
                productTitle={product.title}
                productId={product.variants.edges[0]?.node.id || handle}
                value={Number(price)}
                currency={currency}
            />

            <main className="pt-24 pb-24">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <nav className="flex mb-8 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">Home</Link>
                        <span className="mx-2">/</span>
                        <Link href="/#products" className="hover:text-black dark:hover:text-white transition-colors">Products</Link>
                        <span className="mx-2">/</span>
                        <span className="text-zinc-900 dark:text-white">{product.title}</span>
                    </nav>

                    {/* Product Main Section (Image + Buy Box) */}
                    <ProductDetailsSection showViewDetailsLink={false} product={product} />

                    {/* Detailed Info Section (Wholesome Goodness etc.) */}
                    <EverythingYouNeedToKnow product={product} />

                    {/* Customer Reviews */}
                    <CustomerReviewsCarousel />

                    {/* Interactive Review Widget (Giscus) */}
                    <ProductReviewsWidget />
                </div>
            </main>

            <SiteFooter />
        </div>
    );
}
