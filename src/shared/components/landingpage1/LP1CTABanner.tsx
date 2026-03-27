"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Zap, CheckCircle } from "lucide-react"
import { useIntersection } from "./hooks/useIntersection"

export default function LP1CTABanner() {
  const [ref, inView] = useIntersection("-60px")

  return (
    <section className="py-20 bg-slate-50 dark:bg-[#060620]" ref={ref}>
      <div className="max-w-[1100px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative rounded-[28px] overflow-hidden"
        >
          {/* Dark BG with effects */}
          <div className="absolute inset-0 bg-[#030014]">
            {/* Gradient orbs */}
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-[#6366F1]/20 rounded-full blur-[80px]"
            />
            <motion.div
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.25, 0.1] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 3 }}
              className="absolute -bottom-20 -right-20 w-[400px] h-[400px] bg-[#3B82F6]/15 rounded-full blur-[80px]"
            />
            {/* Grid */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            {/* Top glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(99,102,241,0.12),transparent_60%)]" />
          </div>

          {/* Content */}
          <div className="relative z-10 text-center py-20 px-8 sm:px-16">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] mb-8"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[12px] font-semibold text-white/50">Start For Free Today</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-[-0.02em] leading-[1.1] mb-5"
            >
              Ready to unify
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#818CF8] via-[#A78BFA] to-[#60A5FA]">
                your business?
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="text-base sm:text-lg text-white/40 max-w-md mx-auto mb-8 font-light"
            >
              Full access to every module for 14 days. No credit card. No setup fees.
            </motion.p>

            {/* Trust pills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-4 mb-10"
            >
              {["No credit card", "14-day trial", "Full access", "Cancel anytime"].map((t) => (
                <div key={t} className="flex items-center gap-1.5 text-[12px] text-white/30 font-medium">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500/50" />
                  {t}
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <Link
                href="/auth/signup"
                className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 text-[15px] font-bold text-[#030014] bg-white rounded-xl hover:bg-white/90 transition-all shadow-lg shadow-white/10"
              >
                <Zap className="w-4 h-4" />
                Get Started Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="mailto:sales@cubicle.app"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-[15px] font-semibold text-white/60 border border-white/10 rounded-xl hover:bg-white/[0.04] hover:border-white/20 transition-all"
              >
                Talk to Sales
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8 }}
              className="mt-8 text-[12px] text-white/20"
            >
              Already have an account?{" "}
              <Link href="/auth/signin" className="text-white/40 hover:text-white/70 underline-offset-2 hover:underline transition-colors">
                Sign in
              </Link>
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
