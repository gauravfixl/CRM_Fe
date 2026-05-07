import { create } from "zustand"

// Bin / Rack
export type BinStatus = "Available" | "Occupied" | "Reserved" | "Damaged" | "Inactive"
export interface ScmBin {
    id: string
    warehouse: string
    zone: string
    rackNumber: string
    binNumber: string
    capacity: number
    productAssigned: string
    status: BinStatus
}

// Warehouse Transfer
export type TransferStatus = "Draft" | "Approved" | "In Transit" | "Received" | "Cancelled"
export interface ScmTransfer {
    id: string
    transferNumber: string
    fromWarehouse: string
    toWarehouse: string
    productId: string
    productName: string
    sku: string
    quantity: number
    transferDate: string
    expectedArrivalDate: string
    status: TransferStatus
    remarks: string
    createdAt: string
}

// Stock Adjustment
export type AdjustmentType = "Increase Stock" | "Decrease Stock" | "Correction" | "Damage Write-Off"
export interface ScmAdjustment {
    id: string
    adjustmentNumber: string
    productId: string
    productName: string
    sku: string
    warehouse: string
    currentQuantity: number
    adjustedQuantity: number
    adjustmentType: AdjustmentType
    reason: string
    approvedBy: string
    adjustmentDate: string
    remarks: string
    createdAt: string
}

interface State {
    bins: ScmBin[]
    transfers: ScmTransfer[]
    adjustments: ScmAdjustment[]

    addBin: (b: Omit<ScmBin, "id">) => void
    updateBin: (id: string, p: Partial<ScmBin>) => void
    deleteBin: (id: string) => void

    addTransfer: (t: Omit<ScmTransfer, "id" | "createdAt">) => void
    updateTransfer: (id: string, p: Partial<ScmTransfer>) => void
    deleteTransfer: (id: string) => void

    addAdjustment: (a: Omit<ScmAdjustment, "id" | "createdAt">) => void
    updateAdjustment: (id: string, p: Partial<ScmAdjustment>) => void
    deleteAdjustment: (id: string) => void
}

const today = () => new Date().toISOString().slice(0, 10)
const id = (prefix: string) => `${prefix}_` + Math.random().toString(36).slice(2, 10)

export const useScmWarehouseOpsStore = create<State>((set) => ({
    bins: [
        { id: "b_001", warehouse: "Central Warehouse", zone: "Zone A", rackNumber: "R-01", binNumber: "B-101", capacity: 200, productAssigned: "PRD-1001", status: "Occupied" },
        { id: "b_002", warehouse: "Central Warehouse", zone: "Zone A", rackNumber: "R-01", binNumber: "B-102", capacity: 200, productAssigned: "PRD-1002", status: "Occupied" },
        { id: "b_003", warehouse: "Central Warehouse", zone: "Zone B", rackNumber: "R-04", binNumber: "B-401", capacity: 150, productAssigned: "—", status: "Available" },
        { id: "b_004", warehouse: "North Warehouse", zone: "Zone A", rackNumber: "R-02", binNumber: "B-201", capacity: 100, productAssigned: "PRD-1003", status: "Occupied" },
        { id: "b_005", warehouse: "South Warehouse", zone: "Zone C", rackNumber: "R-05", binNumber: "B-503", capacity: 300, productAssigned: "—", status: "Reserved" },
        { id: "b_006", warehouse: "South Warehouse", zone: "Zone D", rackNumber: "R-08", binNumber: "B-810", capacity: 100, productAssigned: "—", status: "Damaged" },
    ],
    transfers: [
        { id: "tr_001", transferNumber: "TRF-1801", fromWarehouse: "Central Warehouse", toWarehouse: "North Warehouse", productId: "p_1001", productName: "A4 Premium Copier Paper", sku: "PRD-1001", quantity: 50, transferDate: "2026-05-03", expectedArrivalDate: "2026-05-06", status: "In Transit", remarks: "Restock for North zone", createdAt: "2026-05-03" },
        { id: "tr_002", transferNumber: "TRF-1800", fromWarehouse: "South Warehouse", toWarehouse: "Central Warehouse", productId: "p_1004", productName: "Cardboard Carton 12x10x8", sku: "PRD-1004", quantity: 200, transferDate: "2026-04-28", expectedArrivalDate: "2026-04-30", status: "Received", remarks: "", createdAt: "2026-04-28" },
        { id: "tr_003", transferNumber: "TRF-1799", fromWarehouse: "Central Warehouse", toWarehouse: "East Warehouse", productId: "p_1005", productName: "Stainless Steel Bottle 750ml", sku: "PRD-1005", quantity: 30, transferDate: "2026-05-08", expectedArrivalDate: "2026-05-12", status: "Draft", remarks: "Pending approval", createdAt: "2026-05-06" },
    ],
    adjustments: [
        { id: "adj_001", adjustmentNumber: "ADJ-411", productId: "p_1003", productName: "Wireless Mouse", sku: "PRD-1003", warehouse: "North Warehouse", currentQuantity: 68, adjustedQuantity: 64, adjustmentType: "Damage Write-Off", reason: "Water damage during transit", approvedBy: "Anita Verma", adjustmentDate: "2026-05-03", remarks: "4 units damaged", createdAt: "2026-05-03" },
        { id: "adj_002", adjustmentNumber: "ADJ-410", productId: "p_1001", productName: "A4 Premium Copier Paper", sku: "PRD-1001", warehouse: "Central Warehouse", currentQuantity: 140, adjustedQuantity: 142, adjustmentType: "Correction", reason: "Audit reconciliation", approvedBy: "Rohit Sharma", adjustmentDate: "2026-04-30", remarks: "Counted 2 missed units", createdAt: "2026-04-30" },
    ],

    addBin: (b) => set((s) => ({ bins: [{ id: id("b"), ...b }, ...s.bins] })),
    updateBin: (id, p) => set((s) => ({ bins: s.bins.map((b) => (b.id === id ? { ...b, ...p } : b)) })),
    deleteBin: (id) => set((s) => ({ bins: s.bins.filter((b) => b.id !== id) })),

    addTransfer: (t) => set((s) => ({ transfers: [{ id: id("tr"), createdAt: today(), ...t }, ...s.transfers] })),
    updateTransfer: (id, p) => set((s) => ({ transfers: s.transfers.map((b) => (b.id === id ? { ...b, ...p } : b)) })),
    deleteTransfer: (id) => set((s) => ({ transfers: s.transfers.filter((b) => b.id !== id) })),

    addAdjustment: (a) => set((s) => ({ adjustments: [{ id: id("adj"), createdAt: today(), ...a }, ...s.adjustments] })),
    updateAdjustment: (id, p) => set((s) => ({ adjustments: s.adjustments.map((b) => (b.id === id ? { ...b, ...p } : b)) })),
    deleteAdjustment: (id) => set((s) => ({ adjustments: s.adjustments.filter((b) => b.id !== id) })),
}))

export const BIN_STATUSES: BinStatus[] = ["Available", "Occupied", "Reserved", "Damaged", "Inactive"]
export const TRANSFER_STATUSES: TransferStatus[] = ["Draft", "Approved", "In Transit", "Received", "Cancelled"]
export const ADJUSTMENT_TYPES: AdjustmentType[] = ["Increase Stock", "Decrease Stock", "Correction", "Damage Write-Off"]
export const ZONES = ["Zone A", "Zone B", "Zone C", "Zone D", "Zone E"]
