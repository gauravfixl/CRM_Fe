import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Column {
    id: string
    name: string
    key: string
    color: string
    order: number
    limit?: number // WIP limit for Kanban
}

export interface Transition {
    from: string
    to: string
    rule?: string
    requiresApproval?: boolean
}

export interface BoardConfig {
    boardId: string
    projectId: string
    columns: Column[]
    transitions: Transition[]
    isLocked?: boolean // Prevent accidental workflow changes
}

interface WorkflowStore {
    configs: Record<string, BoardConfig> // Keyed by projectId

    // Actions
    setConfig: (projectId: string, config: BoardConfig) => void
    updateColumns: (projectId: string, columns: Column[]) => void
    updateTransitions: (projectId: string, transitions: Transition[]) => void
    addColumn: (projectId: string, column: Omit<Column, 'id' | 'order'>) => void
    updateColumn: (projectId: string, columnId: string, updates: Partial<Column>) => void
    deleteColumn: (projectId: string, columnId: string) => void
    moveColumn: (projectId: string, columnId: string, direction: 'left' | 'right') => void
    getConfig: (projectId: string) => BoardConfig
    canTransition: (projectId: string, from: string, to: string) => boolean
    getAllowedTransitions: (projectId: string, currentState: string) => string[]
    validateWorkflowState: (projectId: string, state: string) => boolean
}

const DEFAULT_COLUMNS: Column[] = [
    { id: "c1", name: "To Do", key: "TODO", color: "#64748b", order: 0 },
    { id: "c2", name: "In Progress", key: "IN_PROGRESS", color: "#6366f1", order: 1 },
    { id: "c3", name: "In Review", key: "IN_REVIEW", color: "#8b5cf6", order: 2 },
    { id: "c4", name: "Done", key: "DONE", color: "#10b981", order: 3 },
]

export const useWorkflowStore = create<WorkflowStore>()(
    persist(
        (set, get) => ({
            configs: {},

            setConfig: (projectId, config) => set((state) => ({
                configs: { ...state.configs, [projectId]: config }
            })),

            updateColumns: (projectId, columns) => set((state) => {
                const config = state.configs[projectId] || {
                    boardId: `b-${projectId}`,
                    projectId,
                    columns: [],
                    transitions: []
                }
                return {
                    configs: {
                        ...state.configs,
                        [projectId]: { ...config, columns }
                    }
                }
            }),

            updateTransitions: (projectId, transitions) => set((state) => {
                const config = state.configs[projectId] || {
                    boardId: `b-${projectId}`,
                    projectId,
                    columns: [],
                    transitions: []
                }
                return {
                    configs: {
                        ...state.configs,
                        [projectId]: { ...config, transitions }
                    }
                }
            }),

            addColumn: (projectId, columnData) => set((state) => {
                const config = get().getConfig(projectId)
                const newColumn: Column = {
                    ...columnData,
                    id: `col-${Date.now()}`,
                    order: config.columns.length
                }

                // Auto-generate transitions to/from new column
                const newTransitions: Transition[] = []
                config.columns.forEach(col => {
                    newTransitions.push({ from: col.key, to: newColumn.key })
                    newTransitions.push({ from: newColumn.key, to: col.key })
                })

                return {
                    configs: {
                        ...state.configs,
                        [projectId]: {
                            ...config,
                            columns: [...config.columns, newColumn],
                            transitions: [...config.transitions, ...newTransitions]
                        }
                    }
                }
            }),

            updateColumn: (projectId, columnId, updates) => set((state) => {
                const config = get().getConfig(projectId)
                const oldColumn = config.columns.find(c => c.id === columnId)

                return {
                    configs: {
                        ...state.configs,
                        [projectId]: {
                            ...config,
                            columns: config.columns.map(c =>
                                c.id === columnId ? { ...c, ...updates } : c
                            ),
                            // Update transitions if key changed
                            transitions: updates.key && oldColumn
                                ? config.transitions.map(t => ({
                                    from: t.from === oldColumn.key ? updates.key! : t.from,
                                    to: t.to === oldColumn.key ? updates.key! : t.to,
                                    rule: t.rule,
                                    requiresApproval: t.requiresApproval
                                }))
                                : config.transitions
                        }
                    }
                }
            }),

            deleteColumn: (projectId, columnId) => set((state) => {
                const config = get().getConfig(projectId)
                const columnToDelete = config.columns.find(c => c.id === columnId)
                if (!columnToDelete) return state

                return {
                    configs: {
                        ...state.configs,
                        [projectId]: {
                            ...config,
                            columns: config.columns.filter(c => c.id !== columnId),
                            transitions: config.transitions.filter(
                                t => t.from !== columnToDelete.key && t.to !== columnToDelete.key
                            )
                        }
                    }
                }
            }),

            moveColumn: (projectId, columnId, direction) => set((state) => {
                const config = get().getConfig(projectId)
                const columns = [...config.columns]
                const index = columns.findIndex(c => c.id === columnId)
                if (index === -1) return state

                const newIndex = direction === 'left' ? index - 1 : index + 1
                if (newIndex < 0 || newIndex >= columns.length) return state

                const [movedColumn] = columns.splice(index, 1)
                columns.splice(newIndex, 0, movedColumn)

                // Update orders
                const updatedColumns = columns.map((col, i) => ({ ...col, order: i }))

                return {
                    configs: {
                        ...state.configs,
                        [projectId]: {
                            ...config,
                            columns: updatedColumns
                        }
                    }
                }
            }),

            getConfig: (projectId) => {
                const config = get().configs[projectId]
                if (!config) {
                    return {
                        boardId: `b-${projectId}`,
                        projectId,
                        columns: DEFAULT_COLUMNS,
                        transitions: []
                    }
                }
                return config
            },

            canTransition: (projectId, from, to) => {
                const config = get().configs[projectId]
                if (!config || config.transitions.length === 0) return true
                return config.transitions.some(t => t.from === from && t.to === to)
            },

            getAllowedTransitions: (projectId, currentState) => {
                const config = get().configs[projectId]
                if (!config || config.transitions.length === 0) {
                    return config?.columns.map(c => c.key) || []
                }
                return config.transitions
                    .filter(t => t.from === currentState)
                    .map(t => t.to)
            },

            validateWorkflowState: (projectId, state) => {
                const config = get().getConfig(projectId)
                return config.columns.some(c => c.key === state)
            }
        }),
        {
            name: 'cubicle-workflow-storage',
            skipHydration: true
        }
    )
)

