import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type AuditEventType =
    | "PROJECT_CREATED" | "PROJECT_UPDATED" | "PROJECT_DELETED"
    | "TASK_CREATED" | "TASK_UPDATED" | "TASK_DELETED" | "TASK_MOVED"
    | "MEMBER_ADDED" | "MEMBER_REMOVED" | "MEMBER_ROLE_CHANGED"
    | "WORKFLOW_UPDATED" | "COLUMN_ADDED" | "COLUMN_UPDATED" | "COLUMN_DELETED"
    | "TEAM_CREATED" | "TEAM_UPDATED" | "TEAM_DELETED"
    | "COMMENT_ADDED" | "COMMENT_DELETED"
    | "DOCUMENT_UPLOADED" | "DOCUMENT_DELETED"

export interface AuditLog {
    id: string
    eventType: AuditEventType
    entityType: "project" | "task" | "member" | "workflow" | "team" | "comment" | "document"
    entityId: string
    entityName?: string
    userId: string
    userName: string
    userAvatar?: string
    timestamp: string
    details: {
        action: string
        changes?: {
            field: string
            oldValue: any
            newValue: any
        }[]
        metadata?: Record<string, any>
    }
    projectId?: string
    workspaceId?: string
    organizationId?: string
}

interface AuditLogsStore {
    logs: AuditLog[]

    // Actions
    addLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void
    getLogs: (filters?: {
        projectId?: string
        workspaceId?: string
        userId?: string
        entityType?: AuditLog['entityType']
        eventType?: AuditEventType
        startDate?: Date
        endDate?: Date
    }) => AuditLog[]
    getRecentLogs: (limit: number, projectId?: string) => AuditLog[]
    getUserActivity: (userId: string, limit?: number) => AuditLog[]
    getEntityHistory: (entityType: string, entityId: string) => AuditLog[]
    clearLogs: (olderThan?: Date) => void
}

const INITIAL_LOGS: AuditLog[] = [
    {
        id: "log-1",
        eventType: "TASK_CREATED",
        entityType: "task",
        entityId: "ISSUE-01",
        entityName: "Implement Auth Middleware",
        userId: "u1",
        userName: "Sahil S.",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        details: {
            action: "Created new task",
            metadata: { priority: "HIGH", type: "TASK" }
        },
        projectId: "p1"
    },
    {
        id: "log-2",
        eventType: "TASK_MOVED",
        entityType: "task",
        entityId: "ISSUE-01",
        entityName: "Implement Auth Middleware",
        userId: "u2",
        userName: "Sarah K.",
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        details: {
            action: "Moved task",
            changes: [
                { field: "status", oldValue: "TODO", newValue: "IN_PROGRESS" }
            ]
        },
        projectId: "p1"
    },
    {
        id: "log-3",
        eventType: "MEMBER_ADDED",
        entityType: "member",
        entityId: "pm-2",
        entityName: "Sarah K.",
        userId: "u1",
        userName: "Sahil S.",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        details: {
            action: "Added member to project",
            metadata: { role: "ProjectMember" }
        },
        projectId: "p1"
    }
]

export const useAuditLogsStore = create<AuditLogsStore>()(
    persist(
        (set, get) => ({
            logs: INITIAL_LOGS,

            addLog: (logData) => {
                const newLog: AuditLog = {
                    ...logData,
                    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    timestamp: new Date().toISOString()
                }

                set((state) => ({
                    logs: [newLog, ...state.logs]
                }))
            },

            getLogs: (filters = {}) => {
                let logs = get().logs

                if (filters.projectId) {
                    logs = logs.filter(log => log.projectId === filters.projectId)
                }
                if (filters.workspaceId) {
                    logs = logs.filter(log => log.workspaceId === filters.workspaceId)
                }
                if (filters.userId) {
                    logs = logs.filter(log => log.userId === filters.userId)
                }
                if (filters.entityType) {
                    logs = logs.filter(log => log.entityType === filters.entityType)
                }
                if (filters.eventType) {
                    logs = logs.filter(log => log.eventType === filters.eventType)
                }
                if (filters.startDate) {
                    logs = logs.filter(log => new Date(log.timestamp) >= filters.startDate!)
                }
                if (filters.endDate) {
                    logs = logs.filter(log => new Date(log.timestamp) <= filters.endDate!)
                }

                return logs.sort((a, b) =>
                    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                )
            },

            getRecentLogs: (limit: number, projectId?: string) => {
                let logs = get().logs

                if (projectId) {
                    logs = logs.filter(log => log.projectId === projectId)
                }

                return logs
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .slice(0, limit)
            },

            getUserActivity: (userId: string, limit = 50) => {
                return get().logs
                    .filter(log => log.userId === userId)
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .slice(0, limit)
            },

            getEntityHistory: (entityType: string, entityId: string) => {
                return get().logs
                    .filter(log => log.entityType === entityType && log.entityId === entityId)
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            },

            clearLogs: (olderThan?: Date) => {
                if (olderThan) {
                    set((state) => ({
                        logs: state.logs.filter(log => new Date(log.timestamp) >= olderThan)
                    }))
                } else {
                    set({ logs: [] })
                }
            }
        }),
        {
            name: 'cubicle-audit-logs-storage',
            skipHydration: true
        }
    )
)

// Helper function to create audit logs
export const createAuditLog = (
    eventType: AuditEventType,
    entityType: AuditLog['entityType'],
    entityId: string,
    userId: string,
    userName: string,
    action: string,
    options?: {
        entityName?: string
        changes?: AuditLog['details']['changes']
        metadata?: Record<string, any>
        projectId?: string
        workspaceId?: string
    }
) => {
    const { addLog } = useAuditLogsStore.getState()

    addLog({
        eventType,
        entityType,
        entityId,
        entityName: options?.entityName,
        userId,
        userName,
        details: {
            action,
            changes: options?.changes,
            metadata: options?.metadata
        },
        projectId: options?.projectId,
        workspaceId: options?.workspaceId
    })
}
