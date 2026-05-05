"use client"

import LP2Navbar from "@/components/landingpage2/LP2Navbar"
import LP2Footer from "@/components/landingpage2/LP2Footer"
import LP2CTA from "@/components/landingpage2/LP2CTA"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import {
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  GraduationCap,
  BookOpen,
  Users,
  Calendar,
  DollarSign,
  ClipboardCheck,
  Monitor,
  Building2,
  School,
  Globe,
  FlaskConical,
  TrendingUp,
  Shield,
  BarChart3,
  Award,
  UserCheck,
  Heart,
  Target,
  Layers,
  Send,
} from "lucide-react"

const features = [
  {
    icon: BookOpen,
    title: "Student Information System",
    description:
      "Maintain a centralized, secure repository of every student's academic journey — from enrollment to alumni status. Track personal details, academic history, attendance records, health information, disciplinary actions, and extracurricular achievements in one unified profile.",
  },
  {
    icon: Users,
    title: "Admissions & Enrollment Management",
    description:
      "Digitize your entire admissions pipeline from initial inquiry and online application to document verification, merit-list generation, and enrollment confirmation. Manage multiple intake cycles with full audit trails.",
  },
  {
    icon: DollarSign,
    title: "Fee Collection & Financial Management",
    description:
      "Handle complex, multi-component fee structures covering tuition, laboratory charges, transportation, hostel fees, and custom components. Configure installment plans, discounts, scholarships, and late-payment penalties.",
  },
  {
    icon: Calendar,
    title: "Timetable & Academic Scheduling",
    description:
      "Generate conflict-free timetables automatically by factoring in teacher availability, room capacity, lab equipment requirements, and inter-section dependencies. Support elective courses and multi-campus scheduling.",
  },
  {
    icon: ClipboardCheck,
    title: "Examination & Grade Management",
    description:
      "Orchestrate the full examination lifecycle — from schedule creation and hall-ticket generation to seating arrangement, invigilation assignment, grade entry, and result processing with diverse grading systems.",
  },
  {
    icon: Monitor,
    title: "Parent Portal & Communication Hub",
    description:
      "Provide parents with a dedicated portal offering real-time visibility into attendance, grades, fee status, homework assignments, and announcements. Two-way messaging fosters engagement without overhead.",
  },
]

const benefits = [
  {
    title: "Reduce Administrative Workload by 60%",
    description:
      "Automate repetitive tasks like attendance recording, fee reminders, report card generation, certificate issuance, and circular distribution. Free your office staff from manual data entry.",
  },
  {
    title: "Boost Fee Collection Rates by 35%",
    description:
      "Automated payment reminders, flexible installment plans, and convenient online payment options dramatically reduce fee defaults with real-time defaulter tracking.",
  },
  {
    title: "Strengthen Parent & Student Engagement",
    description:
      "Dedicated self-service portals give parents and students instant access to attendance, grades, assignments, and announcements. Transparent communication builds trust.",
  },
  {
    title: "Make Data-Driven Academic Decisions",
    description:
      "Analyze student performance trends, teacher effectiveness, admission conversion rates, and financial health through real-time dashboards.",
  },
  {
    title: "Simplify Compliance & Accreditation",
    description:
      "Keep all records organized and audit-ready for educational board compliance, accreditation reviews, and government inspections.",
  },
  {
    title: "Scale Seamlessly Across Campuses",
    description:
      "Manage multiple branches, campuses, or franchise locations from a single unified platform with standardized core processes.",
  },
]

const stats = [
  { value: "60%", label: "Reduction in admin workload" }, { value: "35%", label: "Improvement in fee collection" },
  { value: "500+", label: "Institutions onboarded" }, { value: "98%", label: "Parent satisfaction rate" },
]

const capabilities = [
  {
    title: "Learning Outcomes & Academic Analytics",
    description:
      "Go beyond basic grade tracking with deep academic analytics that identify learning gaps, measure curriculum effectiveness, and predict at-risk students before they fall behind.",
    keyPoints: [
      "Student performance trend analysis across subjects, terms, and academic years",
      "At-risk student identification using attendance, grades, and behavioral pattern modeling",
      "Curriculum effectiveness reports comparing learning outcomes across sections and teachers",
      "Accreditation-ready analytics dashboards with exportable institutional performance data",
    ],
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
    stat: { value: "3x", label: "faster insight generation" },
  },
  {
    title: "Campus Resource & Infrastructure Management",
    description:
      "Optimize the utilization of classrooms, laboratories, libraries, hostels, and transport fleets with intelligent scheduling and real-time occupancy tracking.",
    keyPoints: [
      "Smart room allocation engine that maximizes classroom and lab utilization rates",
      "Transport fleet management with route optimization and GPS tracking for school buses",
      "Hostel room assignment with occupancy dashboards and maintenance request workflows",
      "Library management with catalog search, issue/return tracking, and overdue automation",
    ],
    image: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
    stat: { value: "40%", label: "better resource utilization" },
  },
  {
    title: "Staff Performance & Professional Development",
    description:
      "Manage the complete faculty lifecycle from recruitment and onboarding through performance evaluation, professional development tracking, and workload balancing.",
    keyPoints: [
      "Teacher workload visualization with period allocation and non-teaching duties tracking",
      "360-degree performance evaluation with peer, student, and management feedback",
      "Professional development tracking with certification renewal reminders and CPD logging",
      "Substitute teacher management with automated notification and schedule adjustment",
    ],
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80",
    stat: { value: "92%", label: "faculty satisfaction" },
  },
  {
    title: "Alumni Network & Fundraising",
    description:
      "Maintain lifelong connections with graduates through a structured alumni management system. Track careers, organize reunions, manage donations, and leverage alumni networks.",
    keyPoints: [
      "Alumni directory with career tracking and contact information management",
      "Donation and fundraising campaign management with pledge tracking and receipts",
      "Alumni event management with invitation workflows and attendance tracking",
      "Mentor matching connecting current students with alumni in relevant career fields",
    ],
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c476?w=800&q=80",
    stat: { value: "2.5x", label: "alumni engagement increase" },
  },
]

const integrations = [
  { name: "Google Classroom", category: "Learning Management" }, { name: "Microsoft Teams", category: "Communication" },
  { name: "Zoom", category: "Virtual Classrooms" }, { name: "Moodle", category: "LMS" },
  { name: "Razorpay", category: "Payment Gateway" }, { name: "Stripe", category: "Payment Gateway" },
  { name: "Tally", category: "Accounting" }, { name: "WhatsApp Business", category: "Parent Communication" },
  { name: "Google Workspace", category: "Productivity" }, { name: "Turnitin", category: "Academic Integrity" },
  { name: "Canvas LMS", category: "Learning Management" }, { name: "Slack", category: "Team Communication" },
].flat()

const steps = [
  { step: "1", title: "Configure Your Institution", description: "Set up your academic structure — departments, programs, sections, and subjects. Define fee schedules, grading policies, and the academic calendar. Import existing data with guided migration support." },
  { step: "2", title: "Digitize Campus Operations", description: "Move admissions, attendance tracking, fee collection, timetable management, and examinations online. Train your team with role-specific walkthroughs and activate parent and student portals." },
  { step: "3", title: "Analyze, Improve & Grow", description: "Leverage real-time dashboards to monitor enrollment trends, fee recovery rates, academic performance, and operational efficiency. Use data insights to continuously refine processes." },
]

const useCases = [
  {
    title: "K-12 Schools",
    description:
      "Primary and secondary schools use CubicleERP to manage student admissions, daily attendance, parent communication, fee collection, and report card generation across multiple grades and sections.",
    highlights: [
      "Automated daily attendance with instant parent SMS notifications",
      "Fee management with sibling discounts, transport add-ons, and installment tracking",
      "Continuous assessment-based report cards with teacher remarks and skill indicators",
    ],
  },
  {
    title: "Colleges & Universities",
    description:
      "Higher education institutions rely on CubicleERP to handle complex academic structures with multiple departments, credit-based courses, elective selections, and research programs.",
    highlights: [
      "Credit-based course registration with GPA calculation and transcript generation",
      "Faculty workload allocation, research tracking, and performance evaluation",
      "Multi-campus governance with centralized analytics and decentralized operations",
    ],
  },
  {
    title: "Coaching & Training Institutes",
    description:
      "Competitive exam coaching centers and professional training institutes use CubicleERP to manage batch scheduling, rolling enrollments, practice test series, and fee collection.",
    highlights: [
      "Flexible batch-based scheduling with overlapping enrollment cycles",
      "Test series management with automated scoring and comparative result analysis",
      "Course-wise fee tracking with partial payments and refund processing",
    ],
  },
]

const comparisons = [
  { feature: "Student information system", traditional: "Paper records or basic DB", cubicleErp: "Unified digital profiles" }, { feature: "Fee collection", traditional: "Manual follow-up", cubicleErp: "Automated with online pay" },
  { feature: "Parent communication", traditional: "Circulars and phone calls", cubicleErp: "Real-time portal access" }, { feature: "Timetable generation", traditional: "Hours of manual work", cubicleErp: "Auto-generated conflict-free" },
  { feature: "Exam management", traditional: "Spreadsheet-based grading", cubicleErp: "End-to-end automated" }, { feature: "Multi-campus management", traditional: "Separate systems per campus", cubicleErp: "Centralized with local flex" },
].flat()

const faqs = [
  { question: "Can CubicleERP handle multiple academic boards and grading systems?",
    answer: "Absolutely. CubicleERP supports CBSE, ICSE, State Boards, IB, Cambridge, and fully custom grading systems. You can configure different grading scales — GPA, percentage, letter grades, or descriptive indicators — along with distinct assessment components and promotion criteria for each program or board within the same institution." },
  { question: "How does fee management handle complex and multi-component fee structures?",
    answer: "CubicleERP lets you build fee structures with unlimited components including tuition, lab fees, library charges, transport, hostel, and any custom heads you need. Each component can have its own due dates, installment schedules, and payment rules. You can layer on early-payment discounts, sibling concessions, merit scholarships, and late-payment penalties." },
  { question: "Is there a parent and student portal accessible on mobile devices?",
    answer: "Yes. CubicleERP provides a fully responsive web portal that works flawlessly on smartphones, tablets, and desktops. Parents and students can view attendance, grades, fee status, homework assignments, and school announcements from any device. Premium plans include a dedicated mobile app with push notifications." },
  { question: "Can we migrate data from our existing school management system?",
    answer: "Yes, we provide full migration support. Our education onboarding team helps you transfer student records, fee history, academic data, staff information, and historical results from spreadsheets or popular school ERP platforms with validation checks to ensure data integrity." },
  { question: "Does CubicleERP support online examinations and automated result processing?",
    answer: "CubicleERP handles the complete exam management workflow — schedule creation, hall-ticket generation, seating arrangement, grade entry, moderation, and result publication. For online test delivery with proctoring, we integrate with leading assessment platforms with results flowing back automatically." },
]

const testimonials = [
  { quote: "Our fee collection rate improved from 72% to 96% within the first semester. The automated SMS reminders and online payment portal made it incredibly convenient for parents.",
    author: "Dr. Anand Mehta", role: "Principal", company: "Greenfield International School", metric: "72% to 96% fee collection" },
  { quote: "Managing admissions across three campuses used to be chaotic. CubicleERP gave us a centralized pipeline with real-time visibility into every application. We processed 40% more applications this year.",
    author: "Fatima Al-Rashid", role: "Director of Admissions", company: "Horizon Academy Group", metric: "40% more applications processed" },
  { quote: "The parent portal transformed our relationship with families. Inquiry calls to the office dropped by 60% because parents can check attendance, grades, and fee status on their phones anytime.",
    author: "Michael Okonkwo", role: "Vice Chancellor of Administration", company: "Riverside University", metric: "60% fewer inquiry calls" },
]

const lifecycleSteps = [
  { icon: Send, title: "Admissions", description: "Application, screening, and merit evaluation" }, { icon: UserCheck, title: "Enrollment", description: "Registration, document verification, fee payment" },
  { icon: BookOpen, title: "Learning", description: "Classes, assignments, labs, and projects" }, { icon: ClipboardCheck, title: "Assessment", description: "Exams, grading, and performance tracking" },
  { icon: Award, title: "Graduation", description: "Degree completion, convocation, and certification" }, { icon: Heart, title: "Alumni", description: "Career tracking, mentoring, and reunions" },
].flat()

const institutionTypes = [
  { icon: Building2, label: "Universities" }, { icon: School, label: "K-12 Schools" }, { icon: GraduationCap, label: "Colleges" },
  { icon: Target, label: "Training Centers" }, { icon: Globe, label: "Online Academies" }, { icon: FlaskConical, label: "Research Institutes" },
].flat()

const trustBadges = ["Accreditation Ready", "FERPA Compliant", "Multi-Campus", "24/7 Support", "LMS Integration"]
const dashboardMenu = ["Students", "Faculty", "Courses", "Attendance", "Grades"]

export default function EducationPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <main className="min-h-screen bg-white">
      <LP2Navbar />

      {/* ============ 1. HERO ============ */}
      <section className="relative pt-16 pb-10 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1523050854058-8df90110c476?w=1920&q=80"
            alt="Education campus"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/80 to-gray-900/60" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-6">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-400/30 text-blue-300 text-sm font-medium px-4 py-1.5 rounded-full mb-5">
                <GraduationCap className="w-4 h-4" /> Education Platform
              </span>
              <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
                Transform your institution with intelligent management
              </h1>
              <p className="text-gray-300 text-lg mb-6 leading-relaxed max-w-xl">
                Comprehensive platform for schools, colleges, universities, and training institutes to streamline every aspect of academic administration. Eliminate paperwork and empower educators.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                  Get Started <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                  Book a Demo
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-2 gap-3"
            >
              {stats.map((s, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-5 text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-1">{s.value}</div>
                  <div className="text-sm text-gray-300">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ 2. TRUSTED INSTITUTIONS STRIP ============ */}
      <section className="bg-blue-600 py-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <span className="text-white/90 text-sm font-medium whitespace-nowrap">Powering 200+ educational institutions worldwide</span>
            <div className="flex flex-wrap justify-center gap-3">
              {institutionTypes.map((inst, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 bg-white/15 text-white text-xs font-medium px-3 py-1.5 rounded-full">
                  <inst.icon className="w-3.5 h-3.5" /> {inst.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ 3. FEATURES - ACADEMIC CARDS GRID ============ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Comprehensive Academic Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Everything your institution needs to manage academics, operations, and communication in one unified platform.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-blue-50 rounded-xl p-6"
              >
                <div className="w-11 h-11 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 4. CAMPUS DASHBOARD PREVIEW ============ */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Your Campus at a Glance</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">A powerful dashboard that gives administrators real-time visibility into every aspect of institutional operations.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-700"
          >
            <div className="flex">
              {/* Sidebar */}
              <div className="w-52 bg-gray-800 border-r border-gray-700 p-4 hidden md:block">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white font-semibold text-sm">CubicleERP Edu</span>
                </div>
                <nav className="space-y-1">
                  {dashboardMenu.map((item, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${i === 0 ? "bg-blue-600/20 text-blue-400" : "text-gray-400 hover:text-gray-200"}`}
                    >
                      {[Users, UserCheck, BookOpen, ClipboardCheck, BarChart3][i] &&
                        (() => {
                          const Icon = [Users, UserCheck, BookOpen, ClipboardCheck, BarChart3][i]
                          return <Icon className="w-4 h-4" />
                        })()}
                      {item}
                    </div>
                  ))}
                </nav>
              </div>
              {/* Main content */}
              <div className="flex-1 p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-white font-semibold">Dashboard Overview</h3>
                  <span className="text-gray-500 text-xs">Academic Year 2025-26</span>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gray-800/80 rounded-xl p-4 border border-gray-700">
                    <div className="text-gray-400 text-xs mb-2">Total Students</div>
                    <div className="text-2xl font-bold text-white">2,847</div>
                    <div className="text-green-400 text-xs mt-1 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> +12% from last year
                    </div>
                  </div>
                  <div className="bg-gray-800/80 rounded-xl p-4 border border-gray-700">
                    <div className="text-gray-400 text-xs mb-2">Attendance Rate</div>
                    <div className="text-2xl font-bold text-white">94.2%</div>
                    <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
                      <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: "94%" }} />
                    </div>
                  </div>
                  <div className="bg-gray-800/80 rounded-xl p-4 border border-gray-700">
                    <div className="text-gray-400 text-xs mb-2">Upcoming Exams</div>
                    <div className="text-2xl font-bold text-white">6</div>
                    <div className="text-yellow-400 text-xs mt-1">Next: Mid-term (Apr 28)</div>
                  </div>
                  <div className="bg-gray-800/80 rounded-xl p-4 border border-gray-700">
                    <div className="text-gray-400 text-xs mb-2">Fee Collection</div>
                    <div className="text-2xl font-bold text-white">89%</div>
                    <div className="text-blue-400 text-xs mt-1">$1.2M collected this quarter</div>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div className="bg-gray-800/80 rounded-xl p-4 border border-gray-700">
                    <div className="text-gray-400 text-xs mb-3">Recent Activity</div>
                    {["New admission: Sarah M. (Grade 10)", "Fee received: $450 - John D.", "Attendance alert: Class 8B below 80%"].map((a, i) => (
                      <div key={i} className="text-gray-300 text-xs py-1.5 border-b border-gray-700 last:border-0">{a}</div>
                    ))}
                  </div>
                  <div className="bg-gray-800/80 rounded-xl p-4 border border-gray-700">
                    <div className="text-gray-400 text-xs mb-3">Quick Actions</div>
                    {["Add New Student", "Record Attendance", "Generate Report Card"].map((a, i) => (
                      <div key={i} className="flex items-center gap-2 text-blue-400 text-xs py-1.5 cursor-pointer hover:text-blue-300">
                        <ArrowRight className="w-3 h-3" /> {a}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ 5. CAPABILITIES WITH IMAGES ============ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Advanced Capabilities</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Powerful modules designed for the unique challenges of educational institutions.</p>
          </motion.div>
          <div className="space-y-12">
            {capabilities.map((cap, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`grid lg:grid-cols-2 gap-8 items-center ${i % 2 === 1 ? "lg:direction-rtl" : ""}`}
              >
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{cap.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{cap.description}</p>
                  <ul className="space-y-2 mb-4">
                    {cap.keyPoints.map((kp, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" /> {kp}
                      </li>
                    ))}
                  </ul>
                  <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 font-semibold px-4 py-2 rounded-lg text-sm">
                    <TrendingUp className="w-4 h-4" /> {cap.stat.value} {cap.stat.label}
                  </div>
                </div>
                <div className={`relative h-72 lg:h-80 rounded-xl overflow-hidden ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                  <Image src={cap.image} alt={cap.title} fill className="object-cover rounded-xl" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 6. BENEFITS SECTION ============ */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-10">
            {/* LEFT */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Why educators choose CubicleERP</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Trusted by hundreds of institutions worldwide, CubicleERP delivers measurable improvements in efficiency, engagement, and academic outcomes.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {stats.map((s, i) => (
                  <div key={i} className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{s.value}</div>
                    <div className="text-xs text-gray-600 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="bg-indigo-50 rounded-xl p-5 mb-6">
                <p className="text-sm text-gray-700 italic mb-3">&ldquo;{testimonials[0].quote}&rdquo;</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {testimonials[0].author[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{testimonials[0].author}</div>
                    <div className="text-xs text-gray-500">{testimonials[0].role}, {testimonials[0].company}</div>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {trustBadges.map((badge, i) => (
                  <span key={i} className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full">
                    <Shield className="w-3 h-3 text-blue-600" /> {badge}
                  </span>
                ))}
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Start Your Free Trial <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {/* RIGHT */}
            <div className="space-y-3">
              {benefits.map((b, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-blue-50 rounded-xl p-5"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{b.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{b.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ 7. STUDENT LIFECYCLE FLOW ============ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Student Lifecycle Management</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">CubicleERP manages every stage of the student journey, from first inquiry to lifelong alumni engagement.</p>
          </motion.div>
          <div className="relative">
            {/* Connecting line */}
            <div className="hidden lg:block absolute top-14 left-[8%] right-[8%] h-0.5 bg-blue-200" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
              {lifecycleSteps.map((ls, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center mb-3 relative z-10 shadow-lg shadow-blue-200">
                    <ls.icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">{ls.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{ls.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ 8. INTEGRATION GRID ============ */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Seamless Integrations</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Connect with the tools your institution already uses for a unified campus experience.</p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {integrations.map((intg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="bg-white rounded-xl p-4 text-center shadow-sm"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Layers className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-sm font-medium text-gray-900">{intg.name}</div>
                <div className="text-xs text-gray-500 mt-0.5">{intg.category}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 9. HOW IT WORKS ============ */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Get your institution up and running in three straightforward steps.</p>
          </motion.div>
          <div className="relative">
            <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-0.5 bg-blue-200" />
            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="text-center relative"
                >
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4 relative z-10 shadow-lg shadow-blue-200">
                    {s.step}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{s.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ 10. USE CASES ============ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Built for Every Type of Institution</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">See how different educational organizations leverage CubicleERP to streamline their operations.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {useCases.map((uc, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-blue-50 rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{uc.title}</h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">{uc.description}</p>
                <ul className="space-y-2">
                  {uc.highlights.map((h, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" /> {h}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 11. COMPARISON TABLE ============ */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-3">CubicleERP vs Traditional Methods</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">See the difference an intelligent campus management platform makes.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="overflow-x-auto"
          >
            <table className="w-full rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="text-left py-4 px-6 font-semibold">Feature</th>
                  <th className="text-left py-4 px-6 font-semibold">Traditional Approach</th>
                  <th className="text-left py-4 px-6 font-semibold">CubicleERP</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((c, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-blue-50" : "bg-white"}>
                    <td className="py-3.5 px-6 text-sm font-medium text-gray-900">{c.feature}</td>
                    <td className="py-3.5 px-6 text-sm text-gray-500">{c.traditional}</td>
                    <td className="py-3.5 px-6 text-sm text-blue-700 font-medium flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" /> {c.cubicleErp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* ============ 12. TESTIMONIALS ============ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-3">What Educators Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Hear from institutions that transformed their operations with CubicleERP.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm"
              >
                <div className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                  <TrendingUp className="w-3 h-3" /> {t.metric}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4 italic">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {t.author.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{t.author}</div>
                    <div className="text-xs text-gray-500">{t.role}, {t.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 13. FAQ ACCORDION ============ */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Frequently Asked Questions</h2>
            <p className="text-gray-600">Everything you need to know about CubicleERP Education.</p>
          </motion.div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-blue-50 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-500 shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 14. BLUE GRADIENT CTA ============ */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Ready to modernize your institution?</h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Join 500+ educational institutions that have transformed their campus management with CubicleERP. Get started in minutes, not months.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-8 py-3.5 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-transparent border-2 border-white/40 text-white font-semibold px-8 py-3.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                Schedule a Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ 15. LP2CTA + LP2Footer ============ */}
      <LP2CTA />
      <LP2Footer />
    </main>
  )
}
