"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  ChevronUp,
  ChevronDown,
  Users,
  UserCheck,
  Briefcase,
  DollarSign,
  ArrowRight,
  TrendingUp,
  PieChart,
  Clock,
  FileText,
} from "lucide-react"
import { useIntersection } from "./hooks/useIntersection"

const accordionData = [
  {
    title: "Modernize your CRM",
    description:
      "Enhance customer relationships across sales, marketing, and service with an intelligent CRM solution. Track leads, manage pipelines, and close deals faster.",
    cta: "Explore CRM",
    href: "/explore/crm",
    Icon: Users,
    gradient: "from-blue-50 to-blue-100",
    accent: "bg-blue-500",
    accentLight: "bg-blue-100",
    textAccent: "text-blue-600",
    bgColor: "#EBF5FF", // Light blue background
    stats: [
      { label: "Active Leads", value: "2,847", icon: TrendingUp },
      { label: "Conversion Rate", value: "34.2%", icon: PieChart },
      { label: "Deals Closed", value: "189", icon: FileText },
    ],
  },
  {
    title: "Streamline HR operations",
    description:
      "Manage your entire employee lifecycle — from recruitment to retirement. Automate payroll, track attendance, and run performance reviews effortlessly.",
    cta: "Explore HRM",
    href: "/explore/hrm",
    Icon: UserCheck,
    gradient: "from-emerald-50 to-emerald-100",
    accent: "bg-emerald-500",
    accentLight: "bg-emerald-100",
    textAccent: "text-emerald-600",
    bgColor: "#ECFDF5", // Light green background
    stats: [
      { label: "Employees", value: "1,245", icon: Users },
      { label: "Attendance", value: "96.8%", icon: Clock },
      { label: "Open Positions", value: "23", icon: FileText },
    ],
  },
  {
    title: "Deliver projects on time",
    description:
      "Plan, execute, and track projects with Kanban boards, sprint planning, and real-time collaboration. Keep your teams aligned and productive.",
    cta: "Explore Project Management",
    href: "/explore/project-management",
    Icon: Briefcase,
    gradient: "from-purple-50 to-purple-100",
    accent: "bg-purple-500",
    accentLight: "bg-purple-100",
    textAccent: "text-purple-600",
    bgColor: "#F5F3FF", // Light purple background
    stats: [
      { label: "Active Projects", value: "42", icon: Briefcase },
      { label: "On Track", value: "87%", icon: TrendingUp },
      { label: "Tasks Done", value: "1,892", icon: Clock },
    ],
  },
  {
    title: "Take control of finances",
    description:
      "Create invoices, manage expenses, track revenue, and generate financial reports. Get complete visibility into your organization's financial health.",
    cta: "Explore Finance",
    href: "/explore/finance",
    Icon: DollarSign,
    gradient: "from-amber-50 to-amber-100",
    accent: "bg-amber-500",
    accentLight: "bg-amber-100",
    textAccent: "text-amber-600",
    bgColor: "#FFFBEB", // Light amber background
    stats: [
      { label: "Revenue", value: "$1.2M", icon: TrendingUp },
      { label: "Invoices", value: "348", icon: FileText },
      { label: "Expenses", value: "$420K", icon: PieChart },
    ],
  },
]

function CRMVisual() {
  const deals = [
    { name: "Acme Corp", value: "$45,000", stage: "Proposal", color: "#8B5CF6", avatar: "AC" },
    { name: "TechStart Inc", value: "$28,500", stage: "Negotiation", color: "#F59E0B", avatar: "TS" },
    { name: "DataFlow Ltd", value: "$62,000", stage: "Qualified", color: "#3B82F6", avatar: "DL" },
    { name: "NexGen AI", value: "$18,200", stage: "Closed Won", color: "#10B981", avatar: "NA" },
  ]
  return (
    <div className="w-full rounded-2xl bg-white border border-[#E5E5E5] shadow-lg overflow-hidden">
      <div className="bg-[#FAFAFA] px-5 py-3 border-b border-[#E5E5E5] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-[#0067B8]" />
          <span className="text-sm font-semibold text-[#1A1A1A]">Sales Pipeline</span>
        </div>
        <div className="flex gap-2">
          <span className="text-[10px] bg-[#EBF3FB] text-[#0067B8] px-2 py-0.5 rounded-full font-medium">Q1 2026</span>
          <span className="text-[10px] bg-[#E8F5E9] text-[#107C10] px-2 py-0.5 rounded-full font-medium">+12.4%</span>
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-4 gap-3 mb-4">
          {[
            { label: "Total Deals", value: "189", color: "#0067B8" },
            { label: "Pipeline Value", value: "$2.4M", color: "#5C2D91" },
            { label: "Win Rate", value: "34.2%", color: "#107C10" },
            { label: "Avg Deal Size", value: "$12.7K", color: "#D83B01" },
          ].map((s) => (
            <div key={s.label} className="bg-[#F9FAFB] rounded-lg p-2.5 text-center">
              <p className="text-[10px] text-[#6B6B6B]">{s.label}</p>
              <p className="text-sm font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] text-[#6B6B6B] border-b border-[#F0F0F0]">
              <th className="pb-2 font-medium">Deal</th>
              <th className="pb-2 font-medium">Value</th>
              <th className="pb-2 font-medium">Stage</th>
            </tr>
          </thead>
          <tbody>
            {deals.map((d) => (
              <tr key={d.name} className="border-b border-[#F5F5F5] last:border-0">
                <td className="py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#EBF3FB] flex items-center justify-center text-[8px] font-bold text-[#0067B8]">{d.avatar}</div>
                    <span className="text-xs font-medium text-[#1A1A1A]">{d.name}</span>
                  </div>
                </td>
                <td className="text-xs font-semibold text-[#1A1A1A]">{d.value}</td>
                <td><span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: d.color + "15", color: d.color }}>{d.stage}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function HRMVisual() {
  const employees = [
    { name: "Sarah K.", role: "Lead Designer", dept: "Design", status: "Active", color: "#10B981" },
    { name: "Mike T.", role: "Sr. Developer", dept: "Engineering", status: "Remote", color: "#3B82F6" },
    { name: "Anna L.", role: "HR Manager", dept: "People", status: "Active", color: "#10B981" },
    { name: "James P.", role: "PM Lead", dept: "Product", status: "On Leave", color: "#F59E0B" },
  ]
  return (
    <div className="w-full rounded-2xl bg-white border border-[#E5E5E5] shadow-lg overflow-hidden">
      <div className="bg-[#FAFAFA] px-5 py-3 border-b border-[#E5E5E5] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-[#107C10]" />
          <span className="text-sm font-semibold text-[#1A1A1A]">Employee Dashboard</span>
        </div>
        <span className="text-[10px] bg-[#E8F5E9] text-[#107C10] px-2 py-0.5 rounded-full font-medium">1,245 Total</span>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: "Attendance", value: "96.8%", color: "#107C10" },
            { label: "Open Positions", value: "23", color: "#0067B8" },
            { label: "Avg Rating", value: "4.5/5", color: "#F59E0B" },
          ].map((s) => (
            <div key={s.label} className="bg-[#F9FAFB] rounded-lg p-2.5 text-center">
              <p className="text-[10px] text-[#6B6B6B]">{s.label}</p>
              <p className="text-sm font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          {employees.map((emp) => (
            <div key={emp.name} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-[#F9FAFB] transition-colors">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#E8F5E9] flex items-center justify-center text-[10px] font-bold text-[#107C10]">
                  {emp.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="text-xs font-medium text-[#1A1A1A]">{emp.name}</p>
                  <p className="text-[10px] text-[#6B6B6B]">{emp.role} · {emp.dept}</p>
                </div>
              </div>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: emp.color + "15", color: emp.color }}>
                {emp.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function PMVisual() {
  const columns = [
    {
      name: "To Do", color: "#6B7280", tasks: [
        { title: "Design system update", tag: "Design", tagColor: "#8B5CF6" },
        { title: "API documentation", tag: "Docs", tagColor: "#0891B2" },
      ]
    },
    {
      name: "In Progress", color: "#3B82F6", tasks: [
        { title: "Build auth module", tag: "Dev", tagColor: "#0067B8" },
        { title: "Setup CI/CD pipeline", tag: "DevOps", tagColor: "#D83B01" },
      ]
    },
    {
      name: "Review", color: "#F59E0B", tasks: [
        { title: "Landing page v2", tag: "Design", tagColor: "#8B5CF6" },
      ]
    },
    {
      name: "Done", color: "#10B981", tasks: [
        { title: "Database migration", tag: "Dev", tagColor: "#0067B8" },
        { title: "User testing round 1", tag: "QA", tagColor: "#107C10" },
      ]
    },
  ]
  return (
    <div className="w-full rounded-2xl bg-white border border-[#E5E5E5] shadow-lg overflow-hidden">
      <div className="bg-[#FAFAFA] px-5 py-3 border-b border-[#E5E5E5] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-[#5C2D91]" />
          <span className="text-sm font-semibold text-[#1A1A1A]">Sprint Board</span>
        </div>
        <div className="flex gap-2">
          <span className="text-[10px] bg-[#F3EBF9] text-[#5C2D91] px-2 py-0.5 rounded-full font-medium">Sprint 14</span>
          <span className="text-[10px] bg-[#E8F5E9] text-[#107C10] px-2 py-0.5 rounded-full font-medium">87% On Track</span>
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-4 gap-2">
          {columns.map((col) => (
            <div key={col.name}>
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }} />
                <span className="text-[10px] font-semibold text-[#505050]">{col.name}</span>
                <span className="text-[9px] text-[#9CA3AF] ml-auto">{col.tasks.length}</span>
              </div>
              <div className="space-y-1.5">
                {col.tasks.map((t) => (
                  <div key={t.title} className="bg-[#F9FAFB] border border-[#E5E5E5] rounded-lg px-2.5 py-2">
                    <p className="text-[10px] font-medium text-[#1A1A1A] mb-1.5">{t.title}</p>
                    <span className="text-[8px] font-medium px-1.5 py-0.5 rounded" style={{ backgroundColor: t.tagColor + "15", color: t.tagColor }}>{t.tag}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function FinanceVisual() {
  const invoices = [
    { id: "INV-2401", client: "Acme Corp", amount: "$12,500", status: "Paid", color: "#10B981" },
    { id: "INV-2402", client: "TechStart", amount: "$8,200", status: "Pending", color: "#F59E0B" },
    { id: "INV-2403", client: "DataFlow", amount: "$5,800", status: "Overdue", color: "#DC2626" },
  ]
  const bars = [45, 62, 38, 75, 55, 82, 48, 68, 90, 58, 72, 65]
  return (
    <div className="w-full rounded-2xl bg-white border border-[#E5E5E5] shadow-lg overflow-hidden">
      <div className="bg-[#FAFAFA] px-5 py-3 border-b border-[#E5E5E5] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-[#008575]" />
          <span className="text-sm font-semibold text-[#1A1A1A]">Financial Overview</span>
        </div>
        <span className="text-[10px] bg-[#E0F2F1] text-[#008575] px-2 py-0.5 rounded-full font-medium">FY 2026</span>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-[#E8F5E9] rounded-lg p-2.5 text-center">
            <p className="text-[10px] text-[#6B6B6B]">Revenue</p>
            <p className="text-sm font-bold text-[#107C10]">$1.2M</p>
          </div>
          <div className="bg-[#FFF0E8] rounded-lg p-2.5 text-center">
            <p className="text-[10px] text-[#6B6B6B]">Expenses</p>
            <p className="text-sm font-bold text-[#D83B01]">$420K</p>
          </div>
          <div className="bg-[#EBF3FB] rounded-lg p-2.5 text-center">
            <p className="text-[10px] text-[#6B6B6B]">Profit</p>
            <p className="text-sm font-bold text-[#0067B8]">$780K</p>
          </div>
        </div>
        <div className="mb-4">
          <p className="text-[10px] font-medium text-[#6B6B6B] mb-2">Monthly Revenue</p>
          <div className="flex items-end gap-1 h-14">
            {bars.map((h, i) => (
              <div key={i} className="flex-1 rounded-t transition-all" style={{ height: `${h}%`, backgroundColor: i === 11 ? "#0067B8" : "#0067B830" }} />
            ))}
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[8px] text-[#9CA3AF]">Jan</span>
            <span className="text-[8px] text-[#9CA3AF]">Dec</span>
          </div>
        </div>
        <div className="space-y-1.5">
          {invoices.map((inv) => (
            <div key={inv.id} className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-[#F9FAFB]">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono text-[#6B6B6B]">{inv.id}</span>
                <span className="text-[10px] font-medium text-[#1A1A1A]">{inv.client}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold text-[#1A1A1A]">{inv.amount}</span>
                <span className="text-[8px] font-medium px-1.5 py-0.5 rounded-full" style={{ backgroundColor: inv.color + "15", color: inv.color }}>{inv.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const visuals = [CRMVisual, HRMVisual, PMVisual, FinanceVisual]

const accentColors = ["#0067B8", "#107C10", "#5C2D91", "#008575"]

export default function LP2Solutions() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [ref, inView] = useIntersection("-80px")
  const [isHovered, setIsHovered] = useState(false)
  const [isManuallyInteracted, setIsManuallyInteracted] = useState(false)

  // Auto-rotation effect
  useEffect(() => {
    // Only auto-rotate if section is in view and not hovered/manually interacted
    if (!inView || isHovered || isManuallyInteracted) return

    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        // If closed (-1), start from 0, otherwise go to next
        if (prev === -1) return 0
        return (prev + 1) % accordionData.length
      })
    }, 4500) // Change every 4.5 seconds

    return () => clearInterval(interval)
  }, [inView, isHovered, isManuallyInteracted])

  // Resume auto-rotation after manual interaction
  useEffect(() => {
    if (!isManuallyInteracted) return

    const timeout = setTimeout(() => {
      setIsManuallyInteracted(false)
    }, 5000) // Resume after 5 seconds

    return () => clearTimeout(timeout)
  }, [isManuallyInteracted])

  const toggle = (index: number) => {
    // Allow closing if clicking the same index
    if (index === activeIndex) {
      setActiveIndex(-1)
    } else {
      setActiveIndex(index)
    }
    setIsManuallyInteracted(true)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  const activeColor = activeIndex >= 0 ? accentColors[activeIndex] : "#0067B8"
  const activeBgColor = activeIndex >= 0 ? accordionData[activeIndex].bgColor : "#F8F9FC"

  return (
    <motion.section
      id="solutions"
      className="relative py-20 overflow-hidden"
      animate={{
        backgroundColor: activeBgColor
      }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full opacity-[0.07] blur-[80px]"
          style={{ backgroundColor: activeColor }}
          animate={{ backgroundColor: activeColor }}
          transition={{ duration: 0.8 }}
        />
        <motion.div
          className="absolute -bottom-32 -left-32 w-[350px] h-[350px] rounded-full opacity-[0.05] blur-[80px]"
          style={{ backgroundColor: activeColor }}
          animate={{ backgroundColor: activeColor }}
          transition={{ duration: 0.8 }}
        />
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #000 0.5px, transparent 0)",
          backgroundSize: "32px 32px",
        }} />
      </div>

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8"
      >
        {/* Header */}
        <div className="mb-12 text-center">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-5"
            animate={{ borderColor: activeColor + "30", backgroundColor: activeColor + "08" }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-2 h-2 rounded-full"
              animate={{ backgroundColor: activeColor }}
              transition={{ duration: 0.5 }}
            />
            <motion.span
              className="text-xs tracking-widest font-bold uppercase"
              animate={{ color: activeColor }}
              transition={{ duration: 0.5 }}
            >
              Solutions
            </motion.span>
          </motion.div>
          <h2 className="text-3xl lg:text-[2.75rem] font-bold text-[#1A1A1A] leading-tight">
            One platform. Limitless possibilities
          </h2>
          <p className="mt-4 text-[#6B6B6B] text-base max-w-2xl mx-auto leading-relaxed">
            Everything your business needs — from CRM to finance — working together seamlessly.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left — Accordion (40%) */}
          <div
            className="w-full lg:w-[40%] h-[480px] overflow-visible"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {accordionData.map((item, index) => {
              const isActive = activeIndex === index
              const color = accentColors[index]
              return (
                <motion.div
                  key={item.title}
                  className={`border-b transition-all duration-300 rounded-xl overflow-hidden ${isActive ? "border-b-transparent" : "border-b-[#E0E0E0]"}`}
                  layout
                  animate={{
                    backgroundColor: isActive ? `${color}20` : "transparent",
                    scale: isActive ? 1.02 : 1,
                  }}
                  whileHover={{
                    backgroundColor: isActive ? `${color}20` : `${color}10`,
                    scale: isActive ? 1.02 : 1.01,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <button
                    onClick={() => toggle(index)}
                    className="w-full flex items-center justify-between py-5 px-4 text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <motion.div
                        className="w-1 h-8 rounded-full"
                        style={{ backgroundColor: isActive ? color : "#D1D5DB" }}
                        animate={{
                          backgroundColor: isActive ? color : "#D1D5DB",
                          height: isActive ? 32 : 24,
                          boxShadow: isActive ? `0 0 16px ${color}60` : "none"
                        }}
                        whileHover={{
                          backgroundColor: color,
                          height: isActive ? 32 : 28,
                          boxShadow: `0 0 12px ${color}50`
                        }}
                        transition={{ duration: 0.3 }}
                      />
                      <div className="flex items-center gap-2.5">
                        <motion.div
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: isActive ? color + "15" : "transparent" }}
                          animate={{
                            backgroundColor: isActive ? color + "35" : "transparent",
                            scale: isActive ? 1.1 : 1
                          }}
                          whileHover={{
                            backgroundColor: isActive ? color + "35" : color + "20",
                            scale: 1.1
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.2 }}
                          >
                            <item.Icon className="w-4 h-4" style={{ color: isActive ? color : "#9CA3AF" }} />
                          </motion.div>
                        </motion.div>
                        <span className={`text-lg font-semibold transition-colors duration-300 ${isActive ? "text-[#1A1A1A]" : "text-[#6B6B6B] group-hover:text-[#1A1A1A]"}`}>
                          {item.title}
                        </span>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: isActive ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className={`w-5 h-5 shrink-0 transition-colors duration-300 ${isActive ? "text-[#1A1A1A]" : "text-[#9CA3AF]"}`} />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="pb-5 pl-12">
                          <p className="text-sm leading-relaxed text-[#505050]">
                            {item.description}
                          </p>
                          <Link
                            href={item.href}
                            className="inline-flex items-center gap-1.5 mt-4 font-semibold text-sm hover:gap-2.5 transition-all duration-300"
                            style={{ color }}
                          >
                            {item.cta}
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>

          {/* Right — Visual (60%) */}
          <div className="w-full lg:w-[60%] h-[480px]">
            <AnimatePresence mode="wait">
              {activeIndex >= 0 && (() => {
                const Visual = visuals[activeIndex]
                const color = accentColors[activeIndex]
                return (
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, y: 20, scale: 0.97, rotateX: 5 }}
                    animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                    exit={{ opacity: 0, y: -20, scale: 0.97, rotateX: -5 }}
                    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                    className="relative"
                    style={{ perspective: "1000px" }}
                  >
                    {/* Multiple layered glows for depth */}
                    <div
                      className="absolute -inset-6 rounded-3xl opacity-[0.15] blur-3xl"
                      style={{ backgroundColor: color }}
                    />
                    <div
                      className="absolute -inset-3 rounded-3xl opacity-[0.1] blur-xl"
                      style={{ backgroundColor: color }}
                    />

                    {/* 3D Card wrapper with colored border and shadow */}
                    <motion.div
                      className="relative"
                      style={{
                        transformStyle: "preserve-3d",
                      }}
                      animate={{
                        boxShadow: `
                          0 2px 4px ${color}15,
                          0 8px 16px ${color}20,
                          0 16px 32px ${color}25,
                          0 0 0 1px ${color}30,
                          inset 0 1px 0 0 rgba(255,255,255,0.5)
                        `,
                      }}
                      transition={{ duration: 0.4 }}
                      className="rounded-2xl"
                    >
                      <Visual />
                    </motion.div>
                  </motion.div>
                )
              })()}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.section>
  )
}
