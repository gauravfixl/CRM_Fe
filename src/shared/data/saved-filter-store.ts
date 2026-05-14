import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface SavedFilter {
    id: string
    name: string
    scope: "issues" | "backlog" | "board"
    query: {
        search?: string
        projectId?: string
        assigneeId?: string
        status?: string
        priority?: string
        type?: string
        epicId?: string
        sprintId?: string
        labels?: string[]
    }
    pinned: boolean
    createdAt: string
}

interface SavedFilterStore {
    filters: SavedFilter[]
    addFilter: (data: Omit<SavedFilter, 'id' | 'createdAt'>) => SavedFilter
    updateFilter: (id: string, updates: Partial<SavedFilter>) => void
    deleteFilter: (id: string) => void
    togglePin: (id: string) => void
    getFiltersByScope: (scope: SavedFilter['scope']) => SavedFilter[]
}

const INITIAL: SavedFilter[] = [
    {
        id: "f-default",
        name: "My Open Issues",
        scope: "issues",
        query: { assigneeId: "u1", status: "TODO" },
        pinned: true,
        createdAt: new Date().toISOString(),
    },
]

export const useSavedFilterStore = create<SavedFilterStore>()(
    persist(
        (set, get) => ({
            filters: INITIAL,

            addFilter: (data) => {
                const f: SavedFilter = {
                    ...data,
                    id: `filter-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                    createdAt: new Date().toISOString(),
                }
                set(state => ({ filters: [f, ...state.filters] }))
                return f
            },

            updateFilter: (id, updates) => set(state => ({
                filters: state.filters.map(f => f.id === id ? { ...f, ...updates } : f)
            })),

            deleteFilter: (id) => set(state => ({
                filters: state.filters.filter(f => f.id !== id)
            })),

            togglePin: (id) => set(state => ({
                filters: state.filters.map(f => f.id === id ? { ...f, pinned: !f.pinned } : f)
            })),

            getFiltersByScope: (scope) => get().filters.filter(f => f.scope === scope),
        }),
        {
            name: 'cubicle-saved-filters-storage',
            skipHydration: true,
        }
    )
)
