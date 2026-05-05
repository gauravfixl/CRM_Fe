"use client"

import LP2Navbar from "@/components/landingpage2/LP2Navbar"
import LP2CTA from "@/components/landingpage2/LP2CTA"
import LP2Footer from "@/components/landingpage2/LP2Footer"
import { motion } from "framer-motion"
import {
    Sparkles,
    CheckCircle2,
    ArrowRight,
    ArrowLeft,
    Zap,
    Shield,
    Users,
    HeadphonesIcon,
    BarChart3,
    Globe,
    Clock,
    Star,
    Building2,
    Rocket,
    Crown,
    HelpCircle,
    X,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const pricingPlans = [
    {
        name: "Starter",
        icon: Rocket,
        description: "Perfect for small teams and startups getting started with CRM",
        price: "$99",
        period: "/month",
        annualPrice: "$79",
        color: "#0078D4",
        lightBg: "bg-blue-50",
        borderColor: "border-blue-100",
        features: [
            "Up to 5 users",
            "Core CRM features",
            "Basic reporting & dashboards",
            "Email support (48hr response)",
            "1 GB storage per user",
            "Mobile app access",
            "Standard integrations",
            "Community forum access",
        ],
        notIncluded: [
            "Custom workflows",
            "API access",
            "Advanced analytics",
            "Dedicated account manager",
        ],
        cta: "Start Free Trial",
        highlighted: false,
    },
    {
        name: "Professional",
        icon: Crown,
        description: "For growing businesses that need advanced tools and automation",
        price: "$299",
        period: "/month",
        annualPrice: "$239",
        color: "#5C2D91",
        lightBg: "bg-purple-50",
        borderColor: "border-purple-100",
        features: [
            "Up to 25 users",
            "Advanced CRM + HRM features",
            "Custom workflow automation",
            "Advanced reporting & analytics",
            "Priority support (4hr response)",
            "50 GB storage per user",
            "Full API access",
            "Custom integrations",
            "Dedicated account manager",
            "Training & onboarding sessions",
        ],
        notIncluded: [
            "Unlimited users",
            "On-premise deployment",
            "Custom SLA",
        ],
        cta: "Start Free Trial",
        highlighted: true,
    },
    {
        name: "Enterprise",
        icon: Building2,
        description: "For large organizations requiring full customization and support",
        price: "Custom",
        period: "pricing",
        annualPrice: "Custom",
        color: "#107C10",
        lightBg: "bg-green-50",
        borderColor: "border-green-100",
        features: [
            "Unlimited users",
            "All modules included",
            "24/7 dedicated support (1hr SLA)",
            "Custom development & features",
            "Unlimited storage",
            "Advanced security & SSO",
            "SLA guarantee",
            "On-premise deployment option",
            "Quarterly business reviews",
            "Dedicated support engineer",
            "Custom training programs",
            "White-label options",
        ],
        notIncluded: [],
        cta: "Contact Sales",
        highlighted: false,
    },
]

const comparisonFeatures = [
    {
        category: "Core Features",
        icon: Zap,
        features: [
            { name: "Contact Management", starter: true, professional: true, enterprise: true },
            { name: "Lead Tracking", starter: true, professional: true, enterprise: true },
            { name: "Deal Pipeline", starter: true, professional: true, enterprise: true },
            { name: "Email Integration", starter: true, professional: true, enterprise: true },
            { name: "Custom Fields", starter: "5", professional: "Unlimited", enterprise: "Unlimited" },
            { name: "Workflow Automation", starter: false, professional: true, enterprise: true },
            { name: "Custom Modules", starter: false, professional: true, enterprise: true },
        ],
    },
    {
        category: "Reporting & Analytics",
        icon: BarChart3,
        features: [
            { name: "Basic Dashboards", starter: true, professional: true, enterprise: true },
            { name: "Custom Reports", starter: false, professional: true, enterprise: true },
            { name: "Advanced Analytics", starter: false, professional: true, enterprise: true },
            { name: "AI-Powered Insights", starter: false, professional: false, enterprise: true },
            { name: "Scheduled Reports", starter: false, professional: true, enterprise: true },
        ],
    },
    {
        category: "Security & Compliance",
        icon: Shield,
        features: [
            { name: "Data Encryption", starter: true, professional: true, enterprise: true },
            { name: "Two-Factor Auth", starter: true, professional: true, enterprise: true },
            { name: "Role-Based Access", starter: "Basic", professional: "Advanced", enterprise: "Custom" },
            { name: "SSO / SAML", starter: false, professional: false, enterprise: true },
            { name: "Audit Logs", starter: false, professional: true, enterprise: true },
            { name: "IP Whitelisting", starter: false, professional: false, enterprise: true },
        ],
    },
    {
        category: "Support & Services",
        icon: HeadphonesIcon,
        features: [
            { name: "Email Support", starter: true, professional: true, enterprise: true },
            { name: "Live Chat", starter: false, professional: true, enterprise: true },
            { name: "Phone Support", starter: false, professional: false, enterprise: true },
            { name: "Dedicated Manager", starter: false, professional: true, enterprise: true },
            { name: "Custom SLA", starter: false, professional: false, enterprise: true },
            { name: "On-site Support", starter: false, professional: false, enterprise: true },
        ],
    },
]

const testimonials = [
    {
        quote: "CubicleERP transformed how we manage our sales pipeline. The ROI was visible within the first month.",
        author: "Sarah Mitchell",
        role: "VP of Sales, TechVentures Inc.",
        plan: "Professional",
        rating: 5,
    },
    {
        quote: "The Enterprise plan gave us everything we needed to scale across 12 countries with full compliance.",
        author: "Rajesh Patel",
        role: "CTO, GlobalTrade Corp.",
        plan: "Enterprise",
        rating: 5,
    },
    {
        quote: "We started with Starter and upgraded within 3 months. The platform grows with you seamlessly.",
        author: "Emily Chen",
        role: "Founder, DesignFlow Agency",
        plan: "Starter",
        rating: 5,
    },
]

const faqs = [
    {
        q: "Can I change my plan anytime?",
        a: "Yes, you can upgrade or downgrade your plan at any time. When upgrading, you get immediate access to new features. When downgrading, changes take effect at the start of your next billing cycle.",
    },
    {
        q: "Is there a setup fee?",
        a: "No, there are no setup fees or hidden charges. You only pay for the plan you choose. Enterprise customers get complimentary onboarding and setup assistance.",
    },
    {
        q: "What payment methods do you accept?",
        a: "We accept all major credit cards (Visa, Mastercard, American Express), bank transfers, and wire transfers. Enterprise customers can also pay via invoice with NET-30 terms.",
    },
    {
        q: "Do you offer discounts for annual billing?",
        a: "Yes! Save 20% when you pay annually instead of monthly. All annual plans come with priority onboarding and a dedicated setup session.",
    },
    {
        q: "What happens when my free trial ends?",
        a: "Your 14-day trial gives you full access to all Professional features. When it ends, you can choose any plan to continue. Your data is safely preserved for 30 days if you need more time to decide.",
    },
    {
        q: "Can I add more users later?",
        a: "Absolutely. You can add users at any time. Additional users are billed pro-rata for the remainder of your billing cycle. Enterprise plans offer unlimited users.",
    },
    {
        q: "Is my data secure?",
        a: "Yes. All plans include AES-256 encryption, regular backups, and SOC 2 compliant infrastructure. Enterprise plans add SSO, IP whitelisting, and custom data residency options.",
    },
    {
        q: "Do you offer a money-back guarantee?",
        a: "Yes, we offer a 30-day money-back guarantee on all paid plans. If you're not satisfied, contact us for a full refund, no questions asked.",
    },
]

const addOns = [
    { icon: Users, name: "Extra Users Pack", description: "Add 10 additional users", price: "$49/mo", color: "#0078D4" },
    { icon: Globe, name: "Multi-Region Hosting", description: "Host data in your preferred region", price: "$99/mo", color: "#5C2D91" },
    { icon: Shield, name: "Advanced Security", description: "Enhanced security & compliance tools", price: "$79/mo", color: "#107C10" },
    { icon: HeadphonesIcon, name: "Premium Support", description: "24/7 phone + dedicated engineer", price: "$149/mo", color: "#D83B01" },
]

function CellValue({ value }: { value: boolean | string }) {
    if (typeof value === "string") return <span className="text-sm font-medium text-[#1A1A1A]">{value}</span>
    if (value) return <CheckCircle2 size={18} className="text-green-600 mx-auto" />
    return <X size={18} className="text-gray-300 mx-auto" />
}

export default function PricingOverviewPage() {
    const [billing, setBilling] = useState<"monthly" | "annual">("monthly")
    const [openFaq, setOpenFaq] = useState<number | null>(null)

    return (
        <main
            className="relative antialiased bg-white"
            style={{ fontFamily: "'Segoe UI', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
        >
            <LP2Navbar />

            <div className="relative pt-20 pb-16">
                {/* Background Decorations */}
                <div className="absolute top-0 left-0 right-0 h-[700px] overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
                    <div className="absolute top-[400px] left-0 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[120px] -translate-x-1/3" />
                    <div className="absolute top-[200px] right-1/3 w-[300px] h-[300px] bg-green-600/3 rounded-full blur-[100px]" />
                </div>

                {/* Back to Overview Button */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 mb-8">
                    <Link
                        href="/#overview"
                        className="inline-flex items-center gap-2 text-sm font-medium text-[#505050] hover:text-[#0067B8] transition-colors duration-300 group"
                    >
                        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                        Back to overview
                    </Link>
                </div>

                {/* Hero Section */}
                <section className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-6"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                        <span className="text-[10px] font-black text-blue-600 tracking-[0.2em] uppercase">
                            Pricing Overview
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl lg:text-5xl font-black text-[#1A1A1A] tracking-tight mb-6"
                    >
                        Compare plans and find{" "}
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">
                            your perfect fit
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg text-[#6B6B6B] max-w-2xl mx-auto mb-8"
                    >
                        Every plan includes a 14-day free trial with full access. No credit card required. Cancel anytime.
                    </motion.p>

                    {/* Billing Toggle */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="inline-flex items-center gap-3 bg-gray-100 rounded-full p-1"
                    >
                        <button
                            onClick={() => setBilling("monthly")}
                            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${billing === "monthly"
                                ? "bg-white text-[#1A1A1A] shadow-sm"
                                : "text-[#6B6B6B] hover:text-[#1A1A1A]"
                                }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBilling("annual")}
                            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${billing === "annual"
                                ? "bg-white text-[#1A1A1A] shadow-sm"
                                : "text-[#6B6B6B] hover:text-[#1A1A1A]"
                                }`}
                        >
                            Annual
                            <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                Save 20%
                            </span>
                        </button>
                    </motion.div>
                </section>

                {/* Pricing Cards */}
                <section className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 mb-20">
                    <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                        {pricingPlans.map((plan, index) => {
                            const PlanIcon = plan.icon
                            return (
                                <motion.div
                                    key={plan.name}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.15 + index * 0.12 }}
                                    className={`relative rounded-xl border-2 transition-all duration-300 flex flex-col ${plan.highlighted
                                        ? "border-[#5C2D91] shadow-2xl scale-[1.03] z-10"
                                        : `${plan.borderColor} hover:shadow-xl`
                                        } ${plan.lightBg}`}
                                >
                                    {plan.highlighted && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-1.5 rounded-full text-xs font-bold shadow-lg">
                                                Most Popular
                                            </span>
                                        </div>
                                    )}

                                    <div className="p-8 flex flex-col flex-1">
                                        {/* Plan Header */}
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${plan.color}15` }}>
                                                <PlanIcon size={22} style={{ color: plan.color }} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-[#1A1A1A]">{plan.name}</h3>
                                            </div>
                                        </div>

                                        <p className="text-sm text-[#6B6B6B] mb-6">{plan.description}</p>

                                        {/* Price */}
                                        <div className="mb-6 pb-6 border-b border-[#E5E5E5]">
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-4xl font-black text-[#1A1A1A]">
                                                    {billing === "annual" ? plan.annualPrice : plan.price}
                                                </span>
                                                <span className="text-[#6B6B6B] text-sm">{plan.period}</span>
                                            </div>
                                            {billing === "annual" && plan.price !== "Custom" && (
                                                <p className="text-xs text-green-600 font-medium mt-1">
                                                    Save {Math.round((1 - parseInt(plan.annualPrice.replace("$", "")) / parseInt(plan.price.replace("$", ""))) * 100)}% vs monthly
                                                </p>
                                            )}
                                        </div>

                                        {/* Included Features */}
                                        <p className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-3">What&apos;s included</p>
                                        <div className="space-y-3 flex-1">
                                            {plan.features.map((feature) => (
                                                <div key={feature} className="flex items-start gap-2.5">
                                                    <CheckCircle2 size={16} className="text-green-600 shrink-0 mt-0.5" />
                                                    <span className="text-sm text-[#1A1A1A]">{feature}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Not Included */}
                                        {plan.notIncluded.length > 0 && (
                                            <div className="mt-5 pt-5 border-t border-[#E5E5E5]">
                                                <p className="text-xs font-bold text-[#6B6B6B] uppercase tracking-wider mb-3">Not included</p>
                                                <div className="space-y-2">
                                                    {plan.notIncluded.map((feature) => (
                                                        <div key={feature} className="flex items-start gap-2.5">
                                                            <X size={14} className="text-gray-300 shrink-0 mt-0.5" />
                                                            <span className="text-sm text-[#6B6B6B]">{feature}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* CTA */}
                                        <button
                                            className={`w-full py-3.5 rounded-lg font-semibold mt-8 transition-all duration-300 flex items-center justify-center gap-2 ${plan.highlighted
                                                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg hover:-translate-y-0.5"
                                                : "border-2 hover:-translate-y-0.5"
                                                }`}
                                            style={!plan.highlighted ? { borderColor: plan.color, color: plan.color } : undefined}
                                        >
                                            {plan.cta}
                                            <ArrowRight size={16} />
                                        </button>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                </section>

                {/* Add-ons Section */}
                <section className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-10"
                    >
                        <h2 className="text-3xl font-black text-[#1A1A1A] mb-3">Powerful Add-ons</h2>
                        <p className="text-[#6B6B6B] max-w-lg mx-auto">Extend your plan with additional capabilities tailored to your needs.</p>
                    </motion.div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {addOns.map((addon, index) => (
                            <motion.div
                                key={addon.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.08 }}
                                className="border rounded-xl p-5 hover:shadow-lg transition-all duration-300 group cursor-pointer"
                                style={{ backgroundColor: `${addon.color}06`, borderColor: `${addon.color}20` }}
                            >
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: `${addon.color}12` }}>
                                    <addon.icon size={20} style={{ color: addon.color }} />
                                </div>
                                <h3 className="text-sm font-bold text-[#1A1A1A] mb-1">{addon.name}</h3>
                                <p className="text-xs text-[#6B6B6B] mb-3">{addon.description}</p>
                                <p className="text-sm font-bold" style={{ color: addon.color }}>{addon.price}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Feature Comparison Table */}
                <section className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-10"
                    >
                        <h2 className="text-3xl font-black text-[#1A1A1A] mb-3">Detailed Feature Comparison</h2>
                        <p className="text-[#6B6B6B] max-w-lg mx-auto">See exactly what you get with each plan, side by side.</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="border border-[#E5E5E5] rounded-xl overflow-hidden bg-white"
                    >
                        {/* Table Header */}
                        <div className="grid grid-cols-4 bg-gradient-to-r from-gray-50 to-blue-50/30 border-b border-[#E5E5E5]">
                            <div className="p-5 font-semibold text-[#1A1A1A] text-sm">Features</div>
                            <div className="p-5 text-center font-bold text-sm" style={{ color: "#0078D4" }}>Starter</div>
                            <div className="p-5 text-center font-bold text-sm" style={{ color: "#5C2D91" }}>Professional</div>
                            <div className="p-5 text-center font-bold text-sm" style={{ color: "#107C10" }}>Enterprise</div>
                        </div>

                        {comparisonFeatures.map((category) => {
                            const CatIcon = category.icon
                            return (
                                <div key={category.category}>
                                    {/* Category Header */}
                                    <div className="grid grid-cols-4 bg-gray-50/80 border-b border-[#E5E5E5]">
                                        <div className="p-4 col-span-4 flex items-center gap-2">
                                            <CatIcon size={16} className="text-[#0067B8]" />
                                            <span className="text-sm font-bold text-[#1A1A1A]">{category.category}</span>
                                        </div>
                                    </div>
                                    {/* Feature Rows */}
                                    {category.features.map((feature, fi) => (
                                        <div
                                            key={feature.name}
                                            className={`grid grid-cols-4 border-b border-[#F0F0F0] hover:bg-blue-50/30 transition-colors ${fi % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}
                                        >
                                            <div className="p-4 text-sm text-[#505050]">{feature.name}</div>
                                            <div className="p-4 text-center"><CellValue value={feature.starter} /></div>
                                            <div className="p-4 text-center"><CellValue value={feature.professional} /></div>
                                            <div className="p-4 text-center"><CellValue value={feature.enterprise} /></div>
                                        </div>
                                    ))}
                                </div>
                            )
                        })}
                    </motion.div>
                </section>

                {/* Testimonials */}
                <section className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-10"
                    >
                        <h2 className="text-3xl font-black text-[#1A1A1A] mb-3">Trusted by Growing Businesses</h2>
                        <p className="text-[#6B6B6B] max-w-lg mx-auto">See what our customers have to say about their experience.</p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {testimonials.map((t, index) => (
                            <motion.div
                                key={t.author}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="border border-indigo-100 rounded-xl p-6 bg-indigo-50/50 hover:shadow-lg transition-all duration-300"
                            >
                                {/* Stars */}
                                <div className="flex gap-1 mb-4">
                                    {Array.from({ length: t.rating }).map((_, i) => (
                                        <Star key={i} size={16} className="text-amber-400 fill-amber-400" />
                                    ))}
                                </div>
                                <p className="text-sm text-[#505050] leading-relaxed mb-5 italic">
                                    &ldquo;{t.quote}&rdquo;
                                </p>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold text-[#1A1A1A]">{t.author}</p>
                                        <p className="text-xs text-[#6B6B6B]">{t.role}</p>
                                    </div>
                                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
                                        {t.plan}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* FAQs */}
                <section className="relative z-10 max-w-3xl mx-auto px-4 lg:px-8 mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-10"
                    >
                        <HelpCircle className="w-8 h-8 text-[#0067B8] mx-auto mb-3" />
                        <h2 className="text-3xl font-black text-[#1A1A1A] mb-3">Frequently Asked Questions</h2>
                        <p className="text-[#6B6B6B]">Everything you need to know about our pricing and plans.</p>
                    </motion.div>

                    <div className="space-y-3">
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.04 }}
                                className="border border-blue-100 rounded-xl overflow-hidden bg-blue-50/40 hover:shadow-md transition-all duration-300"
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                    className="w-full flex items-center justify-between p-5 text-left"
                                >
                                    <span className="text-[15px] font-semibold text-[#1A1A1A] pr-4">{faq.q}</span>
                                    <motion.div
                                        animate={{ rotate: openFaq === index ? 45 : 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center bg-[#0067B8] text-white"
                                    >
                                        <span className="text-lg leading-none">+</span>
                                    </motion.div>
                                </button>
                                <motion.div
                                    initial={false}
                                    animate={{
                                        height: openFaq === index ? "auto" : 0,
                                        opacity: openFaq === index ? 1 : 0,
                                    }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="overflow-hidden"
                                >
                                    <p className="px-5 pb-5 text-sm text-[#505050] leading-relaxed">{faq.a}</p>
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Trust Badges */}
                <section className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 mb-20">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                        {[
                            { icon: Shield, label: "SOC 2 Compliant", sub: "Enterprise-grade security" },
                            { icon: Clock, label: "99.9% Uptime", sub: "Reliable infrastructure" },
                            { icon: Globe, label: "Global CDN", sub: "Fast worldwide access" },
                            { icon: Users, label: "10,000+ Teams", sub: "Trusted globally" },
                        ].map((badge, i) => (
                            <motion.div
                                key={badge.label}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.08 }}
                                className="text-center p-5 rounded-xl border border-green-100 bg-green-50/50"
                            >
                                <badge.icon size={24} className="text-[#0067B8] mx-auto mb-2" />
                                <p className="text-sm font-bold text-[#1A1A1A]">{badge.label}</p>
                                <p className="text-xs text-[#6B6B6B]">{badge.sub}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-xl p-10 text-white text-center"
                    >
                        <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                            Ready to get started?
                        </h3>
                        <p className="mb-8 text-blue-100 max-w-lg mx-auto">
                            Start your 14-day free trial today. No credit card required. Full access to all Professional features.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/auth/signup"
                                className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-8 py-3.5 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                            >
                                Start Free Trial
                                <ArrowRight size={16} />
                            </Link>
                            <Link
                                href="/support"
                                className="inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-white/10 transition-all duration-300 hover:-translate-y-0.5"
                            >
                                Talk to Sales
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
