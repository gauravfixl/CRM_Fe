import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Integration {
    id: string
    title: string
    description: string
    icon: string
    enabled: boolean
    connectedAt?: string
}

interface IntegrationStore {
    integrations: Integration[]
    toggleIntegration: (id: string) => void
    enableIntegration: (id: string) => void
    disableIntegration: (id: string) => void
}

const INITIAL: Integration[] = [
    { id: "slack", title: "Slack Connect", description: "Sync task updates and mentions to your Slack channels.", icon: "💬", enabled: false },
    { id: "gcal", title: "Google Calendar", description: "Auto-sync project deadlines to your organizational calendar.", icon: "📆", enabled: false },
    { id: "github", title: "GitHub Actions", description: "Trigger workflow transitions based on PR merges and commits.", icon: "🐙", enabled: false },
    { id: "stripe", title: "Stripe Billing", description: "Manage project-based billing and enterprise invoices.", icon: "💳", enabled: false },
    { id: "jira", title: "Jira Import", description: "Migrate issues, sprints, and projects from a Jira workspace.", icon: "🔵", enabled: false },
    { id: "linear", title: "Linear Sync", description: "Two-way sync of issues and cycles with Linear.", icon: "⚡", enabled: false },
]

export const useIntegrationStore = create<IntegrationStore>()(
    persist(
        (set) => ({
            integrations: INITIAL,
            toggleIntegration: (id) => set((state) => ({
                integrations: state.integrations.map(i =>
                    i.id === id
                        ? { ...i, enabled: !i.enabled, connectedAt: !i.enabled ? new Date().toISOString() : i.connectedAt }
                        : i
                )
            })),
            enableIntegration: (id) => set((state) => ({
                integrations: state.integrations.map(i =>
                    i.id === id ? { ...i, enabled: true, connectedAt: new Date().toISOString() } : i
                )
            })),
            disableIntegration: (id) => set((state) => ({
                integrations: state.integrations.map(i =>
                    i.id === id ? { ...i, enabled: false } : i
                )
            })),
        }),
        {
            name: 'cubicle-integrations-storage',
            skipHydration: true,
        }
    )
)
