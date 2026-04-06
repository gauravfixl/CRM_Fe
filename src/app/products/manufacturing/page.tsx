"use client"

import ExploreProductPage from "@/components/landingpage2/explore/ExploreProductPage"
import {
    Factory,
    Cog,
    Layers,
    TrendingUp,
    ShieldCheck,
    Gauge,
    ClipboardList,
} from "lucide-react"

const data = {
    name: "Manufacturing",
    tagline: "Streamline production, maximize efficiency, deliver quality",
    description:
        "CubicleERP Manufacturing empowers modern manufacturers with end-to-end production management — from raw material procurement and BOM management to shop floor execution and finished goods dispatch. With built-in MRP, quality control, OEE tracking, and real-time production dashboards, you gain complete visibility across every stage of your manufacturing operations to reduce waste, improve throughput, and consistently deliver on time.",
    icon: Factory,
    color: "#9333EA",
    lightColor: "#F3E8FF",
    heroImage:
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&q=80",
    variant: 4 as const,
    features: [
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
                "Measure Overall Equipment Effectiveness by automatically capturing availability, performance, and quality data from each machine and production line. Drill down into the six big losses — breakdowns, setup time, minor stoppages, reduced speed, startup rejects, and production rejects — to pinpoint exactly where efficiency is lost. Trend analysis and shift-by-shift comparisons help management set realistic targets, benchmark across facilities, and track improvement initiatives over time.",
        },
    ],
    benefits: [
        {
            title: "Cut Production Costs by Up to 25%",
            description:
                "Optimized material planning, reduced scrap rates, and improved labor utilization combine to significantly lower your per-unit manufacturing cost. Data-driven insights highlight the biggest cost drivers so you focus improvement efforts where they matter most.",
        },
        {
            title: "Achieve 95%+ On-Time Delivery",
            description:
                "Accurate capacity planning and real-time schedule visibility ensure production commitments are met consistently. Proactive alerts on delays and bottlenecks give planners time to adjust before delivery dates are impacted.",
        },
        {
            title: "Reduce Inventory Carrying Costs",
            description:
                "MRP-driven procurement ensures you buy only what you need, when you need it. Safety stock levels are calculated dynamically based on demand variability and supplier lead times, keeping working capital free without risking stockouts.",
        },
        {
            title: "Improve First-Pass Quality Yield",
            description:
                "Systematic quality checkpoints and real-time defect tracking catch issues early before they cascade through downstream operations. Fewer defects mean less rework, lower scrap, and higher customer satisfaction with every shipment.",
        },
        {
            title: "Maximize Equipment Uptime",
            description:
                "Preventive maintenance scheduling driven by OEE data and equipment runtime hours reduces unplanned breakdowns. When machines run reliably, throughput increases without additional capital expenditure on new equipment.",
        },
        {
            title: "Empower Data-Driven Decisions",
            description:
                "Real-time production dashboards, cost variance reports, and trend analytics give managers the visibility they need to make informed decisions. From shift planning to capital investment, every decision is backed by accurate, up-to-the-minute operational data.",
        },
    ],
    steps: [
        {
            step: "1",
            title: "Map Your Production Processes",
            description:
                "Our manufacturing consultants work alongside your production and engineering teams to document your BOMs, routing sequences, quality plans, and shop floor workflows. This detailed process map becomes the blueprint for configuring CubicleERP to match exactly how your factory operates.",
        },
        {
            step: "2",
            title: "Configure & Integrate",
            description:
                "We set up your bills of materials, work centers, production routings, MRP parameters, and quality inspection plans within CubicleERP. Integrations with your existing ERP modules, shop floor equipment, barcode scanners, and IoT devices are configured and tested to ensure seamless data flow across your operation.",
        },
        {
            step: "3",
            title: "Train, Launch & Optimize",
            description:
                "Role-based training ensures planners, operators, quality inspectors, and supervisors are confident using the system before go-live. We launch with a pilot production line, validate results, and then roll out across your entire facility with ongoing support and periodic performance reviews to continuously optimize your operations.",
        },
    ],
    useCases: [
        {
            title: "Discrete Manufacturing",
            description:
                "Manufacturers of assembled products — from automotive components to electronics and industrial machinery — use CubicleERP to coordinate complex multi-stage production with hundreds of component parts and tight delivery schedules.",
            highlights: [
                "Multi-level BOM management with engineering change control",
                "Finite capacity scheduling across multiple work centers",
                "Full lot and serial number traceability for every assembly",
            ],
        },
        {
            title: "Process Manufacturing",
            description:
                "Chemical, pharmaceutical, food and beverage, and cosmetics manufacturers rely on CubicleERP to manage batch recipes, track yield and potency, and maintain strict regulatory compliance with complete batch genealogy.",
            highlights: [
                "Recipe and formula management with ingredient substitution rules",
                "Batch production with yield, potency, and shelf-life tracking",
                "FDA, GMP, and ISO compliance with automated audit trails",
            ],
        },
        {
            title: "Make-to-Order & Job Shop",
            description:
                "Custom and contract manufacturers handling diverse job orders use CubicleERP to quote accurately, plan capacity across concurrent jobs, and track profitability on every order from material issue through final shipment.",
            highlights: [
                "Job costing with real-time material, labor, and overhead tracking",
                "Dynamic scheduling that adapts to changing job priorities",
                "Customer-specific quality standards and inspection protocols",
            ],
        },
    ],
    faqs: [
        {
            question:
                "How does CubicleERP handle complex, multi-level bills of materials?",
            answer: "CubicleERP supports unlimited BOM levels with sub-assemblies, phantom assemblies, co-products, and by-products. You can define multiple BOM versions for the same product, manage engineering change orders with effective dates, and configure alternative components with substitution rules. The system automatically rolls up costs across all levels and calculates total material requirements for MRP planning, ensuring your production always references the correct specifications.",
        },
        {
            question:
                "Can the MRP engine handle both make-to-stock and make-to-order scenarios?",
            answer: "Yes. CubicleERP's MRP engine supports make-to-stock, make-to-order, assemble-to-order, and engineer-to-order manufacturing strategies. You can configure different planning policies per product or product family. The system considers demand forecasts, actual sales orders, safety stock levels, reorder points, and supplier lead times to generate optimized procurement and production plans for each strategy.",
        },
        {
            question:
                "How does shop floor data collection work?",
            answer: "CubicleERP provides browser-based shop floor terminals optimized for touch screens and industrial tablets. Operators scan barcodes or RFID tags to clock into work orders, report production quantities, log material consumption, and record downtime events with reason codes. The system also integrates with PLCs and IoT sensors to capture machine data automatically. All data flows into real-time dashboards that supervisors and planners can access from anywhere.",
        },
        {
            question:
                "What quality management capabilities are included?",
            answer: "The quality module includes configurable inspection plans with sampling rules, measurement parameters, and tolerance limits. You can set up quality checkpoints at incoming goods receipt, in-process production stages, and final inspection before dispatch. Non-conformance management tracks defects through disposition, root cause analysis, and corrective actions. Statistical process control charts, Pareto analysis, and trend reports help quality teams drive continuous improvement across your operations.",
        },
        {
            question:
                "How is OEE calculated and what insights does it provide?",
            answer: "OEE is calculated as the product of Availability, Performance, and Quality percentages for each machine or production line. CubicleERP captures planned vs. actual run time, ideal vs. actual cycle time, and total vs. good unit counts — either through operator input or automated machine integration. The system breaks losses into the six big loss categories so you can see exactly where efficiency is being lost. Shift comparisons, trend charts, and facility benchmarks help you set targets and measure the impact of improvement initiatives over time.",
        },
    ],
    stats: [
        { value: "500+", label: "Manufacturing facilities managed" },
        { value: "25%", label: "Average production cost reduction" },
        { value: "95%", label: "On-time delivery achievement" },
        { value: "40%", label: "Reduction in production waste" },
    ],
}

export default function ManufacturingPage() {
    return <ExploreProductPage data={data} />
}
