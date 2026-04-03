/**
 * Module-Permission Mapping for RBAC Sidebar Filtering
 * Maps each sidebar menu group/item to the required backend module + actions.
 * If a user has ANY of the listed permissions, they can see the menu item.
 *
 * This file mirrors the backend MODULES and PERMISSIONS enums from:
 * backend/CRM_Tech_Be/src/enums/role.enums.js
 */

// ─── Backend Module Keys ───────────────────────────────────────────
export const MODULES = {
  PLATFORM: "platform",
  ORGANIZATION: "organization",
  FIRM: "firm",
  CLIENT: "client",
  LEAD: "lead",
  INVOICE: "invoice",
  TAX: "tax",
  USER: "user",
  DOCUMENT: "document",
  REPORTS: "reports",
  ROLE_PERMISSION: "role_permission",
  PROJECT_MANAGEMENT: "project_management",
  HRM_MANAGEMENT: "hrm_management",
  EMPLOYEE: "EMPLOYEE",
  ONBOARDING: "ONBOARDING",
  ATTENDANCE: "ATTENDANCE",
  SHIFT: "SHIFT",
  LEAVE: "LEAVE",
  HOLIDAY: "HOLIDAY",
  PAYROLL: "PAYROLL",
  POLICY: "POLICY",
  SETTINGS: "SETTINGS",
} as const;

// ─── Backend Permission Keys ───────────────────────────────────────
export const PERMISSIONS = {
  // Platform
  MANAGE_PLATFORM_SETTINGS: "MANAGE_PLATFORM_SETTINGS",
  MANAGE_SUBSCRIPTIONS: "MANAGE_SUBSCRIPTIONS",
  VIEW_PLATFORM_ANALYTICS: "VIEW_PLATFORM_ANALYTICS",

  // Organization & Users
  CREATE_ORGANIZATION: "CREATE_ORGANIZATION",
  EDIT_ORGANIZATION: "EDIT_ORGANIZATION",
  DELETE_ORGANIZATION: "DELETE_ORGANIZATION",
  VIEW_ORG: "VIEW_ORG",
  VIEW_USER: "VIEW_USER",
  VIEW_ALL_USERS: "VIEW_ALL_USERS",
  CREATE_USER: "CREATE_USER",
  DELETE_USER: "DELETE_USER",
  SUSPEND_USER: "SUSPEND_USER",
  UPDATE_ORG_USER: "UPDATE_ORG_USER",
  DELETE_ORG_USER: "DELETE_ORG_USER",
  SEND_INVITATION: "SEND_INVITATION",
  MANAGE_ORG_SESSIONS: "MANAGE_ORG_SESSIONS",
  VIEW_ORG_USER: "VIEW_ORG_USER",
  VIEW_ORG_ANALYTICS: "VIEW_ORG_ANALYTICS",
  EXPORT_ORG_DATA: "EXPORT_ORG_DATA",

  // Lead
  CREATE_LEAD: "CREATE_LEAD",
  EDIT_LEAD: "EDIT_LEAD",
  DELETE_LEAD: "DELETE_LEAD",
  VIEW_LEAD: "VIEW_LEAD",
  ASSIGN_LEAD: "ASSIGN_LEAD",

  // Client
  CREATE_CLIENT: "CREATE_CLIENT",
  EDIT_CLIENT: "EDIT_CLIENT",
  DELETE_CLIENT: "DELETE_CLIENT",
  VIEW_CLIENT_LIST: "VIEW_CLIENT_LIST",

  // Firm
  CREATE_FIRM: "CREATE_FIRM",
  EDIT_FIRM: "EDIT_FIRM",
  DELETE_FIRM: "DELETE_FIRM",
  VIEW_FIRM: "VIEW_FIRM",

  // Project
  CREATE_PROJECT: "CREATE_PROJECT",
  EDIT_PROJECT: "EDIT_PROJECT",
  DELETE_PROJECT: "DELETE_PROJECT",
  VIEW_PROJECT: "VIEW_PROJECT",
  VIEW_ALL_PROJECT: "VIEW_ALL_PROJECT",
  CREATE_TASK: "CREATE_TASK",
  VIEW_ALL_TASKS: "VIEW_ALL_TASKS",
  EDIT_TASK: "EDIT_TASK",
  VIEW_TASK: "VIEW_TASK",
  CREATE_BOARD: "CREATE_BOARD",
  VIEW_BOARD: "VIEW_BOARD",
  VIEW_ALL_BOARD: "VIEW_ALL_BOARD",
  CREATE_WORKFLOW: "CREATE_WORKFLOW",
  VIEW_WORKFLOW: "VIEW_WORKFLOW",
  CREATE_TEAM: "CREATE_TEAM",
  VIEW_TEAM: "VIEW_TEAM",

  // Role & Permissions
  CREATE_ROLE: "CREATE_ROLE",
  EDIT_ROLE: "EDIT_ROLE",
  DELETE_ROLE: "DELETE_ROLE",
  VIEW_ROLE: "VIEW_ROLE",
  MANAGE_PERMISSIONS: "MANAGE_PERMISSIONS",
  AUDIT_PERMISSIONS: "AUDIT_PERMISSIONS",
  CHANGE_MEMBER_ROLE: "CHANGE_MEMBER_ROLE",

  // Document
  UPLOAD_DOCUMENT: "UPLOAD_DOCUMENT",
  DOWNLOAD_DOCUMENT: "DOWNLOAD_DOCUMENT",

  // Reporting
  GENERATE_REPORT: "GENERATE_REPORT",
  EXPORT_DATA: "EXPORT_DATA",

  // HRM
  CREATE_EMPLOYEE: "CREATE_EMPLOYEE",
  EDIT_EMPLOYEE: "EDIT_EMPLOYEE",
  DELETE_EMPLOYEE: "DELETE_EMPLOYEE",
  VIEW_EMPLOYEE_PROFILE: "VIEW_EMPLOYEE_PROFILE",
  VIEW_ALL_EMPLOYEES: "VIEW_ALL_EMPLOYEES",
  MANAGE_EMPLOYE_LEAVE: "MANAGE_EMPLOYE_LEAVE",
  MANAGE_PAYROLL: "MANAGE_PAYROLL",
  VIEW_PAYSLIPS: "VIEW_PAYSLIPS",
  APPROVE_TIMESHEETS: "APPROVE_TIMESHEETS",
  MANAGE_ATTENDANCE: "MANAGE_ATTENDANCE",
  CREATE_JOB_POSTING: "CREATE_JOB_POSTING",
  REVIEW_APPLICATIONS: "REVIEW_APPLICATIONS",
  HIRE_CANDIDATE: "HIRE_CANDIDATE",

  // Invoice
  VIEW_AUDIT_LOGS: "VIEW_AUDIT_LOGS",
  MANAGE_AUDIT_LOGS: "MANAGE_AUDIT_LOGS",
} as const;

// ─── Permission Requirement Type ───────────────────────────────────
export interface PermissionRequirement {
  module: string;
  actions: string[]; // user needs at least ONE of these actions
}

// ─── Sidebar Group Permission Map ──────────────────────────────────
// Maps sidebar group titles → required permissions
// If a user has ANY of the listed module+action combos, they can see the group
export const SIDEBAR_GROUP_PERMISSIONS: Record<string, PermissionRequirement[]> = {
  // Everyone sees Dashboard
  DASHBOARD: [],

  // Everyone sees Calendar
  CALENDAR: [],

  // CRM System - needs lead OR client permissions
  "CRM SYSTEM": [
    { module: MODULES.LEAD, actions: [PERMISSIONS.VIEW_LEAD, PERMISSIONS.CREATE_LEAD] },
    { module: MODULES.CLIENT, actions: [PERMISSIONS.VIEW_CLIENT_LIST, PERMISSIONS.CREATE_CLIENT] },
  ],

  // Sales & Commerce - needs lead/client/invoice permissions
  "SALES & COMMERCE": [
    { module: MODULES.LEAD, actions: [PERMISSIONS.VIEW_LEAD] },
    { module: MODULES.CLIENT, actions: [PERMISSIONS.VIEW_CLIENT_LIST] },
    { module: MODULES.INVOICE, actions: [PERMISSIONS.GENERATE_REPORT] },
  ],

  // Support Desk - needs client or org viewing
  "SUPPORT DESK": [
    { module: MODULES.CLIENT, actions: [PERMISSIONS.VIEW_CLIENT_LIST] },
    { module: MODULES.ORGANIZATION, actions: [PERMISSIONS.VIEW_ORG] },
  ],

  // Project Management - needs project permissions
  "PROJECT MANAGEMENT": [
    { module: MODULES.PROJECT_MANAGEMENT, actions: [PERMISSIONS.VIEW_PROJECT, PERMISSIONS.VIEW_ALL_PROJECT, PERMISSIONS.CREATE_PROJECT] },
  ],

  // HRM / Workforce - needs HRM permissions
  "HRM / WORKFORCE": [
    { module: MODULES.HRM_MANAGEMENT, actions: [PERMISSIONS.VIEW_ALL_EMPLOYEES, PERMISSIONS.VIEW_EMPLOYEE_PROFILE, PERMISSIONS.CREATE_EMPLOYEE] },
    { module: MODULES.EMPLOYEE, actions: [PERMISSIONS.VIEW_ALL_EMPLOYEES, PERMISSIONS.VIEW_EMPLOYEE_PROFILE] },
    { module: MODULES.ATTENDANCE, actions: [PERMISSIONS.MANAGE_ATTENDANCE] },
    { module: MODULES.LEAVE, actions: [PERMISSIONS.MANAGE_EMPLOYE_LEAVE] },
    { module: MODULES.PAYROLL, actions: [PERMISSIONS.MANAGE_PAYROLL, PERMISSIONS.VIEW_PAYSLIPS] },
  ],

  // Finance - needs invoice/org permissions
  FINANCE: [
    { module: MODULES.INVOICE, actions: [PERMISSIONS.GENERATE_REPORT] },
    { module: MODULES.TAX, actions: [PERMISSIONS.GENERATE_REPORT] },
    { module: MODULES.ORGANIZATION, actions: [PERMISSIONS.VIEW_ORG_ANALYTICS] },
  ],

  // Analytics - needs reporting permissions
  ANALYTICS: [
    { module: MODULES.REPORTS, actions: [PERMISSIONS.GENERATE_REPORT, PERMISSIONS.EXPORT_DATA] },
    { module: MODULES.ORGANIZATION, actions: [PERMISSIONS.VIEW_ORG_ANALYTICS] },
  ],

  // Administration - needs org admin or role permissions
  ADMINISTRATION: [
    { module: MODULES.ORGANIZATION, actions: [PERMISSIONS.EDIT_ORGANIZATION, PERMISSIONS.VIEW_ORG] },
    { module: MODULES.ROLE_PERMISSION, actions: [PERMISSIONS.VIEW_ROLE, PERMISSIONS.CREATE_ROLE, PERMISSIONS.MANAGE_PERMISSIONS] },
    { module: MODULES.USER, actions: [PERMISSIONS.VIEW_ALL_USERS, PERMISSIONS.CREATE_USER] },
  ],

  // ─── Admin Sidebar Groups ───────────────────────────────────────
  ORGANIZATION: [
    { module: MODULES.ORGANIZATION, actions: [PERMISSIONS.VIEW_ORG, PERMISSIONS.EDIT_ORGANIZATION] },
  ],

  "IDENTITY & ACCESS": [
    { module: MODULES.USER, actions: [PERMISSIONS.VIEW_ALL_USERS, PERMISSIONS.CREATE_USER] },
    { module: MODULES.ROLE_PERMISSION, actions: [PERMISSIONS.VIEW_ROLE, PERMISSIONS.CREATE_ROLE] },
  ],

  APPLICATIONS: [
    { module: MODULES.ORGANIZATION, actions: [PERMISSIONS.EDIT_ORGANIZATION] },
    { module: MODULES.PLATFORM, actions: [PERMISSIONS.MANAGE_PLATFORM_SETTINGS] },
  ],

  "MODULES & ENTITLEMENTS": [
    { module: MODULES.ORGANIZATION, actions: [PERMISSIONS.EDIT_ORGANIZATION] },
    { module: MODULES.ROLE_PERMISSION, actions: [PERMISSIONS.MANAGE_PERMISSIONS] },
  ],

  POLICIES: [
    { module: MODULES.ORGANIZATION, actions: [PERMISSIONS.EDIT_ORGANIZATION] },
  ],

  SECURITY: [
    { module: MODULES.ORGANIZATION, actions: [PERMISSIONS.EDIT_ORGANIZATION, PERMISSIONS.MANAGE_ORG_SESSIONS] },
  ],

  "DATA MANAGEMENT": [
    { module: MODULES.ORGANIZATION, actions: [PERMISSIONS.EXPORT_ORG_DATA, PERMISSIONS.EDIT_ORGANIZATION] },
  ],

  MONITORING: [
    { module: MODULES.ORGANIZATION, actions: [PERMISSIONS.VIEW_AUDIT_LOGS, PERMISSIONS.MANAGE_AUDIT_LOGS, PERMISSIONS.VIEW_ORG_ANALYTICS] },
  ],

  INTEGRATIONS: [
    { module: MODULES.ORGANIZATION, actions: [PERMISSIONS.EDIT_ORGANIZATION] },
    { module: MODULES.PLATFORM, actions: [PERMISSIONS.MANAGE_PLATFORM_SETTINGS] },
  ],

  "BILLING & SUBSCRIPTION": [
    { module: MODULES.ORGANIZATION, actions: [PERMISSIONS.MANAGE_SUBSCRIPTIONS, PERMISSIONS.EDIT_ORGANIZATION] },
    { module: MODULES.PLATFORM, actions: [PERMISSIONS.MANAGE_SUBSCRIPTIONS] },
  ],
};

// ─── Sidebar Item Permission Map ───────────────────────────────────
// Maps individual sidebar item titles → required permissions
// Used for granular item-level filtering within a visible group
export const SIDEBAR_ITEM_PERMISSIONS: Record<string, PermissionRequirement[]> = {
  // CRM System items
  "Leads": [{ module: MODULES.LEAD, actions: [PERMISSIONS.VIEW_LEAD, PERMISSIONS.CREATE_LEAD] }],
  "Deals / Opportunities": [{ module: MODULES.LEAD, actions: [PERMISSIONS.VIEW_LEAD] }, { module: MODULES.CLIENT, actions: [PERMISSIONS.VIEW_CLIENT_LIST] }],
  "Sales Pipeline": [{ module: MODULES.LEAD, actions: [PERMISSIONS.VIEW_LEAD] }],
  "Clients / Accounts": [{ module: MODULES.CLIENT, actions: [PERMISSIONS.VIEW_CLIENT_LIST, PERMISSIONS.CREATE_CLIENT] }],
  "Contacts": [{ module: MODULES.CLIENT, actions: [PERMISSIONS.VIEW_CLIENT_LIST] }],
  "Activities": [{ module: MODULES.LEAD, actions: [PERMISSIONS.VIEW_LEAD] }, { module: MODULES.CLIENT, actions: [PERMISSIONS.VIEW_CLIENT_LIST] }],
  "Campaigns": [{ module: MODULES.LEAD, actions: [PERMISSIONS.VIEW_LEAD] }],
  "CRM Settings": [{ module: MODULES.ORGANIZATION, actions: [PERMISSIONS.EDIT_ORGANIZATION] }],

  // Project Management items
  "Workspaces": [{ module: MODULES.PROJECT_MANAGEMENT, actions: [PERMISSIONS.VIEW_PROJECT, PERMISSIONS.VIEW_ALL_PROJECT] }],
  "Projects": [{ module: MODULES.PROJECT_MANAGEMENT, actions: [PERMISSIONS.VIEW_PROJECT, PERMISSIONS.VIEW_ALL_PROJECT, PERMISSIONS.CREATE_PROJECT] }],
  "Tasks": [{ module: MODULES.PROJECT_MANAGEMENT, actions: [PERMISSIONS.VIEW_TASK, PERMISSIONS.VIEW_ALL_TASKS, PERMISSIONS.CREATE_TASK] }],
  "Boards": [{ module: MODULES.PROJECT_MANAGEMENT, actions: [PERMISSIONS.VIEW_BOARD, PERMISSIONS.VIEW_ALL_BOARD, PERMISSIONS.CREATE_BOARD] }],
  "Sprints": [{ module: MODULES.PROJECT_MANAGEMENT, actions: [PERMISSIONS.VIEW_PROJECT] }],
  "Time Tracking": [{ module: MODULES.PROJECT_MANAGEMENT, actions: [PERMISSIONS.VIEW_PROJECT] }],
  "PM Settings": [{ module: MODULES.PROJECT_MANAGEMENT, actions: [PERMISSIONS.EDIT_PROJECT] }],

  // HRM items
  "HR Dashboard": [{ module: MODULES.HRM_MANAGEMENT, actions: [PERMISSIONS.VIEW_ALL_EMPLOYEES, PERMISSIONS.VIEW_EMPLOYEE_PROFILE] }],
  "Employees": [{ module: MODULES.HRM_MANAGEMENT, actions: [PERMISSIONS.VIEW_ALL_EMPLOYEES, PERMISSIONS.VIEW_EMPLOYEE_PROFILE, PERMISSIONS.CREATE_EMPLOYEE] }],
  "Attendance": [{ module: MODULES.ATTENDANCE, actions: [PERMISSIONS.MANAGE_ATTENDANCE] }, { module: MODULES.HRM_MANAGEMENT, actions: [PERMISSIONS.VIEW_ALL_EMPLOYEES] }],
  "Leave Management": [{ module: MODULES.LEAVE, actions: [PERMISSIONS.MANAGE_EMPLOYE_LEAVE] }, { module: MODULES.HRM_MANAGEMENT, actions: [PERMISSIONS.VIEW_EMPLOYEE_PROFILE] }],
  "Payroll": [{ module: MODULES.PAYROLL, actions: [PERMISSIONS.MANAGE_PAYROLL, PERMISSIONS.VIEW_PAYSLIPS] }],
  "Performance Reviews": [{ module: MODULES.HRM_MANAGEMENT, actions: [PERMISSIONS.VIEW_ALL_EMPLOYEES, PERMISSIONS.EDIT_EMPLOYEE] }],
  "Recruitment": [{ module: MODULES.HRM_MANAGEMENT, actions: [PERMISSIONS.CREATE_JOB_POSTING, PERMISSIONS.REVIEW_APPLICATIONS, PERMISSIONS.HIRE_CANDIDATE] }],
  "HR Settings": [{ module: MODULES.HRM_MANAGEMENT, actions: [PERMISSIONS.EDIT_EMPLOYEE] }],

  // Finance items
  "Invoices": [{ module: MODULES.INVOICE, actions: [PERMISSIONS.GENERATE_REPORT] }],
  "Payments": [{ module: MODULES.INVOICE, actions: [PERMISSIONS.GENERATE_REPORT] }],
  "Accounting": [{ module: MODULES.INVOICE, actions: [PERMISSIONS.GENERATE_REPORT] }, { module: MODULES.TAX, actions: [PERMISSIONS.GENERATE_REPORT] }],
  "Expenses": [{ module: MODULES.INVOICE, actions: [PERMISSIONS.GENERATE_REPORT] }],

  // Administration items
  "Organization Profile": [{ module: MODULES.ORGANIZATION, actions: [PERMISSIONS.VIEW_ORG, PERMISSIONS.EDIT_ORGANIZATION] }],
  "Business Units": [{ module: MODULES.FIRM, actions: [PERMISSIONS.VIEW_FIRM, PERMISSIONS.CREATE_FIRM] }],
  "Users": [{ module: MODULES.USER, actions: [PERMISSIONS.VIEW_ALL_USERS, PERMISSIONS.CREATE_USER] }],
  "Roles & Permissions": [{ module: MODULES.ROLE_PERMISSION, actions: [PERMISSIONS.VIEW_ROLE, PERMISSIONS.CREATE_ROLE, PERMISSIONS.MANAGE_PERMISSIONS] }],
  "Workflow Automation": [{ module: MODULES.ORGANIZATION, actions: [PERMISSIONS.EDIT_ORGANIZATION] }],
  "Security Overview": [{ module: MODULES.ORGANIZATION, actions: [PERMISSIONS.EDIT_ORGANIZATION, PERMISSIONS.MANAGE_ORG_SESSIONS] }],
  "Audit Logs": [{ module: MODULES.ORGANIZATION, actions: [PERMISSIONS.VIEW_AUDIT_LOGS, PERMISSIONS.MANAGE_AUDIT_LOGS] }],
  "Audit Log": [{ module: MODULES.ORGANIZATION, actions: [PERMISSIONS.VIEW_AUDIT_LOGS, PERMISSIONS.MANAGE_AUDIT_LOGS] }],

  // Admin sidebar specific items
  "Overview": [{ module: MODULES.ORGANIZATION, actions: [PERMISSIONS.VIEW_ORG] }],
  "Business Units (Firms)": [{ module: MODULES.FIRM, actions: [PERMISSIONS.VIEW_FIRM, PERMISSIONS.CREATE_FIRM] }],
  "Branding & Theme": [{ module: MODULES.ORGANIZATION, actions: [PERMISSIONS.EDIT_ORGANIZATION] }],
  "Subscription & Billing": [{ module: MODULES.ORGANIZATION, actions: [PERMISSIONS.MANAGE_SUBSCRIPTIONS, PERMISSIONS.EDIT_ORGANIZATION] }],
  "Org Settings": [{ module: MODULES.ORGANIZATION, actions: [PERMISSIONS.EDIT_ORGANIZATION] }],
  "Org Admins": [{ module: MODULES.USER, actions: [PERMISSIONS.VIEW_ALL_USERS] }, { module: MODULES.ORGANIZATION, actions: [PERMISSIONS.EDIT_ORGANIZATION] }],

  // Identity & Access items
  "Teams / Groups": [{ module: MODULES.PROJECT_MANAGEMENT, actions: [PERMISSIONS.VIEW_TEAM, PERMISSIONS.CREATE_TEAM] }],
  "Authentication": [{ module: MODULES.ORGANIZATION, actions: [PERMISSIONS.EDIT_ORGANIZATION, PERMISSIONS.MANAGE_ORG_SESSIONS] }],
  "SSO & Identity Providers": [{ module: MODULES.ORGANIZATION, actions: [PERMISSIONS.EDIT_ORGANIZATION] }],
  "Login Policies": [{ module: MODULES.ORGANIZATION, actions: [PERMISSIONS.EDIT_ORGANIZATION] }],
  "Sessions": [{ module: MODULES.ORGANIZATION, actions: [PERMISSIONS.MANAGE_ORG_SESSIONS] }],
};

// ─── HRM Sidebar Permission Map ───────────────────────────────────
// Maps HRM sidebar section titles → required permissions
// null/empty = everyone can see, otherwise user needs at least one matching permission
export const HRM_SIDEBAR_GROUP_PERMISSIONS: Record<string, PermissionRequirement[]> = {
  "Home": [],  // Everyone
  "Me": [],    // Everyone (Self scope)
  "Inbox": [], // Everyone
  "My Team": [
    { module: MODULES.HRM_MANAGEMENT, actions: [PERMISSIONS.VIEW_ALL_EMPLOYEES, PERMISSIONS.MANAGE_ATTENDANCE] },
    { module: MODULES.ATTENDANCE, actions: [PERMISSIONS.MANAGE_ATTENDANCE, PERMISSIONS.APPROVE_TIMESHEETS] },
  ],
  "Organization": [
    { module: MODULES.HRM_MANAGEMENT, actions: [PERMISSIONS.VIEW_ALL_EMPLOYEES, PERMISSIONS.VIEW_EMPLOYEE_PROFILE] },
    { module: MODULES.EMPLOYEE, actions: [PERMISSIONS.VIEW_ALL_EMPLOYEES] },
  ],
  "Hire": [
    { module: MODULES.HRM_MANAGEMENT, actions: [PERMISSIONS.CREATE_EMPLOYEE, PERMISSIONS.CREATE_JOB_POSTING, PERMISSIONS.REVIEW_APPLICATIONS, PERMISSIONS.HIRE_CANDIDATE] },
  ],
  "Lifecycle": [
    { module: MODULES.HRM_MANAGEMENT, actions: [PERMISSIONS.CREATE_EMPLOYEE, PERMISSIONS.EDIT_EMPLOYEE] },
    { module: MODULES.ONBOARDING, actions: [PERMISSIONS.CREATE_EMPLOYEE] },
  ],
  "Time & Attend": [
    { module: MODULES.ATTENDANCE, actions: [PERMISSIONS.MANAGE_ATTENDANCE] },
    { module: MODULES.HRM_MANAGEMENT, actions: [PERMISSIONS.VIEW_ALL_EMPLOYEES, PERMISSIONS.VIEW_EMPLOYEE_PROFILE] },
  ],
  "Payroll": [
    { module: MODULES.PAYROLL, actions: [PERMISSIONS.MANAGE_PAYROLL, PERMISSIONS.VIEW_PAYSLIPS] },
  ],
  "Performance": [
    { module: MODULES.HRM_MANAGEMENT, actions: [PERMISSIONS.VIEW_ALL_EMPLOYEES, PERMISSIONS.EDIT_EMPLOYEE, PERMISSIONS.APPROVE_TIMESHEETS] },
  ],
  "Documents": [
    { module: MODULES.HRM_MANAGEMENT, actions: [PERMISSIONS.VIEW_ALL_EMPLOYEES, PERMISSIONS.VIEW_EMPLOYEE_PROFILE] },
    { module: MODULES.DOCUMENT, actions: [PERMISSIONS.UPLOAD_DOCUMENT, PERMISSIONS.DOWNLOAD_DOCUMENT] },
  ],
  "Engage": [], // Everyone can see engagement features
  "Helpdesk": [], // Everyone can see (filtered by scope on data level)
  "Expenses": [], // Everyone can see (filtered by scope — own claims only for employees)
  "Timesheets": [
    { module: MODULES.ATTENDANCE, actions: [PERMISSIONS.MANAGE_ATTENDANCE, PERMISSIONS.APPROVE_TIMESHEETS] },
    { module: MODULES.HRM_MANAGEMENT, actions: [PERMISSIONS.VIEW_ALL_EMPLOYEES] },
  ],
  "Reports Hub": [
    { module: MODULES.HRM_MANAGEMENT, actions: [PERMISSIONS.VIEW_ALL_EMPLOYEES] },
    { module: MODULES.PAYROLL, actions: [PERMISSIONS.MANAGE_PAYROLL] },
    { module: MODULES.REPORTS, actions: [PERMISSIONS.GENERATE_REPORT] },
  ],
  "Admin": [
    { module: MODULES.ROLE_PERMISSION, actions: [PERMISSIONS.MANAGE_PERMISSIONS, PERMISSIONS.CREATE_ROLE, PERMISSIONS.EDIT_ROLE] },
  ],
};

// HRM sub-item level permissions (for items inside each group)
export const HRM_SIDEBAR_ITEM_PERMISSIONS: Record<string, PermissionRequirement[]> = {
  // Organization sub-items
  "Org Dashboard": [{ module: MODULES.HRM_MANAGEMENT, actions: [PERMISSIONS.VIEW_ALL_EMPLOYEES] }],
  "Company Profile": [{ module: MODULES.HRM_MANAGEMENT, actions: [PERMISSIONS.VIEW_ALL_EMPLOYEES] }],
  "Departments": [{ module: MODULES.HRM_MANAGEMENT, actions: [PERMISSIONS.VIEW_ALL_EMPLOYEES, PERMISSIONS.MANAGE_ATTENDANCE] }],
  "Designations": [{ module: MODULES.HRM_MANAGEMENT, actions: [PERMISSIONS.VIEW_ALL_EMPLOYEES, PERMISSIONS.EDIT_EMPLOYEE] }],
  "Locations": [{ module: MODULES.HRM_MANAGEMENT, actions: [PERMISSIONS.VIEW_ALL_EMPLOYEES] }],
  "Policy Center": [{ module: MODULES.POLICY, actions: [PERMISSIONS.MANAGE_PAYROLL] }, { module: MODULES.HRM_MANAGEMENT, actions: [PERMISSIONS.EDIT_EMPLOYEE] }],

  // Hire sub-items
  "Job Openings": [{ module: MODULES.HRM_MANAGEMENT, actions: [PERMISSIONS.CREATE_JOB_POSTING] }],
  "Candidates": [{ module: MODULES.HRM_MANAGEMENT, actions: [PERMISSIONS.REVIEW_APPLICATIONS] }],
  "Interviews": [{ module: MODULES.HRM_MANAGEMENT, actions: [PERMISSIONS.REVIEW_APPLICATIONS] }],
  "Offer Letters": [{ module: MODULES.HRM_MANAGEMENT, actions: [PERMISSIONS.HIRE_CANDIDATE] }],
  "Hiring Reports": [{ module: MODULES.HRM_MANAGEMENT, actions: [PERMISSIONS.VIEW_ALL_EMPLOYEES] }],
  "Career Page": [{ module: MODULES.HRM_MANAGEMENT, actions: [PERMISSIONS.CREATE_JOB_POSTING] }],
  "Resume Parser": [{ module: MODULES.HRM_MANAGEMENT, actions: [PERMISSIONS.REVIEW_APPLICATIONS] }],

  // Time & Attend sub-items
  "Shifts & Holidays": [{ module: MODULES.ATTENDANCE, actions: [PERMISSIONS.MANAGE_ATTENDANCE] }],
  "Overtime": [{ module: MODULES.ATTENDANCE, actions: [PERMISSIONS.MANAGE_ATTENDANCE] }],
  "Shift Allowance": [{ module: MODULES.ATTENDANCE, actions: [PERMISSIONS.MANAGE_ATTENDANCE] }],
  "Geo-fencing": [{ module: MODULES.ATTENDANCE, actions: [PERMISSIONS.MANAGE_ATTENDANCE] }],
  "Biometric": [{ module: MODULES.ATTENDANCE, actions: [PERMISSIONS.MANAGE_ATTENDANCE] }],
  "Sandwich Rules": [{ module: MODULES.ATTENDANCE, actions: [PERMISSIONS.MANAGE_ATTENDANCE] }],

  // Payroll sub-items
  "Salary Processing": [{ module: MODULES.PAYROLL, actions: [PERMISSIONS.MANAGE_PAYROLL] }],
  "Payroll Reports": [{ module: MODULES.PAYROLL, actions: [PERMISSIONS.MANAGE_PAYROLL] }],
  "Payroll Settings": [{ module: MODULES.PAYROLL, actions: [PERMISSIONS.MANAGE_PAYROLL] }],
  "Salary Structure": [{ module: MODULES.PAYROLL, actions: [PERMISSIONS.MANAGE_PAYROLL] }],
  "Statutory Compliance": [{ module: MODULES.PAYROLL, actions: [PERMISSIONS.MANAGE_PAYROLL] }],
  "Loans & Advances": [{ module: MODULES.PAYROLL, actions: [PERMISSIONS.MANAGE_PAYROLL] }],
  "Salary Revision": [{ module: MODULES.PAYROLL, actions: [PERMISSIONS.MANAGE_PAYROLL] }],
  "Multi-Entity": [{ module: MODULES.PAYROLL, actions: [PERMISSIONS.MANAGE_PAYROLL] }],

  // Performance sub-items
  "Calibration": [{ module: MODULES.HRM_MANAGEMENT, actions: [PERMISSIONS.EDIT_EMPLOYEE] }],
  "PIP Tracking": [{ module: MODULES.HRM_MANAGEMENT, actions: [PERMISSIONS.EDIT_EMPLOYEE] }],
  "Compensation Review": [{ module: MODULES.PAYROLL, actions: [PERMISSIONS.MANAGE_PAYROLL] }],

  // Documents sub-items
  "HR Documents": [{ module: MODULES.HRM_MANAGEMENT, actions: [PERMISSIONS.VIEW_ALL_EMPLOYEES] }],
  "Bulk Letters": [{ module: MODULES.HRM_MANAGEMENT, actions: [PERMISSIONS.VIEW_ALL_EMPLOYEES] }],

  // Helpdesk sub-items (restricted for non-admin)
  "Support Queue": [{ module: MODULES.HRM_MANAGEMENT, actions: [PERMISSIONS.VIEW_ALL_EMPLOYEES] }],
  "Agent Management": [{ module: MODULES.HRM_MANAGEMENT, actions: [PERMISSIONS.VIEW_ALL_EMPLOYEES] }],

  // Expenses sub-items (restricted)
  "Travel": [{ module: MODULES.HRM_MANAGEMENT, actions: [PERMISSIONS.VIEW_ALL_EMPLOYEES] }],

  // Admin sub-items — all require admin-level permissions
  "Role & Permissions": [{ module: MODULES.ROLE_PERMISSION, actions: [PERMISSIONS.MANAGE_PERMISSIONS, PERMISSIONS.CREATE_ROLE] }],
  "Workflows & Approvals": [{ module: MODULES.ROLE_PERMISSION, actions: [PERMISSIONS.MANAGE_PERMISSIONS] }],
  "Automation & Rules": [{ module: MODULES.ROLE_PERMISSION, actions: [PERMISSIONS.MANAGE_PERMISSIONS] }],
  "Attendance Rules": [{ module: MODULES.ATTENDANCE, actions: [PERMISSIONS.MANAGE_ATTENDANCE] }, { module: MODULES.ROLE_PERMISSION, actions: [PERMISSIONS.MANAGE_PERMISSIONS] }],
  "Delegation": [{ module: MODULES.ROLE_PERMISSION, actions: [PERMISSIONS.MANAGE_PERMISSIONS] }],
  "Escalation Rules": [{ module: MODULES.ROLE_PERMISSION, actions: [PERMISSIONS.MANAGE_PERMISSIONS] }],
};

// ─── Lead Management Sidebar Permission Map ───────────────────────
export const LEAD_SIDEBAR_GROUP_PERMISSIONS: Record<string, PermissionRequirement[]> = {
  "Overview": [
    { module: MODULES.LEAD, actions: [PERMISSIONS.VIEW_LEAD] },
  ],
  "Lead Inbox": [
    { module: MODULES.LEAD, actions: [PERMISSIONS.VIEW_LEAD] },
  ],
  "Leads": [
    { module: MODULES.LEAD, actions: [PERMISSIONS.VIEW_LEAD] },
  ],
  "Pipeline": [
    { module: MODULES.LEAD, actions: [PERMISSIONS.VIEW_LEAD] },
  ],
  "Activities": [
    { module: MODULES.LEAD, actions: [PERMISSIONS.VIEW_LEAD] },
  ],
  "Qualification & Scoring": [
    { module: MODULES.LEAD, actions: [PERMISSIONS.EDIT_LEAD, PERMISSIONS.ASSIGN_LEAD] },
    { module: MODULES.ROLE_PERMISSION, actions: [PERMISSIONS.MANAGE_PERMISSIONS] },
  ],
  "Routing & SLA": [
    { module: MODULES.LEAD, actions: [PERMISSIONS.ASSIGN_LEAD] },
    { module: MODULES.ROLE_PERMISSION, actions: [PERMISSIONS.MANAGE_PERMISSIONS] },
  ],
  "Automation": [
    { module: MODULES.LEAD, actions: [PERMISSIONS.EDIT_LEAD, PERMISSIONS.ASSIGN_LEAD] },
    { module: MODULES.ORGANIZATION, actions: [PERMISSIONS.EDIT_ORGANIZATION] },
  ],
  "Campaigns & Sources": [
    { module: MODULES.LEAD, actions: [PERMISSIONS.VIEW_LEAD, PERMISSIONS.CREATE_LEAD] },
  ],
  "Reports & Analytics": [
    { module: MODULES.LEAD, actions: [PERMISSIONS.VIEW_LEAD] },
    { module: MODULES.REPORTS, actions: [PERMISSIONS.GENERATE_REPORT] },
  ],
  "Integrations": [
    { module: MODULES.ORGANIZATION, actions: [PERMISSIONS.EDIT_ORGANIZATION] },
    { module: MODULES.ROLE_PERMISSION, actions: [PERMISSIONS.MANAGE_PERMISSIONS] },
  ],
  "Settings": [
    { module: MODULES.ORGANIZATION, actions: [PERMISSIONS.EDIT_ORGANIZATION] },
    { module: MODULES.ROLE_PERMISSION, actions: [PERMISSIONS.MANAGE_PERMISSIONS] },
  ],
};

// Lead Management sub-item permissions
export const LEAD_SIDEBAR_ITEM_PERMISSIONS: Record<string, PermissionRequirement[]> = {
  // Lead Inbox sub-items
  "Unassigned": [{ module: MODULES.LEAD, actions: [PERMISSIONS.ASSIGN_LEAD] }],

  // Leads sub-items
  "Archived": [{ module: MODULES.LEAD, actions: [PERMISSIONS.DELETE_LEAD, PERMISSIONS.EDIT_LEAD] }],
  "Saved Views": [{ module: MODULES.LEAD, actions: [PERMISSIONS.VIEW_LEAD] }],

  // Pipeline sub-items
  "Forecast": [{ module: MODULES.LEAD, actions: [PERMISSIONS.VIEW_LEAD] }, { module: MODULES.REPORTS, actions: [PERMISSIONS.GENERATE_REPORT] }],

  // Activities sub-items
  "Overdue": [{ module: MODULES.LEAD, actions: [PERMISSIONS.VIEW_LEAD, PERMISSIONS.EDIT_LEAD] }],

  // Qualification sub-items — all admin/manager level
  "Qualification Framework": [{ module: MODULES.LEAD, actions: [PERMISSIONS.EDIT_LEAD, PERMISSIONS.ASSIGN_LEAD] }],
  "Scoring Rules": [{ module: MODULES.LEAD, actions: [PERMISSIONS.EDIT_LEAD, PERMISSIONS.ASSIGN_LEAD] }],
  "Behavioral Scoring": [{ module: MODULES.LEAD, actions: [PERMISSIONS.EDIT_LEAD] }],

  // Routing sub-items — admin only
  "Routing Rules": [{ module: MODULES.LEAD, actions: [PERMISSIONS.ASSIGN_LEAD] }],
  "Assignment Methods": [{ module: MODULES.LEAD, actions: [PERMISSIONS.ASSIGN_LEAD] }],
  "SLA Policies": [{ module: MODULES.LEAD, actions: [PERMISSIONS.ASSIGN_LEAD] }],

  // Automation sub-items
  "Nurture Sequences": [{ module: MODULES.LEAD, actions: [PERMISSIONS.EDIT_LEAD] }],
  "Automation Settings": [{ module: MODULES.ORGANIZATION, actions: [PERMISSIONS.EDIT_ORGANIZATION] }],

  // Campaigns sub-items
  "UTM Tracking": [{ module: MODULES.LEAD, actions: [PERMISSIONS.VIEW_LEAD] }],
  "Lead Attribution": [{ module: MODULES.LEAD, actions: [PERMISSIONS.VIEW_LEAD] }],
  "Tracking Settings": [{ module: MODULES.ORGANIZATION, actions: [PERMISSIONS.EDIT_ORGANIZATION] }],

  // Reports sub-items
  "Custom Reports": [{ module: MODULES.REPORTS, actions: [PERMISSIONS.GENERATE_REPORT] }],
  "Scheduled Reports": [{ module: MODULES.REPORTS, actions: [PERMISSIONS.GENERATE_REPORT] }],

  // Integrations sub-items — all admin only
  "API & Webhooks": [{ module: MODULES.ORGANIZATION, actions: [PERMISSIONS.EDIT_ORGANIZATION] }],
  "Integration Logs": [{ module: MODULES.ORGANIZATION, actions: [PERMISSIONS.VIEW_AUDIT_LOGS] }],

  // Settings sub-items — all admin only
  "Organization & Preferences": [{ module: MODULES.ORGANIZATION, actions: [PERMISSIONS.EDIT_ORGANIZATION] }],
  "Users & Access": [{ module: MODULES.USER, actions: [PERMISSIONS.VIEW_ALL_USERS] }],
  "Lead Lifecycle Setup": [{ module: MODULES.LEAD, actions: [PERMISSIONS.EDIT_LEAD] }],
  "Fields & Data Model": [{ module: MODULES.ORGANIZATION, actions: [PERMISSIONS.EDIT_ORGANIZATION] }],
  "Security": [{ module: MODULES.ORGANIZATION, actions: [PERMISSIONS.EDIT_ORGANIZATION] }],
  "Audit & Compliance": [{ module: MODULES.ORGANIZATION, actions: [PERMISSIONS.VIEW_AUDIT_LOGS] }],
  "Billing & Plan": [{ module: MODULES.ORGANIZATION, actions: [PERMISSIONS.MANAGE_SUBSCRIPTIONS] }],
};

// ─── Client Management Sidebar Permission Map ────────────────────
export const CLIENT_SIDEBAR_GROUP_PERMISSIONS: Record<string, PermissionRequirement[]> = {
  "Overview": [
    { module: MODULES.CLIENT, actions: [PERMISSIONS.VIEW_CLIENT_LIST] },
  ],
  "Revenue": [
    { module: MODULES.CLIENT, actions: [PERMISSIONS.VIEW_CLIENT_LIST] },
  ],
  "Subscriptions": [
    { module: MODULES.CLIENT, actions: [PERMISSIONS.VIEW_CLIENT_LIST] },
  ],
  "Customers": [
    { module: MODULES.CLIENT, actions: [PERMISSIONS.VIEW_CLIENT_LIST] },
  ],
  "Communication": [
    { module: MODULES.CLIENT, actions: [PERMISSIONS.VIEW_CLIENT_LIST] },
  ],
  "Support": [
    { module: MODULES.CLIENT, actions: [PERMISSIONS.VIEW_CLIENT_LIST] },
  ],
  "Analytics": [
    { module: MODULES.CLIENT, actions: [PERMISSIONS.VIEW_CLIENT_LIST] },
    { module: MODULES.REPORTS, actions: [PERMISSIONS.GENERATE_REPORT] },
  ],
  "Reports": [
    { module: MODULES.CLIENT, actions: [PERMISSIONS.VIEW_CLIENT_LIST] },
    { module: MODULES.REPORTS, actions: [PERMISSIONS.GENERATE_REPORT] },
  ],
  "Finance": [
    { module: MODULES.INVOICE, actions: [PERMISSIONS.GENERATE_REPORT] },
    { module: MODULES.ORGANIZATION, actions: [PERMISSIONS.EDIT_ORGANIZATION] },
  ],
  "Automation": [
    { module: MODULES.CLIENT, actions: [PERMISSIONS.EDIT_CLIENT] },
    { module: MODULES.ORGANIZATION, actions: [PERMISSIONS.EDIT_ORGANIZATION] },
  ],
  "Integrations": [
    { module: MODULES.ORGANIZATION, actions: [PERMISSIONS.EDIT_ORGANIZATION] },
    { module: MODULES.ROLE_PERMISSION, actions: [PERMISSIONS.MANAGE_PERMISSIONS] },
  ],
  "Settings": [
    { module: MODULES.ORGANIZATION, actions: [PERMISSIONS.EDIT_ORGANIZATION] },
    { module: MODULES.ROLE_PERMISSION, actions: [PERMISSIONS.MANAGE_PERMISSIONS] },
  ],
};

// Client Management sub-item permissions
export const CLIENT_SIDEBAR_ITEM_PERMISSIONS: Record<string, PermissionRequirement[]> = {
  // Revenue sub-items
  "Opportunities": [{ module: MODULES.CLIENT, actions: [PERMISSIONS.VIEW_CLIENT_LIST] }],
  "Renewals": [{ module: MODULES.CLIENT, actions: [PERMISSIONS.VIEW_CLIENT_LIST] }],
  "Expansion": [{ module: MODULES.CLIENT, actions: [PERMISSIONS.EDIT_CLIENT] }],

  // Subscriptions sub-items
  "Plans & Pricing": [{ module: MODULES.CLIENT, actions: [PERMISSIONS.EDIT_CLIENT] }],
  "Usage Billing": [{ module: MODULES.INVOICE, actions: [PERMISSIONS.GENERATE_REPORT] }],
  "Contracts": [{ module: MODULES.CLIENT, actions: [PERMISSIONS.VIEW_CLIENT_LIST] }],
  "Invoices & Payments": [{ module: MODULES.INVOICE, actions: [PERMISSIONS.GENERATE_REPORT] }],

  // Support sub-items
  "SLA Management": [{ module: MODULES.CLIENT, actions: [PERMISSIONS.EDIT_CLIENT] }],
  "Escalations": [{ module: MODULES.CLIENT, actions: [PERMISSIONS.EDIT_CLIENT] }],

  // Analytics sub-items
  "Cohort Analysis": [{ module: MODULES.REPORTS, actions: [PERMISSIONS.GENERATE_REPORT] }],
  "Forecasting": [{ module: MODULES.REPORTS, actions: [PERMISSIONS.GENERATE_REPORT] }],
  "AI Insights": [{ module: MODULES.REPORTS, actions: [PERMISSIONS.GENERATE_REPORT] }],

  // Finance sub-items — all admin/finance only
  "Accounting": [{ module: MODULES.INVOICE, actions: [PERMISSIONS.GENERATE_REPORT] }],
  "Tax Module": [{ module: MODULES.TAX, actions: [PERMISSIONS.GENERATE_REPORT] }],
  "Revenue Recognition": [{ module: MODULES.INVOICE, actions: [PERMISSIONS.GENERATE_REPORT] }],

  // Automation sub-items
  "Playbooks": [{ module: MODULES.CLIENT, actions: [PERMISSIONS.EDIT_CLIENT] }],
  "Triggers & Actions": [{ module: MODULES.ORGANIZATION, actions: [PERMISSIONS.EDIT_ORGANIZATION] }],
  "Notification Rules": [{ module: MODULES.ORGANIZATION, actions: [PERMISSIONS.EDIT_ORGANIZATION] }],

  // Integrations sub-items — all admin
  "API Keys & Access": [{ module: MODULES.ORGANIZATION, actions: [PERMISSIONS.EDIT_ORGANIZATION] }],
  "Webhooks": [{ module: MODULES.ORGANIZATION, actions: [PERMISSIONS.EDIT_ORGANIZATION] }],
  "Data Sync Mapping": [{ module: MODULES.ORGANIZATION, actions: [PERMISSIONS.EDIT_ORGANIZATION] }],
  "AI Integrations": [{ module: MODULES.ORGANIZATION, actions: [PERMISSIONS.EDIT_ORGANIZATION] }],

  // Settings sub-items — all admin
  "User Management": [{ module: MODULES.USER, actions: [PERMISSIONS.VIEW_ALL_USERS] }],
  "Roles & Permissions": [{ module: MODULES.ROLE_PERMISSION, actions: [PERMISSIONS.MANAGE_PERMISSIONS] }],
  "Customization": [{ module: MODULES.ORGANIZATION, actions: [PERMISSIONS.EDIT_ORGANIZATION] }],
};

// ─── Dashboard Access Permissions ─────────────────────────────────
// Controls whether a user can access an entire dashboard module
export const DASHBOARD_ACCESS_PERMISSIONS: Record<string, PermissionRequirement[]> = {
  "/hrmcubicle": [
    { module: MODULES.HRM_MANAGEMENT, actions: [PERMISSIONS.VIEW_ALL_EMPLOYEES, PERMISSIONS.VIEW_EMPLOYEE_PROFILE, PERMISSIONS.CREATE_EMPLOYEE] },
    { module: MODULES.EMPLOYEE, actions: [PERMISSIONS.VIEW_ALL_EMPLOYEES, PERMISSIONS.VIEW_EMPLOYEE_PROFILE] },
    { module: MODULES.ATTENDANCE, actions: [PERMISSIONS.MANAGE_ATTENDANCE] },
    { module: MODULES.LEAVE, actions: [PERMISSIONS.MANAGE_EMPLOYE_LEAVE] },
    { module: MODULES.PAYROLL, actions: [PERMISSIONS.MANAGE_PAYROLL, PERMISSIONS.VIEW_PAYSLIPS] },
  ],
  "/lead-management": [
    { module: MODULES.LEAD, actions: [PERMISSIONS.VIEW_LEAD, PERMISSIONS.CREATE_LEAD, PERMISSIONS.EDIT_LEAD] },
  ],
  "/client-management": [
    { module: MODULES.CLIENT, actions: [PERMISSIONS.VIEW_CLIENT_LIST, PERMISSIONS.CREATE_CLIENT, PERMISSIONS.EDIT_CLIENT] },
  ],
  "/projectmanagement": [
    { module: MODULES.PROJECT_MANAGEMENT, actions: [PERMISSIONS.VIEW_PROJECT, PERMISSIONS.VIEW_ALL_PROJECT, PERMISSIONS.CREATE_PROJECT] },
  ],
};

// ─── Page Route Permission Map ─────────────────────────────────────
// Maps route patterns → required permissions for page-level access control
export const PAGE_ROUTE_PERMISSIONS: Record<string, PermissionRequirement[]> = {
  "/modules/crm/leads": [{ module: MODULES.LEAD, actions: [PERMISSIONS.VIEW_LEAD, PERMISSIONS.CREATE_LEAD] }],
  "/modules/crm/deals": [{ module: MODULES.LEAD, actions: [PERMISSIONS.VIEW_LEAD] }, { module: MODULES.CLIENT, actions: [PERMISSIONS.VIEW_CLIENT_LIST] }],
  "/modules/crm/pipeline": [{ module: MODULES.LEAD, actions: [PERMISSIONS.VIEW_LEAD] }],
  "/modules/crm/clients": [{ module: MODULES.CLIENT, actions: [PERMISSIONS.VIEW_CLIENT_LIST, PERMISSIONS.CREATE_CLIENT] }],
  "/modules/crm/contacts": [{ module: MODULES.CLIENT, actions: [PERMISSIONS.VIEW_CLIENT_LIST] }],
  "/modules/crm/activities": [{ module: MODULES.LEAD, actions: [PERMISSIONS.VIEW_LEAD] }, { module: MODULES.CLIENT, actions: [PERMISSIONS.VIEW_CLIENT_LIST] }],
  "/modules/crm/campaigns": [{ module: MODULES.LEAD, actions: [PERMISSIONS.VIEW_LEAD] }],

  "/modules/workspaces": [{ module: MODULES.PROJECT_MANAGEMENT, actions: [PERMISSIONS.VIEW_PROJECT, PERMISSIONS.VIEW_ALL_PROJECT] }],
  "/modules/workspaces/tasks": [{ module: MODULES.PROJECT_MANAGEMENT, actions: [PERMISSIONS.VIEW_TASK, PERMISSIONS.VIEW_ALL_TASKS] }],
  "/modules/workspaces/boards": [{ module: MODULES.PROJECT_MANAGEMENT, actions: [PERMISSIONS.VIEW_BOARD, PERMISSIONS.VIEW_ALL_BOARD] }],

  "/modules/hr": [{ module: MODULES.HRM_MANAGEMENT, actions: [PERMISSIONS.VIEW_ALL_EMPLOYEES, PERMISSIONS.VIEW_EMPLOYEE_PROFILE] }],
  "/modules/attendance": [{ module: MODULES.ATTENDANCE, actions: [PERMISSIONS.MANAGE_ATTENDANCE] }, { module: MODULES.HRM_MANAGEMENT, actions: [PERMISSIONS.VIEW_ALL_EMPLOYEES] }],
  "/modules/leave-management": [{ module: MODULES.LEAVE, actions: [PERMISSIONS.MANAGE_EMPLOYE_LEAVE] }],

  "/modules/invoice": [{ module: MODULES.INVOICE, actions: [PERMISSIONS.GENERATE_REPORT] }],

  "/modules/firm-management": [{ module: MODULES.FIRM, actions: [PERMISSIONS.VIEW_FIRM, PERMISSIONS.CREATE_FIRM] }],

  "/modules/users": [{ module: MODULES.USER, actions: [PERMISSIONS.VIEW_ALL_USERS, PERMISSIONS.CREATE_USER] }],
  "/modules/administration/roles": [{ module: MODULES.ROLE_PERMISSION, actions: [PERMISSIONS.VIEW_ROLE, PERMISSIONS.CREATE_ROLE, PERMISSIONS.MANAGE_PERMISSIONS] }],
  "/modules/administration/permissions": [{ module: MODULES.ROLE_PERMISSION, actions: [PERMISSIONS.VIEW_ROLE, PERMISSIONS.MANAGE_PERMISSIONS] }],

  "/modules/organization": [{ module: MODULES.ORGANIZATION, actions: [PERMISSIONS.VIEW_ORG, PERMISSIONS.EDIT_ORGANIZATION] }],

  "/security": [{ module: MODULES.ORGANIZATION, actions: [PERMISSIONS.EDIT_ORGANIZATION, PERMISSIONS.MANAGE_ORG_SESSIONS] }],
  "/audit-logs": [{ module: MODULES.ORGANIZATION, actions: [PERMISSIONS.VIEW_AUDIT_LOGS, PERMISSIONS.MANAGE_AUDIT_LOGS] }],

  "/modules/settings": [{ module: MODULES.ORGANIZATION, actions: [PERMISSIONS.EDIT_ORGANIZATION] }],
};
