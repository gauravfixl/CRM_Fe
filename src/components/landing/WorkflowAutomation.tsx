"use client"

import { useRef, useState } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { Zap, ArrowRight, CheckCircle, Users, Mail, Bell, FileText, Clock, Target, Repeat, GitBranch } from "lucide-react"

const automationExamples = [
    {
        id: "lead",
        label: "Lead Assignment",
        icon: Target,
        color: "#6366F1",
        trigger: "New lead created",
        steps: [
            { label: "Score lead (AI)", icon: Zap, delay: "Instant" },
            { label: "Assign to rep", icon: Users, delay: "Auto" },
            { label: "Send welcome email", icon: Mail, delay: "2 min" },
            { label: "Create follow-up task", icon: FileText, delay: "24h" },
            { label: "Notify manager", icon: Bell, delay: "If high-value" },
        ],
    },
    {
        id: "invoice",
        label: "Invoice Flow",
        icon: FileText,
        color: "#F59E0B",
        trigger: "Invoice generated",
        steps: [
            { label: "Calculate taxes", icon: Zap, delay: "Instant" },
            { label: "Send to client", icon: Mail, delay: "Auto" },
            { label: "Payment reminder", icon: Bell, delay: "7 days" },
            { label: "Escalate overdue", icon: Clock, delay: "30 days" },
            { label: "Update accounting", icon: FileText, delay: "On payment" },
        ],
    },
    {
        id: "onboard",
        label: "Employee Onboarding",
        icon: Users,
        color: "#10B981",
        trigger: "New employee added",
        steps: [
            { label: "Create accounts", icon: Zap, delay: "Instant" },
            { label: "Send offer letter", icon: Mail, delay: "Auto" },
            { label: "Assign training", icon: FileText, delay: "Day 1" },
            { label: "Schedule orientation", icon: Clock, delay: "Week 1" },
            { label: "Performance check-in", icon: Target, delay: "30 days" },
        ],
    },
]

const capabilities = [
    { icon: GitBranch, label: "Conditional logic", desc: "If/else branching" },
    { icon: Repeat, label: "Recurring triggers", desc: "Scheduled workflows" },
    { icon: Zap, label: "Multi-step chains", desc: "Complex pipelines" },
    { icon: Bell, label: "Smart notifications", desc: "Context-aware alerts" },
]

export default function WorkflowAutomation() {
    const ref = useRef<HTMLDivElement>(null)
    const inView = useInView(ref, { once: true, margin: "-80px" })
    const [activeFlow, setActiveFlow] = useState("lead")
    const active = automationExamples.find((a) => a.id === activeFlow)!

    return (
        <section
            ref={ref}
            className="relative py-28 bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-950 dark:to-slate-900/30 overflow-hidden border-b border-slate-200/60 dark:border-white/5"
        >
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px]" />
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
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 dark:bg-amber-400/5 border border-amber-500/20 dark:border-amber-400/10 mb-6"
                    >
                        <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        <span className="text-xs font-bold text-amber-600 dark:text-amber-400 tracking-widest uppercase">
                            Workflow Automation
                        </span>
                    </motion.div>

                    <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-4">
                        Automate everything.{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600 dark:from-amber-400 dark:to-orange-500">
                            Focus on growth.
                        </span>
                    </h2>
                    <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                        Build powerful no-code workflows that automate lead routing, invoice reminders,
                        employee onboarding, and hundreds more — saving your team hours every week.
                    </p>
                </motion.div>

                {/* Main content */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                    {/* Left: Flow selector + capabilities */}
                    <div className="lg:col-span-2">
                        {/* Flow tabs */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={inView ? { opacity: 1, x: 0 } : {}}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="space-y-2 mb-8"
                        >
                            {automationExamples.map((flow) => (
                                <button
                                    key={flow.id}
                                    onClick={() => setActiveFlow(flow.id)}
                                    className={`w-full flex items-center gap-3 p-4 rounded-2xl text-left transition-all duration-300 border-2 ${
                                        activeFlow === flow.id
                                            ? "bg-gradient-to-r from-slate-50 to-white dark:from-white/[0.04] dark:to-white/[0.02] border-slate-300 dark:border-white/15 shadow-lg"
                                            : "bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-white/[0.02] hover:border-slate-200 dark:hover:border-white/5"
                                    }`}
                                >
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md flex-shrink-0"
                                        style={{ background: `linear-gradient(135deg, ${flow.color}, ${flow.color}CC)` }}
                                    >
                                        <flow.icon className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-slate-900 dark:text-white">{flow.label}</div>
                                        <div className="text-[11px] text-slate-400">Trigger: {flow.trigger}</div>
                                    </div>
                                    {activeFlow === flow.id && (
                                        <motion.div
                                            layoutId="flow-indicator"
                                            className="ml-auto w-2 h-2 rounded-full"
                                            style={{ backgroundColor: flow.color }}
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                </button>
                            ))}
                        </motion.div>

                        {/* Capabilities */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="grid grid-cols-2 gap-3"
                        >
                            {capabilities.map((cap) => (
                                <div
                                    key={cap.label}
                                    className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5"
                                >
                                    <cap.icon className="w-4 h-4 text-amber-500 mb-2" />
                                    <div className="text-[12px] font-semibold text-slate-700 dark:text-white">{cap.label}</div>
                                    <div className="text-[10px] text-slate-400">{cap.desc}</div>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Right: Visual workflow */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="lg:col-span-3"
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeFlow}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.3 }}
                                className="bg-gradient-to-br from-slate-50 to-white dark:from-white/[0.03] dark:to-white/[0.01] border-2 border-slate-200/80 dark:border-white/10 rounded-3xl p-6 shadow-xl"
                            >
                                {/* Trigger */}
                                <div className="flex items-center gap-3 mb-6">
                                    <div
                                        className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                                        style={{ background: `linear-gradient(135deg, ${active.color}, ${active.color}BB)` }}
                                    >
                                        <Zap className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: active.color }}>
                                            Trigger
                                        </div>
                                        <div className="text-sm font-bold text-slate-900 dark:text-white">{active.trigger}</div>
                                    </div>
                                </div>

                                {/* Steps */}
                                <div className="space-y-3 relative">
                                    {/* Connecting line */}
                                    <div
                                        className="absolute left-[23px] top-0 bottom-0 w-[2px]"
                                        style={{ background: `linear-gradient(to bottom, ${active.color}40, ${active.color}10)` }}
                                    />

                                    {active.steps.map((step, i) => (
                                        <motion.div
                                            key={step.label}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.08, duration: 0.3 }}
                                            className="relative flex items-center gap-4 p-3.5 rounded-xl bg-white dark:bg-white/[0.04] border border-slate-100 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/15 hover:shadow-md transition-all duration-200 cursor-default group"
                                        >
                                            {/* Step dot */}
                                            <div
                                                className="w-[46px] h-[46px] rounded-xl flex items-center justify-center flex-shrink-0 z-10 shadow-sm group-hover:shadow-md transition-shadow"
                                                style={{ backgroundColor: `${active.color}10` }}
                                            >
                                                <step.icon className="w-5 h-5" style={{ color: active.color }} />
                                            </div>

                                            <div className="flex-1">
                                                <div className="text-[13px] font-semibold text-slate-800 dark:text-white">{step.label}</div>
                                            </div>

                                            <div
                                                className="text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0"
                                                style={{ color: active.color, backgroundColor: `${active.color}10` }}
                                            >
                                                {step.delay}
                                            </div>

                                            {/* Animated check on hover */}
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                whileHover={{ scale: 1 }}
                                                className="absolute -right-2 -top-2"
                                            >
                                                <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shadow-md">
                                                    <CheckCircle className="w-3 h-3 text-white" />
                                                </div>
                                            </motion.div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Footer */}
                                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute h-full w-full rounded-full opacity-75" style={{ backgroundColor: active.color }} />
                                            <span className="relative rounded-full h-2 w-2" style={{ backgroundColor: active.color }} />
                                        </span>
                                        Automation active
                                    </div>
                                    <span className="text-[11px] font-medium text-slate-400">
                                        {active.steps.length} steps • No code required
                                    </span>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
