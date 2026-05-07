import { create } from "zustand"

export interface ScmCategory {
    id: string
    name: string
    parent: string
    description: string
    status: "Active" | "Inactive"
}

export interface ScmUnit {
    id: string
    name: string
    abbreviation: string
    type: "Count" | "Weight" | "Volume" | "Length"
    status: "Active" | "Inactive"
}

export interface ScmTaxRate {
    id: string
    name: string
    percentage: number
    region: string
    status: "Active" | "Inactive"
}

interface State {
    categories: ScmCategory[]
    units: ScmUnit[]
    taxes: ScmTaxRate[]
    addCategory: (c: Omit<ScmCategory, "id">) => void
    updateCategory: (id: string, p: Partial<ScmCategory>) => void
    deleteCategory: (id: string) => void
    addUnit: (u: Omit<ScmUnit, "id">) => void
    updateUnit: (id: string, p: Partial<ScmUnit>) => void
    deleteUnit: (id: string) => void
    addTax: (t: Omit<ScmTaxRate, "id">) => void
    updateTax: (id: string, p: Partial<ScmTaxRate>) => void
    deleteTax: (id: string) => void
}

const id = (prefix: string) => `${prefix}_` + Math.random().toString(36).slice(2, 10)

export const useScmSettingsStore = create<State>((set) => ({
    categories: [
        { id: "cat_01", name: "Stationery", parent: "—", description: "Office stationery", status: "Active" },
        { id: "cat_02", name: "Electronics", parent: "—", description: "Electronic gadgets and devices", status: "Active" },
        { id: "cat_03", name: "Packaging", parent: "—", description: "Cartons, wraps, fillers", status: "Active" },
        { id: "cat_04", name: "Merchandise", parent: "—", description: "Branded goods", status: "Active" },
        { id: "cat_05", name: "Raw Material", parent: "—", description: "Inputs for manufacturing", status: "Active" },
    ],
    units: [
        { id: "u_01", name: "Piece", abbreviation: "PCS", type: "Count", status: "Active" },
        { id: "u_02", name: "Box", abbreviation: "BOX", type: "Count", status: "Active" },
        { id: "u_03", name: "Kilogram", abbreviation: "KG", type: "Weight", status: "Active" },
        { id: "u_04", name: "Gram", abbreviation: "G", type: "Weight", status: "Active" },
        { id: "u_05", name: "Litre", abbreviation: "L", type: "Volume", status: "Active" },
        { id: "u_06", name: "Meter", abbreviation: "M", type: "Length", status: "Active" },
        { id: "u_07", name: "Dozen", abbreviation: "DZ", type: "Count", status: "Active" },
        { id: "u_08", name: "Carton", abbreviation: "CTN", type: "Count", status: "Active" },
        { id: "u_09", name: "Ream", abbreviation: "RM", type: "Count", status: "Active" },
    ],
    taxes: [
        { id: "tx_01", name: "GST 5%", percentage: 5, region: "India", status: "Active" },
        { id: "tx_02", name: "GST 12%", percentage: 12, region: "India", status: "Active" },
        { id: "tx_03", name: "GST 18%", percentage: 18, region: "India", status: "Active" },
        { id: "tx_04", name: "GST 28%", percentage: 28, region: "India", status: "Active" },
        { id: "tx_05", name: "VAT 5%", percentage: 5, region: "United Arab Emirates", status: "Inactive" },
    ],
    addCategory: (c) => set((s) => ({ categories: [{ id: id("cat"), ...c }, ...s.categories] })),
    updateCategory: (id, p) => set((s) => ({ categories: s.categories.map((c) => (c.id === id ? { ...c, ...p } : c)) })),
    deleteCategory: (id) => set((s) => ({ categories: s.categories.filter((c) => c.id !== id) })),
    addUnit: (u) => set((s) => ({ units: [{ id: id("u"), ...u }, ...s.units] })),
    updateUnit: (id, p) => set((s) => ({ units: s.units.map((u) => (u.id === id ? { ...u, ...p } : u)) })),
    deleteUnit: (id) => set((s) => ({ units: s.units.filter((u) => u.id !== id) })),
    addTax: (t) => set((s) => ({ taxes: [{ id: id("tx"), ...t }, ...s.taxes] })),
    updateTax: (id, p) => set((s) => ({ taxes: s.taxes.map((t) => (t.id === id ? { ...t, ...p } : t)) })),
    deleteTax: (id) => set((s) => ({ taxes: s.taxes.filter((t) => t.id !== id) })),
}))
