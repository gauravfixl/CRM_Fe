"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Users,
    Zap,
    Shield,
    ChevronRight,
    CheckCircle2,
    BarChart3,
    Target,
    Workflow,
    Activity,
    Rocket,
    ArrowLeft,
    CheckCircle,
    Sparkles
} from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/landing/Navbar"
import Footer from "@/components/landing/Footer"

const featuresData = [
    {
        id: "lead-management",
        title: "Lead Intelligence",
        subtitle: "Convert faster with data-driven lead scoring and automated tracking.",
        icon: Target,
        gradient: "from-blue-600 to-cyan-500",
        shadow: "shadow-blue-500/30",
        bullets: ["Lead Enrichment", "Custom Scoring", "Auto-Routing"],
        deepDive: [
            { label: "Predictive Scoring", desc: "Identify high-intent leads using machine learning patterns." },
            { label: "Social Enrichment", desc: "Automatically fetch LinkedIn and public professional profiles." },
            { label: "Geography Routing", desc: "Instantly assign leads to region-specific sales account managers." }
        ],
        impact: "Reduces response time from 4 hrs to 8 mins."
    },
    {
        id: "crm-pipeline",
        title: "Dynamic Pipeline",
        subtitle: "A visual masterpiece for your sales workflow. Drag, drop, and close.",
        icon: Workflow,
        gradient: "from-indigo-600 to-purple-600",
        shadow: "shadow-indigo-500/30",
        bullets: ["Kanban Mastery", "Velocity Charts", "Deal Automation"],
        deepDive: [
            { label: "Infinite Customization", desc: "Create unlimited pipelines for various products and regions." },
            { label: "Deal Logic", desc: "Trigger automated tasks when deals sit in one stage for too long." },
            { label: "Bulk Velocity", desc: "Analyze the exact speed of deals moving through your funnel." }
        ],
        impact: "Improves sales team productivity by 40%."
    },
    {
        id: "analytics",
        title: "Elite Analytics",
        subtitle: "Beautiful, real-time dashboards that tell the story of your growth.",
        icon: BarChart3,
        gradient: "from-violet-600 to-fuchsia-600",
        shadow: "shadow-violet-500/30",
        bullets: ["MRR Metrics", "Churn Alerts", "Team Benchmarks"],
        deepDive: [
            { label: "Cohort Tracking", desc: "See exactly how long users stay with you and where they churn." },
            { label: "Live Dashboard", desc: "Real-time updates on every screen across your office." },
            { label: "Export Engine", desc: "Schedule automated report emails in PDF or Excel formats." }
        ],
        impact: "Provides a 98.5% accuracy rate in forecasting."
    },
    {
        id: "automation",
        title: "Smart Automation",
        subtitle: "Let your CRM work while you sleep. Automated follow-ups & triggers.",
        icon: Zap,
        gradient: "from-amber-500 to-orange-600",
        shadow: "shadow-amber-500/30",
        bullets: ["Workflow Builder", "Email Drip", "App Hooks"],
        deepDive: [
            { label: "Visual Logic", desc: "The simplest drag-and-drop automation builder on the market." },
            { label: "Smart Triggers", desc: "Fire webhooks or SMS based on any action in the system." },
            { label: "Sequence Engine", desc: "Complex multi-day email chains with conditional branches." }
        ],
        impact: "Saves administrators 15+ hours weekly."
    },
    {
        id: "team-ops",
        title: "Team Collaboration",
        subtitle: "Unify your team in a single, high-performance digital workspace.",
        icon: Users,
        gradient: "from-emerald-600 to-teal-700",
        shadow: "shadow-emerald-500/30",
        bullets: ["Unified Feed", "Mentions", "Shared Assets"],
        deepDive: [
            { label: "Real-time Feed", desc: "A live stream of team activities, keeping everyone synced." },
            { label: "Resource Library", desc: "Store pitch decks and assets directly within specific deals." },
            { label: "Manager Controls", desc: "Granular visibility without heavy micromanagement." }
        ],
        impact: "Closes the gap between sales and marketing."
    },
    {
        id: "security",
        title: "Shield Security",
        subtitle: "Bank-grade encryption because your data's safety is our priority.",
        icon: Shield,
        gradient: "from-rose-600 to-red-700",
        shadow: "shadow-rose-500/30",
        bullets: ["TLS Encryption", "SOC2 Readiness", "2FA Security"],
        deepDive: [
            { label: "State of Art Security", desc: "AES-256 encryption at rest and TLS 1.3 for all data in motion." },
            { label: "Audit Engine", desc: "Historical tracking of every single login and data modification." },
            { label: "Incident Response", desc: "24/7 scanning and automated threat detection." }
        ],
        impact: "Zero recorded data breaches or data loss."
    }
]

export default function FeaturesPage() {
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const selectedFeature = featuresData.find(f => f.id === selectedId)

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [selectedId])

    return (
        <main className="min-h-screen bg-[#020617] text-white selection:bg-indigo-500/30 overflow-x-hidden font-inter">
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&family=Inter:wght@300;400;600&display=swap');
                h1, h2, h3, h4, .font-outfit { font-family: 'Outfit', sans-serif; }
            `}</style>

            <Navbar />

            {/* Shared Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.1]" />
            </div>

            <AnimatePresence mode="wait">
                {!selectedId ? (
                    /* GRID VIEW */
                    <motion.div
                        key="grid-view"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="relative z-10"
                    >
                        <header className="pt-32 pb-16 text-center px-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 mb-4 border border-indigo-500/20"
                            >
                                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-300">Feature Matrix</span>
                            </motion.div>
                            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter leading-none">
                                Explore Our <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">Core Engine.</span>
                            </h1>
                            <p className="text-base md:text-lg text-slate-400 max-w-xl mx-auto font-light">
                                Click any core module below to dive deep into its infrastructure and capabilities.
                            </p>
                        </header>

                        <section className="pb-32 px-4 sm:px-6">
                            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {featuresData.map((feature, i) => (
                                    <motion.div
                                        key={feature.id}
                                        layoutId={`card-${feature.id}`}
                                        onClick={() => setSelectedId(feature.id)}
                                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                        className="group relative bg-white/[0.02] border border-white/5 p-8 rounded-[40px] cursor-pointer hover:bg-white/[0.05] transition-all overflow-hidden"
                                    >
                                        <motion.div
                                            layoutId={`icon-box-${feature.id}`}
                                            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-2xl ${feature.shadow}`}
                                        >
                                            <feature.icon className="w-7 h-7 text-white" />
                                        </motion.div>

                                        <motion.h3
                                            layoutId={`title-${feature.id}`}
                                            className="text-xl font-bold mb-3 tracking-tight"
                                        >
                                            {feature.title}
                                        </motion.h3>

                                        <motion.p
                                            layoutId={`subtitle-${feature.id}`}
                                            className="text-slate-400 text-xs leading-relaxed mb-8 italic"
                                        >
                                            "{feature.subtitle}"
                                        </motion.p>

                                        <div className="space-y-2">
                                            {feature.bullets.map((b, idx) => (
                                                <div key={idx} className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                                                    <div className={`w-1 h-1 rounded-full bg-gradient-to-r ${feature.gradient}`} />
                                                    {b}
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    </motion.div>
                ) : (
                    /* DETAIL VIEW - Refined Sizes */
                    <motion.div
                        key="detail-view"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative z-10 min-h-screen pt-28 pb-32"
                    >
                        <div className="max-w-6xl mx-auto px-4 sm:px-6">

                            <button
                                onClick={() => setSelectedId(null)}
                                className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-10 group"
                            >
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                <span className="font-bold text-[10px] tracking-[0.2em] uppercase">Return to Matrix</span>
                            </button>

                            {/* Refined Header */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
                                <div className="lg:col-span-8">
                                    <motion.div
                                        layoutId={`icon-box-${selectedFeature.id}`}
                                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedFeature.gradient} flex items-center justify-center mb-8 shadow-2xl`}
                                    >
                                        <selectedFeature.icon className="w-8 h-8 text-white" />
                                    </motion.div>

                                    <motion.h2
                                        layoutId={`title-${selectedFeature.id}`}
                                        className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4 leading-[1.1] uppercase"
                                    >
                                        {selectedFeature.title}
                                    </motion.h2>

                                    <motion.p
                                        layoutId={`subtitle-${selectedFeature.id}`}
                                        className="text-lg md:text-xl text-slate-400 font-light max-w-xl leading-relaxed"
                                    >
                                        {selectedFeature.subtitle}
                                    </motion.p>
                                </div>

                                <div className="lg:col-span-4 lg:pt-8">
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="p-8 bg-blue-600/10 border border-blue-500/20 rounded-[32px] backdrop-blur-3xl"
                                    >
                                        <h4 className="text-[10px] uppercase font-black tracking-widest text-blue-400 mb-4">Value Proposition</h4>
                                        <div className="text-xl font-bold text-white leading-tight mb-2">
                                            {selectedFeature.impact}
                                        </div>
                                        <div className="text-[10px] font-bold text-emerald-400 flex items-center gap-2">
                                            <Activity className="w-3 h-3" />
                                            Active Metric
                                        </div>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Deep Dive - Smaller Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                                {selectedFeature.deepDive.map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 * i }}
                                        className="p-8 bg-white/[0.03] border border-white/5 rounded-[32px] hover:bg-white/[0.05] transition-all"
                                    >
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className={`w-1 h-4 rounded-full bg-gradient-to-b ${selectedFeature.gradient}`} />
                                            <h5 className="font-bold text-white text-base">{item.label}</h5>
                                        </div>
                                        <p className="text-slate-400 text-sm leading-relaxed font-light">{item.desc}</p>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Refined CTA */}
                            <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-10 bg-slate-900 border border-white/10 rounded-[40px] shadow-3xl">
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Activate {selectedFeature.title} Today</h3>
                                    <p className="text-slate-400 text-sm italic">Join 2,000+ companies using this infrastructure.</p>
                                </div>
                                <div className="flex gap-4">
                                    <Link
                                        href="/auth/signup"
                                        className="px-8 py-4 bg-white text-black font-black text-sm rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl"
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Footer />
        </main>
    )
}
