"use client"

import ExploreProductPage from "@/components/landingpage2/explore/ExploreProductPage"
import {
  Building2,
  Shield,
  Users,
  Lock,
  BarChart3,
  Workflow,
} from "lucide-react"

const data = {
  name: "Enterprise",
  tagline: "Full-scale ERP built for large organizations",
  description:
    "CubicleERP Enterprise delivers a comprehensive, fully integrated business management platform designed for companies with complex workflows, multiple departments, and global operations. From advanced role-based access controls and multi-entity management to deep analytics and custom automation — everything your enterprise needs to operate at scale, without the complexity of legacy systems.",
  icon: Building2,
  color: "#0067B8",
  lightColor: "#E3F2FD",
  heroImage:
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80",
  variant: 1 as const,
  features: [
    {
      icon: Users,
      title: "Multi-Entity Management",
      description:
        "Manage multiple subsidiaries, branches, and business units from a single unified dashboard. Each entity maintains its own chart of accounts, workflows, and user permissions while leadership gets a consolidated, real-time view across the entire organization. Easily allocate resources, compare performance metrics, and enforce governance policies across all entities without switching between disconnected tools.",
    },
    {
      icon: Lock,
      title: "Advanced Security & Compliance",
      description:
        "Enterprise-grade security with SSO/SAML integration, two-factor authentication, IP whitelisting, and detailed audit trails for every action taken in the system. Meet SOC 2, GDPR, and HIPAA compliance requirements out of the box with data encryption at rest and in transit, granular role-based access controls, and automated compliance reporting. Regular penetration testing and vulnerability assessments ensure your data remains protected against evolving threats.",
    },
    {
      icon: Workflow,
      title: "Custom Workflow Automation",
      description:
        "Design sophisticated multi-step approval workflows, automated escalations, and conditional routing rules without writing a single line of code. Automate purchase order approvals, expense claims, leave requests, and any business process with configurable triggers, conditions, and actions that adapt to your organizational hierarchy. Built-in workflow analytics let you identify bottlenecks and optimize process efficiency across departments.",
    },
    {
      icon: BarChart3,
      title: "Executive Analytics & BI",
      description:
        "Purpose-built executive dashboards with real-time KPIs, drill-down capabilities, and predictive analytics powered by AI and machine learning models. Create custom reports, schedule automated distribution to stakeholders, and embed live dashboards in board presentations. Track revenue, margins, headcount, project profitability, and operational efficiency across all departments with historical trend analysis and forecasting.",
    },
    {
      icon: Shield,
      title: "Dedicated Support & SLA Guarantees",
      description:
        "Get a dedicated customer success manager, priority support queue, and guaranteed SLA response times backed by contractual commitments. Access 24/7 phone and email support, scheduled platform health checks, quarterly business reviews, and proactive performance monitoring to ensure your platform runs smoothly at all times. Our enterprise support team includes technical architects who understand your specific configuration and business context.",
    },
    {
      icon: Building2,
      title: "API & Custom Integrations",
      description:
        "Connect CubicleERP with your existing tech stack using our comprehensive REST API, webhooks, and pre-built connectors for Salesforce, SAP, Oracle, Microsoft 365, Slack, and hundreds of other enterprise tools. Build custom integrations with full API documentation, sandbox environments, and dedicated integration support from our engineering team. Rate-limited endpoints, OAuth 2.0 authentication, and versioned APIs ensure stability and security for all connected systems.",
    },
  ],
  benefits: [
    {
      title: "Eliminate Silos Across Departments",
      description:
        "Unify HR, finance, sales, projects, and operations on a single platform. Every department works from the same data, reducing miscommunication, duplicate data entry, and manual reconciliation across disconnected tools.",
    },
    {
      title: "Scale Without Limits",
      description:
        "Whether you have 100 employees or 10,000, CubicleERP Enterprise scales elastically. Our cloud infrastructure automatically adjusts to your workload, ensuring fast performance during peak periods without manual infrastructure management.",
    },
    {
      title: "Reduce Total Cost of Ownership",
      description:
        "Replace multiple point solutions with one unified platform. Enterprises that switch to CubicleERP save an average of 40% on software licensing, reduce IT administration overhead, and eliminate costly integration maintenance between disconnected tools.",
    },
    {
      title: "Accelerate Decision-Making",
      description:
        "Real-time data across every business function means leadership can make informed decisions in minutes, not days. No more waiting for reports to be compiled from multiple systems — everything is available on demand with drill-down capabilities.",
    },
    {
      title: "Maintain Regulatory Compliance",
      description:
        "Built-in compliance frameworks, automated audit trails, and policy enforcement ensure your organization meets industry regulations without manual tracking. Generate compliance reports instantly for auditors and regulatory bodies.",
    },
    {
      title: "Future-Proof Your Technology",
      description:
        "Regular platform updates, an open API architecture, and a commitment to modern standards mean your investment grows with you. Avoid the technology debt that comes with legacy ERP systems and stay current without disruptive migration projects.",
    },
  ],
  steps: [
    {
      step: "1",
      title: "Discovery & Planning",
      description:
        "Our enterprise team conducts a thorough assessment of your current systems, workflows, and requirements. We create a detailed implementation roadmap tailored to your organization's priorities, timeline, and change management needs.",
    },
    {
      step: "2",
      title: "Configuration & Migration",
      description:
        "We configure CubicleERP to match your organizational structure, migrate historical data from legacy systems, set up integrations, and customize workflows. Your dedicated implementation team handles everything with minimal disruption to daily operations.",
    },
    {
      step: "3",
      title: "Training & Go-Live",
      description:
        "Comprehensive training programs for every user role — from executives to front-line staff. Phased rollout with parallel running periods, 24/7 go-live support, and ongoing optimization to ensure long-term success and maximum adoption.",
    },
  ],
  useCases: [
    {
      title: "Multi-Location Operations",
      description:
        "Enterprises with offices, warehouses, or retail locations across multiple regions use CubicleERP to standardize operations while allowing local flexibility in workflows and compliance requirements.",
      highlights: [
        "Consolidated dashboards with location-level drill-down",
        "Multi-currency and multi-language support for global teams",
        "Location-specific workflows with centralized policy governance",
      ],
    },
    {
      title: "Complex Organizational Hierarchies",
      description:
        "Large organizations with multiple business units, subsidiaries, and matrix reporting structures use CubicleERP to maintain clarity across complex hierarchies without losing operational agility.",
      highlights: [
        "Matrix reporting with dual-manager approval workflows",
        "Business unit P&L tracking with inter-company transactions",
        "Role-based dashboards customized for each management level",
      ],
    },
    {
      title: "Regulated Industries",
      description:
        "Enterprises in banking, insurance, pharmaceuticals, and government use CubicleERP to maintain strict compliance while keeping operations efficient and audit-ready at all times.",
      highlights: [
        "Automated compliance checks with real-time violation alerts",
        "Complete audit trails with tamper-proof logging",
        "Built-in frameworks for SOC 2, GDPR, HIPAA, and ISO 27001",
      ],
    },
  ],
  faqs: [
    {
      question: "How long does an enterprise implementation typically take?",
      answer:
        "Implementation timelines vary based on complexity, but most enterprise deployments are completed in 8-16 weeks. We follow an agile implementation methodology with phased rollouts, so your teams can start using core modules within the first few weeks while more complex configurations are finalized. Our dedicated project managers ensure timelines are met without compromising quality.",
    },
    {
      question:
        "Can CubicleERP integrate with our existing ERP and legacy systems?",
      answer:
        "Yes. CubicleERP provides a comprehensive REST API, webhooks, and pre-built connectors for major enterprise platforms including SAP, Oracle, Microsoft Dynamics, Salesforce, and Workday. For custom integrations, our integration team builds and maintains connectors using our open API. We also support data sync via flat files, SFTP, and middleware platforms like MuleSoft and Zapier.",
    },
    {
      question: "What security certifications does CubicleERP hold?",
      answer:
        "CubicleERP maintains SOC 2 Type II certification, is GDPR compliant, and supports HIPAA compliance for healthcare organizations. Our infrastructure runs on enterprise-grade cloud providers with data encryption at rest (AES-256) and in transit (TLS 1.3), regular penetration testing, and 99.99% uptime SLA. We also support customer-managed encryption keys for sensitive industries.",
    },
    {
      question: "How does pricing work for large organizations?",
      answer:
        "Enterprise pricing is customized based on user count, modules required, support level, and deployment preferences. We offer volume discounts for large teams and flexible billing options including annual and multi-year agreements. Contact our sales team for a detailed proposal tailored to your organization's specific requirements and budget.",
    },
    {
      question: "Do you offer on-premise or private cloud deployment?",
      answer:
        "CubicleERP is primarily a cloud-hosted solution, but we offer private cloud deployment options for enterprises with strict data residency or regulatory requirements. Private cloud deployments include dedicated infrastructure, custom backup schedules, and enhanced security configurations. Contact our enterprise team to discuss deployment options that meet your compliance and governance needs.",
    },
  ],
  stats: [
    { value: "500+", label: "Enterprise clients worldwide" },
    { value: "99.99%", label: "Platform uptime SLA" },
    { value: "40%", label: "Average cost reduction" },
    { value: "3x", label: "Faster reporting cycles" },
  ],
}

export default function EnterprisePage() {
  return <ExploreProductPage data={data} />
}
