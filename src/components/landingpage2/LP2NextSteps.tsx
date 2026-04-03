"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import {
  MessageSquare,
  PhoneCall,
  CreditCard,
  ArrowRight,
  Users,
  Briefcase,
  BarChart3,
  Sparkles,
  Rocket,
  CheckCircle2,
  Zap,
} from "lucide-react"
import { useIntersection } from "./hooks/useIntersection"

const smallCards = [
  {
    icon: MessageSquare,
    color: "#0067B8",
    bg: "#E3F2FD",
    title: "Chat with sales",
    desc: "Let our team help you find the right solution for your business.",
    cta: "Contact sales",
    href: "/contact",
  },
  {
    icon: PhoneCall,
    color: "#107C10",
    bg: "#E8F5E9",
    title: "Request a callback",
    desc: "Schedule a call with our team at a time that works for you.",
    cta: "Request callback",
    href: "/support",
  },
  {
    icon: CreditCard,
    color: "#D83B01",
    bg: "#FFF3E0",
    title: "Compare plans",
    desc: "Find the right plan for your business — from free starter to enterprise.",
    cta: "See pricing overview",
    href: "/pricing-overview",
  },
]

const trialFeatures = [
  "Full access to all modules",
  "No credit card required",
  "14-day free trial",
  "Cancel anytime",
]

export default function LP2NextSteps() {
  const [mainRef, mainInView] = useIntersection("-60px")
  const [cardsRef, cardsInView] = useIntersection("-40px")

  return (
    <section id="next-steps" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #FAFBFD 0%, #F0F4F8 50%, #FAFBFD 100%)" }} />

      {/* Decorative */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -right-20 w-[400px] h-[400px] rounded-full bg-blue-500/[0.04] blur-[100px]" />
        <div className="absolute bottom-20 -left-20 w-[350px] h-[350px] rounded-full bg-green-500/[0.04] blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }} />
      </div>

      <div className="relative mx-auto max-w-[1280px] px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={mainInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-5"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={mainInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
          >
            <Rocket size={12} className="text-[#0067B8]" />
            <span className="text-[10px] font-black text-[#0067B8] tracking-[0.2em] uppercase">
              Next Steps
            </span>
          </motion.div>

          <h2 className="text-3xl lg:text-[2.75rem] font-bold leading-tight text-[#1A1A1A]">
            Get started with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">
              Cubicle
            </span>
          </h2>
        </motion.div>

        {/* Main CTA Card */}
        <motion.div
          ref={mainRef}
          initial={{ opacity: 0, y: 32 }}
          animate={mainInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-10 overflow-hidden rounded-2xl border border-[#E5E5E5] shadow-lg group"
        >
          <div className="grid md:grid-cols-2">
            {/* Left content */}
            <div className="p-10 lg:p-14 bg-white">
              <motion.div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 border border-green-100 mb-6"
                initial={{ opacity: 0, x: -15 }}
                animate={mainInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3 }}
              >
                <Sparkles size={12} className="text-green-600" />
                <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Free for 14 days</span>
              </motion.div>

              <h3 className="text-2xl lg:text-3xl font-bold text-[#1A1A1A]">
                Try for free
              </h3>
              <p className="mt-4 max-w-md text-[16px] text-[#505050] leading-relaxed">
                Get hands-on experience with Cubicle&apos;s complete business
                platform. No credit card required.
              </p>

              {/* Feature checklist */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                {trialFeatures.map((feature, i) => (
                  <motion.div
                    key={feature}
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -15 }}
                    animate={mainInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.35 + i * 0.08 }}
                  >
                    <CheckCircle2 size={14} className="text-green-600 shrink-0" />
                    <span className="text-sm text-[#505050]">{feature}</span>
                  </motion.div>
                ))}
              </div>

              <Link href="/auth/signup">
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: "0 8px 20px rgba(0,103,184,0.3)" }}
                  whileTap={{ scale: 0.97 }}
                  className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3.5 text-[15px] font-semibold text-white transition-all hover:-translate-y-0.5"
                >
                  Start a free trial
                  <ArrowRight size={16} />
                </motion.button>
              </Link>
            </div>

            {/* Right illustration */}
            <div className="relative hidden min-h-[320px] items-center justify-center md:flex overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop&q=80"
                alt="Team collaborating on CubicleERP platform"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#0067B8]/60 via-[#5C2D91]/40 to-[#0067B8]/50" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

              {/* Overlay content */}
              <div className="relative z-10 text-center px-8">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-4">
                  <Sparkles size={14} className="text-white" />
                  <span className="text-white text-[12px] font-semibold">No credit card required</span>
                </div>
                <p className="text-white/90 text-lg font-bold">Start building in minutes</p>
                <p className="text-white/60 text-[13px] mt-1">Setup takes less than 5 minutes</p>
              </div>

              {/* Connecting lines */}
              <motion.div
                className="absolute top-1/3 left-1/4 w-20 h-px bg-white/30"
                animate={{ scaleX: [0, 1, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute bottom-1/3 right-1/4 w-16 h-px bg-white/30"
                animate={{ scaleX: [0, 1, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Three smaller CTA cards */}
        <div ref={cardsRef} className="mt-6 grid gap-5 md:grid-cols-3">
          {smallCards.map((card, i) => {
            const Icon = card.icon
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 24 }}
                animate={cardsInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.5,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  delay: i * 0.12,
                }}
                whileHover={{ y: -5, boxShadow: `0 12px 30px ${card.color}15` }}
                className="rounded-2xl bg-white border-2 p-6 group cursor-pointer transition-all duration-300 relative overflow-hidden min-h-[200px] flex flex-col"
                style={{ borderColor: card.color + "20" }}
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(circle at top right, ${card.color}08, transparent 70%)` }}
                />
                {/* Top accent */}
                <div
                  className="absolute top-0 left-6 right-6 h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ backgroundColor: card.color }}
                />

                <div className="relative flex-1 flex flex-col">
                  <motion.div
                    className="flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{ backgroundColor: card.bg }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Icon className="h-5 w-5" style={{ color: card.color }} />
                  </motion.div>

                  <h4 className="mt-4 text-[17px] font-bold text-[#1A1A1A] group-hover:text-[#0067B8] transition-colors">
                    {card.title}
                  </h4>
                  <p className="mt-2 text-[13px] text-[#505050] leading-relaxed flex-1">{card.desc}</p>

                  <Link href={card.href}>
                    <motion.span
                      className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold group/link"
                      style={{ color: card.color }}
                      whileHover={{ x: 4 }}
                    >
                      {card.cta}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
                    </motion.span>
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
