"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
    ArrowRight,
    Play,
    ChevronDown,
    Shield,
    Zap,
    Globe,
    Star,
    Users,
    CheckCircle,
    Sparkles,
    TrendingUp,
    BarChart3,
    Phone,
    Mail,
    Calendar,
    DollarSign,
    Eye,
    MessageSquare,
    Clock,
    ArrowUpRight,
    Activity,
} from "lucide-react"

const trustBadges = [
    { icon: Shield, label: "SOC2 Compliant" },
    { icon: Zap, label: "99.9% Uptime" },
    { icon: Globe, label: "GDPR Ready" },
]

/* ── Lead pipeline data ── */
const pipelineStages = [
    { stage: "New", count: 24, color: "#6366F1", width: "100%" },
    { stage: "Contacted", count: 18, color: "#8B5CF6", width: "75%" },
    { stage: "Qualified", count: 12, color: "#3B82F6", width: "50%" },
    { stage: "Proposal", count: 8, color: "#F59E0B", width: "33%" },
    { stage: "Won", count: 5, color: "#10B981", width: "21%" },
]

const recentLeads = [
    { name: "Sarah Johnson", company: "Acme Corp", value: "$12,500", status: "Hot", statusColor: "#EF4444", avatar: "SJ", time: "2 min ago", source: "Website" },
    { name: "Mike Chen", company: "TechStart Inc", value: "$8,200", status: "Warm", statusColor: "#F59E0B", avatar: "MC", time: "15 min ago", source: "LinkedIn" },
    { name: "Priya Patel", company: "GlobalTrade Co", value: "$22,000", status: "Hot", statusColor: "#EF4444", avatar: "PP", time: "1 hr ago", source: "Referral" },
    { name: "David Kim", company: "InnovateCo", value: "$5,800", status: "New", statusColor: "#6366F1", avatar: "DK", time: "2 hrs ago", source: "Email" },
]

const activities = [
    { icon: Phone, text: "Call with Acme Corp", time: "10:30 AM", color: "#10B981" },
    { icon: Mail, text: "Follow-up sent to TechStart", time: "11:15 AM", color: "#3B82F6" },
    { icon: Calendar, text: "Demo scheduled - GlobalTrade", time: "2:00 PM", color: "#8B5CF6" },
]

/* ── Interactive Dashboard ── */
function InteractiveDashboard() {
    const [hoveredLead, setHoveredLead] = useState<number | null>(null)
    const [hoveredStat, setHoveredStat] = useState<number | null>(null)
    const [activeTab, setActiveTab] = useState<"leads" | "pipeline">("leads")

    const stats = [
        { icon: Users, label: "Total Leads", value: "2,847", change: "+12.5%", changeColor: "text-emerald-600", bg: "bg-blue-50", iconColor: "text-blue-600", borderHover: "hover:border-blue-300" },
        { icon: DollarSign, label: "Pipeline Value", value: "$147.2K", change: "+8.3%", changeColor: "text-emerald-600", bg: "bg-emerald-50", iconColor: "text-emerald-600", borderHover: "hover:border-emerald-300" },
        { icon: TrendingUp, label: "Win Rate", value: "68.4%", change: "+5.2%", changeColor: "text-emerald-600", bg: "bg-violet-50", iconColor: "text-violet-600", borderHover: "hover:border-violet-300" },
        { icon: Activity, label: "Conversion", value: "24.5%", change: "+3.1%", changeColor: "text-emerald-600", bg: "bg-amber-50", iconColor: "text-amber-600", borderHover: "hover:border-amber-300" },
    ]

    return (
        <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.6, duration: 1, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="relative"
        >
            {/* Animated glow border */}
            <div className="absolute -inset-[2px] rounded-2xl overflow-hidden">
                <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_30%,#6366F1_45%,#3B82F6_55%,transparent_70%)]"
                />
            </div>

            {/* Glow behind */}
            <div className="absolute -inset-6 bg-gradient-to-r from-blue-500/20 via-indigo-500/15 to-violet-500/20 rounded-[40px] blur-[50px] opacity-50" />

            {/* Main card - LIGHT THEME */}
            <div className="relative bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-2xl shadow-indigo-500/10">
                {/* Browser chrome - light */}
                <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border-b border-slate-200/80">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#28CA41]" />
                    </div>
                    <div className="flex-1 mx-3 h-6 bg-white rounded-md border border-slate-200 flex items-center px-2.5">
                        <span className="text-[10px] text-slate-400 font-mono">cubicle.app/crm/dashboard</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center">
                            <Eye className="w-3 h-3 text-slate-400" />
                        </div>
                    </div>
                </div>

                {/* Dashboard header */}
                <div className="px-5 pt-4 pb-3 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-bold text-slate-900">CRM Dashboard</h3>
                        <p className="text-[10px] text-slate-400">Real-time lead & pipeline overview</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative rounded-full h-2 w-2 bg-emerald-400" />
                        </span>
                        <span className="text-[10px] font-medium text-emerald-600">Live</span>
                    </div>
                </div>

                <div className="p-4">
                    {/* Stats row */}
                    <div className="grid grid-cols-4 gap-2.5 mb-4">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 + i * 0.1, duration: 0.4 }}
                                whileHover={{ y: -3, scale: 1.02 }}
                                onMouseEnter={() => setHoveredStat(i)}
                                onMouseLeave={() => setHoveredStat(null)}
                                className={`relative rounded-xl p-3 border border-slate-100 ${stat.borderHover} transition-all duration-300 cursor-default overflow-hidden ${hoveredStat === i ? "shadow-md" : "shadow-sm"}`}
                            >
                                {/* Hover highlight */}
                                <AnimatePresence>
                                    {hoveredStat === i && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className={`absolute inset-0 ${stat.bg} opacity-40`}
                                        />
                                    )}
                                </AnimatePresence>

                                <div className="relative z-10">
                                    <div className={`w-7 h-7 ${stat.bg} rounded-lg flex items-center justify-center mb-2`}>
                                        <stat.icon className={`w-3.5 h-3.5 ${stat.iconColor}`} />
                                    </div>
                                    <div className="text-base font-bold text-slate-900">{stat.value}</div>
                                    <div className="flex items-center justify-between mt-0.5">
                                        <span className="text-[9px] text-slate-400">{stat.label}</span>
                                        <span className={`text-[9px] font-bold ${stat.changeColor} flex items-center gap-0.5`}>
                                            <ArrowUpRight className="w-2.5 h-2.5" />
                                            {stat.change}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Tab switcher */}
                    <div className="flex items-center gap-1 mb-3 bg-slate-50 rounded-lg p-0.5 w-fit">
                        {(["leads", "pipeline"] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-3 py-1.5 rounded-md text-[10px] font-semibold transition-all duration-200 capitalize ${
                                    activeTab === tab
                                        ? "bg-white text-slate-900 shadow-sm"
                                        : "text-slate-400 hover:text-slate-600"
                                }`}
                            >
                                {tab === "leads" ? "Recent Leads" : "Pipeline"}
                            </button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === "leads" ? (
                            /* Recent Leads Table */
                            <motion.div
                                key="leads"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-1.5"
                            >
                                {recentLeads.map((lead, i) => (
                                    <motion.div
                                        key={lead.name}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 1 + i * 0.08 }}
                                        onMouseEnter={() => setHoveredLead(i)}
                                        onMouseLeave={() => setHoveredLead(null)}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-xl border transition-all duration-200 cursor-default ${
                                            hoveredLead === i
                                                ? "bg-indigo-50/60 border-indigo-200/60 shadow-sm"
                                                : "bg-slate-50/50 border-transparent"
                                        }`}
                                    >
                                        {/* Avatar */}
                                        <div
                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                                            style={{ background: `linear-gradient(135deg, ${lead.statusColor}, ${lead.statusColor}CC)` }}
                                        >
                                            {lead.avatar}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-[11px] font-semibold text-slate-800 truncate">{lead.name}</span>
                                                <span
                                                    className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                                                    style={{ color: lead.statusColor, backgroundColor: `${lead.statusColor}15` }}
                                                >
                                                    {lead.status}
                                                </span>
                                            </div>
                                            <div className="text-[9px] text-slate-400 flex items-center gap-2">
                                                <span>{lead.company}</span>
                                                <span>•</span>
                                                <span>{lead.source}</span>
                                            </div>
                                        </div>

                                        {/* Value + Time */}
                                        <div className="text-right flex-shrink-0">
                                            <div className="text-[11px] font-bold text-slate-800">{lead.value}</div>
                                            <div className="text-[9px] text-slate-400 flex items-center gap-0.5 justify-end">
                                                <Clock className="w-2.5 h-2.5" />
                                                {lead.time}
                                            </div>
                                        </div>

                                        {/* Hover action icons */}
                                        <AnimatePresence>
                                            {hoveredLead === i && (
                                                <motion.div
                                                    initial={{ opacity: 0, width: 0 }}
                                                    animate={{ opacity: 1, width: "auto" }}
                                                    exit={{ opacity: 0, width: 0 }}
                                                    className="flex items-center gap-1 overflow-hidden"
                                                >
                                                    <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center cursor-pointer hover:bg-blue-200 transition-colors">
                                                        <Phone className="w-3 h-3 text-blue-600" />
                                                    </div>
                                                    <div className="w-6 h-6 rounded-md bg-emerald-100 flex items-center justify-center cursor-pointer hover:bg-emerald-200 transition-colors">
                                                        <Mail className="w-3 h-3 text-emerald-600" />
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            /* Pipeline funnel */
                            <motion.div
                                key="pipeline"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-2"
                            >
                                {pipelineStages.map((stage, i) => (
                                    <motion.div
                                        key={stage.stage}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 + i * 0.08 }}
                                        className="group"
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-[10px] font-semibold text-slate-600">{stage.stage}</span>
                                            <span className="text-[10px] font-bold" style={{ color: stage.color }}>{stage.count} leads</span>
                                        </div>
                                        <div className="h-6 bg-slate-100 rounded-lg overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: stage.width }}
                                                transition={{ delay: 0.3 + i * 0.12, duration: 0.8, ease: "easeOut" }}
                                                className="h-full rounded-lg flex items-center justify-end pr-2 group-hover:brightness-110 transition-all"
                                                style={{ backgroundColor: stage.color }}
                                            >
                                                <span className="text-[9px] font-bold text-white">{stage.count}</span>
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Activities sidebar - compact */}
                    <div className="mt-3 pt-3 border-t border-slate-100">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-semibold text-slate-500">Today&apos;s Activities</span>
                            <span className="text-[9px] text-indigo-500 font-medium cursor-pointer hover:underline">View all</span>
                        </div>
                        <div className="flex gap-2">
                            {activities.map((act, i) => (
                                <motion.div
                                    key={act.text}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 1.4 + i * 0.1 }}
                                    whileHover={{ y: -2, scale: 1.02 }}
                                    className="flex-1 flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all cursor-default"
                                >
                                    <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${act.color}15` }}>
                                        <act.icon className="w-3 h-3" style={{ color: act.color }} />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-[9px] font-medium text-slate-700 truncate">{act.text}</div>
                                        <div className="text-[8px] text-slate-400">{act.time}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating badge - top right: Live Data */}
            <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.3, type: "spring" }}
                className="absolute -top-3 -right-3 bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg shadow-emerald-500/30 flex items-center gap-1.5 z-10"
            >
                <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute h-full w-full rounded-full bg-white opacity-75" />
                    <span className="relative rounded-full h-1.5 w-1.5 bg-white" />
                </span>
                Live Dashboard
            </motion.div>

            {/* Floating badge - bottom left: AI */}
            <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5, type: "spring" }}
                className="absolute -bottom-3 -left-3 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-lg flex items-center gap-2 z-10"
            >
                <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                    <div className="text-slate-900 text-[11px] font-bold">AI Insights</div>
                    <div className="text-slate-400 text-[9px]">3 suggestions ready</div>
                </div>
            </motion.div>

            {/* Floating notification - top left */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2, type: "spring" }}
                className="absolute top-12 -left-4 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-lg flex items-center gap-2 z-10"
            >
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-3 h-3 text-blue-600" />
                </div>
                <div>
                    <div className="text-[10px] font-semibold text-slate-700">New lead assigned</div>
                    <div className="text-[8px] text-slate-400">Just now</div>
                </div>
            </motion.div>
        </motion.div>
    )
}

export default function HeroSection() {
    const handleScrollDown = () => {
        const el = document.querySelector("#features")
        if (el) el.scrollIntoView({ behavior: "smooth" })
    }

    return (
        <section
            className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-white dark:bg-slate-950"
            style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
        >
            {/* Animated gradient background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
                <div
                    className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"
                    style={{ animationDelay: "1s" }}
                />
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[100px] animate-pulse"
                    style={{ animationDelay: "2s" }}
                />
                {/* Grid overlay */}
                <div
                    className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(15, 23, 42, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 23, 42, 0.3) 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                    }}
                />
                <div className="dark:hidden absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:40px_40px] opacity-25" />
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-8">
                    {/* Left: Text Content */}
                    <div className="flex-1 text-center lg:text-left">
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-sm mb-8 group cursor-default"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
                            </span>
                            <span className="text-xs font-semibold text-blue-300 tracking-widest uppercase">
                                ✦ Enterprise CRM Platform
                            </span>
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        </motion.div>

                        {/* Headline */}
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tighter mb-6 flex flex-wrap justify-center lg:justify-start">
                            {["Transform", "Your", "Business", "Operations"].map((word, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        duration: 1,
                                        delay: 0.2 + (i * 0.15),
                                        ease: [0.21, 0.47, 0.32, 0.98]
                                    }}
                                    className={`inline-block mr-[0.25em] last:mr-0 ${i >= 2
                                        ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400"
                                        : ""
                                        }`}
                                >
                                    {word}
                                </motion.span>
                            ))}
                        </h1>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                            className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed mb-10 mx-auto lg:mx-0"
                        >
                            All-in-one platform combining <span className="text-slate-900 dark:text-white font-bold">CRM</span>, <span className="text-slate-900 dark:text-white font-bold">HRM</span>, and <span className="text-slate-900 dark:text-white font-bold">Project Management</span> with AI-powered automation.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.5 }}
                            className="flex flex-col sm:flex-row gap-4 mb-12 justify-center lg:justify-start"
                        >
                            <Link
                                href="/auth/signup"
                                className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-2xl shadow-blue-500/40 hover:shadow-blue-500/60 transition-all duration-300 hover:scale-105 overflow-hidden"
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <Zap className="relative z-10 w-5 h-5" />
                                <span className="relative z-10">Start Free Trial</span>
                                <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <Link
                                href="/modules"
                                className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/20 hover:border-slate-300 dark:hover:border-white/40 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:text-slate-900 dark:hover:text-white"
                            >
                                <Play className="w-4 h-4 fill-current group-hover:text-blue-400 transition-colors" />
                                Watch Demo
                            </Link>
                        </motion.div>

                        {/* Trust Badges */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 0.5 }}
                            className="flex flex-wrap items-center gap-4 justify-center lg:justify-start"
                        >
                            {trustBadges.map(({ icon: Icon, label }) => (
                                <div
                                    key={label}
                                    className="flex items-center gap-1.5 text-xs font-medium text-slate-400"
                                >
                                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                                    {label}
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Right: Video Showcase */}
                    <div className="flex-1 w-full max-w-lg lg:max-w-none origin-top-right lg:scale-[0.82] xl:scale-[0.85]">
                        <InteractiveDashboard />
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8 }}
                onClick={handleScrollDown}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
            >
                <span className="text-xs font-medium tracking-wider uppercase">Scroll to explore</span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                    <ChevronDown className="w-5 h-5" />
                </motion.div>
            </motion.button>
        </section>
    )
}
