"use client"

import { SidebarAccessConfig, type SidebarSection, type SidebarVisibilityConfig } from "@/shared/components/custom/SidebarAccessConfig"

const HRM_SIDEBAR_SECTIONS: SidebarSection[] = [
    {
        id: "home", title: "Home", icon: "\u{1F3E0}",
        children: []
    },
    {
        id: "me", title: "Me", icon: "\u{1F464}",
        children: [
            { id: "my-profile", title: "My Profile" },
            { id: "my-attendance", title: "My Attendance" },
            { id: "my-leave", title: "My Leave" },
            { id: "my-finances", title: "My Finances" },
            { id: "my-performance", title: "My Performance" },
            { id: "my-documents", title: "My Documents" },
            { id: "my-assets", title: "My Assets" },
        ]
    },
    {
        id: "inbox", title: "Inbox", icon: "\u{1F4E5}",
        children: [
            { id: "approvals", title: "Approvals" },
            { id: "notifications", title: "Notifications" },
            { id: "requests", title: "Requests" },
        ]
    },
    {
        id: "my-team", title: "My Team", icon: "\u{1F465}",
        children: [
            { id: "team-overview", title: "Team Overview" },
            { id: "team-members", title: "Team Members" },
            { id: "team-attendance", title: "Team Attendance" },
            { id: "team-leave", title: "Team Leave" },
            { id: "team-requests", title: "Team Requests" },
            { id: "team-performance", title: "Team Performance" },
            { id: "team-calendar", title: "Team Calendar" },
            { id: "on-offboarding", title: "On/Offboarding" },
            { id: "team-documents", title: "Team Documents" },
            { id: "team-reports", title: "Team Reports" },
        ]
    },
    {
        id: "organization", title: "Organization", icon: "\u{1F3E2}",
        children: [
            { id: "org-dashboard", title: "Org Dashboard" },
            { id: "company-profile", title: "Company Profile" },
            { id: "employees", title: "Employees" },
            { id: "departments", title: "Departments" },
            { id: "designations", title: "Designations" },
            { id: "locations", title: "Locations" },
            { id: "holidays", title: "Holidays" },
            { id: "policy-center", title: "Policy Center" },
            { id: "teams-workhub", title: "Teams Workhub" },
            { id: "org-chart", title: "Org Chart" },
        ]
    },
    {
        id: "hire", title: "Hire", icon: "\u{1F680}",
        children: [
            { id: "job-openings", title: "Job Openings" },
            { id: "candidates", title: "Candidates" },
            { id: "interviews", title: "Interviews" },
            { id: "offer-letters", title: "Offer Letters" },
            { id: "hiring-reports", title: "Hiring Reports" },
            { id: "career-page", title: "Career Page" },
            { id: "referrals", title: "Referrals" },
            { id: "resume-parser", title: "Resume Parser" },
            { id: "scorecards", title: "Scorecards" },
        ]
    },
    {
        id: "lifecycle", title: "Lifecycle", icon: "\u{1F393}",
        children: [
            { id: "pre-onboarding", title: "Pre-Onboarding" },
            { id: "onboarding", title: "Onboarding" },
            { id: "asset-allocation", title: "Asset Allocation" },
            { id: "lifecycle-actions", title: "Lifecycle Actions" },
            { id: "probation", title: "Probation Management" },
            { id: "compliance", title: "Compliance & Policies" },
            { id: "exit-management", title: "Exit Management" },
            { id: "clearance", title: "Clearance Checklist" },
            { id: "settlement", title: "Full & Final Settlement" },
            { id: "history", title: "Employee History" },
        ]
    },
    {
        id: "time-attend", title: "Time & Attend", icon: "\u{23F1}\uFE0F",
        children: [
            { id: "ta-dashboard", title: "Dashboard" },
            { id: "attendance-tracking", title: "Attendance Tracking" },
            { id: "shifts-holidays", title: "Shifts & Holidays" },
            { id: "overtime", title: "Overtime" },
            { id: "leave", title: "Leave" },
            { id: "shift-allowance", title: "Shift Allowance" },
            { id: "ta-approvals", title: "Approvals" },
            { id: "ta-reports", title: "Reports" },
            { id: "ta-settings", title: "Settings" },
            { id: "geofencing", title: "Geo-fencing" },
            { id: "biometric", title: "Biometric" },
            { id: "comp-off", title: "Comp-Off" },
            { id: "optional-holidays", title: "Optional Holidays" },
            { id: "sandwich-rules", title: "Sandwich Rules" },
        ]
    },
    {
        id: "payroll", title: "Payroll", icon: "\u{1F4B0}",
        children: [
            { id: "payroll-dashboard", title: "Payroll Dashboard" },
            { id: "salary-processing", title: "Salary Processing" },
            { id: "payslips", title: "Payslips" },
            { id: "reimbursements", title: "Reimbursements" },
            { id: "tax-declarations", title: "Tax Declarations" },
            { id: "proof-submission", title: "Proof Submission" },
            { id: "payroll-reports", title: "Payroll Reports" },
            { id: "payroll-settings", title: "Payroll Settings" },
            { id: "salary-structure", title: "Salary Structure" },
            { id: "statutory-compliance", title: "Statutory Compliance" },
            { id: "loans-advances", title: "Loans & Advances" },
            { id: "salary-revision", title: "Salary Revision" },
            { id: "multi-entity", title: "Multi-Entity" },
        ]
    },
    {
        id: "performance", title: "Performance", icon: "\u{1F4CA}",
        children: [
            { id: "goals-okrs", title: "Goals / OKRs" },
            { id: "appraisals", title: "Appraisals" },
            { id: "reviews", title: "Reviews" },
            { id: "feedback", title: "Feedback" },
            { id: "performance-reports", title: "Performance Reports" },
            { id: "calibration", title: "Calibration" },
            { id: "pip-tracking", title: "PIP Tracking" },
            { id: "compensation-review", title: "Compensation Review" },
        ]
    },
    {
        id: "documents", title: "Documents", icon: "\u{1F4DA}",
        children: [
            { id: "company-policies", title: "Company Policies" },
            { id: "hr-documents", title: "HR Documents" },
            { id: "letters", title: "Letters" },
            { id: "templates", title: "Templates" },
            { id: "acknowledgements", title: "Acknowledgements" },
            { id: "e-signatures", title: "E-Signatures" },
            { id: "bulk-letters", title: "Bulk Letters" },
        ]
    },
    {
        id: "engage", title: "Engage", icon: "\u{2764}\uFE0F",
        children: [
            { id: "announcements", title: "Announcements" },
            { id: "surveys", title: "Surveys" },
            { id: "employee-feedback", title: "Employee Feedback" },
            { id: "rewards", title: "Rewards & Recognition" },
            { id: "events", title: "Events" },
            { id: "celebrations", title: "Celebrations" },
            { id: "social-feed", title: "Social Feed" },
        ]
    },
    {
        id: "helpdesk", title: "Helpdesk", icon: "\u{1F3AB}",
        children: [
            { id: "hd-dashboard", title: "Dashboard" },
            { id: "my-tickets", title: "My Tickets" },
            { id: "support-queue", title: "Support Queue" },
            { id: "knowledge-base", title: "Knowledge Base" },
            { id: "agent-management", title: "Agent Management" },
            { id: "hd-reports", title: "Reports & Analytics" },
            { id: "hd-settings", title: "Settings" },
        ]
    },
    {
        id: "expenses", title: "Expenses", icon: "\u{1F4B3}",
        children: [
            { id: "exp-dashboard", title: "Dashboard" },
            { id: "my-claims", title: "My Claims" },
            { id: "travel", title: "Travel" },
            { id: "exp-approvals", title: "Approvals" },
            { id: "exp-reports", title: "Reports" },
            { id: "exp-settings", title: "Settings" },
        ]
    },
    {
        id: "timesheets", title: "Timesheets", icon: "\u{23F0}",
        children: []
    },
    {
        id: "reports-hub", title: "Reports Hub", icon: "\u{1F4CA}",
        children: [
            { id: "rh-dashboard", title: "Dashboard" },
            { id: "report-builder", title: "Report Builder" },
            { id: "scheduled", title: "Scheduled" },
            { id: "rh-templates", title: "Templates" },
        ]
    },
    {
        id: "admin", title: "Settings", icon: "\u{2699}\uFE0F",
        children: [
            { id: "role-permissions", title: "Role & Permissions" },
            { id: "workflows-approvals", title: "Workflows & Approvals" },
            { id: "automation-rules", title: "Automation & Rules" },
            { id: "attendance-rules", title: "Attendance Rules" },
            { id: "payroll-admin-settings", title: "Payroll Settings" },
            { id: "integrations", title: "Integrations" },
            { id: "audit-logs", title: "Audit Logs" },
            { id: "delegation", title: "Delegation" },
            { id: "escalation-rules", title: "Escalation Rules" },
        ]
    },
]

// Helper to create all-visible config
function allVisible(): SidebarVisibilityConfig {
    const config: SidebarVisibilityConfig = {}
    HRM_SIDEBAR_SECTIONS.forEach(section => {
        config[section.id] = { visible: true, children: {} }
        section.children.forEach(child => {
            config[section.id].children[child.id] = true
        })
    })
    return config
}

// Helper to create all-hidden config
function allHidden(): SidebarVisibilityConfig {
    const config: SidebarVisibilityConfig = {}
    HRM_SIDEBAR_SECTIONS.forEach(section => {
        config[section.id] = { visible: false, children: {} }
        section.children.forEach(child => {
            config[section.id].children[child.id] = false
        })
    })
    return config
}

const DEFAULT_CONFIGS: Record<string, SidebarVisibilityConfig> = {
    "HR Manager": (() => {
        const c = allVisible()
        c["admin"] = { visible: false, children: {} }
        return c
    })(),
    "Employee": (() => {
        const c = allHidden()
        c["home"] = { visible: true, children: {} }
        c["me"] = { visible: true, children: {} }
        HRM_SIDEBAR_SECTIONS.find(s => s.id === "me")?.children.forEach(child => {
            c["me"].children[child.id] = true
        })
        c["inbox"] = { visible: true, children: {} }
        c["inbox"].children["approvals"] = true
        c["inbox"].children["notifications"] = true
        c["engage"] = { visible: true, children: {} }
        c["engage"].children["announcements"] = true
        c["engage"].children["surveys"] = true
        c["engage"].children["celebrations"] = true
        c["helpdesk"] = { visible: true, children: {} }
        c["helpdesk"].children["my-tickets"] = true
        c["expenses"] = { visible: true, children: {} }
        c["expenses"].children["my-claims"] = true
        c["timesheets"] = { visible: true, children: {} }
        c["time-attend"] = { visible: true, children: {} }
        c["time-attend"].children["ta-dashboard"] = true
        c["time-attend"].children["attendance-tracking"] = true
        return c
    })(),
    "default": allVisible(),
}

export default function HRMSidebarAccessPage() {
    return (
        <SidebarAccessConfig
            moduleName="HRM"
            moduleDescription="Control which HRM sidebar sections and items are visible for each role."
            accentColor="indigo"
            sections={HRM_SIDEBAR_SECTIONS}
            defaultConfigs={DEFAULT_CONFIGS}
        />
    )
}
