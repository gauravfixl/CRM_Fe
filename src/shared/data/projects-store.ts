import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ProjectStatus = "Active" | "Planned" | "On Hold" | "Completed" | "Closing"
export type ProjectPriority = "Low" | "Medium" | "High"

export interface Project {
    id: string
    workspaceId: string
    name: string
    key: string
    status: ProjectStatus
    priority?: ProjectPriority
    leadId: string      // UPDATED: Using ID of the user
    memberIds: string[] // NEW: Array of specific members in this project
    members: number     // Keeping for backward compatibility/UI for now
    due: string
    category: string
    icon: string
    type: "team" | "company"
    methodology: "kanban" | "scrum" // NEW: Project methodology
    starred: boolean
    description?: string
    startDate?: string
    endDate?: string
    boardId?: string
}

interface ProjectStore {
    projects: Project[]
    addProject: (project: Project) => void
    createProject: (project: Partial<Project> & { name: string, workspaceId: string }) => void
    updateProject: (id: string, updates: Partial<Project>) => void
    toggleStar: (id: string) => void
    getProjectById: (id: string) => Project | undefined
    getProjectsByWorkspace: (workspaceId: string) => Project[]
    deleteProject: (id: string) => void
    addMemberToProject: (projectId: string, memberId: string) => void
}

const INITIAL_PROJECTS: Project[] = [
    {
        id: "p1",
        workspaceId: "ws-1",
        name: "Website Redesign",
        key: "WEB",
        status: "Active",
        leadId: "u1",
        memberIds: ["u1", "u2"],
        members: 12,
        due: "Feb 20, 2026",
        category: "Design",
        icon: "🌐",
        type: "team",
        methodology: "scrum",
        starred: true
    },
    {
        id: "p2",
        workspaceId: "ws-1",
        name: "Mobile App v2",
        key: "MOB",
        status: "Active",
        leadId: "u2",
        memberIds: ["u2", "u3"],
        members: 8,
        due: "Mar 15, 2026",
        category: "Mobile",
        icon: "📱",
        type: "team",
        methodology: "kanban",
        starred: true
    },
]

export const useProjectStore = create<ProjectStore>()(
    persist(
        (set, get) => ({
            projects: INITIAL_PROJECTS,
            addProject: (project) => set((state) => ({
                projects: [project, ...state.projects]
            })),
            createProject: (projectData) => set((state) => {
                const newProject: Project = {
                    id: `p-${Date.now()}`,
                    key: projectData.key || projectData.name.substring(0, 3).toUpperCase(),
                    status: projectData.status || "Active",
                    leadId: projectData.leadId || "u1",
                    memberIds: [projectData.leadId || "u1"],
                    members: 1,
                    due: projectData.endDate || "No date",
                    category: projectData.category || "General",
                    icon: projectData.icon || "🚀",
                    type: projectData.type || "team",
                    methodology: projectData.methodology || "kanban",
                    starred: false,
                    ...projectData
                } as Project
                return { projects: [newProject, ...state.projects] }
            }),
            updateProject: (id, updates) => set((state) => ({
                projects: state.projects.map(p => p.id === id ? { ...p, ...updates } : p)
            })),
            toggleStar: (id) => set((state) => ({
                projects: state.projects.map(p =>
                    p.id === id ? { ...p, starred: !p.starred } : p
                )
            })),
            getProjectById: (id) => get().projects.find(p => p.id === id),
            getProjectsByWorkspace: (workspaceId) => get().projects.filter(p => p.workspaceId === workspaceId),
            deleteProject: (id) => set((state) => ({
                projects: state.projects.filter(p => p.id !== id)
            })),
            addMemberToProject: (projectId, memberId) => set((state) => ({
                projects: state.projects.map(p =>
                    p.id === projectId && !p.memberIds.includes(memberId)
                        ? { ...p, memberIds: [...p.memberIds, memberId], members: p.memberIds.length + 1 }
                        : p
                )
            }))
        }),
        {
            name: 'cubicle-projects-storage',
            skipHydration: true,
        }
    )
)
