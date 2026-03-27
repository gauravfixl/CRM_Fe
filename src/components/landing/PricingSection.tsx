"use client"

import { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Check, Zap, Building2, Shield, ArrowRight, Star } from "lucide-react"
import Link from "next/link"

const plans = [
    {
        name: "Starter",
        desc: "Perfect for small teams and startups",
        price: "0",
        features: [
            "Up to 5 team members",
            "1 Organization / Workspace",
            "Lead & Client Management",
            "Basic CRM pipelines",
            "Standard Support",
            "2GB Cloud Storage"
        ],
        buttonText: "Start Free",
        buttonHref: "/auth/signup",
        popular: false,
        icon: Zap,
        color: "blue"
    },
    {
        name: "Business",
        desc: "Advanced tools for growing teams",
        price: "29",
        features: [
            "Up to 25 team members",
            "5 Organizations / Workspaces",
            "Full CRM + HR + Project Suite",
            "Workflow Automation",
            "Priority Email Support",
            "25GB Cloud Storage",
            "Advanced Analytics"
        ],
        buttonText: "Start 14-Day Trial",
        buttonHref: "/auth/signup",
        popular: true,
        icon: Star,
        color: "blue"
    },
    {
        name: "Enterprise",
        desc: "Custom solutions for large scale ops",
        price: "Custom",
        features: [
            "Unlimited team members",
            "Unlimited Organizations",
            "Full Platform Access",
            "AI-Powered Insights",
            "24/7 Dedicated Support",
            "Unlimited Storage",
            "API & Custom Webhooks",
            "White-label options"
        ],
        buttonText: "Contact Sales",
        buttonHref: "mailto:sales@cubiclecrm.com",
        popular: false,
        icon: Building2,
        color: "slate"
    }
]

export default function PricingSection({ hideHeader = false }: { hideHeader?: boolean }) {
    const [isYearly, setIsYearly] = useState(false)
    const ref = useRef<HTMLDivElement>(null)
    const inView = useInView(ref, { once: true, margin: "-80px" })

    return (
        <section id="pricing" className="py-16 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-white/5 transition-colors duration-500" ref={ref}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header - Conditionally hide or keep minimal if needed, keeping minimal for landing page usage */}
                {!hideHeader && (
                    <div className="text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 mb-6"
                        >
                            <Shield className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 tracking-widest uppercase">
                                Transparent Pricing
                            </span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-4"
                        >
                            Choose the plan that{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                                scales with you
                            </span>
                        </motion.h2 >
                        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10">
                            Simple, transparent pricing for teams of all sizes. No hidden fees, ever.
                        </p>
                    </div>
                )}

                {/* Billing Toggle (Moved out of header if header is hidden) */}
                {hideHeader && (
                    <div className="flex items-center justify-center gap-4 mb-12 -mt-4">
                        <span className={`text-sm font-semibold ${!isYearly ? "text-slate-900 dark:text-white" : "text-slate-500"}`}>Monthly</span>
                        <button
                            onClick={() => setIsYearly(!isYearly)}
                            className="relative w-14 h-7 bg-slate-200 dark:bg-slate-800 rounded-full p-1 transition-colors duration-300 focus:outline-none"
                        >
                            <motion.div
                                animate={{ x: isYearly ? 28 : 0 }}
                                className="w-5 h-5 bg-blue-600 rounded-full shadow-lg"
                            />
                        </button>
                        <span className={`text-sm font-semibold ${isYearly ? "text-slate-900 dark:text-white" : "text-slate-500"}`}>
                            Yearly <span className="text-xs text-blue-600 dark:text-blue-400 ml-1">(Save 20%)</span>
                        </span>
                    </div>
                )}

                {!hideHeader && (
                    /* Original Billing Toggle position for Landing Page */
                    <div className="flex items-center justify-center gap-4 mb-12">
                        <span className={`text-sm font-semibold ${!isYearly ? "text-slate-900 dark:text-white" : "text-slate-500"}`}>Monthly</span>
                        <button
                            onClick={() => setIsYearly(!isYearly)}
                            className="relative w-14 h-7 bg-slate-200 dark:bg-slate-800 rounded-full p-1 transition-colors duration-300 focus:outline-none"
                        >
                            <motion.div
                                animate={{ x: isYearly ? 28 : 0 }}
                                className="w-5 h-5 bg-blue-600 rounded-full shadow-lg"
                            />
                        </button>
                        <span className={`text-sm font-semibold ${isYearly ? "text-slate-900 dark:text-white" : "text-slate-500"}`}>
                            Yearly <span className="text-xs text-blue-600 dark:text-blue-400 ml-1">(Save 20%)</span>
                        </span>
                    </div>
                )}

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 40 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className={`relative group bg-white dark:bg-slate-900 border ${plan.popular ? "border-blue-500 ring-2 ring-blue-500/20" : "border-slate-200 dark:border-white/10"
                                } rounded-3xl p-8 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                                    Most Popular
                                </div>
                            )}

                            {/* Plan Header */}
                            <div className="mb-8">
                                <div className={`w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400`}>
                                    <plan.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{plan.name}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{plan.desc}</p>
                            </div>

                            {/* Pricing */}
                            <div className="mb-8">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black text-slate-900 dark:text-white">
                                        {plan.price !== "Custom" ? "$" : ""}{isYearly && plan.price !== "Custom" ? Math.floor(parseInt(plan.price) * 0.8) : plan.price}
                                    </span>
                                    {plan.price !== "Custom" && (
                                        <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">/per month</span>
                                    )}
                                </div>
                                {isYearly && plan.price !== "Custom" && (
                                    <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold mt-1 uppercase">Billed annually</p>
                                )}
                            </div>

                            {/* Features */}
                            <div className="flex-1 space-y-4 mb-10">
                                {plan.features.map((feature) => (
                                    <div key={feature} className="flex items-start gap-3">
                                        <div className="mt-1 w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                                            <Check className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <span className="text-sm text-slate-600 dark:text-slate-400">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Button */}
                            <Link
                                href={plan.buttonHref}
                                className={`w-full py-4 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${plan.popular
                                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30"
                                    : "bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10"
                                    }`}
                            >
                                {plan.buttonText}
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* FAQ / Add-ons Teaser */}
                <div className="mt-20 text-center p-10 rounded-[40px] bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Looking for something else?</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">We offer custom features, white-labeling, and priority migration for large teams.</p>
                    <Link href="mailto:hello@cubiclecrm.com" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                        Talk to our experts →
                    </Link>
                </div>
            </div>
        </section>
    )
}
