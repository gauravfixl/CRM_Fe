"use client"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  Users,
  UserCheck,
  Briefcase,
  DollarSign,
  HeadphonesIcon,
  BarChart3,
  Check,
  ArrowRight,
  ChevronRight,
} from "lucide-react"
import { useIntersection } from "./hooks/useIntersection"

/* ------------------------------------------------------------------ */
/*  Mock UI components for each tab                                    */
/* ------------------------------------------------------------------ */

function CRMMockUI() {
  const stages = [
    {
      name: "Lead",
      color: "bg-blue-100",
      cards: [
        { name: "Acme Corp", value: "$12,000", color: "bg-blue-500" },
        { name: "Globex Inc", value: "$8,500", color: "bg-blue-400" },
      ],
    },
    {
      name: "Qualified",
      color: "bg-indigo-100",
      cards: [
        { name: "Initech", value: "$24,000", color: "bg-indigo-500" },
        { name: "Wayne Ent.", value: "$18,000", color: "bg-indigo-400" },
      ],
    },
    {
      name: "Proposal",
      color: "bg-violet-100",
      cards: [
        { name: "Stark Ind.", value: "$45,000", color: "bg-violet-500" },
      ],
    },
    {
      name: "Closed Won",
      color: "bg-green-100",
      cards: [
        { name: "Oscorp", value: "$32,000", color: "bg-green-500" },
        { name: "Umbrella Co", value: "$19,500", color: "bg-green-400" },
      ],
    },
  ]

  return (
    <div className="bg-white rounded-lg p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[13px] font-semibold text-[#1A1A1A]">
          Sales Pipeline
        </span>
        <span className="text-[11px] text-[#0067B8] font-medium">
          Q1 2026
        </span>
      </div>
      <div className="grid grid-cols-4 gap-2 h-[calc(100%-32px)]">
        {stages.map((stage) => (
          <div key={stage.name} className="flex flex-col">
            <div
              className={`text-[10px] font-semibold text-[#505050] uppercase tracking-wide mb-2 px-1`}
            >
              {stage.name}
            </div>
            <div className={`${stage.color} rounded-lg p-1.5 flex-1 space-y-1.5`}>
              {stage.cards.map((card) => (
                <div
                  key={card.name}
                  className="bg-white rounded-md p-2 shadow-sm"
                >
                  <div
                    className={`w-full h-1 ${card.color} rounded-full mb-1.5`}
                  />
                  <div className="text-[10px] font-medium text-[#1A1A1A] truncate">
                    {card.name}
                  </div>
                  <div className="text-[9px] text-[#505050] mt-0.5">
                    {card.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function HRMMockUI() {
  const employees = [
    { name: "Sarah Chen", role: "Engineering Lead", status: "Active", avatar: "SC", color: "bg-emerald-500" },
    { name: "James Wilson", role: "Product Designer", status: "On Leave", avatar: "JW", color: "bg-amber-500" },
    { name: "Maria Garcia", role: "HR Manager", status: "Active", avatar: "MG", color: "bg-emerald-500" },
    { name: "David Kim", role: "Data Analyst", status: "Active", avatar: "DK", color: "bg-emerald-500" },
    { name: "Emily Brown", role: "Marketing Lead", status: "Remote", avatar: "EB", color: "bg-blue-500" },
  ]

  return (
    <div className="bg-white rounded-lg p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[13px] font-semibold text-[#1A1A1A]">
          Employee Directory
        </span>
        <span className="text-[11px] bg-[#F0F6FF] text-[#0067B8] px-2 py-0.5 rounded-full font-medium">
          128 active
        </span>
      </div>
      <div className="space-y-2">
        {employees.map((emp) => (
          <div
            key={emp.name}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 border border-gray-100"
          >
            <div className="w-8 h-8 rounded-full bg-[#0067B8] flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0">
              {emp.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-medium text-[#1A1A1A] truncate">
                {emp.name}
              </div>
              <div className="text-[9px] text-[#505050]">{emp.role}</div>
            </div>
            <span
              className={`text-[9px] px-2 py-0.5 rounded-full text-white font-medium ${emp.color}`}
            >
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
    {
      name: "To Do",
      color: "border-gray-300",
      tasks: [
        { title: "Design system update", tag: "Design", tagColor: "bg-purple-100 text-purple-700" },
        { title: "API documentation", tag: "Docs", tagColor: "bg-blue-100 text-blue-700" },
      ],
    },
    {
      name: "In Progress",
      color: "border-amber-400",
      tasks: [
        { title: "User auth module", tag: "Dev", tagColor: "bg-green-100 text-green-700" },
        { title: "Dashboard redesign", tag: "Design", tagColor: "bg-purple-100 text-purple-700" },
      ],
    },
    {
      name: "Review",
      color: "border-blue-400",
      tasks: [
        { title: "Payment integration", tag: "Dev", tagColor: "bg-green-100 text-green-700" },
      ],
    },
    {
      name: "Done",
      color: "border-emerald-400",
      tasks: [
        { title: "Onboarding flow", tag: "Dev", tagColor: "bg-green-100 text-green-700" },
        { title: "Brand guidelines", tag: "Design", tagColor: "bg-purple-100 text-purple-700" },
      ],
    },
  ]

  return (
    <div className="bg-white rounded-lg p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[13px] font-semibold text-[#1A1A1A]">
          Sprint Board
        </span>
        <span className="text-[11px] text-[#505050]">Sprint 14 &middot; 7 days left</span>
      </div>
      <div className="grid grid-cols-4 gap-2 h-[calc(100%-32px)]">
        {columns.map((col) => (
          <div key={col.name}>
            <div
              className={`text-[10px] font-semibold text-[#505050] uppercase tracking-wide mb-2 pb-1 border-b-2 ${col.color}`}
            >
              {col.name}
            </div>
            <div className="space-y-1.5">
              {col.tasks.map((task) => (
                <div
                  key={task.title}
                  className="bg-gray-50 rounded-md p-2 border border-gray-100"
                >
                  <div className="text-[10px] font-medium text-[#1A1A1A]">
                    {task.title}
                  </div>
                  <span
                    className={`inline-block text-[8px] px-1.5 py-0.5 rounded mt-1 font-medium ${task.tagColor}`}
                  >
                    {task.tag}
                  </span>
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
  const invoices = [
    { id: "INV-2041", client: "Acme Corp", amount: "$4,200", status: "Paid", statusColor: "bg-emerald-500" },
    { id: "INV-2042", client: "Globex Inc", amount: "$8,750", status: "Pending", statusColor: "bg-amber-500" },
    { id: "INV-2043", client: "Initech", amount: "$3,100", status: "Paid", statusColor: "bg-emerald-500" },
    { id: "INV-2044", client: "Wayne Ent.", amount: "$12,400", status: "Overdue", statusColor: "bg-red-500" },
  ]

  return (
    <div className="bg-white rounded-lg p-4 h-full">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[13px] font-semibold text-[#1A1A1A]">
          Financial Overview
        </span>
        <span className="text-[11px] text-[#505050]">March 2026</span>
      </div>
      {/* Mini chart area */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[
          { label: "Revenue", value: "$142K", change: "+12%" },
          { label: "Expenses", value: "$89K", change: "-3%" },
          { label: "Profit", value: "$53K", change: "+18%" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-gray-50 rounded-lg p-2 border border-gray-100"
          >
            <div className="text-[9px] text-[#505050] uppercase tracking-wide">
              {stat.label}
            </div>
            <div className="text-[13px] font-bold text-[#1A1A1A] mt-0.5">
              {stat.value}
            </div>
            <div className="text-[9px] text-emerald-600 font-medium">
              {stat.change}
            </div>
          </div>
        ))}
      </div>
      {/* Chart placeholder */}
      <div className="bg-gradient-to-t from-blue-50 to-transparent rounded-lg h-14 mb-3 flex items-end px-2 pb-1 gap-1.5 border border-gray-100">
        {[40, 55, 35, 70, 60, 80, 65, 90, 75, 85, 95, 88].map((h, i) => (
          <div
            key={i}
            className="flex-1 bg-[#0067B8] rounded-t-sm opacity-70"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      {/* Invoice list */}
      <div className="space-y-1.5">
        {invoices.map((inv) => (
          <div
            key={inv.id}
            className="flex items-center justify-between py-1.5 px-2 rounded border border-gray-100 bg-gray-50"
          >
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-[#505050] font-mono">
                {inv.id}
              </span>
              <span className="text-[10px] text-[#1A1A1A] font-medium">
                {inv.client}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold text-[#1A1A1A]">
                {inv.amount}
              </span>
              <span
                className={`text-[8px] px-1.5 py-0.5 rounded-full text-white font-medium ${inv.statusColor}`}
              >
                {inv.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function HelpdeskMockUI() {
  const tickets = [
    { id: "#4821", subject: "Login issue on mobile app", priority: "High", priorityColor: "bg-red-100 text-red-700", time: "2m ago", assignee: "AK" },
    { id: "#4820", subject: "Payment not processing", priority: "Urgent", priorityColor: "bg-red-500 text-white", time: "8m ago", assignee: "SC" },
    { id: "#4819", subject: "Feature request: dark mode", priority: "Low", priorityColor: "bg-gray-100 text-gray-600", time: "15m ago", assignee: "JW" },
    { id: "#4818", subject: "Data export failing", priority: "Medium", priorityColor: "bg-amber-100 text-amber-700", time: "22m ago", assignee: "MG" },
    { id: "#4817", subject: "Account upgrade inquiry", priority: "Low", priorityColor: "bg-gray-100 text-gray-600", time: "35m ago", assignee: "EB" },
  ]

  return (
    <div className="bg-white rounded-lg p-4 h-full">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[13px] font-semibold text-[#1A1A1A]">
          Support Tickets
        </span>
        <div className="flex gap-1.5">
          <span className="text-[9px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
            3 Open
          </span>
          <span className="text-[9px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
            12 Pending
          </span>
        </div>
      </div>
      <div className="space-y-1.5">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="flex items-center gap-2 p-2 rounded-lg border border-gray-100 bg-gray-50"
          >
            <span className="text-[9px] text-[#505050] font-mono w-10 flex-shrink-0">
              {ticket.id}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-medium text-[#1A1A1A] truncate">
                {ticket.subject}
              </div>
              <div className="text-[8px] text-[#707070] mt-0.5">
                {ticket.time}
              </div>
            </div>
            <span
              className={`text-[8px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ${ticket.priorityColor}`}
            >
              {ticket.priority}
            </span>
            <div className="w-6 h-6 rounded-full bg-[#0067B8] flex items-center justify-center text-white text-[8px] font-semibold flex-shrink-0">
              {ticket.assignee}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AnalyticsMockUI() {
  return (
    <div className="bg-white rounded-lg p-4 h-full">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[13px] font-semibold text-[#1A1A1A]">
          Analytics Dashboard
        </span>
        <span className="text-[11px] text-[#505050]">Real-time</span>
      </div>
      {/* KPI row */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        {[
          { label: "Users", value: "24.8K", change: "+8.2%" },
          { label: "Sessions", value: "68.3K", change: "+12.1%" },
          { label: "Conversion", value: "3.42%", change: "+0.8%" },
          { label: "Revenue", value: "$186K", change: "+15.4%" },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="bg-gray-50 rounded-lg p-2 border border-gray-100"
          >
            <div className="text-[8px] text-[#505050] uppercase tracking-wide">
              {kpi.label}
            </div>
            <div className="text-[12px] font-bold text-[#1A1A1A] mt-0.5">
              {kpi.value}
            </div>
            <div className="text-[8px] text-emerald-600 font-medium">
              {kpi.change}
            </div>
          </div>
        ))}
      </div>
      {/* Charts row */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {/* Line chart mockup */}
        <div className="bg-gray-50 rounded-lg p-2 border border-gray-100">
          <div className="text-[9px] font-medium text-[#505050] mb-1">
            Traffic Trend
          </div>
          <svg viewBox="0 0 200 60" className="w-full h-10">
            <polyline
              points="0,50 20,45 40,30 60,35 80,20 100,25 120,15 140,18 160,8 180,12 200,5"
              fill="none"
              stroke="#0067B8"
              strokeWidth="2"
            />
            <polyline
              points="0,50 20,45 40,30 60,35 80,20 100,25 120,15 140,18 160,8 180,12 200,5"
              fill="url(#blueGrad)"
              stroke="none"
            />
            <defs>
              <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0067B8" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#0067B8" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        {/* Donut chart mockup */}
        <div className="bg-gray-50 rounded-lg p-2 border border-gray-100">
          <div className="text-[9px] font-medium text-[#505050] mb-1">
            Source Breakdown
          </div>
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 36 36" className="w-10 h-10">
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="#E5E5E5"
                strokeWidth="4"
              />
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="#0067B8"
                strokeWidth="4"
                strokeDasharray="52 88"
                strokeDashoffset="25"
              />
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="#107C10"
                strokeWidth="4"
                strokeDasharray="26 88"
                strokeDashoffset="73"
              />
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="#D83B01"
                strokeWidth="4"
                strokeDasharray="10 88"
                strokeDashoffset="99"
              />
            </svg>
            <div className="space-y-0.5">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0067B8]" />
                <span className="text-[8px] text-[#505050]">Organic 59%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#107C10]" />
                <span className="text-[8px] text-[#505050]">Referral 29%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D83B01]" />
                <span className="text-[8px] text-[#505050]">Paid 12%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="bg-gray-50 rounded-lg p-2 border border-gray-100">
        <div className="text-[9px] font-medium text-[#505050] mb-1.5">
          Top Pages
        </div>
        {[
          { page: "/dashboard", views: "12,482", bounce: "18%" },
          { page: "/products", views: "8,241", bounce: "24%" },
          { page: "/pricing", views: "6,103", bounce: "31%" },
        ].map((row) => (
          <div
            key={row.page}
            className="flex items-center justify-between py-1 border-b border-gray-100 last:border-0"
          >
            <span className="text-[9px] text-[#1A1A1A] font-mono">
              {row.page}
            </span>
            <div className="flex gap-3">
              <span className="text-[9px] text-[#505050]">{row.views}</span>
              <span className="text-[9px] text-[#505050]">{row.bounce}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Tab data                                                           */
/* ------------------------------------------------------------------ */

interface TabData {
  key: string
  label: string
  icon: React.ElementType
  tagline: string
  productName: string
  productColor: string
  features: string[]
  statValue: string
  statLabel: string
  mockUI: React.ReactNode
}

const tabs: TabData[] = [
  {
    key: "crm",
    label: "CRM",
    icon: Users,
    tagline:
      "Close more deals and deepen customer relationships with AI assistance.",
    productName: "Cubicle CRM",
    productColor: "#0067B8",
    features: [
      "AI-powered lead scoring and prioritization",
      "360-degree customer view with interaction history",
      "Automated follow-ups and email sequences",
      "Visual pipeline management with drag-and-drop",
      "Real-time revenue forecasting and reporting",
    ],
    statValue: "40%",
    statLabel: "increase in lead conversion",
    mockUI: <CRMMockUI />,
  },
  {
    key: "hrm",
    label: "HRM",
    icon: UserCheck,
    tagline:
      "Empower your HR team to manage people operations at scale.",
    productName: "Cubicle HRM",
    productColor: "#0067B8",
    features: [
      "Streamlined employee onboarding and offboarding",
      "Automated payroll and tax calculations",
      "Leave management with smart approval workflows",
      "Performance reviews with 360-degree feedback",
      "Organizational charts and workforce analytics",
    ],
    statValue: "60%",
    statLabel: "faster payroll processing",
    mockUI: <HRMMockUI />,
  },
  {
    key: "pm",
    label: "Project Management",
    icon: Briefcase,
    tagline:
      "Plan, execute, and deliver projects with full visibility.",
    productName: "Cubicle Projects",
    productColor: "#0067B8",
    features: [
      "Kanban, Gantt, and timeline views for every workflow",
      "AI-assisted task assignment and workload balancing",
      "Sprint planning with velocity tracking",
      "Time tracking and resource utilization reports",
      "Cross-project dependency management",
    ],
    statValue: "91%",
    statLabel: "on-time delivery",
    mockUI: <PMMockUI />,
  },
  {
    key: "finance",
    label: "Finance",
    icon: DollarSign,
    tagline:
      "Get complete visibility over your financial operations.",
    productName: "Cubicle Finance",
    productColor: "#0067B8",
    features: [
      "Automated invoicing and recurring billing",
      "Multi-currency support with real-time conversion",
      "Expense tracking with receipt scanning",
      "Financial reporting and cash flow forecasting",
      "Tax compliance and audit trail management",
    ],
    statValue: "35%",
    statLabel: "reduction in billing errors",
    mockUI: <FinanceMockUI />,
  },
  {
    key: "helpdesk",
    label: "Helpdesk",
    icon: HeadphonesIcon,
    tagline:
      "Deliver exceptional support with intelligent ticketing.",
    productName: "Cubicle Helpdesk",
    productColor: "#0067B8",
    features: [
      "AI-powered ticket routing and prioritization",
      "Multi-channel support: email, chat, and phone",
      "Knowledge base with smart article suggestions",
      "SLA tracking with automatic escalation rules",
      "Customer satisfaction surveys and CSAT analytics",
    ],
    statValue: "96%",
    statLabel: "customer satisfaction",
    mockUI: <HelpdeskMockUI />,
  },
  {
    key: "analytics",
    label: "Analytics",
    icon: BarChart3,
    tagline:
      "Make data-driven decisions with real-time AI insights.",
    productName: "Cubicle Analytics",
    productColor: "#0067B8",
    features: [
      "Real-time dashboards with customizable widgets",
      "AI-generated insights and anomaly detection",
      "Cross-module data aggregation and reporting",
      "Predictive analytics with trend forecasting",
      "Scheduled reports with automated distribution",
    ],
    statValue: "3x",
    statLabel: "faster decisions",
    mockUI: <AnalyticsMockUI />,
  },
]

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function LP2ProductDemos() {
  const [activeTab, setActiveTab] = useState(0)
  const [sectionRef, inView] = useIntersection("-100px")
  const tabsContainerRef = useRef<HTMLDivElement>(null)
  const [statCount, setStatCount] = useState(0)

  const activeData = tabs[activeTab]

  // Animated counter for stats
  useEffect(() => {
    const targetValue = parseInt(activeData.statValue)
    if (isNaN(targetValue)) {
      setStatCount(0)
      return
    }

    let start = 0
    const duration = 1000
    const increment = targetValue / (duration / 16)

    const timer = setInterval(() => {
      start += increment
      if (start >= targetValue) {
        setStatCount(targetValue)
        clearInterval(timer)
      } else {
        setStatCount(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [activeData.statValue])

  const scrollTabsRight = () => {
    if (tabsContainerRef.current) {
      tabsContainerRef.current.scrollBy({ left: 150, behavior: "smooth" })
    }
  }

  const tabColors = ["#0067B8", "#107C10", "#5C2D91", "#008575", "#E67E22", "#0891B2"]
  const activeColor = tabColors[activeTab]

  // Light background colors for each tab
  const tabBgColors = ["#EBF3FB", "#E8F5E9", "#F3EBF9", "#E0F5F2", "#FFF3E0", "#E0F7FA"]
  const activeBgColor = tabBgColors[activeTab]

  return (
    <section
      id="product-demos"
      ref={sectionRef}
      className="relative py-24 overflow-hidden"
    >
      {/* Full section animated background */}
      <motion.div
        className="absolute inset-0"
        animate={{ backgroundColor: activeBgColor }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />

      {/* Animated background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -top-20 -right-20 w-[600px] h-[600px] rounded-full blur-[100px]"
          animate={{ backgroundColor: activeColor, opacity: 0.12 }}
          transition={{ duration: 0.8 }}
        />
        <motion.div
          className="absolute top-1/2 -left-40 w-[500px] h-[500px] rounded-full blur-[100px]"
          animate={{ backgroundColor: activeColor, opacity: 0.08 }}
          transition={{ duration: 0.8 }}
        />
        <motion.div
          className="absolute -bottom-20 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px]"
          animate={{ backgroundColor: activeColor, opacity: 0.06 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        />
        {/* Subtle dot pattern */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }} />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-12"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-5"
            animate={{ borderColor: activeColor + "30", backgroundColor: activeColor + "08" }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-2 h-2 rounded-full"
              animate={{ backgroundColor: activeColor, scale: [1, 1.3, 1] }}
              transition={{ duration: 0.5, scale: { duration: 2, repeat: Infinity } }}
            />
            <motion.span
              className="text-xs tracking-widest font-bold uppercase"
              animate={{ color: activeColor }}
              transition={{ duration: 0.5 }}
            >
              Product Demos
            </motion.span>
          </motion.div>
          <h2 className="text-3xl lg:text-[2.75rem] font-bold text-[#1A1A1A] leading-tight">
            Do more with agents in Cubicle
          </h2>
          <p className="text-base text-[#6B6B6B] mt-4 max-w-2xl mx-auto leading-relaxed">
            See how AI and automation work with Cubicle applications to give every team an edge.
          </p>
        </motion.div>

        {/* Tab Bar */}
        <motion.div
          className="relative mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <div className="relative">
            <div
              ref={tabsContainerRef}
              className="flex gap-1.5 bg-white/70 backdrop-blur-sm rounded-2xl p-2 overflow-x-auto scrollbar-hide border border-[#E5E5E5]/50 shadow-sm"
            >
              {tabs.map((tab, i) => {
                const Icon = tab.icon
                const isActive = activeTab === i
                return (
                  <motion.button
                    key={tab.key}
                    onClick={() => setActiveTab(i)}
                    className={`relative flex items-center gap-2 text-sm py-3 px-5 whitespace-nowrap transition-all duration-300 flex-shrink-0 rounded-xl ${
                      isActive ? "text-white font-semibold" : "text-[#505050] hover:text-[#1A1A1A] hover:bg-white"
                    }`}
                    animate={isActive ? { backgroundColor: activeColor, boxShadow: `0 4px 14px ${activeColor}40` } : { backgroundColor: "transparent", boxShadow: "none" }}
                    transition={{ duration: 0.3 }}
                    whileHover={!isActive ? { scale: 1.02 } : {}}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </motion.button>
                )
              })}
            </div>

            {/* Scroll button mobile */}
            <button
              onClick={scrollTabsRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-9 h-9 bg-white border border-[#E5E5E5] rounded-full flex items-center justify-center shadow-md lg:hidden hover:shadow-lg transition-shadow"
              aria-label="Scroll tabs"
            >
              <ChevronRight className="w-4 h-4 text-[#505050]" />
            </button>
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeData.key}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Tagline + product link */}
            <motion.div
              className="text-center mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <h3 className="text-xl lg:text-2xl font-bold text-[#1A1A1A]">
                {activeData.tagline}
              </h3>
              <div className="flex items-center justify-center gap-2 mt-3">
                <motion.span
                  className="w-2.5 h-2.5 rounded-full"
                  animate={{ backgroundColor: activeColor }}
                  transition={{ duration: 0.3 }}
                />
                <Link
                  href="#"
                  className="text-sm font-semibold hover:underline flex items-center gap-1.5 transition-all group"
                  style={{ color: activeColor }}
                >
                  {activeData.productName}
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>

            {/* Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left: Features */}
              <div>
                <div className="space-y-3">
                  {activeData.features.map((feature, i) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, x: -24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.1, ease: "easeOut" }}
                      className="flex items-start gap-3 group p-3.5 rounded-xl bg-white/60 backdrop-blur-sm border border-transparent hover:border-[#E5E5E5] hover:bg-white hover:shadow-md transition-all duration-300"
                    >
                      <motion.div
                        className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: activeColor + "15" }}
                        whileHover={{ scale: 1.15, rotate: 5 }}
                      >
                        <Check className="w-3.5 h-3.5" style={{ color: activeColor }} />
                      </motion.div>
                      <span className="text-[15px] text-[#505050] leading-relaxed group-hover:text-[#1A1A1A] transition-colors">
                        {feature}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Stat highlight */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="mt-8 flex items-center gap-4 p-5 rounded-2xl bg-white border border-[#E5E5E5] shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <motion.div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md"
                    animate={{ backgroundColor: activeColor }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.05, rotate: 3 }}
                  >
                    {activeData.statValue}
                  </motion.div>
                  <div>
                    <p className="text-sm font-bold text-[#1A1A1A]">{activeData.statLabel}</p>
                    <p className="text-xs text-[#6B6B6B] mt-0.5">Reported by our customers</p>
                  </div>
                </motion.div>
              </div>

              {/* Right: Mock screenshot */}
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <div className="relative group">
                  {/* Decorative glow behind card */}
                  <motion.div
                    className="absolute -inset-3 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    animate={{ backgroundColor: activeColor + "15" }}
                  />
                  {/* Top accent bar */}
                  <motion.div
                    className="absolute -top-1 left-6 right-6 h-1 rounded-full z-10"
                    animate={{ backgroundColor: activeColor }}
                    transition={{ duration: 0.3 }}
                  />
                  <div className="relative rounded-2xl border border-[#E5E5E5] overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-500 bg-white">
                    <div className="rounded-lg overflow-hidden">
                      {activeData.mockUI}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
