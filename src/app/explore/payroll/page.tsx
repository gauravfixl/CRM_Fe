"use client"

import ExploreProductPage from "@/components/landingpage2/explore/ExploreProductPage"
import {
  Wallet,
  Calculator,
  FileCheck,
  CalendarClock,
  ShieldCheck,
  Receipt,
  Banknote,
} from "lucide-react"

const data = {
  name: "Payroll",
  tagline: "Accurate payroll, on time, every time",
  description:
    "CubicleERP Payroll automates your entire pay cycle from salary calculations and tax deductions to payslip generation and compliance filings. Handle multi-country payroll, statutory contributions, bonuses, and reimbursements — all in one platform that integrates seamlessly with your HR and finance modules.",
  icon: Wallet,
  color: "#16A34A",
  lightColor: "#DCFCE7",
  heroImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1920&q=80",
  variant: 3 as const,
  features: [
    {
      icon: Calculator,
      title: "Automated Salary Processing",
      description:
        "Calculate gross pay, deductions, overtime, bonuses, and net salary automatically based on attendance data, leave records, and compensation rules. Run payroll for hundreds of employees in minutes with zero manual spreadsheet work.",
    },
    {
      icon: ShieldCheck,
      title: "Tax & Compliance Management",
      description:
        "Stay compliant with local tax regulations, provident fund contributions, professional tax, and statutory deductions. The system auto-updates when tax slabs change and generates ready-to-file returns for each pay period.",
    },
    {
      icon: Receipt,
      title: "Payslip Generation",
      description:
        "Generate detailed, branded payslips for every employee with a complete earnings and deductions breakdown. Employees access payslips instantly through their self-service portal — no more chasing HR for documents.",
    },
    {
      icon: CalendarClock,
      title: "Multi-Pay Schedule Support",
      description:
        "Handle weekly, bi-weekly, and monthly pay cycles across different departments or entities. Schedule payroll runs in advance, set approval workflows, and ensure every team gets paid on their designated date.",
    },
    {
      icon: Banknote,
      title: "Reimbursements & Expenses",
      description:
        "Process travel allowances, medical reimbursements, and expense claims alongside regular payroll. Employees submit claims with receipts, managers approve, and amounts are included in the next pay run automatically.",
    },
    {
      icon: FileCheck,
      title: "Year-End Processing",
      description:
        "Simplify year-end with automated computation of annual tax summaries, investment declarations, Form 16 generation, and final settlement calculations for exits. Close the financial year without the usual last-minute scramble.",
    },
  ],
  benefits: [
    {
      title: "Eliminate Payroll Errors",
      description:
        "Automated calculations remove the human errors that come with manual data entry. Every deduction, bonus, and overtime hour is computed from verified source data — attendance, leave, and HR records — so paychecks are accurate every cycle.",
    },
    {
      title: "Save Hours Every Pay Cycle",
      description:
        "What used to take your finance team days now takes minutes. Automated data sync, one-click processing, and batch payslip generation free up your team to focus on financial planning instead of number crunching.",
    },
    {
      title: "Stay Legally Compliant",
      description:
        "Built-in compliance engines handle provident fund, ESI, professional tax, TDS, and other statutory requirements. Get alerts before filing deadlines and generate audit-ready reports that satisfy regulators.",
    },
    {
      title: "Empower Employees",
      description:
        "Give every employee instant access to their payslips, tax documents, investment declarations, and reimbursement status through a self-service portal. Reduce HR queries by up to 80% with transparent pay information.",
    },
    {
      title: "Seamless HR & Finance Integration",
      description:
        "Payroll data flows directly from HRM attendance and leave modules and posts journal entries to your Finance ledger automatically. No duplicate entry, no reconciliation headaches, no data silos.",
    },
    {
      title: "Scale Without Complexity",
      description:
        "Whether you have 20 employees or 2,000, the system handles growing headcount, multiple entities, and varying pay structures without requiring additional payroll staff or manual workarounds.",
    },
  ],
  steps: [
    {
      step: "1",
      title: "Configure Salary Structure",
      description:
        "Set up your compensation components — basic pay, allowances, deductions, and statutory contributions. Define pay grades, tax rules, and reimbursement policies. Import existing employee salary data via CSV or sync from HRM.",
    },
    {
      step: "2",
      title: "Run Payroll",
      description:
        "Each pay cycle, the system pulls attendance, leave, and overtime data automatically. Review the computed payroll summary, approve adjustments if needed, and process salaries with a single click. Payslips are generated and distributed instantly.",
    },
    {
      step: "3",
      title: "File & Report",
      description:
        "Generate statutory filings, tax returns, and compliance reports directly from the platform. Post payroll journal entries to your finance module and access historical payroll data for audits, budgeting, and workforce cost analysis.",
    },
  ],
  useCases: [
    {
      title: "Finance & Accounting Teams",
      description:
        "Streamline the payroll-to-ledger pipeline with automatic journal entries, bank file generation, and reconciliation reports that keep your books accurate without manual data transfers.",
      highlights: [
        "Auto-posting of payroll entries to general ledger accounts",
        "Bank transfer file generation for bulk salary disbursement",
        "Monthly, quarterly, and annual payroll cost reports",
      ],
    },
    {
      title: "HR Departments",
      description:
        "Close the loop between HR operations and payroll. Attendance, leave, and compensation changes flow into payroll automatically, eliminating the back-and-forth between HR and finance teams.",
      highlights: [
        "Real-time sync of attendance and leave data into pay calculations",
        "Employee self-service for payslips and tax declarations",
        "Automated full-and-final settlement for employee exits",
      ],
    },
    {
      title: "Multi-Location Businesses",
      description:
        "Manage payroll across multiple offices, states, or countries with location-specific tax rules, statutory requirements, and pay schedules — all from a single unified dashboard.",
      highlights: [
        "Location-wise statutory compliance and tax rule configuration",
        "Consolidated payroll dashboard across all entities",
        "Multi-currency support for international teams",
      ],
    },
  ],
  faqs: [
    {
      question: "What payroll features does CubicleERP include?",
      answer:
        "CubicleERP Payroll covers automated salary calculation, tax and statutory deduction management, payslip generation, reimbursement processing, multi-pay-schedule support, year-end processing, and compliance filings. It integrates natively with the HRM and Finance modules for seamless data flow.",
    },
    {
      question: "Does CubicleERP handle tax compliance for different regions?",
      answer:
        "Yes. The payroll module supports configurable tax rules, provident fund, ESI, professional tax, and other statutory deductions based on your operating regions. Tax tables are updated regularly, and the system alerts you before filing deadlines.",
    },
    {
      question: "Can employees access their payslips online?",
      answer:
        "Absolutely. Every employee has access to a self-service portal where they can view and download current and historical payslips, submit investment declarations for tax planning, track reimbursement claims, and download annual tax documents like Form 16.",
    },
    {
      question: "How does payroll integrate with attendance and leave data?",
      answer:
        "Payroll automatically pulls clock-in/clock-out data, approved leave records, and overtime hours from the HRM module. This ensures that every pay run reflects actual working days, leave deductions, and overtime earnings without any manual data entry.",
    },
    {
      question: "Can I run payroll for multiple entities or branches?",
      answer:
        "Yes. CubicleERP supports multi-entity payroll with separate salary structures, statutory configurations, and pay schedules for each entity or branch. You can process them individually or in batch, and view consolidated reports across your entire organization.",
    },
  ],
  stats: [
    { value: "99.9%", label: "Payroll accuracy rate" },
    { value: "80%", label: "Less time on payroll processing" },
    { value: "100%", label: "Statutory compliance coverage" },
    { value: "Zero", label: "Manual calculation errors" },
  ],
}

export default function PayrollPage() {
  return <ExploreProductPage data={data} />
}
