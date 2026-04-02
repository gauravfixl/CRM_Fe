import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type SprintStatus = "PLANNED" | "ACTIVE" | "COMPLETED"

export interface Sprint {
    id: string
    projectId: string
    name: string
    goal?: string
    startDate?: string
    endDate?: string
    status: SprintStatus
    createdAt: string
}

export interface Epic {
    id: string
    projectId: string
    name: string
    description?: string
    color: string
    status: "OPEN" | "IN_PROGRESS" | "DONE"
    createdAt: string
}

interface SprintEpicStore {
    sprints: Sprint[]
    epics: Epic[]

    // Sprint Actions
    addSprint: (sprint: Sprint) => void
    updateSprint: (sprintId: string, updates: Partial<Sprint>) => void
    deleteSprint: (sprintId: string) => void
    startSprint: (sprintId: string) => { success: boolean; error?: string }
    completeSprint: (sprintId: string) => { success: boolean; error?: string }
    getSprintsByProject: (projectId: string) => Sprint[]
    getActiveSprint: (projectId: string) => Sprint | undefined

    // Epic Actions
    addEpic: (epic: Epic) => void
    updateEpic: (epicId: string, updates: Partial<Epic>) => void
    deleteEpic: (epicId: string) => void
    getEpicsByProject: (projectId: string) => Epic[]
}

export const useSprintEpicStore = create<SprintEpicStore>()(
    persist(
        (set, get) => ({
            sprints: [
                { id: "sprint-01", projectId: "p1", name: "Sprint 1: Core Auth", goal: "Complete authentication and sessions.", status: "COMPLETED" as const, startDate: new Date(Date.now() - 28*86400000).toISOString(), endDate: new Date(Date.now() - 14*86400000).toISOString(), createdAt: new Date(Date.now() - 30*86400000).toISOString() },
                { id: "sprint-02", projectId: "p1", name: "Sprint 2: Dashboard", goal: "Build main dashboard and navigation.", status: "ACTIVE" as const, startDate: new Date(Date.now() - 7*86400000).toISOString(), endDate: new Date(Date.now() + 7*86400000).toISOString(), createdAt: new Date(Date.now() - 14*86400000).toISOString() },
                { id: "sprint-03", projectId: "p1", name: "Sprint 3: Reports", goal: "Analytics and reporting module.", status: "PLANNED" as const, startDate: undefined, endDate: undefined, createdAt: new Date().toISOString() },
            ],
            epics: [
                { id: "epic-01", projectId: "p1", name: "Security Infrastructure", description: "Auth, permissions, and security.", color: "#6366f1", status: "IN_PROGRESS" as const, createdAt: new Date().toISOString() },
                { id: "epic-02", projectId: "p1", name: "Core Platform", description: "Dashboard, navigation, and settings.", color: "#10b981", status: "OPEN" as const, createdAt: new Date().toISOString() },
            ],

            addSprint: (sprint) => set((state) => ({
                sprints: [...state.sprints, sprint]
            })),
            updateSprint: (sprintId, updates) => set((state) => ({
                sprints: state.sprints.map(s => s.id === sprintId ? { ...s, ...updates } : s)
            })),
            deleteSprint: (sprintId) => set((state) => ({
                sprints: state.sprints.filter(s => s.id !== sprintId)
            })),
            startSprint: (sprintId) => {
                const state = get()
                const sprint = state.sprints.find(s => s.id === sprintId)
                if (!sprint) return { success: false, error: "Sprint not found" }
                if (sprint.status !== "PLANNED") return { success: false, error: "Only planned sprints can be started" }
                const hasActive = state.sprints.some(s => s.projectId === sprint.projectId && s.status === "ACTIVE" && s.id !== sprintId)
                if (hasActive) return { success: false, error: "Another sprint is already active in this project" }
                set(state => ({
                    sprints: state.sprints.map(s => s.id === sprintId ? { ...s, status: "ACTIVE" as const, startDate: new Date().toISOString() } : s)
                }))
                return { success: true }
            },
            completeSprint: (sprintId) => {
                const state = get()
                const sprint = state.sprints.find(s => s.id === sprintId)
                if (!sprint) return { success: false, error: "Sprint not found" }
                if (sprint.status !== "ACTIVE") return { success: false, error: "Only active sprints can be completed" }
                set(state => ({
                    sprints: state.sprints.map(s => s.id === sprintId ? { ...s, status: "COMPLETED" as const } : s)
                }))
                return { success: true }
            },
            getSprintsByProject: (projectId) => get().sprints.filter(s => s.projectId === projectId),
            getActiveSprint: (projectId) => get().sprints.find(s => s.projectId === projectId && s.status === "ACTIVE"),

            addEpic: (epic) => set((state) => ({
                epics: [...state.epics, epic]
            })),
            updateEpic: (epicId, updates) => set((state) => ({
                epics: state.epics.map(e => e.id === epicId ? { ...e, ...updates } : e)
            })),
            deleteEpic: (epicId) => set((state) => ({
                epics: state.epics.filter(e => e.id !== epicId)
            })),
            getEpicsByProject: (projectId) => get().epics.filter(e => e.projectId === projectId)
        }),
        {
            name: 'cubicle-sprint-epic-storage',
            skipHydration: true
        }
    )
)
