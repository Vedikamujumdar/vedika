"use client"

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ModeToggle } from "@/components/mode-toggle"
import { ArrowUp, Menu, X } from "lucide-react"
import { useCart } from "@/context/cart-context"

const NAV_LINKS = [
    { name: "Home", href: "/#home" },
    { name: "Products", href: "/#products" },
    { name: "About Us", href: "/#about" },
    { name: "Testimonials", href: "/#reviews" },
    { name: "Blogs", href: "/#blog" },
    { name: "Social", href: "/#social" },
    { name: "Contact", href: "/#contact" },
]

export function SiteHeader() {
    const [activeSection, setActiveSection] = useState("home")
    const [showScrollTop, setShowScrollTop] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const pathname = usePathname()
    const { cartCount, openCart } = useCart()

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        const handleScroll = () => {
            // Show scroll to top button
            setShowScrollTop(window.scrollY > 400)

            // Scroll Spy Logic (Only on Homepage)
            if (pathname !== "/") return

            const scrollPosition = window.scrollY + 100 // Offset

            for (const link of NAV_LINKS) {
                // Extract clean ID from /#id
                const sectionId = link.href.split("#")[1]
                const element = document.getElementById(sectionId)

                if (element) {
                    const offsetTop = element.offsetTop
                    const offsetBottom = offsetTop + element.offsetHeight

                    if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
                        setActiveSection(sectionId)
                    }
                }
            }
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [pathname])

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        // If not on homepage, let default navigation happen
        if (pathname !== "/") {
            setIsMobileMenuOpen(false)
            return
        }

        e.preventDefault()
        const sectionId = href.split("#")[1]
        const element = document.getElementById(sectionId)
        if (element) {
            const offsetTop = element.getBoundingClientRect().top + window.scrollY - 80
            window.scrollTo({ top: offsetTop, behavior: "smooth" })
            setActiveSection(sectionId)
            setIsMobileMenuOpen(false)
        }
    }

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    // Avoid hydration mismatch by not rendering until mounted
    if (!mounted) {
        return (
            <nav className="fixed top-0 z-50 w-full border-b border-zinc-100 bg-white/80 backdrop-blur-xl dark:border-zinc-800 dark:bg-black/80">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
                    {/* Static header placeholder to prevent CLS */}
                </div>
            </nav>
        )
    }

    return (
        <>
            <nav className="fixed top-0 z-50 w-full border-b border-zinc-100 bg-white/80 backdrop-blur-xl dark:border-zinc-800 dark:bg-black/80 transition-all duration-300">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
                    <Link href="/" onClick={scrollToTop} className="flex items-center gap-2 group">
                        <span className="font-heading text-xl font-bold tracking-tight text-black dark:text-white group-hover:text-blue-600 transition-colors">CLEAN CRATE</span>
                        <div className="h-2 w-2 rounded-full bg-blue-600 group-hover:scale-125 transition-transform"></div>
                    </Link>

                    <div className="hidden gap-8 lg:flex">
                        {NAV_LINKS.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={(e) => scrollToSection(e, link.href)}
                                className={`text-sm font-medium transition-all duration-200 ${activeSection === link.href.split("#")[1]
                                    ? "text-blue-600 dark:text-blue-400 font-bold"
                                    : "text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white"
                                    }`}
                            >
                                {link.name}
                                {activeSection === link.href.split("#")[1] && (
                                    <span className="block h-0.5 w-full bg-blue-600 dark:bg-blue-400 rounded-full mt-0.5 animate-in fade-in zoom-in duration-300" />
                                )}
                            </a>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <ModeToggle />
                        <a
                            href="https://cleancrate-8642.myshopify.com/account/login"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden sm:block text-sm font-medium hover:text-blue-600 dark:text-white transition-colors"
                        >
                            Login
                        </a>
                        <button
                            onClick={openCart}
                            className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition-all hover:bg-zinc-800 hover:scale-105 dark:bg-white dark:text-black dark:hover:bg-zinc-200 relative"
                        >
                            Cart ({cartCount})
                        </button>

                        {/* Hamburger Button */}
                        <button
                            className="lg:hidden p-2 text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <div className="absolute top-16 left-0 w-full bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 shadow-2xl py-4 px-6 flex flex-col gap-2 lg:hidden animate-in slide-in-from-top-4 duration-300 ease-out z-40">
                        {NAV_LINKS.map(link => (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={(e) => scrollToSection(e, link.href)}
                                className={`text-base font-semibold py-3 px-4 rounded-xl transition-all ${activeSection === link.href.split("#")[1]
                                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 pl-6"
                                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-black dark:hover:text-white"
                                    }`}
                            >
                                {link.name}
                            </a>
                        ))}
                        <div className="border-t border-zinc-100 dark:border-zinc-800 my-2 pt-2">
                            <a
                                href="https://cleancrate-8642.myshopify.com/account/login"
                                className="block w-full text-left font-semibold text-base py-3 px-4 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-xl"
                            >
                                Login
                            </a>
                        </div>
                    </div>
                )}
            </nav>

            {/* Scroll To Top Button */}
            <button
                onClick={scrollToTop}
                className={`fixed bottom-6 right-6 z-[100] p-3 rounded-full bg-blue-600 text-white shadow-xl shadow-blue-600/20 transition-all duration-500 ease-in-out hover:bg-blue-700 hover:scale-110 hover:-translate-y-1 ${showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
                    }`}
                aria-label="Scroll to top"
            >
                <ArrowUp className="w-5 h-5" />
            </button>
        </>
    )
}
