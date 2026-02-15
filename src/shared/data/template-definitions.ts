
export interface TemplateDefinition {
    id: string
    title: string
    description: string
    color: string
    type: "software" | "marketing" | "business"
    iconType: string // Store string identifier for icon component
    columns: Array<{
        name: string
        key: string
        color: string
        limit?: string
    }>
    transitions?: Array<{
        from: string
        to: string
    }>
}

export const TEMPLATE_DEFINITIONS: Record<string, TemplateDefinition> = {
    kanban: {
        id: "kanban",
        title: "Kanban",
        description: "Monitor work in a continuous flow. Best for DevOps and Support.",
        color: "text-blue-600 bg-blue-50",
        type: "software",
        iconType: "Trello",
        columns: [
            { name: "To Do", key: "TODO", color: "#64748b", limit: "MAX 10" },
            { name: "In Progress", key: "IN_PROGRESS", color: "#6366f1", limit: "MAX 5" },
            { name: "In Review", key: "IN_REVIEW", color: "#8b5cf6" },
            { name: "Done", key: "DONE", color: "#10b981" }
        ]
    },
    scrum: {
        id: "scrum",
        title: "Scrum",
        description: "Work in sprints to deliver iterative value. Best for Engineering.",
        color: "text-indigo-600 bg-indigo-50",
        type: "software",
        iconType: "Layers",
        columns: [
            { name: "Backlog", key: "BACKLOG", color: "#94a3b8" },
            { name: "To Do", key: "TODO", color: "#64748b" },
            { name: "In Progress", key: "IN_PROGRESS", color: "#6366f1" },
            { name: "Testing", key: "TESTING", color: "#f59e0b" },
            { name: "Done", key: "DONE", color: "#10b981" }
        ]
    },
    bug: {
        id: "bug",
        title: "Bug Tracking",
        description: "Specifically tuned for high-volume issue management.",
        color: "text-rose-600 bg-rose-50",
        type: "software",
        iconType: "Target",
        columns: [
            { name: "Reported", key: "REPORTED", color: "#f43f5e" },
            { name: "In Triage", key: "TRIAGE", color: "#f59e0b" },
            { name: "Reproduced", key: "REPRODUCED", color: "#d946ef" },
            { name: "Fixing", key: "FIXING", color: "#6366f1" },
            { name: "Verified", key: "VERIFIED", color: "#10b981" }
        ]
    },
    marketing: {
        id: "marketing",
        title: "Content Strategy",
        description: "Plan campaigns and manage creative assets.",
        color: "text-amber-600 bg-amber-50",
        type: "marketing",
        iconType: "Briefcase",
        columns: [
            { name: "Ideas", key: "IDEAS", color: "#f59e0b" },
            { name: "Briefing", key: "BRIEFING", color: "#8b5cf6" },
            { name: "Drafting", key: "DRAFTING", color: "#3b82f6" },
            { name: "Review", key: "REVIEW", color: "#ec4899" },
            { name: "Published", key: "PUBLISHED", color: "#10b981" }
        ]
    },
    "project-mgmt": {
        id: "project-mgmt",
        title: "General Management",
        description: "Simple task tracking for any business team.",
        color: "text-emerald-600 bg-emerald-50",
        type: "business",
        iconType: "Layout",
        columns: [
            { name: "Planning", key: "PLANNING", color: "#64748b" },
            { name: "In Progress", key: "IN_PROGRESS", color: "#3b82f6" },
            { name: "Blocked", key: "BLOCKED", color: "#ef4444" },
            { name: "Completed", key: "COMPLETED", color: "#10b981" }
        ]
    }
}
