"use client"

import LP2Navbar from "@/components/landingpage2/LP2Navbar"
import LP2CTA from "@/components/landingpage2/LP2CTA"
import LP2Footer from "@/components/landingpage2/LP2Footer"
import { motion } from "framer-motion"
import { Sparkles, CheckCircle2, ArrowRight } from "lucide-react"
import Link from "next/link"

const pricingPlans = [
    {
        name: "Starter",
        description: "Perfect for small teams and startups",
        price: "$99",
        period: "/month",
        features: [
            "Up to 5 users",
            "Core CRM features",
            "Basic reporting",
            "Email support",
            "1 GB storage",
            "Mobile app access",
        ],
        cta: "Start Free Trial",
        highlighted: false,
    },
    {
        name: "Professional",
        description: "For growing businesses",
        price: "$299",
        period: "/month",
        features: [
            "Up to 25 users",
            "Advanced CRM features",
            "Custom workflows",
            "Advanced reporting",
            "Priority support",
            "50 GB storage",
            "API access",
            "Custom integrations",
        ],
        cta: "Start Free Trial",
        highlighted: true,
    },
    {
        name: "Enterprise",
        description: "For large organizations",
        price: "Custom",
        period: "pricing",
        features: [
            "Unlimited users",
            "All features included",
            "Dedicated support",
            "Custom development",
            "Unlimited storage",
            "Advanced security",
            "SLA guarantee",
            "On-premise option",
        ],
        cta: "Contact Sales",
        highlighted: false,
    },
]

export default function LP2PricingPage() {
    return (
        <main className="relative antialiased bg-white" style={{ fontFamily: "'Segoe UI', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
            <LP2Navbar />

            <div className="relative pt-20 pb-16">
                {/* Background Decorations */}
                <div className="absolute top-0 left-0 right-0 h-[600px] overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute top-96 left-0 w-80 h-80 bg-indigo-600/5 rounded-full blur-[100px] -translate-x-1/2" />
                </div>

                {/* Hero Section */}
                <section className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-6"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                        <span className="text-[10px] font-black text-blue-600 tracking-[0.2em] uppercase">
                            Simple & Transparent
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl lg:text-5xl font-black text-[#1A1A1A] tracking-tight mb-6"
                    >
                        Pricing that grows<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">
                            with your business
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg text-[#6B6B6B] max-w-2xl mx-auto mb-8"
                    >
                        Choose the perfect plan for your organization. All plans include a 14-day free trial with full access to all features.
                    </motion.p>
                </section>

                {/* Pricing Cards */}
                <section className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8 mb-16">
                        {pricingPlans.map((plan, index) => (
                            <motion.div
                                key={plan.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                                className={`relative rounded-lg border transition-all duration-300 flex flex-col ${plan.highlighted
                                    ? "border-blue-600 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-xl scale-105"
                                    : "border-[#E5E5E5] bg-white hover:shadow-lg"
                                    }`}
                            >
                                {plan.highlighted && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 rounded-full text-xs font-bold">
                                            Most Popular
                                        </span>
                                    </div>
                                )}

                                <div className="p-8 flex flex-col flex-1">
                                    <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">
                                        {plan.name}
                                    </h3>
                                    <p className="text-sm text-[#6B6B6B] mb-6">
                                        {plan.description}
                                    </p>

                                    <div className="mb-6">
                                        <span className="text-4xl font-black text-[#1A1A1A]">
                                            {plan.price}
                                        </span>
                                        <span className="text-[#6B6B6B] ml-2">
                                            {plan.period}
                                        </span>
                                    </div>

                                    <div className="space-y-4 flex-1">
                                        {plan.features.map((feature) => (
                                            <div key={feature} className="flex items-start gap-3">
                                                <CheckCircle2 size={18} className="text-green-600 shrink-0 mt-0.5" />
                                                <span className="text-sm text-[#1A1A1A]">
                                                    {feature}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        className={`w-full py-3 rounded-lg font-semibold mt-8 transition-all duration-300 flex items-center justify-center gap-2 ${plan.highlighted
                                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg"
                                            : "border border-[#0067B8] text-[#0067B8] hover:bg-[#0067B8] hover:text-white"
                                            }`}
                                    >
                                        {plan.cta}
                                        <ArrowRight size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* FAQ Section */}
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-black text-[#1A1A1A] text-center mb-12">
                            Frequently Asked Questions
                        </h2>

                        <div className="space-y-4">
                            {[
                                {
                                    q: "Can I change my plan anytime?",
                                    a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.",
                                },
                                {
                                    q: "Is there a setup fee?",
                                    a: "No, there are no setup fees or hidden charges. You only pay for the plan you choose.",
                                },
                                {
                                    q: "What payment methods do you accept?",
                                    a: "We accept all major credit cards, bank transfers, and wire transfers for enterprise customers.",
                                },
                                {
                                    q: "Do you offer discounts for annual billing?",
                                    a: "Yes, we offer 20% discount when you pay annually instead of monthly.",
                                },
                            ].map((faq, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.3 + index * 0.05 }}
                                    className="border border-[#E5E5E5] rounded-lg p-6 hover:shadow-md transition-shadow duration-300"
                                >
                                    <h3 className="font-semibold text-[#1A1A1A] mb-2">
                                        {faq.q}
                                    </h3>
                                    <p className="text-[#6B6B6B] text-sm">
                                        {faq.a}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="mt-16 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-8 text-white"
                        >
                            <h3 className="text-2xl font-bold mb-4">
                                Ready to get started?
                            </h3>
                            <p className="mb-6 text-blue-100">
                                Start your 14-day free trial today. No credit card required.
                            </p>
                            <Link
                                href="/auth/signup"
                                className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-300"
                            >
                                Start Free Trial
                            </Link>
                        </motion.div>
                    </div>
                </section>
            </div>

            <LP2CTA />
            <LP2Footer />
        </main>
    )
}
