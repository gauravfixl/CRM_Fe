"use client"

import ExploreProductPage from "@/components/landingpage2/explore/ExploreProductPage"
import {
  Users,
  Contact,
  GitBranch,
  Star,
  Mail,
  TrendingUp,
} from "lucide-react"

const data = {
  name: "CRM",
  tagline: "Build stronger customer relationships that drive revenue",
  description:
    "CubicleERP CRM gives your sales team a complete view of every customer interaction, from first touch to closed deal. Track leads, manage pipelines, forecast revenue, and nurture relationships — all from one unified platform built to help you sell smarter and faster.",
  icon: Users,
  color: "#0078D4",
  lightColor: "#E3F2FD",
  heroImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&q=80",
  variant: 1 as const,
  features: [
    {
      icon: Contact,
      title: "Contact Management",
      description:
        "Maintain a 360-degree view of every contact with interaction history, notes, documents, and social profiles. Automatically enrich records with company data so your team always has the context they need before every call.",
    },
    {
      icon: GitBranch,
      title: "Deal Pipeline",
      description:
        "Visualize your entire sales process with customizable pipeline stages. Drag-and-drop deals between stages, set weighted probabilities, and get real-time visibility into which opportunities need attention and which are ready to close.",
    },
    {
      icon: Star,
      title: "Lead Scoring",
      description:
        "Automatically rank and prioritize leads based on engagement signals, demographic fit, and behavioral data. Your sales reps spend time on prospects most likely to convert instead of chasing cold leads.",
    },
    {
      icon: Mail,
      title: "Email Tracking",
      description:
        "Know exactly when prospects open your emails, click links, or download attachments. Sync two-way with Gmail and Outlook so every conversation is logged automatically without manual data entry.",
    },
    {
      icon: TrendingUp,
      title: "Sales Forecasting",
      description:
        "Generate accurate revenue forecasts using historical win rates, pipeline velocity, and deal stage progression. Identify gaps early, adjust strategies in real time, and give leadership confidence in quarterly projections.",
    },
    {
      icon: Users,
      title: "Customer Insights",
      description:
        "Surface actionable intelligence with built-in analytics that reveal buying patterns, churn risk indicators, and upsell opportunities. Understand which accounts are growing and which need proactive outreach.",
    },
  ],
  benefits: [
    {
      title: "Increase Sales Conversion",
      description:
        "Close more deals by giving your team instant access to customer history, communication logs, and deal context. Reps enter meetings prepared and follow up at the right moment with the right message.",
    },
    {
      title: "Reduce Customer Churn",
      description:
        "Spot at-risk accounts before they leave with health scoring and automated alerts. Proactively engage customers who show declining activity or unresolved support tickets.",
    },
    {
      title: "Complete Pipeline Visibility",
      description:
        "See every deal across every rep in a single dashboard. Filter by stage, owner, expected close date, or deal value to instantly understand where your revenue stands and where bottlenecks are forming.",
    },
    {
      title: "Faster Deal Cycles",
      description:
        "Automate repetitive tasks like follow-up reminders, quote generation, and approval workflows. Your team spends less time on admin and more time having conversations that move deals forward.",
    },
    {
      title: "Seamless Team Collaboration",
      description:
        "Share deal notes, tag colleagues, and hand off accounts without losing context. Whether it is SDRs qualifying leads or AEs closing, everyone works from the same source of truth.",
    },
    {
      title: "Data-Driven Decisions",
      description:
        "Replace gut feelings with real metrics. Track win/loss reasons, average deal size, sales cycle length, and rep performance to continuously refine your sales playbook.",
    },
  ],
  steps: [
    {
      step: "1",
      title: "Import Your Contacts",
      description:
        "Upload your existing contacts via CSV or connect directly to your email and calendar. CubicleERP automatically deduplicates records and enriches them with company information.",
    },
    {
      step: "2",
      title: "Set Up Your Pipelines",
      description:
        "Define your sales stages, assign deal owners, and configure automation rules. Customize fields, required data, and stage-gate criteria to match your unique sales process.",
    },
    {
      step: "3",
      title: "Close More Deals",
      description:
        "Start tracking interactions, scoring leads, and forecasting revenue. Use dashboards and reports to coach your team, optimize your funnel, and accelerate time-to-close.",
    },
  ],
  useCases: [
    {
      title: "Sales Teams",
      description:
        "Equip your sales organization with the tools to manage high-volume pipelines, track quota attainment, and prioritize the right accounts at the right time.",
      highlights: [
        "Visual pipeline with drag-and-drop deal management",
        "Automated follow-up sequences and task reminders",
        "Real-time leaderboards and quota tracking dashboards",
      ],
    },
    {
      title: "Account Management",
      description:
        "Give account managers a complete relationship timeline so they can nurture existing customers, identify expansion opportunities, and prevent churn before it happens.",
      highlights: [
        "Full interaction history across calls, emails, and meetings",
        "Account health scoring with renewal tracking",
        "Upsell and cross-sell opportunity identification",
      ],
    },
    {
      title: "Business Development",
      description:
        "Help BDRs and SDRs qualify prospects efficiently with lead scoring, territory management, and structured outreach workflows that keep the top of funnel flowing.",
      highlights: [
        "Lead scoring with automatic routing to the right rep",
        "Territory mapping and round-robin assignment rules",
        "Outreach cadence tracking with engagement analytics",
      ],
    },
  ],
  faqs: [
    {
      question: "What CRM capabilities does CubicleERP include out of the box?",
      answer:
        "CubicleERP CRM includes contact and company management, deal pipeline tracking, lead scoring, email integration with open and click tracking, sales forecasting, activity logging, task automation, customizable dashboards, and role-based access controls. All features are available on every plan with no per-feature add-ons.",
    },
    {
      question: "Does CubicleERP CRM integrate with my existing tools?",
      answer:
        "Yes. CubicleERP CRM integrates natively with Gmail, Outlook, Google Calendar, and popular communication tools. It also connects with CubicleERP's own accounting, invoicing, and project management modules so your sales data flows seamlessly into billing and delivery workflows.",
    },
    {
      question: "How do I migrate data from my current CRM?",
      answer:
        "We provide a guided import wizard that accepts CSV and Excel files. For migrations from Salesforce, HubSpot, or Zoho, our support team offers assisted migration at no extra cost, including field mapping, data validation, and deduplication to ensure a clean transition.",
    },
    {
      question: "Is there a mobile app for accessing CRM on the go?",
      answer:
        "CubicleERP CRM is fully responsive and works in any mobile browser. A dedicated mobile app for iOS and Android is on our roadmap and will include offline access, push notifications for deal updates, and a quick-log feature for capturing meeting notes in the field.",
    },
    {
      question: "How does pricing work for the CRM module?",
      answer:
        "CubicleERP CRM is included in all CubicleERP plans. You pay per user per month with no hidden fees for storage, API calls, or additional modules. Volume discounts are available for teams of 10 or more. Start with a 14-day free trial — no credit card required.",
    },
  ],
  stats: [
    { value: "40%", label: "More deals closed" },
    { value: "60%", label: "Faster lead response time" },
    { value: "3x", label: "Pipeline visibility" },
    { value: "25%", label: "Revenue growth" },
  ],
}

export default function CRMPage() {
  return <ExploreProductPage data={data} />
}
