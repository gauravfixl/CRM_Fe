"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import LP2Navbar from "@/components/landingpage2/LP2Navbar"
import LP2CTA from "@/components/landingpage2/LP2CTA"
import LP2Footer from "@/components/landingpage2/LP2Footer"
import {
  ArrowLeft,
  ArrowRight,
  Users,
  UserCheck,
  Briefcase,
  DollarSign,
  HeadphonesIcon,
  BarChart3,
  CheckCircle2,
  Target,
  Zap,
  Shield,
  TrendingUp,
} from "lucide-react"

const modules = [
  {
    icon: Users,
    title: "CRM",
    description: "Manage leads, deals, contacts, and your entire sales pipeline with AI-powered insights.",
    color: "#0067B8",
    bg: "#EBF3FB",
  },
  {
    icon: UserCheck,
    title: "HRM",
    description: "Recruitment, payroll, attendance tracking, and performance management — all automated.",
    color: "#107C10",
    bg: "#E8F5E9",
  },
  {
    icon: Briefcase,
    title: "Project Management",
    description: "Kanban boards, task dependencies, milestones, timelines, and team collaboration tools.",
    color: "#5C2D91",
    bg: "#F3EBF9",
  },
  {
    icon: DollarSign,
    title: "Finance",
    description: "Invoicing, expense tracking, financial reporting, and budget planning in one place.",
    color: "#008575",
    bg: "#E0F2F1",
  },
  {
    icon: HeadphonesIcon,
    title: "Helpdesk",
    description: "Ticketing system, SLA management, auto-assignment, and a self-service knowledge base.",
    color: "#D83B01",
    bg: "#FFF0E8",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "Custom dashboards, real-time metrics, exportable reports, and AI-generated insights.",
    color: "#0891B2",
    bg: "#E0F7FA",
  },
]

const reasons = [
  {
    icon: Target,
    title: "All-in-one platform",
    description: "No more switching between 10 different tools. CRM, HRM, projects, finance — everything in one place.",
  },
  {
    icon: Zap,
    title: "AI-powered intelligence",
    description: "Smart automations, lead scoring, predictive analytics, and an AI copilot built into every module.",
  },
  {
    icon: Shield,
    title: "Enterprise-grade security",
    description: "SOC 2 Type II certified, 256-bit encryption, GDPR compliant, and 99.9% uptime guaranteed.",
  },
  {
    icon: TrendingUp,
    title: "Scale with confidence",
    description: "From 5 users to 5,000 — CubicleERP grows with your business without missing a beat.",
  },
]

const stats = [
  { value: "10,000+", label: "Active Users" },
  { value: "50+", label: "Integrations" },
  { value: "99.9%", label: "Uptime" },
  { value: "150+", label: "Countries" },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Segoe UI', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <LP2Navbar />

      {/* Hero */}
      <section
        className="relative pt-24 pb-16 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #EBF3FB 0%, #F3EBF9 40%, #E0F2F1 70%, #FFF8E1 100%)" }}
      >
        <div className="absolute inset-0 bg-white/40 pointer-events-none" />
        <div className="relative max-w-[1280px] mx-auto px-6">
          <Link href="/#overview" className="inline-flex items-center gap-1.5 text-[#505050] text-sm hover:text-[#0067B8] transition-colors mb-6 relative z-10">
            <ArrowLeft size={15} /> Back to overview
          </Link>
          <motion.div
            className="flex flex-col lg:flex-row items-center gap-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Left content */}
            <div className="flex-1">
              <span className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-white/50 text-[#0067B8] px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide mb-5">
                About CubicleERP
              </span>
              <h1 className="text-[36px] lg:text-[48px] font-bold text-[#1A1A1A] leading-tight">
                The all-in-one platform for modern businesses
              </h1>
              <p className="mt-5 text-lg text-[#505050] leading-relaxed">
                CubicleERP brings together CRM, HRM, Project Management, Finance, Helpdesk, and Analytics into one unified, AI-powered platform.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/auth/signup" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#0067B8] text-white font-semibold text-[15px] hover:bg-[#005DA6] transition-colors">
                  Get started free <ArrowRight size={16} />
                </Link>
                <Link href="/auth/signin" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-[#E5E5E5] text-[#1A1A1A] font-semibold text-[15px] hover:bg-[#F5F5F5] transition-colors bg-white/60">
                  Contact sales
                </Link>
              </div>
            </div>
            {/* Right visual */}
            <div className="flex-1 flex justify-center">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: Users, label: "CRM", color: "#0067B8" },
                  { icon: UserCheck, label: "HRM", color: "#107C10" },
                  { icon: Briefcase, label: "Projects", color: "#5C2D91" },
                  { icon: DollarSign, label: "Finance", color: "#008575" },
                  { icon: HeadphonesIcon, label: "Helpdesk", color: "#D83B01" },
                  { icon: BarChart3, label: "Analytics", color: "#0891B2" },
                ].map((mod) => (
                  <motion.div
                    key={mod.label}
                    className="flex flex-col items-center gap-2 bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-white/50"
                    whileHover={{ y: -4, scale: 1.03 }}
                    transition={{ duration: 0.2 }}
                  >
                    <mod.icon size={28} style={{ color: mod.color }} />
                    <span className="text-xs font-semibold text-[#1A1A1A]">{mod.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-[30px] font-semibold text-[#1A1A1A] mb-5">Our Mission</h2>
              <p className="text-[16px] text-[#505050] leading-relaxed mb-4">
                We believe every business — from a 5-person startup to a 5,000-person enterprise — deserves access to powerful, intelligent tools that were once reserved for Fortune 500 companies.
              </p>
              <p className="text-[16px] text-[#505050] leading-relaxed">
                CubicleERP was built to eliminate the chaos of disconnected tools. One platform, one login, one source of truth — so your team can focus on what actually matters: growing your business.
              </p>
            </motion.div>
            <motion.div
              className="bg-[#EBF3FB] rounded-2xl p-10 flex items-center justify-center min-h-[300px]"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <div className="grid grid-cols-3 gap-4">
                {[Users, Briefcase, BarChart3, DollarSign, HeadphonesIcon, UserCheck].map((Icon, i) => (
                  <div key={i} className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center">
                    <Icon size={28} className="text-[#0067B8]" />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Platform Modules */}
      <section className="bg-[#F5F5F5] py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <motion.h2
            className="text-[30px] font-semibold text-[#1A1A1A] mb-3 text-center"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Everything you need, in one place
          </motion.h2>
          <motion.p
            className="text-[#505050] text-center mb-12 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Six powerful modules working together seamlessly.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((mod, i) => (
              <motion.div
                key={mod.title}
                className="bg-white rounded-xl p-6 border border-[#E5E5E5] hover:shadow-md transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: mod.bg }}>
                  <mod.icon size={24} style={{ color: mod.color }} />
                </div>
                <h3 className="text-[17px] font-semibold text-[#1A1A1A] mb-2">{mod.title}</h3>
                <p className="text-[14px] text-[#6B6B6B] leading-relaxed">{mod.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why CubicleERP */}
      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <motion.h2
            className="text-[30px] font-semibold text-[#1A1A1A] mb-10 text-center"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Why businesses choose CubicleERP
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reasons.map((reason, i) => (
              <motion.div
                key={reason.title}
                className="flex items-start gap-4 p-5 rounded-xl hover:bg-[#F9FAFB] transition-colors"
                initial={{ opacity: 0, x: i % 2 === 0 ? -16 : 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <CheckCircle2 size={24} className="text-[#0067B8] shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-[16px] font-semibold text-[#1A1A1A] mb-1">{reason.title}</h3>
                  <p className="text-[14px] text-[#6B6B6B] leading-relaxed">{reason.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-[#E5E5E5] py-12">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <p className="text-[32px] font-bold text-[#0067B8]">{stat.value}</p>
                <p className="text-sm text-[#6B6B6B] mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-[28px] font-semibold text-[#1A1A1A] mb-4">Ready to transform your business?</h2>
            <p className="text-[#6B6B6B] text-lg mb-8 max-w-xl mx-auto">
              Start your free trial today — no credit card required.
            </p>
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-[#0067B8] text-white font-semibold text-[15px] hover:bg-[#005DA6] transition-colors"
            >
              Get started free <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      <LP2CTA />
      <LP2Footer />
    </div>
  )
}