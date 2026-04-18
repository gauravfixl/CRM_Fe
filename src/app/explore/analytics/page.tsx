"use client"

import ExploreProductPage from "@/components/landingpage2/explore/ExploreProductPage"
import {
  BarChart3,
  LayoutDashboard,
  FileBarChart,
  PieChart,
  BrainCircuit,
  Gauge,
  BellRing,
} from "lucide-react"

const data = {
  name: "Analytics",
  tagline: "Turn your data into actionable business insights",
  description:
    "CubicleERP Analytics transforms raw business data into clear, visual intelligence. Build real-time dashboards, generate custom reports, and leverage predictive analytics to make confident decisions that drive revenue and operational efficiency across every department.",
  icon: BarChart3,
  color: "#C30052",
  lightColor: "#FCE4EC",
  heroImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&q=80",
  variant: 3 as const,

  features: [
    {
      icon: LayoutDashboard,
      title: "Real-Time Dashboards",
      description:
        "Build interactive dashboards that update in real time as your data changes. Drag and drop widgets, customize layouts, and monitor your most critical KPIs at a glance without waiting for batch refreshes.",
    },
    {
      icon: FileBarChart,
      title: "Custom Reports",
      description:
        "Design pixel-perfect reports with our flexible report builder. Apply filters, groupings, and calculated fields to surface exactly the data you need. Schedule reports to be generated and emailed automatically.",
    },
    {
      icon: PieChart,
      title: "Data Visualization",
      description:
        "Choose from over 200 chart types including bar charts, heatmaps, funnels, geographic maps, and Sankey diagrams. Every visualization is interactive with drill-down, zoom, and tooltip support.",
    },
    {
      icon: BrainCircuit,
      title: "Predictive Analytics",
      description:
        "Leverage built-in machine learning models to forecast sales trends, predict customer churn, and anticipate demand fluctuations. No data science expertise required \u2014 the system trains on your historical data automatically.",
    },
    {
      icon: Gauge,
      title: "KPI Tracking",
      description:
        "Define and track key performance indicators across your entire organization. Set targets, monitor progress with trend lines, and receive instant notifications when metrics fall outside acceptable thresholds.",
    },
    {
      icon: BellRing,
      title: "Automated Alerts",
      description:
        "Configure intelligent alerts that trigger when data crosses your defined boundaries. Receive notifications via email, SMS, or in-app push when revenue dips, costs spike, or anomalies are detected in any metric.",
    },
  ],

  benefits: [
    {
      title: "Make Data-Driven Decisions",
      description:
        "Replace gut instinct with hard evidence. Every team member has access to accurate, up-to-date metrics so decisions are grounded in reality rather than assumptions or outdated spreadsheets.",
    },
    {
      title: "Spot Trends Early",
      description:
        "Identify emerging patterns in sales, customer behavior, and operations before they become obvious. Early trend detection gives you a first-mover advantage to capitalize on opportunities or mitigate risks.",
    },
    {
      title: "Measure ROI Accurately",
      description:
        "Track the true return on investment for every campaign, project, and initiative. Attribution modeling connects spend to outcomes so you can double down on what works and cut what doesn't.",
    },
    {
      title: "Cross-Department Visibility",
      description:
        "Break down data silos by unifying metrics from sales, marketing, finance, and operations into a single analytics platform. Everyone works from the same source of truth.",
    },
    {
      title: "Save Analyst Time",
      description:
        "Automate repetitive reporting tasks that used to consume hours each week. Self-service analytics empowers non-technical users to build their own reports, freeing your analysts for higher-value work.",
    },
    {
      title: "Gain a Competitive Edge",
      description:
        "Organizations that leverage data analytics outperform peers by a wide margin. Faster insights mean faster reactions to market shifts, customer needs, and competitive threats.",
    },
  ],

  steps: [
    {
      step: "1",
      title: "Connect Data Sources",
      description:
        "Link your CRM, ERP modules, marketing tools, and external databases with pre-built connectors. Data is synced automatically so your analytics are always current.",
    },
    {
      step: "2",
      title: "Build Dashboards",
      description:
        "Use the drag-and-drop editor to create dashboards tailored to each role. Pick from templates or start from scratch with charts, tables, and scorecards.",
    },
    {
      step: "3",
      title: "Act on Insights",
      description:
        "Share dashboards with your team, set up automated alerts, and use predictive models to take proactive action based on what the data reveals.",
    },
  ],

  useCases: [
    {
      title: "Executive Leadership",
      description:
        "C-suite executives and directors need a consolidated view of company performance without digging through multiple systems. CubicleERP Analytics delivers executive dashboards with real-time P&L, pipeline health, and departmental scorecards.",
      highlights: [
        "Board-ready reports generated in one click",
        "Company-wide KPI scorecards with trend analysis",
        "Revenue forecasting with scenario modeling",
      ],
    },
    {
      title: "Marketing Analytics",
      description:
        "Marketing teams can track campaign performance, customer acquisition costs, and conversion funnels across every channel. Multi-touch attribution shows which efforts actually drive revenue.",
      highlights: [
        "Campaign ROI tracking across all channels",
        "Customer journey and funnel visualization",
        "Audience segmentation with behavioral insights",
      ],
    },
    {
      title: "Operations Teams",
      description:
        "Operations managers use analytics to monitor throughput, identify bottlenecks, and optimize resource allocation. Real-time dashboards surface issues before they cascade into costly delays.",
      highlights: [
        "Process efficiency and cycle time tracking",
        "Resource utilization heat maps",
        "Anomaly detection for quality control",
      ],
    },
  ],

  faqs: [
    {
      question: "What data sources can I connect to CubicleERP Analytics?",
      answer:
        "CubicleERP Analytics comes with pre-built connectors for all CubicleERP modules including CRM, Finance, HRM, and Inventory. You can also connect external databases (PostgreSQL, MySQL, SQL Server), cloud services (Google Analytics, Stripe, Shopify), CSV/Excel uploads, and REST APIs. Our integration library includes over 100 connectors with new ones added regularly.",
    },
    {
      question: "Can I customize dashboards for different team roles?",
      answer:
        "Absolutely. Each user or team can have their own set of dashboards tailored to their specific KPIs and responsibilities. Role-based access controls ensure people only see the data relevant to them. You can also create shared dashboards visible to entire departments while keeping sensitive financial data restricted to authorized users.",
    },
    {
      question: "How do I share reports and dashboards with my team?",
      answer:
        "Reports and dashboards can be shared via direct link, embedded in internal portals, or scheduled for automatic email delivery in PDF, Excel, or interactive HTML format. You can set permissions so recipients can view, comment, or edit. Stakeholders without a CubicleERP account can access shared reports through secure public links.",
    },
    {
      question: "How does the AI-powered predictive analytics work?",
      answer:
        "Our predictive engine uses machine learning algorithms trained on your historical data to generate forecasts and detect patterns. It supports time-series forecasting for sales and demand, classification models for churn prediction, and anomaly detection for operational metrics. Models retrain automatically as new data arrives, and you can review accuracy metrics and confidence intervals for every prediction.",
    },
    {
      question: "What export options are available for reports?",
      answer:
        "Reports can be exported in PDF, Excel (XLSX), CSV, PNG (for charts), and PowerPoint formats. You can also schedule automated exports to be delivered via email or saved to cloud storage like Google Drive, Dropbox, or SharePoint. API access is available for programmatic data retrieval, making it easy to feed analytics into other tools in your workflow.",
    },
  ],

  stats: [
    { value: "5x", label: "Faster reporting" },
    { value: "85%", label: "Better decision accuracy" },
    { value: "200+", label: "Chart types available" },
    { value: "Real-time", label: "Data updates" },
  ],

  capabilities: [
    {
      title: "Advanced Data Modeling",
      description:
        "Build sophisticated data models that combine metrics from multiple business units into a unified analytical layer. CubicleERP Analytics supports star schemas, snowflake schemas, and custom calculated measures that update in real time as underlying data changes.",
      keyPoints: [
        "Create calculated fields with 100+ built-in functions including running totals, period-over-period comparisons, and statistical aggregations",
        "Define reusable metric definitions that ensure consistent calculations across every dashboard and report in your organization",
        "Model complex many-to-many relationships between data sources without writing SQL, using our visual relationship mapper",
        "Schedule data model refreshes or trigger them on-demand to balance freshness with compute efficiency",
      ],
    },
    {
      title: "Embedded Analytics & White-Labeling",
      description:
        "Embed interactive dashboards and reports directly into your own products, client portals, or internal applications. Full white-labeling support lets you match your brand identity while delivering CubicleERP's analytics engine under the hood.",
      keyPoints: [
        "Embed dashboards via iframe or our JavaScript SDK with row-level security applied per viewer",
        "Customize colors, fonts, logos, and loading screens to match your application's design system",
        "Support multi-tenant embedding where each client sees only their own data with zero configuration per tenant",
      ],
    },
    {
      title: "Natural Language Querying",
      description:
        "Let any team member ask questions in plain English and get instant chart-based answers. The AI query engine interprets natural language, maps it to your data model, and generates the appropriate visualization automatically.",
      keyPoints: [
        "Ask questions like 'Show me revenue by region for Q4' and get an instant interactive chart",
        "The engine learns your company's terminology and metric definitions over time for increasingly accurate results",
        "Suggested follow-up questions guide users to deeper insights they may not have thought to explore",
        "All AI-generated queries can be saved as standard dashboard widgets for ongoing monitoring",
      ],
    },
    {
      title: "Collaborative Analytics Workspace",
      description:
        "Turn analytics from a solo activity into a team sport. Shared workspaces let analysts co-author dashboards, leave contextual comments on specific data points, and publish curated data stories for executive consumption.",
      keyPoints: [
        "Real-time co-editing lets multiple analysts build and refine dashboards simultaneously without conflicts",
        "Annotate specific data points with context, explanations, or action items visible to all viewers",
        "Publish narrative-driven data stories that combine charts, text, and images into a guided analytical journey",
      ],
    },
  ],

  integrations: [
    { name: "Google Analytics", category: "Analytics" },
    { name: "Salesforce", category: "CRM" },
    { name: "Stripe", category: "Payments" },
    { name: "Slack", category: "Communication" },
    { name: "Google Sheets", category: "Productivity" },
    { name: "Microsoft Power BI", category: "Analytics" },
    { name: "Snowflake", category: "Data Warehouse" },
    { name: "PostgreSQL", category: "Database" },
    { name: "HubSpot", category: "Marketing" },
    { name: "Shopify", category: "E-commerce" },
    { name: "Tableau", category: "Analytics" },
    { name: "Amazon Redshift", category: "Data Warehouse" },
  ],

  testimonials: [
    {
      quote:
        "Before CubicleERP Analytics, our monthly reporting took two full-time analysts an entire week. Now the same reports are generated automatically every Monday morning, and they are more accurate than anything we produced manually.",
      author: "Sarah Chen",
      role: "VP of Business Intelligence",
      company: "Meridian Retail Group",
      metric: "80% reduction in reporting time",
    },
    {
      quote:
        "The predictive analytics module flagged a customer churn trend three months before it would have hit our radar. We launched a retention campaign early and saved over $2M in annual recurring revenue.",
      author: "David Okonkwo",
      role: "Chief Revenue Officer",
      company: "CloudScale Technologies",
      metric: "$2M ARR saved through early churn detection",
    },
    {
      quote:
        "We replaced four separate BI tools with CubicleERP Analytics and cut our analytics spend by 60%. The unified platform means every department finally works from the same source of truth instead of arguing over conflicting numbers.",
      author: "Priya Mehta",
      role: "Director of Operations",
      company: "NovaCraft Industries",
      metric: "60% reduction in analytics tool spend",
    },
  ],

  comparisons: [
    { feature: "Dashboard creation", traditional: "Days of development", cubicleErp: "Minutes with drag-and-drop" },
    { feature: "Data source connections", traditional: "Manual ETL pipelines", cubicleErp: "100+ pre-built connectors" },
    { feature: "Predictive analytics", traditional: "Requires data science team", cubicleErp: "Built-in ML models" },
    { feature: "Report distribution", traditional: "Manual email attachments", cubicleErp: "Automated scheduling" },
    { feature: "Cross-department data", traditional: "Siloed spreadsheets", cubicleErp: "Unified data platform" },
    { feature: "Natural language queries", traditional: "Not available", cubicleErp: "Ask in plain English" },
  ],

  subNavItems: [
    { label: "Overview", sectionId: "hero" },
    { label: "Features", sectionId: "features" },
    { label: "Capabilities", sectionId: "capabilities" },
    { label: "Benefits", sectionId: "benefits" },
    { label: "Integrations", sectionId: "integrations" },
    { label: "Use Cases", sectionId: "use-cases" },
    { label: "FAQs", sectionId: "faqs" },
    { label: "CRM", href: "/explore/crm" },
    { label: "Finance", href: "/explore/finance" },
    { label: "Inventory", href: "/explore/inventory" },
  ],
}

export default function AnalyticsPage() {
  return <ExploreProductPage data={data} />
}
