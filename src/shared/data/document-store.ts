import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type DocumentLevel = "task" | "project" | "workspace" | "organization"
export type DocumentType = "file" | "image"

export interface DocumentFile {
    url: string
    publicId: string
    size: number // in bytes
    format: string
    originalName: string
}

export interface Document {
    id: string
    name: string
    description?: string
    type: DocumentType
    level: DocumentLevel
    file?: DocumentFile
    image?: DocumentFile

    // Associations
    taskId?: string
    projectId?: string
    workspaceId?: string
    organizationId: string

    // Metadata
    uploadedBy: string
    uploaderName: string
    uploaderAvatar?: string
    uploadedAt: string

    // Status
    isDeleted: boolean
    deletedAt?: string
    deletedBy?: string
}

interface DocumentStore {
    documents: Document[]

    // Actions
    uploadDocument: (doc: Omit<Document, 'id' | 'uploadedAt' | 'isDeleted'>) => Document
    getDocuments: (filters?: {
        taskId?: string
        projectId?: string
        workspaceId?: string
        organizationId?: string
        type?: DocumentType
        level?: DocumentLevel
    }) => Document[]
    getDocumentById: (id: string) => Document | undefined
    deleteDocument: (id: string, userId: string) => boolean
    getStorageUsage: (organizationId: string) => {
        totalDocuments: number
        totalSizeBytes: number
        totalSizeMB: number
        totalSizeGB: number
        byType: {
            files: { count: number, sizeBytes: number }
            images: { count: number, sizeBytes: number }
        }
        byLevel: Record<DocumentLevel, { count: number, sizeBytes: number }>
    }
    restoreDocument: (id: string) => boolean
}

const INITIAL_DOCUMENTS: Document[] = [
    {
        id: "doc-1",
        name: "Project Requirements.pdf",
        description: "Initial project requirements document",
        type: "file",
        level: "project",
        file: {
            url: "https://example.com/docs/requirements.pdf",
            publicId: "docs/requirements_abc123",
            size: 2048000, // 2MB
            format: "pdf",
            originalName: "requirements.pdf"
        },
        projectId: "p1",
        organizationId: "org-1",
        uploadedBy: "u1",
        uploaderName: "Sahil S.",
        uploadedAt: new Date(Date.now() - 86400000).toISOString(),
        isDeleted: false
    },
    {
        id: "doc-2",
        name: "UI Mockup.png",
        description: "Dashboard UI design mockup",
        type: "image",
        level: "task",
        image: {
            url: "https://example.com/images/mockup.png",
            publicId: "images/mockup_xyz789",
            size: 512000, // 512KB
            format: "png",
            originalName: "dashboard-mockup.png"
        },
        taskId: "ISSUE-01",
        projectId: "p1",
        organizationId: "org-1",
        uploadedBy: "u2",
        uploaderName: "Sarah K.",
        uploadedAt: new Date(Date.now() - 3600000).toISOString(),
        isDeleted: false
    },
    {
        id: "doc-3",
        name: "Team Photo.jpg",
        description: "Team offsite photo",
        type: "image",
        level: "workspace",
        image: {
            url: "https://example.com/images/team.jpg",
            publicId: "images/team_def456",
            size: 1024000, // 1MB
            format: "jpg",
            originalName: "team-photo.jpg"
        },
        workspaceId: "ws-1",
        organizationId: "org-1",
        uploadedBy: "u1",
        uploaderName: "Sahil S.",
        uploadedAt: new Date(Date.now() - 7200000).toISOString(),
        isDeleted: false
    }
]

export const useDocumentStore = create<DocumentStore>()(
    persist(
        (set, get) => ({
            documents: INITIAL_DOCUMENTS,

            uploadDocument: (docData) => {
                const newDoc: Document = {
                    ...docData,
                    id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    uploadedAt: new Date().toISOString(),
                    isDeleted: false
                }

                set((state) => ({
                    documents: [newDoc, ...state.documents]
                }))

                return newDoc
            },

            getDocuments: (filters = {}) => {
                let docs = get().documents.filter(doc => !doc.isDeleted)

                if (filters.taskId) {
                    docs = docs.filter(doc => doc.taskId === filters.taskId)
                }
                if (filters.projectId) {
                    docs = docs.filter(doc => doc.projectId === filters.projectId)
                }
                if (filters.workspaceId) {
                    docs = docs.filter(doc => doc.workspaceId === filters.workspaceId)
                }
                if (filters.organizationId) {
                    docs = docs.filter(doc => doc.organizationId === filters.organizationId)
                }
                if (filters.type) {
                    docs = docs.filter(doc => doc.type === filters.type)
                }
                if (filters.level) {
                    docs = docs.filter(doc => doc.level === filters.level)
                }

                return docs.sort((a, b) =>
                    new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
                )
            },

            getDocumentById: (id: string) => {
                return get().documents.find(doc => doc.id === id && !doc.isDeleted)
            },

            deleteDocument: (id: string, userId: string) => {
                const doc = get().documents.find(d => d.id === id)
                if (!doc) return false

                set((state) => ({
                    documents: state.documents.map(d =>
                        d.id === id
                            ? {
                                ...d,
                                isDeleted: true,
                                deletedAt: new Date().toISOString(),
                                deletedBy: userId
                            }
                            : d
                    )
                }))

                return true
            },

            getStorageUsage: (organizationId: string) => {
                const docs = get().documents.filter(
                    doc => doc.organizationId === organizationId && !doc.isDeleted
                )

                let totalSizeBytes = 0
                const byType = {
                    files: { count: 0, sizeBytes: 0 },
                    images: { count: 0, sizeBytes: 0 }
                }
                const byLevel: Record<DocumentLevel, { count: number, sizeBytes: number }> = {
                    task: { count: 0, sizeBytes: 0 },
                    project: { count: 0, sizeBytes: 0 },
                    workspace: { count: 0, sizeBytes: 0 },
                    organization: { count: 0, sizeBytes: 0 }
                }

                docs.forEach(doc => {
                    const size = doc.file?.size || doc.image?.size || 0
                    totalSizeBytes += size

                    // By type
                    if (doc.type === 'file') {
                        byType.files.count++
                        byType.files.sizeBytes += size
                    } else {
                        byType.images.count++
                        byType.images.sizeBytes += size
                    }

                    // By level
                    byLevel[doc.level].count++
                    byLevel[doc.level].sizeBytes += size
                })

                return {
                    totalDocuments: docs.length,
                    totalSizeBytes,
                    totalSizeMB: parseFloat((totalSizeBytes / (1024 * 1024)).toFixed(2)),
                    totalSizeGB: parseFloat((totalSizeBytes / (1024 * 1024 * 1024)).toFixed(2)),
                    byType,
                    byLevel
                }
            },

            restoreDocument: (id: string) => {
                const doc = get().documents.find(d => d.id === id)
                if (!doc) return false

                set((state) => ({
                    documents: state.documents.map(d =>
                        d.id === id
                            ? {
                                ...d,
                                isDeleted: false,
                                deletedAt: undefined,
                                deletedBy: undefined
                            }
                            : d
                    )
                }))

                return true
            }
        }),
        {
            name: 'cubicle-documents-storage',
            skipHydration: true
        }
    )
)

// Helper function to format file size
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Helper function to get file icon
export const getFileIcon = (format: string): string => {
    const iconMap: Record<string, string> = {
        pdf: '📄',
        doc: '📝',
        docx: '📝',
        xls: '📊',
        xlsx: '📊',
        ppt: '📊',
        pptx: '📊',
        txt: '📃',
        zip: '🗜️',
        png: '🖼️',
        jpg: '🖼️',
        jpeg: '🖼️',
        gif: '🖼️',
        svg: '🖼️'
    }
    return iconMap[format.toLowerCase()] || '📎'
}
