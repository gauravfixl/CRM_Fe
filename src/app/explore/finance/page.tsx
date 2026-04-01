"use client"

import ExploreProductPage from "@/components/landingpage2/explore/ExploreProductPage"
import {
  DollarSign,
  FileText,
  Receipt,
  PieChart,
  BarChart3,
  Landmark,
  Globe,
} from "lucide-react"

const data = {
  name: "Finance",
  tagline: "Take full control of your financial operations",
  description:
    "Automate invoicing, track expenses in real time, and generate audit-ready financial reports — all from a single platform. CubicleERP Finance gives your team the accuracy and speed needed to close books faster and make smarter financial decisions.",
  icon: DollarSign,
  color: "#D83B01",
  lightColor: "#FFF3E0",
  heroImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1920&q=80",
  variant: 4 as const,
  features: [
    {
      icon: FileText,
      title: "Automated Invoicing",
      description:
        "Create professional invoices from templates, set up recurring billing schedules, and send automated payment reminders. Customers can pay directly through embedded payment links, reducing your average collection time significantly.",
    },
    {
      icon: Receipt,
      title: "Expense Tracking",
      description:
        "Capture receipts with your phone, categorize expenses automatically using smart rules, and enforce spending policies before reimbursements are approved. Every transaction is logged and linked to the appropriate cost center.",
    },
    {
      icon: PieChart,
      title: "Budgeting & Forecasting",
      description:
        "Build detailed budgets by department, project, or cost center. Compare actuals against forecasts in real time, receive variance alerts when spending exceeds thresholds, and adjust plans with drag-and-drop scenario modeling.",
    },
    {
      icon: BarChart3,
      title: "Financial Reports",
      description:
        "Generate profit and loss statements, balance sheets, cash flow reports, and custom dashboards with a single click. Schedule reports for automatic delivery to stakeholders and export in PDF, Excel, or CSV formats.",
    },
    {
      icon: Landmark,
      title: "Tax Management",
      description:
        "Automate tax calculations for GST, VAT, sales tax, and withholding tax across jurisdictions. Generate tax-ready reports, track filing deadlines, and maintain a complete audit trail that satisfies regulatory requirements.",
    },
    {
      icon: Globe,
      title: "Multi-Currency Support",
      description:
        "Transact in over 150 currencies with automatic exchange rate updates. Record foreign-currency invoices, track realized and unrealized gains or losses, and consolidate financials into your base currency for unified reporting.",
    },
  ],
  benefits: [
    {
      title: "Faster Payments",
      description:
        "Automated invoicing with embedded payment links and scheduled reminders cuts your average days sales outstanding by up to 40%. Customers pay on time because you make it effortless for them.",
    },
    {
      title: "Reduced Manual Errors",
      description:
        "Automated data entry, bank reconciliation, and calculation engines eliminate the spreadsheet errors that lead to costly financial mistakes. Built-in validation rules catch discrepancies before they hit your books.",
    },
    {
      title: "Real-Time Financial Visibility",
      description:
        "Live dashboards show your cash position, outstanding receivables, upcoming payables, and budget utilization at any moment. Make informed decisions without waiting for end-of-month reports.",
    },
    {
      title: "Tax Compliance Made Simple",
      description:
        "Stay compliant across multiple jurisdictions with automated tax rate lookups, filing deadline reminders, and pre-formatted tax returns. Reduce the risk of penalties from late or incorrect filings.",
    },
    {
      title: "Cash Flow Control",
      description:
        "Forecast future cash positions by analyzing payment patterns, scheduled invoices, and upcoming expenses. Set up low-balance alerts and optimize payment timing to maintain healthy working capital.",
    },
    {
      title: "Audit-Ready Records",
      description:
        "Every transaction is timestamped, tagged to a user, and stored with its supporting documents. When auditors come calling, pull complete audit trails in seconds instead of scrambling through filing cabinets.",
    },
  ],
  steps: [
    {
      step: "1",
      title: "Set Up Your Accounts",
      description:
        "Import your chart of accounts or start with industry-specific templates. Connect your bank accounts for automatic transaction syncing and configure tax rules for your jurisdictions.",
    },
    {
      step: "2",
      title: "Automate Billing",
      description:
        "Create invoice templates, set up recurring billing cycles, and configure payment gateways. Automated reminders chase overdue payments so your team does not have to.",
    },
    {
      step: "3",
      title: "Generate Reports",
      description:
        "Run financial reports on demand or schedule them for automatic delivery. Analyze trends, compare periods, and share insights with stakeholders through interactive dashboards.",
    },
  ],
  useCases: [
    {
      title: "Finance Teams",
      description:
        "Streamline month-end close with automated reconciliations, accrual management, and consolidated reporting. Finance teams cut their close cycle in half while improving accuracy across every ledger entry.",
      highlights: [
        "Automated bank and intercompany reconciliation",
        "One-click month-end and year-end close workflows",
        "Consolidated reporting across multiple entities",
      ],
    },
    {
      title: "Freelancers & Agencies",
      description:
        "Send branded invoices in seconds, track billable hours, and monitor project profitability from a single dashboard. Automatic expense categorization makes tax season painless for independent professionals.",
      highlights: [
        "Branded invoice templates with online payment links",
        "Billable time tracking linked to invoices",
        "Simplified tax preparation with categorized expenses",
      ],
    },
    {
      title: "Enterprise Accounting",
      description:
        "Handle complex multi-entity, multi-currency, and multi-jurisdictional accounting with full intercompany elimination. Role-based access controls ensure that sensitive financial data is visible only to authorized personnel.",
      highlights: [
        "Multi-entity consolidation with elimination entries",
        "Role-based access and segregation of duties",
        "Regulatory compliance across global jurisdictions",
      ],
    },
  ],
  faqs: [
    {
      question: "Which accounting standards does CubicleERP support?",
      answer:
        "CubicleERP Finance supports GAAP, IFRS, and local statutory standards including Indian Accounting Standards (Ind AS). You can configure your chart of accounts and reporting formats to match the requirements of your jurisdiction and industry.",
    },
    {
      question: "Can I integrate with my existing banking and payment tools?",
      answer:
        "Yes. We offer direct bank feeds from major banks, plus integrations with payment gateways like Stripe, Razorpay, and PayPal. Our open API also lets you connect to any banking or financial service through custom integrations.",
    },
    {
      question: "How does multi-currency support work?",
      answer:
        "You can issue invoices, record expenses, and maintain accounts in any of over 150 currencies. Exchange rates update automatically from central bank feeds, and realized and unrealized foreign exchange gains or losses are calculated and posted to your ledger in real time.",
    },
    {
      question: "Is CubicleERP compliant with GST, VAT, and other tax regulations?",
      answer:
        "Absolutely. The platform handles GST (CGST, SGST, IGST), VAT, sales tax, and withholding tax with automatic rate lookups based on transaction type and jurisdiction. Tax-ready reports like GSTR-1, GSTR-3B, and VAT returns are generated with a single click.",
    },
    {
      question: "How secure is my financial data?",
      answer:
        "All data is encrypted at rest with AES-256 and in transit with TLS 1.3. We maintain SOC 2 Type II compliance, perform regular penetration testing, and offer role-based access controls with full audit logging. Your data is backed up continuously with point-in-time recovery.",
    },
  ],
  stats: [
    { value: "65%", label: "Faster invoicing cycle" },
    { value: "90%", label: "Fewer manual errors" },
    { value: "2x", label: "Faster month-end close" },
    { value: "40%", label: "Operational cost reduction" },
  ],
}

export default function FinancePage() {
  return <ExploreProductPage data={data} />
}
