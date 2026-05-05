"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ChevronDown, Zap } from "lucide-react"
import { ThemeToggle } from "./ThemeToggle"

const navLinks = [
    {
        label: "Features",
        href: "/features",
        dropdown: [
            { label: "Lead Management", desc: "Track & convert leads", href: "/features#lead-management" },
            { label: "Analytics & Reports", desc: "Real-time insights", href: "/features#analytics" },
            { label: "Enterprise Security", desc: "SOC2, MFA, RBAC", href: "/features#security" },
            { label: "Workflow Automation", desc: "No-code automations", href: "/features#automation" },
        ],
    },
    {
        label: "Modules",
        href: "/modules",
        dropdown: [
            { label: "CRM", desc: "Clients, Leads, Deals", href: "/modules#crm" },
            { label: "Project Management", desc: "Tasks & Milestones", href: "/modules#pm" },
            { label: "HR & Payroll", desc: "Leave & Attendance", href: "/modules#hr" },
            { label: "Finance", desc: "Invoices & Expenses", href: "/modules#finance" },
        ],
    },
    { label: "Pricing", href: "/pricing" },
    { label: "Testimonials", href: "/testimonials" },
]

export default function Navbar({ solid = false }: { solid?: boolean }) {
    const [scrolled, setScrolled] = useState(solid)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

    useEffect(() => {
        if (solid) return
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener("scroll", onScroll)
        return () => window.removeEventListener("scroll", onScroll)
    }, [solid])

    const handleNavClick = (href: string) => {
        setMobileOpen(false)
        setActiveDropdown(null)
        if (href.startsWith("/")) {
            // If already on the same page, just update the hash
            const [path, hash] = href.split("#")
            if (window.location.pathname === path && hash) {
                window.location.hash = hash
                window.dispatchEvent(new HashChangeEvent("hashchange"))
            } else {
                window.location.href = href
            }
            return
        } else if (href.startsWith("#")) {
            const el = document.querySelector(href)
            if (el) {
                el.scrollIntoView({ behavior: "smooth" })
            } else {
                window.location.href = "/" + href
            }
        }
    }

    return (
        <>
            <motion.nav
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? "bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border-b border-slate-200/50 dark:border-white/[0.06] shadow-lg shadow-black/[0.03] dark:shadow-black/20"
                    : "bg-transparent"
                    }`}
            >
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <div className="relative flex items-center justify-between h-14">
                        <Link href="/" className="flex items-center gap-2 group z-10">
                            <img
                                src="/images/cubicleweb.png"
                                alt="Cubicle CRM Logo"
                                className="h-8 w-8 lg:h-9 lg:w-9 object-contain group-hover:scale-110 transition-transform duration-300"
                            />
                            <div>
                                <span className="text-slate-900 dark:text-white font-bold text-base lg:text-lg tracking-tight font-outfit transition-colors">
                                    Cubicle
                                </span>
                                <span className="text-blue-600 dark:text-blue-400 font-bold text-base lg:text-lg tracking-tight font-outfit transition-colors">
                                    CRM
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Nav - Absolutely Centered */}
                        <div className="hidden lg:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2 bg-slate-100/60 dark:bg-white/[0.04] rounded-full px-1.5 py-1 border border-slate-200/50 dark:border-white/[0.06]">
                            {navLinks.map((link) => (
                                <div
                                    key={link.label}
                                    className="relative"
                                    onMouseEnter={() => link.dropdown && setActiveDropdown(link.label)}
                                    onMouseLeave={() => setActiveDropdown(null)}
                                >
                                    <button
                                        onClick={() => handleNavClick(link.href)}
                                        className="flex items-center gap-1 px-3.5 py-1.5 text-[13px] font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full hover:bg-white dark:hover:bg-white/10 hover:shadow-sm transition-all duration-200"
                                    >
                                        {link.label}
                                        {link.dropdown && (
                                            <ChevronDown
                                                className={`w-3 h-3 transition-transform duration-200 ${activeDropdown === link.label ? "rotate-180" : ""
                                                    }`}
                                            />
                                        )}
                                    </button>

                                    {/* Dropdown */}
                                    <AnimatePresence>
                                        {link.dropdown && activeDropdown === link.label && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                                transition={{ duration: 0.15 }}
                                                className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-slate-800/95 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/40 overflow-hidden"
                                            >
                                                {link.dropdown.map((item) => (
                                                    <button
                                                        key={item.label}
                                                        onClick={(e) => {
                                                            e.preventDefault()
                                                            setActiveDropdown(null)
                                                            handleNavClick(item.href)
                                                        }}
                                                        className="w-full block text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors group"
                                                    >
                                                        <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                            {item.label}
                                                        </div>
                                                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</div>
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>

                        {/* Desktop CTA - Right */}
                        <div className="hidden lg:flex items-center gap-2.5 z-10">
                            <ThemeToggle />
                            <Link
                                href="/auth/signin"
                                className="px-4 py-1.5 text-[13px] font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/auth/signup"
                                className="relative px-4 py-2 text-[13px] font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-md shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-200 overflow-hidden group"
                            >
                                <span className="relative z-10 flex items-center gap-1.5">
                                    <Zap className="w-3.5 h-3.5" />
                                    Get Started Free
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                            </Link>
                        </div>

                        {/* Mobile Hamburger */}
                        <button
                            className="lg:hidden p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                            onClick={() => setMobileOpen(!mobileOpen)}
                        >
                            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed top-14 left-0 right-0 z-40 bg-white/98 dark:bg-slate-900/98 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 overflow-hidden"
                    >
                        <div className="max-w-7xl mx-auto px-4 py-6 space-y-2">
                            {navLinks.map((link, i) => (
                                <motion.div
                                    key={link.label}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <button
                                        onClick={() => handleNavClick(link.href)}
                                        className="w-full text-left px-4 py-3 text-base font-semibold text-slate-600 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-all"
                                    >
                                        {link.label}
                                    </button>
                                </motion.div>
                            ))}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25 }}
                                className="pt-4 flex flex-col gap-3"
                            >
                                <div className="flex justify-center mb-2">
                                    <ThemeToggle />
                                </div>
                                <Link
                                    href="/auth/signin"
                                    onClick={() => setMobileOpen(false)}
                                    className="w-full text-center px-5 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/20 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/auth/signup"
                                    onClick={() => setMobileOpen(false)}
                                    className="w-full text-center px-5 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/30"
                                >
                                    Get Started Free
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
