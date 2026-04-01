"use client"

import ExploreProductPage from "@/components/landingpage2/explore/ExploreProductPage"
import {
  HeadphonesIcon,
  Ticket,
  Timer,
  BookOpen,
  MessageCircle,
  Route,
  BarChart3,
} from "lucide-react"

const data = {
  name: "Helpdesk",
  tagline: "Deliver exceptional customer support at scale",
  description:
    "Centralize every support request — email, chat, phone, and social — into a single intelligent helpdesk. Automate routing, enforce SLAs, and give your agents the context they need to resolve issues faster than ever.",
  icon: HeadphonesIcon,
  color: "#008575",
  lightColor: "#E0F2F1",
  heroImage: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1920&q=80",
  variant: 2 as const,
  features: [
    {
      icon: Ticket,
      title: "Ticket Management",
      description:
        "Capture requests from every channel into a unified ticket queue. Prioritize, categorize, assign, and track every issue through its full lifecycle with custom statuses and automated workflows.",
    },
    {
      icon: Timer,
      title: "SLA Tracking",
      description:
        "Define response and resolution time targets for different ticket priorities and customer tiers. Real-time SLA clocks, escalation rules, and breach alerts ensure commitments are always met.",
    },
    {
      icon: BookOpen,
      title: "Knowledge Base",
      description:
        "Build a searchable library of help articles, troubleshooting guides, and FAQs. Agents can insert articles into replies with one click, and customers can find answers without ever opening a ticket.",
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description:
        "Embed a real-time chat widget on your website or app. Agents handle multiple conversations simultaneously, share screens, send canned responses, and seamlessly escalate chats to tickets when needed.",
    },
    {
      icon: Route,
      title: "Auto-Routing & Assignment",
      description:
        "Automatically route incoming tickets to the right team or agent based on topic, skill, language, or workload. Round-robin, load-balanced, and skill-based assignment rules keep queues fair and efficient.",
    },
    {
      icon: BarChart3,
      title: "Customer Satisfaction Surveys",
      description:
        "Send CSAT, NPS, or custom surveys after ticket resolution. Track satisfaction trends over time, identify underperforming areas, and tie individual agent performance to customer feedback scores.",
    },
  ],
  benefits: [
    {
      title: "Faster Resolution Times",
      description:
        "Smart routing, canned responses, and contextual customer history give agents everything they need to resolve issues on the first interaction — cutting average resolution time by more than half.",
    },
    {
      title: "Happier Customers",
      description:
        "Quick responses, transparent status updates, and self-service options make customers feel heard and respected, driving loyalty and positive word-of-mouth for your business.",
    },
    {
      title: "Boosted Agent Productivity",
      description:
        "Automated ticket assignment, collision detection, and AI-suggested replies eliminate busywork so agents spend more time solving problems and less time triaging queues.",
    },
    {
      title: "Reduced Support Costs",
      description:
        "Deflect common questions to the knowledge base and chatbots, handle more volume with the same team, and lower the cost-per-ticket as your customer base grows.",
    },
    {
      title: "Consistent Service Quality",
      description:
        "Standardized workflows, SLA enforcement, and mandatory checklists ensure every customer receives the same high-quality experience regardless of which agent handles their request.",
    },
    {
      title: "Actionable Insights",
      description:
        "Real-time dashboards and scheduled reports surface ticket volume trends, bottleneck categories, agent performance metrics, and customer sentiment so you can make data-driven improvements.",
    },
  ],
  steps: [
    {
      step: "1",
      title: "Set Up Your Channels",
      description:
        "Connect your email inboxes, embed the live chat widget, link social accounts, and configure a phone integration. Every channel funnels into one shared inbox automatically.",
    },
    {
      step: "2",
      title: "Manage Tickets Efficiently",
      description:
        "Auto-routing assigns tickets to the right agents. Use SLA timers, internal notes, and collaboration tools to resolve issues quickly while keeping the full team in the loop.",
    },
    {
      step: "3",
      title: "Measure & Improve",
      description:
        "Track CSAT scores, resolution times, and SLA compliance on live dashboards. Identify trends, spot coaching opportunities, and continuously raise the bar on service quality.",
    },
  ],
  useCases: [
    {
      title: "Customer Support Teams",
      description:
        "B2B and B2C support teams use the helpdesk to manage high volumes of inbound requests across email, chat, and social media — maintaining fast response times without adding headcount.",
      highlights: [
        "Unify email, chat, and social requests in a single queue",
        "Automate first responses and common resolutions",
        "Monitor CSAT and agent performance in real time",
      ],
    },
    {
      title: "IT Help Desks",
      description:
        "Internal IT teams rely on the helpdesk to track hardware requests, software issues, access provisioning, and infrastructure incidents with clear SLA targets and escalation paths.",
      highlights: [
        "Categorize tickets by incident, request, and change type",
        "Enforce SLA response and resolution targets per priority",
        "Integrate with asset management and monitoring tools",
      ],
    },
    {
      title: "Service-Based Businesses",
      description:
        "Field service companies, property managers, and maintenance firms use the helpdesk to log service requests, dispatch technicians, and keep customers updated on job progress from start to finish.",
      highlights: [
        "Log service requests with location and priority details",
        "Dispatch and schedule field agents from the ticket view",
        "Send automated status updates as jobs progress",
      ],
    },
  ],
  faqs: [
    {
      question: "Which support channels can I connect?",
      answer:
        "CubicleERP Helpdesk supports email (unlimited inboxes), live chat (embeddable widget), social media (Facebook, X/Twitter, Instagram), phone (via VoIP integrations), and a web-based customer portal. All channels funnel into a single unified inbox.",
    },
    {
      question: "How does ticket automation work?",
      answer:
        "You can create rule-based automations that trigger on ticket creation, update, or time elapsed. Common automations include auto-assigning tickets by category, sending acknowledgment emails, escalating breached SLAs, and closing stale tickets after a set period.",
    },
    {
      question: "Can I set different SLA policies for different customers?",
      answer:
        "Yes. You can define multiple SLA policies based on customer tier, ticket priority, or category. For example, Enterprise clients might have a 1-hour first response target while Standard clients have a 4-hour target. Escalation rules fire automatically when targets are at risk.",
    },
    {
      question: "Does the helpdesk integrate with other CubicleERP modules?",
      answer:
        "Absolutely. Tickets link directly to CRM contacts, project tasks, invoices, and client portal conversations. Agents see full customer context — purchase history, open projects, and past interactions — right inside the ticket view without switching tabs.",
    },
    {
      question: "Are there any AI-powered features?",
      answer:
        "Yes. The helpdesk includes AI-suggested replies based on past resolutions, intelligent ticket classification that auto-tags category and priority, and a smart knowledge base search that recommends relevant articles to both agents and customers as they type.",
    },
  ],
  stats: [
    { value: "60%", label: "Faster resolution time" },
    { value: "95%", label: "SLA compliance rate" },
    { value: "40%", label: "Fewer tickets via self-service" },
    { value: "4.8/5", label: "Average CSAT score" },
  ],
}

export default function HelpdeskPage() {
  return <ExploreProductPage data={data} />
}
