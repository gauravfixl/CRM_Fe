"use client"

import ExploreProductPage from "@/components/landingpage2/explore/ExploreProductPage"
import {
  GraduationCap,
  BookOpen,
  Users,
  Calendar,
  DollarSign,
  BarChart3,
} from "lucide-react"

const data = {
  name: "Education",
  tagline: "Smart management for schools and institutions",
  description:
    "CubicleERP Education empowers schools, colleges, universities, coaching centers, and training institutes with a unified platform to manage student admissions, academic operations, fee collection, staff coordination, and institutional analytics. Simplify administration, improve communication with parents and students, and focus on delivering quality education — not drowning in paperwork.",
  icon: GraduationCap,
  color: "#F59E0B",
  lightColor: "#FFFBEB",
  heroImage: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1920&q=80",
  features: [
    {
      icon: BookOpen,
      title: "Admissions & Enrollment Management",
      description:
        "Digitize the entire admissions funnel — from inquiry and application to document verification, entrance assessments, and enrollment confirmation. Track application status, communicate with prospective students, manage waitlists, and generate admission letters automatically. Support multiple intake cycles and program-specific admission criteria.",
    },
    {
      icon: Users,
      title: "Student Information System",
      description:
        "Maintain comprehensive student records including personal details, academic history, attendance, disciplinary records, health information, and emergency contacts. Track student progress across semesters, generate transcripts automatically, and provide students and parents with portal access to view grades, attendance, and fee status.",
    },
    {
      icon: Calendar,
      title: "Timetable & Academic Planning",
      description:
        "Create conflict-free timetables with automated scheduling that considers teacher availability, room capacity, and equipment requirements. Manage academic calendars, exam schedules, and event planning. Support for multiple sections, elective courses, and lab rotations across departments.",
    },
    {
      icon: DollarSign,
      title: "Fee Management & Collections",
      description:
        "Configure complex fee structures with tuition, lab fees, transportation charges, and hostel costs. Support installment plans, scholarships, sibling discounts, and late payment penalties. Send automated payment reminders, accept online payments, and generate detailed fee receipts and defaulter reports.",
    },
    {
      icon: BarChart3,
      title: "Examination & Grading System",
      description:
        "Manage the complete examination lifecycle — schedule creation, seat allocation, grade entry, result processing, and report card generation. Support multiple grading systems (GPA, percentage, letter grades), internal assessments, and continuous evaluation. Generate analytics on class performance, subject-wise results, and year-over-year trends.",
    },
    {
      icon: GraduationCap,
      title: "Staff & Faculty Management",
      description:
        "Handle faculty recruitment, onboarding, workload allocation, leave management, and performance evaluation. Track teaching hours, research contributions, and professional development activities. Manage substitute assignments, payroll, and compliance with educational board requirements for staff qualifications.",
    },
  ],
  benefits: [
    {
      title: "Reduce Administrative Workload by 60%",
      description:
        "Automate routine tasks like attendance tracking, fee reminders, report card generation, and certificate issuance. Office staff spend less time on manual data entry and more time supporting students and faculty with meaningful work.",
    },
    {
      title: "Improve Parent & Student Communication",
      description:
        "Dedicated portals for parents and students provide real-time access to attendance, grades, fee status, and school announcements. Automated SMS and email notifications keep families informed without requiring staff to make individual calls.",
    },
    {
      title: "Increase Fee Collection Rates",
      description:
        "Automated reminders, online payment options, and installment plan management reduce fee defaults by up to 35%. Real-time defaulter tracking and escalation workflows ensure timely follow-up without manual effort.",
    },
    {
      title: "Make Data-Driven Academic Decisions",
      description:
        "Analyze student performance trends, teacher effectiveness, admission conversion rates, and financial health with real-time dashboards. Identify at-risk students early, allocate resources effectively, and demonstrate institutional performance to accreditation bodies.",
    },
    {
      title: "Streamline Compliance & Accreditation",
      description:
        "Maintain organized records required for educational board compliance, accreditation reviews, and government audits. Generate reports on student-teacher ratios, infrastructure utilization, academic outcomes, and financial transparency on demand.",
    },
    {
      title: "Scale Across Campuses",
      description:
        "Manage multiple campuses, branches, or franchise locations from a single platform. Standardize processes while allowing campus-specific customization for local requirements, fee structures, and academic calendars.",
    },
  ],
  steps: [
    {
      step: "1",
      title: "Configure Your Institution",
      description:
        "Set up academic structure — departments, programs, sections, and subjects. Configure fee schedules, grading systems, and academic calendar. Import existing student and staff data from spreadsheets or your current system.",
    },
    {
      step: "2",
      title: "Digitize Operations",
      description:
        "Move admissions, attendance, fee collection, and examinations online. Train staff on the platform with role-specific guides. Activate parent and student portals for transparent communication and self-service access.",
    },
    {
      step: "3",
      title: "Analyze & Optimize",
      description:
        "Use dashboards to track enrollment trends, fee collection rates, academic performance, and operational efficiency. Continuously improve institutional processes based on data insights and stakeholder feedback.",
    },
  ],
  useCases: [
    {
      title: "K-12 Schools",
      description:
        "Primary and secondary schools use CubicleERP to manage student admissions, daily attendance, parent communication, fee collection, and report card generation across multiple sections and grades.",
      highlights: [
        "Automated daily attendance with parent notification alerts",
        "Fee management with sibling discounts and installment plans",
        "Report card generation with continuous assessment tracking",
      ],
    },
    {
      title: "Colleges & Universities",
      description:
        "Higher education institutions use CubicleERP to manage complex academic structures with multiple departments, elective courses, credit systems, and research programs alongside administrative operations.",
      highlights: [
        "Credit-based course management with GPA calculation",
        "Faculty workload planning and research tracking",
        "Multi-campus management with centralized reporting",
      ],
    },
    {
      title: "Coaching & Training Institutes",
      description:
        "Competitive exam coaching centers and professional training institutes use CubicleERP to manage batch scheduling, student enrollment, test series, and fee collection for short-duration programs.",
      highlights: [
        "Batch-based scheduling with flexible enrollment cycles",
        "Test series management with automated result analysis",
        "Course-wise fee tracking with installment options",
      ],
    },
  ],
  faqs: [
    {
      question: "Can CubicleERP handle multiple academic boards and grading systems?",
      answer:
        "Yes. CubicleERP supports CBSE, ICSE, State Boards, IB, Cambridge, and custom grading systems. You can configure different grading scales (GPA, percentage, letter grades), assessment components, and promotion criteria for each program or board within the same institution.",
    },
    {
      question: "Is there a mobile app for parents and students?",
      answer:
        "CubicleERP provides a responsive web portal that works seamlessly on mobile devices for parents and students. They can view attendance, grades, fee status, and announcements from any device. A dedicated mobile app with push notifications is available for institutions on our Premium plan.",
    },
    {
      question: "How does fee management handle complex fee structures?",
      answer:
        "CubicleERP supports multi-component fee structures including tuition, lab fees, library charges, transport, hostel, and custom components. You can configure installment plans, early payment discounts, sibling discounts, scholarship adjustments, and late payment penalties. Each component can have different due dates and payment rules.",
    },
    {
      question: "Can we migrate data from our current school management system?",
      answer:
        "Yes. We support data migration from spreadsheets and popular school ERP systems. Our education team assists with student records, fee history, academic data, and staff information migration. We ensure data integrity through validation checks and provide parallel running support during the transition period.",
    },
    {
      question: "Does CubicleERP support online examinations?",
      answer:
        "CubicleERP supports exam scheduling, seating arrangement, grade entry, and result processing. For online test delivery, we integrate with popular assessment platforms. The results from these platforms can be imported back into CubicleERP for unified grade management and analytics.",
    },
  ],
  stats: [
    { value: "60%", label: "Less admin workload" },
    { value: "35%", label: "Increase in fee collection" },
    { value: "500+", label: "Institutions onboarded" },
    { value: "98%", label: "Parent satisfaction rate" },
  ],
}

export default function EducationPage() {
  return <ExploreProductPage data={data} />
}
