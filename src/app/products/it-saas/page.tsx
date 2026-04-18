"use client"

import ExploreProductPage from "@/components/landingpage2/explore/ExploreProductPage"
import {
    Laptop,
    Ticket,
    Clock,
    CreditCard,
    UserCheck,
    BarChart3,
    Server,
} from "lucide-react"

const data = {
    name: "IT & SaaS",
    tagline: "Unified operations platform for modern tech companies",
    description:
        "CubicleERP IT & SaaS empowers software companies, managed service providers, and cloud-native startups to deliver exceptional customer experiences at scale. From ticket management and SLA enforcement to subscription billing, customer onboarding, usage analytics, and infrastructure monitoring, every critical workflow lives in one intelligent platform built for the speed and complexity of tech operations.",
    icon: Laptop,
    color: "#BE185D",
    lightColor: "#FCE7F3",
    heroImage:
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1920&q=80",
    variant: 4 as const,
    features: [
        {
            icon: Ticket,
            title: "Ticket & Incident Management",
            description:
                "Centralize every customer request, bug report, and internal incident into a single prioritized queue with intelligent routing and automatic categorization. SLA timers start the moment a ticket is created, with configurable escalation paths that alert the right team members before deadlines are breached. Multi-channel intake from email, chat, API webhooks, and a self-service portal ensures no issue falls through the cracks.",
        },
        {
            icon: Clock,
            title: "SLA Tracking & Compliance",
            description:
                "Define granular service-level agreements per customer tier, product line, or contract and monitor adherence in real time with color-coded dashboards. Automated alerts notify agents and managers when response or resolution windows are at risk, while built-in remediation workflows trigger corrective actions instantly. Generate audit-ready SLA compliance reports that can be shared directly with stakeholders during quarterly business reviews.",
        },
        {
            icon: CreditCard,
            title: "Subscription Billing & Revenue",
            description:
                "Handle the full billing lifecycle for SaaS products, including plan creation, trial management, proration, upgrades, downgrades, and cancellations without leaving CubicleERP. Support usage-based metering, seat-based pricing, and hybrid models with automated invoice generation and payment collection through integrated gateways. Revenue recognition rules align with ASC 606 standards, giving your finance team accurate MRR, ARR, and churn metrics at a glance.",
        },
        {
            icon: UserCheck,
            title: "Customer Onboarding & Success",
            description:
                "Orchestrate structured onboarding journeys with task checklists, milestone tracking, and automated welcome sequences that guide new customers from sign-up to first value. Health scores aggregate product usage, support interactions, and billing signals so customer success managers can proactively intervene before churn risk escalates. Built-in playbooks for expansion, renewal, and at-risk scenarios ensure consistent outcomes across your entire book of business.",
        },
        {
            icon: BarChart3,
            title: "Usage Analytics & Insights",
            description:
                "Track feature adoption, session frequency, API call volumes, and storage consumption across your user base with granular cohort and account-level breakdowns. Interactive dashboards surface trends like declining engagement or spike patterns that inform product roadmap decisions and upsell opportunities. Export data to your warehouse or consume it via API to power custom reports, machine-learning models, and executive dashboards.",
        },
        {
            icon: Server,
            title: "Infrastructure Monitoring & Alerts",
            description:
                "Monitor server health, container orchestration, database performance, and network latency from a unified control plane integrated with tools like Prometheus, Datadog, and CloudWatch. Anomaly detection and threshold-based alerting automatically create incidents, page on-call engineers, and kick off runbook automations to minimize mean time to resolution. Post-incident timelines with root-cause tagging feed continuous improvement processes and help teams prevent recurrence.",
        },
    ],
    benefits: [
        {
            title: "Resolve Issues Faster",
            description:
                "Intelligent ticket routing, SLA enforcement, and automated escalations cut average resolution time by up to 45%. Your support team spends less time triaging and more time solving, leading to happier customers and lower churn.",
        },
        {
            title: "Maximize Recurring Revenue",
            description:
                "Automated subscription billing, dunning management, and renewal reminders eliminate revenue leakage and reduce involuntary churn. Accurate MRR and ARR dashboards give leadership real-time visibility into financial health.",
        },
        {
            title: "Scale Without Proportional Headcount",
            description:
                "Self-service portals, knowledge bases, and workflow automations deflect routine inquiries and tasks so your team can support a growing customer base without linearly increasing staff. Companies on CubicleERP handle 3x more tickets per agent on average.",
        },
        {
            title: "Improve Customer Retention",
            description:
                "Proactive health scoring and success playbooks identify at-risk accounts early and trigger intervention workflows automatically. Structured onboarding ensures customers reach value milestones quickly, strengthening long-term loyalty.",
        },
        {
            title: "Gain Actionable Product Insights",
            description:
                "Usage analytics reveal which features drive engagement and which are underutilized, informing roadmap prioritization and pricing strategy. Data-driven decisions replace guesswork, accelerating product-market fit and expansion revenue.",
        },
        {
            title: "Ensure Uptime & Reliability",
            description:
                "Integrated infrastructure monitoring with automated incident creation and runbook execution keeps your services running smoothly. Post-incident analysis and trend reporting drive continuous reliability improvements and build customer trust.",
        },
    ],
    steps: [
        {
            step: "1",
            title: "Discovery & Architecture",
            description:
                "Our IT solutions team audits your current support workflows, billing systems, monitoring stack, and customer success processes. We map data flows, identify automation opportunities, and design a tailored CubicleERP configuration that aligns with your tech operations and growth targets.",
        },
        {
            step: "2",
            title: "Integration & Migration",
            description:
                "We connect CubicleERP to your existing tools -- monitoring platforms, payment gateways, communication channels, and CI/CD pipelines. Historical tickets, customer records, and billing data are migrated cleanly, and your team is trained on every module with role-specific workshops.",
        },
        {
            step: "3",
            title: "Launch & Continuous Improvement",
            description:
                "A phased rollout begins with your support and billing teams, expanding to customer success and engineering operations. Post-launch, our customer success managers review KPIs weekly, tune automations, and recommend optimizations so your platform evolves alongside your business.",
        },
    ],
    useCases: [
        {
            title: "B2B SaaS Companies",
            description:
                "Product-led and sales-led SaaS companies use CubicleERP to unify support, billing, and customer success on a single platform -- reducing tool sprawl and giving every team a shared view of the customer lifecycle.",
            highlights: [
                "Subscription billing with usage metering and proration",
                "Customer health scores and renewal playbooks",
                "Feature adoption analytics tied to account revenue",
            ],
        },
        {
            title: "Managed Service Providers",
            description:
                "MSPs and IT outsourcing firms rely on CubicleERP to manage multi-tenant ticket queues, enforce per-client SLAs, track infrastructure across customer environments, and generate transparent service reports.",
            highlights: [
                "Multi-tenant ticketing with per-client SLA rules",
                "Infrastructure monitoring across customer environments",
                "Automated service billing and compliance reporting",
            ],
        },
        {
            title: "Developer Platform Companies",
            description:
                "API-first and developer-tool companies leverage CubicleERP to monitor API usage, manage developer onboarding, track release rollouts, and maintain comprehensive knowledge bases that reduce support burden.",
            highlights: [
                "API call tracking and rate-limit management",
                "Release management with rollout status dashboards",
                "Developer-facing knowledge base and changelog automation",
            ],
        },
    ],
    faqs: [
        {
            question:
                "How does CubicleERP handle usage-based and hybrid billing models?",
            answer: "CubicleERP supports flat-rate, per-seat, usage-based, tiered, and hybrid pricing models out of the box. You define metering events -- such as API calls, storage consumed, or active users -- and the platform aggregates them in real time against each customer's plan. Invoices are generated automatically at the end of each billing cycle with detailed line items, and customers can view their consumption dashboards in the self-service portal.",
        },
        {
            question:
                "Can CubicleERP integrate with our existing monitoring and DevOps tools?",
            answer: "Yes. CubicleERP offers native integrations with Datadog, Prometheus, Grafana, New Relic, PagerDuty, AWS CloudWatch, and Azure Monitor, among others. For tools without a native connector, our webhook and REST API framework lets you push alerts directly into the incident management module. CI/CD integrations with GitHub Actions, GitLab CI, and Jenkins enable release tracking and automated status updates.",
        },
        {
            question:
                "How does the customer health score work?",
            answer: "The health score is a composite metric calculated from product usage frequency, support ticket volume and sentiment, billing status, onboarding milestone completion, and NPS or CSAT survey responses. Each signal is weighted based on your business priorities, and the score updates daily. When a score drops below a configurable threshold, CubicleERP automatically triggers a success playbook -- such as scheduling a check-in call or sending a re-engagement campaign.",
        },
        {
            question:
                "Is CubicleERP suitable for multi-tenant SaaS operations?",
            answer: "Absolutely. CubicleERP provides full multi-tenancy with isolated data, separate branding for customer portals, per-tenant SLA configurations, and individual billing profiles. Role-based access control ensures that agents only see the tenants assigned to them, while administrators get a consolidated view across all accounts for reporting and capacity planning.",
        },
        {
            question:
                "What kind of knowledge base and self-service capabilities are included?",
            answer: "CubicleERP includes a full-featured knowledge base with rich-text articles, versioning, category organization, and full-text search. Articles can be internal-only or customer-facing, and the platform tracks which articles deflect the most tickets. The self-service portal lets customers create and track tickets, view billing history, access documentation, and participate in community forums -- all branded to match your product.",
        },
    ],
    stats: [
        { value: "500+", label: "Tech companies served" },
        { value: "2M+", label: "Tickets resolved monthly" },
        { value: "45%", label: "Faster resolution times" },
        { value: "99.99%", label: "Platform uptime SLA" },
    ],
    capabilities: [
        {
            title: "Revenue Operations & Subscription Intelligence",
            description:
                "Unify billing, revenue recognition, and financial analytics into a single revenue operations engine that gives finance and leadership teams real-time visibility into MRR movements, cohort performance, and unit economics.",
            keyPoints: [
                "Real-time MRR waterfall analysis showing new, expansion, contraction, and churned revenue",
                "Cohort-based retention and expansion analytics by acquisition channel and plan tier",
                "Revenue recognition automation compliant with ASC 606 and IFRS 15 standards",
                "Dunning management with smart retry logic and pre-dunning engagement workflows",
            ],
        },
        {
            title: "Customer Lifecycle Orchestration",
            description:
                "Map and automate the entire customer journey from trial sign-up through onboarding, adoption, renewal, and expansion with data-driven playbooks that ensure consistent outcomes at every stage.",
            keyPoints: [
                "Automated onboarding sequences triggered by sign-up events with milestone tracking",
                "Product adoption scoring based on feature usage depth and frequency",
                "Renewal risk detection with automated CSM alerts and intervention playbooks",
                "Expansion opportunity identification using usage patterns and firmographic signals",
            ],
        },
        {
            title: "Incident Response & Reliability Engineering",
            description:
                "Build a culture of operational excellence with structured incident management workflows, automated runbooks, and blameless post-incident analysis that continuously improve your service reliability.",
            keyPoints: [
                "Automated incident detection from monitoring alerts with severity classification",
                "On-call rotation management with PagerDuty and Opsgenie integration",
                "Runbook automation for common remediation steps like service restarts and scaling",
                "Post-incident review templates with action item tracking and SLO impact analysis",
            ],
        },
        {
            title: "Product Analytics & Feature Adoption",
            description:
                "Understand how customers interact with your product at a granular level to inform roadmap decisions, identify churn signals, and discover upsell opportunities hidden in usage data.",
            keyPoints: [
                "Feature-level adoption funnels showing activation, engagement, and retention rates",
                "Account-level usage dashboards correlating product engagement with revenue outcomes",
                "Churn prediction models trained on behavioral signals and support interactions",
            ],
        },
    ],
    integrations: [
        { name: "Stripe", category: "Billing & Payments" },
        { name: "PagerDuty", category: "Incident Management" },
        { name: "Datadog", category: "Monitoring" },
        { name: "Slack", category: "Communication" },
        { name: "Jira", category: "Project Management" },
        { name: "GitHub", category: "Version Control" },
        { name: "Salesforce", category: "CRM" },
        { name: "Intercom", category: "Customer Messaging" },
        { name: "Segment", category: "Customer Data Platform" },
        { name: "AWS CloudWatch", category: "Cloud Monitoring" },
        { name: "Zendesk", category: "Support" },
        { name: "HubSpot", category: "Marketing" },
    ],
    testimonials: [
        {
            quote: "We consolidated five separate tools — ticketing, billing, monitoring, customer success, and analytics — into CubicleERP. Our team finally has a single view of each customer, and our average resolution time dropped by nearly half.",
            author: "Jason Park",
            role: "VP of Customer Operations",
            company: "CloudSync Technologies",
            metric: "45% faster ticket resolution",
        },
        {
            quote: "The subscription billing module handled our migration from flat-rate to usage-based pricing seamlessly. We were terrified of billing errors during the transition, but CubicleERP processed over 10,000 invoices in the first month without a single discrepancy.",
            author: "Samantha Webb",
            role: "Director of Finance",
            company: "DataPipe Analytics",
            metric: "Zero billing errors during pricing migration",
        },
        {
            quote: "Customer health scores changed the way our success team operates. Instead of reacting to cancellation requests, we now proactively reach out to at-risk accounts weeks in advance. Our net revenue retention went from 97% to 112% in two quarters.",
            author: "Raj Krishnamurthy",
            role: "Head of Customer Success",
            company: "FormStack SaaS",
            metric: "112% net revenue retention",
        },
    ],
    comparisons: [
        { feature: "Ticket Management", traditional: "Shared email inbox", cubicleErp: "Intelligent routing & SLA" },
        { feature: "Subscription Billing", traditional: "Manual invoicing", cubicleErp: "Automated, usage-based" },
        { feature: "Customer Health", traditional: "Gut feeling", cubicleErp: "Data-driven health scores" },
        { feature: "Incident Response", traditional: "Ad-hoc Slack threads", cubicleErp: "Structured workflows" },
        { feature: "Usage Analytics", traditional: "Custom SQL queries", cubicleErp: "Built-in dashboards" },
        { feature: "Revenue Metrics", traditional: "Spreadsheet models", cubicleErp: "Real-time MRR/ARR" },
    ],
    subNavItems: [
        { label: "Overview", sectionId: "hero" },
        { label: "Features", sectionId: "features" },
        { label: "Capabilities", sectionId: "capabilities" },
        { label: "Benefits", sectionId: "benefits" },
        { label: "Integrations", sectionId: "integrations" },
        { label: "How It Works", sectionId: "how-it-works" },
        { label: "Use Cases", sectionId: "use-cases" },
        { label: "FAQs", sectionId: "faqs" },
        { label: "Startups", href: "/products/startups" },
        { label: "Enterprise", href: "/products/enterprise" },
        { label: "Agencies", href: "/products/agencies" },
    ],
}

export default function ITSaaSPage() {
    return <ExploreProductPage data={data} />
}
