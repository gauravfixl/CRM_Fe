import {
  Users, Briefcase, UserCheck, DollarSign, Globe, HeadphonesIcon,
  Target, Building2, BarChart3, Shield, Zap, CreditCard,
  UserPlus, Settings, Upload, Rocket,
  MessageSquare, Video, HardDrive, Github, Cloud,
  Calculator, Mail, Phone, Server, FileText, CheckSquare,
  Kanban, Chrome,
} from "lucide-react"

// ─── NAV LINKS ──────────────────────────────────────────
export const navLinks = [
  {
    label: "Platform",
    hasMegaMenu: true,
    megaItems: [
      { icon: Users, title: "CRM", desc: "Lead & client management, pipelines, deals", href: "/modules#crm" },
      { icon: UserCheck, title: "HRM", desc: "Payroll, attendance, leave, performance", href: "/modules#hrm" },
      { icon: Briefcase, title: "Project Management", desc: "Kanban boards, sprints, tasks, timelines", href: "/modules#pm" },
      { icon: DollarSign, title: "Finance", desc: "Invoicing, expenses, tax, revenue", href: "/modules#finance" },
      { icon: Globe, title: "Client Portal", desc: "Branded portal for your customers", href: "/modules#portal" },
      { icon: HeadphonesIcon, title: "Helpdesk", desc: "Tickets, SLA, knowledge base", href: "/modules#helpdesk" },
    ],
  },
  {
    label: "Solutions",
    hasMegaMenu: true,
    megaItems: [
      { icon: Building2, title: "Enterprise", desc: "Custom solutions for large scale operations", href: "/pricing" },
      { icon: Target, title: "Startups", desc: "Affordable plans to grow your business", href: "/pricing" },
      { icon: BarChart3, title: "Agencies", desc: "Manage clients, projects and teams", href: "/modules" },
      { icon: Shield, title: "Healthcare", desc: "HIPAA-ready compliance and security", href: "/modules" },
    ],
  },
  { label: "Pricing", href: "/pricing" },
  { label: "Resources", href: "#faq" },
]

// ─── HERO MODULE SELECTOR ───────────────────────────────
export const heroModules = [
  { id: "crm", icon: Users, label: "CRM", desc: "Leads & Deals" },
  { id: "hrm", icon: UserCheck, label: "HRM", desc: "People & Payroll" },
  { id: "pm", icon: Briefcase, label: "Project Mgmt", desc: "Tasks & Sprints" },
  { id: "finance", icon: DollarSign, label: "Finance", desc: "Invoices & Reports" },
  { id: "helpdesk", icon: HeadphonesIcon, label: "Helpdesk", desc: "Tickets & SLA" },
  { id: "analytics", icon: BarChart3, label: "Analytics", desc: "Insights & Reports" },
]

// ─── TRUST BADGES ───────────────────────────────────────
export const trustBadges = [
  { label: "SOC2 Compliant" },
  { label: "99.9% Uptime" },
  { label: "GDPR Ready" },
  { label: "256-bit Encryption" },
]

// ─── LOGO MARQUEE ───────────────────────────────────────
export const logoCompanies = [
  "Acme Corp", "TechStart", "GlobalTrade", "InnovateCo",
  "NexusFirm", "SpeedOps", "DataFlow", "CloudSync",
  "BrightPath", "SkylineIO", "VelocityHQ", "PulseNet",
]

// ─── STATS ──────────────────────────────────────────────
export const stats = [
  { value: "500+", label: "Organizations", gradient: "from-[#6161FF] to-[#3898EC]", icon: Building2 },
  { value: "50K+", label: "Active Users", gradient: "from-emerald-500 to-teal-600", icon: Users },
  { value: "99.9%", label: "Platform Uptime", gradient: "from-amber-500 to-orange-600", icon: Zap },
  { value: "4.9/5", label: "Average Rating", gradient: "from-rose-500 to-pink-600", icon: Target },
]

// ─── MODULES SHOWCASE ───────────────────────────────────
export const modules = [
  {
    id: "crm",
    label: "CRM",
    icon: Users,
    color: "from-blue-600 to-indigo-700",
    desc: "Full-stack client relationship management",
    features: [
      "Lead pipeline with stage tracking",
      "Client & contact management",
      "Deal creation & pipeline view",
      "Activities, calls & follow-ups",
      "Campaign management",
      "Lead scoring & analytics",
    ],
    mockStats: [
      { label: "Total Leads", value: "2,847" },
      { label: "Pipeline Value", value: "$147K" },
      { label: "Win Rate", value: "68.4%" },
    ],
  },
  {
    id: "hrm",
    label: "HRM",
    icon: UserCheck,
    color: "from-emerald-500 to-teal-600",
    desc: "Complete HR operations hub",
    features: [
      "Employee profiles & records",
      "Leave & attendance tracking",
      "Payroll calculation engine",
      "Performance reviews & OKRs",
      "Recruitment pipeline",
      "Employee lifecycle management",
    ],
    mockStats: [
      { label: "Employees", value: "342" },
      { label: "Leave Requests", value: "18" },
      { label: "Payroll", value: "$84K" },
    ],
  },
  {
    id: "pm",
    label: "Project Mgmt",
    icon: Briefcase,
    color: "from-purple-600 to-violet-700",
    desc: "Jira-style task and milestone tracking",
    features: [
      "Kanban & list board views",
      "Sprint planning & backlog",
      "Task assignment & priorities",
      "Time tracking per task",
      "File attachments & comments",
      "Project analytics & reports",
    ],
    mockStats: [
      { label: "Active Projects", value: "24" },
      { label: "Tasks Done", value: "1,248" },
      { label: "On-time Rate", value: "91%" },
    ],
  },
  {
    id: "finance",
    label: "Finance",
    icon: DollarSign,
    color: "from-amber-500 to-orange-600",
    desc: "Invoices, expenses & financial reports",
    features: [
      "Invoice creation & tracking",
      "Expense management",
      "Revenue & MRR analytics",
      "Subscription billing",
      "Tax compliance reports",
      "Financial forecasting",
    ],
    mockStats: [
      { label: "Revenue", value: "$14.2M" },
      { label: "Invoices", value: "47" },
      { label: "MRR Growth", value: "+12%" },
    ],
  },
  {
    id: "portal",
    label: "Client Portal",
    icon: Globe,
    color: "from-rose-500 to-pink-600",
    desc: "External portal for your clients",
    features: [
      "Branded client login portal",
      "Invoice & payment access",
      "Document sharing hub",
      "Project status visibility",
      "Support ticket submission",
      "Real-time notifications",
    ],
    mockStats: [
      { label: "Active Clients", value: "189" },
      { label: "Portal Sessions", value: "4,200" },
      { label: "Satisfaction", value: "4.9/5" },
    ],
  },
  {
    id: "helpdesk",
    label: "Helpdesk",
    icon: HeadphonesIcon,
    color: "from-cyan-500 to-blue-600",
    desc: "Support ticketing & knowledge base",
    features: [
      "Ticket creation & assignment",
      "SLA policy management",
      "Escalation workflows",
      "Knowledge base articles",
      "Agent performance metrics",
      "Customer satisfaction tracking",
    ],
    mockStats: [
      { label: "Open Tickets", value: "23" },
      { label: "Avg Response", value: "< 2h" },
      { label: "CSAT Score", value: "96%" },
    ],
  },
]

// ─── FEATURES GRID ──────────────────────────────────────
export const features = [
  {
    icon: Target,
    title: "Lead Management",
    description: "Track, score, and convert leads with intelligent pipelines. Never miss an opportunity.",
    gradient: "from-blue-500 to-indigo-600",
    tag: "CRM",
  },
  {
    icon: Building2,
    title: "Multi-Org Control",
    description: "Manage multiple organizations and departments from a single unified admin center.",
    gradient: "from-emerald-500 to-teal-600",
    tag: "Admin",
  },
  {
    icon: BarChart3,
    title: "AI-Powered Analytics",
    description: "Real-time dashboards with revenue metrics, pipeline analytics, and predictive insights.",
    gradient: "from-purple-500 to-violet-600",
    tag: "Analytics",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Create roles, assign permissions, and align your entire team around shared goals.",
    gradient: "from-orange-500 to-amber-600",
    tag: "Teams",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "SOC2 compliant with MFA, audit logs, RBAC, and full compliance reporting built-in.",
    gradient: "from-rose-500 to-red-600",
    tag: "Security",
  },
  {
    icon: Zap,
    title: "Workflow Automation",
    description: "Automate repetitive tasks, set triggers, approval chains, and save hours every week.",
    gradient: "from-cyan-500 to-blue-600",
    tag: "Automation",
  },
  {
    icon: Globe,
    title: "Client Portal",
    description: "Give clients their own branded portal to view invoices, projects, and submit tickets.",
    gradient: "from-pink-500 to-rose-600",
    tag: "Portal",
  },
  {
    icon: CreditCard,
    title: "Invoicing & Finance",
    description: "Create invoices, track payments, manage expenses, and generate financial reports.",
    gradient: "from-amber-500 to-orange-600",
    tag: "Finance",
  },
]

// ─── HOW IT WORKS ───────────────────────────────────────
export const steps = [
  { icon: UserPlus, title: "Sign Up", desc: "Create your account in 30 seconds. No credit card required." },
  { icon: Settings, title: "Configure", desc: "Set up your organization, invite your team, configure modules." },
  { icon: Upload, title: "Import", desc: "Import existing data from spreadsheets or migrate from other tools." },
  { icon: Rocket, title: "Launch", desc: "Go live and start managing your entire business from one platform." },
]

// ─── TESTIMONIALS ───────────────────────────────────────
export const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "CEO, Acme Corp",
    avatar: "SM",
    avatarBg: "from-blue-500 to-indigo-600",
    rating: 5,
    text: "Cubicle transformed how we manage our sales pipeline. The lead tracking is phenomenal — we increased conversions by 40% in just two months.",
  },
  {
    name: "James Rodriguez",
    role: "Ops Director, TechStart Inc",
    avatar: "JR",
    avatarBg: "from-emerald-500 to-teal-600",
    rating: 5,
    text: "Having CRM, HR, and finance all in one platform is a game changer. We eliminated 4 separate tools and saved $2,000/month.",
  },
  {
    name: "Priya Sharma",
    role: "Founder, InnovateCo",
    avatar: "PS",
    avatarBg: "from-purple-500 to-violet-600",
    rating: 5,
    text: "The multi-org management feature is incredible. I oversee three companies from one dashboard with full security and audit trails.",
  },
  {
    name: "Michael Chen",
    role: "Sales Lead, GlobalTrade",
    avatar: "MC",
    avatarBg: "from-amber-500 to-orange-600",
    rating: 5,
    text: "The analytics dashboard is like having a business intelligence tool built-in. Real-time insights helped us identify our best lead sources.",
  },
  {
    name: "Aisha Patel",
    role: "HR Manager, NexusFirm",
    avatar: "AP",
    avatarBg: "from-rose-500 to-pink-600",
    rating: 5,
    text: "Payroll processing used to take us 3 days. With Cubicle's HR module, it's done in under 2 hours. The attendance tracking is flawless.",
  },
  {
    name: "David Kim",
    role: "CTO, SpeedOps Ltd",
    avatar: "DK",
    avatarBg: "from-cyan-500 to-blue-600",
    rating: 5,
    text: "Enterprise-grade security with SOC2 compliance was non-negotiable for us. Cubicle delivered on every requirement, and support is top-notch.",
  },
]

// ─── INTEGRATIONS ───────────────────────────────────────
export const integrations = [
  { icon: MessageSquare, label: "Slack" },
  { icon: Chrome, label: "Google" },
  { icon: Video, label: "Zoom" },
  { icon: HardDrive, label: "Dropbox" },
  { icon: Github, label: "GitHub" },
  { icon: CreditCard, label: "Stripe" },
  { icon: Zap, label: "Zapier" },
  { icon: Users, label: "HubSpot" },
  { icon: Cloud, label: "Salesforce" },
  { icon: Kanban, label: "Jira" },
  { icon: Calculator, label: "QuickBooks" },
  { icon: Mail, label: "Mailchimp" },
  { icon: Phone, label: "Twilio" },
  { icon: Server, label: "AWS" },
  { icon: FileText, label: "Notion" },
  { icon: CheckSquare, label: "Asana" },
]

// ─── PRICING ────────────────────────────────────────────
export const pricingPlans = [
  {
    name: "Starter",
    desc: "Perfect for small teams and startups",
    price: 0,
    features: [
      "Up to 5 team members",
      "1 Organization",
      "Lead & Client Management",
      "Basic CRM Pipelines",
      "Standard Support",
      "2GB Cloud Storage",
    ],
    buttonText: "Start Free",
    popular: false,
  },
  {
    name: "Business",
    desc: "Advanced tools for growing teams",
    price: 29,
    features: [
      "Up to 25 team members",
      "5 Organizations",
      "Full CRM + HRM + PM Suite",
      "Workflow Automation",
      "Priority Email Support",
      "25GB Cloud Storage",
      "Advanced Analytics",
    ],
    buttonText: "Start 14-Day Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    desc: "Custom solutions for large scale operations",
    price: -1,
    features: [
      "Unlimited team members",
      "Unlimited Organizations",
      "Full Platform Access",
      "AI-Powered Insights",
      "24/7 Dedicated Support",
      "Unlimited Storage",
      "API & Custom Webhooks",
      "White-label Options",
    ],
    buttonText: "Contact Sales",
    popular: false,
  },
]

// ─── FAQ ────────────────────────────────────────────────
export const faqItems = [
  {
    question: "What is Cubicle?",
    answer: "Cubicle is an all-in-one enterprise resource planning (ERP) platform that combines CRM, HRM, Project Management, Finance, Client Portal, and Helpdesk modules into a single unified workspace. It's designed for businesses of all sizes to manage their entire operations from one place.",
  },
  {
    question: "How many modules are included?",
    answer: "Cubicle includes 6 core modules: CRM (lead and client management), HRM (payroll, attendance, performance), Project Management (Kanban boards, sprints, tasks), Finance (invoicing, expenses, tax), Client Portal (branded customer access), and Helpdesk (ticketing, SLA, knowledge base). All modules work seamlessly together.",
  },
  {
    question: "Can I try Cubicle for free?",
    answer: "Yes! Our Starter plan is completely free and includes up to 5 team members with basic CRM features. For our Business and Enterprise plans, we offer a 14-day free trial with full access to all modules — no credit card required.",
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely. Cubicle is SOC2 compliant with 256-bit encryption, multi-factor authentication (MFA), role-based access control (RBAC), comprehensive audit logs, and GDPR compliance. We maintain 99.9% platform uptime with enterprise-grade infrastructure.",
  },
  {
    question: "Can I import data from other tools?",
    answer: "Yes. Cubicle supports bulk data import from CSV/Excel files and offers integrations with popular tools like Salesforce, HubSpot, Jira, and QuickBooks. Our migration team can also assist with custom data transfers for Enterprise customers.",
  },
  {
    question: "What kind of support do you offer?",
    answer: "Starter plans include standard email support. Business plans get priority support with faster response times. Enterprise customers receive 24/7 dedicated support with a named account manager, onboarding assistance, and custom training sessions.",
  },
  {
    question: "Is there a limit on team size?",
    answer: "Our Starter plan supports up to 5 team members, Business up to 25, and Enterprise offers unlimited users. You can easily upgrade or downgrade your plan as your team grows.",
  },
  {
    question: "Do you offer custom integrations?",
    answer: "Yes. Enterprise plans include API access and custom webhooks for building your own integrations. We also offer a marketplace of pre-built integrations and can develop custom connectors through our professional services team.",
  },
]

// ─── FOOTER ─────────────────────────────────────────────
export const footerLinks = {
  product: {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Modules", href: "#modules" },
      { label: "Pricing", href: "#pricing" },
      { label: "Security", href: "#" },
      { label: "Roadmap", href: "#" },
    ],
  },
  platform: {
    title: "Platform",
    links: [
      { label: "Sign In", href: "/auth/signin" },
      { label: "Sign Up", href: "/auth/signup" },
      { label: "Documentation", href: "#" },
      { label: "API Status", href: "#" },
      { label: "Integrations", href: "#integrations" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { label: "About Us", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Partners", href: "#" },
    ],
  },
  legal: {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" },
      { label: "GDPR", href: "#" },
      { label: "Security Policy", href: "#" },
    ],
  },
}
