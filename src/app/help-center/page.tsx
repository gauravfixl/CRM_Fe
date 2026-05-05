"use client"

import LP2Navbar from "@/components/landingpage2/LP2Navbar"
import LP2CTA from "@/components/landingpage2/LP2CTA"
import LP2Footer from "@/components/landingpage2/LP2Footer"
import { motion } from "framer-motion"
import {
    Search,
    BookOpen,
    CreditCard,
    Users,
    UserCheck,
    Puzzle,
    Code,
    ArrowRight,
    FileText,
    MessageCircle,
    Phone,
    Mail,
    ChevronRight,
    HelpCircle,
    Zap,
    Shield,
    Settings,
    BarChart3,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const fontFamily = "'Segoe UI', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif"

const categories = [
    {
        icon: BookOpen,
        title: "Getting Started",
        description: "Set up your account and learn the basics in minutes.",
        articles: 24,
        color: "#0067B8",
        bgColor: "bg-blue-50",
    },
    {
        icon: CreditCard,
        title: "Account & Billing",
        description: "Manage subscriptions, invoices, and payment methods.",
        articles: 18,
        color: "#107C10",
        bgColor: "bg-green-50",
    },
    {
        icon: Users,
        title: "CRM",
        description: "Leads, contacts, deals, and pipeline management guides.",
        articles: 42,
        color: "#5C2D91",
        bgColor: "bg-purple-50",
    },
    {
        icon: UserCheck,
        title: "HRM",
        description: "Employee management, payroll, attendance, and leave.",
        articles: 36,
        color: "#D83B01",
        bgColor: "bg-orange-50",
    },
    {
        icon: Puzzle,
        title: "Integrations",
        description: "Connect CubicleERP with your favorite tools and apps.",
        articles: 15,
        color: "#008575",
        bgColor: "bg-teal-50",
    },
    {
        icon: Code,
        title: "API & Developers",
        description: "REST API documentation, webhooks, and SDKs.",
        articles: 28,
        color: "#C30052",
        bgColor: "bg-rose-50",
    },
]

const popularArticles = [
    {
        icon: Zap,
        title: "How to set up your first CRM pipeline",
        category: "CRM",
        readTime: "3 min",
    },
    {
        icon: Settings,
        title: "Configuring SSO and team permissions",
        category: "Account & Billing",
        readTime: "5 min",
    },
    {
        icon: Users,
        title: "Importing contacts from CSV or other CRMs",
        category: "Getting Started",
        readTime: "4 min",
    },
    {
        icon: BarChart3,
        title: "Building custom reports and dashboards",
        category: "CRM",
        readTime: "6 min",
    },
    {
        icon: Shield,
        title: "Understanding roles, permissions, and data access",
        category: "Account & Billing",
        readTime: "4 min",
    },
    {
        icon: Puzzle,
        title: "Connecting CubicleERP with Slack and Gmail",
        category: "Integrations",
        readTime: "3 min",
    },
    {
        icon: FileText,
        title: "Creating and sending invoices to clients",
        category: "CRM",
        readTime: "4 min",
    },
    {
        icon: UserCheck,
        title: "Setting up employee onboarding workflows",
        category: "HRM",
        readTime: "5 min",
    },
]

export default function HelpCenterPage() {
    const [searchQuery, setSearchQuery] = useState("")

    return (
        <main className="min-h-screen bg-white" style={{ fontFamily }}>
            <LP2Navbar />

            {/* Hero Section with Search */}
            <section className="relative bg-gradient-to-b from-[#0067B8] to-[#0078D4] pt-32 pb-20">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
                </div>
                <div className="max-w-[1280px] mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6">
                            <HelpCircle className="w-4 h-4" />
                            Help Center
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                            How can we help?
                        </h1>
                        <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
                            Search our knowledge base or browse categories to find the answers you need.
                        </p>
                        <div className="relative max-w-xl mx-auto">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for articles, guides, and tutorials..."
                                className="w-full pl-12 pr-4 py-4 rounded-xl text-[15px] text-[#1A1A1A] bg-white shadow-xl focus:outline-none focus:ring-2 focus:ring-white/50"
                            />
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                            <span className="text-white/60 text-sm">Popular:</span>
                            {["SSO setup", "Import contacts", "API keys", "Billing"].map((term) => (
                                <button
                                    key={term}
                                    onClick={() => setSearchQuery(term)}
                                    className="text-sm text-white/80 bg-white/10 px-3 py-1 rounded-full hover:bg-white/20 transition-colors"
                                >
                                    {term}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Category Cards */}
            <section className="py-16 -mt-8">
                <div className="max-w-[1280px] mx-auto px-6">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((cat, i) => {
                            const Icon = cat.icon
                            return (
                                <motion.div
                                    key={cat.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: i * 0.08 }}
                                    className="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                                >
                                    <div
                                        className={`w-12 h-12 rounded-xl ${cat.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                                    >
                                        <Icon className="w-6 h-6" style={{ color: cat.color }} />
                                    </div>
                                    <h3 className="text-lg font-bold text-[#1A1A1A] mb-1 group-hover:text-[#0067B8] transition-colors">
                                        {cat.title}
                                    </h3>
                                    <p className="text-sm text-[#6B7280] mb-3">{cat.description}</p>
                                    <div className="flex items-center gap-1 text-sm font-medium text-[#0067B8]">
                                        {cat.articles} articles
                                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Popular Articles */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-[1280px] mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-10"
                    >
                        <h2 className="text-3xl font-bold text-[#1A1A1A] mb-2">Popular Articles</h2>
                        <p className="text-[#6B7280]">The most-read guides from our knowledge base.</p>
                    </motion.div>
                    <div className="grid sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
                        {popularArticles.map((article, i) => {
                            const Icon = article.icon
                            return (
                                <motion.div
                                    key={article.title}
                                    initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: i * 0.06 }}
                                    className="group flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-[#0067B8]/30 transition-all cursor-pointer"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-[#EBF3FB] flex items-center justify-center shrink-0">
                                        <Icon className="w-5 h-5 text-[#0067B8]" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-semibold text-[#1A1A1A] group-hover:text-[#0067B8] transition-colors truncate">
                                            {article.title}
                                        </h4>
                                        <div className="flex items-center gap-2 text-xs text-[#6B7280] mt-0.5">
                                            <span>{article.category}</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                                            <span>{article.readTime}</span>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-[#6B7280] group-hover:text-[#0067B8] shrink-0" />
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Contact Support CTA */}
            <section className="py-16">
                <div className="max-w-[1280px] mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-10"
                    >
                        <h2 className="text-3xl font-bold text-[#1A1A1A] mb-2">Still need help?</h2>
                        <p className="text-[#6B7280]">Our support team is available 24/7 to assist you.</p>
                    </motion.div>
                    <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
                        {[
                            {
                                icon: MessageCircle,
                                title: "Live Chat",
                                description: "Chat with our support team in real time.",
                                action: "Start Chat",
                                color: "#0067B8",
                                bgColor: "bg-blue-50",
                            },
                            {
                                icon: Mail,
                                title: "Email Support",
                                description: "Get a response within 2 hours, guaranteed.",
                                action: "Send Email",
                                color: "#107C10",
                                bgColor: "bg-green-50",
                            },
                            {
                                icon: Phone,
                                title: "Phone Support",
                                description: "Speak directly with a product specialist.",
                                action: "Call Us",
                                color: "#5C2D91",
                                bgColor: "bg-purple-50",
                            },
                        ].map((channel, i) => {
                            const Icon = channel.icon
                            return (
                                <motion.div
                                    key={channel.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    className="group text-center bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                                >
                                    <div
                                        className={`w-14 h-14 rounded-2xl ${channel.bgColor} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                                    >
                                        <Icon className="w-7 h-7" style={{ color: channel.color }} />
                                    </div>
                                    <h3 className="text-lg font-bold text-[#1A1A1A] mb-1">{channel.title}</h3>
                                    <p className="text-sm text-[#6B7280] mb-4">{channel.description}</p>
                                    <span
                                        className="inline-flex items-center gap-1 text-sm font-semibold transition-colors"
                                        style={{ color: channel.color }}
                                    >
                                        {channel.action}
                                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </section>

            <LP2CTA />
            <LP2Footer />
        </main>
    )
}
