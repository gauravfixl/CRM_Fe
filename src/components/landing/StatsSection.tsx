"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { TrendingUp, Users, Zap, Star } from "lucide-react"

const stats = [
    {
        value: "500+",
        label: "Organisations Onboarded",
        icon: Users,
        gradient: "from-blue-500 to-indigo-600",
        glow: "shadow-blue-500/30",
    },
    {
        value: "50K+",
        label: "Active Users",
        icon: TrendingUp,
        gradient: "from-emerald-500 to-teal-600",
        glow: "shadow-emerald-500/30",
    },
    {
        value: "99.9%",
        label: "Platform Uptime",
        icon: Zap,
        gradient: "from-amber-500 to-orange-600",
        glow: "shadow-amber-500/30",
    },
    {
        value: "4.9★",
        label: "Average Rating",
        icon: Star,
        gradient: "from-rose-500 to-pink-600",
        glow: "shadow-rose-500/30",
    },
]

export default function StatsSection() {
    const ref = useRef<HTMLDivElement>(null)
    const inView = useInView(ref, { once: true, margin: "-60px" })

    return (
        <section className="py-20 bg-slate-50 dark:bg-slate-900/40 relative overflow-hidden border-y border-slate-200/60 dark:border-white/5" ref={ref}>
            {/* Background effects */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px]" />
                <div
                    className="absolute inset-0 opacity-[0.03] dark:opacity-[0.03]"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(15, 23, 42, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 23, 42, 0.3) 1px, transparent 1px)",
                        backgroundSize: "50px 50px",
                    }}
                />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-14"
                >
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-widest mb-2">
                        Trusted by businesses worldwide
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                        Numbers that speak for{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                            themselves
                        </span>
                    </h2>
                </motion.div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.85, y: 20 }}
                            animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
                            transition={{ delay: i * 0.12, duration: 0.5, type: "spring", stiffness: 80 }}
                            whileHover={{
                                y: -8,
                                scale: 1.03,
                                transition: { duration: 0.3 }
                            }}
                            className="relative group cursor-default"
                        >
                            {/* Card with light gradient backgrounds */}
                            <div className={`h-full backdrop-blur-xl border-2 rounded-xl p-4 text-center shadow-lg transition-all duration-300 relative overflow-hidden
                                ${i === 0 ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:border-blue-300 hover:shadow-blue-200/50 dark:from-blue-950/30 dark:to-indigo-950/30 dark:border-blue-800' : ''}
                                ${i === 1 ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 hover:border-emerald-300 hover:shadow-emerald-200/50 dark:from-emerald-950/30 dark:to-teal-950/30 dark:border-emerald-800' : ''}
                                ${i === 2 ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 hover:border-amber-300 hover:shadow-amber-200/50 dark:from-amber-950/30 dark:to-orange-950/30 dark:border-amber-800' : ''}
                                ${i === 3 ? 'bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200 hover:border-rose-300 hover:shadow-rose-200/50 dark:from-rose-950/30 dark:to-pink-950/30 dark:border-rose-800' : ''}
                            `}>
                                {/* Animated shine effect on hover */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                                    initial={{ x: '-100%' }}
                                    whileHover={{ x: '100%' }}
                                    transition={{ duration: 0.6 }}
                                />

                                {/* Pulse ring animation */}
                                <motion.div
                                    className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300
                                        ${i === 0 ? 'bg-blue-400/10' : ''}
                                        ${i === 1 ? 'bg-emerald-400/10' : ''}
                                        ${i === 2 ? 'bg-amber-400/10' : ''}
                                        ${i === 3 ? 'bg-rose-400/10' : ''}
                                    `}
                                    animate={{
                                        scale: [1, 1.05, 1],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />

                                {/* Icon Container with rotation on hover */}
                                <motion.div
                                    whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                                    transition={{ duration: 0.5 }}
                                    className={`w-9 h-9 mx-auto mb-2 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-md relative overflow-hidden z-10`}
                                >
                                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <stat.icon className="w-4 h-4 text-white relative z-10" />
                                </motion.div>

                                {/* Value with counter animation effect */}
                                <motion.div
                                    className={`text-xl lg:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r ${stat.gradient} mb-0.5 tracking-tight relative z-10`}
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {stat.value}
                                </motion.div>

                                {/* Label */}
                                <div className={`text-[9px] font-bold uppercase tracking-[0.1em] leading-tight relative z-10
                                    ${i === 0 ? 'text-blue-600 dark:text-blue-400' : ''}
                                    ${i === 1 ? 'text-emerald-600 dark:text-emerald-400' : ''}
                                    ${i === 2 ? 'text-amber-600 dark:text-amber-400' : ''}
                                    ${i === 3 ? 'text-rose-600 dark:text-rose-400' : ''}
                                `}>{stat.label}</div>

                                {/* Bottom accent line that grows on hover */}
                                <motion.div
                                    className={`absolute bottom-0 left-0 h-0.5 rounded-full
                                        ${i === 0 ? 'bg-gradient-to-r from-blue-400 to-indigo-500' : ''}
                                        ${i === 1 ? 'bg-gradient-to-r from-emerald-400 to-teal-500' : ''}
                                        ${i === 2 ? 'bg-gradient-to-r from-amber-400 to-orange-500' : ''}
                                        ${i === 3 ? 'bg-gradient-to-r from-rose-400 to-pink-500' : ''}
                                    `}
                                    initial={{ width: '0%' }}
                                    whileHover={{ width: '100%' }}
                                    transition={{ duration: 0.3 }}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Trust logos */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    className="mt-14 text-center"
                >
                    <p className="text-slate-600 text-xs font-medium uppercase tracking-wider mb-6">
                        Powering teams at
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-8">
                        {["Acme Corp", "TechStart", "GlobalTrade", "InnovateCo", "NexusFirm"].map((name) => (
                            <div
                                key={name}
                                className="text-slate-700 font-bold text-lg tracking-tight opacity-40 hover:opacity-70 transition-opacity cursor-default"
                            >
                                {name}
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
