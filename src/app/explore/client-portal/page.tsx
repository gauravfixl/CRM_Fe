"use client"

import ExploreProductPage from "@/components/landingpage2/explore/ExploreProductPage"
import {
  Globe,
  FileText,
  Eye,
  Receipt,
  MessageSquare,
  BookOpen,
  Palette,
} from "lucide-react"

const data = {
  name: "Client Portal",
  tagline: "Give your clients a seamless self-service experience",
  description:
    "Empower your clients with a branded, secure portal where they can track projects, access invoices, share documents, and communicate with your team — all without a single phone call or email chase.",
  icon: Globe,
  color: "#0067B8",
  lightColor: "#E3F2FD",
  heroImage: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920&q=80",
  variant: 1 as const,
  features: [
    {
      icon: Palette,
      title: "Branded Portal",
      description:
        "Customize the portal with your company logo, colors, and domain so every interaction reflects your brand identity. Clients see a polished, professional experience from login to logout.",
    },
    {
      icon: FileText,
      title: "Document Sharing",
      description:
        "Upload, organize, and share contracts, proposals, deliverables, and reports in a centralized document hub. Version history ensures everyone always works from the latest file.",
    },
    {
      icon: Eye,
      title: "Project Visibility",
      description:
        "Give clients real-time visibility into project milestones, task progress, and upcoming deadlines. Reduce status-update meetings by letting clients see progress on their own schedule.",
    },
    {
      icon: Receipt,
      title: "Invoice & Payment Access",
      description:
        "Clients can view outstanding invoices, download past receipts, and track payment history in one place. Integrated payment links make it easy to settle balances without back-and-forth emails.",
    },
    {
      icon: MessageSquare,
      title: "Communication Hub",
      description:
        "Threaded conversations tied to specific projects or tickets keep discussions organized and searchable. Tag team members, attach files, and maintain a full audit trail of every client interaction.",
    },
    {
      icon: BookOpen,
      title: "Knowledge Base",
      description:
        "Publish FAQs, how-to guides, and onboarding resources your clients can browse anytime. Reduce repetitive questions and help clients find answers instantly with full-text search.",
    },
  ],
  benefits: [
    {
      title: "Higher Client Satisfaction",
      description:
        "Clients love the convenience of checking project status, downloading documents, and paying invoices on their own terms — no waiting for email replies or office hours.",
    },
    {
      title: "Reduced Support Load",
      description:
        "Self-service access to documents, invoices, and project updates means fewer routine inquiries hitting your inbox, freeing your team to focus on high-value work.",
    },
    {
      title: "Complete Transparency",
      description:
        "Real-time project dashboards and shared timelines build trust by keeping clients informed at every stage, eliminating surprises and misaligned expectations.",
    },
    {
      title: "Faster Approvals",
      description:
        "Clients can review deliverables, sign off on milestones, and approve proposals directly in the portal, cutting approval cycles from days to hours.",
    },
    {
      title: "24/7 Access",
      description:
        "Your portal never sleeps. Clients across time zones can log in, retrieve information, and take action whenever it suits them — nights, weekends, or holidays.",
    },
    {
      title: "Professional Image",
      description:
        "A polished, branded portal signals that your business is organized and tech-forward, setting you apart from competitors still relying on email attachments and shared drives.",
    },
  ],
  steps: [
    {
      step: "1",
      title: "Customize Your Portal",
      description:
        "Upload your logo, pick your brand colors, connect a custom domain, and configure which modules — documents, invoices, projects — are visible to clients.",
    },
    {
      step: "2",
      title: "Invite Your Clients",
      description:
        "Send branded invitation emails with one-click sign-up. Set granular permissions so each client sees only their own projects, files, and billing data.",
    },
    {
      step: "3",
      title: "Collaborate Seamlessly",
      description:
        "Share updates, exchange files, collect approvals, and track conversations — all within the portal. Both your team and your clients stay in sync without juggling tools.",
    },
  ],
  useCases: [
    {
      title: "Agencies & Consultants",
      description:
        "Marketing agencies, design studios, and management consultants use the portal to share campaign reports, creative assets, and strategic deliverables with clients while keeping feedback organized in one place.",
      highlights: [
        "Share campaign performance dashboards in real time",
        "Collect creative approvals with inline commenting",
        "Maintain a searchable archive of all project deliverables",
      ],
    },
    {
      title: "IT Service Providers",
      description:
        "Managed service providers and software development firms give clients visibility into sprint progress, infrastructure uptime reports, and support ticket status — reducing status calls and building confidence.",
      highlights: [
        "Provide live project boards showing sprint progress",
        "Publish monthly uptime and SLA compliance reports",
        "Let clients submit and track support requests directly",
      ],
    },
    {
      title: "Legal & Professional Services",
      description:
        "Law firms, accounting practices, and financial advisors use the portal to securely exchange sensitive documents, share billing statements, and keep client communications audit-ready.",
      highlights: [
        "Exchange contracts and filings through encrypted channels",
        "Give clients instant access to billing and retainer balances",
        "Maintain a compliant audit trail of all communications",
      ],
    },
  ],
  faqs: [
    {
      question: "How much can I customize the portal's look and feel?",
      answer:
        "You have full control over branding — upload your logo, set primary and accent colors, choose fonts, and even connect a custom domain (e.g., portal.yourcompany.com). The portal will look and feel like a natural extension of your website.",
    },
    {
      question: "Is the portal secure for sharing sensitive documents?",
      answer:
        "Absolutely. All data is encrypted in transit (TLS 1.3) and at rest (AES-256). Role-based access controls ensure clients only see their own data, and two-factor authentication adds an extra layer of protection for every login.",
    },
    {
      question: "Is there a limit on the number of clients I can invite?",
      answer:
        "No. You can invite unlimited client users across all plans. Each client gets their own isolated workspace, so there is no cross-visibility between accounts. You only pay based on your internal team size and selected feature tier.",
    },
    {
      question: "Can I white-label the portal completely?",
      answer:
        "Yes. On the Professional plan and above, you can remove all CubicleERP branding, use your own domain, and customize email notifications so the entire experience carries your brand — your clients will never see a third-party name.",
    },
    {
      question: "What file types and sizes are supported for sharing?",
      answer:
        "The portal supports all common file types including PDFs, Office documents, images, videos, and compressed archives. Individual files can be up to 500 MB, and there is no limit on total storage per client workspace on paid plans.",
    },
  ],
  stats: [
    { value: "50%", label: "Fewer support tickets" },
    { value: "80%", label: "Client satisfaction rate" },
    { value: "3x", label: "Faster approvals" },
    { value: "24/7", label: "Client availability" },
  ],
}

export default function ClientPortalPage() {
  return <ExploreProductPage data={data} />
}
