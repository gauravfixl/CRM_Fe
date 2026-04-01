"use client"

import ExploreProductPage from "@/components/landingpage2/explore/ExploreProductPage"
import {
    Building,
    Users,
    DollarSign,
    Calendar,
    BarChart3,
    Workflow,
} from "lucide-react"

const data = {
    name: "Real Estate",
    tagline: "Property management & leasing platform",
    description:
        "CubicleERP Real Estate is purpose-built for property management companies, real estate developers, and commercial landlords. Manage properties, tenants, leases, maintenance, and financials on a single platform. From residential portfolios to commercial real estate, streamline operations and maximize property profitability.",
    icon: Building,
    color: "#92400E",
    lightColor: "#FFFBEB",
    heroImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80",
    features: [
        {
            icon: Building,
            title: "Property Management",
            description:
                "Centralized property management with complete property profiles, maintenance tracking, tenant information, and lease management. Track property status, maintenance history, and compliance requirements all in one place.",
        },
        {
            icon: Users,
            title: "Tenant Management",
            description:
                "Complete tenant profiles with lease information, contact details, payment history, and communication history. Manage tenant requests, maintenance issues, and lease renewals. Maintain tenant relationships and reduce turnover.",
        },
        {
            icon: DollarSign,
            title: "Rent Collection & Accounting",
            description:
                "Automated rent collection with online payment options, late payment tracking, and automatic reminders. Integrated accounting for property expenses, maintenance costs, and profitability analysis by property.",
        },
        {
            icon: Calendar,
            title: "Lease Management",
            description:
                "Complete lease tracking with automatic renewal reminders, lease expiration alerts, and rent escalation calculations. Maintain lease documents, track lease terms, and manage lease amendments.",
        },
        {
            icon: BarChart3,
            title: "Financial Analytics",
            description:
                "Track profitability by property, analyze occupancy rates, monitor maintenance costs, and generate financial reports. Identify opportunities to improve rental income and reduce expenses.",
        },
        {
            icon: Workflow,
            title: "Maintenance Workflow",
            description:
                "Automated maintenance request tracking, vendor management, and work order generation. Track maintenance history, schedule preventive maintenance, and manage maintenance budgets by property.",
        },
    ],
    benefits: [
        {
            title: "Maximize Rental Income",
            description:
                "Automated rent collection, late payment tracking, and occupancy optimization help maximize rental income. Reduce vacancy periods and improve collection rates.",
        },
        {
            title: "Reduce Operating Costs",
            description:
                "Centralized maintenance management, vendor tracking, and preventive maintenance scheduling reduce emergency repairs and operating costs. Track expenses by property and identify cost-saving opportunities.",
        },
        {
            title: "Improve Tenant Satisfaction",
            description:
                "Responsive maintenance management, online rent payment options, and tenant communication tools improve tenant satisfaction and reduce turnover.",
        },
        {
            title: "Streamline Operations",
            description:
                "Unified platform for property management, tenant management, and financial tracking reduces manual work and eliminates data silos. Your team spends less time on administration and more time on tenant service.",
        },
        {
            title: "Enhance Financial Visibility",
            description:
                "Detailed financial analytics by property help you understand profitability, identify underperforming properties, and make data-driven decisions about your portfolio.",
        },
        {
            title: "Support Multi-Property Portfolios",
            description:
                "Manage multiple properties with unified management and financial tracking. Get portfolio-wide visibility while maintaining property-specific customization.",
        },
    ],
    steps: [
        {
            step: "1",
            title: "Portfolio Assessment",
            description:
                "Our real estate specialists conduct a thorough assessment of your property portfolio, tenant base, lease structures, and current management processes. We create a detailed implementation plan tailored to your portfolio.",
        },
        {
            step: "2",
            title: "Configuration & Migration",
            description:
                "We configure CubicleERP for your properties, migrate existing tenant and lease data, set up financial tracking, and integrate with your existing tools. Your team receives comprehensive training on all features.",
        },
        {
            step: "3",
            title: "Go-Live & Optimization",
            description:
                "Phased rollout with parallel running periods ensures smooth transition. 24/7 support during go-live and ongoing optimization to maximize adoption and operational improvements.",
        },
    ],
    useCases: [
        {
            title: "Large Property Management Companies",
            description:
                "Large property management companies with hundreds of properties use CubicleERP to standardize operations across their portfolio while maintaining property-specific customization.",
            highlights: [
                "Multi-property management with unified financial tracking",
                "Centralized tenant management across all properties",
                "Portfolio-wide analytics and reporting",
            ],
        },
        {
            title: "Commercial Real Estate",
            description:
                "Commercial landlords and developers use CubicleERP to manage office buildings, retail centers, and industrial properties with complex lease structures and multiple tenants.",
            highlights: [
                "Complex lease management with multiple tenants per property",
                "Commercial-specific financial tracking and reporting",
                "Maintenance management for large commercial properties",
            ],
        },
        {
            title: "Residential Landlords",
            description:
                "Individual landlords and small property management companies use CubicleERP to manage residential properties, track rent collection, and handle maintenance.",
            highlights: [
                "Simple property and tenant management",
                "Automated rent collection and late payment tracking",
                "Maintenance request tracking and vendor management",
            ],
        },
    ],
    faqs: [
        {
            question: "Can CubicleERP handle complex lease structures?",
            answer:
                "Yes. CubicleERP supports various lease structures including fixed rent, percentage rent, triple net leases, and hybrid arrangements. You can configure rent escalations, CAM charges, and other lease-specific terms.",
        },
        {
            question: "Does CubicleERP support online rent payment?",
            answer:
                "Yes. CubicleERP includes integrated online payment options that allow tenants to pay rent securely. Payments are automatically recorded and reconciled with your accounting system.",
        },
        {
            question: "How does CubicleERP handle maintenance requests?",
            answer:
                "CubicleERP includes a maintenance request system where tenants can submit requests online. Requests are automatically routed to appropriate vendors, tracked through completion, and recorded in the property maintenance history.",
        },
        {
            question: "Can CubicleERP track maintenance costs by property?",
            answer:
                "Yes. All maintenance costs are tracked by property, allowing you to analyze maintenance expenses and identify properties with high maintenance costs. This helps you make decisions about property improvements or vendor changes.",
        },
        {
            question: "Does CubicleERP support multiple currencies?",
            answer:
                "Yes. CubicleERP supports multiple currencies, making it suitable for international property portfolios. You can set rental rates and track expenses in different currencies with automatic conversion.",
        },
    ],
    stats: [
        { value: "1000+", label: "Properties managed" },
        { value: "95%", label: "Average rent collection rate" },
        { value: "30%", label: "Maintenance cost reduction" },
        { value: "99.9%", label: "Platform uptime SLA" },
    ],
}

export default function RealEstatePage() {
    return <ExploreProductPage data={data} />
}
