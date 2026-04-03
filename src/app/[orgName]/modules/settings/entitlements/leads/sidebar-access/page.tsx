"use client"

import { SidebarAccessConfig, type SidebarSection, type SidebarVisibilityConfig } from "@/shared/components/custom/SidebarAccessConfig"

const LEAD_SIDEBAR_SECTIONS: SidebarSection[] = [
    { id: "overview", title: "Overview", icon: "\u{1F4CA}", children: [] },
    {
        id: "lead-inbox", title: "Lead Inbox", icon: "\u{1F4E5}",
        children: [
            { id: "new", title: "New" },
            { id: "unassigned", title: "Unassigned" },
            { id: "pending-response", title: "Pending Response" },
            { id: "at-risk", title: "At Risk" },
            { id: "inactive", title: "Inactive" },
            { id: "high-value", title: "High Value" },
            { id: "reopened", title: "Reopened" },
        ]
    },
    {
        id: "leads", title: "Leads", icon: "\u{1F465}",
        children: [
            { id: "all", title: "All" },
            { id: "active", title: "Active" },
            { id: "converted", title: "Converted" },
            { id: "lost", title: "Lost" },
            { id: "archived", title: "Archived" },
            { id: "saved-views", title: "Saved Views" },
        ]
    },
    {
        id: "pipeline", title: "Pipeline", icon: "\u{1F500}",
        children: [
            { id: "board-view", title: "Board View" },
            { id: "funnel-view", title: "Funnel View" },
            { id: "stage-performance", title: "Stage Performance" },
            { id: "aging-analysis", title: "Aging Analysis" },
            { id: "conversion-trends", title: "Conversion Trends" },
            { id: "forecast", title: "Forecast" },
        ]
    },
    {
        id: "activities", title: "Activities", icon: "\u{1F4C5}",
        children: [
            { id: "all-activities", title: "All Activities" },
            { id: "tasks", title: "Tasks" },
            { id: "calls", title: "Calls" },
            { id: "meetings", title: "Meetings" },
            { id: "emails", title: "Emails" },
            { id: "overdue", title: "Overdue" },
            { id: "upcoming", title: "Upcoming" },
        ]
    },
    {
        id: "qualification", title: "Qualification & Scoring", icon: "\u{1F3AF}",
        children: [
            { id: "framework", title: "Qualification Framework" },
            { id: "scoring-rules", title: "Scoring Rules" },
            { id: "behavioral-scoring", title: "Behavioral Scoring" },
            { id: "thresholds", title: "Score Thresholds (MQL/SQL)" },
            { id: "distribution", title: "Score Distribution" },
            { id: "insights", title: "Qualification Insights" },
            { id: "score-history", title: "Score History (Audit)" },
        ]
    },
    {
        id: "routing-sla", title: "Routing & SLA", icon: "\u{1F6E4}\uFE0F",
        children: [
            { id: "routing-rules", title: "Routing Rules" },
            { id: "assignment-methods", title: "Assignment Methods" },
            { id: "queues", title: "Queues / Pools" },
            { id: "escalation", title: "Reassignment & Escalation" },
            { id: "sla-policies", title: "SLA Policies" },
            { id: "sla-monitoring", title: "SLA Monitoring" },
            { id: "breach-log", title: "Breach Log" },
            { id: "business-hours", title: "Business Hours & Calendars" },
            { id: "routing-audit", title: "Routing Audit (History)" },
        ]
    },
    {
        id: "automation", title: "Automation", icon: "\u{26A1}",
        children: [
            { id: "workflows", title: "Workflows" },
            { id: "triggers", title: "Triggers" },
            { id: "actions-library", title: "Actions Library" },
            { id: "nurture-sequences", title: "Nurture Sequences" },
            { id: "stage-automation", title: "Stage Automation" },
            { id: "sla-automation", title: "SLA Automation" },
            { id: "auto-templates", title: "Templates" },
            { id: "workflow-logs", title: "Workflow Logs" },
            { id: "automation-settings", title: "Automation Settings" },
        ]
    },
    {
        id: "campaigns", title: "Campaigns & Sources", icon: "\u{1F4E3}",
        children: [
            { id: "campaigns-list", title: "Campaigns" },
            { id: "sources", title: "Sources" },
            { id: "utm-tracking", title: "UTM Tracking" },
            { id: "lead-attribution", title: "Lead Attribution" },
            { id: "cost-roi", title: "Cost & ROI" },
            { id: "source-quality", title: "Source Quality" },
            { id: "campaign-performance", title: "Campaign Performance" },
            { id: "tracking-settings", title: "Tracking Settings" },
        ]
    },
    {
        id: "reports", title: "Reports & Analytics", icon: "\u{1F4C8}",
        children: [
            { id: "executive-dashboard", title: "Executive Dashboard" },
            { id: "lead-reports", title: "Lead Reports" },
            { id: "funnel-conversion", title: "Funnel & Conversion" },
            { id: "source-campaign", title: "Source & Campaign" },
            { id: "activity-reports", title: "Activity Reports" },
            { id: "sla-reports", title: "SLA Reports" },
            { id: "qualification-reports", title: "Qualification Reports" },
            { id: "aging-bottlenecks", title: "Aging & Bottlenecks" },
            { id: "automation-reports", title: "Automation Reports" },
            { id: "custom-reports", title: "Custom Reports" },
            { id: "scheduled-reports", title: "Scheduled Reports" },
        ]
    },
    {
        id: "integrations", title: "Integrations", icon: "\u{1F50C}",
        children: [
            { id: "lead-capture", title: "Lead Capture" },
            { id: "marketing-platforms", title: "Marketing Platforms" },
            { id: "communication-channels", title: "Communication Channels" },
            { id: "crm-data-sync", title: "CRM & Data Sync" },
            { id: "ad-platforms", title: "Ad Platforms" },
            { id: "api-webhooks", title: "API & Webhooks" },
            { id: "tracking-pixels", title: "Tracking & Pixels" },
            { id: "marketplace", title: "Marketplace" },
            { id: "integration-logs", title: "Integration Logs" },
        ]
    },
    {
        id: "settings", title: "Settings", icon: "\u{2699}\uFE0F",
        children: [
            { id: "org-preferences", title: "Organization & Preferences" },
            { id: "users-access", title: "Users & Access" },
            { id: "lifecycle-setup", title: "Lead Lifecycle Setup" },
            { id: "fields-data-model", title: "Fields & Data Model" },
            { id: "statuses-tags", title: "Statuses, Tags & Reasons" },
            { id: "templates-content", title: "Templates & Content" },
            { id: "lead-notifications", title: "Notifications" },
            { id: "data-management", title: "Data Management" },
            { id: "lead-security", title: "Security" },
            { id: "audit-compliance", title: "Audit & Compliance" },
            { id: "system-health", title: "System Health" },
            { id: "billing-plan", title: "Billing & Plan" },
        ]
    },
]

function allVisible(): SidebarVisibilityConfig {
    const config: SidebarVisibilityConfig = {}
    LEAD_SIDEBAR_SECTIONS.forEach(section => {
        config[section.id] = { visible: true, children: {} }
        section.children.forEach(child => { config[section.id].children[child.id] = true })
    })
    return config
}

function allHidden(): SidebarVisibilityConfig {
    const config: SidebarVisibilityConfig = {}
    LEAD_SIDEBAR_SECTIONS.forEach(section => {
        config[section.id] = { visible: false, children: {} }
        section.children.forEach(child => { config[section.id].children[child.id] = false })
    })
    return config
}

const DEFAULT_CONFIGS: Record<string, SidebarVisibilityConfig> = {
    "Sales Manager": (() => {
        const c = allVisible()
        c["settings"] = { visible: false, children: {} }
        return c
    })(),
    "Sales Rep": (() => {
        const c = allHidden()
        c["overview"] = { visible: true, children: {} }
        c["lead-inbox"] = { visible: true, children: {} }
        LEAD_SIDEBAR_SECTIONS.find(s => s.id === "lead-inbox")?.children.forEach(child => {
            c["lead-inbox"].children[child.id] = true
        })
        c["leads"] = { visible: true, children: {} }
        LEAD_SIDEBAR_SECTIONS.find(s => s.id === "leads")?.children.forEach(child => {
            c["leads"].children[child.id] = true
        })
        c["pipeline"] = { visible: true, children: {} }
        LEAD_SIDEBAR_SECTIONS.find(s => s.id === "pipeline")?.children.forEach(child => {
            c["pipeline"].children[child.id] = true
        })
        c["activities"] = { visible: true, children: {} }
        LEAD_SIDEBAR_SECTIONS.find(s => s.id === "activities")?.children.forEach(child => {
            c["activities"].children[child.id] = true
        })
        c["campaigns"] = { visible: true, children: {} }
        c["campaigns"].children["campaigns-list"] = true
        c["campaigns"].children["sources"] = true
        return c
    })(),
    "default": allVisible(),
}

export default function LeadSidebarAccessPage() {
    return (
        <SidebarAccessConfig
            moduleName="Lead Management"
            moduleDescription="Control which Lead Management sidebar sections and items are visible for each role."
            accentColor="blue"
            sections={LEAD_SIDEBAR_SECTIONS}
            defaultConfigs={DEFAULT_CONFIGS}
        />
    )
}
