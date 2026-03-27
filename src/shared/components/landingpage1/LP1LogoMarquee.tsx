"use client"

import { motion } from "framer-motion"

const companies = [
  "Acme Corp", "TechStart", "GlobalTrade", "InnovateCo",
  "NexusFirm", "SpeedOps", "DataFlow", "CloudSync",
  "BrightPath", "SkylineIO", "VelocityHQ", "PulseNet",
]

export default function LP1LogoMarquee() {
  const row = [...companies, ...companies]

  return (
    <section className="relative py-16 bg-[#030014] overflow-hidden">
      {/* Top glow line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40%] h-px bg-gradient-to-r from-transparent via-[#6366F1]/40 to-transparent" />

      <div className="max-w-[1200px] mx-auto px-6 mb-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-[11px] font-semibold text-white/15 uppercase tracking-[0.3em]"
        >
          Powering 500+ businesses worldwide
        </motion.p>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-48 bg-gradient-to-r from-[#030014] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-48 bg-gradient-to-l from-[#030014] to-transparent z-10" />

        <div className="flex overflow-hidden">
          <motion.div
            className="flex items-center gap-12 flex-shrink-0"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          >
            {row.map((name, i) => (
              <div key={i} className="flex items-center gap-3 flex-shrink-0 px-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/[0.06] flex items-center justify-center">
                  <span className="text-[11px] font-black text-white/20">{name[0]}</span>
                </div>
                <span className="text-white/[0.12] font-bold text-lg tracking-tight whitespace-nowrap hover:text-white/25 transition-colors duration-700 select-none">
                  {name}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
