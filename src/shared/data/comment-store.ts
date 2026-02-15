import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Comment {
    id: string
    content: string

    // Associations
    taskId: string
    projectId?: string
    workspaceId?: string
    organizationId?: string

    // Threading
    parentId?: string | null
    replies?: Comment[]

    // Author
    createdBy: string
    authorName: string
    authorAvatar?: string
    authorRole?: string

    // Timestamps
    createdAt: string
    updatedAt?: string

    // Status
    isDeleted: boolean
    deletedAt?: string

    // Metadata
    isEdited: boolean
    mentionedUsers?: string[]
    attachments?: string[]
}

interface CommentStore {
    comments: Comment[]

    // Actions
    createComment: (comment: Omit<Comment, 'id' | 'createdAt' | 'isDeleted' | 'isEdited' | 'replies'>) => Comment
    getCommentsByTask: (taskId: string) => Comment[]
    getCommentById: (id: string) => Comment | undefined
    updateComment: (id: string, content: string) => boolean
    deleteComment: (id: string) => boolean
    addReply: (parentId: string, reply: Omit<Comment, 'id' | 'createdAt' | 'isDeleted' | 'isEdited' | 'replies' | 'parentId'>) => Comment | null
    getReplies: (parentId: string) => Comment[]
    getCommentCount: (taskId: string) => number
}

const INITIAL_COMMENTS: Comment[] = [
    {
        id: "cmt-1",
        content: "This task needs to be prioritized. We should start working on it ASAP.",
        taskId: "ISSUE-01",
        projectId: "p1",
        createdBy: "u1",
        authorName: "Sahil S.",
        authorAvatar: "https://i.pravatar.cc/150?u=u1",
        authorRole: "ProjectOwner",
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        isDeleted: false,
        isEdited: false,
        parentId: null,
        replies: []
    },
    {
        id: "cmt-2",
        content: "Agreed! I'll start working on this today.",
        taskId: "ISSUE-01",
        projectId: "p1",
        parentId: "cmt-1",
        createdBy: "u2",
        authorName: "Sarah K.",
        authorAvatar: "https://i.pravatar.cc/150?u=u2",
        authorRole: "ProjectMember",
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        isDeleted: false,
        isEdited: false,
        replies: []
    },
    {
        id: "cmt-3",
        content: "I've added some design mockups in the attachments. Please review.",
        taskId: "ISSUE-01",
        projectId: "p1",
        createdBy: "u3",
        authorName: "Alex M.",
        authorAvatar: "https://i.pravatar.cc/150?u=u3",
        authorRole: "ProjectMember",
        createdAt: new Date(Date.now() - 1800000).toISOString(),
        isDeleted: false,
        isEdited: false,
        parentId: null,
        attachments: ["doc-2"],
        replies: []
    }
]

export const useCommentStore = create<CommentStore>()(
    persist(
        (set, get) => ({
            comments: INITIAL_COMMENTS,

            createComment: (commentData) => {
                const newComment: Comment = {
                    ...commentData,
                    id: `cmt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    createdAt: new Date().toISOString(),
                    isDeleted: false,
                    isEdited: false,
                    parentId: commentData.parentId || null,
                    replies: []
                }

                set((state) => ({
                    comments: [...state.comments, newComment]
                }))

                return newComment
            },

            getCommentsByTask: (taskId: string) => {
                const allComments = get().comments.filter(
                    c => c.taskId === taskId && !c.isDeleted
                )

                // Build threaded structure
                const commentMap = new Map<string, Comment>()
                const rootComments: Comment[] = []

                // First pass: create map and initialize replies
                allComments.forEach(comment => {
                    commentMap.set(comment.id, { ...comment, replies: [] })
                })

                // Second pass: build tree structure
                allComments.forEach(comment => {
                    const commentCopy = commentMap.get(comment.id)!

                    if (comment.parentId) {
                        const parent = commentMap.get(comment.parentId)
                        if (parent) {
                            parent.replies = parent.replies || []
                            parent.replies.push(commentCopy)
                        }
                    } else {
                        rootComments.push(commentCopy)
                    }
                })

                // Sort by creation date (newest first for root, oldest first for replies)
                rootComments.sort((a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                )

                rootComments.forEach(comment => {
                    if (comment.replies && comment.replies.length > 0) {
                        comment.replies.sort((a, b) =>
                            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                        )
                    }
                })

                return rootComments
            },

            getCommentById: (id: string) => {
                return get().comments.find(c => c.id === id && !c.isDeleted)
            },

            updateComment: (id: string, content: string) => {
                const comment = get().comments.find(c => c.id === id)
                if (!comment || comment.isDeleted) return false

                set((state) => ({
                    comments: state.comments.map(c =>
                        c.id === id
                            ? {
                                ...c,
                                content,
                                updatedAt: new Date().toISOString(),
                                isEdited: true
                            }
                            : c
                    )
                }))

                return true
            },

            deleteComment: (id: string) => {
                const comment = get().comments.find(c => c.id === id)
                if (!comment) return false

                set((state) => ({
                    comments: state.comments.map(c =>
                        c.id === id
                            ? {
                                ...c,
                                isDeleted: true,
                                deletedAt: new Date().toISOString()
                            }
                            : c
                    )
                }))

                return true
            },

            addReply: (parentId: string, replyData) => {
                const parent = get().comments.find(c => c.id === parentId && !c.isDeleted)
                if (!parent) return null

                const reply: Comment = {
                    ...replyData,
                    id: `cmt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    parentId,
                    createdAt: new Date().toISOString(),
                    isDeleted: false,
                    isEdited: false,
                    replies: []
                }

                set((state) => ({
                    comments: [...state.comments, reply]
                }))

                return reply
            },

            getReplies: (parentId: string) => {
                return get().comments
                    .filter(c => c.parentId === parentId && !c.isDeleted)
                    .sort((a, b) =>
                        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                    )
            },

            getCommentCount: (taskId: string) => {
                return get().comments.filter(
                    c => c.taskId === taskId && !c.isDeleted
                ).length
            }
        }),
        {
            name: 'cubicle-comments-storage',
            skipHydration: true
        }
    )
)

// Helper function to extract mentions from comment content
export const extractMentions = (content: string): string[] => {
    const mentionRegex = /@(\w+)/g
    const mentions: string[] = []
    let match

    while ((match = mentionRegex.exec(content)) !== null) {
        mentions.push(match[1])
    }

    return mentions
}

// Helper function to format comment time
export const formatCommentTime = (timestamp: string): string => {
    const now = new Date()
    const commentTime = new Date(timestamp)
    const diffMs = now.getTime() - commentTime.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`

    return commentTime.toLocaleDateString()
}
