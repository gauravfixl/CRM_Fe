"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import LP2Navbar from "@/components/landingpage2/LP2Navbar"
import LP2CTA from "@/components/landingpage2/LP2CTA"
import LP2Footer from "@/components/landingpage2/LP2Footer"
import {
  ArrowLeft,
  ArrowRight,
  Mail,
  MessageSquare,
  CreditCard,
  HardDrive,
  Calendar,
  Calculator,
  Plug,
  Webhook,
  Code2,
  Zap,
  Shield,
  RefreshCw,
  CheckCircle2,
  Globe,
  Lock,
  BarChart3,
} from "lucide-react"

const integrationCategories = [
  {
    category: "Email",
    icon: Mail,
    color: "#0067B8",
    bg: "#EBF3FB",
    tools: [
      {
        name: "Gmail",
        description: "Sync contacts, track email opens, and log conversations automatically from your Gmail inbox.",
      },
      {
        name: "Outlook",
        description: "Two-way sync with Microsoft Outlook for seamless email tracking and calendar integration.",
      },
    ],
  },
  {
    category: "Communication",
    icon: MessageSquare,
    color: "#5C2D91",
    bg: "#F3EBF9",
    tools: [
      {
        name: "Slack",
        description: "Get real-time CRM notifications, create deals from Slack, and collaborate without switching tabs.",
      },
      {
        name: "Microsoft Teams",
        description: "Embed CubicleERP dashboards in Teams channels and receive pipeline alerts instantly.",
      },
    ],
  },
  {
    category: "Payments",
    icon: CreditCard,
    color: "#008575",
    bg: "#E0F2F1",
    tools: [
      {
        name: "Stripe",
        description: "Auto-sync invoices, subscriptions, and payment statuses directly into your finance module.",
      },
      {
        name: "PayPal",
        description: "Track PayPal transactions, reconcile payments, and generate financial reports effortlessly.",
      },
    ],
  },
  {
    category: "Storage",
    icon: HardDrive,
    color: "#D83B01",
    bg: "#FFF0E8",
    tools: [
      {
        name: "Google Drive",
        description: "Attach Drive files to deals and contacts. Auto-organize documents by client or project.",
      },
      {
        name: "Dropbox",
        description: "Link Dropbox folders to projects, share files with teams, and keep everything version-controlled.",
      },
    ],
  },
  {
    category: "Calendar",
    icon: Calendar,
    color: "#107C10",
    bg: "#E8F5E9",
    tools: [
      {
        name: "Google Calendar",
        description: "Sync meetings, set follow-up reminders, and auto-log client calls from Google Calendar.",
      },
      {
        name: "Outlook Calendar",
        description: "Bi-directional calendar sync so your schedule is always up to date across platforms.",
      },
    ],
  },
  {
    category: "Accounting",
    icon: Calculator,
    color: "#0891B2",
    bg: "#E0F7FA",
    tools: [
      {
        name: "QuickBooks",
        description: "Sync invoices, expenses, and financial data between CubicleERP and QuickBooks Online.",
      },
      {
        name: "Xero",
        description: "Automate bookkeeping with real-time data flow between your CRM and Xero accounting.",
      },
    ],
  },
]

const benefits = [
  {
    icon: Zap,
    title: "Save hours every week",
    description: "Eliminate manual data entry with automated two-way syncs between your favorite tools.",
  },
  {
    icon: Shield,
    title: "Enterprise-grade security",
    description: "All integrations use OAuth 2.0 and encrypted data transfer to keep your information safe.",
  },
  {
    icon: RefreshCw,
    title: "Real-time sync",
    description: "Changes in connected apps are reflected instantly in CubicleERP — no delays, no stale data.",
  },
  {
    icon: BarChart3,
    title: "Unified reporting",
    description: "Pull data from all connected tools into a single dashboard for holistic business insights.",
  },
]

export default function IntegrationsPage() {
  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "'Segoe UI', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
    >
      <LP2Navbar />

      {/* Hero */}
      <section
        className="relative pt-24 pb-16 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #EBF3FB 0%, #F3EBF9 40%, #E0F2F1 70%, #FFF8E1 100%)" }}
      >
        <div className="absolute inset-0 bg-white/40 pointer-events-none" />
        <div className="relative max-w-[1280px] mx-auto px-6">
          <Link
            href="/#overview"
            className="inline-flex items-center gap-1.5 text-[#505050] text-sm hover:text-[#0067B8] transition-colors mb-6 relative z-10"
          >
            <ArrowLeft size={15} /> Back to overview
          </Link>
          <motion.div
            className="flex flex-col lg:flex-row items-center gap-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex-1">
              <span className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-white/50 text-[#0067B8] px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide mb-5">
                <Plug size={14} /> 50+ Integrations
              </span>
              <h1 className="text-[36px] lg:text-[48px] font-bold text-[#1A1A1A] leading-tight">
                Connect Your Favorite Tools
              </h1>
              <p className="mt-5 text-lg text-[#505050] leading-relaxed max-w-xl">
                CubicleERP integrates seamlessly with the tools you already use. Sync data, automate workflows,
                and build a connected business ecosystem — all from one platform.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#0067B8] text-white font-semibold text-[15px] hover:bg-[#005DA6] transition-colors"
                >
                  Browse integrations <ArrowRight size={16} />
                </Link>
                <Link
                  href="/api-docs"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-[#E5E5E5] text-[#1A1A1A] font-semibold text-[15px] hover:bg-[#F5F5F5] transition-colors bg-white/60"
                >
                  <Code2 size={16} /> API docs
                </Link>
              </div>
            </div>

            <div className="flex-1 flex justify-center">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: Mail, label: "Email", color: "#0067B8" },
                  { icon: MessageSquare, label: "Chat", color: "#5C2D91" },
                  { icon: CreditCard, label: "Payments", color: "#008575" },
                  { icon: HardDrive, label: "Storage", color: "#D83B01" },
                  { icon: Calendar, label: "Calendar", color: "#107C10" },
                  { icon: Calculator, label: "Accounting", color: "#0891B2" },
                ].map((item) => (
                  <motion.div
                    key={item.label}
                    className="flex flex-col items-center gap-2 bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-white/50"
                    whileHover={{ y: -4, scale: 1.03 }}
                    transition={{ duration: 0.2 }}
                  >
                    <item.icon size={28} style={{ color: item.color }} />
                    <span className="text-xs font-semibold text-[#1A1A1A]">{item.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Integration Categories */}
      <section className="py-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-[30px] font-semibold text-[#1A1A1A] mb-4">
              Explore Integrations by Category
            </h2>
            <p className="text-[16px] text-[#6B7280] max-w-2xl mx-auto">
              From email and communication to payments and accounting, CubicleERP connects with the tools
              your team relies on every day.
            </p>
          </motion.div>

          <div className="space-y-16">
            {integrationCategories.map((cat, catIdx) => (
              <motion.div
                key={cat.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: catIdx * 0.05 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: cat.bg }}
                  >
                    <cat.icon size={20} style={{ color: cat.color }} />
                  </div>
                  <h3 className="text-[22px] font-semibold text-[#1A1A1A]">{cat.category}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {cat.tools.map((tool) => (
                    <div
                      key={tool.name}
                      className="group bg-white rounded-2xl border border-[#E5E5E5] p-6 hover:border-[#0067B8]/30 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                            style={{ backgroundColor: cat.color }}
                          >
                            {tool.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="text-[17px] font-semibold text-[#1A1A1A]">{tool.name}</h4>
                            <span className="text-xs text-[#6B7280]">{cat.category}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-[14px] text-[#6B7280] leading-relaxed mb-5">{tool.description}</p>
                      <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#0067B8] text-[#0067B8] text-sm font-semibold hover:bg-[#0067B8] hover:text-white transition-colors">
                        <Plug size={14} /> Connect
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* API & Webhooks */}
      <section className="py-20 bg-[#FAFBFC]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 bg-[#EBF3FB] text-[#0067B8] px-3 py-1 rounded-full text-sm font-semibold mb-4">
                <Code2 size={14} /> Developer Tools
              </span>
              <h2 className="text-[30px] font-semibold text-[#1A1A1A] mb-5">
                Build Custom Integrations with Our API & Webhooks
              </h2>
              <p className="text-[16px] text-[#505050] leading-relaxed mb-4">
                Need something custom? Our RESTful API and webhook system give you full control. Push and pull
                data, trigger workflows, and build integrations tailored to your exact business needs.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "RESTful API with comprehensive documentation",
                  "Webhooks for real-time event notifications",
                  "OAuth 2.0 authentication for secure access",
                  "Rate-limited endpoints with generous quotas",
                  "SDKs available for Node.js, Python, and more",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[14px] text-[#505050]">
                    <CheckCircle2 size={16} className="text-[#107C10] mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/api-docs"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#0067B8] text-white font-semibold text-[15px] hover:bg-[#005DA6] transition-colors"
              >
                View API documentation <ArrowRight size={16} />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <div className="bg-[#1E1E1E] rounded-2xl p-6 font-mono text-sm shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                  <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                  <span className="w-3 h-3 rounded-full bg-[#28CA42]" />
                  <span className="ml-3 text-[#888] text-xs">webhook-example.js</span>
                </div>
                <pre className="text-[#D4D4D4] leading-relaxed overflow-x-auto">
                  <code>{`// Listen for deal updates
app.post("/webhooks/cubicle", (req, res) => {
  const { event, data } = req.body;

  if (event === "deal.updated") {
    console.log("Deal updated:", data.name);
    console.log("New stage:", data.stage);
    // Trigger your custom logic here
  }

  res.status(200).json({ received: true });
});`}</code>
                </pre>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-[30px] font-semibold text-[#1A1A1A] mb-4">
              Why Integrate with CubicleERP?
            </h2>
            <p className="text-[16px] text-[#6B7280] max-w-2xl mx-auto">
              Connected tools mean fewer silos, faster workflows, and better decisions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, i) => (
              <motion.div
                key={benefit.title}
                className="bg-white rounded-2xl border border-[#E5E5E5] p-6 text-center hover:shadow-lg transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className="w-12 h-12 rounded-xl bg-[#EBF3FB] flex items-center justify-center mx-auto mb-4">
                  <benefit.icon size={22} className="text-[#0067B8]" />
                </div>
                <h3 className="text-[16px] font-semibold text-[#1A1A1A] mb-2">{benefit.title}</h3>
                <p className="text-[14px] text-[#6B7280] leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-[#0067B8]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "50+", label: "Integrations Available" },
              { value: "2M+", label: "API Calls Per Day" },
              { value: "99.99%", label: "API Uptime" },
              { value: "<100ms", label: "Average Response Time" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className="text-[32px] font-bold text-white">{stat.value}</div>
                <div className="text-[14px] text-white/70 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <LP2CTA />
      <LP2Footer />
    </div>
  )
}
