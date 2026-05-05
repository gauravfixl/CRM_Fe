"use client"

import Navbar from "@/components/landing/Navbar"
import PricingSection from "@/components/landing/PricingSection"
import Footer from "@/components/landing/Footer"
import { motion } from "framer-motion"
import { Shield, Sparkles, Zap, CheckCircle2 } from "lucide-react"

export default function PricingPage() {
    return (
        <main className="relative font-outfit antialiased bg-white dark:bg-slate-950 transition-colors duration-500">
            <Navbar solid={true} />

            <div className="relative pt-16">
                {/* Background Decorations */}
                <div className="absolute top-0 left-0 right-0 h-[600px] overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute top-96 left-0 w-80 h-80 bg-indigo-600/5 dark:bg-indigo-600/10 rounded-full blur-[100px] -translate-x-1/2" />
                </div>

                {/* Hero Header Section */}
                <section className="relative z-10 pt-12 pb-2 lg:pt-16 lg:pb-4">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 mb-6"
                        >
                            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                            <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 tracking-[0.2em] uppercase">
                                Simple & Transparent
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-6"
                        >
                            Pricing that grows<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400">
                                with your business
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
                        >
                            No hidden fees, no complicated tiers. Start free and upgrade as you scale.
                            Every plan includes our core enterprise security and 24/7 support.
                        </motion.p>

                        {/* Quick Trust Badges */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="mt-10 flex flex-wrap justify-center gap-8 text-slate-400 dark:text-slate-500"
                        >
                            <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-emerald-500" />
                                <span className="text-xs font-semibold uppercase tracking-wider">Enterprise Security</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Zap className="w-4 h-4 text-amber-500" />
                                <span className="text-xs font-semibold uppercase tracking-wider">Instant Setup</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-blue-500" />
                                <span className="text-xs font-semibold uppercase tracking-wider">Cancel Anytime</span>
                            </div>
                        </motion.div>
                    </div>
                </section>

                <PricingSection hideHeader={true} />
            </div>
            <Footer />
        </main>
    )
}
