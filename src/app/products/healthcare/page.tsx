"use client"

import LP2Navbar from "@/components/landingpage2/LP2Navbar"
import LP2Footer from "@/components/landingpage2/LP2Footer"
import LP2CTA from "@/components/landingpage2/LP2CTA"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import {
  Heart,
  Shield,
  Users,
  Lock,
  BarChart3,
  Workflow,
  Stethoscope,
  CalendarCheck,
  FileHeart,
  ClipboardCheck,
  Video,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  ScrollText,
  Eye,
  UserPlus,
  ClipboardList,
  Pill,
  CreditCard,
  PhoneCall,
  Plus,
  Zap,
  Globe,
} from "lucide-react"

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
}

const features = [
  {
    icon: Shield,
    title: "HIPAA Compliance & Regulatory Readiness",
    description:
      "Every module is engineered with HIPAA requirements at its core — automatic audit trails, granular role-based access controls, and end-to-end encryption. Generate compliance reports on demand for OCR audits, state reviews, and internal governance without scrambling.",
  },
  {
    icon: Users,
    title: "Patient Management & Scheduling",
    description:
      "Manage the entire patient lifecycle from registration through discharge. Intelligent scheduling with automated reminders reduces no-shows by up to 35%, while integrated telemedicine expands access to care for remote patients.",
  },
  {
    icon: Stethoscope,
    title: "Medical Billing & Revenue Cycle",
    description:
      "Streamline your entire revenue cycle — charge capture, eligibility verification, claim submission, denial management, and collections on a single platform. Automated ICD-10, CPT, and HCPCS validation reduces denials.",
  },
  {
    icon: Workflow,
    title: "Clinical Workflow Automation",
    description:
      "Design custom clinical workflows for intake, triage, referral management, lab ordering, prescription routing, and discharge planning. Automated task assignment ensures no clinical action falls through the cracks.",
  },
  {
    icon: Lock,
    title: "Secure Data & EHR Integration",
    description:
      "Connect seamlessly with Epic, Cerner, Athenahealth, and AllScripts through native HL7 FHIR interfaces. AES-256 encryption at rest, TLS 1.3 in transit, MFA, and SOC 2 Type II compliance protect every touchpoint.",
  },
  {
    icon: Video,
    title: "Telemedicine & Patient Portal",
    description:
      "Offer patients a secure digital front door — view records, schedule appointments, request refills, and communicate with care teams. Built-in HIPAA-compliant video conferencing with virtual waiting rooms.",
  },
]

const benefits = [
  {
    title: "Ensure Patient Safety & Quality of Care",
    description:
      "Integrated clinical decision support, automated drug interaction checks, and complete patient history at the point of care reduce medical errors and improve outcomes.",
  },
  {
    title: "Achieve Effortless HIPAA Compliance",
    description:
      "Built-in compliance controls eliminate manual tracking. Automatic audit trails, encryption, and breach notification workflows keep you compliant without added burden.",
  },
  {
    title: "Accelerate Revenue Cycle Performance",
    description:
      "Reduce claim denial rates by up to 40% and shorten days in A/R with automated eligibility verification, coding validation, and proactive denial management.",
  },
  {
    title: "Elevate the Patient Experience",
    description:
      "Empower patients with self-service scheduling, secure messaging, online bill pay, and access to their health records through a modern portal.",
  },
  {
    title: "Unify Clinical & Administrative Operations",
    description:
      "A single platform for clinical documentation, scheduling, billing, inventory, HR, and compliance eliminates data silos across departments.",
  },
  {
    title: "Scale Across Multi-Location Networks",
    description:
      "Manage multiple clinics, hospitals, and specialty practices from one platform. Unified patient records follow patients across your network.",
  },
]

const stats = [
  { value: "200+", label: "Healthcare organizations served" },
  { value: "100%", label: "HIPAA compliance guarantee" },
  { value: "25%", label: "Average revenue cycle improvement" },
  { value: "99.99%", label: "Platform uptime SLA" },
]

const capabilities = [
  {
    title: "Population Health & Care Coordination",
    description:
      "Move beyond individual patient management to population-level health analytics. Identify high-risk cohorts, coordinate care across providers, and track quality measures driving value-based reimbursement.",
    keyPoints: [
      "Risk stratification algorithms flagging patients requiring proactive intervention",
      "Care gap identification with automated outreach for preventive screenings",
      "Referral network analytics showing patient flow patterns",
      "Quality measure dashboards aligned with HEDIS, MIPS, and value-based programs",
    ],
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
  },
  {
    title: "Clinical Decision Support & Safety",
    description:
      "Embed evidence-based clinical decision support directly into care workflows. Real-time alerts for drug interactions, allergy contraindications, and duplicate order detection.",
    keyPoints: [
      "Drug-drug and drug-allergy interaction checking in prescribing workflows",
      "Clinical protocol adherence monitoring with deviation alerts",
      "Duplicate order detection preventing unnecessary tests",
      "Evidence-based order sets customizable by specialty and condition",
    ],
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80",
  },
  {
    title: "Revenue Integrity & Denial Prevention",
    description:
      "Shift from reactive denial management to proactive revenue integrity. AI-powered charge capture validation and pre-submission claim scrubbing catch errors before claims leave your facility.",
    keyPoints: [
      "Pre-submission claim scrubbing against payer-specific rules",
      "Charge capture validation ensuring all services are billed",
      "Denial trend analytics identifying root causes",
      "Automated appeal generation with supporting documentation",
    ],
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&q=80",
  },
  {
    title: "Healthcare Supply Chain & Inventory",
    description:
      "Manage medical supplies, pharmaceuticals, and equipment with real-time inventory tracking, automated reorder triggers, and lot-level traceability for regulatory compliance.",
    keyPoints: [
      "Par-level inventory management with automated purchase orders",
      "Lot and serial number tracking for pharmaceutical traceability",
      "Expiration date monitoring with proactive alerts and FIFO enforcement",
      "Vendor performance analytics comparing cost and delivery reliability",
    ],
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&q=80",
  },
]

const integrations = [
  { name: "Epic", category: "EHR" },
  { name: "Cerner", category: "EHR" },
  { name: "Athenahealth", category: "EHR" },
  { name: "AllScripts", category: "EHR" },
  { name: "Surescripts", category: "e-Prescribing" },
  { name: "Availity", category: "Payer Connectivity" },
  { name: "Zoom for Healthcare", category: "Telehealth" },
  { name: "Microsoft Teams", category: "Communication" },
  { name: "DocuSign", category: "e-Signatures" },
  { name: "QuickBooks", category: "Accounting" },
  { name: "Workday", category: "HR" },
  { name: "McKesson", category: "Supply Chain" },
]

const testimonials = [
  {
    quote:
      "Our claim denial rate dropped from 12% to under 4% within three months of implementing CubicleERP. The pre-submission scrubbing catches coding errors that our previous system missed entirely. That translates to over $2M in recovered annual revenue.",
    author: "Dr. Patricia Nguyen",
    role: "Chief Medical Officer",
    company: "Lakewood Regional Health Network",
    metric: "Denial rate reduced from 12% to 4%",
  },
  {
    quote:
      "Coordinating care across our 14 clinic locations used to mean endless phone calls and faxes. Now every provider sees the same patient record in real time. Duplicate testing is down 30%, and our patients finally feel like their care team is truly connected.",
    author: "Robert Caldwell",
    role: "VP of Clinical Operations",
    company: "Pinnacle Medical Group",
    metric: "30% reduction in duplicate testing",
  },
  {
    quote:
      "HIPAA compliance used to keep our IT team up at night. CubicleERP's built-in audit trails, encryption, and access controls gave us confidence we had not experienced with any previous system. Our last OCR audit was the smoothest we have ever had.",
    author: "Linda Foster",
    role: "Chief Compliance Officer",
    company: "Summit Healthcare Partners",
    metric: "Zero HIPAA findings in latest audit",
  },
]

const comparisons = [
  { feature: "HIPAA compliance", traditional: "Bolt-on tools required", cubicleErp: "Built-in by design" },
  { feature: "EHR integration", traditional: "Custom development", cubicleErp: "Native HL7 FHIR" },
  { feature: "Patient portal", traditional: "Separate vendor", cubicleErp: "Included with platform" },
  { feature: "Claim denial management", traditional: "Reactive manual review", cubicleErp: "Proactive AI scrubbing" },
  { feature: "Multi-location support", traditional: "Fragmented systems", cubicleErp: "Unified patient record" },
  { feature: "Telemedicine", traditional: "Third-party add-on", cubicleErp: "Integrated natively" },
]

const faqs = [
  {
    question: "Is CubicleERP Healthcare truly HIPAA compliant?",
    answer:
      "Yes. CubicleERP Healthcare is architected from the ground up with HIPAA compliance embedded into every layer. We implement AES-256 encryption at rest, TLS 1.3 in transit, role-based access controls, automatic audit trails for all PHI access, MFA, and automatic session management. We provide Business Associate Agreements (BAAs) and support your administrative and physical safeguard requirements with policy templates and compliance documentation.",
  },
  {
    question: "Can CubicleERP integrate with our existing EHR system?",
    answer:
      "Absolutely. CubicleERP provides native HL7 FHIR R4 and HL7v2 interfaces for connecting with Epic, Cerner, Athenahealth, AllScripts, eClinicalWorks, and NextGen. We support bidirectional data exchange for patient demographics, clinical documents, lab results, medication lists, and scheduling. Our REST API and webhook framework enable custom integrations for non-standard systems.",
  },
  {
    question: "How does CubicleERP handle patient data security?",
    answer:
      "Patient data security is our highest priority. All PHI is encrypted at rest (AES-256) and in transit (TLS 1.3). We enforce granular role-based access, maintain immutable audit logs of every PHI access event, support MFA and SSO via SAML/OAuth, and implement automatic session timeouts. Infrastructure is hosted in HIPAA-compliant, SOC 2 Type II certified data centers with geographic redundancy.",
  },
  {
    question: "Can patients access their own health records?",
    answer:
      "Yes. CubicleERP includes a secure, mobile-responsive patient portal with 24/7 access to medical records, lab results, visit summaries, medication lists, and billing statements. Patients can schedule appointments, request refills, complete intake forms, make payments, and message their care team via encrypted messaging. The portal supports ONC Cures Act requirements for data access.",
  },
  {
    question: "How does CubicleERP support multi-location networks?",
    answer:
      "CubicleERP maintains a unified longitudinal patient record accessible across all locations. Each location maintains its own scheduling templates, provider configurations, and workflow customizations while sharing a common patient database. Centralized reporting provides network-wide visibility with drill-down to individual locations.",
  },
]

const steps = [
  {
    step: "1",
    title: "Healthcare Assessment & Planning",
    description:
      "Our healthcare specialists assess your clinical workflows, billing processes, compliance posture, and technology infrastructure. We map current state, identify optimizations, and create a tailored implementation roadmap.",
    icon: ClipboardCheck,
  },
  {
    step: "2",
    title: "Configuration, Integration & Training",
    description:
      "We configure CubicleERP to match your workflows, integrate with existing EHR systems via HL7 FHIR, securely migrate data, and set up HIPAA-compliant channels. Role-specific hands-on training ensures confident adoption.",
    icon: Workflow,
  },
  {
    step: "3",
    title: "Compliance Verification & Go-Live",
    description:
      "Thorough HIPAA compliance testing, security control verification, and penetration testing before go-live. Phased rollout with parallel running ensures zero disruption to patient care. 24/7 support during transition.",
    icon: ShieldCheck,
  },
]

const useCases = [
  {
    title: "Hospital Networks & Health Systems",
    description:
      "Large hospital systems use CubicleERP to standardize clinical workflows, billing, supply chain, and compliance across multiple facilities while preserving local clinical autonomy.",
    highlights: [
      "Unified patient records across all locations and departments",
      "Centralized revenue cycle with facility-level financial tracking",
      "Standardized protocols with specialty-specific customization",
    ],
  },
  {
    title: "Medical Practices & Outpatient Clinics",
    description:
      "Independent practices and outpatient networks use CubicleERP to manage care, scheduling, billing, and compliance without enterprise EHR complexity.",
    highlights: [
      "Intuitive scheduling with automated reminders and waitlist management",
      "Integrated billing with insurance eligibility and claim tracking",
      "Full HIPAA compliance without dedicated IT staff",
    ],
  },
  {
    title: "Specialty & Allied Healthcare Providers",
    description:
      "Specialty practices in cardiology, orthopedics, oncology, behavioral health use CubicleERP with specialty-specific workflow templates and referral coordination.",
    highlights: [
      "Specialty-specific clinical workflows and documentation templates",
      "Integrated referral management with automated tracking",
      "Specialty-focused analytics with industry benchmarking",
    ],
  },
]

const patientJourney = [
  { label: "Registration", icon: UserPlus, desc: "Digital intake forms, insurance verification, consent management" },
  { label: "Intake", icon: ClipboardList, desc: "Triage assessment, medical history review, vitals capture" },
  { label: "Treatment", icon: Stethoscope, desc: "Clinical decision support, e-prescribing, order management" },
  { label: "Billing", icon: CreditCard, desc: "Automated coding, claim submission, payment processing" },
  { label: "Follow-up", icon: PhoneCall, desc: "Care plan tracking, patient outreach, outcome monitoring" },
]

const securityCards = [
  {
    icon: ShieldCheck,
    title: "HIPAA Compliance",
    description: "Full technical, administrative, and physical safeguard implementation with BAA support and continuous compliance monitoring.",
  },
  {
    icon: KeyRound,
    title: "Data Encryption",
    description: "AES-256 encryption at rest and TLS 1.3 in transit. All protected health information is encrypted across every layer of the platform.",
  },
  {
    icon: Eye,
    title: "Access Controls",
    description: "Granular role-based access, multi-factor authentication, SSO via SAML/OAuth, automatic session timeouts, and IP whitelisting.",
  },
  {
    icon: ScrollText,
    title: "Audit Trails",
    description: "Immutable, tamper-proof audit logs of every PHI access event. On-demand compliance reports for OCR audits and internal reviews.",
  },
]

export default function HealthcarePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <main className="bg-white">
      <LP2Navbar />

      {/* ===== 1. HERO ===== */}
      <section className="relative pt-16 pb-12 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920&q=80"
            alt="Healthcare background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gray-900/80" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
              <span className="inline-flex items-center gap-2 bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                <Shield className="w-4 h-4" /> HIPAA-Ready Platform
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4">
                Healthcare management{" "}
                <span className="text-emerald-400">built on trust</span>
              </h1>
              <p className="text-lg text-gray-300 mb-8 max-w-lg">
                A comprehensive, purpose-built platform for hospitals, clinics, and healthcare networks. HIPAA-compliant by design, with end-to-end patient lifecycle management, integrated billing, and clinical workflow automation.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Request a Demo <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-600/10 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  View Compliance Docs
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={2}
              className="hidden lg:flex flex-col gap-4"
            >
              {[
                { label: "HIPAA Compliant", sub: "Full technical safeguards" },
                { label: "SOC 2 Type II", sub: "Certified data centers" },
                { label: "End-to-End Encrypted", sub: "AES-256 + TLS 1.3" },
              ].map((badge, i) => (
                <motion.div
                  key={badge.label}
                  variants={fadeUp}
                  custom={i + 2}
                  className="flex items-center gap-4 bg-white/5 backdrop-blur-sm border border-emerald-500/20 rounded-xl p-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-emerald-600/20 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">{badge.label}</p>
                    <p className="text-gray-400 text-sm">{badge.sub}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== 2. TRUST INDICATORS BAR ===== */}
      <section className="bg-emerald-50 border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap items-center justify-between gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className="text-2xl font-bold text-emerald-700">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
            <div className="flex items-center gap-2 bg-emerald-100 border border-emerald-200 rounded-full px-4 py-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span className="text-sm font-medium text-emerald-800">HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2 bg-emerald-100 border border-emerald-200 rounded-full px-4 py-2">
              <Zap className="w-4 h-4 text-emerald-700" />
              <span className="text-sm font-medium text-emerald-800">99.99% Uptime</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 3. FEATURE GRID - MEDICAL CARDS ===== */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-14"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Purpose-built for healthcare</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Every feature is designed with clinical workflows, patient safety, and regulatory compliance in mind.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:border-emerald-300 transition-colors group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded bg-emerald-50 flex items-center justify-center">
                    <Plus className="w-4 h-4 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">{f.title}</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 4. COMPLIANCE & SECURITY (DARK) ===== */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-14"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Enterprise-grade security for patient data
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Security is not an add-on. It is the foundation of everything we build. Your patients trust you with their data — we make sure that trust is never compromised.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {securityCards.map((card, i) => {
              const Icon = card.icon
              return (
                <motion.div
                  key={card.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i}
                  className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-emerald-500/40 transition-colors"
                >
                  <div className="w-12 h-12 rounded-lg bg-emerald-600/15 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">{card.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{card.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===== 5. CAPABILITIES WITH IMAGES ===== */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-14"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Advanced capabilities</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Go beyond basic healthcare management with capabilities designed for modern, data-driven care delivery.
            </p>
          </motion.div>
          <div className="space-y-20">
            {capabilities.map((cap, i) => (
              <motion.div
                key={cap.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={0}
                className={`grid lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? "lg:direction-rtl" : ""}`}
              >
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="relative h-72 sm:h-80 rounded-xl overflow-hidden">
                    <Image src={cap.image} alt={cap.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-emerald-900/10" />
                  </div>
                </div>
                <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{cap.title}</h3>
                  <p className="text-gray-600 mb-5">{cap.description}</p>
                  <ul className="space-y-3">
                    {cap.keyPoints.map((point) => (
                      <li key={point} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 6. BENEFITS ===== */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
              className="lg:col-span-2"
            >
              <h2 className="text-3xl font-bold text-gray-900 leading-tight">
                Why healthcare providers{" "}
                <span className="text-emerald-600">trust CubicleERP</span>
              </h2>
              <p className="text-gray-600 mt-4 mb-6">
                Built by healthcare technologists who understand the unique challenges of clinical operations, regulatory compliance, and patient engagement.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-emerald-50 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-emerald-700">98%</div>
                  <div className="text-[10px] text-gray-600 mt-0.5">HIPAA audit pass rate</div>
                </div>
                <div className="bg-emerald-50 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-emerald-700">40%</div>
                  <div className="text-[10px] text-gray-600 mt-0.5">Fewer claim denials</div>
                </div>
                <div className="bg-emerald-50 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-emerald-700">3x</div>
                  <div className="text-[10px] text-gray-600 mt-0.5">Faster patient intake</div>
                </div>
                <div className="bg-emerald-50 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-emerald-700">24/7</div>
                  <div className="text-[10px] text-gray-600 mt-0.5">Priority support</div>
                </div>
              </div>

              <div className="bg-white border border-emerald-100 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-emerald-600 text-lg leading-none">&ldquo;</span>
                  <p className="text-gray-600 text-xs italic leading-relaxed">CubicleERP helped us achieve HIPAA compliance in weeks, not months. Our patient satisfaction scores improved by 35% within the first quarter.</p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">DR</div>
                  <div>
                    <div className="text-[11px] font-semibold text-gray-900">Dr. Rachel Kim</div>
                    <div className="text-[10px] text-gray-500">CMO, Valley Health Network</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-5">
                {["HIPAA Compliant", "SOC 2", "HL7 FHIR", "End-to-End Encrypted", "BAA Included"].map((badge) => (
                  <span key={badge} className="text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-full">{badge}</span>
                ))}
              </div>

              <Link href="/auth/signup" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors">
                Start your free trial <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
            <div className="lg:col-span-3 grid sm:grid-cols-2 gap-5">
              {benefits.map((b, i) => (
                <motion.div
                  key={b.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i}
                  className="bg-white rounded-lg p-5 border border-gray-200"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm mb-1">{b.title}</h3>
                      <p className="text-xs text-gray-600 leading-relaxed">{b.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== 7. PATIENT JOURNEY FLOW ===== */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-14"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">The complete patient lifecycle</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From first contact to ongoing follow-up, CubicleERP manages every step of the patient journey on one platform.
            </p>
          </motion.div>
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            {patientJourney.map((node, i) => {
              const Icon = node.icon
              return (
                <div key={node.label} className="flex items-center gap-4 flex-1">
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    custom={i}
                    className="flex flex-col items-center text-center min-w-[140px]"
                  >
                    <div className="w-14 h-14 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center mb-3">
                      <Icon className="w-6 h-6 text-emerald-700" />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">{node.label}</h3>
                    <p className="text-xs text-gray-500 max-w-[160px]">{node.desc}</p>
                  </motion.div>
                  {i < patientJourney.length - 1 && (
                    <ChevronRight className="w-5 h-5 text-emerald-400 hidden lg:block flex-shrink-0" />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===== 8. INTEGRATIONS ===== */}
      <section className="py-20 bg-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-14"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Integrates with your existing medical infrastructure
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Native HL7 FHIR and HL7v2 interfaces connect CubicleERP with the systems you already rely on.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {integrations.map((intg, i) => (
              <motion.div
                key={intg.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="bg-white rounded-lg border border-emerald-100 p-4 text-center hover:border-emerald-300 transition-colors"
              >
                <Globe className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                <p className="font-medium text-gray-900 text-sm">{intg.name}</p>
                <p className="text-xs text-gray-500">{intg.category}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 9. HOW IT WORKS ===== */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-14"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How it works</h2>
            <p className="text-gray-600">A proven implementation process designed for healthcare organizations.</p>
          </motion.div>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-emerald-200" />
            <div className="space-y-10">
              {steps.map((s, i) => {
                const Icon = s.icon
                return (
                  <motion.div
                    key={s.step}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    custom={i}
                    className="relative pl-16"
                  >
                    <div className="absolute left-0 w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center z-10">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{s.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{s.description}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ===== 10. USE CASES ===== */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-14"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Built for every healthcare setting</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {useCases.map((uc, i) => (
              <motion.div
                key={uc.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="bg-white rounded-xl border-l-4 border-emerald-500 p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{uc.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{uc.description}</p>
                <ul className="space-y-2">
                  {uc.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2 text-xs text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      {h}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 11. COMPARISON TABLE ===== */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-14"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">CubicleERP vs. traditional solutions</h2>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="overflow-x-auto"
          >
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-emerald-600 text-white">
                  <th className="text-left py-3 px-4 rounded-tl-lg font-semibold">Feature</th>
                  <th className="text-left py-3 px-4 font-semibold">Traditional</th>
                  <th className="text-left py-3 px-4 rounded-tr-lg font-semibold">CubicleERP</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((c, i) => (
                  <tr key={c.feature} className={i % 2 === 0 ? "bg-emerald-50/50" : "bg-white"}>
                    <td className="py-3 px-4 font-medium text-gray-900">{c.feature}</td>
                    <td className="py-3 px-4 text-gray-500">{c.traditional}</td>
                    <td className="py-3 px-4 text-emerald-700 font-medium">{c.cubicleErp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* ===== 12. TESTIMONIALS ===== */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-14"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by healthcare leaders</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.author}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="bg-white rounded-xl p-6 border border-gray-200"
              >
                <div className="inline-block bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                  {t.metric}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-5 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t.author}</p>
                  <p className="text-xs text-gray-500">{t.role}, {t.company}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 13. FAQ ===== */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-14"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently asked questions</h2>
          </motion.div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900 text-sm pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-emerald-600 flex-shrink-0 transition-transform ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4">
                    <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 14. CTA ===== */}
      <section className="py-20 bg-gradient-to-br from-emerald-700 via-emerald-600 to-emerald-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <ShieldCheck className="w-12 h-12 text-emerald-200 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to modernize your healthcare operations?
            </h2>
            <p className="text-emerald-100 mb-8 max-w-2xl mx-auto">
              Join 200+ healthcare organizations that trust CubicleERP for HIPAA-compliant patient management, billing, and clinical workflows.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-white text-emerald-700 hover:bg-emerald-50 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Schedule a Demo <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 border border-white/30 text-white hover:bg-white/10 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Talk to Sales
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== 15. LP2CTA + LP2Footer ===== */}
      <LP2CTA />
      <LP2Footer />
    </main>
  )
}
