import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ProjectComponent {
    id: string
    name: string
    description: string
    projectId: string
    leadName: string
    color: string
    createdAt: string
}

interface ComponentStore {
    components: ProjectComponent[]
    addComponent: (data: Omit<ProjectComponent, 'id' | 'createdAt'>) => ProjectComponent
    updateComponent: (id: string, updates: Partial<ProjectComponent>) => void
    deleteComponent: (id: string) => void
    getComponentsByProject: (projectId: string) => ProjectComponent[]
    getComponentById: (id: string) => ProjectComponent | undefined
}

const INITIAL: ProjectComponent[] = [
    { id: "c1", name: "Frontend Core", description: "Shared UI primitives", projectId: "p1", leadName: "Sarah Chen", color: "bg-indigo-500", createdAt: new Date().toISOString() },
    { id: "c2", name: "API Gateway", description: "REST and GraphQL", projectId: "p1", leadName: "Mike Johnson", color: "bg-emerald-500", createdAt: new Date().toISOString() },
]

export const useComponentStore = create<ComponentStore>()(
    persist(
        (set, get) => ({
            components: INITIAL,

            addComponent: (data) => {
                const newComp: ProjectComponent = {
                    ...data,
                    id: `comp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
                    createdAt: new Date().toISOString(),
                }
                set(state => ({ components: [newComp, ...state.components] }))
                return newComp
            },

            updateComponent: (id, updates) => set(state => ({
                components: state.components.map(c => c.id === id ? { ...c, ...updates } : c)
            })),

            deleteComponent: (id) => set(state => ({
                components: state.components.filter(c => c.id !== id)
            })),

            getComponentsByProject: (projectId) => get().components.filter(c => c.projectId === projectId),
            getComponentById: (id) => get().components.find(c => c.id === id),
        }),
        {
            name: 'cubicle-components-storage',
            skipHydration: true,
        }
    )
)
