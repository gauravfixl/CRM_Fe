"use client"

import LP2Navbar from "@/components/landingpage2/LP2Navbar"
import LP2Footer from "@/components/landingpage2/LP2Footer"
import { motion } from "framer-motion"
import { useState } from "react"
import {
    MessageSquare,
    Chrome,
    CreditCard,
    Zap,
    Star,
    ExternalLink,
    Search,
    ArrowLeft,
    Puzzle,
    BarChart3,
    FileText,
    Mail,
    Calendar,
    Shield,
    Database,
    Headphones,
    Video,
    Cloud,
    Globe,
    Smartphone,
    Users,
    Lock,
    type LucideIcon,
} from "lucide-react"
import Link from "next/link"

interface App {
    icon: LucideIcon
    color: string
    bg: string
    company: string
    name: string
    description: string
    rating: number
    reviews: string
    category: string
    featured?: boolean
}

const categories = [
    "All",
    "Communication",
    "Productivity",
    "Payments",
    "Automation",
    "Analytics",
    "Security",
    "Storage",
    "Marketing",
    "Support",
]

const allApps: App[] = [
    {
        icon: MessageSquare,
        color: "#4CAF50",
        bg: "#E8F5E9",
        company: "Slack Technologies",
        name: "Slack",
        description: "Connect your workspace and get real-time notifications for leads, deals, and tickets. Automate updates across channels and keep your team in sync.",
        rating: 4.7,
        reviews: "12,480",
        category: "Communication",
        featured: true,
    },
    {
        icon: Chrome,
        color: "#1A73E8",
        bg: "#E3F2FD",
        company: "Google LLC",
        name: "Google Workspace",
        description: "Sync calendars, contacts, and emails with your Cubicle workspace seamlessly. Access Google Drive files directly within CubicleERP.",
        rating: 4.5,
        reviews: "98,200",
        category: "Productivity",
        featured: true,
    },
    {
        icon: CreditCard,
        color: "#6C5CE7",
        bg: "#EDE7F6",
        company: "Stripe Inc.",
        name: "Stripe Payments",
        description: "Process payments, manage subscriptions, and handle invoicing directly from Cubicle. Supports 135+ currencies worldwide.",
        rating: 4.6,
        reviews: "45,600",
        category: "Payments",
        featured: true,
    },
    {
        icon: Zap,
        color: "#FF6D00",
        bg: "#FFF3E0",
        company: "Zapier Inc.",
        name: "Zapier",
        description: "Automate workflows by connecting Cubicle with 5,000+ apps without code. Create multi-step Zaps for complex business processes.",
        rating: 4.4,
        reviews: "32,100",
        category: "Automation",
        featured: true,
    },
    {
        icon: Video,
        color: "#0078D4",
        bg: "#E3F2FD",
        company: "Microsoft Corp.",
        name: "Microsoft Teams",
        description: "Integrate Teams meetings and chats with CubicleERP. Schedule meetings from deals, get CRM notifications in Teams channels.",
        rating: 4.5,
        reviews: "67,300",
        category: "Communication",
    },
    {
        icon: BarChart3,
        color: "#E91E63",
        bg: "#FCE4EC",
        company: "Tableau Software",
        name: "Tableau Analytics",
        description: "Connect CubicleERP data to Tableau for advanced visualizations, custom dashboards, and deep business intelligence reporting.",
        rating: 4.3,
        reviews: "18,900",
        category: "Analytics",
    },
    {
        icon: Mail,
        color: "#D44638",
        bg: "#FFEBEE",
        company: "Mailchimp",
        name: "Mailchimp",
        description: "Sync contacts and segments from CubicleERP to Mailchimp. Track email campaign performance and automate follow-ups.",
        rating: 4.2,
        reviews: "54,100",
        category: "Marketing",
    },
    {
        icon: FileText,
        color: "#0067B8",
        bg: "#E3F2FD",
        company: "DocuSign Inc.",
        name: "DocuSign",
        description: "Send, sign, and manage documents electronically. Automate contract workflows and get legally binding e-signatures.",
        rating: 4.6,
        reviews: "38,400",
        category: "Productivity",
    },
    {
        icon: Calendar,
        color: "#4285F4",
        bg: "#E8F0FE",
        company: "Calendly LLC",
        name: "Calendly",
        description: "Automate meeting scheduling with clients and prospects. Sync availability and embed booking links in your CRM workflows.",
        rating: 4.5,
        reviews: "29,700",
        category: "Productivity",
    },
    {
        icon: Shield,
        color: "#00897B",
        bg: "#E0F2F1",
        company: "Okta Inc.",
        name: "Okta SSO",
        description: "Enterprise-grade single sign-on and multi-factor authentication. Centralize identity management across your organization.",
        rating: 4.7,
        reviews: "22,300",
        category: "Security",
    },
    {
        icon: Database,
        color: "#FF9800",
        bg: "#FFF3E0",
        company: "Snowflake Inc.",
        name: "Snowflake",
        description: "Sync CubicleERP data to Snowflake data warehouse for advanced analytics, machine learning, and cross-platform reporting.",
        rating: 4.4,
        reviews: "15,800",
        category: "Storage",
    },
    {
        icon: Headphones,
        color: "#7B1FA2",
        bg: "#F3E5F5",
        company: "Zendesk Inc.",
        name: "Zendesk",
        description: "Two-way sync between CubicleERP and Zendesk. View customer tickets alongside CRM data for complete context.",
        rating: 4.3,
        reviews: "41,200",
        category: "Support",
    },
    {
        icon: Cloud,
        color: "#0288D1",
        bg: "#E1F5FE",
        company: "Dropbox Inc.",
        name: "Dropbox Business",
        description: "Attach and access Dropbox files from any CubicleERP record. Auto-organize files by client, project, or deal.",
        rating: 4.2,
        reviews: "27,600",
        category: "Storage",
    },
    {
        icon: Globe,
        color: "#43A047",
        bg: "#E8F5E9",
        company: "HubSpot Inc.",
        name: "HubSpot Marketing",
        description: "Sync leads and contacts between CubicleERP and HubSpot. Track marketing attribution and campaign ROI in one place.",
        rating: 4.4,
        reviews: "36,500",
        category: "Marketing",
    },
    {
        icon: Smartphone,
        color: "#5C6BC0",
        bg: "#E8EAF6",
        company: "Twilio Inc.",
        name: "Twilio SMS",
        description: "Send SMS notifications, reminders, and alerts from CubicleERP. Automate text message workflows for leads and support.",
        rating: 4.3,
        reviews: "19,800",
        category: "Communication",
    },
    {
        icon: Users,
        color: "#26A69A",
        bg: "#E0F2F1",
        company: "Intercom Inc.",
        name: "Intercom",
        description: "Live chat and customer messaging platform integrated with your CRM. Convert visitors to leads with automated chatbots.",
        rating: 4.5,
        reviews: "33,400",
        category: "Support",
    },
    {
        icon: Lock,
        color: "#F44336",
        bg: "#FFEBEE",
        company: "1Password",
        name: "1Password Business",
        description: "Secure password management for your team. Auto-fill credentials and manage access to shared accounts securely.",
        rating: 4.6,
        reviews: "28,900",
        category: "Security",
    },
    {
        icon: BarChart3,
        color: "#FF7043",
        bg: "#FBE9E7",
        company: "Mixpanel Inc.",
        name: "Mixpanel",
        description: "Product analytics integrated with CubicleERP. Track user behavior, feature adoption, and product-led growth metrics.",
        rating: 4.3,
        reviews: "14,200",
        category: "Analytics",
    },
]

function StarRating({ rating }: { rating: number }) {
    const fullStars = Math.floor(rating)
    const hasHalf = rating - fullStars >= 0.3
    return (
        <span className="flex items-center gap-0.5">
            {Array.from({ length: 5 }, (_, i) => (
                <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${i < fullStars
                        ? "fill-[#F59E0B] text-[#F59E0B]"
                        : i === fullStars && hasHalf
                            ? "fill-[#F59E0B]/50 text-[#F59E0B]"
                            : "fill-[#E5E5E5] text-[#E5E5E5]"
                        }`}
                />
            ))}
        </span>
    )
}

export default function MarketplacePage() {
    const [activeCategory, setActiveCategory] = useState("All")
    const [searchQuery, setSearchQuery] = useState("")

    const filteredApps = allApps.filter((app) => {
        const matchesCategory = activeCategory === "All" || app.category === activeCategory
        const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.description.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
    })

    const featuredApps = allApps.filter((app) => app.featured)

    return (
        <main
            className="relative antialiased bg-white"
            style={{ fontFamily: "'Segoe UI', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
        >
            <LP2Navbar />

            <div className="relative pt-20 pb-16">
                {/* Background */}
                <div className="absolute top-0 left-0 right-0 h-[600px] overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
                    <div className="absolute top-[300px] left-0 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[120px] -translate-x-1/3" />
                </div>

                {/* Back button */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 mb-8">
                    <Link
                        href="/#apps-addons"
                        className="inline-flex items-center gap-2 text-sm font-medium text-[#505050] hover:text-[#0067B8] transition-colors group"
                    >
                        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                        Back to home
                    </Link>
                </div>

                {/* Hero */}
                <section className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-6"
                    >
                        <Puzzle className="w-3.5 h-3.5 text-blue-600" />
                        <span className="text-[10px] font-black text-blue-600 tracking-[0.2em] uppercase">
                            Marketplace
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl lg:text-5xl font-black text-[#1A1A1A] tracking-tight mb-6"
                    >
                        Apps & Integrations for{" "}
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500">
                            every workflow
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg text-[#6B6B6B] max-w-2xl mx-auto mb-8"
                    >
                        Browse 200+ integrations to connect your favorite tools with CubicleERP and supercharge your business.
                    </motion.p>

                    {/* Search */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="max-w-xl mx-auto"
                    >
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B6B6B]" />
                            <input
                                type="text"
                                placeholder="Search apps by name, company, or description..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-[#E5E5E5] text-sm text-[#1A1A1A] placeholder:text-[#6B6B6B] focus:outline-none focus:border-[#0067B8] focus:ring-1 focus:ring-[#0067B8] transition-all bg-white shadow-sm"
                            />
                        </div>
                    </motion.div>
                </section>

                {/* Category Filter */}
                <section className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.35 }}
                        className="flex gap-2 overflow-x-auto scrollbar-hide pb-2"
                    >
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all duration-300 ${activeCategory === cat
                                    ? "bg-[#0067B8] text-white shadow-md"
                                    : "bg-white text-[#505050] border border-[#E5E5E5] hover:border-[#0067B8] hover:text-[#0067B8]"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </motion.div>
                </section>

                {/* Featured Apps (only show when "All" and no search) */}
                {activeCategory === "All" && !searchQuery && (
                    <section className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 mb-16">
                        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">Featured Apps</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
                            {featuredApps.map((app, index) => {
                                const Icon = app.icon
                                return (
                                    <motion.div
                                        key={app.name + "-featured"}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.08 }}
                                        className="relative rounded-2xl border-2 p-5 group cursor-pointer transition-all duration-300 overflow-hidden"
                                        style={{ borderColor: app.color + "25", backgroundColor: app.bg + "60" }}
                                    >
                                        <motion.div
                                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                            style={{ background: `radial-gradient(circle at top right, ${app.color}12, transparent 70%)` }}
                                        />
                                        <div className="relative">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: app.bg }}>
                                                    <Icon size={22} style={{ color: app.color }} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-[#1A1A1A]">{app.name}</p>
                                                    <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: app.color }}>{app.company}</p>
                                                </div>
                                            </div>
                                            <p className="text-xs text-[#505050] line-clamp-2 mb-3">{app.description}</p>
                                            <div className="flex items-center gap-2">
                                                <StarRating rating={app.rating} />
                                                <span className="text-xs text-[#6B6B6B]">{app.rating}</span>
                                                <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: app.bg, color: app.color }}>
                                                    Featured
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </section>
                )}

                {/* All Apps Grid */}
                <section className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 mb-16">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-[#1A1A1A]">
                            {activeCategory === "All" ? "All Apps" : activeCategory}
                        </h2>
                        <span className="text-sm text-[#6B6B6B]">{filteredApps.length} apps</span>
                    </div>

                    {filteredApps.length === 0 ? (
                        <div className="text-center py-20">
                            <Search size={48} className="text-[#E5E5E5] mx-auto mb-4" />
                            <p className="text-lg font-semibold text-[#1A1A1A]">No apps found</p>
                            <p className="text-sm text-[#6B6B6B] mt-1">Try adjusting your search or filter criteria.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {filteredApps.map((app, index) => {
                                const Icon = app.icon
                                return (
                                    <motion.div
                                        key={app.name}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.05 }}
                                        whileHover={{ y: -4, boxShadow: `0 12px 30px ${app.color}15` }}
                                        className="bg-white rounded-2xl border-2 p-6 flex flex-col group cursor-pointer transition-all duration-300 relative overflow-hidden"
                                        style={{ borderColor: app.color + "20" }}
                                    >
                                        {/* Hover glow */}
                                        <div
                                            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                            style={{ background: `radial-gradient(circle at top right, ${app.color}08, transparent 70%)` }}
                                        />
                                        {/* Top accent */}
                                        <div className="absolute top-0 left-6 right-6 h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: app.color }} />

                                        <div className="relative">
                                            {/* Category tag */}
                                            <span
                                                className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4"
                                                style={{ backgroundColor: app.bg, color: app.color }}
                                            >
                                                {app.category}
                                            </span>

                                            {/* Icon + Company */}
                                            <div className="flex items-center gap-3 mb-3">
                                                <motion.div
                                                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                                                    style={{ backgroundColor: app.bg }}
                                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                                >
                                                    <Icon size={24} style={{ color: app.color }} />
                                                </motion.div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-[#1A1A1A] group-hover:text-[#0067B8] transition-colors">
                                                        {app.name}
                                                    </h3>
                                                    <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: app.color }}>
                                                        {app.company}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Description */}
                                            <p className="text-sm text-[#505050] leading-relaxed mb-4">
                                                {app.description}
                                            </p>

                                            {/* Bottom */}
                                            <div className="flex items-center pt-4 border-t border-[#F0F0F0]">
                                                <div className="flex items-center gap-2">
                                                    <StarRating rating={app.rating} />
                                                    <span className="text-sm font-medium text-[#505050]">{app.rating}</span>
                                                    <span className="text-xs text-[#6B6B6B]">({app.reviews})</span>
                                                </div>
                                                <motion.span
                                                    className="ml-auto flex items-center gap-1.5 text-sm font-semibold"
                                                    style={{ color: app.color }}
                                                    whileHover={{ x: 3 }}
                                                >
                                                    Details
                                                    <ExternalLink size={14} />
                                                </motion.span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>
                    )}
                </section>

                {/* CTA */}
                <section className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-xl p-10 text-white text-center"
                    >
                        <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                            Can&apos;t find what you need?
                        </h3>
                        <p className="mb-8 text-blue-100 max-w-lg mx-auto">
                            Build your own integration with our REST API or request a new integration from our team.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/resources"
                                className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-8 py-3.5 rounded-lg font-semibold hover:bg-blue-50 transition-colors hover:-translate-y-0.5 hover:shadow-lg"
                            >
                                View API Docs
                            </Link>
                            <Link
                                href="/support"
                                className="inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-white/10 transition-all hover:-translate-y-0.5"
                            >
                                Request Integration
                            </Link>
                        </div>
                    </motion.div>
                </section>
            </div>

            <LP2Footer />
        </main>
    )
}
