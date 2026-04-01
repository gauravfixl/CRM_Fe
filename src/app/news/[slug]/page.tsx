"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import LP2Navbar from "@/components/landingpage2/LP2Navbar"
import LP2CTA from "@/components/landingpage2/LP2CTA"
import LP2Footer from "@/components/landingpage2/LP2Footer"
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  User,
  Share2,
  Bookmark,
  Brain,
  Target,
  TrendingUp,
  Users,
  BarChart3,
  Zap,
  Shield,
  Lock,
  FileText,
  BookOpen,
  Sparkles,
  Building2,
  CheckCircle2,
  Quote,
  type LucideIcon,
} from "lucide-react"

interface NewsArticle {
  slug: string
  tag: string
  tagColor: string
  title: string
  subtitle: string
  description: string
  heroImage: string
  gradient: string
  date: string
  readTime: string
  author: { name: string; role: string; avatar: string }
  sections: {
    heading: string
    content: string
    image?: string
    highlights?: string[]
    quote?: { text: string; author: string }
  }[]
  relatedSlugs: string[]
}

const articles: Record<string, NewsArticle> = {
  "ai-powered-lead-scoring": {
    slug: "ai-powered-lead-scoring",
    tag: "Product Update",
    tagColor: "bg-blue-500",
    title: "Introducing AI-Powered Lead Scoring",
    subtitle:
      "Automatically score and prioritize your leads using advanced machine learning algorithms",
    description:
      "Cubicle now uses machine learning to automatically score and prioritize your leads based on engagement patterns.",
    heroImage:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop&q=80",
    gradient: "from-[#0067B8] via-[#0078D4] to-[#2B88D8]",
    date: "Mar 28, 2026",
    readTime: "5 min read",
    author: {
      name: "Sarah Chen",
      role: "Head of Product",
      avatar: "SC",
    },
    sections: [
      {
        heading: "The Problem with Manual Lead Scoring",
        content:
          "Traditional lead scoring relies on static rules and manual point assignments. Sales teams spend hours categorizing leads, often missing high-value prospects hidden in their pipeline. With growing data volumes, these manual approaches simply don't scale. Marketing teams set arbitrary thresholds, and sales reps waste time chasing leads that never convert — while hot prospects go cold waiting for follow-up.",
        image:
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop&q=80",
      },
      {
        heading: "How Our AI Scoring Works",
        content:
          "Our new AI engine analyzes over 50 behavioral signals across email engagement, website visits, form submissions, social interactions, and CRM activity. The model continuously learns from your team's historical conversion data to build a scoring model unique to your business. Every lead receives a dynamic score from 0-100, updated in real-time as new interactions occur.",
        highlights: [
          "Analyzes 50+ behavioral signals in real-time",
          "Self-learning model adapts to your conversion patterns",
          "Dynamic scores update with every new interaction",
          "Integrates with your existing CRM workflows seamlessly",
          "Predictive insights forecast conversion probability",
        ],
      },
      {
        heading: "Real Results from Early Adopters",
        content:
          "During our beta program, teams using AI-powered lead scoring saw a 40% increase in conversion rates and 60% reduction in time spent on lead qualification. Sales teams reported closing deals faster because they focused on the right prospects from the start. The AI eliminated guesswork and enabled data-driven prioritization at scale.",
        quote: {
          text: "We went from spending 3 hours a day qualifying leads to letting the AI do it in seconds. Our conversion rate jumped from 12% to 19% in the first month.",
          author: "Michael Torres, VP of Sales at GrowthStack",
        },
      },
      {
        heading: "Getting Started",
        content:
          "AI Lead Scoring is available today for all Business and Enterprise plans at no additional cost. Simply navigate to Settings > Lead Management > AI Scoring to enable the feature. The model begins learning from your data immediately and delivers actionable scores within 48 hours. Our onboarding team is available to help you configure scoring thresholds and automated workflows.",
        highlights: [
          "Available on Business and Enterprise plans",
          "Zero-config setup — enable with one click",
          "Actionable scores delivered within 48 hours",
          "Free onboarding assistance from our team",
        ],
      },
    ],
    relatedSlugs: [
      "agencies-scale-operations",
      "enterprise-security-features",
    ],
  },
  "agencies-scale-operations": {
    slug: "agencies-scale-operations",
    tag: "Case Study",
    tagColor: "bg-emerald-500",
    title: "How Agencies Use Cubicle to Scale Operations",
    subtitle:
      "A deep dive into how digital agencies manage clients, projects, and teams on one platform",
    description:
      "Discover how digital agencies manage clients, projects, and teams using our all-in-one platform.",
    heroImage:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&h=600&fit=crop&q=80",
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    date: "Mar 22, 2026",
    readTime: "7 min read",
    author: {
      name: "James Walker",
      role: "Customer Success Lead",
      avatar: "JW",
    },
    sections: [
      {
        heading: "The Agency Challenge",
        content:
          "Digital agencies juggle multiple clients, tight deadlines, and diverse project types simultaneously. Most rely on a patchwork of tools — one for project management, another for invoicing, a third for CRM, and spreadsheets to tie everything together. This fragmentation leads to missed deadlines, billing errors, and poor visibility into profitability. As agencies grow, these problems compound exponentially.",
        image:
          "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=400&fit=crop&q=80",
      },
      {
        heading: "One Platform, Every Workflow",
        content:
          "CubicleERP brings client management, project tracking, resource allocation, time logging, and invoicing into a single unified platform. Agencies can see the full picture — from initial client pitch to final invoice — without switching between tools. Custom dashboards give account managers real-time visibility into project health, team utilization, and revenue forecasts.",
        highlights: [
          "Unified client and project management",
          "Automated time tracking and billing",
          "Resource allocation with capacity planning",
          "Real-time profitability dashboards",
          "Client portal for transparent collaboration",
        ],
      },
      {
        heading: "Case Study: PixelForge Creative",
        content:
          "PixelForge Creative, a 45-person digital agency based in Austin, switched to CubicleERP after outgrowing their previous tool stack. Within 3 months, they reduced administrative overhead by 35%, improved project delivery timelines by 28%, and gained full visibility into per-client profitability for the first time. Their operations manager credits the unified platform for enabling them to take on 40% more clients without adding headcount.",
        quote: {
          text: "Before Cubicle, we had no idea which clients were actually profitable. Now we have real-time margins on every project. It completely changed how we price and prioritize work.",
          author: "Lisa Park, Operations Manager at PixelForge Creative",
        },
      },
      {
        heading: "Key Takeaways for Agencies",
        content:
          "The most successful agencies on our platform share common traits: they centralize all operations in one tool, automate repetitive billing and reporting tasks, and use data to make strategic decisions about which clients and services to prioritize. Whether you're a boutique consultancy or a full-service agency, CubicleERP adapts to your workflow — not the other way around.",
        highlights: [
          "Centralize operations to eliminate tool fragmentation",
          "Automate billing cycles to reduce errors by 90%",
          "Use profitability data to guide strategic decisions",
          "Scale your team without scaling your tech stack",
        ],
      },
    ],
    relatedSlugs: [
      "ai-powered-lead-scoring",
      "cubicle-vs-traditional-crm",
    ],
  },
  "enterprise-security-features": {
    slug: "enterprise-security-features",
    tag: "Security",
    tagColor: "bg-purple-500",
    title: "Enterprise Security Features Now Available",
    subtitle:
      "SOC2 compliance, advanced RBAC, and comprehensive audit logs for every plan",
    description:
      "SOC2 compliance, advanced RBAC, and comprehensive audit logs — enterprise-grade security for every plan.",
    heroImage:
      "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=1200&h=600&fit=crop&q=80",
    gradient: "from-purple-500 via-violet-500 to-indigo-500",
    date: "Mar 15, 2026",
    readTime: "6 min read",
    author: {
      name: "David Kim",
      role: "Head of Security",
      avatar: "DK",
    },
    sections: [
      {
        heading: "Security as a Foundation",
        content:
          "As businesses move more critical operations to cloud platforms, security isn't just a feature — it's a requirement. Our customers told us they needed enterprise-grade security without the enterprise-grade price tag. Today, we're delivering exactly that. Every CubicleERP plan now includes security capabilities that were previously reserved for our highest tier.",
        image:
          "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?w=800&h=400&fit=crop&q=80",
      },
      {
        heading: "What's New",
        content:
          "This release includes three major security enhancements that bring CubicleERP in line with the strictest compliance requirements. These features have been built from the ground up with input from our security advisory board and validated through independent third-party audits.",
        highlights: [
          "SOC2 Type II compliance — independently audited and certified",
          "Advanced RBAC with granular field-level permissions",
          "Comprehensive audit logs with 365-day retention",
          "SSO integration with SAML 2.0 and OpenID Connect",
          "Data encryption at rest (AES-256) and in transit (TLS 1.3)",
          "Automated vulnerability scanning and penetration testing",
        ],
      },
      {
        heading: "Built for Regulated Industries",
        content:
          "Healthcare organizations need HIPAA compliance. Financial services require SOX controls. Legal firms demand client confidentiality. CubicleERP now meets all of these requirements out of the box. Our platform has been certified by independent auditors and is trusted by organizations handling sensitive data across every major regulated industry.",
        quote: {
          text: "We evaluated 12 platforms before choosing Cubicle. Their security posture exceeded tools costing 5x more. The SOC2 certification and granular RBAC sealed the deal for our compliance team.",
          author: "Dr. Rachel Green, CTO at MedTech Solutions",
        },
      },
      {
        heading: "Enabling Security for Your Team",
        content:
          "All new security features are available immediately in your admin dashboard under Settings > Security & Compliance. We've also published detailed configuration guides and best practices documentation. Our security team offers complimentary security reviews for Enterprise customers to ensure optimal configuration for your specific compliance requirements.",
        highlights: [
          "Available immediately on all plans",
          "Step-by-step configuration guides in Help Center",
          "Complimentary security reviews for Enterprise customers",
          "24/7 security incident response team",
        ],
      },
    ],
    relatedSlugs: [
      "ai-powered-lead-scoring",
      "cubicle-vs-traditional-crm",
    ],
  },
  "cubicle-vs-traditional-crm": {
    slug: "cubicle-vs-traditional-crm",
    tag: "Guide",
    tagColor: "bg-amber-500",
    title: "Cubicle vs Traditional CRM: A Complete Guide",
    subtitle:
      "Why modern businesses are choosing unified ERP platforms over standalone CRM tools",
    description:
      "Why modern businesses are choosing unified ERP platforms over standalone CRM tools.",
    heroImage:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop&q=80",
    gradient: "from-amber-500 via-orange-500 to-red-400",
    date: "Mar 10, 2026",
    readTime: "8 min read",
    author: {
      name: "Emily Rodriguez",
      role: "Content Strategist",
      avatar: "ER",
    },
    sections: [
      {
        heading: "The CRM Landscape is Changing",
        content:
          "For over two decades, standalone CRM tools dominated the market. Businesses invested heavily in platforms designed solely to manage customer relationships. But as operations grew more complex, teams found themselves stitching together multiple tools — a CRM here, a project manager there, an invoicing tool somewhere else. The result? Data silos, integration headaches, and a fragmented view of the business.",
        image:
          "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=400&fit=crop&q=80",
      },
      {
        heading: "The True Cost of Standalone Tools",
        content:
          "The sticker price of a CRM is just the beginning. When you factor in integrations, data migration, training on multiple platforms, and the productivity lost to context-switching, the real cost can be 3-5x the subscription fee. A recent study found that the average mid-size business uses 137 different SaaS applications, spending 30% of their IT budget just on integrations and data synchronization between them.",
        highlights: [
          "Integration costs can exceed subscription fees by 3-5x",
          "Average employee switches between 10+ apps daily",
          "Data sync errors cause 25% of reported CRM issues",
          "Training costs multiply with each additional tool",
          "Security risks increase with every new integration point",
        ],
      },
      {
        heading: "The Unified Platform Advantage",
        content:
          "CubicleERP takes a fundamentally different approach. Instead of bolting together separate tools, we built CRM, HRM, project management, invoicing, and analytics into a single platform from the ground up. Every module shares the same database, the same user interface, and the same permission system. When a sales rep closes a deal, the project team sees it instantly. When hours are logged, invoices update automatically. No integrations required.",
        quote: {
          text: "Switching from Salesforce + Asana + FreshBooks to CubicleERP saved us $47,000 annually and gave us a single source of truth for the first time in our company's history.",
          author: "Mark Stevens, CEO at Brightline Consulting",
        },
      },
      {
        heading: "Making the Switch",
        content:
          "Migrating from a standalone CRM to a unified platform might seem daunting, but it doesn't have to be. CubicleERP includes built-in migration tools for Salesforce, HubSpot, Zoho, and Pipedrive. Our dedicated migration team handles the heavy lifting — mapping fields, transferring data, and validating everything before you go live. Most teams are fully operational within 2 weeks, with zero data loss.",
        highlights: [
          "Built-in migration from Salesforce, HubSpot, Zoho, Pipedrive",
          "Dedicated migration team at no extra cost",
          "Full data validation before going live",
          "Average migration time: 2 weeks or less",
          "30-day parallel run option for zero-risk transition",
        ],
      },
    ],
    relatedSlugs: [
      "agencies-scale-operations",
      "enterprise-security-features",
    ],
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: "easeOut" },
  }),
}

export default function NewsArticlePage() {
  const params = useParams()
  const slug = params.slug as string
  const article = articles[slug]

  if (!article) {
    return (
      <div
        className="min-h-screen bg-white"
        style={{
          fontFamily:
            "'Segoe UI', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        <LP2Navbar />
        <div className="max-w-[1280px] mx-auto px-6 py-32 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-[#1A1A1A] mb-4">
              Article Not Found
            </h1>
            <p className="text-[#6B7280] text-lg mb-8">
              The article you&apos;re looking for doesn&apos;t exist or has been
              moved.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-[#0067B8] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#005DA6] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </motion.div>
        </div>
        <LP2Footer />
      </div>
    )
  }

  const relatedArticles = article.relatedSlugs
    .map((s) => articles[s])
    .filter(Boolean)

  return (
    <div
      className="min-h-screen bg-white"
      style={{
        fontFamily:
          "'Segoe UI', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <LP2Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Hero Image */}
        <div className="relative h-[400px] sm:h-[480px] lg:h-[520px]">
          <img
            src={article.heroImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div
            className={`absolute inset-0 bg-gradient-to-br ${article.gradient} opacity-70 mix-blend-multiply`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Hero content */}
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-[1280px] mx-auto px-6 pb-12 w-full">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 mb-5">
                  <Link
                    href="/"
                    className="text-white/70 text-[13px] hover:text-white transition-colors"
                  >
                    Home
                  </Link>
                  <span className="text-white/40 text-xs">/</span>
                  <Link
                    href="/#featured-news"
                    className="text-white/70 text-[13px] hover:text-white transition-colors"
                  >
                    News
                  </Link>
                  <span className="text-white/40 text-xs">/</span>
                  <span className="text-white/90 text-[13px]">
                    {article.tag}
                  </span>
                </div>

                {/* Tag */}
                <span
                  className={`inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wide uppercase px-3 py-1.5 rounded-full ${article.tagColor} text-white mb-4`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
                  {article.tag}
                </span>

                {/* Title */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight max-w-3xl">
                  {article.title}
                </h1>

                {/* Subtitle */}
                <p className="text-white/80 text-[16px] sm:text-lg mt-4 max-w-2xl leading-relaxed">
                  {article.subtitle}
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Meta Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="border-b border-[#F0F0F0] bg-white sticky top-0 z-30"
      >
        <div className="max-w-[1280px] mx-auto px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-5 flex-wrap">
            {/* Author */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0067B8] to-[#5C2D91] flex items-center justify-center text-white text-xs font-bold">
                {article.author.avatar}
              </div>
              <div>
                <p className="text-[13px] font-semibold text-[#1A1A1A]">
                  {article.author.name}
                </p>
                <p className="text-[11px] text-[#9CA3AF]">
                  {article.author.role}
                </p>
              </div>
            </div>
            <span className="hidden sm:block w-px h-8 bg-[#E5E7EB]" />
            <div className="flex items-center gap-4 text-[12px] text-[#6B7280]">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {article.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {article.readTime}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 text-[12px] text-[#6B7280] px-3 py-2 rounded-lg hover:bg-[#F3F4F6] transition-colors">
              <Share2 className="w-3.5 h-3.5" />
              Share
            </button>
            <button className="flex items-center gap-1.5 text-[12px] text-[#6B7280] px-3 py-2 rounded-lg hover:bg-[#F3F4F6] transition-colors">
              <Bookmark className="w-3.5 h-3.5" />
              Save
            </button>
          </div>
        </div>
      </motion.div>

      {/* Article Content with Sidebar */}
      <article className="max-w-[1280px] mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {article.sections.map((section, i) => (
              <motion.div
                key={i}
                custom={i * 0.15}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                className="mb-16 last:mb-0"
              >
                <h2 className="text-2xl sm:text-[1.75rem] font-bold text-[#1A1A1A] mb-5 leading-snug">
                  {section.heading}
                </h2>

                {section.image && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="relative rounded-2xl overflow-hidden mb-6 shadow-lg"
                  >
                    <img
                      src={section.image}
                      alt={section.heading}
                      className="w-full h-[280px] sm:h-[340px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                  </motion.div>
                )}

                <p className="text-[15px] sm:text-[16px] text-[#4B5563] leading-[1.8] mb-6">
                  {section.content}
                </p>

                {section.highlights && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="bg-gradient-to-br from-[#F8FAFC] to-[#EBF3FB] rounded-2xl p-6 sm:p-8 border border-[#E5E7EB]"
                  >
                    <ul className="space-y-3.5">
                      {section.highlights.map((h, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.08 }}
                          className="flex items-start gap-3"
                        >
                          <CheckCircle2 className="w-5 h-5 text-[#0067B8] shrink-0 mt-0.5" />
                          <span className="text-[14px] sm:text-[15px] text-[#374151] leading-relaxed">
                            {h}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {section.quote && (
                  <motion.blockquote
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="relative mt-8 bg-white rounded-2xl p-6 sm:p-8 border-l-4 border-[#0067B8] shadow-sm"
                  >
                    <Quote className="w-8 h-8 text-[#0067B8]/20 mb-3" />
                    <p className="text-[15px] sm:text-[16px] text-[#1A1A1A] italic leading-[1.8] font-medium">
                      &ldquo;{section.quote.text}&rdquo;
                    </p>
                    <footer className="mt-4 flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-[#0067B8]" />
                      <cite className="text-[13px] text-[#6B7280] not-italic font-semibold">
                        {section.quote.author}
                      </cite>
                    </footer>
                  </motion.blockquote>
                )}
              </motion.div>
            ))}
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-[340px] shrink-0">
            <div className="lg:sticky lg:top-20 space-y-6">
              {/* Table of Contents */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-2xl border border-[#F0F0F0] p-6"
              >
                <h3 className="text-[13px] font-semibold text-[#1A1A1A] uppercase tracking-wider mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#0067B8]" />
                  In this article
                </h3>
                <nav className="space-y-1">
                  {article.sections.map((section, i) => (
                    <div
                      key={i}
                      className="group flex items-center gap-2.5 py-2 cursor-pointer"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D1D5DB] group-hover:bg-[#0067B8] transition-colors shrink-0" />
                      <span className="text-[13px] text-[#6B7280] group-hover:text-[#0067B8] transition-colors leading-snug">
                        {section.heading}
                      </span>
                    </div>
                  ))}
                </nav>
              </motion.div>

              {/* Newsletter */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-gradient-to-br from-[#0067B8] to-[#0078D4] rounded-2xl p-6 text-white"
              >
                <h3 className="text-[15px] font-bold mb-2">Stay in the loop</h3>
                <p className="text-white/75 text-[12.5px] leading-relaxed mb-4">
                  Get the latest product updates, tips, and insights delivered to your inbox.
                </p>
                <div className="space-y-2.5">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white/15 border border-white/20 text-white placeholder:text-white/50 text-[13px] focus:outline-none focus:border-white/50 transition-colors"
                  />
                  <button className="w-full px-3.5 py-2.5 rounded-lg bg-white text-[#0067B8] font-semibold text-[13px] hover:bg-white/90 transition-colors">
                    Subscribe
                  </button>
                </div>
              </motion.div>

              {/* Author Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white rounded-2xl border border-[#F0F0F0] p-6"
              >
                <h3 className="text-[13px] font-semibold text-[#1A1A1A] uppercase tracking-wider mb-4 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#0067B8]" />
                  Written by
                </h3>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0067B8] to-[#5C2D91] flex items-center justify-center text-white text-sm font-bold">
                    {article.author.avatar}
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-[#1A1A1A]">
                      {article.author.name}
                    </p>
                    <p className="text-[12px] text-[#9CA3AF]">
                      {article.author.role}
                    </p>
                  </div>
                </div>
                <p className="text-[12.5px] text-[#6B7280] leading-relaxed">
                  Passionate about building tools that help businesses grow. Sharing insights on product strategy and innovation at CubicleERP.
                </p>
              </motion.div>

              {/* Tags */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-white rounded-2xl border border-[#F0F0F0] p-6"
              >
                <h3 className="text-[13px] font-semibold text-[#1A1A1A] uppercase tracking-wider mb-4">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[article.tag, "CubicleERP", "Business", "SaaS", "Productivity"].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 rounded-full bg-[#F3F4F6] text-[12px] text-[#4B5563] font-medium hover:bg-[#EBF3FB] hover:text-[#0067B8] transition-colors cursor-pointer"
                      >
                        {tag}
                      </span>
                    )
                  )}
                </div>
              </motion.div>

              {/* Quick Links */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="bg-[#FAFBFC] rounded-2xl border border-[#F0F0F0] p-6"
              >
                <h3 className="text-[13px] font-semibold text-[#1A1A1A] uppercase tracking-wider mb-4">
                  Quick Links
                </h3>
                <div className="space-y-2.5">
                  {[
                    { label: "Try CubicleERP Free", href: "/auth/signup" },
                    { label: "See Pricing Plans", href: "/pricing-overview" },
                    { label: "Contact Sales", href: "/support" },
                    { label: "Help Center", href: "/resources" },
                  ].map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="group flex items-center justify-between py-1.5"
                    >
                      <span className="text-[13px] text-[#6B7280] group-hover:text-[#0067B8] transition-colors">
                        {link.label}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#D1D5DB] group-hover:text-[#0067B8] group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  ))}
                </div>
              </motion.div>
            </div>
          </aside>
        </div>
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="bg-[#FAFBFC] py-16 border-t border-[#F0F0F0]">
          <div className="max-w-[1280px] mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <h3 className="text-2xl font-bold text-[#1A1A1A]">
                Related Articles
              </h3>
              <p className="text-[#6B7280] text-[14px] mt-2">
                Continue reading more from CubicleERP
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedArticles.map((related, i) => (
                <motion.div
                  key={related.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={`/news/${related.slug}`}
                    className="group flex flex-col sm:flex-row gap-5 bg-white rounded-2xl overflow-hidden border border-[#F0F0F0] hover:shadow-lg hover:border-[#0067B8]/20 transition-all duration-300"
                  >
                    <div className="relative w-full sm:w-[220px] h-[180px] sm:h-auto shrink-0 overflow-hidden">
                      <img
                        src={related.heroImage}
                        alt={related.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${related.gradient} opacity-50 mix-blend-multiply`}
                      />
                    </div>
                    <div className="flex flex-col justify-center p-5 sm:py-5 sm:pr-5 sm:pl-0">
                      <span
                        className={`inline-flex self-start items-center text-[10px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full ${related.tagColor} text-white mb-3`}
                      >
                        {related.tag}
                      </span>
                      <h4 className="text-[16px] font-bold text-[#1A1A1A] group-hover:text-[#0067B8] transition-colors leading-snug">
                        {related.title}
                      </h4>
                      <p className="text-[13px] text-[#6B7280] mt-2 line-clamp-2">
                        {related.description}
                      </p>
                      <span className="flex items-center gap-1.5 mt-3 text-[13px] font-semibold text-[#0067B8]">
                        Read article
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <LP2CTA />
      <LP2Footer />
    </div>
  )
}
