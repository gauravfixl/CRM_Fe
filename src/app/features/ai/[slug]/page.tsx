"use client"

import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import LP2Navbar from "@/components/landingpage2/LP2Navbar"
import LP2CTA from "@/components/landingpage2/LP2CTA"
import LP2Footer from "@/components/landingpage2/LP2Footer"
import {
  BrainCircuit,
  MessageSquareText,
  TrendingUp,
  Workflow,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Zap,
} from "lucide-react"

const featureData: Record<string, {
  icon: typeof BrainCircuit
  title: string
  subtitle: string
  description: string
  gradient: string
  color: string
  highlights: string[]
  useCases: { title: string; description: string }[]
  stats: { value: string; label: string }[]
}> = {
  "ai-lead-scoring": {
    icon: BrainCircuit,
    title: "AI Lead Scoring",
    subtitle: "Prioritize the leads that matter most",
    description:
      "Our AI-powered lead scoring engine analyzes dozens of behavioral signals, engagement patterns, and firmographic data to automatically rank and prioritize your leads. Stop wasting time on cold prospects — focus your energy where it counts.",
    gradient: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
    color: "#8B5CF6",
    highlights: [
      "Automatic scoring based on 50+ behavioral signals",
      "Real-time score updates as leads engage",
      "Custom scoring models tailored to your business",
      "Seamless integration with your sales pipeline",
      "Predictive conversion probability for each lead",
      "Instant alerts when high-value leads are detected",
    ],
    useCases: [
      {
        title: "Sales Teams",
        description: "Prioritize outreach to leads most likely to convert, improving close rates by up to 35%.",
      },
      {
        title: "Marketing Teams",
        description: "Identify which campaigns generate the highest-quality leads and optimize spend accordingly.",
      },
      {
        title: "Revenue Operations",
        description: "Align sales and marketing with a single source of truth for lead quality and pipeline health.",
      },
    ],
    stats: [
      { value: "35%", label: "Higher close rates" },
      { value: "50+", label: "Behavioral signals" },
      { value: "2x", label: "Faster qualification" },
      { value: "90%", label: "Scoring accuracy" },
    ],
  },
  "ai-email-writer": {
    icon: MessageSquareText,
    title: "AI Email Writer",
    subtitle: "Craft perfect emails in seconds",
    description:
      "Generate personalized, professional emails for any situation — follow-ups, proposals, introductions, and more. Our AI understands context, adapts to your brand voice, and optimizes for engagement.",
    gradient: "linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)",
    color: "#3B82F6",
    highlights: [
      "One-click email generation from deal context",
      "Adapts to your brand voice and writing style",
      "A/B test subject lines with AI suggestions",
      "Multi-language support for global teams",
      "Smart follow-up sequences with optimal timing",
      "Email performance analytics and open tracking",
    ],
    useCases: [
      {
        title: "Account Executives",
        description: "Draft personalized proposals and follow-ups in seconds, not hours.",
      },
      {
        title: "SDRs & BDRs",
        description: "Scale outreach with AI-generated emails that feel personal and drive responses.",
      },
      {
        title: "Customer Success",
        description: "Automate check-in emails, renewal reminders, and onboarding sequences.",
      },
    ],
    stats: [
      { value: "10x", label: "Faster email drafting" },
      { value: "42%", label: "Higher open rates" },
      { value: "28%", label: "More replies" },
      { value: "15+", label: "Languages supported" },
    ],
  },
  "predictive-analytics": {
    icon: TrendingUp,
    title: "Predictive Analytics",
    subtitle: "See the future of your business",
    description:
      "Leverage machine learning to forecast revenue, predict churn, and uncover hidden trends in your data. Make decisions backed by intelligence, not just intuition.",
    gradient: "linear-gradient(135deg, #34D399 0%, #10B981 100%)",
    color: "#10B981",
    highlights: [
      "Revenue forecasting with 95% accuracy",
      "Churn prediction 30 days in advance",
      "Pipeline health scoring and risk alerts",
      "Trend analysis across all business metrics",
      "Custom dashboards with AI-generated insights",
      "Automated weekly intelligence reports",
    ],
    useCases: [
      {
        title: "Sales Leaders",
        description: "Forecast quarterly revenue with confidence and identify deals at risk early.",
      },
      {
        title: "Finance Teams",
        description: "Model scenarios, predict cash flow, and plan budgets with data-driven accuracy.",
      },
      {
        title: "C-Suite",
        description: "Get a bird's-eye view of business health with AI-summarized executive dashboards.",
      },
    ],
    stats: [
      { value: "95%", label: "Forecast accuracy" },
      { value: "30d", label: "Early churn warning" },
      { value: "3x", label: "Faster reporting" },
      { value: "50+", label: "Metric tracking" },
    ],
  },
  "smart-automations": {
    icon: Workflow,
    title: "Smart Automations",
    subtitle: "Let workflows run themselves",
    description:
      "Build intelligent, AI-driven workflows that adapt in real-time. From lead routing to task assignment, automate repetitive work and let your team focus on what matters.",
    gradient: "linear-gradient(135deg, #A78BFA 0%, #818CF8 100%)",
    color: "#818CF8",
    highlights: [
      "Visual drag-and-drop workflow builder",
      "AI-powered conditional branching",
      "200+ pre-built automation templates",
      "Cross-module triggers and actions",
      "Real-time workflow monitoring and logs",
      "Automatic error handling and retries",
    ],
    useCases: [
      {
        title: "Sales Operations",
        description: "Auto-route leads, assign tasks, and trigger follow-ups based on deal stage changes.",
      },
      {
        title: "HR Teams",
        description: "Automate onboarding checklists, approval workflows, and document collection.",
      },
      {
        title: "Project Managers",
        description: "Trigger task creation, notifications, and status updates when milestones are reached.",
      },
    ],
    stats: [
      { value: "200+", label: "Templates available" },
      { value: "80%", label: "Less manual work" },
      { value: "5min", label: "Avg setup time" },
      { value: "24/7", label: "Always running" },
    ],
  },
  "ai-copilot": {
    icon: Sparkles,
    title: "AI Copilot",
    subtitle: "Your intelligent assistant, always on",
    description:
      "An AI-powered assistant built into every screen. Ask questions, get summaries, draft content, and receive smart suggestions — all without leaving your workflow.",
    gradient: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
    color: "#4F46E5",
    highlights: [
      "Natural language queries across all your data",
      "Automatic meeting summaries and action items",
      "Smart suggestions based on your context",
      "One-click report generation from conversations",
      "Inline content drafting for notes and documents",
      "Voice command support for hands-free use",
    ],
    useCases: [
      {
        title: "Everyone",
        description: "Ask Copilot anything — from 'What are my top deals this week?' to 'Draft a project status update.'",
      },
      {
        title: "Managers",
        description: "Get instant team performance summaries, meeting recaps, and next-step recommendations.",
      },
      {
        title: "New Employees",
        description: "Ramp up faster with an AI guide that explains processes, answers questions, and finds resources.",
      },
    ],
    stats: [
      { value: "60%", label: "Time saved daily" },
      { value: "100+", label: "Supported queries" },
      { value: "< 2s", label: "Response time" },
      { value: "99%", label: "Query accuracy" },
    ],
  },
  "ai-data-enrichment": {
    icon: ShieldCheck,
    title: "AI Data Enrichment",
    subtitle: "Complete, accurate, always up to date",
    description:
      "Automatically fill missing fields, verify contact information, and enrich your records from trusted public data sources. Keep your CRM clean without lifting a finger.",
    gradient: "linear-gradient(135deg, #C4B5FD 0%, #A78BFA 100%)",
    color: "#A78BFA",
    highlights: [
      "Auto-fill company size, industry, and revenue",
      "Email verification and deliverability scoring",
      "Phone number validation and formatting",
      "Social profile linking (LinkedIn, Twitter)",
      "Duplicate detection and merge suggestions",
      "Scheduled re-enrichment to keep data fresh",
    ],
    useCases: [
      {
        title: "Data Teams",
        description: "Eliminate manual data entry and maintain 99% data completeness across your CRM.",
      },
      {
        title: "Sales Reps",
        description: "Walk into every call prepared — enriched contacts give you full context before you dial.",
      },
      {
        title: "Marketing",
        description: "Segment audiences with confidence using enriched firmographic and demographic data.",
      },
    ],
    stats: [
      { value: "99%", label: "Data completeness" },
      { value: "50M+", label: "Records enriched" },
      { value: "0", label: "Manual data entry" },
      { value: "Weekly", label: "Auto re-enrichment" },
    ],
  },
}

export default function AIFeaturePage() {
  const params = useParams()
  const slug = params.slug as string
  const feature = featureData[slug]

  if (!feature) {
    return (
      <div className="min-h-screen bg-white" style={{ fontFamily: "'Segoe UI', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
        <LP2Navbar />
        <div className="pt-32 pb-20 text-center">
          <h1 className="text-3xl font-bold text-[#1A1A1A]">Feature not found</h1>
          <Link href="/" className="mt-4 inline-flex items-center gap-2 text-[#0067B8] font-medium">
            <ArrowLeft size={16} /> Back to home
          </Link>
        </div>
        <LP2CTA />
        <LP2Footer />
      </div>
    )
  }

  const Icon = feature.icon

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Segoe UI', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <LP2Navbar />

      {/* Back to home - fixed top left */}
      <div className="fixed top-20 left-6 z-40">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-sm border border-[#E5E7EB] text-[#505050] text-sm font-medium hover:text-[#0067B8] hover:border-[#0067B8]/30 transition-all px-3.5 py-2 rounded-xl shadow-sm"
        >
          <ArrowLeft size={15} /> Back to home
        </Link>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-16">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{ background: feature.gradient }}
        />
        <div className="relative max-w-[1080px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: feature.gradient }}
              >
                <Icon size={28} color="#fff" />
              </div>
              <div>
                <h1 className="text-[36px] lg:text-[44px] font-bold text-[#1A1A1A] leading-tight">
                  {feature.title}
                </h1>
              </div>
            </div>

            <p className="text-xl text-[#505050] font-medium mb-3">
              {feature.subtitle}
            </p>
            <p className="text-[16px] text-[#6B6B6B] max-w-3xl leading-relaxed">
              {feature.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white font-semibold text-[15px] hover:opacity-90 transition-opacity"
                style={{ background: feature.gradient }}
              >
                Get started free <ArrowRight size={16} />
              </Link>
              <Link
                href="/auth/signin"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-[#E5E5E5] text-[#1A1A1A] font-semibold text-[15px] hover:bg-[#F5F5F5] transition-colors"
              >
                Sign in to explore
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-[#E5E5E5] py-10">
        <div className="max-w-[1080px] mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {feature.stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * i }}
              >
                <p className="text-[32px] font-bold" style={{ color: feature.color }}>
                  {stat.value}
                </p>
                <p className="text-sm text-[#6B6B6B] mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Capabilities */}
      <section className="py-16">
        <div className="max-w-[1080px] mx-auto px-6">
          <motion.h2
            className="text-[28px] font-semibold text-[#1A1A1A] mb-10"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Key capabilities
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {feature.highlights.map((item, i) => (
              <motion.div
                key={item}
                className="flex items-start gap-3 p-4 rounded-lg hover:bg-[#F9FAFB] transition-colors"
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <CheckCircle2
                  size={20}
                  className="shrink-0 mt-0.5"
                  style={{ color: feature.color }}
                />
                <span className="text-[15px] text-[#1A1A1A]">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="bg-[#F5F5F5] py-16">
        <div className="max-w-[1080px] mx-auto px-6">
          <motion.h2
            className="text-[28px] font-semibold text-[#1A1A1A] mb-10"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Who it&apos;s for
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {feature.useCases.map((uc, i) => (
              <motion.div
                key={uc.title}
                className="bg-white rounded-xl p-6 border border-[#E5E5E5]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                  style={{ background: feature.gradient }}
                >
                  <Zap size={18} color="#fff" />
                </div>
                <h3 className="text-[17px] font-semibold text-[#1A1A1A] mb-2">
                  {uc.title}
                </h3>
                <p className="text-[14px] text-[#6B6B6B] leading-relaxed">
                  {uc.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-[1080px] mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-[28px] font-semibold text-[#1A1A1A] mb-4">
              Ready to try {feature.title}?
            </h2>
            <p className="text-[#6B6B6B] text-lg mb-8 max-w-xl mx-auto">
              Get started for free — no credit card required. See how AI can transform your workflow today.
            </p>
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg text-white font-semibold text-[15px] hover:opacity-90 transition-opacity"
              style={{ background: feature.gradient }}
            >
              Start free trial <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      <LP2Footer />
    </div>
  )
}
