"use client"
import Link from "next/link"
import { motion } from "framer-motion"

const footerColumns = [
  {
    title: "Product",
    links: [
      { label: "CRM", href: "/explore/crm" },
      { label: "HRM", href: "/explore/hrm" },
      { label: "Lead Management", href: "/explore/lead-management" },
      { label: "Client Management", href: "/explore/client-management" },
      { label: "Invoices & Tax", href: "/explore/finance" },
      { label: "Marketing & Campaigns", href: "/explore/email-marketing" },
      { label: "Project Management", href: "/explore/project-management" },
    ],
  },
  {
    title: "Platform",
    links: [
      { label: "Sign In", href: "/auth/signin" },
      { label: "Sign Up", href: "/auth/signup" },
      { label: "Integrations", href: "/integrations" },
      { label: "API Documentation", href: "/api-docs" },
      { label: "System Status", href: "/system-status" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Enterprise", href: "/products/enterprise" },
      { label: "Startups", href: "/products/startups" },
      { label: "Agencies", href: "/products/agencies" },
      { label: "Healthcare", href: "/products/healthcare" },
      { label: "Consulting Firms", href: "/products/consulting-firms" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Customer Stories", href: "/customer-stories" },
      { label: "Help Center", href: "/help-center" },
      { label: "Webinars", href: "/webinars" },
      { label: "Community", href: "/community" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms-of-service" },
    ],
  },
]

const socialIcons = [
  {
    label: "X",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
]

const bottomLinks = [
  { label: "Sitemap", href: "#" },
  { label: "Privacy", href: "#" },
  { label: "Terms of use", href: "#" },
  { label: "Contact us", href: "#" },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function LP2Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-[#1A1D29] via-[#1F2332] to-[#252938] overflow-hidden">
      {/* Subtle decorative background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#0067B8]/[0.15] to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Main Footer Content */}
      <div className="relative max-w-[1280px] mx-auto px-6 py-14">
        {/* Brand + Social Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-10 border-b border-white/10">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/images/cubicleweb.png"
              alt="CubicleERP"
              className="h-8 w-auto object-contain brightness-0 invert"
            />
            <span className="text-[17px] font-bold text-white tracking-tight">
              CubicleERP
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-gray-400 mr-2">Follow us</span>
            {socialIcons.map((icon) => (
              <motion.a
                key={icon.label}
                href={icon.href}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:bg-[#0067B8] hover:text-white transition-all duration-200 shadow-sm border border-white/10"
                aria-label={icon.label}
              >
                {icon.icon}
              </motion.a>
            ))}
          </div>
        </div>

        {/* Link Columns */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-8 gap-y-10"
        >
          {footerColumns.map((column) => (
            <motion.div key={column.title} variants={itemVariants}>
              <h4 className="text-[13px] font-semibold text-white uppercase tracking-wider mb-4">
                {column.title}
              </h4>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group flex items-center text-[13.5px] text-gray-400 hover:text-[#0067B8] transition-colors duration-200"
                    >
                      <span className="w-0 group-hover:w-2 h-px bg-[#0067B8] mr-0 group-hover:mr-2 transition-all duration-200" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[11px] text-emerald-400 font-medium">All systems operational</span>
              </div>
              <span className="text-gray-600">|</span>
              <p className="text-[12px] text-gray-500">
                &copy; {new Date().getFullYear()} CubicleERP by Fixl Solutions. All rights reserved.
              </p>
            </div>
            <div className="flex items-center gap-5">
              {bottomLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-[12px] text-gray-500 hover:text-gray-300 transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
