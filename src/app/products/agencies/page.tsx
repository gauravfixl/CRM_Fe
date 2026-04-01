"use client"

import ExploreProductPage from "@/components/landingpage2/explore/ExploreProductPage"
import {
  BarChart3,
  Users,
  Clock,
  DollarSign,
  FolderOpen,
  FileText,
} from "lucide-react"

const data = {
  name: "Agencies",
  tagline: "Manage clients, projects, and billing in one place",
  description:
    "CubicleERP for Agencies is purpose-built for digital agencies, creative studios, consulting firms, and professional services teams. Track client relationships, manage multiple projects simultaneously, log billable hours, generate invoices automatically, and get real-time profitability insights — all without switching between a dozen disconnected tools.",
  icon: BarChart3,
  color: "#8B5CF6",
  lightColor: "#F5F3FF",
  heroImage: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1920&q=80",
  features: [
    {
      icon: Users,
      title: "Client Relationship Management",
      description:
        "Maintain a complete history of every client interaction — meetings, emails, contracts, and deliverables. Track client satisfaction scores, renewal dates, and expansion opportunities. Build deeper relationships with organized communication logs and proactive outreach reminders.",
    },
    {
      icon: FolderOpen,
      title: "Multi-Project Management",
      description:
        "Run dozens of client projects simultaneously with Kanban boards, Gantt timelines, and sprint planning. Set milestones, assign tasks across teams, track dependencies, and monitor progress in real time. Each project links directly to the client record and associated billing.",
    },
    {
      icon: Clock,
      title: "Time Tracking & Billable Hours",
      description:
        "Track time against projects, tasks, and clients with one-click timers or manual entry. Set billable rates per client, project, or team member. Automatically calculate billable vs. non-billable time and flag underreported hours before invoicing deadlines.",
    },
    {
      icon: DollarSign,
      title: "Automated Invoicing & Billing",
      description:
        "Generate invoices automatically from tracked time, project milestones, or retainer agreements. Support hourly, fixed-fee, and recurring billing models. Send invoices directly to clients, accept online payments, and track outstanding receivables with automated reminders.",
    },
    {
      icon: BarChart3,
      title: "Project Profitability Analytics",
      description:
        "Know exactly which clients and projects are profitable and which are bleeding margin. Track revenue vs. cost per project, per team member, and per service line. Identify scope creep early with budget burn-rate alerts and utilization dashboards.",
    },
    {
      icon: FileText,
      title: "Proposals & Contracts",
      description:
        "Create professional proposals and statements of work with customizable templates. Track proposal status, get electronic signatures, and automatically convert won proposals into active projects with pre-configured tasks, budgets, and timelines.",
    },
  ],
  benefits: [
    {
      title: "Maximize Billable Utilization",
      description:
        "Most agencies lose 20-30% of billable time to administrative overhead and poor tracking. CubicleERP's integrated time tracking and project management helps you capture every billable minute and identify where non-billable time is being spent.",
    },
    {
      title: "Eliminate Revenue Leakage",
      description:
        "Stop losing money to unbilled hours, forgotten expenses, and scope creep. Automated invoicing from tracked time ensures every hour of work gets billed. Budget alerts notify project managers when projects approach or exceed agreed-upon limits.",
    },
    {
      title: "Deliver Projects On Time",
      description:
        "Visualize project timelines, track task dependencies, and identify bottlenecks before they cause delays. Resource allocation dashboards show team capacity across all active projects so you can plan effectively and avoid overcommitting your team.",
    },
    {
      title: "Win More Business",
      description:
        "Professional proposals, organized client records, and quick response times help you stand out in competitive pitches. Track your proposal win rate and refine your approach based on data, not guesswork.",
    },
    {
      title: "Scale Your Agency Profitably",
      description:
        "Understand your true cost of delivery per service line and per client. Use profitability data to make informed decisions about pricing, hiring, and which types of projects to pursue. Grow revenue without proportionally growing overhead.",
    },
    {
      title: "Retain Top Talent",
      description:
        "Built-in HR tools help you manage your team's wellbeing — track workload balance, manage leave requests, and ensure no one is consistently overallocated. Happy, well-managed teams deliver better work and stay longer.",
    },
  ],
  steps: [
    {
      step: "1",
      title: "Set Up Your Agency",
      description:
        "Configure your workspace with service lines, billing rates, and project templates. Import your client list and existing project data. Invite your team and assign roles — account managers, designers, developers, and project leads.",
    },
    {
      step: "2",
      title: "Start Managing Projects",
      description:
        "Create projects from templates or scratch, assign tasks, and start tracking time. Link everything to client records so billing, communication, and deliverables are always connected. Set budgets and milestones to keep projects on track.",
    },
    {
      step: "3",
      title: "Invoice & Analyze",
      description:
        "Generate invoices from tracked time or project milestones. Review profitability reports, utilization rates, and client satisfaction metrics. Use insights to optimize pricing, improve processes, and grow your agency strategically.",
    },
  ],
  useCases: [
    {
      title: "Digital Marketing Agencies",
      description:
        "Marketing agencies juggling multiple client campaigns use CubicleERP to track deliverables, log billable hours, and generate monthly retainer invoices automatically.",
      highlights: [
        "Campaign project templates with recurring task structures",
        "Retainer billing with automatic monthly invoice generation",
        "Client reporting dashboards with deliverable tracking",
      ],
    },
    {
      title: "Software Development Shops",
      description:
        "Dev agencies building custom software for clients use CubicleERP to manage sprints, track developer hours, and maintain clear project scopes with budget visibility.",
      highlights: [
        "Sprint planning with story point and hour-based estimation",
        "Developer time tracking with per-project billing rates",
        "Scope management with change request tracking and approvals",
      ],
    },
    {
      title: "Creative & Design Studios",
      description:
        "Design studios managing brand projects, video production, and creative campaigns use CubicleERP to streamline approvals, track revisions, and maintain creative briefs alongside billing.",
      highlights: [
        "Creative brief templates with revision tracking workflows",
        "Asset delivery management with client approval stages",
        "Fixed-fee and milestone-based billing for creative projects",
      ],
    },
  ],
  faqs: [
    {
      question: "Can CubicleERP handle different billing models?",
      answer:
        "Yes. CubicleERP supports hourly billing (with time tracking integration), fixed-fee projects, monthly retainers, milestone-based billing, and hybrid models. You can set different billing rates per client, project, or team member and mix billing models across your client portfolio.",
    },
    {
      question: "How does time tracking work for agency teams?",
      answer:
        "Team members can track time using one-click timers, manual entry, or weekly timesheets. Time entries are linked to specific projects, tasks, and clients. Managers can review timesheets, flag missing entries, and approve hours before invoicing. Time tracking data feeds directly into invoicing and profitability reports.",
    },
    {
      question: "Can clients see their project progress?",
      answer:
        "Yes. CubicleERP includes a client portal where clients can view project timelines, approve deliverables, access shared documents, and see invoice history. You control exactly what each client can see, maintaining transparency without exposing internal operations or profitability data.",
    },
    {
      question: "Is there a limit on the number of projects or clients?",
      answer:
        "No. All plans include unlimited projects and unlimited clients. There are no per-project fees or client limits. You only pay based on the number of internal team members using the platform.",
    },
    {
      question: "How does CubicleERP compare to agency-specific tools like Teamwork or Harvest?",
      answer:
        "Unlike point solutions that handle only project management (Teamwork) or time tracking (Harvest), CubicleERP combines CRM, project management, time tracking, invoicing, HR, and analytics in one platform. You get deeper insights because your data is connected — see how client relationships impact project profitability and team utilization in a single dashboard.",
    },
  ],
  stats: [
    { value: "35%", label: "Increase in billable hours" },
    { value: "50%", label: "Faster invoicing cycles" },
    { value: "800+", label: "Agencies worldwide" },
    { value: "2x", label: "Improvement in utilization" },
  ],
}

export default function AgenciesPage() {
  return <ExploreProductPage data={data} />
}
