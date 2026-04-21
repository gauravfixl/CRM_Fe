"use client"

import ExploreProductPage from "@/components/landingpage2/explore/ExploreProductPage"
import {
  Clock,
  Timer,
  CalendarClock,
  FolderKanban,
  DollarSign,
  Hourglass,
  MapPin,
} from "lucide-react"

const data = {
  name: "Time Tracking",
  tagline: "Track every hour, maximize every minute",
  description:
    "Gain complete visibility into how your team spends its time. CubicleERP Time Tracking combines effortless timers, smart timesheets, and real-time reports so you can bill accurately, spot inefficiencies, and make every working hour count.",
  icon: Clock,
  color: "#E65100",
  lightColor: "#FFF3E0",
  heroImage: "https://images.unsplash.com/photo-1501139083538-0139583c060f?w=1920&q=80",
  variant: 2 as const,
  features: [
    {
      icon: Timer,
      title: "One-Click Timer",
      description:
        "Start and stop a running timer with a single click from any screen in CubicleERP. The floating timer widget stays accessible while you work, automatically associating time with the task or project you're viewing.",
    },
    {
      icon: CalendarClock,
      title: "Weekly & Monthly Timesheets",
      description:
        "Fill out structured timesheets by day, week, or month. Pre-populated entries from timer data reduce data entry, and configurable approval workflows let managers review and approve timesheets before they flow into payroll.",
    },
    {
      icon: FolderKanban,
      title: "Project-Based Tracking",
      description:
        "Allocate time to specific projects, tasks, and subtasks. See exactly how many hours each project phase consumes, compare against estimates, and identify which deliverables are eating into margins.",
    },
    {
      icon: DollarSign,
      title: "Billable vs. Non-Billable Hours",
      description:
        "Tag every time entry as billable or non-billable with customizable rate cards per client, project, or employee. Generate client-ready invoices directly from tracked billable hours — no spreadsheet wrangling required.",
    },
    {
      icon: Hourglass,
      title: "Overtime & Leave Calculation",
      description:
        "Automatically flag overtime based on configurable daily or weekly thresholds. Factor in company holidays, leave balances, and shift schedules to calculate accurate overtime pay and ensure labor-law compliance.",
    },
    {
      icon: MapPin,
      title: "GPS & Location Tracking",
      description:
        "Verify field-team attendance with GPS-stamped clock-ins and clock-outs. View team locations on a live map, set up geofenced job sites, and generate location-verified attendance reports for compliance audits.",
    },
  ],
  benefits: [
    {
      title: "Accurate Client Billing",
      description:
        "Eliminate revenue leakage by capturing every billable minute. Firms using CubicleERP Time Tracking recover an average of 30% more billable time that previously went unrecorded or was rounded down.",
    },
    {
      title: "Actionable Productivity Insights",
      description:
        "Dashboards break down time by project, team, and activity type. Quickly spot where time is being over-invested, identify bottlenecks, and reallocate resources to high-priority work before deadlines slip.",
    },
    {
      title: "Seamless Payroll Integration",
      description:
        "Approved timesheets feed directly into CubicleERP Payroll, calculating regular hours, overtime, and shift differentials automatically. No duplicate entry, no reconciliation headaches, no payroll errors.",
    },
    {
      title: "Real-Time Project Profitability",
      description:
        "Compare actual hours against budgeted hours in real time. Get early warnings when a project is trending over-budget, so you can adjust scope or resourcing before margins erode.",
    },
    {
      title: "Labor-Law Compliance",
      description:
        "Built-in rules for overtime caps, mandatory break tracking, and maximum consecutive work days help you stay compliant with local labor regulations and avoid costly penalties during audits.",
    },
    {
      title: "Team Accountability & Transparency",
      description:
        "When everyone logs time consistently, there are no surprises. Team members gain ownership of their schedules, managers get visibility without micromanaging, and clients receive transparent, trustworthy reports.",
    },
  ],
  steps: [
    {
      step: "1",
      title: "Start Tracking",
      description:
        "Use the one-click timer, log hours manually on a timesheet, or let the system auto-capture time from calendar events and task activity. Choose the method that fits your workflow — or mix all three.",
    },
    {
      step: "2",
      title: "Review Timesheets",
      description:
        "Employees submit weekly timesheets for manager approval. The review dashboard highlights anomalies — missing days, unusually long entries, and untagged time — so approvals are fast and accurate.",
    },
    {
      step: "3",
      title: "Bill & Report",
      description:
        "Generate detailed time reports filtered by client, project, employee, or date range. Convert billable entries into invoices with one click, and export data to payroll, accounting, or any external BI tool.",
    },
  ],
  useCases: [
    {
      title: "Professional Services",
      description:
        "Law firms, consultancies, and agencies that bill by the hour need airtight time records. CubicleERP lets every consultant track time against client matters, apply tiered billing rates, and produce audit-ready invoices.",
      highlights: [
        "Matter-level time tracking with client-specific rate cards",
        "Generate detailed invoice narratives from time entries",
        "Compare estimated vs. actual hours per engagement",
      ],
    },
    {
      title: "Remote & Hybrid Teams",
      description:
        "Distributed teams need a lightweight way to stay aligned without surveillance. Activity-based tracking, automated reminders, and shared dashboards keep everyone accountable while respecting autonomy.",
      highlights: [
        "Timezone-aware timesheets for globally distributed teams",
        "Automated nudges when daily time logs are incomplete",
        "Manager dashboards with team utilization heatmaps",
      ],
    },
    {
      title: "Freelancers & Contractors",
      description:
        "Independent professionals juggling multiple clients need clear, per-project time logs to invoice accurately and prove the value of their work. CubicleERP makes it effortless to separate and report client time.",
      highlights: [
        "Per-client project boards with individual time budgets",
        "Export branded time reports as PDF for client delivery",
        "Track non-billable admin time to understand true capacity",
      ],
    },
  ],
  faqs: [
    {
      question: "What are the different ways to track time?",
      answer:
        "CubicleERP supports three methods: a one-click start/stop timer that runs in the background, manual timesheet entry where you log hours against tasks after the fact, and automatic capture that pulls time from linked calendar events and task status changes. You can use any combination that suits your workflow.",
    },
    {
      question: "Is there a mobile app for time tracking?",
      answer:
        "Yes. The CubicleERP mobile app (iOS and Android) includes a full-featured time tracker with timer, manual entry, GPS clock-in, and offline support. Entries sync automatically when you reconnect, so field teams never lose logged hours.",
    },
    {
      question: "Which payroll and accounting tools does it integrate with?",
      answer:
        "Time data flows natively into CubicleERP Payroll and Accounting. For external tools, we offer direct integrations with Tally, QuickBooks, Xero, and Zoho Books. You can also export timesheet data as CSV or push it via REST API to any system you use.",
    },
    {
      question: "Can I track time when I'm offline?",
      answer:
        "Absolutely. Both the mobile app and the desktop timer work fully offline. Time entries, GPS stamps, and notes are stored locally and sync to the server the moment your device reconnects. You will never lose data due to a spotty internet connection.",
    },
    {
      question: "How does the timesheet approval workflow work?",
      answer:
        "Employees submit completed timesheets at the end of each period (daily, weekly, or monthly — configurable per team). Designated approvers receive a notification, review entries on a summary dashboard, and can approve, reject, or request edits with comments. Approved timesheets are locked and flow into payroll and billing automatically.",
    },
  ],
  stats: [
    { value: "99%", label: "Billing accuracy with tracked hours" },
    { value: "30%", label: "More billable hours recovered" },
    { value: "5 min", label: "Average daily time to log hours" },
    { value: "20%", label: "Increase in project profitability" },
  ],

  capabilities: [
    {
      title: "Intelligent Time Capture",
      description:
        "Go beyond manual timers with AI-assisted time capture that learns your work patterns. The system analyzes calendar events, task transitions, and application usage to suggest time entries you may have forgotten to log, ensuring nothing slips through the cracks.",
      keyPoints: [
        "Calendar integration auto-detects meetings and suggests time entries for every event with attendee and project context",
        "Task activity monitoring identifies when you start and stop working on project tasks and pre-fills timer entries accordingly",
        "End-of-day summary prompts highlight gaps in your logged time and suggest entries based on your activity patterns",
        "Idle detection pauses running timers after configurable inactivity periods and prompts you to classify the idle time",
      ],
    },
    {
      title: "Resource Utilization Analytics",
      description:
        "Transform raw time data into strategic workforce insights. Utilization dashboards show exactly how team capacity is allocated across projects, clients, and internal work, helping managers balance workloads and plan hiring decisions with confidence.",
      keyPoints: [
        "Real-time utilization rates per employee, team, and department displayed against target benchmarks",
        "Capacity planning forecasts project future workload based on booked projects and historical velocity",
        "Burnout risk indicators flag team members consistently working above sustainable thresholds before problems escalate",
      ],
    },
    {
      title: "Client-Ready Reporting and Invoicing",
      description:
        "Convert tracked hours into polished client reports and invoices with a single click. Customizable report templates let you present time data in the format each client expects, with configurable detail levels from summary to line-item granularity.",
      keyPoints: [
        "Branded time reports with your logo, client name, and configurable column layouts exportable as PDF or Excel",
        "One-click invoice generation pulls billable hours, applies client-specific rate cards, and creates draft invoices in CubicleERP Finance",
        "Approval workflows let project managers review and adjust time entries before they reach the client",
        "Retainer tracking monitors hours consumed against prepaid hour banks and alerts when balances run low",
      ],
    },
    {
      title: "Compliance and Labor Law Engine",
      description:
        "Stay compliant with labor regulations automatically. The compliance engine enforces overtime rules, mandatory break requirements, and maximum working hour limits based on your jurisdiction, alerting managers before violations occur.",
      keyPoints: [
        "Pre-configured rule sets for major labor jurisdictions including US FLSA, EU Working Time Directive, and India Shops and Establishments Act",
        "Real-time alerts notify managers when an employee approaches daily or weekly overtime thresholds",
        "Mandatory break enforcement ensures minimum rest periods are logged between work sessions",
      ],
    },
  ],

  integrations: [
    { name: "Jira", category: "Project Management" },
    { name: "Asana", category: "Project Management" },
    { name: "Trello", category: "Project Management" },
    { name: "Google Calendar", category: "Scheduling" },
    { name: "Microsoft Outlook", category: "Scheduling" },
    { name: "QuickBooks", category: "Accounting" },
    { name: "Xero", category: "Accounting" },
    { name: "Slack", category: "Communication" },
    { name: "Tally", category: "Accounting" },
    { name: "Zoho Books", category: "Accounting" },
    { name: "GitHub", category: "Development" },
    { name: "Microsoft Teams", category: "Communication" },
  ],

  testimonials: [
    {
      quote:
        "As a 40-person consulting firm, we were losing an estimated 15% of billable hours to poor tracking habits. CubicleERP's one-click timer and end-of-day reminders helped us recover those hours, adding $320K to our annual revenue without taking on a single new client.",
      author: "Laura Pennington",
      role: "Managing Partner",
      company: "Pennington Strategy Group",
      metric: "$320K in recovered annual billable revenue",
    },
    {
      quote:
        "The timesheet approval workflow and payroll integration eliminated what used to be a two-day reconciliation process at the end of every pay period. Our payroll team went from dreading month-end to barely noticing it.",
      author: "Kenji Watanabe",
      role: "Finance Controller",
      company: "Bridgepoint Engineering",
      metric: "Payroll processing time cut from 2 days to 2 hours",
    },
    {
      quote:
        "We manage 200+ field technicians across three states. GPS clock-in verification and geofenced job sites gave us the attendance accuracy we needed to bill our government contracts with full confidence and zero audit findings.",
      author: "Sandra Mitchell",
      role: "Director of Field Operations",
      company: "CoreTech Infrastructure Services",
      metric: "Zero audit findings on government time billing",
    },
  ],

  comparisons: [
    { feature: "Time entry", traditional: "Manual spreadsheet logging", cubicleErp: "One-click timer + AI assist" },
    { feature: "Timesheet approval", traditional: "Email-based review chain", cubicleErp: "Built-in approval workflow" },
    { feature: "Invoicing from hours", traditional: "Export and reformat data", cubicleErp: "One-click invoice generation" },
    { feature: "Overtime tracking", traditional: "Manual calculation", cubicleErp: "Automatic rule enforcement" },
    { feature: "Field attendance", traditional: "Paper sign-in sheets", cubicleErp: "GPS-verified clock-in" },
    { feature: "Payroll sync", traditional: "Manual data re-entry", cubicleErp: "Direct payroll integration" },
  ],

  subNavItems: [
    { label: "Overview", sectionId: "hero" },
    { label: "Features", sectionId: "features" },
    { label: "Capabilities", sectionId: "capabilities" },
    { label: "Benefits", sectionId: "benefits" },
    { label: "Integrations", sectionId: "integrations" },
    { label: "Use Cases", sectionId: "use-cases" },
    { label: "FAQs", sectionId: "faqs" },
    { label: "Project Management", href: "/explore/project-management" },
    { label: "Payroll", href: "/explore/payroll" },
    { label: "HRM", href: "/explore/hrm" },
  ],
}

export default function TimeTrackingPage() {
  return <ExploreProductPage data={data} />
}
