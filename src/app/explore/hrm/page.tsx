"use client"

import ExploreProductPage from "@/components/landingpage2/explore/ExploreProductPage"
import {
  UserCheck,
  BookUser,
  CalendarDays,
  Wallet,
  ClipboardCheck,
  UserPlus,
  Clock,
} from "lucide-react"

const data = {
  name: "HRM",
  tagline: "Empower your people, transform your workplace",
  description:
    "CubicleERP HRM brings every aspect of human resource management into one intuitive platform. From onboarding new hires to managing payroll, tracking attendance, and running performance reviews — streamline your entire employee lifecycle and free your HR team to focus on what matters most: your people.",
  icon: UserCheck,
  color: "#107C10",
  lightColor: "#E8F5E9",
  heroImage: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1920&q=80",
  variant: 2 as const,
  features: [
    {
      icon: BookUser,
      title: "Employee Directory",
      description:
        "Maintain a centralized, searchable directory of every employee with profiles that include job history, reporting structure, skills, certifications, and emergency contacts. Org charts update automatically as roles and teams change.",
    },
    {
      icon: CalendarDays,
      title: "Leave Management",
      description:
        "Handle vacation, sick leave, parental leave, and custom leave types with configurable approval workflows. Employees submit requests from their dashboard, managers approve with one click, and balances update in real time.",
    },
    {
      icon: Wallet,
      title: "Payroll Integration",
      description:
        "Connect attendance, leave, overtime, and deduction data directly to your payroll processor. Eliminate manual spreadsheet reconciliation and ensure every paycheck reflects accurate hours, bonuses, and statutory deductions.",
    },
    {
      icon: ClipboardCheck,
      title: "Performance Reviews",
      description:
        "Run structured review cycles with customizable templates, 360-degree feedback, goal tracking, and competency ratings. Generate performance summaries that inform promotion decisions, training plans, and compensation adjustments.",
    },
    {
      icon: UserPlus,
      title: "Recruitment Pipeline",
      description:
        "Post job openings, track applicants through screening, interviews, and offers, and collaborate with hiring managers in one shared workspace. Score candidates, schedule interviews, and send offer letters without switching tools.",
    },
    {
      icon: Clock,
      title: "Attendance Tracking",
      description:
        "Record clock-in and clock-out times via web, mobile, or biometric integrations. Automatically calculate work hours, late arrivals, and overtime. Generate attendance reports broken down by department, location, or individual.",
    },
  ],
  benefits: [
    {
      title: "Reduce Administrative Burden",
      description:
        "Automate repetitive HR tasks like leave approvals, document collection, and compliance reminders. Your HR team reclaims hours every week to invest in strategic initiatives like culture building and talent development.",
    },
    {
      title: "Improve Regulatory Compliance",
      description:
        "Stay on top of labor law requirements with built-in compliance checklists, audit trails, and automated alerts for expiring documents, mandatory trainings, and policy acknowledgments.",
    },
    {
      title: "Better Employee Experience",
      description:
        "Give employees a self-service portal where they can view pay stubs, request time off, update personal information, and access company policies — without filing a ticket or emailing HR.",
    },
    {
      title: "Accurate Payroll Every Time",
      description:
        "Eliminate payroll errors by syncing attendance, leave, and overtime data automatically. Catch discrepancies before they reach paychecks and reduce the back-and-forth that comes with manual corrections.",
    },
    {
      title: "Faster, Smarter Hiring",
      description:
        "Cut time-to-hire by managing your entire recruitment funnel in one place. Standardize interview scorecards, automate candidate communications, and make data-backed hiring decisions.",
    },
    {
      title: "Centralized People Data",
      description:
        "Stop managing employee information across scattered spreadsheets and email threads. One source of truth for every team member means faster reporting, fewer errors, and confident decision-making.",
    },
  ],
  steps: [
    {
      step: "1",
      title: "Onboard Your Employees",
      description:
        "Import your employee roster via CSV or add team members manually. Collect documents, assign roles, set up reporting lines, and trigger automated welcome checklists — all in a guided onboarding flow.",
    },
    {
      step: "2",
      title: "Manage Daily HR Operations",
      description:
        "Process leave requests, track attendance, run payroll syncs, and handle employee queries through the self-service portal. Automated workflows keep everything moving without manual intervention.",
    },
    {
      step: "3",
      title: "Analyze and Grow",
      description:
        "Use built-in dashboards to monitor headcount trends, attrition rates, and performance metrics. Identify skill gaps, plan succession, and make workforce decisions backed by real data.",
    },
  ],
  useCases: [
    {
      title: "HR Departments",
      description:
        "Give your HR team a single platform to manage the entire employee lifecycle — from recruitment and onboarding through performance management, payroll, and eventual offboarding.",
      highlights: [
        "End-to-end employee lifecycle management in one system",
        "Automated compliance tracking and audit-ready reports",
        "Configurable approval workflows for leave, expenses, and documents",
      ],
    },
    {
      title: "Remote & Hybrid Teams",
      description:
        "Keep distributed teams connected and accountable with digital attendance, asynchronous performance reviews, and a self-service portal that works from anywhere.",
      highlights: [
        "Location-agnostic clock-in via web and mobile apps",
        "Asynchronous review cycles across time zones",
        "Company-wide announcements and policy distribution",
      ],
    },
    {
      title: "Growing Startups",
      description:
        "Scale your people operations without scaling your HR headcount. Automate the processes that consume time as you grow from 10 employees to 500 and beyond.",
      highlights: [
        "Quick setup with no dedicated IT team required",
        "Flexible org structures that adapt as you restructure",
        "Recruitment pipeline that grows with your hiring volume",
      ],
    },
  ],
  faqs: [
    {
      question: "What HR features are included in CubicleERP HRM?",
      answer:
        "CubicleERP HRM covers employee directory and org charts, leave and attendance management, payroll data integration, performance review cycles with 360-degree feedback, recruitment pipeline tracking, document management, and employee self-service. All modules are included with no per-feature pricing.",
    },
    {
      question: "Does CubicleERP handle payroll processing directly?",
      answer:
        "CubicleERP HRM manages all the data that feeds into payroll — attendance hours, leave deductions, overtime, bonuses, and tax declarations. It integrates with popular payroll providers so processed data flows directly into pay runs. Direct payroll disbursement support varies by region and provider.",
    },
    {
      question: "How does CubicleERP help with labor law compliance?",
      answer:
        "The platform includes configurable compliance checklists, automatic reminders for expiring work permits and certifications, mandatory training tracking, and full audit trails on every employee record change. Your HR team can generate compliance reports at any time for internal or external audits.",
    },
    {
      question: "Is there an employee self-service portal?",
      answer:
        "Yes. Every employee gets access to a personal dashboard where they can view and download pay stubs, submit leave requests, update personal and banking details, access the company handbook, and track their performance goals — all without needing to contact HR directly.",
    },
    {
      question: "Can CubicleERP HRM scale as my company grows?",
      answer:
        "Absolutely. CubicleERP HRM is built to support organizations from 5 to 5,000+ employees. Add departments, locations, and custom workflows as your structure evolves. Role-based permissions ensure the right people see the right data, no matter how complex your org chart becomes.",
    },
  ],
  stats: [
    { value: "70%", label: "Less admin time for HR teams" },
    { value: "50%", label: "Faster employee onboarding" },
    { value: "99%", label: "Payroll accuracy rate" },
    { value: "35%", label: "Better employee retention" },
  ],
}

export default function HRMPage() {
  return <ExploreProductPage data={data} />
}
