"use client"

import ExploreProductPage from "@/components/landingpage2/explore/ExploreProductPage"
import {
  Briefcase,
  Clock,
  Users,
  DollarSign,
  BarChart3,
  FolderKanban,
} from "lucide-react"

const data = {
  name: "Consulting Firms",
  tagline: "Streamline engagements, billing, and delivery for consulting teams",
  description:
    "CubicleERP for Consulting Firms is purpose-built to help consultancies of all sizes manage the full lifecycle of client engagements — from proposal and scoping through resource allocation, time tracking, milestone delivery, and invoicing. Replace scattered spreadsheets and disconnected tools with a single platform that gives partners real-time visibility into project profitability, consultant utilization, and pipeline health, so your firm can scale without sacrificing margins or client satisfaction.",
  icon: Briefcase,
  color: "#7C3AED",
  lightColor: "#F3E8FF",
  heroImage: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920&q=80",
  features: [
    {
      icon: FolderKanban,
      title: "Engagement & Project Management",
      description:
        "Manage every consulting engagement from kickoff to closeout in one place. Define project scopes, set milestones and deliverables, track progress with Gantt and Kanban views, and attach all relevant documents to each engagement. Automated status updates keep clients informed and internal stakeholders aligned without manual reporting overhead.",
    },
    {
      icon: Clock,
      title: "Time Tracking & Timesheets",
      description:
        "Consultants log billable and non-billable hours against specific projects, tasks, and clients with an intuitive timesheet interface available on desktop and mobile. Managers approve timesheets in bulk, flag discrepancies automatically, and feed approved hours directly into invoicing — eliminating revenue leakage from unbilled time.",
    },
    {
      icon: Users,
      title: "Resource Allocation & Capacity Planning",
      description:
        "Visualize consultant availability, skill sets, and current assignments on a real-time resource calendar. Drag-and-drop scheduling lets managers allocate the right people to the right projects, forecast capacity gaps weeks in advance, and avoid both over-utilization and costly bench time across the entire firm.",
    },
    {
      icon: DollarSign,
      title: "Client Billing & Invoicing",
      description:
        "Support time-and-materials, fixed-fee, retainer, and milestone-based billing models from a single system. Auto-generate invoices from approved timesheets and expense reports, apply client-specific rate cards and discount structures, and track payment status with automated reminders — ensuring healthy cash flow and transparent client relationships.",
    },
    {
      icon: BarChart3,
      title: "Profitability & Utilization Analytics",
      description:
        "Real-time dashboards show engagement profitability, consultant utilization rates, revenue per partner, and margin trends at the firm, practice, and project level. Drill down from high-level KPIs to individual time entries to understand exactly where your firm is earning and where margin erosion is occurring.",
    },
    {
      icon: Briefcase,
      title: "Pipeline & Proposal Management",
      description:
        "Track prospective engagements from initial lead through proposal submission and contract signing. Build proposals using reusable templates, attach pricing models and SOW documents, and monitor win rates by practice area. Pipeline forecasting gives leadership accurate revenue projections for quarterly and annual planning.",
    },
  ],
  benefits: [
    {
      title: "Maximize Billable Utilization",
      description:
        "With real-time visibility into every consultant's schedule, workload, and availability, managers can minimize bench time and ensure top performers are deployed on high-value engagements. Firms using CubicleERP see utilization improvements of 10-15% within the first quarter.",
    },
    {
      title: "Eliminate Revenue Leakage",
      description:
        "Automated time capture, expense tracking, and invoice generation ensure every billable hour and reimbursable expense is accounted for. No more lost timesheets, forgotten expenses, or manual transcription errors between tracking tools and accounting systems.",
    },
    {
      title: "Deliver Projects On Time and On Budget",
      description:
        "Milestone tracking, budget burn-down alerts, and real-time scope monitoring help engagement managers catch overruns early. Proactive notifications flag at-risk engagements before they become write-offs, protecting both profitability and client trust.",
    },
    {
      title: "Strengthen Client Relationships",
      description:
        "A centralized client record stores every engagement, communication, document, and invoice in one place. Consultants joining an account can quickly get up to speed, and partners have a 360-degree view of the relationship for strategic account planning.",
    },
    {
      title: "Make Data-Driven Firm Decisions",
      description:
        "Leadership dashboards surface the metrics that matter — utilization, realization rates, pipeline coverage, and practice-level P&L — so partners can allocate investment, adjust pricing, and plan hiring with confidence rather than gut instinct.",
    },
    {
      title: "Scale Without Adding Overhead",
      description:
        "Automated workflows for approvals, invoicing, and reporting mean your back-office operations scale linearly as you add consultants and clients. Grow your firm without proportionally growing your administrative and finance team.",
    },
  ],
  steps: [
    {
      step: "1",
      title: "Configure Your Firm",
      description:
        "Set up your practice areas, service lines, billing rate cards, and organizational hierarchy. Import your existing client and project data, define approval workflows for timesheets and expenses, and configure invoice templates to match your firm's branding and billing terms.",
    },
    {
      step: "2",
      title: "Onboard Your Team",
      description:
        "Invite consultants, managers, and partners to the platform with role-appropriate access. Each user gets a personalized dashboard showing their assigned engagements, upcoming deadlines, timesheet status, and utilization targets. Interactive walkthroughs get everyone productive within hours.",
    },
    {
      step: "3",
      title: "Manage & Grow",
      description:
        "Run your consulting engagements end-to-end — from pipeline tracking and resource planning through delivery, billing, and post-engagement reviews. Use analytics to continuously improve utilization, profitability, and client satisfaction as your firm grows.",
    },
  ],
  useCases: [
    {
      title: "Management Consulting Firms",
      description:
        "Strategy and management consulting firms use CubicleERP to manage complex multi-workstream engagements with large client teams, track partner-level profitability, and maintain the rigorous time-tracking discipline that drives accurate billing and margin analysis.",
      highlights: [
        "Multi-workstream engagement tracking with cross-team dependencies",
        "Partner and principal-level profitability dashboards",
        "Automated weekly utilization reports for practice leads",
      ],
    },
    {
      title: "IT & Technology Consultancies",
      description:
        "Technology consulting firms use CubicleERP to manage blended teams of on-site and remote consultants, track time across agile sprints and fixed-scope deliverables, and handle the complex billing arrangements common in technology engagements.",
      highlights: [
        "Blended rate management for mixed seniority teams",
        "Sprint-based and milestone-based time tracking in one system",
        "Integration with Jira, Azure DevOps, and project management tools",
      ],
    },
    {
      title: "Boutique & Specialty Advisory Firms",
      description:
        "Smaller specialty firms — from HR advisory to financial consulting — use CubicleERP to punch above their weight with professional-grade engagement management, polished client-facing deliverables, and the operational efficiency needed to compete with larger rivals.",
      highlights: [
        "Retainer and subscription billing for ongoing advisory relationships",
        "Client portal for document sharing and progress visibility",
        "Proposal templates with automated pricing calculations",
      ],
    },
  ],
  faqs: [
    {
      question: "Does CubicleERP support different billing models like retainers and fixed-fee engagements?",
      answer:
        "Yes. CubicleERP supports time-and-materials, fixed-fee, retainer, milestone-based, and blended billing models. You can configure different billing arrangements per engagement or even per workstream within a single engagement. Rate cards can be set at the firm, practice, client, or individual consultant level, and the system automatically applies the correct rates when generating invoices from approved timesheets.",
    },
    {
      question: "How does resource allocation work across multiple engagements?",
      answer:
        "The resource management module provides a visual calendar showing every consultant's current and future assignments, availability windows, and skill tags. Managers can drag and drop to assign consultants to engagements, set allocation percentages for shared resources, and use the capacity planning forecast to identify upcoming gaps or over-commitments weeks in advance. Skill-based search makes it easy to find the right consultant for specialized engagements.",
    },
    {
      question: "Can consultants track time on mobile devices?",
      answer:
        "Absolutely. CubicleERP includes a fully featured mobile app for iOS and Android that lets consultants log time, submit expenses with receipt photos, view their upcoming assignments, and check project details while on-site with clients. Timesheets can also be submitted through the web app, and managers can approve them from any device. Offline mode ensures time can be captured even without an internet connection and synced later.",
    },
    {
      question: "How does CubicleERP help with consultant utilization targets?",
      answer:
        "Each consultant can be assigned a target utilization rate based on their role and seniority. The platform tracks actual billable hours against these targets in real time and surfaces utilization metrics on individual, team, practice, and firm-wide dashboards. Managers receive automated alerts when consultants fall below target thresholds, and leadership can analyze utilization trends over time to inform hiring, pricing, and business development decisions.",
    },
    {
      question: "Can we integrate CubicleERP with our existing accounting software?",
      answer:
        "Yes. CubicleERP integrates with popular accounting platforms including QuickBooks, Xero, Sage, and NetSuite. Approved invoices and payment data sync automatically, eliminating double entry between your engagement management and financial systems. For firms with custom ERP or accounting setups, our REST API and webhook system allow you to build tailored integrations with full support from our technical team.",
    },
  ],
  stats: [
    { value: "15%", label: "Average utilization improvement" },
    { value: "98%", label: "Timesheet compliance rate" },
    { value: "3x", label: "Faster invoice generation" },
    { value: "200+", label: "Consulting firms onboarded" },
  ],
}

export default function ConsultingFirmsPage() {
  return <ExploreProductPage data={data} />
}
