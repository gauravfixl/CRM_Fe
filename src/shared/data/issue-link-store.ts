import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type LinkType = 'blocks' | 'is_blocked_by' | 'relates_to' | 'duplicates' | 'is_duplicated_by' | 'clones'

export interface IssueLink {
    id: string
    sourceIssueId: string
    sourceIssueTitle: string
    targetIssueId: string
    targetIssueTitle: string
    linkType: LinkType
    createdBy: string
    createdAt: string
}

interface IssueLinkStore {
    links: IssueLink[]
    addLink: (link: IssueLink) => void
    updateLink: (linkId: string, updates: Partial<IssueLink>) => void
    deleteLink: (linkId: string) => void
    getLinksByIssue: (issueId: string) => IssueLink[]
    getLinksByType: (linkType: LinkType) => IssueLink[]
    getBlockedIssues: () => IssueLink[]
    getBlockingIssues: () => IssueLink[]
}

const INITIAL_LINKS: IssueLink[] = [
    {
        id: "link-01",
        sourceIssueId: "ISSUE-03",
        sourceIssueTitle: "Fix Sidebar Z-Index",
        targetIssueId: "ISSUE-02",
        targetIssueTitle: "UI Responsive Review",
        linkType: "blocks",
        createdBy: "John Doe",
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
    },
    {
        id: "link-02",
        sourceIssueId: "ISSUE-02",
        sourceIssueTitle: "UI Responsive Review",
        targetIssueId: "ISSUE-03",
        targetIssueTitle: "Fix Sidebar Z-Index",
        linkType: "is_blocked_by",
        createdBy: "Jane Smith",
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
    },
    {
        id: "link-03",
        sourceIssueId: "ISSUE-01",
        sourceIssueTitle: "Implement Auth Middleware",
        targetIssueId: "ISSUE-02",
        targetIssueTitle: "UI Responsive Review",
        linkType: "relates_to",
        createdBy: "John Doe",
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
    },
    {
        id: "link-04",
        sourceIssueId: "ISSUE-01",
        sourceIssueTitle: "Implement Auth Middleware",
        targetIssueId: "ISSUE-03",
        targetIssueTitle: "Fix Sidebar Z-Index",
        linkType: "relates_to",
        createdBy: "Jane Smith",
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
        id: "link-05",
        sourceIssueId: "ISSUE-03",
        sourceIssueTitle: "Fix Sidebar Z-Index",
        targetIssueId: "ISSUE-01",
        targetIssueTitle: "Implement Auth Middleware",
        linkType: "duplicates",
        createdBy: "John Doe",
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
    },
    {
        id: "link-06",
        sourceIssueId: "ISSUE-02",
        sourceIssueTitle: "UI Responsive Review",
        targetIssueId: "ISSUE-01",
        targetIssueTitle: "Implement Auth Middleware",
        linkType: "clones",
        createdBy: "Jane Smith",
        createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
    }
]

export const useIssueLinkStore = create<IssueLinkStore>()(
    persist(
        (set, get) => ({
            links: INITIAL_LINKS,

            addLink: (link) => set((state) => ({
                links: [link, ...state.links]
            })),

            updateLink: (linkId, updates) => set((state) => ({
                links: state.links.map(l => l.id === linkId ? { ...l, ...updates } : l)
            })),

            deleteLink: (linkId) => set((state) => ({
                links: state.links.filter(l => l.id !== linkId)
            })),

            getLinksByIssue: (issueId) =>
                get().links.filter(l => l.sourceIssueId === issueId || l.targetIssueId === issueId),

            getLinksByType: (linkType) =>
                get().links.filter(l => l.linkType === linkType),

            getBlockedIssues: () =>
                get().links.filter(l => l.linkType === 'is_blocked_by'),

            getBlockingIssues: () =>
                get().links.filter(l => l.linkType === 'blocks'),
        }),
        {
            name: 'cubicle-issue-links-storage',
            skipHydration: true,
        }
    )
)
