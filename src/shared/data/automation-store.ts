import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type TriggerType = "ISSUE_CREATED" | "ISSUE_UPDATED" | "STATUS_CHANGED" | "DUE_DATE_REACHED" | "ASSIGNED"
export type ActionType = "ASSIGN_USER" | "ADD_COMMENT" | "MOVE_TO_STATUS" | "NOTIFY_SLACK" | "SET_PRIORITY"

export interface AutomationRule {
    id: string
    name: string
    description: string
    trigger: TriggerType
    action: ActionType
    actionPayload?: Record<string, any>
    triggerCondition?: Record<string, any>
    projectId?: string // null = applies to all projects
    enabled: boolean
    runs: number
    lastRun?: string
    createdAt: string
}

interface AutomationStore {
    rules: AutomationRule[]
    addRule: (data: Omit<AutomationRule, 'id' | 'runs' | 'createdAt'>) => AutomationRule
    updateRule: (id: string, updates: Partial<AutomationRule>) => void
    deleteRule: (id: string) => void
    toggleRule: (id: string) => void
    incrementRun: (id: string) => void
    getRulesByTrigger: (trigger: TriggerType, projectId?: string) => AutomationRule[]
    runRulesFor: (trigger: TriggerType, payload: Record<string, any>) => string[] // returns rule ids that fired
}

const INITIAL: AutomationRule[] = [
    { id: "r1", name: "Auto-assign bugs to QA", description: "Assigns any new bug to the QA group", trigger: "ISSUE_CREATED", action: "ASSIGN_USER", enabled: true, runs: 42, lastRun: "2026-05-10", createdAt: new Date().toISOString() },
    { id: "r2", name: "Notify Slack on Done", description: "Sends a Slack ping when an issue reaches Done", trigger: "STATUS_CHANGED", action: "NOTIFY_SLACK", enabled: true, runs: 17, lastRun: "2026-05-11", createdAt: new Date().toISOString() },
]

export const useAutomationStore = create<AutomationStore>()(
    persist(
        (set, get) => ({
            rules: INITIAL,

            addRule: (data) => {
                const newRule: AutomationRule = {
                    ...data,
                    id: `rule-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
                    runs: 0,
                    createdAt: new Date().toISOString(),
                }
                set(state => ({ rules: [newRule, ...state.rules] }))
                return newRule
            },

            updateRule: (id, updates) => set(state => ({
                rules: state.rules.map(r => r.id === id ? { ...r, ...updates } : r)
            })),

            deleteRule: (id) => set(state => ({
                rules: state.rules.filter(r => r.id !== id)
            })),

            toggleRule: (id) => set(state => ({
                rules: state.rules.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r)
            })),

            incrementRun: (id) => set(state => ({
                rules: state.rules.map(r =>
                    r.id === id
                        ? { ...r, runs: r.runs + 1, lastRun: new Date().toISOString() }
                        : r
                )
            })),

            getRulesByTrigger: (trigger, projectId) => {
                return get().rules.filter(r =>
                    r.enabled &&
                    r.trigger === trigger &&
                    (!r.projectId || !projectId || r.projectId === projectId)
                )
            },

            runRulesFor: (trigger, payload) => {
                const matched = get().rules.filter(r => r.enabled && r.trigger === trigger)
                const fired: string[] = []
                matched.forEach(r => {
                    // Frontend-only simulation: increment run count
                    get().incrementRun(r.id)
                    fired.push(r.id)
                    console.log(`[Automation] Rule "${r.name}" fired:`, payload)
                })
                return fired
            },
        }),
        {
            name: 'cubicle-automation-storage',
            skipHydration: true,
        }
    )
)
