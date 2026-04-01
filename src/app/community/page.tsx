"use client"

import LP2Navbar from "@/components/landingpage2/LP2Navbar"
import LP2CTA from "@/components/landingpage2/LP2CTA"
import LP2Footer from "@/components/landingpage2/LP2Footer"
import { motion } from "framer-motion"
import {
    Users,
    MessageSquare,
    Github,
    Calendar,
    ArrowRight,
    Heart,
    Star,
    Trophy,
    ThumbsUp,
    MessageCircle,
    ExternalLink,
    Hash,
    Globe,
    Zap,
    Award,
    TrendingUp,
} from "lucide-react"
import Link from "next/link"

const fontFamily = "'Segoe UI', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif"

const communityStats = [
    { value: "10K+", label: "Community Members", icon: Users },
    { value: "500+", label: "Active Discussions", icon: MessageSquare },
    { value: "1,200+", label: "Solved Questions", icon: ThumbsUp },
    { value: "50+", label: "Monthly Events", icon: Calendar },
]

const channels = [
    {
        icon: MessageSquare,
        title: "Community Forum",
        description:
            "Ask questions, share tips, and connect with fellow CubicleERP users in our moderated discussion forum.",
        members: "8,200+",
        buttonLabel: "Visit Forum",
        color: "#0067B8",
        bgColor: "bg-blue-50",
    },
    {
        icon: Hash,
        title: "Discord Server",
        description:
            "Real-time conversations, voice channels, and direct access to the CubicleERP team and community experts.",
        members: "5,400+",
        buttonLabel: "Join Discord",
        color: "#5C2D91",
        bgColor: "bg-purple-50",
    },
    {
        icon: Github,
        title: "GitHub",
        description:
            "Contribute to open-source plugins, report bugs, browse sample code, and collaborate with our engineering team.",
        members: "2,800+",
        buttonLabel: "View GitHub",
        color: "#1A1A1A",
        bgColor: "bg-gray-100",
    },
    {
        icon: Calendar,
        title: "Events & Meetups",
        description:
            "Local and virtual meetups, hackathons, and user group sessions organized by community leaders worldwide.",
        members: "120+ events/yr",
        buttonLabel: "See Events",
        color: "#D83B01",
        bgColor: "bg-orange-50",
    },
]

const featuredDiscussions = [
    {
        title: "Best practices for setting up multi-department CRM pipelines?",
        author: "jakemorrison",
        replies: 34,
        likes: 89,
        category: "CRM",
        categoryColor: "bg-blue-100 text-[#0067B8]",
        timeAgo: "2 hours ago",
    },
    {
        title: "How we automated 80% of our HR onboarding with CubicleERP",
        author: "sarahlee_ops",
        replies: 52,
        likes: 142,
        category: "HRM",
        categoryColor: "bg-green-100 text-green-700",
        timeAgo: "5 hours ago",
    },
    {
        title: "Custom webhook integration with Zapier -- step-by-step guide",
        author: "dev_mike",
        replies: 28,
        likes: 76,
        category: "Integrations",
        categoryColor: "bg-purple-100 text-purple-700",
        timeAgo: "1 day ago",
    },
    {
        title: "Feature request: Kanban view for project management module",
        author: "emilyw_design",
        replies: 67,
        likes: 213,
        category: "Feature Request",
        categoryColor: "bg-amber-100 text-amber-700",
        timeAgo: "2 days ago",
    },
    {
        title: "Tips for migrating from Salesforce to CubicleERP CRM",
        author: "alex_techops",
        replies: 41,
        likes: 98,
        category: "Migration",
        categoryColor: "bg-rose-100 text-rose-700",
        timeAgo: "3 days ago",
    },
]

const champions = [
    {
        name: "Jake Morrison",
        username: "@jakemorrison",
        role: "CRM Expert",
        contributions: 248,
        badge: "Gold",
        badgeColor: "from-yellow-400 to-amber-500",
    },
    {
        name: "Sarah Lee",
        username: "@sarahlee_ops",
        role: "HRM Specialist",
        contributions: 192,
        badge: "Gold",
        badgeColor: "from-yellow-400 to-amber-500",
    },
    {
        name: "Mike Chen",
        username: "@dev_mike",
        role: "Integration Wizard",
        contributions: 167,
        badge: "Silver",
        badgeColor: "from-gray-300 to-gray-500",
    },
    {
        name: "Emily Walsh",
        username: "@emilyw_design",
        role: "UX Champion",
        contributions: 134,
        badge: "Silver",
        badgeColor: "from-gray-300 to-gray-500",
    },
    {
        name: "Alex Patel",
        username: "@alex_techops",
        role: "DevOps Lead",
        contributions: 121,
        badge: "Bronze",
        badgeColor: "from-orange-400 to-orange-600",
    },
    {
        name: "Nina Torres",
        username: "@nina_pm",
        role: "PM Power User",
        contributions: 108,
        badge: "Bronze",
        badgeColor: "from-orange-400 to-orange-600",
    },
]

export default function CommunityPage() {
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
                            <Heart className="w-4 h-4" />
                            Built by Users, for Users
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold text-[#1A1A1A] mb-4">
                            Join the CubicleERP Community
                        </h1>
                        <p className="text-lg text-[#6B7280] max-w-2xl mx-auto mb-8">
                            Connect with 10,000+ users, share knowledge, get help, and shape the future of CubicleERP together.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            <button className="inline-flex items-center gap-2 bg-[#0067B8] text-white font-semibold text-sm px-6 py-3 rounded-lg hover:bg-[#005a9e] transition-colors shadow-md">
                                Join the Community
                                <ArrowRight className="w-4 h-4" />
                            </button>
                            <button className="inline-flex items-center gap-2 bg-white text-[#1A1A1A] font-semibold text-sm px-6 py-3 rounded-lg border border-gray-300 hover:border-[#0067B8] hover:text-[#0067B8] transition-colors">
                                <Hash className="w-4 h-4" />
                                Join Discord
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-12">
                <div className="max-w-[1280px] mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {communityStats.map((stat, i) => {
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
                    </div>
                </div>
            </section>

            {/* Community Channels */}
            <section className="py-16">
                <div className="max-w-[1280px] mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-10"
                    >
                        <h2 className="text-3xl font-bold text-[#1A1A1A] mb-2">Where to Connect</h2>
                        <p className="text-[#6B7280]">Choose the channel that works best for you.</p>
                    </motion.div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {channels.map((channel, i) => {
                            const Icon = channel.icon
                            return (
                                <motion.div
                                    key={channel.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    className="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                                >
                                    <div
                                        className={`w-12 h-12 rounded-xl ${channel.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                                    >
                                        <Icon className="w-6 h-6" style={{ color: channel.color }} />
                                    </div>
                                    <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">{channel.title}</h3>
                                    <p className="text-sm text-[#6B7280] mb-4 leading-relaxed">
                                        {channel.description}
                                    </p>
                                    <p className="text-xs text-[#6B7280] mb-4">
                                        <span className="font-semibold text-[#1A1A1A]">{channel.members}</span> members
                                    </p>
                                    <button
                                        className="inline-flex items-center gap-2 text-sm font-semibold transition-colors"
                                        style={{ color: channel.color }}
                                    >
                                        {channel.buttonLabel}
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </button>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Featured Discussions */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-[1280px] mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center justify-between mb-10"
                    >
                        <div>
                            <h2 className="text-3xl font-bold text-[#1A1A1A] mb-1">Trending Discussions</h2>
                            <p className="text-[#6B7280]">See what the community is talking about.</p>
                        </div>
                        <Link
                            href="#"
                            className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-[#0067B8] hover:underline"
                        >
                            View All
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </motion.div>
                    <div className="space-y-4">
                        {featuredDiscussions.map((discussion, i) => (
                            <motion.div
                                key={discussion.title}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.08 }}
                                className="group flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-[#0067B8]/20 transition-all cursor-pointer"
                            >
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0067B8] to-[#0078D4] flex items-center justify-center text-white text-sm font-bold shrink-0">
                                    {discussion.author.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${discussion.categoryColor}`}>
                                            {discussion.category}
                                        </span>
                                        <span className="text-xs text-[#6B7280]">{discussion.timeAgo}</span>
                                    </div>
                                    <h4 className="text-[15px] font-semibold text-[#1A1A1A] group-hover:text-[#0067B8] transition-colors truncate">
                                        {discussion.title}
                                    </h4>
                                    <p className="text-xs text-[#6B7280] mt-0.5">by {discussion.author}</p>
                                </div>
                                <div className="hidden sm:flex items-center gap-4 text-xs text-[#6B7280] shrink-0">
                                    <span className="flex items-center gap-1">
                                        <MessageCircle className="w-3.5 h-3.5" />
                                        {discussion.replies}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <ThumbsUp className="w-3.5 h-3.5" />
                                        {discussion.likes}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Community Champions */}
            <section className="py-16">
                <div className="max-w-[1280px] mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-10"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-4">
                            <Trophy className="w-7 h-7 text-amber-500" />
                        </div>
                        <h2 className="text-3xl font-bold text-[#1A1A1A] mb-2">Community Champions</h2>
                        <p className="text-[#6B7280]">
                            Recognizing our most active and helpful community members.
                        </p>
                    </motion.div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        {champions.map((champion, i) => (
                            <motion.div
                                key={champion.username}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.08 }}
                                className="group bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center"
                            >
                                <div className="relative inline-block mb-3">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0067B8] to-[#0078D4] flex items-center justify-center text-white text-xl font-bold">
                                        {champion.name.charAt(0)}
                                    </div>
                                    <div
                                        className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-br ${champion.badgeColor} flex items-center justify-center shadow-md`}
                                    >
                                        <Award className="w-3.5 h-3.5 text-white" />
                                    </div>
                                </div>
                                <h3 className="text-[15px] font-bold text-[#1A1A1A]">{champion.name}</h3>
                                <p className="text-xs text-[#6B7280] mb-1">{champion.username}</p>
                                <p className="text-xs font-medium text-[#0067B8] mb-3">{champion.role}</p>
                                <div className="flex items-center justify-center gap-1 text-sm">
                                    <TrendingUp className="w-3.5 h-3.5 text-[#6B7280]" />
                                    <span className="font-semibold text-[#1A1A1A]">{champion.contributions}</span>
                                    <span className="text-[#6B7280]">contributions</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Join CTA */}
            <section className="py-16 bg-gradient-to-b from-white to-[#EBF3FB]">
                <div className="max-w-[1280px] mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative rounded-2xl bg-gradient-to-r from-[#0067B8] to-[#0078D4] p-8 sm:p-12 text-center overflow-hidden"
                    >
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
                        </div>
                        <div className="relative z-10">
                            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                                Ready to be part of something bigger?
                            </h2>
                            <p className="text-white/80 text-[15px] max-w-xl mx-auto mb-6">
                                Join thousands of professionals who learn, share, and grow together in the CubicleERP community.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                                <button className="inline-flex items-center gap-2 bg-white text-[#0067B8] font-semibold text-sm px-6 py-3 rounded-lg hover:bg-white/90 transition-colors shadow-lg shadow-black/10">
                                    Create Free Account
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                                <button className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white font-semibold text-sm px-6 py-3 rounded-lg border border-white/20 hover:bg-white/20 transition-colors">
                                    <Globe className="w-4 h-4" />
                                    Explore Community
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <LP2CTA />
            <LP2Footer />
        </main>
    )
}
