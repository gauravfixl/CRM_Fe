import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type SprintStatus = "PLANNED" | "ACTIVE" | "COMPLETED"

export interface Sprint {
    id: string
    name: string
    goal: string
    startDate?: string
    endDate?: string
    status: SprintStatus

    // Associations
    projectId: string
    boardId: string
    workspaceId: string
    organizationId: string

    // Metrics
    totalPoints: number
    completedPoints: number
    totalTasks: number
    completedTasks: number

    // Metadata
    createdBy: string
    creatorName: string
    createdAt: string
    updatedAt?: string

    // Status
    isDeleted: boolean
}

interface SprintStore {
    sprints: Sprint[]

    // Actions
    createSprint: (sprint: Omit<Sprint, 'id' | 'createdAt' | 'isDeleted' | 'totalPoints' | 'completedPoints' | 'totalTasks' | 'completedTasks'>) => Sprint
    getSprints: (filters?: {
        projectId?: string
        boardId?: string
        status?: SprintStatus
    }) => Sprint[]
    getSprintById: (id: string) => Sprint | undefined
    updateSprint: (id: string, updates: Partial<Sprint>) => Sprint | null
    deleteSprint: (id: string) => boolean
    startSprint: (id: string, startDate: string, endDate: string) => Sprint | null
    completeSprint: (id: string) => Sprint | null
    updateSprintMetrics: (sprintId: string, metrics: {
        totalPoints: number
        completedPoints: number
        totalTasks: number
        completedTasks: number
    }) => void
}

const INITIAL_SPRINTS: Sprint[] = [
    {
        id: "sprint-1",
        name: "Sprint 1",
        goal: "Complete user authentication and basic dashboard",
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: "ACTIVE",
        projectId: "p1",
        boardId: "b1",
        workspaceId: "w1",
        organizationId: "org-1",
        totalPoints: 21,
        completedPoints: 13,
        totalTasks: 8,
        completedTasks: 5,
        createdBy: "u1",
        creatorName: "John Doe",
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        isDeleted: false
    },
    {
        id: "sprint-2",
        name: "Sprint 2",
        goal: "Implement project management features",
        status: "PLANNED",
        projectId: "p1",
        boardId: "b1",
        workspaceId: "w1",
        organizationId: "org-1",
        totalPoints: 0,
        completedPoints: 0,
        totalTasks: 0,
        completedTasks: 0,
        createdBy: "u1",
        creatorName: "John Doe",
        createdAt: new Date().toISOString(),
        isDeleted: false
    }
]

export const useSprintStore = create<SprintStore>()(
    persist(
        (set, get) => ({
            sprints: INITIAL_SPRINTS,

            createSprint: (sprintData) => {
                const newSprint: Sprint = {
                    ...sprintData,
                    id: `sprint-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    createdAt: new Date().toISOString(),
                    isDeleted: false,
                    totalPoints: 0,
                    completedPoints: 0,
                    totalTasks: 0,
                    completedTasks: 0
                }

                set((state) => ({
                    sprints: [...state.sprints, newSprint]
                }))

                return newSprint
            },

            getSprints: (filters = {}) => {
                let sprints = get().sprints.filter(s => !s.isDeleted)

                if (filters.projectId) {
                    sprints = sprints.filter(s => s.projectId === filters.projectId)
                }
                if (filters.boardId) {
                    sprints = sprints.filter(s => s.boardId === filters.boardId)
                }
                if (filters.status) {
                    sprints = sprints.filter(s => s.status === filters.status)
                }

                return sprints.sort((a, b) => {
                    // Sort by status: ACTIVE > PLANNED > COMPLETED
                    const statusOrder = { ACTIVE: 0, PLANNED: 1, COMPLETED: 2 }
                    return statusOrder[a.status] - statusOrder[b.status]
                })
            },

            getSprintById: (id: string) => {
                return get().sprints.find(s => s.id === id && !s.isDeleted)
            },

            updateSprint: (id: string, updates) => {
                const sprint = get().sprints.find(s => s.id === id)
                if (!sprint || sprint.isDeleted) return null

                const updatedSprint: Sprint = {
                    ...sprint,
                    ...updates,
                    id: sprint.id, // Preserve ID
                    updatedAt: new Date().toISOString()
                }

                set((state) => ({
                    sprints: state.sprints.map(s =>
                        s.id === id ? updatedSprint : s
                    )
                }))

                return updatedSprint
            },

            deleteSprint: (id: string) => {
                const sprint = get().sprints.find(s => s.id === id)
                if (!sprint) return false

                // Prevent deleting active sprints
                if (sprint.status === "ACTIVE") {
                    console.error("Cannot delete active sprint")
                    return false
                }

                set((state) => ({
                    sprints: state.sprints.map(s =>
                        s.id === id ? { ...s, isDeleted: true } : s
                    )
                }))

                return true
            },

            startSprint: (id: string, startDate: string, endDate: string) => {
                const sprint = get().sprints.find(s => s.id === id)
                if (!sprint || sprint.isDeleted) return null

                if (sprint.status !== "PLANNED") {
                    console.error("Only planned sprints can be started")
                    return null
                }

                // Check if there's already an active sprint in the same project
                const activeSprint = get().sprints.find(s =>
                    s.projectId === sprint.projectId &&
                    s.status === "ACTIVE" &&
                    !s.isDeleted
                )

                if (activeSprint) {
                    console.error("Another sprint is already active in this project")
                    return null
                }

                const updatedSprint: Sprint = {
                    ...sprint,
                    status: "ACTIVE",
                    startDate,
                    endDate,
                    updatedAt: new Date().toISOString()
                }

                set((state) => ({
                    sprints: state.sprints.map(s =>
                        s.id === id ? updatedSprint : s
                    )
                }))

                return updatedSprint
            },

            completeSprint: (id: string) => {
                const sprint = get().sprints.find(s => s.id === id)
                if (!sprint || sprint.isDeleted) return null

                if (sprint.status !== "ACTIVE") {
                    console.error("Only active sprints can be completed")
                    return null
                }

                const updatedSprint: Sprint = {
                    ...sprint,
                    status: "COMPLETED",
                    updatedAt: new Date().toISOString()
                }

                set((state) => ({
                    sprints: state.sprints.map(s =>
                        s.id === id ? updatedSprint : s
                    )
                }))

                return updatedSprint
            },

            updateSprintMetrics: (sprintId: string, metrics) => {
                set((state) => ({
                    sprints: state.sprints.map(s =>
                        s.id === sprintId
                            ? { ...s, ...metrics, updatedAt: new Date().toISOString() }
                            : s
                    )
                }))
            }
        }),
        {
            name: 'cubicle-sprints-storage',
            skipHydration: true
        }
    )
)
