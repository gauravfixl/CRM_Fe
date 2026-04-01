"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import LP2Navbar from "@/components/landingpage2/LP2Navbar"
import LP2CTA from "@/components/landingpage2/LP2CTA"
import LP2Footer from "@/components/landingpage2/LP2Footer"
import {
  ArrowLeft,
  ArrowRight,
  Users,
  UserCheck,
  Briefcase,
  DollarSign,
  HeadphonesIcon,
  BarChart3,
  CheckCircle2,
} from "lucide-react"

const tourSteps = [
  {
    number: "01",
    module: "CRM",
    icon: Users,
    color: "#0067B8",
    bg: "#EBF3FB",
    title: "Manage your entire sales pipeline",
    description:
      "Track every lead from first touch to closed deal. CubicleERP CRM gives you full visibility into your pipeline with AI-powered scoring, automated follow-ups, and real-time analytics.",
    features: ["Lead scoring", "Deal tracking", "Contact management", "Pipeline analytics"],
    mockUI: "crm",
  },
  {
    number: "02",
    module: "HRM",
    icon: UserCheck,
    color: "#107C10",
    bg: "#E8F5E9",
    title: "Streamline your HR operations",
    description:
      "From recruitment to payroll, manage your entire employee lifecycle. Automate attendance, run performance reviews, and keep your team engaged — all from one dashboard.",
    features: ["Employee directory", "Attendance tracking", "Payroll automation", "Performance reviews"],
    mockUI: "hrm",
  },
  {
    number: "03",
    module: "Project Management",
    icon: Briefcase,
    color: "#5C2D91",
    bg: "#F3EBF9",
    title: "Deliver projects on time, every time",
    description:
      "Plan, track, and deliver with Kanban boards, Gantt charts, task dependencies, and real-time collaboration. Keep every team member aligned and every deadline met.",
    features: ["Kanban boards", "Task dependencies", "Time tracking", "Team collaboration"],
    mockUI: "pm",
  },
  {
    number: "04",
    module: "Finance",
    icon: DollarSign,
    color: "#008575",
    bg: "#E0F2F1",
    title: "Take control of your finances",
    description:
      "Generate invoices, track expenses, create financial reports, and plan budgets — all connected to your CRM and project data for a complete picture of your business health.",
    features: ["Invoice generation", "Expense tracking", "Financial reports", "Budget planning"],
    mockUI: "finance",
  },
  {
    number: "05",
    module: "Helpdesk",
    icon: HeadphonesIcon,
    color: "#D83B01",
    bg: "#FFF0E8",
    title: "Deliver exceptional customer support",
    description:
      "Resolve tickets faster with smart routing, SLA tracking, and a self-service knowledge base. Keep customers happy and your support team productive.",
    features: ["Ticket management", "SLA tracking", "Auto-assignment", "Knowledge base"],
    mockUI: "helpdesk",
  },
  {
    number: "06",
    module: "Analytics",
    icon: BarChart3,
    color: "#0891B2",
    bg: "#E0F7FA",
    title: "Make data-driven decisions",
    description:
      "Build custom dashboards, track KPIs in real-time, export reports, and let AI surface insights you might have missed. Every module feeds into your analytics engine.",
    features: ["Custom dashboards", "Real-time metrics", "Export reports", "AI insights"],
    mockUI: "analytics",
  },
]

function CRMMockUI() {
  const stages = [
    { name: "Lead", count: 12, color: "#3B82F6", deals: ["Acme Corp", "TechStart"] },
    { name: "Qualified", count: 8, color: "#F59E0B", deals: ["DataFlow", "NexGen"] },
    { name: "Proposal", count: 5, color: "#8B5CF6", deals: ["CloudSync"] },
    { name: "Won", count: 3, color: "#10B981", deals: ["ScaleUp", "BluePrint"] },
  ]
  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#E5E5E5] p-4 w-full">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-[#1A1A1A]">Sales Pipeline</span>
        <span className="text-xs text-[#6B6B6B]">Q1 2026</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {stages.map((s) => (
          <div key={s.name} className="text-center">
            <div className="text-xs font-medium text-[#505050] mb-1">{s.name}</div>
            <div className="h-1.5 rounded-full mb-2" style={{ backgroundColor: s.color, opacity: 0.2 }}>
              <div className="h-full rounded-full" style={{ backgroundColor: s.color, width: `${(s.count / 12) * 100}%` }} />
            </div>
            <div className="space-y-1">
              {s.deals.map((d) => (
                <div key={d} className="text-[10px] bg-[#F5F5F5] rounded px-2 py-1 truncate">{d}</div>
              ))}
            </div>
            <div className="text-lg font-bold mt-1" style={{ color: s.color }}>{s.count}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function HRMMockUI() {
  const employees = [
    { name: "Sarah K.", role: "Designer", status: "Active", color: "#10B981" },
    { name: "Mike T.", role: "Developer", status: "Remote", color: "#3B82F6" },
    { name: "Anna L.", role: "HR Lead", status: "Active", color: "#10B981" },
    { name: "James P.", role: "Manager", status: "On Leave", color: "#F59E0B" },
  ]
  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#E5E5E5] p-4 w-full">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-[#1A1A1A]">Employee Directory</span>
        <span className="text-xs text-[#6B6B6B]">24 members</span>
      </div>
      <div className="space-y-2">
        {employees.map((emp) => (
          <div key={emp.name} className="flex items-center justify-between py-2 border-b border-[#F5F5F5] last:border-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#EBF3FB] flex items-center justify-center text-xs font-bold text-[#0067B8]">
                {emp.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <p className="text-xs font-medium text-[#1A1A1A]">{emp.name}</p>
                <p className="text-[10px] text-[#6B6B6B]">{emp.role}</p>
              </div>
            </div>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: emp.color + "15", color: emp.color }}>
              {emp.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function PMMockUI() {
  const columns = [
    { name: "To Do", color: "#6B7280", tasks: ["Design mockups", "Write specs"] },
    { name: "In Progress", color: "#3B82F6", tasks: ["Build API", "Setup CI/CD"] },
    { name: "Done", color: "#10B981", tasks: ["Database schema", "Auth flow"] },
  ]
  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#E5E5E5] p-4 w-full">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-[#1A1A1A]">Sprint Board</span>
        <span className="text-xs text-[#6B6B6B]">Sprint 14</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {columns.map((col) => (
          <div key={col.name}>
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }} />
              <span className="text-[10px] font-semibold text-[#505050]">{col.name}</span>
            </div>
            <div className="space-y-1.5">
              {col.tasks.map((t) => (
                <div key={t} className="bg-[#F9FAFB] border border-[#E5E5E5] rounded-lg px-2.5 py-2 text-[10px] text-[#1A1A1A]">
                  {t}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function FinanceMockUI() {
  const bars = [65, 80, 45, 90, 70, 55]
  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#E5E5E5] p-4 w-full">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-[#1A1A1A]">Financial Overview</span>
        <span className="text-xs text-[#6B6B6B]">March 2026</span>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-[#E8F5E9] rounded-lg p-2.5 text-center">
          <p className="text-[10px] text-[#6B6B6B]">Revenue</p>
          <p className="text-sm font-bold text-[#107C10]">$48.5K</p>
        </div>
        <div className="bg-[#FFF0E8] rounded-lg p-2.5 text-center">
          <p className="text-[10px] text-[#6B6B6B]">Expenses</p>
          <p className="text-sm font-bold text-[#D83B01]">$21.2K</p>
        </div>
        <div className="bg-[#EBF3FB] rounded-lg p-2.5 text-center">
          <p className="text-[10px] text-[#6B6B6B]">Profit</p>
          <p className="text-sm font-bold text-[#0067B8]">$27.3K</p>
        </div>
      </div>
      <div className="flex items-end gap-1.5 h-16">
        {bars.map((h, i) => (
          <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, backgroundColor: i % 2 === 0 ? "#0067B8" : "#0067B820" }} />
        ))}
      </div>
    </div>
  )
}

function HelpdeskMockUI() {
  const tickets = [
    { id: "TK-401", subject: "Login issue", priority: "High", color: "#DC2626" },
    { id: "TK-402", subject: "Billing question", priority: "Medium", color: "#F59E0B" },
    { id: "TK-403", subject: "Feature request", priority: "Low", color: "#10B981" },
    { id: "TK-404", subject: "Data export bug", priority: "Urgent", color: "#7C3AED" },
  ]
  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#E5E5E5] p-4 w-full">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-[#1A1A1A]">Open Tickets</span>
        <span className="text-xs text-[#6B6B6B]">12 open</span>
      </div>
      <div className="space-y-2">
        {tickets.map((t) => (
          <div key={t.id} className="flex items-center justify-between py-1.5 border-b border-[#F5F5F5] last:border-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-[#6B6B6B]">{t.id}</span>
              <span className="text-xs text-[#1A1A1A]">{t.subject}</span>
            </div>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: t.color + "15", color: t.color }}>
              {t.priority}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function AnalyticsMockUI() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#E5E5E5] p-4 w-full">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-[#1A1A1A]">Dashboard</span>
        <span className="text-xs text-[#6B6B6B]">Live</span>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {[
          { label: "Users", value: "2,847", change: "+12%" },
          { label: "Revenue", value: "$48.5K", change: "+8%" },
          { label: "Deals", value: "156", change: "+23%" },
          { label: "Tickets", value: "42", change: "-15%" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-[#F9FAFB] rounded-lg p-2.5">
            <p className="text-[10px] text-[#6B6B6B]">{kpi.label}</p>
            <p className="text-sm font-bold text-[#1A1A1A]">{kpi.value}</p>
            <p className="text-[10px]" style={{ color: kpi.change.startsWith("+") ? "#10B981" : "#DC2626" }}>{kpi.change}</p>
          </div>
        ))}
      </div>
      <svg className="w-full h-12" viewBox="0 0 200 40">
        <polyline fill="none" stroke="#0067B8" strokeWidth="2" points="0,35 30,28 60,30 90,15 120,20 150,8 180,12 200,5" />
        <polyline fill="none" stroke="#0067B820" strokeWidth="1" strokeDasharray="4" points="0,30 30,32 60,25 90,28 120,22 150,26 180,20 200,18" />
      </svg>
    </div>
  )
}

const mockUIs: Record<string, () => JSX.Element> = {
  crm: CRMMockUI,
  hrm: HRMMockUI,
  pm: PMMockUI,
  finance: FinanceMockUI,
  helpdesk: HelpdeskMockUI,
  analytics: AnalyticsMockUI,
}

export default function GuidedTourPage() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Segoe UI', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <LP2Navbar />

      {/* Hero */}
      <section
        className="relative pt-24 pb-14 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #EBF3FB 0%, #F3EBF9 40%, #E0F2F1 70%, #FFF8E1 100%)" }}
      >
        <div className="absolute inset-0 bg-white/40 pointer-events-none" />
        <div className="relative max-w-[1280px] mx-auto px-6">
          <Link href="/#overview" className="inline-flex items-center gap-1.5 text-[#505050] text-sm hover:text-[#0067B8] transition-colors mb-6">
            <ArrowLeft size={15} /> Back to overview
          </Link>
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-white/50 text-[#0067B8] px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-5">
              <Briefcase className="w-3.5 h-3.5" />
              Platform Tour
            </span>
            <h1 className="text-[36px] lg:text-[48px] font-bold text-[#1A1A1A] leading-tight">
              See CubicleERP in action
            </h1>
            <p className="mt-4 text-lg text-[#505050] max-w-2xl mx-auto leading-relaxed">
              Take a walkthrough of every module and discover how CubicleERP can transform your business operations.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-6">
              {[
                { icon: Users, label: "CRM", color: "#0067B8" },
                { icon: UserCheck, label: "HRM", color: "#107C10" },
                { icon: Briefcase, label: "Projects", color: "#5C2D91" },
                { icon: DollarSign, label: "Finance", color: "#008575" },
                { icon: HeadphonesIcon, label: "Helpdesk", color: "#D83B01" },
                { icon: BarChart3, label: "Analytics", color: "#0891B2" },
              ].map((mod) => (
                <div key={mod.label} className="flex flex-col items-center gap-1.5">
                  <div className="w-12 h-12 rounded-xl bg-white/80 backdrop-blur-sm shadow-sm flex items-center justify-center">
                    <mod.icon size={22} style={{ color: mod.color }} />
                  </div>
                  <span className="text-xs font-medium text-[#505050]">{mod.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tour Steps */}
      <section className="py-12">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="space-y-20">
            {tourSteps.map((step, i) => {
              const MockComponent = mockUIs[step.mockUI]
              const isReversed = i % 2 !== 0

              return (
                <motion.div
                  key={step.module}
                  className={`flex flex-col ${isReversed ? "lg:flex-row-reverse" : "lg:flex-row"} gap-10 items-center`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6 }}
                >
                  {/* Text */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold"
                        style={{ backgroundColor: step.color }}
                      >
                        {step.number}
                      </div>
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: step.bg }}
                      >
                        <step.icon size={18} style={{ color: step.color }} />
                      </div>
                      <span className="text-sm font-semibold" style={{ color: step.color }}>
                        {step.module}
                      </span>
                    </div>
                    <h3 className="text-[24px] font-semibold text-[#1A1A1A] mb-3">
                      {step.title}
                    </h3>
                    <p className="text-[15px] text-[#505050] leading-relaxed mb-5">
                      {step.description}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {step.features.map((f) => (
                        <div key={f} className="flex items-center gap-2">
                          <CheckCircle2 size={16} style={{ color: step.color }} />
                          <span className="text-[13px] text-[#1A1A1A]">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mock UI */}
                  <div className="flex-1 w-full max-w-md">
                    <div className="rounded-2xl p-4" style={{ backgroundColor: step.bg }}>
                      <MockComponent />
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-[#F5F5F5]">
        <div className="max-w-[1280px] mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-[28px] font-semibold text-[#1A1A1A] mb-4">Ready to get started?</h2>
            <p className="text-[#6B6B6B] text-lg mb-8 max-w-xl mx-auto">
              Experience the full platform with a free trial — no credit card required.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-[#0067B8] text-white font-semibold text-[15px] hover:bg-[#005DA6] transition-colors"
              >
                Start free trial <ArrowRight size={16} />
              </Link>
              <Link
                href="/auth/signin"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg border border-[#E5E5E5] text-[#1A1A1A] font-semibold text-[15px] hover:bg-white transition-colors"
              >
                Contact sales
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <LP2CTA />
      <LP2Footer />
    </div>
  )
}