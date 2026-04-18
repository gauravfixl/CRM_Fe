"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import LP2Navbar from "@/components/landingpage2/LP2Navbar"
import LP2Footer from "@/components/landingpage2/LP2Footer"
import LP2CTA from "@/components/landingpage2/LP2CTA"
import {
    Factory,
    Cog,
    Layers,
    TrendingUp,
    ShieldCheck,
    Gauge,
    ClipboardList,
    CheckCircle2,
    ArrowRight,
    ChevronDown,
    Check,
    X,
    Quote,
    Package,
    Truck,
    Globe,
    Box,
} from "lucide-react"

const PRIMARY = "#0F766E"

const features = [
    {
        icon: Layers,
        title: "Bill of Materials Management",
        description:
            "Define and manage multi-level bills of materials with unlimited sub-assembly depth, alternative components, and configurable product variants. Track cost rollups across every BOM level in real time and maintain full version history so engineering changes never disrupt active production runs. Phantom assemblies, co-products, and by-product definitions ensure your BOM structure mirrors the real production process accurately.",
    },
    {
        icon: Cog,
        title: "Material Requirements Planning (MRP)",
        description:
            "Automatically calculate net material requirements based on demand forecasts, current inventory, open purchase orders, and production schedules. MRP runs generate planned purchase requisitions and production orders with optimal lot sizing, reducing excess stock while preventing shortages. Time-phased planning ensures materials arrive exactly when needed, keeping carrying costs low and production lines running without interruption.",
    },
    {
        icon: ClipboardList,
        title: "Production Scheduling & Work Orders",
        description:
            "Create, assign, and track work orders through every production stage with drag-and-drop Gantt scheduling that respects machine capacity, labor availability, and tooling constraints. Finite capacity scheduling automatically resolves conflicts and suggests optimal sequencing to minimize changeover time between production runs. Real-time status updates from the shop floor keep planners informed of progress, delays, and bottlenecks as they happen.",
    },
    {
        icon: ShieldCheck,
        title: "Quality Control & Compliance",
        description:
            "Embed inspection checkpoints at incoming material receipt, in-process stages, and final dispatch with configurable quality plans that define parameters, tolerances, and sampling rules. Automatically quarantine non-conforming materials, trigger corrective action workflows, and maintain complete lot traceability from raw material to finished product for audit readiness. Statistical process control charts and Pareto analysis help quality teams identify root causes and drive continuous improvement.",
    },
    {
        icon: Factory,
        title: "Shop Floor Management",
        description:
            "Equip operators with intuitive shop floor terminals that display work instructions, capture production quantities, log material consumption, and record downtime reasons in real time. Barcode and RFID scanning streamline material issue, WIP tracking, and finished goods receipt, eliminating manual data entry errors. Supervisors get live dashboards showing machine status, operator performance, and work order progress across every production cell and line.",
    },
    {
        icon: Gauge,
        title: "OEE & Performance Tracking",
        description:
            "Measure Overall Equipment Effectiveness by automatically capturing availability, performance, and quality data from each machine and production line. Drill down into the six big losses to pinpoint exactly where efficiency is lost. Trend analysis and shift-by-shift comparisons help management set realistic targets, benchmark across facilities, and track improvement initiatives over time.",
    },
]

const benefits = [
    { title: "Cut Production Costs by Up to 25%", description: "Optimized material planning, reduced scrap rates, and improved labor utilization combine to significantly lower your per-unit manufacturing cost. Data-driven insights highlight the biggest cost drivers so you focus improvement efforts where they matter most." },
    { title: "Achieve 95%+ On-Time Delivery", description: "Accurate capacity planning and real-time schedule visibility ensure production commitments are met consistently. Proactive alerts on delays and bottlenecks give planners time to adjust before delivery dates are impacted." },
    { title: "Reduce Inventory Carrying Costs", description: "MRP-driven procurement ensures you buy only what you need, when you need it. Safety stock levels are calculated dynamically based on demand variability and supplier lead times, keeping working capital free without risking stockouts." },
    { title: "Improve First-Pass Quality Yield", description: "Systematic quality checkpoints and real-time defect tracking catch issues early before they cascade through downstream operations. Fewer defects mean less rework, lower scrap, and higher customer satisfaction with every shipment." },
    { title: "Maximize Equipment Uptime", description: "Preventive maintenance scheduling driven by OEE data and equipment runtime hours reduces unplanned breakdowns. When machines run reliably, throughput increases without additional capital expenditure on new equipment." },
    { title: "Empower Data-Driven Decisions", description: "Real-time production dashboards, cost variance reports, and trend analytics give managers the visibility they need to make informed decisions. From shift planning to capital investment, every decision is backed by accurate, up-to-the-minute operational data." },
]

const stats = [
    { value: "500+", label: "Manufacturing facilities managed" },
    { value: "25%", label: "Average production cost reduction" },
    { value: "95%", label: "On-time delivery achievement" },
    { value: "40%", label: "Reduction in production waste" },
]

const capabilities = [
    {
        title: "Advanced Production Planning & Scheduling",
        description: "Move beyond basic scheduling with constraint-based planning that simultaneously optimizes machine utilization, labor allocation, tooling availability, and material readiness across your entire production network.",
        keyPoints: [
            "Finite capacity scheduling with automatic bottleneck detection and resolution",
            "What-if scenario modeling for demand spikes, machine breakdowns, and rush orders",
            "Multi-plant production planning with inter-facility transfer optimization",
            "Real-time Gantt visualization with drag-and-drop rescheduling capabilities",
        ],
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
    },
    {
        title: "Supply Chain & Vendor Performance Intelligence",
        description: "Gain deep visibility into your upstream supply chain with vendor scorecards, delivery reliability analytics, and risk monitoring that help you build a resilient and cost-effective supplier network.",
        keyPoints: [
            "Supplier performance dashboards tracking on-time delivery, quality rates, and pricing trends",
            "Automated vendor comparison and bid analysis for procurement decisions",
            "Supply risk monitoring with alerts for lead-time changes and capacity constraints",
            "Multi-source procurement strategies with automatic failover to backup suppliers",
        ],
        image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
    },
    {
        title: "Digital Twin & IoT Integration",
        description: "Connect your physical shop floor to a digital representation that captures real-time machine data, environmental conditions, and production metrics for predictive insights and remote monitoring.",
        keyPoints: [
            "PLC and SCADA integration for automated machine data collection",
            "Predictive maintenance models that forecast equipment failures before they occur",
            "Environmental monitoring for temperature, humidity, and cleanroom compliance",
            "Real-time digital dashboards accessible from mobile devices anywhere in the facility",
        ],
        image: "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=800&q=80",
    },
    {
        title: "Regulatory Compliance & Traceability",
        description: "Maintain end-to-end traceability from raw material origin to finished goods delivery with automated documentation and audit trails that satisfy industry-specific regulatory requirements.",
        keyPoints: [
            "Full lot and serial number genealogy with forward and backward traceability",
            "Automated compliance documentation for FDA, ISO 9001, ISO 13485, and IATF 16949",
            "Electronic batch records with digital signatures and tamper-proof audit logs",
        ],
        image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80",
    },
]

const integrations = [
    { name: "SAP", category: "ERP" },
    { name: "Siemens MindSphere", category: "IoT Platform" },
    { name: "AutoCAD", category: "CAD/Engineering" },
    { name: "SolidWorks", category: "CAD/Engineering" },
    { name: "QuickBooks", category: "Accounting" },
    { name: "Salesforce", category: "CRM" },
    { name: "Power BI", category: "Business Intelligence" },
    { name: "Slack", category: "Communication" },
    { name: "Jira", category: "Project Management" },
    { name: "Rockwell FactoryTalk", category: "Industrial Automation" },
    { name: "Epicor", category: "ERP" },
    { name: "ShipStation", category: "Shipping & Logistics" },
]

const testimonials = [
    {
        quote: "Before CubicleERP, our production planning was done on whiteboards and spreadsheets. Now we have real-time visibility across three plants, and our planners can respond to schedule changes in minutes instead of hours.",
        author: "James Whitfield",
        role: "Director of Manufacturing",
        company: "PrecisionCast Industries",
        metric: "35% improvement in schedule adherence",
    },
    {
        quote: "The quality module caught a raw material deviation at incoming inspection that would have cascaded through an entire production batch. That single catch saved us over $200,000 in potential rework and customer penalties.",
        author: "Linda Nakamura",
        role: "Quality Assurance Manager",
        company: "Apex Medical Devices",
        metric: "90% reduction in quality escapes",
    },
    {
        quote: "Our OEE was stuck at 62% for years. Within six months of implementing CubicleERP, we identified the root causes of our biggest losses and pushed OEE to 81%. The ROI was undeniable.",
        author: "Roberto Alvarez",
        role: "Plant Manager",
        company: "Continental Packaging Solutions",
        metric: "19-point OEE improvement",
    },
]

const comparisons = [
    { feature: "Production Scheduling", traditional: "Spreadsheet-based planning", cubicleErp: "AI-optimized scheduling" },
    { feature: "Quality Tracking", traditional: "Paper inspection forms", cubicleErp: "Digital, real-time SPC" },
    { feature: "BOM Management", traditional: "Static documents", cubicleErp: "Dynamic, multi-level" },
    { feature: "Shop Floor Data", traditional: "Manual entry, delayed", cubicleErp: "Automated, real-time" },
    { feature: "OEE Monitoring", traditional: "Weekly manual reports", cubicleErp: "Live dashboards" },
    { feature: "Traceability", traditional: "Paper-based logbooks", cubicleErp: "End-to-end digital" },
]

const faqs = [
    {
        question: "How does CubicleERP handle complex, multi-level bills of materials?",
        answer: "CubicleERP supports unlimited BOM levels with sub-assemblies, phantom assemblies, co-products, and by-products. You can define multiple BOM versions for the same product, manage engineering change orders with effective dates, and configure alternative components with substitution rules. The system automatically rolls up costs across all levels and calculates total material requirements for MRP planning, ensuring your production always references the correct specifications.",
    },
    {
        question: "Can the MRP engine handle both make-to-stock and make-to-order scenarios?",
        answer: "Yes. CubicleERP's MRP engine supports make-to-stock, make-to-order, assemble-to-order, and engineer-to-order manufacturing strategies. You can configure different planning policies per product or product family. The system considers demand forecasts, actual sales orders, safety stock levels, reorder points, and supplier lead times to generate optimized procurement and production plans for each strategy.",
    },
    {
        question: "How does shop floor data collection work?",
        answer: "CubicleERP provides browser-based shop floor terminals optimized for touch screens and industrial tablets. Operators scan barcodes or RFID tags to clock into work orders, report production quantities, log material consumption, and record downtime events with reason codes. The system also integrates with PLCs and IoT sensors to capture machine data automatically. All data flows into real-time dashboards that supervisors and planners can access from anywhere.",
    },
    {
        question: "What quality management capabilities are included?",
        answer: "The quality module includes configurable inspection plans with sampling rules, measurement parameters, and tolerance limits. You can set up quality checkpoints at incoming goods receipt, in-process production stages, and final inspection before dispatch. Non-conformance management tracks defects through disposition, root cause analysis, and corrective actions. Statistical process control charts, Pareto analysis, and trend reports help quality teams drive continuous improvement across your operations.",
    },
    {
        question: "How is OEE calculated and what insights does it provide?",
        answer: "OEE is calculated as the product of Availability, Performance, and Quality percentages for each machine or production line. CubicleERP captures planned vs. actual run time, ideal vs. actual cycle time, and total vs. good unit counts. The system breaks losses into the six big loss categories so you can see exactly where efficiency is being lost. Shift comparisons, trend charts, and facility benchmarks help you set targets and measure the impact of improvement initiatives over time.",
    },
]

const useCases = [
    {
        title: "Discrete Manufacturing",
        description: "Manufacturers of assembled products -- from automotive components to electronics and industrial machinery -- use CubicleERP to coordinate complex multi-stage production with hundreds of component parts and tight delivery schedules.",
        highlights: [
            "Multi-level BOM management with engineering change control",
            "Finite capacity scheduling across multiple work centers",
            "Full lot and serial number traceability for every assembly",
        ],
    },
    {
        title: "Process Manufacturing",
        description: "Chemical, pharmaceutical, food and beverage, and cosmetics manufacturers rely on CubicleERP to manage batch recipes, track yield and potency, and maintain strict regulatory compliance with complete batch genealogy.",
        highlights: [
            "Recipe and formula management with ingredient substitution rules",
            "Batch production with yield, potency, and shelf-life tracking",
            "FDA, GMP, and ISO compliance with automated audit trails",
        ],
    },
    {
        title: "Make-to-Order & Job Shop",
        description: "Custom and contract manufacturers handling diverse job orders use CubicleERP to quote accurately, plan capacity across concurrent jobs, and track profitability on every order from material issue through final shipment.",
        highlights: [
            "Job costing with real-time material, labor, and overhead tracking",
            "Dynamic scheduling that adapts to changing job priorities",
            "Customer-specific quality standards and inspection protocols",
        ],
    },
]

const steps = [
    {
        step: "1",
        title: "Map Your Production Processes",
        description: "Our manufacturing consultants work alongside your production and engineering teams to document your BOMs, routing sequences, quality plans, and shop floor workflows. This detailed process map becomes the blueprint for configuring CubicleERP to match exactly how your factory operates.",
    },
    {
        step: "2",
        title: "Configure & Integrate",
        description: "We set up your bills of materials, work centers, production routings, MRP parameters, and quality inspection plans within CubicleERP. Integrations with your existing ERP modules, shop floor equipment, barcode scanners, and IoT devices are configured and tested to ensure seamless data flow across your operation.",
    },
    {
        step: "3",
        title: "Train, Launch & Optimize",
        description: "Role-based training ensures planners, operators, quality inspectors, and supervisors are confident using the system before go-live. We launch with a pilot production line, validate results, and then roll out across your entire facility with ongoing support and periodic performance reviews to continuously optimize your operations.",
    },
]

const industries = ["Automotive", "Electronics", "Food & Beverage", "Pharmaceuticals", "Textiles", "Aerospace"]

const productionLines = [
    { name: "Line A - Assembly", status: "Running", color: "#22c55e", units: "1,247 / 1,500" },
    { name: "Line B - Welding", status: "Changeover", color: "#eab308", units: "892 / 1,200" },
    { name: "Line C - Paint Shop", status: "Down", color: "#ef4444", units: "0 / 800" },
]

const workOrders = [
    { id: "WO-4821", product: "Drive Shaft Assembly", qty: 500, priority: "High", progress: 78 },
    { id: "WO-4822", product: "Brake Caliper Housing", qty: 1200, priority: "Medium", progress: 45 },
    { id: "WO-4823", product: "Turbo Manifold", qty: 300, priority: "High", progress: 92 },
    { id: "WO-4824", product: "Suspension Link Arm", qty: 800, priority: "Low", progress: 12 },
]

const flowSteps = [
    { label: "Raw Materials", icon: Package },
    { label: "Production Planning", icon: ClipboardList },
    { label: "Manufacturing", icon: Factory },
    { label: "Quality Check", icon: ShieldCheck },
    { label: "Packaging", icon: Box },
    { label: "Shipping", icon: Truck },
]

const benefitBadges = ["ISO 9001 Ready", "IoT Compatible", "MES Integration", "Multi-Plant", "Real-time OEE"]

export default function ManufacturingPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(null)

    return (
        <main className="min-h-screen bg-white">
            <LP2Navbar />

            {/* ===== 1. HERO ===== */}
            <section className="relative pt-16 pb-10 overflow-hidden">
                <div className="absolute inset-0">
                    <Image src="https://images.unsplash.com/photo-1565043666747-69f6646db940?w=1920&q=80" alt="Manufacturing facility" fill className="object-cover" />
                    <div className="absolute inset-0 bg-gray-900/80" />
                </div>
                <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-6">
                    <div className="grid lg:grid-cols-2 gap-10 items-center">
                        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-teal-700/30 text-teal-300 border border-teal-600/40 mb-5">
                                <Factory className="w-4 h-4" /> Manufacturing Platform
                            </span>
                            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
                                Optimize production, minimize waste, maximize output
                            </h1>
                            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                                CubicleERP Manufacturing empowers modern manufacturers with end-to-end production management -- from raw material procurement and BOM management to shop floor execution and finished goods dispatch. Gain complete visibility across every stage of your manufacturing operations.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Link href="/demo" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all" style={{ background: PRIMARY }}>
                                    Start Free Trial <ArrowRight className="w-4 h-4" />
                                </Link>
                                <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white border border-white/30 hover:bg-white/10 transition-all">
                                    Schedule Demo
                                </Link>
                            </div>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                            <div className="bg-gray-800/80 backdrop-blur border border-gray-700 rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-white font-semibold text-sm">Production Dashboard</h3>
                                    <span className="text-xs text-teal-400 font-medium">Live</span>
                                </div>
                                {/* OEE Gauge */}
                                <div className="flex items-center gap-6 mb-5">
                                    <div className="relative w-24 h-24 flex-shrink-0">
                                        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                                            <circle cx="50" cy="50" r="42" fill="none" stroke="#374151" strokeWidth="8" />
                                            <circle cx="50" cy="50" r="42" fill="none" stroke="#0F766E" strokeWidth="8" strokeDasharray={`${87 * 2.64} ${264 - 87 * 2.64}`} strokeLinecap="round" />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-2xl font-bold text-white">87%</span>
                                            <span className="text-[10px] text-gray-400">OEE</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <div>
                                            <div className="flex justify-between text-xs text-gray-400 mb-1"><span>Production Rate</span><span className="text-teal-400">94%</span></div>
                                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: "94%", background: PRIMARY }} /></div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-xs text-gray-400 mb-1"><span>Defect Rate</span><span className="text-red-400">2.1%</span></div>
                                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden"><div className="h-full bg-red-500 rounded-full" style={{ width: "2.1%" }} /></div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-xs text-gray-400 mb-1"><span>Availability</span><span className="text-teal-400">91%</span></div>
                                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: "91%", background: PRIMARY }} /></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    {[{ label: "Units Today", val: "2,139" }, { label: "Active Lines", val: "2 / 3" }, { label: "Uptime", val: "98.4%" }].map((s, i) => (
                                        <div key={i} className="bg-gray-900/60 rounded-lg p-2.5 text-center">
                                            <div className="text-lg font-bold text-white">{s.val}</div>
                                            <div className="text-[10px] text-gray-500">{s.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ===== 2. INDUSTRY STRIP ===== */}
            <section className="py-6 border-b border-gray-100 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="text-center text-sm text-gray-500 mb-3 font-medium">Trusted across manufacturing</p>
                    <div className="flex flex-wrap justify-center gap-3">
                        {industries.map((ind) => (
                            <span key={ind} className="px-4 py-1.5 rounded-full text-sm font-medium bg-teal-50 text-teal-800 border border-teal-200">{ind}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== 3. FEATURES GRID ===== */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Core Manufacturing Features</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">Everything you need to run a modern, efficient, and quality-driven manufacturing operation from a single platform.</p>
                    </motion.div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((f, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="bg-teal-50 rounded-xl p-6 border border-teal-100">
                                <div className="w-11 h-11 rounded-lg flex items-center justify-center mb-4" style={{ background: `${PRIMARY}20` }}>
                                    <f.icon className="w-5 h-5" style={{ color: PRIMARY }} />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">{f.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== 4. FACTORY FLOOR DASHBOARD (DARK) ===== */}
            <section className="py-16 bg-gray-900">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Factory Floor Dashboard</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">Real-time visibility into every aspect of your production operations, from line status to quality metrics.</p>
                    </motion.div>
                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Production Line Status */}
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-gray-800 border border-gray-700 rounded-xl p-5">
                            <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><Gauge className="w-4 h-4" style={{ color: PRIMARY }} /> Production Line Status</h3>
                            <div className="space-y-3">
                                {productionLines.map((line, i) => (
                                    <div key={i} className="flex items-center justify-between bg-gray-900/60 rounded-lg p-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ background: line.color }} />
                                            <div>
                                                <div className="text-sm text-white font-medium">{line.name}</div>
                                                <div className="text-xs text-gray-500">{line.status}</div>
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-400 font-mono">{line.units}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Work Order Queue */}
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-gray-800 border border-gray-700 rounded-xl p-5">
                            <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><ClipboardList className="w-4 h-4" style={{ color: PRIMARY }} /> Work Order Queue</h3>
                            <div className="space-y-2.5">
                                {workOrders.map((wo, i) => (
                                    <div key={i} className="bg-gray-900/60 rounded-lg p-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-mono text-teal-400">{wo.id}</span>
                                                <span className="text-sm text-white">{wo.product}</span>
                                            </div>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${wo.priority === "High" ? "bg-red-500/20 text-red-400" : wo.priority === "Medium" ? "bg-yellow-500/20 text-yellow-400" : "bg-gray-600/30 text-gray-400"}`}>{wo.priority}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                                <div className="h-full rounded-full" style={{ width: `${wo.progress}%`, background: PRIMARY }} />
                                            </div>
                                            <span className="text-xs text-gray-400">{wo.progress}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Quality Control Metrics */}
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-gray-800 border border-gray-700 rounded-xl p-5">
                            <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><ShieldCheck className="w-4 h-4" style={{ color: PRIMARY }} /> Quality Control Metrics</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-900/60 rounded-lg p-4 text-center">
                                    <div className="text-3xl font-bold text-white mb-1">2.1%</div>
                                    <div className="text-xs text-gray-500">Defect Rate</div>
                                    <div className="text-[10px] text-green-400 mt-1">-0.4% from last week</div>
                                </div>
                                <div className="bg-gray-900/60 rounded-lg p-4 text-center">
                                    <div className="text-3xl font-bold text-white mb-1">97.9%</div>
                                    <div className="text-xs text-gray-500">First-Pass Yield</div>
                                    <div className="text-[10px] text-green-400 mt-1">+1.2% from last week</div>
                                </div>
                                <div className="bg-gray-900/60 rounded-lg p-4 text-center">
                                    <div className="text-3xl font-bold text-white mb-1">14</div>
                                    <div className="text-xs text-gray-500">NCRs This Week</div>
                                    <div className="text-[10px] text-green-400 mt-1">-6 from last week</div>
                                </div>
                                <div className="bg-gray-900/60 rounded-lg p-4 text-center">
                                    <div className="text-3xl font-bold text-white mb-1">4.7</div>
                                    <div className="text-xs text-gray-500">Sigma Level</div>
                                    <div className="text-[10px] text-teal-400 mt-1">Target: 5.0</div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Inventory Levels */}
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="bg-gray-800 border border-gray-700 rounded-xl p-5">
                            <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><Package className="w-4 h-4" style={{ color: PRIMARY }} /> Inventory Levels</h3>
                            <div className="space-y-4">
                                {[{ name: "Steel Alloy Bars", pct: 82, color: PRIMARY }, { name: "Electronic Components", pct: 45, color: "#eab308" }, { name: "Rubber Gaskets", pct: 91, color: PRIMARY }, { name: "Aluminum Sheets", pct: 28, color: "#ef4444" }, { name: "Lubricants & Fluids", pct: 67, color: PRIMARY }].map((item, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between text-xs mb-1"><span className="text-gray-300">{item.name}</span><span className="text-gray-500">{item.pct}%</span></div>
                                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden"><div className="h-full rounded-full transition-all" style={{ width: `${item.pct}%`, background: item.color }} /></div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ===== 5. CAPABILITIES WITH IMAGES ===== */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Advanced Capabilities</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">Go beyond the basics with intelligent manufacturing tools that set industry leaders apart.</p>
                    </motion.div>
                    <div className="space-y-16">
                        {capabilities.map((cap, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`grid lg:grid-cols-2 gap-10 items-center ${i % 2 === 1 ? "lg:direction-rtl" : ""}`}>
                                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{cap.title}</h3>
                                    <p className="text-gray-600 mb-5 leading-relaxed">{cap.description}</p>
                                    <ul className="space-y-2.5 mb-5">
                                        {cap.keyPoints.map((kp, j) => (
                                            <li key={j} className="flex items-start gap-2.5">
                                                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: PRIMARY }} />
                                                <span className="text-sm text-gray-700">{kp}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Link href="/demo" className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors" style={{ color: PRIMARY }}>
                                        Learn more <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                                <div className={`relative rounded-2xl overflow-hidden h-72 lg:h-80 ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                                    <Image src={cap.image} alt={cap.title} fill className="object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent" />
                                    <div className="absolute bottom-4 left-4 right-4 flex gap-2 flex-wrap">
                                        {cap.keyPoints.slice(0, 2).map((_, j) => (
                                            <span key={j} className="px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-800">
                                                {["Smart Planning", "IoT Ready", "Compliance", "Predictive"][i]}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== 6. BENEFITS SECTION ===== */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        {/* LEFT - Full */}
                        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Why manufacturers choose CubicleERP</h2>
                            <p className="text-gray-600 mb-6 leading-relaxed">From reducing production costs to achieving near-perfect on-time delivery, CubicleERP transforms how manufacturers operate -- with measurable results from day one.</p>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                {stats.map((s, i) => (
                                    <div key={i} className="bg-teal-50 rounded-lg p-4 border border-teal-100">
                                        <div className="text-2xl font-bold" style={{ color: PRIMARY }}>{s.value}</div>
                                        <div className="text-xs text-gray-600 mt-1">{s.label}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-white rounded-xl p-4 border border-gray-200 mb-6">
                                <div className="flex items-start gap-3">
                                    <Quote className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: PRIMARY }} />
                                    <div>
                                        <p className="text-sm text-gray-700 italic mb-2">&quot;{testimonials[0].quote.substring(0, 120)}...&quot;</p>
                                        <p className="text-xs text-gray-500 font-medium">-- {testimonials[0].author}, {testimonials[0].company}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-6">
                                {benefitBadges.map((b) => (
                                    <span key={b} className="px-3 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800 border border-teal-200">{b}</span>
                                ))}
                            </div>
                            <Link href="/demo" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-white transition-all" style={{ background: PRIMARY }}>
                                See It In Action <ArrowRight className="w-4 h-4" />
                            </Link>
                        </motion.div>
                        {/* RIGHT - 6 benefit cards */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            {benefits.map((b, i) => (
                                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="bg-teal-50 rounded-xl p-5 border border-teal-100">
                                    <CheckCircle2 className="w-5 h-5 mb-2" style={{ color: PRIMARY }} />
                                    <h4 className="font-semibold text-gray-900 text-sm mb-1.5">{b.title}</h4>
                                    <p className="text-xs text-gray-600 leading-relaxed">{b.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== 7. PRODUCTION FLOW ===== */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Production Flow</h2>
                        <p className="text-gray-600">End-to-end visibility from raw materials to finished goods shipment.</p>
                    </motion.div>
                    <div className="relative">
                        {/* Connecting line (desktop) */}
                        <div className="hidden lg:block absolute top-14 left-[8%] right-[8%] h-0.5" style={{ background: `linear-gradient(to right, ${PRIMARY}40, ${PRIMARY}, ${PRIMARY}40)` }} />
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                            {flowSteps.map((fs, i) => (
                                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex flex-col items-center text-center">
                                    <div className="relative z-10 w-16 h-16 rounded-full flex items-center justify-center mb-3 border-4 border-white shadow-lg" style={{ background: `${PRIMARY}15` }}>
                                        <fs.icon className="w-6 h-6" style={{ color: PRIMARY }} />
                                    </div>
                                    <span className="text-xs font-semibold text-gray-800">{fs.label}</span>
                                    <span className="text-[10px] text-gray-500 mt-0.5">Step {i + 1}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== 8. INTEGRATIONS ===== */}
            <section className="py-16 bg-teal-50">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Seamless Integrations</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">Connect CubicleERP with the tools and platforms your manufacturing operation already depends on.</p>
                    </motion.div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {integrations.map((intg, i) => (
                            <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }} className="bg-white rounded-xl p-4 text-center border border-teal-100 hover:shadow-md transition-shadow">
                                <div className="w-10 h-10 rounded-lg mx-auto mb-2.5 flex items-center justify-center" style={{ background: `${PRIMARY}15` }}>
                                    <Globe className="w-5 h-5" style={{ color: PRIMARY }} />
                                </div>
                                <div className="font-semibold text-sm text-gray-900">{intg.name}</div>
                                <div className="text-[10px] text-gray-500 mt-0.5">{intg.category}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== 9. HOW IT WORKS ===== */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">How It Works</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">A proven implementation approach designed specifically for manufacturing environments.</p>
                    </motion.div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {steps.map((s, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="relative bg-teal-50 rounded-xl p-6 border border-teal-100">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg mb-4" style={{ background: PRIMARY }}>{s.step}</div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{s.title}</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">{s.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== 10. USE CASES ===== */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Built for Every Manufacturing Model</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">Whether you run discrete, process, or job-shop manufacturing, CubicleERP adapts to your operational model.</p>
                    </motion.div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {useCases.map((uc, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-teal-50 rounded-xl p-6 border border-teal-100">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{uc.title}</h3>
                                <p className="text-sm text-gray-600 mb-4 leading-relaxed">{uc.description}</p>
                                <ul className="space-y-2">
                                    {uc.highlights.map((h, j) => (
                                        <li key={j} className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: PRIMARY }} />
                                            <span className="text-xs text-gray-700">{h}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== 11. COMPARISON TABLE ===== */}
            <section className="py-16 bg-white">
                <div className="max-w-4xl mx-auto px-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Traditional vs. CubicleERP</h2>
                        <p className="text-gray-600">See how CubicleERP transforms every aspect of manufacturing management.</p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-xl border border-teal-200 overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr style={{ background: PRIMARY }}>
                                    <th className="text-left text-white text-sm font-semibold px-5 py-3">Feature</th>
                                    <th className="text-left text-white text-sm font-semibold px-5 py-3">Traditional</th>
                                    <th className="text-left text-white text-sm font-semibold px-5 py-3">CubicleERP</th>
                                </tr>
                            </thead>
                            <tbody>
                                {comparisons.map((c, i) => (
                                    <tr key={i} className={i % 2 === 0 ? "bg-teal-50/50" : "bg-white"}>
                                        <td className="px-5 py-3 text-sm font-medium text-gray-900">{c.feature}</td>
                                        <td className="px-5 py-3 text-sm text-gray-500 flex items-center gap-2"><X className="w-4 h-4 text-red-400" /> {c.traditional}</td>
                                        <td className="px-5 py-3 text-sm text-gray-800"><span className="flex items-center gap-2"><Check className="w-4 h-4" style={{ color: PRIMARY }} /> {c.cubicleErp}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </motion.div>
                </div>
            </section>

            {/* ===== 12. TESTIMONIALS ===== */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">What Manufacturers Say</h2>
                        <p className="text-gray-600">Real results from real manufacturing operations.</p>
                    </motion.div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {testimonials.map((t, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white rounded-xl p-6 border border-gray-200 flex flex-col">
                                <Quote className="w-6 h-6 mb-3" style={{ color: PRIMARY }} />
                                <p className="text-sm text-gray-700 italic leading-relaxed flex-1 mb-4">&quot;{t.quote}&quot;</p>
                                <div className="border-t border-gray-100 pt-4">
                                    <div className="font-semibold text-sm text-gray-900">{t.author}</div>
                                    <div className="text-xs text-gray-500">{t.role}, {t.company}</div>
                                    <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-teal-50 border border-teal-200" style={{ color: PRIMARY }}>
                                        <TrendingUp className="w-3 h-3" /> {t.metric}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== 13. FAQ ===== */}
            <section className="py-16 bg-white">
                <div className="max-w-3xl mx-auto px-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Frequently Asked Questions</h2>
                        <p className="text-gray-600">Common questions about CubicleERP Manufacturing.</p>
                    </motion.div>
                    <div className="space-y-3">
                        {faqs.map((faq, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="border border-gray-200 rounded-xl overflow-hidden">
                                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors">
                                    <span className="text-sm font-semibold text-gray-900 pr-4">{faq.question}</span>
                                    <ChevronDown className={`w-5 h-5 flex-shrink-0 text-gray-400 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                                </button>
                                <AnimatePresence>
                                    {openFaq === i && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                                            <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">{faq.answer}</div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== 14. CTA - TEAL GRADIENT ===== */}
            <section className="py-16" style={{ background: `linear-gradient(135deg, ${PRIMARY}, #0d9488, #14b8a6)` }}>
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to transform your manufacturing operations?</h2>
                        <p className="text-teal-100 text-lg mb-8 max-w-2xl mx-auto">Join 500+ manufacturing facilities that have reduced costs, improved quality, and accelerated delivery with CubicleERP.</p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/demo" className="inline-flex items-center gap-2 px-7 py-3 rounded-lg font-semibold bg-white transition-all hover:bg-gray-100" style={{ color: PRIMARY }}>
                                Start Free Trial <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link href="/contact" className="inline-flex items-center gap-2 px-7 py-3 rounded-lg font-semibold text-white border-2 border-white/40 hover:bg-white/10 transition-all">
                                Talk to Sales
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ===== 15. LP2CTA + LP2Footer ===== */}
            <LP2CTA />
            <LP2Footer />
        </main>
    )
}
