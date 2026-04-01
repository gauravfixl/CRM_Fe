"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Menu,
  X,
  ChevronDown,
  Users,
  UserCheck,
  Briefcase,
  DollarSign,
  Globe,
  HeadphonesIcon,
  Building2,
  Target,
  BarChart3,
  Shield,
  Package,
  FileText,
  Mail,
  PieChart,
  Workflow,
  Clock,
  GraduationCap,
  Home,
  ShoppingCart,
  Factory,
  Scale,
  Landmark,
  Truck,
  Laptop,
} from "lucide-react"

const exploreItems = [
  {
    icon: Users,
    title: "CRM",
    description: "Customer relationships & sales",
    href: "/explore/crm",
  },
  {
    icon: UserCheck,
    title: "HRM",
    description: "HR operations & employee mgmt",
    href: "/explore/hrm",
  },
  {
    icon: Briefcase,
    title: "Projects",
    description: "Plan, track & deliver on time",
    href: "/explore/project-management",
  },
  {
    icon: DollarSign,
    title: "Finance",
    description: "Accounting, invoicing & reports",
    href: "/explore/finance",
  },
  {
    icon: Globe,
    title: "Client Portal",
    description: "Self-service for clients",
    href: "/explore/client-portal",
  },
  {
    icon: HeadphonesIcon,
    title: "Helpdesk",
    description: "Fast, reliable support",
    href: "/explore/helpdesk",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "Insights & business intelligence",
    href: "/explore/analytics",
  },
  {
    icon: Package,
    title: "Inventory",
    description: "Stock & warehouse management",
    href: "/explore/inventory",
  },
  {
    icon: FileText,
    title: "Documents",
    description: "Centralized document management",
    href: "/explore/documents",
  },
  {
    icon: Mail,
    title: "Email Marketing",
    description: "Campaigns & email automation",
    href: "/explore/email-marketing",
  },
  {
    icon: Workflow,
    title: "Automation",
    description: "Workflows & process automation",
    href: "/explore/automation",
  },
  {
    icon: Clock,
    title: "Time Tracking",
    description: "Track hours & productivity",
    href: "/explore/time-tracking",
  },
]

const productItems = [
  {
    icon: Building2,
    title: "Enterprise",
    description: "For large organizations",
    href: "/products/enterprise",
  },
  {
    icon: Target,
    title: "Startups",
    description: "Grow fast & stay agile",
    href: "/products/startups",
  },
  {
    icon: BarChart3,
    title: "Agencies",
    description: "Clients, projects & billing",
    href: "/products/agencies",
  },
  {
    icon: Shield,
    title: "Healthcare",
    description: "HIPAA-ready platform",
    href: "/products/healthcare",
  },
  {
    icon: GraduationCap,
    title: "Education",
    description: "Schools & institutions",
    href: "/products/education",
  },
  {
    icon: Home,
    title: "Real Estate",
    description: "Property & deals management",
    href: "/products/real-estate",
  },
  {
    icon: ShoppingCart,
    title: "Retail",
    description: "Inventory & sales tracking",
    href: "/products/retail",
  },
  {
    icon: Factory,
    title: "Manufacturing",
    description: "Production & supply chain",
    href: "/products/manufacturing",
  },
  {
    icon: Scale,
    title: "Legal",
    description: "Case & client management",
    href: "/products/legal",
  },
  {
    icon: Landmark,
    title: "Non-Profit",
    description: "Donors & fundraising",
    href: "/products/non-profit",
  },
  {
    icon: Truck,
    title: "Logistics",
    description: "Fleet & delivery tracking",
    href: "/products/logistics",
  },
  {
    icon: Laptop,
    title: "IT & SaaS",
    description: "Tech operations & support",
    href: "/products/it-saas",
  },
]

export default function LP2Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null)
  const navRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Close mobile menu on resize
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false)
    }
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  const handleDropdownEnter = (name: string) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current)
    setActiveDropdown(name)
  }

  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => {
      setActiveDropdown(null)
    }, 150)
  }

  const toggleMobileSection = (name: string) => {
    setMobileExpanded((prev) => (prev === name ? null : name))
  }

  return (
    <nav
      ref={navRef}
      className="absolute top-0 left-0 right-0 z-50 bg-white border-b border-[#E5E5E5]"
    >
      <div className="mx-auto px-4 lg:px-8 h-14 flex items-center justify-between relative">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 ml-6">
          <img
            src="/images/cubicleweb.png"
            alt="CubicleERP"
            className="h-8 w-auto object-contain"
          />
          <span className="text-[#1A1A1A] text-[17px] font-semibold" style={{ fontFamily: "'Segoe UI', 'Inter', sans-serif" }}>
            CubicleERP
          </span>
        </Link>

        {/* Center nav links - desktop */}
        <div className="hidden lg:flex items-center gap-1 absolute left-[42%] -translate-x-1/2">
          {/* Products dropdown */}
          <div
            className="relative"
            onMouseEnter={() => handleDropdownEnter("explore")}
            onMouseLeave={handleDropdownLeave}
          >
            <button className="flex items-center gap-1 px-3 py-2 text-sm text-[#1A1A1A] hover:text-[#0067B8] transition-colors duration-300 rounded-sm">
              Products
              <ChevronDown
                size={14}
                className={`transition-transform duration-300 ${activeDropdown === "explore" ? "rotate-180" : ""
                  }`}
              />
            </button>

            <AnimatePresence>
              {activeDropdown === "explore" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[620px] bg-white rounded-lg shadow-xl border border-[#E5E5E5] p-3"
                >
                  <div className="grid grid-cols-3 gap-1">
                    {exploreItems.map((item) => (
                      <Link
                        key={item.title}
                        href={item.href}
                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-md hover:bg-[#F5F5F5] transition-colors duration-200 group"
                      >
                        <div className="w-7 h-7 rounded-md bg-[#EBF3FB] flex items-center justify-center shrink-0 group-hover:bg-[#D6E8F7] transition-colors duration-200">
                          <item.icon size={14} className="text-[#0067B8]" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold text-[#1A1A1A] group-hover:text-[#0067B8] transition-colors duration-200 leading-tight">
                            {item.title}
                          </p>
                          <p className="text-[10.5px] text-[#6B6B6B] leading-tight truncate">
                            {item.description}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Solutions dropdown */}
          <div
            className="relative"
            onMouseEnter={() => handleDropdownEnter("products")}
            onMouseLeave={handleDropdownLeave}
          >
            <button className="flex items-center gap-1 px-3 py-2 text-sm text-[#1A1A1A] hover:text-[#0067B8] transition-colors duration-300 rounded-sm">
              Solutions
              <ChevronDown
                size={14}
                className={`transition-transform duration-300 ${activeDropdown === "products" ? "rotate-180" : ""
                  }`}
              />
            </button>

            <AnimatePresence>
              {activeDropdown === "products" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[620px] bg-white rounded-lg shadow-xl border border-[#E5E5E5] p-3"
                >
                  <div className="grid grid-cols-3 gap-1">
                    {productItems.map((item) => (
                      <Link
                        key={item.title}
                        href={item.href}
                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-md hover:bg-[#F5F5F5] transition-colors duration-200 group"
                      >
                        <div className="w-7 h-7 rounded-md bg-[#EBF3FB] flex items-center justify-center shrink-0 group-hover:bg-[#D6E8F7] transition-colors duration-200">
                          <item.icon size={14} className="text-[#0067B8]" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold text-[#1A1A1A] group-hover:text-[#0067B8] transition-colors duration-200 leading-tight">
                            {item.title}
                          </p>
                          <p className="text-[10.5px] text-[#6B6B6B] leading-tight truncate">
                            {item.description}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            href="/landingpage2/pricing"
            className="px-3 py-2 text-sm text-[#1A1A1A] hover:text-[#0067B8] transition-colors duration-300"
          >
            Pricing
          </Link>
          <Link
            href="/resources"
            className="px-3 py-2 text-sm text-[#1A1A1A] hover:text-[#0067B8] transition-colors duration-300"
          >
            Resources
          </Link>
          <Link
            href="/support"
            className="px-3 py-2 text-sm text-[#1A1A1A] hover:text-[#0067B8] transition-colors duration-300"
          >
            Support
          </Link>
        </div>

        {/* Right actions - desktop */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/contact"
            className="text-sm text-[#1A1A1A] hover:text-[#0067B8] transition-colors duration-300 px-3 py-2"
          >
            Contact us
          </Link>
          <Link
            href="/auth/signup"
            className="bg-[#0067B8] text-white px-5 py-2 rounded-sm font-semibold text-sm hover:bg-[#005DA6] transition-colors duration-300"
          >
            Try for free
          </Link>
          <Link
            href="/auth/signin"
            className="border border-[#0067B8] text-[#0067B8] px-5 py-2 rounded-sm font-semibold text-sm hover:bg-[#0067B8] hover:text-white transition-colors duration-300"
          >
            Sign in
          </Link>
        </div>

        {/* Hamburger - mobile */}
        <button
          className="lg:hidden p-2 text-[#1A1A1A] hover:text-[#0067B8] transition-colors duration-300"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden overflow-hidden bg-white border-t border-[#E5E5E5]"
          >
            <div className="max-w-[1280px] mx-auto px-6 py-4 flex flex-col gap-1">
              {/* Products accordion */}
              <div>
                <button
                  onClick={() => toggleMobileSection("explore")}
                  className="w-full flex items-center justify-between py-3 text-sm font-medium text-[#1A1A1A]"
                >
                  Products
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${mobileExpanded === "explore" ? "rotate-180" : ""
                      }`}
                  />
                </button>
                <AnimatePresence>
                  {mobileExpanded === "explore" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-2 pb-2 flex flex-col gap-1">
                        {exploreItems.map((item) => (
                          <Link
                            key={item.title}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-3 p-2.5 rounded-md hover:bg-[#F5F5F5] transition-colors duration-200"
                          >
                            <div className="w-8 h-8 rounded-md bg-[#EBF3FB] flex items-center justify-center shrink-0">
                              <item.icon size={16} className="text-[#0067B8]" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-[#1A1A1A]">
                                {item.title}
                              </p>
                              <p className="text-xs text-[#6B6B6B]">
                                {item.description}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Solutions accordion */}
              <div>
                <button
                  onClick={() => toggleMobileSection("products")}
                  className="w-full flex items-center justify-between py-3 text-sm font-medium text-[#1A1A1A]"
                >
                  Solutions
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${mobileExpanded === "products" ? "rotate-180" : ""
                      }`}
                  />
                </button>
                <AnimatePresence>
                  {mobileExpanded === "products" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-2 pb-2 flex flex-col gap-1">
                        {productItems.map((item) => (
                          <Link
                            key={item.title}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-3 p-2.5 rounded-md hover:bg-[#F5F5F5] transition-colors duration-200"
                          >
                            <div className="w-8 h-8 rounded-md bg-[#EBF3FB] flex items-center justify-center shrink-0">
                              <item.icon size={16} className="text-[#0067B8]" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-[#1A1A1A]">
                                {item.title}
                              </p>
                              <p className="text-xs text-[#6B6B6B]">
                                {item.description}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                href="/landingpage2/pricing"
                onClick={() => setMobileOpen(false)}
                className="py-3 text-sm font-medium text-[#1A1A1A] hover:text-[#0067B8] transition-colors duration-300"
              >
                Pricing
              </Link>
              <Link
                href="/resources"
                onClick={() => setMobileOpen(false)}
                className="py-3 text-sm font-medium text-[#1A1A1A] hover:text-[#0067B8] transition-colors duration-300"
              >
                Resources
              </Link>
              <Link
                href="/support"
                onClick={() => setMobileOpen(false)}
                className="py-3 text-sm font-medium text-[#1A1A1A] hover:text-[#0067B8] transition-colors duration-300"
              >
                Support
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="py-3 text-sm font-medium text-[#1A1A1A] hover:text-[#0067B8] transition-colors duration-300"
              >
                Contact us
              </Link>

              {/* Mobile buttons */}
              <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-[#E5E5E5]">
                <Link
                  href="/auth/signup"
                  onClick={() => setMobileOpen(false)}
                  className="bg-[#0067B8] text-white px-5 py-2.5 rounded-sm font-semibold text-sm text-center hover:bg-[#005DA6] transition-colors duration-300"
                >
                  Try for free
                </Link>
                <Link
                  href="/auth/signin"
                  onClick={() => setMobileOpen(false)}
                  className="border border-[#0067B8] text-[#0067B8] px-5 py-2.5 rounded-sm font-semibold text-sm text-center hover:bg-[#0067B8] hover:text-white transition-colors duration-300"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
