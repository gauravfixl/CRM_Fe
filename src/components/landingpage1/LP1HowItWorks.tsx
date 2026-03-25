"use client"

import { motion } from "framer-motion"
import { UserPlus, Settings, Upload, Rocket } from "lucide-react"
import { useIntersection } from "./hooks/useIntersection"

const steps = [
  { icon: UserPlus, num: "01", title: "Create your account", desc: "Sign up in 30 seconds. No credit card, no commitment.", color: "#6366F1" },
  { icon: Settings, num: "02", title: "Configure workspace", desc: "Set up your org, invite team, enable the modules you need.", color: "#8B5CF6" },
  { icon: Upload, num: "03", title: "Import your data", desc: "Bring data from spreadsheets or migrate from other tools.", color: "#3B82F6" },
  { icon: Rocket, num: "04", title: "Go live", desc: "Launch your platform. Productive from day one.", color: "#10B981" },
]

export default function LP1HowItWorks() {
  const [ref, inView] = useIntersection("-60px")

  return (
    <section className="py-28 bg-gradient-to-b from-slate-50 to-indigo-50/20 dark:bg-[#060620] relative overflow-hidden" ref={ref}>
      {/* Background accents */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/[0.06] to-transparent" />

      <div className="max-w-[1100px] mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <p className="text-[11px] font-semibold text-[#6366F1] dark:text-[#818CF8] uppercase tracking-[0.2em] mb-4">
            How It Works
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-[-0.02em] leading-[1.1]">
            Up and running in
            <span className="text-slate-300 dark:text-white/25"> minutes</span>
          </h2>
        </motion.div>

        {/* Steps grid - 4 columns on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connecting line (desktop only) */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
            className="hidden lg:block absolute top-[56px] left-[12%] right-[12%] h-px origin-left"
            style={{ background: "linear-gradient(90deg, #6366F1, #8B5CF6, #3B82F6, #10B981)" }}
          />

          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.15, duration: 0.5 }}
              className="relative group"
            >
              {/* Card */}
              <div className="bg-gradient-to-br from-indigo-100/50 via-blue-50/40 to-purple-50/30 dark:from-white/[0.05] dark:to-white/[0.02] border border-indigo-200/40 dark:border-white/[0.08] rounded-2xl p-6 hover:shadow-lg hover:shadow-indigo-200/20 dark:hover:shadow-[0_0_30px_rgba(99,102,241,0.05)] transition-all duration-300 hover:border-indigo-300/50 dark:hover:border-white/12">
                {/* Step number + icon */}
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300"
                    style={{ background: `linear-gradient(135deg, ${step.color}, ${step.color}BB)` }}
                  >
                    <step.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-[0.15em]" style={{ color: step.color }}>
                    Step {step.num}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-white/35 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {/* Dot on connecting line */}
              <div
                className="hidden lg:block absolute top-[52px] left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-white dark:border-[#060620] z-10"
                style={{ backgroundColor: step.color }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
