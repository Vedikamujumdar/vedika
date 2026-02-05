"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export function ReviewModal({ isOpen, onClose, onSuccess }: ReviewModalProps) {
    const [rating, setRating] = useState(5)
    const [hoverRating, setHoverRating] = useState(0)
    const [name, setName] = useState("")
    const [role, setRole] = useState("Verified Buyer")
    const [text, setText] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)

        try {
            const response = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    author: name,
                    role: role,
                    rating: rating,
                    text: text,
                    date: "Just now"
                }),
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || "Failed to submit review")
            }

            setSubmitted(true)
            if (onSuccess) onSuccess()

            // Wait and close
            setTimeout(() => {
                onClose()
                // Reset form after closing
                setTimeout(() => {
                    setSubmitted(false)
                    setName("")
                    setText("")
                    setRating(5)
                }, 500)
            }, 2000)

        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-2xl z-[101] overflow-hidden"
                    >
                        {submitted ? (
                            <div className="text-center py-8">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="white" className="w-10 h-10">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                </motion.div>
                                <h3 className="text-2xl font-bold mb-2">Thank you!</h3>
                                <p className="text-zinc-500">Your review has been submitted for approval.</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-bold">Write a Review</h3>
                                    <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-zinc-500">Rating</label>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onMouseEnter={() => setHoverRating(star)}
                                                    onMouseLeave={() => setHoverRating(0)}
                                                    onClick={() => setRating(star)}
                                                    className="p-1 transition-transform active:scale-90"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                        className={`w-8 h-8 transition-colors ${star <= (hoverRating || rating) ? 'text-yellow-500' : 'text-zinc-200 dark:text-zinc-700'
                                                            }`}
                                                    >
                                                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2 text-zinc-500">Name</label>
                                            <input
                                                required
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all"
                                                placeholder="Your Name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2 text-zinc-500">Role (Optional)</label>
                                            <input
                                                type="text"
                                                value={role}
                                                onChange={(e) => setRole(e.target.value)}
                                                className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all"
                                                placeholder="Verified Buyer"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-zinc-500">Review</label>
                                        <textarea
                                            required
                                            rows={4}
                                            value={text}
                                            onChange={(e) => setText(e.target.value)}
                                            className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all resize-none"
                                            placeholder="What did you think of the product?"
                                        />
                                    </div>

                                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                                    <button
                                        disabled={isSubmitting}
                                        type="submit"
                                        className="w-full py-4 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <div className="w-5 h-5 border-2 border-white/30 dark:border-zinc-900/30 border-t-white dark:border-t-zinc-900 rounded-full animate-spin" />
                                        ) : "Submit Review"}
                                    </button>
                                </form>
                            </>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
