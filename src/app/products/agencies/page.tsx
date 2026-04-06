"use client"

import ExploreProductPage from "@/components/landingpage2/explore/ExploreProductPage"
import {
  BarChart3,
  Users,
  Clock,
  DollarSign,
  FolderKanban,
  LayoutDashboard,
} from "lucide-react"

const data = {
  name: "Agencies",
  tagline: "Orchestrate clients, creatives, and cash flow from a single command center",
  description:
    "CubicleERP for Agencies unifies client management, project tracking, time billing, and profitability analytics into one cohesive platform built for digital agencies, creative studios, and professional services firms. Stop juggling disconnected spreadsheets, Slack threads, and invoicing tools — manage retainers, allocate resources across concurrent projects, and get real-time margin visibility so you can scale your agency without sacrificing quality or profitability.",
  icon: BarChart3,
  color: "#7C3AED",
  lightColor: "#F3E8FF",
  heroImage:
    "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920&q=80",
  variant: 3 as const,
  features: [
    {
      icon: Users,
      title: "Client Relationship Management",
      description:
        "Maintain a 360-degree view of every client relationship with centralized communication logs, contract histories, and satisfaction tracking. Automatically surface renewal dates, upsell opportunities, and at-risk accounts so your account managers never miss a beat. Build deeper partnerships by having every meeting note, deliverable, and invoice accessible in one unified client profile.",
    },
    {
      icon: FolderKanban,
      title: "Multi-Project Tracking & Creative Workflows",
      description:
        "Run dozens of client projects in parallel using Kanban boards, Gantt timelines, and custom creative workflows with built-in approval stages. Link every task to a client record, a budget line, and a team member so nothing falls through the cracks. Set milestones, track revision rounds, manage dependencies, and get instant visibility into which projects are on track and which need attention.",
    },
    {
      icon: Clock,
      title: "Time Billing & Retainer Management",
      description:
        "Capture every billable minute with one-click timers, manual entry, or weekly timesheets that sync directly to client projects. Support hourly, retainer, fixed-fee, and milestone-based billing models across your entire portfolio. Automatically track retainer burn-down rates, flag overserviced accounts, and alert teams when they approach budget thresholds before it impacts your margin.",
    },
    {
      icon: LayoutDashboard,
      title: "Resource Allocation & Capacity Planning",
      description:
        "Visualize your entire team's workload across all active projects with drag-and-drop resource scheduling boards. Identify overallocated team members, spot upcoming capacity gaps, and make data-driven staffing decisions before bottlenecks cause missed deadlines. Balance creative talent across client accounts to maximize utilization while preventing burnout and maintaining work quality.",
    },
    {
      icon: BarChart3,
      title: "Profitability Analytics & Multi-Client Dashboards",
      description:
        "Know exactly which clients, projects, and service lines drive your margins with real-time profitability dashboards that connect revenue, tracked hours, and delivery costs. Drill down from agency-wide performance to individual project P&L statements and team member contribution metrics. Spot scope creep early with budget burn-rate alerts and use historical data to price future work more accurately.",
    },
    {
      icon: DollarSign,
      title: "Automated Invoicing & Revenue Forecasting",
      description:
        "Generate polished invoices automatically from tracked time, completed milestones, or recurring retainer schedules and send them directly to clients with online payment options. Forecast upcoming revenue based on active contracts, pipeline proposals, and historical billing patterns. Track outstanding receivables with automated payment reminders and aging reports to keep your cash flow healthy and predictable.",
    },
  ],
  benefits: [
    {
      title: "Capture Every Billable Minute",
      description:
        "Most agencies lose 20-30% of revenue to unbilled hours and poor time tracking. CubicleERP's integrated timers and automated billing workflows ensure every minute of client work gets captured, approved, and invoiced — turning lost time into recovered revenue.",
    },
    {
      title: "Eliminate Scope Creep Before It Kills Margins",
      description:
        "Real-time budget tracking and burn-rate alerts notify project managers the moment a project trends over scope. Change request workflows formalize additional work so your team never gives away hours for free.",
    },
    {
      title: "Deliver Projects On Time, Every Time",
      description:
        "Resource scheduling, dependency tracking, and capacity dashboards give you complete visibility into your delivery pipeline. Identify bottlenecks weeks in advance and rebalance workloads so deadlines are met without last-minute scrambles.",
    },
    {
      title: "Scale Without Proportional Overhead",
      description:
        "Automated invoicing, templated project setups, and streamlined client onboarding let you take on more clients without hiring more operations staff. Grow revenue while keeping your overhead lean and your margins healthy.",
    },
    {
      title: "Win More Pitches With Data-Backed Proposals",
      description:
        "Use historical project data to build accurate estimates and professional proposals that instill client confidence. Track your win rate across service lines and refine your pricing strategy based on actual delivery costs, not guesswork.",
    },
    {
      title: "Retain Your Best People",
      description:
        "Balanced workload allocation and transparent project planning prevent chronic overwork that drives top talent away. Give your team clarity on priorities, fair distribution of assignments, and the tools to do their best creative work.",
    },
  ],
  steps: [
    {
      step: "1",
      title: "Configure Your Agency Workspace",
      description:
        "Set up your service lines, billing rates, team roles, and project templates. Import your client list and existing project data, then invite your team — account managers, creatives, developers, and leadership — with role-based permissions.",
    },
    {
      step: "2",
      title: "Launch Projects & Track Time",
      description:
        "Create client projects from templates or scratch, assign tasks across your team, and start tracking billable hours. Link every deliverable to a client record and budget so billing, communication, and progress stay connected in real time.",
    },
    {
      step: "3",
      title: "Invoice, Analyze & Grow",
      description:
        "Generate invoices from tracked time or milestones, review profitability by client and project, and use utilization insights to optimize pricing, staffing, and the types of engagements you pursue. Let data guide your agency's growth strategy.",
    },
  ],
  useCases: [
    {
      title: "Digital Marketing Agencies",
      description:
        "Marketing agencies managing multi-channel campaigns across dozens of clients use CubicleERP to track deliverables, automate retainer billing, and prove ROI to clients with transparent reporting dashboards.",
      highlights: [
        "Recurring campaign templates with automated monthly task generation",
        "Retainer burn-down tracking with automatic invoice generation",
        "Client-facing dashboards showing deliverable status and spend",
      ],
    },
    {
      title: "Creative & Design Studios",
      description:
        "Design studios handling brand identity, video production, and packaging projects use CubicleERP to manage revision workflows, track creative hours, and maintain profitability across fixed-fee and milestone-based engagements.",
      highlights: [
        "Multi-stage approval workflows with revision round tracking",
        "Creative brief management linked to project budgets and timelines",
        "Fixed-fee and milestone billing with automatic progress invoicing",
      ],
    },
    {
      title: "Software Development Shops",
      description:
        "Dev agencies building custom applications for clients use CubicleERP to run sprints, track developer utilization, manage change requests, and maintain clear project scopes with real-time budget visibility.",
      highlights: [
        "Sprint planning with story point estimation and velocity tracking",
        "Developer time tracking with per-project and per-client billing rates",
        "Scope change request workflows with client approval and budget adjustment",
      ],
    },
  ],
  faqs: [
    {
      question: "Can CubicleERP handle different billing models simultaneously?",
      answer:
        "Absolutely. CubicleERP supports hourly billing with integrated time tracking, fixed-fee projects, monthly and quarterly retainers, milestone-based invoicing, and hybrid models that combine multiple approaches. You can configure different billing rates per client, per project, or per individual team member, and mix billing models freely across your client portfolio. The system automatically calculates amounts based on the applicable model when generating invoices.",
    },
    {
      question: "How does resource allocation work across multiple projects?",
      answer:
        "CubicleERP provides a visual resource scheduling board where you can see every team member's allocation across all active projects. You can drag and drop assignments, set allocation percentages, and instantly identify who is overbooked or has available capacity. The system flags conflicts when you try to overallocate someone and suggests alternative team members with the right skills and availability. Capacity forecasting lets you plan weeks ahead so you can hire or adjust timelines proactively.",
    },
    {
      question: "Can clients access their own project portal?",
      answer:
        "Yes. CubicleERP includes a configurable client portal where your clients can view project timelines, approve deliverables, download shared assets, review and pay invoices, and communicate with your team. You have full control over what each client sees — you can share progress and documents while keeping internal discussions, cost data, and profitability metrics completely private.",
    },
    {
      question: "Is there a limit on projects, clients, or team size?",
      answer:
        "No. All plans include unlimited projects, unlimited clients, and no per-project fees. You can manage as many concurrent engagements as your agency handles. Pricing is based solely on the number of internal team members using the platform, making it simple and predictable as you grow.",
    },
    {
      question: "How does CubicleERP compare to tools like Teamwork, Harvest, or Monday.com?",
      answer:
        "Unlike point solutions that handle only project management or only time tracking, CubicleERP combines CRM, project management, time tracking, invoicing, resource planning, HR, and profitability analytics in a single connected platform. This means your data flows seamlessly — tracked time becomes invoices, project costs feed profitability reports, and client interactions inform account health scores. You eliminate the cost, complexity, and data silos of maintaining five or six separate subscriptions.",
    },
  ],
  stats: [
    { value: "35%", label: "Increase in billable utilization" },
    { value: "50%", label: "Faster invoice-to-payment cycles" },
    { value: "800+", label: "Agencies powered worldwide" },
    { value: "2x", label: "Improvement in project margin visibility" },
  ],
}

export default function AgenciesPage() {
  return <ExploreProductPage data={data} />
}
