"use client"

import ExploreProductPage from "@/components/landingpage2/explore/ExploreProductPage"
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
} from "lucide-react"

const data = {
  name: "Startups",
  tagline: "Launch fast, scale smart, and stay lean with CubicleERP",
  description:
    "CubicleERP for Startups is the all-in-one business platform built for founders who refuse to slow down. From day-one operations to Series B and beyond, get CRM, invoicing, HR, project management, burn rate tracking, and investor reporting in a single affordable platform. Stop duct-taping together a dozen SaaS tools and start running your startup on a system designed for speed, agility, and relentless growth.",
  icon: Target,
  color: "#EA580C",
  lightColor: "#FFF7ED",
  heroImage:
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80",
  variant: 2 as const,
  features: [
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
  ],
  benefits: [
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
  ],
  steps: [
    {
      step: "1",
      title: "Sign Up and Launch in Minutes",
      description:
        "Create your workspace, invite co-founders and early team members, and let the setup wizard configure your modules based on your startup stage and industry. Import existing contacts from CSV, Google Contacts, or your current CRM and connect your email for automatic conversation logging — you'll be fully operational before your coffee gets cold.",
    },
    {
      step: "2",
      title: "Centralize Your Operations",
      description:
        "Start tracking deals in your sales pipeline, send your first invoice, set up recurring billing, and manage your team's tasks from one unified dashboard. Connect payment gateways, configure automated follow-ups, and build the workflows that will power your growth engine.",
    },
    {
      step: "3",
      title: "Scale Without Breaking Stride",
      description:
        "As your startup grows, activate advanced modules like workflow automation, investor reporting, multi-entity management, and custom analytics. Add unlimited users, create department-specific dashboards, and evolve your processes — all without migrating platforms or losing a single record.",
    },
  ],
  useCases: [
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
  ],
  faqs: [
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
  ],
  stats: [
    { value: "2,500+", label: "Startups powered by CubicleERP" },
    { value: "<10 min", label: "Average time to full setup" },
    { value: "65%", label: "Cost savings vs separate SaaS tools" },
    { value: "3.2x", label: "Faster deal closure on average" },
  ],
}

export default function StartupsPage() {
  return <ExploreProductPage data={data} />
}
