"use client"

import ExploreProductPage from "@/components/landingpage2/explore/ExploreProductPage"
import {
    Laptop,
    Zap,
    Users,
    BarChart3,
    Shield,
    Workflow,
} from "lucide-react"

const data = {
    name: "IT & SaaS",
    tagline: "Operations & support platform for tech companies",
    description:
        "CubicleERP IT & SaaS is purpose-built for software companies, IT service providers, and tech startups. Manage customer support, track incidents, automate IT operations, monitor system performance, and streamline billing with integrated ticketing, knowledge management, asset tracking, and comprehensive analytics designed for modern tech operations.",
    icon: Laptop,
    color: "#0891B2",
    lightColor: "#ECFDF5",
    heroImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80",
    features: [
        {
            icon: Zap,
            title: "Incident & Ticket Management",
            description:
                "Centralized ticketing system for all customer support requests and internal IT incidents. Automated ticket routing based on priority and expertise. SLA tracking and escalation management. Multi-channel ticket creation via email, chat, and web portal.",
        },
        {
            icon: Users,
            title: "Customer Support Portal",
            description:
                "Self-service customer portal for ticket creation, status tracking, and knowledge base access. Reduce support volume with comprehensive knowledge base and FAQs. Customer satisfaction surveys and feedback collection. Community forums for peer-to-peer support.",
        },
        {
            icon: Workflow,
            title: "IT Operations Automation",
            description:
                "Automate routine IT tasks and workflows. Automated incident response and remediation. Integration with monitoring tools for proactive alerting. Workflow automation reduces manual work and improves response times.",
        },
        {
            icon: BarChart3,
            title: "Asset & License Management",
            description:
                "Track software licenses, hardware assets, and subscriptions. Automated license renewal reminders and compliance tracking. Asset lifecycle management from procurement to retirement. Cost optimization through license utilization analysis.",
        },
        {
            icon: Shield,
            title: "Performance Monitoring & Analytics",
            description:
                "Monitor system performance, uptime, and user experience. Track key metrics like MTTR, MTTF, and customer satisfaction. Generate performance reports and trend analysis. Identify bottlenecks and optimization opportunities.",
        },
        {
            icon: Workflow,
            title: "Billing & Revenue Management",
            description:
                "Integrated billing for SaaS subscriptions and support services. Usage-based billing and metered pricing support. Automated invoicing and payment processing. Revenue recognition and financial reporting.",
        },
    ],
    benefits: [
        {
            title: "Improve Customer Support Quality",
            description:
                "Faster response times and better issue resolution with organized ticketing. Self-service options reduce support volume. Comprehensive knowledge base empowers customers. Increase customer satisfaction and retention.",
        },
        {
            title: "Reduce Operational Overhead",
            description:
                "Automate routine IT tasks and support workflows. Reduce manual work and human error. Improve team efficiency and productivity. Tech companies using CubicleERP see an average 30% reduction in support costs.",
        },
        {
            title: "Enhance System Reliability",
            description:
                "Proactive monitoring and alerting prevent issues before they impact customers. Automated incident response reduces downtime. Comprehensive audit trails for compliance and troubleshooting.",
        },
        {
            title: "Streamline Operations",
            description:
                "Unified platform for support, IT operations, asset management, and billing. Eliminate data silos and manual processes. Improve team collaboration and communication.",
        },
        {
            title: "Optimize Costs",
            description:
                "License and asset management reduces unnecessary spending. Usage analytics identify optimization opportunities. Automated billing reduces revenue leakage.",
        },
        {
            title: "Scale Your Business",
            description:
                "Support growing customer base without proportional increase in support staff. Automated workflows scale with your business. Platform grows with your company.",
        },
    ],
    steps: [
        {
            step: "1",
            title: "IT Operations Assessment",
            description:
                "Our IT specialists conduct a thorough assessment of your support processes, IT operations, system architecture, and business requirements. We create a customized implementation plan aligned with your tech operations needs.",
        },
        {
            step: "2",
            title: "Configuration & Integration",
            description:
                "We configure CubicleERP for your IT workflows, integrate with monitoring tools and communication platforms, migrate existing ticket and asset data, and set up automation rules. Your team receives comprehensive training on all features.",
        },
        {
            step: "3",
            title: "Launch & Optimization",
            description:
                "We conduct thorough testing and quality assurance before launch. Phased rollout ensures smooth transition. Ongoing support and optimization to maximize adoption and operational efficiency.",
        },
    ],
    useCases: [
        {
            title: "SaaS Companies",
            description:
                "SaaS companies use CubicleERP to manage customer support, track system performance, automate operations, and handle billing for their cloud services.",
            highlights: [
                "Customer support ticketing and portal",
                "System performance monitoring",
                "Automated SaaS billing",
            ],
        },
        {
            title: "IT Service Providers",
            description:
                "MSPs and IT service providers use CubicleERP to manage customer incidents, track assets, automate IT operations, and bill for services.",
            highlights: [
                "Multi-customer ticket management",
                "Asset tracking and management",
                "Service-based billing",
            ],
        },
        {
            title: "Tech Startups",
            description:
                "Tech startups use CubicleERP to manage customer support, automate operations, and scale their business without hiring large support teams.",
            highlights: [
                "Scalable support infrastructure",
                "Automated IT operations",
                "Cost-effective customer support",
            ],
        },
    ],
    faqs: [
        {
            question: "What monitoring tools does CubicleERP integrate with?",
            answer:
                "CubicleERP integrates with popular monitoring tools like Datadog, New Relic, Prometheus, and others. We also support generic integrations via webhooks and REST APIs. Our integration team can help you connect your existing monitoring stack.",
        },
        {
            question: "Can CubicleERP handle multi-tenant support?",
            answer:
                "Yes. CubicleERP supports multi-tenant operations with separate ticket queues, knowledge bases, and billing for each customer. Manage multiple customers from a single platform with complete isolation.",
        },
        {
            question: "How does CubicleERP track SLAs?",
            answer:
                "CubicleERP automatically tracks SLA compliance for each ticket based on priority and customer tier. Automated escalation alerts when SLAs are at risk. Generate SLA compliance reports for customer reviews.",
        },
        {
            question: "Can customers access their own tickets?",
            answer:
                "Yes. CubicleERP includes a customer portal where customers can create tickets, track status, view knowledge base articles, and communicate with support. This reduces support volume and improves customer satisfaction.",
        },
        {
            question: "Does CubicleERP support automation workflows?",
            answer:
                "Yes. CubicleERP includes powerful workflow automation for ticket routing, incident response, and IT operations. Create custom workflows based on ticket properties, customer tier, or system alerts.",
        },
    ],
    stats: [
        { value: "400+", label: "Tech companies" },
        { value: "1M+", label: "Tickets managed monthly" },
        { value: "30%", label: "Cost reduction average" },
        { value: "99.99%", label: "Platform uptime SLA" },
    ],
}

export default function ITSaaSPage() {
    return <ExploreProductPage data={data} />
}
