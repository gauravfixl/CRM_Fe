import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ReleaseStatus = "UNRELEASED" | "PLANNED" | "RELEASED"

export interface Release {
    id: string
    name: string
    version: string
    description: string
    projectId: string
    status: ReleaseStatus
    targetDate: string
    releasedDate?: string
    issueIds: string[]
    createdAt: string
}

interface ReleaseStore {
    releases: Release[]
    addRelease: (release: Omit<Release, 'id' | 'createdAt' | 'issueIds'>) => Release
    updateRelease: (id: string, updates: Partial<Release>) => void
    deleteRelease: (id: string) => void
    getReleasesByProject: (projectId: string) => Release[]
    getReleaseById: (id: string) => Release | undefined
    attachIssue: (releaseId: string, issueId: string) => void
    detachIssue: (releaseId: string, issueId: string) => void
    markReleased: (id: string) => void
}

const INITIAL: Release[] = [
    { id: "rel1", name: "Spring Launch", version: "v2.0.0", description: "Auth + new dashboard.", projectId: "p1", status: "PLANNED", targetDate: "2026-06-15", issueIds: [], createdAt: new Date().toISOString() },
    { id: "rel2", name: "Mobile MVP", version: "v0.9.0", description: "Initial beta.", projectId: "p2", status: "UNRELEASED", targetDate: "2026-08-01", issueIds: [], createdAt: new Date().toISOString() },
]

export const useReleaseStore = create<ReleaseStore>()(
    persist(
        (set, get) => ({
            releases: INITIAL,

            addRelease: (data) => {
                const newRelease: Release = {
                    ...data,
                    id: `rel-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
                    issueIds: [],
                    createdAt: new Date().toISOString(),
                }
                set(state => ({ releases: [newRelease, ...state.releases] }))
                return newRelease
            },

            updateRelease: (id, updates) => set(state => ({
                releases: state.releases.map(r => r.id === id ? { ...r, ...updates } : r)
            })),

            deleteRelease: (id) => set(state => ({
                releases: state.releases.filter(r => r.id !== id)
            })),

            getReleasesByProject: (projectId) => get().releases.filter(r => r.projectId === projectId),
            getReleaseById: (id) => get().releases.find(r => r.id === id),

            attachIssue: (releaseId, issueId) => set(state => ({
                releases: state.releases.map(r =>
                    r.id === releaseId && !r.issueIds.includes(issueId)
                        ? { ...r, issueIds: [...r.issueIds, issueId] }
                        : r
                )
            })),

            detachIssue: (releaseId, issueId) => set(state => ({
                releases: state.releases.map(r =>
                    r.id === releaseId
                        ? { ...r, issueIds: r.issueIds.filter(id => id !== issueId) }
                        : r
                )
            })),

            markReleased: (id) => set(state => ({
                releases: state.releases.map(r =>
                    r.id === id
                        ? { ...r, status: "RELEASED" as const, releasedDate: new Date().toISOString() }
                        : r
                )
            })),
        }),
        {
            name: 'cubicle-releases-storage',
            skipHydration: true,
        }
    )
)
