import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ProjectTemplate {
    id: string
    name: string
    description: string
    category: "Software" | "Business" | "Marketing" | "Design" | "Operations"
    boardType: "KANBAN" | "SCRUM" | "LIST"
    previewImage: string
    recommended: boolean
    isSystem: boolean
    version: number
    createdBy: string
    createdAt: string
}

interface TemplateStore {
    templates: ProjectTemplate[]
    isLoading: boolean
    error: string | null

    // Actions
    setTemplates: (templates: ProjectTemplate[]) => void
    addTemplate: (template: ProjectTemplate) => void
    updateTemplate: (id: string, updates: Partial<ProjectTemplate>) => void
    deleteTemplate: (id: string) => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
}

export const useTemplateStore = create<TemplateStore>()(
    persist(
        (set) => ({
            templates: [
                {
                    id: "tmpl-1",
                    name: "Software Development",
                    description: "End-to-end agile workflow with backlog, sprints, and bug tracking.",
                    category: "Software",
                    boardType: "SCRUM",
                    previewImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=400&auto=format&fit=crop",
                    recommended: true,
                    isSystem: true,
                    version: 1,
                    createdBy: "system",
                    createdAt: new Date().toISOString()
                },
                {
                    id: "tmpl-2",
                    name: "Kanban Service Desk",
                    description: "Optimized for high-volume support requests and continuous flow.",
                    category: "Operations",
                    boardType: "KANBAN",
                    previewImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=400&auto=format&fit=crop",
                    recommended: true,
                    isSystem: true,
                    version: 1,
                    createdBy: "system",
                    createdAt: new Date().toISOString()
                },
                {
                    id: "tmpl-3",
                    name: "Marketing Campaign",
                    description: "Plan and execute marketing launches with cross-functional tracking.",
                    category: "Marketing",
                    boardType: "KANBAN",
                    previewImage: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?q=80&w=400&auto=format&fit=crop",
                    recommended: false,
                    isSystem: true,
                    version: 1,
                    createdBy: "system",
                    createdAt: new Date().toISOString()
                },
                {
                    id: "tmpl-4",
                    name: "Internal Roadmap",
                    description: "Strategy and product roadmap template for quarterly planning.",
                    category: "Business",
                    boardType: "LIST",
                    previewImage: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?q=80&w=400&auto=format&fit=crop",
                    recommended: false,
                    isSystem: false,
                    version: 2,
                    createdBy: "u1",
                    createdAt: new Date().toISOString()
                }
            ],
            isLoading: false,
            error: null,

            setTemplates: (templates) => set({ templates }),
            addTemplate: (template) => set((state) => ({ templates: [template, ...state.templates] })),
            updateTemplate: (id, updates) => set((state) => ({
                templates: state.templates.map(t => t.id === id ? { ...t, ...updates, version: t.version + 1 } : t)
            })),
            deleteTemplate: (id) => set((state) => ({
                templates: state.templates.filter(t => t.id !== id)
            })),
            setLoading: (isLoading) => set({ isLoading }),
            setError: (error) => set({ error })
        }),
        {
            name: 'cubicle-templates-storage',
            skipHydration: true
        }
    )
)
