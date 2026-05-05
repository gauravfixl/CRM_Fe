"use client"

import { motion } from "framer-motion"
import { MessageSquare, Chrome, CreditCard, Zap, ArrowRight, Star, Puzzle, ExternalLink } from "lucide-react"
import { useIntersection } from "./hooks/useIntersection"

const apps = [
  {
    icon: MessageSquare,
    color: "#4CAF50",
    bg: "#E8F5E9",
    company: "Slack Technologies",
    name: "Slack",
    description:
      "Connect your workspace and get real-time notifications for leads, deals, and tickets.",
    rating: 4.7,
    reviews: "12,480",
    tag: "Communication",
  },
  {
    icon: Chrome,
    color: "#1A73E8",
    bg: "#E3F2FD",
    company: "Google LLC",
    name: "Google Workspace",
    description:
      "Sync calendars, contacts, and emails with your Cubicle workspace seamlessly.",
    rating: 4.5,
    reviews: "98,200",
    tag: "Productivity",
  },
  {
    icon: CreditCard,
    color: "#6C5CE7",
    bg: "#EDE7F6",
    company: "Stripe Inc.",
    name: "Stripe Payments",
    description:
      "Process payments, manage subscriptions, and handle invoicing directly from Cubicle.",
    rating: 4.6,
    reviews: "45,600",
    tag: "Payments",
  },
  {
    icon: Zap,
    color: "#FF6D00",
    bg: "#FFF3E0",
    company: "Zapier Inc.",
    name: "Zapier",
    description:
      "Automate workflows by connecting Cubicle with 5,000+ apps without code.",
    rating: 4.4,
    reviews: "32,100",
    tag: "Automation",
  },
]

const stats = [
  { value: "200+", label: "Integrations" },
  { value: "5M+", label: "Connected Apps" },
  { value: "99.9%", label: "API Uptime" },
  { value: "24/7", label: "Support" },
]

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating)
  const hasHalf = rating - fullStars >= 0.3

  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i < fullStars
            ? "fill-[#F59E0B] text-[#F59E0B]"
            : i === fullStars && hasHalf
              ? "fill-[#F59E0B]/50 text-[#F59E0B]"
              : "fill-[#E5E5E5] text-[#E5E5E5]"
            }`}
        />
      ))}
    </span>
  )
}

export default function LP2Integrations() {
  const [sectionRef, inView] = useIntersection("-80px")

  return (
    <section id="apps-addons" className="relative py-24 overflow-hidden border-t border-[#E5E5E5]">
      {/* Background */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #F7F9FC 50%, #FFFFFF 100%)" }} />

      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 -right-20 w-[400px] h-[400px] rounded-full bg-blue-500/[0.04] blur-[100px]" />
        <div className="absolute bottom-10 -left-20 w-[350px] h-[350px] rounded-full bg-purple-500/[0.04] blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-orange-500/[0.03] blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }} />
      </div>

      <div
        ref={sectionRef}
        className="relative max-w-[1280px] mx-auto px-6"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-14"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-5"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
          >
            <Puzzle size={12} className="text-[#0067B8]" />
            <span className="text-xs tracking-widest font-bold uppercase text-[#0067B8]">
              Apps &amp; Add-ons
            </span>
          </motion.div>

          <h2 className="text-3xl lg:text-[2.75rem] font-bold text-[#1A1A1A] leading-tight">
            Customize Cubicle with apps from our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500">
              Marketplace
            </span>
          </h2>
          <p className="text-base text-[#6B6B6B] mt-4 max-w-2xl mx-auto leading-relaxed">
            Better meet your specific business needs by adding industry-leading
            integrations to Cubicle.
          </p>

          <motion.a
            href="/marketplace"
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0067B8] text-white font-semibold text-sm hover:bg-[#005DA6] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg group"
          >
            View all apps
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </motion.a>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          className="flex justify-center gap-4 mb-14 flex-wrap"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/80 px-8 py-5 text-center hover:bg-white hover:shadow-md transition-all duration-300 min-w-[180px]"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.08 }}
              whileHover={{ y: -3 }}
            >
              <p className="text-2xl lg:text-3xl font-bold text-[#0067B8]">{stat.value}</p>
              <p className="text-xs text-[#6B6B6B] font-medium mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Cards Grid */}
        <div className="flex justify-center gap-5 flex-wrap">
          {apps.map((app, index) => {
            const Icon = app.icon

            return (
              <motion.div
                key={app.name}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: 0.25 + 0.1 * index,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                whileHover={{ y: -6, boxShadow: `0 16px 40px ${app.color}18` }}
                className="bg-white rounded-2xl border-2 p-6 flex flex-col transition-all duration-300 group cursor-pointer relative overflow-hidden w-full sm:w-[280px]"
                style={{ borderColor: app.color + "20" }}
              >
                {/* Hover glow */}
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(circle at top right, ${app.color}08, transparent 70%)` }}
                />

                {/* Top accent */}
                <div className="absolute top-0 left-6 right-6 h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: app.color }} />

                {/* Tag */}
                <motion.span
                  className="self-start px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 relative"
                  style={{ backgroundColor: app.bg, color: app.color }}
                >
                  {app.tag}
                </motion.span>

                {/* Icon + Company */}
                <div className="flex items-center gap-3 relative">
                  <motion.div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: app.bg }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Icon className="w-6 h-6" style={{ color: app.color }} />
                  </motion.div>
                  <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: app.color }}>
                    {app.company}
                  </span>
                </div>

                {/* Product Name */}
                <h3 className="text-xl font-bold text-[#1A1A1A] mt-3 group-hover:text-[#0067B8] transition-colors relative">
                  {app.name}
                </h3>

                {/* Description */}
                <p className="text-[14px] text-[#505050] mt-2 leading-relaxed line-clamp-2 relative">
                  {app.description}
                </p>

                {/* Bottom: Rating + Learn More */}
                <div className="flex items-center mt-auto pt-5 relative">
                  <div className="flex items-center gap-2">
                    <StarRating rating={app.rating} />
                    <span className="text-[13px] text-[#505050] font-medium">
                      {app.rating}
                    </span>
                    <span className="text-[11px] text-[#6B6B6B]">
                      ({app.reviews})
                    </span>
                  </div>
                  <motion.a
                    href="#"
                    className="ml-auto flex items-center gap-1.5 font-semibold text-[13px] transition-colors"
                    style={{ color: app.color }}
                    whileHover={{ x: 3 }}
                  >
                    Learn More
                    <ExternalLink className="w-3.5 h-3.5" />
                  </motion.a>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* View all apps - mobile */}
        <motion.a
          href="/marketplace"
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="lg:hidden flex items-center gap-2 mt-10 group"
        >
          <span className="w-9 h-9 rounded-full bg-[#0067B8] text-white flex items-center justify-center group-hover:bg-[#005DA6] transition-all shadow-md group-hover:shadow-lg">
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </span>
          <span className="text-[#1A1A1A] font-semibold text-[15px] group-hover:text-[#0067B8] transition-colors">
            View all apps
          </span>
        </motion.a>
      </div>
    </section>
  )
}
