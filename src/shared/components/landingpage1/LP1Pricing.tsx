"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, ArrowRight, Zap, Star, Building2 } from "lucide-react"
import Link from "next/link"
import { useIntersection } from "./hooks/useIntersection"

const plans = [
  {
    name: "Starter", icon: Zap, desc: "For small teams getting started", price: 0, color: "#6366F1",
    features: ["Up to 5 members", "1 Organization", "Basic CRM", "Standard support", "2GB storage"],
    cta: "Start Free", highlighted: false,
  },
  {
    name: "Business", icon: Star, desc: "For growing teams that need more", price: 29, color: "#6366F1",
    features: ["Up to 25 members", "5 Organizations", "Full CRM + HRM + PM", "Workflow automation", "Priority support", "25GB storage", "Advanced analytics"],
    cta: "Start 14-Day Trial", highlighted: true,
  },
  {
    name: "Enterprise", icon: Building2, desc: "For organizations at scale", price: -1, color: "#6366F1",
    features: ["Unlimited members", "Unlimited orgs", "Full platform + AI", "24/7 dedicated support", "Unlimited storage", "API & webhooks", "White-label", "Custom integrations"],
    cta: "Contact Sales", highlighted: false,
  },
]

export default function LP1Pricing() {
  const [yearly, setYearly] = useState(false)
  const [ref, inView] = useIntersection("-60px")

  return (
    <section id="pricing" className="py-28 bg-gradient-to-b from-purple-50/20 to-white dark:from-[#0A0A2E] dark:to-[#080824] relative" ref={ref}>
      <div className="max-w-[1100px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-[11px] font-semibold text-[#6366F1] dark:text-[#818CF8] uppercase tracking-[0.2em] mb-4">
            Pricing
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-[-0.02em] leading-[1.1] mb-6">
            Simple, transparent
            <span className="text-slate-300 dark:text-white/25"> pricing</span>
          </h2>

          {/* Toggle */}
          <div className="inline-flex items-center bg-indigo-50/50 dark:bg-white/[0.05] rounded-full p-1 border border-indigo-100/50 dark:border-white/[0.06]">
            <button
              onClick={() => setYearly(false)}
              className={`px-6 py-2 rounded-full text-[13px] font-semibold transition-all duration-300 ${
                !yearly ? "bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-6 py-2 rounded-full text-[13px] font-semibold transition-all duration-300 ${
                yearly ? "bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Yearly <span className="text-[#6366F1] text-[11px] ml-1 font-bold">-20%</span>
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((plan, i) => {
            const isCustom = plan.price === -1
            const price = isCustom ? "Custom" : yearly ? Math.floor(plan.price * 0.8) : plan.price

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -5, transition: { duration: 0.25 } }}
                className={`relative rounded-2xl p-7 flex flex-col transition-all duration-300 overflow-hidden ${
                  plan.highlighted
                    ? "bg-gradient-to-b from-[#6366F1] to-[#4F46E5] text-white shadow-xl shadow-[#6366F1]/20 ring-1 ring-[#6366F1]/50 scale-[1.02]"
                    : "bg-gradient-to-br from-indigo-100/50 via-blue-50/40 to-purple-50/30 dark:from-white/[0.05] dark:to-white/[0.02] border border-indigo-200/40 dark:border-white/[0.08] hover:shadow-lg hover:shadow-indigo-200/20"
                }`}
              >
                {/* Highlighted shimmer */}
                {plan.highlighted && (
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.1),transparent_60%)]" />
                )}

                {plan.highlighted && (
                  <div className="absolute -top-px left-1/2 -translate-x-1/2 bg-white text-[#6366F1] text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-b-lg shadow-md">
                    Most Popular
                  </div>
                )}

                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${
                    plan.highlighted ? "bg-white/15" : "bg-[#6366F1]/10 dark:bg-[#6366F1]/15"
                  }`}>
                    <plan.icon className={`w-5 h-5 ${plan.highlighted ? "text-white" : "text-[#6366F1]"}`} />
                  </div>

                  <h3 className={`text-xl font-bold mb-1 ${plan.highlighted ? "text-white" : "text-slate-900 dark:text-white"}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-[13px] mb-6 ${plan.highlighted ? "text-white/60" : "text-slate-400"}`}>
                    {plan.desc}
                  </p>

                  {/* Price */}
                  <div className="mb-6">
                    <span className={`text-4xl font-black ${plan.highlighted ? "text-white" : "text-slate-900 dark:text-white"}`}>
                      {!isCustom && "$"}{price}
                    </span>
                    {!isCustom && <span className={`text-sm ml-1 ${plan.highlighted ? "text-white/50" : "text-slate-400"}`}>/mo</span>}
                    {yearly && !isCustom && (
                      <p className="text-[10px] font-bold mt-1 text-[#6366F1]">Billed annually</p>
                    )}
                  </div>

                  {/* Features */}
                  <div className="flex-1 space-y-3.5 mb-8">
                    {plan.features.map((f) => (
                      <div key={f} className="flex items-center gap-2.5">
                        <div className={`w-4.5 h-4.5 rounded-full flex items-center justify-center flex-shrink-0 ${
                          plan.highlighted ? "bg-white/20" : "bg-[#6366F1]/10"
                        }`}>
                          <Check className={`w-2.5 h-2.5 ${plan.highlighted ? "text-white" : "text-[#6366F1]"}`} />
                        </div>
                        <span className={`text-[13px] ${plan.highlighted ? "text-white/75" : "text-slate-600 dark:text-white/45"}`}>{f}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <Link
                    href={isCustom ? "mailto:sales@cubicle.app" : "/auth/signup"}
                    className={`w-full py-3.5 rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
                      plan.highlighted
                        ? "bg-white text-[#6366F1] hover:bg-white/90 shadow-lg"
                        : "bg-slate-900 dark:bg-white/10 text-white hover:bg-slate-800 dark:hover:bg-white/15"
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="w-3.5 h-3.5" />
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
