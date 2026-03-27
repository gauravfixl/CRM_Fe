"use client"

import Link from "next/link"
import { Twitter, Linkedin, Github, Mail, ArrowRight } from "lucide-react"

const footerLinks = [
    {
        title: "Product",
        links: [
            { label: "Features", href: "/#features" },
            { label: "Modules", href: "/#modules" },
            { label: "Pricing", href: "/pricing" },
            { label: "Security", href: "/#features" },
            { label: "Roadmap", href: "#" },
        ],
    },
    {
        title: "Platform",
        links: [
            { label: "Sign In", href: "/auth/signin" },
            { label: "Sign Up", href: "/auth/signup" },
            { label: "Create Organisation", href: "/auth/create-org" },
            { label: "Documentation", href: "#" },
            { label: "API Status", href: "#" },
        ],
    },
    {
        title: "Company",
        links: [
            { label: "Testimonials", href: "/testimonials" },
            { label: "Blog", href: "#" },
            { label: "Careers", href: "#" },
            { label: "Contact", href: "mailto:hello@cubiclecrm.com" },
            { label: "Partners", href: "#" },
        ],
    },
    {
        title: "Legal",
        links: [
            { label: "Privacy Policy", href: "#" },
            { label: "Terms of Service", href: "#" },
            { label: "Cookie Policy", href: "#" },
            { label: "GDPR", href: "#" },
            { label: "Security Policy", href: "#" },
        ],
    },
]

const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Mail, href: "mailto:hello@cubiclecrm.com", label: "Email" },
]

export default function Footer() {
    const handleNavClick = (href: string) => {
        if (href.startsWith("#")) {
            const el = document.querySelector(href)
            if (el) el.scrollIntoView({ behavior: "smooth" })
        }
    }

    return (
        <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-white/10 transition-colors duration-500">
            {/* Newsletter strip */}
            <div className="border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-slate-900 dark:text-white font-bold text-lg">Stay in the loop</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                                Get product updates, tips, and growth insights delivered weekly.
                            </p>
                        </div>
                        <div className="flex gap-3 w-full sm:w-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 sm:w-64 px-4 py-2.5 bg-white dark:bg-white/10 border border-slate-200 dark:border-white/20 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                            />
                            <button className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 flex items-center gap-2 whitespace-nowrap hover:scale-105">
                                Subscribe
                                <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                    {/* Brand column */}
                    <div className="lg:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4 group">
                            <img
                                src="/images/cubicleweb.png"
                                alt="Cubicle CRM Logo"
                                className="h-10 w-10 object-contain group-hover:scale-110 transition-transform duration-300"
                            />
                            <div>
                                <span className="text-slate-900 dark:text-white font-bold text-lg tracking-tight">Cubicle</span>
                                <span className="text-blue-600 dark:text-blue-400 font-bold text-lg tracking-tight">CRM</span>
                            </div>
                        </Link>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
                            Enterprise CRM platform for managing leads, clients, projects, HR, and finance — all
                            in one unified workspace.
                        </p>
                        {/* Social links */}
                        <div className="flex gap-3">
                            {socialLinks.map(({ icon: Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    className="w-8 h-8 bg-white/10 hover:bg-blue-600 border border-white/10 hover:border-blue-600 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200"
                                >
                                    <Icon className="w-3.5 h-3.5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {footerLinks.map((col) => (
                        <div key={col.title} className="lg:col-span-1">
                            <h4 className="text-slate-900 dark:text-white font-bold text-sm uppercase tracking-widest mb-4">
                                {col.title}
                            </h4>
                            <ul className="space-y-2.5">
                                {col.links.map((link) => (
                                    <li key={link.label}>
                                        {link.href.startsWith("#") ? (
                                            <button
                                                onClick={() => handleNavClick(link.href)}
                                                className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white text-sm transition-colors duration-200 hover:translate-x-1 inline-block transition-transform"
                                            >
                                                {link.label}
                                            </button>
                                        ) : (
                                            <Link
                                                href={link.href}
                                                className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white text-sm transition-colors duration-200 hover:translate-x-1 inline-block transition-transform"
                                            >
                                                {link.label}
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-slate-200 dark:border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-slate-500 dark:text-slate-400 text-xs">
                        © {new Date().getFullYear()} Cubicle CRM by Fixl Solutions. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <div className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            </div>
                            All systems operational
                        </div>
                        <span className="text-slate-700">·</span>
                        <span className="text-slate-500 text-xs">Built with ❤️ in India</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
