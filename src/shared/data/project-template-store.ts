import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type BoardType = "kanban" | "scrum" | "custom"
export type TemplateCategory = "software" | "marketing" | "design" | "hr" | "sales" | "general"

export interface TemplateColumn {
    name: string
    key: string
    order: number
    color?: string
}

export interface TemplateState {
    name: string
    key: string
    order: number
    color?: string
}

export interface TemplateTransition {
    from: string
    to: string
}

export interface TemplateTask {
    name: string
    description?: string
    type: "TASK" | "BUG" | "STORY"
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
    status: string
}

export interface ProjectTemplate {
    id: string
    name: string
    description: string
    boardType: BoardType
    category: TemplateCategory
    recommended: boolean
    isSystem: boolean

    // Template structure
    columns: TemplateColumn[]
    workflowStates: TemplateState[]
    workflowTransitions: TemplateTransition[]
    defaultTasks?: TemplateTask[]

    // Metadata
    previewImage?: string
    createdBy: string
    creatorName: string
    createdAt: string
    updatedAt?: string
    version: number

    // Organization
    organizationId?: string

    // Status
    isDeleted: boolean
}

interface ProjectTemplateStore {
    templates: ProjectTemplate[]

    // Actions
    listTemplates: (filters?: {
        category?: TemplateCategory
        recommended?: boolean
        organizationId?: string
    }) => { system: ProjectTemplate[], organization: ProjectTemplate[] }
    getTemplate: (id: string) => ProjectTemplate | undefined
    createTemplate: (template: Omit<ProjectTemplate, 'id' | 'createdAt' | 'version' | 'isDeleted'>) => ProjectTemplate
    updateTemplate: (id: string, updates: Partial<ProjectTemplate>) => ProjectTemplate | null
    deleteTemplate: (id: string) => boolean
    duplicateTemplate: (id: string, newName: string) => ProjectTemplate | null
}

const INITIAL_TEMPLATES: ProjectTemplate[] = [
    {
        id: "tpl-1",
        name: "Software Development",
        description: "Standard agile software development workflow",
        boardType: "scrum",
        category: "software",
        recommended: true,
        isSystem: true,
        columns: [
            { name: "Backlog", key: "BACKLOG", order: 0, color: "#94a3b8" },
            { name: "To Do", key: "TODO", order: 1, color: "#3b82f6" },
            { name: "In Progress", key: "IN_PROGRESS", order: 2, color: "#f59e0b" },
            { name: "In Review", key: "IN_REVIEW", order: 3, color: "#8b5cf6" },
            { name: "Testing", key: "TESTING", order: 4, color: "#ec4899" },
            { name: "Done", key: "DONE", order: 5, color: "#10b981" }
        ],
        workflowStates: [
            { name: "Backlog", key: "BACKLOG", order: 0, color: "#94a3b8" },
            { name: "To Do", key: "TODO", order: 1, color: "#3b82f6" },
            { name: "In Progress", key: "IN_PROGRESS", order: 2, color: "#f59e0b" },
            { name: "In Review", key: "IN_REVIEW", order: 3, color: "#8b5cf6" },
            { name: "Testing", key: "TESTING", order: 4, color: "#ec4899" },
            { name: "Done", key: "DONE", order: 5, color: "#10b981" }
        ],
        workflowTransitions: [
            { from: "BACKLOG", to: "TODO" },
            { from: "TODO", to: "IN_PROGRESS" },
            { from: "IN_PROGRESS", to: "IN_REVIEW" },
            { from: "IN_REVIEW", to: "TESTING" },
            { from: "IN_REVIEW", to: "IN_PROGRESS" },
            { from: "TESTING", to: "DONE" },
            { from: "TESTING", to: "IN_PROGRESS" }
        ],
        defaultTasks: [
            {
                name: "Setup project repository",
                description: "Initialize Git repository and setup CI/CD",
                type: "TASK",
                priority: "HIGH",
                status: "TODO"
            },
            {
                name: "Create project documentation",
                description: "Write README and setup docs",
                type: "TASK",
                priority: "MEDIUM",
                status: "TODO"
            }
        ],
        previewImage: "https://example.com/templates/software-dev.png",
        createdBy: "system",
        creatorName: "System",
        createdAt: new Date("2026-01-01").toISOString(),
        version: 1,
        isDeleted: false
    },
    {
        id: "tpl-2",
        name: "Marketing Campaign",
        description: "Marketing campaign planning and execution",
        boardType: "kanban",
        category: "marketing",
        recommended: true,
        isSystem: true,
        columns: [
            { name: "Ideas", key: "IDEAS", order: 0, color: "#fbbf24" },
            { name: "Planning", key: "PLANNING", order: 1, color: "#3b82f6" },
            { name: "In Progress", key: "IN_PROGRESS", order: 2, color: "#f59e0b" },
            { name: "Review", key: "REVIEW", order: 3, color: "#8b5cf6" },
            { name: "Published", key: "PUBLISHED", order: 4, color: "#10b981" }
        ],
        workflowStates: [
            { name: "Ideas", key: "IDEAS", order: 0, color: "#fbbf24" },
            { name: "Planning", key: "PLANNING", order: 1, color: "#3b82f6" },
            { name: "In Progress", key: "IN_PROGRESS", order: 2, color: "#f59e0b" },
            { name: "Review", key: "REVIEW", order: 3, color: "#8b5cf6" },
            { name: "Published", key: "PUBLISHED", order: 4, color: "#10b981" }
        ],
        workflowTransitions: [
            { from: "IDEAS", to: "PLANNING" },
            { from: "PLANNING", to: "IN_PROGRESS" },
            { from: "IN_PROGRESS", to: "REVIEW" },
            { from: "REVIEW", to: "PUBLISHED" },
            { from: "REVIEW", to: "IN_PROGRESS" }
        ],
        createdBy: "system",
        creatorName: "System",
        createdAt: new Date("2026-01-01").toISOString(),
        version: 1,
        isDeleted: false
    },
    {
        id: "tpl-3",
        name: "Bug Tracking",
        description: "Simple bug tracking workflow",
        boardType: "kanban",
        category: "software",
        recommended: false,
        isSystem: true,
        columns: [
            { name: "Reported", key: "REPORTED", order: 0, color: "#ef4444" },
            { name: "Triage", key: "TRIAGE", order: 1, color: "#f59e0b" },
            { name: "Fixing", key: "FIXING", order: 2, color: "#3b82f6" },
            { name: "Verified", key: "VERIFIED", order: 3, color: "#10b981" }
        ],
        workflowStates: [
            { name: "Reported", key: "REPORTED", order: 0, color: "#ef4444" },
            { name: "Triage", key: "TRIAGE", order: 1, color: "#f59e0b" },
            { name: "Fixing", key: "FIXING", order: 2, color: "#3b82f6" },
            { name: "Verified", key: "VERIFIED", order: 3, color: "#10b981" }
        ],
        workflowTransitions: [
            { from: "REPORTED", to: "TRIAGE" },
            { from: "TRIAGE", to: "FIXING" },
            { from: "FIXING", to: "VERIFIED" }
        ],
        createdBy: "system",
        creatorName: "System",
        createdAt: new Date("2026-01-01").toISOString(),
        version: 1,
        isDeleted: false
    }
]

export const useProjectTemplateStore = create<ProjectTemplateStore>()(
    persist(
        (set, get) => ({
            templates: INITIAL_TEMPLATES,

            listTemplates: (filters = {}) => {
                let allTemplates = get().templates.filter(t => !t.isDeleted)

                if (filters.category) {
                    allTemplates = allTemplates.filter(t => t.category === filters.category)
                }
                if (filters.recommended !== undefined) {
                    allTemplates = allTemplates.filter(t => t.recommended === filters.recommended)
                }

                const system = allTemplates.filter(t => t.isSystem)
                const organization = allTemplates.filter(t =>
                    !t.isSystem &&
                    (!filters.organizationId || t.organizationId === filters.organizationId)
                )

                return { system, organization }
            },

            getTemplate: (id: string) => {
                return get().templates.find(t => t.id === id && !t.isDeleted)
            },

            createTemplate: (templateData) => {
                const newTemplate: ProjectTemplate = {
                    ...templateData,
                    id: `tpl-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    createdAt: new Date().toISOString(),
                    version: 1,
                    isDeleted: false
                }

                set((state) => ({
                    templates: [...state.templates, newTemplate]
                }))

                return newTemplate
            },

            updateTemplate: (id: string, updates) => {
                const template = get().templates.find(t => t.id === id)
                if (!template || template.isDeleted) return null

                // Prevent updating system templates
                if (template.isSystem) {
                    console.error("Cannot update system templates")
                    return null
                }

                const updatedTemplate: ProjectTemplate = {
                    ...template,
                    ...updates,
                    id: template.id, // Preserve ID
                    updatedAt: new Date().toISOString(),
                    version: template.version + 1
                }

                set((state) => ({
                    templates: state.templates.map(t =>
                        t.id === id ? updatedTemplate : t
                    )
                }))

                return updatedTemplate
            },

            deleteTemplate: (id: string) => {
                const template = get().templates.find(t => t.id === id)
                if (!template) return false

                // Prevent deleting system templates
                if (template.isSystem) {
                    console.error("Cannot delete system templates")
                    return false
                }

                set((state) => ({
                    templates: state.templates.map(t =>
                        t.id === id ? { ...t, isDeleted: true } : t
                    )
                }))

                return true
            },

            duplicateTemplate: (id: string, newName: string) => {
                const template = get().templates.find(t => t.id === id && !t.isDeleted)
                if (!template) return null

                const duplicated: ProjectTemplate = {
                    ...template,
                    id: `tpl-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    name: newName,
                    isSystem: false, // Duplicates are never system templates
                    createdAt: new Date().toISOString(),
                    updatedAt: undefined,
                    version: 1
                }

                set((state) => ({
                    templates: [...state.templates, duplicated]
                }))

                return duplicated
            }
        }),
        {
            name: 'cubicle-project-templates-storage',
            skipHydration: true
        }
    )
)
