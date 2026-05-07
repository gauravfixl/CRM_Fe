import { create } from "zustand"
import { useScmProductsStore } from "./scm-products-store"

export type MovementDirection = "in" | "out"

export type StockOutReason =
    | "Sales Order"
    | "Warehouse Transfer"
    | "Damaged Goods"
    | "Internal Use"
    | "Return to Supplier"
    | "Manual Adjustment"

export interface ScmStockMovement {
    id: string
    direction: MovementDirection
    productId: string
    productName: string
    sku: string
    warehouse: string
    quantity: number
    unitCost?: number
    supplier?: string
    poNumber?: string
    batchNumber?: string
    expiryDate?: string
    reason?: StockOutReason
    referenceNumber?: string
    issuedTo?: string
    movementDate: string
    remarks?: string
    createdAt: string
}

interface State {
    movements: ScmStockMovement[]
    addStockIn: (m: Omit<ScmStockMovement, "id" | "createdAt" | "direction">) => void
    addStockOut: (m: Omit<ScmStockMovement, "id" | "createdAt" | "direction">) => void
    deleteMovement: (id: string) => void
}

const today = () => new Date().toISOString().slice(0, 10)
const nextId = () => "sm_" + Math.random().toString(36).slice(2, 10)

const seed: ScmStockMovement[] = [
    {
        id: "sm_001",
        direction: "in",
        productId: "p_1001",
        productName: "A4 Premium Copier Paper",
        sku: "PRD-1001",
        warehouse: "Central Warehouse",
        quantity: 50,
        unitCost: 220,
        supplier: "PaperCo Industries",
        poNumber: "PO-2087",
        batchNumber: "B-A4-2604",
        expiryDate: "2028-12-31",
        movementDate: "2026-04-28",
        remarks: "Quarterly restock",
        createdAt: "2026-04-28",
    },
    {
        id: "sm_002",
        direction: "out",
        productId: "p_1002",
        productName: "Ballpoint Pen Blue",
        sku: "PRD-1002",
        warehouse: "Central Warehouse",
        quantity: 12,
        reason: "Sales Order",
        referenceNumber: "SO-3082",
        issuedTo: "Acme Corp",
        movementDate: "2026-05-02",
        remarks: "Order #SO-3082",
        createdAt: "2026-05-02",
    },
    {
        id: "sm_003",
        direction: "in",
        productId: "p_1003",
        productName: "Wireless Mouse",
        sku: "PRD-1003",
        warehouse: "North Warehouse",
        quantity: 30,
        unitCost: 380,
        supplier: "ClickPro Devices",
        poNumber: "PO-2086",
        movementDate: "2026-05-01",
        remarks: "",
        createdAt: "2026-05-01",
    },
    {
        id: "sm_004",
        direction: "out",
        productId: "p_1003",
        productName: "Wireless Mouse",
        sku: "PRD-1003",
        warehouse: "North Warehouse",
        quantity: 4,
        reason: "Damaged Goods",
        referenceNumber: "ADJ-411",
        movementDate: "2026-05-03",
        remarks: "Water damage during transit",
        createdAt: "2026-05-03",
    },
]

export const useScmStockMovementsStore = create<State>((set) => ({
    movements: seed,
    addStockIn: (m) => {
        const movement: ScmStockMovement = {
            id: nextId(),
            direction: "in",
            createdAt: today(),
            ...m,
        }
        set((s) => ({ movements: [movement, ...s.movements] }))
        // sync product current stock
        const productsApi = useScmProductsStore.getState()
        const product = productsApi.products.find((p) => p.id === m.productId)
        if (product) {
            productsApi.updateProduct(product.id, {
                currentStock: product.currentStock + m.quantity,
            })
        }
    },
    addStockOut: (m) => {
        const movement: ScmStockMovement = {
            id: nextId(),
            direction: "out",
            createdAt: today(),
            ...m,
        }
        set((s) => ({ movements: [movement, ...s.movements] }))
        const productsApi = useScmProductsStore.getState()
        const product = productsApi.products.find((p) => p.id === m.productId)
        if (product) {
            productsApi.updateProduct(product.id, {
                currentStock: Math.max(0, product.currentStock - m.quantity),
            })
        }
    },
    deleteMovement: (id) =>
        set((s) => ({ movements: s.movements.filter((m) => m.id !== id) })),
}))

export const STOCK_OUT_REASONS: StockOutReason[] = [
    "Sales Order",
    "Warehouse Transfer",
    "Damaged Goods",
    "Internal Use",
    "Return to Supplier",
    "Manual Adjustment",
]
