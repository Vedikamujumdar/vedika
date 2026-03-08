import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Cookie Policy",
    description: "Learn how The Clean Crate Foods uses cookies and similar technologies on our website, including essential, performance, and functional cookies.",
    alternates: {
        canonical: "https://www.thecleancratefoods.com/cookie-policy",
    },
};

export default function CookiePolicyPage() {
    return (
        <div className="bg-white dark:bg-black min-h-screen pt-24 pb-16">
            <div className="mx-auto max-w-3xl px-6 lg:px-8">
                <h1 className="font-heading text-4xl font-bold text-zinc-900 dark:text-white mb-8">
                    Cookie Policy
                </h1>
                <div className="prose prose-zinc dark:prose-invert max-w-none">
                    <p className="lead">
                        Last updated: January 2026
                    </p>
                    <p>
                        This Cookie Policy explains how The Clean Crate ("we", "us", and "our") uses cookies and similar technologies to recognize you when you visit our website. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
                    </p>

                    <h2>1. What are cookies?</h2>
                    <p>
                        Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
                    </p>

                    <h2>2. Why do we use cookies?</h2>
                    <p>We use cookies for several reasons:</p>
                    <ul>
                        <li><strong>Essential Cookies:</strong> These are strictly necessary to provide you with services available through our website and to use some of its features, such as access to secure areas or using the shopping cart.</li>
                        <li><strong>Performance & Analytics Cookies:</strong> These cookies collect information about how you use our website, like which pages you visited and which links you clicked on. None of this information can be used to identify you. It is all aggregated and, therefore, anonymized.</li>
                        <li><strong>Functional Cookies:</strong> These cookies allow our website to remember choices you make (such as your user name, language or the region you are in) and provide enhanced, more personal features.</li>
                    </ul>

                    <h2>3. How can I control cookies?</h2>
                    <p>
                        You have the right to decide whether to accept or reject cookies. You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted.
                    </p>

                    <h2>4. Updates to this policy</h2>
                    <p>
                        We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal or regulatory reasons. Please therefore re-visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
                    </p>
                </div>
            </div>
        </div>
    );
}
