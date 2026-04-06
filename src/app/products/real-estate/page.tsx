"use client"

import ExploreProductPage from "@/components/landingpage2/explore/ExploreProductPage"
import {
    Home,
    Building2,
    Users,
    FileText,
    DollarSign,
    Search,
    MapPin,
    ClipboardCheck,
    TrendingUp,
    Handshake,
    Eye,
    FolderOpen,
} from "lucide-react"

const data = {
    name: "Real Estate",
    tagline: "Close more deals, manage every property, delight every client",
    description:
        "CubicleERP Real Estate is an all-in-one platform built for brokerages, property managers, and real estate developers. From capturing leads and matching buyers to managing tenants, tracking leases, and calculating commissions, every workflow lives in one place. Whether you handle residential sales, commercial leasing, or mixed-use portfolios, CubicleERP gives you the tools to grow revenue and deliver exceptional client experiences.",
    icon: Home,
    color: "#059669",
    lightColor: "#D1FAE5",
    heroImage:
        "https://images.unsplash.com/photo-1582407947092-ff6e2780e24c?w=1920&q=80",
    variant: 2 as const,
    features: [
        {
            icon: Building2,
            title: "Property Listings & Inventory",
            description:
                "Maintain a comprehensive, searchable inventory of every property in your portfolio with rich detail including photos, floor plans, amenities, and pricing history. Listings sync across your website, property portals, and social channels so prospects always see up-to-date availability. Bulk-import properties from spreadsheets or MLS feeds and keep every record accurate with automated data validation.",
        },
        {
            icon: TrendingUp,
            title: "Deal Pipeline & Commission Tracking",
            description:
                "Visualize every transaction from initial inquiry through closing on a drag-and-drop pipeline board that mirrors your sales process. Automated commission splits calculate agent payouts, brokerage fees, and referral bonuses the moment a deal is marked closed. Built-in forecasting uses historical close rates to project monthly and quarterly revenue so leadership can plan with confidence.",
        },
        {
            icon: Users,
            title: "Tenant & Lease Management",
            description:
                "Store complete tenant profiles including contact details, lease terms, payment history, maintenance requests, and communication logs in a single timeline view. Automated alerts notify your team well before lease expirations, rent escalations, or renewal windows so nothing falls through the cracks. Tenants can submit maintenance requests and pay rent through a self-service portal, reducing administrative overhead for your property managers.",
        },
        {
            icon: Search,
            title: "Intelligent Client Matching",
            description:
                "CubicleERP analyzes buyer and renter preferences — budget, location, size, amenities — and instantly surfaces matching properties from your inventory. Smart scoring ranks each match so agents spend their time on the most promising showings rather than manual searches. When new listings are added, qualified prospects are automatically notified, keeping engagement high and reducing time-to-close.",
        },
        {
            icon: Eye,
            title: "Virtual Tours & Inspection Management",
            description:
                "Embed 360-degree virtual tour links, video walkthroughs, and interactive floor plans directly on each property record so remote buyers can explore from anywhere. Schedule and track property inspections with checklists, photo uploads, and deficiency reports that attach automatically to the property file. Inspection findings feed into maintenance workflows, ensuring issues are resolved before they affect tenant satisfaction or sale negotiations.",
        },
        {
            icon: FolderOpen,
            title: "Document Management & e-Signatures",
            description:
                "Centralize every document — lease agreements, disclosure forms, inspection reports, title deeds — in a secure, version-controlled repository organized by property and transaction. Built-in e-signature workflows let clients, agents, and landlords sign contracts digitally from any device, eliminating printing and courier delays. Role-based access controls ensure sensitive financial and legal documents are visible only to authorized team members.",
        },
    ],
    benefits: [
        {
            title: "Close Deals Faster",
            description:
                "Automated client matching, instant property alerts, and digital signature workflows cut the average time from inquiry to signed contract. Agents spend less time on paperwork and more time building relationships that drive referrals.",
        },
        {
            title: "Maximize Occupancy & Rental Income",
            description:
                "Proactive lease-expiration alerts, automated renewal reminders, and vacancy dashboards help you keep occupancy rates high. Rent escalation tracking ensures you capture every contractual increase without manual follow-up.",
        },
        {
            title: "Eliminate Commission Errors",
            description:
                "Automatic commission calculations based on configurable split structures remove spreadsheet guesswork and payment disputes. Agents see real-time earnings, and finance teams process payouts with a single click.",
        },
        {
            title: "Deliver Outstanding Client Experiences",
            description:
                "Self-service portals for tenants and buyers, virtual tour integrations, and timely communication keep every stakeholder informed and engaged. Higher satisfaction translates directly into renewals, referrals, and positive reviews.",
        },
        {
            title: "Gain Portfolio-Wide Visibility",
            description:
                "Real-time dashboards consolidate occupancy rates, revenue per property, maintenance spend, and pipeline value into a single view. Make data-driven decisions about acquisitions, dispositions, and capital improvements with full financial clarity.",
        },
        {
            title: "Scale Without Adding Headcount",
            description:
                "Automation across listings, lease management, inspections, and accounting means your team handles a growing portfolio without proportional staff increases. Standardized workflows ensure consistency whether you manage ten units or ten thousand.",
        },
    ],
    steps: [
        {
            step: "1",
            title: "Portfolio & Workflow Discovery",
            description:
                "Our real estate specialists map your property portfolio, transaction workflows, commission structures, and integration needs. We design a tailored configuration plan that mirrors how your brokerage or property management company actually operates — no generic templates.",
        },
        {
            step: "2",
            title: "Data Migration & System Setup",
            description:
                "We import your existing property listings, tenant records, lease agreements, and financial history into CubicleERP with full data validation. Your team receives role-specific training — agents learn the deal pipeline, property managers master lease tracking, and leadership gets fluent in analytics dashboards.",
        },
        {
            step: "3",
            title: "Launch & Continuous Optimization",
            description:
                "A phased go-live ensures zero disruption to active deals and tenant operations. Post-launch, our team monitors adoption metrics, fine-tunes automation rules, and delivers quarterly reviews to help you unlock new efficiencies as your portfolio evolves.",
        },
    ],
    useCases: [
        {
            title: "Residential Brokerages",
            description:
                "Fast-moving residential brokerages use CubicleERP to manage hundreds of active listings, match buyers instantly, and close transactions with digital contracts — all while keeping commission accounting error-free.",
            highlights: [
                "Automated buyer-property matching with smart scoring",
                "Digital contract signing that cuts closing time by days",
                "Real-time commission dashboards for agents and brokers",
            ],
        },
        {
            title: "Commercial Property Managers",
            description:
                "Commercial property managers rely on CubicleERP to handle complex multi-tenant leases, schedule inspections across large portfolios, and maintain full financial visibility from individual units to the entire portfolio.",
            highlights: [
                "Multi-tenant lease tracking with CAM and escalation clauses",
                "Inspection scheduling with automated deficiency workflows",
                "Portfolio-wide occupancy and revenue analytics",
            ],
        },
        {
            title: "Real Estate Developers",
            description:
                "Developers use CubicleERP to market new projects, track buyer interest from launch events through unit selection and final sale, and manage post-handover warranty and maintenance obligations.",
            highlights: [
                "Project inventory management with unit-level status tracking",
                "Buyer journey pipeline from expression of interest to handover",
                "Post-sale warranty and snagging management",
            ],
        },
    ],
    faqs: [
        {
            question:
                "Can CubicleERP handle both sales and rental workflows in one system?",
            answer: "Absolutely. CubicleERP provides separate but interconnected pipelines for sales transactions and rental/lease management. Agents can track a property sale from listing to closing on one board while property managers handle tenant onboarding, rent collection, and lease renewals on another — all sharing the same property and contact database so nothing is duplicated.",
        },
        {
            question:
                "How does the commission calculation work for complex split structures?",
            answer: "You define commission rules at the brokerage, team, or individual agent level — including percentage splits, flat fees, tiered structures, and referral bonuses. When a deal closes, CubicleERP automatically calculates each party's share, generates payout summaries, and feeds the amounts into your accounting module. Rules can be adjusted per transaction if a deal has a unique arrangement.",
        },
        {
            question:
                "Does CubicleERP integrate with property listing portals and MLS systems?",
            answer: "Yes. CubicleERP supports integrations with major property portals and MLS feeds so your listings publish automatically and inquiries flow back into your pipeline without manual data entry. We also offer an open API for custom integrations with regional or niche listing platforms your market relies on.",
        },
        {
            question:
                "How does the tenant self-service portal work?",
            answer: "Tenants receive secure login credentials to a branded portal where they can view lease details, submit and track maintenance requests, make rent payments online, and download statements. Maintenance requests are automatically routed to the assigned property manager and can trigger vendor work orders. This reduces phone calls and emails while giving tenants 24/7 access to the information they need.",
        },
        {
            question:
                "Can we manage property inspections and attach reports to listings?",
            answer: "Yes. You can schedule inspections directly from any property record, assign inspectors, and use customizable checklists with photo and note fields. Completed inspection reports are stored in the property's document repository and can be shared with prospective buyers or flagged for maintenance follow-up. Recurring inspection schedules can also be set for regulatory or internal compliance requirements.",
        },
    ],
    stats: [
        { value: "2,500+", label: "Properties managed on platform" },
        { value: "40%", label: "Faster deal closing time" },
        { value: "98%", label: "Rent collection rate" },
        { value: "60%", label: "Reduction in admin workload" },
    ],
}

export default function RealEstatePage() {
    return <ExploreProductPage data={data} />
}
