
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface WikiPage {
    id: string
    projectId: string
    title: string
    folder: string
    content: string
    author: string
    updatedAt: string
    starred: boolean
}

interface WikiStore {
    pages: WikiPage[]
    addPage: (page: WikiPage) => void
    updatePage: (id: string, updates: Partial<WikiPage>) => void
    deletePage: (id: string) => void
    toggleStar: (id: string) => void
    getPagesByProject: (projectId: string) => WikiPage[]
}

const INITIAL_PAGES: WikiPage[] = [
    {
        id: "w1",
        projectId: "p1",
        title: "Brand Guidelines v2.0",
        folder: "Assets",
        content: "Detailed brand guidelines including logo usage, typography, and color palette.",
        author: "Sarah K.",
        updatedAt: new Date().toISOString(),
        starred: true
    },
    {
        id: "w2",
        projectId: "p1",
        title: "API Documentation",
        folder: "Technical",
        content: "Endpoints and authentication details for the core API.",
        author: "James W.",
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        starred: true
    }
]

export const useWikiStore = create<WikiStore>()(
    persist(
        (set, get) => ({
            pages: INITIAL_PAGES,

            addPage: (page) => set((state) => ({
                pages: [page, ...state.pages]
            })),

            updatePage: (id, updates) => set((state) => ({
                pages: state.pages.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p)
            })),

            deletePage: (id) => set((state) => ({
                pages: state.pages.filter(p => p.id !== id)
            })),

            toggleStar: (id) => set((state) => ({
                pages: state.pages.map(p => p.id === id ? { ...p, starred: !p.starred } : p)
            })),

            getPagesByProject: (projectId) => get().pages.filter(p => p.projectId === projectId)
        }),
        {
            name: 'cubicle-wiki-storage',
            skipHydration: true
        }
    )
)
