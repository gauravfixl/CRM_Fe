import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type VersionStatus = 'unreleased' | 'released' | 'archived'

export interface Version {
    id: string
    projectId: string
    name: string
    description: string
    startDate: string
    releaseDate: string
    status: VersionStatus
    issueIds: string[]
}

interface VersionStore {
    versions: Version[]
    addVersion: (version: Version) => void
    updateVersion: (versionId: string, updates: Partial<Version>) => void
    deleteVersion: (versionId: string) => void
    releaseVersion: (versionId: string) => void
    archiveVersion: (versionId: string) => void
    getVersionsByProject: (projectId: string) => Version[]
    getVersionById: (versionId: string) => Version | undefined
    linkIssue: (versionId: string, issueId: string) => void
    unlinkIssue: (versionId: string, issueId: string) => void
    moveUnfinishedIssues: (fromVersionId: string, toVersionId: string, unfinishedIssueIds: string[]) => void
}

const INITIAL_VERSIONS: Version[] = [
    {
        id: "ver-01",
        projectId: "p1",
        name: "v1.0 - Initial Release",
        description: "Core authentication, dashboard, and project setup features.",
        startDate: "2025-09-01T00:00:00.000Z",
        releaseDate: "2025-11-15T00:00:00.000Z",
        status: "released",
        issueIds: ["ISSUE-01"]
    },
    {
        id: "ver-02",
        projectId: "p1",
        name: "v1.1 - Patch Release",
        description: "Bug fixes and performance improvements for the dashboard.",
        startDate: "2025-11-20T00:00:00.000Z",
        releaseDate: "2025-12-10T00:00:00.000Z",
        status: "released",
        issueIds: []
    },
    {
        id: "ver-03",
        projectId: "p1",
        name: "v2.0 - Major Update",
        description: "New sprint management, board views, and reporting features.",
        startDate: "2026-01-05T00:00:00.000Z",
        releaseDate: "2026-04-30T00:00:00.000Z",
        status: "unreleased",
        issueIds: ["ISSUE-02", "ISSUE-03"]
    },
    {
        id: "ver-04",
        projectId: "p1",
        name: "v2.1 - Planned",
        description: "Advanced analytics, integrations, and automation features.",
        startDate: "2026-05-01T00:00:00.000Z",
        releaseDate: "2026-07-31T00:00:00.000Z",
        status: "unreleased",
        issueIds: []
    }
]

export const useVersionStore = create<VersionStore>()(
    persist(
        (set, get) => ({
            versions: INITIAL_VERSIONS,

            addVersion: (version) => set((state) => ({
                versions: [...state.versions, version]
            })),

            updateVersion: (versionId, updates) => set((state) => ({
                versions: state.versions.map(v =>
                    v.id === versionId ? { ...v, ...updates } : v
                )
            })),

            deleteVersion: (versionId) => set((state) => ({
                versions: state.versions.filter(v => v.id !== versionId)
            })),

            releaseVersion: (versionId) => set((state) => ({
                versions: state.versions.map(v =>
                    v.id === versionId
                        ? { ...v, status: 'released' as VersionStatus, releaseDate: new Date().toISOString() }
                        : v
                )
            })),

            archiveVersion: (versionId) => set((state) => ({
                versions: state.versions.map(v =>
                    v.id === versionId
                        ? { ...v, status: 'archived' as VersionStatus }
                        : v
                )
            })),

            getVersionsByProject: (projectId) =>
                get().versions.filter(v => v.projectId === projectId),

            getVersionById: (versionId) =>
                get().versions.find(v => v.id === versionId),

            linkIssue: (versionId, issueId) => set((state) => ({
                versions: state.versions.map(v =>
                    v.id === versionId && !v.issueIds.includes(issueId)
                        ? { ...v, issueIds: [...v.issueIds, issueId] }
                        : v
                )
            })),

            unlinkIssue: (versionId, issueId) => set((state) => ({
                versions: state.versions.map(v =>
                    v.id === versionId
                        ? { ...v, issueIds: v.issueIds.filter(id => id !== issueId) }
                        : v
                )
            })),

            moveUnfinishedIssues: (fromVersionId, toVersionId, unfinishedIssueIds) => set((state) => ({
                versions: state.versions.map(v => {
                    if (v.id === fromVersionId) {
                        return { ...v, issueIds: v.issueIds.filter(id => !unfinishedIssueIds.includes(id)) }
                    }
                    if (v.id === toVersionId) {
                        const newIds = unfinishedIssueIds.filter(id => !v.issueIds.includes(id))
                        return { ...v, issueIds: [...v.issueIds, ...newIds] }
                    }
                    return v
                })
            }))
        }),
        {
            name: 'cubicle-versions-storage',
            skipHydration: true
        }
    )
)
