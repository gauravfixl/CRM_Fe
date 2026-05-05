"use client"

import { motion } from "framer-motion"
import {
  Sparkles,
  BrainCircuit,
  MessageSquareText,
  TrendingUp,
  Workflow,
  ShieldCheck,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"

const aiFeatures = [
  {
    icon: BrainCircuit,
    title: "AI Lead Scoring",
    slug: "ai-lead-scoring",
    description:
      "Automatically score and prioritize leads based on behavior, engagement, and fit — so your team focuses on deals that close.",
    color: "#FFFFFF",
    iconBg: "rgba(255,255,255,0.2)",
    gradient: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
    shadowColor: "rgba(139, 92, 246, 0.25)",
    accentLight: "rgba(255,255,255,0.08)",
  },
  {
    icon: MessageSquareText,
    title: "AI Email Writer",
    slug: "ai-email-writer",
    description:
      "Generate personalized emails, follow-ups, and proposals in seconds. AI adapts tone and content to each recipient.",
    color: "#FFFFFF",
    iconBg: "rgba(255,255,255,0.2)",
    gradient: "linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)",
    shadowColor: "rgba(96, 165, 250, 0.25)",
    accentLight: "rgba(255,255,255,0.08)",
  },
  {
    icon: TrendingUp,
    title: "Predictive Analytics",
    slug: "predictive-analytics",
    description:
      "Forecast revenue, identify churn risk, and surface trends before they happen — powered by machine learning.",
    color: "#FFFFFF",
    iconBg: "rgba(255,255,255,0.2)",
    gradient: "linear-gradient(135deg, #34D399 0%, #10B981 100%)",
    shadowColor: "rgba(52, 211, 153, 0.25)",
    accentLight: "rgba(255,255,255,0.08)",
  },
  {
    icon: Workflow,
    title: "Smart Automations",
    slug: "smart-automations",
    description:
      "Build intelligent workflows that adapt in real-time. AI triggers actions, routes tasks, and eliminates manual work.",
    color: "#FFFFFF",
    iconBg: "rgba(255,255,255,0.2)",
    gradient: "linear-gradient(135deg, #A78BFA 0%, #818CF8 100%)",
    shadowColor: "rgba(167, 139, 250, 0.25)",
    accentLight: "rgba(255,255,255,0.08)",
  },
  {
    icon: Sparkles,
    title: "AI Copilot",
    slug: "ai-copilot",
    description:
      "Your always-on assistant that summarizes meetings, drafts reports, answers questions, and suggests next best actions.",
    color: "#FFFFFF",
    iconBg: "rgba(255,255,255,0.2)",
    gradient: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
    shadowColor: "rgba(99, 102, 241, 0.25)",
    accentLight: "rgba(255,255,255,0.08)",
  },
  {
    icon: ShieldCheck,
    title: "AI Data Enrichment",
    slug: "ai-data-enrichment",
    description:
      "Automatically fill missing contact details, verify emails, and enrich records from public data sources.",
    color: "#FFFFFF",
    iconBg: "rgba(255,255,255,0.2)",
    gradient: "linear-gradient(135deg, #C4B5FD 0%, #A78BFA 100%)",
    shadowColor: "rgba(196, 181, 253, 0.25)",
    accentLight: "rgba(255,255,255,0.08)",
  },
]

export default function LP2AIShowcase() {
  return (
    <section className="relative bg-gray-50 py-24 overflow-hidden">
      {/* Animated background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full opacity-10 blur-[120px]"
          style={{ background: "radial-gradient(circle, #7C3AED, transparent)" }}
          animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full opacity-10 blur-[120px]"
          style={{ background: "radial-gradient(circle, #2563EB, transparent)" }}
          animate={{ x: [0, -60, 0], y: [0, -40, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-8 blur-[100px]"
          style={{ background: "radial-gradient(circle, #059669, transparent)" }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative max-w-[1280px] mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
        >
          <motion.span
            className="inline-flex items-center gap-2 bg-purple-100 backdrop-blur-sm border border-purple-200 text-purple-700 px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            AI-Powered Platform
          </motion.span>
          <h2 className="mt-6 text-[34px] lg:text-[46px] font-bold text-gray-900 leading-tight">
            Intelligence built into{" "}
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
              every workflow
            </span>
          </h2>
          <p className="mt-5 text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            From lead scoring to predictive analytics — AI works across every module to help your team move faster and smarter.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {aiFeatures.map((feature, i) => (
            <Link key={feature.title} href={`/features/ai/${feature.slug}`}>
              <motion.div
                className="group relative rounded-2xl p-5 cursor-pointer overflow-hidden h-[220px]"
                style={{ background: feature.gradient }}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
              >
                {/* Card glow on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                  style={{ boxShadow: `0 20px 60px ${feature.shadowColor}` }}
                />

                {/* Decorative circles */}
                <div
                  className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-500"
                  style={{ background: feature.accentLight }}
                />
                <div
                  className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-500"
                  style={{ background: feature.accentLight }}
                />

                {/* Shimmer effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                  <div
                    className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
                    }}
                  />
                </div>

                <div className="relative z-10">
                  {/* Icon */}
                  <motion.div
                    className="w-11 h-11 rounded-lg flex items-center justify-center mb-4 backdrop-blur-sm"
                    style={{ backgroundColor: feature.iconBg }}
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <feature.icon size={22} color={feature.color} />
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-[16px] font-bold text-white mb-2">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[13px] text-white/75 leading-relaxed line-clamp-3">
                    {feature.description}
                  </p>

                  {/* Learn more link */}
                  <div className="mt-3 flex items-center gap-1.5 text-white/60 group-hover:text-white/90 transition-colors duration-300">
                    <span className="text-[13px] font-medium">Learn more</span>
                    <ArrowRight
                      size={14}
                      className="group-hover:translate-x-1 transition-transform duration-300"
                    />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-14 text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2.5 bg-purple-600 text-white font-semibold text-[15px] px-7 py-3.5 rounded-lg hover:bg-purple-700 hover:gap-3.5 transition-all duration-300 shadow-lg shadow-purple-600/20"
          >
            Explore all AI features
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}