"use client"

import { motion } from "framer-motion"
import { MessageSquare, Video, HardDrive, Github, CreditCard, Zap, Cloud, Calculator, Mail, Phone, Server, FileText, CheckSquare, Chrome, Users, Kanban } from "lucide-react"
import { useIntersection } from "./hooks/useIntersection"

const integrations = [
  { icon: MessageSquare, label: "Slack", color: "#E01E5A" },
  { icon: Chrome, label: "Google", color: "#4285F4" },
  { icon: Video, label: "Zoom", color: "#2D8CFF" },
  { icon: HardDrive, label: "Dropbox", color: "#0061FF" },
  { icon: Github, label: "GitHub", color: "#8B5CF6" },
  { icon: CreditCard, label: "Stripe", color: "#6366F1" },
  { icon: Zap, label: "Zapier", color: "#FF4F00" },
  { icon: Users, label: "HubSpot", color: "#FF7A59" },
  { icon: Cloud, label: "Salesforce", color: "#00A1E0" },
  { icon: Kanban, label: "Jira", color: "#0052CC" },
  { icon: Calculator, label: "QuickBooks", color: "#2CA01C" },
  { icon: Mail, label: "Mailchimp", color: "#FFE01B" },
  { icon: Phone, label: "Twilio", color: "#F22F46" },
  { icon: Server, label: "AWS", color: "#FF9900" },
  { icon: FileText, label: "Notion", color: "#FFFFFF" },
  { icon: CheckSquare, label: "Asana", color: "#F06A6A" },
]

export default function LP1Integrations() {
  const [ref, inView] = useIntersection("-60px")

  return (
    <section id="integrations" className="py-28 bg-gradient-to-b from-slate-50 to-indigo-50/20 dark:bg-[#060620] relative overflow-hidden" ref={ref}>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/[0.06] to-transparent" />

      <div className="max-w-[1000px] mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-[11px] font-semibold text-[#6366F1] dark:text-[#818CF8] uppercase tracking-[0.2em] mb-4">
            Integrations
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-[-0.02em] leading-[1.1] mb-4">
            Plays nice with
            <span className="text-slate-300 dark:text-white/25"> your stack</span>
          </h2>
          <p className="text-base text-slate-500 dark:text-white/35 max-w-md mx-auto">
            Connect with 50+ tools your team already uses every day.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {integrations.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.025, duration: 0.35 }}
              whileHover={{ y: -6, scale: 1.08, transition: { duration: 0.2 } }}
              className="group aspect-square flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100/50 to-blue-50/40 dark:from-white/[0.06] dark:to-white/[0.03] border border-indigo-200/30 dark:border-white/[0.08] hover:border-indigo-300/50 dark:hover:border-white/15 hover:shadow-lg hover:shadow-indigo-200/20 transition-all cursor-default"
            >
              <div className="w-8 h-8 rounded-xl bg-indigo-100/50 dark:bg-white/[0.08] group-hover:bg-indigo-200/50 dark:group-hover:bg-white/12 flex items-center justify-center mb-1.5 transition-colors">
                <item.icon className="w-4 h-4 text-slate-400 dark:text-white/25 group-hover:text-slate-600 dark:group-hover:text-white/60 transition-colors" />
              </div>
              <span className="text-[9px] font-semibold text-slate-400 dark:text-white/25 group-hover:text-slate-600 dark:group-hover:text-white/50 transition-colors">{item.label}</span>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center text-[13px] text-slate-400 dark:text-white/25 mt-8"
        >
          And 50+ more through our API and marketplace
        </motion.p>
      </div>
    </section>
  )
}
