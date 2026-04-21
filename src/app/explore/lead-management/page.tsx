"use client"

import ExploreProductPage from "@/components/landingpage2/explore/ExploreProductPage"
import {
  Target,
  Magnet,
  GitBranch,
  Star,
  Bell,
  BarChart3,
} from "lucide-react"

const data = {
  name: "Lead Management",
  tagline: "Capture, qualify, and convert leads with precision and speed",
  description:
    "CubicleERP Lead Management transforms the way your team handles inbound and outbound prospects. From the moment a lead enters your system to the point they become a paying customer, every interaction is tracked, scored, and optimized. Eliminate guesswork, reduce response times, and build a repeatable engine that turns interest into revenue.",
  icon: Target,
  color: "#E8590C",
  lightColor: "#FFF4E6",
  heroImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=80",
  variant: 1 as const,
  features: [
    {
      icon: Magnet,
      title: "Lead Capture",
      description:
        "Automatically capture leads from web forms, landing pages, email campaigns, social media, and third-party integrations into a single unified inbox. Every lead is instantly deduplicated, enriched with company and contact data, and routed to the right sales rep based on territory, product interest, or round-robin rules so no opportunity slips through the cracks.",
    },
    {
      icon: Bell,
      title: "Lead Nurturing",
      description:
        "Design multi-step nurture sequences that deliver the right content at the right time based on each lead's behavior and engagement level. Combine email drips, task reminders, and SMS touchpoints into automated workflows that keep prospects warm and moving toward a buying decision without manual effort from your team.",
    },
    {
      icon: GitBranch,
      title: "Pipeline Tracking",
      description:
        "Visualize your entire lead-to-opportunity pipeline with customizable stages that mirror your real sales process. Drag and drop leads between stages, set stage-specific requirements, and get instant visibility into bottlenecks, stage durations, and conversion rates so you can optimize every step of the journey.",
    },
    {
      icon: Star,
      title: "Lead Scoring",
      description:
        "Assign dynamic scores to every lead based on demographic fit, firmographic data, website activity, email engagement, and custom behavioral triggers. Scoring models update in real time so your team always knows which leads are sales-ready and which need further nurturing, dramatically improving prioritization and close rates.",
    },
    {
      icon: Bell,
      title: "Automated Follow-Ups",
      description:
        "Never let a hot lead go cold with intelligent follow-up automation. Set time-based and event-triggered follow-up sequences that fire automatically when a lead opens an email, visits a pricing page, or goes inactive for a specified period. Your reps receive real-time alerts so they can jump in at the perfect moment.",
    },
    {
      icon: BarChart3,
      title: "Lead Analytics",
      description:
        "Gain deep visibility into your lead funnel with dashboards that track source attribution, conversion rates by channel, average time-to-conversion, and cost per lead. Identify which campaigns, channels, and reps are driving the most qualified pipeline and reallocate resources to maximize ROI.",
    },
  ],
  benefits: [
    {
      title: "Faster Lead Response",
      description:
        "Respond to new leads within minutes instead of hours by automatically routing them to available reps with real-time notifications. Studies show that contacting a lead within five minutes makes you nine times more likely to convert them, and CubicleERP ensures you never miss that window.",
    },
    {
      title: "Higher Conversion Rates",
      description:
        "Focus your team's energy on the leads that matter most with intelligent scoring and qualification workflows. By eliminating time wasted on unqualified prospects and surfacing high-intent buyers, teams using CubicleERP see measurable improvements in their lead-to-opportunity conversion rates.",
    },
    {
      title: "Complete Lead Visibility",
      description:
        "See every lead across every channel, campaign, and rep in a single consolidated view. Filter by source, score, stage, or assigned owner to understand exactly where your leads stand and what actions are needed to keep them progressing toward a deal.",
    },
    {
      title: "Reduced Manual Work",
      description:
        "Automate repetitive tasks like data entry, lead assignment, follow-up scheduling, and status updates. Your sales reps reclaim hours each week that they can reinvest in high-value activities like discovery calls, demos, and relationship building.",
    },
    {
      title: "Consistent Nurturing",
      description:
        "Ensure no lead falls through the cracks with automated nurture sequences that maintain engagement over days, weeks, or months. Whether a lead needs one touchpoint or twenty before they are ready to buy, CubicleERP keeps the conversation going without manual intervention.",
    },
    {
      title: "Actionable Insights",
      description:
        "Replace assumptions with data-driven decisions about your lead generation strategy. Understand which sources deliver the highest quality leads, which messaging resonates most, and where your funnel is leaking so you can continuously improve performance.",
    },
  ],
  steps: [
    {
      step: "1",
      title: "Connect Your Lead Sources",
      description:
        "Integrate your website forms, landing pages, email marketing tools, and advertising platforms with CubicleERP. Leads flow in automatically and are deduplicated, enriched, and assigned to the right reps based on your custom routing rules.",
    },
    {
      step: "2",
      title: "Configure Scoring and Workflows",
      description:
        "Define your ideal customer profile and set up scoring criteria that reflect your business. Build automated nurture sequences, follow-up triggers, and stage-gate requirements so leads are qualified consistently and progressed efficiently.",
    },
    {
      step: "3",
      title: "Convert and Optimize",
      description:
        "Start engaging leads with confidence, track every interaction, and monitor your funnel metrics in real time. Use built-in analytics to identify what is working, refine your approach, and continuously increase your conversion rates.",
    },
  ],
  useCases: [
    {
      title: "Inbound Marketing Teams",
      description:
        "Capture and qualify the flood of leads generated by content marketing, SEO, webinars, and paid campaigns. Automatically score and route leads so your marketing team can prove ROI and your sales team receives only qualified, sales-ready prospects.",
      highlights: [
        "Multi-channel lead capture with automatic source attribution",
        "Marketing-to-sales handoff workflows with SLA tracking",
        "Campaign performance dashboards with cost-per-lead analysis",
      ],
    },
    {
      title: "Outbound Sales Teams",
      description:
        "Give your outbound reps a structured system for managing prospect lists, tracking outreach cadences, and following up consistently. Every call, email, and LinkedIn touch is logged automatically so managers have full visibility into activity and outcomes.",
      highlights: [
        "Outreach sequence management with multi-channel touchpoints",
        "Activity tracking with automated logging for calls and emails",
        "Territory management with round-robin lead distribution",
      ],
    },
    {
      title: "Real Estate and Professional Services",
      description:
        "Manage high volumes of inquiries from property listings, referral networks, and online directories. Track each prospect's requirements, schedule follow-ups around their timeline, and ensure personalized communication at every stage of the relationship.",
      highlights: [
        "Custom lead fields for industry-specific qualification criteria",
        "Automated follow-up reminders based on prospect timelines",
        "Referral source tracking with commission and partner reporting",
      ],
    },
  ],
  faqs: [
    {
      question: "How does CubicleERP capture leads automatically?",
      answer:
        "CubicleERP captures leads from multiple sources including embedded web forms, REST API integrations, email parsing, and direct connections to advertising platforms like Google Ads and Facebook Lead Ads. Each lead is automatically deduplicated against your existing database, enriched with publicly available company data, and routed to the appropriate sales rep based on your configured assignment rules.",
    },
    {
      question: "Can I customize the lead scoring model for my business?",
      answer:
        "Absolutely. CubicleERP provides a flexible scoring engine where you define the criteria and weights that matter to your business. Score leads based on job title, company size, industry, website behavior, email engagement, form submissions, and any custom field. You can create multiple scoring models for different product lines or market segments and adjust them as your understanding of your ideal customer evolves.",
    },
    {
      question: "How do automated follow-up sequences work?",
      answer:
        "You build follow-up sequences using a visual workflow editor. Define triggers such as form submission, email open, page visit, or time elapsed, then specify actions like sending an email, creating a task for a rep, updating the lead stage, or sending a notification. Sequences can branch based on lead behavior so each prospect receives a personalized experience.",
    },
    {
      question: "Does lead management integrate with the rest of CubicleERP?",
      answer:
        "Yes. Lead Management is deeply integrated with CubicleERP CRM, email marketing, helpdesk, and invoicing modules. When a lead converts to a customer, their entire history carries over into the CRM. Marketing campaigns feed directly into lead capture, and once a deal closes, invoicing and onboarding workflows can be triggered automatically.",
    },
    {
      question: "What reporting is available for lead management?",
      answer:
        "CubicleERP includes pre-built dashboards for lead source attribution, funnel conversion rates, average response time, lead aging, rep performance, and campaign ROI. All reports can be filtered by date range, source, assigned rep, or custom fields. You can also build custom reports and schedule them for automatic delivery to stakeholders via email.",
    },
  ],
  stats: [
    { value: "50%", label: "Faster lead response" },
    { value: "35%", label: "Higher conversion rates" },
    { value: "3x", label: "More qualified pipeline" },
    { value: "70%", label: "Less manual data entry" },
  ],
  capabilities: [
    {
      title: "Multi-Channel Lead Capture Engine",
      description:
        "Aggregate leads from every acquisition channel into a single, deduplicated database. CubicleERP connects natively with web forms, landing page builders, advertising platforms, social media lead ads, email inboxes, and third-party data providers so every prospect is captured, enriched, and assigned within seconds of expressing interest.",
      keyPoints: [
        "Native integrations with Google Ads, Facebook Lead Ads, and LinkedIn forms",
        "Automatic deduplication against existing leads, contacts, and customers",
        "Real-time lead enrichment with company size, industry, and contact data",
        "Custom web form builder with drag-and-drop fields and embedded tracking",
      ],
    },
    {
      title: "Behavioral Lead Scoring",
      description:
        "Move beyond static demographic scoring with a behavioral model that tracks every interaction a lead has with your brand. Website visits, email opens, content downloads, webinar attendance, and pricing page views all contribute to a dynamic score that identifies purchase intent in real time.",
      keyPoints: [
        "Configurable scoring rules combining demographic fit and behavioral signals",
        "Score decay for leads that go inactive to keep prioritization current",
        "Multiple scoring models for different product lines or market segments",
        "Sales-readiness threshold triggers that automatically notify assigned reps",
      ],
    },
    {
      title: "Visual Workflow Automation",
      description:
        "Build sophisticated lead nurturing and routing workflows using an intuitive visual editor. Define triggers, conditions, delays, and actions to create multi-step automation sequences that respond to lead behavior in real time — from initial capture through qualification and handoff to sales.",
      keyPoints: [
        "Drag-and-drop workflow builder with branching logic and time delays",
        "Event-based triggers including form submissions, page visits, and email engagement",
        "Multi-channel action steps spanning email, SMS, task creation, and field updates",
        "Workflow performance analytics showing conversion rates at each step",
      ],
    },
    {
      title: "Source Attribution and ROI Analysis",
      description:
        "Understand exactly which marketing channels, campaigns, and content pieces are generating your highest-quality leads. CubicleERP tracks first-touch and multi-touch attribution across the entire buyer journey, connecting marketing spend to pipeline generated and revenue closed.",
      keyPoints: [
        "First-touch and multi-touch attribution models with customizable credit weighting",
        "Campaign-level ROI reporting connecting ad spend to closed revenue",
        "Channel comparison dashboards showing cost per lead and cost per opportunity",
        "UTM parameter tracking with automatic source and medium classification",
      ],
    },
  ],
  integrations: [
    { name: "Google Ads", category: "Advertising" },
    { name: "Facebook Ads", category: "Advertising" },
    { name: "LinkedIn Sales Navigator", category: "Sales Intelligence" },
    { name: "Mailchimp", category: "Email Marketing" },
    { name: "HubSpot", category: "Marketing Automation" },
    { name: "Calendly", category: "Scheduling" },
    { name: "Slack", category: "Communication" },
    { name: "Zoom", category: "Video Conferencing" },
    { name: "Zapier", category: "Integration Platform" },
    { name: "Google Analytics", category: "Analytics" },
    { name: "Typeform", category: "Forms" },
    { name: "Clearbit", category: "Data Enrichment" },
  ],
  testimonials: [
    {
      quote:
        "CubicleERP Lead Management eliminated the black hole where our inbound leads used to disappear. Every lead is now captured, scored, and assigned within minutes. Our sales team's response time went from hours to under five minutes, and our conversion rate reflects it.",
      author: "Michael Torres",
      role: "VP of Sales",
      company: "Apex Growth Partners",
      metric: "35% increase in lead-to-opportunity conversion",
    },
    {
      quote:
        "The lead scoring model helped us stop treating all leads equally. Our reps now focus on the prospects showing real buying intent, and the rest are nurtured automatically until they are ready. Pipeline quality has improved dramatically.",
      author: "Sanya Patel",
      role: "Director of Marketing",
      company: "BrightSignal Technologies",
      metric: "3x increase in qualified pipeline volume",
    },
    {
      quote:
        "We track leads from over a dozen sources, and CubicleERP gives us clear attribution data for every one. For the first time, we can show the board exactly which campaigns are driving revenue and make confident decisions about where to invest our marketing budget.",
      author: "David Hernandez",
      role: "CMO",
      company: "Velox SaaS Inc.",
      metric: "50% improvement in marketing spend efficiency",
    },
  ],
  comparisons: [
    { feature: "Lead Capture", traditional: "Manual entry from forms", cubicleErp: "Auto-capture, all channels" },
    { feature: "Lead Assignment", traditional: "Manual distribution", cubicleErp: "Instant auto-routing" },
    { feature: "Lead Scoring", traditional: "Subjective rep judgment", cubicleErp: "Behavioral AI scoring" },
    { feature: "Follow-Up", traditional: "Calendar reminders", cubicleErp: "Event-triggered automation" },
    { feature: "Attribution", traditional: "Last-click guesswork", cubicleErp: "Multi-touch attribution" },
    { feature: "Nurturing", traditional: "Sporadic manual emails", cubicleErp: "Automated drip sequences" },
  ],
  subNavItems: [
    { label: "Overview", sectionId: "hero" },
    { label: "Features", sectionId: "features" },
    { label: "Capabilities", sectionId: "capabilities" },
    { label: "Benefits", sectionId: "benefits" },
    { label: "Integrations", sectionId: "integrations" },
    { label: "How It Works", sectionId: "how-it-works" },
    { label: "Use Cases", sectionId: "use-cases" },
    { label: "FAQs", sectionId: "faqs" },
    { label: "CRM", href: "/explore/crm" },
    { label: "Email Marketing", href: "/explore/email-marketing" },
    { label: "Analytics", href: "/explore/analytics" },
  ],
}

export default function LeadManagementPage() {
  return <ExploreProductPage data={data} />
}
