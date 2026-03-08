import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Refund & Cancellation Policy",
    description: "Read The Clean Crate Foods refund, return, and cancellation policy. We offer replacements for damaged, wrong, or expired products within 48 hours of delivery.",
    alternates: {
        canonical: "https://www.thecleancratefoods.com/refund-policy",
    },
};

export default function RefundPolicyPage() {
    return (
        <div className="bg-white dark:bg-black min-h-screen pt-24 pb-16">
            <div className="mx-auto max-w-3xl px-6 lg:px-8">
                <h1 className="font-heading text-4xl font-bold text-zinc-900 dark:text-white mb-8">
                    Refund & Cancellation Policy
                </h1>
                <div className="prose prose-zinc dark:prose-invert max-w-none">
                    <p className="lead">
                        Last updated: January 2026
                    </p>
                    <p>
                        At The Clean Crate, we are committed to providing you with the highest quality snacks. However, due to the nature of our products, we have a specific policy regarding returns and refunds.
                    </p>

                    <h2>1. Returns</h2>
                    <p>
                        <strong>Perishable Goods:</strong> As our products (oats, protein mixes, snacks) are food items, we cannot accept returns due to health and safety regulations. Once an order has been delivered, it cannot be returned.
                    </p>

                    <h2>2. Refunds & Replacements</h2>
                    <p>
                        We will happily offer a replacement or refund in the following cases:
                    </p>
                    <ul>
                        <li><strong>Damaged Product:</strong> If the package arrives open, damaged, or tampered with.</li>
                        <li><strong>Wrong Item:</strong> If you received a product different from what you ordered.</li>
                        <li><strong>Expired Product:</strong> In the rare event that you receive a product past its expiry date.</li>
                    </ul>
                    <p>
                        To request a refund or replacement, please contact us within <strong>48 hours</strong> of delivery at <a href="mailto:info@thecleancratefoods.com">info@thecleancratefoods.com</a> with your Order ID and photos of the issue.
                    </p>

                    <h2>3. Cancellations</h2>
                    <p>
                        You can cancel your order at any time <strong>before it has been dispatched</strong>. Once the order has been shipped, it cannot be cancelled.
                    </p>
                    <p>
                        To cancel, please email us immediately or message us on Instagram. If the cancellation is approved, the full amount will be refunded to your original payment method within 5-7 business days.
                    </p>

                    <h2>4. Shipping Policy</h2>
                    <p>
                        We ship across India. Standard delivery typically takes 3-7 business days depending on your location. You will receive a tracking link via email/SMS once your order is dispatched.
                    </p>

                    <h2>5. Contact Us</h2>
                    <p>
                        If you have any questions about our policy, please contact us at <a href="mailto:info@thecleancratefoods.com">info@thecleancratefoods.com</a>.
                    </p>
                </div>
            </div>
        </div>
    );
}
