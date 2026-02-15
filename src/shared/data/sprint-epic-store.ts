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
                { id: "sprint-01", projectId: "p1", name: "Sprint 1: Core Auth", goal: "Complete authentication middleware and user sessions.", status: "ACTIVE", startDate: new Date().toISOString(), endDate: new Date(Date.now() + 1209600000).toISOString(), createdAt: new Date().toISOString() }
            ],
            epics: [
                { id: "epic-01", projectId: "p1", name: "Security Infrastructure", description: "Global security and auth features.", color: "#6366f1", status: "IN_PROGRESS", createdAt: new Date().toISOString() }
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
