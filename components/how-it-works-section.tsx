"use client"

import Image from "next/image"

export function HowItWorksSection() {
    return (
        <section className="py-24 bg-zinc-50 dark:bg-zinc-900">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <span className="block text-center text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-sm mb-4">
                    Simple Process
                </span>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-center text-zinc-900 dark:text-white mb-16">
                    How The Clean Crate Fits Into Your Day
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Step 1 */}
                    <div className="group flex flex-col rounded-3xl overflow-hidden bg-white dark:bg-zinc-800 shadow-md hover:shadow-xl transition-all duration-300">
                        <div className="w-full bg-zinc-50 dark:bg-zinc-700 flex justify-center items-center overflow-hidden">
                            <Image
                                src="/how-it-works-1.png"
                                alt="Add Milk or Water"
                                width={400}
                                height={300}
                                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        <div className="flex-1 bg-blue-900 dark:bg-blue-950 p-6 text-center flex flex-col justify-center">
                            <h3 className="font-bold text-xl text-white mb-2">1. Add Milk or Water</h3>
                            <p className="text-blue-100 text-sm font-medium">(Oats with magic)</p>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="group flex flex-col rounded-3xl overflow-hidden bg-white dark:bg-zinc-800 shadow-md hover:shadow-xl transition-all duration-300">
                        <div className="w-full bg-zinc-50 dark:bg-zinc-700 flex justify-center items-center overflow-hidden">
                            <Image
                                src="/how-it-works-2.png"
                                alt="Rest Overnight"
                                width={400}
                                height={300}
                                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        <div className="flex-1 bg-blue-900 dark:bg-blue-950 p-6 text-center flex flex-col justify-center">
                            <h3 className="font-bold text-xl text-white mb-2">2. Let it rest for a while/Refrigerate it</h3>
                            <p className="text-blue-100 text-sm font-medium">(or 10 min hot)</p>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="group flex flex-col rounded-3xl overflow-hidden bg-white dark:bg-zinc-800 shadow-md hover:shadow-xl transition-all duration-300">
                        <div className="w-full bg-zinc-50 dark:bg-zinc-700 flex justify-center items-center overflow-hidden">
                            <Image
                                src="/how-it-works-3.png"
                                alt="No Guilt Placard"
                                width={400}
                                height={300}
                                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        <div className="flex-1 bg-blue-900 dark:bg-blue-950 p-6 text-center flex flex-col justify-center">
                            <h3 className="font-bold text-xl text-white mb-2">3. Eat. No Guilt</h3>
                            <p className="text-blue-100 text-sm font-medium">(added Protien)</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
