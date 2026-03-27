"use client"

import { motion } from "framer-motion"
import { Target, BarChart3, Shield, Zap, CheckCircle } from "lucide-react"
import { useIntersection } from "./hooks/useIntersection"

const showcaseFeatures = [
  {
    icon: Target,
    tag: "AUTOMATION",
    title: "Automate the busywork.",
    titleAccent: "Focus on what matters.",
    description: "Set up triggers, approval chains, and notification rules. Automate lead assignment, task creation, invoice reminders, and more — no code required.",
    points: ["Smart lead routing", "Auto follow-ups", "Approval workflows", "Scheduled reports"],
    color: "#6161FF",
    mockType: "workflow" as const,
  },
  {
    icon: BarChart3,
    tag: "ANALYTICS",
    title: "Real-time insights.",
    titleAccent: "Smarter decisions.",
    description: "Live dashboards with revenue metrics, pipeline health, team performance, and predictive forecasting. All your data in one place, always up to date.",
    points: ["Revenue dashboards", "Pipeline analytics", "Team performance", "Custom reports"],
    color: "#3898EC",
    mockType: "chart" as const,
  },
  {
    icon: Shield,
    tag: "SECURITY",
    title: "Enterprise-grade security.",
    titleAccent: "Built-in, not bolted on.",
    description: "SOC2 compliance, 256-bit encryption, MFA, role-based access control, comprehensive audit logs, and GDPR compliance — all included from day one.",
    points: ["SOC2 compliant", "Role-based access", "Audit logs", "GDPR ready"],
    color: "#10B981",
    mockType: "shield" as const,
  },
]

function MockWorkflow({ color }: { color: string }) {
  return (
    <div className="bg-gradient-to-br from-indigo-100/50 via-blue-50/40 to-purple-50/30 dark:from-white/[0.05] dark:to-white/[0.02] rounded-2xl border border-indigo-200/40 dark:border-white/[0.08] p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        {["When lead created", "Assign to team", "Send email", "Create task"].map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-bold"
              style={{ backgroundColor: i < 3 ? color : `${color}40` }}
            >
              {i + 1}
            </div>
            {i < 3 && <div className="w-6 h-px" style={{ backgroundColor: `${color}30` }} />}
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {["New lead → Auto-assign to Sarah", "Send welcome email in 2 min", "Create follow-up task in 24h"].map((rule) => (
          <div key={rule} className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-white/40">
            <Zap className="w-3 h-3" style={{ color }} />
            {rule}
          </div>
        ))}
      </div>
    </div>
  )
}

function MockChart({ color }: { color: string }) {
  const bars = [35, 55, 45, 70, 60, 85, 75, 90, 65, 80, 70, 95]
  return (
    <div className="bg-gradient-to-br from-indigo-100/50 via-blue-50/40 to-purple-50/30 dark:from-white/[0.05] dark:to-white/[0.02] rounded-2xl border border-indigo-200/40 dark:border-white/[0.08] p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[12px] font-semibold text-slate-700 dark:text-white/60">Revenue Overview</span>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ color, backgroundColor: `${color}15` }}>+24.5%</span>
      </div>
      <div className="flex items-end gap-1 h-16">
        {bars.map((h, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            whileInView={{ height: `${h}%` }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04, duration: 0.4 }}
            className="flex-1 rounded-t-sm"
            style={{ backgroundColor: i >= 10 ? color : `${color}25` }}
          />
        ))}
      </div>
    </div>
  )
}

function MockShield({ color }: { color: string }) {
  return (
    <div className="bg-gradient-to-br from-indigo-100/50 via-blue-50/40 to-purple-50/30 dark:from-white/[0.05] dark:to-white/[0.02] rounded-2xl border border-indigo-200/40 dark:border-white/[0.08] p-5 shadow-sm">
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Encryption", value: "256-bit" },
          { label: "Uptime", value: "99.9%" },
          { label: "Auth", value: "MFA" },
          { label: "Compliance", value: "SOC2" },
        ].map((item) => (
          <div key={item.label} className="bg-emerald-100/50 dark:bg-white/[0.06] rounded-xl p-3 border border-emerald-200/50 dark:border-white/[0.08] text-center shadow-sm">
            <div className="text-lg font-black text-slate-900 dark:text-white">{item.value}</div>
            <div className="text-[9px] font-semibold uppercase tracking-wider" style={{ color }}>{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function LP1FeaturesGrid() {
  const [ref, inView] = useIntersection("-60px")

  return (
    <section id="features" className="py-28 bg-gradient-to-b from-indigo-50/20 to-white dark:from-[#0A0A30] dark:to-[#080824] relative" ref={ref}>
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <p className="text-[11px] font-semibold text-[#6161FF] uppercase tracking-[0.2em] mb-4">
            Built for Scale
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-[-0.02em] leading-[1.1]">
            Features that move
            <br />
            <span className="text-slate-400 dark:text-white/40">the needle.</span>
          </h2>
        </motion.div>

        {/* Alternating Feature Sections */}
        <div className="space-y-24">
          {showcaseFeatures.map((feature, i) => {
            const isReversed = i % 2 === 1

            return (
              <motion.div
                key={feature.tag}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6 }}
                className={`flex flex-col ${isReversed ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-12 lg:gap-16`}
              >
                {/* Text side */}
                <div className="flex-1">
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] mb-5"
                    style={{ color: feature.color, backgroundColor: `${feature.color}10` }}
                  >
                    <feature.icon className="w-3.5 h-3.5" />
                    {feature.tag}
                  </div>

                  <h3 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-[-0.02em] leading-[1.15] mb-2">
                    {feature.title}
                    <br />
                    <span className="text-slate-400 dark:text-white/40">{feature.titleAccent}</span>
                  </h3>

                  <p className="text-base text-slate-500 dark:text-white/40 leading-relaxed mb-6 max-w-md">
                    {feature.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    {feature.points.map((point) => (
                      <div key={point} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: feature.color }} />
                        <span className="text-[13px] font-medium text-slate-600 dark:text-white/50">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visual side */}
                <div className="flex-1 w-full max-w-md lg:max-w-none">
                  {feature.mockType === "workflow" && <MockWorkflow color={feature.color} />}
                  {feature.mockType === "chart" && <MockChart color={feature.color} />}
                  {feature.mockType === "shield" && <MockShield color={feature.color} />}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
