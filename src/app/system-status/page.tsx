"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import LP2Navbar from "@/components/landingpage2/LP2Navbar"
import LP2CTA from "@/components/landingpage2/LP2CTA"
import LP2Footer from "@/components/landingpage2/LP2Footer"
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Bell,
  Mail,
  Shield,
  Activity,
  Server,
  BarChart3,
  HardDrive,
  Globe,
  AlertTriangle,
  ArrowRight,
  Wifi,
} from "lucide-react"

const services = [
  { name: "CRM Module", description: "Contacts, deals, pipeline management", icon: Globe, status: "Operational" },
  { name: "HRM Module", description: "Employee management, payroll, attendance", icon: Shield, status: "Operational" },
  { name: "API Gateway", description: "REST API, webhooks, third-party integrations", icon: Server, status: "Operational" },
  { name: "Dashboard & Analytics", description: "Reports, charts, real-time metrics", icon: BarChart3, status: "Operational" },
  { name: "Email Service", description: "Transactional emails, notifications, campaigns", icon: Mail, status: "Operational" },
  { name: "File Storage", description: "Document uploads, attachments, cloud storage", icon: HardDrive, status: "Operational" },
]

const uptimeMetrics = [
  { period: "Today", uptime: "100%", color: "#107C10" },
  { period: "Last 7 days", uptime: "99.99%", color: "#107C10" },
  { period: "Last 30 days", uptime: "99.99%", color: "#107C10" },
  { period: "Last 90 days", uptime: "99.98%", color: "#107C10" },
]

const incidents = [
  {
    date: "March 22, 2026",
    title: "Elevated API latency in EU region",
    duration: "38 minutes",
    severity: "minor",
    description:
      "Some users in the EU region experienced increased API response times due to a networking issue at our Frankfurt data center. The issue was identified and resolved by rerouting traffic.",
    timeline: [
      { time: "14:12 UTC", event: "Increased latency detected by monitoring" },
      { time: "14:18 UTC", event: "Engineering team investigating" },
      { time: "14:35 UTC", event: "Traffic rerouted to backup data center" },
      { time: "14:50 UTC", event: "Latency returned to normal, incident resolved" },
    ],
  },
  {
    date: "March 10, 2026",
    title: "Email service delivery delays",
    duration: "1 hour 12 minutes",
    severity: "minor",
    description:
      "Transactional emails experienced delays of up to 15 minutes due to a queue backlog in our email processing pipeline. No emails were lost.",
    timeline: [
      { time: "09:05 UTC", event: "Email delivery delays reported" },
      { time: "09:15 UTC", event: "Queue backlog identified" },
      { time: "09:45 UTC", event: "Additional processing capacity deployed" },
      { time: "10:17 UTC", event: "All queued emails delivered, service normal" },
    ],
  },
  {
    date: "February 28, 2026",
    title: "Dashboard loading errors for some users",
    duration: "25 minutes",
    severity: "minor",
    description:
      "A subset of users experienced intermittent errors when loading the analytics dashboard. This was caused by a database connection pool exhaustion during a traffic spike.",
    timeline: [
      { time: "16:30 UTC", event: "Error rate spike detected" },
      { time: "16:34 UTC", event: "Root cause identified: connection pool exhaustion" },
      { time: "16:42 UTC", event: "Connection pool limits increased" },
      { time: "16:55 UTC", event: "Error rate returned to zero, incident resolved" },
    ],
  },
  {
    date: "February 14, 2026",
    title: "Scheduled maintenance: Database migration",
    duration: "2 hours (planned)",
    severity: "maintenance",
    description:
      "Planned maintenance window for database schema migration to support new HRM features. All services were fully operational within the scheduled window.",
    timeline: [
      { time: "02:00 UTC", event: "Maintenance window started" },
      { time: "02:15 UTC", event: "Database migration initiated" },
      { time: "03:30 UTC", event: "Migration completed, running verification" },
      { time: "04:00 UTC", event: "All systems verified, maintenance complete" },
    ],
  },
]

// Generate 90 days of mock uptime bars (all green with a few yellow)
const uptimeDays = Array.from({ length: 90 }, (_, i) => {
  const daysAgo = 89 - i
  if (daysAgo === 39 || daysAgo === 51) return { status: "degraded" }
  if (daysAgo === 32) return { status: "maintenance" }
  return { status: "operational" }
})

export default function SystemStatusPage() {
  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "'Segoe UI', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
    >
      <LP2Navbar />

      {/* Hero */}
      <section
        className="relative pt-24 pb-16 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #E8F5E9 0%, #EBF3FB 50%, #E0F2F1 100%)" }}
      >
        <div className="absolute inset-0 bg-white/40 pointer-events-none" />
        <div className="relative max-w-[1280px] mx-auto px-6">
          <Link
            href="/#overview"
            className="inline-flex items-center gap-1.5 text-[#505050] text-sm hover:text-[#0067B8] transition-colors mb-6 relative z-10"
          >
            <ArrowLeft size={15} /> Back to overview
          </Link>
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 bg-[#107C10]/10 backdrop-blur-sm border border-[#107C10]/20 text-[#107C10] px-5 py-2 rounded-full text-sm font-semibold tracking-wide mb-6"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#107C10] opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#107C10]" />
              </span>
              All Systems Operational
            </motion.div>
            <h1 className="text-[36px] lg:text-[48px] font-bold text-[#1A1A1A] leading-tight">
              System Status
            </h1>
            <p className="mt-5 text-lg text-[#505050] leading-relaxed">
              Real-time status of all CubicleERP services. We monitor every component around the clock to
              ensure maximum reliability for your business.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Status */}
      <section className="py-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-[24px] font-semibold text-[#1A1A1A] mb-2">Current Status</h2>
            <p className="text-[14px] text-[#6B7280]">All services are operating normally.</p>
          </motion.div>

          <div className="space-y-3">
            {services.map((service, i) => (
              <motion.div
                key={service.name}
                className="bg-white rounded-xl border border-[#E5E5E5] px-6 py-4 flex items-center justify-between hover:shadow-md transition-shadow duration-300"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#EBF3FB] flex items-center justify-center">
                    <service.icon size={20} className="text-[#0067B8]" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold text-[#1A1A1A]">{service.name}</h3>
                    <p className="text-[13px] text-[#6B7280]">{service.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-[#107C10]" />
                  <span className="text-[14px] font-medium text-[#107C10]">{service.status}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Uptime */}
      <section className="py-20 bg-[#FAFBFC]">
        <div className="max-w-[1280px] mx-auto px-6">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-[30px] font-semibold text-[#1A1A1A] mb-4">Uptime</h2>
            <p className="text-[16px] text-[#6B7280] max-w-2xl mx-auto">
              We are committed to maintaining industry-leading uptime across all services.
            </p>
          </motion.div>

          {/* Uptime Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {uptimeMetrics.map((metric, i) => (
              <motion.div
                key={metric.period}
                className="bg-white rounded-2xl border border-[#E5E5E5] p-6 text-center hover:shadow-lg transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className="text-[32px] font-bold" style={{ color: metric.color }}>
                  {metric.uptime}
                </div>
                <div className="text-[14px] text-[#6B7280] mt-1">{metric.period}</div>
              </motion.div>
            ))}
          </div>

          {/* 90-Day Uptime Bar */}
          <motion.div
            className="bg-white rounded-2xl border border-[#E5E5E5] p-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[16px] font-semibold text-[#1A1A1A]">90-Day Uptime History</h3>
              <span className="text-[14px] font-medium text-[#107C10]">99.99% average</span>
            </div>
            <div className="flex gap-[2px]">
              {uptimeDays.map((day, i) => (
                <div
                  key={i}
                  className="flex-1 h-8 rounded-sm transition-colors"
                  style={{
                    backgroundColor:
                      day.status === "operational"
                        ? "#107C10"
                        : day.status === "degraded"
                          ? "#F59E0B"
                          : "#6B7280",
                  }}
                  title={
                    day.status === "operational"
                      ? "No issues"
                      : day.status === "degraded"
                        ? "Minor degradation"
                        : "Scheduled maintenance"
                  }
                />
              ))}
            </div>
            <div className="flex items-center justify-between mt-3 text-[12px] text-[#6B7280]">
              <span>90 days ago</span>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-sm bg-[#107C10]" /> Operational
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-sm bg-[#F59E0B]" /> Degraded
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-sm bg-[#6B7280]" /> Maintenance
                </span>
              </div>
              <span>Today</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Incident History */}
      <section className="py-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-[30px] font-semibold text-[#1A1A1A] mb-4">Incident History</h2>
            <p className="text-[16px] text-[#6B7280]">
              A transparent log of past incidents and scheduled maintenance.
            </p>
          </motion.div>

          <div className="space-y-6">
            {incidents.map((incident, i) => (
              <motion.div
                key={incident.date}
                className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden hover:shadow-md transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <div className="px-6 py-4 border-b border-[#E5E5E5] flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {incident.severity === "maintenance" ? (
                      <div className="w-8 h-8 rounded-lg bg-[#F3F4F6] flex items-center justify-center">
                        <Clock size={16} className="text-[#6B7280]" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] flex items-center justify-center">
                        <AlertTriangle size={16} className="text-[#F59E0B]" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-[15px] font-semibold text-[#1A1A1A]">{incident.title}</h3>
                      <span className="text-[13px] text-[#6B7280]">{incident.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: incident.severity === "maintenance" ? "#F3F4F6" : "#FEF3C7",
                        color: incident.severity === "maintenance" ? "#6B7280" : "#B45309",
                      }}
                    >
                      {incident.severity === "maintenance" ? "Maintenance" : "Minor"}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E8F5E9] text-[#107C10]">
                      <CheckCircle2 size={12} /> Resolved
                    </span>
                    <span className="text-[13px] text-[#6B7280]">{incident.duration}</span>
                  </div>
                </div>

                <div className="px-6 py-4">
                  <p className="text-[14px] text-[#505050] leading-relaxed mb-4">{incident.description}</p>
                  <div className="border-l-2 border-[#E5E5E5] pl-4 space-y-3">
                    {incident.timeline.map((entry) => (
                      <div key={entry.time} className="flex items-start gap-3">
                        <code className="text-[12px] text-[#0067B8] bg-[#EBF3FB] px-2 py-0.5 rounded shrink-0">
                          {entry.time}
                        </code>
                        <span className="text-[13px] text-[#505050]">{entry.event}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscribe */}
      <section className="py-20 bg-[#FAFBFC]">
        <div className="max-w-[1280px] mx-auto px-6">
          <motion.div
            className="bg-white rounded-2xl border border-[#E5E5E5] p-10 text-center max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-14 h-14 rounded-2xl bg-[#EBF3FB] flex items-center justify-center mx-auto mb-5">
              <Bell size={26} className="text-[#0067B8]" />
            </div>
            <h2 className="text-[24px] font-semibold text-[#1A1A1A] mb-3">Subscribe to Updates</h2>
            <p className="text-[15px] text-[#6B7280] leading-relaxed mb-6">
              Get notified via email or Slack when there is an incident, scheduled maintenance, or status
              change. Stay informed without constantly checking this page.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 rounded-lg border border-[#E5E5E5] text-[14px] text-[#1A1A1A] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#0067B8] focus:ring-1 focus:ring-[#0067B8]"
              />
              <button className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#0067B8] text-white font-semibold text-[14px] hover:bg-[#005DA6] transition-colors shrink-0">
                <Bell size={14} /> Subscribe
              </button>
            </div>
            <div className="flex items-center justify-center gap-6 mt-6">
              <button className="inline-flex items-center gap-2 text-[13px] text-[#6B7280] hover:text-[#0067B8] transition-colors">
                <Mail size={14} /> Email alerts
              </button>
              <button className="inline-flex items-center gap-2 text-[13px] text-[#6B7280] hover:text-[#0067B8] transition-colors">
                <Wifi size={14} /> RSS feed
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <LP2CTA />
      <LP2Footer />
    </div>
  )
}
