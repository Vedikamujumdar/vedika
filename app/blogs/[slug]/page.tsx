import { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { blogPosts } from "@/lib/data/blogs";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ContactSection } from "@/components/contact-section";
import { NewsletterSection } from "@/components/newsletter-section";
import { RelatedBlogs } from "@/components/related-blogs";
import { ShareButton } from "@/components/share-button";
import { SiteFooter } from "@/components/site-footer";
import { JsonLd } from "@/components/json-ld";

interface BlogPostPageProps {
    params: Promise<{
        slug: string;
    }>;
}

// Generate static params for all blogs
export async function generateStaticParams() {
    return blogPosts.map((post) => ({
        slug: post.slug,
    }));
}

// Dynamic metadata for each blog post
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = blogPosts.find((p) => p.slug === slug);

    if (!post) {
        return { title: "Blog Post Not Found" };
    }

    return {
        title: post.title,
        description: post.excerpt,
        keywords: [post.category, "The Clean Crate", "healthy oats", "nutrition", post.title.split(" ").slice(0, 3).join(" ")],
        authors: [{ name: post.author }],
        alternates: {
            canonical: `https://www.thecleancratefoods.com/blogs/${slug}`,
        },
        openGraph: {
            title: post.title,
            description: post.excerpt,
            url: `https://www.thecleancratefoods.com/blogs/${slug}`,
            type: "article",
            publishedTime: post.date,
            authors: [post.author],
            images: [
                {
                    url: post.image,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.excerpt,
            images: [post.image],
        },
    };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params;
    const post = blogPosts.find((p) => p.slug === slug);

    if (!post) {
        notFound();
    }

    // Article structured data for rich snippets
    const articleJsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        image: `https://www.thecleancratefoods.com${post.image}`,
        author: {
            "@type": "Person",
            name: post.author,
        },
        publisher: {
            "@type": "Organization",
            name: "The Clean Crate Foods",
            logo: {
                "@type": "ImageObject",
                url: "https://www.thecleancratefoods.com/logo-new.jpg",
            },
        },
        datePublished: post.date,
        dateModified: post.date,
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `https://www.thecleancratefoods.com/blogs/${slug}`,
        },
    };

    // Breadcrumb structured data
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
                name: "Blog",
                item: "https://www.thecleancratefoods.com/blogs",
            },
            {
                "@type": "ListItem",
                position: 3,
                name: post.title,
                item: `https://www.thecleancratefoods.com/blogs/${slug}`,
            },
        ],
    };

    return (
        <main className="min-h-screen bg-white dark:bg-black pt-32">
            <JsonLd data={articleJsonLd} />
            <JsonLd data={breadcrumbJsonLd} />
            <article className="mx-auto max-w-4xl px-6 lg:px-8 mb-24">
                {/* Breadcrumbs */}
                <div className="mb-8">
                    <Breadcrumbs
                        items={[
                            { label: 'Blogs', href: '/blogs' },
                            { label: post.title, href: `/blogs/${post.slug}` }
                        ]}
                    />
                </div>



                {/* Header */}
                <header className="mb-12 text-center max-w-2xl mx-auto">
                    <div className="flex items-center justify-center gap-4 text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-6">
                        <span className="text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                            {post.category}
                        </span>
                        <span>•</span>
                        <span>{post.date}</span>
                    </div>

                    <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-zinc-900 dark:text-white mb-8 leading-tight">
                        {post.title}
                    </h1>

                    <div className="flex flex-col items-center gap-6">
                        <div className="flex items-center justify-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-xl font-bold border-2 border-white dark:border-zinc-700 shadow-sm relative overflow-hidden">
                                {post.image ? (
                                    <Image src={post.image} alt={post.author} fill className="object-cover" />
                                ) : (
                                    post.author.charAt(0)
                                )}
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-bold text-zinc-900 dark:text-white">
                                    {post.author}
                                </p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                    Author
                                </p>
                            </div>
                        </div>

                        <div className="scale-90 md:scale-100">
                            <ShareButton title={post.title} text={post.excerpt} />
                        </div>
                    </div>
                </header>

                {/* Featured Image */}
                <div className="relative aspect-[16/9] w-full rounded-[2.5rem] overflow-hidden shadow-2xl mb-16 ring-1 ring-zinc-900/5 dark:ring-white/10">
                    <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* Content */}
                <div
                    className="prose prose-lg md:prose-xl dark:prose-invert prose-zinc max-w-none min-w-full
                    
                    /* Headings */
                    prose-headings:font-heading prose-headings:font-bold prose-headings:text-zinc-900 dark:prose-headings:text-white
                    [&>h2]:text-3xl [&>h2]:md:text-4xl [&>h2]:mt-16 [&>h2]:mb-8 [&>h2]:leading-tight
                    [&>h3]:text-2xl [&>h3]:md:text-3xl [&>h3]:mt-12 [&>h3]:mb-6
                    
                    /* Paragraphs */
                    [&>p]:text-lg [&>p]:md:text-xl [&>p]:text-zinc-700 [&>p]:dark:text-zinc-300 [&>p]:leading-loose [&>p]:mb-8 [&>p]:tracking-wide
                    
                    /* Lists */
                    [&>ul]:my-8 [&>ul]:list-disc [&>ul]:pl-6
                    [&>ol]:my-8 [&>ol]:list-decimal [&>ol]:pl-6
                    [&>li]:text-lg [&>li]:md:text-xl [&>li]:text-zinc-700 [&>li]:dark:text-zinc-300 [&>li]:mb-4
                    
                    /* Blockquotes & Images */
                    [&>blockquote]:my-12 [&>blockquote]:border-l-4 [&>blockquote]:border-blue-600 [&>blockquote]:bg-blue-50/50 [&>blockquote]:dark:bg-blue-900/20 [&>blockquote]:px-8 [&>blockquote]:py-8 [&>blockquote]:rounded-r-3xl
                    [&>img]:rounded-[2.5rem] [&>img]:shadow-2xl [&>img]:my-16 [&>img]:w-full
                    
                    /* Strong/Bold */
                    [&>strong]:font-bold [&>strong]:text-zinc-900 [&>strong]:dark:text-white
                    "
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
            </article>

            {/* Related Blogs */}
            <RelatedBlogs currentSlug={post.slug} />

            {/* Newsletter */}
            <NewsletterSection />

            {/* Contact Section */}
            <ContactSection />

            <SiteFooter />
        </main>
    );
}
