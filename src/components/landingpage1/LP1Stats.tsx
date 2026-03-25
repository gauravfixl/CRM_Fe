"use client"

import { motion } from "framer-motion"
import { Building2, Users, Zap, Star } from "lucide-react"
import { useIntersection } from "./hooks/useIntersection"

const stats = [
  { value: "500+", label: "Organizations", icon: Building2, gradient: "from-[#6366F1] to-[#818CF8]" },
  { value: "50K+", label: "Active Users", icon: Users, gradient: "from-[#10B981] to-[#34D399]" },
  { value: "99.9%", label: "Platform Uptime", icon: Zap, gradient: "from-[#F59E0B] to-[#FBBF24]" },
  { value: "4.9/5", label: "Average Rating", icon: Star, gradient: "from-[#EC4899] to-[#F472B6]" },
]

export default function LP1Stats() {
  const [ref, inView] = useIntersection("-40px")

  return (
    <section ref={ref} className="relative py-24 bg-gradient-to-b from-slate-50 to-indigo-50/20 dark:bg-[#060620]">
      {/* Subtle top/bottom borders */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/[0.06] to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/[0.06] to-transparent" />

      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-[11px] font-semibold text-[#6366F1] dark:text-[#818CF8] uppercase tracking-[0.2em] mb-4">
            Trusted Worldwide
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-[-0.02em]">
            Numbers that speak for themselves
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5, type: "spring", stiffness: 100 }}
              whileHover={{ y: -8, transition: { duration: 0.25 } }}
              className="group relative bg-gradient-to-br from-indigo-100/60 via-blue-50/50 to-purple-50/40 dark:from-white/[0.06] dark:to-white/[0.02] rounded-2xl p-6 border border-indigo-200/40 dark:border-white/[0.08] shadow-sm hover:shadow-xl hover:shadow-indigo-200/30 dark:hover:shadow-[#6366F1]/5 transition-all duration-300 overflow-hidden cursor-default"
            >
              {/* Hover glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-[0.04] dark:group-hover:opacity-[0.08] transition-opacity duration-500`} />

              {/* Top accent line */}
              <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>

              <div className={`text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r ${stat.gradient} mb-1 tracking-tight`}>
                {stat.value}
              </div>

              <div className="text-[11px] font-semibold text-slate-400 dark:text-white/30 uppercase tracking-[0.12em]">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
