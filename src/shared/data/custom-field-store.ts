import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type FieldType = "TEXT" | "NUMBER" | "DATE" | "SELECT" | "BOOLEAN"

export interface CustomField {
    id: string
    name: string
    type: FieldType
    required: boolean
    description: string
    options?: string[] // For SELECT type
    createdAt: string
}

interface CustomFieldStore {
    fields: CustomField[]
    addField: (data: Omit<CustomField, 'id' | 'createdAt'>) => CustomField
    updateField: (id: string, updates: Partial<CustomField>) => void
    deleteField: (id: string) => void
    getFieldById: (id: string) => CustomField | undefined
}

const INITIAL: CustomField[] = [
    { id: "f1", name: "Story Points", type: "NUMBER", required: false, description: "Estimation in points", createdAt: new Date().toISOString() },
    { id: "f2", name: "Customer", type: "TEXT", required: false, description: "Customer requesting the work", createdAt: new Date().toISOString() },
]

export const useCustomFieldStore = create<CustomFieldStore>()(
    persist(
        (set, get) => ({
            fields: INITIAL,

            addField: (data) => {
                const newField: CustomField = {
                    ...data,
                    id: `cf-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
                    createdAt: new Date().toISOString(),
                }
                set(state => ({ fields: [newField, ...state.fields] }))
                return newField
            },

            updateField: (id, updates) => set(state => ({
                fields: state.fields.map(f => f.id === id ? { ...f, ...updates } : f)
            })),

            deleteField: (id) => set(state => ({
                fields: state.fields.filter(f => f.id !== id)
            })),

            getFieldById: (id) => get().fields.find(f => f.id === id),
        }),
        {
            name: 'cubicle-custom-fields-storage',
            skipHydration: true,
        }
    )
)
