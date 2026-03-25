"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Building2, CheckCircle, Phone, Zap } from "lucide-react"

const highlights = [
    "No credit card required",
    "14-day free trial",
    "Full platform access",
    "Cancel anytime",
]

export default function PricingTeaser() {
    const ref = useRef<HTMLDivElement>(null)
    const inView = useInView(ref, { once: true, margin: "-80px" })

    return (
        <section id="pricing-cta" className="relative py-28 overflow-hidden" ref={ref}>
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-violet-800">
                {/* Animated blobs */}
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-400/30 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-400/30 rounded-full blur-[100px]"
                />
                {/* Grid */}
                <div
                    className="absolute inset-0 opacity-[0.06]"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                        backgroundSize: "50px 50px",
                    }}
                />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/30 backdrop-blur-sm mb-8"
                >
                    <Zap className="w-3.5 h-3.5 text-amber-300" />
                    <span className="text-xs font-bold text-white/80 tracking-widest uppercase">
                        Start For Free Today
                    </span>
                </motion.div>

                {/* Headline */}
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.15, duration: 0.6 }}
                    className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-none tracking-tight mb-6"
                >
                    Ready to transform{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-300">
                        how you work?
                    </span>
                </motion.h2>

                {/* Sub */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.25, duration: 0.5 }}
                    className="text-xl text-blue-100 max-w-2xl mx-auto mb-10 leading-relaxed"
                >
                    Start with a free 14-day trial. Get full access to every module —
                    CRM, HR, Finance, and Project Management — with zero setup fees.
                </motion.p>

                {/* Highlights */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.35, duration: 0.5 }}
                    className="flex flex-wrap justify-center gap-4 mb-12"
                >
                    {highlights.map((h) => (
                        <div key={h} className="flex items-center gap-2 text-blue-100 text-sm font-medium">
                            <CheckCircle className="w-4 h-4 text-emerald-300 flex-shrink-0" />
                            {h}
                        </div>
                    ))}
                </motion.div>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.45, duration: 0.5 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <Link
                        href="/auth/signup"
                        className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-bold text-blue-700 bg-white rounded-2xl shadow-2xl shadow-black/20 hover:shadow-black/30 hover:scale-105 transition-all duration-300 overflow-hidden"
                    >
                        <Zap className="w-5 h-5 text-blue-600 group-hover:text-amber-500 transition-colors" />
                        <span>Start Your Free Trial</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <a
                        href="mailto:sales@cubiclecrm.com"
                        className="inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-bold text-white border-2 border-white/40 hover:border-white/70 hover:bg-white/10 rounded-2xl transition-all duration-300"
                    >
                        <Phone className="w-4 h-4" />
                        Talk to Sales
                    </a>
                </motion.div>

                {/* Sign in link */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="mt-8 text-blue-200 text-sm"
                >
                    Already have an account?{" "}
                    <Link
                        href="/auth/signin"
                        className="text-white font-semibold hover:underline underline-offset-2"
                    >
                        Sign in here →
                    </Link>
                </motion.p>
            </div>
        </section>
    )
}
