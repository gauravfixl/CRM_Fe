"use client"

import ExploreProductPage from "@/components/landingpage2/explore/ExploreProductPage"
import {
  UserCheck,
  UserCircle,
  MessageSquare,
  FileText,
  ThumbsUp,
  Globe,
  PieChart,
} from "lucide-react"

const data = {
  name: "Client Management",
  tagline: "Deliver exceptional client experiences that build lasting loyalty",
  description:
    "CubicleERP Client Management gives your team a centralized hub for every client relationship. From onboarding to renewal, maintain a complete picture of each client's history, contracts, communications, and satisfaction metrics. Build deeper relationships, resolve issues faster, and turn every client into a long-term advocate for your business.",
  icon: UserCheck,
  color: "#2B8A3E",
  lightColor: "#EBFBEE",
  heroImage: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1920&q=80",
  variant: 1 as const,
  features: [
    {
      icon: UserCircle,
      title: "Client Profiles",
      description:
        "Build comprehensive profiles for every client that include contact details, organizational hierarchy, preferences, interaction history, and custom fields specific to your industry. Every team member who touches the account has instant access to the full context they need, eliminating redundant questions and ensuring a seamless experience at every touchpoint.",
    },
    {
      icon: MessageSquare,
      title: "Communication History",
      description:
        "Automatically log every email, call, meeting, and chat message exchanged with each client in a unified, searchable timeline. Two-way sync with Gmail, Outlook, and your phone system ensures nothing is missed, and any team member can pick up a conversation exactly where it left off without asking the client to repeat themselves.",
    },
    {
      icon: FileText,
      title: "Contract Management",
      description:
        "Store, track, and manage all client contracts, service agreements, and amendments in one secure location. Set automated reminders for renewal dates, track contract values and terms, and maintain a complete audit trail of every change. Never be caught off guard by an expiring agreement or missed obligation again.",
    },
    {
      icon: ThumbsUp,
      title: "Satisfaction Tracking",
      description:
        "Measure and monitor client satisfaction with built-in survey tools, NPS scoring, and sentiment analysis across support interactions. Identify at-risk accounts before they churn by tracking satisfaction trends over time and triggering automated outreach when scores dip below your defined thresholds.",
    },
    {
      icon: Globe,
      title: "Client Portal",
      description:
        "Provide your clients with a branded self-service portal where they can view project status, access shared documents, submit support requests, approve deliverables, and track invoices. Reduce back-and-forth communication while giving clients the transparency and control they expect from a modern service provider.",
    },
    {
      icon: PieChart,
      title: "Client Reporting",
      description:
        "Generate detailed reports on client health, revenue by account, service utilization, response times, and retention metrics. Share polished client-facing reports directly from the platform or schedule automated delivery to stakeholders. Use internal dashboards to spot trends across your entire client portfolio.",
    },
  ],
  benefits: [
    {
      title: "Stronger Client Relationships",
      description:
        "When every team member has full context on a client's history, preferences, and ongoing needs, every interaction feels personal and informed. Clients notice the difference and reward you with loyalty, referrals, and expanded engagements.",
    },
    {
      title: "Reduced Client Churn",
      description:
        "Proactively identify clients who are disengaging or dissatisfied using health scores, satisfaction surveys, and activity monitoring. Automated alerts give your account managers time to intervene with targeted outreach before a client decides to leave.",
    },
    {
      title: "Faster Issue Resolution",
      description:
        "With complete communication history and contract details at their fingertips, your team resolves client issues quickly and accurately. No more hunting through email threads or asking colleagues for context while the client waits.",
    },
    {
      title: "Increased Revenue Per Client",
      description:
        "Identify upsell and cross-sell opportunities by analyzing client usage patterns, contract terms, and satisfaction scores. Well-timed expansion conversations with happy clients are the most efficient path to revenue growth.",
    },
    {
      title: "Streamlined Onboarding",
      description:
        "Create repeatable onboarding workflows that ensure every new client receives a consistent, high-quality experience. Track onboarding milestones, automate welcome sequences, and reduce the time it takes for clients to see value from your product or service.",
    },
    {
      title: "Operational Efficiency",
      description:
        "Eliminate scattered spreadsheets, disconnected email threads, and tribal knowledge. A single source of truth for every client relationship means less time searching for information and more time delivering results that keep clients coming back.",
    },
  ],
  steps: [
    {
      step: "1",
      title: "Import Your Client Data",
      description:
        "Bring your existing client records into CubicleERP via CSV upload, API integration, or direct migration from your current tools. Contacts, contracts, and communication history are mapped and organized automatically so your team is productive from day one.",
    },
    {
      step: "2",
      title: "Configure Your Workflows",
      description:
        "Set up onboarding templates, contract renewal reminders, satisfaction survey schedules, and escalation rules. Customize client profile fields, portal branding, and reporting dashboards to match your business processes and brand identity.",
    },
    {
      step: "3",
      title: "Delight Your Clients",
      description:
        "Start managing every client relationship from a single platform. Monitor health scores, track communication, and use data-driven insights to deliver proactive service that exceeds expectations and drives long-term retention.",
    },
  ],
  useCases: [
    {
      title: "Professional Services Firms",
      description:
        "Manage complex, long-term client engagements with full visibility into project status, billable hours, contract terms, and client feedback. Ensure every partner, manager, and analyst on the team has the context they need to deliver outstanding work.",
      highlights: [
        "Engagement tracking with contract value and milestone monitoring",
        "Time and billing integration for accurate invoicing",
        "Client satisfaction surveys tied to specific project phases",
      ],
    },
    {
      title: "Agencies and Consultancies",
      description:
        "Juggle multiple client accounts without dropping the ball. Centralize briefs, approvals, feedback, and deliverables in one place so creative and strategy teams can focus on the work instead of chasing down information across email threads and chat messages.",
      highlights: [
        "Branded client portal for deliverable review and approval",
        "Communication timeline with full email and meeting history",
        "Multi-account dashboards for portfolio-level health monitoring",
      ],
    },
    {
      title: "SaaS and Subscription Businesses",
      description:
        "Monitor adoption, track renewal timelines, and intervene when clients show signs of disengagement. Build automated playbooks for onboarding, quarterly business reviews, and renewal outreach that scale your customer success team without adding headcount.",
      highlights: [
        "Product usage tracking integrated with client health scores",
        "Automated renewal reminders with contract management workflows",
        "NPS and CSAT survey automation with trend analysis dashboards",
      ],
    },
  ],
  faqs: [
    {
      question: "How does CubicleERP Client Management differ from the CRM module?",
      answer:
        "While the CRM module focuses on the sales pipeline from lead to closed deal, Client Management picks up where CRM leaves off. It is purpose-built for managing ongoing relationships with existing clients, including contract tracking, satisfaction monitoring, client portals, onboarding workflows, and retention analytics. Data flows seamlessly between both modules so you have a complete customer lifecycle view.",
    },
    {
      question: "Can clients access a self-service portal?",
      answer:
        "Yes. CubicleERP includes a fully customizable client portal that you can brand with your logo, colors, and domain. Clients can log in to view project updates, download shared documents, submit and track support requests, approve deliverables, and access their invoice history. Portal access is controlled with granular permissions so you decide exactly what each client can see.",
    },
    {
      question: "How does satisfaction tracking work?",
      answer:
        "CubicleERP supports multiple satisfaction measurement methods including NPS surveys, CSAT ratings, and custom questionnaires. Surveys can be sent automatically at defined intervals, after specific events like project completion or support resolution, or on demand. Results feed into a client health score that is visible on the account dashboard and can trigger automated alerts when scores decline.",
    },
    {
      question: "Can I manage contracts and renewals in CubicleERP?",
      answer:
        "Absolutely. Store all client contracts with key metadata including start date, end date, value, terms, and attached documents. Set automated reminders that alert your team 30, 60, or 90 days before renewal dates. Track amendments and version history so you always have a clear audit trail of contractual changes over the life of the relationship.",
    },
    {
      question: "How does client data integrate with other CubicleERP modules?",
      answer:
        "Client Management integrates natively with CubicleERP CRM, invoicing, project management, helpdesk, and analytics modules. When a deal closes in CRM, the client record is created automatically with all historical data. Support tickets from the helpdesk module appear on the client timeline, and invoices from the finance module are accessible in the client portal. This connected data model eliminates silos and gives your team a true 360-degree view.",
    },
  ],
  stats: [
    { value: "45%", label: "Improvement in retention" },
    { value: "60%", label: "Faster issue resolution" },
    { value: "2x", label: "Client lifetime value" },
    { value: "30%", label: "Less admin overhead" },
  ],
  capabilities: [
    {
      title: "Client Health Scoring",
      description:
        "Automatically calculate a dynamic health score for every client based on a weighted combination of engagement frequency, satisfaction survey results, support ticket volume, contract renewal proximity, and revenue trends. Health scores update in real time, giving account managers an instant read on relationship strength and churn risk.",
      keyPoints: [
        "Composite scoring model combining engagement, satisfaction, and revenue signals",
        "Configurable weight allocation so you prioritize the metrics that matter most",
        "Automatic alerts and escalation workflows when scores drop below thresholds",
        "Historical health score trending to identify gradual relationship deterioration",
      ],
    },
    {
      title: "Onboarding Orchestration",
      description:
        "Design structured onboarding programs with milestone-based templates that ensure every new client receives a consistent, thorough introduction to your product or service. Track completion rates, identify stalled onboardings, and automate reminders so clients reach their first value milestone as quickly as possible.",
      keyPoints: [
        "Reusable onboarding templates with customizable milestones and checklists",
        "Automated task assignments and deadline reminders for your delivery team",
        "Client-facing progress tracker visible in the self-service portal",
        "Time-to-value analytics measuring how quickly clients reach key milestones",
      ],
    },
    {
      title: "Revenue and Expansion Intelligence",
      description:
        "Surface upsell and cross-sell opportunities by analyzing client usage data, contract headroom, and satisfaction trends. CubicleERP identifies clients who are ready for expansion and provides account managers with data-backed recommendations for the right conversation at the right time.",
      keyPoints: [
        "Expansion opportunity scoring based on usage patterns and contract terms",
        "Automated alerts when clients approach plan limits or contract caps",
        "Revenue forecasting by account with renewal probability estimates",
        "Account plan templates for strategic growth conversations",
      ],
    },
    {
      title: "Multi-Stakeholder Relationship Mapping",
      description:
        "Map the complete organizational structure of each client account, identifying decision makers, influencers, champions, and end users. Track individual relationships with each stakeholder and ensure your team maintains active engagement with the people who drive retention and expansion decisions.",
      keyPoints: [
        "Organizational chart visualization with role and influence tagging",
        "Stakeholder engagement tracking with last-contact date monitoring",
        "Champion risk alerts when key contacts leave or change roles",
        "Multi-threaded relationship health view per account",
      ],
    },
  ],
  integrations: [
    { name: "Salesforce", category: "CRM" },
    { name: "HubSpot", category: "CRM" },
    { name: "Zendesk", category: "Support" },
    { name: "Intercom", category: "Communication" },
    { name: "Slack", category: "Communication" },
    { name: "Gmail", category: "Email" },
    { name: "Microsoft Outlook", category: "Email" },
    { name: "Calendly", category: "Scheduling" },
    { name: "Zoom", category: "Video Conferencing" },
    { name: "DocuSign", category: "Contract Management" },
    { name: "Stripe", category: "Payments" },
    { name: "Jira", category: "Project Management" },
  ],
  testimonials: [
    {
      quote:
        "CubicleERP Client Management gave us a complete view of every client relationship for the first time. Our account managers can see health scores, communication history, and contract status in one place. Client retention has improved significantly since we adopted the platform.",
      author: "Catherine Blake",
      role: "VP of Client Success",
      company: "Pinnacle Advisory Group",
      metric: "45% improvement in client retention rate",
    },
    {
      quote:
        "The client portal has been a game-changer for us. Our clients can track project progress, access documents, and submit requests without emailing us. It reduced our inbound support volume dramatically and our clients love the transparency.",
      author: "Rajesh Iyer",
      role: "Managing Director",
      company: "Stratton Digital Agency",
      metric: "60% reduction in client support emails",
    },
    {
      quote:
        "We identified three at-risk enterprise accounts through the health scoring system that we would have lost without it. The early warning gave us time to intervene, and all three renewed their contracts for another year.",
      author: "Emma Lindqvist",
      role: "Head of Account Management",
      company: "CloudBridge SaaS",
      metric: "Saved 3 enterprise accounts worth $420K ARR",
    },
  ],
  comparisons: [
    { feature: "Client Health Tracking", traditional: "Gut feeling and guesswork", cubicleErp: "Data-driven health scores" },
    { feature: "Communication History", traditional: "Scattered across inboxes", cubicleErp: "Unified searchable timeline" },
    { feature: "Contract Management", traditional: "File folders or shared drives", cubicleErp: "Centralized with alerts" },
    { feature: "Client Portal", traditional: "Not available", cubicleErp: "Branded self-service portal" },
    { feature: "Onboarding", traditional: "Ad-hoc manual process", cubicleErp: "Structured milestone tracking" },
    { feature: "Expansion Insights", traditional: "Reactive, rep-dependent", cubicleErp: "Proactive AI suggestions" },
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
    { label: "CRM", href: "/explore/crm" },
    { label: "Client Portal", href: "/explore/client-portal" },
    { label: "Helpdesk", href: "/explore/helpdesk" },
  ],
}

export default function ClientManagementPage() {
  return <ExploreProductPage data={data} />
}
