"use client"

import { motion } from "framer-motion"
import { Shield, Lock, Server, FileCheck, ShieldCheck } from "lucide-react"
import { useIntersection } from "./hooks/useIntersection"

const badges = [
  {
    icon: Shield,
    color: "#0067B8",
    bg: "#EBF3FB",
    title: "SOC 2 Type II",
    description: "Independently audited security controls ensuring your data is handled with the highest standards of trust and integrity.",
  },
  {
    icon: Lock,
    color: "#5C2D91",
    bg: "#F3EBF9",
    title: "256-bit Encryption",
    description: "All data is encrypted at rest and in transit using AES-256, the same standard used by leading financial institutions.",
  },
  {
    icon: Server,
    color: "#107C10",
    bg: "#E8F5E9",
    title: "99.9% Uptime SLA",
    description: "Enterprise-grade infrastructure with guaranteed availability, redundant backups, and disaster recovery built in.",
  },
  {
    icon: FileCheck,
    color: "#D83B01",
    bg: "#FFF0E8",
    title: "GDPR Compliant",
    description: "Full compliance with global data protection regulations including GDPR, CCPA, and regional privacy laws.",
  },
]

const stats = [
  { value: "256-bit", label: "SSL Encryption" },
  { value: "99.9%", label: "Uptime Guarantee" },
  { value: "24/7", label: "Security Monitoring" },
  { value: "100%", label: "Data Ownership" },
]

export default function LP2SecurityTrust() {
  const [ref, isVisible] = useIntersection("-80px")

  return (
    <section id="security" className="bg-[#F5F5F5] py-20">
      <div ref={ref as any} className="max-w-[1280px] mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 24 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="text-[#0067B8] text-[10px] uppercase tracking-widest font-semibold">
            Security & Compliance
          </span>
          <h2 className="mt-2 text-[28px] lg:text-[34px] font-semibold text-[#1A1A1A] leading-tight">
            Enterprise-grade security you can trust
          </h2>
          <p className="mt-3 text-[#505050] text-base max-w-2xl mx-auto">
            Your data protection is our top priority. We maintain the highest standards of security and compliance.
          </p>
        </motion.div>

        {/* Trust badge cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {badges.map((badge, i) => (
            <motion.div
              key={badge.title}
              className="bg-white rounded-lg p-6 border border-[#E5E5E5] hover:shadow-md transition-shadow duration-300"
              initial={{ opacity: 0, y: 24 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 * i }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: badge.bg }}
              >
                <badge.icon size={22} style={{ color: badge.color }} />
              </div>
              <h3 className="text-[16px] font-semibold text-[#1A1A1A] mb-2">
                {badge.title}
              </h3>
              <p className="text-[13px] text-[#6B6B6B] leading-relaxed">
                {badge.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Stats row */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-[28px] lg:text-[32px] font-bold text-[#0067B8]">
                {stat.value}
              </p>
              <p className="text-[#505050] text-[12px] mt-0.5 font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Bottom compliance text */}
        <motion.div
          className="flex items-center justify-center gap-2.5 text-[#6B6B6B] text-[13px]"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <ShieldCheck size={16} className="text-[#107C10] shrink-0" />
          <span>
            Compliant with international standards including GDPR, CCPA, HIPAA, and SOC 2
          </span>
          <ShieldCheck size={16} className="text-[#107C10] shrink-0" />
        </motion.div>
      </div>
    </section>
  )
}