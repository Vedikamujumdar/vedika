"use client"

import { useState } from "react"
import { fbqTrack } from "@/components/meta-pixel"

export function ContactSection() {
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("submitting");

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to send message");

            setStatus("success");
            setFormData({ name: "", email: "", message: "" });

            // Fire Meta Pixel Contact event
            fbqTrack("Contact", {
                content_name: "Contact Form Submission",
            });

            // Reset status after 3 seconds
            setTimeout(() => setStatus("idle"), 5000);

        } catch (error) {
            console.error(error);
            setStatus("error");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.title || e.target.type === "email" ? "email" : e.target.type === "text" ? "name" : "message"]: e.target.value }));
    };

    return (
        <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                    <span className="block text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-sm mb-2">
                        Contact Us
                    </span>
                    <h2 className="font-heading text-4xl font-bold tracking-tight text-zinc-900 dark:text-white mb-6">
                        Get in Touch
                    </h2>
                    <p className="text-lg text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">
                        Have a question about our ingredients, shipping, or just want to say hi? We're here to help you start your healthy journey.
                    </p>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xl">📧</div>
                            <div>
                                <h3 className="font-bold text-zinc-900 dark:text-white">Email Us</h3>
                                <p className="text-zinc-500 dark:text-zinc-400">info@thecleancratefoods.com</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xl">📍</div>
                            <div>
                                <h3 className="font-bold text-zinc-900 dark:text-white">Visit Us</h3>
                                <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xs">M/S Unjunked , Marthanda nagar , Hyderabad, 500049</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xl">📸</div>
                            <div>
                                <h3 className="font-bold text-zinc-900 dark:text-white">Follow Us</h3>
                                <a href="https://www.instagram.com/thecleancrateofficial/" target="_blank" rel="noopener noreferrer" className="text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">@thecleancrateofficial</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-800/50 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-700 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Message</label>
                            <textarea
                                rows={4}
                                required
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all resize-none"
                                placeholder="How can we help you?"
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            disabled={status === "submitting" || status === "success"}
                            className="w-full rounded-xl bg-black dark:bg-white text-white dark:text-black py-4 font-bold tracking-wide hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {status === "submitting" ? "Sending..." : status === "success" ? "Message Sent!" : "Send Message"}
                        </button>
                        {status === "success" && (
                            <p className="text-green-600 text-sm text-center">Thanks! We'll be in touch soon.</p>
                        )}
                        {status === "error" && (
                            <p className="text-red-500 text-sm text-center">Something went wrong. Please try again.</p>
                        )}
                    </form>
                </div>
            </div>
        </section>
    )
}
