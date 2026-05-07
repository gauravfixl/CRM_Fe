import { create } from "zustand"

// Purchase Requests
export type PRStatus = "Draft" | "Submitted" | "Approved" | "Rejected" | "Converted to PO"
export type PRPriority = "Low" | "Medium" | "High" | "Urgent"

export interface ScmPurchaseRequest {
    id: string
    requestNumber: string
    requestedBy: string
    department: string
    productId: string
    productName: string
    sku: string
    quantity: number
    requiredDate: string
    priority: PRPriority
    status: PRStatus
    remarks: string
    createdAt: string
}

// Vendor Quotations
export type QuotationStatus = "Pending" | "Approved" | "Rejected" | "Converted to PO" | "Expired"
export interface ScmQuotation {
    id: string
    quotationId: string
    vendorId: string
    vendorName: string
    productId: string
    productName: string
    sku: string
    quantity: number
    quotedPrice: number
    deliveryTime: string
    validityDate: string
    status: QuotationStatus
    remarks: string
    createdAt: string
}

// Goods Received Notes
export type GRNQualityStatus = "Pending" | "Passed" | "Failed" | "Partial"
export interface ScmGRN {
    id: string
    grnNumber: string
    poNumber: string
    vendorName: string
    warehouse: string
    receivedDate: string
    expectedQuantity: number
    receivedQuantity: number
    rejectedQuantity: number
    qualityStatus: GRNQualityStatus
    remarks: string
    createdAt: string
}

// Purchase Returns
export type PurchaseReturnStatus = "Pending" | "Approved" | "Returned" | "Refunded" | "Replaced" | "Rejected"
export type RefundType = "Refund" | "Replacement" | "Credit Note"
export interface ScmPurchaseReturn {
    id: string
    returnNumber: string
    poNumber: string
    vendorName: string
    productId: string
    productName: string
    sku: string
    quantityReturned: number
    reason: string
    refundType: RefundType
    returnDate: string
    status: PurchaseReturnStatus
    remarks: string
    createdAt: string
}

interface State {
    purchaseRequests: ScmPurchaseRequest[]
    quotations: ScmQuotation[]
    grns: ScmGRN[]
    purchaseReturns: ScmPurchaseReturn[]

    addPR: (p: Omit<ScmPurchaseRequest, "id" | "createdAt">) => void
    updatePR: (id: string, p: Partial<ScmPurchaseRequest>) => void
    deletePR: (id: string) => void

    addQuotation: (q: Omit<ScmQuotation, "id" | "createdAt">) => void
    updateQuotation: (id: string, p: Partial<ScmQuotation>) => void
    deleteQuotation: (id: string) => void

    addGRN: (g: Omit<ScmGRN, "id" | "createdAt">) => void
    updateGRN: (id: string, p: Partial<ScmGRN>) => void
    deleteGRN: (id: string) => void

    addPurchaseReturn: (r: Omit<ScmPurchaseReturn, "id" | "createdAt">) => void
    updatePurchaseReturn: (id: string, p: Partial<ScmPurchaseReturn>) => void
    deletePurchaseReturn: (id: string) => void
}

const today = () => new Date().toISOString().slice(0, 10)
const id = (prefix: string) => `${prefix}_` + Math.random().toString(36).slice(2, 10)

export const useScmProcurementExtraStore = create<State>((set) => ({
    purchaseRequests: [
        { id: "pr_001", requestNumber: "PR-1042", requestedBy: "Anita Sharma", department: "Operations", productId: "p_1001", productName: "A4 Premium Copier Paper", sku: "PRD-1001", quantity: 50, requiredDate: "2026-05-15", priority: "High", status: "Submitted", remarks: "Q2 stationery refill", createdAt: "2026-05-04" },
        { id: "pr_002", requestNumber: "PR-1041", requestedBy: "Vikram Joshi", department: "IT", productId: "p_1003", productName: "Wireless Mouse", sku: "PRD-1003", quantity: 25, requiredDate: "2026-05-12", priority: "Medium", status: "Approved", remarks: "Onboarding kits", createdAt: "2026-05-02" },
        { id: "pr_003", requestNumber: "PR-1040", requestedBy: "Neha Iyer", department: "Marketing", productId: "p_1005", productName: "Stainless Steel Bottle 750ml", sku: "PRD-1005", quantity: 100, requiredDate: "2026-05-20", priority: "Urgent", status: "Submitted", remarks: "Brand giveaway campaign", createdAt: "2026-05-05" },
        { id: "pr_004", requestNumber: "PR-1039", requestedBy: "Ravi Kumar", department: "Logistics", productId: "p_1004", productName: "Cardboard Carton 12x10x8", sku: "PRD-1004", quantity: 500, requiredDate: "2026-05-10", priority: "Medium", status: "Rejected", remarks: "Existing stock sufficient", createdAt: "2026-04-30" },
    ],
    quotations: [
        { id: "q_001", quotationId: "QT-2201", vendorId: "v_001", vendorName: "PaperCo Industries", productId: "p_1001", productName: "A4 Premium Copier Paper", sku: "PRD-1001", quantity: 100, quotedPrice: 215, deliveryTime: "5 days", validityDate: "2026-05-30", status: "Pending", remarks: "Bulk discount applied", createdAt: "2026-05-01" },
        { id: "q_002", quotationId: "QT-2200", vendorId: "v_002", vendorName: "ClickPro Devices", productId: "p_1003", productName: "Wireless Mouse", sku: "PRD-1003", quantity: 50, quotedPrice: 365, deliveryTime: "7 days", validityDate: "2026-05-25", status: "Approved", remarks: "", createdAt: "2026-04-29" },
        { id: "q_003", quotationId: "QT-2199", vendorId: "v_003", vendorName: "BoxIt Pvt Ltd", productId: "p_1004", productName: "Cardboard Carton 12x10x8", sku: "PRD-1004", quantity: 1500, quotedPrice: 21, deliveryTime: "3 days", validityDate: "2026-05-15", status: "Converted to PO", remarks: "PO-2085", createdAt: "2026-04-25" },
    ],
    grns: [
        { id: "grn_001", grnNumber: "GRN-5031", poNumber: "PO-2087", vendorName: "PaperCo Industries", warehouse: "Central Warehouse", receivedDate: "2026-04-28", expectedQuantity: 100, receivedQuantity: 100, rejectedQuantity: 0, qualityStatus: "Passed", remarks: "All packs in good condition", createdAt: "2026-04-28" },
        { id: "grn_002", grnNumber: "GRN-5030", poNumber: "PO-2085", vendorName: "BoxIt Pvt Ltd", warehouse: "South Warehouse", receivedDate: "2026-04-26", expectedQuantity: 1500, receivedQuantity: 1480, rejectedQuantity: 20, qualityStatus: "Partial", remarks: "20 cartons crushed in transit", createdAt: "2026-04-26" },
    ],
    purchaseReturns: [
        { id: "pret_001", returnNumber: "PRET-301", poNumber: "PO-2085", vendorName: "BoxIt Pvt Ltd", productId: "p_1004", productName: "Cardboard Carton 12x10x8", sku: "PRD-1004", quantityReturned: 20, reason: "Damaged in transit", refundType: "Replacement", returnDate: "2026-04-28", status: "Approved", remarks: "Awaiting replacement shipment", createdAt: "2026-04-28" },
    ],

    addPR: (p) => set((s) => ({ purchaseRequests: [{ id: id("pr"), createdAt: today(), ...p }, ...s.purchaseRequests] })),
    updatePR: (id, p) => set((s) => ({ purchaseRequests: s.purchaseRequests.map((r) => (r.id === id ? { ...r, ...p } : r)) })),
    deletePR: (id) => set((s) => ({ purchaseRequests: s.purchaseRequests.filter((r) => r.id !== id) })),

    addQuotation: (q) => set((s) => ({ quotations: [{ id: id("q"), createdAt: today(), ...q }, ...s.quotations] })),
    updateQuotation: (id, p) => set((s) => ({ quotations: s.quotations.map((r) => (r.id === id ? { ...r, ...p } : r)) })),
    deleteQuotation: (id) => set((s) => ({ quotations: s.quotations.filter((r) => r.id !== id) })),

    addGRN: (g) => set((s) => ({ grns: [{ id: id("grn"), createdAt: today(), ...g }, ...s.grns] })),
    updateGRN: (id, p) => set((s) => ({ grns: s.grns.map((r) => (r.id === id ? { ...r, ...p } : r)) })),
    deleteGRN: (id) => set((s) => ({ grns: s.grns.filter((r) => r.id !== id) })),

    addPurchaseReturn: (r) => set((s) => ({ purchaseReturns: [{ id: id("pret"), createdAt: today(), ...r }, ...s.purchaseReturns] })),
    updatePurchaseReturn: (id, p) => set((s) => ({ purchaseReturns: s.purchaseReturns.map((r) => (r.id === id ? { ...r, ...p } : r)) })),
    deletePurchaseReturn: (id) => set((s) => ({ purchaseReturns: s.purchaseReturns.filter((r) => r.id !== id) })),
}))

export const PR_STATUSES: PRStatus[] = ["Draft", "Submitted", "Approved", "Rejected", "Converted to PO"]
export const PR_PRIORITIES: PRPriority[] = ["Low", "Medium", "High", "Urgent"]
export const QUOTATION_STATUSES: QuotationStatus[] = ["Pending", "Approved", "Rejected", "Converted to PO", "Expired"]
export const GRN_QUALITY_STATUSES: GRNQualityStatus[] = ["Pending", "Passed", "Failed", "Partial"]
export const PURCHASE_RETURN_STATUSES: PurchaseReturnStatus[] = ["Pending", "Approved", "Returned", "Refunded", "Replaced", "Rejected"]
export const REFUND_TYPES: RefundType[] = ["Refund", "Replacement", "Credit Note"]
export const DEPARTMENTS = ["Operations", "IT", "Marketing", "Logistics", "HR", "Finance", "Sales", "Procurement"]
