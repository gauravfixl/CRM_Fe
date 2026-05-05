"use client"

import Navbar from "@/components/landing/Navbar"
import TestimonialsSection from "@/components/landing/TestimonialsSection"
import PricingTeaser from "@/components/landing/PricingTeaser"
import Footer from "@/components/landing/Footer"
import { motion } from "framer-motion"
import { MessageSquare, Star, Heart, Users } from "lucide-react"

export default function TestimonialsPage() {
    return (
        <main className="relative font-outfit antialiased bg-white dark:bg-slate-950 transition-colors duration-500">
            <Navbar solid={true} />

            <div className="relative pt-16"> {/* Reduced base padding */}
                {/* Background Decorations */}
                <div className="absolute top-0 left-0 right-0 h-[600px] overflow-hidden pointer-events-none">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[100px]" />
                    <div className="absolute top-48 -right-24 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[100px]" />
                </div>

                {/* Hero / Page Header */}
                <section className="relative z-10 pt-12 pb-6 lg:pt-16 lg:pb-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 mb-6"
                        >
                            <Heart className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 fill-current" />
                            <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 tracking-[0.2em] uppercase">
                                Customer Stories
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-6"
                        >
                            Loved by teams<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400">
                                around the globe
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
                        >
                            Join 5,000+ businesses that scaled their operations using Cubicle CRM.
                            Real stories from real founders making a difference every day.
                        </motion.p>

                        {/* Social Proof Badges */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="mt-10 flex flex-wrap justify-center gap-6 lg:gap-12"
                        >
                            <div className="flex flex-col items-center">
                                <div className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white">4.9/5</div>
                                <div className="flex gap-0.5 mt-1">
                                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
                                </div>
                                <div className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-2 font-bold">G2 Rating</div>
                            </div>
                            <div className="w-px h-12 bg-slate-200 dark:bg-slate-800 hidden sm:block" />
                            <div className="flex flex-col items-center">
                                <div className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white">2k+</div>
                                <div className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-2 font-bold leading-none">Reviews</div>
                                <div className="flex -space-x-2 mt-2">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-950 bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                                            <Users className="w-3 h-3 text-slate-400" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="w-px h-12 bg-slate-200 dark:bg-slate-800 hidden sm:block" />
                            <div className="flex flex-col items-center">
                                <div className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white">99%</div>
                                <div className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-2 font-bold">Satisfaction</div>
                                <div className="mt-2 text-emerald-500 font-bold text-xs">+12% YoY</div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Main Content Sections - Reduced padding-top in TestimonialsSection logic by using a container here */}
                <div className="overflow-hidden">
                    <TestimonialsSection hideHeader={true} />
                </div>
            </div>
            <Footer />
        </main>
    )
}
