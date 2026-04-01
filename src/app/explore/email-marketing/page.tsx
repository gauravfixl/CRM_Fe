"use client"

import ExploreProductPage from "@/components/landingpage2/explore/ExploreProductPage"
import {
  Mail,
  MousePointerClick,
  Users,
  FlaskConical,
  Workflow,
  BarChart3,
  LayoutTemplate,
} from "lucide-react"

const data = {
  name: "Email Marketing",
  tagline: "Create campaigns that convert and grow your audience",
  description:
    "CubicleERP Email Marketing puts powerful campaign tools in the hands of every marketer. Design stunning emails with a drag-and-drop builder, segment your audience for precision targeting, automate nurture sequences, and track every open, click, and conversion in real time.",
  icon: Mail,
  color: "#7B1FA2",
  lightColor: "#F3E5F5",
  heroImage: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=1920&q=80",
  variant: 4 as const,

  features: [
    {
      icon: MousePointerClick,
      title: "Drag-and-Drop Builder",
      description:
        "Create professional, responsive emails without writing a single line of code. Choose from pre-built content blocks -- headers, product grids, countdown timers, social links -- and arrange them visually. Live preview shows exactly how your email renders on desktop, tablet, and mobile.",
    },
    {
      icon: Users,
      title: "Audience Segmentation",
      description:
        "Divide your contact list using demographic data, purchase history, engagement scores, and custom fields. Build dynamic segments that update automatically as contacts meet your criteria, ensuring every recipient gets content that is relevant to them.",
    },
    {
      icon: FlaskConical,
      title: "A/B Testing",
      description:
        "Test subject lines, sender names, email content, and send times against each other. CubicleERP automatically splits your audience, measures open and click-through rates, and sends the winning variation to the remaining contacts for maximum impact.",
    },
    {
      icon: Workflow,
      title: "Automation Sequences",
      description:
        "Build multi-step drip campaigns triggered by sign-ups, purchases, abandoned carts, or any custom event. Add delays, conditional branches, and goal checks to guide each contact through a personalized journey without manual intervention.",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description:
        "Monitor opens, clicks, bounces, unsubscribes, and revenue attribution from a single dashboard. Drill down into individual campaign performance, compare results across time periods, and export reports for stakeholder presentations.",
    },
    {
      icon: LayoutTemplate,
      title: "Template Library",
      description:
        "Access over 300 professionally designed email templates organized by industry and use case -- product launches, newsletters, event invitations, re-engagement campaigns, and more. Customize colors, fonts, and imagery to match your brand in minutes.",
    },
  ],

  benefits: [
    {
      title: "Higher Open Rates",
      description:
        "Smart send-time optimization delivers emails when each individual contact is most likely to open them. Combined with AI-powered subject line suggestions, CubicleERP users see average open rates 35% above industry benchmarks.",
    },
    {
      title: "Better Targeting",
      description:
        "Dynamic segmentation ensures your message reaches the right people at the right time. Stop blasting your entire list and start sending personalized content that resonates with each segment's interests and buying stage.",
    },
    {
      title: "Save Hours Every Week",
      description:
        "Automation sequences handle welcome series, follow-ups, and re-engagement campaigns on autopilot. What used to take hours of manual list management and scheduling now runs in the background 24/7.",
    },
    {
      title: "Increase Conversions",
      description:
        "A/B testing takes the guesswork out of campaign optimization. Continuously test and refine your messaging to drive more clicks, more sign-ups, and more purchases from every send.",
    },
    {
      title: "Brand Consistency",
      description:
        "Lock brand colors, logos, fonts, and footer content into reusable templates so every email your team sends is on-brand. Approval workflows ensure nothing goes out without a final review.",
    },
    {
      title: "Measurable ROI",
      description:
        "Revenue attribution ties every dollar of sales back to the specific campaign and email that drove it. Know exactly which campaigns pay for themselves and which need optimization.",
    },
  ],

  steps: [
    {
      step: "1",
      title: "Build Your List",
      description:
        "Import existing contacts via CSV or sync automatically from your CRM, e-commerce platform, or sign-up forms. CubicleERP deduplicates entries, validates email addresses, and segments contacts on import.",
    },
    {
      step: "2",
      title: "Create Campaigns",
      description:
        "Pick a template or start from scratch with the drag-and-drop builder. Personalize content with merge tags, set up A/B tests, choose your audience segment, and schedule the send or trigger an automation.",
    },
    {
      step: "3",
      title: "Analyze & Optimize",
      description:
        "Watch results roll in on the real-time analytics dashboard. Identify top-performing content, refine underperforming segments, and let CubicleERP's AI recommendations guide your next campaign for continuously improving results.",
    },
  ],

  useCases: [
    {
      title: "Marketing Teams",
      description:
        "Run multi-channel campaigns from a single platform. Coordinate email sends with landing pages, social posts, and CRM follow-ups. Shared dashboards keep the entire team aligned on performance goals and campaign calendars.",
      highlights: [
        "Collaborative campaign calendar with role-based editing",
        "Shared template library with brand-locked design elements",
        "Cross-channel attribution reporting across email and web",
      ],
    },
    {
      title: "E-commerce",
      description:
        "Drive repeat purchases with automated post-purchase sequences, abandoned cart recovery emails, and personalized product recommendations. Sync your product catalog to dynamically populate emails with the latest inventory and pricing.",
      highlights: [
        "Abandoned cart recovery with dynamic product images",
        "Post-purchase review requests and upsell sequences",
        "Revenue-per-email tracking tied to your storefront data",
      ],
    },
    {
      title: "SaaS Companies",
      description:
        "Nurture trial users into paying customers with behavior-triggered onboarding sequences. Send feature announcements, usage tips, and renewal reminders that are timed to each user's lifecycle stage.",
      highlights: [
        "Trial-to-paid conversion drip campaigns with goal tracking",
        "In-app event triggers for contextual follow-up emails",
        "Churn prevention sequences based on declining usage signals",
      ],
    },
  ],

  faqs: [
    {
      question: "How does CubicleERP ensure high email deliverability?",
      answer:
        "CubicleERP maintains dedicated, reputation-monitored IP pools with SPF, DKIM, and DMARC authentication configured out of the box. Our deliverability engine automatically throttles send rates per ISP, handles bounce processing, and suppresses invalid addresses to keep your sender reputation strong and your inbox placement above 99%.",
    },
    {
      question: "Is there a limit on the number of contacts I can store?",
      answer:
        "Contact limits depend on your plan tier. The Starter plan supports up to 5,000 contacts, Growth supports up to 50,000, and Enterprise plans offer unlimited contacts. All plans allow unlimited email sends per month, so you never have to worry about overage charges.",
    },
    {
      question: "Can I use my own email templates or only the built-in ones?",
      answer:
        "Both. You can start from any of our 300+ professionally designed templates or import your own custom HTML. The drag-and-drop builder also lets you create templates from scratch and save them to your team library for reuse across future campaigns.",
    },
    {
      question: "How do automation sequences work?",
      answer:
        "Automations are visual workflows triggered by events like a form submission, a purchase, or a date-based rule. You add steps -- send email, wait, check condition, update contact field -- and CubicleERP executes them automatically. Each contact progresses through the workflow at their own pace, and you can monitor active contacts in each stage from the automation dashboard.",
    },
    {
      question: "Does Email Marketing integrate with CubicleERP CRM?",
      answer:
        "Yes, the integration is native and real-time. Contacts, deals, and engagement data flow bidirectionally between Email Marketing and CRM. Sales reps can see which emails a lead has opened, and marketers can segment audiences based on deal stage, revenue, or any CRM field -- all without third-party connectors.",
    },
  ],

  stats: [
    { value: "35%", label: "Average open rate" },
    { value: "300+", label: "Ready-to-use templates" },
    { value: "99.5%", label: "Email delivery rate" },
    { value: "2.5x", label: "Average ROI improvement" },
  ],
}

export default function EmailMarketingPage() {
  return <ExploreProductPage data={data} />
}
