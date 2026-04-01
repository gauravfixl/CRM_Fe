"use client"

import LP2Navbar from "@/components/landingpage2/LP2Navbar"
import LP2CTA from "@/components/landingpage2/LP2CTA"
import LP2Footer from "@/components/landingpage2/LP2Footer"
import { motion } from "framer-motion"
import {
    BookOpen,
    Video,
    FileText,
    Users,
    Lightbulb,
    Download,
    ArrowRight,
    PlayCircle,
    GraduationCap,
    Newspaper,
    MessageSquare,
    HelpCircle,
} from "lucide-react"
import Link from "next/link"

const resourceCategories = [
    {
        icon: BookOpen,
        title: "Documentation",
        description: "Comprehensive guides and API references to help you get the most out of CubicleERP.",
        items: ["Getting Started Guide", "API Reference", "Integration Docs", "Admin Handbook"],
        color: "#0078D4",
        bgColor: "bg-blue-50",
    },
    {
        icon: Video,
        title: "Video Tutorials",
        description: "Step-by-step video walkthroughs for every feature and workflow in the platform.",
        items: ["CRM Setup", "HRM Onboarding", "Workflow Automation", "Reporting Dashboards"],
        color: "#5C2D91",
        bgColor: "bg-purple-50",
    },
    {
        icon: GraduationCap,
        title: "CubicleERP Academy",
        description: "Free online courses and certifications to master the platform at your own pace.",
        items: ["Beginner Course", "Advanced Workflows", "Admin Certification", "Developer Track"],
        color: "#107C10",
        bgColor: "bg-green-50",
    },
    {
        icon: Newspaper,
        title: "Blog & Articles",
        description: "Insights, best practices, and industry trends from our team of experts.",
        items: ["Product Updates", "Industry Insights", "Tips & Tricks", "Case Studies"],
        color: "#D83B01",
        bgColor: "bg-orange-50",
    },
    {
        icon: Users,
        title: "Community Forum",
        description: "Connect with other CubicleERP users, share ideas, and get answers from the community.",
        items: ["Discussion Boards", "Feature Requests", "Best Practices", "User Groups"],
        color: "#008575",
        bgColor: "bg-teal-50",
    },
    {
        icon: Download,
        title: "Downloads & Templates",
        description: "Ready-to-use templates, guides, and resources to accelerate your implementation.",
        items: ["Excel Templates", "PDF Guides", "Email Templates", "Workflow Blueprints"],
        color: "#C30052",
        bgColor: "bg-rose-50",
    },
]

const featuredResources = [
    {
        icon: PlayCircle,
        type: "Webinar",
        title: "Mastering CRM Automation in 2025",
        description: "Learn how to automate your sales pipeline and save 10+ hours per week with smart workflows.",
        date: "Mar 28, 2025",
    },
    {
        icon: FileText,
        type: "Whitepaper",
        title: "The Future of ERP: AI-Driven Operations",
        description: "Discover how AI is transforming enterprise resource planning and what it means for your business.",
        date: "Mar 15, 2025",
    },
    {
        icon: Lightbulb,
        type: "Guide",
        title: "Complete Guide to Digital Transformation",
        description: "A step-by-step roadmap for modernizing your business operations with integrated ERP solutions.",
        date: "Feb 20, 2025",
    },
]

const quickLinks = [
    { icon: HelpCircle, title: "Help Center", description: "Find answers to common questions", href: "/support" },
    { icon: MessageSquare, title: "Contact Support", description: "Get in touch with our team", href: "/support" },
    { icon: BookOpen, title: "API Docs", description: "Technical documentation for developers", href: "#" },
    { icon: Video, title: "Watch Demo", description: "See CubicleERP in action", href: "#" },
]

export default function ResourcesPage() {
    return (
        <main
            className="relative antialiased bg-white"
            style={{ fontFamily: "'Segoe UI', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
        >
            <LP2Navbar />

            <div className="relative pt-20 pb-16">
                {/* Background Decorations */}
                <div className="absolute top-0 left-0 right-0 h-[600px] overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute top-96 left-0 w-80 h-80 bg-indigo-600/5 rounded-full blur-[100px] -translate-x-1/2" />
                </div>

                {/* Hero Section */}
                <section className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-6"
                    >
                        <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                        <span className="text-[10px] font-black text-blue-600 tracking-[0.2em] uppercase">
                            Resources & Learning
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl lg:text-5xl font-black text-[#1A1A1A] tracking-tight mb-6"
                    >
                        Everything you need to{" "}
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">
                            succeed with CubicleERP
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg text-[#6B6B6B] max-w-2xl mx-auto mb-8"
                    >
                        Explore our documentation, tutorials, webinars, and community resources to get the most out of the platform.
                    </motion.p>
                </section>

                {/* Quick Links Bar */}
                <section className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 mb-16">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {quickLinks.map((item, index) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
                            >
                                <Link
                                    href={item.href}
                                    className="flex items-center gap-3 p-4 rounded-lg border border-blue-100 bg-blue-50 hover:border-[#0067B8] hover:shadow-md transition-all duration-300 group"
                                >
                                    <item.icon size={20} className="text-[#0067B8] shrink-0" />
                                    <div>
                                        <p className="text-sm font-semibold text-[#1A1A1A] group-hover:text-[#0067B8] transition-colors">
                                            {item.title}
                                        </p>
                                        <p className="text-xs text-[#6B6B6B]">{item.description}</p>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Resource Categories */}
                <section className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="text-3xl font-black text-[#1A1A1A] text-center mb-12"
                    >
                        Explore by Category
                    </motion.h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {resourceCategories.map((category, index) => (
                            <motion.div
                                key={category.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 + index * 0.08 }}
                                className={`border rounded-lg p-6 hover:shadow-lg transition-all duration-300 group cursor-pointer ${category.bgColor}`}
                                style={{ borderColor: `${category.color}25` }}
                            >
                                <div
                                    className={`w-12 h-12 rounded-lg ${category.bgColor} flex items-center justify-center mb-4`}
                                >
                                    <category.icon size={24} style={{ color: category.color }} />
                                </div>

                                <h3 className="text-lg font-bold text-[#1A1A1A] mb-2 group-hover:text-[#0067B8] transition-colors">
                                    {category.title}
                                </h3>
                                <p className="text-sm text-[#6B6B6B] mb-4">{category.description}</p>

                                <ul className="space-y-2">
                                    {category.items.map((item) => (
                                        <li key={item} className="flex items-center gap-2 text-sm text-[#505050]">
                                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: category.color }} />
                                            {item}
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-[#0067B8] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    Explore <ArrowRight size={14} />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Featured Resources */}
                <section className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="text-3xl font-black text-[#1A1A1A] text-center mb-4"
                    >
                        Featured Resources
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.35 }}
                        className="text-[#6B6B6B] text-center mb-12 max-w-xl mx-auto"
                    >
                        Handpicked content to help you stay ahead and make the most of your tools.
                    </motion.p>

                    <div className="grid md:grid-cols-3 gap-8">
                        {featuredResources.map((resource, index) => (
                            <motion.div
                                key={resource.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                                className="border border-blue-100 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer bg-blue-50/70"
                            >
                                <div className="h-40 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                                    <resource.icon size={48} className="text-blue-600/40 group-hover:text-blue-600/70 transition-colors duration-300" />
                                </div>
                                <div className="p-6">
                                    <span className="text-xs font-bold text-[#0067B8] uppercase tracking-wider">
                                        {resource.type}
                                    </span>
                                    <h3 className="text-lg font-bold text-[#1A1A1A] mt-2 mb-2 group-hover:text-[#0067B8] transition-colors">
                                        {resource.title}
                                    </h3>
                                    <p className="text-sm text-[#6B6B6B] mb-3">{resource.description}</p>
                                    <p className="text-xs text-[#737373]">{resource.date}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Newsletter CTA */}
                <section className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-8 text-white text-center"
                    >
                        <h3 className="text-2xl font-bold mb-4">Stay up to date</h3>
                        <p className="mb-6 text-blue-100 max-w-lg mx-auto">
                            Subscribe to our newsletter for the latest product updates, tips, and industry insights delivered to your inbox.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-3 rounded-lg text-[#1A1A1A] text-sm placeholder:text-[#6B6B6B] focus:outline-none focus:ring-2 focus:ring-white/50"
                            />
                            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-300 whitespace-nowrap">
                                Subscribe
                            </button>
                        </div>
                    </motion.div>
                </section>
            </div>

            <LP2CTA />
            <LP2Footer />
        </main>
    )
}
