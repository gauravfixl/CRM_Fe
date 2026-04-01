import {
  Users, Briefcase, UserCheck, DollarSign, Globe, HeadphonesIcon,
  Target, Building2, BarChart3, Shield, Zap, CreditCard,
  UserPlus, Settings, Upload, Rocket,
  MessageSquare, Video, HardDrive, Github, Cloud,
  Calculator, Mail, Phone, Server, FileText, CheckSquare,
  Kanban, Chrome, ArrowRight, Play, PhoneCall, Calendar,
  PieChart, Clock, FileCheck, Layers, Lock, Eye,
  TrendingUp, Award, Headphones, BookOpen,
} from "lucide-react"

// ─── NAV LINKS ──────────────────────────────────────────
export const navLinks = [
  {
    label: "Explore",
    hasMegaMenu: true,
    megaItems: [
      { icon: Users, title: "CRM", desc: "Lead management, client management, pipelines & deals", href: "#product-demos" },
      { icon: UserCheck, title: "HRM", desc: "Payroll, attendance, leave, performance reviews", href: "#product-demos" },
      { icon: Target, title: "Marketing & Campaigns", desc: "Campaign management, email marketing, analytics", href: "#product-demos" },
      { icon: DollarSign, title: "Invoices & Tax", desc: "Invoicing, tax management, expense tracking", href: "#product-demos" },
      { icon: Briefcase, title: "Project Management", desc: "Kanban boards, sprints, tasks, timelines", href: "#product-demos" },
      { icon: HeadphonesIcon, title: "Helpdesk", desc: "Tickets, SLA, knowledge base", href: "#product-demos" },
    ],
  },
  {
    label: "Products",
    hasMegaMenu: true,
    megaItems: [
      { icon: Building2, title: "Enterprise", desc: "Custom solutions for large scale operations", href: "#solutions" },
      { icon: Target, title: "Startups", desc: "Affordable plans to grow your business", href: "#solutions" },
      { icon: BarChart3, title: "Agencies", desc: "Manage clients, projects and teams", href: "#solutions" },
      { icon: Shield, title: "Healthcare", desc: "HIPAA-ready compliance and security", href: "#solutions" },
    ],
  },
  { label: "Pricing", href: "#next-steps" },
  { label: "Resources", href: "#featured-news" },
  { label: "Support", href: "#next-steps" },
]

// ─── SECTION TABS ───────────────────────────────────────
export const sectionTabs = [
  { id: "overview", label: "Overview" },
  { id: "solutions", label: "Solutions" },
  { id: "product-demos", label: "Product demos" },
  { id: "apps-addons", label: "Apps and add-ons" },
  { id: "customer-stories", label: "Customer stories" },
  { id: "featured-news", label: "Featured news" },
  { id: "next-steps", label: "Next steps" },
]

// ─── HERO ───────────────────────────────────────────────
export const heroContent = {
  badge: "CUBICLE ERP PLATFORM",
  title: "The new era of AI-powered business",
  subtitle: "Adapt and innovate with intelligent CRM, HRM, Lead Management, Invoicing, Marketing, Campaigns, Project Management and more — all in one unified platform.",
  primaryCTA: { label: "See plans and pricing", href: "#next-steps" },
  secondaryCTA: { label: "Try for free", href: "/auth/signup" },
}

// ─── HERO MODULE ICONS (for the circular platform diagram) ──
export const heroModuleIcons = [
  { id: "crm", icon: Users, label: "CRM", color: "#0078D4" },
  { id: "hrm", icon: UserCheck, label: "HRM", color: "#107C10" },
  { id: "leads", icon: Target, label: "Leads", color: "#5C2D91" },
  { id: "invoices", icon: DollarSign, label: "Invoices", color: "#D83B01" },
  { id: "campaigns", icon: Mail, label: "Campaigns", color: "#008575" },
  { id: "pm", icon: Briefcase, label: "Projects", color: "#C30052" },
]

// ─── OVERVIEW CARDS ─────────────────────────────────────
export const overviewCards = [
  {
    title: "What is Cubicle?",
    description: "Become more data-driven and innovative with an all-in-one platform for CRM, HRM, project management, and finance operations.",
    cta: { label: "Explore Cubicle", href: "#solutions" },
    image: "/images/landing/overview-1.jpg",
  },
  {
    title: "Take a guided tour",
    description: "Get a closer look at how to improve your business processes with Cubicle's powerful modules and AI-assisted tools.",
    cta: { label: "Start your tour", href: "#product-demos" },
    image: "/images/landing/overview-2.jpg",
  },
  {
    title: "Compare plans and pricing",
    description: "Find the right plan for your business needs by exploring the different options — from free starter to enterprise.",
    cta: { label: "See pricing overview", href: "#next-steps" },
    image: "/images/landing/overview-3.jpg",
  },
]

// ─── SOLUTIONS ACCORDION ────────────────────────────────
export const solutionItems = [
  {
    id: "crm",
    title: "Modernize your CRM",
    description: "Enhance customer relationships with intelligent lead management, client management, and deal pipelines. Track every interaction and close deals faster with AI-powered insights.",
    cta: { label: "Explore CRM", href: "#product-demos" },
    features: ["Lead management & scoring", "Client management", "Deal pipelines", "360° customer view"],
  },
  {
    id: "marketing",
    title: "Supercharge marketing & campaigns",
    description: "Run targeted marketing campaigns, manage email sequences, and track ROI across channels. Segment audiences and automate your entire marketing funnel.",
    cta: { label: "Explore Marketing", href: "#product-demos" },
    features: ["Campaign management", "Email marketing", "Audience segmentation", "ROI analytics"],
  },
  {
    id: "hrm",
    title: "Streamline HR operations",
    description: "Manage your entire employee lifecycle — from recruitment to retirement. Automate payroll, track attendance, and run performance reviews effortlessly.",
    cta: { label: "Explore HRM", href: "#product-demos" },
    features: ["Payroll automation", "Leave management", "Performance reviews", "Recruitment pipeline"],
  },
  {
    id: "finance",
    title: "Invoices, tax & financial control",
    description: "Create invoices, manage tax compliance, track expenses, and generate financial reports. Get complete visibility into your organization's financial health.",
    cta: { label: "Explore Invoices & Tax", href: "#product-demos" },
    features: ["Invoice generation", "Tax compliance (GST/VAT)", "Expense tracking", "Revenue analytics"],
  },
]

// ─── PRODUCT DEMOS TABS ─────────────────────────────────
export const productDemoTabs = [
  {
    id: "crm",
    label: "CRM",
    icon: Users,
    tagline: "Close more deals and deepen customer relationships with AI assistance.",
    product: { name: "Cubicle CRM", icon: Users, href: "#" },
    features: [
      "Lead pipeline with stage tracking & scoring",
      "Client & contact management with 360° view",
      "Deal creation, pipeline view & forecasting",
      "Activities, calls, emails & follow-up automation",
      "Client management with detailed profiles & history",
    ],
    stats: { value: "40%", label: "Increase in lead conversion" },
  },
  {
    id: "leads",
    label: "Lead Management",
    icon: Target,
    tagline: "Capture, nurture, and convert leads with intelligent automation.",
    product: { name: "Cubicle Lead Management", icon: Target, href: "#" },
    features: [
      "Multi-source lead capture & auto-assignment",
      "Lead scoring with AI-powered insights",
      "Automated nurture sequences & follow-ups",
      "Lead-to-deal conversion with full history",
      "Lead source analytics & ROI tracking",
    ],
    stats: { value: "2.5x", label: "More qualified leads" },
  },
  {
    id: "marketing",
    label: "Marketing",
    icon: Mail,
    tagline: "Run powerful campaigns and track marketing ROI across channels.",
    product: { name: "Cubicle Marketing", icon: Mail, href: "#" },
    features: [
      "Campaign creation with multi-channel support",
      "Email marketing with templates & automation",
      "Campaign analytics & conversion tracking",
      "Audience segmentation & targeting",
      "Marketing budget tracking & ROI reports",
    ],
    stats: { value: "55%", label: "Higher campaign ROI" },
  },
  {
    id: "hrm",
    label: "HRM",
    icon: UserCheck,
    tagline: "Empower your HR team to manage people operations at scale.",
    product: { name: "Cubicle HRM", icon: UserCheck, href: "#" },
    features: [
      "Employee profiles, records & document management",
      "Leave & attendance tracking with biometric support",
      "Automated payroll calculation & payslip generation",
      "Performance reviews, OKRs & 360° feedback",
      "Recruitment pipeline with job posting & screening",
    ],
    stats: { value: "60%", label: "Faster payroll processing" },
  },
  {
    id: "invoices",
    label: "Invoices & Tax",
    icon: DollarSign,
    tagline: "Streamline invoicing, payments, and tax compliance effortlessly.",
    product: { name: "Cubicle Invoices", icon: DollarSign, href: "#" },
    features: [
      "Invoice creation, tracking & automated reminders",
      "Tax calculation, GST/VAT & compliance reports",
      "Expense management with receipt scanning",
      "Revenue analytics, MRR & ARR dashboards",
      "Subscription billing & recurring payments",
    ],
    stats: { value: "35%", label: "Reduction in billing errors" },
  },
  {
    id: "pm",
    label: "Project Management",
    icon: Briefcase,
    tagline: "Plan, execute, and deliver projects with full visibility and control.",
    product: { name: "Cubicle Projects", icon: Briefcase, href: "#" },
    features: [
      "Kanban boards, list view & calendar view",
      "Sprint planning, backlog grooming & retrospectives",
      "Task assignment, priorities & dependencies",
      "Time tracking per task with team timesheets",
      "Project analytics, burndown charts & reports",
    ],
    stats: { value: "91%", label: "On-time project delivery" },
  },
  {
    id: "client",
    label: "Client Management",
    icon: Globe,
    tagline: "Manage all your clients with branded portals and real-time access.",
    product: { name: "Cubicle Client Portal", icon: Globe, href: "#" },
    features: [
      "Branded client login portal with custom domain",
      "Invoice & payment access for clients",
      "Project status visibility & collaboration",
      "Document sharing hub with version control",
      "Real-time notifications & support tickets",
    ],
    stats: { value: "4.9/5", label: "Client satisfaction rating" },
  },
]

// ─── INTEGRATIONS / APPS & ADD-ONS ──────────────────────
export const integrationApps = [
  {
    icon: MessageSquare,
    company: "Slack Technologies",
    name: "Slack",
    description: "Connect your workspace and get real-time notifications for leads, deals, and tickets.",
    rating: 4.7,
    reviews: 12480,
  },
  {
    icon: Chrome,
    company: "Google LLC",
    name: "Google Workspace",
    description: "Sync calendars, contacts, and emails with your Cubicle workspace seamlessly.",
    rating: 4.5,
    reviews: 98200,
  },
  {
    icon: CreditCard,
    company: "Stripe Inc.",
    name: "Stripe Payments",
    description: "Process payments, manage subscriptions, and handle invoicing directly from Cubicle.",
    rating: 4.6,
    reviews: 45600,
  },
  {
    icon: Zap,
    company: "Zapier Inc.",
    name: "Zapier",
    description: "Automate workflows by connecting Cubicle with 5,000+ apps without code.",
    rating: 4.4,
    reviews: 32100,
  },
]

// ─── CUSTOMER STORIES ───────────────────────────────────
export const customerStories = [
  {
    company: "Acme Corp",
    logo: "AC",
    logoBg: "#0078D4",
    quote: "With Cubicle, our total cost of ownership went down by as much as 40 percent compared to our previous CRM solution.",
    author: "Sarah Mitchell",
    role: "CEO, Acme Corp",
    stat: { value: "40%", label: "Reduction in cost of ownership" },
    products: ["Cubicle CRM", "Cubicle Finance"],
  },
  {
    company: "TechStart Inc",
    logo: "TS",
    logoBg: "#107C10",
    quote: "Having CRM, HR, and finance all in one platform is a game changer. We eliminated 4 separate tools and saved $2,000 per month.",
    author: "James Rodriguez",
    role: "Ops Director, TechStart Inc",
    stat: { value: "$24K", label: "Annual savings on tools" },
    products: ["Cubicle CRM", "Cubicle HRM", "Cubicle Finance"],
  },
  {
    company: "InnovateCo",
    logo: "IC",
    logoBg: "#5C2D91",
    quote: "The multi-org management feature is incredible. I oversee three companies from one dashboard with full security and audit trails.",
    author: "Priya Sharma",
    role: "Founder, InnovateCo",
    stat: { value: "3x", label: "Faster operational efficiency" },
    products: ["Cubicle CRM", "Cubicle Projects"],
  },
  {
    company: "GlobalTrade",
    logo: "GT",
    logoBg: "#D83B01",
    quote: "Payroll processing used to take us 3 days. With Cubicle's HR module, it's done in under 2 hours. The attendance tracking is flawless.",
    author: "Aisha Patel",
    role: "HR Manager, GlobalTrade",
    stat: { value: "95%", label: "Faster payroll processing" },
    products: ["Cubicle HRM"],
  },
]

// ─── FEATURED NEWS ──────────────────────────────────────
export const featuredNews = [
  {
    title: "Introducing AI-Powered Lead Scoring",
    description: "Cubicle now uses machine learning to automatically score and prioritize your leads based on engagement patterns.",
    cta: "Learn more",
    image: "/images/landing/news-1.jpg",
    tag: "Product Update",
  },
  {
    title: "How Agencies Use Cubicle to Scale Operations",
    description: "Discover how digital agencies manage clients, projects, and teams using our all-in-one platform.",
    cta: "Read the blog",
    image: "/images/landing/news-2.jpg",
    tag: "Case Study",
  },
  {
    title: "Enterprise Security Features Now Available",
    description: "SOC2 compliance, advanced RBAC, and comprehensive audit logs — enterprise-grade security for every plan.",
    cta: "Learn more",
    image: "/images/landing/news-3.jpg",
    tag: "Security",
  },
  {
    title: "Cubicle vs Traditional CRM: A Complete Guide",
    description: "Why modern businesses are choosing unified ERP platforms over standalone CRM tools.",
    cta: "Read the guide",
    image: "/images/landing/news-4.jpg",
    tag: "Guide",
  },
]

// ─── NEXT STEPS ─────────────────────────────────────────
export const nextSteps = {
  trial: {
    title: "Try for free",
    description: "Get hands-on experience with Cubicle's complete business platform for 14 days.",
    cta: { label: "Start a free trial", href: "/auth/signup" },
    image: "/images/landing/next-trial.jpg",
  },
  contact: {
    title: "Chat with sales",
    description: "Let our team help you find the right solution for your business needs.",
    icon: MessageSquare,
    cta: { label: "Contact sales", href: "#" },
  },
  callback: {
    title: "Request a callback",
    description: "Schedule a call with our team at a time that works best for you.",
    icon: PhoneCall,
    cta: { label: "Request callback", href: "#" },
  },
}

// ─── FOOTER ─────────────────────────────────────────────
export const footerLinks = {
  product: {
    title: "Product",
    links: [
      { label: "CRM", href: "#product-demos" },
      { label: "HRM", href: "#product-demos" },
      { label: "Project Management", href: "#product-demos" },
      { label: "Finance", href: "#product-demos" },
      { label: "Helpdesk", href: "#product-demos" },
      { label: "Analytics", href: "#product-demos" },
    ],
  },
  platform: {
    title: "Platform",
    links: [
      { label: "Sign In", href: "/auth/signin" },
      { label: "Sign Up", href: "/auth/signup" },
      { label: "Integrations", href: "#apps-addons" },
      { label: "API Documentation", href: "#" },
      { label: "System Status", href: "#" },
    ],
  },
  solutions: {
    title: "Solutions",
    links: [
      { label: "Enterprise", href: "#solutions" },
      { label: "Startups", href: "#solutions" },
      { label: "Agencies", href: "#solutions" },
      { label: "Healthcare", href: "#solutions" },
      { label: "Consulting Firms", href: "#solutions" },
    ],
  },
  resources: {
    title: "Resources",
    links: [
      { label: "Blog", href: "#" },
      { label: "Customer Stories", href: "#customer-stories" },
      { label: "Help Center", href: "#" },
      { label: "Webinars", href: "#" },
      { label: "Community", href: "#" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { label: "About Us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#next-steps" },
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
  },
}

// ─── PRICING (for reference in Next Steps) ──────────────
export const pricingPlans = [
  {
    name: "Starter",
    desc: "Perfect for small teams getting started",
    price: 0,
    features: [
      "Up to 5 team members",
      "1 Organization",
      "Basic CRM & Lead Management",
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
      "Priority Support",
      "25GB Cloud Storage",
      "Advanced Analytics",
    ],
    buttonText: "Start 14-Day Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    desc: "Custom solutions at scale",
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
