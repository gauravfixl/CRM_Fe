"use client"

import ExploreProductPage from "@/components/landingpage2/explore/ExploreProductPage"
import {
  Target,
  Zap,
  TrendingUp,
  DollarSign,
  Rocket,
  Users,
} from "lucide-react"

const data = {
  name: "Startups",
  tagline: "Lean tools to grow fast and stay agile",
  description:
    "CubicleERP for Startups gives early-stage and growth-stage companies everything they need to move fast without the overhead of enterprise software. Get CRM, invoicing, HR, project management, and analytics in one affordable platform that grows with you — so you can focus on building your product and closing customers, not managing a dozen disconnected tools.",
  icon: Target,
  color: "#10B981",
  lightColor: "#ECFDF5",
  heroImage: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1920&q=80",
  features: [
    {
      icon: Zap,
      title: "Quick Setup & Onboarding",
      description:
        "Go from sign-up to fully operational in under 15 minutes. Import contacts, set up your pipeline, and start tracking deals immediately. No implementation consultants, no week-long configuration sessions — just intuitive workflows designed for teams that move fast and iterate constantly.",
    },
    {
      icon: TrendingUp,
      title: "Growth-Focused CRM",
      description:
        "A sales pipeline built for speed. Track leads from first touch to closed deal, automate follow-up sequences, and get real-time visibility into your conversion funnel. Built-in lead scoring helps your small sales team prioritize the opportunities most likely to convert.",
    },
    {
      icon: DollarSign,
      title: "Simple Invoicing & Payments",
      description:
        "Create professional invoices in seconds, set up recurring billing, and accept online payments. Track outstanding receivables, send automated payment reminders, and get a clear picture of your cash flow — the lifeline of every startup.",
    },
    {
      icon: Users,
      title: "Lightweight HR & People Ops",
      description:
        "Manage your growing team with essential HR tools — employee directory, leave tracking, onboarding checklists, and document storage. As you scale from 5 to 50+ employees, CubicleERP grows with you without forcing a migration to a more complex HR system.",
    },
    {
      icon: Rocket,
      title: "Project & Task Management",
      description:
        "Keep your team aligned with built-in project boards, sprint tracking, and task assignments. Link projects to client deals and invoices so you always know the financial health of every engagement. Perfect for product sprints, client deliverables, and cross-functional initiatives.",
    },
    {
      icon: Target,
      title: "Startup-Friendly Pricing",
      description:
        "No long-term contracts, no per-module fees, no hidden costs. Pay per user per month with all modules included. Start with our free tier for up to 3 users and upgrade as your team grows. Special startup pricing available for YC, Techstars, and accelerator graduates.",
    },
  ],
  benefits: [
    {
      title: "Replace Your Entire Tool Stack",
      description:
        "Stop juggling between Trello for projects, Google Sheets for pipeline tracking, and Wave for invoicing. CubicleERP combines all your essential business tools in one place, saving you hundreds of dollars per month in SaaS subscriptions and hours of manual data sync.",
    },
    {
      title: "Make Data-Driven Decisions Early",
      description:
        "Access real-time dashboards showing revenue trends, pipeline health, team utilization, and cash runway. When every decision matters, having accurate data at your fingertips helps you allocate resources wisely and identify growth opportunities faster than competitors.",
    },
    {
      title: "Scale Without Re-Platforming",
      description:
        "Most startups outgrow their tools within 12-18 months and face painful migrations. CubicleERP is designed to scale from founding team to 500+ employees without switching platforms. Activate advanced modules as you need them — no data migration, no retraining.",
    },
    {
      title: "Impress Investors with Professionalism",
      description:
        "Generate board-ready financial reports, accurate revenue forecasts, and customer metrics instantly. When VCs ask about your MRR growth, churn rate, or sales velocity, you'll have precise answers backed by real data — not spreadsheet estimates.",
    },
    {
      title: "Move Faster with Automation",
      description:
        "Automate repetitive tasks like lead assignment, invoice creation, payment reminders, and onboarding emails. Your small team gets leverage that lets them operate like a company twice their size without hiring additional administrative staff.",
    },
    {
      title: "Stay Focused on What Matters",
      description:
        "Spend less time on admin and more time building your product and talking to customers. CubicleERP handles the operational backbone of your business so your founding team can focus on achieving product-market fit and closing your next round.",
    },
  ],
  steps: [
    {
      step: "1",
      title: "Sign Up in Seconds",
      description:
        "Create your account, invite your team, and choose your modules. Our guided setup wizard configures your workspace based on your industry and team size. You'll be ready to start tracking deals and managing projects within minutes.",
    },
    {
      step: "2",
      title: "Import & Connect",
      description:
        "Import existing contacts from CSV, Google Contacts, or your current CRM. Connect your email for automatic conversation logging and set up payment integrations. CubicleERP pulls in your existing data so you start with a complete picture.",
    },
    {
      step: "3",
      title: "Grow with Confidence",
      description:
        "Start closing deals, sending invoices, and managing your team. As your startup scales, activate additional modules, add users, and customize workflows — all without switching platforms or losing historical data.",
    },
  ],
  useCases: [
    {
      title: "Pre-Seed & Seed Stage",
      description:
        "Founding teams of 2-10 people use CubicleERP as their all-in-one business OS. Track early customer conversations, manage contractor payments, and build the operational foundation that will support rapid growth.",
      highlights: [
        "Free tier for up to 3 users — perfect for co-founders",
        "Simple CRM to track early customer discovery and sales",
        "Basic invoicing and expense tracking for runway management",
      ],
    },
    {
      title: "Series A & Growth Stage",
      description:
        "Post-funding startups scaling from 10 to 100 employees use CubicleERP to professionalize operations. Structured sales processes, formal HR workflows, and detailed financial reporting replace the spreadsheets and ad-hoc tools of the early days.",
      highlights: [
        "Multi-stage sales pipelines with team performance tracking",
        "Full HR suite with onboarding, leave management, and payroll",
        "Investor-ready reporting with MRR, churn, and CAC metrics",
      ],
    },
    {
      title: "B2B SaaS Companies",
      description:
        "SaaS startups use CubicleERP to manage the complete customer lifecycle — from lead generation and demo scheduling to subscription billing and customer success tracking.",
      highlights: [
        "Recurring billing with automatic subscription management",
        "Customer health scoring to reduce churn proactively",
        "Product usage integration for data-driven upsell opportunities",
      ],
    },
  ],
  faqs: [
    {
      question: "Is CubicleERP really free for small teams?",
      answer:
        "Yes. Our Starter plan is completely free for up to 3 users and includes core CRM, basic invoicing, and project management. There's no credit card required, no trial expiration, and no feature lockout. When you're ready to add more users or need advanced features like automation and analytics, you can upgrade to our Growth plan at startup-friendly pricing.",
    },
    {
      question: "How is CubicleERP different from using separate tools?",
      answer:
        "Using separate tools for CRM (HubSpot), projects (Asana), invoicing (Stripe), and HR (Gusto) means your data lives in silos, you pay multiple subscriptions, and your team wastes time switching between apps. CubicleERP combines all these functions in one platform with shared data, consistent UI, and integrated workflows — at a fraction of the combined cost.",
    },
    {
      question: "Can I migrate my data from HubSpot, Notion, or other tools?",
      answer:
        "Absolutely. We support CSV import for contacts, deals, and invoices from any platform. For HubSpot, Salesforce, and Notion, we provide guided migration assistants that map your fields automatically. Our support team also offers free migration assistance for startups switching from other platforms.",
    },
    {
      question: "Do you offer special pricing for accelerator startups?",
      answer:
        "Yes! Startups that are part of Y Combinator, Techstars, 500 Startups, or any recognized accelerator program get 50% off our Growth plan for the first year. Contact our startup team with your accelerator details to activate the discount. We also offer credits through various startup programs and partnerships.",
    },
    {
      question: "What happens as my team grows beyond 50 people?",
      answer:
        "CubicleERP scales seamlessly. As you grow, you can activate advanced modules like workflow automation, custom reporting, and multi-entity management. You'll never need to migrate to a different platform. Many of our enterprise customers started with us at the seed stage and still use CubicleERP at 500+ employees.",
    },
  ],
  stats: [
    { value: "2,000+", label: "Startups trust CubicleERP" },
    { value: "15 min", label: "Average setup time" },
    { value: "60%", label: "Savings vs separate tools" },
    { value: "3x", label: "Faster deal closure" },
  ],
}

export default function StartupsPage() {
  return <ExploreProductPage data={data} />
}
