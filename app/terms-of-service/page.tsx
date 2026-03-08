import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service",
    description: "Review The Clean Crate Foods terms of service, including product pricing, billing, health disclaimers, and governing law for purchases on thecleancratefoods.com.",
    alternates: {
        canonical: "https://www.thecleancratefoods.com/terms-of-service",
    },
};

export default function TermsOfServicePage() {
    return (
        <div className="bg-white dark:bg-black min-h-screen pt-24 pb-16">
            <div className="mx-auto max-w-3xl px-6 lg:px-8">
                <h1 className="font-heading text-4xl font-bold text-zinc-900 dark:text-white mb-8">
                    Terms of Service
                </h1>
                <div className="prose prose-zinc dark:prose-invert max-w-none">
                    <p className="lead">
                        Last updated: January 2026
                    </p>
                    <p>
                        Welcome to The Clean Crate. By accessing our website and purchasing our products, you agree to be bound by the following Terms of Service.
                    </p>

                    <h2>1. General Conditions</h2>
                    <p>
                        We reserve the right to refuse service to anyone for any reason at any time. You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Service, use of the Service, or access to the Service without express written permission by us.
                    </p>

                    <h2>2. Products and Pricing</h2>
                    <p>
                        Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part thereof) without notice at any time. We shall not be liable to you or to any third-party for any modification, price change, suspension, or discontinuance of the Service.
                    </p>
                    <p>
                        We have made every effort to display as accurately as possible the colors and images of our products. We cannot guarantee that your computer monitor's display of any color will be accurate.
                    </p>

                    <h2>3. Accuracy of Billing and Account Information</h2>
                    <p>
                        We reserve the right to refuse any order you place with us. In the event that we make a change to or cancel an order, we may attempt to notify you by contacting the e-mail and/or billing address/phone number provided at the time the order was made.
                    </p>

                    <h2>4. Health Disclaimer</h2>
                    <p>
                        Our products (oats, protein mixes) are food items intended for general consumption. The information on this site is not intended to diagnose, treat, cure, or prevent any disease. Please check ingredients carefully if you have allergies (e.g., gluten, nuts, dairy).
                    </p>

                    <h2>5. Returns and Refunds</h2>
                    <p>
                        Due to the perishable nature of food products, we do not accept returns. However, if your order arrives damaged or incorrect, please contact us within 48 hours of delivery for a replacement or refund.
                    </p>

                    <h2>6. Governing Law</h2>
                    <p>
                        These Terms of Service generally are governed by and construed in accordance with the laws of India.
                    </p>

                    <h2>7. Contact Information</h2>
                    <p>
                        Questions about the Terms of Service should be sent to us at <a href="mailto:info@thecleancratefoods.com">info@thecleancratefoods.com</a>.
                    </p>
                </div>
            </div>
        </div>
    );
}
