import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Workspace {
    id: string
    name: string
    slug: string
    icon: string
    createdAt: string
    description?: string
    industry?: string
    purpose?: string
}

interface WorkspaceStore {
    workspaces: Workspace[]
    activeWorkspaceId: string | null
    addWorkspace: (workspace: Workspace) => void
    setActiveWorkspace: (id: string) => void
    getActiveWorkspace: () => Workspace | undefined
    getWorkspaceById: (id: string) => Workspace | undefined
    deleteWorkspace: (id: string) => void
}

const DEFAULT_WORKSPACES: Workspace[] = [
    {
        id: 'ws-1',
        name: 'Fixl Solutions',
        slug: 'fixl-solutions',
        icon: '🏢',
        createdAt: '2024-01-15',
        description: 'Main company workspace for all product development',
        industry: 'Software',
        purpose: 'Product Management'
    },
    {
        id: 'ws-2',
        name: 'Personal Projects',
        slug: 'personal',
        icon: '👤',
        createdAt: '2024-02-01',
        description: 'Personal side projects and experiments',
        industry: 'Hobby',
        purpose: 'Self Management'
    }
]

export const useWorkspaceStore = create<WorkspaceStore>()(
    persist(
        (set, get) => ({
            workspaces: DEFAULT_WORKSPACES,
            activeWorkspaceId: 'ws-1', // Default to first workspace

            addWorkspace: (workspace) => set((state) => ({
                workspaces: [workspace, ...state.workspaces],
                activeWorkspaceId: workspace.id // Auto-switch to new workspace
            })),

            setActiveWorkspace: (id) => set({ activeWorkspaceId: id }),

            getActiveWorkspace: () => {
                const state = get()
                return state.workspaces.find(w => w.id === state.activeWorkspaceId)
            },

            getWorkspaceById: (id) => get().workspaces.find(w => w.id === id),

            deleteWorkspace: (id) => set((state) => {
                const newWorkspaces = state.workspaces.filter(w => w.id !== id)
                let newActiveId = state.activeWorkspaceId

                // If we deleted the active workspace, switch to another one
                if (state.activeWorkspaceId === id) {
                    newActiveId = newWorkspaces.length > 0 ? newWorkspaces[0].id : null
                }

                return {
                    workspaces: newWorkspaces,
                    activeWorkspaceId: newActiveId
                }
            })
        }),
        {
            name: 'cubicle-workspaces-storage',
            skipHydration: true,
        }
    )
)
