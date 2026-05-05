"use client"

import LP2Navbar from "@/components/landingpage2/LP2Navbar"
import LP2Footer from "@/components/landingpage2/LP2Footer"
import LP2CTA from "@/components/landingpage2/LP2CTA"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import {
    CheckCircle2,
    ArrowRight,
    ChevronDown,
    Check,
    X,
    Quote,
    ShoppingCart,
    Barcode,
    Users,
    TrendingUp,
    Package,
    Store,
    LayoutGrid,
    CreditCard,
    Truck,
    Heart,
    Zap,
    Globe,
    Star,
    MapPin,
    Eye,
    ShoppingBag,
    Receipt,
    Box,
    Wifi,
} from "lucide-react"
import { useState } from "react"

const features = [
    {
        icon: CreditCard,
        title: "Integrated POS System",
        description:
            "Process transactions seamlessly with a fully integrated point-of-sale system that supports credit cards, digital wallets, UPI, and buy-now-pay-later options. Every sale automatically updates inventory counts, triggers accounting entries, and feeds into your analytics dashboards in real time.",
    },
    {
        icon: Package,
        title: "Real-Time Inventory Management",
        description:
            "Maintain complete visibility of stock levels across every store, warehouse, and fulfillment center with live inventory tracking down to the SKU level. Automated reorder points and demand-driven replenishment ensure you never face unexpected stockouts.",
    },
    {
        icon: LayoutGrid,
        title: "Omnichannel Sales Management",
        description:
            "Unify your in-store, e-commerce, mobile app, and marketplace sales channels into a single order management hub. Enable buy-online-pick-up-in-store, ship-from-store, and endless aisle capabilities.",
    },
    {
        icon: Heart,
        title: "Customer Loyalty & Engagement",
        description:
            "Build rich customer profiles capturing purchase history, preferences, and engagement across every touchpoint. Design tiered loyalty programs with points, rewards, exclusive offers, and birthday perks that drive repeat visits.",
    },
    {
        icon: Barcode,
        title: "Barcode & Label Management",
        description:
            "Generate, print, and scan barcodes and QR codes for rapid product identification, stock receiving, cycle counts, and checkout processing. Support all major barcode formats including UPC, EAN, Code 128, and custom internal SKU schemes.",
    },
    {
        icon: Truck,
        title: "Supplier & Procurement Management",
        description:
            "Manage your entire supplier network with vendor scorecards, lead time tracking, and automated purchase order generation based on real-time inventory needs. Compare supplier pricing and track delivery performance.",
    },
]

const benefits = [
    { title: "Cut Inventory Carrying Costs by 30%", description: "Demand forecasting and intelligent reorder algorithms keep stock levels optimized, reducing excess inventory, minimizing storage costs, and freeing up working capital for growth." },
    { title: "Boost Customer Retention & Lifetime Value", description: "Personalized loyalty programs, targeted promotions, and unified customer profiles across all channels drive repeat purchases and increase average order value by up to 25%." },
    { title: "Eliminate Manual Errors & Shrinkage", description: "Automated stock reconciliation, barcode-verified receiving, and real-time audit trails reduce inventory discrepancies and shrinkage, protecting your margins at every step." },
    { title: "Accelerate Checkout & Reduce Wait Times", description: "Fast POS processing with integrated payment methods, quick barcode scanning, and pre-configured discount rules let cashiers handle more customers with fewer errors during peak hours." },
    { title: "Make Data-Driven Merchandising Decisions", description: "Real-time sales analytics, product performance dashboards, and margin analysis empower store managers to optimize product placement, pricing strategies, and promotional calendars." },
    { title: "Scale Seamlessly Across Locations & Channels", description: "Add new stores, launch e-commerce channels, or expand to marketplaces without system constraints. CubicleERP grows with your business while keeping operations centralized." },
]

const capabilities = [
    {
        title: "Demand Forecasting & Replenishment Intelligence",
        description: "Go beyond simple reorder points with machine-learning-driven demand forecasting that analyzes sales velocity, seasonal trends, promotional calendars, and external market signals.",
        keyPoints: [
            "Seasonal and trend-based demand modeling with automatic adjustments for holidays and events",
            "Store-level forecasting that accounts for local demographics and buying patterns",
            "Promotion-aware replenishment that pre-positions stock before campaign launches",
            "Automated purchase order generation with supplier lead-time optimization",
        ],
        image: "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800&q=80",
    },
    {
        title: "Unified Customer Data Platform",
        description: "Aggregate customer interactions from every channel -- POS, e-commerce, mobile app, social media -- into a single 360-degree profile that powers hyper-personalized experiences.",
        keyPoints: [
            "Cross-channel identity resolution that merges anonymous and known customer records",
            "Real-time behavioral segmentation based on browse, cart, and purchase activity",
            "Predictive lifetime value scoring to prioritize high-potential customers",
            "Privacy-compliant data handling with consent management and GDPR support",
        ],
        image: "https://images.unsplash.com/photo-1553729459-uj4b3fcf6d2?w=800&q=80",
    },
    {
        title: "Store Operations & Workforce Optimization",
        description: "Streamline day-to-day store operations with intelligent workforce scheduling, task management, and performance tracking that ensures every store runs at peak efficiency.",
        keyPoints: [
            "AI-assisted shift scheduling based on foot traffic forecasts and labor budgets",
            "Mobile task management with photo verification for planogram compliance",
            "Real-time store performance dashboards accessible from any device",
            "Employee productivity metrics tied to sales conversion and customer satisfaction",
        ],
        image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80",
    },
    {
        title: "Loss Prevention & Shrinkage Analytics",
        description: "Detect and prevent inventory shrinkage with advanced analytics that identify suspicious patterns across POS transactions, stock movements, and employee activity before losses accumulate.",
        keyPoints: [
            "Exception-based reporting that flags anomalous refunds, voids, and discounts",
            "Inventory variance analysis with automated root-cause identification",
            "Integration with CCTV and EAS systems for correlated incident investigation",
        ],
        image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80",
    },
]

const integrations = [
    { name: "Shopify", category: "E-Commerce" },
    { name: "WooCommerce", category: "E-Commerce" },
    { name: "Square POS", category: "Point of Sale" },
    { name: "Stripe", category: "Payments" },
    { name: "QuickBooks", category: "Accounting" },
    { name: "Xero", category: "Accounting" },
    { name: "Mailchimp", category: "Marketing" },
    { name: "ShipStation", category: "Shipping" },
    { name: "Amazon Marketplace", category: "Marketplace" },
    { name: "Google Analytics", category: "Analytics" },
    { name: "Lightspeed POS", category: "Point of Sale" },
    { name: "Klaviyo", category: "Marketing Automation" },
]

const testimonials = [
    {
        quote: "CubicleERP transformed our inventory management overnight. We went from weekly stockouts to having the right product on every shelf at every store. Our markdown losses dropped dramatically within three months.",
        author: "Sarah Mitchell",
        role: "VP of Retail Operations",
        company: "UrbanTrend Fashion",
        metric: "42% reduction in stockouts",
    },
    {
        quote: "Managing 18 stores and an online shop used to require three different systems and constant reconciliation. Now everything flows through CubicleERP and our team finally has a single source of truth for inventory, customers, and sales.",
        author: "David Chen",
        role: "Chief Operating Officer",
        company: "Pacific Home & Living",
        metric: "60% less time on inventory reconciliation",
    },
    {
        quote: "The loyalty program tools alone paid for the platform in the first quarter. We can now segment our customers and send targeted offers that actually convert, instead of blasting the same promotion to everyone.",
        author: "Priya Sharma",
        role: "Director of Marketing",
        company: "FreshMart Groceries",
        metric: "25% increase in repeat purchases",
    },
]

const comparisons = [
    { feature: "Inventory Tracking", traditional: "Spreadsheets & manual counts", cubicleErp: "Real-time, automated" },
    { feature: "Omnichannel Sales", traditional: "Separate siloed systems", cubicleErp: "Unified single platform" },
    { feature: "Customer Loyalty", traditional: "Paper punch cards", cubicleErp: "Digital, data-driven" },
    { feature: "Reorder Management", traditional: "Manual threshold checks", cubicleErp: "AI-powered forecasting" },
    { feature: "Sales Analytics", traditional: "End-of-month reports", cubicleErp: "Live dashboards" },
    { feature: "Multi-Store Visibility", traditional: "Store-by-store login", cubicleErp: "Centralized overview" },
]

const faqs = [
    {
        question: "How does CubicleERP integrate with my existing POS hardware and software?",
        answer: "CubicleERP connects with all major POS systems including Square, Shopify POS, Lightspeed, Clover, and Vend through pre-built API connectors. Sales transactions, refunds, and payment data sync in real time to your inventory and accounting modules. For custom or legacy POS terminals, our integration team builds tailored connectors using our open REST API, ensuring barcode scanners, receipt printers, and card terminals work seamlessly from day one.",
    },
    {
        question: "Can I manage returns, exchanges, and refunds through the system?",
        answer: "Absolutely. CubicleERP includes a comprehensive returns and exchanges module that handles in-store returns, online return requests, cross-channel returns (buy online, return in store), and warranty claims. Each return automatically adjusts inventory levels, triggers accounting reversals, and updates the customer profile.",
    },
    {
        question: "How does inventory forecasting and automatic reordering work?",
        answer: "The system analyzes historical sales data, seasonal patterns, current stock levels, and supplier lead times to generate demand forecasts for every product at every location. When projected stock falls below your configured safety thresholds, CubicleERP automatically creates draft purchase orders with recommended quantities and preferred suppliers.",
    },
    {
        question: "What sales analytics and reporting capabilities are included?",
        answer: "CubicleERP provides real-time dashboards covering sales by product, category, location, channel, and time period, along with gross margin analysis, inventory turnover rates, and customer acquisition metrics. Custom report builder lets you create tailored reports, schedule automated email distribution, and export data to Excel or BI tools.",
    },
    {
        question: "How do you handle data migration and onboarding for existing retail businesses?",
        answer: "Our implementation team manages the complete migration of your product catalog, inventory levels, pricing rules, customer records, supplier information, and historical transaction data from your current system. Most single-store retailers are fully operational within two weeks, while multi-store chains typically complete rollout within four to eight weeks.",
    },
]

const steps = [
    {
        step: "1",
        title: "Retail Operations Audit & Setup",
        description: "We assess your current retail workflows, POS systems, inventory processes, and sales channels. A tailored implementation plan is created to migrate your product catalog, customer data, and historical transactions with zero disruption to daily store operations.",
    },
    {
        step: "2",
        title: "Configuration, Integration & Testing",
        description: "We configure CubicleERP for your store layouts, pricing rules, tax structures, and loyalty programs. Integrations with your POS hardware, e-commerce platforms, payment gateways, and supplier portals are set up and rigorously tested.",
    },
    {
        step: "3",
        title: "Staff Training & Phased Go-Live",
        description: "Your store managers, cashiers, warehouse staff, and back-office teams receive hands-on training tailored to their roles. We execute a phased rollout starting with pilot locations, followed by full deployment with dedicated support.",
    },
]

const useCases = [
    {
        title: "Multi-Store Retail Chains",
        description: "Retail chains with multiple locations rely on CubicleERP to centralize inventory control, standardize pricing and promotions, and benchmark store performance -- all while allowing regional managers the flexibility to adapt to local market conditions.",
        highlights: [
            "Centralized stock allocation with inter-store transfer workflows",
            "Standardized pricing with location-specific promotion overrides",
            "Comparative store performance dashboards and regional analytics",
        ],
    },
    {
        title: "Omnichannel & E-Commerce Retailers",
        description: "Retailers selling across physical stores, websites, mobile apps, and marketplaces use CubicleERP to maintain a single source of truth for inventory, orders, and customers.",
        highlights: [
            "Unified inventory pool shared across online and offline channels",
            "Buy-online-pick-up-in-store and ship-from-store fulfillment",
            "Consolidated customer profiles with cross-channel purchase history",
        ],
    },
    {
        title: "Specialty & Boutique Retailers",
        description: "Specialty shops and boutiques leverage CubicleERP to manage complex product hierarchies, seasonal collections, and high-touch customer relationships that differentiate them from mass-market competitors.",
        highlights: [
            "Advanced variant management for size, color, material, and custom attributes",
            "Seasonal collection planning with pre-order and made-to-order workflows",
            "VIP customer tracking with personalized recommendations and wish lists",
        ],
    },
]

const stats = [
    { value: "3,500+", label: "Retail locations powered" },
    { value: "30%", label: "Reduction in inventory costs" },
    { value: "25%", label: "Increase in average order value" },
    { value: "99.9%", label: "POS system uptime" },
]

const retailTypes = [
    { label: "Boutique", icon: ShoppingBag },
    { label: "Chain Stores", icon: Store },
    { label: "Pop-up Shops", icon: MapPin },
    { label: "Franchise", icon: Globe },
    { label: "Department Store", icon: LayoutGrid },
    { label: "Online+Offline", icon: Wifi },
]

const customerJourney = [
    { label: "Browse", icon: Eye, color: "bg-red-100 text-red-600" },
    { label: "Cart", icon: ShoppingCart, color: "bg-rose-100 text-rose-600" },
    { label: "Checkout", icon: CreditCard, color: "bg-red-100 text-red-600" },
    { label: "Fulfill", icon: Box, color: "bg-rose-100 text-rose-600" },
    { label: "Deliver", icon: Truck, color: "bg-red-100 text-red-600" },
    { label: "Review", icon: Star, color: "bg-rose-100 text-rose-600" },
]

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
}

export default function RetailPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(null)

    return (
        <main className="bg-white">
            <LP2Navbar />

            {/* SECTION 1 - HERO */}
            <section className="relative pt-16 pb-10 overflow-hidden">
                <div className="absolute inset-0">
                    <Image src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80" alt="Retail store" fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/50" />
                </div>
                <div className="relative max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-10 items-center">
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                        <span className="inline-block px-4 py-1.5 rounded-full bg-red-600/20 border border-red-500/40 text-red-300 text-sm font-medium mb-4">
                            Retail & POS Platform
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
                            Run your retail empire from a <span className="text-red-400">single screen</span>
                        </h1>
                        <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                            CubicleERP Retail empowers retailers with a unified platform to manage point-of-sale operations, real-time inventory, omnichannel sales, and customer loyalty programs from a single dashboard. Whether you run a single boutique or a chain of stores, streamline every aspect of your retail business.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Link href="/demo" className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2">
                                Start Free Trial <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link href="/contact" className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg font-semibold transition-colors">
                                Book a Demo
                            </Link>
                        </div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                        <div className="bg-gray-900/80 backdrop-blur border border-gray-700 rounded-2xl p-6 shadow-2xl">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                                <span className="ml-2 text-gray-400 text-sm font-mono">CubicleERP POS Terminal</span>
                            </div>
                            <div className="space-y-2 mb-4">
                                {[
                                    { name: "Organic Cotton Tee (M)", qty: 2, price: "$29.99" },
                                    { name: "Slim Fit Jeans (32)", qty: 1, price: "$49.99" },
                                    { name: "Leather Belt (Brown)", qty: 1, price: "$24.99" },
                                ].map((item, i) => (
                                    <div key={i} className="flex justify-between items-center text-sm py-2 border-b border-gray-700/50">
                                        <div>
                                            <p className="text-white font-medium">{item.name}</p>
                                            <p className="text-gray-500 text-xs">Qty: {item.qty}</p>
                                        </div>
                                        <span className="text-red-400 font-semibold">{item.price}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-gray-700 pt-3 space-y-1">
                                <div className="flex justify-between text-sm text-gray-400">
                                    <span>Subtotal</span><span>$134.96</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-400">
                                    <span>Tax (8.5%)</span><span>$11.47</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-white pt-1">
                                    <span>Total</span><span className="text-red-400">$146.43</span>
                                </div>
                            </div>
                            <button className="w-full mt-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-lg transition-colors">
                                Pay $146.43
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* SECTION 2 - RETAIL TYPES STRIP */}
            <section className="bg-red-600 py-6">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="text-center text-white/80 text-sm font-medium mb-4 tracking-wide uppercase">Built for every retail format</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        {retailTypes.map((type, i) => (
                            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                                className="flex items-center gap-2 px-5 py-2.5 bg-white/15 backdrop-blur rounded-full border border-white/20 text-white text-sm font-medium">
                                <type.icon className="w-4 h-4" />
                                {type.label}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 3 - FEATURES GRID */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <span className="inline-block px-4 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold mb-3">Core Features</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Everything you need to run retail</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">From checkout to back-office, every tool purpose-built for modern retail operations.</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((f, i) => (
                            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                                className="bg-rose-50 rounded-2xl p-6 border border-rose-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center mb-4">
                                    <f.icon className="w-6 h-6 text-red-600" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{f.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 4 - POS DASHBOARD PREVIEW */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <span className="inline-block px-4 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold mb-3">Live Dashboard</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Your retail command center</h2>
                    </div>
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
                        className="bg-gray-900 rounded-2xl p-6 md:p-8 border border-gray-800 shadow-2xl">
                        <div className="grid md:grid-cols-3 gap-6 mb-6">
                            {/* Daily Sales Chart */}
                            <div className="bg-gray-800/60 rounded-xl p-5">
                                <h4 className="text-gray-400 text-sm font-medium mb-4">Daily Sales (This Week)</h4>
                                <div className="flex items-end gap-2 h-32">
                                    {[65, 45, 80, 55, 90, 70, 85].map((h, i) => (
                                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                            <div className="w-full rounded-t-md bg-red-500/80 transition-all" style={{ height: `${h}%` }} />
                                            <span className="text-gray-500 text-[10px]">{["M", "T", "W", "T", "F", "S", "S"][i]}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Top Products */}
                            <div className="bg-gray-800/60 rounded-xl p-5">
                                <h4 className="text-gray-400 text-sm font-medium mb-4">Top Products Today</h4>
                                <div className="space-y-3">
                                    {[
                                        { name: "Premium Sneakers", sold: 48, rev: "$4,320" },
                                        { name: "Organic Cotton Tee", sold: 36, rev: "$1,080" },
                                        { name: "Leather Wallet", sold: 29, rev: "$1,450" },
                                        { name: "Denim Jacket", sold: 22, rev: "$2,640" },
                                    ].map((p, i) => (
                                        <div key={i} className="flex justify-between items-center">
                                            <div>
                                                <p className="text-white text-sm font-medium">{p.name}</p>
                                                <p className="text-gray-500 text-xs">{p.sold} sold</p>
                                            </div>
                                            <span className="text-red-400 text-sm font-semibold">{p.rev}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Inventory Alerts */}
                            <div className="bg-gray-800/60 rounded-xl p-5">
                                <h4 className="text-gray-400 text-sm font-medium mb-4">Inventory Alerts</h4>
                                <div className="space-y-3">
                                    {[
                                        { item: "Running Shoes (Size 10)", status: "Low Stock", qty: 3, color: "text-yellow-400" },
                                        { item: "Silk Scarf (Red)", status: "Out of Stock", qty: 0, color: "text-red-400" },
                                        { item: "Wool Sweater (L)", status: "Low Stock", qty: 5, color: "text-yellow-400" },
                                        { item: "Canvas Bag", status: "Reorder Sent", qty: 8, color: "text-green-400" },
                                    ].map((a, i) => (
                                        <div key={i} className="flex justify-between items-center">
                                            <div>
                                                <p className="text-white text-sm font-medium">{a.item}</p>
                                                <p className={`text-xs font-medium ${a.color}`}>{a.status}</p>
                                            </div>
                                            <span className="text-gray-400 text-xs">{a.qty} left</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {/* Mini stat cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: "Today's Revenue", value: "$12,847", change: "+14%", icon: TrendingUp },
                                { label: "Items Sold", value: "284", change: "+8%", icon: ShoppingCart },
                                { label: "Avg Order Value", value: "$45.24", change: "+3%", icon: Receipt },
                                { label: "Active Customers", value: "1,203", change: "+21%", icon: Users },
                            ].map((s, i) => (
                                <div key={i} className="bg-gray-800/60 rounded-xl p-4 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-red-600/20 flex items-center justify-center">
                                        <s.icon className="w-5 h-5 text-red-400" />
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-xs">{s.label}</p>
                                        <p className="text-white font-bold text-lg">{s.value}</p>
                                        <p className="text-green-400 text-xs font-medium">{s.change}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* SECTION 5 - CAPABILITIES WITH IMAGES */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-14">
                        <span className="inline-block px-4 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold mb-3">Advanced Capabilities</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Intelligence built for retail scale</h2>
                    </div>
                    <div className="space-y-16">
                        {capabilities.map((cap, i) => (
                            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                                className={`grid lg:grid-cols-2 gap-10 items-center ${i % 2 === 1 ? "lg:direction-rtl" : ""}`}>
                                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{cap.title}</h3>
                                    <p className="text-gray-600 mb-5 leading-relaxed">{cap.description}</p>
                                    <ul className="space-y-2.5">
                                        {cap.keyPoints.map((point, j) => (
                                            <li key={j} className="flex items-start gap-2.5">
                                                <CheckCircle2 className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                                                <span className="text-gray-700 text-sm">{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-5 flex items-center gap-3">
                                        <div className="px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-semibold border border-red-200">AI-Powered</div>
                                        <div className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">Real-Time</div>
                                    </div>
                                </div>
                                <div className={`relative rounded-2xl overflow-hidden h-72 lg:h-80 ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                                    <Image src={cap.image} alt={cap.title} fill className="object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 6 - BENEFITS SECTION (SPLIT) */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-start">
                    {/* LEFT SIDE - Full content */}
                    <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                        <span className="inline-block px-4 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold mb-3">Why CubicleERP Retail</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Transform every metric that matters</h2>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            From checkout speed to inventory accuracy, CubicleERP delivers measurable improvements across every retail KPI that drives profitability.
                        </p>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            {stats.map((s, i) => (
                                <div key={i} className="bg-red-50 rounded-xl p-4 border border-red-100">
                                    <p className="text-2xl font-bold text-red-600">{s.value}</p>
                                    <p className="text-gray-600 text-sm">{s.label}</p>
                                </div>
                            ))}
                        </div>
                        <div className="bg-rose-50 rounded-xl p-4 border border-rose-100 mb-6">
                            <Quote className="w-5 h-5 text-red-400 mb-2" />
                            <p className="text-gray-700 text-sm italic mb-2">&quot;CubicleERP paid for itself in the first quarter through reduced stockouts and higher basket sizes alone.&quot;</p>
                            <p className="text-gray-500 text-xs font-medium">-- Sarah Mitchell, VP Retail Operations</p>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-6">
                            {["Shopify Sync", "Square POS", "Barcode Scanner", "Multi-Location", "Offline Mode"].map((badge, i) => (
                                <span key={i} className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200">{badge}</span>
                            ))}
                        </div>
                        <Link href="/demo" className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors text-sm">
                            See It In Action <ArrowRight className="w-4 h-4" />
                        </Link>
                    </motion.div>
                    {/* RIGHT SIDE - 6 benefit cards */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        {benefits.map((b, i) => (
                            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                                className="bg-rose-50 rounded-xl p-5 border border-rose-100">
                                <CheckCircle2 className="w-6 h-6 text-red-600 mb-2" />
                                <h4 className="text-sm font-bold text-gray-900 mb-1">{b.title}</h4>
                                <p className="text-gray-600 text-xs leading-relaxed">{b.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 7 - CUSTOMER JOURNEY */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-10">
                        <span className="inline-block px-4 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold mb-3">Customer Journey</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Seamless from browse to review</h2>
                        <p className="text-gray-600 max-w-xl mx-auto">Every touchpoint optimized for conversion and satisfaction.</p>
                    </div>
                    <div className="flex flex-wrap justify-center items-center gap-3 md:gap-0">
                        {customerJourney.map((node, i) => (
                            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                                className="flex items-center">
                                <div className="flex flex-col items-center">
                                    <div className={`w-16 h-16 rounded-2xl ${node.color} flex items-center justify-center mb-2`}>
                                        <node.icon className="w-7 h-7" />
                                    </div>
                                    <span className="text-gray-800 text-sm font-semibold">{node.label}</span>
                                </div>
                                {i < customerJourney.length - 1 && (
                                    <ArrowRight className="w-5 h-5 text-red-300 mx-3 hidden md:block" />
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 8 - INTEGRATIONS */}
            <section className="py-20 bg-rose-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <span className="inline-block px-4 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold mb-3">Integrations</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Connects with your entire stack</h2>
                        <p className="text-gray-600 max-w-xl mx-auto">Pre-built connectors for the tools you already use, plus an open API for custom needs.</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {integrations.map((integ, i) => (
                            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                                className="bg-white rounded-xl p-4 border border-rose-100 text-center hover:shadow-md transition-shadow">
                                <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center mx-auto mb-2">
                                    <Zap className="w-5 h-5 text-red-500" />
                                </div>
                                <p className="text-gray-900 text-sm font-semibold">{integ.name}</p>
                                <p className="text-gray-500 text-xs">{integ.category}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 9 - HOW IT WORKS */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <span className="inline-block px-4 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold mb-3">How It Works</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Live in weeks, not months</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {steps.map((s, i) => (
                            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                                className="relative bg-red-50 rounded-2xl p-6 border border-red-100">
                                <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-lg mb-4">{s.step}</div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{s.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{s.description}</p>
                                {i < steps.length - 1 && (
                                    <ArrowRight className="hidden md:block absolute -right-5 top-1/2 -translate-y-1/2 w-6 h-6 text-red-300 z-10" />
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 10 - USE CASES */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <span className="inline-block px-4 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold mb-3">Use Cases</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Purpose-built for your retail model</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {useCases.map((uc, i) => (
                            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                                className="bg-rose-50 rounded-2xl p-6 border border-rose-100">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{uc.title}</h3>
                                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{uc.description}</p>
                                <ul className="space-y-2">
                                    {uc.highlights.map((h, j) => (
                                        <li key={j} className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                                            <span className="text-gray-700 text-sm">{h}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 11 - COMPARISON TABLE */}
            <section className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <span className="inline-block px-4 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold mb-3">Comparison</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Legacy tools vs. CubicleERP</h2>
                    </div>
                    <div className="bg-red-50 rounded-2xl border border-red-100 overflow-hidden">
                        <div className="grid grid-cols-3 bg-red-600 text-white font-semibold text-sm">
                            <div className="p-4">Feature</div>
                            <div className="p-4 text-center">Traditional</div>
                            <div className="p-4 text-center">CubicleERP</div>
                        </div>
                        {comparisons.map((c, i) => (
                            <div key={i} className={`grid grid-cols-3 text-sm ${i % 2 === 0 ? "bg-red-50" : "bg-rose-50"}`}>
                                <div className="p-4 font-medium text-gray-900">{c.feature}</div>
                                <div className="p-4 text-center text-gray-500 flex items-center justify-center gap-1.5">
                                    <X className="w-4 h-4 text-red-400" />
                                    <span>{c.traditional}</span>
                                </div>
                                <div className="p-4 text-center text-gray-800 flex items-center justify-center gap-1.5">
                                    <Check className="w-4 h-4 text-green-600" />
                                    <span className="font-medium">{c.cubicleErp}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 12 - TESTIMONIALS */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <span className="inline-block px-4 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold mb-3">Testimonials</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Trusted by retail leaders</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {testimonials.map((t, i) => (
                            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                                className="bg-rose-50 rounded-2xl p-6 border border-rose-100">
                                <Quote className="w-6 h-6 text-red-400 mb-3" />
                                <p className="text-gray-700 text-sm italic mb-4 leading-relaxed">&quot;{t.quote}&quot;</p>
                                <div className="border-t border-rose-200 pt-3">
                                    <p className="text-gray-900 font-bold text-sm">{t.author}</p>
                                    <p className="text-gray-500 text-xs">{t.role}, {t.company}</p>
                                    <span className="inline-block mt-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">{t.metric}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 13 - FAQ ACCORDION */}
            <section className="py-20 bg-white">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <span className="inline-block px-4 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold mb-3">FAQ</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Common questions</h2>
                    </div>
                    <div className="space-y-3">
                        {faqs.map((faq, i) => (
                            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                                className="bg-red-50 rounded-xl border border-red-100 overflow-hidden">
                                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full flex items-center justify-between p-5 text-left">
                                    <span className="text-gray-900 font-semibold text-sm pr-4">{faq.question}</span>
                                    <ChevronDown className={`w-5 h-5 text-red-600 shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                                </button>
                                {openFaq === i && (
                                    <div className="px-5 pb-5">
                                        <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 14 - RED GRADIENT CTA */}
            <section className="py-20 bg-gradient-to-br from-red-600 via-red-700 to-red-800">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to modernize your retail operations?</h2>
                        <p className="text-red-100 text-lg mb-8 max-w-2xl mx-auto">
                            Join 3,500+ retail locations already running on CubicleERP. Start your free trial today and see results in your first week.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/demo" className="px-8 py-3.5 bg-white text-red-700 hover:bg-red-50 rounded-lg font-bold transition-colors flex items-center gap-2">
                                Start Free Trial <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link href="/contact" className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-lg font-bold transition-colors">
                                Talk to Sales
                            </Link>
                        </div>
                        <div className="flex flex-wrap justify-center gap-6 mt-8">
                            {["No credit card required", "14-day free trial", "Cancel anytime"].map((text, i) => (
                                <span key={i} className="flex items-center gap-1.5 text-red-100 text-sm">
                                    <CheckCircle2 className="w-4 h-4" /> {text}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* SECTION 15 - LP2CTA + LP2Footer */}
            <LP2CTA />
            <LP2Footer />
        </main>
    )
}
