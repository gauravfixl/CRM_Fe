import { create } from "zustand"

export type POStatus = "Draft" | "Pending" | "Approved" | "Rejected" | "Cancelled" | "Completed"
export type POPaymentStatus = "Unpaid" | "Partial" | "Paid"
export type PODeliveryStatus = "Pending" | "In Transit" | "Delivered" | "Delayed"

export interface POLineItem {
    productId: string
    productName: string
    sku: string
    quantity: number
    unitPrice: number
    taxRate: number
}

export interface ScmPurchaseOrder {
    id: string
    poNumber: string
    vendorId: string
    vendorName: string
    warehouse: string
    orderDate: string
    expectedDelivery: string
    items: POLineItem[]
    subtotal: number
    taxAmount: number
    discount: number
    totalAmount: number
    paymentTerms: string
    shippingTerms: string
    status: POStatus
    paymentStatus: POPaymentStatus
    deliveryStatus: PODeliveryStatus
    remarks: string
    createdAt: string
}

interface State {
    purchaseOrders: ScmPurchaseOrder[]
    addPO: (po: Omit<ScmPurchaseOrder, "id" | "createdAt">) => ScmPurchaseOrder
    updatePO: (id: string, patch: Partial<ScmPurchaseOrder>) => void
    deletePO: (id: string) => void
}

const today = () => new Date().toISOString().slice(0, 10)
const nextId = () => "po_" + Math.random().toString(36).slice(2, 10)

const seed: ScmPurchaseOrder[] = [
    {
        id: "po_001",
        poNumber: "PO-2087",
        vendorId: "v_001",
        vendorName: "PaperCo Industries",
        warehouse: "Central Warehouse",
        orderDate: "2026-04-25",
        expectedDelivery: "2026-05-05",
        items: [
            { productId: "p_1001", productName: "A4 Premium Copier Paper", sku: "PRD-1001", quantity: 100, unitPrice: 220, taxRate: 12 },
        ],
        subtotal: 22000,
        taxAmount: 2640,
        discount: 0,
        totalAmount: 24640,
        paymentTerms: "Net 30",
        shippingTerms: "FOB Warehouse",
        status: "Approved",
        paymentStatus: "Unpaid",
        deliveryStatus: "Delivered",
        remarks: "Quarterly restock",
        createdAt: "2026-04-25",
    },
    {
        id: "po_002",
        poNumber: "PO-2086",
        vendorId: "v_002",
        vendorName: "ClickPro Devices",
        warehouse: "North Warehouse",
        orderDate: "2026-04-20",
        expectedDelivery: "2026-05-08",
        items: [
            { productId: "p_1003", productName: "Wireless Mouse", sku: "PRD-1003", quantity: 50, unitPrice: 380, taxRate: 18 },
        ],
        subtotal: 19000,
        taxAmount: 3420,
        discount: 500,
        totalAmount: 21920,
        paymentTerms: "Net 45",
        shippingTerms: "CIF",
        status: "Pending",
        paymentStatus: "Unpaid",
        deliveryStatus: "Pending",
        remarks: "",
        createdAt: "2026-04-20",
    },
    {
        id: "po_003",
        poNumber: "PO-2085",
        vendorId: "v_003",
        vendorName: "BoxIt Pvt Ltd",
        warehouse: "South Warehouse",
        orderDate: "2026-04-18",
        expectedDelivery: "2026-04-30",
        items: [
            { productId: "p_1004", productName: "Cardboard Carton 12x10x8", sku: "PRD-1004", quantity: 1500, unitPrice: 22, taxRate: 18 },
        ],
        subtotal: 33000,
        taxAmount: 5940,
        discount: 0,
        totalAmount: 38940,
        paymentTerms: "Net 15",
        shippingTerms: "FOB Origin",
        status: "Approved",
        paymentStatus: "Paid",
        deliveryStatus: "Delivered",
        remarks: "Bulk packaging order",
        createdAt: "2026-04-18",
    },
    {
        id: "po_004",
        poNumber: "PO-2084",
        vendorId: "v_004",
        vendorName: "HydroX Manufacturing",
        warehouse: "Central Warehouse",
        orderDate: "2026-04-10",
        expectedDelivery: "2026-04-28",
        items: [
            { productId: "p_1005", productName: "Stainless Steel Bottle 750ml", sku: "PRD-1005", quantity: 200, unitPrice: 240, taxRate: 18 },
        ],
        subtotal: 48000,
        taxAmount: 8640,
        discount: 1500,
        totalAmount: 55140,
        paymentTerms: "Net 60",
        shippingTerms: "FOB Origin",
        status: "Rejected",
        paymentStatus: "Unpaid",
        deliveryStatus: "Pending",
        remarks: "Vendor pricing under review",
        createdAt: "2026-04-10",
    },
]

export const useScmPurchaseOrdersStore = create<State>((set) => ({
    purchaseOrders: seed,
    addPO: (po) => {
        const order: ScmPurchaseOrder = { id: nextId(), createdAt: today(), ...po }
        set((s) => ({ purchaseOrders: [order, ...s.purchaseOrders] }))
        return order
    },
    updatePO: (id, patch) => set((s) => ({
        purchaseOrders: s.purchaseOrders.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    })),
    deletePO: (id) => set((s) => ({
        purchaseOrders: s.purchaseOrders.filter((p) => p.id !== id),
    })),
}))

export const PO_STATUSES: POStatus[] = ["Draft", "Pending", "Approved", "Rejected", "Cancelled", "Completed"]
export const PO_PAYMENT_STATUSES: POPaymentStatus[] = ["Unpaid", "Partial", "Paid"]
export const PO_DELIVERY_STATUSES: PODeliveryStatus[] = ["Pending", "In Transit", "Delivered", "Delayed"]
export const SHIPPING_TERMS = ["FOB Origin", "FOB Destination", "FOB Warehouse", "CIF", "Ex Works", "DDP"]
