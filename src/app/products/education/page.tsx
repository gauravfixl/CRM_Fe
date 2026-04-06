"use client"

import ExploreProductPage from "@/components/landingpage2/explore/ExploreProductPage"
import {
  GraduationCap,
  BookOpen,
  Users,
  Calendar,
  DollarSign,
  ClipboardCheck,
  Monitor,
} from "lucide-react"

const data = {
  name: "Education",
  tagline: "Transform institutional management with intelligent campus solutions",
  description:
    "CubicleERP Education is a comprehensive platform built for schools, colleges, universities, and training institutes to streamline every aspect of academic administration. From student admissions and fee collection to timetable scheduling, exam management, and parent engagement, our solution eliminates paperwork and empowers educators to focus on what matters most — delivering quality education. Gain full visibility into institutional performance with real-time analytics and connected workflows across departments.",
  icon: GraduationCap,
  color: "#2563EB",
  lightColor: "#DBEAFE",
  heroImage:
    "https://images.unsplash.com/photo-1562774053-701939374585?w=1920&q=80",
  variant: 1 as const,
  features: [
    {
      icon: BookOpen,
      title: "Student Information System",
      description:
        "Maintain a centralized, secure repository of every student's academic journey — from enrollment to alumni status. Track personal details, academic history, attendance records, health information, disciplinary actions, and extracurricular achievements in one unified profile. Parents and students get portal access to view grades, download transcripts, and update contact information without burdening administrative staff.",
    },
    {
      icon: Users,
      title: "Admissions & Enrollment Management",
      description:
        "Digitize your entire admissions pipeline from initial inquiry and online application to document verification, merit-list generation, and enrollment confirmation. Manage multiple intake cycles, program-specific eligibility criteria, entrance assessments, and waitlists with full audit trails. Automated communication keeps applicants informed at every stage while reducing manual follow-up by your admissions team.",
    },
    {
      icon: DollarSign,
      title: "Fee Collection & Financial Management",
      description:
        "Handle complex, multi-component fee structures covering tuition, laboratory charges, transportation, hostel fees, and custom components with ease. Configure installment plans, early-payment discounts, sibling concessions, scholarship adjustments, and late-payment penalties — all with automated reminders via SMS and email. Accept online payments through multiple gateways and generate detailed receipts, defaulter reports, and financial summaries instantly.",
    },
    {
      icon: Calendar,
      title: "Timetable & Academic Scheduling",
      description:
        "Generate conflict-free timetables automatically by factoring in teacher availability, room capacity, lab equipment requirements, and inter-section dependencies. Support elective courses, rotating lab sessions, and multi-campus scheduling from a single interface. Changes propagate instantly to student and faculty portals, and substitution management ensures classes are never left unattended.",
    },
    {
      icon: ClipboardCheck,
      title: "Examination & Grade Management",
      description:
        "Orchestrate the full examination lifecycle — from schedule creation and hall-ticket generation to seating arrangement, invigilation assignment, grade entry, and result processing. Support diverse grading systems including GPA, percentage, letter grades, and continuous internal assessment with customizable weightages. Publish results to student portals and generate detailed report cards, class toppers lists, and subject-wise performance analytics.",
    },
    {
      icon: Monitor,
      title: "Parent Portal & Communication Hub",
      description:
        "Provide parents with a dedicated portal offering real-time visibility into their child's attendance, grades, fee status, homework assignments, and school announcements. Two-way messaging between parents and teachers fosters engagement without the overhead of individual phone calls. Push notifications and scheduled newsletters keep families connected to campus life and upcoming events.",
    },
  ],
  benefits: [
    {
      title: "Reduce Administrative Workload by 60%",
      description:
        "Automate repetitive tasks like attendance recording, fee reminders, report card generation, certificate issuance, and circular distribution. Free your office staff from manual data entry so they can focus on supporting students and faculty with higher-value work.",
    },
    {
      title: "Boost Fee Collection Rates by 35%",
      description:
        "Automated payment reminders, flexible installment plans, and convenient online payment options dramatically reduce fee defaults. Real-time defaulter tracking with escalation workflows ensures timely follow-up without adding manual effort for your accounts team.",
    },
    {
      title: "Strengthen Parent & Student Engagement",
      description:
        "Dedicated self-service portals give parents and students instant access to attendance, grades, assignments, and announcements. Transparent communication builds trust, reduces inquiry calls to the office, and keeps families actively involved in the educational journey.",
    },
    {
      title: "Make Data-Driven Academic Decisions",
      description:
        "Analyze student performance trends, teacher effectiveness, admission conversion rates, and financial health through real-time dashboards. Identify at-risk students early, allocate resources strategically, and present institutional performance data to accreditation bodies with confidence.",
    },
    {
      title: "Simplify Compliance & Accreditation",
      description:
        "Keep all records organized and audit-ready for educational board compliance, accreditation reviews, and government inspections. Generate reports on student-teacher ratios, infrastructure utilization, academic outcomes, and financial transparency at the click of a button.",
    },
    {
      title: "Scale Seamlessly Across Campuses",
      description:
        "Manage multiple branches, campuses, or franchise locations from a single unified platform. Standardize core processes institution-wide while allowing campus-specific customization for local fee structures, academic calendars, and regulatory requirements.",
    },
  ],
  steps: [
    {
      step: "1",
      title: "Configure Your Institution",
      description:
        "Set up your academic structure — departments, programs, sections, and subjects. Define fee schedules, grading policies, and the academic calendar. Import existing student, staff, and financial data from spreadsheets or your legacy system with guided migration support.",
    },
    {
      step: "2",
      title: "Digitize Campus Operations",
      description:
        "Move admissions, attendance tracking, fee collection, timetable management, and examinations online. Train your team with role-specific walkthroughs and activate parent and student portals for transparent, self-service communication.",
    },
    {
      step: "3",
      title: "Analyze, Improve & Grow",
      description:
        "Leverage real-time dashboards to monitor enrollment trends, fee recovery rates, academic performance, and operational efficiency. Use data insights and stakeholder feedback to continuously refine processes and elevate educational outcomes across your institution.",
    },
  ],
  useCases: [
    {
      title: "K-12 Schools",
      description:
        "Primary and secondary schools use CubicleERP to manage student admissions, daily attendance, parent communication, fee collection, and report card generation across multiple grades and sections — all from one intuitive dashboard.",
      highlights: [
        "Automated daily attendance with instant parent SMS notifications",
        "Fee management with sibling discounts, transport add-ons, and installment tracking",
        "Continuous assessment-based report cards with teacher remarks and skill indicators",
      ],
    },
    {
      title: "Colleges & Universities",
      description:
        "Higher education institutions rely on CubicleERP to handle complex academic structures with multiple departments, credit-based courses, elective selections, research programs, and hostel management alongside administrative operations.",
      highlights: [
        "Credit-based course registration with GPA calculation and transcript generation",
        "Faculty workload allocation, research tracking, and performance evaluation",
        "Multi-campus governance with centralized analytics and decentralized operations",
      ],
    },
    {
      title: "Coaching & Training Institutes",
      description:
        "Competitive exam coaching centers and professional training institutes use CubicleERP to manage batch scheduling, rolling enrollments, practice test series, and fee collection for short-duration and intensive programs.",
      highlights: [
        "Flexible batch-based scheduling with overlapping enrollment cycles",
        "Test series management with automated scoring and comparative result analysis",
        "Course-wise fee tracking with partial payments and refund processing",
      ],
    },
  ],
  faqs: [
    {
      question:
        "Can CubicleERP handle multiple academic boards and grading systems?",
      answer:
        "Absolutely. CubicleERP supports CBSE, ICSE, State Boards, IB, Cambridge, and fully custom grading systems. You can configure different grading scales — GPA, percentage, letter grades, or descriptive indicators — along with distinct assessment components and promotion criteria for each program or board within the same institution. Switching between boards for multi-stream schools is seamless.",
    },
    {
      question:
        "How does fee management handle complex and multi-component fee structures?",
      answer:
        "CubicleERP lets you build fee structures with unlimited components including tuition, lab fees, library charges, transport, hostel, and any custom heads you need. Each component can have its own due dates, installment schedules, and payment rules. You can layer on early-payment discounts, sibling concessions, merit scholarships, and late-payment penalties. The system auto-calculates balances and sends reminders, so your accounts team deals with exceptions rather than routine follow-ups.",
    },
    {
      question:
        "Is there a parent and student portal accessible on mobile devices?",
      answer:
        "Yes. CubicleERP provides a fully responsive web portal that works flawlessly on smartphones, tablets, and desktops. Parents and students can view attendance, grades, fee status, homework assignments, and school announcements from any device. Institutions on our Premium plan also get a dedicated mobile app with push notifications for real-time alerts on attendance, results, and fee due dates.",
    },
    {
      question:
        "Can we migrate data from our existing school management system?",
      answer:
        "Yes, we provide full migration support. Our education onboarding team helps you transfer student records, fee history, academic data, staff information, and historical results from spreadsheets or popular school ERP platforms. Every record goes through validation checks to ensure data integrity, and we offer a parallel-running period so your team can verify everything before going fully live.",
    },
    {
      question:
        "Does CubicleERP support online examinations and automated result processing?",
      answer:
        "CubicleERP handles the complete exam management workflow — schedule creation, hall-ticket generation, seating arrangement, grade entry, moderation, and result publication. For online test delivery with proctoring, we integrate with leading assessment platforms. Results from those platforms flow back into CubicleERP automatically for unified grade management, analytics, and report card generation without duplicate data entry.",
    },
  ],
  stats: [
    { value: "60%", label: "Reduction in admin workload" },
    { value: "35%", label: "Improvement in fee collection" },
    { value: "500+", label: "Institutions onboarded" },
    { value: "98%", label: "Parent satisfaction rate" },
  ],
}

export default function EducationPage() {
  return <ExploreProductPage data={data} />
}
