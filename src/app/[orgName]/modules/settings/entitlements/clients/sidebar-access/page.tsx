"use client"

import { SidebarAccessConfig, type SidebarSection, type SidebarVisibilityConfig } from "@/shared/components/custom/SidebarAccessConfig"

const CLIENT_SIDEBAR_SECTIONS: SidebarSection[] = [
    { id: "overview", title: "Overview", icon: "\u{1F4CA}", children: [] },
    {
        id: "revenue", title: "Revenue", icon: "\u{1F4B0}",
        children: [
            { id: "rev-overview", title: "Overview" },
            { id: "opportunities", title: "Opportunities" },
            { id: "renewals", title: "Renewals" },
            { id: "expansion", title: "Expansion" },
        ]
    },
    {
        id: "subscriptions", title: "Subscriptions", icon: "\u{1F4B3}",
        children: [
            { id: "sub-overview", title: "Overview" },
            { id: "plans-pricing", title: "Plans & Pricing" },
            { id: "active-subscriptions", title: "Active Subscriptions" },
            { id: "usage-billing", title: "Usage Billing" },
            { id: "contracts", title: "Contracts" },
            { id: "invoices-payments", title: "Invoices & Payments" },
        ]
    },
    {
        id: "customers", title: "Customers", icon: "\u{1F465}",
        children: [
            { id: "account-overview", title: "Account Overview" },
            { id: "contacts-key-people", title: "Contacts & Key People" },
            { id: "onboarding-stage", title: "Onboarding Stage" },
            { id: "client-health", title: "Client Health" },
            { id: "customer-journey", title: "Customer Journey" },
            { id: "feedback-nps", title: "Feedback & NPS" },
        ]
    },
    {
        id: "communication", title: "Communication", icon: "\u{1F4AC}",
        children: [
            { id: "email-center", title: "Email Center" },
            { id: "sms-notifications", title: "SMS & Notifications" },
            { id: "comm-templates", title: "Templates" },
            { id: "comm-history", title: "Communication History" },
            { id: "comm-campaigns", title: "Campaigns" },
            { id: "broadcast", title: "Broadcast Messages" },
        ]
    },
    {
        id: "support", title: "Support", icon: "\u{1F3A7}",
        children: [
            { id: "support-overview", title: "Overview" },
            { id: "tickets", title: "Tickets" },
            { id: "sla-management", title: "SLA Management" },
            { id: "escalations", title: "Escalations" },
            { id: "knowledge-base", title: "Knowledge Base" },
        ]
    },
    {
        id: "analytics", title: "Analytics", icon: "\u{1F4C8}",
        children: [
            { id: "revenue-mrr", title: "Revenue & MRR" },
            { id: "retention-churn", title: "Retention & Churn" },
            { id: "cohort-analysis", title: "Cohort Analysis" },
            { id: "forecasting", title: "Forecasting" },
            { id: "ai-insights", title: "AI Insights" },
        ]
    },
    {
        id: "reports", title: "Reports", icon: "\u{1F4C9}",
        children: [
            { id: "executive-dashboard", title: "Executive Dashboard" },
            { id: "financial-reports", title: "Financial Reports" },
            { id: "client-reports", title: "Client Reports" },
            { id: "performance-reports", title: "Performance Reports" },
            { id: "custom-reports", title: "Custom Reports" },
            { id: "scheduled-reports", title: "Scheduled Reports" },
        ]
    },
    {
        id: "finance", title: "Finance", icon: "\u{1F3E6}",
        children: [
            { id: "fin-overview", title: "Overview" },
            { id: "accounting", title: "Accounting" },
            { id: "expenses", title: "Expenses" },
            { id: "tax-module", title: "Tax Module" },
            { id: "fin-reports", title: "Financial Reports" },
            { id: "revenue-recognition", title: "Revenue Recognition" },
        ]
    },
    {
        id: "automation", title: "Automation", icon: "\u{26A1}",
        children: [
            { id: "auto-workflows", title: "Workflows" },
            { id: "playbooks", title: "Playbooks" },
            { id: "triggers-actions", title: "Triggers & Actions" },
            { id: "notification-rules", title: "Notification Rules" },
        ]
    },
    {
        id: "integrations", title: "Integrations", icon: "\u{1F50C}",
        children: [
            { id: "crm-sync", title: "CRM Sync" },
            { id: "billing-gateways", title: "Billing Gateways" },
            { id: "support-tools", title: "Support Tools" },
            { id: "api-keys", title: "API Keys & Access" },
            { id: "webhooks", title: "Webhooks" },
            { id: "data-sync", title: "Data Sync Mapping" },
            { id: "ai-integrations", title: "AI Integrations" },
            { id: "int-marketplace", title: "Marketplace" },
        ]
    },
    {
        id: "settings", title: "Settings", icon: "\u{2699}\uFE0F",
        children: [
            { id: "user-management", title: "User Management" },
            { id: "roles-permissions", title: "Roles & Permissions" },
            { id: "customization", title: "Customization" },
        ]
    },
]

function allVisible(): SidebarVisibilityConfig {
    const config: SidebarVisibilityConfig = {}
    CLIENT_SIDEBAR_SECTIONS.forEach(section => {
        config[section.id] = { visible: true, children: {} }
        section.children.forEach(child => { config[section.id].children[child.id] = true })
    })
    return config
}

function allHidden(): SidebarVisibilityConfig {
    const config: SidebarVisibilityConfig = {}
    CLIENT_SIDEBAR_SECTIONS.forEach(section => {
        config[section.id] = { visible: false, children: {} }
        section.children.forEach(child => { config[section.id].children[child.id] = false })
    })
    return config
}

const DEFAULT_CONFIGS: Record<string, SidebarVisibilityConfig> = {
    "Account Manager": (() => {
        const c = allVisible()
        c["finance"] = { visible: false, children: {} }
        c["integrations"] = { visible: false, children: {} }
        c["settings"] = { visible: false, children: {} }
        return c
    })(),
    "Support Agent": (() => {
        const c = allHidden()
        c["overview"] = { visible: true, children: {} }
        c["customers"] = { visible: true, children: {} }
        CLIENT_SIDEBAR_SECTIONS.find(s => s.id === "customers")?.children.forEach(child => {
            c["customers"].children[child.id] = true
        })
        c["communication"] = { visible: true, children: {} }
        CLIENT_SIDEBAR_SECTIONS.find(s => s.id === "communication")?.children.forEach(child => {
            c["communication"].children[child.id] = true
        })
        c["support"] = { visible: true, children: {} }
        CLIENT_SIDEBAR_SECTIONS.find(s => s.id === "support")?.children.forEach(child => {
            c["support"].children[child.id] = true
        })
        return c
    })(),
    "default": allVisible(),
}

export default function ClientSidebarAccessPage() {
    return (
        <SidebarAccessConfig
            moduleName="Client Management"
            moduleDescription="Control which Client Management sidebar sections and items are visible for each role."
            accentColor="emerald"
            sections={CLIENT_SIDEBAR_SECTIONS}
            defaultConfigs={DEFAULT_CONFIGS}
        />
    )
}
