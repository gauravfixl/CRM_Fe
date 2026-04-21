"use client"

import LP2Navbar from "@/components/landingpage2/LP2Navbar"
import LP2Footer from "@/components/landingpage2/LP2Footer"
import LP2CTA from "@/components/landingpage2/LP2CTA"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import {
  BarChart3,
  Users,
  Clock,
  DollarSign,
  FolderKanban,
  LayoutDashboard,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Check,
  X,
  Play,
  Pause,
  Zap,
  Globe,
  Layers,
} from "lucide-react"

const PRIMARY = "#8B5CF6"

const stats = [
  { value: "35%", label: "Increase in billable utilization" },
  { value: "50%", label: "Faster invoice-to-payment cycles" },
  { value: "800+", label: "Agencies powered worldwide" },
  { value: "2x", label: "Improvement in project margin visibility" },
]

const features = [
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
]

const benefits = [
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
]

const steps = [
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
]

const useCases = [
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
]

const faqs = [
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
    question:
      "How does CubicleERP compare to tools like Teamwork, Harvest, or Monday.com?",
    answer:
      "Unlike point solutions that handle only project management or only time tracking, CubicleERP combines CRM, project management, time tracking, invoicing, resource planning, HR, and profitability analytics in a single connected platform. This means your data flows seamlessly — tracked time becomes invoices, project costs feed profitability reports, and client interactions inform account health scores. You eliminate the cost, complexity, and data silos of maintaining five or six separate subscriptions.",
  },
]

const comparisons = [
  { feature: "Client + project + billing", traditional: "3 separate tools", cubicleErp: "Single platform" },
  { feature: "Time tracking to invoice", traditional: "Manual export/import", cubicleErp: "One-click generation" },
  { feature: "Resource planning", traditional: "Spreadsheet guesswork", cubicleErp: "Visual drag-and-drop" },
  { feature: "Profitability analytics", traditional: "End-of-month surprise", cubicleErp: "Real-time per project" },
  { feature: "Client portal", traditional: "Extra subscription", cubicleErp: "Built-in and branded" },
  { feature: "Scope creep detection", traditional: "Discovered at invoice", cubicleErp: "Automated alerts" },
]

const capabilities = [
  {
    title: "Retainer Intelligence & Health Scoring",
    description:
      "Go beyond simple retainer burn-down tracking with intelligent health scoring that combines hours consumed, deliverable quality, client responsiveness, and satisfaction signals. Proactively flag at-risk accounts before renewals and arm account managers with data-driven talking points for retention conversations.",
    keyPoints: [
      "Composite retainer health score combining utilization, scope, and sentiment data",
      "Automated early-warning alerts when accounts trend toward overservice or churn",
      "Renewal forecasting with historical retention rate benchmarking",
      "Account manager dashboards with recommended actions for at-risk clients",
    ],
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
  },
  {
    title: "Creative Asset & Brand Management",
    description:
      "Organize every creative deliverable, brand guideline, and client asset in a structured, searchable digital asset library. Version control ensures teams always work from the latest approved files, while client-specific brand portals make asset handoff seamless.",
    keyPoints: [
      "Centralized asset library with tagging, search, and version history",
      "Client-specific brand portals with controlled access and download tracking",
      "Automated file format conversion and thumbnail generation for common asset types",
      "Integration with design tools for direct publish from Figma, Adobe, and Canva",
    ],
    image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&q=80",
  },
  {
    title: "Multi-Office & Remote Team Coordination",
    description:
      "Agencies with distributed teams across offices, time zones, and freelancer networks need coordination tools that go beyond simple task lists. CubicleERP provides timezone-aware scheduling, freelancer onboarding workflows, and cross-office resource sharing.",
    keyPoints: [
      "Timezone-aware resource scheduling with overlap visibility for handoffs",
      "Freelancer and contractor portal with scoped access and separate billing",
      "Cross-office utilization dashboards for balancing workload across locations",
      "Asynchronous approval workflows designed for distributed creative teams",
    ],
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
  },
  {
    title: "New Business & Pitch Management",
    description:
      "Track every new business opportunity from initial RFP response through pitch preparation, presentation, and outcome analysis. Build a knowledge base of winning proposals, competitive positioning, and historical win rates to continuously improve your agency's close rate.",
    keyPoints: [
      "RFP tracker with deadline alerts, team assignments, and submission checklists",
      "Proposal template library with reusable content blocks and case studies",
      "Pitch cost tracking to measure investment in new business development",
      "Win/loss analysis with tagging by industry, service line, and competitor",
    ],
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80",
  },
]

const integrations = [
  { name: "Figma", category: "Design" },
  { name: "Adobe Creative Cloud", category: "Design" },
  { name: "Slack", category: "Communication" },
  { name: "Google Workspace", category: "Productivity" },
  { name: "Harvest", category: "Time Tracking" },
  { name: "QuickBooks", category: "Accounting" },
  { name: "Zapier", category: "Automation" },
  { name: "HubSpot", category: "CRM" },
  { name: "Asana", category: "Project Management" },
  { name: "Canva", category: "Design" },
  { name: "Xero", category: "Accounting" },
  { name: "Dropbox", category: "File Storage" },
]

const testimonials = [
  {
    quote:
      "Before CubicleERP, we had no idea which clients were actually profitable. Within the first month, we discovered that two of our largest retainers were underwater. We restructured pricing and recovered over $15K in monthly margin.",
    author: "Sarah Kline",
    role: "Managing Director",
    company: "Prism Digital Agency",
    metric: "$15K/mo in recovered margin",
  },
  {
    quote:
      "Our billable utilization jumped from 61% to 82% in a single quarter. The resource planning board made it obvious where we had capacity gaps and where people were overbooked. It changed how we staff every project.",
    author: "Marcus Tan",
    role: "Head of Operations",
    company: "Redthread Creative",
    metric: "61% to 82% billable utilization",
  },
  {
    quote:
      "Client onboarding used to take a week of back-and-forth emails. Now we spin up a project from a template, invite the client to their portal, and kick off the first sprint in the same afternoon. Our clients notice the difference.",
    author: "Elena Vasquez",
    role: "Client Services Director",
    company: "Loom & Co",
    metric: "Client onboarding reduced from 1 week to 1 day",
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5 },
  }),
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
}

export default function AgenciesPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <main className="bg-white min-h-screen">
      <LP2Navbar />

      {/* ===== 1. HERO ===== */}
      <section className="pt-28 pb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-purple-100/50 blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-6"
          >
            <Zap className="w-4 h-4" /> Built for Agencies
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-5"
          >
            Clients, projects & billing —{" "}
            <span className="text-purple-600">all in one place</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto mb-8"
          >
            CubicleERP for Agencies unifies client management, project tracking,
            time billing, and profitability analytics into one cohesive platform
            built for digital agencies, creative studios, and professional
            services firms.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 mb-10"
          >
            <Link
              href="/get-started"
              className="px-7 py-3 rounded-lg text-white font-semibold text-sm shadow-lg shadow-purple-200 hover:shadow-purple-300 transition-all"
              style={{ backgroundColor: PRIMARY }}
            >
              Start Free Trial
            </Link>
            <Link
              href="/contact"
              className="px-7 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold text-sm hover:border-purple-300 hover:text-purple-700 transition-all"
            >
              Book a Demo
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {stats.map((s, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-100 text-sm"
              >
                <span className="font-bold text-purple-600">{s.value}</span>
                <span className="text-gray-500">{s.label}</span>
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== 2. FEATURE SHOWCASE - MAGAZINE GRID ===== */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="text-center mb-14"
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              Everything your agency needs
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="text-gray-500 max-w-xl mx-auto"
            >
              Six powerful modules working together so your team can focus on
              creative work instead of admin.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((f, i) => {
              const Icon = f.icon
              const isLarge = i === 0
              return (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  custom={i}
                  className={`group rounded-2xl border border-gray-100 p-7 hover:border-purple-200 hover:shadow-lg hover:shadow-purple-50 transition-all duration-300 ${
                    isLarge ? "md:col-span-2" : ""
                  }`}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-5 group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: "#F3E8FF" }}
                  >
                    <Icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {f.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {f.description}
                  </p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ===== 3. CLIENT DASHBOARD PREVIEW ===== */}
      <section className="py-20 bg-purple-50/60 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4"
          >
            Manage every client from one dashboard
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 text-center max-w-xl mx-auto mb-12"
          >
            A single view of all your projects, tasks, and deadlines across
            every client engagement.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden flex"
          >
            {/* Sidebar */}
            <div className="w-56 border-r border-gray-100 bg-gray-50 p-4 hidden md:block">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Clients
              </p>
              {["Prism Digital", "Redthread", "Loom & Co", "Neon Labs"].map(
                (c, i) => (
                  <div
                    key={i}
                    className={`px-3 py-2 rounded-lg text-sm mb-1 cursor-pointer ${
                      i === 0
                        ? "bg-purple-100 text-purple-700 font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {c}
                  </div>
                )
              )}
            </div>

            {/* Kanban */}
            <div className="flex-1 p-5 overflow-x-auto">
              <div className="flex gap-4 min-w-[640px]">
                {[
                  {
                    col: "To Do",
                    color: "bg-gray-200",
                    tasks: ["Brand audit", "Competitor analysis"],
                  },
                  {
                    col: "In Progress",
                    color: "bg-purple-200",
                    tasks: ["Homepage redesign", "Copy review"],
                  },
                  {
                    col: "Review",
                    color: "bg-amber-200",
                    tasks: ["Social templates"],
                  },
                  {
                    col: "Done",
                    color: "bg-green-200",
                    tasks: ["Logo concepts", "Style guide"],
                  },
                ].map((column, ci) => (
                  <div key={ci} className="flex-1 min-w-[140px]">
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${column.color}`}
                      />
                      <span className="text-xs font-semibold text-gray-700">
                        {column.col}
                      </span>
                      <span className="text-xs text-gray-400 ml-auto">
                        {column.tasks.length}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {column.tasks.map((t, ti) => (
                        <div
                          key={ti}
                          className="bg-gray-50 border border-gray-100 rounded-lg p-3 text-xs text-gray-700 hover:border-purple-200 transition-colors"
                        >
                          {t}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== 4. CAPABILITIES - SIDE BY SIDE ===== */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4"
          >
            Advanced capabilities
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 text-center max-w-xl mx-auto mb-14"
          >
            Purpose-built tools that go far beyond generic project management.
          </motion.p>

          <div className="space-y-10">
            {capabilities.map((cap, i) => {
              const isReversed = i % 2 !== 0
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className={`flex flex-col ${
                    isReversed ? "md:flex-row-reverse" : "md:flex-row"
                  } gap-8 items-center`}
                >
                  <div className="md:w-1/2 rounded-2xl overflow-hidden">
                    <img
                      src={cap.image}
                      alt={cap.title}
                      className="w-full h-64 object-cover rounded-2xl"
                    />
                  </div>
                  <div className="md:w-1/2">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {cap.title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                      {cap.description}
                    </p>
                    <ul className="space-y-2">
                      {cap.keyPoints.map((kp, ki) => (
                        <li
                          key={ki}
                          className="flex items-start gap-2 text-sm text-gray-600"
                        >
                          <Check className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
                          {kp}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===== 5. BENEFITS HEXAGON GRID ===== */}
      <section className="py-20 bg-gray-50 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-14"
          >
            Why agencies choose CubicleERP
          </motion.h2>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {benefits.map((b, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                className={`bg-white rounded-2xl p-6 border border-transparent hover:border-purple-200 transition-all duration-300 ${
                  i % 3 === 1 ? "lg:translate-y-6" : ""
                }`}
              >
                <span className="text-3xl font-bold text-purple-200 mb-3 block">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {b.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {b.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== 6. TIME & BILLING SECTION ===== */}
      <section className="py-20 bg-gray-900 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white text-center mb-4"
          >
            Track time, bill accurately,{" "}
            <span className="text-purple-400">grow profitably</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-center max-w-lg mx-auto mb-14"
          >
            From the first tracked minute to the final invoice, every step is
            connected.
          </motion.p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Time Tracker Mock */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gray-800 rounded-2xl p-6 border border-gray-700"
            >
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Time Tracker
              </p>
              {[
                { task: "Homepage redesign", time: "2:34:12", active: true },
                { task: "Brand guidelines", time: "1:15:00", active: false },
                { task: "Social media kit", time: "0:45:30", active: false },
              ].map((entry, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between py-3 ${
                    i !== 2 ? "border-b border-gray-700" : ""
                  }`}
                >
                  <div>
                    <p className="text-sm text-white">{entry.task}</p>
                    <p className="text-xs text-gray-500">Prism Digital</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-sm font-mono ${
                        entry.active ? "text-purple-400" : "text-gray-400"
                      }`}
                    >
                      {entry.time}
                    </span>
                    {entry.active ? (
                      <Pause className="w-4 h-4 text-purple-400" />
                    ) : (
                      <Play className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between">
                <span className="text-xs text-gray-400">Today&apos;s total</span>
                <span className="text-sm font-mono text-purple-400">
                  4:34:42
                </span>
              </div>
            </motion.div>

            {/* Invoice Preview */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gray-800 rounded-2xl p-6 border border-gray-700"
            >
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Invoice Preview
              </p>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-white font-semibold">INV-2024-0147</p>
                  <p className="text-xs text-gray-500">Prism Digital Agency</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-medium">
                  Draft
                </span>
              </div>
              {[
                { item: "Strategy & Research", hrs: "12h", amt: "$1,800" },
                { item: "Design & Creative", hrs: "24h", amt: "$3,600" },
                { item: "Development", hrs: "18h", amt: "$2,700" },
              ].map((line, i) => (
                <div
                  key={i}
                  className="flex justify-between text-sm py-2 border-b border-gray-700"
                >
                  <span className="text-gray-300">{line.item}</span>
                  <div className="flex gap-6">
                    <span className="text-gray-500">{line.hrs}</span>
                    <span className="text-white">{line.amt}</span>
                  </div>
                </div>
              ))}
              <div className="flex justify-between mt-4 pt-3">
                <span className="text-gray-400 font-medium">Total</span>
                <span className="text-purple-400 font-bold text-lg">
                  $8,100
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== 7. INTEGRATIONS ===== */}
      <section className="py-20 bg-purple-50/40 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4"
          >
            Connects with your toolkit
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 text-center max-w-md mx-auto mb-12"
          >
            Seamless integrations with the tools your agency already uses daily.
          </motion.p>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
          >
            {integrations.map((intg, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                className="bg-white rounded-xl border border-gray-100 p-4 text-center hover:border-purple-200 hover:shadow-md transition-all"
              >
                <p className="text-sm font-semibold text-gray-800">
                  {intg.name}
                </p>
                <p className="text-xs text-gray-400 mt-1">{intg.category}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== 8. HOW IT WORKS ===== */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-14"
          >
            Get started in three steps
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* Arrow connectors */}
            <div className="hidden md:block absolute top-12 left-[33%] w-[34%] h-0.5 bg-purple-100">
              <ArrowRight className="w-5 h-5 text-purple-300 absolute -right-2.5 -top-2.5" />
            </div>
            <div className="hidden md:block absolute top-12 left-[66%] w-[28%] h-0.5 bg-purple-100">
              <ArrowRight className="w-5 h-5 text-purple-300 absolute -right-2.5 -top-2.5" />
            </div>

            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-white rounded-2xl border border-gray-100 p-6"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm mb-5"
                  style={{ backgroundColor: PRIMARY }}
                >
                  {s.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {s.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 9. USE CASES ===== */}
      <section className="py-20 bg-gray-50 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-14"
          >
            Built for every type of agency
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6">
            {useCases.map((uc, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="bg-white rounded-2xl p-6 border-t-4 border-purple-500"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {uc.title}
                </h3>
                <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                  {uc.description}
                </p>
                <ul className="space-y-2">
                  {uc.highlights.map((h, hi) => (
                    <li
                      key={hi}
                      className="flex items-start gap-2 text-sm text-gray-600"
                    >
                      <Check className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 10. COMPARISON TABLE ===== */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-14"
          >
            Traditional tools vs. CubicleERP
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-purple-100 overflow-hidden"
          >
            <table className="w-full">
              <thead>
                <tr className="bg-purple-600 text-white">
                  <th className="text-left text-sm font-semibold py-3 px-5">
                    Feature
                  </th>
                  <th className="text-left text-sm font-semibold py-3 px-5">
                    Traditional
                  </th>
                  <th className="text-left text-sm font-semibold py-3 px-5">
                    CubicleERP
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((c, i) => (
                  <tr
                    key={i}
                    className={i % 2 === 0 ? "bg-purple-50/40" : "bg-white"}
                  >
                    <td className="py-3 px-5 text-sm font-medium text-gray-800">
                      {c.feature}
                    </td>
                    <td className="py-3 px-5 text-sm text-gray-500 flex items-center gap-2">
                      <X className="w-4 h-4 text-red-400 shrink-0" />
                      {c.traditional}
                    </td>
                    <td className="py-3 px-5 text-sm text-purple-700 font-medium">
                      <span className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-purple-500 shrink-0" />
                        {c.cubicleErp}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* ===== 11. TESTIMONIALS ===== */}
      <section className="py-20 bg-gray-50 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-14"
          >
            Trusted by agency leaders
          </motion.h2>

          <div className="grid md:grid-cols-5 gap-6">
            {/* Featured large testimonial */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-3 bg-white rounded-2xl p-8 border border-purple-100 relative"
            >
              <div className="text-purple-200 text-6xl font-serif absolute top-4 left-6">
                &ldquo;
              </div>
              <p className="text-gray-700 leading-relaxed text-lg mt-8 mb-6">
                {testimonials[0].quote}
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">
                    {testimonials[0].author}
                  </p>
                  <p className="text-sm text-gray-500">
                    {testimonials[0].role}, {testimonials[0].company}
                  </p>
                </div>
                <span className="px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">
                  {testimonials[0].metric}
                </span>
              </div>
            </motion.div>

            {/* Two smaller testimonials */}
            <div className="md:col-span-2 space-y-6">
              {testimonials.slice(1).map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i + 1) * 0.1 }}
                  className="bg-white rounded-2xl p-6 border border-gray-100"
                >
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {t.author}
                  </p>
                  <p className="text-xs text-gray-500">
                    {t.role}, {t.company}
                  </p>
                  <span className="inline-block mt-2 px-2.5 py-1 rounded-full bg-purple-50 text-purple-600 text-xs font-medium">
                    {t.metric}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== 12. FAQ ACCORDION ===== */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-14"
          >
            Frequently asked questions
          </motion.h2>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="border border-gray-100 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-semibold text-gray-800 pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-purple-500 shrink-0 transition-transform ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5">
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 13. CTA ===== */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto rounded-3xl text-center py-16 px-8"
          style={{
            background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
          }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to run your agency smarter?
          </h2>
          <p className="text-purple-100 max-w-lg mx-auto mb-8">
            Join 800+ agencies that use CubicleERP to unify clients, projects,
            and billing in one platform.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/get-started"
              className="px-7 py-3 rounded-lg bg-white text-purple-700 font-semibold text-sm hover:bg-purple-50 transition-colors"
            >
              Start Free Trial
            </Link>
            <Link
              href="/contact"
              className="px-7 py-3 rounded-lg border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-colors"
            >
              Talk to Sales
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ===== 14. LP2CTA + LP2Footer ===== */}
      <LP2CTA />
      <LP2Footer />
    </main>
  )
}
