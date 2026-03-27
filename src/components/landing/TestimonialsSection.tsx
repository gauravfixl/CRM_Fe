"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Star, Quote, MessageSquare } from "lucide-react"

const testimonials = [
    {
        name: "Sarah Mitchell",
        role: "CEO, Acme Corp",
        avatar: "SM",
        avatarBg: "from-blue-500 to-indigo-600",
        rating: 5,
        text: "Cubicle CRM transformed how we manage our sales pipeline. The lead tracking is phenomenal — we increased conversions by 40% in just two months.",
    },
    {
        name: "James Rodriguez",
        role: "Ops Director, TechStart Inc",
        avatar: "JR",
        avatarBg: "from-emerald-500 to-teal-600",
        rating: 5,
        text: "Having CRM, HR, and finance all in one platform is a game changer. We eliminated 4 separate tools and saved $2,000/month in subscriptions.",
    },
    {
        name: "Priya Sharma",
        role: "Founder, InnovateCo",
        avatar: "PS",
        avatarBg: "from-purple-500 to-violet-600",
        rating: 5,
        text: "The multi-org management feature is incredible. I oversee three companies from one dashboard. The security and audit logs give me full confidence.",
    },
    {
        name: "Michael Chen",
        role: "Sales Lead, GlobalTrade",
        avatar: "MC",
        avatarBg: "from-amber-500 to-orange-600",
        rating: 5,
        text: "The analytics dashboard is like having a business intelligence tool built-in. Real-time insights helped us identify our best lead sources instantly.",
    },
    {
        name: "Aisha Patel",
        role: "HR Manager, NexusFirm",
        avatar: "AP",
        avatarBg: "from-rose-500 to-pink-600",
        rating: 5,
        text: "Payroll processing used to take us 3 days. With Cubicle CRM's HR module, it's done in under 2 hours. The attendance tracking is also flawless.",
    },
    {
        name: "David Kim",
        role: "CTO, SpeedOps Ltd",
        avatar: "DK",
        avatarBg: "from-cyan-500 to-blue-600",
        rating: 5,
        text: "Enterprise-grade security with SOC2 compliance was non-negotiable for us. Cubicle CRM delivered on every requirement, and the team support is top-notch.",
    },
]

function TestimonialCard({ name, role, avatar, avatarBg, rating, text }: (typeof testimonials)[0]) {
    return (
        <div className="flex-shrink-0 w-80 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-sm hover:shadow-2xl dark:shadow-black/20 transition-all duration-300 group cursor-default hover:scale-[1.02] hover:-translate-y-1">
            {/* Quote icon */}
            <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-xl flex items-center justify-center mb-4">
                <Quote className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            </div>

            {/* Stars */}
            <div className="flex gap-0.5 mb-3">
                {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
            </div>

            {/* Text */}
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-5">&ldquo;{text}&rdquo;</p>

            {/* Author */}
            <div className="flex items-center gap-3">
                <div
                    className={`w-9 h-9 rounded-full bg-gradient-to-br ${avatarBg} flex items-center justify-center text-white text-xs font-bold shadow-md`}
                >
                    {avatar}
                </div>
                <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">{name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{role}</div>
                </div>
            </div>
        </div>
    )
}

export default function TestimonialsSection({ hideHeader = false }: { hideHeader?: boolean }) {
    const ref = useRef<HTMLDivElement>(null)
    const inView = useInView(ref, { once: true, margin: "-80px" })

    // Duplicate for infinite scroll
    const doubled = [...testimonials, ...testimonials]

    return (
        <section id="testimonials" className="py-20 bg-gradient-to-br from-slate-100 to-purple-50/40 dark:from-slate-900/60 dark:to-purple-950/20 overflow-hidden transition-colors duration-500 border-y border-slate-200 dark:border-white/5" ref={ref}>
            {!hideHeader && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/30 mb-6">
                            <MessageSquare className="w-3.5 h-3.5 text-amber-600 dark:text-amber-500" />
                            <span className="text-xs font-bold text-amber-600 dark:text-amber-500 tracking-widest uppercase">
                                Customer Stories
                            </span>
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-4">
                            Trusted by{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600 dark:from-amber-400 dark:to-orange-500">
                                growing businesses
                            </span>
                        </h2>
                        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
                            Don&apos;t just take our word for it. See what our customers say about their
                            experience with Cubicle CRM.
                        </p>
                    </motion.div>
                </div>
            )}

            {/* Marquee container */}
            <div className="relative">
                {/* Left fade */}
                <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white dark:from-slate-950 to-transparent z-10 pointer-events-none" />
                {/* Right fade */}
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white dark:from-slate-950 to-transparent z-10 pointer-events-none" />

                {/* Scrolling row 1 */}
                <div className="flex gap-5 overflow-hidden mb-5">
                    <motion.div
                        className="flex gap-5 flex-shrink-0"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    >
                        {doubled.map((t, i) => (
                            <TestimonialCard key={`row1-${i}`} {...t} />
                        ))}
                    </motion.div>
                </div>

                {/* Scrolling row 2 (reverse) */}
                <div className="flex gap-5 overflow-hidden">
                    <motion.div
                        className="flex gap-5 flex-shrink-0"
                        animate={{ x: ["-50%", "0%"] }}
                        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                    >
                        {doubled.reverse().map((t, i) => (
                            <TestimonialCard key={`row2-${i}`} {...t} />
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Bottom summary */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 text-center"
            >
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm">
                    <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                    </div>
                    <span className="text-slate-700 font-bold text-sm">4.9 / 5</span>
                    <span className="text-slate-400 text-sm">from 500+ verified reviews</span>
                </div>
            </motion.div>
        </section>
    )
}
