"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { Target, Building2, BarChart3, Users, Shield, Zap, ArrowRight } from "lucide-react"

const features = [
    {
        icon: Target,
        title: "Lead Management",
        description: "Track, score, and convert leads with intelligent pipelines. Assign, follow-up, and never miss an opportunity.",
        gradient: "from-blue-500 to-indigo-600",
        shadowColor: "shadow-blue-500/20",
        tag: "CRM",
        highlight: "2,847 leads tracked",
        stats: { value: 2847, label: "Active Leads", growth: "+12%" }
    },
    {
        icon: Building2,
        title: "Multi-Org Control",
        description: "Manage multiple organizations, departments, and workspaces from a single unified admin command center.",
        gradient: "from-emerald-500 to-teal-600",
        shadowColor: "shadow-emerald-500/20",
        tag: "Admin",
        highlight: "12 orgs managed",
        stats: { value: 12, label: "Organizations", growth: "+3" }
    },
    {
        icon: BarChart3,
        title: "Analytics & Reports",
        description: "Real-time dashboards with revenue metrics, pipeline analytics, cohort analysis, and AI-powered insights.",
        gradient: "from-purple-500 to-violet-600",
        shadowColor: "shadow-purple-500/20",
        tag: "Analytics",
        highlight: "24.5% growth rate",
        stats: { value: 24.5, label: "Growth Rate", growth: "+5.2%" }
    },
    {
        icon: Users,
        title: "Team Collaboration",
        description: "Create roles, assign permissions, manage workspaces, and align your entire team around shared goals.",
        gradient: "from-orange-500 to-amber-600",
        shadowColor: "shadow-orange-500/20",
        tag: "Teams",
        highlight: "500+ active orgs",
        stats: { value: 500, label: "Active Users", growth: "+45" }
    },
    {
        icon: Shield,
        title: "Enterprise Security",
        description: "SOC2 compliant with MFA, audit logs, RBAC, and full compliance reporting built-in from day one.",
        gradient: "from-rose-500 to-red-600",
        shadowColor: "shadow-rose-500/20",
        tag: "Security",
        highlight: "SOC2 Certified",
        stats: { value: 99.9, label: "Uptime", growth: "100%" }
    },
    {
        icon: Zap,
        title: "Workflow Automation",
        description: "Automate repetitive tasks, trigger notifications, set approval chains, and save hours every week.",
        gradient: "from-cyan-500 to-blue-600",
        shadowColor: "shadow-cyan-500/20",
        tag: "Automation",
        highlight: "10x faster ops",
        stats: { value: 10, label: "Time Saved", growth: "10x" }
    },
]

// Enhanced card component with all effects
const EnhancedFeatureCard = ({ feature, index }: any) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const cardRef = useRef<HTMLDivElement>(null)

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current) return
        const rect = cardRef.current.getBoundingClientRect()
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        })
    }

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
                delay: index * 0.1,
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94]
            }}
            onMouseMove={handleMouseMove}
            whileHover={{ y: -12, scale: 1.02 }}
            className="relative group cursor-pointer"
        >
            {/* Spotlight effect following mouse */}
            <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl"
                style={{
                    background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.15), transparent 40%)`,
                }}
            />

            {/* Animated gradient border */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500 animate-gradient-rotate" />

            {/* Main card */}
            <div className="relative bg-white dark:bg-slate-800/90 backdrop-blur-xl border-2 border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-xl overflow-hidden">
                {/* Top accent bar with pulse */}
                <motion.div
                    className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} rounded-t-3xl`}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Tag & Highlight */}
                <div className="flex items-center justify-between mb-4 relative z-10">
                    <motion.span
                        whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                        transition={{ duration: 0.3 }}
                        className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-gradient-to-r ${feature.gradient} text-white shadow-md`}
                    >
                        {feature.tag}
                    </motion.span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                        {feature.highlight}
                    </span>
                </div>

                {/* Icon with enhanced glow and rotation */}
                <motion.div
                    whileHover={{
                        rotate: [0, -8, 8, -8, 0],
                        scale: 1.15,
                    }}
                    transition={{ duration: 0.6 }}
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 relative z-10 shadow-lg`}
                >
                    {/* Glow effect */}
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} blur-lg opacity-0 group-hover:opacity-70 transition-opacity duration-300`} />
                    <feature.icon className="w-7 h-7 text-white relative z-10" />
                </motion.div>

                {/* Title with gradient on hover */}
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 relative z-10 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                    {feature.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4 relative z-10">
                    {feature.description}
                </p>

                {/* Stats with animated progress bar */}
                <div className="mb-4 relative z-10">
                    <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-slate-500 dark:text-slate-400">{feature.stats.label}</span>
                        <span className="text-emerald-500 font-bold">{feature.stats.growth}</span>
                    </div>
                    <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                            className={`h-full bg-gradient-to-r ${feature.gradient} rounded-full`}
                            initial={{ width: 0 }}
                            whileInView={{ width: "75%" }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, delay: index * 0.1, ease: "easeOut" }}
                        />
                    </div>
                </div>

                {/* CTA with arrow animation */}
                <motion.div
                    className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors relative z-10"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                >
                    <span>Explore feature</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.div>

                {/* Decorative animated blob */}
                <motion.div
                    className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${feature.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 90, 0],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                {/* Corner accent */}
                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl ${feature.gradient} opacity-5 rounded-bl-full`} />
            </div>
        </motion.div>
    )
}

export default function EnhancedFeaturesSection() {
    const ref = useRef<HTMLDivElement>(null)
    const inView = useInView(ref, { once: true, margin: "-80px" })

    return (
        <section
            id="features"
            className="py-28 bg-white dark:bg-slate-950 relative overflow-hidden transition-colors duration-500"
            ref={ref}
        >
            {/* Animated gradient mesh background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/5 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl animate-blob" />
                <div
                    className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/5 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl animate-blob"
                    style={{ animationDelay: '2s' }}
                />
                <div
                    className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500/10 dark:bg-pink-500/5 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl animate-blob"
                    style={{ animationDelay: '4s' }}
                />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section header with enhanced animations */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={inView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.5, type: "spring" }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-400/5 border border-blue-500/20 dark:border-blue-400/10 mb-6"
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        >
                            <Zap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        </motion.div>
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 tracking-widest uppercase">
                            Platform Features
                        </span>
                    </motion.div>

                    {/* Title with word-by-word animation */}
                    <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-4">
                        {["Everything", "your", "business"].map((word, i) => (
                            <motion.span
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={inView ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
                                className="inline-block mr-[0.25em]"
                            >
                                {word}
                            </motion.span>
                        ))}{" "}
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400"
                        >
                            needs
                        </motion.span>
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="inline-block ml-[0.25em]"
                        >
                            , in one place
                        </motion.span>
                    </h2>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={inView ? { opacity: 1 } : {}}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
                    >
                        From lead capture to client management, from HR to finance — Cubicle CRM covers
                        every aspect of your business operations.
                    </motion.p>
                </motion.div>

                {/* Enhanced Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, i) => (
                        <EnhancedFeatureCard key={feature.title} feature={feature} index={i} />
                    ))}
                </div>

                {/* Bottom CTA with enhanced styling */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="mt-14 text-center"
                >
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
                        And much more — Invoice management, Client Portal, HRM, Project Tracking...
                    </p>
                    <motion.a
                        href="/auth/signup"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 text-sm"
                    >
                        Explore All Features
                        <ArrowRight className="w-4 h-4" />
                    </motion.a>
                </motion.div>
            </div>
        </section>
    )
}
