"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Minus } from "lucide-react"
import { useIntersection } from "./hooks/useIntersection"

const faqItems = [
  { q: "What is Cubicle?", a: "Cubicle is an all-in-one ERP platform that combines CRM, HRM, Project Management, Finance, Client Portal, and Helpdesk into a single unified workspace for modern businesses." },
  { q: "How many modules are included?", a: "Six core modules: CRM, HRM, Project Management, Finance, Client Portal, and Helpdesk. All modules work seamlessly together with shared data and workflows." },
  { q: "Can I try it for free?", a: "Yes! Our Starter plan is completely free with up to 5 team members. Business and Enterprise plans include a 14-day free trial with full access — no credit card required." },
  { q: "Is my data secure?", a: "Absolutely. SOC2 compliant, 256-bit encryption, MFA, role-based access control, comprehensive audit logs, and GDPR compliance are all included from day one." },
  { q: "Can I import data from other tools?", a: "Yes. Bulk import from CSV/Excel and integrations with Salesforce, HubSpot, Jira, QuickBooks, and more. Enterprise customers get custom migration assistance." },
  { q: "What kind of support do you offer?", a: "Starter gets email support. Business gets priority support. Enterprise gets 24/7 dedicated support with a named account manager and custom training." },
  { q: "Is there a team size limit?", a: "Starter supports 5 members, Business up to 25, and Enterprise is unlimited. Upgrade or downgrade anytime as your team grows." },
  { q: "Do you offer custom integrations?", a: "Enterprise plans include API access and custom webhooks. We also offer a marketplace of pre-built integrations and professional services for custom connectors." },
]

export default function LP1FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [ref, inView] = useIntersection("-60px")

  return (
    <section id="faq" className="py-28 bg-[#FAFBFF] dark:bg-[#0A0A2A]" ref={ref}>
      <div className="max-w-[700px] mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-[11px] font-semibold text-[#6161FF] uppercase tracking-[0.2em] mb-4">
            FAQ
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-[-0.02em] leading-[1.1]">
            Questions?
            <br />
            <span className="text-slate-400 dark:text-white/40">We have answers.</span>
          </h2>
        </motion.div>

        {/* Items */}
        <div className="space-y-2">
          {faqItems.map((item, i) => {
            const isOpen = openIndex === i
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.04, duration: 0.3 }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className={`w-full flex items-center justify-between p-5 rounded-2xl text-left transition-all duration-200 ${
                    isOpen
                      ? "bg-gradient-to-r from-indigo-100/60 to-blue-50/50 dark:bg-white/[0.06] shadow-sm border border-indigo-200/50 dark:border-white/10"
                      : "bg-transparent hover:bg-indigo-50/40 dark:hover:bg-white/[0.03] border border-transparent"
                  }`}
                >
                  <span className={`text-[15px] font-semibold pr-4 ${isOpen ? "text-[#6161FF]" : "text-slate-800 dark:text-white"}`}>
                    {item.q}
                  </span>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                    isOpen ? "bg-[#6161FF] text-white" : "bg-indigo-100/60 dark:bg-white/10 text-slate-400"
                  }`}>
                    {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-[14px] text-slate-500 dark:text-white/40 leading-relaxed">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
