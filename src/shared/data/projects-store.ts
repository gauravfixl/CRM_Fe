import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useIssueStore } from './issue-store'
import { useSprintStore } from './sprint-store'
import { useSprintEpicStore } from './sprint-epic-store'
import { useWorkflowStore } from './workflow-store'
import { useComponentStore } from './component-store'
import { useReleaseStore } from './release-store'

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
    setProjects: (projects: Project[]) => void
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
            setProjects: (nextProjects) => set(() => ({
                projects: nextProjects
            })),
            createProject: (projectData) => {
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
                set((state) => ({ projects: [newProject, ...state.projects] }))
                // Fire-and-forget audit event (dynamic import to avoid circular)
                import('./event-bridges').then(eb => eb.emitProjectCreated(newProject)).catch(() => {})
            },
            updateProject: (id, updates) => {
                const prev = get().projects.find(p => p.id === id)
                set((state) => ({
                    projects: state.projects.map(p => p.id === id ? { ...p, ...updates } : p)
                }))
                if (prev) {
                    const changes = Object.keys(updates)
                        .filter(k => (prev as any)[k] !== (updates as any)[k])
                        .map(k => ({ field: k, oldValue: (prev as any)[k], newValue: (updates as any)[k] }))
                    if (changes.length > 0) {
                        import('./event-bridges').then(eb => eb.emitProjectUpdated({ ...prev, ...updates }, changes)).catch(() => {})
                    }
                }
            },
            toggleStar: (id) => set((state) => ({
                projects: state.projects.map(p =>
                    p.id === id ? { ...p, starred: !p.starred } : p
                )
            })),
            getProjectById: (id) => get().projects.find(p => p.id === id),
            getProjectsByWorkspace: (workspaceId) => get().projects.filter(p => p.workspaceId === workspaceId),
            deleteProject: (id) => {
                const project = get().projects.find(p => p.id === id)
                if (project) {
                    import('./event-bridges').then(eb => eb.emitProjectDeleted(project)).catch(() => {})
                }
                // Cascade delete: remove all issues, sprints, epics, components, releases, workflow config
                try {
                    useIssueStore.getState().deleteIssuesByProject(id)
                } catch (e) { /* store may not be initialized yet */ }
                try {
                    const sprintStore = useSprintStore.getState()
                    sprintStore.sprints
                        .filter(s => s.projectId === id)
                        .forEach(s => {
                            // Soft-delete active sprints, hard-delete others
                            if (s.status !== "ACTIVE") sprintStore.deleteSprint(s.id)
                        })
                } catch (e) { /* ignore */ }
                try {
                    const epicStore = useSprintEpicStore.getState()
                    epicStore.epics.filter(e => e.projectId === id).forEach(e => epicStore.deleteEpic(e.id))
                    epicStore.sprints.filter(s => s.projectId === id).forEach(s => epicStore.deleteSprint(s.id))
                } catch (e) { /* ignore */ }
                try {
                    const wfStore = useWorkflowStore.getState()
                    if (wfStore.configs[id]) {
                        const next = { ...wfStore.configs }
                        delete next[id]
                        wfStore.setConfig(id, undefined as any)
                        // setConfig wraps in an object — easier to just reset directly via internal set
                        ;(useWorkflowStore as any).setState({ configs: next })
                    }
                } catch (e) { /* ignore */ }
                try {
                    const compStore = useComponentStore.getState()
                    compStore.components.filter(c => c.projectId === id).forEach(c => compStore.deleteComponent(c.id))
                } catch (e) { /* ignore */ }
                try {
                    const relStore = useReleaseStore.getState()
                    relStore.releases.filter(r => r.projectId === id).forEach(r => relStore.deleteRelease(r.id))
                } catch (e) { /* ignore */ }

                set((state) => ({
                    projects: state.projects.filter(p => p.id !== id)
                }))
            },
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
