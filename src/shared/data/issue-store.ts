import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type IssueStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE" | "BACKLOG" | "TESTING" | "REPORTED" | "TRIAGE" | "REPRODUCED" | "FIXING" | "VERIFIED" | "IDEAS" | "BRIEFING" | "DRAFTING" | "REVIEW" | "PUBLISHED" | "PLANNING" | "BLOCKED" | "COMPLETED"
export type IssuePriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT"
export type IssueType = "TASK" | "BUG" | "STORY" | "EPIC" | "SUBTASK"

export interface IssueHistory {
    field: string
    oldValue: string
    newValue: string
    changedBy: string
    changedAt: string
}

export interface Issue {
    id: string
    projectId: string
    boardId?: string
    title: string
    description: string
    status: IssueStatus
    priority: IssuePriority
    type: IssueType
    assigneeId: string
    assignee?: {
        name: string
        avatar: string
    }
    reporterId: string
    createdAt: string
    updatedAt?: string
    sprintId?: string | null
    epicId?: string | null
    storyPoints?: number
    parentId?: string | null
    dueDate?: string
    startDate?: string
    teamId?: string
    labels?: string[]
    columnOrder?: number // For drag-and-drop ordering within a column
    history?: IssueHistory[]
}

interface IssueStore {
    issues: Issue[]

    // Basic CRUD
    addIssue: (issue: Issue) => void
    updateIssue: (issueId: string, updates: Partial<Issue>) => void
    updateIssueStatus: (issueId: string, newStatus: IssueStatus, userId: string) => void
    deleteIssue: (issueId: string) => void

    // Queries
    getIssues: (filters?: { projectId?: string, sprintId?: string | null, epicId?: string | null }) => Issue[]
    getIssuesByProject: (projectId: string) => Issue[]
    getIssuesBySprint: (sprintId: string) => Issue[]
    getIssuesByEpic: (epicId: string) => Issue[]
    getIssueById: (issueId: string) => Issue | undefined

    // Subtask Management
    getSubTasks: (parentId: string) => Issue[]
    addSubTask: (parentId: string, subtask: Omit<Issue, 'id' | 'type' | 'parentId' | 'createdAt'>) => void
    validateParentTask: (parentId: string, projectId: string) => boolean

    // Reordering & Workflow
    reorderTask: (issueId: string, fromStatus: IssueStatus, toStatus: IssueStatus, newOrder: number, canTransition: (from: string, to: string) => boolean, userId: string) => { success: boolean, error?: string }
    getTasksByColumn: (projectId: string, boardId?: string) => Record<string, Issue[]>
}

const INITIAL_ISSUES: Issue[] = [
    {
        id: "ISSUE-01",
        projectId: "p1",
        title: "Implement Auth Middleware",
        description: "Secure the API routes using JWT verification and role-based access control.",
        status: "DONE",
        priority: "HIGH",
        type: "TASK",
        assigneeId: "u1",
        assignee: {
            name: "John Doe",
            avatar: "https://i.pravatar.cc/150?u=u1"
        },
        reporterId: "u2",
        createdAt: new Date().toISOString(),
        storyPoints: 5,
        sprintId: "sprint-01",
        columnOrder: 0,
        history: []
    },
    {
        id: "ISSUE-02",
        projectId: "p1",
        title: "UI Responsive Review",
        description: "Review dashboard components for mobile and tablet breakpoints.",
        status: "IN_PROGRESS",
        priority: "MEDIUM",
        type: "STORY",
        assigneeId: "u2",
        assignee: {
            name: "Jane Smith",
            avatar: "https://i.pravatar.cc/150?u=u2"
        },
        reporterId: "u1",
        createdAt: new Date().toISOString(),
        storyPoints: 3,
        sprintId: "sprint-01",
        columnOrder: 0,
        history: []
    },
    {
        id: "ISSUE-03",
        projectId: "p1",
        title: "Fix Sidebar Z-Index",
        description: "Sidebar is overlapping with the modal backdrop on certain screen sizes.",
        status: "TODO",
        priority: "URGENT",
        type: "BUG",
        assigneeId: "u1",
        assignee: {
            name: "John Doe",
            avatar: "https://i.pravatar.cc/150?u=u1"
        },
        reporterId: "u3",
        createdAt: new Date().toISOString(),
        storyPoints: 2,
        columnOrder: 0,
        history: []
    },
]

export const useIssueStore = create<IssueStore>()(
    persist(
        (set, get) => ({
            issues: INITIAL_ISSUES,

            addIssue: (issue) => set((state) => ({
                issues: [issue, ...state.issues]
            })),

            updateIssue: (issueId, updates) => set((state) => ({
                issues: state.issues.map(i => i.id === issueId ? { ...i, ...updates, updatedAt: new Date().toISOString() } : i)
            })),

            updateIssueStatus: (issueId, newStatus, userId) => {
                const state = get()
                const issue = state.issues.find(i => i.id === issueId)

                if (!issue) return

                const historyEntry: IssueHistory = {
                    field: "status",
                    oldValue: issue.status,
                    newValue: newStatus,
                    changedBy: userId,
                    changedAt: new Date().toISOString()
                }

                // AUTOMATION ENGINE SIMULATION
                if (newStatus === "DONE" && issue.status !== "DONE") {
                    console.log(`[Automation] Trigger: Issue ${issueId} moved to DONE. Running post-deployment protocols...`)
                }

                set((state) => ({
                    issues: state.issues.map(i =>
                        i.id === issueId
                            ? {
                                ...i,
                                status: newStatus,
                                updatedAt: new Date().toISOString(),
                                history: [...(i.history || []), historyEntry]
                            }
                            : i
                    )
                }))
            },

            deleteIssue: (issueId) => {
                // Also delete all subtasks
                const issue = get().issues.find(i => i.id === issueId)
                if (!issue) return

                set((state) => ({
                    issues: state.issues.filter(i => i.id !== issueId && i.parentId !== issueId)
                }))
            },

            getIssues: (filters = {}) => {
                let issues = get().issues
                if (filters.projectId) issues = issues.filter(i => i.projectId === filters.projectId)
                if (filters.sprintId !== undefined) issues = issues.filter(i => i.sprintId === filters.sprintId)
                if (filters.epicId !== undefined) issues = issues.filter(i => i.epicId === filters.epicId)
                return issues
            },
            getIssuesByProject: (projectId) => get().issues.filter(i => i.projectId === projectId),
            getIssuesBySprint: (sprintId) => get().issues.filter(i => i.sprintId === sprintId),
            getIssuesByEpic: (epicId) => get().issues.filter(i => i.epicId === epicId),
            getIssueById: (issueId) => get().issues.find(i => i.id === issueId),

            // Subtask Management
            getSubTasks: (parentId) => get().issues.filter(i => i.parentId === parentId),

            addSubTask: (parentId, subtaskData) => {
                const parent = get().issues.find(i => i.id === parentId)
                if (!parent) {
                    console.error(`Parent task ${parentId} not found`)
                    return
                }

                const newSubtask: Issue = {
                    ...subtaskData,
                    id: `${parent.id}-SUB-${Date.now()}`,
                    type: "SUBTASK",
                    parentId: parentId,
                    projectId: parent.projectId,
                    createdAt: new Date().toISOString(),
                    columnOrder: 0,
                    history: []
                }

                set((state) => ({
                    issues: [newSubtask, ...state.issues]
                }))
            },

            validateParentTask: (parentId, projectId) => {
                const parent = get().issues.find(i => i.id === parentId)
                return parent !== undefined && parent.projectId === projectId && parent.type !== "SUBTASK"
            },

            // Reordering with Workflow Validation
            reorderTask: (issueId, fromStatus, toStatus, newOrder, canTransition, userId) => {
                const issue = get().issues.find(i => i.id === issueId)
                if (!issue) {
                    return { success: false, error: "Task not found" }
                }

                // Validate workflow transition
                if (fromStatus !== toStatus && !canTransition(fromStatus, toStatus)) {
                    return { success: false, error: `Transition from ${fromStatus} to ${toStatus} is not allowed` }
                }

                const historyEntry: IssueHistory = {
                    field: "status",
                    oldValue: fromStatus,
                    newValue: toStatus,
                    changedBy: userId,
                    changedAt: new Date().toISOString()
                }

                set((state) => ({
                    issues: state.issues.map(i =>
                        i.id === issueId
                            ? {
                                ...i,
                                status: toStatus,
                                columnOrder: newOrder,
                                updatedAt: new Date().toISOString(),
                                history: [...(i.history || []), historyEntry]
                            }
                            : i
                    )
                }))

                return { success: true }
            },

            // Get tasks grouped by column
            getTasksByColumn: (projectId, boardId) => {
                const tasks = get().issues.filter(i =>
                    i.projectId === projectId &&
                    (!boardId || i.boardId === boardId)
                )

                const grouped: Record<string, Issue[]> = {}
                tasks.forEach(task => {
                    if (!grouped[task.status]) {
                        grouped[task.status] = []
                    }
                    grouped[task.status].push(task)
                })

                // Sort by columnOrder within each group
                Object.keys(grouped).forEach(key => {
                    grouped[key].sort((a, b) => (a.columnOrder || 0) - (b.columnOrder || 0))
                })

                return grouped
            }
        }),
        {
            name: 'cubicle-issues-storage',
            skipHydration: true,
        }
    )
)
