"use client"

import * as React from "react"
import { useEffect, useState, useMemo } from "react"
import {
  People24Filled as Users,
  Shield24Filled as Shield,
  LockClosed24Filled as Lock,
  DocumentText24Filled as FileText,
  DataPie24Filled as PieChart,
  PersonAdd24Filled as UserPlus,
  PersonAvailable24Filled as UserCheck,
  Payment24Filled as CreditCard,
  Briefcase24Filled as Briefcase,
  Settings24Filled as Settings,
  CalendarClock24Filled as CalendarClock,
  Calculator24Filled as Calculator,
  Building24Filled as Building2,
  Board24Filled as LayoutDashboard,
  CheckmarkCircle24Filled as CheckCircle,
  BoardSplit24Filled as FolderKanban,
  DataBarHorizontal24Filled as BarChart3,
  ContactCard24Filled as Contact,
  CalendarLtr24Filled as Calendar,
  Board24Filled as Trello,
  Flash24Filled as Zap,
  Timer24Filled as Timer,
  Trophy24Filled as Award,
  Money24Filled as Banknote,
  Receipt24Filled as Receipt,
  ChevronLeft24Regular as ChevronLeft,
  ChevronRight24Regular as ChevronRight,
  Navigation24Filled as Menu,
  ShoppingBag24Filled as ShoppingBag,
  Cart24Filled as ShoppingCart,
  Megaphone24Filled as Megaphone,
  PersonSupport24Filled as LifeBuoy,
  BookOpen24Filled as BookOpen,
  DocumentCopy24Filled as FileStack,
  ChevronDown24Regular as ChevronDown,
  ArrowLeft24Regular as ArrowLeft,
  Filter24Filled as Filter,
  FilterDismiss24Filled as ListFilter,
  Flow24Filled as Workflow,
  DataBarVertical24Filled as ChartBar,
  Clock24Filled as Clock,
  Add24Filled as Plus,
  Target24Filled as Target,
  ArrowTrendingLines24Filled as TrendingUp,
  Money24Filled as DollarSign,
  Location24Filled as MapPin,
  Key24Filled as Key,
  Pulse24Filled as Activity,
  PersonCircle24Filled as UserCircle,
  NetworkCheck24Filled as Network,
  ShieldCheckmark24Filled as ShieldCheck,
  Color24Filled as Palette,
  PersonDelete24Filled as UserMinus,
  KeyMultiple24Filled as KeyRound,
  Globe24Filled as Globe,
  TextBulletListTree24Filled as ListTree,
  ShieldError24Filled as ShieldAlert,
  PersonProhibited24Filled as UserX,
  Box24Filled as Box,
  Box24Filled as Package,
  Delete24Filled as Trash2,
  Edit24Filled as Edit3,
  History24Filled as History,
  Phone24Filled as Smartphone,
  Desktop24Filled as Monitor,
  ArrowDownload24Filled as Download,
  Database24Filled as HardDrive,
  ArrowUndo24Filled as RotateCcw,
  Copy24Filled as Copy,
  HeartPulse24Filled as HeartPulse,
  Warning24Filled as AlertTriangle,
  Mail24Filled as Mail,
  Apps24Filled as Webhook,
  ArrowSync24Filled as RefreshCw,
  CloudArrowUp24Filled as ArrowUpCircle,
  Alert24Filled as Bell,
  Database24Filled as Database,
  Bot24Filled as Bot,
  BrainCircuit24Filled as Cpu,
} from "@fluentui/react-icons"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarHeader,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar"

import { Separator } from "@/components/ui/separator"
import { useParams, usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { userById } from "@/hooks/userHooks"
import { useLoaderStore } from "@/lib/loaderStore"

// Microsoft Entra-style icon colors
const ICON_COLORS: Record<string, { bg: string; icon: string }> = {
  "SECURITY": { bg: "bg-red-100 dark:bg-red-950", icon: "text-red-500 dark:text-red-400" },
  "LEAD": { bg: "bg-cyan-100 dark:bg-cyan-950", icon: "text-cyan-500 dark:text-cyan-400" },
  "PROJECT": { bg: "bg-indigo-100 dark:bg-indigo-950", icon: "text-indigo-500 dark:text-indigo-400" },
  "DASHBOARD": { bg: "bg-blue-100 dark:bg-blue-950", icon: "text-blue-500 dark:text-blue-400" },
  "GOVERNANCE": { bg: "bg-amber-100 dark:bg-amber-950", icon: "text-amber-500 dark:text-amber-400" },
  "CRM": { bg: "bg-purple-100 dark:bg-purple-950", icon: "text-purple-500 dark:text-purple-400" },
  "FINANCE": { bg: "bg-emerald-100 dark:bg-emerald-950", icon: "text-emerald-500 dark:text-emerald-400" },
  "HRM": { bg: "bg-pink-100 dark:bg-pink-950", icon: "text-pink-500 dark:text-pink-400" },
  "ORGANIZATION": { bg: "bg-blue-100 dark:bg-blue-950", icon: "text-blue-500 dark:text-blue-400" },
};

const getIconColor = (title: string = "") => {
  const t = title.toUpperCase();
  for (const key in ICON_COLORS) {
    if (t.includes(key)) return ICON_COLORS[key];
  }
  return { bg: "bg-zinc-100 dark:bg-zinc-800", icon: "text-zinc-500 dark:text-zinc-400" };
};

// Exact 15 items - Optimised for Enterprise CRM/HRM/PM (Fixl Solutions)
// Final Recommended Admin Sidebar Structure
const sidebarGroupsData = [
  {
    title: "DASHBOARD",
    icon: LayoutDashboard,
    url: "/dashboard",
    items: []
  },
  {
    title: "CALENDAR",
    icon: Calendar,
    url: "/modules/calendar",
    items: []
  },
  {
    title: "CRM SYSTEM",
    icon: Users,
    items: [
      { title: "Leads", icon: UserPlus, url: "/modules/crm/leads" },
      { title: "Deals / Opportunities", icon: Briefcase, url: "/modules/crm/deals" },
      { title: "Sales Pipeline", icon: LayoutDashboard, url: "/modules/crm/pipeline" },
      { title: "Clients / Accounts", icon: UserCheck, url: "/modules/crm/clients" },
      { title: "Contacts", icon: Contact, url: "/modules/crm/contacts" },
      { title: "Activities", icon: CalendarClock, url: "/modules/crm/activities" },
      { title: "Campaigns", icon: Megaphone, url: "/modules/crm/campaigns" },
      { title: "CRM Settings", icon: Target, url: "/modules/crm/settings" },
    ]
  },
  {
    title: "SALES & COMMERCE", // Odoo Style
    icon: ShoppingCart,
    items: [
      { title: "Products / Services", icon: ShoppingBag, url: "/modules/sales/products" }, // New
      { title: "Quotes / Proposals", icon: FileStack, url: "/modules/sales/quotes" }, // New
      { title: "Sales Orders", icon: ShoppingCart, url: "/modules/sales/orders" }, // New
    ]
  },
  {
    title: "SUPPORT DESK", // Salesforce Service Cloud
    icon: LifeBuoy,
    items: [
      { title: "Tickets / Cases", icon: LifeBuoy, url: "/modules/support/tickets" }, // New
      { title: "Knowledge Base", icon: BookOpen, url: "/modules/support/kb" }, // New
    ]
  },
  {
    title: "PROJECT MANAGEMENT",
    icon: FolderKanban,
    items: [
      { title: "Workspaces", icon: Building2, url: "/modules/workspaces/manage" },
      { title: "Projects", icon: FolderKanban, url: "/modules/workspaces" },
      { title: "Tasks", icon: CheckCircle, url: "/modules/workspaces/tasks" },
      { title: "Boards", icon: Trello, url: "/modules/workspaces/boards" },
      { title: "Sprints", icon: Zap, url: "/modules/workspaces/sprints" },
      { title: "Time Tracking", icon: Timer, url: "/modules/workspaces/time" },
      { title: "PM Settings", icon: Workflow, url: "/modules/project-management/settings" },
    ]
  },
  {
    title: "HRM / WORKFORCE",
    icon: Users,
    items: [
      { title: "HR Dashboard", icon: LayoutDashboard, url: "/hrmcubicle" },
      { title: "Employees", icon: Users, url: "/modules/hr/employees" },
      { title: "Attendance", icon: CalendarClock, url: "/modules/attendance/daily" },
      { title: "Leave Management", icon: CalendarClock, url: "/modules/leave-management" },
      { title: "Payroll", icon: Receipt, url: "/modules/hr/payroll" },
      { title: "Performance Reviews", icon: Award, url: "/modules/hr/performance" },
      { title: "Recruitment", icon: UserPlus, url: "/modules/hr/recruitment" },
      { title: "HR Settings", icon: ShieldCheck, url: "/modules/hr/settings" },
    ]
  },
  {
    title: "FINANCE",
    icon: Calculator,
    items: [
      { title: "Invoices", icon: CreditCard, url: "/modules/invoice/all" },
      { title: "Payments", icon: CreditCard, url: "/modules/payments" },
      { title: "Accounting", icon: Calculator, url: "/modules/accounting" },
      { title: "Expenses", icon: Banknote, url: "/modules/finance/expenses" },
    ]
  },
  {
    title: "ANALYTICS",
    icon: PieChart,
    items: [
      { title: "Reports", icon: PieChart, url: "/reports" },
      { title: "Performance Insights", icon: BarChart3, url: "/modules/performance" },
    ]
  },
  {
    title: "ADMINISTRATION",
    icon: Settings,
    items: [
      { title: "Organization Profile", icon: Building2, url: "/modules/organization/all-org" },
      { title: "Business Units", icon: Building2, url: "/modules/firm-management/firms" },
      { title: "Users", icon: Users, url: "/modules/users" },
      { title: "Roles & Permissions", icon: Shield, url: "/modules/administration/roles" },
      { title: "Workflow Automation", icon: Settings, url: "/modules/settings/automation" },
      { title: "Integrations", icon: Settings, url: "/modules/settings/integrations" },
      { title: "Security Overview", icon: Lock, url: "/security" },
      { title: "Audit Logs", icon: FileText, url: "/audit-logs" },
    ]
  },
];

// Identity & Access - Users Sub-Sidebar
const usersAdminMenuData = [
  {
    group: "USER MANAGEMENT",
    items: [
      { title: "All Users", url: "/modules/users", icon: Users },
      { title: "Administrators", url: "/modules/users/admins", icon: ShieldCheck },
      { title: "Service Accounts", url: "/modules/users/service-accounts", icon: Bot },
      { title: "Guest Users", url: "/modules/users/guests", icon: Globe },
      { title: "Deleted Users", url: "/modules/users/deleted", icon: UserMinus },
    ]
  },
  {
    group: "IDENTITY GOVERNANCE",
    items: [
      { title: "Invitations", url: "/modules/users/invitations", icon: UserPlus },
      { title: "Bulk Sync (SCIM/CSV)", url: "/modules/users/bulk", icon: RefreshCw },
      { title: "Onboarding Status", url: "/modules/users/onboarding", icon: UserCheck },
    ]
  },
  {
    group: "SECURITY & MONITORING",
    items: [
      { title: "Sign-in Activity", url: "/activity-logs", icon: History },
      { title: "MFA Enrollment", url: "/modules/users/mfa", icon: ShieldCheck },
      { title: "Blocked & Risky Users", url: "/modules/users/blocked", icon: UserX },
      { title: "Password Reset Queue", url: "/modules/users/password-resets", icon: KeyRound },
    ]
  }
];

// Identity & Access - Groups Sub-Sidebar
const groupsAdminMenuData = [
  {
    group: "GROUP MANAGEMENT",
    items: [
      { title: "All Groups", url: "/modules/teams", icon: Users },
      { title: "Security Groups", url: "/modules/teams/security", icon: ShieldCheck },
      { title: "M365 Groups", url: "/modules/teams/m365", icon: Globe },
      { title: "Deleted Groups", url: "/modules/teams/deleted", icon: Trash2 },
    ]
  },
  {
    group: "AUTOMATION",
    items: [
      { title: "Dynamic Membership", url: "/modules/teams/dynamic", icon: Zap },
    ]
  }
];

// Identity & Access - Roles Sub-Sidebar
const rolesAdminMenuData = [
  {
    group: "ACCESS CONTROL",
    items: [
      { title: "Roles & Permissions", url: "/modules/administration/roles", icon: Shield },
      { title: "Custom Roles", url: "/modules/administration/roles/custom", icon: Settings },
      { title: "Permission Matrix", url: "/modules/administration/roles?tab=permissions", icon: ListTree },
      { title: "Role Assignments", url: "/modules/administration/roles?tab=assignments", icon: UserCheck },
    ]
  },
  {
    group: "GOVERNANCE",
    items: [
      { title: "Administrative Units", url: "/modules/administration/units", icon: Network }, // Scoped admin
      { title: "Baseline Security", url: "/modules/administration/security-baseline", icon: ShieldCheck },
      { title: "Access Reviews", url: "/modules/administration/reviews", icon: History }, // Compliance item
    ]
  }
];

// Identity & Access - Authentication Sub-Sidebar
const authAdminMenuData = [
  {
    group: "METHODS",
    items: [
      { title: "MFA Setup", url: "/modules/settings/auth/mfa", icon: ShieldCheck },
      { title: "Single Sign-On (SSO)", url: "/modules/settings/auth/sso", icon: Key },
      { title: "Passwordless", url: "/modules/settings/auth/passwordless", icon: Zap },
    ]
  },
  {
    group: "POLICIES",
    items: [
      { title: "Conditional Access", url: "/modules/settings/auth/conditional", icon: Lock },
      { title: "Password Policy", url: "/modules/settings/auth/password-policy", icon: Settings },
      { title: "Login Restrictions", icon: ShieldAlert, url: "/modules/settings/auth/restrictions" },
    ]
  }
];

// --- MODULES & ENTITLEMENTS GOVERNANCE MENUS ---

// 1. Lead Management Governance
const leadGovernanceMenuData = [
  {
    group: "OVERSIGHT & MONITORING",
    items: [
      { title: "Governance Overview", url: "/modules/settings/entitlements/leads", icon: LayoutDashboard },
      { title: "Master Lead View", url: "/modules/settings/entitlements/leads/all", icon: ListTree },
      { title: "Lead Trash & Recovery", url: "/modules/settings/entitlements/leads/trash", icon: Trash2 },
      { title: "Global Insights", url: "/modules/settings/entitlements/leads/insights", icon: PieChart },
    ]
  },
  {
    group: "SALES STAGES & CAPTURE",
    items: [
      { title: "Lead Pipelines", url: "/modules/settings/entitlements/leads/pipelines", icon: LayoutDashboard },
      { title: "Lead Sources", url: "/modules/settings/entitlements/leads/sources", icon: Globe },
      { title: "Conversion Rules", url: "/modules/settings/entitlements/leads/conversion", icon: CheckCircle },
      { title: "Lead Fields & Layouts", url: "/modules/settings/entitlements/leads/fields", icon: Settings },
      { title: "Lead Capture (Web-to-Lead)", url: "/modules/settings/entitlements/leads/capture", icon: Download },
    ]
  },
  {
    group: "GOVERNANCE & RULES",
    items: [
      { title: "Assignment Rules", url: "/modules/settings/entitlements/leads/assignment", icon: UserCheck },
      { title: "Scoring & Activity Standards", url: "/modules/settings/entitlements/leads/scoring", icon: ChartBar },
      { title: "Duplicate Detection", url: "/modules/settings/entitlements/leads/deduplication", icon: Copy },
    ]
  },
  {
    group: "SECURITY & COMPLIANCE",
    items: [
      { title: "Lead Permissions", url: "/modules/settings/entitlements/leads/permissions", icon: Lock },
      { title: "Data Retention", url: "/modules/settings/entitlements/leads/retention", icon: Clock },
    ]
  }
];

// 2. Client Management Governance
const clientGovernanceMenuData = [
  {
    group: "CLIENT LIFECYCLE",
    items: [
      { title: "Master Client View", url: "/modules/settings/entitlements/clients/all", icon: Users },
      { title: "Lifecycle Stages", url: "/modules/settings/entitlements/clients/lifecycle", icon: History },
      { title: "Fields & Layouts", url: "/modules/settings/entitlements/clients/fields", icon: Settings },
    ]
  },
  {
    group: "OWNERSHIP & ACCESS",
    items: [
      { title: "Ownership Rules", url: "/modules/settings/entitlements/clients/ownership", icon: UserCheck },
      { title: "Access & Visibility", url: "/modules/settings/entitlements/clients/visibility", icon: ShieldCheck },
      { title: "Trash & Recovery", url: "/modules/settings/entitlements/clients/trash", icon: Trash2 },
    ]
  },
  {
    group: "DATA GOVERNANCE",
    items: [
      { title: "Archival Rules", url: "/modules/settings/entitlements/clients/archival", icon: FolderKanban },
      { title: "Data Retention & Privacy", url: "/modules/settings/entitlements/clients/privacy", icon: Shield },
    ]
  }
];

// 3. Project Management Governance
const projectGovernanceMenuData = [
  {
    group: "STANDARDIZATION",
    items: [
      { title: "Project Types", url: "/modules/settings/entitlements/projects/types", icon: FolderKanban },
      { title: "Workflow Status", url: "/modules/settings/entitlements/projects/workflow", icon: Workflow },
      { title: "Task Types", url: "/modules/settings/entitlements/projects/tasks", icon: CheckCircle },
      { title: "Priority Levels", url: "/modules/settings/entitlements/projects/priorities", icon: ChartBar },
    ]
  },
  {
    group: "DEFAULTS & TRACKING",
    items: [
      { title: "Time Tracking Defaults", url: "/modules/settings/entitlements/projects/time", icon: Timer },
      { title: "Workspace Defaults", url: "/modules/settings/entitlements/projects/workspaces", icon: Building2 },
    ]
  },
  {
    group: "SECURITY",
    items: [
      { title: "Issue Permissions", url: "/modules/settings/entitlements/projects/permissions", icon: Lock },
      { title: "Archival Rules", url: "/modules/settings/entitlements/projects/archival", icon: Clock },
    ]
  }
];

// 4. Accounting Governance
const accountingGovernanceMenuData = [
  {
    group: "FINANCIAL STANDARDS",
    items: [
      { title: "Tax Config (Global/Firm)", url: "/modules/settings/entitlements/accounting/taxes", icon: Calculator },
      { title: "Invoice & Draft Flow", url: "/modules/settings/entitlements/accounting/invoices", icon: Receipt },
      { title: "Currency & FX Rules", url: "/modules/settings/entitlements/accounting/currencies", icon: DollarSign },
    ]
  },
  {
    group: "COMPLIANCE & TERMS",
    items: [
      { title: "Overpayment Policies", url: "/modules/settings/entitlements/accounting/overpayment", icon: Banknote },
      { title: "Payment Terms", url: "/modules/settings/entitlements/accounting/terms", icon: CreditCard },
      { title: "Trash & Cancelled Invoices", url: "/modules/settings/entitlements/accounting/trash", icon: Trash2 },
    ]
  },
  {
    group: "GOVERNANCE REPORTS",
    items: [
      { title: "Client Tax Breakdown", url: "/modules/settings/entitlements/accounting/reports/client-tax", icon: ListTree },
      { title: "Invoice Tax Breakdown", url: "/modules/settings/entitlements/accounting/reports/invoice-tax", icon: PieChart },
      { title: "Audit & Permissions", url: "/modules/settings/entitlements/accounting/permissions", icon: ShieldCheck },
    ]
  }
];

// 5. HRM Governance
const hrmGovernanceMenuData = [
  {
    group: "POLICY TEMPLATES",
    items: [
      { title: "Department Templates", url: "/modules/settings/entitlements/hrm/departments", icon: Building2 },
      { title: "Job Role Templates", url: "/modules/settings/entitlements/hrm/roles", icon: UserCircle },
      { title: "Skills Library", url: "/modules/settings/entitlements/hrm/skills", icon: Award },
    ]
  },
  {
    group: "WORKING STANDARDS",
    items: [
      { title: "Working Hours", url: "/modules/settings/entitlements/hrm/hours", icon: Clock },
      { title: "Leave Policies", url: "/modules/settings/entitlements/hrm/leaves", icon: Calendar },
      { title: "Attendance Rules", url: "/modules/settings/entitlements/hrm/attendance", icon: CalendarClock },
    ]
  },
  {
    group: "SECURITY",
    items: [
      { title: "HR Permissions", url: "/modules/settings/entitlements/hrm/permissions", icon: Lock },
      { title: "Employee Data Retention", url: "/modules/settings/entitlements/hrm/retention", icon: Shield },
    ]
  }
];

// 6. Automations Governance
const automationGovernanceMenuData = [
  {
    group: "GUARDRAILS",
    items: [
      { title: "Rule Templates", url: "/modules/settings/entitlements/automations/templates", icon: Workflow },
      { title: "Allowed Actions", url: "/modules/settings/entitlements/automations/actions", icon: Zap },
      { title: "Limits & Quotas", url: "/modules/settings/entitlements/automations/quotas", icon: BarChart3 },
    ]
  },
  {
    group: "EXECUTION POLICIES",
    items: [
      { title: "Execution Rules", url: "/modules/settings/entitlements/automations/execution", icon: Settings },
      { title: "Error Handling", url: "/modules/settings/entitlements/automations/errors", icon: ShieldAlert },
    ]
  },
  {
    group: "GOVERNANCE",
    items: [
      { title: "Permissions", url: "/modules/settings/entitlements/automations/permissions", icon: Lock },
      { title: "Audit Logs", url: "/modules/settings/entitlements/automations/audit", icon: History },
    ]
  }
];

// 7. Campaign Governance
const campaignGovernanceMenuData = [
  {
    group: "CAMPAIGN GOVERNANCE",
    items: [
      { title: "Campaign Types", url: "/modules/settings/entitlements/campaigns/types", icon: Megaphone },
      { title: "Attribution Models", url: "/modules/settings/entitlements/campaigns/attribution", icon: PieChart },
      { title: "ROI Configuration", url: "/modules/settings/entitlements/campaigns/roi", icon: Calculator },
    ]
  },
  {
    group: "GUARDRAILS & LIMITS",
    items: [
      { title: "Daily Send Limits", url: "/modules/settings/entitlements/campaigns/limits", icon: Clock },
      { title: "Spam Protection", url: "/modules/settings/entitlements/campaigns/spam", icon: ShieldCheck },
    ]
  }
];

// 8. Pipeline Governance
const pipelineGovernanceMenuData = [
  {
    group: "PIPELINE GOVERNANCE",
    items: [
      { title: "Custom Stages", url: "/modules/settings/entitlements/pipeline/stages", icon: LayoutDashboard },
      { title: "Probability Rules", url: "/modules/settings/entitlements/pipeline/probability", icon: Target },
      { title: "Process Automation", url: "/modules/settings/entitlements/pipeline/automation", icon: Workflow },
    ]
  },
  {
    group: "ALERTS & MONITORING",
    items: [
      { title: "Stagnation Alerts", url: "/modules/settings/entitlements/pipeline/alerts", icon: Bell },
      { title: "Visibility Rules", url: "/modules/settings/entitlements/pipeline/visibility", icon: Lock },
    ]
  }
];

// --- ORGANIZATION GOVERNANCE SUB-SIDEBAR ---
const organizationMenuData = [
  {
    group: "ORG ADMIN",
    items: [
      { title: "Overview", url: "/modules/organization/overview", icon: LayoutDashboard },
      { title: "Business Units (Firms)", url: "/modules/organization/firms", icon: Network },
      { title: "Firm Recycle Bin", url: "/modules/organization/trash", icon: Trash2 },
    ]
  },
  {
    group: "IDENTITY & STYLE",
    items: [
      { title: "Branding & Theme", url: "/modules/organization/branding", icon: Palette },
      { title: "Org Admins", url: "/modules/organization/users", icon: ShieldCheck }, // Renamed from "Organization Users"
    ]
  },
  {
    group: "COMMERCIAL",
    items: [
      { title: "Subscription & Billing", url: "/modules/organization/subscription", icon: CreditCard },
      { title: "Usage & Limits", url: "/modules/organization/usage", icon: BarChart3 },
    ]
  },
  {
    group: "GOVERNANCE",
    items: [
      { title: "Org Settings", url: "/modules/organization/settings", icon: Settings },
      { title: "Org Policies", url: "/modules/organization/policies", icon: FileText },
      { title: "Audit & Activity", url: "/modules/organization/audit", icon: History },
    ]
  }
];

// Final Salesforce + Odoo + Entra Inspired Enterprise Sidebar
const adminSidebarGroupsData = [
  {
    title: "DASHBOARD",
    icon: LayoutDashboard,
    url: "/dashboard",
    items: []
  },
  {
    title: "ORGANIZATION",
    icon: Building2,
    items: [
      { title: "Overview", icon: LayoutDashboard, url: "/modules/organization/overview" },
      {
        title: "Business Units (Firms)",
        icon: Network,
        url: "/modules/firm-management/firms",
        items: [
          { title: "Active Firms", url: "/modules/firm-management/firms", icon: Network },
          { title: "Recycle Bin", url: "/modules/firm-management/firms/deleted", icon: Trash2 },
        ]
      },
      { title: "Branding & Theme", icon: Palette, url: "/modules/organization/branding" },
      { title: "Subscription & Billing", icon: CreditCard, url: "/modules/organization/subscription" },
      { title: "Org Settings", icon: Settings, url: "/modules/organization/settings" },
      { title: "Org Admins", icon: ShieldCheck, url: "/modules/organization/users" },
      { title: "Audit Log", icon: History, url: "/modules/organization/audit" },
    ]
  },
  {
    title: "IDENTITY & ACCESS",
    icon: Users,
    items: [
      { title: "Users", icon: Users, url: "/modules/users" },
      { title: "Roles & Permissions", icon: Shield, url: "/modules/administration/roles" },
      { title: "Teams / Groups", icon: Network, url: "/modules/teams" },
      { title: "Authentication", icon: Key, url: "/modules/settings/auth" },
      { title: "SSO & Identity Providers", icon: Globe, url: "/modules/settings/auth/sso" },
      { title: "Login Policies", icon: ShieldCheck, url: "/modules/settings/auth/policies" },
      { title: "Sessions", icon: History, url: "/modules/settings/auth/sessions" },
    ]
  },
  {
    title: "APPLICATIONS",
    icon: Package,
    items: [
      { title: "Enabled Apps", icon: LayoutDashboard, url: "/modules/settings/modules" },
      { title: "Module Marketplace", icon: ShoppingCart, url: "/modules/settings/marketplace" },
      { title: "App Configuration", icon: Settings, url: "/modules/settings/app-config" },
      { title: "Feature Flags", icon: Zap, url: "/modules/settings/feature-flags" },
      { title: "License Management", icon: CreditCard, url: "/modules/settings/licensing" },
    ]
  },
  {
    title: "MODULES & ENTITLEMENTS",
    icon: LayoutDashboard,
    items: [
      { title: "Lead Management", icon: Target, url: "/modules/settings/entitlements/leads/all" },
      { title: "Client Management", icon: UserCheck, url: "/modules/settings/entitlements/clients" },
      { title: "Project Management", icon: FolderKanban, url: "/modules/settings/entitlements/projects" },
      { title: "Accounting", icon: Calculator, url: "/modules/settings/entitlements/accounting" },
      { title: "HRM", icon: Users, url: "/modules/settings/entitlements/hrm" },
      { title: "Automations", icon: Zap, url: "/modules/settings/entitlements/automations" },
      { title: "Campaign Governance", icon: Megaphone, url: "/modules/settings/entitlements/campaigns" },
      { title: "Pipeline & Processes", icon: Workflow, url: "/modules/settings/entitlements/pipeline" },
    ]
  },
  {
    title: "POLICIES",
    icon: FileText,
    items: [
      { title: "Workflow Automation", icon: Workflow, url: "/modules/settings/automation" },
      { title: "Approval Processes", icon: CheckCircle, url: "/modules/settings/approvals" },
      { title: "SLA Policies", icon: Shield, url: "/modules/settings/sla" },
      { title: "Notification Rules", icon: Bell, url: "/modules/settings/notifications" },
      { title: "Data Policies", icon: FileText, url: "/modules/settings/data-policies" },
    ]
  },
  {
    title: "SECURITY",
    icon: ShieldCheck,
    items: [
      { title: "Security Overview", icon: ShieldCheck, url: "/security" },
      { title: "Password Policies", icon: KeyRound, url: "/security/passwords" },
      { title: "MFA / 2FA", icon: Smartphone, url: "/security/mfa" },
      { title: "IP Restrictions", icon: Globe, url: "/security/ip-restrictions" },
      { title: "Device Trust", icon: Monitor, url: "/security/device-trust" },
      { title: "Data Access Control", icon: Lock, url: "/security/data-access" },
    ]
  },
  {
    title: "DATA MANAGEMENT",
    icon: Database,
    items: [
      { title: "Import / Export", icon: Download, url: "/modules/data/import-export" },
      { title: "Backups & Restore", icon: HardDrive, url: "/modules/data/backup" },
      { title: "Retention Rules", icon: Clock, url: "/modules/data/retention" },
      { title: "Deduplication", icon: Copy, url: "/modules/data/deduplication" },
      { title: "Validation Rules", icon: CheckCircle, url: "/modules/data/validation" },
    ]
  },
  {
    title: "MONITORING",
    icon: Activity,
    items: [
      { title: "Audit Logs", icon: FileText, url: "/audit-logs" },
      { title: "User Activity", icon: Activity, url: "/activity-logs" },
      { title: "System Health", icon: HeartPulse, url: "/system-health" },
      { title: "API Usage", icon: BarChart3, url: "/api-usage" },
      { title: "Errors & Alerts", icon: AlertTriangle, url: "/errors-alerts" },
      { title: "Usage Analytics", icon: PieChart, url: "/usage-analytics" },
    ]
  },
  {
    title: "INTEGRATIONS",
    icon: Settings,
    items: [
      { title: "Email & Calendar", icon: Mail, url: "/modules/settings/integrations/email" },
      { title: "Webhooks", icon: Webhook, url: "/modules/settings/webhooks" },
      { title: "API Keys", icon: Key, url: "/modules/settings/api-keys" },
      { title: "External Apps", icon: Box, url: "/modules/settings/integrations/apps" },
      { title: "Data Sync Status", icon: RefreshCw, url: "/modules/settings/sync" },
    ]
  },
  {
    title: "BILLING & SUBSCRIPTION",
    icon: CreditCard,
    items: [
      { title: "Plan & Usage", icon: BarChart3, url: "/modules/billing/plan" },
      { title: "Licenses", icon: UserCheck, url: "/modules/billing/licenses" },
      { title: "Invoices", icon: Receipt, url: "/modules/billing/invoices" },
      { title: "Payments", icon: CreditCard, url: "/modules/billing/payments" },
      { title: "Billing Details", icon: FileText, url: "/modules/billing/settings" },
      { title: "Upgrade / Downgrade", icon: ArrowUpCircle, url: "/modules/billing/upgrade" },
    ]
  }
];

// Leads Specific Sub-Sidebar Structure
const leadsMenuData = [
  {
    group: "LEAD OVERVIEW",
    items: [
      { title: "All Leads", url: "/modules/crm/leads", icon: UserPlus },
      { title: "My Leads", url: "/modules/crm/leads?filter=mine", icon: Contact },
      { title: "Recently Viewed", url: "/modules/crm/leads?filter=recent", icon: Filter },
      { title: "Unassigned", url: "/modules/crm/leads?filter=unassigned", icon: UserCheck },
      { title: "Converted", url: "/modules/crm/leads?filter=converted", icon: CheckCircle },
    ]
  },
  {
    group: "PIPELINE",
    items: [
      { title: "Kanban View", url: "/modules/crm/leads/kanban", icon: LayoutDashboard },
      { title: "Lead Stages", url: "/modules/crm/leads/settings/stages", icon: Settings },
    ]
  },
  {
    group: "ACTIVITIES",
    items: [
      { title: "Timeline", url: "/modules/crm/leads/activities/timeline", icon: CalendarClock },
      { title: "Emails", url: "/modules/crm/leads/activities/emails", icon: Menu },
      { title: "Calls", url: "/modules/crm/leads/activities/calls", icon: Contact },
      { title: "Meetings", url: "/modules/crm/leads/activities/meetings", icon: Calendar },
      { title: "Notes", url: "/modules/crm/leads/activities/notes", icon: FileText },
    ]
  },
  {
    group: "ACTIONS",
    items: [
      { title: "Import Leads", url: "/modules/crm/leads/import", icon: FileText },
      { title: "Bulk Actions", url: "/modules/crm/leads/bulk", icon: ListFilter },
    ]
  },
  {
    group: "RULES & AUTOMATION",
    items: [
      { title: "Lead Scoring", url: "/modules/crm/leads/settings/scoring", icon: ChartBar },
      { title: "Workflow Rules", url: "/modules/crm/leads/settings/workflows", icon: Workflow },
    ]
  }
];

// Deals / Opportunities Specific Sub-Sidebar Structure
const dealsMenuData = [
  {
    group: "DEAL OVERVIEW",
    items: [
      { title: "All Deals", url: "/modules/crm/deals", icon: Briefcase },
      { title: "My Deals", url: "/modules/crm/deals?filter=mine", icon: Contact },
      { title: "Recently Viewed", url: "/modules/crm/deals?filter=recent", icon: Filter },
      { title: "Open Deals", url: "/modules/crm/deals?filter=open", icon: FolderKanban },
      { title: "Closed Won", url: "/modules/crm/deals?filter=won", icon: CheckCircle },
      { title: "Closed Lost", url: "/modules/crm/deals?filter=lost", icon: Award },
    ]
  },
  {
    group: "PIPELINE",
    items: [
      { title: "Kanban View", url: "/modules/crm/deals/kanban", icon: LayoutDashboard },
      { title: "Deal Stages", url: "/modules/crm/deals/settings/stages", icon: Settings },
      { title: "Probability Settings", url: "/modules/crm/deals/settings/probability", icon: PieChart },
    ]
  },
  {
    group: "ACTIVITIES",
    items: [
      { title: "Timeline", url: "/modules/crm/deals/activities/timeline", icon: CalendarClock },
      { title: "Emails", url: "/modules/crm/deals/activities/emails", icon: Menu },
      { title: "Calls", url: "/modules/crm/deals/activities/calls", icon: Contact },
      { title: "Meetings", url: "/modules/crm/deals/activities/meetings", icon: Calendar },
      { title: "Notes", url: "/modules/crm/deals/activities/notes", icon: FileText },
    ]
  },
  {
    group: "ACTIONS",
    items: [
      { title: "Create Deal", url: "/modules/crm/deals/new", icon: Briefcase },
      { title: "Import Deals", url: "/modules/crm/deals/import", icon: FileText },
      { title: "Bulk Update", url: "/modules/crm/deals/bulk", icon: ListFilter },
    ]
  }
];

// Sales Pipeline Specific Sub-Sidebar Structure
const pipelineMenuData = [
  {
    group: "PIPELINE",
    items: [
      { title: "Kanban View", url: "/modules/crm/pipeline", icon: LayoutDashboard },
      { title: "Stage Settings", url: "/modules/crm/pipeline/settings/stages", icon: Settings },
      { title: "Probability Settings", url: "/modules/crm/pipeline/settings/probability", icon: PieChart },
    ]
  },
  {
    group: "ANALYTICS",
    items: [
      { title: "Pipeline Value", url: "/modules/crm/pipeline/analytics/value", icon: BarChart3 },
      { title: "Win Rate", url: "/modules/crm/pipeline/analytics/win-rate", icon: TrendingUp },
    ]
  }
];

const campaignsMenuData = [
  {
    group: "OVERVIEW",
    items: [
      { title: "All Campaigns", url: "/modules/crm/campaigns", icon: Megaphone },
      { title: "My Campaigns", url: "/modules/crm/campaigns?filter=mine", icon: Contact },
      { title: "Active Campaigns", url: "/modules/crm/campaigns?filter=active", icon: Zap },
      { title: "Completed", url: "/modules/crm/campaigns?filter=completed", icon: CheckCircle },
      { title: "Drafts", url: "/modules/crm/campaigns?filter=drafts", icon: FileText },
    ]
  },
  {
    group: "EXECUTION",
    items: [
      { title: "Members", url: "/modules/crm/campaigns/members", icon: Users },
      { title: "Member Status", url: "/modules/crm/campaigns/member-status", icon: Filter },
      { title: "Email Campaigns", url: "/modules/crm/campaigns/emails", icon: Menu },
      { title: "Events / Webinars", url: "/modules/crm/campaigns/events", icon: Calendar },
    ]
  },
  {
    group: "ACTIONS",
    items: [
      { title: "Create Campaign", url: "/modules/crm/campaigns/new", icon: Plus },
      { title: "Add Members", url: "/modules/crm/campaigns/add-members", icon: UserPlus },
      { title: "Import Members", url: "/modules/crm/campaigns/import", icon: FileText },
      { title: "Bulk Actions", url: "/modules/crm/campaigns/bulk", icon: ListFilter },
    ]
  },
  {
    group: "INFLUENCE & ATTRIBUTION",
    items: [
      { title: "Primary Source", url: "/modules/crm/campaigns/influence/primary", icon: Target },
      { title: "Influenced Deals", url: "/modules/crm/campaigns/influence/deals", icon: Briefcase },
      { title: "Revenue Attribution", url: "/modules/crm/campaigns/influence/revenue", icon: DollarSign },
    ]
  },
  {
    group: "ANALYTICS & REPORTS",
    items: [
      { title: "Campaign Performance", url: "/modules/crm/campaigns/analytics/performance", icon: BarChart3 },
      { title: "ROI Reports", url: "/modules/crm/campaigns/analytics/roi", icon: PieChart },
      { title: "Lead Source Analysis", url: "/modules/crm/campaigns/analytics/sources", icon: Filter },
    ]
  }
];

const clientsMenuData = [
  {
    group: "OVERVIEW",
    items: [
      { title: "All Accounts", url: "/modules/crm/clients", icon: UserCheck },
      { title: "My Accounts", url: "/modules/crm/clients?filter=mine", icon: Contact },
      { title: "Active Accounts", url: "/modules/crm/clients?filter=active", icon: CheckCircle },
      { title: "Inactive Accounts", url: "/modules/crm/clients?filter=inactive", icon: Shield },
      { title: "Recently Viewed", url: "/modules/crm/clients?filter=recent", icon: Filter },
    ]
  },
  {
    group: "RELATIONSHIPS",
    items: [
      { title: "Contacts", url: "/modules/crm/clients/contacts", icon: Users },
      { title: "Decision Makers", url: "/modules/crm/clients/decision-makers", icon: Award },
      { title: "Account Team", url: "/modules/crm/clients/team", icon: Shield },
    ]
  },
  {
    group: "SALES & REVENUE",
    items: [
      { title: "Deals", url: "/modules/crm/clients/deals", icon: Briefcase },
      { title: "Open Opportunities", url: "/modules/crm/clients/opportunities", icon: FolderKanban },
      { title: "Closed Deals", url: "/modules/crm/clients/closed", icon: CheckCircle },
      { title: "Revenue Summary", url: "/modules/crm/clients/revenue", icon: BarChart3 },
    ]
  },
  {
    group: "ACTIVITIES",
    items: [
      { title: "Timeline", url: "/modules/crm/clients/activities/timeline", icon: CalendarClock },
      { title: "Emails", url: "/modules/crm/clients/activities/emails", icon: Menu },
      { title: "Calls", url: "/modules/crm/clients/activities/calls", icon: Contact },
      { title: "Meetings", url: "/modules/crm/clients/activities/meetings", icon: Calendar },
      { title: "Notes", url: "/modules/crm/clients/activities/notes", icon: FileText },
    ]
  },
  {
    group: "SUPPORT",
    items: [
      { title: "Cases", url: "/modules/crm/clients/support/cases", icon: LifeBuoy },
      { title: "SLAs", url: "/modules/crm/clients/support/sla", icon: Shield },
    ]
  },
  {
    group: "ANALYTICS",
    items: [
      { title: "Performance", url: "/modules/crm/clients/analytics/performance", icon: BarChart3 },
      { title: "Revenue Trend", url: "/modules/crm/clients/analytics/trends", icon: TrendingUp },
      { title: "Engagement Score", url: "/modules/crm/clients/analytics/engagement", icon: Target },
    ]
  }
];

// --- CALENDAR Sub-sidebar Data ---
const calendarMenuData = [
  {
    group: "VIEWS",
    items: [
      { title: "My Schedule", url: "/modules/calendar?view=my", icon: UserCheck },
      { title: "Team Schedule", url: "/modules/calendar?view=team", icon: Users },
      { title: "Company Wide", url: "/modules/calendar?view=company", icon: Building2 },
    ]
  },
  {
    group: "MY CALENDARS",
    items: [
      { title: "Meetings", url: "/modules/calendar?type=meeting", icon: CheckCircle },
      { title: "Tasks & Deadlines", url: "/modules/calendar?type=task", icon: CheckCircle },
      { title: "Reminders", url: "/modules/calendar?type=reminder", icon: CheckCircle },
    ]
  },
  {
    group: "TEAM",
    items: [
      { title: "Availability", url: "/modules/calendar/availability", icon: Clock },
      { title: "Leave Calendar", url: "/modules/calendar/leaves", icon: Calendar },
    ]
  }
];

type SidebarProps = React.ComponentProps<typeof Sidebar> & {
  open?: boolean;
  setOpen?: (open: boolean) => void;
};

const AppSidebarComponent = ({ open, setOpen, ...props }: SidebarProps) => {
  const params = useParams() as { workspaceId?: string; orgName?: string }
  const pathname = usePathname();
  const router = useRouter();
  const { state: sidebarState } = useSidebar();
  const { showLoader } = useLoaderStore();

  const [activeCategory, setActiveCategory] = useState<string>("DASHBOARD");
  const [isSubCollapsed, setIsSubCollapsed] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["CRM SYSTEM"]); // CRM SYSTEM open by default
  const [expandedSubItems, setExpandedSubItems] = useState<string[]>([]);

  const [orgName, setOrgName] = useState("")
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    const storedOrg = localStorage.getItem("orgName") || "";
    setOrgName(storedOrg);

    // Fetch current user to determine role
    const fetchUser = async () => {
      try {
        const res = await userById();
        if (res?.data?.user) {
          setCurrentUser(res.data.user);
        }
      } catch (err) {
        console.error("Error fetching user for sidebar", err);
      }
    };
    fetchUser();
  }, []);



  const isAdmin = useMemo(() => {
    // TEMPORARY: Forcing Admin view for development
    return true;
    // return currentUser?.role === "ADMIN" || currentUser?.role === "SUB_ADMIN";
  }, [currentUser]);

  const activeSidebarData = useMemo(() => {
    return isAdmin ? adminSidebarGroupsData : sidebarGroupsData;
  }, [isAdmin]);

  const currentOrg = useMemo(() => {
    return (params.orgName && params.orgName !== "null")
      ? params.orgName
      : (params.workspaceId || orgName || "");
  }, [params.orgName, params.workspaceId, orgName]);

  // Transform data once to include valid URLs
  const finalSidebarGroups = useMemo(() => {
    return activeSidebarData.map(group => ({
      ...group,
      items: group.items.map(item => {
        let finalUrl = item.url;
        if (currentOrg && !item.url.startsWith("/hrmcubicle")) {
          finalUrl = `/${currentOrg}${item.url.startsWith("/") ? "" : "/"}${item.url}`;
        }

        // Handle nested items if they exist
        const nestedItems = item.items?.map((subItem: any) => {
          let subUrl = subItem.url;
          if (currentOrg && !subUrl.startsWith("/hrmcubicle")) {
            subUrl = `/${currentOrg}${subUrl.startsWith("/") ? "" : "/"}${subUrl}`;
          }
          return { ...subItem, url: subUrl };
        });

        return { ...item, url: finalUrl, items: nestedItems };
      })
    }));
  }, [currentOrg, activeSidebarData]);

  // Sync expanded states with current path
  useEffect(() => {
    if (!pathname) return;

    finalSidebarGroups.forEach(group => {
      group.items.forEach(item => {
        // Check if current path is in sub-items
        const isPathInSubItems = item.items?.some((sub: any) => pathname.includes(sub.url));

        if (isPathInSubItems) {
          // Expand both the group and the sub-item
          setExpandedGroups(prev => prev.includes(group.title) ? prev : [...prev, group.title]);
          setExpandedSubItems(prev => prev.includes(item.title) ? prev : [...prev, item.title]);
          setActiveCategory(group.title);
        } else if (pathname.includes(item.url)) {
          // Expand group if sub-item is active
          setExpandedGroups(prev => prev.includes(group.title) ? prev : [...prev, group.title]);
          setActiveCategory(group.title);
        }
      });
    });
  }, [pathname, finalSidebarGroups]);

  // Transform Leads specific data with Org Prefix
  const finalLeadsMenu = useMemo(() => {
    return leadsMenuData.map(group => ({
      ...group,
      items: group.items.map(item => {
        let finalUrl = item.url;
        if (currentOrg) {
          finalUrl = `/${currentOrg}${item.url.startsWith("/") ? "" : "/"}${item.url}`;
        }
        return { ...item, url: finalUrl };
      })
    }))
  }, [currentOrg]);

  // Transform Deals data
  const finalDealsMenu = useMemo(() => {
    return dealsMenuData.map(group => ({
      ...group,
      items: group.items.map(item => {
        let finalUrl = item.url;
        if (currentOrg) {
          finalUrl = `/${currentOrg}${item.url.startsWith("/") ? "" : "/"}${item.url}`;
        }
        return { ...item, url: finalUrl };
      })
    }))
  }, [currentOrg]);

  // Transform Pipeline data
  const finalPipelineMenu = useMemo(() => {
    return pipelineMenuData.map(group => ({
      ...group,
      items: group.items.map(item => {
        let finalUrl = item.url;
        if (currentOrg) {
          finalUrl = `/${currentOrg}${item.url.startsWith("/") ? "" : "/"}${item.url}`;
        }
        return { ...item, url: finalUrl };
      })
    }))
  }, [currentOrg]);

  // Transform Campaigns data
  const finalCampaignsMenu = useMemo(() => {
    return campaignsMenuData.map(group => ({
      ...group,
      items: group.items.map(item => {
        let finalUrl = item.url;
        if (currentOrg) {
          finalUrl = `/${currentOrg}${item.url.startsWith("/") ? "" : "/"}${item.url}`;
        }
        return { ...item, url: finalUrl };
      })
    }))
  }, [currentOrg]);

  // Transform Clients data
  const finalClientsMenu = useMemo(() => {
    return clientsMenuData.map(group => ({
      ...group,
      items: group.items.map(item => {
        let finalUrl = item.url;
        if (currentOrg) {
          finalUrl = `/${currentOrg}${item.url.startsWith("/") ? "" : "/"}${item.url}`;
        }
        return { ...item, url: finalUrl };
      })
    }))
  }, [currentOrg]);

  // Transform Admin Identity data
  const finalUsersAdminMenu = useMemo(() => {
    return usersAdminMenuData.map(group => ({
      ...group,
      items: group.items.map(item => {
        let finalUrl = item.url;
        if (currentOrg) {
          finalUrl = `/${currentOrg}${item.url.startsWith("/") ? "" : "/"}${item.url}`;
        }
        return { ...item, url: finalUrl };
      })
    }))
  }, [currentOrg]);

  const finalGroupsAdminMenu = useMemo(() => {
    return groupsAdminMenuData.map(group => ({
      ...group,
      items: group.items.map(item => {
        let finalUrl = item.url;
        if (currentOrg) {
          finalUrl = `/${currentOrg}${item.url.startsWith("/") ? "" : "/"}${item.url}`;
        }
        return { ...item, url: finalUrl };
      })
    }))
  }, [currentOrg]);

  const finalRolesAdminMenu = useMemo(() => {
    return rolesAdminMenuData.map(group => ({
      ...group,
      items: group.items.map(item => {
        let finalUrl = item.url;
        if (currentOrg) {
          finalUrl = `/${currentOrg}${item.url.startsWith("/") ? "" : "/"}${item.url}`;
        }
        return { ...item, url: finalUrl };
      })
    }))
  }, [currentOrg]);

  const finalAuthAdminMenu = useMemo(() => {
    return authAdminMenuData.map(group => ({
      ...group,
      items: group.items.map(item => {
        let finalUrl = item.url;
        if (currentOrg) {
          finalUrl = `/${currentOrg}${item.url.startsWith("/") ? "" : "/"}${item.url}`;
        }
        return { ...item, url: finalUrl };
      })
    }))
  }, [currentOrg]);

  // Transform Governance Entitlements Data
  const finalLeadGovMenu = useMemo(() => {
    return leadGovernanceMenuData.map(group => ({
      ...group,
      items: group.items.map(item => ({ ...item, url: currentOrg ? `/${currentOrg}${item.url}` : item.url }))
    }))
  }, [currentOrg]);

  const finalClientGovMenu = useMemo(() => {
    return clientGovernanceMenuData.map(group => ({
      ...group,
      items: group.items.map(item => ({ ...item, url: currentOrg ? `/${currentOrg}${item.url}` : item.url }))
    }))
  }, [currentOrg]);

  const finalProjectGovMenu = useMemo(() => {
    return projectGovernanceMenuData.map(group => ({
      ...group,
      items: group.items.map(item => ({ ...item, url: currentOrg ? `/${currentOrg}${item.url}` : item.url }))
    }))
  }, [currentOrg]);

  const finalAccountingGovMenu = useMemo(() => {
    return accountingGovernanceMenuData.map(group => ({
      ...group,
      items: group.items.map(item => ({ ...item, url: currentOrg ? `/${currentOrg}${item.url}` : item.url }))
    }))
  }, [currentOrg]);

  const finalHrmGovMenu = useMemo(() => {
    return hrmGovernanceMenuData.map(group => ({
      ...group,
      items: group.items.map(item => ({ ...item, url: currentOrg ? `/${currentOrg}${item.url}` : item.url }))
    }))
  }, [currentOrg]);

  const finalAutomationGovMenu = useMemo(() => {
    return automationGovernanceMenuData.map(group => ({
      ...group,
      items: group.items.map(item => ({ ...item, url: currentOrg ? `/${currentOrg}${item.url}` : item.url }))
    }))
  }, [currentOrg]);

  const finalCampaignGovMenu = useMemo(() => {
    return campaignGovernanceMenuData.map(group => ({
      ...group,
      items: group.items.map(item => ({ ...item, url: currentOrg ? `/${currentOrg}${item.url}` : item.url }))
    }))
  }, [currentOrg]);

  const finalPipelineGovMenu = useMemo(() => {
    return pipelineGovernanceMenuData.map(group => ({
      ...group,
      items: group.items.map(item => ({ ...item, url: currentOrg ? `/${currentOrg}${item.url}` : item.url }))
    }))
  }, [currentOrg]);

  // --- ORGANIZATION GOVERNANCE SUB-SIDEBARS (Granular) ---

  // 1. Overview Menu
  const finalOrgOverviewMenu = useMemo(() => {
    return [
      {
        group: "DASHBOARD",
        items: [
          { title: "Organization Dashboard", url: `/modules/organization/overview`, icon: LayoutDashboard },
          { title: "Org Health & Usage", url: `/modules/organization/health`, icon: Activity },
          { title: "Recent Admin Activity", url: `/modules/organization/activity`, icon: History },
        ]
      }
    ].map(group => ({
      ...group,
      items: group.items.map(item => ({ ...item, url: currentOrg ? `/${currentOrg}${item.url}` : item.url }))
    }));
  }, [currentOrg]);

  // 2. Business Units (Firms) Menu
  const finalOrgFirmsMenu = useMemo(() => {
    return [
      {
        group: "MANAGEMENT",
        items: [
          { title: "Firms List", url: `/modules/firm-management/firms`, icon: ListTree },
          { title: "Create Firm", url: `/modules/firm-management/firms/add`, icon: Plus },
          { title: "Onboarding Status", url: `/modules/organization/onboarding`, icon: Clock },
        ]
      },
      {
        group: "ADMINISTRATION",
        items: [
          { title: "Firm Admins", url: `/modules/organization/admins`, icon: ShieldCheck },
          { title: "Module Access", url: `/modules/organization/access`, icon: Package },
          { title: "Settings Summary", url: `/modules/organization/settings`, icon: Settings },
        ]
      }
    ].map(group => ({
      ...group,
      items: group.items.map(item => ({ ...item, url: currentOrg ? `/${currentOrg}${item.url}` : item.url }))
    }));
  }, [currentOrg]);

  // 3. Recycle Bin Menu
  const finalOrgRecycleBinMenu = useMemo(() => {
    return [
      {
        group: "RECOVERY",
        items: [
          { title: "Archived Firms", url: `/modules/firm-management/firms/deleted`, icon: Trash2 },
          { title: "Restore Firm", url: `/modules/firm-management/firms/deleted`, icon: RefreshCw },
        ]
      },
      {
        group: "COMPLIANCE",
        items: [
          { title: "Permanent Delete", url: `/modules/organization/purge`, icon: ShieldAlert },
          { title: "Deletion Logs", url: `/modules/organization/logs`, icon: FileText },
        ]
      }
    ].map(group => ({
      ...group,
      items: group.items.map(item => ({ ...item, url: currentOrg ? `/${currentOrg}${item.url}` : item.url }))
    }));
  }, [currentOrg]);

  // 4. Branding & Theme Menu
  const finalOrgBrandingMenu = useMemo(() => {
    return [
      {
        group: "IDENTITY",
        items: [
          { title: "Organization Branding", url: `/modules/organization/branding`, icon: Palette },
          { title: "Default Theme", url: `/modules/organization/branding/theme`, icon: LayoutDashboard },
        ]
      },
      {
        group: "ASSETS",
        items: [
          { title: "Email Branding", url: `/modules/organization/branding/email`, icon: Mail },
          { title: "Invoice / Docs", url: `/modules/organization/branding/docs`, icon: FileText },
          { title: "White-label Settings", url: `/modules/organization/branding/whitelabel`, icon: Globe },
        ]
      }
    ].map(group => ({
      ...group,
      items: group.items.map(item => ({ ...item, url: currentOrg ? `/${currentOrg}${item.url}` : item.url }))
    }));
  }, [currentOrg]);

  // 5. Subscription Menu
  const finalOrgSubscriptionMenu = useMemo(() => {
    return [
      {
        group: "PLAN DETAILS",
        items: [
          { title: "Current Plan", url: `/modules/organization/subscription`, icon: CreditCard },
          { title: "Usage & Limits", url: `/modules/organization/subscription/usage`, icon: BarChart3 },
          { title: "Modules & Add-ons", url: `/modules/organization/subscription/addons`, icon: Package },
        ]
      },
      {
        group: "BILLING",
        items: [
          { title: "Invoices", url: `/modules/organization/subscription/invoices`, icon: Receipt },
          { title: "Payment Methods", url: `/modules/organization/subscription/payment`, icon: CreditCard },
          { title: "Billing History", url: `/modules/organization/subscription/history`, icon: History },
        ]
      }
    ].map(group => ({
      ...group,
      items: group.items.map(item => ({ ...item, url: currentOrg ? `/${currentOrg}${item.url}` : item.url }))
    }));
  }, [currentOrg]);

  // 6. Organization Settings Menu
  const finalOrgSettingsMenu = useMemo(() => {
    return [
      {
        group: "GLOBAL CONFIG",
        items: [
          { title: "Organization Profile", url: `/modules/organization/settings`, icon: Building2 },
          { title: "Timezone & Locale", url: `/modules/organization/settings/locale`, icon: Globe },
          { title: "Default Currency", url: `/modules/organization/settings/currency`, icon: DollarSign },
        ]
      },
      {
        group: "DATA",
        items: [
          { title: "Default Language", url: `/modules/organization/settings/language`, icon: FileText },
          { title: "Data Region", url: `/modules/organization/settings/region`, icon: Database },
        ]
      }
    ].map(group => ({
      ...group,
      items: group.items.map(item => ({ ...item, url: currentOrg ? `/${currentOrg}${item.url}` : item.url }))
    }));
  }, [currentOrg]);

  // 7. Organization Users Menu
  const finalOrgUsersMenu = useMemo(() => {
    return [
      {
        group: "ORG STAFF",
        items: [
          { title: "Org Users List", url: `/modules/organization/users`, icon: Users },
          { title: "Org Roles", url: `/modules/organization/users/roles`, icon: ShieldCheck },
          { title: "Invitations", url: `/modules/organization/users/invites`, icon: UserPlus },
        ]
      },
      {
        group: "ACCESS",
        items: [
          { title: "Cross-Firm Access", url: `/modules/organization/users/access`, icon: Network },
          { title: "Deactivated Users", url: `/modules/organization/users/deactivated`, icon: UserMinus },
        ]
      }
    ].map(group => ({
      ...group,
      items: group.items.map(item => ({ ...item, url: currentOrg ? `/${currentOrg}${item.url}` : item.url }))
    }));
  }, [currentOrg]);

  // 8. Organization Policies Menu
  const finalOrgPoliciesMenu = useMemo(() => {
    return [
      {
        group: "SECURITY & COMPLIANCE",
        items: [
          { title: "Data Retention", url: `/modules/organization/policies/retention`, icon: HardDrive },
          { title: "Access Policies", url: `/modules/organization/policies/access`, icon: Lock },
          { title: "Security Policies", url: `/modules/organization/policies/security`, icon: ShieldCheck },
        ]
      },
      {
        group: "OPERATION",
        items: [
          { title: "Approval Policies", url: `/modules/organization/policies/approvals`, icon: CheckCircle },
          { title: "Automation Rules", url: `/modules/organization/policies/automation`, icon: Zap },
        ]
      }
    ].map(group => ({
      ...group,
      items: group.items.map(item => ({ ...item, url: currentOrg ? `/${currentOrg}${item.url}` : item.url }))
    }));
  }, [currentOrg]);

  // 9. Audit Menu
  const finalOrgAuditMenu = useMemo(() => {
    return [
      {
        group: "LOGS",
        items: [
          { title: "Org Audit Logs", url: `/modules/organization/audit`, icon: FileText },
          { title: "Admin Actions", url: `/modules/organization/audit/admin`, icon: Shield },
          { title: "Firm Events", url: `/modules/organization/audit/firms`, icon: Building2 },
        ]
      },
      {
        group: "TOOLS",
        items: [
          { title: "Export Logs", url: `/modules/organization/audit/export`, icon: Download },
        ]
      }
    ].map(group => ({
      ...group,
      items: group.items.map(item => ({ ...item, url: currentOrg ? `/${currentOrg}${item.url}` : item.url }))
    }));
  }, [currentOrg]);

  // Determine Active Module based on Path AND Active Category
  const activeModule = useMemo(() => {
    // If we are in CALENDAR category, return specialized module name
    if (activeCategory === "CALENDAR") return "Calendar";

    // Admin Governance Drill-downs
    if (activeCategory === "IDENTITY & ACCESS") {
      if (pathname?.includes("/modules/users")) return "UsersAdmin";
      if (pathname?.includes("/modules/teams")) return "GroupsAdmin";
      if (pathname?.includes("/modules/administration/roles")) return "RolesAdmin";
      if (pathname?.includes("/modules/administration/permissions")) return "RolesAdmin";
      if (pathname?.includes("/modules/administration/units")) return "RolesAdmin";
      if (pathname?.includes("/modules/administration/security-baseline")) return "RolesAdmin";
      if (pathname?.includes("/modules/administration/reviews")) return "RolesAdmin";
      if (pathname?.includes("/modules/settings/auth")) return "AuthAdmin";
    }

    // Modules & Entitlements Governance - Detected independently of activeCategory for robustness
    if (pathname?.includes("/modules/settings/entitlements/leads")) return "LeadGov";
    if (pathname?.includes("/modules/settings/entitlements/clients")) return "ClientGov";
    if (pathname?.includes("/modules/settings/entitlements/projects")) return "ProjectGov";
    if (pathname?.includes("/modules/settings/entitlements/accounting")) return "AccountingGov";
    if (pathname?.includes("/modules/settings/entitlements/hrm")) return "HrmGov";
    if (pathname?.includes("/modules/settings/entitlements/automations")) return "AutomationGov";
    if (pathname?.includes("/modules/settings/entitlements/campaigns")) return "CampaignGov";
    if (pathname?.includes("/modules/settings/entitlements/pipeline")) return "PipelineGov";

    // Organization Granular Drill-down
    if (pathname?.includes("/modules/organization/overview")) return "OrgOverview";
    if (pathname?.includes("/modules/firm-management/firms/deleted") || pathname?.includes("/modules/organization/trash")) return "OrgRecycleBin";
    if (pathname?.includes("/modules/firm-management/firms") || pathname?.includes("/modules/organization/firms") || pathname.includes("/modules/organization/create")) return "OrgFirms";
    if (pathname?.includes("/modules/organization/branding")) return "OrgBranding";
    if (pathname?.includes("/modules/organization/subscription")) return "OrgSubscription";
    if (pathname?.includes("/modules/organization/settings")) return "OrgSettings";
    if (pathname?.includes("/modules/organization/users")) return "OrgUsers";
    if (pathname?.includes("/modules/organization/policies")) return "OrgPolicies";
    if (pathname?.includes("/modules/organization/audit")) return "OrgAudit";
    // Fallback if just clicked organization but not a specific page yet (unlikely if strictly routed)
    if (activeCategory === "ORGANIZATION") return "OrgOverview";

    // Only show drill-down if we're in CRM SYSTEM category
    if (activeCategory !== "CRM SYSTEM") return null;

    // Check most specific paths first to avoid false matches
    if (pathname?.includes("/modules/crm/campaigns")) return "Campaigns";
    if (pathname?.includes("/modules/crm/pipeline")) return "Pipeline";
    if (pathname?.includes("/modules/crm/clients")) return "Clients";
    if (pathname?.includes("/modules/crm/deals")) return "Deals";
    if (pathname?.includes("/modules/crm/leads")) return "Leads";
    // Add logic for other modules if they need drill-down
    return null;
  }, [pathname, activeCategory]);

  // Synchronously compute active category from pathname to avoid effect delay
  const activeCategoryFromPath = useMemo(() => {
    if (!pathname) return activeCategory;
    for (const group of activeSidebarData) {
      if (group.url && pathname.includes(group.url)) return group.title;
      if (group.items.length > 0) {
        if (group.items.some(item => pathname.includes(item.url) || (item.url !== '/' && pathname.startsWith(item.url)))) {
          return group.title;
        }
      }
    }
    return activeCategory;
  }, [pathname, activeSidebarData]);

  useEffect(() => {
    if (activeCategoryFromPath !== activeCategory) {
      setActiveCategory(activeCategoryFromPath);
      setExpandedGroups(prev => [...new Set([...prev, activeCategoryFromPath])]);
    }
  }, [activeCategoryFromPath]);

  // Select the correct sub-sidebar data
  const finalSubSidebarGroups = useMemo(() => {
    if (activeCategory === "CALENDAR") return calendarMenuData;

    switch (activeModule) {
      case "Leads": return finalLeadsMenu;
      case "Deals": return finalDealsMenu;
      case "Pipeline": return finalPipelineMenu;
      case "Campaigns": return finalCampaignsMenu;
      case "Clients": return finalClientsMenu;
      case "UsersAdmin": return finalUsersAdminMenu;
      case "GroupsAdmin": return finalGroupsAdminMenu;
      case "RolesAdmin": return finalRolesAdminMenu;
      case "AuthAdmin": return finalAuthAdminMenu;
      case "LeadGov": return finalLeadGovMenu;
      case "ClientGov": return finalClientGovMenu;
      case "ProjectGov": return finalProjectGovMenu;
      case "AccountingGov": return finalAccountingGovMenu;
      case "HrmGov": return finalHrmGovMenu;
      case "AutomationGov": return finalAutomationGovMenu;
      case "CampaignGov": return finalCampaignGovMenu;
      case "PipelineGov": return finalPipelineGovMenu;

      // Org Cases
      case "OrgOverview": return finalOrgOverviewMenu;
      case "OrgFirms": return finalOrgFirmsMenu;
      case "OrgRecycleBin": return finalOrgRecycleBinMenu;
      case "OrgBranding": return finalOrgBrandingMenu;
      case "OrgSubscription": return finalOrgSubscriptionMenu;
      case "OrgSettings": return finalOrgSettingsMenu;
      case "OrgUsers": return finalOrgUsersMenu;
      case "OrgPolicies": return finalOrgPoliciesMenu;
      case "OrgAudit": return finalOrgAuditMenu;

      default: return []; // Dashboard or others with no sub-sidebar
    }
  }, [activeModule, activeCategory, finalLeadsMenu, finalDealsMenu, finalPipelineMenu, finalCampaignsMenu, finalClientsMenu, finalUsersAdminMenu, finalGroupsAdminMenu, finalRolesAdminMenu, finalAuthAdminMenu, finalLeadGovMenu, finalClientGovMenu, finalProjectGovMenu, finalAccountingGovMenu, finalHrmGovMenu, finalAutomationGovMenu]);

  const activeGroupItems = useMemo(() => {
    const group = finalSidebarGroups.find(g => g.title === activeCategory);
    return group ? group.items : [];
  }, [activeCategory, finalSidebarGroups]);

  const handleCategoryClick = (group: any) => {
    if (group.items.length > 0) {
      // Toggle dropdown expansion instead of immediate activation
      setExpandedGroups(prev =>
        prev.includes(group.title)
          ? prev.filter(t => t !== group.title)
          : [...prev, group.title]
      );
      return;
    }

    // Items without dropdowns (e.g. Dashboard, Calendar)
    setActiveCategory(group.title);
    setIsSubCollapsed(false);

    if (group.url) {
      let finalUrl = group.url;
      if (currentOrg && !group.url.startsWith("/hrmcubicle")) {
        finalUrl = `/${currentOrg}${group.url.startsWith("/") ? "" : "/"}${group.url}`;
      }
      router.push(finalUrl);
      showLoader();
    }
  };

  const toggleGroup = (e: React.MouseEvent, title: string) => {
    e.stopPropagation();
    setExpandedGroups(prev =>
      prev.includes(title)
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  const toggleSubItem = (e: React.MouseEvent, title: string) => {
    e.stopPropagation();
    setExpandedSubItems(prev =>
      prev.includes(title)
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  return (
    <>
      {/* PRIMARY SIDEBAR - Categories & Inline Dropdowns */}
      <Sidebar collapsible="icon" {...props} className="mt-[63px] h-[calc(100svh-63px)] border-r bg-white dark:bg-zinc-950 z-30">
        <SidebarHeader className="h-0 p-0 m-0" />
        <SidebarContent className="bg-white dark:bg-zinc-950 pt-2 hover-scroll">
          <SidebarMenu>
            {finalSidebarGroups.map((group) => {
              const isActive = activeCategory === group.title;
              const isExpanded = expandedGroups.includes(group.title);
              const hasSubItems = group.items.length > 0;
              const iconColor = getIconColor(group.title).icon;

              return (
                <SidebarMenuItem key={group.title}>
                  <div className="flex items-center w-full relative group/item">
                    <SidebarMenuButton
                      onClick={() => handleCategoryClick(group)}
                      tooltip={group.title}
                      className={`gap-3 p-2 transition-colors flex-1 
                        ${isActive ? "bg-zinc-50 dark:bg-zinc-900" : "hover:bg-zinc-50 dark:hover:bg-zinc-900"}`}
                    >
                      <group.icon className={`h-5 w-5 flex-shrink-0 transition-colors ${iconColor}`} />
                      <span className="text-xs font-medium truncate group-data-[collapsible=icon]:hidden text-zinc-700 dark:text-zinc-300">
                        {group.title}
                      </span>
                    </SidebarMenuButton>

                    {hasSubItems && (
                      <div
                        onClick={(e) => toggleGroup(e, group.title)}
                        className="absolute right-1 p-1.5 cursor-pointer text-zinc-400 hover:text-foreground group-data-[collapsible=icon]:hidden transition-colors"
                      >
                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                      </div>
                    )}
                  </div>


                  {/* Inline Dropdown Items - Show when expanded OR when collapsed but group is expanded */}
                  {isExpanded && hasSubItems && (
                    <SidebarMenuSub className="border-l-0 ml-0 pl-0 space-y-0">
                      {group.items.map(subItem => {
                        const isSubActive = pathname === subItem.url;
                        const isCollapsed = sidebarState === "collapsed";
                        const hasNestedItems = subItem.items && subItem.items.length > 0;
                        const isSubExpanded = expandedSubItems.includes(subItem.title);
                        const subIconColor = getIconColor(subItem.title).icon;

                        return (
                          <SidebarMenuSubItem key={subItem.title} className="ml-0">
                            <div className="flex flex-col w-full">
                              <div className="flex items-center w-full relative">
                                <SidebarMenuSubButton asChild isActive={isSubActive} className="h-auto p-0 m-0 flex-1">
                                  <Link
                                    href={subItem.url}
                                    prefetch={true}
                                    onClick={() => {
                                      setActiveCategory(group.title);
                                      setIsSubCollapsed(false);
                                      showLoader();
                                    }}
                                    className={`text-xs font-light flex items-center gap-3 w-full hover:text-blue-600 dark:hover:text-blue-400 rounded-md transition-colors ${isCollapsed ? 'justify-center p-2' : 'p-3'
                                      }`}
                                    title={subItem.title}
                                  >
                                    <subItem.icon className={`h-4 w-4 flex-shrink-0 ${subIconColor}`} />
                                    {!isCollapsed && <span className="truncate">{subItem.title}</span>}
                                  </Link>
                                </SidebarMenuSubButton>

                                {hasNestedItems && !isCollapsed && (
                                  <div
                                    onClick={(e) => toggleSubItem(e, subItem.title)}
                                    className="absolute right-2 p-1 cursor-pointer text-zinc-400 hover:text-foreground transition-colors"
                                  >
                                    <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isSubExpanded ? "rotate-180" : ""}`} />
                                  </div>
                                )}
                              </div>

                              {hasNestedItems && isSubExpanded && !isCollapsed && (
                                <div className="ml-7 mt-1 space-y-1 border-l border-zinc-100 dark:border-zinc-800 p-1">
                                  {subItem.items.map((nestedItem: any) => {
                                    const isNestedActive = pathname === nestedItem.url;
                                    return (
                                      <Link
                                        key={nestedItem.title}
                                        href={nestedItem.url}
                                        prefetch={true}
                                        onClick={() => {
                                          setActiveCategory(group.title);
                                          setIsSubCollapsed(false);
                                          showLoader();
                                        }}
                                        className={`text-[11px] font-light flex items-center gap-2 p-2 rounded-md transition-colors 
                                          ${isNestedActive
                                            ? "text-blue-600 font-medium bg-blue-50/50 dark:bg-blue-900/20"
                                            : "text-zinc-500 hover:text-blue-600 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                                          }`}
                                      >
                                        <nestedItem.icon className="h-3 w-3" />
                                        <span>{nestedItem.title}</span>
                                      </Link>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </SidebarMenuSubItem>
                        )
                      })}
                    </SidebarMenuSub>
                  )}
                  {/* Separator between groups */}
                  <div className="my-1 px-2 group-data-[collapsible=icon]:hidden opacity-50">
                    <Separator className="bg-zinc-100 dark:bg-zinc-800" />
                  </div>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>

      {/* SECONDARY SIDEBAR - Module Drill-down or Category List */}
      {finalSubSidebarGroups.length > 0 && (
        <aside className={`mt-[63px] h-[calc(100svh-63px)] border-r border-border bg-zinc-50 dark:bg-zinc-900 flex-shrink-0 relative hover-scroll hidden md:flex flex-col transition-all duration-300 ${isSubCollapsed ? "w-[60px]" : "w-64"}`}>
          <div className={`p-4 border-b border-border flex items-center sticky top-0 bg-inherit z-10 ${isSubCollapsed ? "justify-center" : "justify-between"}`}>
            {!isSubCollapsed && (
              <h3 className="font-bold text-sm text-foreground uppercase tracking-wide truncate">
                {activeModule === "LeadGov" ? "Lead Management" :
                  activeModule === "ClientGov" ? "Client Management" :
                    activeModule === "ProjectGov" ? "Project Management" :
                      activeModule === "AccountingGov" ? "Accounting" :
                        activeModule === "HrmGov" ? "HRM" :
                          activeModule === "AutomationGov" ? "Automations" :
                            activeModule === "UsersAdmin" ? "Users Management" :
                              activeModule === "GroupsAdmin" ? "Groups & Teams" :
                                activeModule === "RolesAdmin" ? "Roles & Permissions" :
                                  activeModule === "AuthAdmin" ? "Authentication" :
                                    activeModule === "Leads" ? "Leads" :
                                      activeModule === "Deals" ? "Deals / Opportunities" :
                                        activeModule === "Pipeline" ? "Sales Pipeline" :
                                          activeModule === "Clients" ? "Clients / Accounts" :
                                            activeModule === "Campaigns" ? "Campaigns" :
                                              activeModule === "Calendar" ? "Calendar" :
                                                activeModule === "OrgOverview" ? "Organization Overview" :
                                                  activeModule === "OrgFirms" ? "Business Units" :
                                                    activeModule === "OrgRecycleBin" ? "Firm Recycle Bin" :
                                                      activeModule === "OrgBranding" ? "Branding & Theme" :
                                                        activeModule === "OrgSubscription" ? "Subscription" :
                                                          activeModule === "OrgSettings" ? "Organization Settings" :
                                                            activeModule === "OrgUsers" ? "Org Admins" :
                                                              activeModule === "OrgPolicies" ? "Org Policies" :
                                                                activeModule === "OrgAudit" ? "Audit & Activity" :
                                                                  activeModule ? activeModule.toUpperCase() : activeCategory}
              </h3>
            )}
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsSubCollapsed(!isSubCollapsed)}>
              {isSubCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-4 hover-scroll">
            <div className="space-y-4 animate-in slide-in-from-left-4 fade-in duration-300 pb-20">
              {finalSubSidebarGroups.map((group, idx) => (
                <div key={idx} className={isSubCollapsed ? "px-0" : "px-2"}>
                  {!isSubCollapsed && (
                    <h4 className="text-[10px] font-black text-zinc-400 mb-2 px-2 uppercase tracking-[0.2em]">{group.group}</h4>
                  )}
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const isActive = pathname === item.url;
                      return (
                        <Link
                          key={item.title}
                          href={item.url}
                          prefetch={true}
                          onClick={() => showLoader()}
                          className={`flex items-center gap-3 rounded-md text-xs font-light transition-all duration-200
                            ${isActive
                              ? "bg-blue-600 text-white font-medium shadow-md"
                              : "text-zinc-600 hover:text-foreground dark:hover:text-zinc-300 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50"
                            }
                                ${isSubCollapsed ? "justify-center p-2.5 mx-1" : "px-3 py-2"}
                              `}
                          title={isSubCollapsed ? item.title : ""}
                        >
                          <item.icon className={`h-4 w-4 flex-shrink-0 ${isActive ? "text-white" : getIconColor(item.title).icon}`} />
                          {!isSubCollapsed && <span className="truncate">{item.title}</span>}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ))}

              {/* Back to Modules / Governance link */}
              {!isSubCollapsed && (
                <>
                  {["Leads", "Deals", "Pipeline", "Campaigns", "Clients"].includes(activeModule || "") && (
                    <>
                      <Separator className="my-2 opacity-50" />
                      <div className="px-2">
                        <Link
                          href={`/${currentOrg}/modules/crm`}
                          className="flex items-center gap-2 px-3 py-2 text-[11px] text-zinc-500 hover:text-foreground transition-colors group"
                        >
                          <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
                          <span>Back to CRM Modules</span>
                        </Link>
                      </div>
                    </>
                  )}
                  {["UsersAdmin", "GroupsAdmin", "RolesAdmin", "AuthAdmin"].includes(activeModule || "") && (
                    <>
                      <Separator className="my-2 opacity-50" />
                      <div className="px-2">
                        <Link
                          href={`/${currentOrg}/dashboard`}
                          className="flex items-center gap-2 px-3 py-2 text-[11px] text-zinc-500 hover:text-foreground transition-colors group"
                        >
                          <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
                          <span>Back to Governance</span>
                        </Link>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </aside>
      )}
    </>
  );
};

export const AppSidebar = React.memo(AppSidebarComponent);
