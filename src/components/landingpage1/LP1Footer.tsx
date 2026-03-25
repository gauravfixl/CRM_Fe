"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Heart } from "lucide-react"
import { useIntersection } from "./hooks/useIntersection"

const links = {
  Product: [
    { label: "CRM", href: "#modules" },
    { label: "HRM", href: "#modules" },
    { label: "Projects", href: "#modules" },
    { label: "Finance", href: "#modules" },
    { label: "Helpdesk", href: "#modules" },
    { label: "Pricing", href: "#pricing" },
  ],
  Platform: [
    { label: "Sign In", href: "/auth/signin" },
    { label: "Sign Up", href: "/auth/signup" },
    { label: "API Docs", href: "#" },
    { label: "Status", href: "#" },
    { label: "Integrations", href: "#integrations" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
    { label: "Partners", href: "#" },
  ],
  Legal: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Cookies", href: "#" },
    { label: "GDPR", href: "#" },
    { label: "Security", href: "#" },
  ],
}

const socials = [
  { label: "X", href: "#" },
  { label: "Li", href: "#" },
  { label: "YT", href: "#" },
  { label: "GH", href: "#" },
]

export default function LP1Footer() {
  const [ref, inView] = useIntersection("-40px")

  return (
    <footer className="bg-[#030014] relative overflow-hidden" ref={ref}>
      {/* Top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[50%] h-px bg-gradient-to-r from-transparent via-[#6366F1]/30 to-transparent" />

      {/* Newsletter */}
      <div className="border-b border-white/[0.05]">
        <div className="max-w-[1200px] mx-auto px-6 py-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-6"
          >
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Stay in the loop</h3>
              <p className="text-[13px] text-white/30">Product updates, tips, and best practices.</p>
            </div>
            <div className="flex w-full sm:w-auto gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 sm:w-64 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-white/20 text-[13px] focus:outline-none focus:border-[#6366F1]/40 transition-colors"
              />
              <button className="px-5 py-2.5 rounded-xl bg-[#6366F1] text-white text-[13px] font-bold hover:bg-[#5034FF] transition-colors flex items-center gap-1.5 flex-shrink-0 shadow-md shadow-[#6366F1]/20">
                Subscribe <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Links grid */}
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6366F1] to-[#4F46E5] flex items-center justify-center shadow-md shadow-[#6366F1]/20">
                <span className="text-white font-black text-xs">C</span>
              </div>
              <span className="text-lg font-extrabold text-white tracking-tight">cubicle</span>
            </Link>
            <p className="text-[13px] text-white/25 leading-relaxed mb-6 max-w-[200px]">
              The all-in-one ERP platform for modern businesses.
            </p>
            <div className="flex gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-[10px] font-bold text-white/25 hover:bg-[#6366F1] hover:border-[#6366F1] hover:text-white transition-all duration-300"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="text-[11px] font-bold text-white/40 uppercase tracking-[0.15em] mb-5">{title}</h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-[13px] text-white/25 hover:text-white/70 transition-colors duration-200">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.04]">
        <div className="max-w-[1200px] mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative rounded-full h-1.5 w-1.5 bg-emerald-400" />
            </span>
            <span className="text-[11px] text-emerald-400/60 font-medium">All systems operational</span>
          </div>
          <p className="text-[11px] text-white/15 flex items-center gap-1">
            &copy; {new Date().getFullYear()} Cubicle. Built with
            <Heart className="w-2.5 h-2.5 text-rose-500/60 fill-rose-500/60" />
            in India
          </p>
        </div>
      </div>
    </footer>
  )
}
