"use client"

import ExploreProductPage from "@/components/landingpage2/explore/ExploreProductPage"
import {
    Scale,
    UserCheck,
    FileText,
    Timer,
    CalendarClock,
    ShieldCheck,
} from "lucide-react"

const data = {
    name: "Legal",
    tagline: "Intelligent practice management for modern law firms",
    description:
        "CubicleERP Legal is a comprehensive practice management platform built for law firms, corporate legal departments, and legal service providers. From client intake and case management to trust accounting and court deadline tracking, every aspect of legal operations is unified in one secure, intelligent system. Whether you run a solo practice or manage a multi-office firm with dozens of practice areas, CubicleERP Legal helps you deliver exceptional client service while maximizing profitability and maintaining full regulatory compliance.",
    icon: Scale,
    color: "#0891B2",
    lightColor: "#CFFAFE",
    heroImage:
        "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=1920&q=80",
    variant: 1 as const,
    features: [
        {
            icon: Scale,
            title: "Case & Matter Management",
            description:
                "Organize every matter with structured workflows, linked documents, task assignments, and real-time status dashboards. Each case file maintains a complete chronological history of pleadings, correspondence, and internal notes so nothing is ever lost. Cross-reference related matters instantly and use custom fields to capture practice-area-specific data such as jurisdiction, case type, and opposing counsel.",
        },
        {
            icon: UserCheck,
            title: "Client Intake & Conflict Checking",
            description:
                "Streamline new client onboarding with customizable intake forms, automated engagement letter generation, and built-in conflict-of-interest screening. The conflict engine searches across all historical clients, adverse parties, and related entities to flag potential ethical issues before you open a matter. Intake data flows directly into the CRM and billing modules, eliminating duplicate entry and ensuring every relationship is captured from day one.",
        },
        {
            icon: FileText,
            title: "Document Automation & Assembly",
            description:
                "Generate contracts, pleadings, discovery responses, and client letters in seconds using clause libraries and merge-field templates. Version control tracks every revision with full audit trails, and built-in e-signature support lets clients execute documents without leaving the platform. Optical character recognition indexes scanned documents so they become fully searchable alongside your digital files.",
        },
        {
            icon: Timer,
            title: "Billing & Time Tracking",
            description:
                "Capture every billable minute with desktop timers, mobile time entry, and calendar-based reconstruction for forgotten entries. The billing engine supports hourly, flat-fee, contingency, blended-rate, and hybrid arrangements, automatically applying the correct rate schedule per attorney, matter, or client. Pre-bill editing, LEDES e-billing export, and online payment acceptance accelerate the invoice-to-cash cycle and improve realization rates.",
        },
        {
            icon: CalendarClock,
            title: "Court Deadline & Calendar Management",
            description:
                "Automatically calculate filing deadlines, statutes of limitation, and response windows based on jurisdiction-specific court rules. Cascading reminders notify responsible attorneys and support staff at configurable intervals so critical dates are never missed. A unified firm calendar aggregates court appearances, depositions, mediations, and internal meetings in one view, with Outlook and Google Calendar synchronization.",
        },
        {
            icon: ShieldCheck,
            title: "Trust Accounting & Compliance",
            description:
                "Maintain IOLTA and client trust accounts with ledger-level accuracy, three-way reconciliation, and automated compliance reporting required by state bar associations. Every deposit, disbursement, and transfer is logged with a tamper-proof audit trail to satisfy regulatory examinations. Built-in ethical walls, privilege tagging, and retention policies help your firm meet its professional obligations and reduce malpractice exposure.",
        },
    ],
    benefits: [
        {
            title: "Recover More Billable Time",
            description:
                "Passive time capture and intelligent timer suggestions ensure attorneys record every billable minute. Firms typically see a 15-25% increase in captured time within the first quarter of adoption.",
        },
        {
            title: "Eliminate Missed Deadlines",
            description:
                "Automated rules-based calendaring removes the risk of human error in deadline calculation. Cascading alerts and team-level visibility mean critical dates are always covered, even when attorneys are out of office.",
        },
        {
            title: "Accelerate Client Onboarding",
            description:
                "Digital intake forms, instant conflict checks, and auto-generated engagement letters cut new-matter setup time from days to minutes, letting your team start working sooner.",
        },
        {
            title: "Strengthen Regulatory Compliance",
            description:
                "Built-in trust accounting reconciliation, ethical screening, and document retention policies keep your firm aligned with bar association rules and reduce the risk of disciplinary action.",
        },
        {
            title: "Gain Firm-Wide Financial Clarity",
            description:
                "Real-time dashboards show revenue, realization rates, accounts receivable aging, and profitability by attorney, practice area, or client, empowering data-driven management decisions.",
        },
        {
            title: "Scale Without Adding Overhead",
            description:
                "Workflow automation and self-service client portals handle growing caseloads without proportional increases in administrative staff, improving margins as your firm expands.",
        },
    ],
    steps: [
        {
            step: "1",
            title: "Practice & Workflow Assessment",
            description:
                "Our legal technology consultants audit your current practice areas, billing models, document workflows, and compliance requirements. We map every process to CubicleERP capabilities and produce a phased implementation roadmap tailored to your firm.",
        },
        {
            step: "2",
            title: "Configuration, Migration & Training",
            description:
                "We configure matter templates, billing rate schedules, court-rule calendaring engines, and trust accounts to match your firm's needs. Existing case data, client records, and financial history are migrated with full validation, and your team receives role-based training for attorneys, paralegals, and administrators.",
        },
        {
            step: "3",
            title: "Go-Live & Continuous Optimization",
            description:
                "A parallel-run period ensures data integrity before full cutover. Post-launch, our support team monitors adoption metrics, fine-tunes workflows, and delivers quarterly business reviews to help your firm continuously improve efficiency and profitability.",
        },
    ],
    useCases: [
        {
            title: "Mid-Size & Large Law Firms",
            description:
                "Multi-practice firms use CubicleERP to unify case management, billing, and reporting across offices while preserving practice-area-specific workflows and rate structures.",
            highlights: [
                "Centralized matter management with practice-area customization",
                "Consolidated billing, trust accounting, and partner compensation analytics",
                "Firm-wide conflict checking across all offices and historical matters",
            ],
        },
        {
            title: "Solo Practitioners & Small Firms",
            description:
                "Solo and small-firm attorneys rely on CubicleERP to handle administrative tasks automatically so they can focus on practicing law and growing their client base.",
            highlights: [
                "One-click time entry and automated invoice generation",
                "Built-in court deadline calendaring without manual rule lookup",
                "Client portal for document sharing, payments, and appointment scheduling",
            ],
        },
        {
            title: "Corporate Legal Departments",
            description:
                "In-house legal teams use CubicleERP to manage internal matters, control outside counsel spend, and demonstrate the department's value to executive leadership.",
            highlights: [
                "Matter intake workflows with business-unit chargeback tracking",
                "Outside counsel budget management and e-billing review",
                "Compliance dashboards for contract obligations and regulatory filings",
            ],
        },
    ],
    faqs: [
        {
            question:
                "Does CubicleERP support different billing arrangements beyond hourly rates?",
            answer: "Absolutely. The billing engine handles hourly, flat-fee, contingency, retainer-based, blended-rate, and hybrid arrangements out of the box. You can assign different rate schedules per attorney, practice area, or individual client, and the system automatically applies the correct structure when generating pre-bills. Split-billing across multiple responsible parties is also supported.",
        },
        {
            question:
                "How does the court deadline engine work across different jurisdictions?",
            answer: "CubicleERP ships with a rules library covering federal and state court systems. When you enter a trigger event such as a complaint filing date, the engine automatically calculates all downstream deadlines, including answer due dates, discovery cutoffs, and motion deadlines, adjusted for holidays and weekends per local rules. You can also create custom rule sets for administrative agencies or arbitration bodies.",
        },
        {
            question:
                "Can we migrate data from our existing practice management software?",
            answer: "Yes. We provide certified migration paths from widely used platforms including Clio, PracticePanther, MyCase, and legacy systems like PCLaw and Tabs3. Our migration team extracts matter data, client records, billing history, documents, and calendar entries, then validates every record before go-live to ensure nothing is lost in transition.",
        },
        {
            question:
                "How does CubicleERP protect attorney-client privileged information?",
            answer: "The platform enforces role-based access controls, ethical walls between matter teams, and privilege tags on documents and communications. All access to privileged content is logged in a tamper-proof audit trail. Data is encrypted at rest and in transit using AES-256 and TLS 1.3, and the system supports single sign-on with multi-factor authentication for an additional layer of security.",
        },
        {
            question:
                "Does CubicleERP integrate with legal research platforms and e-filing systems?",
            answer: "Yes. Native integrations are available for LexisNexis, Westlaw, and Fastcase, allowing attorneys to link research results directly to matters. The platform also connects with major e-filing portals and LEDES-compliant e-billing systems. For additional tools, an open REST API and pre-built Zapier connectors make it straightforward to extend the ecosystem without custom development.",
        },
    ],
    stats: [
        { value: "500+", label: "Law firms using CubicleERP" },
        { value: "35%", label: "Average increase in collected revenue" },
        { value: "Zero", label: "Missed court deadlines reported" },
        { value: "99.9%", label: "Platform uptime guaranteed" },
    ],
    capabilities: [
        {
            title: "Intelligent Legal Research & Knowledge Management",
            description:
                "Centralize your firm's collective knowledge — precedent briefs, clause libraries, research memos, and institutional expertise — into a searchable repository that accelerates legal work and reduces duplication of effort across practice groups.",
            keyPoints: [
                "Full-text search across all documents, emails, and case notes with Boolean and proximity operators",
                "AI-assisted research suggestions based on matter type, jurisdiction, and legal issues",
                "Precedent bank with clause-level tagging for rapid brief and contract assembly",
                "Knowledge contribution workflows that capture attorney insights during matter closure",
            ],
        },
        {
            title: "Advanced Litigation Management",
            description:
                "Manage complex litigation matters with specialized tools for discovery tracking, deposition scheduling, exhibit management, and trial preparation that keep large legal teams coordinated under tight deadlines.",
            keyPoints: [
                "Discovery request and response tracking with privilege log generation",
                "Deposition scheduling with witness preparation checklists and transcript indexing",
                "Trial preparation boards with exhibit organization and timeline visualization",
                "Litigation hold management with automated custodian notifications and compliance tracking",
            ],
        },
        {
            title: "Client Portal & Self-Service",
            description:
                "Empower clients with a branded, secure portal where they can view matter status, access shared documents, approve invoices, and communicate with their legal team without phone calls or email chains.",
            keyPoints: [
                "Real-time matter status dashboards accessible 24/7 from any device",
                "Secure document sharing with granular permission controls and download tracking",
                "Online invoice review, approval, and payment processing",
                "Appointment scheduling and secure messaging with read-receipt confirmation",
            ],
        },
        {
            title: "Firm Performance & Profitability Analytics",
            description:
                "Gain deep insight into your firm's financial health with analytics that go beyond standard billing reports to reveal profitability drivers, utilization patterns, and growth opportunities across every dimension of your practice.",
            keyPoints: [
                "Attorney utilization and realization rate analysis by practice area and seniority",
                "Matter profitability scoring with cost-to-revenue breakdown",
                "Client concentration and revenue diversity risk assessment",
            ],
        },
    ],
    integrations: [
        { name: "Microsoft 365", category: "Productivity" },
        { name: "Google Workspace", category: "Productivity" },
        { name: "LexisNexis", category: "Legal Research" },
        { name: "Westlaw", category: "Legal Research" },
        { name: "DocuSign", category: "E-Signature" },
        { name: "QuickBooks", category: "Accounting" },
        { name: "Clio", category: "Practice Management" },
        { name: "NetDocuments", category: "Document Management" },
        { name: "Slack", category: "Communication" },
        { name: "Zoom", category: "Video Conferencing" },
        { name: "LawPay", category: "Legal Payments" },
        { name: "Zapier", category: "Workflow Automation" },
    ],
    testimonials: [
        {
            quote: "Since adopting CubicleERP, our firm has not missed a single court deadline. The rules-based calendaring engine automatically calculates every downstream date and the cascading reminders give us complete peace of mind across all jurisdictions.",
            author: "Katherine Reynolds",
            role: "Managing Partner",
            company: "Reynolds & Associates LLP",
            metric: "Zero missed deadlines in 18 months",
        },
        {
            quote: "Our collected revenue increased by over 30% in the first year because attorneys finally capture all their billable time. The passive time tracking and mobile entry tools eliminated the end-of-day guesswork that was costing us thousands each month.",
            author: "Michael Torres",
            role: "Director of Finance",
            company: "Meridian Legal Group",
            metric: "32% increase in collected revenue",
        },
        {
            quote: "Conflict checks that used to take our intake team half a day now complete in seconds. The automated screening against historical clients and adverse parties has dramatically reduced our ethical risk exposure and accelerated new-matter setup.",
            author: "Anita Patel",
            role: "Chief Operating Officer",
            company: "Stonebridge Law Partners",
            metric: "95% faster conflict checking",
        },
    ],
    comparisons: [
        { feature: "Time Tracking", traditional: "Manual end-of-day entry", cubicleErp: "Passive, real-time capture" },
        { feature: "Conflict Checking", traditional: "Spreadsheet lookups", cubicleErp: "Instant automated screening" },
        { feature: "Court Deadlines", traditional: "Manual calendar entry", cubicleErp: "Rules-based auto-calculation" },
        { feature: "Document Assembly", traditional: "Copy-paste from templates", cubicleErp: "Automated merge fields" },
        { feature: "Trust Accounting", traditional: "Separate ledger software", cubicleErp: "Built-in, compliant" },
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
        { label: "Consulting Firms", href: "/products/consulting-firms" },
        { label: "Agencies", href: "/products/agencies" },
        { label: "Enterprise", href: "/products/enterprise" },
    ],
}

export default function LegalPage() {
    return <ExploreProductPage data={data} />
}
