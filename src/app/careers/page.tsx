"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import LP2Navbar from "@/components/landingpage2/LP2Navbar"
import LP2CTA from "@/components/landingpage2/LP2CTA"
import LP2Footer from "@/components/landingpage2/LP2Footer"
import {
  Lightbulb,
  TrendingUp,
  Globe,
  Heart,
  Briefcase,
  MapPin,
  Clock,
  ArrowRight,
  Stethoscope,
  Home,
  BookOpen,
  DollarSign,
  Coffee,
  Dumbbell,
  Baby,
  Plane,
  Code,
  Palette,
  Megaphone,
  Users,
  HeadphonesIcon,
  Package,
} from "lucide-react"

const fontFamily = "'Segoe UI', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif"

const values = [
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "We encourage bold ideas and creative problem-solving. Every team member has the freedom to experiment, prototype, and push the boundaries of what enterprise software can do.",
    color: "#F59E0B",
    bg: "#FFFBEB",
  },
  {
    icon: TrendingUp,
    title: "Growth",
    description:
      "Your career trajectory matters to us. We invest in mentorship programs, learning budgets, and clear promotion paths so you can continuously level up your skills.",
    color: "#10B981",
    bg: "#ECFDF5",
  },
  {
    icon: Globe,
    title: "Impact",
    description:
      "Our platform powers thousands of businesses worldwide. The code you write, the designs you create, and the strategies you develop have real, measurable impact on global commerce.",
    color: "#0067B8",
    bg: "#EBF3FB",
  },
  {
    icon: Heart,
    title: "Culture",
    description:
      "We foster a diverse, inclusive environment where every voice is heard. Collaboration over competition, transparency over politics, and empathy over hierarchy.",
    color: "#EF4444",
    bg: "#FEF2F2",
  },
]

const positions = [
  {
    title: "Senior Full-Stack Engineer",
    department: "Engineering",
    location: "San Francisco, CA / Remote",
    type: "Full-time",
    icon: Code,
  },
  {
    title: "Product Designer",
    department: "Design",
    location: "New York, NY / Remote",
    type: "Full-time",
    icon: Palette,
  },
  {
    title: "Product Manager",
    department: "Product",
    location: "San Francisco, CA",
    type: "Full-time",
    icon: Package,
  },
  {
    title: "Growth Marketing Manager",
    department: "Marketing",
    location: "Remote",
    type: "Full-time",
    icon: Megaphone,
  },
  {
    title: "Enterprise Account Executive",
    department: "Sales",
    location: "Chicago, IL / Remote",
    type: "Full-time",
    icon: Briefcase,
  },
  {
    title: "Customer Success Manager",
    department: "Customer Success",
    location: "Austin, TX / Remote",
    type: "Full-time",
    icon: HeadphonesIcon,
  },
  {
    title: "DevOps Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    icon: Code,
  },
  {
    title: "UX Researcher",
    department: "Design",
    location: "San Francisco, CA / Remote",
    type: "Contract",
    icon: Users,
  },
]

const perks = [
  { icon: Stethoscope, title: "Health & Dental", description: "Comprehensive medical, dental, and vision coverage for you and your family." },
  { icon: Home, title: "Remote Flexible", description: "Work from anywhere with flexible hours. We trust you to deliver great results." },
  { icon: BookOpen, title: "Learning Budget", description: "$2,500 annual learning stipend for courses, conferences, books, and certifications." },
  { icon: DollarSign, title: "Equity Package", description: "Meaningful stock options so you share in the success you help create." },
  { icon: Coffee, title: "Wellness Stipend", description: "$100/month for gym memberships, meditation apps, or any wellness activity." },
  { icon: Dumbbell, title: "Fitness Perks", description: "On-site gym at HQ locations and subsidized fitness memberships for remote employees." },
  { icon: Baby, title: "Parental Leave", description: "16 weeks fully paid parental leave for all new parents, birth or adoptive." },
  { icon: Plane, title: "Unlimited PTO", description: "Take the time you need. We encourage at least 4 weeks off per year to recharge." },
]

const departments = [
  { name: "Engineering", count: 12, icon: Code, color: "#0067B8" },
  { name: "Product", count: 4, icon: Package, color: "#5C2D91" },
  { name: "Design", count: 5, icon: Palette, color: "#D83B01" },
  { name: "Sales", count: 6, icon: Briefcase, color: "#008575" },
  { name: "Marketing", count: 3, icon: Megaphone, color: "#F59E0B" },
  { name: "Customer Success", count: 4, icon: HeadphonesIcon, color: "#EF4444" },
]

export default function CareersPage() {
  return (
    <div style={{ fontFamily }} className="bg-white min-h-screen">
      <LP2Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0067B8] via-[#0078D4] to-[#005A9E] pt-32 pb-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="max-w-[1280px] mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block bg-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
              We&apos;re Hiring
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Join Our Team
            </h1>
            <p className="text-white/85 text-lg sm:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
              Help us build the future of enterprise software. We&apos;re looking for passionate people who want to make a real difference in how businesses operate worldwide.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#positions"
                className="bg-white text-[#0067B8] font-semibold px-8 py-3.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                View Open Positions
              </a>
              <a
                href="#culture"
                className="border-2 border-white/40 text-white font-semibold px-8 py-3.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                Our Culture
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Work With Us */}
      <section className="py-20 bg-white">
        <div className="max-w-[1280px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] mb-4">
              Why Work With Us
            </h2>
            <p className="text-[#6B7280] text-lg max-w-2xl mx-auto">
              At CubicleERP, we believe that great products come from great teams. Here&apos;s what makes us different.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group p-6 rounded-xl border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300"
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: value.bg }}
                >
                  <value.icon className="w-6 h-6" style={{ color: value.color }} />
                </div>
                <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">{value.title}</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="py-16 bg-[#F9FAFB]">
        <div className="max-w-[1280px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] mb-4">
              Our Departments
            </h2>
            <p className="text-[#6B7280] text-lg max-w-2xl mx-auto">
              Explore opportunities across our growing organization.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {departments.map((dept, i) => (
              <motion.div
                key={dept.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-white rounded-xl p-5 text-center border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all cursor-pointer group"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `${dept.color}15` }}
                >
                  <dept.icon className="w-5 h-5" style={{ color: dept.color }} />
                </div>
                <h3 className="text-sm font-semibold text-[#1A1A1A] mb-1">{dept.name}</h3>
                <p className="text-xs text-[#6B7280]">{dept.count} open roles</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="positions" className="py-20 bg-white">
        <div className="max-w-[1280px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] mb-4">
              Open Positions
            </h2>
            <p className="text-[#6B7280] text-lg max-w-2xl mx-auto">
              Find the perfect role that matches your skills and ambitions. All positions come with competitive compensation and comprehensive benefits.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {positions.map((pos, i) => (
              <motion.div
                key={pos.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-[#0067B8]/30 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-[#EBF3FB] flex items-center justify-center">
                        <pos.icon className="w-5 h-5 text-[#0067B8]" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-[#1A1A1A] group-hover:text-[#0067B8] transition-colors">
                          {pos.title}
                        </h3>
                        <span className="text-xs font-medium text-[#0067B8] bg-[#EBF3FB] px-2 py-0.5 rounded-full">
                          {pos.department}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-[#6B7280]">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {pos.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {pos.type}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[#6B7280] group-hover:text-[#0067B8] group-hover:translate-x-1 transition-all mt-2" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Perks & Benefits */}
      <section className="py-20 bg-gradient-to-b from-[#F9FAFB] to-white">
        <div className="max-w-[1280px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] mb-4">
              Perks & Benefits
            </h2>
            <p className="text-[#6B7280] text-lg max-w-2xl mx-auto">
              We take care of our team so they can focus on doing their best work.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {perks.map((perk, i) => (
              <motion.div
                key={perk.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-[#EBF3FB] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <perk.icon className="w-5 h-5 text-[#0067B8]" />
                </div>
                <h3 className="text-sm font-semibold text-[#1A1A1A] mb-1.5">{perk.title}</h3>
                <p className="text-[#6B7280] text-xs leading-relaxed">{perk.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Culture */}
      <section id="culture" className="py-20 bg-white">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] mb-6">
                Life at CubicleERP
              </h2>
              <p className="text-[#6B7280] text-base leading-relaxed mb-6">
                We are a team of builders, thinkers, and dreamers united by a common mission: to make enterprise software accessible and delightful. Our culture is built on transparency, collaboration, and a genuine respect for every individual&apos;s contribution.
              </p>
              <p className="text-[#6B7280] text-base leading-relaxed mb-6">
                From weekly all-hands where leadership shares openly about company direction, to hackathons where any idea can become a feature, we create an environment where everyone can thrive and do the most meaningful work of their career.
              </p>
              <div className="space-y-3">
                {[
                  "Quarterly team offsites in exciting destinations",
                  "Weekly learning sessions and tech talks",
                  "Open-door policy with leadership at all levels",
                  "Employee resource groups and community initiatives",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#0067B8] flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-[#1A1A1A] text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                {[
                  { num: "200+", label: "Team members" },
                  { num: "30+", label: "Countries represented" },
                  { num: "4.8/5", label: "Glassdoor rating" },
                  { num: "95%", label: "Employee retention" },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-br from-[#EBF3FB] to-white rounded-xl p-6 text-center border border-[#0067B8]/10"
                  >
                    <div className="text-3xl font-bold text-[#0067B8] mb-1">{stat.num}</div>
                    <div className="text-sm text-[#6B7280]">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <LP2CTA />
      <LP2Footer />
    </div>
  )
}
