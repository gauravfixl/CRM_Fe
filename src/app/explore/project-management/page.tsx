"use client"

import ExploreProductPage from "@/components/landingpage2/explore/ExploreProductPage"
import {
  Briefcase,
  KanbanSquare,
  GanttChart,
  GitBranch,
  Timer,
  Users,
  LayoutTemplate,
} from "lucide-react"

const data = {
  name: "Project Management",
  tagline: "Deliver every project on time and on budget",
  description:
    "Plan, execute, and monitor projects of any scale with powerful Kanban boards, Gantt charts, and real-time collaboration tools. CubicleERP Project Management gives your teams the visibility and structure they need to consistently hit their milestones.",
  icon: Briefcase,
  color: "#5C2D91",
  lightColor: "#F3E5F5",
  heroImage: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1920&q=80",
  variant: 3 as const,
  features: [
    {
      icon: KanbanSquare,
      title: "Kanban Boards",
      description:
        "Visualize your entire workflow with drag-and-drop Kanban boards. Customize columns for each stage of your process, set WIP limits to prevent bottlenecks, and instantly see where every task stands across your pipeline.",
    },
    {
      icon: GanttChart,
      title: "Gantt Charts",
      description:
        "Map out project timelines with interactive Gantt charts that update in real time. Drag tasks to reschedule, zoom in on weekly sprints or zoom out for a quarterly overview, and spot scheduling conflicts before they derail your plan.",
    },
    {
      icon: GitBranch,
      title: "Task Dependencies",
      description:
        "Define finish-to-start, start-to-start, and other dependency types so your team always knows what needs to happen first. Automatic alerts notify assignees when blockers are resolved and their tasks are ready to begin.",
    },
    {
      icon: Timer,
      title: "Time Tracking",
      description:
        "Track hours directly within each task using built-in timers or manual entries. Compare estimated versus actual effort to refine future estimates, and generate detailed time reports for client billing or internal reviews.",
    },
    {
      icon: Users,
      title: "Resource Allocation",
      description:
        "View team workloads at a glance with capacity heatmaps. Balance assignments to prevent burnout, identify under-utilized team members, and forecast resource needs for upcoming sprints or projects.",
    },
    {
      icon: LayoutTemplate,
      title: "Project Templates",
      description:
        "Save your best project structures as reusable templates complete with task lists, milestones, and default assignees. Launch new projects in seconds instead of rebuilding from scratch every time.",
    },
  ],
  benefits: [
    {
      title: "On-Time Delivery",
      description:
        "Automated deadline tracking and proactive alerts ensure that slipping tasks are caught early. Teams using CubicleERP report up to 80% fewer missed deadlines within the first quarter.",
    },
    {
      title: "Clear Accountability",
      description:
        "Every task has a single owner, a due date, and a visible status. No more confusion about who is responsible for what — stakeholders can check progress without scheduling a status meeting.",
    },
    {
      title: "Resource Optimization",
      description:
        "Capacity planning tools show you exactly who is overloaded and who has bandwidth. Redistribute work in a few clicks to keep your team productive without burning anyone out.",
    },
    {
      title: "Real-Time Progress Visibility",
      description:
        "Live dashboards and automated status reports give leadership instant insight into project health. Track budget burn, milestone completion, and risk indicators without chasing updates from individual contributors.",
    },
    {
      title: "Cross-Team Collaboration",
      description:
        "Shared workspaces, threaded comments, and @mentions keep conversations attached to the relevant tasks. External stakeholders can be invited as guests with controlled access permissions.",
    },
    {
      title: "Reduced Scope Creep",
      description:
        "Built-in change request workflows force every new requirement through an approval process. Track the impact of scope changes on timelines and budgets before they are accepted.",
    },
  ],
  steps: [
    {
      step: "1",
      title: "Create Your Project",
      description:
        "Start from a template or build from scratch. Define milestones, set deadlines, and break work into manageable tasks with descriptions and priority levels.",
    },
    {
      step: "2",
      title: "Assign & Track",
      description:
        "Assign tasks to team members, set dependencies, and monitor progress on Kanban boards or Gantt charts. Time tracking starts automatically as work begins.",
    },
    {
      step: "3",
      title: "Deliver & Review",
      description:
        "Complete deliverables, gather stakeholder sign-off, and run retrospectives. Archive the project as a template for future use and analyze performance reports.",
    },
  ],
  useCases: [
    {
      title: "Software Development",
      description:
        "Run agile sprints with backlog grooming, sprint planning boards, and burndown charts. Integrate with your Git repositories so commits and pull requests link directly to tasks for full traceability.",
      highlights: [
        "Sprint planning with story point estimation",
        "Automated burndown and velocity charts",
        "Git integration for commit-to-task linking",
      ],
    },
    {
      title: "Marketing Teams",
      description:
        "Coordinate campaign launches across content, design, social media, and paid channels. Shared calendars keep everyone aligned on publish dates, and approval workflows ensure brand consistency.",
      highlights: [
        "Campaign calendars with multi-channel views",
        "Creative approval and review workflows",
        "Budget tracking per campaign and channel",
      ],
    },
    {
      title: "Consulting Firms",
      description:
        "Manage multiple client engagements simultaneously with isolated project spaces. Track billable hours per engagement, generate client-facing status reports, and forecast revenue across your portfolio.",
      highlights: [
        "Client-specific workspaces with access control",
        "Billable hours tracking and invoice generation",
        "Portfolio-level dashboards for firm leadership",
      ],
    },
  ],
  faqs: [
    {
      question: "Does CubicleERP support agile, waterfall, and hybrid methodologies?",
      answer:
        "Yes. You can configure each project independently. Use Kanban boards and sprints for agile workflows, Gantt charts with phase gates for waterfall, or combine both in a hybrid setup. Methodology-specific templates are included out of the box.",
    },
    {
      question: "Can I integrate with tools like GitHub, Slack, and Jira?",
      answer:
        "CubicleERP offers native integrations with GitHub, GitLab, Bitbucket, Slack, Microsoft Teams, and dozens of other tools. For anything else, our REST API and webhook support let you build custom integrations in minutes.",
    },
    {
      question: "Is there a limit on team size or number of projects?",
      answer:
        "No. All plans support unlimited projects. Team size varies by plan — our Starter plan supports up to 10 users, Professional supports up to 50, and Enterprise is fully unlimited with dedicated support and custom SLAs.",
    },
    {
      question: "Can I create and share custom project templates?",
      answer:
        "Absolutely. Save any project structure — including task hierarchies, default assignees, milestones, and automations — as a reusable template. Templates can be shared across your organization or kept private to your team.",
    },
    {
      question: "What kind of reporting and analytics are available?",
      answer:
        "You get real-time dashboards with widgets for task completion rates, time-to-completion trends, resource utilization, and budget burn. Scheduled PDF and CSV reports can be emailed to stakeholders automatically on a daily, weekly, or monthly basis.",
    },
  ],
  stats: [
    { value: "45%", label: "Faster project delivery" },
    { value: "80%", label: "Fewer missed deadlines" },
    { value: "3x", label: "Team productivity increase" },
    { value: "30%", label: "Project cost savings" },
  ],
  capabilities: [
    {
      title: "Advanced Sprint & Agile Management",
      description:
        "Run full agile ceremonies with dedicated sprint planning boards, backlog grooming tools, and automated burndown tracking. Whether your team follows Scrum, Kanban, or a hybrid approach, the platform adapts to your workflow.",
      keyPoints: [
        "Sprint creation with story point estimation and velocity tracking",
        "Backlog prioritization with drag-and-drop ranking and effort scoring",
        "Automated burndown, burnup, and cumulative flow diagrams",
        "Retrospective boards with action item tracking across sprints",
      ],
    },
    {
      title: "Portfolio & Program Management",
      description:
        "Manage multiple projects as a unified portfolio with cross-project dependency mapping, consolidated dashboards, and program-level resource allocation. Ideal for PMOs overseeing dozens of concurrent initiatives.",
      keyPoints: [
        "Portfolio dashboards showing health, budget, and timeline across all projects",
        "Cross-project dependency visualization to identify cascading risks",
        "Program-level milestone tracking with roll-up status reporting",
        "Strategic alignment scoring to prioritize projects against business goals",
      ],
    },
    {
      title: "Intelligent Workload Balancing",
      description:
        "Prevent burnout and underutilization with real-time workload heatmaps that show exactly how capacity is distributed across your team. Reassign tasks with drag-and-drop and forecast resource needs for upcoming periods.",
      keyPoints: [
        "Capacity heatmaps with daily and weekly utilization views",
        "Drag-and-drop task reassignment from the resource dashboard",
        "Forecasting models that predict resource shortages before they happen",
      ],
    },
    {
      title: "Budget & Cost Tracking",
      description:
        "Track project budgets in real time with cost breakdowns by phase, task, and resource. Compare planned versus actual spend, set budget threshold alerts, and generate profitability reports for client-facing engagements.",
      keyPoints: [
        "Budget allocation by project phase with real-time burn tracking",
        "Hourly rate management for internal and contractor resources",
        "Profitability analysis comparing revenue against labor and expense costs",
        "Automated alerts when spend exceeds configurable budget thresholds",
      ],
    },
  ],
  integrations: [
    { name: "GitHub", category: "Development" },
    { name: "GitLab", category: "Development" },
    { name: "Bitbucket", category: "Development" },
    { name: "Slack", category: "Communication" },
    { name: "Microsoft Teams", category: "Communication" },
    { name: "Google Drive", category: "Storage" },
    { name: "Dropbox", category: "Storage" },
    { name: "Figma", category: "Design" },
    { name: "Zapier", category: "Automation" },
    { name: "Google Calendar", category: "Scheduling" },
    { name: "Confluence", category: "Documentation" },
    { name: "Notion", category: "Productivity" },
  ],
  testimonials: [
    {
      quote:
        "We moved from Jira and Asana to CubicleERP and consolidated everything into one tool. The Gantt charts are incredibly intuitive, and the fact that time tracking and invoicing are built in saved us from stitching together three separate products.",
      author: "David Park",
      role: "Director of Engineering",
      company: "Vantage Labs",
      metric: "45% faster project delivery",
    },
    {
      quote:
        "As a consulting firm managing 40+ client engagements simultaneously, portfolio-level visibility was critical. CubicleERP gives our leadership real-time insight into every project without a single status meeting.",
      author: "Kavitha Rao",
      role: "Managing Partner",
      company: "Elevate Advisory",
      metric: "80% fewer missed deadlines",
    },
    {
      quote:
        "The resource allocation heatmaps completely changed how we plan sprints. We stopped overloading our senior engineers and started distributing work more evenly, which improved both velocity and team morale.",
      author: "Tom Henriksen",
      role: "VP of Product",
      company: "StreamForge Inc.",
      metric: "3x improvement in team throughput",
    },
  ],
  comparisons: [
    { feature: "Task Management", traditional: "Static to-do lists", cubicleErp: "Dynamic boards and charts" },
    { feature: "Time Tracking", traditional: "Separate timekeeping app", cubicleErp: "Built into every task" },
    { feature: "Resource Planning", traditional: "Manual spreadsheet grids", cubicleErp: "Live capacity heatmaps" },
    { feature: "Dependency Tracking", traditional: "Verbal communication", cubicleErp: "Automated alerts and links" },
    { feature: "Client Reporting", traditional: "Manual slide decks", cubicleErp: "Auto-generated dashboards" },
    { feature: "Budget Monitoring", traditional: "Monthly finance review", cubicleErp: "Real-time cost tracking" },
  ],
  subNavItems: [
    { label: "Overview", sectionId: "hero" },
    { label: "Features", sectionId: "features" },
    { label: "Capabilities", sectionId: "capabilities" },
    { label: "Benefits", sectionId: "benefits" },
    { label: "Integrations", sectionId: "integrations" },
    { label: "Use Cases", sectionId: "use-cases" },
    { label: "FAQs", sectionId: "faqs" },
    { label: "Time Tracking", href: "/explore/time-tracking" },
    { label: "Documents", href: "/explore/documents" },
    { label: "Automation", href: "/explore/automation" },
  ],
}

export default function ProjectManagementPage() {
  return <ExploreProductPage data={data} />
}
