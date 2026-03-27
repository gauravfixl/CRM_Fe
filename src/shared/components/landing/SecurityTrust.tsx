"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Shield, Lock, Key, Eye, FileCheck, Server, CheckCircle, Globe } from "lucide-react"

const securityFeatures = [
    {
        icon: Lock,
        title: "256-bit AES Encryption",
        desc: "All data encrypted at rest and in transit with military-grade encryption standards.",
        color: "#6366F1",
    },
    {
        icon: Key,
        title: "Multi-Factor Auth (MFA)",
        desc: "Enforce 2FA across your organization with TOTP, SMS, or authenticator app support.",
        color: "#8B5CF6",
    },
    {
        icon: Eye,
        title: "Comprehensive Audit Logs",
        desc: "Track every action, login, and data change with timestamped, searchable audit trails.",
        color: "#3B82F6",
    },
    {
        icon: FileCheck,
        title: "Role-Based Access Control",
        desc: "Granular permissions with custom roles. Control who sees what, down to field level.",
        color: "#10B981",
    },
    {
        icon: Server,
        title: "99.9% Uptime SLA",
        desc: "Enterprise-grade infrastructure with auto-scaling, failover, and real-time monitoring.",
        color: "#F59E0B",
    },
    {
        icon: Globe,
        title: "GDPR & SOC2 Ready",
        desc: "Built-in compliance tools for GDPR, SOC2, HIPAA, and regional data residency requirements.",
        color: "#EC4899",
    },
]

const certifications = [
    { label: "SOC 2 Type II", icon: Shield },
    { label: "GDPR", icon: Globe },
    { label: "ISO 27001", icon: FileCheck },
    { label: "AES-256", icon: Lock },
]

export default function SecurityTrust() {
    const ref = useRef<HTMLDivElement>(null)
    const inView = useInView(ref, { once: true, margin: "-80px" })

    return (
        <section
            ref={ref}
            className="relative py-28 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/50 dark:to-slate-950 overflow-hidden"
        >
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/3 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px]" />
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
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-400/5 border border-emerald-500/20 dark:border-emerald-400/10 mb-6"
                    >
                        <Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 tracking-widest uppercase">
                            Enterprise Security
                        </span>
                    </motion.div>

                    <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-4">
                        Security that{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400">
                            never sleeps
                        </span>
                    </h2>
                    <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                        Enterprise-grade protection built into every layer. Your data is encrypted, audited,
                        and compliant — by default, not as an upgrade.
                    </p>
                </motion.div>

                {/* Security features grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
                    {securityFeatures.map((feature, i) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 30 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.2 + i * 0.08, duration: 0.5 }}
                            whileHover={{ y: -6, transition: { duration: 0.2 } }}
                            className="group relative bg-white dark:bg-slate-800/50 border-2 border-slate-200/80 dark:border-white/10 rounded-2xl p-6 hover:shadow-xl hover:border-slate-300 dark:hover:border-white/20 transition-all duration-300 cursor-default overflow-hidden"
                        >
                            {/* Top accent */}
                            <div
                                className="absolute top-0 left-0 right-0 h-[2px] opacity-50 group-hover:opacity-100 transition-opacity duration-300"
                                style={{ background: `linear-gradient(90deg, transparent, ${feature.color}, transparent)` }}
                            />

                            {/* Hover glow */}
                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500"
                                style={{ background: `radial-gradient(circle at 50% 0%, ${feature.color}, transparent 70%)` }}
                            />

                            <motion.div
                                whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
                                transition={{ duration: 0.4 }}
                                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-md relative z-10"
                                style={{ backgroundColor: `${feature.color}12` }}
                            >
                                <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
                            </motion.div>

                            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 relative z-10">{feature.title}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed relative z-10">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Certifications bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="flex flex-wrap items-center justify-center gap-4"
                >
                    {certifications.map((cert) => (
                        <div
                            key={cert.label}
                            className="flex items-center gap-2.5 px-5 py-3 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20"
                        >
                            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">{cert.label}</span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
