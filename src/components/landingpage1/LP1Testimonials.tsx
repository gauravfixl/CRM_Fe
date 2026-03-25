"use client"

import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"
import { useIntersection } from "./hooks/useIntersection"

const testimonials = [
  { name: "Sarah Mitchell", role: "CEO, Acme Corp", avatar: "SM", color: "#6366F1", text: "Cubicle transformed how we manage our sales pipeline. We increased conversions by 40% in two months." },
  { name: "James Rodriguez", role: "Ops Director, TechStart", avatar: "JR", color: "#10B981", text: "Having CRM, HR, and finance in one platform eliminated 4 tools and saved us $2,000/month." },
  { name: "Priya Sharma", role: "Founder, InnovateCo", avatar: "PS", color: "#8B5CF6", text: "I oversee three companies from one dashboard. The security and audit trails give me full confidence." },
  { name: "Michael Chen", role: "Sales Lead, GlobalTrade", avatar: "MC", color: "#F59E0B", text: "The analytics dashboard is like having a BI tool built-in. Real-time insights from day one." },
  { name: "Aisha Patel", role: "HR Manager, NexusFirm", avatar: "AP", color: "#EC4899", text: "Payroll went from 3 days to under 2 hours. The attendance tracking is flawless." },
  { name: "David Kim", role: "CTO, SpeedOps", avatar: "DK", color: "#06B6D4", text: "Enterprise-grade security with SOC2 compliance was non-negotiable. Cubicle delivered everything." },
]

export default function LP1Testimonials() {
  const [ref, inView] = useIntersection("-60px")

  return (
    <section id="testimonials" className="py-28 bg-gradient-to-b from-white to-purple-50/20 dark:from-[#080824] dark:to-[#0A0A2E] relative overflow-hidden" ref={ref}>
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#6366F1]/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-[11px] font-semibold text-[#6366F1] dark:text-[#818CF8] uppercase tracking-[0.2em] mb-4">
            Customer Stories
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-[-0.02em] leading-[1.1]">
            Loved by teams
            <span className="text-slate-300 dark:text-white/25"> everywhere</span>
          </h2>
        </motion.div>

        {/* Testimonial grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 25 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ y: -5, transition: { duration: 0.25 } }}
              className="group relative bg-gradient-to-br from-indigo-100/40 via-blue-50/30 to-purple-50/20 dark:from-white/[0.05] dark:to-white/[0.02] border border-indigo-200/30 dark:border-white/[0.08] rounded-2xl p-6 hover:shadow-xl hover:shadow-indigo-200/20 dark:hover:shadow-[0_0_30px_rgba(99,102,241,0.05)] transition-all duration-300 cursor-default overflow-hidden"
            >
              {/* Top accent */}
              <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `linear-gradient(90deg, transparent, ${t.color}, transparent)` }} />

              {/* Quote icon */}
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${t.color}10` }}>
                <Quote className="w-4 h-4" style={{ color: t.color }} />
              </div>

              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-[14px] text-slate-600 dark:text-white/45 leading-relaxed mb-6">
                &ldquo;{t.text}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-[11px] font-bold shadow-md"
                  style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}CC)` }}
                >
                  {t.avatar}
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-slate-800 dark:text-white">{t.name}</div>
                  <div className="text-[11px] text-slate-400 dark:text-white/30">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Rating */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-indigo-50/50 dark:bg-white/[0.05] border border-indigo-100/50 dark:border-white/[0.08] rounded-full">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-[13px] font-bold text-slate-700 dark:text-white">4.9/5</span>
            <span className="text-[12px] text-slate-400 dark:text-white/30">from 500+ reviews</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
