import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { axiosInstance as axios } from '@/lib/axios'

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

    // Backend sync
    setIssues: (issues: Issue[]) => void
    loadIssuesByProject: (projectId: string, opts?: { boardId?: string }) => Promise<void>

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
            setIssues: (nextIssues) => set(() => ({ issues: nextIssues })),
            loadIssuesByProject: async (projectId, opts) => {
                const state = get()
                // If we already have issues for this project and a reload isn't forced, keep UX fast.
                if (state.issues.length > 0 && state.issues.some(i => i.projectId === projectId) && !opts?.boardId) {
                    return
                }

                // 1) Find a boardId for this project
                let boardId = opts?.boardId
                if (!boardId) {
                    const boardRes = await axios.get(`/board/${projectId}/all`)
                    const boards = boardRes?.data?.boards ?? []
                    boardId = boards?.[0]?._id ? String(boards[0]._id) : undefined
                }

                if (!boardId) {
                    set(() => ({ issues: [] }))
                    return
                }

                // 2) Fetch tasks for that board
                const tasksRes = await axios.get(`/task/${projectId}/all`, {
                    params: { boardId }
                })

                const backendTasks = tasksRes?.data?.tasks ?? []

                const toIssueStatus = (status: any): IssueStatus => {
                    const upper = String(status ?? "").toUpperCase()
                    // backend stores column keys (snake_case). UI uses same keys in uppercase.
                    return upper as IssueStatus
                }

                const toIssuePriority = (priority: any): Issue['priority'] => {
                    const p = String(priority ?? "").toUpperCase()
                    if (p === 'CRITICAL') return 'URGENT'
                    if (p === 'LOW') return 'LOW'
                    if (p === 'MEDIUM') return 'MEDIUM'
                    if (p === 'HIGH') return 'HIGH'
                    // fallback
                    return 'MEDIUM'
                }

                const toIssueType = (taskType: any, isSub: boolean): Issue['type'] => {
                    if (isSub) return 'SUBTASK'
                    const t = String(taskType ?? '').toLowerCase()
                    if (t === 'bug') return 'BUG'
                    if (t === 'story') return 'STORY'
                    if (t === 'epic') return 'EPIC'
                    if (t === 'task') return 'TASK'
                    return 'TASK'
                }

                const mapped: Issue[] = backendTasks.map((t: any) => {
                    const assigneeObj = t?.assigneeId ?? null
                    const assigneeEmail = assigneeObj?.email ? String(assigneeObj.email) : ''
                    const assigneeName = assigneeObj?.firstName ? String(assigneeObj.firstName) : ''
                    const assigneeAvatar = assigneeObj?.avatar ? String(assigneeObj.avatar) : ''

                    const parentExists = Boolean(t?.parentId)
                    const issueType = toIssueType(t?.type, parentExists)

                    return {
                        id: String(t?._id ?? t?.taskCode ?? `task-${Date.now()}`),
                        projectId: String(t?.projectId ?? projectId),
                        boardId: t?.boardId ? String(t.boardId) : undefined,
                        title: String(t?.name ?? ''),
                        description: String(t?.description ?? ''),
                        status: toIssueStatus(t?.status),
                        priority: toIssuePriority(t?.priority),
                        type: issueType,
                        assigneeId: assigneeEmail,
                        assignee: assigneeEmail
                            ? { name: assigneeName || assigneeEmail, avatar: assigneeAvatar || '' }
                            : undefined,
                        reporterId: '',
                        createdAt: t?.createdAt ? new Date(t.createdAt).toISOString() : new Date().toISOString(),
                        updatedAt: t?.updatedAt ? new Date(t.updatedAt).toISOString() : undefined,
                        sprintId: t?.sprintId ? String(t.sprintId) : undefined,
                        epicId: t?.epicId ? String(t.epicId) : undefined,
                        parentId: parentExists ? (t?.parentId?._id ? String(t.parentId._id) : String(t.parentId)) : undefined,
                        storyPoints: t?.storyPoints ?? undefined,
                        dueDate: t?.dueDate ? new Date(t.dueDate).toISOString() : undefined,
                        startDate: t?.startDate ? new Date(t.startDate).toISOString() : undefined,
                        teamId: t?.assignedTeamId ? String(t.assignedTeamId) : undefined,
                        columnOrder: typeof t?.columnOrder === 'number' ? t.columnOrder : 0,
                        labels: Array.isArray(t?.labels) ? t.labels : undefined,
                        history: []
                    }
                })

                set(() => ({ issues: mapped }))
            },

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
