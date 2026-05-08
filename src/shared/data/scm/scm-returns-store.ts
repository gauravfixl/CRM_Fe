import { create } from "zustand"

export type CustomerReturnStatus =
    | "Requested"
    | "Approved"
    | "Picked Up"
    | "Received"
    | "Inspected"
    | "Refunded"
    | "Replaced"
    | "Rejected"

export interface ScmCustomerReturn {
    id: string
    returnId: string
    orderNumber: string
    customerName: string
    productId: string
    productName: string
    sku: string
    quantity: number
    reason: string
    returnDate: string
    status: CustomerReturnStatus
    refundAmount: number
    remarks: string
    createdAt: string
}

export type DamageStatus = "Reported" | "Investigated" | "Written Off" | "Repaired" | "Replaced"
export interface ScmDamageRecord {
    id: string
    damageId: string
    productId: string
    productName: string
    sku: string
    warehouse: string
    quantity: number
    damageReason: string
    reportedBy: string
    reportedDate: string
    actionTaken: string
    status: DamageStatus
    remarks: string
    createdAt: string
}

interface State {
    customerReturns: ScmCustomerReturn[]
    damages: ScmDamageRecord[]

    addCustomerReturn: (r: Omit<ScmCustomerReturn, "id" | "createdAt">) => void
    updateCustomerReturn: (id: string, p: Partial<ScmCustomerReturn>) => void
    deleteCustomerReturn: (id: string) => void

    addDamage: (d: Omit<ScmDamageRecord, "id" | "createdAt">) => void
    updateDamage: (id: string, p: Partial<ScmDamageRecord>) => void
    deleteDamage: (id: string) => void
}

const today = () => new Date().toISOString().slice(0, 10)
const id = (prefix: string) => `${prefix}_` + Math.random().toString(36).slice(2, 10)

export const useScmReturnsStore = create<State>((set) => ({
    customerReturns: [
        { id: "cret_001", returnId: "RET-401", orderNumber: "SO-3082", customerName: "Acme Corp", productId: "p_1002", productName: "Ballpoint Pen Blue", sku: "PRD-1002", quantity: 2, reason: "Wrong item shipped", returnDate: "2026-05-04", status: "Approved", refundAmount: 320, remarks: "Pending pickup scheduled", createdAt: "2026-05-04" },
        { id: "cret_002", returnId: "RET-400", orderNumber: "SO-3081", customerName: "BlueWave Ltd", productId: "p_1005", productName: "Stainless Steel Bottle 750ml", sku: "PRD-1005", quantity: 5, reason: "Defective product", returnDate: "2026-05-03", status: "Refunded", refundAmount: 2245, remarks: "Refund processed", createdAt: "2026-05-03" },
        { id: "cret_003", returnId: "RET-399", orderNumber: "SO-3080", customerName: "Tech Innovate", productId: "p_1003", productName: "Wireless Mouse", sku: "PRD-1003", quantity: 3, reason: "Customer changed mind", returnDate: "2026-04-30", status: "Inspected", refundAmount: 1797, remarks: "Items in good condition", createdAt: "2026-04-30" },
    ],
    damages: [
        { id: "dmg_001", damageId: "DMG-201", productId: "p_1003", productName: "Wireless Mouse", sku: "PRD-1003", warehouse: "North Warehouse", quantity: 4, damageReason: "Water damage", reportedBy: "Anita Verma", reportedDate: "2026-05-03", actionTaken: "Written off from stock", status: "Written Off", remarks: "Insurance claim filed", createdAt: "2026-05-03" },
        { id: "dmg_002", damageId: "DMG-200", productId: "p_1004", productName: "Cardboard Carton 12x10x8", sku: "PRD-1004", warehouse: "South Warehouse", quantity: 20, damageReason: "Crushed during transit", reportedBy: "Kiran Rao", reportedDate: "2026-04-26", actionTaken: "Vendor replacement requested", status: "Replaced", remarks: "Replacement delivered", createdAt: "2026-04-26" },
    ],

    addCustomerReturn: (r) => set((s) => ({ customerReturns: [{ id: id("cret"), createdAt: today(), ...r }, ...s.customerReturns] })),
    updateCustomerReturn: (id, p) => set((s) => ({ customerReturns: s.customerReturns.map((r) => (r.id === id ? { ...r, ...p } : r)) })),
    deleteCustomerReturn: (id) => set((s) => ({ customerReturns: s.customerReturns.filter((r) => r.id !== id) })),

    addDamage: (d) => set((s) => ({ damages: [{ id: id("dmg"), createdAt: today(), ...d }, ...s.damages] })),
    updateDamage: (id, p) => set((s) => ({ damages: s.damages.map((r) => (r.id === id ? { ...r, ...p } : r)) })),
    deleteDamage: (id) => set((s) => ({ damages: s.damages.filter((r) => r.id !== id) })),
}))

export const CUSTOMER_RETURN_STATUSES: CustomerReturnStatus[] = ["Requested", "Approved", "Picked Up", "Received", "Inspected", "Refunded", "Replaced", "Rejected"]
export const DAMAGE_STATUSES: DamageStatus[] = ["Reported", "Investigated", "Written Off", "Repaired", "Replaced"]
export const CUSTOMER_RETURN_REASONS = ["Wrong item shipped", "Defective product", "Damaged in transit", "Customer changed mind", "Quality issue", "Late delivery", "Other"]
export const DAMAGE_REASONS = ["Water damage", "Crushed during transit", "Mishandling", "Expired", "Manufacturing defect", "Theft", "Fire", "Other"]
