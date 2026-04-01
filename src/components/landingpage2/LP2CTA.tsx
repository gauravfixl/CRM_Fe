"use client"
import Link from "next/link"
import { motion } from "framer-motion"

export default function LP2CTA() {
  return (
    <section className="relative bg-gradient-to-b from-white to-[#EBF3FB] py-16 sm:py-20">
      <div className="max-w-[1280px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-2xl bg-gradient-to-r from-[#0067B8] to-[#0078D4] p-8 sm:p-12 text-center overflow-hidden"
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>
          <div className="relative z-10">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Ready to transform your business?
            </h3>
            <p className="text-white/80 text-[15px] max-w-xl mx-auto mb-6">
              Join thousands of businesses using CubicleERP to streamline
              operations and boost productivity.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 bg-white text-[#0067B8] font-semibold text-[14px] px-6 py-2.5 rounded-lg hover:bg-white/90 transition-colors shadow-lg shadow-black/10"
              >
                Start Free Trial
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
              <Link
                href="#"
                className="inline-flex items-center gap-2 text-white/90 font-medium text-[14px] px-6 py-2.5 rounded-lg border border-white/30 hover:bg-white/10 transition-colors"
              >
                Schedule a Demo
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
