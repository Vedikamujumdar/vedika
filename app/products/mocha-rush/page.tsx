import { ProductDetailsSection } from "@/components/product-details-section";
import { EverythingYouNeedToKnow } from "@/components/everything-you-need-to-know";
import { CustomerReviewsCarousel } from "@/components/customer-reviews-carousel";
import { ProductReviewsWidget } from "@/components/product-reviews-widget";
import { SiteFooter } from "@/components/site-footer";
import Link from "next/link";
import { getProduct } from "@/lib/shopify";

export default async function MochaRushProductPage() {
    const product = await getProduct("mocha-rush");

    return (
        <div className="min-h-screen bg-white text-zinc-900 selection:bg-black selection:text-white dark:bg-black dark:text-white dark:selection:bg-white dark:selection:text-black">

            <main className="pt-24 pb-24">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <nav className="flex mb-8 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">Home</Link>
                        <span className="mx-2">/</span>
                        <Link href="/#products" className="hover:text-black dark:hover:text-white transition-colors">Products</Link>
                        <span className="mx-2">/</span>
                        <span className="text-zinc-900 dark:text-white">{product?.title || "Mocha Rush"}</span>
                    </nav>

                    {/* Product Main Section (Image + Buy Box) */}
                    <ProductDetailsSection showViewDetailsLink={false} product={product} />

                    {/* Detailed Info Section (Wholesome Goodness etc.) */}
                    <EverythingYouNeedToKnow />

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
