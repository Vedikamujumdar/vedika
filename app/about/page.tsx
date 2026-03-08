import { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { Breadcrumbs } from "@/components/breadcrumbs";
import Image from "next/image";

export const metadata: Metadata = {
    title: "About Us | The Clean Crate Foods — Our Story",
    description: "The Clean Crate is a women-founded healthy snacking brand from Hyderabad. We create ready-to-eat protein oats and protein bites with clean, natural ingredients — no fillers, no junk.",
    keywords: ["about The Clean Crate", "healthy snack brand India", "women founded food brand", "clean eating India", "protein oats brand"],
    alternates: {
        canonical: "https://www.thecleancratefoods.com/about",
    },
    openGraph: {
        title: "About Us | The Clean Crate Foods",
        description: "Women-founded. Clean ingredients. Honest nutrition. Learn our story.",
        url: "https://www.thecleancratefoods.com/about",
        images: ["/our-story-founders.png"],
    },
};

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-black overflow-hidden selection:bg-blue-100 selection:text-blue-900">

            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/20 dark:to-transparent pointer-events-none" />
            <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-blue-200/20 dark:bg-blue-900/10 rounded-full blur-3xl opacity-50 pointer-events-none transform translate-x-1/2" />

            {/* Main Content Container */}
            <div className="relative pt-32 pb-24">
                <div className="mx-auto max-w-5xl px-6 lg:px-8">

                    {/* Breadcrumbs */}
                    <div className="mb-12">
                        <Breadcrumbs items={[{ label: 'About Us', href: '/about' }]} />
                    </div>

                    {/* Header */}
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <span className="text-blue-600 dark:text-blue-400 font-bold tracking-widest text-sm uppercase mb-4 block">
                            Our Story
                        </span>
                        <h1 className="font-heading text-5xl md:text-7xl font-bold text-zinc-900 dark:text-white mb-6 leading-tight">
                            Clean Ingredients.<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                                Honest Nutrition.
                            </span>
                        </h1>
                        <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            We believe everyday snacking should be simple, delicious, and guilt-free.
                        </p>
                    </div>

                    {/* Hero Image */}
                    <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-[2.5rem] overflow-hidden shadow-2xl mb-24 border border-zinc-100 dark:border-zinc-800">
                        <Image
                            src="/our-story-founders.png"
                            alt="The Clean Crate Founders in Kitchen"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    {/* Content Section 1: The Origin */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-24 items-start">
                        <div className="md:col-span-4">
                            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white sticky top-32">
                                How it all Started
                            </h2>
                        </div>
                        <div className="md:col-span-8 space-y-6 text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed">
                            <p>
                                The Clean Crate was born from a very real, everyday struggle — wanting to eat healthy without giving up on taste, convenience, or trust. In a world full of “healthy” labels and confusing ingredients, we found it surprisingly hard to find food that actually felt clean, filling, and honest.
                            </p>
                            <p>
                                Tired of the snack-time compromise between bland “health foods” and snacks loaded with empty calories, we knew there had to be a better way. One where nutrition didn’t mean boredom, and flavor didn’t come with guilt.
                            </p>
                            <p className="p-8 bg-blue-600 dark:bg-blue-900 rounded-[2rem] shadow-xl italic text-xl text-white font-medium">
                                "By combining traditional nutritional wisdom with modern, crave-worthy flavors, we created snacks that are as wholesome as they are delicious."
                            </p>
                            <p>
                                No fillers. No junk. Just thoughtfully chosen ingredients that support active, everyday lifestyles. Because at The Clean Crate, we believe good food should do more than taste good — it should help keep you moving.
                            </p>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="w-full h-px bg-zinc-200 dark:bg-zinc-800 mb-24" />

                    {/* Content Section 2: Who We Are (Glassmorphic Card) */}
                    <div className="relative bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl rounded-[3rem] p-8 md:p-16 border border-zinc-200/50 dark:border-zinc-700/50 shadow-xl overflow-hidden">
                        {/* Decorative blob inside card */}
                        <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-60 pointer-events-none" />

                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
                            <div className="md:col-span-4">
                                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                    </svg>
                                </div>
                                <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
                                    Who We Are
                                </h2>
                                <p className="mt-4 text-zinc-500 dark:text-zinc-400">
                                    Women-founded. Tech-driven. Heart-led.
                                </p>
                            </div>

                            <div className="md:col-span-8 space-y-6 text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed">
                                <p>
                                    The Clean Crate is a women-founded healthy snacking brand, built by two women in tech for modern, high-pressure lifestyles. We create thoughtfully crafted snacks using clean, balanced ingredients that support sustained energy, nourishment, and convenience—without compromising on flavour.
                                </p>
                                <p>
                                    Our approach is rooted in simplicity, transparency, and mindful nutrition. No unnecessary additives, no confusing claims—just honest food designed for real, busy lives.
                                </p>
                                <p>
                                    As founders, we understand firsthand the challenge of balancing demanding careers, personal health, and everyday responsibilities. That’s why every The Clean Crate product is designed to be easy to carry, simple to consume, and nutritionally balanced—so making a healthier choice never feels like extra work.
                                </p>
                                <p className="font-medium text-zinc-900 dark:text-white">
                                    We’re not here to promote food guilt or unrealistic eating standards. We’re here to make better choices easier, especially on the busiest days. At The Clean Crate, nourishment is designed to fit into your life—not interrupt it.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <SiteFooter />
        </main>
    );
}
