import { create } from "zustand"

export type SOStatus = "Draft" | "Confirmed" | "Cancelled"
export type SOPaymentStatus = "Unpaid" | "Partial" | "Paid"
export type SOFulfillmentStatus =
    | "Pending"
    | "Awaiting Stock"
    | "Picked"
    | "Packed"
    | "Shipped"
    | "Delivered"
    | "Returned"

export interface SOLineItem {
    productId: string
    productName: string
    sku: string
    quantity: number
    unitPrice: number
    taxRate: number
}

export interface ScmSalesOrder {
    id: string
    orderNumber: string
    customerName: string
    customerEmail: string
    customerPhone: string
    customerAddress: string
    warehouse: string
    orderDate: string
    items: SOLineItem[]
    subtotal: number
    taxAmount: number
    discount: number
    totalAmount: number
    status: SOStatus
    paymentStatus: SOPaymentStatus
    fulfillmentStatus: SOFulfillmentStatus
    remarks: string
    createdAt: string
}

interface State {
    salesOrders: ScmSalesOrder[]
    addSO: (so: Omit<ScmSalesOrder, "id" | "createdAt">) => ScmSalesOrder
    updateSO: (id: string, patch: Partial<ScmSalesOrder>) => void
    deleteSO: (id: string) => void
}

const today = () => new Date().toISOString().slice(0, 10)
const nextId = () => "so_" + Math.random().toString(36).slice(2, 10)

const seed: ScmSalesOrder[] = [
    {
        id: "so_001",
        orderNumber: "SO-3082",
        customerName: "Acme Corp",
        customerEmail: "ops@acmecorp.com",
        customerPhone: "+919811112233",
        customerAddress: "Plot 22, BKC Mumbai 400051",
        warehouse: "Central Warehouse",
        orderDate: "2026-05-02",
        items: [
            { productId: "p_1002", productName: "Ballpoint Pen Blue", sku: "PRD-1002", quantity: 12, unitPrice: 160, taxRate: 12 },
        ],
        subtotal: 1920,
        taxAmount: 230.4,
        discount: 0,
        totalAmount: 2150.4,
        status: "Confirmed",
        paymentStatus: "Paid",
        fulfillmentStatus: "Shipped",
        remarks: "Express handling requested",
        createdAt: "2026-05-02",
    },
    {
        id: "so_002",
        orderNumber: "SO-3081",
        customerName: "BlueWave Ltd",
        customerEmail: "purchasing@bluewave.in",
        customerPhone: "+919822233344",
        customerAddress: "Sector 5, Salt Lake Kolkata 700091",
        warehouse: "East Warehouse",
        orderDate: "2026-05-01",
        items: [
            { productId: "p_1005", productName: "Stainless Steel Bottle 750ml", sku: "PRD-1005", quantity: 30, unitPrice: 449, taxRate: 18 },
        ],
        subtotal: 13470,
        taxAmount: 2424.6,
        discount: 200,
        totalAmount: 15694.6,
        status: "Confirmed",
        paymentStatus: "Partial",
        fulfillmentStatus: "Packed",
        remarks: "",
        createdAt: "2026-05-01",
    },
    {
        id: "so_003",
        orderNumber: "SO-3080",
        customerName: "Tech Innovate",
        customerEmail: "buyer@techinnovate.io",
        customerPhone: "+919833344455",
        customerAddress: "Tower A, Cyber Hub Gurugram 122002",
        warehouse: "North Warehouse",
        orderDate: "2026-04-28",
        items: [
            { productId: "p_1003", productName: "Wireless Mouse", sku: "PRD-1003", quantity: 50, unitPrice: 599, taxRate: 18 },
        ],
        subtotal: 29950,
        taxAmount: 5391,
        discount: 1000,
        totalAmount: 34341,
        status: "Confirmed",
        paymentStatus: "Unpaid",
        fulfillmentStatus: "Awaiting Stock",
        remarks: "Awaiting inventory replenishment",
        createdAt: "2026-04-28",
    },
    {
        id: "so_004",
        orderNumber: "SO-3079",
        customerName: "GreenFields Co.",
        customerEmail: "team@greenfields.co",
        customerPhone: "+919844455566",
        customerAddress: "Industrial Area Phase 2 Chandigarh 160002",
        warehouse: "Central Warehouse",
        orderDate: "2026-04-26",
        items: [
            { productId: "p_1001", productName: "A4 Premium Copier Paper", sku: "PRD-1001", quantity: 20, unitPrice: 280, taxRate: 12 },
        ],
        subtotal: 5600,
        taxAmount: 672,
        discount: 0,
        totalAmount: 6272,
        status: "Draft",
        paymentStatus: "Unpaid",
        fulfillmentStatus: "Pending",
        remarks: "",
        createdAt: "2026-04-26",
    },
]

export const useScmSalesOrdersStore = create<State>((set) => ({
    salesOrders: seed,
    addSO: (so) => {
        const order: ScmSalesOrder = { id: nextId(), createdAt: today(), ...so }
        set((s) => ({ salesOrders: [order, ...s.salesOrders] }))
        return order
    },
    updateSO: (id, patch) => set((s) => ({
        salesOrders: s.salesOrders.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    })),
    deleteSO: (id) => set((s) => ({ salesOrders: s.salesOrders.filter((p) => p.id !== id) })),
}))

export const SO_STATUSES: SOStatus[] = ["Draft", "Confirmed", "Cancelled"]
export const SO_PAYMENT_STATUSES: SOPaymentStatus[] = ["Unpaid", "Partial", "Paid"]
export const SO_FULFILLMENT_STATUSES: SOFulfillmentStatus[] = [
    "Pending", "Awaiting Stock", "Picked", "Packed", "Shipped", "Delivered", "Returned",
]
