"use client"

import LP2Navbar from "@/components/landingpage2/LP2Navbar"
import LP2CTA from "@/components/landingpage2/LP2CTA"
import LP2Footer from "@/components/landingpage2/LP2Footer"
import { motion } from "framer-motion"
import {
    Calendar,
    Clock,
    PlayCircle,
    Video,
    ArrowRight,
    User,
    Users,
    BarChart3,
    Zap,
    Shield,
    Globe,
    Presentation,
    Mic2,
} from "lucide-react"
import Link from "next/link"

const fontFamily = "'Segoe UI', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif"

const upcomingWebinars = [
    {
        date: "Apr 15, 2026",
        time: "2:00 PM EST",
        title: "Mastering CRM Automation: Build Pipelines That Close Deals",
        description:
            "Learn how to design automated sales pipelines, trigger follow-ups, and use AI-powered lead scoring to increase your close rate by 30%.",
        speaker: "Sarah Chen",
        speakerRole: "VP of Product, CubicleERP",
        icon: Zap,
        accentColor: "#0067B8",
        bgAccent: "bg-blue-50",
        attendees: 342,
    },
    {
        date: "Apr 28, 2026",
        time: "11:00 AM EST",
        title: "HRM Deep Dive: Payroll, Leave, and Compliance Made Simple",
        description:
            "A comprehensive walkthrough of CubicleERP's HRM suite, covering payroll automation, leave management, and staying compliant across regions.",
        speaker: "David Okonkwo",
        speakerRole: "Head of HRM Product, CubicleERP",
        icon: Users,
        accentColor: "#107C10",
        bgAccent: "bg-green-50",
        attendees: 218,
    },
    {
        date: "May 10, 2026",
        time: "3:00 PM EST",
        title: "Data-Driven Decisions: Custom Reports and Dashboard Builder",
        description:
            "Discover how to create powerful custom dashboards, set up automated reporting, and turn raw data into actionable business intelligence.",
        speaker: "Emily Zhang",
        speakerRole: "Senior Data Engineer, CubicleERP",
        icon: BarChart3,
        accentColor: "#5C2D91",
        bgAccent: "bg-purple-50",
        attendees: 156,
    },
]

const pastWebinars = [
    {
        date: "Mar 12, 2026",
        title: "API Masterclass: Building Custom Integrations with CubicleERP",
        speaker: "Raj Patel",
        speakerRole: "Lead Developer Advocate",
        icon: Globe,
        accentColor: "#D83B01",
        bgAccent: "bg-orange-50",
        duration: "58 min",
        views: "2.4K",
    },
    {
        date: "Feb 25, 2026",
        title: "Security Best Practices: Protecting Your Business Data",
        speaker: "Lena Schmidt",
        speakerRole: "Head of Security",
        icon: Shield,
        accentColor: "#C30052",
        bgAccent: "bg-rose-50",
        duration: "45 min",
        views: "1.8K",
    },
    {
        date: "Feb 10, 2026",
        title: "From Startup to Scale: Growing with CubicleERP",
        speaker: "Alex Rivera",
        speakerRole: "Customer Success Lead",
        icon: Presentation,
        accentColor: "#008575",
        bgAccent: "bg-teal-50",
        duration: "52 min",
        views: "3.1K",
    },
    {
        date: "Jan 22, 2026",
        title: "Project Management Workflows: Tips from Power Users",
        speaker: "Maria Gonzalez",
        speakerRole: "Senior Product Manager",
        icon: Mic2,
        accentColor: "#0067B8",
        bgAccent: "bg-blue-50",
        duration: "47 min",
        views: "2.7K",
    },
]

export default function WebinarsPage() {
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
                            <Video className="w-4 h-4" />
                            Learn from the Experts
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold text-[#1A1A1A] mb-4">
                            Webinars & Events
                        </h1>
                        <p className="text-lg text-[#6B7280] max-w-2xl mx-auto">
                            Join live sessions with our product experts, watch on-demand recordings, and level up your CubicleERP skills.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Upcoming Webinars */}
            <section className="py-16">
                <div className="max-w-[1280px] mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center gap-3 mb-10"
                    >
                        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-[#1A1A1A]">Upcoming Webinars</h2>
                            <p className="text-sm text-[#6B7280]">Register now to save your spot</p>
                        </div>
                    </motion.div>

                    <div className="space-y-6">
                        {upcomingWebinars.map((webinar, i) => {
                            const Icon = webinar.icon
                            return (
                                <motion.div
                                    key={webinar.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    className="group grid md:grid-cols-[200px_1fr_180px] gap-6 bg-white rounded-2xl border border-gray-200 p-6 md:p-8 hover:shadow-xl hover:border-[#0067B8]/20 transition-all duration-300"
                                >
                                    {/* Date Block */}
                                    <div className="flex md:flex-col items-center md:items-start gap-3 md:gap-1">
                                        <div
                                            className={`w-14 h-14 rounded-xl ${webinar.bgAccent} flex items-center justify-center`}
                                        >
                                            <Icon className="w-7 h-7" style={{ color: webinar.accentColor }} />
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-1.5 text-sm font-medium text-[#1A1A1A]">
                                                <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                                                {webinar.date}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-sm text-[#6B7280]">
                                                <Clock className="w-3.5 h-3.5" />
                                                {webinar.time}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div>
                                        <h3 className="text-xl font-bold text-[#1A1A1A] mb-2 group-hover:text-[#0067B8] transition-colors">
                                            {webinar.title}
                                        </h3>
                                        <p className="text-sm text-[#6B7280] leading-relaxed mb-4">
                                            {webinar.description}
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold">
                                                {webinar.speaker.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-[#1A1A1A]">{webinar.speaker}</p>
                                                <p className="text-xs text-[#6B7280]">{webinar.speakerRole}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action */}
                                    <div className="flex flex-col items-start md:items-end justify-between gap-3">
                                        <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
                                            <Users className="w-3.5 h-3.5" />
                                            {webinar.attendees} registered
                                        </div>
                                        <button
                                            className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-lg text-white transition-colors shadow-md"
                                            style={{ backgroundColor: webinar.accentColor }}
                                        >
                                            Register Now
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Past Webinars */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-[1280px] mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center gap-3 mb-10"
                    >
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                            <PlayCircle className="w-5 h-5 text-[#0067B8]" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-[#1A1A1A]">Past Webinars</h2>
                            <p className="text-sm text-[#6B7280]">Watch recordings at your own pace</p>
                        </div>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {pastWebinars.map((webinar, i) => {
                            const Icon = webinar.icon
                            return (
                                <motion.div
                                    key={webinar.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    className="group bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div
                                            className={`w-11 h-11 rounded-xl ${webinar.bgAccent} flex items-center justify-center`}
                                        >
                                            <Icon className="w-5 h-5" style={{ color: webinar.accentColor }} />
                                        </div>
                                        <span className="text-xs text-[#6B7280]">{webinar.date}</span>
                                    </div>
                                    <h3 className="text-[15px] font-bold text-[#1A1A1A] mb-3 group-hover:text-[#0067B8] transition-colors leading-snug line-clamp-2">
                                        {webinar.title}
                                    </h3>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-semibold">
                                            {webinar.speaker.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-[#1A1A1A]">{webinar.speaker}</p>
                                            <p className="text-[10px] text-[#6B7280]">{webinar.speakerRole}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                        <div className="flex items-center gap-3 text-xs text-[#6B7280]">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {webinar.duration}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <PlayCircle className="w-3 h-3" />
                                                {webinar.views} views
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        className="mt-4 w-full inline-flex items-center justify-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-lg border-2 transition-all"
                                        style={{
                                            borderColor: webinar.accentColor,
                                            color: webinar.accentColor,
                                        }}
                                    >
                                        <PlayCircle className="w-4 h-4" />
                                        Watch Recording
                                    </button>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Host Your Own CTA */}
            <section className="py-16">
                <div className="max-w-[1280px] mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-2xl mx-auto"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-[#0067B8]/10 flex items-center justify-center mx-auto mb-5">
                            <Mic2 className="w-7 h-7 text-[#0067B8]" />
                        </div>
                        <h2 className="text-3xl font-bold text-[#1A1A1A] mb-3">
                            Want to speak at a CubicleERP event?
                        </h2>
                        <p className="text-[#6B7280] mb-8">
                            We're always looking for customers, partners, and experts to share their stories and insights with our community.
                        </p>
                        <Link
                            href="/support"
                            className="inline-flex items-center gap-2 bg-[#0067B8] text-white font-semibold text-sm px-6 py-3 rounded-lg hover:bg-[#005a9e] transition-colors shadow-md"
                        >
                            Apply to Speak
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            <LP2CTA />
            <LP2Footer />
        </main>
    )
}
