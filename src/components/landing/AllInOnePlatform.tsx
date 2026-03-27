"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Users, UserCheck, Briefcase, DollarSign, Globe, HeadphonesIcon, ArrowRight, BarChart3, Shield } from "lucide-react"

const modules = [
    { icon: Users, label: "CRM", desc: "Leads, deals, pipeline", color: "#6366F1", gradient: "from-indigo-500 to-violet-600" },
    { icon: UserCheck, label: "HRM", desc: "People, payroll, leaves", color: "#10B981", gradient: "from-emerald-500 to-teal-600" },
    { icon: Briefcase, label: "Projects", desc: "Tasks, sprints, boards", color: "#8B5CF6", gradient: "from-violet-500 to-purple-600" },
    { icon: DollarSign, label: "Finance", desc: "Invoices, expenses, MRR", color: "#F59E0B", gradient: "from-amber-500 to-orange-600" },
    { icon: Globe, label: "Client Portal", desc: "Branded portal access", color: "#EC4899", gradient: "from-pink-500 to-rose-600" },
    { icon: HeadphonesIcon, label: "Helpdesk", desc: "Tickets, SLAs, KB", color: "#06B6D4", gradient: "from-cyan-500 to-blue-600" },
    { icon: BarChart3, label: "Analytics", desc: "Dashboards, reports", color: "#3B82F6", gradient: "from-blue-500 to-indigo-600" },
    { icon: Shield, label: "Admin", desc: "Roles, audit, security", color: "#EF4444", gradient: "from-red-500 to-rose-600" },
]

const connections = [
    "CRM lead → Auto-creates Project task",
    "Invoice paid → Updates Finance dashboard",
    "Employee added → HRM triggers onboarding flow",
    "Support ticket → Links to CRM contact",
    "Project milestone → Notifies client via Portal",
]

export default function AllInOnePlatform() {
    const ref = useRef<HTMLDivElement>(null)
    const inView = useInView(ref, { once: true, margin: "-80px" })

    return (
        <section
            ref={ref}
            className="relative py-28 bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 dark:from-[#080824] dark:via-[#0A0A30] dark:to-[#0C0C35] overflow-hidden"
        >
            {/* Background effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[150px]" />
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                    }}
                />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
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
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] mb-6"
                    >
                        <Globe className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="text-xs font-bold text-indigo-300 tracking-widest uppercase">
                            Unified Platform
                        </span>
                    </motion.div>

                    <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-[1.1] mb-4">
                        One platform to{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
                            rule them all
                        </span>
                    </h2>
                    <p className="text-lg text-white/40 max-w-2xl mx-auto">
                        Every module talks to every other. No more data silos, no more copy-pasting
                        between tools. Your entire business in one connected workspace.
                    </p>
                </motion.div>

                {/* Modules grid - hexagonal-inspired layout */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto mb-14">
                    {modules.map((mod, i) => (
                        <motion.div
                            key={mod.label}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={inView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ delay: 0.2 + i * 0.06, duration: 0.4, type: "spring", stiffness: 100 }}
                            whileHover={{ y: -10, scale: 1.05, transition: { duration: 0.2 } }}
                            className="group relative"
                        >
                            <div className="relative bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-5 text-center hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 cursor-default overflow-hidden">
                                {/* Glow on hover */}
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                                    style={{ background: `radial-gradient(circle at 50% 50%, ${mod.color}15, transparent 70%)` }}
                                />

                                {/* Top accent */}
                                <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${mod.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl`} />

                                <motion.div
                                    whileHover={{ rotate: [0, -10, 10, 0] }}
                                    transition={{ duration: 0.4 }}
                                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${mod.gradient} flex items-center justify-center mx-auto mb-3 shadow-lg relative z-10`}
                                >
                                    <mod.icon className="w-6 h-6 text-white" />
                                </motion.div>

                                <div className="text-white font-bold text-sm mb-1 relative z-10">{mod.label}</div>
                                <div className="text-white/30 text-[11px] relative z-10">{mod.desc}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Cross-module connections */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.7, duration: 0.6 }}
                    className="max-w-3xl mx-auto"
                >
                    <div className="text-center mb-6">
                        <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-[0.2em]">
                            Cross-Module Intelligence
                        </span>
                    </div>

                    <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
                        <div className="space-y-2.5">
                            {connections.map((conn, i) => (
                                <motion.div
                                    key={conn}
                                    initial={{ opacity: 0, x: -15 }}
                                    animate={inView ? { opacity: 1, x: 0 } : {}}
                                    transition={{ delay: 0.9 + i * 0.08 }}
                                    className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.05] hover:border-white/[0.1] transition-all duration-200 cursor-default group"
                                >
                                    <div className="w-6 h-6 rounded-md bg-indigo-500/15 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-500/25 transition-colors">
                                        <ArrowRight className="w-3 h-3 text-indigo-400" />
                                    </div>
                                    <span className="text-[13px] text-white/50 group-hover:text-white/80 transition-colors">{conn}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
