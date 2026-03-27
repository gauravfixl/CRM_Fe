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
