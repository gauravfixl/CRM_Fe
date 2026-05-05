"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import LP2Navbar from "@/components/landingpage2/LP2Navbar"
import LP2Footer from "@/components/landingpage2/LP2Footer"
import LP2CTA from "@/components/landingpage2/LP2CTA"
import {
    Home,
    Building2,
    Users,
    FileText,
    DollarSign,
    Search,
    ClipboardCheck,
    TrendingUp,
    Handshake,
    Eye,
    FolderOpen,
    CheckCircle2,
    ArrowRight,
    ChevronDown,
    Check,
    X,
    Quote,
    BarChart3,
    Globe,
    Zap,
    Star,
    Layers,
    Key,
    TreePine,
    Warehouse,
    Palmtree,
} from "lucide-react"

const stats = [
    { value: "2,500+", label: "Properties managed on platform" },
    { value: "40%", label: "Faster deal closing time" },
    { value: "98%", label: "Rent collection rate" },
    { value: "60%", label: "Reduction in admin workload" },
]

const propertyTypes = [
    { label: "Residential", icon: Home },
    { label: "Commercial", icon: Building2 },
    { label: "Industrial", icon: Warehouse },
    { label: "Mixed-Use", icon: Layers },
    { label: "Vacation Rentals", icon: Palmtree },
    { label: "Land Development", icon: TreePine },
]

const features = [
    {
        icon: Building2,
        title: "Property Listings & Inventory",
        description:
            "Maintain a comprehensive, searchable inventory of every property in your portfolio with rich detail including photos, floor plans, amenities, and pricing history. Listings sync across your website, property portals, and social channels so prospects always see up-to-date availability.",
    },
    {
        icon: TrendingUp,
        title: "Deal Pipeline & Commission Tracking",
        description:
            "Visualize every transaction from initial inquiry through closing on a drag-and-drop pipeline board. Automated commission splits calculate agent payouts, brokerage fees, and referral bonuses the moment a deal is marked closed.",
    },
    {
        icon: Users,
        title: "Tenant & Lease Management",
        description:
            "Store complete tenant profiles including contact details, lease terms, payment history, maintenance requests, and communication logs in a single timeline view. Automated alerts notify your team before lease expirations.",
    },
    {
        icon: Search,
        title: "Intelligent Client Matching",
        description:
            "CubicleERP analyzes buyer and renter preferences \u2014 budget, location, size, amenities \u2014 and instantly surfaces matching properties. Smart scoring ranks each match so agents focus on the most promising showings.",
    },
    {
        icon: Eye,
        title: "Virtual Tours & Inspection Management",
        description:
            "Embed 360-degree virtual tour links, video walkthroughs, and interactive floor plans directly on each property record. Schedule and track inspections with checklists, photo uploads, and deficiency reports.",
    },
    {
        icon: FolderOpen,
        title: "Document Management & e-Signatures",
        description:
            "Centralize every document \u2014 lease agreements, disclosure forms, inspection reports, title deeds \u2014 in a secure, version-controlled repository. Built-in e-signature workflows let clients sign from any device.",
    },
]

const capabilities = [
    {
        title: "Market Intelligence & Valuation Analytics",
        description:
            "Make smarter investment and pricing decisions with integrated market data, comparable sales analysis, and automated property valuation models. Track neighborhood trends, rental yield benchmarks, and demand indicators so your team prices listings competitively.",
        keyPoints: [
            "Comparable sales analysis with automated property matching and adjustment factors",
            "Rental yield calculators with cap rate, gross yield, and cash-on-cash return modeling",
            "Neighborhood trend dashboards tracking price movements, days on market, and inventory levels",
            "Automated valuation reports for buyer presentations and internal investment committees",
        ],
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    },
    {
        title: "Maintenance & Vendor Operations",
        description:
            "Streamline property maintenance from tenant request through vendor dispatch, work completion, and cost tracking. Build a vetted vendor network, automate work order routing, and track maintenance spend per property.",
        keyPoints: [
            "Tenant-initiated maintenance requests with photo uploads and urgency classification",
            "Automated vendor dispatch based on trade type, location, and availability",
            "Work order lifecycle tracking with SLA monitoring and tenant satisfaction follow-up",
            "Maintenance cost analytics per property, unit type, and vendor for budget planning",
        ],
        image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80",
    },
    {
        title: "Investment Portfolio Analytics",
        description:
            "For real estate investors and fund managers, CubicleERP provides portfolio-level analytics that aggregate performance across residential, commercial, and mixed-use holdings. Model acquisition scenarios, track IRR, and report to investors.",
        keyPoints: [
            "Portfolio performance dashboards with NOI, cap rate, and occupancy trending",
            "Acquisition scenario modeling with financing structure and return projections",
            "Investor reporting with automated distribution calculations and K-1 preparation support",
            "Asset disposition analysis comparing hold vs. sell outcomes based on market conditions",
        ],
        image: "https://images.unsplash.com/photo-1460472178825-e5240623afd5?w=800&q=80",
    },
    {
        title: "Compliance & Regulatory Management",
        description:
            "Stay ahead of regulatory requirements across jurisdictions with automated compliance tracking for lease terms, safety inspections, fair housing regulations, and tax filings. Avoid costly penalties with proactive alerts.",
        keyPoints: [
            "Lease compliance monitoring with automatic alerts for term violations and expirations",
            "Safety inspection scheduling with automated reminders and certificate tracking",
            "Fair housing compliance tools with standardized application and screening processes",
            "Property tax tracking with assessment appeal deadline reminders and filing support",
        ],
        image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
    },
]

const benefits = [
    {
        title: "Close Deals Faster",
        description:
            "Automated client matching, instant property alerts, and digital signature workflows cut the average time from inquiry to signed contract.",
        icon: Zap,
    },
    {
        title: "Maximize Occupancy & Rental Income",
        description:
            "Proactive lease-expiration alerts, automated renewal reminders, and vacancy dashboards help you keep occupancy rates high.",
        icon: TrendingUp,
    },
    {
        title: "Eliminate Commission Errors",
        description:
            "Automatic commission calculations based on configurable split structures remove spreadsheet guesswork and payment disputes.",
        icon: DollarSign,
    },
    {
        title: "Deliver Outstanding Client Experiences",
        description:
            "Self-service portals for tenants and buyers, virtual tour integrations, and timely communication keep every stakeholder informed.",
        icon: Star,
    },
    {
        title: "Gain Portfolio-Wide Visibility",
        description:
            "Real-time dashboards consolidate occupancy rates, revenue per property, maintenance spend, and pipeline value into a single view.",
        icon: BarChart3,
    },
    {
        title: "Scale Without Adding Headcount",
        description:
            "Automation across listings, lease management, inspections, and accounting means your team handles a growing portfolio effortlessly.",
        icon: Globe,
    },
]

const pipelineStages = [
    { label: "Lead", icon: Users, desc: "Capture buyer/renter inquiry" },
    { label: "Showing", icon: Eye, desc: "Schedule property viewings" },
    { label: "Offer", icon: FileText, desc: "Submit & negotiate offer" },
    { label: "Negotiation", icon: Handshake, desc: "Terms & counteroffers" },
    { label: "Closing", icon: ClipboardCheck, desc: "Sign contracts & pay" },
    { label: "Handover", icon: Key, desc: "Keys & documentation" },
]

const integrations = [
    { name: "Zillow", category: "Property Listings" },
    { name: "Realtor.com", category: "Property Listings" },
    { name: "DocuSign", category: "e-Signatures" },
    { name: "Stripe", category: "Payments" },
    { name: "QuickBooks", category: "Accounting" },
    { name: "Google Maps", category: "Mapping" },
    { name: "Matterport", category: "Virtual Tours" },
    { name: "Zapier", category: "Automation" },
    { name: "Mailchimp", category: "Email Marketing" },
    { name: "Plaid", category: "Financial Verification" },
    { name: "Twilio", category: "Communications" },
    { name: "Xero", category: "Accounting" },
]

const steps = [
    {
        step: "1",
        title: "Portfolio & Workflow Discovery",
        description:
            "Our real estate specialists map your property portfolio, transaction workflows, commission structures, and integration needs. We design a tailored configuration plan that mirrors how your brokerage or property management company actually operates.",
    },
    {
        step: "2",
        title: "Data Migration & System Setup",
        description:
            "We import your existing property listings, tenant records, lease agreements, and financial history into CubicleERP with full data validation. Your team receives role-specific training across all modules.",
    },
    {
        step: "3",
        title: "Launch & Continuous Optimization",
        description:
            "A phased go-live ensures zero disruption to active deals and tenant operations. Post-launch, our team monitors adoption metrics, fine-tunes automation rules, and delivers quarterly reviews.",
    },
]

const useCases = [
    {
        title: "Residential Brokerages",
        description:
            "Fast-moving residential brokerages use CubicleERP to manage hundreds of active listings, match buyers instantly, and close transactions with digital contracts \u2014 all while keeping commission accounting error-free.",
        highlights: [
            "Automated buyer-property matching with smart scoring",
            "Digital contract signing that cuts closing time by days",
            "Real-time commission dashboards for agents and brokers",
        ],
    },
    {
        title: "Commercial Property Managers",
        description:
            "Commercial property managers rely on CubicleERP to handle complex multi-tenant leases, schedule inspections across large portfolios, and maintain full financial visibility.",
        highlights: [
            "Multi-tenant lease tracking with CAM and escalation clauses",
            "Inspection scheduling with automated deficiency workflows",
            "Portfolio-wide occupancy and revenue analytics",
        ],
    },
    {
        title: "Real Estate Developers",
        description:
            "Developers use CubicleERP to market new projects, track buyer interest from launch events through unit selection and final sale, and manage post-handover warranty obligations.",
        highlights: [
            "Project inventory management with unit-level status tracking",
            "Buyer journey pipeline from expression of interest to handover",
            "Post-sale warranty and snagging management",
        ],
    },
]

const comparisons = [
    { feature: "Sales + leasing in one system", traditional: "Separate platforms", cubicleErp: "Unified workflows" },
    { feature: "Commission tracking", traditional: "Manual spreadsheets", cubicleErp: "Auto-calculated splits" },
    { feature: "Client-property matching", traditional: "Agent memory", cubicleErp: "AI-powered scoring" },
    { feature: "Tenant portal", traditional: "Phone and email only", cubicleErp: "24/7 self-service" },
    { feature: "Document management", traditional: "Filing cabinets/email", cubicleErp: "Digital with e-sign" },
    { feature: "Portfolio analytics", traditional: "Quarterly manual reports", cubicleErp: "Real-time dashboards" },
]

const testimonials = [
    {
        quote:
            "We manage 450 rental units across three cities. Before CubicleERP, lease renewals would slip through the cracks and we lost tenants we should have retained. Now automated alerts trigger renewal conversations 90 days out, and our retention rate is up 22%.",
        author: "James Whitfield",
        role: "Director of Property Management",
        company: "Atlas Realty Group",
        metric: "22% improvement in tenant retention",
    },
    {
        quote:
            "The commission calculation engine eliminated monthly disputes between our agents. Every split is transparent, every referral bonus is tracked, and payouts that used to take three days of spreadsheet work now happen with a single click.",
        author: "Monica Reyes",
        role: "Brokerage Operations Manager",
        company: "Crestline Properties",
        metric: "Commission processing from 3 days to 1 click",
    },
    {
        quote:
            "Our developers use CubicleERP to track buyer interest from pre-launch events through unit selection and final handover. We sold out our last 200-unit project 40% faster because the intelligent matching surfaced qualified buyers the moment units were released.",
        author: "Arjun Kapoor",
        role: "VP of Sales",
        company: "Skymark Developments",
        metric: "40% faster project sellout",
    },
]

const faqs = [
    {
        question: "Can CubicleERP handle both sales and rental workflows in one system?",
        answer: "Absolutely. CubicleERP provides separate but interconnected pipelines for sales transactions and rental/lease management. Agents can track a property sale from listing to closing on one board while property managers handle tenant onboarding, rent collection, and lease renewals on another \u2014 all sharing the same property and contact database so nothing is duplicated.",
    },
    {
        question: "How does the commission calculation work for complex split structures?",
        answer: "You define commission rules at the brokerage, team, or individual agent level \u2014 including percentage splits, flat fees, tiered structures, and referral bonuses. When a deal closes, CubicleERP automatically calculates each party\u2019s share, generates payout summaries, and feeds the amounts into your accounting module.",
    },
    {
        question: "Does CubicleERP integrate with property listing portals and MLS systems?",
        answer: "Yes. CubicleERP supports integrations with major property portals and MLS feeds so your listings publish automatically and inquiries flow back into your pipeline without manual data entry. We also offer an open API for custom integrations with regional or niche listing platforms.",
    },
    {
        question: "How does the tenant self-service portal work?",
        answer: "Tenants receive secure login credentials to a branded portal where they can view lease details, submit and track maintenance requests, make rent payments online, and download statements. Maintenance requests are automatically routed to the assigned property manager and can trigger vendor work orders.",
    },
    {
        question: "Can we manage property inspections and attach reports to listings?",
        answer: "Yes. You can schedule inspections directly from any property record, assign inspectors, and use customizable checklists with photo and note fields. Completed inspection reports are stored in the property\u2019s document repository and can be shared with prospective buyers or flagged for maintenance follow-up.",
    },
]

const dashboardListings = [
    { address: "1420 Oak Avenue, Apt 3B", status: "Occupied", rent: "$2,150/mo", color: "bg-emerald-400" },
    { address: "88 Commerce Blvd, Suite 200", status: "Vacant", rent: "$4,800/mo", color: "bg-red-400" },
    { address: "305 Maple Street", status: "Occupied", rent: "$1,750/mo", color: "bg-emerald-400" },
    { address: "12 Harbor View Dr, Unit 7", status: "Lease Ending", rent: "$3,200/mo", color: "bg-amber-400" },
]

const maintenanceTickets = [
    { unit: "Apt 3B", issue: "HVAC not cooling", priority: "High", age: "2h ago" },
    { unit: "Suite 200", issue: "Parking lot light out", priority: "Low", age: "1d ago" },
    { unit: "Unit 7", issue: "Leaking faucet", priority: "Medium", age: "5h ago" },
]

export default function RealEstatePage() {
    const [openFaq, setOpenFaq] = useState<number | null>(null)

    return (
        <main className="min-h-screen bg-white">
            <LP2Navbar />

            {/* ============ SECTION 1: HERO ============ */}
            <section className="relative pt-16 pb-10 overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80"
                        alt="Real estate hero"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gray-900/80" />
                </div>
                <div className="relative max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-600/20 border border-amber-500/30 text-amber-300 text-sm font-medium mb-6">
                            <Home className="w-4 h-4" />
                            Property Management Platform
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-5">
                            Manage every property, deal, and tenant from{" "}
                            <span className="text-amber-400">one platform</span>
                        </h1>
                        <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                            CubicleERP Real Estate is an all-in-one platform built for brokerages, property managers, and
                            developers. From capturing leads and matching buyers to managing tenants and tracking leases,
                            every workflow lives in one place.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                href="/get-started"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors"
                            >
                                Start Free Trial
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 px-6 py-3 border border-gray-400 text-gray-200 hover:bg-white/10 font-semibold rounded-lg transition-colors"
                            >
                                Book a Demo
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="grid grid-cols-2 gap-4"
                    >
                        {stats.map((stat, i) => (
                            <div
                                key={i}
                                className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-5 text-center"
                            >
                                <div className="text-3xl font-bold text-amber-400 mb-1">{stat.value}</div>
                                <div className="text-sm text-gray-300">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ============ SECTION 2: PROPERTY TYPES STRIP ============ */}
            <section className="bg-amber-50 py-8 border-b border-amber-100">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="text-center text-sm font-semibold text-amber-800 uppercase tracking-wider mb-5">
                        Built for every property type
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        {propertyTypes.map((pt, i) => {
                            const Icon = pt.icon
                            return (
                                <motion.span
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.06 }}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-amber-200 rounded-full text-sm font-medium text-gray-800 shadow-sm"
                                >
                                    <Icon className="w-4 h-4 text-amber-600" />
                                    {pt.label}
                                </motion.span>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* ============ SECTION 3: FEATURES - PROPERTY CARDS ============ */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-14"
                    >
                        <span className="text-amber-600 font-semibold text-sm uppercase tracking-wider">Core Features</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">
                            Everything you need to manage real estate
                        </h2>
                        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                            From listings to leases, inspections to investor reporting \u2014 every tool purpose-built for real estate professionals.
                        </p>
                    </motion.div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feat, i) => {
                            const Icon = feat.icon
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.08 }}
                                    className="bg-amber-50 border border-amber-100 rounded-2xl p-6 hover:shadow-lg transition-shadow"
                                >
                                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                                        <Icon className="w-6 h-6 text-amber-600" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{feat.title}</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">{feat.description}</p>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* ============ SECTION 4: PROPERTY DASHBOARD PREVIEW ============ */}
            <section className="py-20 bg-gray-900">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <span className="text-amber-400 font-semibold text-sm uppercase tracking-wider">Dashboard Preview</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mt-3">
                            Your portfolio at a glance
                        </h2>
                        <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
                            A unified command center for properties, tenants, maintenance, and financials.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-2xl"
                    >
                        <div className="flex">
                            {/* Sidebar */}
                            <div className="hidden md:flex flex-col w-56 bg-gray-850 border-r border-gray-700 p-4 gap-1 bg-gray-800/50">
                                {["Listings", "Tenants", "Maintenance", "Financials"].map((item, i) => (
                                    <div
                                        key={i}
                                        className={`px-4 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                                            i === 0
                                                ? "bg-amber-600/20 text-amber-400 border border-amber-500/20"
                                                : "text-gray-400 hover:text-gray-200 hover:bg-gray-700/50"
                                        }`}
                                    >
                                        {item}
                                    </div>
                                ))}
                            </div>

                            {/* Main Area */}
                            <div className="flex-1 p-6">
                                <div className="grid lg:grid-cols-3 gap-6">
                                    {/* Property Cards Column */}
                                    <div className="lg:col-span-2 space-y-3">
                                        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">Active Listings</h3>
                                        {dashboardListings.map((listing, i) => (
                                            <div key={i} className="flex items-center justify-between bg-gray-700/50 rounded-lg px-4 py-3 border border-gray-600/50">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-2.5 h-2.5 rounded-full ${listing.color}`} />
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-200">{listing.address}</div>
                                                        <div className="text-xs text-gray-500">{listing.status}</div>
                                                    </div>
                                                </div>
                                                <span className="text-sm font-semibold text-amber-400">{listing.rent}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Right Metrics */}
                                    <div className="space-y-5">
                                        {/* Occupancy Rate Donut */}
                                        <div className="bg-gray-700/50 rounded-xl p-5 border border-gray-600/50">
                                            <h4 className="text-sm font-semibold text-gray-300 mb-4">Occupancy Rate</h4>
                                            <div className="flex items-center justify-center">
                                                <div className="relative w-28 h-28">
                                                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                                        <circle cx="50" cy="50" r="40" fill="none" stroke="#374151" strokeWidth="10" />
                                                        <circle
                                                            cx="50"
                                                            cy="50"
                                                            r="40"
                                                            fill="none"
                                                            stroke="#D97706"
                                                            strokeWidth="10"
                                                            strokeDasharray={`${87 * 2.51} ${100 * 2.51}`}
                                                            strokeLinecap="round"
                                                        />
                                                    </svg>
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <span className="text-2xl font-bold text-white">87%</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-center text-xs text-gray-500 mt-2">Across 2,500+ units</p>
                                        </div>

                                        {/* Maintenance Tickets */}
                                        <div className="bg-gray-700/50 rounded-xl p-5 border border-gray-600/50">
                                            <h4 className="text-sm font-semibold text-gray-300 mb-3">Open Tickets</h4>
                                            <div className="space-y-2">
                                                {maintenanceTickets.map((t, i) => (
                                                    <div key={i} className="flex items-center justify-between text-xs">
                                                        <div>
                                                            <span className="text-gray-300 font-medium">{t.unit}</span>
                                                            <span className="text-gray-500 ml-2">{t.issue}</span>
                                                        </div>
                                                        <span
                                                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                                                t.priority === "High"
                                                                    ? "bg-red-500/20 text-red-400"
                                                                    : t.priority === "Medium"
                                                                    ? "bg-amber-500/20 text-amber-400"
                                                                    : "bg-gray-600 text-gray-400"
                                                            }`}
                                                        >
                                                            {t.priority}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Rent Collection Bar */}
                                        <div className="bg-gray-700/50 rounded-xl p-5 border border-gray-600/50">
                                            <h4 className="text-sm font-semibold text-gray-300 mb-2">Rent Collection</h4>
                                            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                                                <span>Collected</span>
                                                <span className="text-amber-400 font-semibold">98%</span>
                                            </div>
                                            <div className="w-full bg-gray-600 rounded-full h-2.5">
                                                <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: "98%" }} />
                                            </div>
                                            <p className="text-xs text-gray-500 mt-2">$1.2M of $1.22M this month</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ============ SECTION 5: CAPABILITIES WITH IMAGES ============ */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="text-amber-600 font-semibold text-sm uppercase tracking-wider">Advanced Capabilities</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">
                            Deep tools for serious operators
                        </h2>
                    </motion.div>

                    <div className="space-y-20">
                        {capabilities.map((cap, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className={`grid lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
                            >
                                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{cap.title}</h3>
                                    <p className="text-gray-600 leading-relaxed mb-6">{cap.description}</p>
                                    <ul className="space-y-3">
                                        {cap.keyPoints.map((point, j) => (
                                            <li key={j} className="flex items-start gap-3">
                                                <CheckCircle2 className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                                                <span className="text-sm text-gray-700">{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className={`relative rounded-2xl overflow-hidden h-72 lg:h-80 ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                                    <Image
                                        src={cap.image}
                                        alt={cap.title}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-amber-900/30 to-transparent" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ SECTION 6: BENEFITS SECTION ============ */}
            <section className="py-20 bg-orange-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-14 items-start">
                        {/* Left - Full Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="text-amber-600 font-semibold text-sm uppercase tracking-wider">Why CubicleERP</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-4">
                                Benefits that impact your bottom line
                            </h2>
                            <p className="text-gray-600 leading-relaxed mb-8">
                                Whether you manage ten units or ten thousand, CubicleERP replaces fragmented spreadsheets, siloed
                                tools, and manual processes with one streamlined platform purpose-built for real estate.
                            </p>

                            {/* 4 mini stats */}
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                {[
                                    { val: "3x", label: "Faster lease processing" },
                                    { val: "50%", label: "Less paperwork" },
                                    { val: "99.9%", label: "Platform uptime" },
                                    { val: "4.8/5", label: "Customer satisfaction" },
                                ].map((s, i) => (
                                    <div key={i} className="bg-white border border-amber-200 rounded-xl p-4">
                                        <div className="text-2xl font-bold text-amber-600">{s.val}</div>
                                        <div className="text-xs text-gray-600 mt-1">{s.label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Testimonial snippet */}
                            <div className="bg-white border border-amber-200 rounded-xl p-5 mb-6">
                                <Quote className="w-5 h-5 text-amber-400 mb-2" />
                                <p className="text-sm text-gray-700 italic leading-relaxed">
                                    &ldquo;Lease renewals would slip through the cracks. Now automated alerts trigger renewal conversations 90 days out and our retention rate is up 22%.&rdquo;
                                </p>
                                <p className="text-xs text-gray-500 mt-2 font-medium">&mdash; James Whitfield, Atlas Realty Group</p>
                            </div>

                            {/* Badges */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                {["MLS Integration", "Zillow Sync", "DocuSign Ready", "Multi-Property", "Tenant Portal"].map((b, i) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1.5 bg-amber-100 text-amber-800 text-xs font-medium rounded-full border border-amber-200"
                                    >
                                        {b}
                                    </span>
                                ))}
                            </div>

                            <Link
                                href="/get-started"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors"
                            >
                                Explore All Features
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </motion.div>

                        {/* Right - 6 benefit cards */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="grid sm:grid-cols-2 gap-4"
                        >
                            {benefits.map((ben, i) => {
                                const Icon = ben.icon
                                return (
                                    <div
                                        key={i}
                                        className="bg-white border border-amber-100 rounded-xl p-5 hover:shadow-md transition-shadow"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center mb-3">
                                            <Icon className="w-5 h-5 text-amber-600" />
                                        </div>
                                        <h3 className="text-sm font-bold text-gray-900 mb-1.5">{ben.title}</h3>
                                        <p className="text-xs text-gray-600 leading-relaxed">{ben.description}</p>
                                    </div>
                                )
                            })}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ============ SECTION 7: DEAL PIPELINE FLOW ============ */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-14"
                    >
                        <span className="text-amber-600 font-semibold text-sm uppercase tracking-wider">Deal Pipeline</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">
                            From lead to handover, fully tracked
                        </h2>
                        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                            A visual pipeline that mirrors your real estate transaction workflow from first contact to keys in hand.
                        </p>
                    </motion.div>

                    <div className="flex flex-wrap justify-center gap-4 lg:gap-0">
                        {pipelineStages.map((stage, i) => {
                            const Icon = stage.icon
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-center"
                                >
                                    <div className="flex flex-col items-center text-center w-36">
                                        <div className="w-14 h-14 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center mb-3">
                                            <Icon className="w-6 h-6 text-amber-700" />
                                        </div>
                                        <h4 className="text-sm font-bold text-gray-900">{stage.label}</h4>
                                        <p className="text-xs text-gray-500 mt-1">{stage.desc}</p>
                                    </div>
                                    {i < pipelineStages.length - 1 && (
                                        <ArrowRight className="w-5 h-5 text-amber-400 mx-2 hidden lg:block shrink-0" />
                                    )}
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* ============ SECTION 8: INTEGRATIONS ============ */}
            <section className="py-20 bg-amber-50">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-14"
                    >
                        <span className="text-amber-600 font-semibold text-sm uppercase tracking-wider">Integrations</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">
                            Connects with your existing stack
                        </h2>
                        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                            Seamless integrations with property portals, payment processors, accounting tools, and more.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {integrations.map((intg, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.04 }}
                                className="bg-white border border-amber-200 rounded-xl p-5 text-center hover:shadow-md transition-shadow"
                            >
                                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center mx-auto mb-3">
                                    <Globe className="w-5 h-5 text-amber-600" />
                                </div>
                                <h4 className="text-sm font-bold text-gray-900">{intg.name}</h4>
                                <p className="text-xs text-gray-500 mt-1">{intg.category}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ SECTION 9: HOW IT WORKS ============ */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-14"
                    >
                        <span className="text-amber-600 font-semibold text-sm uppercase tracking-wider">Getting Started</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">
                            Three steps to transform your operations
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {steps.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.12 }}
                                className="relative"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
                                        {step.step}
                                    </div>
                                    {i < steps.length - 1 && (
                                        <div className="hidden md:block flex-1 h-0.5 bg-amber-200" />
                                    )}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ SECTION 10: USE CASES ============ */}
            <section className="py-20 bg-orange-50">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-14"
                    >
                        <span className="text-amber-600 font-semibold text-sm uppercase tracking-wider">Use Cases</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">
                            Purpose-built for real estate professionals
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {useCases.map((uc, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-amber-50 border border-amber-200 rounded-2xl p-6"
                            >
                                <h3 className="text-lg font-bold text-gray-900 mb-3">{uc.title}</h3>
                                <p className="text-sm text-gray-600 leading-relaxed mb-4">{uc.description}</p>
                                <ul className="space-y-2">
                                    {uc.highlights.map((h, j) => (
                                        <li key={j} className="flex items-start gap-2 text-sm">
                                            <CheckCircle2 className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                                            <span className="text-gray-700">{h}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ SECTION 11: COMPARISON TABLE ============ */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-14"
                    >
                        <span className="text-amber-600 font-semibold text-sm uppercase tracking-wider">Comparison</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">
                            Traditional tools vs CubicleERP
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="overflow-x-auto"
                    >
                        <table className="w-full border-collapse">
                            <thead>
                                <tr>
                                    <th className="text-left py-4 px-6 bg-amber-50 rounded-tl-xl text-sm font-bold text-gray-900">Feature</th>
                                    <th className="text-left py-4 px-6 bg-amber-50 text-sm font-bold text-gray-500">Traditional Tools</th>
                                    <th className="text-left py-4 px-6 bg-amber-100 rounded-tr-xl text-sm font-bold text-amber-800">CubicleERP</th>
                                </tr>
                            </thead>
                            <tbody>
                                {comparisons.map((row, i) => (
                                    <tr key={i} className="border-t border-gray-100">
                                        <td className="py-4 px-6 text-sm font-medium text-gray-900">{row.feature}</td>
                                        <td className="py-4 px-6 text-sm text-gray-500">
                                            <span className="inline-flex items-center gap-2">
                                                <X className="w-4 h-4 text-red-400" />
                                                {row.traditional}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-amber-800 bg-amber-50/50">
                                            <span className="inline-flex items-center gap-2">
                                                <Check className="w-4 h-4 text-amber-600" />
                                                {row.cubicleErp}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </motion.div>
                </div>
            </section>

            {/* ============ SECTION 12: TESTIMONIALS ============ */}
            <section className="py-20 bg-amber-50">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-14"
                    >
                        <span className="text-amber-600 font-semibold text-sm uppercase tracking-wider">Testimonials</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">
                            Trusted by real estate teams everywhere
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {testimonials.map((t, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white border border-amber-200 rounded-2xl p-6 flex flex-col"
                            >
                                <Quote className="w-6 h-6 text-amber-300 mb-4" />
                                <p className="text-sm text-gray-700 italic leading-relaxed flex-1">
                                    &ldquo;{t.quote}&rdquo;
                                </p>
                                <div className="mt-5 pt-4 border-t border-amber-100">
                                    <p className="text-sm font-bold text-gray-900">{t.author}</p>
                                    <p className="text-xs text-gray-500">{t.role}, {t.company}</p>
                                    <span className="inline-block mt-2 px-3 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full">
                                        {t.metric}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ SECTION 13: FAQ ============ */}
            <section className="py-20 bg-white">
                <div className="max-w-3xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-14"
                    >
                        <span className="text-amber-600 font-semibold text-sm uppercase tracking-wider">FAQ</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">
                            Frequently asked questions
                        </h2>
                    </motion.div>

                    <div className="space-y-3">
                        {faqs.map((faq, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                                className="border border-amber-200 rounded-xl overflow-hidden"
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full flex items-center justify-between px-6 py-4 text-left bg-amber-50 hover:bg-amber-100/80 transition-colors"
                                >
                                    <span className="text-sm font-semibold text-gray-900 pr-4">{faq.question}</span>
                                    <ChevronDown
                                        className={`w-5 h-5 text-amber-600 shrink-0 transition-transform ${
                                            openFaq === i ? "rotate-180" : ""
                                        }`}
                                    />
                                </button>
                                <AnimatePresence>
                                    {openFaq === i && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <div className="px-6 py-4 text-sm text-gray-600 leading-relaxed bg-white">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ SECTION 14: CTA - AMBER GRADIENT ============ */}
            <section className="py-20 bg-gradient-to-br from-amber-600 via-amber-500 to-orange-500">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-5">
                            Ready to modernize your real estate operations?
                        </h2>
                        <p className="text-amber-100 text-lg mb-8 max-w-2xl mx-auto">
                            Join thousands of property professionals who manage listings, close deals, and delight tenants with CubicleERP.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link
                                href="/get-started"
                                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-amber-700 font-bold rounded-lg hover:bg-amber-50 transition-colors shadow-lg"
                            >
                                Start Free Trial
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors"
                            >
                                Talk to Sales
                            </Link>
                        </div>
                        <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-amber-100">
                            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> No credit card required</span>
                            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> 14-day free trial</span>
                            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Cancel anytime</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ============ SECTION 15: LP2CTA + LP2FOOTER ============ */}
            <LP2CTA />
            <LP2Footer />
        </main>
    )
}
