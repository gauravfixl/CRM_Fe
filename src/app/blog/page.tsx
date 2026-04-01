"use client"

import LP2Navbar from "@/components/landingpage2/LP2Navbar"
import LP2CTA from "@/components/landingpage2/LP2CTA"
import LP2Footer from "@/components/landingpage2/LP2Footer"
import { motion } from "framer-motion"
import {
    ArrowRight,
    Clock,
    Calendar,
    Tag,
    Search,
    Mail,
    TrendingUp,
    Sparkles,
    BookOpen,
    Code,
    Users,
    Lightbulb,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const fontFamily = "'Segoe UI', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif"

const categories = [
    { label: "All", icon: BookOpen },
    { label: "Product", icon: Sparkles },
    { label: "Engineering", icon: Code },
    { label: "Customer Stories", icon: Users },
    { label: "Tips", icon: Lightbulb },
]

const featuredPost = {
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80",
    category: "Product",
    title: "Introducing CubicleERP 3.0: A Complete Redesign for Modern Teams",
    excerpt:
        "We've rebuilt CubicleERP from the ground up with a new interface, faster performance, and powerful AI-driven insights that help your team work smarter, not harder.",
    author: "Sarah Chen",
    authorRole: "VP of Product",
    date: "Mar 25, 2026",
    readTime: "8 min read",
}

const blogPosts = [
    {
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80",
        category: "Engineering",
        title: "How We Scaled Our API to Handle 10M Requests Per Second",
        excerpt:
            "A deep dive into the architecture decisions and optimizations that power CubicleERP's high-performance backend.",
        date: "Mar 20, 2026",
        readTime: "12 min read",
    },
    {
        image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&q=80",
        category: "Customer Stories",
        title: "How Meridian Corp Reduced Onboarding Time by 60%",
        excerpt:
            "Learn how Meridian Corp streamlined their HR onboarding with CubicleERP's HRM module and automated workflows.",
        date: "Mar 18, 2026",
        readTime: "6 min read",
    },
    {
        image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&q=80",
        category: "Tips",
        title: "10 CRM Automation Hacks You're Not Using Yet",
        excerpt:
            "Unlock hidden productivity by leveraging these powerful but often overlooked CRM automation features in CubicleERP.",
        date: "Mar 15, 2026",
        readTime: "5 min read",
    },
    {
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80",
        category: "Product",
        title: "AI-Powered Lead Scoring: What's New in Spring 2026",
        excerpt:
            "Our latest machine learning models deliver 40% more accurate lead scoring, helping sales teams focus on what matters.",
        date: "Mar 12, 2026",
        readTime: "7 min read",
    },
    {
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80",
        category: "Engineering",
        title: "Building Real-Time Dashboards with WebSockets and React",
        excerpt:
            "An inside look at how our engineering team built the real-time reporting dashboard that updates data instantly.",
        date: "Mar 8, 2026",
        readTime: "10 min read",
    },
    {
        image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&q=80",
        category: "Customer Stories",
        title: "From Spreadsheets to CubicleERP: A Startup's Growth Story",
        excerpt:
            "How a 15-person startup used CubicleERP to professionalize their operations and scale to 200 employees.",
        date: "Mar 5, 2026",
        readTime: "6 min read",
    },
]

const categoryColors: Record<string, string> = {
    Product: "bg-blue-100 text-[#0067B8]",
    Engineering: "bg-purple-100 text-purple-700",
    "Customer Stories": "bg-green-100 text-green-700",
    Tips: "bg-amber-100 text-amber-700",
}

export default function BlogPage() {
    const [activeCategory, setActiveCategory] = useState("All")

    const filteredPosts =
        activeCategory === "All"
            ? blogPosts
            : blogPosts.filter((post) => post.category === activeCategory)

    return (
        <main className="min-h-screen bg-white" style={{ fontFamily }}>
            <LP2Navbar />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-b from-[#EBF3FB] to-white pt-32 pb-16">
                <div className="max-w-[1280px] mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <div className="inline-flex items-center gap-2 bg-white border border-[#0067B8]/20 text-[#0067B8] text-sm font-medium px-4 py-1.5 rounded-full mb-6">
                            <BookOpen className="w-4 h-4" />
                            Insights & Updates
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold text-[#1A1A1A] mb-4">
                            CubicleERP Blog
                        </h1>
                        <p className="text-lg text-[#6B7280] max-w-2xl mx-auto">
                            Product updates, engineering deep dives, customer stories, and tips to help you get the most out of CubicleERP.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Featured Post */}
            <section className="py-12">
                <div className="max-w-[1280px] mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="group relative grid md:grid-cols-2 gap-0 bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300"
                    >
                        <div className="relative h-64 md:h-auto overflow-hidden">
                            <img
                                src={featuredPost.image}
                                alt={featuredPost.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-4 left-4">
                                <span className="bg-[#0067B8] text-white text-xs font-semibold px-3 py-1 rounded-full">
                                    Featured
                                </span>
                            </div>
                        </div>
                        <div className="p-8 md:p-10 flex flex-col justify-center">
                            <span className={`inline-block w-fit text-xs font-semibold px-3 py-1 rounded-full mb-4 ${categoryColors[featuredPost.category]}`}>
                                {featuredPost.category}
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-3 group-hover:text-[#0067B8] transition-colors">
                                {featuredPost.title}
                            </h2>
                            <p className="text-[#6B7280] text-[15px] leading-relaxed mb-6">
                                {featuredPost.excerpt}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-[#6B7280]">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0067B8] to-[#0078D4] flex items-center justify-center text-white text-sm font-semibold">
                                        {featuredPost.author.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-[#1A1A1A]">{featuredPost.author}</p>
                                        <p className="text-xs text-[#6B7280]">{featuredPost.authorRole}</p>
                                    </div>
                                </div>
                                <span className="w-px h-5 bg-gray-200" />
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {featuredPost.date}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" />
                                    {featuredPost.readTime}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Category Tabs */}
            <section className="py-4">
                <div className="max-w-[1280px] mx-auto px-6">
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => {
                            const Icon = cat.icon
                            return (
                                <button
                                    key={cat.label}
                                    onClick={() => setActiveCategory(cat.label)}
                                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                                        activeCategory === cat.label
                                            ? "bg-[#0067B8] text-white shadow-md"
                                            : "bg-gray-100 text-[#6B7280] hover:bg-gray-200"
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {cat.label}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Blog Grid */}
            <section className="py-12">
                <div className="max-w-[1280px] mx-auto px-6">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPosts.map((post, i) => (
                            <motion.article
                                key={post.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-3 left-3">
                                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${categoryColors[post.category]}`}>
                                            {post.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="text-lg font-bold text-[#1A1A1A] mb-2 group-hover:text-[#0067B8] transition-colors line-clamp-2">
                                        {post.title}
                                    </h3>
                                    <p className="text-[#6B7280] text-sm leading-relaxed mb-4 line-clamp-3">
                                        {post.excerpt}
                                    </p>
                                    <div className="flex items-center gap-3 text-xs text-[#6B7280]">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {post.date}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5" />
                                            {post.readTime}
                                        </div>
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                    {filteredPosts.length === 0 && (
                        <div className="text-center py-16">
                            <p className="text-[#6B7280] text-lg">No posts found in this category yet.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="py-16 bg-gradient-to-b from-white to-[#EBF3FB]">
                <div className="max-w-[1280px] mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="max-w-2xl mx-auto text-center"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-[#0067B8]/10 flex items-center justify-center mx-auto mb-5">
                            <Mail className="w-7 h-7 text-[#0067B8]" />
                        </div>
                        <h2 className="text-3xl font-bold text-[#1A1A1A] mb-3">
                            Stay in the loop
                        </h2>
                        <p className="text-[#6B7280] mb-8">
                            Get the latest CubicleERP insights, product updates, and tips delivered straight to your inbox. No spam, unsubscribe anytime.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0067B8]/30 focus:border-[#0067B8]"
                            />
                            <button className="px-6 py-3 bg-[#0067B8] text-white text-sm font-semibold rounded-lg hover:bg-[#005a9e] transition-colors shadow-md">
                                Subscribe
                            </button>
                        </div>
                        <p className="text-xs text-[#6B7280] mt-3">
                            Join 12,000+ subscribers. We respect your privacy.
                        </p>
                    </motion.div>
                </div>
            </section>

            <LP2CTA />
            <LP2Footer />
        </main>
    )
}
