"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import {
    MessageSquare, Video, HardDrive, Github, CreditCard, Zap, Cloud,
    Calculator, Mail, Phone, Server, FileText, CheckSquare, Chrome, Kanban,
    Database, Webhook, ArrowRight
} from "lucide-react"

const integrations = [
    { icon: MessageSquare, label: "Slack", color: "#E01E5A" },
    { icon: Chrome, label: "Google Suite", color: "#4285F4" },
    { icon: Video, label: "Zoom", color: "#2D8CFF" },
    { icon: HardDrive, label: "Dropbox", color: "#0061FF" },
    { icon: Github, label: "GitHub", color: "#6E5494" },
    { icon: CreditCard, label: "Stripe", color: "#6366F1" },
    { icon: Zap, label: "Zapier", color: "#FF4F00" },
    { icon: Cloud, label: "Salesforce", color: "#00A1E0" },
    { icon: Kanban, label: "Jira", color: "#0052CC" },
    { icon: Calculator, label: "QuickBooks", color: "#2CA01C" },
    { icon: Mail, label: "Mailchimp", color: "#FFE01B" },
    { icon: Phone, label: "Twilio", color: "#F22F46" },
    { icon: Server, label: "AWS", color: "#FF9900" },
    { icon: FileText, label: "Notion", color: "#191919" },
    { icon: CheckSquare, label: "Asana", color: "#F06A6A" },
    { icon: Database, label: "MongoDB", color: "#47A248" },
]

const apiFeatures = [
    { icon: Webhook, label: "REST API", desc: "Full CRUD operations" },
    { icon: Zap, label: "Webhooks", desc: "Real-time event hooks" },
    { icon: Database, label: "Bulk Import", desc: "CSV, Excel, JSON" },
]

export default function IntegrationsSection() {
    const ref = useRef<HTMLDivElement>(null)
    const inView = useInView(ref, { once: true, margin: "-60px" })

    return (
        <section
            ref={ref}
            className="relative py-28 bg-gradient-to-br from-white to-sky-50/40 dark:from-slate-950 dark:to-sky-950/20 overflow-hidden border-b border-slate-200/60 dark:border-white/5"
        >
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/[0.03] rounded-full blur-[120px]" />
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
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 dark:bg-cyan-400/5 border border-cyan-500/20 dark:border-cyan-400/10 mb-6"
                    >
                        <Zap className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                        <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 tracking-widest uppercase">
                            Integrations
                        </span>
                    </motion.div>

                    <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-4">
                        Connects with{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400">
                            your favorite tools
                        </span>
                    </h2>
                    <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
                        Seamlessly integrate with 50+ tools your team already uses every day.
                    </p>
                </motion.div>

                {/* Integration grid */}
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 max-w-4xl mx-auto mb-12">
                    {integrations.map((item, i) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, scale: 0.7 }}
                            animate={inView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ delay: 0.1 + i * 0.03, duration: 0.4, type: "spring", stiffness: 120 }}
                            whileHover={{
                                y: -8,
                                scale: 1.12,
                                transition: { duration: 0.2 },
                            }}
                            className="group relative aspect-square flex flex-col items-center justify-center rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.06] hover:border-slate-300 dark:hover:border-white/20 hover:shadow-lg transition-all cursor-default overflow-hidden"
                        >
                            {/* Hover color glow */}
                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                                style={{ background: `radial-gradient(circle, ${item.color}10, transparent 70%)` }}
                            />

                            <div
                                className="w-9 h-9 rounded-xl flex items-center justify-center mb-1.5 transition-all duration-300 group-hover:shadow-md relative z-10"
                                style={{
                                    backgroundColor: `${item.color}10`,
                                }}
                            >
                                <item.icon
                                    className="w-4.5 h-4.5 transition-colors duration-300"
                                    style={{ color: `${item.color}80` }}
                                />
                            </div>
                            <span className="text-[9px] font-semibold text-slate-400 group-hover:text-slate-600 dark:group-hover:text-white/60 transition-colors relative z-10">
                                {item.label}
                            </span>
                        </motion.div>
                    ))}
                </div>

                {/* API features */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="flex flex-wrap justify-center gap-4 mb-8"
                >
                    {apiFeatures.map((feat) => (
                        <div
                            key={feat.label}
                            className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.06]"
                        >
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                                <feat.icon className="w-4 h-4 text-indigo-500" />
                            </div>
                            <div>
                                <div className="text-[13px] font-bold text-slate-700 dark:text-white">{feat.label}</div>
                                <div className="text-[10px] text-slate-400">{feat.desc}</div>
                            </div>
                        </div>
                    ))}
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.8 }}
                    className="text-center text-sm text-slate-400"
                >
                    And 50+ more through our API and{" "}
                    <a href="/auth/signup" className="text-indigo-500 font-semibold hover:underline">
                        integration marketplace
                    </a>
                </motion.p>
            </div>
        </section>
    )
}
