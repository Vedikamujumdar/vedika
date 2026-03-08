import { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { blogPosts } from "@/lib/data/blogs";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
    title: "Blog — Healthy Living, Oats Recipes & Nutrition Tips",
    description: "Read the latest articles on healthy oats, protein nutrition, clean eating recipes, and wellness tips from The Clean Crate Foods. Expert advice for a healthier lifestyle.",
    keywords: ["healthy oats blog", "oats recipes India", "nutrition tips", "protein oats articles", "clean eating blog"],
    alternates: {
        canonical: "https://www.thecleancratefoods.com/blogs",
    },
    openGraph: {
        title: "Blog | The Clean Crate Foods",
        description: "Expert advice, delicious recipes, and stories about healthy living.",
        url: "https://www.thecleancratefoods.com/blogs",
    },
};

export default function BlogListingPage() {
    return (
        <main className="min-h-screen bg-white dark:bg-black pt-32 pb-24">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {/* Breadcrumbs */}
                <div className="mb-12">
                    <Breadcrumbs items={[{ label: 'Blogs', href: '/blogs' }]} />
                </div>

                <div className="text-center max-w-2xl mx-auto mb-20">
                    <span className="text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-sm mb-4 block">
                        Our Journal
                    </span>
                    <h1 className="font-heading text-5xl md:text-6xl font-bold text-zinc-900 dark:text-white mb-6">
                        Latest from The Crate
                    </h1>
                    <p className="text-xl text-zinc-600 dark:text-zinc-400">
                        Expert advice, delicious recipes, and stories about healthy living.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogPosts.map((post) => (
                        <Link key={post.id} href={`/blogs/${post.slug}`} className="group flex flex-col h-full bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                            <div className="relative aspect-[16/10] w-full overflow-hidden">
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                            </div>
                            <div className="p-8 flex flex-col flex-grow">
                                <div className="flex gap-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-3">
                                    <span className="text-blue-600 dark:text-blue-400">{post.category}</span>
                                    <span>•</span>
                                    <span>{post.date}</span>
                                </div>
                                <h3 className="font-heading text-xl font-bold text-zinc-900 dark:text-white mb-3 line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {post.title}
                                </h3>
                                <p className="text-zinc-600 dark:text-zinc-400 text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">
                                    {post.excerpt}
                                </p>
                                <div className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    Read Article
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 translate-x-0 group-hover:translate-x-1 transition-transform">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    )
}
