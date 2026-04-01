"use client"

import ExploreProductPage from "@/components/landingpage2/explore/ExploreProductPage"
import {
    Scale,
    Shield,
    Users,
    Clock,
    BarChart3,
    Workflow,
} from "lucide-react"

const data = {
    name: "Legal",
    tagline: "Case management & billing for law firms",
    description:
        "CubicleERP Legal is purpose-built for law firms, legal departments, and legal service providers. Manage cases, track billable hours, automate billing, and maintain client relationships on a single secure platform. From solo practitioners to large firms with multiple offices, CubicleERP Legal streamlines legal operations and maximizes profitability.",
    icon: Scale,
    color: "#1E40AF",
    lightColor: "#EFF6FF",
    heroImage: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=80",
    features: [
        {
            icon: Scale,
            title: "Case Management",
            description:
                "Centralized case management with complete case history, document management, deadline tracking, and matter-specific workflows. Track case status, manage related matters, and maintain complete audit trails for compliance and malpractice protection.",
        },
        {
            icon: Clock,
            title: "Time & Expense Tracking",
            description:
                "Integrated time tracking with automatic billing calculations, expense management, and reimbursement tracking. Attorneys and staff can log time from anywhere, and the system automatically applies billing rates and generates invoices.",
        },
        {
            icon: Users,
            title: "Client Relationship Management",
            description:
                "Maintain complete client profiles with contact information, matter history, billing preferences, and communication history. Track client interactions, manage referrals, and identify cross-selling opportunities across your firm.",
        },
        {
            icon: Workflow,
            title: "Legal Workflow Automation",
            description:
                "Automate document generation, deadline tracking, conflict checking, and billing workflows. Create custom workflows for different practice areas and matter types. Reduce manual work and ensure consistent processes across your firm.",
        },
        {
            icon: BarChart3,
            title: "Financial Analytics & Reporting",
            description:
                "Track profitability by attorney, practice area, and client. Monitor billing rates, realization rates, and write-offs. Generate financial reports for firm management and partner distributions. Identify opportunities to improve profitability.",
        },
        {
            icon: Shield,
            title: "Compliance & Security",
            description:
                "Built-in compliance features for attorney-client privilege, document retention policies, and ethical billing requirements. Secure document storage with access controls, audit trails, and encryption to protect sensitive client information.",
        },
    ],
    benefits: [
        {
            title: "Maximize Billable Hours",
            description:
                "Integrated time tracking ensures no billable time is lost. Automatic billing calculations and invoice generation reduce administrative overhead and accelerate cash collection.",
        },
        {
            title: "Improve Client Service",
            description:
                "Complete client information and matter history enable better service delivery. Automated deadline tracking and matter management ensure nothing falls through the cracks.",
        },
        {
            title: "Streamline Operations",
            description:
                "Unified platform for case management, billing, and client relationships reduces manual work and eliminates data silos. Your team spends less time on administration and more time on client service.",
        },
        {
            title: "Enhance Profitability",
            description:
                "Detailed financial analytics help identify your most profitable practice areas and clients. Optimize staffing, billing rates, and matter management to maximize firm profitability.",
        },
        {
            title: "Maintain Compliance",
            description:
                "Built-in compliance features help ensure ethical billing, proper document retention, and attorney-client privilege protection. Reduce malpractice risk with complete audit trails and documentation.",
        },
        {
            title: "Support Multi-Office Firms",
            description:
                "Manage multiple offices with unified case management and billing. Share resources across offices, maintain consistent processes, and get firm-wide financial visibility.",
        },
    ],
    steps: [
        {
            step: "1",
            title: "Legal Practice Assessment",
            description:
                "Our legal technology specialists conduct a thorough assessment of your practice areas, billing models, client base, and technology infrastructure. We create a detailed implementation plan tailored to your firm's specific needs.",
        },
        {
            step: "2",
            title: "Configuration & Migration",
            description:
                "We configure CubicleERP for your practice areas, migrate existing case data and client information, set up billing rates and matter templates, and integrate with your existing tools. Your team receives comprehensive training on all features.",
        },
        {
            step: "3",
            title: "Go-Live & Optimization",
            description:
                "Phased rollout with parallel running periods ensures smooth transition. 24/7 support during go-live and ongoing optimization to maximize adoption and profitability improvements.",
        },
    ],
    useCases: [
        {
            title: "Large Law Firms",
            description:
                "Large firms with multiple practice areas and offices use CubicleERP to standardize case management and billing across the firm while maintaining practice area-specific customization.",
            highlights: [
                "Multi-office case management with unified billing",
                "Practice area-specific workflows and billing rates",
                "Firm-wide financial analytics and partner distributions",
            ],
        },
        {
            title: "Solo & Small Practices",
            description:
                "Solo practitioners and small firms use CubicleERP to manage cases, track time, and handle billing without the complexity of enterprise legal software.",
            highlights: [
                "Simple case and client management",
                "Automatic time tracking and billing",
                "Professional invoicing and financial reporting",
            ],
        },
        {
            title: "In-House Legal Departments",
            description:
                "Corporate legal departments use CubicleERP to manage internal matters, track legal spend, and maintain compliance with corporate governance requirements.",
            highlights: [
                "Matter management for internal legal work",
                "Budget tracking and spend analysis",
                "Compliance and document management",
            ],
        },
    ],
    faqs: [
        {
            question: "Does CubicleERP support different billing models?",
            answer:
                "Yes. CubicleERP supports hourly billing, fixed fees, contingency arrangements, and hybrid models. You can set different billing rates for different attorneys, practice areas, and client types. The system automatically calculates billing based on your configured rates and matter type.",
        },
        {
            question: "Can attorneys track time from mobile devices?",
            answer:
                "Yes. CubicleERP includes mobile apps for iOS and Android that allow attorneys to log time, update matter status, and access case information from anywhere. Time entries sync automatically to the main system.",
        },
        {
            question: "How does CubicleERP handle attorney-client privilege?",
            answer:
                "CubicleERP includes built-in controls to protect attorney-client privilege. Documents can be marked as privileged, access can be restricted to specific users, and audit trails track all access to privileged information. The system helps you maintain compliance with ethical rules and malpractice protection.",
        },
        {
            question: "Can CubicleERP integrate with legal research tools?",
            answer:
                "Yes. CubicleERP integrates with major legal research platforms like LexisNexis and Westlaw. We also provide an open API for custom integrations with other legal tools and practice management systems.",
        },
        {
            question: "How does CubicleERP handle matter conflicts?",
            answer:
                "CubicleERP includes conflict checking capabilities that help identify potential conflicts of interest based on client relationships and matter history. You can configure conflict rules specific to your firm's policies.",
        },
    ],
    stats: [
        { value: "500+", label: "Law firms using CubicleERP" },
        { value: "30%", label: "Average profitability increase" },
        { value: "20%", label: "Time savings on billing" },
        { value: "99.9%", label: "Platform uptime SLA" },
    ],
}

export default function LegalPage() {
    return <ExploreProductPage data={data} />
}
