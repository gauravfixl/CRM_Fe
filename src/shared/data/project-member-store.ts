import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ProjectPermissions = {
    canEditTasks: boolean
    canDeleteTasks: boolean
    canManageMembers: boolean
    canConfigureWorkflow: boolean
    canManageBoard: boolean
}

export type ProjectRole = "ProjectOwner" | "ProjectAdmin" | "ProjectMember" | "ProjectViewer"

export interface ProjectMember {
    id: string
    projectId: string
    workspaceId: string
    userId: string
    userName: string
    userEmail: string
    userAvatar?: string
    role: ProjectRole
    customPermissions?: ProjectPermissions
    addedBy: string
    addedAt: string
    isActive: boolean
}

interface ProjectMemberStore {
    projectMembers: ProjectMember[]

    // Actions
    assignMember: (member: Omit<ProjectMember, 'id' | 'addedAt' | 'isActive'>) => void
    getAllProjectMembers: (projectId: string) => ProjectMember[]
    getProjectMember: (projectId: string, userId: string) => ProjectMember | undefined
    updateProjectMember: (memberId: string, updates: Partial<ProjectMember>) => void
    removeMember: (memberId: string) => void
    getMemberPermissions: (projectId: string, userId: string) => ProjectPermissions | null
    isProjectMember: (projectId: string, userId: string) => boolean
}

const DEFAULT_PERMISSIONS: Record<ProjectRole, ProjectPermissions> = {
    ProjectOwner: {
        canEditTasks: true,
        canDeleteTasks: true,
        canManageMembers: true,
        canConfigureWorkflow: true,
        canManageBoard: true
    },
    ProjectAdmin: {
        canEditTasks: true,
        canDeleteTasks: true,
        canManageMembers: true,
        canConfigureWorkflow: true,
        canManageBoard: true
    },
    ProjectMember: {
        canEditTasks: true,
        canDeleteTasks: false,
        canManageMembers: false,
        canConfigureWorkflow: false,
        canManageBoard: false
    },
    ProjectViewer: {
        canEditTasks: false,
        canDeleteTasks: false,
        canManageMembers: false,
        canConfigureWorkflow: false,
        canManageBoard: false
    }
}

const INITIAL_PROJECT_MEMBERS: ProjectMember[] = [
    {
        id: "pm-1",
        projectId: "p1",
        workspaceId: "ws-1",
        userId: "u1",
        userName: "Sahil S.",
        userEmail: "sahil@fixl.com",
        userAvatar: "https://i.pravatar.cc/150?u=u1",
        role: "ProjectOwner",
        addedBy: "system",
        addedAt: "2024-01-15T10:00:00Z",
        isActive: true
    },
    {
        id: "pm-2",
        projectId: "p1",
        workspaceId: "ws-1",
        userId: "u2",
        userName: "Sarah K.",
        userEmail: "sarah@fixl.com",
        userAvatar: "https://i.pravatar.cc/150?u=u2",
        role: "ProjectMember",
        addedBy: "u1",
        addedAt: "2024-01-16T10:00:00Z",
        isActive: true
    }
]

export const useProjectMemberStore = create<ProjectMemberStore>()(
    persist(
        (set, get) => ({
            projectMembers: INITIAL_PROJECT_MEMBERS,

            assignMember: (memberData) => {
                const newMember: ProjectMember = {
                    ...memberData,
                    id: `pm-${Date.now()}`,
                    addedAt: new Date().toISOString(),
                    isActive: true
                }
                set((state) => ({
                    projectMembers: [newMember, ...state.projectMembers]
                }))
            },

            getAllProjectMembers: (projectId) =>
                get().projectMembers.filter(m => m.projectId === projectId && m.isActive),

            getProjectMember: (projectId, userId) =>
                get().projectMembers.find(m => m.projectId === projectId && m.userId === userId && m.isActive),

            updateProjectMember: (memberId, updates) => set((state) => ({
                projectMembers: state.projectMembers.map(m =>
                    m.id === memberId ? { ...m, ...updates } : m
                )
            })),

            removeMember: (memberId) => set((state) => ({
                projectMembers: state.projectMembers.map(m =>
                    m.id === memberId ? { ...m, isActive: false } : m
                )
            })),

            getMemberPermissions: (projectId, userId) => {
                const member = get().projectMembers.find(
                    m => m.projectId === projectId && m.userId === userId && m.isActive
                )
                if (!member) return null
                return member.customPermissions || DEFAULT_PERMISSIONS[member.role] || null
            },

            isProjectMember: (projectId, userId) => {
                return get().projectMembers.some(
                    m => m.projectId === projectId && m.userId === userId && m.isActive
                )
            }
        }),
        {
            name: 'cubicle-project-members-storage',
            skipHydration: true
        }
    )
)

export { DEFAULT_PERMISSIONS }
