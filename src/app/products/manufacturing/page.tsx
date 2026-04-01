"use client"

import ExploreProductPage from "@/components/landingpage2/explore/ExploreProductPage"
import {
    Factory,
    Cog,
    Layers,
    TrendingUp,
    AlertTriangle,
    Zap,
} from "lucide-react"

const data = {
    name: "Manufacturing",
    tagline: "Production management for modern manufacturers",
    description:
        "CubicleERP Manufacturing delivers comprehensive production planning, quality control, and supply chain management for manufacturers of all sizes. From bill of materials and production scheduling to real-time shop floor tracking and supplier collaboration — everything you need to optimize production efficiency, reduce waste, and deliver products on time and within budget.",
    icon: Factory,
    color: "#34495E",
    lightColor: "#D5DBDB",
    heroImage: "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=1920&q=80",
    features: [
        {
            icon: Layers,
            title: "Bill of Materials & Recipes",
            description:
                "Create and manage complex bills of materials with multiple levels of sub-assemblies. Track component requirements, alternative materials, and cost variations. Version control ensures you're always using the correct specifications for each product variant.",
        },
        {
            icon: Cog,
            title: "Production Planning & Scheduling",
            description:
                "Intelligent production scheduling that considers capacity, lead times, and demand forecasts. Automatically generate work orders, allocate resources, and optimize production sequences to minimize changeovers and maximize throughput. Adjust schedules in real-time based on demand changes or equipment issues.",
        },
        {
            icon: AlertTriangle,
            title: "Quality Control & Compliance",
            description:
                "Implement quality checkpoints at every production stage with automated inspection workflows. Track defects, manage non-conformances, and maintain full traceability for regulatory compliance. Generate quality reports and identify improvement opportunities through statistical analysis.",
        },
        {
            icon: TrendingUp,
            title: "Shop Floor Execution",
            description:
                "Real-time visibility into production progress with mobile shop floor terminals. Track work order status, material consumption, labor hours, and equipment utilization. Capture production data automatically to eliminate manual data entry and improve accuracy.",
        },
        {
            icon: Zap,
            title: "Supplier Collaboration",
            description:
                "Manage supplier relationships with purchase order automation, delivery tracking, and performance metrics. Share demand forecasts with suppliers for better planning. Maintain supplier scorecards based on quality, delivery, and cost performance.",
        },
        {
            icon: Factory,
            title: "Equipment & Maintenance Management",
            description:
                "Track equipment performance, schedule preventive maintenance, and manage maintenance work orders. Monitor equipment utilization and identify bottlenecks. Reduce unplanned downtime with predictive maintenance alerts based on equipment performance data.",
        },
    ],
    benefits: [
        {
            title: "Reduce Production Costs",
            description:
                "Optimize material usage, minimize waste, and improve labor efficiency. Manufacturers using CubicleERP reduce production costs by 15-25% through better planning and execution.",
        },
        {
            title: "Improve On-Time Delivery",
            description:
                "Better production scheduling and real-time visibility ensure orders are completed on schedule. Reduce late deliveries and improve customer satisfaction with reliable delivery dates.",
        },
        {
            title: "Increase Equipment Utilization",
            description:
                "Optimize production sequences to minimize changeovers and idle time. Real-time monitoring identifies bottlenecks and inefficiencies, allowing you to maximize throughput from existing equipment.",
        },
        {
            title: "Enhance Product Quality",
            description:
                "Systematic quality control processes and traceability reduce defects and rework. Maintain compliance with industry standards and customer requirements with automated quality workflows.",
        },
        {
            title: "Streamline Supply Chain",
            description:
                "Better demand forecasting and supplier collaboration reduce inventory levels while ensuring material availability. Improve supplier relationships with transparent performance metrics and collaborative planning.",
        },
        {
            title: "Enable Data-Driven Decisions",
            description:
                "Real-time production dashboards and analytics provide visibility into performance metrics. Identify improvement opportunities and make informed decisions about capacity, staffing, and process optimization.",
        },
    ],
    steps: [
        {
            step: "1",
            title: "Process Assessment",
            description:
                "We analyze your current production processes, equipment, and workflows. We document your bill of materials structure, production sequences, and quality requirements to create a detailed implementation plan.",
        },
        {
            step: "2",
            title: "System Configuration",
            description:
                "We configure CubicleERP for your manufacturing operations including bill of materials setup, production workflows, quality checkpoints, and equipment tracking. Integrate with your existing systems and shop floor equipment.",
        },
        {
            step: "3",
            title: "Training & Deployment",
            description:
                "Comprehensive training for production planners, shop floor supervisors, and quality inspectors. Phased rollout starting with pilot production lines, followed by full deployment with ongoing support.",
        },
    ],
    useCases: [
        {
            title: "Discrete Manufacturing",
            description:
                "Manufacturers of assembled products use CubicleERP to manage complex bills of materials, coordinate multi-stage production, and ensure quality at each assembly step.",
            highlights: [
                "Multi-level bill of materials with sub-assemblies",
                "Work order generation and tracking",
                "Quality checkpoints at each assembly stage",
            ],
        },
        {
            title: "Process Manufacturing",
            description:
                "Chemical, pharmaceutical, and food manufacturers use CubicleERP to manage recipes, batch production, and regulatory compliance with complete traceability.",
            highlights: [
                "Recipe management with ingredient tracking",
                "Batch production with yield tracking",
                "Regulatory compliance and traceability",
            ],
        },
        {
            title: "Contract Manufacturing",
            description:
                "Contract manufacturers managing multiple customer orders use CubicleERP to coordinate production, track costs by customer, and maintain quality standards.",
            highlights: [
                "Multi-customer order management",
                "Cost tracking by customer and product",
                "Quality compliance for each customer",
            ],
        },
    ],
    faqs: [
        {
            question: "How does CubicleERP handle complex bill of materials?",
            answer:
                "CubicleERP supports unlimited levels of sub-assemblies and component hierarchies. You can define alternative materials, manage component variants, and track cost variations. The system automatically calculates total material requirements for production planning.",
        },
        {
            question: "Can CubicleERP integrate with my shop floor equipment?",
            answer:
                "Yes. CubicleERP integrates with industrial IoT devices, PLCs, and manufacturing execution systems (MES) to capture real-time production data. We also provide mobile shop floor terminals for manual data entry where needed.",
        },
        {
            question: "How does production scheduling work?",
            answer:
                "CubicleERP uses demand forecasts, inventory levels, and production capacity to automatically generate optimized production schedules. The system considers lead times, changeover times, and resource constraints. You can manually adjust schedules based on business priorities.",
        },
        {
            question: "What quality control features are available?",
            answer:
                "CubicleERP provides quality checkpoints at any production stage, automated inspection workflows, defect tracking, and non-conformance management. Generate quality reports, track trends, and identify improvement opportunities through statistical analysis.",
        },
        {
            question: "How do you ensure regulatory compliance?",
            answer:
                "CubicleERP maintains complete traceability from raw materials through finished products. Automated audit trails, batch tracking, and compliance reporting help you meet industry regulations including FDA, ISO, and environmental standards.",
        },
    ],
    stats: [
        { value: "500+", label: "Manufacturing facilities" },
        { value: "20%", label: "Cost reduction average" },
        { value: "95%", label: "On-time delivery rate" },
        { value: "40%", label: "Waste reduction" },
    ],
}

export default function ManufacturingPage() {
    return <ExploreProductPage data={data} />
}
