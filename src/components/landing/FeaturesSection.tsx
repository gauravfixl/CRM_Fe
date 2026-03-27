"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { Target, Building2, BarChart3, Users, Shield, Zap, ArrowRight, CheckCircle, X, TrendingUp, Clock, Star } from "lucide-react"

const features = [
    {
        id: "lead-management",
        icon: Target,
        title: "Lead Management",
        description: "Track, score, and convert leads with intelligent pipelines. Assign, follow-up, and never miss an opportunity.",
        gradient: "from-blue-500 to-indigo-600",
        shadowColor: "shadow-blue-500/20",
        tag: "CRM",
        highlight: "2,847 leads tracked",
        stats: { value: 2847, label: "Active Leads", growth: "+12%" },
        color: "#6366F1",
        detailPoints: [
            "Visual drag-and-drop pipeline stages",
            "AI-powered lead scoring & prioritization",
            "Automated follow-up sequences",
            "Source tracking (Web, Email, LinkedIn, Referral)",
            "Bulk import from CSV/Excel",
            "Real-time conversion analytics",
        ],
        detailStats: [
            { label: "Avg Response", value: "<2h", icon: Clock },
            { label: "Conversion", value: "24.5%", icon: TrendingUp },
            { label: "Satisfaction", value: "4.9/5", icon: Star },
        ],
    },
    {
        id: "multi-org",
        icon: Building2,
        title: "Multi-Org Control",
        description: "Manage multiple organizations, departments, and workspaces from a single unified admin command center.",
        gradient: "from-emerald-500 to-teal-600",
        shadowColor: "shadow-emerald-500/20",
        tag: "Admin",
        highlight: "12 orgs managed",
        stats: { value: 12, label: "Organizations", growth: "+3" },
        color: "#10B981",
        detailPoints: [
            "Centralized multi-tenant management",
            "Per-org branding & customization",
            "Cross-org analytics & reporting",
            "Department & team hierarchies",
            "Granular permission controls",
            "White-label workspace options",
        ],
        detailStats: [
            { label: "Orgs Active", value: "12", icon: Building2 },
            { label: "Teams", value: "48", icon: Users },
            { label: "Uptime", value: "99.9%", icon: Zap },
        ],
    },
    {
        id: "analytics",
        icon: BarChart3,
        title: "Analytics & Reports",
        description: "Real-time dashboards with revenue metrics, pipeline analytics, cohort analysis, and AI-powered insights.",
        gradient: "from-purple-500 to-violet-600",
        shadowColor: "shadow-purple-500/20",
        tag: "Analytics",
        highlight: "24.5% growth rate",
        stats: { value: 24.5, label: "Growth Rate", growth: "+5.2%" },
        color: "#8B5CF6",
        detailPoints: [
            "Revenue & MRR tracking dashboards",
            "Pipeline health & velocity metrics",
            "Team performance leaderboards",
            "Cohort analysis & churn prediction",
            "Custom report builder",
            "Scheduled report delivery via email",
        ],
        detailStats: [
            { label: "Reports", value: "150+", icon: BarChart3 },
            { label: "Growth", value: "24.5%", icon: TrendingUp },
            { label: "Data Points", value: "10M+", icon: Zap },
        ],
    },
    {
        id: "collaboration",
        icon: Users,
        title: "Team Collaboration",
        description: "Create roles, assign permissions, manage workspaces, and align your entire team around shared goals.",
        gradient: "from-orange-500 to-amber-600",
        shadowColor: "shadow-orange-500/20",
        tag: "Teams",
        highlight: "500+ active orgs",
        stats: { value: 500, label: "Active Users", growth: "+45" },
        color: "#F59E0B",
        detailPoints: [
            "Role-based access control (RBAC)",
            "Shared workspaces & boards",
            "Real-time activity feeds",
            "Team mentions & @notifications",
            "Goal tracking & OKR alignment",
            "Cross-department collaboration",
        ],
        detailStats: [
            { label: "Users", value: "500+", icon: Users },
            { label: "Teams", value: "120", icon: Building2 },
            { label: "Active", value: "98%", icon: TrendingUp },
        ],
    },
    {
        id: "security",
        icon: Shield,
        title: "Enterprise Security",
        description: "SOC2 compliant with MFA, audit logs, RBAC, and full compliance reporting built-in from day one.",
        gradient: "from-rose-500 to-red-600",
        shadowColor: "shadow-rose-500/20",
        tag: "Security",
        highlight: "SOC2 Certified",
        stats: { value: 99.9, label: "Uptime", growth: "100%" },
        color: "#EF4444",
        detailPoints: [
            "SOC2 Type II certified",
            "256-bit AES encryption at rest",
            "Multi-factor authentication (MFA)",
            "Comprehensive audit logging",
            "GDPR & HIPAA compliance tools",
            "SSO integration (SAML, OAuth)",
        ],
        detailStats: [
            { label: "Encryption", value: "256-bit", icon: Shield },
            { label: "Uptime", value: "99.9%", icon: Zap },
            { label: "Compliance", value: "SOC2", icon: CheckCircle },
        ],
    },
    {
        id: "automation",
        icon: Zap,
        title: "Workflow Automation",
        description: "Automate repetitive tasks, trigger notifications, set approval chains, and save hours every week.",
        gradient: "from-cyan-500 to-blue-600",
        shadowColor: "shadow-cyan-500/20",
        tag: "Automation",
        highlight: "10x faster ops",
        stats: { value: 10, label: "Time Saved", growth: "10x" },
        color: "#06B6D4",
        detailPoints: [
            "Visual workflow builder (no code)",
            "Trigger-based automation rules",
            "Approval chain configuration",
            "Scheduled task execution",
            "Email & notification automation",
            "Integration with 50+ third-party tools",
        ],
        detailStats: [
            { label: "Workflows", value: "200+", icon: Zap },
            { label: "Time Saved", value: "10x", icon: Clock },
            { label: "Automations", value: "5K+", icon: TrendingUp },
        ],
    },
]

const cardVariants = {
    hidden: { opacity: 0, y: 50, filter: "blur(10px)" },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
            delay: i * 0.1,
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94] as any,
        },
    }),
}

export default function FeaturesSection({ isPage = false }: { isPage?: boolean }) {
    const ref = useRef<HTMLDivElement>(null)
    const inView = useInView(ref, { once: true, margin: "-80px" })
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

    // Hash-based feature auto-expansion
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.replace("#", "")
            if (hash) {
                const idx = features.findIndex((f) => f.id === hash)
                if (idx !== -1) setExpandedIndex(idx)
            }
        }
        handleHashChange()
        window.addEventListener("hashchange", handleHashChange)
        window.addEventListener("popstate", handleHashChange)
        return () => {
            window.removeEventListener("hashchange", handleHashChange)
            window.removeEventListener("popstate", handleHashChange)
        }
    }, [])

    return (
        <section id="features" className={`${isPage ? "pt-10 pb-28" : "py-28"} bg-white dark:bg-slate-950 relative overflow-hidden transition-colors duration-500 border-b border-slate-200/60 dark:border-white/5`} ref={ref}>
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
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={inView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.5, type: "spring" }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-400/5 border border-blue-500/20 dark:border-blue-400/10 mb-6"
                    >
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
                            <Zap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        </motion.div>
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 tracking-widest uppercase">
                            Platform Features
                        </span>
                    </motion.div>

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

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={inView ? { opacity: 1 } : {}}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
                    >
                        Click any feature to explore what it can do for your business.
                    </motion.p>
                </motion.div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                    {features.map((feature, i) => (
                        <EnhancedFeatureCard
                            key={feature.title}
                            feature={feature}
                            index={i}
                            isExpanded={expandedIndex === i}
                            onToggle={() => setExpandedIndex(expandedIndex === i ? null : i)}
                        />
                    ))}
                </div>

                {/* Bottom CTA */}
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

const EnhancedFeatureCard = ({ feature, index, isExpanded, onToggle }: { feature: typeof features[0]; index: number; isExpanded: boolean; onToggle: () => void }) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const cardRef = useRef<HTMLDivElement>(null)

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current) return
        const rect = cardRef.current.getBoundingClientRect()
        setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    }

    return (
        <motion.div
            ref={cardRef}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            onMouseMove={handleMouseMove}
            onClick={onToggle}
            whileHover={!isExpanded ? { y: -12, scale: 1.02 } : {}}
            transition={{ duration: 0.3 }}
            className="relative group cursor-pointer"
            layout
        >
            {/* Spotlight effect */}
            <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl"
                style={{
                    background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, ${feature.color}15, transparent 40%)`,
                }}
            />

            {/* Animated gradient border */}
            <div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.gradient} rounded-3xl transition-all duration-500 blur-sm ${isExpanded ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} />

            {/* Main card */}
            <motion.div
                layout
                className={`relative bg-white dark:bg-slate-800/90 backdrop-blur-xl border-2 rounded-3xl p-6 shadow-xl overflow-hidden flex flex-col ${
                    isExpanded ? "border-transparent" : "border-slate-200 dark:border-white/10"
                }`}
            >
                {/* Top accent bar */}
                <motion.div
                    className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} rounded-t-3xl`}
                    animate={isExpanded ? { height: 3, opacity: 1 } : { height: 1, opacity: [0.5, 1, 0.5] }}
                    transition={isExpanded ? { duration: 0.3 } : { duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Tag & Close button when expanded */}
                <div className="flex items-center justify-between mb-4 relative z-10">
                    <motion.span
                        whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                        transition={{ duration: 0.3 }}
                        className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-gradient-to-r ${feature.gradient} text-white shadow-md`}
                    >
                        {feature.tag}
                    </motion.span>
                    {isExpanded ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-6 h-6 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"
                        >
                            <X className="w-3.5 h-3.5 text-slate-500" />
                        </motion.div>
                    ) : (
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                            {feature.highlight}
                        </span>
                    )}
                </div>

                {/* Icon */}
                <motion.div
                    whileHover={{ rotate: [0, -8, 8, -8, 0], scale: 1.15 }}
                    transition={{ duration: 0.6 }}
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 relative z-10 shadow-lg`}
                >
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} blur-lg opacity-0 group-hover:opacity-70 transition-opacity duration-300`} />
                    <feature.icon className="w-7 h-7 text-white relative z-10" />
                </motion.div>

                {/* Title */}
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 relative z-10 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                    {feature.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4 relative z-10">
                    {feature.description}
                </p>

                {/* Expanded content */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                            className="overflow-hidden relative z-10"
                        >
                            {/* Mini stats row */}
                            <div className="grid grid-cols-3 gap-2 mb-5">
                                {feature.detailStats.map((stat, i) => (
                                    <motion.div
                                        key={stat.label}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 + i * 0.08 }}
                                        className="text-center p-2.5 rounded-xl border border-slate-100 dark:border-white/10 bg-slate-50/80 dark:bg-white/[0.04]"
                                    >
                                        <div className="w-7 h-7 rounded-lg mx-auto mb-1.5 flex items-center justify-center" style={{ backgroundColor: `${feature.color}12` }}>
                                            <stat.icon className="w-3.5 h-3.5" style={{ color: feature.color }} />
                                        </div>
                                        <div className="text-sm font-bold text-slate-800 dark:text-white">{stat.value}</div>
                                        <div className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">{stat.label}</div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent mb-4" />

                            {/* Feature checklist */}
                            <div className="space-y-2.5 mb-5">
                                {feature.detailPoints.map((point, i) => (
                                    <motion.div
                                        key={point}
                                        initial={{ opacity: 0, x: -15 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 + i * 0.06 }}
                                        className="flex items-center gap-2.5 group/item"
                                    >
                                        <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-colors" style={{ backgroundColor: `${feature.color}12` }}>
                                            <CheckCircle className="w-3 h-3" style={{ color: feature.color }} />
                                        </div>
                                        <span className="text-[13px] text-slate-600 dark:text-slate-400 font-medium group-hover/item:text-slate-900 dark:group-hover/item:text-white transition-colors">
                                            {point}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>

                            {/* CTA button */}
                            <motion.a
                                href="/auth/signup"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                onClick={(e) => e.stopPropagation()}
                                className={`w-full py-3 rounded-xl text-[13px] font-bold text-white flex items-center justify-center gap-2 bg-gradient-to-r ${feature.gradient} shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]`}
                            >
                                Try {feature.title} Free
                                <ArrowRight className="w-3.5 h-3.5" />
                            </motion.a>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Collapsed: progress bar + CTA */}
                {!isExpanded && (
                    <>
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

                        <motion.div
                            className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors relative z-10"
                            whileHover={{ x: 5 }}
                            transition={{ duration: 0.2 }}
                        >
                            <span>Click to explore</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </motion.div>
                    </>
                )}

                {/* Decorative blob */}
                <motion.div
                    className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${feature.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl ${feature.gradient} opacity-5 rounded-bl-full`} />
            </motion.div>
        </motion.div>
    )
}
