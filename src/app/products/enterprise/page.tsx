"use client"

import LP2Navbar from "@/components/landingpage2/LP2Navbar"
import LP2Footer from "@/components/landingpage2/LP2Footer"
import LP2CTA from "@/components/landingpage2/LP2CTA"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import {
  Building2,
  Shield,
  Users,
  Lock,
  BarChart3,
  Workflow,
  Check,
  CheckCircle2,
  X,
  ChevronDown,
  Quote,
  ArrowRight,
  Zap,
  Globe,
  Server,
  Plug,
} from "lucide-react"

const features = [
  {
    icon: Users,
    title: "Multi-Entity Management",
    description:
      "Manage multiple subsidiaries, branches, and business units from a single unified dashboard. Each entity maintains its own chart of accounts, workflows, and user permissions while leadership gets a consolidated, real-time view across the entire organization. Easily allocate resources, compare performance metrics, and enforce governance policies across all entities without switching between disconnected tools.",
  },
  {
    icon: Lock,
    title: "Advanced Security & Compliance",
    description:
      "Enterprise-grade security with SSO/SAML integration, two-factor authentication, IP whitelisting, and detailed audit trails for every action taken in the system. Meet SOC 2, GDPR, and HIPAA compliance requirements out of the box with data encryption at rest and in transit, granular role-based access controls, and automated compliance reporting. Regular penetration testing and vulnerability assessments ensure your data remains protected against evolving threats.",
  },
  {
    icon: Workflow,
    title: "Custom Workflow Automation",
    description:
      "Design sophisticated multi-step approval workflows, automated escalations, and conditional routing rules without writing a single line of code. Automate purchase order approvals, expense claims, leave requests, and any business process with configurable triggers, conditions, and actions that adapt to your organizational hierarchy. Built-in workflow analytics let you identify bottlenecks and optimize process efficiency across departments.",
  },
  {
    icon: BarChart3,
    title: "Executive Analytics & BI",
    description:
      "Purpose-built executive dashboards with real-time KPIs, drill-down capabilities, and predictive analytics powered by AI and machine learning models. Create custom reports, schedule automated distribution to stakeholders, and embed live dashboards in board presentations. Track revenue, margins, headcount, project profitability, and operational efficiency across all departments with historical trend analysis and forecasting.",
  },
  {
    icon: Shield,
    title: "Dedicated Support & SLA Guarantees",
    description:
      "Get a dedicated customer success manager, priority support queue, and guaranteed SLA response times backed by contractual commitments. Access 24/7 phone and email support, scheduled platform health checks, quarterly business reviews, and proactive performance monitoring to ensure your platform runs smoothly at all times. Our enterprise support team includes technical architects who understand your specific configuration and business context.",
  },
  {
    icon: Building2,
    title: "API & Custom Integrations",
    description:
      "Connect CubicleERP with your existing tech stack using our comprehensive REST API, webhooks, and pre-built connectors for Salesforce, SAP, Oracle, Microsoft 365, Slack, and hundreds of other enterprise tools. Build custom integrations with full API documentation, sandbox environments, and dedicated integration support from our engineering team. Rate-limited endpoints, OAuth 2.0 authentication, and versioned APIs ensure stability and security for all connected systems.",
  },
]

const benefits = [
  {
    title: "Eliminate Silos Across Departments",
    description:
      "Unify HR, finance, sales, projects, and operations on a single platform. Every department works from the same data, reducing miscommunication, duplicate data entry, and manual reconciliation across disconnected tools.",
  },
  {
    title: "Scale Without Limits",
    description:
      "Whether you have 100 employees or 10,000, CubicleERP Enterprise scales elastically. Our cloud infrastructure automatically adjusts to your workload, ensuring fast performance during peak periods without manual infrastructure management.",
  },
  {
    title: "Reduce Total Cost of Ownership",
    description:
      "Replace multiple point solutions with one unified platform. Enterprises that switch to CubicleERP save an average of 40% on software licensing, reduce IT administration overhead, and eliminate costly integration maintenance between disconnected tools.",
  },
  {
    title: "Accelerate Decision-Making",
    description:
      "Real-time data across every business function means leadership can make informed decisions in minutes, not days. No more waiting for reports to be compiled from multiple systems — everything is available on demand with drill-down capabilities.",
  },
  {
    title: "Maintain Regulatory Compliance",
    description:
      "Built-in compliance frameworks, automated audit trails, and policy enforcement ensure your organization meets industry regulations without manual tracking. Generate compliance reports instantly for auditors and regulatory bodies.",
  },
  {
    title: "Future-Proof Your Technology",
    description:
      "Regular platform updates, an open API architecture, and a commitment to modern standards mean your investment grows with you. Avoid the technology debt that comes with legacy ERP systems and stay current without disruptive migration projects.",
  },
]

const stats = [
  { value: "500+", label: "Enterprise clients worldwide" },
  { value: "99.99%", label: "Platform uptime SLA" },
  { value: "40%", label: "Average cost reduction" },
  { value: "3x", label: "Faster reporting cycles" },
]

const capabilities = [
  {
    title: "Global Operations Command Center",
    description:
      "Operate across geographies, currencies, and regulatory environments from a single pane of glass. CubicleERP Enterprise consolidates data from every subsidiary and business unit into real-time executive dashboards that surface anomalies, forecast demand, and enable instant cross-border decision-making.",
    keyPoints: [
      "Multi-currency transaction processing with automatic exchange rate updates",
      "Country-specific tax engine supporting VAT, GST, and withholding tax regulations",
      "Consolidated financial reporting across entities with intercompany elimination",
      "Geo-distributed data residency options to meet local data sovereignty laws",
    ],
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80",
  },
  {
    title: "Enterprise Change Management",
    description:
      "Roll out new processes, policies, and system configurations across thousands of users with controlled, phased deployment capabilities. Version-controlled configuration management ensures every change is auditable, reversible, and aligned with organizational governance standards.",
    keyPoints: [
      "Phased rollout scheduler with user-group targeting and rollback controls",
      "Configuration version history with diff comparison and approval chains",
      "Impact analysis reports before deploying workflow or permission changes",
      "Change request tracking integrated with IT service management workflows",
    ],
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  },
  {
    title: "Advanced Data Governance & Privacy",
    description:
      "Enforce enterprise-wide data governance policies that control who can access, modify, export, and delete sensitive information. Purpose-built for organizations operating under GDPR, CCPA, SOX, and industry-specific regulations with automated policy enforcement and continuous monitoring.",
    keyPoints: [
      "Data classification engine with automatic sensitivity labeling",
      "Retention policies with automated archival and legal hold capabilities",
      "Right-to-erasure workflows for GDPR and CCPA subject access requests",
      "Cross-border data transfer controls with privacy impact assessments",
    ],
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
  },
  {
    title: "Intelligent Process Mining & Optimization",
    description:
      "Leverage AI-driven process mining to discover how your enterprise actually operates versus how it should. Identify inefficiencies, compliance gaps, and automation opportunities across departments by analyzing millions of process events in real time.",
    keyPoints: [
      "Automated process discovery from system event logs and user activity",
      "Bottleneck detection with root cause analysis and resolution recommendations",
      "Conformance checking against standard operating procedures and policies",
      "ROI modeling for automation initiatives based on actual process data",
    ],
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
  },
]

const integrations = [
  { name: "SAP S/4HANA", category: "ERP" },
  { name: "Oracle NetSuite", category: "ERP" },
  { name: "Salesforce", category: "CRM" },
  { name: "Microsoft 365", category: "Productivity" },
  { name: "Slack", category: "Communication" },
  { name: "Workday", category: "HR" },
  { name: "Jira", category: "Project Management" },
  { name: "Snowflake", category: "Data Warehouse" },
  { name: "Okta", category: "Identity & SSO" },
  { name: "ServiceNow", category: "ITSM" },
  { name: "Tableau", category: "Business Intelligence" },
  { name: "DocuSign", category: "e-Signatures" },
]

const testimonials = [
  {
    quote:
      "CubicleERP replaced four separate enterprise systems and gave us a unified view across 12 countries. Our monthly close process went from 15 days to 4 days, and our CFO finally has real-time visibility into global performance.",
    author: "Margaret Chen",
    role: "VP of Operations",
    company: "Meridian Global Industries",
    metric: "73% faster monthly close",
  },
  {
    quote:
      "The multi-entity management alone justified the switch. We were drowning in intercompany reconciliations across 8 subsidiaries. CubicleERP automated the entire process and cut our audit preparation time in half.",
    author: "David Harrington",
    role: "Chief Financial Officer",
    company: "Axon Manufacturing Group",
    metric: "50% reduction in audit prep time",
  },
  {
    quote:
      "What impressed us most was the implementation team's enterprise experience. They understood our complex approval chains and compliance needs from day one. We were fully live across 3,000 users in just 12 weeks.",
    author: "Priya Sharma",
    role: "Director of Digital Transformation",
    company: "Vantage Health Systems",
    metric: "3,000 users onboarded in 12 weeks",
  },
]

const comparisons = [
  { feature: "Multi-entity management", traditional: "Manual consolidation", cubicleErp: "Unified real-time view" },
  { feature: "Security & compliance", traditional: "Bolt-on add-ons", cubicleErp: "Built-in by default" },
  { feature: "Custom workflows", traditional: "Expensive consultants", cubicleErp: "No-code builder" },
  { feature: "Analytics & BI", traditional: "Separate BI license", cubicleErp: "Included natively" },
  { feature: "Implementation timeline", traditional: "12-24 months", cubicleErp: "8-16 weeks" },
  { feature: "Total cost of ownership", traditional: "High hidden costs", cubicleErp: "40% lower on average" },
]

const faqs = [
  {
    question: "How long does an enterprise implementation typically take?",
    answer:
      "Implementation timelines vary based on complexity, but most enterprise deployments are completed in 8-16 weeks. We follow an agile implementation methodology with phased rollouts, so your teams can start using core modules within the first few weeks while more complex configurations are finalized. Our dedicated project managers ensure timelines are met without compromising quality.",
  },
  {
    question:
      "Can CubicleERP integrate with our existing ERP and legacy systems?",
    answer:
      "Yes. CubicleERP provides a comprehensive REST API, webhooks, and pre-built connectors for major enterprise platforms including SAP, Oracle, Microsoft Dynamics, Salesforce, and Workday. For custom integrations, our integration team builds and maintains connectors using our open API. We also support data sync via flat files, SFTP, and middleware platforms like MuleSoft and Zapier.",
  },
  {
    question: "What security certifications does CubicleERP hold?",
    answer:
      "CubicleERP maintains SOC 2 Type II certification, is GDPR compliant, and supports HIPAA compliance for healthcare organizations. Our infrastructure runs on enterprise-grade cloud providers with data encryption at rest (AES-256) and in transit (TLS 1.3), regular penetration testing, and 99.99% uptime SLA. We also support customer-managed encryption keys for sensitive industries.",
  },
  {
    question: "How does pricing work for large organizations?",
    answer:
      "Enterprise pricing is customized based on user count, modules required, support level, and deployment preferences. We offer volume discounts for large teams and flexible billing options including annual and multi-year agreements. Contact our sales team for a detailed proposal tailored to your organization's specific requirements and budget.",
  },
  {
    question: "Do you offer on-premise or private cloud deployment?",
    answer:
      "CubicleERP is primarily a cloud-hosted solution, but we offer private cloud deployment options for enterprises with strict data residency or regulatory requirements. Private cloud deployments include dedicated infrastructure, custom backup schedules, and enhanced security configurations. Contact our enterprise team to discuss deployment options that meet your compliance and governance needs.",
  },
]

const steps = [
  {
    step: "1",
    title: "Discovery & Planning",
    description:
      "Our enterprise team conducts a thorough assessment of your current systems, workflows, and requirements. We create a detailed implementation roadmap tailored to your organization's priorities, timeline, and change management needs.",
  },
  {
    step: "2",
    title: "Configuration & Migration",
    description:
      "We configure CubicleERP to match your organizational structure, migrate historical data from legacy systems, set up integrations, and customize workflows. Your dedicated implementation team handles everything with minimal disruption to daily operations.",
  },
  {
    step: "3",
    title: "Training & Go-Live",
    description:
      "Comprehensive training programs for every user role — from executives to front-line staff. Phased rollout with parallel running periods, 24/7 go-live support, and ongoing optimization to ensure long-term success and maximum adoption.",
  },
]

const useCases = [
  {
    title: "Multi-Location Operations",
    description:
      "Enterprises with offices, warehouses, or retail locations across multiple regions use CubicleERP to standardize operations while allowing local flexibility in workflows and compliance requirements.",
    highlights: [
      "Consolidated dashboards with location-level drill-down",
      "Multi-currency and multi-language support for global teams",
      "Location-specific workflows with centralized policy governance",
    ],
  },
  {
    title: "Complex Organizational Hierarchies",
    description:
      "Large organizations with multiple business units, subsidiaries, and matrix reporting structures use CubicleERP to maintain clarity across complex hierarchies without losing operational agility.",
    highlights: [
      "Matrix reporting with dual-manager approval workflows",
      "Business unit P&L tracking with inter-company transactions",
      "Role-based dashboards customized for each management level",
    ],
  },
  {
    title: "Regulated Industries",
    description:
      "Enterprises in banking, insurance, pharmaceuticals, and government use CubicleERP to maintain strict compliance while keeping operations efficient and audit-ready at all times.",
    highlights: [
      "Automated compliance checks with real-time violation alerts",
      "Complete audit trails with tamper-proof logging",
      "Built-in frameworks for SOC 2, GDPR, HIPAA, and ISO 27001",
    ],
  },
]

const trustedCompanies = [
  "Meridian Corp",
  "Axon Group",
  "Vantage Health",
  "Nextera Industries",
  "Pinnacle Finance",
  "Orion Logistics",
]

const featureIcons = [Users, Lock, Workflow, BarChart3, Shield, Building2]

function FAQItem({ faq, index }: { faq: (typeof faqs)[0]; index: number }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07 }}
      className="border border-gray-200 rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
        <ChevronDown
          className={`w-5 h-5 text-[#0067B8] shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <p className="px-6 pb-5 text-gray-600 leading-relaxed">{faq.answer}</p>
      </motion.div>
    </motion.div>
  )
}

export default function EnterprisePage() {
  return (
    <main className="bg-white">
      <LP2Navbar />

      {/* ===== 1. HERO ===== */}
      <section className="relative min-h-[50vh] flex items-center pt-16 pb-12 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80"
            alt="Enterprise skyline"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-900/85 to-gray-900/70" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid lg:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#0067B8]/20 border border-[#0067B8]/40 text-[#5bb8ff] text-sm font-medium mb-5">
              CubicleERP Enterprise
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              Full-scale ERP built for large organizations
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-xl">
              CubicleERP Enterprise delivers a comprehensive, fully integrated business management platform designed for companies with complex workflows, multiple departments, and global operations. From advanced role-based access controls and multi-entity management to deep analytics and custom automation — everything your enterprise needs to operate at scale, without the complexity of legacy systems.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="px-7 py-3 bg-[#0067B8] hover:bg-[#005a9e] text-white font-semibold rounded-lg transition-colors"
              >
                Request a Demo
              </Link>
              <Link
                href="/pricing"
                className="px-7 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-lg transition-colors"
              >
                View Pricing
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {stats.map((stat, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-5 text-center"
              >
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-300">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== 2. TRUSTED BY STRIP ===== */}
      <section className="bg-gray-50 py-5 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-center gap-6">
          <span className="text-sm text-gray-500 font-medium mr-2">Trusted by 500+ enterprises worldwide</span>
          {trustedCompanies.map((c) => (
            <span
              key={c}
              className="px-4 py-1.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700"
            >
              {c}
            </span>
          ))}
        </div>
      </section>

      {/* ===== 3. CORE FEATURES GRID ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything your enterprise needs</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              A unified platform with purpose-built modules for every department, designed to eliminate complexity and accelerate growth.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = featureIcons[i]
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="group bg-blue-50/60 border border-blue-100 rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-[#0067B8]" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{f.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===== 4. CAPABILITIES DEEP DIVE ===== */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Enterprise-grade capabilities</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Deep-dive into the powerful capabilities that set CubicleERP apart from legacy enterprise solutions.
            </p>
          </motion.div>
          <div className="space-y-16">
            {capabilities.map((cap, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className={`flex flex-col ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} gap-10 items-center`}
              >
                <div className="lg:w-1/2">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{cap.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-5">{cap.description}</p>
                  <ul className="space-y-3">
                    {cap.keyPoints.map((kp, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-[#0067B8] mt-0.5 shrink-0" />
                        <span className="text-gray-700 text-sm">{kp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="lg:w-1/2 relative h-64 lg:h-80 w-full rounded-xl overflow-hidden shadow-lg">
                  <Image src={cap.image} alt={cap.title} fill className="object-cover" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 5. BENEFITS NUMBERED LIST ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:sticky lg:top-32 lg:self-start"
            >
              <span className="inline-block text-xs font-semibold tracking-wider uppercase text-[#0067B8] bg-blue-50 px-3 py-1 rounded-full mb-4">Why CubicleERP?</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why enterprises choose CubicleERP
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Organizations across every industry rely on CubicleERP to unify their operations, reduce costs, and gain the agility they need to compete in fast-moving markets. Here are the key reasons enterprises make the switch.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-[#0067B8]">40%</div>
                  <div className="text-xs text-gray-600 mt-1">Average cost reduction</div>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-[#0067B8]">3x</div>
                  <div className="text-xs text-gray-600 mt-1">Faster reporting cycles</div>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-[#0067B8]">500+</div>
                  <div className="text-xs text-gray-600 mt-1">Enterprise clients</div>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-[#0067B8]">99.99%</div>
                  <div className="text-xs text-gray-600 mt-1">Platform uptime SLA</div>
                </div>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                From eliminating data silos to automating complex workflows, CubicleERP delivers measurable ROI within the first quarter. Our enterprise customers report significant improvements in operational efficiency, team collaboration, and decision-making speed.
              </p>
              <Link href="/auth/signup" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#0067B8] hover:bg-[#005a9e] transition-colors mb-8">
                Start your transformation <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="bg-white border border-blue-100 rounded-xl p-5 mb-6">
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-[#0067B8] text-2xl leading-none">&ldquo;</div>
                  <p className="text-gray-600 text-sm italic leading-relaxed">CubicleERP replaced four separate enterprise systems and gave us a unified view across 12 countries. Our monthly close process went from 15 days to 4 days.</p>
                </div>
                <div className="flex items-center gap-2 ml-6">
                  <div className="w-8 h-8 rounded-full bg-[#0067B8] text-white flex items-center justify-center text-xs font-bold">MC</div>
                  <div>
                    <div className="text-xs font-semibold text-gray-900">Margaret Chen</div>
                    <div className="text-[10px] text-gray-500">VP Operations, Meridian Global</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <h4 className="text-sm font-bold text-gray-900">Trusted by industry leaders</h4>
                <div className="flex flex-wrap gap-2">
                  {["SOC 2 Type II", "GDPR Compliant", "HIPAA Ready", "ISO 27001", "SSO/SAML", "99.99% SLA"].map((badge) => (
                    <span key={badge} className="text-[10px] font-medium text-[#0067B8] bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">{badge}</span>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-5">
                <h4 className="text-sm font-bold text-gray-900 mb-2">Enterprise-grade infrastructure</h4>
                <ul className="space-y-2">
                  {["Multi-region data centers with automatic failover", "Role-based access with granular permission controls", "End-to-end encryption at rest and in transit", "Dedicated customer success manager for every account", "24/7 priority support with guaranteed SLA response"].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-gray-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0067B8] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
            <div className="space-y-4">
              {benefits.map((b, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="flex gap-4 bg-blue-50/50 border border-blue-100 rounded-xl p-5 hover:shadow-md transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#0067B8] text-white flex items-center justify-center font-bold text-lg shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{b.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{b.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== 6. INTEGRATION ECOSYSTEM ===== */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Connects with your enterprise stack</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Seamlessly integrate with the tools your teams already depend on. CubicleERP supports hundreds of enterprise connectors out of the box.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {integrations.map((intg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-lg bg-[#0067B8]/10 flex items-center justify-center mx-auto mb-3">
                  <Plug className="w-5 h-5 text-[#0067B8]" />
                </div>
                <div className="font-semibold text-gray-900 text-sm mb-1">{intg.name}</div>
                <span className="inline-block px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs">
                  {intg.category}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 7. HOW IT WORKS ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How it works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              A proven implementation methodology that gets your enterprise live in weeks, not years.
            </p>
          </motion.div>
          <div className="relative grid md:grid-cols-3 gap-8">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-12 left-[16.67%] right-[16.67%] h-1 bg-gradient-to-r from-[#0067B8] via-[#0067B8]/60 to-[#0067B8] rounded-full" />
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative text-center"
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#0067B8] to-[#004e8c] flex items-center justify-center mx-auto mb-6 relative z-10 shadow-lg">
                  <span className="text-3xl font-bold text-white">{s.step}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{s.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed max-w-sm mx-auto">{s.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 8. USE CASES ===== */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Built for your industry</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              CubicleERP Enterprise adapts to the unique demands of your business, no matter how complex.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {useCases.map((uc, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-blue-50/60 border border-blue-100 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-3">{uc.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-5">{uc.description}</p>
                <ul className="space-y-2.5">
                  {uc.highlights.map((h, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#0067B8] mt-0.5 shrink-0" />
                      <span className="text-gray-700 text-sm">{h}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 9. COMPARISON TABLE ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">The CubicleERP advantage</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              See how CubicleERP compares to traditional enterprise software across the dimensions that matter most.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-xl border border-gray-200 overflow-hidden"
          >
            <table className="w-full">
              <thead>
                <tr className="bg-[#0067B8] text-white">
                  <th className="text-left px-6 py-4 font-semibold">Feature</th>
                  <th className="text-center px-6 py-4 font-semibold">Traditional ERP</th>
                  <th className="text-center px-6 py-4 font-semibold">CubicleERP</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((c, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="px-6 py-4 font-medium text-gray-900">{c.feature}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <X className="w-4 h-4 text-red-400" />
                        <span className="text-gray-500 text-sm">{c.traditional}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-gray-900 font-medium text-sm">{c.cubicleErp}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* ===== 10. TESTIMONIALS ===== */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What enterprise leaders say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Hear from the executives and directors who transformed their organizations with CubicleERP.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col"
              >
                <Quote className="w-8 h-8 text-[#0067B8]/30 mb-3" />
                <p className="text-gray-700 leading-relaxed mb-5 flex-1">&ldquo;{t.quote}&rdquo;</p>
                <div className="inline-block px-3 py-1 bg-[#0067B8]/10 text-[#0067B8] rounded-full text-sm font-semibold mb-4 w-fit">
                  {t.metric}
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-[#0067B8] text-white flex items-center justify-center font-bold text-sm">
                    {t.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{t.author}</div>
                    <div className="text-gray-500 text-xs">
                      {t.role}, {t.company}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 11. FAQ ACCORDION ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently asked questions</h2>
            <p className="text-gray-600 text-lg">
              Get answers to common questions about CubicleERP Enterprise deployment, security, and pricing.
            </p>
          </motion.div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FAQItem key={i} faq={faq} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== 12. CTA SECTION ===== */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80"
            alt="Enterprise CTA background"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gray-900/85" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to transform your enterprise?
            </h2>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Join 500+ enterprises that have unified their operations, reduced costs, and accelerated growth with CubicleERP. Our enterprise team is ready to build a tailored solution for your organization.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="px-8 py-3.5 bg-[#0067B8] hover:bg-[#005a9e] text-white font-semibold rounded-lg transition-colors inline-flex items-center gap-2"
              >
                Schedule a Consultation <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/pricing"
                className="px-8 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-lg transition-colors"
              >
                See Enterprise Pricing
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== 13. LP2CTA + LP2Footer ===== */}
      <LP2CTA />
      <LP2Footer />
    </main>
  )
}
