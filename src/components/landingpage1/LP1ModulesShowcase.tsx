"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, CheckCircle, Users, UserCheck, Briefcase, DollarSign, Globe, HeadphonesIcon } from "lucide-react"
import Link from "next/link"
import { useIntersection } from "./hooks/useIntersection"

const modules = [
  {
    id: "crm", icon: Users, label: "CRM", color: "#6366F1",
    desc: "Full-stack client relationship management",
    features: ["Lead pipeline with stage tracking", "Client & contact management", "Deal creation & pipeline view", "Activities, calls & follow-ups", "Campaign management", "Lead scoring & analytics"],
    stats: [{ l: "Leads", v: "2,847" }, { l: "Pipeline", v: "$147K" }, { l: "Win Rate", v: "68%" }],
  },
  {
    id: "hrm", icon: UserCheck, label: "HRM", color: "#10B981",
    desc: "Complete HR operations hub",
    features: ["Employee profiles & records", "Leave & attendance tracking", "Payroll calculation engine", "Performance reviews & OKRs", "Recruitment pipeline", "Employee lifecycle"],
    stats: [{ l: "Employees", v: "342" }, { l: "Leaves", v: "18" }, { l: "Payroll", v: "$84K" }],
  },
  {
    id: "pm", icon: Briefcase, label: "Projects", color: "#8B5CF6",
    desc: "Jira-style task and milestone tracking",
    features: ["Kanban & list board views", "Sprint planning & backlog", "Task assignment & priorities", "Time tracking per task", "File attachments & comments", "Project analytics"],
    stats: [{ l: "Projects", v: "24" }, { l: "Done", v: "1,248" }, { l: "On-time", v: "91%" }],
  },
  {
    id: "finance", icon: DollarSign, label: "Finance", color: "#F59E0B",
    desc: "Invoices, expenses & financial reports",
    features: ["Invoice creation & tracking", "Expense management", "Revenue & MRR analytics", "Subscription billing", "Tax compliance reports", "Financial forecasting"],
    stats: [{ l: "Revenue", v: "$14.2M" }, { l: "Invoices", v: "47" }, { l: "MRR", v: "+12%" }],
  },
  {
    id: "portal", icon: Globe, label: "Client Portal", color: "#EC4899",
    desc: "External portal for your clients",
    features: ["Branded client login portal", "Invoice & payment access", "Document sharing hub", "Project status visibility", "Support ticket submission", "Real-time notifications"],
    stats: [{ l: "Clients", v: "189" }, { l: "Sessions", v: "4.2K" }, { l: "CSAT", v: "4.9" }],
  },
  {
    id: "helpdesk", icon: HeadphonesIcon, label: "Helpdesk", color: "#06B6D4",
    desc: "Support ticketing & knowledge base",
    features: ["Ticket creation & assignment", "SLA policy management", "Escalation workflows", "Knowledge base articles", "Agent performance metrics", "Satisfaction tracking"],
    stats: [{ l: "Tickets", v: "23" }, { l: "Response", v: "<2h" }, { l: "CSAT", v: "96%" }],
  },
]

export default function LP1ModulesShowcase() {
  const [activeId, setActiveId] = useState("crm")
  const [ref, inView] = useIntersection("-60px")
  const active = modules.find((m) => m.id === activeId)!

  return (
    <section id="modules" className="py-28 bg-gradient-to-b from-white to-indigo-50/30 dark:from-[#080824] dark:to-[#0A0A30] relative overflow-hidden" ref={ref}>
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px] pointer-events-none" style={{ background: `${active.color}08` }} />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-[11px] font-semibold text-[#6366F1] dark:text-[#818CF8] uppercase tracking-[0.2em] mb-4">
            Platform Modules
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-[-0.02em] leading-[1.1] mb-4">
            Six powerful modules.
            <br />
            <span className="text-slate-300 dark:text-white/25">One unified platform.</span>
          </h2>
        </motion.div>

        {/* Tab pills */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {modules.map((mod) => (
            <button
              key={mod.id}
              onClick={() => setActiveId(mod.id)}
              className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-300"
              style={{
                color: activeId === mod.id ? mod.color : undefined,
                backgroundColor: activeId === mod.id ? `${mod.color}12` : undefined,
                borderWidth: 1,
                borderColor: activeId === mod.id ? `${mod.color}30` : "transparent",
              }}
            >
              {activeId !== mod.id && (
                <span className="text-slate-400 dark:text-white/40 hover:text-slate-600 dark:hover:text-white/60 flex items-center gap-2 transition-colors">
                  <mod.icon className="w-4 h-4" />
                  {mod.label}
                </span>
              )}
              {activeId === mod.id && (
                <>
                  <mod.icon className="w-4 h-4" />
                  {mod.label}
                  <motion.div layoutId="tab-glow" className="absolute inset-0 rounded-xl" style={{ boxShadow: `0 0 20px ${mod.color}15` }} transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                </>
              )}
            </button>
          ))}
        </motion.div>

        {/* Content panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start"
          >
            {/* Left: Info */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: `linear-gradient(135deg, ${active.color}, ${active.color}CC)` }}>
                  <active.icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">{active.label}</h3>
                  <p className="text-sm text-slate-400 dark:text-white/40">{active.desc}</p>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                {active.features.map((feat, i) => (
                  <motion.div
                    key={feat}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 group"
                  >
                    <CheckCircle className="w-4.5 h-4.5 flex-shrink-0 transition-colors" style={{ color: active.color }} />
                    <span className="text-sm font-medium text-slate-600 dark:text-white/50 group-hover:text-slate-900 dark:group-hover:text-white/80 transition-colors">{feat}</span>
                  </motion.div>
                ))}
              </div>

              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.03]"
                style={{ background: `linear-gradient(135deg, ${active.color}, ${active.color}CC)` }}
              >
                Try {active.label} Free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Right: Mock dashboard */}
            <div className="bg-gradient-to-br from-indigo-100/60 via-blue-50/50 to-purple-50/40 dark:from-white/[0.05] dark:to-white/[0.02] border border-indigo-200/50 dark:border-white/[0.08] rounded-2xl overflow-hidden shadow-md">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 bg-indigo-100/50 dark:bg-white/[0.04] border-b border-indigo-200/40 dark:border-white/[0.06]">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                </div>
                <div className="ml-3 flex-1 h-6 bg-indigo-50/80 dark:bg-white/[0.06] rounded-md flex items-center px-2.5">
                  <span className="text-[10px] font-mono" style={{ color: active.color }}>
                    cubicle.app/{active.id}
                  </span>
                </div>
              </div>

              <div className="p-5">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {active.stats.map((s) => (
                    <div key={s.l} className="bg-indigo-100/60 dark:bg-white/[0.06] rounded-xl p-3 text-center border border-indigo-200/50 dark:border-white/[0.08] shadow-sm">
                      <div className="text-lg font-black text-slate-900 dark:text-white">{s.v}</div>
                      <div className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: active.color }}>{s.l}</div>
                    </div>
                  ))}
                </div>

                {/* Feature rows */}
                <div className="space-y-2">
                  {active.features.slice(0, 4).map((f, i) => (
                    <motion.div
                      key={f}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="flex items-center gap-3 p-2.5 bg-indigo-50/60 dark:bg-white/[0.04] rounded-xl border border-indigo-100/40 dark:border-white/[0.06]"
                    >
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${active.color}15` }}>
                        <CheckCircle className="w-3.5 h-3.5" style={{ color: active.color }} />
                      </div>
                      <span className="text-[11px] text-slate-600 dark:text-white/50 font-medium flex-1">{f}</span>
                      <div className="w-14 h-1.5 bg-indigo-100/60 dark:bg-white/[0.06] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${[80, 65, 90, 75][i]}%` }}
                          transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: active.color }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Active badge */}
              <div className="absolute top-16 right-4 text-[9px] font-bold text-white px-2 py-1 rounded-full shadow-md" style={{ backgroundColor: active.color }}>
                Active
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
