"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { UserPlus, Settings, Upload, Rocket, ArrowRight, CheckCircle } from "lucide-react"

const steps = [
    {
        num: "01",
        icon: UserPlus,
        title: "Create your account",
        desc: "Sign up in 30 seconds. No credit card required — start exploring the platform instantly.",
        highlights: ["Email or Google sign-up", "Instant workspace creation"],
        color: "#6366F1",
        gradient: "from-indigo-500 to-violet-600",
    },
    {
        num: "02",
        icon: Settings,
        title: "Configure your workspace",
        desc: "Set up your organization, invite team members, and enable the modules your business needs.",
        highlights: ["Role-based permissions", "Custom branding"],
        color: "#8B5CF6",
        gradient: "from-violet-500 to-purple-600",
    },
    {
        num: "03",
        icon: Upload,
        title: "Import your data",
        desc: "Bring data from spreadsheets, CSV files, or migrate directly from tools like Salesforce and HubSpot.",
        highlights: ["Bulk CSV/Excel import", "One-click migration"],
        color: "#3B82F6",
        gradient: "from-blue-500 to-indigo-600",
    },
    {
        num: "04",
        icon: Rocket,
        title: "Go live & grow",
        desc: "Launch your platform and start managing leads, projects, HR, and finances — all from day one.",
        highlights: ["Real-time dashboards", "AI-powered insights"],
        color: "#10B981",
        gradient: "from-emerald-500 to-teal-600",
    },
]

export default function HowItWorks() {
    const ref = useRef<HTMLDivElement>(null)
    const inView = useInView(ref, { once: true, margin: "-80px" })

    return (
        <section
            id="how-it-works"
            ref={ref}
            className="relative py-28 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/50 dark:to-slate-950 overflow-hidden"
        >
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={inView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.5, type: "spring" }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 dark:bg-indigo-400/5 border border-indigo-500/20 dark:border-indigo-400/10 mb-6"
                    >
                        <Rocket className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-widest uppercase">
                            Get Started
                        </span>
                    </motion.div>

                    <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-4">
                        Up and running in{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
                            minutes
                        </span>
                    </h2>
                    <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
                        Four simple steps to transform how your entire team works.
                    </p>
                </motion.div>

                {/* Steps */}
                <div className="relative">
                    {/* Connecting line */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={inView ? { scaleX: 1 } : {}}
                        transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
                        className="hidden lg:block absolute top-[72px] left-[12%] right-[12%] h-[2px] origin-left"
                        style={{
                            background: "linear-gradient(90deg, #6366F1, #8B5CF6, #3B82F6, #10B981)",
                        }}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {steps.map((step, i) => (
                            <motion.div
                                key={step.num}
                                initial={{ opacity: 0, y: 40 }}
                                animate={inView ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: 0.3 + i * 0.15, duration: 0.5, type: "spring", stiffness: 80 }}
                                whileHover={{ y: -8, transition: { duration: 0.25 } }}
                                className="relative group"
                            >
                                {/* Dot on line */}
                                <div
                                    className="hidden lg:block absolute top-[68px] left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-[3px] border-white dark:border-slate-950 z-10 shadow-md"
                                    style={{ backgroundColor: step.color }}
                                />

                                {/* Card */}
                                <div className="relative bg-white dark:bg-slate-800/50 border-2 border-slate-200/80 dark:border-white/10 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group-hover:border-slate-300 dark:group-hover:border-white/20">
                                    {/* Top accent */}
                                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${step.gradient} rounded-t-3xl opacity-60 group-hover:opacity-100 transition-opacity`} />

                                    {/* Hover glow */}
                                    <div
                                        className="absolute inset-0 opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500 rounded-3xl"
                                        style={{ background: `radial-gradient(circle at 50% 0%, ${step.color}, transparent 70%)` }}
                                    />

                                    {/* Step number + icon */}
                                    <div className="flex items-center gap-3 mb-5">
                                        <motion.div
                                            whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
                                            transition={{ duration: 0.4 }}
                                            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg relative`}
                                        >
                                            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.gradient} blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300`} />
                                            <step.icon className="w-6 h-6 text-white relative z-10" />
                                        </motion.div>
                                        <span
                                            className="text-[11px] font-black uppercase tracking-[0.15em]"
                                            style={{ color: step.color }}
                                        >
                                            Step {step.num}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight mb-2">
                                        {step.title}
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                                        {step.desc}
                                    </p>

                                    {/* Highlights */}
                                    <div className="space-y-2">
                                        {step.highlights.map((h) => (
                                            <div key={h} className="flex items-center gap-2">
                                                <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: step.color }} />
                                                <span className="text-[12px] font-medium text-slate-500 dark:text-slate-400">{h}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="text-center mt-16"
                >
                    <motion.a
                        href="/auth/signup"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 text-sm transition-shadow"
                    >
                        Get Started for Free
                        <ArrowRight className="w-4 h-4" />
                    </motion.a>
                </motion.div>
            </div>
        </section>
    )
}
