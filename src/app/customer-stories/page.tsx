"use client"

import LP2Navbar from "@/components/landingpage2/LP2Navbar"
import LP2CTA from "@/components/landingpage2/LP2CTA"
import LP2Footer from "@/components/landingpage2/LP2Footer"
import { motion } from "framer-motion"
import {
    ArrowRight,
    Building2,
    TrendingUp,
    Quote,
    Star,
    Users,
    BarChart3,
    ShoppingCart,
    Stethoscope,
    Briefcase,
    Factory,
    Globe,
    CheckCircle2,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const fontFamily = "'Segoe UI', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif"

const industries = [
    { label: "All Industries", icon: Globe },
    { label: "SaaS", icon: Globe },
    { label: "Retail", icon: ShoppingCart },
    { label: "Healthcare", icon: Stethoscope },
    { label: "Consulting", icon: Briefcase },
    { label: "Manufacturing", icon: Factory },
]

const stats = [
    { value: "500+", label: "Companies Trust CubicleERP", icon: Building2 },
    { value: "40%", label: "Average Productivity Increase", icon: TrendingUp },
    { value: "98%", label: "Customer Satisfaction Rate", icon: Star },
    { value: "2.5M+", label: "Users Worldwide", icon: Users },
]

const stories = [
    {
        company: "Meridian Technologies",
        industry: "SaaS",
        logo: "MT",
        logoColor: "from-blue-500 to-blue-700",
        quote: "CubicleERP transformed our sales pipeline. We went from losing deals in spreadsheets to closing 35% more revenue within the first quarter.",
        person: "Alex Rivera",
        role: "VP of Sales",
        metrics: [
            { label: "Revenue Growth", value: "+35%" },
            { label: "Deal Close Rate", value: "+28%" },
            { label: "Time Saved Weekly", value: "12 hrs" },
        ],
    },
    {
        company: "HealthFirst Clinics",
        industry: "Healthcare",
        logo: "HF",
        logoColor: "from-green-500 to-emerald-700",
        quote: "Managing 200+ staff across 8 clinics was chaos. CubicleERP's HRM module unified everything -- scheduling, payroll, compliance -- into one seamless platform.",
        person: "Dr. Priya Sharma",
        role: "Chief Operating Officer",
        metrics: [
            { label: "Onboarding Time", value: "-60%" },
            { label: "Compliance Issues", value: "-90%" },
            { label: "Staff Satisfaction", value: "+45%" },
        ],
    },
    {
        company: "Urban Retail Group",
        industry: "Retail",
        logo: "UR",
        logoColor: "from-orange-500 to-red-600",
        quote: "We replaced 5 separate tools with CubicleERP. The integrated CRM and invoicing alone saved us $50K per year in software costs.",
        person: "James O'Brien",
        role: "Director of Operations",
        metrics: [
            { label: "Cost Savings", value: "$50K/yr" },
            { label: "Tools Consolidated", value: "5 to 1" },
            { label: "Team Adoption", value: "100%" },
        ],
    },
    {
        company: "Apex Consulting",
        industry: "Consulting",
        logo: "AC",
        logoColor: "from-purple-500 to-purple-700",
        quote: "Our consultants can now track client engagements, log hours, and generate invoices in one place. Project profitability visibility increased dramatically.",
        person: "Maria Gonzalez",
        role: "Managing Partner",
        metrics: [
            { label: "Project Profitability", value: "+22%" },
            { label: "Billing Accuracy", value: "99.5%" },
            { label: "Admin Time Reduced", value: "-70%" },
        ],
    },
    {
        company: "SteelWorks Manufacturing",
        industry: "Manufacturing",
        logo: "SW",
        logoColor: "from-gray-600 to-gray-800",
        quote: "CubicleERP's project management and inventory tracking gave us real-time visibility into our production pipeline for the first time in 20 years.",
        person: "Robert Kim",
        role: "Plant Manager",
        metrics: [
            { label: "Production Delays", value: "-40%" },
            { label: "Inventory Accuracy", value: "98%" },
            { label: "ROI Timeline", value: "3 months" },
        ],
    },
    {
        company: "NovaTech Solutions",
        industry: "SaaS",
        logo: "NT",
        logoColor: "from-cyan-500 to-blue-600",
        quote: "Scaling from 20 to 150 employees would have been impossible without CubicleERP. It grew with us at every stage -- from seed to Series B.",
        person: "Emily Zhang",
        role: "CEO & Co-Founder",
        metrics: [
            { label: "Team Growth", value: "7.5x" },
            { label: "Process Automation", value: "80%" },
            { label: "Data-Driven Decisions", value: "+65%" },
        ],
    },
]

export default function CustomerStoriesPage() {
    const [activeIndustry, setActiveIndustry] = useState("All Industries")

    const filteredStories =
        activeIndustry === "All Industries"
            ? stories
            : stories.filter((s) => s.industry === activeIndustry)

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
                            <Star className="w-4 h-4" />
                            Real Results, Real Teams
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold text-[#1A1A1A] mb-4">
                            Customer Stories
                        </h1>
                        <p className="text-lg text-[#6B7280] max-w-2xl mx-auto">
                            Discover how companies across industries use CubicleERP to streamline operations, boost productivity, and drive growth.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Stats Banner */}
            <section className="py-12">
                <div className="max-w-[1280px] mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-6"
                    >
                        {stats.map((stat, i) => {
                            const Icon = stat.icon
                            return (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    className="text-center p-6 rounded-xl bg-gradient-to-b from-[#EBF3FB] to-white border border-gray-100"
                                >
                                    <div className="w-11 h-11 rounded-xl bg-[#0067B8]/10 flex items-center justify-center mx-auto mb-3">
                                        <Icon className="w-5 h-5 text-[#0067B8]" />
                                    </div>
                                    <p className="text-3xl font-bold text-[#0067B8] mb-1">{stat.value}</p>
                                    <p className="text-sm text-[#6B7280]">{stat.label}</p>
                                </motion.div>
                            )
                        })}
                    </motion.div>
                </div>
            </section>

            {/* Industry Filters */}
            <section className="py-4">
                <div className="max-w-[1280px] mx-auto px-6">
                    <div className="flex flex-wrap gap-2">
                        {industries.map((ind) => {
                            const Icon = ind.icon
                            return (
                                <button
                                    key={ind.label}
                                    onClick={() => setActiveIndustry(ind.label)}
                                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                                        activeIndustry === ind.label
                                            ? "bg-[#0067B8] text-white shadow-md"
                                            : "bg-gray-100 text-[#6B7280] hover:bg-gray-200"
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {ind.label}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Customer Stories Grid */}
            <section className="py-12">
                <div className="max-w-[1280px] mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-8">
                        {filteredStories.map((story, i) => (
                            <motion.div
                                key={story.company}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="group bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${story.logoColor} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                                        {story.logo}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-[#1A1A1A]">{story.company}</h3>
                                        <span className="text-sm text-[#6B7280]">{story.industry}</span>
                                    </div>
                                </div>

                                <div className="relative mb-6">
                                    <Quote className="w-8 h-8 text-[#0067B8]/15 absolute -top-1 -left-1" />
                                    <p className="text-[#1A1A1A] text-[15px] leading-relaxed pl-6 italic">
                                        &ldquo;{story.quote}&rdquo;
                                    </p>
                                </div>

                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-[#1A1A1A]">
                                        {story.person.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-[#1A1A1A]">{story.person}</p>
                                        <p className="text-xs text-[#6B7280]">{story.role}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3 pt-5 border-t border-gray-100">
                                    {story.metrics.map((metric) => (
                                        <div key={metric.label} className="text-center">
                                            <p className="text-lg font-bold text-[#0067B8]">{metric.value}</p>
                                            <p className="text-xs text-[#6B7280]">{metric.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    {filteredStories.length === 0 && (
                        <div className="text-center py-16">
                            <p className="text-[#6B7280] text-lg">No stories found for this industry yet.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Trusted By Banner */}
            <section className="py-16 bg-gradient-to-b from-white to-[#EBF3FB]">
                <div className="max-w-[1280px] mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <h2 className="text-3xl font-bold text-[#1A1A1A] mb-4">
                            Ready to write your success story?
                        </h2>
                        <p className="text-[#6B7280] mb-8 max-w-xl mx-auto">
                            Join 500+ companies that have transformed their operations with CubicleERP. Start your free trial today.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/auth/signup"
                                className="inline-flex items-center gap-2 bg-[#0067B8] text-white font-semibold text-sm px-6 py-3 rounded-lg hover:bg-[#005a9e] transition-colors shadow-md"
                            >
                                Start Free Trial
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                href="/pricing"
                                className="inline-flex items-center gap-2 bg-white text-[#1A1A1A] font-semibold text-sm px-6 py-3 rounded-lg border border-gray-300 hover:border-[#0067B8] hover:text-[#0067B8] transition-colors"
                            >
                                View Pricing
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            <LP2CTA />
            <LP2Footer />
        </main>
    )
}
