"use client"

import LP2Navbar from "@/components/landingpage2/LP2Navbar"
import LP2CTA from "@/components/landingpage2/LP2CTA"
import LP2Footer from "@/components/landingpage2/LP2Footer"
import { motion } from "framer-motion"
import {
    HeadphonesIcon,
    MessageSquare,
    Mail,
    Phone,
    Clock,
    BookOpen,
    ArrowRight,
    CheckCircle2,
    Users,
    Zap,
    Shield,
    Globe,
    HelpCircle,
    FileText,
    Video,
    Search,
} from "lucide-react"
import Link from "next/link"

const supportChannels = [
    {
        icon: MessageSquare,
        title: "Live Chat",
        description: "Chat with our support team in real-time for quick answers and guidance.",
        availability: "Available 24/7",
        action: "Start Chat",
        color: "#0078D4",
        bgColor: "bg-blue-50",
    },
    {
        icon: Mail,
        title: "Email Support",
        description: "Send us a detailed message and we'll get back to you within 24 hours.",
        availability: "Response within 24 hours",
        action: "Send Email",
        color: "#5C2D91",
        bgColor: "bg-purple-50",
    },
    {
        icon: Phone,
        title: "Phone Support",
        description: "Speak directly with a support specialist for urgent issues.",
        availability: "Mon-Fri, 9AM-6PM IST",
        action: "Call Us",
        color: "#107C10",
        bgColor: "bg-green-50",
    },
]

const supportPlans = [
    {
        name: "Standard Support",
        description: "Included with all plans",
        features: [
            "Email support",
            "Knowledge base access",
            "Community forum access",
            "48-hour response time",
            "Business hours support",
        ],
        highlighted: false,
    },
    {
        name: "Priority Support",
        description: "For Professional plan users",
        features: [
            "Everything in Standard",
            "Live chat support",
            "Priority email queue",
            "4-hour response time",
            "Extended hours support",
            "Dedicated account manager",
        ],
        highlighted: true,
    },
    {
        name: "Enterprise Support",
        description: "For Enterprise plan users",
        features: [
            "Everything in Priority",
            "24/7 phone support",
            "1-hour response time",
            "Dedicated support engineer",
            "Custom SLA agreements",
            "On-site support available",
            "Quarterly business reviews",
        ],
        highlighted: false,
    },
]

const selfServiceResources = [
    {
        icon: BookOpen,
        title: "Knowledge Base",
        description: "Browse 500+ articles covering every feature and workflow.",
        link: "/resources",
    },
    {
        icon: Video,
        title: "Video Tutorials",
        description: "Watch step-by-step tutorials for getting started and advanced features.",
        link: "/resources",
    },
    {
        icon: Users,
        title: "Community Forum",
        description: "Ask questions, share tips, and learn from other CubicleERP users.",
        link: "/resources",
    },
    {
        icon: FileText,
        title: "API Documentation",
        description: "Technical docs and references for developers building integrations.",
        link: "/resources",
    },
]

const faqs = [
    {
        q: "How do I reset my password?",
        a: "Go to the sign-in page and click 'Forgot Password'. Enter your email address and we'll send you a reset link within minutes.",
    },
    {
        q: "How do I add new users to my account?",
        a: "Navigate to Settings > Users & Permissions > Invite Users. Enter the email addresses and assign roles for each new user.",
    },
    {
        q: "Can I export my data?",
        a: "Yes, you can export data from any module in CSV, Excel, or PDF format. Go to the module, click the export icon, and choose your preferred format.",
    },
    {
        q: "How do I set up integrations?",
        a: "Visit Settings > Integrations to browse available integrations. Click on any integration to follow the step-by-step setup wizard.",
    },
    {
        q: "What browsers are supported?",
        a: "CubicleERP supports the latest versions of Chrome, Firefox, Safari, and Edge. We recommend keeping your browser up to date for the best experience.",
    },
    {
        q: "How do I contact billing support?",
        a: "For billing inquiries, email billing@cubiclerp.com or use the live chat with 'Billing' as the topic. Our billing team is available during business hours.",
    },
]

export default function SupportPage() {
    return (
        <main
            className="relative antialiased bg-white"
            style={{ fontFamily: "'Segoe UI', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
        >
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
                        <HeadphonesIcon className="w-3.5 h-3.5 text-blue-600" />
                        <span className="text-[10px] font-black text-blue-600 tracking-[0.2em] uppercase">
                            Help & Support
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl lg:text-5xl font-black text-[#1A1A1A] tracking-tight mb-6"
                    >
                        We&apos;re here to{" "}
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">
                            help you succeed
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg text-[#6B6B6B] max-w-2xl mx-auto mb-8"
                    >
                        Get the help you need, when you need it. Our dedicated support team and self-service resources are always available.
                    </motion.p>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="max-w-xl mx-auto"
                    >
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B6B6B]" />
                            <input
                                type="text"
                                placeholder="Search for help articles, guides, and FAQs..."
                                className="w-full pl-12 pr-4 py-3.5 rounded-lg border border-[#E5E5E5] text-sm text-[#1A1A1A] placeholder:text-[#6B6B6B] focus:outline-none focus:border-[#0067B8] focus:ring-1 focus:ring-[#0067B8] transition-all"
                            />
                        </div>
                    </motion.div>
                </section>

                {/* Support Channels */}
                <section className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="text-3xl font-black text-[#1A1A1A] text-center mb-12"
                    >
                        Get in Touch
                    </motion.h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        {supportChannels.map((channel, index) => (
                            <motion.div
                                key={channel.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                                className={`border rounded-lg p-6 hover:shadow-lg transition-all duration-300 text-center group cursor-pointer ${channel.bgColor}`}
                                style={{ borderColor: `${channel.color}25` }}
                            >
                                <div
                                    className={`w-14 h-14 rounded-lg ${channel.bgColor} flex items-center justify-center mx-auto mb-4`}
                                >
                                    <channel.icon size={28} style={{ color: channel.color }} />
                                </div>
                                <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">{channel.title}</h3>
                                <p className="text-sm text-[#6B6B6B] mb-3">{channel.description}</p>
                                <div className="flex items-center justify-center gap-1.5 text-xs text-[#505050] mb-4">
                                    <Clock size={12} />
                                    {channel.availability}
                                </div>
                                <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#0067B8] text-[#0067B8] text-sm font-semibold hover:bg-[#0067B8] hover:text-white transition-all duration-300">
                                    {channel.action}
                                    <ArrowRight size={14} />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Self-Service Resources */}
                <section className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="text-3xl font-black text-[#1A1A1A] text-center mb-4"
                    >
                        Self-Service Resources
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.35 }}
                        className="text-[#6B6B6B] text-center mb-12 max-w-xl mx-auto"
                    >
                        Find answers on your own with our comprehensive self-service resources.
                    </motion.p>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {selfServiceResources.map((resource, index) => (
                            <motion.div
                                key={resource.title}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 + index * 0.08 }}
                            >
                                <Link
                                    href={resource.link}
                                    className="block border border-blue-100 rounded-lg p-5 bg-blue-50 hover:border-[#0067B8] hover:shadow-md transition-all duration-300 group h-full"
                                >
                                    <resource.icon size={24} className="text-[#0067B8] mb-3" />
                                    <h3 className="text-sm font-bold text-[#1A1A1A] mb-1.5 group-hover:text-[#0067B8] transition-colors">
                                        {resource.title}
                                    </h3>
                                    <p className="text-xs text-[#6B6B6B]">{resource.description}</p>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Support Plans */}
                <section className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="text-3xl font-black text-[#1A1A1A] text-center mb-4"
                    >
                        Support Plans
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.35 }}
                        className="text-[#6B6B6B] text-center mb-12 max-w-xl mx-auto"
                    >
                        Every plan includes support. Upgrade for faster response times and dedicated assistance.
                    </motion.p>

                    <div className="grid md:grid-cols-3 gap-8">
                        {supportPlans.map((plan, index) => (
                            <motion.div
                                key={plan.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                                className={`relative rounded-lg border transition-all duration-300 flex flex-col ${plan.highlighted
                                    ? "border-blue-600 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-xl scale-105"
                                    : "border-blue-100 bg-blue-50 hover:shadow-lg"
                                    }`}
                            >
                                {plan.highlighted && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 rounded-full text-xs font-bold">
                                            Recommended
                                        </span>
                                    </div>
                                )}

                                <div className="p-8 flex flex-col flex-1">
                                    <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">{plan.name}</h3>
                                    <p className="text-sm text-[#6B6B6B] mb-6">{plan.description}</p>

                                    <div className="space-y-4 flex-1">
                                        {plan.features.map((feature) => (
                                            <div key={feature} className="flex items-start gap-3">
                                                <CheckCircle2 size={18} className="text-green-600 shrink-0 mt-0.5" />
                                                <span className="text-sm text-[#1A1A1A]">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <Link
                                        href="/landingpage2/pricing"
                                        className={`w-full py-3 rounded-lg font-semibold mt-8 transition-all duration-300 flex items-center justify-center gap-2 ${plan.highlighted
                                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg"
                                            : "border border-[#0067B8] text-[#0067B8] hover:bg-[#0067B8] hover:text-white"
                                            }`}
                                    >
                                        View Pricing
                                        <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* FAQs */}
                <section className="relative z-10 max-w-3xl mx-auto px-4 lg:px-8 mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="text-3xl font-black text-[#1A1A1A] text-center mb-12"
                    >
                        Frequently Asked Questions
                    </motion.h2>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 + index * 0.05 }}
                                className="border border-indigo-100 rounded-lg p-6 bg-indigo-50/70 hover:shadow-md transition-shadow duration-300"
                            >
                                <h3 className="font-semibold text-[#1A1A1A] mb-2">{faq.q}</h3>
                                <p className="text-[#6B6B6B] text-sm">{faq.a}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-8 text-white text-center"
                    >
                        <h3 className="text-2xl font-bold mb-4">Still need help?</h3>
                        <p className="mb-6 text-blue-100 max-w-lg mx-auto">
                            Our support team is ready to assist you. Reach out and we&apos;ll get you the help you need.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-300">
                                <MessageSquare size={18} />
                                Start Live Chat
                            </button>
                            <Link
                                href="/resources"
                                className="inline-flex items-center justify-center gap-2 border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors duration-300"
                            >
                                <BookOpen size={18} />
                                Browse Resources
                            </Link>
                        </div>
                    </motion.div>
                </section>
            </div>

            <LP2CTA />
            <LP2Footer />
        </main>
    )
}
