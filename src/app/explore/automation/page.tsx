"use client"

import ExploreProductPage from "@/components/landingpage2/explore/ExploreProductPage"
import {
  Workflow,
  Zap,
  GitBranch,
  Layers,
  Plug,
  ClipboardCheck,
} from "lucide-react"

const data = {
  name: "Automation",
  tagline: "Automate repetitive tasks and focus on what matters",
  description:
    "Design powerful workflows without writing a single line of code. CubicleERP Automation lets you connect processes, eliminate manual steps, and keep your entire organization running like clockwork — so your team can spend time on high-value work instead of busywork.",
  icon: Workflow,
  color: "#00838F",
  lightColor: "#E0F7FA",
  heroImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1920&q=80",
  variant: 1 as const,
  features: [
    {
      icon: Workflow,
      title: "Visual Workflow Builder",
      description:
        "Drag-and-drop canvas to map out complex business processes in minutes. Connect triggers, actions, and conditions visually — no coding or IT support required.",
    },
    {
      icon: Zap,
      title: "Trigger-Based Actions",
      description:
        "Kick off workflows automatically when records change, forms are submitted, dates are reached, or emails arrive. Choose from 50+ built-in event triggers across every CubicleERP module.",
    },
    {
      icon: GitBranch,
      title: "Conditional Logic & Branching",
      description:
        "Add if/else branches, switch-case routing, and dynamic filters so workflows adapt to real-world scenarios. Route approvals by amount, assign leads by region, or escalate tickets by priority — all automatically.",
    },
    {
      icon: Layers,
      title: "Multi-Step Workflows",
      description:
        "Chain unlimited sequential and parallel steps into a single workflow. Send notifications, update fields, create records, wait for approvals, and loop back — all in one automated sequence.",
    },
    {
      icon: Plug,
      title: "Integration Connectors",
      description:
        "Connect CubicleERP with Slack, Gmail, WhatsApp, payment gateways, shipping APIs, and hundreds of third-party tools through pre-built connectors and a generic webhook/REST adapter.",
    },
    {
      icon: ClipboardCheck,
      title: "Audit Logs & Version History",
      description:
        "Every workflow execution is logged with timestamps, input data, and outcomes. Roll back to any previous version of a workflow, debug failed runs, and generate compliance-ready audit trails.",
    },
  ],
  benefits: [
    {
      title: "Save Hours Every Day",
      description:
        "Teams that automate routine data entry, notifications, and approvals report saving an average of 4+ hours per employee per day — time that goes back into strategic, revenue-generating work.",
    },
    {
      title: "Eliminate Human Errors",
      description:
        "Manual copy-paste and hand-off processes are the leading cause of data mismatches. Automation ensures every field is populated correctly, every approval follows the right path, and nothing slips through the cracks.",
    },
    {
      title: "Scale Operations Without Scaling Headcount",
      description:
        "Handle 10x the transaction volume without hiring additional staff. As your business grows, your automated workflows grow with it — processing thousands of records as effortlessly as ten.",
    },
    {
      title: "Enforce Consistent Processes",
      description:
        "Guarantee that every invoice, every onboarding checklist, and every support ticket follows the same best-practice process — regardless of who initiates it or which department handles it.",
    },
    {
      title: "Faster Turnaround Times",
      description:
        "Automated handoffs and instant notifications eliminate the wait-and-chase cycle. Purchase orders that used to take 3 days to approve now close in under an hour.",
    },
    {
      title: "Higher Employee Satisfaction",
      description:
        "Nobody joined your company to copy data between spreadsheets. Removing tedious tasks lets your team focus on creative problem-solving and customer relationships — boosting morale and retention.",
    },
  ],
  steps: [
    {
      step: "1",
      title: "Identify Processes",
      description:
        "Audit your current workflows and pinpoint the repetitive, rule-based tasks that consume your team's time. CubicleERP's process analyzer can suggest the highest-impact candidates for automation.",
    },
    {
      step: "2",
      title: "Build Workflows",
      description:
        "Use the visual builder to drag triggers, actions, and conditions onto the canvas. Test with live data in sandbox mode before publishing. Choose from 500+ ready-made templates to get started faster.",
    },
    {
      step: "3",
      title: "Monitor & Optimize",
      description:
        "Track execution metrics on the automation dashboard — success rates, average run times, and error counts. Receive alerts when a workflow fails, and continuously refine rules to improve efficiency.",
    },
  ],
  useCases: [
    {
      title: "Operations Teams",
      description:
        "Streamline purchase requisitions, vendor onboarding, and inventory replenishment. Automatically generate purchase orders when stock dips below reorder points and route them through multi-level approvals.",
      highlights: [
        "Auto-generate POs when inventory falls below threshold",
        "Route approvals based on order value and department",
        "Sync fulfilled orders with accounting and warehouse modules",
      ],
    },
    {
      title: "Sales & Marketing",
      description:
        "Nurture leads end-to-end — from form submission to closed deal — without manual follow-up. Score leads, assign them to the right rep, trigger drip email sequences, and alert managers when deals stall.",
      highlights: [
        "Auto-assign inbound leads by territory and deal size",
        "Trigger personalized email sequences based on behavior",
        "Escalate stalled deals with manager notifications",
      ],
    },
    {
      title: "HR & Admin",
      description:
        "Onboard new hires in a fraction of the time by automating offer letters, document collection, IT provisioning requests, and training schedule creation — all triggered the moment an offer is accepted.",
      highlights: [
        "Generate offer letters and collect e-signatures automatically",
        "Create IT provisioning tickets for new employee accounts",
        "Schedule orientation sessions and assign training modules",
      ],
    },
  ],
  faqs: [
    {
      question: "Do I need coding knowledge to use the workflow builder?",
      answer:
        "Not at all. The visual builder is 100% no-code — you design workflows by dragging and dropping triggers, conditions, and actions onto a canvas. For advanced users who want even more control, an optional script step lets you add custom JavaScript snippets, but it is entirely optional.",
    },
    {
      question: "What kind of triggers can start a workflow?",
      answer:
        "Workflows can be triggered by record creation or updates, field value changes, scheduled dates and times (cron), form submissions, incoming emails, webhook calls from external systems, manual button clicks, and even other workflow completions — giving you full flexibility over when automation kicks in.",
    },
    {
      question: "Which third-party tools can I integrate with?",
      answer:
        "CubicleERP Automation ships with pre-built connectors for Slack, Microsoft Teams, Gmail, Outlook, Google Sheets, WhatsApp, Razorpay, Stripe, Shiprocket, and many more. For anything else, use the generic REST API or webhook connector to integrate virtually any service with a public API.",
    },
    {
      question: "Are there any limits on the number of workflows or executions?",
      answer:
        "Every CubicleERP plan includes unlimited active workflows. Execution volume depends on your subscription tier — the Starter plan includes 5,000 executions per month, Professional includes 50,000, and Enterprise offers unlimited executions with priority processing.",
    },
    {
      question: "How does error handling work when a workflow step fails?",
      answer:
        "Each workflow step can have its own error-handling branch — you can retry the step, skip it, route to an alternative action, or notify an admin. Failed executions are logged with full context, and you can configure automatic retries with exponential backoff for transient failures like network timeouts.",
    },
  ],
  stats: [
    { value: "80%", label: "Average time saved on manual tasks" },
    { value: "500+", label: "Ready-to-use automation templates" },
    { value: "99.9%", label: "Workflow execution reliability" },
    { value: "10x", label: "Faster process completion" },
  ],

  capabilities: [
    {
      title: "Intelligent Process Discovery",
      description:
        "Before you automate, you need to know what to automate. The process discovery engine analyzes your team's actual usage patterns across CubicleERP modules to identify repetitive tasks, bottlenecks, and high-impact automation opportunities ranked by potential time savings.",
      keyPoints: [
        "Automated task mining scans user activity logs to surface the most frequently repeated manual actions across your organization",
        "Impact scoring ranks each automation opportunity by estimated time savings, error reduction, and implementation complexity",
        "Pre-built automation templates are recommended based on your industry and the specific processes discovered",
        "One-click implementation turns a discovered process into a working draft workflow that you can review and activate immediately",
      ],
    },
    {
      title: "Cross-Module Orchestration",
      description:
        "Build workflows that span every CubicleERP module and external system in a single canvas. A single automation can create a CRM deal, generate an invoice in Finance, notify a Slack channel, update inventory, and send a customer email -- all triggered by one event.",
      keyPoints: [
        "Seamless data passing between CRM, Finance, Inventory, HRM, and every other module without manual mapping",
        "External system actions for Slack, Gmail, WhatsApp, payment gateways, and shipping providers run as native workflow steps",
        "Transaction-safe execution ensures that if any step fails, dependent steps are paused and rollback actions are triggered",
      ],
    },
    {
      title: "Approval Workflow Engine",
      description:
        "Digitize and accelerate every approval process in your organization. From expense reports and purchase orders to leave requests and contract sign-offs, the approval engine routes requests to the right people with the right context at the right time.",
      keyPoints: [
        "Multi-level approval chains support sequential, parallel, and quorum-based routing with configurable escalation rules",
        "Dynamic approver assignment routes requests based on amount thresholds, department, project, or any custom field",
        "Mobile-friendly approval inbox lets managers approve or reject with a single tap from their phone, with full context attached",
        "SLA tracking monitors how long each request sits at each approval stage and escalates automatically when deadlines approach",
      ],
    },
    {
      title: "Robotic Process Automation (RPA) Integration",
      description:
        "Extend CubicleERP workflows into legacy systems and desktop applications using built-in RPA capabilities. Automate tasks in systems that lack APIs by simulating user interactions with screen-level automation bots.",
      keyPoints: [
        "Browser-based bot recorder captures clicks, keystrokes, and data extraction steps to create reusable automation scripts",
        "Schedule RPA bots to run at specific times or trigger them as steps within larger CubicleERP workflows",
        "Built-in exception handling pauses the bot and alerts operators when it encounters unexpected screens or data",
      ],
    },
  ],

  integrations: [
    { name: "Slack", category: "Communication" },
    { name: "Microsoft Teams", category: "Communication" },
    { name: "Gmail", category: "Email" },
    { name: "WhatsApp Business", category: "Messaging" },
    { name: "Google Sheets", category: "Productivity" },
    { name: "Razorpay", category: "Payments" },
    { name: "Stripe", category: "Payments" },
    { name: "Shiprocket", category: "Shipping" },
    { name: "Twilio", category: "SMS" },
    { name: "Zapier", category: "Automation" },
    { name: "GitHub", category: "Development" },
    { name: "Jira", category: "Project Management" },
  ],

  testimonials: [
    {
      quote:
        "We automated our entire purchase order workflow -- from requisition to three-level approval to vendor notification. What used to take 3 business days now completes in under 2 hours, and we have not had a single approval slip through the cracks since.",
      author: "Thomas Grant",
      role: "Procurement Director",
      company: "Atlas Manufacturing",
      metric: "PO approval time reduced from 3 days to 2 hours",
    },
    {
      quote:
        "Our onboarding process involved 23 manual steps across HR, IT, and facilities. CubicleERP Automation reduced it to 3 human touchpoints. New hires now have their accounts, equipment, and training scheduled before their first day even starts.",
      author: "Fatima Al-Rashidi",
      role: "HR Operations Manager",
      company: "Pinnacle Consulting Group",
      metric: "87% fewer manual onboarding steps",
    },
    {
      quote:
        "The visual workflow builder is genuinely no-code. Our marketing coordinator, who has zero technical background, built a lead scoring and assignment workflow in an afternoon that our engineering team quoted two weeks to build custom.",
      author: "Daniel Park",
      role: "CTO",
      company: "VeloTech Solutions",
      metric: "Business users building workflows without IT help",
    },
  ],

  comparisons: [
    { feature: "Workflow creation", traditional: "Custom code or scripts", cubicleErp: "Visual drag-and-drop builder" },
    { feature: "Trigger options", traditional: "Scheduled batch jobs", cubicleErp: "50+ real-time event triggers" },
    { feature: "Error handling", traditional: "Silent failures", cubicleErp: "Auto-retry with alerts" },
    { feature: "Cross-system actions", traditional: "Manual data transfer", cubicleErp: "Native multi-system steps" },
    { feature: "Approval routing", traditional: "Email chains and follow-ups", cubicleErp: "Automated multi-level routing" },
    { feature: "Audit trail", traditional: "No visibility into execution", cubicleErp: "Full execution logs" },
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
    { label: "HRM", href: "/explore/hrm" },
    { label: "Email Marketing", href: "/explore/email-marketing" },
  ],
}

export default function AutomationPage() {
  return <ExploreProductPage data={data} />
}
