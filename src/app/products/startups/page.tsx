"use client"

import LP2Navbar from "@/components/landingpage2/LP2Navbar"
import LP2Footer from "@/components/landingpage2/LP2Footer"
import LP2CTA from "@/components/landingpage2/LP2CTA"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import {
  Target,
  Zap,
  TrendingUp,
  DollarSign,
  Rocket,
  Users,
  BarChart3,
  Clock,
  Flame,
  FileText,
  Layers,
  Settings,
  Check,
  X,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Play,
  Globe,
  Shield,
} from "lucide-react"
import { useState } from "react"

/* ───── content data ───── */

const features = [
  {
    icon: Zap,
    title: "Rapid Deployment & Quick Onboarding",
    description:
      "Go from zero to fully operational in under 10 minutes with our guided setup wizard that configures everything based on your startup stage and team size. Import your contacts, connect your email, and start tracking deals instantly — no implementation consultants, no lengthy onboarding calls. Every new team member gets up to speed in minutes thanks to an intuitive interface designed for fast-moving teams that don't have time for training manuals.",
  },
  {
    icon: DollarSign,
    title: "Affordable, Startup-Friendly Pricing",
    description:
      "Start free with up to 3 users and all core modules included — no credit card required, no trial clock ticking down. As your team grows, upgrade at transparent per-user pricing with no hidden fees, no per-module charges, and no long-term contracts locking you in. Special discounts are available for YC, Techstars, 500 Startups, and other accelerator graduates so you can invest your runway where it matters most.",
  },
  {
    icon: TrendingUp,
    title: "Built to Scale with Your Growth",
    description:
      "CubicleERP is engineered to carry you from founding team to 500+ employees without ever needing to re-platform or migrate data. Activate advanced modules like workflow automation, multi-entity management, and custom analytics as your needs evolve. The same system that runs your 5-person seed-stage company handles the complexity of a 200-person Series C organization seamlessly.",
  },
  {
    icon: Settings,
    title: "Agile Tools for Agile Teams",
    description:
      "Built-in sprint boards, kanban workflows, and real-time task tracking keep your product and engineering teams aligned without leaving the platform. Link every project to its associated deal, invoice, and customer record so you always see the full picture. Customize workflows on the fly — because at a startup, the process that works today might need to change by next sprint.",
  },
  {
    icon: Flame,
    title: "Burn Rate & Cash Runway Tracking",
    description:
      "Monitor your monthly burn rate, cash runway, and expense trends with real-time financial dashboards purpose-built for startup economics. Set up alerts that notify you when your runway drops below critical thresholds so you're never caught off guard. Combine expense tracking, invoice receivables, and payroll data into a single cash-flow view that gives you and your investors complete financial clarity.",
  },
  {
    icon: BarChart3,
    title: "Investor Reporting & Board Decks",
    description:
      "Generate polished, board-ready reports with MRR, ARR, churn, CAC, LTV, and pipeline metrics pulled directly from your live data — no more midnight spreadsheet marathons before board meetings. Export investor updates as PDF or share live dashboards with your board members through secure read-only links. When VCs ask tough questions about unit economics, you'll have precise, real-time answers backed by actual data.",
  },
]

const benefits = [
  {
    title: "Replace Your Entire SaaS Stack",
    description:
      "Eliminate the cost and chaos of juggling HubSpot, Asana, QuickBooks, Gusto, and Google Sheets. CubicleERP consolidates CRM, projects, invoicing, HR, and analytics into one platform — saving you hundreds of dollars per month in subscriptions and countless hours of manual data syncing between disconnected tools.",
  },
  {
    title: "Run Lean Without Cutting Corners",
    description:
      "Automate repetitive tasks like lead routing, invoice generation, payment reminders, and onboarding workflows so your small team operates with the efficiency of a company three times its size. Every automation you set up is time reclaimed for building product and closing customers.",
  },
  {
    title: "Make Data-Driven Decisions from Day One",
    description:
      "Access real-time dashboards covering revenue trends, pipeline health, burn rate, team utilization, and customer metrics. When every dollar and every hour counts, having accurate data at your fingertips means you allocate resources wisely and spot growth opportunities before your competitors do.",
  },
  {
    title: "Impress Investors with Operational Maturity",
    description:
      "Demonstrate to VCs and board members that your startup runs on real systems, not spreadsheets. Instant access to financial reports, sales forecasts, and customer health metrics signals that your company is investment-ready and built on a foundation that can handle hypergrowth.",
  },
  {
    title: "Onboard New Hires in Minutes, Not Weeks",
    description:
      "As your team doubles after each funding round, CubicleERP's unified platform means new hires learn one system instead of ten. Built-in onboarding checklists, role-based access, and an intuitive interface get every new team member productive on their first day.",
  },
  {
    title: "Stay Focused on Product-Market Fit",
    description:
      "Spend less time on operational overhead and more time talking to customers and iterating on your product. CubicleERP handles the business backbone — billing, HR, pipeline management, and reporting — so your founding team stays laser-focused on what actually moves the needle.",
  },
]

const steps = [
  {
    step: "1",
    title: "Sign Up and Launch in Minutes",
    description:
      "Create your workspace, invite co-founders and early team members, and let the setup wizard configure your modules based on your startup stage and industry. Import existing contacts from CSV, Google Contacts, or your current CRM and connect your email for automatic conversation logging — you'll be fully operational before your coffee gets cold.",
    icon: Rocket,
  },
  {
    step: "2",
    title: "Centralize Your Operations",
    description:
      "Start tracking deals in your sales pipeline, send your first invoice, set up recurring billing, and manage your team's tasks from one unified dashboard. Connect payment gateways, configure automated follow-ups, and build the workflows that will power your growth engine.",
    icon: Layers,
  },
  {
    step: "3",
    title: "Scale Without Breaking Stride",
    description:
      "As your startup grows, activate advanced modules like workflow automation, investor reporting, multi-entity management, and custom analytics. Add unlimited users, create department-specific dashboards, and evolve your processes — all without migrating platforms or losing a single record.",
    icon: TrendingUp,
  },
]

const useCases = [
  {
    title: "Pre-Seed & Seed-Stage Founders",
    description:
      "Founding teams of 2-10 people use CubicleERP as their complete business operating system from day one. Track early customer conversations, manage contractor payments, monitor burn rate, and build the operational foundation that investors expect to see when you walk into your first pitch meeting.",
    highlights: [
      "Free tier for up to 3 users — ideal for co-founders bootstrapping on zero budget",
      "Integrated CRM and invoicing to manage first customers and revenue from one place",
      "Burn rate dashboard and runway calculator to keep cash flow visible at all times",
    ],
  },
  {
    title: "Series A Growth-Stage Companies",
    description:
      "Post-funding startups scaling from 15 to 150 employees use CubicleERP to professionalize operations and replace the patchwork of spreadsheets and free tools that got them through the early days. Structured sales processes, formal HR workflows, and detailed financial reporting become the backbone of sustainable growth.",
    highlights: [
      "Multi-stage sales pipelines with team quotas, leaderboards, and performance tracking",
      "Full HR suite with onboarding automation, leave management, and employee directory",
      "Board-ready reporting with MRR, ARR, churn, CAC, and LTV metrics generated instantly",
    ],
  },
  {
    title: "B2B SaaS & Tech Startups",
    description:
      "SaaS startups use CubicleERP to manage the entire customer lifecycle — from inbound lead capture and demo scheduling through subscription billing, renewal tracking, and customer success management. Every metric investors care about is tracked automatically and available in real time.",
    highlights: [
      "Recurring billing engine with automatic subscription management and dunning workflows",
      "Customer health scoring and churn prediction to drive proactive retention strategies",
      "Product-usage integration for data-driven expansion revenue and upsell opportunities",
    ],
  },
]

const faqs = [
  {
    question: "Is CubicleERP really free for small startup teams?",
    answer:
      "Yes, completely free for up to 3 users with no trial expiration and no credit card required. The free Starter plan includes core CRM, basic invoicing, project management, and team collaboration — everything a founding team needs to get off the ground. When you're ready for advanced features like automation, investor reporting, and analytics, upgrade to our Growth plan at startup-friendly pricing that scales with your headcount.",
  },
  {
    question: "How does CubicleERP help with investor reporting and board decks?",
    answer:
      "CubicleERP automatically tracks key startup metrics — MRR, ARR, churn rate, CAC, LTV, pipeline velocity, and burn rate — from your live operational data. You can generate board-ready PDF reports with one click or share secure, real-time dashboards directly with your investors and advisors. No more late-night spreadsheet sessions before board meetings. Your numbers are always current because they're pulled from the same system you use to run your business every day.",
  },
  {
    question: "Can I migrate data from HubSpot, Notion, Stripe, or other tools we currently use?",
    answer:
      "Absolutely. CubicleERP supports CSV import for contacts, deals, invoices, and projects from any platform. For HubSpot, Salesforce, and Notion, we provide guided migration assistants that automatically map your fields and preserve your data relationships. Our support team also offers free white-glove migration assistance for startups switching from other platforms, so you don't lose a single record or relationship in the transition.",
  },
  {
    question: "Do you offer special pricing for accelerator and incubator startups?",
    answer:
      "Yes! Startups that are part of Y Combinator, Techstars, 500 Startups, Plug and Play, or any recognized accelerator or incubator program receive 50% off the Growth plan for the first 12 months. We also participate in startup credit programs like the AWS Activate ecosystem and various VC perks platforms. Contact our startup partnerships team with your accelerator details to activate your discount — it takes less than 24 hours to verify and apply.",
  },
  {
    question: "What happens when we outgrow our current plan or need enterprise features?",
    answer:
      "CubicleERP is designed so you never have to re-platform. As your startup scales from seed to Series C and beyond, simply activate additional modules like advanced workflow automation, custom API integrations, multi-entity management, and role-based security controls. Many of our largest enterprise customers started with us as 3-person founding teams and still run on CubicleERP at 500+ employees. Your data, workflows, and history carry forward seamlessly — zero migration, zero downtime, zero retraining.",
  },
]

const stats = [
  { value: "2,500+", label: "Startups powered by CubicleERP" },
  { value: "<10 min", label: "Average time to full setup" },
  { value: "65%", label: "Cost savings vs separate SaaS tools" },
  { value: "3.2x", label: "Faster deal closure on average" },
]

const capabilities = [
  {
    title: "Fundraising & Investor Relations Hub",
    description:
      "Manage your entire fundraising lifecycle from one place. Track investor conversations, share data rooms, maintain cap table snapshots, and generate board-ready updates without scrambling through email threads and spreadsheets the night before a board meeting.",
    keyPoints: [
      "Investor CRM with meeting notes, follow-up tasks, and deal stage tracking",
      "Secure data room sharing with granular permission controls and view analytics",
      "One-click board update generation with live MRR, ARR, and burn rate metrics",
      "Cap table snapshot integration for dilution modeling during fundraising rounds",
    ],
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80",
  },
  {
    title: "Product-Led Growth Engine",
    description:
      "Connect your product usage data to your sales and success workflows. Identify power users ready for upsell, detect churn signals before they become cancellations, and automate expansion revenue playbooks that turn free users into paying customers.",
    keyPoints: [
      "Product usage event ingestion via API for behavioral scoring",
      "Automated PQL identification and routing to sales based on usage thresholds",
      "Churn risk scoring combining usage patterns, support tickets, and billing data",
      "Expansion revenue dashboards tracking upgrade paths and feature adoption",
    ],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
  },
  {
    title: "Lean Financial Operations",
    description:
      "Run your entire finance stack without a full-time finance hire. Automated invoicing, expense categorization, tax preparation, and cash flow forecasting give founders CFO-level financial visibility from day one without the CFO-level salary.",
    keyPoints: [
      "Automated recurring invoicing with dunning sequences for failed payments",
      "Smart expense categorization with receipt capture and approval workflows",
      "Real-time cash runway calculator with scenario modeling for different burn rates",
      "Tax-ready financial reports exportable for your accountant or tax software",
    ],
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
  },
]

const integrations = [
  { name: "Stripe", category: "Payments", size: "lg" },
  { name: "HubSpot", category: "CRM", size: "md" },
  { name: "Slack", category: "Communication", size: "lg" },
  { name: "Notion", category: "Documentation", size: "md" },
  { name: "GitHub", category: "Development", size: "lg" },
  { name: "Google Workspace", category: "Productivity", size: "lg" },
  { name: "QuickBooks", category: "Accounting", size: "md" },
  { name: "Zapier", category: "Automation", size: "lg" },
  { name: "Intercom", category: "Customer Support", size: "md" },
  { name: "Calendly", category: "Scheduling", size: "sm" },
  { name: "Jira", category: "Project Management", size: "sm" },
  { name: "Figma", category: "Design", size: "sm" },
]

const testimonials = [
  {
    quote:
      "We were using HubSpot, Asana, QuickBooks, and Google Sheets to run a 6-person startup. CubicleERP replaced all of them and saved us over $800 per month. Our investors were genuinely impressed by our operational maturity at the seed stage.",
    author: "Jason Liu",
    role: "Co-Founder & CEO",
    company: "Stackbase",
    metric: "$800/mo saved in SaaS costs",
  },
  {
    quote:
      "The investor reporting feature alone is worth it. Before our Series A board meetings, I used to spend an entire weekend pulling numbers from five different tools. Now I generate a complete board deck in under ten minutes with live data.",
    author: "Amara Osei",
    role: "Founder & COO",
    company: "Kinetic Health",
    metric: "Board prep reduced from 2 days to 10 min",
  },
  {
    quote:
      "We went from 4 people to 45 in eight months after our Series A. CubicleERP scaled with us seamlessly. New hires were productive on day one because there was only one system to learn instead of a dozen disconnected tools.",
    author: "Raj Patel",
    role: "Head of Operations",
    company: "Nomad Freight",
    metric: "Day-one productivity for all new hires",
  },
]

const comparisons = [
  { feature: "All-in-one platform", traditional: "5-8 separate tools", cubicleErp: "Single unified system" },
  { feature: "Setup time", traditional: "Days to weeks", cubicleErp: "Under 10 minutes" },
  { feature: "Monthly cost (10 users)", traditional: "$500-$1,200/mo", cubicleErp: "Starts free" },
  { feature: "Investor reporting", traditional: "Manual spreadsheets", cubicleErp: "One-click generation" },
  { feature: "Scalability", traditional: "Re-platform at growth", cubicleErp: "Seed to Series C+" },
]

/* ───── page component ───── */

export default function StartupsPage() {
  const [activeTab, setActiveTab] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <>
      <LP2Navbar />

      {/* ── 1. Hero ── */}
      <section className="relative bg-gradient-to-b from-orange-50 to-white pt-20 pb-6 overflow-hidden min-h-[50vh] flex items-center">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          {/* left */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 text-sm font-semibold mb-5">
              <Rocket className="w-4 h-4" /> Built for Startups
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-5">
              Launch fast, scale smart, and{" "}
              <span className="text-orange-600">stay lean</span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-xl">
              CubicleERP for Startups is the all-in-one business platform built for founders who refuse to slow down. From day-one operations to Series B and beyond, get CRM, invoicing, HR, project management, burn rate tracking, and investor reporting in a single affordable platform. Stop duct-taping together a dozen SaaS tools and start running your startup on a system designed for speed, agility, and relentless growth.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-orange-600 text-white font-semibold hover:bg-orange-700 transition shadow-lg shadow-orange-600/25"
              >
                Start Free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full border-2 border-orange-600 text-orange-600 font-semibold hover:bg-orange-50 transition"
              >
                <Play className="w-4 h-4" /> Watch Demo
              </Link>
            </div>
          </motion.div>

          {/* right – floating mock dashboard */}
          <motion.div
            className="relative hidden lg:flex items-center justify-center min-h-[340px]"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* CRM card */}
            <motion.div
              className="absolute w-64 bg-white rounded-2xl shadow-xl border border-orange-100 p-5 z-30"
              style={{ top: "0%", left: "10%" }}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Users className="w-4 h-4 text-orange-600" />
                </div>
                <span className="text-sm font-bold text-gray-800">CRM Pipeline</span>
              </div>
              <div className="space-y-2">
                <div className="h-2 rounded-full bg-orange-200 w-full" />
                <div className="h-2 rounded-full bg-orange-400 w-3/4" />
                <div className="h-2 rounded-full bg-orange-600 w-1/2" />
              </div>
              <p className="mt-3 text-xs text-gray-500">24 active deals &middot; $182k pipeline</p>
            </motion.div>

            {/* Finance card */}
            <motion.div
              className="absolute w-56 bg-white rounded-2xl shadow-xl border border-orange-100 p-5 z-20"
              style={{ top: "30%", left: "40%" }}
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm font-bold text-gray-800">Cash Runway</span>
              </div>
              <p className="text-2xl font-extrabold text-gray-900">18.4 mo</p>
              <p className="text-xs text-green-600 font-medium mt-1">Burn: $32k/mo</p>
            </motion.div>

            {/* Analytics card */}
            <motion.div
              className="absolute w-52 bg-white rounded-2xl shadow-xl border border-orange-100 p-5 z-10"
              style={{ top: "60%", left: "15%" }}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-sm font-bold text-gray-800">MRR Growth</span>
              </div>
              <p className="text-2xl font-extrabold text-gray-900">$47.2k</p>
              <p className="text-xs text-purple-600 font-medium mt-1">+22% this month</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── 2. Stats Banner ── */}
      <section className="bg-orange-600">
        <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <p className="text-3xl sm:text-4xl font-extrabold text-white">{s.value}</p>
              <p className="text-orange-100 text-sm mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 3. Interactive Feature Tabs ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Everything you need to move fast</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Six powerful modules built specifically for the way startups actually work.</p>
          </motion.div>

          {/* tab pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {features.map((f, i) => {
              const Icon = f.icon
              return (
                <button
                  key={i}
                  onClick={() => setActiveTab(i)}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                    activeTab === i
                      ? "bg-orange-600 text-white shadow-lg shadow-orange-600/25"
                      : "bg-gray-100 text-gray-600 hover:bg-orange-50 hover:text-orange-700"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{f.title.split(" ")[0]}</span>
                  <span className="sm:hidden">{f.title.split(" ")[0]}</span>
                </button>
              )
            })}
          </div>

          {/* tab content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="bg-orange-50 rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row gap-8 items-center"
            >
              <div className="w-20 h-20 rounded-2xl bg-orange-600 flex items-center justify-center shrink-0">
                {(() => {
                  const Icon = features[activeTab].icon
                  return <Icon className="w-10 h-10 text-white" />
                })()}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{features[activeTab].title}</h3>
                <p className="text-gray-600 leading-relaxed">{features[activeTab].description}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── 4. Capabilities Bento Grid ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Powerful capabilities, built in</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Deep functionality where it matters most for high-growth startups.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* first capability – spans full width */}
            <motion.div
              className="md:col-span-2 bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="grid md:grid-cols-2">
                <div className="p-8 sm:p-10 flex flex-col justify-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{capabilities[0].title}</h3>
                  <p className="text-gray-600 mb-5">{capabilities[0].description}</p>
                  <ul className="space-y-2">
                    {capabilities[0].keyPoints.map((kp, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-gray-700">
                        <Check className="w-4 h-4 text-orange-600 mt-0.5 shrink-0" />
                        {kp}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="relative h-64 md:h-auto">
                  <Image src={capabilities[0].image} alt={capabilities[0].title} fill className="object-cover" />
                </div>
              </div>
            </motion.div>

            {/* remaining capabilities */}
            {capabilities.slice(1).map((cap, i) => (
              <motion.div
                key={i}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="relative h-48">
                  <Image src={cap.image} alt={cap.title} fill className="object-cover" />
                </div>
                <div className="p-7">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{cap.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{cap.description}</p>
                  <ul className="space-y-1.5">
                    {cap.keyPoints.map((kp, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-gray-700">
                        <Check className="w-4 h-4 text-orange-600 mt-0.5 shrink-0" />
                        {kp}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Benefits Marquee ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Why startups choose CubicleERP</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Tangible advantages that help you ship faster and grow smarter.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <motion.div
                key={i}
                className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-orange-200 transition group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-orange-100 text-orange-700 font-extrabold text-lg mb-4 group-hover:bg-orange-600 group-hover:text-white transition">
                  {i + 1}
                </span>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{b.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{b.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. How It Works – Vertical Timeline ── */}
      <section className="py-20 bg-orange-50">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Up and running in three steps</h2>
            <p className="text-gray-600">From signup to scaled operations — faster than you'd believe.</p>
          </motion.div>

          <div className="relative">
            {/* connecting line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-orange-200" />

            <div className="space-y-12">
              {steps.map((s, i) => {
                const Icon = s.icon
                return (
                  <motion.div
                    key={i}
                    className="relative flex gap-6"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                  >
                    {/* dot */}
                    <div className="relative z-10 w-12 h-12 rounded-full bg-orange-600 flex items-center justify-center shrink-0 shadow-lg shadow-orange-600/25">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100 flex-1">
                      <p className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">Step {s.step}</p>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{s.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{s.description}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. Integration Cloud ── */}
      <section className="py-20 bg-orange-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Connects to your favourite tools</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Plug into the ecosystem you already use. No data silos, no manual imports.</p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4">
            {integrations.map((intg, i) => {
              const sizeMap: Record<string, string> = {
                lg: "px-7 py-3.5 text-base",
                md: "px-5 py-2.5 text-sm",
                sm: "px-4 py-2 text-xs",
              }
              return (
                <motion.div
                  key={i}
                  className={`bg-white rounded-full shadow-sm border border-orange-100 font-semibold text-gray-800 hover:border-orange-300 hover:shadow-md transition ${sizeMap[intg.size]}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <span>{intg.name}</span>
                  <span className="text-gray-400 ml-2 font-normal">{intg.category}</span>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── 8. Use Cases ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Built for every startup stage</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Whether you are pre-revenue or scaling post-Series A, CubicleERP fits.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {useCases.map((uc, i) => (
              <motion.div
                key={i}
                className="rounded-2xl bg-white border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="h-1.5 bg-gradient-to-r from-orange-400 to-orange-600" />
                <div className="p-7">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{uc.title}</h3>
                  <p className="text-gray-600 text-sm mb-5 leading-relaxed">{uc.description}</p>
                  <ul className="space-y-2">
                    {uc.highlights.map((h, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-gray-700">
                        <Sparkles className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. Comparison Table ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">CubicleERP vs. the old way</h2>
            <p className="text-gray-600">See what changes when you consolidate onto one platform.</p>
          </motion.div>

          <motion.div
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* header */}
            <div className="grid grid-cols-3 bg-orange-600 text-white text-sm font-bold">
              <div className="p-4">Feature</div>
              <div className="p-4 text-center">Traditional Stack</div>
              <div className="p-4 text-center">CubicleERP</div>
            </div>
            {comparisons.map((c, i) => (
              <div key={i} className={`grid grid-cols-3 text-sm ${i % 2 === 0 ? "bg-white" : "bg-orange-50/40"}`}>
                <div className="p-4 font-medium text-gray-900">{c.feature}</div>
                <div className="p-4 text-center text-gray-500 flex items-center justify-center gap-1.5">
                  <X className="w-4 h-4 text-red-400" />
                  {c.traditional}
                </div>
                <div className="p-4 text-center text-gray-900 font-medium flex items-center justify-center gap-1.5">
                  <Check className="w-4 h-4 text-orange-600" />
                  {c.cubicleErp}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 10. Testimonials ── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Trusted by fast-growing startups</h2>
            <p className="text-gray-600">Hear from founders who ditched the SaaS patchwork.</p>
          </motion.div>

          <div className="space-y-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                className="bg-gray-50 rounded-2xl p-8 border border-gray-100 flex flex-col sm:flex-row gap-6 items-start"
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex-1">
                  <p className="text-gray-700 leading-relaxed mb-4 italic">&ldquo;{t.quote}&rdquo;</p>
                  <p className="font-bold text-gray-900">{t.author}</p>
                  <p className="text-sm text-gray-500">{t.role}, {t.company}</p>
                </div>
                <div className="shrink-0 bg-orange-600 text-white rounded-xl px-5 py-3 text-sm font-bold shadow-lg shadow-orange-600/20">
                  {t.metric}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 11. FAQ Accordion ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Frequently asked questions</h2>
            <p className="text-gray-600">Quick answers for founders evaluating CubicleERP.</p>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-orange-600 shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-50 pt-3">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 12. CTA ── */}
      <section className="py-20 bg-gradient-to-br from-orange-600 to-orange-700">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-5">
              Ready to run your startup like a rocketship?
            </h2>
            <p className="text-orange-100 mb-8 max-w-xl mx-auto">
              Join 2,500+ startups already using CubicleERP to launch faster, operate leaner, and scale smarter. Free for up to 3 users — no credit card required.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-orange-700 font-bold hover:bg-orange-50 transition shadow-lg"
              >
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-white/40 text-white font-bold hover:bg-white/10 transition"
              >
                Talk to Sales
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 13. LP2CTA + LP2Footer ── */}
      <LP2CTA />
      <LP2Footer />
    </>
  )
}
