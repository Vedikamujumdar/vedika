import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy",
    description: "Learn how The Clean Crate Foods collects, uses, and protects your personal information when you visit our website or purchase our products.",
    alternates: {
        canonical: "https://www.thecleancratefoods.com/privacy-policy",
    },
};

export default function PrivacyPolicyPage() {
    return (
        <div className="bg-white dark:bg-black min-h-screen pt-24 pb-16">
            <div className="mx-auto max-w-3xl px-6 lg:px-8">
                <h1 className="font-heading text-4xl font-bold text-zinc-900 dark:text-white mb-8">
                    Privacy Policy
                </h1>
                <div className="prose prose-zinc dark:prose-invert max-w-none">
                    <p className="lead">
                        Last updated: January 2026
                    </p>
                    <p>
                        At The Clean Crate, we value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data when you visit our website or purchase our products.
                    </p>

                    <h2>1. Information We Collect</h2>
                    <p>We collect information that you provide to us directly, including:</p>
                    <ul>
                        <li><strong>Personal Information:</strong> Name, email address, phone number, and shipping/billing address when you place an order.</li>
                        <li><strong>Payment Information:</strong> Credit card details and payment confirmation (processed securely by our third-party payment gateways).</li>
                        <li><strong>Account Credentials:</strong> Username and password if you create an account with us.</li>
                    </ul>

                    <h2>2. How We Use Your Information</h2>
                    <p>We use your data to:</p>
                    <ul>
                        <li>Process and deliver your orders.</li>
                        <li>Send order confirmations and shipping updates.</li>
                        <li>Respond to your customer service inquiries.</li>
                        <li>Send you marketing emails/newsletters (only if you opt-in).</li>
                        <li>Improve our website functionality and user experience.</li>
                    </ul>

                    <h2>3. Data Sharing and Third Parties</h2>
                    <p>
                        We do not sell your personal data. We typically only share your information with trusted third parties necessary to operate our business, such as:
                    </p>
                    <ul>
                        <li><strong>Logistics Partners:</strong> To deliver your packages.</li>
                        <li><strong>Payment Processors:</strong> To securely handle transactions.</li>
                        <li><strong>Analytics Providers:</strong> To understand how visitors use our site (e.g., Google Analytics).</li>
                    </ul>

                    <h2>4. Your Rights</h2>
                    <p>
                        You have the right to access, correct, or delete your personal information held by us. You may also opt-out of marketing communications at any time by clicking the "unsubscribe" link in our emails.
                    </p>

                    <h2>5. Contact Us</h2>
                    <p>
                        If you have questions about this Privacy Policy, please contact us at <a href="mailto:info@thecleancratefoods.com">info@thecleancratefoods.com</a>.
                    </p>
                </div>
            </div>
        </div>
    );
}
