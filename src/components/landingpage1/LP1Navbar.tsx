"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ChevronDown, Users, UserCheck, Briefcase, DollarSign, Globe, HeadphonesIcon, Building2, Target, BarChart3, Shield } from "lucide-react"
import { ThemeToggle } from "@/components/landing/ThemeToggle"

const platformItems = [
  { icon: Users, title: "CRM", desc: "Leads, deals & pipeline", href: "#modules" },
  { icon: UserCheck, title: "HRM", desc: "People, payroll & attendance", href: "#modules" },
  { icon: Briefcase, title: "Project Management", desc: "Boards, sprints & tasks", href: "#modules" },
  { icon: DollarSign, title: "Finance", desc: "Invoicing & expenses", href: "#modules" },
  { icon: Globe, title: "Client Portal", desc: "Branded customer access", href: "#modules" },
  { icon: HeadphonesIcon, title: "Helpdesk", desc: "Tickets & SLA tracking", href: "#modules" },
]

const solutionItems = [
  { icon: Building2, title: "Enterprise", desc: "Custom solutions at scale", href: "#pricing" },
  { icon: Target, title: "Startups", desc: "Grow fast with free tools", href: "#pricing" },
  { icon: BarChart3, title: "Agencies", desc: "Manage clients & projects", href: "#modules" },
  { icon: Shield, title: "Healthcare", desc: "HIPAA-ready compliance", href: "#features" },
]

export default function LP1Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const openMenu = (id: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setActiveMenu(id)
  }
  const closeMenu = () => {
    closeTimer.current = setTimeout(() => setActiveMenu(null), 120)
  }

  const navTextColor = scrolled
    ? "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
    : "text-white/70 hover:text-white"

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/80 dark:bg-[#060622]/80 backdrop-blur-2xl border-b border-slate-200/50 dark:border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-[64px]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6161FF] to-[#4A7AFF] flex items-center justify-center shadow-sm">
            <span className="text-white font-black text-xs">C</span>
          </div>
          <span className={`text-lg font-extrabold tracking-tight ${scrolled ? "text-slate-900 dark:text-white" : "text-white"}`}>
            cubicle
          </span>
        </Link>

        {/* Center nav */}
        <div className="hidden lg:flex items-center gap-0.5">
          {/* Platform dropdown */}
          <div onMouseEnter={() => openMenu("platform")} onMouseLeave={closeMenu} className="relative">
            <button className={`flex items-center gap-1 px-3.5 py-2 rounded-lg text-[13px] font-medium transition-colors ${navTextColor}`}>
              Platform
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeMenu === "platform" ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {activeMenu === "platform" && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[440px] bg-white dark:bg-[#12123A] rounded-2xl shadow-xl dark:shadow-black/40 border border-slate-200/80 dark:border-white/10 p-3"
                >
                  <div className="grid grid-cols-2 gap-0.5">
                    {platformItems.map((item) => (
                      <Link
                        key={item.title}
                        href={item.href}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group"
                      >
                        <div className="w-9 h-9 rounded-lg bg-[#6161FF]/8 dark:bg-[#6161FF]/15 flex items-center justify-center flex-shrink-0">
                          <item.icon className="w-4.5 h-4.5 text-[#6161FF]" />
                        </div>
                        <div>
                          <div className="text-[13px] font-semibold text-slate-800 dark:text-white">{item.title}</div>
                          <div className="text-[11px] text-slate-400 dark:text-white/40">{item.desc}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Solutions dropdown */}
          <div onMouseEnter={() => openMenu("solutions")} onMouseLeave={closeMenu} className="relative">
            <button className={`flex items-center gap-1 px-3.5 py-2 rounded-lg text-[13px] font-medium transition-colors ${navTextColor}`}>
              Solutions
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeMenu === "solutions" ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {activeMenu === "solutions" && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[380px] bg-white dark:bg-[#12123A] rounded-2xl shadow-xl dark:shadow-black/40 border border-slate-200/80 dark:border-white/10 p-3"
                >
                  <div className="grid grid-cols-2 gap-0.5">
                    {solutionItems.map((item) => (
                      <Link
                        key={item.title}
                        href={item.href}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                      >
                        <div className="w-9 h-9 rounded-lg bg-[#6161FF]/8 dark:bg-[#6161FF]/15 flex items-center justify-center flex-shrink-0">
                          <item.icon className="w-4.5 h-4.5 text-[#6161FF]" />
                        </div>
                        <div>
                          <div className="text-[13px] font-semibold text-slate-800 dark:text-white">{item.title}</div>
                          <div className="text-[11px] text-slate-400 dark:text-white/40">{item.desc}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link href="#pricing" className={`px-3.5 py-2 rounded-lg text-[13px] font-medium transition-colors ${navTextColor}`}>
            Pricing
          </Link>
          <Link href="#faq" className={`px-3.5 py-2 rounded-lg text-[13px] font-medium transition-colors ${navTextColor}`}>
            Resources
          </Link>
        </div>

        {/* Right */}
        <div className="hidden lg:flex items-center gap-2.5">
          <ThemeToggle />
          <Link
            href="/auth/signin"
            className={`px-4 py-[7px] rounded-lg text-[13px] font-semibold transition-colors ${navTextColor}`}
          >
            Log in
          </Link>
          <Link
            href="/auth/signup"
            className="px-5 py-[7px] rounded-lg text-[13px] font-bold text-white bg-[#6161FF] hover:bg-[#5034FF] transition-colors shadow-sm"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile */}
        <div className="flex lg:hidden items-center gap-2">
          <ThemeToggle />
          <button onClick={() => setMobileOpen(!mobileOpen)} className={scrolled ? "text-slate-700 dark:text-white" : "text-white"}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white dark:bg-[#060622] border-t border-slate-200/50 dark:border-white/5 overflow-hidden"
          >
            <div className="px-6 py-5 space-y-3">
              <Link href="#modules" onClick={() => setMobileOpen(false)} className="block py-2.5 text-[15px] font-semibold text-slate-700 dark:text-white">Platform</Link>
              <Link href="#pricing" onClick={() => setMobileOpen(false)} className="block py-2.5 text-[15px] font-semibold text-slate-700 dark:text-white">Pricing</Link>
              <Link href="#features" onClick={() => setMobileOpen(false)} className="block py-2.5 text-[15px] font-semibold text-slate-700 dark:text-white">Features</Link>
              <Link href="#faq" onClick={() => setMobileOpen(false)} className="block py-2.5 text-[15px] font-semibold text-slate-700 dark:text-white">Resources</Link>
              <div className="pt-3 flex flex-col gap-2.5">
                <Link href="/auth/signin" className="w-full text-center py-2.5 rounded-lg border border-slate-200 dark:border-white/10 text-[13px] font-semibold text-slate-700 dark:text-white">Log in</Link>
                <Link href="/auth/signup" className="w-full text-center py-2.5 rounded-lg text-[13px] font-bold text-white bg-[#6161FF]">Get Started</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
