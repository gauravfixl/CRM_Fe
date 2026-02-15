import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type NotificationType =
    | "TASK_ASSIGNED"
    | "TASK_UPDATED"
    | "TASK_COMMENTED"
    | "MENTION"
    | "PROJECT_INVITE"
    | "SPRINT_STARTED"
    | "SPRINT_COMPLETED"
    | "DEADLINE_APPROACHING"

export interface Notification {
    id: string
    type: NotificationType
    title: string
    message: string

    // Associations
    userId: string
    organizationId: string
    projectId?: string
    taskId?: string

    // Metadata
    isRead: boolean
    actionUrl?: string
    createdAt: string

    // Actor (who triggered the notification)
    actorId?: string
    actorName?: string
    actorAvatar?: string
}

interface NotificationStore {
    notifications: Notification[]

    // Actions
    getNotifications: (userId: string) => Notification[]
    getUnreadCount: (userId: string) => number
    markAsRead: (id: string) => void
    markAllAsRead: (userId: string) => void
    createNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => Notification
    deleteNotification: (id: string) => void
    clearAll: (userId: string) => void
}

const INITIAL_NOTIFICATIONS: Notification[] = [
    {
        id: "notif-1",
        type: "TASK_ASSIGNED",
        title: "New task assigned",
        message: "You have been assigned to 'Implement user authentication'",
        userId: "u1",
        organizationId: "org-1",
        projectId: "p1",
        taskId: "task-1",
        isRead: false,
        actionUrl: "/projectmanagement/projects/p1/board?task=task-1",
        actorId: "u2",
        actorName: "John Doe",
        actorAvatar: "https://i.pravatar.cc/150?u=john",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
        id: "notif-2",
        type: "TASK_COMMENTED",
        title: "New comment on your task",
        message: "Sarah commented on 'Fix login bug'",
        userId: "u1",
        organizationId: "org-1",
        projectId: "p1",
        taskId: "task-2",
        isRead: false,
        actionUrl: "/projectmanagement/projects/p1/board?task=task-2",
        actorId: "u3",
        actorName: "Sarah Smith",
        actorAvatar: "https://i.pravatar.cc/150?u=sarah",
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
    },
    {
        id: "notif-3",
        type: "SPRINT_STARTED",
        title: "Sprint started",
        message: "Sprint 1 has been started",
        userId: "u1",
        organizationId: "org-1",
        projectId: "p1",
        isRead: true,
        actionUrl: "/projectmanagement/projects/p1/sprints/sprint-1",
        actorId: "u2",
        actorName: "John Doe",
        actorAvatar: "https://i.pravatar.cc/150?u=john",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: "notif-4",
        type: "DEADLINE_APPROACHING",
        title: "Deadline approaching",
        message: "Task 'Complete dashboard' is due in 2 days",
        userId: "u1",
        organizationId: "org-1",
        projectId: "p1",
        taskId: "task-3",
        isRead: false,
        actionUrl: "/projectmanagement/projects/p1/board?task=task-3",
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
    }
]

export const useNotificationStore = create<NotificationStore>()(
    persist(
        (set, get) => ({
            notifications: INITIAL_NOTIFICATIONS,

            getNotifications: (userId: string) => {
                return get().notifications
                    .filter(n => n.userId === userId)
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            },

            getUnreadCount: (userId: string) => {
                return get().notifications.filter(n => n.userId === userId && !n.isRead).length
            },

            markAsRead: (id: string) => {
                set((state) => ({
                    notifications: state.notifications.map(n =>
                        n.id === id ? { ...n, isRead: true } : n
                    )
                }))
            },

            markAllAsRead: (userId: string) => {
                set((state) => ({
                    notifications: state.notifications.map(n =>
                        n.userId === userId ? { ...n, isRead: true } : n
                    )
                }))
            },

            createNotification: (notificationData) => {
                const newNotification: Notification = {
                    ...notificationData,
                    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    createdAt: new Date().toISOString(),
                    isRead: false
                }

                set((state) => ({
                    notifications: [newNotification, ...state.notifications]
                }))

                return newNotification
            },

            deleteNotification: (id: string) => {
                set((state) => ({
                    notifications: state.notifications.filter(n => n.id !== id)
                }))
            },

            clearAll: (userId: string) => {
                set((state) => ({
                    notifications: state.notifications.filter(n => n.userId !== userId)
                }))
            }
        }),
        {
            name: 'cubicle-notifications-storage',
            skipHydration: true
        }
    )
)
