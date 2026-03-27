"use client"

import { useRef, useState, useEffect } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import {
    Users,
    Briefcase,
    UserCheck,
    DollarSign,
    Globe,
    CheckCircle,
    ArrowRight,
    Layers,
} from "lucide-react"

const modules = [
    {
        id: "crm",
        label: "CRM",
        icon: Users,
        color: "from-blue-600 to-indigo-700",
        bgAccent: "bg-blue-50",
        borderAccent: "border-blue-200",
        textAccent: "text-blue-600",
        desc: "Full-stack client relationship management",
        features: [
            "Lead pipeline with stage tracking",
            "Client & contact management",
            "Deal creation & pipeline view",
            "Activities, calls & follow-ups",
            "Campaign management",
            "Lead scoring & analytics",
        ],
        mockStats: [
            { label: "Total Leads", value: "2,847", color: "bg-blue-100 text-blue-700" },
            { label: "Pipeline Value", value: "$147K", color: "bg-indigo-100 text-indigo-700" },
            { label: "Win Rate", value: "68.4%", color: "bg-emerald-100 text-emerald-700" },
        ],
    },
    {
        id: "pm",
        label: "Project Mgmt",
        icon: Briefcase,
        color: "from-purple-600 to-violet-700",
        bgAccent: "bg-purple-50",
        borderAccent: "border-purple-200",
        textAccent: "text-purple-600",
        desc: "Jira-style task and milestone tracking",
        features: [
            "Kanban & list board views",
            "Milestone & sprint planning",
            "Task assignment & priorities",
            "Time tracking per task",
            "File attachments & comments",
            "Project analytics reports",
        ],
        mockStats: [
            { label: "Active Projects", value: "24", color: "bg-purple-100 text-purple-700" },
            { label: "Tasks Done", value: "1,248", color: "bg-violet-100 text-violet-700" },
            { label: "On-time Rate", value: "91%", color: "bg-emerald-100 text-emerald-700" },
        ],
    },
    {
        id: "hr",
        label: "HR & Payroll",
        icon: UserCheck,
        color: "from-emerald-500 to-teal-600",
        bgAccent: "bg-emerald-50",
        borderAccent: "border-emerald-200",
        textAccent: "text-emerald-600",
        desc: "Complete HR operations hub",
        features: [
            "Employee profiles & records",
            "Leave & attendance tracking",
            "Payroll calculation engine",
            "Department & role management",
            "Performance reviews",
            "HR analytics dashboard",
        ],
        mockStats: [
            { label: "Total Employees", value: "342", color: "bg-emerald-100 text-emerald-700" },
            { label: "Leave Requests", value: "18", color: "bg-amber-100 text-amber-700" },
            { label: "Payroll Processed", value: "$84K", color: "bg-teal-100 text-teal-700" },
        ],
    },
    {
        id: "finance",
        label: "Finance",
        icon: DollarSign,
        color: "from-amber-500 to-orange-600",
        bgAccent: "bg-amber-50",
        borderAccent: "border-amber-200",
        textAccent: "text-amber-600",
        desc: "Invoices, expenses & financial reports",
        features: [
            "Invoice creation & tracking",
            "Expense management",
            "Revenue & MRR analytics",
            "Subscription billing",
            "Forecasting dashboards",
            "Tax & compliance reports",
        ],
        mockStats: [
            { label: "Total Revenue", value: "$14.2M", color: "bg-amber-100 text-amber-700" },
            { label: "Pending Invoices", value: "47", color: "bg-orange-100 text-orange-700" },
            { label: "MRR Growth", value: "+12%", color: "bg-emerald-100 text-emerald-700" },
        ],
    },
    {
        id: "portal",
        label: "Client Portal",
        icon: Globe,
        color: "from-rose-500 to-pink-600",
        bgAccent: "bg-rose-50",
        borderAccent: "border-rose-200",
        textAccent: "text-rose-600",
        desc: "External portal for your clients",
        features: [
            "Branded client login portal",
            "Invoice & payment access",
            "Document sharing hub",
            "Project status visibility",
            "Support ticket submission",
            "Real-time notifications",
        ],
        mockStats: [
            { label: "Active Clients", value: "189", color: "bg-rose-100 text-rose-700" },
            { label: "Portal Sessions", value: "4,200", color: "bg-pink-100 text-pink-700" },
            { label: "Satisfaction", value: "4.9★", color: "bg-emerald-100 text-emerald-700" },
        ],
    },
]

export default function ModulesShowcase({ isPage = false }: { isPage?: boolean }) {
    const [activeId, setActiveId] = useState("crm")
    const ref = useRef<HTMLDivElement>(null)
    const inView = useInView(ref, { once: true, margin: "-80px" })

    // Sync activeId with URL hash if it exists
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.replace("#", "")
            if (hash && modules.some((m) => m.id === hash)) {
                setActiveId(hash)
            }
        }

        // Run on mount
        handleHashChange()

        // Sync on events
        window.addEventListener("hashchange", handleHashChange)
        window.addEventListener("popstate", handleHashChange)

        // Periodic watcher for edge cases (Next.js soft navigation)
        const watcher = setInterval(handleHashChange, 500)

        return () => {
            window.removeEventListener("hashchange", handleHashChange)
            window.removeEventListener("popstate", handleHashChange)
            clearInterval(watcher)
        }
    }, [])

    const active = modules.find((m) => m.id === activeId)!

    return (
        <section id="modules" className={`${isPage ? "pt-10 pb-28" : "py-28"} bg-slate-50 dark:bg-slate-900/40 relative overflow-hidden transition-colors duration-500 border-y border-slate-200/60 dark:border-white/5`} ref={ref}>
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-50/50 dark:bg-indigo-600/5 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-14"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 mb-6">
                        <Layers className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400 tracking-widest uppercase">
                            Platform Modules
                        </span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-4">
                        One Platform.{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">
                            Every Module.
                        </span>
                    </h2>
                    <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
                        Switch between powerful modules without switching tools. Everything is connected,
                        everything is real-time.
                    </p>
                </motion.div>

                {/* Tab Pills */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="flex flex-wrap justify-center gap-3 mb-12"
                >
                    {modules.map((mod) => (
                        <button
                            key={mod.id}
                            onClick={() => setActiveId(mod.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-semibold text-sm border transition-all duration-200 ${activeId === mod.id
                                ? `bg-gradient-to-r ${mod.color} text-white border-transparent shadow-lg scale-105`
                                : "bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-50 dark:hover:bg-white/10"
                                }`}
                        >
                            <mod.icon className="w-4 h-4" />
                            {mod.label}
                        </button>
                    ))}
                </motion.div>

                {/* Content Panel */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
                    >
                        {/* Left: Feature List */}
                        <div>
                            <div className="flex items-center gap-4 mb-6">
                                <div
                                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${active.color} flex items-center justify-center shadow-xl`}
                                >
                                    <active.icon className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">{active.label}</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm">{active.desc}</p>
                                </div>
                            </div>

                            <div className="space-y-3 mb-8">
                                {active.features.map((feat, i) => (
                                    <motion.div
                                        key={feat}
                                        initial={{ opacity: 0, x: -16 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.06 }}
                                        className="flex items-center gap-3"
                                    >
                                        <CheckCircle className={`w-4 h-4 ${active.textAccent} flex-shrink-0`} />
                                        <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">{feat}</span>
                                    </motion.div>
                                ))}
                            </div>

                            <a
                                href="/auth/signup"
                                className={`inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-gradient-to-r ${active.color} rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105`}
                            >
                                Explore {active.label}
                                <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>

                        {/* Right: Mock Dashboard Panel */}
                        <div
                            className={`${active.bgAccent} dark:bg-white/[0.03] ${active.borderAccent} dark:border-white/10 border-2 rounded-3xl p-6 relative overflow-hidden`}
                        >
                            {/* Browser chrome mock */}
                            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg overflow-hidden border border-slate-100 dark:border-white/5">
                                <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-white/5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                                    <div
                                        className={`ml-3 flex-1 h-5 ${active.bgAccent} dark:bg-slate-700/50 rounded flex items-center px-2`}
                                    >
                                        <span className={`text-[10px] font-mono ${active.textAccent} dark:text-blue-400`}>
                                            cubicle.app/{active.id}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-5">
                                    {/* Stats row */}
                                    <div className="grid grid-cols-3 gap-3 mb-5">
                                        {active.mockStats.map((stat) => (
                                            <div key={stat.label} className={`${stat.color} dark:bg-slate-800/30 dark:text-blue-400 dark:border dark:border-white/5 rounded-xl px-3 py-3 text-center transition-colors`}>
                                                <div className="font-black text-base">{stat.value}</div>
                                                <div className="text-[10px] font-semibold opacity-70 mt-0.5">{stat.label}</div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Module-specific list preview */}
                                    <div className="space-y-2.5">
                                        {active.features.slice(0, 3).map((f, i) => (
                                            <div key={f} className="flex items-center gap-3 p-2.5 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-white/5">
                                                <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${active.color} flex items-center justify-center flex-shrink-0`}>
                                                    <CheckCircle className="w-3.5 h-3.5 text-white" />
                                                </div>
                                                <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">{f}</span>
                                                <div className="ml-auto">
                                                    <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full bg-gradient-to-r ${active.color} rounded-full`}
                                                            style={{ width: `${[80, 65, 90][i]}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Floating badge */}
                            <div
                                className={`absolute top-4 right-4 bg-gradient-to-r ${active.color} text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md`}
                            >
                                Active Module
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    )
}
