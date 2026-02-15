import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Comment {
    id: string
    taskId: string
    userId: string
    userName: string
    userAvatar?: string
    text: string
    createdAt: string
    updatedAt?: string
    parentId?: string // Support for threaded replies
}

export type ActivityType = "STATUS_CHANGE" | "EDIT" | "COMMENT_ADD" | "COMMENT_DELETE" | "PRIORITY_CHANGE" | "ASSIGNEE_CHANGE"

export interface Activity {
    id: string
    taskId: string
    userId: string
    userName: string
    type: ActivityType
    detail: string
    createdAt: string
}

interface CollaborationStore {
    comments: Comment[]
    activities: Activity[]

    // Comments Actions
    addComment: (taskId: string, text: string, user: { id: string, name: string, avatar?: string }) => void
    addReply: (taskId: string, parentId: string, text: string, user: { id: string, name: string, avatar?: string }) => void
    editComment: (commentId: string, newText: string) => void
    deleteComment: (commentId: string) => void
    getCommentsByTask: (taskId: string) => Comment[]

    // Activities Actions
    addActivity: (taskId: string, type: ActivityType, detail: string, user: { id: string, name: string }) => void
    getActivitiesByTask: (taskId: string) => Activity[]
}

export const useCollaborationStore = create<CollaborationStore>()(
    persist(
        (set, get) => ({
            comments: [
                {
                    id: "c1",
                    taskId: "ISSUE-01",
                    userId: "u2",
                    userName: "Sarah Bloom",
                    userAvatar: "https://i.pravatar.cc/150?u=u2",
                    text: "I've started working on the auth middleware logic. We might need to consider RBAC as well.",
                    createdAt: new Date(Date.now() - 3600000).toISOString()
                },
                {
                    id: "c2",
                    taskId: "ISSUE-01",
                    userId: "u1",
                    userName: "Gaurav Garg",
                    userAvatar: "https://i.pravatar.cc/150?u=u1",
                    text: "Initial architecture review complete. Ready for implementation stage.",
                    createdAt: new Date(Date.now() - 3600000).toISOString()
                },
                {
                    id: "c3", // Changed from c2 to c3 to avoid duplicate ID
                    taskId: "ISSUE-01",
                    userId: "u2",
                    userName: "Sarah Bloom",
                    userAvatar: "https://i.pravatar.cc/150?u=u2",
                    text: "Great! Did you consider the rate limiting in the middleware?",
                    createdAt: new Date(Date.now() - 1800000).toISOString(),
                    parentId: "c1"
                }
            ],
            activities: [
                {
                    id: "a1",
                    taskId: "ISSUE-01",
                    userId: "u1",
                    userName: "Gaurav Garg",
                    type: "STATUS_CHANGE",
                    detail: "changed status from TODO to IN_PROGRESS",
                    createdAt: new Date(Date.now() - 7200000).toISOString()
                }
            ],

            addComment: (taskId, text, user) => {
                const newComment: Comment = {
                    id: `c-${Math.random().toString(36).substr(2, 9)}`,
                    taskId,
                    userId: user.id,
                    userName: user.name,
                    userAvatar: user.avatar,
                    text,
                    createdAt: new Date().toISOString()
                }
                set(state => ({
                    comments: [newComment, ...state.comments]
                }))
            },

            addReply: (taskId, parentId, text, user) => {
                const newReply: Comment = {
                    id: `c-${Math.random().toString(36).substr(2, 9)}`,
                    taskId,
                    parentId,
                    userId: user.id,
                    userName: user.name,
                    userAvatar: user.avatar,
                    text,
                    createdAt: new Date().toISOString()
                }
                set(state => ({
                    comments: [...state.comments, newReply]
                }))
            },

            editComment: (commentId, newText) => set((state) => ({
                comments: state.comments.map(c => c.id === commentId ? { ...c, text: newText, updatedAt: new Date().toISOString() } : c)
            })),

            deleteComment: (commentId) => set((state) => ({
                comments: state.comments.filter(c => c.id !== commentId)
            })),

            getCommentsByTask: (taskId) => get().comments.filter(c => c.taskId === taskId),

            addActivity: (taskId, type, detail, user) => set((state) => ({
                activities: [...state.activities, {
                    id: `a-${Math.random().toString(36).substr(2, 9)}`,
                    taskId,
                    userId: user.id,
                    userName: user.name,
                    type,
                    detail,
                    createdAt: new Date().toISOString()
                }]
            })),

            getActivitiesByTask: (taskId) => get().activities.filter(a => a.taskId === taskId)
        }),
        {
            name: 'cubicle-collaboration-storage',
        }
    )
)
