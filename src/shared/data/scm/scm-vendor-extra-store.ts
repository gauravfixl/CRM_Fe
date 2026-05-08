import { create } from "zustand"

export interface ScmVendorCategory {
    id: string
    name: string
    description: string
    vendorCount: number
    status: "Active" | "Inactive"
}

export type ContractStatus = "Active" | "Expiring Soon" | "Expired" | "Terminated"
export interface ScmVendorContract {
    id: string
    contractNumber: string
    vendorId: string
    vendorName: string
    contractStartDate: string
    contractEndDate: string
    contractValue: number
    paymentTerms: string
    renewalReminderDate: string
    status: ContractStatus
    remarks: string
    createdAt: string
}

export type PaymentMethod = "Bank Transfer" | "Cheque" | "UPI" | "Cash" | "Credit Card"
export type PaymentStatus = "Paid" | "Pending" | "Failed" | "Reversed"
export interface ScmVendorPayment {
    id: string
    paymentId: string
    vendorId: string
    vendorName: string
    invoiceNumber: string
    poNumber: string
    amount: number
    paymentDate: string
    paymentMethod: PaymentMethod
    paymentStatus: PaymentStatus
    remarks: string
    createdAt: string
}

interface State {
    categories: ScmVendorCategory[]
    contracts: ScmVendorContract[]
    payments: ScmVendorPayment[]

    addCategory: (c: Omit<ScmVendorCategory, "id">) => void
    updateCategory: (id: string, p: Partial<ScmVendorCategory>) => void
    deleteCategory: (id: string) => void

    addContract: (c: Omit<ScmVendorContract, "id" | "createdAt">) => void
    updateContract: (id: string, p: Partial<ScmVendorContract>) => void
    deleteContract: (id: string) => void

    addPayment: (p: Omit<ScmVendorPayment, "id" | "createdAt">) => void
    updatePayment: (id: string, p: Partial<ScmVendorPayment>) => void
    deletePayment: (id: string) => void
}

const today = () => new Date().toISOString().slice(0, 10)
const id = (prefix: string) => `${prefix}_` + Math.random().toString(36).slice(2, 10)

export const useScmVendorExtraStore = create<State>((set) => ({
    categories: [
        { id: "vc_01", name: "Raw Material Supplier", description: "Suppliers of input materials", vendorCount: 12, status: "Active" },
        { id: "vc_02", name: "Packaging Supplier", description: "Cartons, wraps, labels", vendorCount: 6, status: "Active" },
        { id: "vc_03", name: "Transport Vendor", description: "Logistics and transport providers", vendorCount: 8, status: "Active" },
        { id: "vc_04", name: "Technology Vendor", description: "Hardware and software suppliers", vendorCount: 4, status: "Active" },
        { id: "vc_05", name: "Maintenance Vendor", description: "Facility and equipment maintenance", vendorCount: 3, status: "Active" },
        { id: "vc_06", name: "Service Provider", description: "Consulting and other services", vendorCount: 5, status: "Inactive" },
    ],
    contracts: [
        { id: "vct_01", contractNumber: "VC-2024-101", vendorId: "v_001", vendorName: "PaperCo Industries", contractStartDate: "2026-01-01", contractEndDate: "2026-12-31", contractValue: 1200000, paymentTerms: "Net 30", renewalReminderDate: "2026-11-01", status: "Active", remarks: "Annual stationery supply", createdAt: "2026-01-01" },
        { id: "vct_02", contractNumber: "VC-2024-102", vendorId: "v_002", vendorName: "ClickPro Devices", contractStartDate: "2025-12-01", contractEndDate: "2026-05-31", contractValue: 480000, paymentTerms: "Net 45", renewalReminderDate: "2026-05-01", status: "Expiring Soon", remarks: "Hardware supply contract", createdAt: "2025-12-01" },
        { id: "vct_03", contractNumber: "VC-2023-099", vendorId: "v_003", vendorName: "BoxIt Pvt Ltd", contractStartDate: "2025-04-01", contractEndDate: "2026-03-31", contractValue: 720000, paymentTerms: "Net 15", renewalReminderDate: "2026-03-01", status: "Expired", remarks: "Awaiting renewal", createdAt: "2025-04-01" },
    ],
    payments: [
        { id: "vp_01", paymentId: "PAY-7821", vendorId: "v_001", vendorName: "PaperCo Industries", invoiceNumber: "INV-PC-1023", poNumber: "PO-2087", amount: 124500, paymentDate: "2026-04-30", paymentMethod: "Bank Transfer", paymentStatus: "Paid", remarks: "Quarterly payment", createdAt: "2026-04-30" },
        { id: "vp_02", paymentId: "PAY-7820", vendorId: "v_003", vendorName: "BoxIt Pvt Ltd", invoiceNumber: "INV-BX-0451", poNumber: "PO-2085", amount: 38940, paymentDate: "2026-04-22", paymentMethod: "UPI", paymentStatus: "Paid", remarks: "", createdAt: "2026-04-22" },
        { id: "vp_03", paymentId: "PAY-7819", vendorId: "v_002", vendorName: "ClickPro Devices", invoiceNumber: "INV-CP-0833", poNumber: "PO-2086", amount: 21920, paymentDate: "2026-05-10", paymentMethod: "Bank Transfer", paymentStatus: "Pending", remarks: "Awaiting clearance", createdAt: "2026-05-04" },
        { id: "vp_04", paymentId: "PAY-7818", vendorId: "v_004", vendorName: "HydroX Manufacturing", invoiceNumber: "INV-HX-2210", poNumber: "PO-2080", amount: 87600, paymentDate: "2026-04-15", paymentMethod: "Cheque", paymentStatus: "Paid", remarks: "Cheque cleared", createdAt: "2026-04-15" },
    ],

    addCategory: (c) => set((s) => ({ categories: [{ id: id("vc"), ...c }, ...s.categories] })),
    updateCategory: (id, p) => set((s) => ({ categories: s.categories.map((c) => (c.id === id ? { ...c, ...p } : c)) })),
    deleteCategory: (id) => set((s) => ({ categories: s.categories.filter((c) => c.id !== id) })),

    addContract: (c) => set((s) => ({ contracts: [{ id: id("vct"), createdAt: today(), ...c }, ...s.contracts] })),
    updateContract: (id, p) => set((s) => ({ contracts: s.contracts.map((c) => (c.id === id ? { ...c, ...p } : c)) })),
    deleteContract: (id) => set((s) => ({ contracts: s.contracts.filter((c) => c.id !== id) })),

    addPayment: (p) => set((s) => ({ payments: [{ id: id("vp"), createdAt: today(), ...p }, ...s.payments] })),
    updatePayment: (id, p) => set((s) => ({ payments: s.payments.map((c) => (c.id === id ? { ...c, ...p } : c)) })),
    deletePayment: (id) => set((s) => ({ payments: s.payments.filter((c) => c.id !== id) })),
}))

export const CONTRACT_STATUSES: ContractStatus[] = ["Active", "Expiring Soon", "Expired", "Terminated"]
export const PAYMENT_METHODS: PaymentMethod[] = ["Bank Transfer", "Cheque", "UPI", "Cash", "Credit Card"]
export const PAYMENT_STATUSES: PaymentStatus[] = ["Paid", "Pending", "Failed", "Reversed"]
